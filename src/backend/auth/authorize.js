const passport = require('passport');
const localStrategy = require('passport-local').Strategy
const JWTstrategy = require("passport-jwt").Strategy
const { ExtractJwt: ExtractJWT } = require('passport-jwt')
const { db } = require("../db");
const { jwtSecret, refreshSecret } = require("../config")

const cookieExtractor = function(req) {
    let token = null;
    if (req?.cookies) token = req.cookies['refresh'];
    return token;
};

module.exports = function(passport) {
    passport.use('signup', new localStrategy(
        async(username, password, done) => {
            try {
                await db.users.add(username, password)
                return done(null, { message: `${username} successfully created!`});
            } catch (err) {
                return done(err)
            }
        }
    ))

    passport.use('login', new localStrategy({
        usernameField: 'id',
        passwordField: 'password'
    },
    
        async (username, password, done) => {
            const loginObj = { id: username, password: password }
            try {
                const user = await db.users.login(loginObj)
                if (!user) {
                    return done(null, false, { message: "Username or Password is incorrect" });
                }
                return done(null, user, { message: "Logged in Successfully" });
            } catch (err) {
                return done(err);
            }
        }
    ))

    passport.use('jwt', new JWTstrategy(
        {
            secretOrKey: jwtSecret,
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
        },
        (token, done) => {
            return done(null, token)
        }
    ));

    passport.use('refresh', new JWTstrategy(
        {
            secretOrKey: refreshSecret,
            jwtFromRequest: cookieExtractor,
        },
        (token, done) => {
            return done(null, token)
        }
    ));

        passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(async function(id, done) {
        const user = await db.users.getAccountInfo(id)
        done(null, user);
    });
}
