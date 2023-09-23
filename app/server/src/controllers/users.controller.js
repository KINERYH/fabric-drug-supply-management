const usersService = require("../services/users.service")


const getAllUsers = (req, res) => {
  const allUsers = usersService.getAllUsers();
  res.json({ status: "OK", data: allUsers });
};

const getUser = (req, res) => {
  const user = usersService.getUser();
  res.json({ message: "Get an existing user: " + req.params.userId });
};

const createUser = async (req, res) => {
  try{
    const createdUser = await usersService.createUser(req.body.name);
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

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
};