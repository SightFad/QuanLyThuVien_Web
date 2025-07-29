import React, { useState, useEffect } from 'react';
import { FaFileAlt, FaPlus, FaSearch, FaFilter, FaEye, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import './PurchaseProposals.css';

const PurchaseProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Mock data
    const mockProposals = [
      {
        id: 1,
        title: 'Bổ sung sách về Machine Learning',
        requester: 'Thủ thư Nguyễn Văn A',
        requestDate: '2024-01-15',
        status: 'pending',
        priority: 'high',
        estimatedCost: 2500000,
        description: 'Cần bổ sung 20 cuốn sách về Machine Learning và AI để phục vụ sinh viên CNTT',
        books: [
          { title: 'Machine Learning Basics', author: 'Andrew Ng', quantity: 5, price: 150000 },
          { title: 'Deep Learning', author: 'Ian Goodfellow', quantity: 3, price: 200000 },
          { title: 'AI Fundamentals', author: 'Stuart Russell', quantity: 4, price: 180000 },
          { title: 'Neural Networks', author: 'Michael Nielsen', quantity: 3, price: 120000 },
          { title: 'Data Science Handbook', author: 'Jake VanderPlas', quantity: 5, price: 160000 }
        ]
      },
      {
        id: 2,
        title: 'Thay thế sách cũ về Kinh tế',
        requester: 'Trưởng kho Lê Thị B',
        requestDate: '2024-01-14',
        status: 'approved',
        priority: 'medium',
        estimatedCost: 1800000,
        description: 'Thay thế 15 cuốn sách cũ về Kinh tế học bằng phiên bản mới nhất',
        books: [
          { title: 'Principles of Economics', author: 'N. Gregory Mankiw', quantity: 5, price: 120000 },
          { title: 'Microeconomics', author: 'Robert Pindyck', quantity: 4, price: 110000 },
          { title: 'Macroeconomics', author: 'Olivier Blanchard', quantity: 3, price: 130000 },
          { title: 'Economic Analysis', author: 'Hal Varian', quantity: 3, price: 140000 }
        ]
      },
      {
        id: 3,
        title: 'Bổ sung sách Văn học Việt Nam',
        requester: 'Nhân viên kho Trần Văn C',
        requestDate: '2024-01-13',
        status: 'rejected',
        priority: 'low',
        estimatedCost: 1200000,
        description: 'Bổ sung sách văn học Việt Nam hiện đại cho kho sách',
        books: [
          { title: 'Truyện Kiều', author: 'Nguyễn Du', quantity: 3, price: 80000 },
          { title: 'Chí Phèo', author: 'Nam Cao', quantity: 4, price: 60000 },
          { title: 'Số Đỏ', author: 'Vũ Trọng Phụng', quantity: 3, price: 70000 },
          { title: 'Tắt Đèn', author: 'Ngô Tất Tố', quantity: 3, price: 65000 }
        ]
      }
    ];

    setTimeout(() => {
      setProposals(mockProposals);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proposal.requester.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || proposal.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: 'Chờ duyệt', class: 'status-pending' },
      approved: { text: 'Đã duyệt', class: 'status-approved' },
      rejected: { text: 'Từ chối', class: 'status-rejected' }
    };
    const config = statusConfig[status] || { text: status, class: 'status-default' };
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { text: 'Cao', class: 'priority-high' },
      medium: { text: 'Trung bình', class: 'priority-medium' },
      low: { text: 'Thấp', class: 'priority-low' }
    };
    const config = priorityConfig[priority] || { text: priority, class: 'priority-default' };
    return <span className={`priority-badge ${config.class}`}>{config.text}</span>;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleApprove = (id) => {
    setProposals(prev => prev.map(p => 
      p.id === id ? { ...p, status: 'approved' } : p
    ));
  };

  const handleReject = (id) => {
    setProposals(prev => prev.map(p => 
      p.id === id ? { ...p, status: 'rejected' } : p
    ));
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
    <div className="purchase-proposals">
      <div className="page-header">
        <h1><FaFileAlt /> Đề xuất mua sách</h1>
        <p>Quản lý và xét duyệt các đề xuất bổ sung sách mới</p>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">
            <FaFileAlt />
          </div>
          <div className="stat-content">
            <h3>Tổng đề xuất</h3>
            <div className="stat-value">{proposals.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaCheck />
          </div>
          <div className="stat-content">
            <h3>Đã duyệt</h3>
            <div className="stat-value">{proposals.filter(p => p.status === 'approved').length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaTimes />
          </div>
          <div className="stat-content">
            <h3>Từ chối</h3>
            <div className="stat-value">{proposals.filter(p => p.status === 'rejected').length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaFileAlt />
          </div>
          <div className="stat-content">
            <h3>Chờ duyệt</h3>
            <div className="stat-value">{proposals.filter(p => p.status === 'pending').length}</div>
          </div>
        </div>
      </div>

      <div className="controls-section">
        <div className="search-section">
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề hoặc người đề xuất..."
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
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
          </select>
        </div>

        <div className="action-buttons">
          <button className="btn-primary">
            <FaPlus /> Tạo đề xuất mới
          </button>
        </div>
      </div>

      <div className="proposals-grid">
        {filteredProposals.map(proposal => (
          <div key={proposal.id} className="proposal-card">
            <div className="proposal-header">
              <div className="proposal-title">
                <h3>{proposal.title}</h3>
                <div className="proposal-badges">
                  {getStatusBadge(proposal.status)}
                  {getPriorityBadge(proposal.priority)}
                </div>
              </div>
              <div className="proposal-actions">
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

            <div className="proposal-info">
              <div className="info-row">
                <span className="info-label">Người đề xuất:</span>
                <span className="info-value">{proposal.requester}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Ngày đề xuất:</span>
                <span className="info-value">{proposal.requestDate}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Chi phí dự kiến:</span>
                <span className="info-value cost">{formatCurrency(proposal.estimatedCost)}</span>
              </div>
            </div>

            <div className="proposal-description">
              <p>{proposal.description}</p>
            </div>

            <div className="books-summary">
              <h4>Danh sách sách ({proposal.books.length} cuốn):</h4>
              <div className="books-list">
                {proposal.books.slice(0, 3).map((book, index) => (
                  <div key={index} className="book-item">
                    <span className="book-title">{book.title}</span>
                    <span className="book-quantity">x{book.quantity}</span>
                  </div>
                ))}
                {proposal.books.length > 3 && (
                  <div className="more-books">
                    +{proposal.books.length - 3} cuốn khác
                  </div>
                )}
              </div>
            </div>

            {proposal.status === 'pending' && (
              <div className="proposal-actions-footer">
                <button 
                  className="btn-approve"
                  onClick={() => handleApprove(proposal.id)}
                >
                  <FaCheck /> Duyệt
                </button>
                <button 
                  className="btn-reject"
                  onClick={() => handleReject(proposal.id)}
                >
                  <FaTimes /> Từ chối
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredProposals.length === 0 && (
        <div className="empty-state">
          <FaFileAlt />
          <p>Không tìm thấy đề xuất nào phù hợp</p>
        </div>
      )}
    </div>
  );
};

export default PurchaseProposals; 