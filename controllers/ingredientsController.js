const { getDb } = require("../data/database");
const { ObjectId } = require("mongodb");
const { validateIngredient } = require("../models/ingredientModel");

const getAllIngredients = async (req, res) => {
  // #swagger.tags = ['Ingredients']
  // #swagger.summary = 'Get all ingredients'
  try {
    const db = getDb().db("RecipesBook");
    const ingredients = await db.collection("ingredients").find().toArray();
    res.status(200).json(ingredients);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to retrieve ingredients", details: err.message });
  }
};

const getIngredientById = async (req, res) => {
  // #swagger.tags = ['Ingredients']
  // #swagger.summary = 'Get an ingredient by ID'
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid ingredient ID format" });
    }
    const db = getDb().db("RecipesBook");
    const ingredient = await db
      .collection("ingredients")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!ingredient) {
      return res.status(404).json({ error: "Ingredient not found" });
    }
    res.status(200).json(ingredient);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to retrieve ingredient", details: err.message });
  }
};

const createIngredient = async (req, res) => {
  // #swagger.tags = ['Ingredients']
  // #swagger.summary = 'Create a new ingredient'
  /* #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      name: 'Parmesan Cheese',
      unit: 'grams',
      calories: 431
    }
  } */
  try {
    const errors = validateIngredient(req.body);
    if (errors.length > 0) {
      return res
        .status(400)
        .json({ error: "Validation failed", details: errors });
    }
    const { name, unit, calories } = req.body;
    const db = getDb().db("RecipesBook");
    const result = await db.collection("ingredients").insertOne({
      name,
      unit: unit || "",
      calories: calories ?? null,
      createdAt: new Date(),
    });
    res.status(201).json({ _id: result.insertedId, name, unit, calories });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ error: "An ingredient with that name already exists" });
    }
    res
      .status(500)
      .json({ error: "Failed to create ingredient", details: err.message });
  }
};

const updateIngredient = async (req, res) => {
  // #swagger.tags = ['Ingredients']
  // #swagger.summary = 'Update an ingredient by ID'
  /* #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      name: 'Eggs',
      unit: 'units',
      calories: 80
    }
  } */
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid ingredient ID format" });
    }
    if (Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ error: "At least one field is required to update" });
    }
    const errors = validateIngredient(req.body);
    if (errors.length > 0) {
      return res
        .status(400)
        .json({ error: "Validation failed", details: errors });
    }
    const db = getDb().db("RecipesBook");
    const result = await db
      .collection("ingredients")
      .findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $set: { ...req.body, updatedAt: new Date() } },
        { returnDocument: "after" },
      );
    if (!result || !result.value) {
      return res.status(404).json({ error: "Ingredient not found" });
    }
    res.status(200).json(result.value);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update ingredient", details: err.message });
  }
};
const deleteIngredient = async (req, res) => {
  // #swagger.tags = ['Ingredients']
  // #swagger.summary = 'Delete an ingredient by ID'
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid ingredient ID format" });
    }
    const db = getDb().db("RecipesBook");
    const result = await db
      .collection("ingredients")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Ingredient not found" });
    }
    res.status(200).json({ message: "Ingredient deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete ingredient", details: err.message });
  }
};

module.exports = {
  getAllIngredients,
  getIngredientById,
  createIngredient,
  updateIngredient,
  deleteIngredient,
};
