const express = require("express");
const router = express.Router();

router.use("/recipes", require("./recipesRoute"));
router.use("/ingredients", require("./ingredientsRoute"));

module.exports = router;
