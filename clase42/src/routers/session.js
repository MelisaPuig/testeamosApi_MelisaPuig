const cookieParser = require("cookie-parser");
const express = require("express");

const passport = require("../config/passport");
const sessions = require("../config/sessions");
const userHandler = require("../controlador/userHandler");

const sessionRouter = express.Router();

sessionRouter.use(cookieParser());
sessionRouter.use(express.urlencoded({ extended: true }));
sessionRouter.use(sessions);
sessionRouter.use(passport.initialize());
sessionRouter.use(passport.session());
sessionRouter.get("/register", (req, res) => res.render("register"));
sessionRouter.post("/register", userHandler.handleRegister);
sessionRouter.get("/login", (req, res) => res.render("login"));
sessionRouter.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login-error" }),
  function (req, res) {
    res.redirect("/");
  }
);
sessionRouter.get("/logout", userHandler.handleLogout);
sessionRouter.get("/login", (req, res) => res.render("login"));
sessionRouter.get("*", userHandler.forceLogin);
sessionRouter.use((error, req, res, next) => {
  const errorMessage = error.message;
  res.render("error", { errorMessage });
});

module.exports = sessionRouter;
