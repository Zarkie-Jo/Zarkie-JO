import React, { useState, useEffect } from "react";
import axios from "axios";

const DebateList = () => {
  const [debates, setDebates] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    search: "",
    page: 1,
  });

  const fetchDebates = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/debates/`, {
        params: filters,
      });
      setDebates(response.data.debates);
      console.log(response.data.debates);
    } catch (error) {
      console.error("Error fetching debates:", error);
    }
  };

  useEffect(() => {
    fetchDebates();
  }, [filters]);

  const handleCategoryFilter = (category) => {
    setFilters((prev) => ({ ...prev, category, page: 1 }));
  };

  return (
    <div className="container mx-auto p-4 rtl">
      <div className="flex justify-between mb-6 flex-wrap gap-4">
        <div className="flex space-x-2 flex-wrap">
          {["", "ثقافي", "اجتماعي", "سياسي"].map((category) => (
            <button
              key={category}
              className={`
                                px-4 py-2 rounded-md transition-colors duration-200
                                ${
                                  filters.category === category
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                }
                            `}
              onClick={() => handleCategoryFilter(category)}
            >
              {category || "الكل"}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="البحث في المناظرات"
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                search: e.target.value,
                page: 1,
              }))
            }
          />
          <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {debates.map((debate) => (
          <div
            key={debate._id}
            className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2 text-gray-900">
                {debate.title}
              </h2>
              <p className="text-gray-600 mb-4">
                {debate.description.slice(0, 100)}...
              </p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {debate.category}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(debate.created_at).toLocaleDateString()}
                </span>
              </div>
              <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">
                مشاهدة المناظرة
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 space-x-2">
        {[1, 2, 3, 4, 5].map((page) => (
          <button
            key={page}
            className={`
                            px-4 py-2 rounded-md transition-colors duration-200
                            ${
                              filters.page === page
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                            }
                        `}
            onClick={() => setFilters((prev) => ({ ...prev, page }))}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DebateList;
