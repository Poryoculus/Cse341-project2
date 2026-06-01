const VALID_CATEGORIES = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack",
  "Dessert",
  "Drink",
];

const validateRecipe = (data) => {
  const errors = [];

  if (
    !data.title ||
    typeof data.title !== "string" ||
    data.title.trim() === ""
  ) {
    errors.push("Title is required and must be a string");
  }

  if (
    !data.description ||
    typeof data.description !== "string" ||
    data.description.trim() === ""
  ) {
    errors.push("Description is required and must be a string");
  }

  if (!data.category) {
    errors.push("Category is required");
  } else if (!VALID_CATEGORIES.includes(data.category)) {
    errors.push(`Category must be one of: ${VALID_CATEGORIES.join(", ")}`);
  }

  if (data.prepTimeMinutes === undefined) {
    errors.push("prepTimeMinutes is required");
  } else if (isNaN(data.prepTimeMinutes) || data.prepTimeMinutes < 0) {
    errors.push("prepTimeMinutes must be a positive number");
  }

  if (data.cookTimeMinutes === undefined) {
    errors.push("cookTimeMinutes is required");
  } else if (isNaN(data.cookTimeMinutes) || data.cookTimeMinutes < 0) {
    errors.push("cookTimeMinutes must be a positive number");
  }

  if (!data.servings) {
    errors.push("Servings is required");
  } else if (isNaN(data.servings) || data.servings < 1) {
    errors.push("Servings must be at least 1");
  }

  if (
    !data.instructions ||
    typeof data.instructions !== "string" ||
    data.instructions.trim() === ""
  ) {
    errors.push("Instructions are required and must be a string");
  }

  return errors;
};

module.exports = { validateRecipe, VALID_CATEGORIES };
