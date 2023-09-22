const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller")

router.get("/", usersController.getAllUsers);

router.get("/:userId", usersController.getUser);

router.post("/", usersController.createUser);

router.patch("/:userId", usersController.updateUser);

router.delete("/:userId", usersController.deleteUser);

module.exports = router;