const express = require("express");
const cors = require("cors")
const path = require("path")
const passport = require('passport');
const jwt = require('jsonwebtoken')
const cookieParser = require("cookie-parser")
const { port, env, jwtSecret, refreshSecret } = require("./config")
const { db } = require("./db");
const app = express();
const { set, get } = require("./redis");

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}));
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.use(passport.initialize());
app.use(passport.session())
require("./auth/authorize")(passport)

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "../../frontend/build/index.html"))
});

function protectAdmin(admin) {
  return async function (req, res, next) {
      console.log(req.user, 'pa')
    if (admin) {
      if (req.user?.account_type === "admin") {
        next()
      } else {
        res.status(403).json({
          message: "Forbidden"
        })
      }
    }(req, res, next)
  }
}

async function refreshToken(req, res, next) { 
  passport.authenticate('refresh', { session: false, }, async (error, token) => {
    if (error || !token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    } 
    try {
      // check if refresh token in cookie is same as one stored in backend
      if (req.cookies?.refresh === await get(token.user.id)) {
        const body = { id: token.user.id, role: token.user.role };

        // sign two tokens, an access and refresh with different lifetimes
        const newToken = jwt.sign({ user: body }, jwtSecret, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ user: body}, refreshSecret, { expiresIn: "30 days" })
        await set(token.user.id, refreshToken)
        res.setHeader("Authorization", `Bearer ${newToken}`)
        res.clearCookie('refresh')
        res.cookie("refresh", refreshToken, { httpOnly: true, secure: false, maxAge: 30 * 24 * 60 * 60 * 1000 })
      } else {
        throw "Refresh tokens are not the same!"
      }
    } catch (err) {
      next(err);
    }
    next()
  })(req, res, next);
}

function authorized(req, res, next) {
  passport.authenticate('jwt', { session: false, }, async (error, token) => {
    if (error || !token) {
      res.status(403).json({ 
        message: "Forbidden"
      })
    } 
    try {
      const user = await db.users.getAccountInfo(token.user.id)
      req.user = user;
    } catch (err) {
      next(err);
    }
    next()
  })(req, res, next);
  // next()
}

function issueTokens(req, res, next) {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        const error = new Error("An error occurred during authentication");
        return next(error)
      }
      req.login(user, 
        { session: false},
        async (error) => {
          if (error) return next(error);
          const body = { id: user.id, role: user.role };

          // sign two tokens, an access and refresh with different lifetimes
          const token = jwt.sign({ user: body }, jwtSecret, { expiresIn: "15m" });
          const refreshToken = jwt.sign({ user: body}, refreshSecret, { expiresIn: "30 days" })
          await set(user.id, refreshToken)

          res.setHeader("Authorization", `Bearer ${token}`)
          res.cookie("refresh", refreshToken, { httpOnly: true, secure: false, maxAge: 30 * 24 * 60 * 60 * 1000 })
          // don't think we need to return res.json
          // return res.json({ id: user.id, token, refreshToken });
          next()
        }
      );
    } catch (error) {
      return next(error)
    }
  })(req, res, next);
  next()
}

app.post("/users/login", issueTokens, (req, res) => {
  res.redirect("/")
});

app.get("/users/logout", (req, res) => {
  res.clearCookie("refresh")
  res.setHeader("Authorization", "")
  req.logOut();
  res.redirect("/")
})

app.post("/users/signup", async (req, res) => {
  if (db.users.findById(req.body)) {
    res.status(409).json({
      message: "Username already exists!"
    })
  } else {
    db.users.add(req.body)
    res.status(201).json({
      message: "User successfully created!"
    })
  }

});

app.get("/menu/find/:id", async (req, res) => res.json({ items: await db.items.findById(req.params.id) }));

app.get("/menu/all", async (req, res) => res.json({ items: await db.items.all() }));

app.post("/menu/add", [authorized, protectAdmin(true)], async (req, res) => {
  await db.items.add(req.body)
  res.status(201).json({ message: `Item successfully created` })
});

// app.get("/token/refresh", )

// app.get("/token/invalidate", )

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
