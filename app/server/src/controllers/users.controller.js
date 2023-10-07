const usersService = require("../services/users.service")
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/auth.middleware");
const bcrypt = require("bcrypt");


const getAllUsers = (req, res) => {
  const allUsers = usersService.getAllUsers();
  res.json({ status: "OK", data: allUsers });
};

const getUser = async (req, res) => {
  try{
    user = await usersService.getUser(req.params.username);
    res.status(200).json({
      message: "Get an existing user: ",
      data: user});
  } catch(error){
        res.status(500).json({
      message: "User not found.",
      error: error.message
    });
  }
};

const createUser = async (req, res) => {
  try{
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const createdUser = await usersService.createUser(req.body);
    console.log("Salt: " + salt)
    console.log("Hashed password: " + hashedPassword)
    res.status(201).json({
      message: "New user created.",
      data: createdUser
    });
  } catch(error){
    res.status(500).json({
      message: "User not created.",
      error: error.message
    });
  }
};

const updateUser = (req, res) => {
  const updatedUser = usersService.updateUser();
  res.json({ message: "Update an existing user" });
};

const deleteUser = (req, res) => {
  const deletedUser = usersService.deleteUser();
  res.json({ message: "Delete an existing user" });
};

const loginUser = async (req, res) => {
  try{

    //TODO: verificare se utilizzare token così o se utilizzare refresh token
    token =jwt.sign({username: req.body.username, password: req.body.password}, authMiddleware.sec, {expiresIn: '1h'});
    await usersService.loginUser(req.body);
    res.status(200).json({
      message: "Login succeded: ",
      token: token});
  } catch(error){
    res.status(500).json({
      message: "Login failed.",
      error: error.message
    });
  }

};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser
};