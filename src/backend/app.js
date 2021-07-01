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

async function refreshToken(req, res, next) {
  passport.authenticate('refresh', { session: false, }, async (error, token) => {
    if (error || !token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    } 
    try {
      // check if token in cookie is same as one stored in backend
      if (req.cookies?.refresh === await get(token.user.id)) {
        const newToken = jwt.sign({ user: token.user }, jwtSecret, { expiresIn: "1m" });
        res.setHeader("Authorization", `Bearer ${newToken}`)
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
      await refreshToken(req,res,next)
      return;
    } 
    try {
      const user = await db.users.findById(token.user.id)
      req.user = user;
    } catch (err) {
      next(err);
    }
    next()
  })(req, res, next);
}

app.post("/users/login", (req, res, next) => {
  function next(args) {
    console.log(args)
  }

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
          const token = jwt.sign({ user: body}, jwtSecret, { expiresIn: "1m" });
          const refreshToken = jwt.sign({ user: body}, refreshSecret, { expiresIn: "30 days" })
          await set(user.id, refreshToken)

          res.setHeader("Authorization", `Bearer ${token}`)
          res.cookie("refresh", refreshToken, { httpOnly: true, secure: false, maxAge: 30 * 24 * 60 * 60 * 1000 })
          return res.json({ id: user.id, token, refreshToken });
        }
      );
    } catch (error) {
      return next(error)
    }
  }
  )(req, res, next);
});

app.get("/users/logout", (req, res) => {
  res.clearCookie("refresh")
  res.setHeader("Authorization", "")
  req.logOut();
  res.redirect("/")
})

app.post("/users/signup", async (req, res) => db.users.add(req.body));

app.get("/menu/find/:id", async (req, res) => res.json({ items: await db.items.findById(req.params.id) }));

app.get("/menu/all", async (req, res) => res.json({ items: await db.items.all() }));

app.post("/menu/add", authorized, async (req, res) => {
  await db.items.add(req.body)
  res.status(201).json({ message: `Item successfully created` })
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
