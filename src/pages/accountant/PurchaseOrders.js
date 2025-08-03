import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaPlus, FaSearch, FaFilter, FaEye, FaEdit, FaTrash, FaDownload, FaTruck } from 'react-icons/fa';
import './PurchaseOrders.css';

const PurchaseOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Mock data
    const mockOrders = [
      {
        id: 'PO-2024-001',
        supplier: 'Nhà sách Fahasa',
        orderDate: '2024-01-15',
        expectedDelivery: '2024-01-25',
        status: 'pending',
        totalAmount: 2500000,
        items: [
          { title: 'Machine Learning Basics', author: 'Andrew Ng', quantity: 5, price: 150000 },
          { title: 'Deep Learning', author: 'Ian Goodfellow', quantity: 3, price: 200000 },
          { title: 'AI Fundamentals', author: 'Stuart Russell', quantity: 4, price: 180000 }
        ],
        contactPerson: 'Nguyễn Văn A',
        phone: '0901234567',
        email: 'contact@fahasa.com'
      },
      {
        id: 'PO-2024-002',
        supplier: 'Công ty TNHH Sách Giáo Dục',
        orderDate: '2024-01-14',
        expectedDelivery: '2024-01-22',
        status: 'confirmed',
        totalAmount: 1800000,
        items: [
          { title: 'Principles of Economics', author: 'N. Gregory Mankiw', quantity: 5, price: 120000 },
          { title: 'Microeconomics', author: 'Robert Pindyck', quantity: 4, price: 110000 },
          { title: 'Macroeconomics', author: 'Olivier Blanchard', quantity: 3, price: 130000 }
        ],
        contactPerson: 'Trần Thị B',
        phone: '0909876543',
        email: 'info@sachgiaoduc.com'
      },
      {
        id: 'PO-2024-003',
        supplier: 'Nhà xuất bản Văn Học',
        orderDate: '2024-01-13',
        expectedDelivery: '2024-01-20',
        status: 'delivered',
        totalAmount: 1200000,
        items: [
          { title: 'Truyện Kiều', author: 'Nguyễn Du', quantity: 3, price: 80000 },
          { title: 'Chí Phèo', author: 'Nam Cao', quantity: 4, price: 60000 },
          { title: 'Số Đỏ', author: 'Vũ Trọng Phụng', quantity: 3, price: 70000 }
        ],
        contactPerson: 'Lê Văn C',
        phone: '0905555555',
        email: 'contact@nxbvanhoc.com'
      }
    ];

    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: 'Chờ xác nhận', class: 'status-pending' },
      confirmed: { text: 'Đã xác nhận', class: 'status-confirmed' },
      shipped: { text: 'Đang giao', class: 'status-shipped' },
      delivered: { text: 'Đã giao', class: 'status-delivered' },
      cancelled: { text: 'Đã hủy', class: 'status-cancelled' }
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

  const getTotalItems = (items) => {
    return items.reduce((total, item) => total + item.quantity, 0);
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
    <div className="purchase-orders">
      <div className="page-header">
        <h1><FaShoppingCart /> Đơn hàng mua sách</h1>
        <p>Quản lý đơn đặt hàng sách với nhà cung cấp</p>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">
            <FaShoppingCart />
          </div>
          <div className="stat-content">
            <h3>Tổng đơn hàng</h3>
            <div className="stat-value">{orders.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaTruck />
          </div>
          <div className="stat-content">
            <h3>Đang giao</h3>
            <div className="stat-value">{orders.filter(o => o.status === 'shipped').length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaShoppingCart />
          </div>
          <div className="stat-content">
            <h3>Chờ xác nhận</h3>
            <div className="stat-value">{orders.filter(o => o.status === 'pending').length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaShoppingCart />
          </div>
          <div className="stat-content">
            <h3>Tổng giá trị</h3>
            <div className="stat-value">{formatCurrency(orders.reduce((sum, o) => sum + o.totalAmount, 0))}</div>
          </div>
        </div>
      </div>

      <div className="controls-section">
        <div className="search-section">
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn hàng hoặc nhà cung cấp..."
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
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="shipped">Đang giao</option>
            <option value="delivered">Đã giao</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>

        <div className="action-buttons">
          <button className="btn-secondary">
            <FaDownload /> Xuất báo cáo
          </button>
          <button className="btn-primary">
            <FaPlus /> Tạo đơn hàng mới
          </button>
        </div>
      </div>

      <div className="orders-grid">
        {filteredOrders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="order-title">
                <h3>{order.id}</h3>
                <div className="order-badges">
                  {getStatusBadge(order.status)}
                </div>
              </div>
              <div className="order-actions">
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

            <div className="order-info">
              <div className="info-row">
                <span className="info-label">Nhà cung cấp:</span>
                <span className="info-value">{order.supplier}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Ngày đặt hàng:</span>
                <span className="info-value">{order.orderDate}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Dự kiến giao:</span>
                <span className="info-value">{order.expectedDelivery}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Tổng tiền:</span>
                <span className="info-value cost">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>

            <div className="supplier-contact">
              <h4>Thông tin liên hệ:</h4>
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-label">Người liên hệ:</span>
                  <span className="contact-value">{order.contactPerson}</span>
                </div>
                <div className="contact-item">
                  <span className="contact-label">Điện thoại:</span>
                  <span className="contact-value">{order.phone}</span>
                </div>
                <div className="contact-item">
                  <span className="contact-label">Email:</span>
                  <span className="contact-value">{order.email}</span>
                </div>
              </div>
            </div>

            <div className="items-summary">
              <h4>Danh sách sách ({getTotalItems(order.items)} cuốn):</h4>
              <div className="items-list">
                {order.items.slice(0, 3).map((item, index) => (
                  <div key={index} className="item-row">
                    <div className="item-info">
                      <span className="item-title">{item.title}</span>
                      <span className="item-author">- {item.author}</span>
                    </div>
                    <div className="item-details">
                      <span className="item-quantity">x{item.quantity}</span>
                      <span className="item-price">{formatCurrency(item.price)}</span>
                    </div>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="more-items">
                    +{order.items.length - 3} sách khác
                  </div>
                )}
              </div>
            </div>

            {order.status === 'pending' && (
              <div className="order-actions-footer">
                <button className="btn-confirm">
                  <FaEdit /> Xác nhận đơn hàng
                </button>
                <button className="btn-cancel">
                  <FaTrash /> Hủy đơn hàng
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="empty-state">
          <FaShoppingCart />
          <p>Không tìm thấy đơn hàng nào phù hợp</p>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrders; 