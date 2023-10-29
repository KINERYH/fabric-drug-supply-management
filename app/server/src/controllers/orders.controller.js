const ordersService = require("../services/orders.service")
const authMiddleware = require("../middlewares/auth.middleware");
const bcrypt = require("bcrypt");


const getAllOrders = async (req, res) => {
  try{
    const allOrders = await ordersService.getAllOrders(req.currentUser);
    res.status(200).json({
      status: "OK",
      data: allOrders
    });
  } catch(error) {
    res.status(error?.status || 500).json({
      message: "Failed to get orders.",
      error: error?.message || error
    });
  }
};

const getOrder = async (req, res) => {
  try{
    const order = await ordersService.getOrder(req.params.orderId, req.currentUser);
    res.status(200).json({
      message: "Get an existing order: ",
      data: order
    });
  } catch(error){
    res.status(error?.status || 500).json({
      message: "Failed to get order.",
      error: error?.message || error
    });
  }
};

const createOrder = async (req, res) => {
  try{
    const createdOrder = await ordersService.createOrder(req.body, req.currentUser);
    res.status(201).json({
      message: "New order created.",
      data: createdOrder
    });
  } catch(error){
    res.status(error?.status || 500).json({
      message: "Order not created.",
      error: error?.message || error
    });
  }
};

const processOrder = async (req, res) => {
  try{
    const order = await ordersService.processOrder(req.params.orderId, req.currentUser);
    res.status(200).json({
      message: "Process order: ",
      data: order
    });
  } catch(error){
    res.status(error?.status || 500).json({
      message: "Failed to process order.",
      error: error?.message || error
    });
  }
};

const deleteOrder = async (req, res) => {
  const deletedOrder = ordersService.deleteOrder();
  res.json({ message: "Delete an existing order" });
};

module.exports = {
  getAllOrders,
  getOrder,
  createOrder,
  processOrder,
  deleteOrder
};