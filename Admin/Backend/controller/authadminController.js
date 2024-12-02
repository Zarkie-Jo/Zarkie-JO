const Admin = require("../models/admin"); // Import the Admin model
const jwt = require("jsonwebtoken");

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!admin.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.header("Access-Control-Allow-Origin", "http://localhost:5174");
    res.header("Access-Control-Allow-Credentials", "true");

    res.json({
      token,
      admin: { id: admin._id, email: admin.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
