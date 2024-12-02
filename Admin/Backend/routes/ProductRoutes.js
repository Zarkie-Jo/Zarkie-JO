const express = require("express");
const router = express.Router();
const productController = require("../controller/ProductController");
const authMiddleware = require("../middleware/authMiddleware");

// Debug logging
router.use((req, res, next) => {
  console.log("Product route accessed:", {
    method: req.method,
    path: req.path,
    body: req.body,
  });
  next();
});

// Routes
router
  .route("/")
  .get(productController.getAllProducts)
  .post(productController.createProduct);

router
  .route("/:id/approve")
  .put(authMiddleware, productController.approveProduct);

router
  .route("/:id/delete-admin")
  .delete(authMiddleware, productController.deleteProductAdmin);

module.exports = router;
