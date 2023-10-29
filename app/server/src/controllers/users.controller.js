const usersService = require("../services/users.service")


const getAllUsers = async (req, res) => {
  try{
    users = await usersService.getAllUsers(req.currentUser);
    res.status(200).json({
      message: "Get users: ",
      data: users
    });
  }catch(error){
    res.status(error?.status || 500).json({
      message: "Impossible to get users.",
      error: error?.message || error
    });
  }
};

const getUser = async (req, res) => {
  try{
    user = await usersService.getUser(req.params.userId, req.currentUser);
    res.status(200).json({
      message: "Get an existing user: ",
      data: user
    });
  } catch(error){
    res.status(error?.status || 500).json({
      message: "User not found.",
      error: error?.message || error
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
    res.status(error?.status || 500).json({
      message: "User not created.",
      error: error?.message || error
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const updatedUser = usersService.updateUser(req.body, req.params.userId);
    res.json({
      message: "Updated the user with id: " + req.params.userId,
      data: updatedUser
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: "User not updated.",
      error: error?.message || error
    });
  }
};

const deleteUser = async (req, res) => {
  const deletedUser = usersService.deleteUser();
  res.json({ message: "Delete an existing user" });
};

const loginUser = async (req, res) => {
  try{
    const json = await usersService.loginUser(req.body);
    res.status(200).json({
      message: "Login succeded.",
      token: json.token,
      uuid: json.uuid,
      role: json.role});
  } catch(error) {
    res.status(error?.status || 500).json({
      message: "Login failed.",
      error: error?.message || error
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