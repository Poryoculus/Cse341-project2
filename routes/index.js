const express = require("express");
const router = express.Router();
const passport = require("passport");

// Auth routes
router.get(
  "/login",
  passport.authenticate("github", { scope: ["user:email"] }),
);

router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/profile");
  },
);

router.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Not logged in" });
  }
  res.json({
    message: "You are logged in!",
    user: {
      id: req.user.id,
      username: req.user.username,
      displayName: req.user.displayName,
    },
  });
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to logout" });
    }
    res.redirect("/");
  });
});

// API routes
router.use("/recipes", require("./recipesRoute"));
router.use("/ingredients", require("./ingredientsRoute"));

module.exports = router;
