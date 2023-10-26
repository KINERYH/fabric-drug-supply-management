const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller")
const authMiddleware = require("../middlewares/auth.middleware");


router.get("/", authMiddleware.authenticateToken, usersController.getAllUsers);

router.get("/:userId", authMiddleware.authenticateToken, usersController.getUser);

router.post("/", usersController.createUser);

router.patch("/:userId", usersController.updateUser);

router.delete("/:userId", usersController.deleteUser);

router.post("/login", usersController.loginUser);

module.exports = router;