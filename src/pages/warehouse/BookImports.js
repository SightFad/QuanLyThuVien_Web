import React, { useState } from 'react';
import { FaTruck, FaPlus, FaFileAlt, FaCheck, FaTimes, FaBoxes, FaCalendarAlt, FaUser, FaBuilding } from 'react-icons/fa';
import './BookImports.css';

const BookImports = () => {
  const [imports, setImports] = useState([
    {
      id: 1,
      importCode: 'IMP-2024-001',
      supplier: 'NXB Giáo dục',
      totalBooks: 150,
      totalValue: 15000000,
      status: 'pending',
      importDate: '2024-01-15',
      expectedDelivery: '2024-01-20',
      actualDelivery: null,
      notes: 'Sách giáo khoa cho năm học mới'
    },
    {
      id: 2,
      importCode: 'IMP-2024-002',
      supplier: 'NXB Trẻ',
      totalBooks: 80,
      totalValue: 8000000,
      status: 'in_transit',
      importDate: '2024-01-10',
      expectedDelivery: '2024-01-18',
      actualDelivery: null,
      notes: 'Sách văn học và tiểu thuyết'
    },
    {
      id: 3,
      importCode: 'IMP-2024-003',
      supplier: 'NXB Kim Đồng',
      totalBooks: 200,
      totalValue: 12000000,
      status: 'completed',
      importDate: '2024-01-05',
      expectedDelivery: '2024-01-12',
      actualDelivery: '2024-01-12',
      notes: 'Sách thiếu nhi và truyện tranh'
    }
  ]);

  const [showNewImportModal, setShowNewImportModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredImports = imports.filter(importItem => 
    filterStatus === 'all' || importItem.status === filterStatus
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Chờ xử lý', class: 'pending' },
      in_transit: { label: 'Đang vận chuyển', class: 'in-transit' },
      completed: { label: 'Hoàn thành', class: 'completed' },
      cancelled: { label: 'Đã hủy', class: 'cancelled' }
    };
    return statusConfig[status] || { label: status, class: 'unknown' };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleCreateImport = () => {
    setShowNewImportModal(true);
  };

  const handleConfirmImport = (importId) => {
    setImports(prev => prev.map(imp => 
      imp.id === importId 
        ? { ...imp, status: 'completed', actualDelivery: new Date().toISOString().split('T')[0] }
        : imp
    ));
  };

  const handleCancelImport = (importId) => {
    setImports(prev => prev.map(imp => 
      imp.id === importId 
        ? { ...imp, status: 'cancelled' }
        : imp
    ));
  };

  return (
    <div className="book-imports">
      <div className="page-header">
        <h1><FaTruck /> Quản lý nhập sách</h1>
        <p>Theo dõi và quản lý các đơn nhập sách từ nhà cung cấp</p>
      </div>

      <div className="import-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FaFileAlt />
          </div>
          <div className="stat-content">
            <div className="stat-number">{imports.length}</div>
            <div className="stat-label">Tổng đơn nhập</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaBoxes />
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {imports.reduce((sum, imp) => sum + imp.totalBooks, 0)}
            </div>
            <div className="stat-label">Tổng số sách</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaCheck />
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {imports.filter(imp => imp.status === 'completed').length}
            </div>
            <div className="stat-label">Đã hoàn thành</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaTimes />
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {imports.filter(imp => imp.status === 'pending').length}
            </div>
            <div className="stat-label">Chờ xử lý</div>
          </div>
        </div>
      </div>

      <div className="import-controls">
        <div className="filter-section">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="in_transit">Đang vận chuyển</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>

        <button className="btn-primary" onClick={handleCreateImport}>
          <FaPlus /> Tạo đơn nhập mới
        </button>
      </div>

      <div className="imports-table">
        <table>
          <thead>
            <tr>
              <th>Mã đơn nhập</th>
              <th>Nhà cung cấp</th>
              <th>Số lượng sách</th>
              <th>Giá trị</th>
              <th>Ngày đặt</th>
              <th>Dự kiến giao</th>
              <th>Thực tế giao</th>
              <th>Trạng thái</th>
              <th>Ghi chú</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredImports.map(importItem => {
              const statusConfig = getStatusBadge(importItem.status);
              return (
                <tr key={importItem.id}>
                  <td>
                    <strong>{importItem.importCode}</strong>
                  </td>
                  <td>
                    <div className="supplier-info">
                      <FaBuilding />
                      <span>{importItem.supplier}</span>
                    </div>
                  </td>
                  <td>{importItem.totalBooks} cuốn</td>
                  <td>{formatCurrency(importItem.totalValue)}</td>
                  <td>
                    <div className="date-info">
                      <FaCalendarAlt />
                      <span>{importItem.importDate}</span>
                    </div>
                  </td>
                  <td>
                    <div className="date-info">
                      <FaCalendarAlt />
                      <span>{importItem.expectedDelivery}</span>
                    </div>
                  </td>
                  <td>
                    {importItem.actualDelivery ? (
                      <div className="date-info">
                        <FaCalendarAlt />
                        <span>{importItem.actualDelivery}</span>
                      </div>
                    ) : (
                      <span className="not-delivered">Chưa giao</span>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge ${statusConfig.class}`}>
                      {statusConfig.label}
                    </span>
                  </td>
                  <td>
                    <div className="notes-cell">
                      {importItem.notes}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {importItem.status === 'pending' && (
                        <>
                          <button 
                            className="btn-icon success" 
                            title="Xác nhận nhập"
                            onClick={() => handleConfirmImport(importItem.id)}
                          >
                            <FaCheck />
                          </button>
                          <button 
                            className="btn-icon danger" 
                            title="Hủy đơn"
                            onClick={() => handleCancelImport(importItem.id)}
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                      {importItem.status === 'in_transit' && (
                        <button 
                          className="btn-icon success" 
                          title="Xác nhận đã nhận"
                          onClick={() => handleConfirmImport(importItem.id)}
                        >
                          <FaCheck />
                        </button>
                      )}
                      <button className="btn-icon" title="Xem chi tiết">
                        <FaFileAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredImports.length === 0 && (
        <div className="empty-state">
          <FaTruck />
          <p>Không có đơn nhập nào phù hợp</p>
        </div>
      )}

      {/* New Import Modal */}
      {showNewImportModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Tạo đơn nhập mới</h2>
              <button 
                className="btn-close"
                onClick={() => setShowNewImportModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Nhà cung cấp</label>
                <select>
                  <option>NXB Giáo dục</option>
                  <option>NXB Trẻ</option>
                  <option>NXB Kim Đồng</option>
                  <option>NXB Văn học</option>
                </select>
              </div>
              <div className="form-group">
                <label>Danh sách sách</label>
                <textarea placeholder="Nhập danh sách sách cần nhập..."></textarea>
              </div>
              <div className="form-group">
                <label>Ghi chú</label>
                <textarea placeholder="Ghi chú về đơn nhập..."></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowNewImportModal(false)}
              >
                Hủy
              </button>
              <button className="btn-primary">
                Tạo đơn nhập
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookImports; 