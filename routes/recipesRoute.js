const express = require("express");
const router = express.Router();
const recipesController = require("../controllers/recipesController");
const isAuthenticated = require("../middleware/isAuthenticated");

router.get("/", recipesController.getAllRecipes);
router.get("/:id", recipesController.getRecipeById);
router.post("/", isAuthenticated, recipesController.createRecipe);
router.put("/:id", isAuthenticated, recipesController.updateRecipe);
router.delete("/:id", isAuthenticated, recipesController.deleteRecipe);

module.exports = router;
