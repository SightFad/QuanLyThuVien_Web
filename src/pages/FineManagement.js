import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaDownload, 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaMoneyBillWave,
  FaCalendarAlt,
  FaUser,
  FaBook,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaPrint,
  FaFileAlt,
  FaChartBar
} from 'react-icons/fa';
import FineReceiptModal from '../components/FineReceiptModal';
import './FineManagement.css';

const FineManagement = () => {
  const [fines, setFines] = useState([]);
  const [filteredFines, setFilteredFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFine, setSelectedFine] = useState(null);
  const [showFineModal, setShowFineModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock data for demonstration
  const mockFines = [
    {
      id: 'F001',
      memberId: '6518631565612AB',
      memberName: 'Nguyễn Văn A',
      bookTitle: 'Đắc Nhân Tâm',
      fineType: 'overdue',
      fineAmount: 25000,
      dueDate: '2024-01-15',
      returnDate: '2024-01-20',
      paymentDate: '2024-01-21',
      paymentMethod: 'cash',
      status: 'paid',
      reason: 'Trả sách trễ 5 ngày',
      processedBy: 'Thủ thư Nguyễn Thị B',
      notes: 'Độc giả đã thanh toán đầy đủ'
    },
    {
      id: 'F002',
      memberId: '789456123DEF',
      memberName: 'Trần Thị B',
      bookTitle: 'Nhà Giả Kim',
      fineType: 'damaged',
      fineAmount: 200000,
      dueDate: '2024-01-10',
      returnDate: '2024-01-12',
      paymentDate: null,
      paymentMethod: null,
      status: 'pending',
      reason: 'Sách bị hư hỏng',
      processedBy: 'Thủ thư Lê Văn C',
      notes: 'Cần liên hệ độc giả để thanh toán'
    },
    {
      id: 'F003',
      memberId: '456789ABC123',
      memberName: 'Lê Văn C',
      bookTitle: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
      fineType: 'lost',
      fineAmount: 500000,
      dueDate: '2024-01-05',
      returnDate: null,
      paymentDate: '2024-01-18',
      paymentMethod: 'transfer',
      status: 'paid',
      reason: 'Mất sách',
      processedBy: 'Thủ thư Phạm Thị D',
      notes: 'Độc giả đã bồi thường đầy đủ'
    },
    {
      id: 'F004',
      memberId: '123456789XYZ',
      memberName: 'Phạm Thị D',
      bookTitle: 'Sách Giáo Khoa Toán 12',
      fineType: 'overdue',
      fineAmount: 15000,
      dueDate: '2024-01-18',
      returnDate: '2024-01-21',
      paymentDate: null,
      paymentMethod: null,
      status: 'pending',
      reason: 'Trả sách trễ 3 ngày',
      processedBy: 'Thủ thư Nguyễn Văn A',
      notes: 'Chờ thanh toán'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFines(mockFines);
      setFilteredFines(mockFines);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterFines();
  }, [searchTerm, statusFilter, dateFilter, fines]);

  const filterFines = () => {
    let filtered = fines;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(fine =>
        fine.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fine.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fine.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fine.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(fine => fine.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const today = new Date();
      const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
      const sevenDaysAgo = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));

      filtered = filtered.filter(fine => {
        const fineDate = new Date(fine.returnDate || fine.dueDate);
        switch (dateFilter) {
          case 'today':
            return fineDate.toDateString() === today.toDateString();
          case 'week':
            return fineDate >= sevenDaysAgo;
          case 'month':
            return fineDate >= thirtyDaysAgo;
          default:
            return true;
        }
      });
    }

    setFilteredFines(filtered);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: 'Chờ thanh toán', class: 'status-pending', icon: <FaClock /> },
      paid: { text: 'Đã thanh toán', class: 'status-paid', icon: <FaCheckCircle /> },
      overdue: { text: 'Quá hạn', class: 'status-overdue', icon: <FaExclamationTriangle /> }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`status-badge ${config.class}`}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  const getFineTypeIcon = (type) => {
    const typeConfig = {
      overdue: <FaClock />,
      damaged: <FaExclamationTriangle />,
      lost: <FaBook />
    };
    return typeConfig[type] || <FaMoneyBillWave />;
  };

  const getFineTypeText = (type) => {
    const typeConfig = {
      overdue: 'Trễ hạn',
      damaged: 'Hư hỏng',
      lost: 'Mất sách'
    };
    return typeConfig[type] || 'Khác';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleViewFine = (fine) => {
    setSelectedFine(fine);
    setShowFineModal(true);
  };

  const handleEditFine = (fine) => {
    // Implement edit functionality
    console.log('Edit fine:', fine);
  };

  const handleDeleteFine = (fineId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phiếu phạt này?')) {
      setFines(fines.filter(fine => fine.id !== fineId));
    }
  };

  const handleCreateFine = (fineData) => {
    const newFine = {
      id: `F${String(fines.length + 1).padStart(3, '0')}`,
      memberId: fineData.memberId,
      memberName: fineData.memberName,
      bookTitle: 'N/A',
      fineType: 'custom',
      fineAmount: fineData.totalAmount,
      dueDate: new Date().toISOString().split('T')[0],
      returnDate: new Date().toISOString().split('T')[0],
      paymentDate: fineData.paymentDate,
      paymentMethod: fineData.paymentMethod,
      status: 'paid',
      reason: 'Phí phạt tùy chỉnh',
      processedBy: 'Hệ thống',
      notes: fineData.notes
    };
    setFines([newFine, ...fines]);
    setShowCreateModal(false);
    alert('✅ Đã tạo phiếu thu phí phạt thành công!');
  };

  const handleExportData = () => {
    // Implement export functionality
    console.log('Exporting fines data...');
  };

  const getStatistics = () => {
    const totalFines = fines.length;
    const paidFines = fines.filter(fine => fine.status === 'paid').length;
    const pendingFines = fines.filter(fine => fine.status === 'pending').length;
    const totalAmount = fines.reduce((sum, fine) => sum + fine.fineAmount, 0);
    const paidAmount = fines
      .filter(fine => fine.status === 'paid')
      .reduce((sum, fine) => sum + fine.fineAmount, 0);

    return {
      totalFines,
      paidFines,
      pendingFines,
      totalAmount,
      paidAmount
    };
  };

  const stats = getStatistics();

  if (loading) {
    return (
      <div className="fine-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải dữ liệu phiếu phạt...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fine-management">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <FaMoneyBillWave />
            Quản Lý Phiếu Thu Phí Phạt
          </h1>
          <p className="page-description">
            Quản lý và theo dõi các khoản phí phạt từ việc mượn trả sách
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            <FaPlus />
            Tạo Phiếu Phạt
          </button>
          <button className="btn btn-secondary" onClick={handleExportData}>
            <FaDownload />
            Xuất Báo Cáo
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">
            <FaFileAlt />
          </div>
          <div className="stat-content">
            <h3>{stats.totalFines}</h3>
            <p>Tổng phiếu phạt</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon paid">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <h3>{stats.paidFines}</h3>
            <p>Đã thanh toán</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pending">
            <FaClock />
          </div>
          <div className="stat-content">
            <h3>{stats.pendingFines}</h3>
            <p>Chờ thanh toán</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amount">
            <FaMoneyBillWave />
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(stats.totalAmount)}</h3>
            <p>Tổng tiền phạt</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="controls-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, mã độc giả, tên sách..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <button 
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter />
            Bộ lọc
          </button>
          
          {showFilters && (
            <div className="filter-panel">
              <div className="filter-group">
                <label>Trạng thái:</label>
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">Tất cả</option>
                  <option value="pending">Chờ thanh toán</option>
                  <option value="paid">Đã thanh toán</option>
                  <option value="overdue">Quá hạn</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label>Thời gian:</label>
                <select 
                  value={dateFilter} 
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">Tất cả</option>
                  <option value="today">Hôm nay</option>
                  <option value="week">Tuần này</option>
                  <option value="month">Tháng này</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fines Table */}
      <div className="fines-table-container">
        <div className="table-header">
          <h3>Danh sách phiếu phạt ({filteredFines.length})</h3>
        </div>
        
        {filteredFines.length === 0 ? (
          <div className="empty-state">
            <FaFileAlt />
            <h3>Không có phiếu phạt nào</h3>
            <p>Không tìm thấy phiếu phạt nào phù hợp với bộ lọc hiện tại</p>
          </div>
        ) : (
          <div className="fines-table">
            <table>
              <thead>
                <tr>
                  <th>Mã phiếu</th>
                  <th>Độc giả</th>
                  <th>Sách</th>
                  <th>Loại phạt</th>
                  <th>Số tiền</th>
                  <th>Ngày hẹn trả</th>
                  <th>Ngày trả</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredFines.map(fine => (
                  <tr key={fine.id} className={`fine-row ${fine.status}`}>
                    <td>
                      <span className="fine-id">{fine.id}</span>
                    </td>
                    <td>
                      <div className="member-info">
                        <div className="member-name">{fine.memberName}</div>
                        <div className="member-id">{fine.memberId}</div>
                      </div>
                    </td>
                    <td>
                      <div className="book-info">
                        <div className="book-title">{fine.bookTitle}</div>
                      </div>
                    </td>
                    <td>
                      <div className="fine-type">
                        {getFineTypeIcon(fine.fineType)}
                        <span>{getFineTypeText(fine.fineType)}</span>
                      </div>
                    </td>
                    <td>
                      <span className="fine-amount">{formatCurrency(fine.fineAmount)}</span>
                    </td>
                    <td>
                      <span className="date-info">{formatDate(fine.dueDate)}</span>
                    </td>
                    <td>
                      <span className="date-info">{formatDate(fine.returnDate)}</span>
                    </td>
                    <td>
                      {getStatusBadge(fine.status)}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-action view"
                          onClick={() => handleViewFine(fine)}
                          title="Xem chi tiết"
                        >
                          <FaEye />
                        </button>
                        <button 
                          className="btn-action edit"
                          onClick={() => handleEditFine(fine)}
                          title="Chỉnh sửa"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="btn-action delete"
                          onClick={() => handleDeleteFine(fine.id)}
                          title="Xóa"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Fine Detail Modal */}
      {showFineModal && selectedFine && (
        <div className="modal-overlay" onClick={() => setShowFineModal(false)}>
          <div className="modal fine-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chi tiết phiếu phạt #{selectedFine.id}</h2>
              <button className="modal-close" onClick={() => setShowFineModal(false)}>
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <div className="detail-grid">
                <div className="detail-section">
                  <h3>Thông tin độc giả</h3>
                  <div className="detail-item">
                    <span className="label">Họ tên:</span>
                    <span className="value">{selectedFine.memberName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Mã độc giả:</span>
                    <span className="value">{selectedFine.memberId}</span>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3>Thông tin sách</h3>
                  <div className="detail-item">
                    <span className="label">Tên sách:</span>
                    <span className="value">{selectedFine.bookTitle}</span>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3>Chi tiết phạt</h3>
                  <div className="detail-item">
                    <span className="label">Loại phạt:</span>
                    <span className="value">
                      {getFineTypeIcon(selectedFine.fineType)}
                      {getFineTypeText(selectedFine.fineType)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Số tiền:</span>
                    <span className="value amount">{formatCurrency(selectedFine.fineAmount)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Lý do:</span>
                    <span className="value">{selectedFine.reason}</span>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3>Thời gian</h3>
                  <div className="detail-item">
                    <span className="label">Ngày hẹn trả:</span>
                    <span className="value">{formatDate(selectedFine.dueDate)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Ngày trả thực tế:</span>
                    <span className="value">{formatDate(selectedFine.returnDate)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Ngày thanh toán:</span>
                    <span className="value">{formatDate(selectedFine.paymentDate)}</span>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3>Thanh toán</h3>
                  <div className="detail-item">
                    <span className="label">Trạng thái:</span>
                    <span className="value">{getStatusBadge(selectedFine.status)}</span>
                  </div>
                  {selectedFine.paymentMethod && (
                    <div className="detail-item">
                      <span className="label">Hình thức:</span>
                      <span className="value">
                        {selectedFine.paymentMethod === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="detail-section full-width">
                  <h3>Ghi chú</h3>
                  <div className="detail-item">
                    <span className="label">Xử lý bởi:</span>
                    <span className="value">{selectedFine.processedBy}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Ghi chú:</span>
                    <span className="value">{selectedFine.notes || 'Không có ghi chú'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowFineModal(false)}>
                Đóng
              </button>
              <button className="btn btn-primary" onClick={() => handleEditFine(selectedFine)}>
                <FaEdit />
                Chỉnh sửa
              </button>
              <button className="btn btn-secondary">
                <FaPrint />
                In phiếu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fine Receipt Modal */}
      {showCreateModal && (
        <FineReceiptModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          fineData={{
            memberId: '',
            memberName: '',
            totalAmount: 0,
            breakdown: []
          }}
          onSubmit={handleCreateFine}
        />
      )}
    </div>
  );
};

export default FineManagement; 