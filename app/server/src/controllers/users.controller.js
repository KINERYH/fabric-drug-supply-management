const usersService = require("../services/users.service")


const getAllUsers = (req, res) => {
  const allUsers = usersService.getAllUsers();
  res.json({ status: "OK", data: allUsers });
};

const getUser = async (req, res) => {
  try{const user = await usersService.getUser(req);
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
    const createdUser = await usersService.createUser(req.body);
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
    const user = await usersService.loginUser(req.body);
    res.status(200).json({
      message: "Login succeded: ",
      data: user});
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