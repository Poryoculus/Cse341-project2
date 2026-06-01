const validateIngredient = (data) => {
  const errors = [];

  if (!data.name || typeof data.name !== "string" || data.name.trim() === "") {
    errors.push("Ingredient name is required and must be a string");
  }

  if (data.unit !== undefined && typeof data.unit !== "string") {
    errors.push("Unit must be a string");
  }

  if (data.calories !== undefined && data.calories !== null) {
    if (isNaN(data.calories) || data.calories < 0) {
      errors.push("Calories must be a positive number");
    }
  }

  return errors;
};

module.exports = { validateIngredient };
