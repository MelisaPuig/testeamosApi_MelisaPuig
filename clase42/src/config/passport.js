const expressSession = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const userDao = require("../persistencia/dao/UserDAO");

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await userDao.login(username, password);
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

passport.serializeUser(function (user, done) {
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const dbUser = await userDao.findById(id);
    return done(null, dbUser);
  } catch (error) {
    return done(error, null);
  }
});

module.exports = passport;
