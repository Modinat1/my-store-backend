const Brands = require("../schema/brand.model.js");

const getAllBrand = async (req, res) => {
  try {
    const brands = await Brands.find();
    res.status(200).json(brands);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching brands", error: error.message });
  }
};

const addNewBrand = async (req, res) => {
  try {
    const { brandName } = req.body;

    const brand = await Brands.create({
      brandName,
    });

    res.status(201).json({
      message: "Brand added successfully",
      brand,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error creating brand",
      error: error.message || error,
    });
  }
};

const getBrandById = async (req, res) => {
  try {
    const id = req.params.id;
    const brand = await Brands.findById(id);
    if (!brand) {
      return res.status(404).send({ message: "brand not found" });
    }

    res.status(200).json({
      message: "brand found",
      brand,
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid brand ID or error occurred",
      error: error.message || error,
    });
  }
};

const updatedBrand = async (req, res) => {
  try {
    const id = req.params.id;

    const updatedBrand = await Brands.findByIdAndUpdate(id);

    if (!updatedBrand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.status(200).json({
      message: "Brand updated successfully",
      brand: updatedBrand,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error updating brand",
      error: error.message || error,
    });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const id = req.params.id;
    await Brands.findById(id);

    const deletedBrand = await Brands.findByIdAndDelete(id);

    if (!deletedBrand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    res.status(200).json({
      message: "Brand deleted successfully",
      brand: deletedBrand,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error deleting Brand",
      error: error.message || error,
    });
  }
};

module.exports = {
  getAllBrand,
  addNewBrand,
  getBrandById,
  updatedBrand,
  deleteBrand,
};
