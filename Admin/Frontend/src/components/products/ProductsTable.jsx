///////////////////////////////////////////////////////////////
import { motion } from "framer-motion";
import { Search, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import AddDebateForm from "./AddDebateForm";

const API_BASE_URL = "http://localhost:4000/api";

// First, set the Modal's app element
Modal.setAppElement("#root");

const ProductCard = ({ product, onApprove, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <motion.div
      className="bg-gray-800 rounded-lg shadow-md overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="relative h-48">
        <video
          src={`${API_BASE_URL}${product.video_path}`}
          className="w-full h-full object-cover"
          controls
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-100 mb-2">
          {product.title}
        </h3>
        <p className="text-sm text-gray-300 mb-2">
          Category: {product.category}
        </p>
        <p className="text-sm text-gray-300 mb-4">{product.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                product.isApproved
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {product.isApproved ? "Approved" : "Not Approved"}
            </span>
            <button
              onClick={() => onApprove(product._id, !product.isApproved)}
              className={`p-2 rounded-full ${
                product.isApproved
                  ? "hover:bg-red-500/20 text-red-400"
                  : "hover:bg-green-500/20 text-green-400"
              }`}
            >
              {product.isApproved ? (
                <XCircle size={20} />
              ) : (
                <CheckCircle size={20} />
              )}
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 hover:bg-red-500/20 text-red-400 rounded-full"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          content: {
            position: "relative",
            top: "auto",
            left: "auto",
            right: "auto",
            bottom: "auto",
            maxWidth: "400px",
            width: "90%",
            padding: "24px",
            borderRadius: "8px",
            backgroundColor: "#1F2937",
            border: "1px solid #374151",
          },
        }}
      >
        <h2 className="text-xl font-bold mb-4 text-gray-100">
          Confirm Deletion
        </h2>
        <p className="mb-6 text-gray-300">
          Are you sure you want to delete this debate? This action cannot be
          undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onDelete(product._id);
              setIsModalOpen(false);
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </Modal>
    </motion.div>
  );
};

const ProductsGrid = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) throw new Error("Failed to fetch debates");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleApprove = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("AdminToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/products/${id}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isApproved: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update status");
      }

      fetchProducts(); // Refresh the list
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("AdminToken");
      console.log("Retrieved token:", token);

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${API_BASE_URL}/products/${id}/delete-admin`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Delete response error:", errorData);
        throw new Error(errorData.message || "Failed to delete debate");
      }

      fetchProducts(); // Refresh the list
    } catch (error) {
      setError(error.message);
      console.error("Delete error:", error);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading)
    return <div className="text-center text-gray-300">Loading...</div>;
  if (error) return <div className="text-center text-red-400">{error}</div>;

  return (
    <div className="space-y-6">
      <AddDebateForm onDebateAdded={fetchProducts} />

      <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-100">All Debates</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search debates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-700 text-gray-100 px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onApprove={handleApprove}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center text-gray-400 py-10">
            No debates found
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsGrid;
