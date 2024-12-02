const Debate = require("../models/Productsadmin");
const mongoose = require("mongoose");

class DebateController {
  // Create a new debate
  async createDebate(req, res) {
    try {
      const { title, description, video_path, category } = req.body;

      const newDebate = new Debate({
        title,
        description,
        video_path,
        category,
        admin_id: req.admin ? req.admin._id : null,
      });

      const savedDebate = await newDebate.save();

      res.status(201).json({
        message: "Debate created successfully",
        debate: savedDebate,
      });
    } catch (error) {
      res.status(400).json({
        message: "Error creating debate",
        error: error.message,
      });
    }
  }

  // Get all debates
  async getAllDebates(req, res) {
    try {
      const { category, page = 1, limit = 10, search } = req.query;

      const query = {
        isApproved: true,
        is_delete: false,
      };

      if (category) {
        query.category = category;
      }

      if (search) {
        query.$text = { $search: search };
      }

      const debates = await Debate.find(query)
        .sort({ created_at: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

      const total = await Debate.countDocuments(query);

      res.json({
        debates,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching debates",
        error: error.message,
      });
    }
  }

  // Get single debate
  async getDebateById(req, res) {
    try {
      const debate = await Debate.findById(req.params.id);

      if (!debate || debate.is_delete) {
        return res.status(404).json({
          message: "Debate not found",
        });
      }

      res.json(debate);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching debate",
        error: error.message,
      });
    }
  }

  // Update debate
  async updateDebate(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedDebate = await Debate.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedDebate) {
        return res.status(404).json({
          message: "Debate not found",
        });
      }

      res.json({
        message: "Debate updated successfully",
        debate: updatedDebate,
      });
    } catch (error) {
      res.status(400).json({
        message: "Error updating debate",
        error: error.message,
      });
    }
  }

  // Soft delete debate
  async deleteDebate(req, res) {
    try {
      const { id } = req.params;

      const deletedDebate = await Debate.findByIdAndUpdate(
        id,
        {
          is_delete: true,
          isDeletedAdmin: true,
        },
        { new: true }
      );

      if (!deletedDebate) {
        return res.status(404).json({
          message: "Debate not found",
        });
      }

      res.json({
        message: "Debate deleted successfully",
        debate: deletedDebate,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error deleting debate",
        error: error.message,
      });
    }
  }
}

module.exports = new DebateController();
