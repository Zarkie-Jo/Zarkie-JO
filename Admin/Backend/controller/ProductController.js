const Product = require("../models/Productsadmin");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isDeletedAdmin: { $ne: true },
    }).sort({ created_at: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching debates",
      error: error.message,
    });
  }
};

exports.approveProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Debate not found",
      });
    }

    product.isApproved = isApproved;
    await product.save();

    res.json({
      success: true,
      message: `Debate ${isApproved ? "approved" : "unapproved"} successfully`,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating debate status",
      error: error.message,
    });
  }
};

exports.uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const filePath = `/uploads/${req.file.filename}`;
    product.images.push(filePath);
    await product.save();
    res.status(200).json({
      message: "File uploaded successfully",
      filePath: filePath,
      product: product,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteProductAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Debate not found",
      });
    }

    product.isDeletedAdmin = true;
    await product.save();

    res.json({
      success: true,
      message: "Debate deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting debate",
      error: error.message,
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    console.log("Creating product with data:", req.body);

    const { title, description, category, video_path } = req.body;

    // Validate required fields
    if (!title || !description || !category || !video_path) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        received: req.body,
      });
    }

    const product = new Product({
      title,
      description,
      category,
      video_path,
      created_at: new Date(),
      isApproved: true,
      is_delete: false,
      isDeletedAdmin: false,
    });

    const savedProduct = await product.save();
    console.log("Product saved:", savedProduct);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: savedProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};
