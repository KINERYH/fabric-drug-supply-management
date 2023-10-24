const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/orders.controller");
const authMiddleware = require("../middlewares/auth.middleware");


router.get("/", authMiddleware.authenticateToken, ordersController.getAllOrders);

router.get("/:orderId", authMiddleware.authenticateToken, ordersController.getOrder);

router.post("/", authMiddleware.authenticateToken, ordersController.createOrder);

router.patch("/:orderId", authMiddleware.authenticateToken, ordersController.processOrder);

router.delete("/:orderId", authMiddleware.authenticateToken, ordersController.deleteOrder);

module.exports = router;