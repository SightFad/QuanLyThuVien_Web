import React, { useState, useEffect } from "react";
import {
  FaWarehouse,
  FaSearch,
  FaPlus,
  FaEdit,
  FaEye,
  FaBoxes,
} from "react-icons/fa";
import { warehouseService } from "../../services";
import "./InventoryManagement.css";

const InventoryManagement = () => {
  const [inventoryData, setInventoryData] = useState({
    inventory: [],
    pagination: { page: 1, pageSize: 10, totalCount: 0, totalPages: 0 },
    summary: {
      totalBooks: 0,
      availableBooks: 0,
      borrowedBooks: 0,
      outOfStockCount: 0,
      lowStockCount: 0,
      uniqueTitles: 0,
    },
    locations: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.isbn.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;
    const matchesLocation =
      filterLocation === "all" || item.location === filterLocation;

    return matchesSearch && matchesStatus && matchesLocation;
  });

  useEffect(() => {
    loadInventory();
  }, [searchTerm, filterStatus, filterLocation, currentPage]);

  const loadInventory = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        search: searchTerm,
        status: filterStatus,
        location: filterLocation,
        page: currentPage,
        pageSize: 10,
      };

      const data = await warehouseService.getInventory(params);
      setInventoryData(data);
    } catch (error) {
      console.error("Error loading inventory:", error);
      setError(
        "Không thể tải dữ liệu tồn kho. Đang hiển thị dữ liệu fallback."
      );

      // Fallback to empty data
      const fallbackData = warehouseService.createFallbackInventoryData();
      setInventoryData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  // Extract data for easier access
  const { inventory, pagination, summary, locations } = inventoryData;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleLocationChange = (e) => {
    setFilterLocation(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="inventory-management">
      <div className="page-header">
        <h1>
          <FaWarehouse /> Quản lý kho sách
        </h1>
        <p>Theo dõi và quản lý tồn kho sách trong thư viện</p>
      </div>

      <div className="inventory-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FaBoxes />
          </div>
          <div className="stat-content">
            <div className="stat-number">{inventory.length}</div>
            <div className="stat-label">Tổng đầu sách</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaBoxes />
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {inventory.reduce((sum, item) => sum + item.totalQuantity, 0)}
            </div>
            <div className="stat-label">Tổng số lượng</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaBoxes />
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {inventory.reduce((sum, item) => sum + item.availableQuantity, 0)}
            </div>
            <div className="stat-label">Có sẵn</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaBoxes />
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {
                inventory.filter((item) => item.status === "out_of_stock")
                  .length
              }
            </div>
            <div className="stat-label">Hết sách</div>
          </div>
        </div>
      </div>

      <div className="inventory-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên sách, tác giả hoặc ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn-search">
            <FaSearch />
          </button>
        </div>

        <div className="filter-section">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="available">Có sẵn</option>
            <option value="out_of_stock">Hết sách</option>
            <option value="low_stock">Sắp hết</option>
          </select>
        </div>

        <button className="btn-primary">
          <FaPlus /> Thêm sách mới
        </button>
      </div>

      <div className="inventory-table">
        <table>
          <thead>
            <tr>
              <th>Tên sách</th>
              <th>Tác giả</th>
              <th>ISBN</th>
              <th>Tổng số lượng</th>
              <th>Có sẵn</th>
              <th>Vị trí</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item) => (
              <tr key={item.id}>
                <td>{item.bookTitle}</td>
                <td>{item.author}</td>
                <td>{item.isbn}</td>
                <td>{item.totalQuantity}</td>
                <td>{item.availableQuantity}</td>
                <td>{item.location}</td>
                <td>
                  <span className={`status-badge ${item.status}`}>
                    {item.status === "available"
                      ? "Có sẵn"
                      : item.status === "out_of_stock"
                      ? "Hết sách"
                      : "Sắp hết"}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="Xem chi tiết">
                      <FaEye />
                    </button>
                    <button className="btn-icon" title="Chỉnh sửa">
                      <FaEdit />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredInventory.length === 0 && (
        <div className="empty-state">
          <FaBoxes />
          <p>Không tìm thấy sách nào phù hợp</p>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
