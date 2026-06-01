const { getDb } = require("../data/database");
const { ObjectId } = require("mongodb");
const { validateRecipe } = require("../models/recipeModel");

const getAllRecipes = async (req, res) => {
  // #swagger.tags = ['Recipes']
  // #swagger.summary = 'Get all recipes'
  try {
    const db = getDb().db("RecipesBook");
    const recipes = await db.collection("recipes").find().toArray();
    res.status(200).json(recipes);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to retrieve recipes", details: err.message });
  }
};

const getRecipeById = async (req, res) => {
  // #swagger.tags = ['Recipes']
  // #swagger.summary = 'Get a recipe by ID'
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid recipe ID format" });
    }
    const db = getDb().db("RecipesBook");
    const recipe = await db
      .collection("recipes")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.status(200).json(recipe);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to retrieve recipe", details: err.message });
  }
};

const createRecipe = async (req, res) => {
  // #swagger.tags = ['Recipes']
  // #swagger.summary = 'Create a new recipe'
  /* #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      title: 'Spaghetti Carbonara',
      description: 'A classic Italian pasta dish with eggs and cheese.',
      category: 'Dinner',
      prepTimeMinutes: 10,
      cookTimeMinutes: 20,
      servings: 2,
      instructions: '1. Cook pasta. 2. Fry pancetta. 3. Mix eggs and cheese. 4. Combine all.',
      ingredientIds: []
    }
  } */
  try {
    const errors = validateRecipe(req.body);
    if (errors.length > 0) {
      return res
        .status(400)
        .json({ error: "Validation failed", details: errors });
    }
    const {
      title,
      description,
      category,
      prepTimeMinutes,
      cookTimeMinutes,
      servings,
      instructions,
      ingredientIds,
    } = req.body;
    const db = getDb().db("RecipesBook");
    const result = await db.collection("recipes").insertOne({
      title,
      description,
      category,
      prepTimeMinutes,
      cookTimeMinutes,
      servings,
      instructions,
      ingredientIds: ingredientIds || [],
      createdAt: new Date(),
    });
    res.status(201).json({ _id: result.insertedId, ...req.body });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create recipe", details: err.message });
  }
};

const updateRecipe = async (req, res) => {
  // #swagger.tags = ['Recipes']
  // #swagger.summary = 'Update a recipe by ID'
  /* #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      title: 'Garlic Chicken Stir Fry Updated',
      servings: 4,
      prepTimeMinutes: 15
    }
  } */
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid recipe ID format" });
    }
    if (Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ error: "At least one field is required to update" });
    }
    const errors = validateRecipe(req.body);
    if (errors.length > 0) {
      return res
        .status(400)
        .json({ error: "Validation failed", details: errors });
    }
    const db = getDb().db("RecipesBook");
    const result = await db
      .collection("recipes")
      .findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $set: { ...req.body, updatedAt: new Date() } },
        { returnDocument: "after" },
      );

    if (!result || !result.value) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.status(200).json(result.value);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update recipe", details: err.message });
  }
};

const deleteRecipe = async (req, res) => {
  // #swagger.tags = ['Recipes']
  // #swagger.summary = 'Delete a recipe by ID'
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid recipe ID format" });
    }
    const db = getDb().db("RecipesBook");
    const result = await db
      .collection("recipes")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete recipe", details: err.message });
  }
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
