const { Router } = require("express");
const userController = require("./user.controller");
const router = Router();

// Get all contacts
router.get("/contacts", userController.getAllUsers);
//Get by Id
router.get(
  "/contacts/:id",
  userController.validateGetUserById,
  userController.getUserById
);
// Create contacts
router.post(
  "/contacts",
  userController.validateCreateUser,
  userController.createUser
);

// Delete User
router.delete("/contacts/:id", userController.deleteUser);
// Update user
router.patch(
  "/contacts/:id",
  userController.validateUpdateUser,
  userController.updateUser
);

module.exports = router;
