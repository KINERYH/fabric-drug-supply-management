const boxesService = require("../services/boxes.service")

const getAllBoxes = async (req, res) => {
  try {
    const allBoxes = await boxesService.getAllBoxes();
    res.json({ status: "OK", data: allBoxes });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
};

const getBox = async (req, res) => {
  try{
    const box = await boxesService.getBox(req.params.boxId, req.currentUser);
    res.status(200).json({
      message: "Get an existing box: ",
      data: box
    });
  } catch(error){
    res.status(error?.status || 500).json({
      message: "Failed to get box.",
      error: error?.message || error
    });
  }
};

const createBox = (req, res) => {
  const createdBox = boxesService.createBox();
  res.json({ message: "Create a new box" });
};

const updateBox = (req, res) => {
  const updatedBox = boxesService.updateBox();
  res.json({ message: "Update an existing box" });
};

const deleteBox = (req, res) => {
  const deletedBox = boxesService.deleteBox();
  res.json({ message: "Delete an existing box" });
};

module.exports = {
  getAllBoxes,
  getBox,
  createBox,
  updateBox,
  deleteBox
};