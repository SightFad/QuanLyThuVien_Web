import React, { useState, useEffect } from 'react';
import { FaIndustry, FaPlus, FaSearch, FaFilter, FaEye, FaEdit, FaTrash, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import './SupplierManagement.css';

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Mock data
    const mockSuppliers = [
      {
        id: 1,
        name: 'Nhà sách Fahasa',
        contactPerson: 'Nguyễn Văn A',
        phone: '0901234567',
        email: 'contact@fahasa.com',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        status: 'active',
        rating: 4.5,
        totalOrders: 25,
        totalSpent: 15000000,
        specialties: ['Sách giáo khoa', 'Sách văn học', 'Sách kỹ thuật'],
        lastOrder: '2024-01-15'
      },
      {
        id: 2,
        name: 'Công ty TNHH Sách Giáo Dục',
        contactPerson: 'Trần Thị B',
        phone: '0909876543',
        email: 'info@sachgiaoduc.com',
        address: '456 Đường XYZ, Quận 3, TP.HCM',
        status: 'active',
        rating: 4.2,
        totalOrders: 18,
        totalSpent: 12000000,
        specialties: ['Sách giáo dục', 'Sách tham khảo'],
        lastOrder: '2024-01-14'
      },
      {
        id: 3,
        name: 'Nhà xuất bản Văn Học',
        contactPerson: 'Lê Văn C',
        phone: '0905555555',
        email: 'contact@nxbvanhoc.com',
        address: '789 Đường DEF, Quận 5, TP.HCM',
        status: 'inactive',
        rating: 3.8,
        totalOrders: 12,
        totalSpent: 8000000,
        specialties: ['Sách văn học', 'Sách lịch sử'],
        lastOrder: '2024-01-10'
      },
      {
        id: 4,
        name: 'Công ty Sách Khoa Học',
        contactPerson: 'Phạm Thị D',
        phone: '0907777777',
        email: 'info@sachkhoahoc.com',
        address: '321 Đường GHI, Quận 7, TP.HCM',
        status: 'active',
        rating: 4.7,
        totalOrders: 30,
        totalSpent: 20000000,
        specialties: ['Sách khoa học', 'Sách công nghệ', 'Sách y học'],
        lastOrder: '2024-01-16'
      }
    ];

    setTimeout(() => {
      setSuppliers(mockSuppliers);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || supplier.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { text: 'Hoạt động', class: 'status-active' },
      inactive: { text: 'Không hoạt động', class: 'status-inactive' }
    };
    const config = statusConfig[status] || { text: status, class: 'status-default' };
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star">☆</span>);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="supplier-management">
      <div className="page-header">
        <h1><FaIndustry /> Quản lý nhà cung cấp</h1>
        <p>Quản lý thông tin và phản hồi từ nhà cung cấp sách</p>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">
            <FaIndustry />
          </div>
          <div className="stat-content">
            <h3>Tổng nhà cung cấp</h3>
            <div className="stat-value">{suppliers.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaIndustry />
          </div>
          <div className="stat-content">
            <h3>Đang hoạt động</h3>
            <div className="stat-value">{suppliers.filter(s => s.status === 'active').length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaIndustry />
          </div>
          <div className="stat-content">
            <h3>Tổng đơn hàng</h3>
            <div className="stat-value">{suppliers.reduce((sum, s) => sum + s.totalOrders, 0)}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaIndustry />
          </div>
          <div className="stat-content">
            <h3>Tổng chi tiêu</h3>
            <div className="stat-value">{formatCurrency(suppliers.reduce((sum, s) => sum + s.totalSpent, 0))}</div>
          </div>
        </div>
      </div>

      <div className="controls-section">
        <div className="search-section">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên nhà cung cấp hoặc người liên hệ..."
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
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>

        <div className="action-buttons">
          <button className="btn-primary">
            <FaPlus /> Thêm nhà cung cấp mới
          </button>
        </div>
      </div>

      <div className="suppliers-grid">
        {filteredSuppliers.map(supplier => (
          <div key={supplier.id} className="supplier-card">
            <div className="supplier-header">
              <div className="supplier-title">
                <h3>{supplier.name}</h3>
                <div className="supplier-badges">
                  {getStatusBadge(supplier.status)}
                </div>
              </div>
              <div className="supplier-actions">
                <button className="btn-icon" title="Xem chi tiết">
                  <FaEye />
                </button>
                <button className="btn-icon" title="Chỉnh sửa">
                  <FaEdit />
                </button>
                <button className="btn-icon" title="Xóa">
                  <FaTrash />
                </button>
              </div>
            </div>

            <div className="supplier-rating">
              <div className="rating-stars">
                {getRatingStars(supplier.rating)}
              </div>
              <span className="rating-value">{supplier.rating}/5</span>
            </div>

            <div className="supplier-contact">
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <span className="contact-label">Người liên hệ:</span>
                <span className="contact-value">{supplier.contactPerson}</span>
              </div>
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <span className="contact-label">Điện thoại:</span>
                <span className="contact-value">{supplier.phone}</span>
              </div>
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <span className="contact-label">Email:</span>
                <span className="contact-value">{supplier.email}</span>
              </div>
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <span className="contact-label">Địa chỉ:</span>
                <span className="contact-value">{supplier.address}</span>
              </div>
            </div>

            <div className="supplier-stats">
              <div className="stat-item">
                <span className="stat-label">Tổng đơn hàng:</span>
                <span className="stat-value">{supplier.totalOrders}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Tổng chi tiêu:</span>
                <span className="stat-value cost">{formatCurrency(supplier.totalSpent)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Đơn hàng cuối:</span>
                <span className="stat-value">{supplier.lastOrder}</span>
              </div>
            </div>

            <div className="supplier-specialties">
              <h4>Chuyên môn:</h4>
              <div className="specialties-list">
                {supplier.specialties.map((specialty, index) => (
                  <span key={index} className="specialty-tag">{specialty}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <div className="empty-state">
          <FaIndustry />
          <p>Không tìm thấy nhà cung cấp nào phù hợp</p>
        </div>
      )}
    </div>
  );
};

export default SupplierManagement; 