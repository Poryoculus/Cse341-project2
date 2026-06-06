const express = require("express");
const router = express.Router();
const ingredientsController = require("../controllers/ingredientsController");
const isAuthenticated = require("../middleware/isAuthenticated");

router.get("/", ingredientsController.getAllIngredients);
router.get("/:id", ingredientsController.getIngredientById);
router.post("/", isAuthenticated, ingredientsController.createIngredient);
router.put("/:id", isAuthenticated, ingredientsController.updateIngredient);
router.delete("/:id", isAuthenticated, ingredientsController.deleteIngredient);

module.exports = router;
