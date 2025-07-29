import React, { useState } from 'react';
import { FaWarehouse, FaSearch, FaPlus, FaEdit, FaEye, FaBoxes } from 'react-icons/fa';
import './InventoryManagement.css';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([
    {
      id: 1,
      bookTitle: 'Đắc Nhân Tâm',
      author: 'Dale Carnegie',
      isbn: '978-604-1-00001-1',
      totalQuantity: 50,
      availableQuantity: 45,
      location: 'Kệ A1',
      status: 'available'
    },
    {
      id: 2,
      bookTitle: 'Nhà Giả Kim',
      author: 'Paulo Coelho',
      isbn: '978-604-1-00002-2',
      totalQuantity: 30,
      availableQuantity: 28,
      location: 'Kệ A2',
      status: 'available'
    },
    {
      id: 3,
      bookTitle: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
      author: 'Rosie Nguyễn',
      isbn: '978-604-1-00003-3',
      totalQuantity: 25,
      availableQuantity: 0,
      location: 'Kệ B1',
      status: 'out_of_stock'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.isbn.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="inventory-management">
      <div className="page-header">
        <h1><FaWarehouse /> Quản lý kho sách</h1>
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
              {inventory.filter(item => item.status === 'out_of_stock').length}
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
            {filteredInventory.map(item => (
              <tr key={item.id}>
                <td>{item.bookTitle}</td>
                <td>{item.author}</td>
                <td>{item.isbn}</td>
                <td>{item.totalQuantity}</td>
                <td>{item.availableQuantity}</td>
                <td>{item.location}</td>
                <td>
                  <span className={`status-badge ${item.status}`}>
                    {item.status === 'available' ? 'Có sẵn' : 
                     item.status === 'out_of_stock' ? 'Hết sách' : 'Sắp hết'}
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