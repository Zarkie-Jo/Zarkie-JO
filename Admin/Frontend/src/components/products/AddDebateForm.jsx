import { useState } from "react";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";

const API_BASE_URL = "http://localhost:4000/api";

const AddDebateForm = ({ onDebateAdded }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "ثقافي",
    video: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVideoChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      video: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Upload video
      const videoFormData = new FormData();
      videoFormData.append("video", formData.video);

      const videoResponse = await fetch(`${API_BASE_URL}/videos/upload`, {
        method: "POST",
        body: videoFormData,
      });

      if (!videoResponse.ok) {
        throw new Error(`Video upload failed: ${videoResponse.statusText}`);
      }

      const videoData = await videoResponse.json();
      console.log("Video upload response:", videoData);

      if (!videoData.success) {
        throw new Error(videoData.message || "Video upload failed");
      }

      // Create debate
      const debateData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        video_path: videoData.filePath,
      };

      console.log("Sending debate data:", debateData);

      const productResponse = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(debateData),
      });

      if (!productResponse.ok) {
        const errorText = await productResponse.text();
        console.error("Product creation error response:", errorText);
        throw new Error(errorText || "Failed to create debate");
      }

      const productData = await productResponse.json();
      console.log("Product creation response:", productData);

      if (!productData.success) {
        throw new Error(productData.message || "Failed to create debate");
      }

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "ثقافي",
        video: null,
      });

      if (onDebateAdded) onDebateAdded();
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Failed to create debate");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-6">
        Add New Debate
      </h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ثقافي">ثقافي</option>
            <option value="اجتماعي">اجتماعي</option>
            <option value="سياسي">سياسي</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Video</label>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              required
              className="hidden"
              id="video-upload"
            />
            <label
              htmlFor="video-upload"
              className="flex items-center space-x-2 bg-gray-700 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-600"
            >
              <Upload size={20} />
              <span>
                {formData.video ? formData.video.name : "Choose Video"}
              </span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isLoading ? "Adding..." : "Add Debate"}
        </button>
      </form>
    </motion.div>
  );
};

export default AddDebateForm;
