const Product = require("../schema/product.model.js");
const joi = require("joi");

const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find({ ownerId: req.decoded.ownerId });
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

const addNewProduct = async (req, res) => {
  try {
    const { productName, cost, description, stockStatus } = req.body;

    const productImages = req.files?.map((file) => {
      return `/uploads/${file.filename}`;
    });

    const product = await Product.create({
      productName,
      cost,
      stockStatus,
      description,
      productImages,
      ownerId: req.decoded.ownerId,
    });

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error creating product",
      error: error.message || error,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product found",
      product,
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid product ID or error occurred",
      error: error.message || error,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const { stockStatus, ...fieldsToUpdate } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error updating product",
      error: error.message || error,
    });
  }
};

const updateProductStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const stockStatus = req.params.status;

    const schema = joi.string().valid("in-stock", "low-stock", "out-of-stock");
    const { error } = schema.validate(stockStatus);

    if (error) {
      return res.status(422).json({ message: error.message });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { stockStatus },
      { new: true }
    );

    res.status(200).json({
      message: "Stock status updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error updating product status",
      error: error.message || error,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);

    console.log("product to id:", id);
    console.log("product to delete:", product);

    if (product.ownerId.toString() !== req.decoded.ownerId) {
      // if (product.ownerId !== req.decoded.ownerId) {
      res
        .status(401)
        .send({ message: "You are not permitted to delete this product" });
      return;
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error deleting product",
      error: error.message || error,
    });
  }
};

module.exports = {
  getAllProduct,
  addNewProduct,
  getProductById,
  updateProduct,
  updateProductStatus,
  deleteProduct,
};
