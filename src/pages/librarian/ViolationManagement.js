import React, { useState, useEffect } from 'react';
import { 
  FaExclamationTriangle, 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaPrint, 
  FaFileAlt, 
  FaCalendarAlt,
  FaUser,
  FaBook,
  FaMoneyBillWave,
  FaChartBar,
  FaPlus,
  FaCheckCircle,
  FaTimes,
  FaClock,
  FaBan
} from 'react-icons/fa';
import { useToast } from '../../hooks';
import './ViolationManagement.css';

const ViolationManagement = () => {
    const [violations, setViolations] = useState([]);
  const [filteredViolations, setFilteredViolations] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [violationTypeFilter, setViolationTypeFilter] = useState('all');
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStatisticsModal, setShowStatisticsModal] = useState(false);
    const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ fromDate: null, toDate: null });
  
    const { showToast } = useToast();

  // Form states for creating new violation
  const [newViolation, setNewViolation] = useState({
    maDG: '',
    tenDG: '',
        maSach: '',
        tenSach: '',
        loaiViPham: '',
    soNgayTre: 0,
    moTaViPham: '',
    mucDoViPham: '',
    tienPhat: 0,
    trangThai: 'Chưa xử lý',
    ghiChu: ''
  });

  // Mock data for demonstration
  const mockViolations = [
    {
      id: 1,
      maDG: 'DG001',
      tenDG: 'Nguyễn Văn A',
      maSach: 'S001',
      tenSach: 'Sách Giáo Khoa Toán 12',
      loaiViPham: 'Trả trễ',
      soNgayTre: 5,
      moTaViPham: 'Trả sách trễ 5 ngày',
      mucDoViPham: 'Trung bình',
      tienPhat: 25000,
      trangThai: 'Đã xử lý',
      ngayViPham: '2024-01-15',
      ngayXuLy: '2024-01-20',
      nguoiXuLy: 'Thủ thư Nguyễn Thị B',
      ghiChu: 'Độc giả đã thanh toán đầy đủ'
    },
    {
      id: 2,
      maDG: 'DG002',
      tenDG: 'Trần Thị C',
      maSach: 'S002',
      tenSach: 'Sách Văn Học Việt Nam',
      loaiViPham: 'Hư hỏng',
      soNgayTre: 0,
      moTaViPham: 'Sách bị rách trang 15-20',
      mucDoViPham: 'Nhẹ',
      tienPhat: 15000,
      trangThai: 'Chưa xử lý',
      ngayViPham: '2024-01-18',
      ngayXuLy: null,
      nguoiXuLy: null,
      ghiChu: 'Chờ độc giả bồi thường'
    },
    {
      id: 3,
      maDG: 'DG003',
      tenDG: 'Lê Văn D',
      maSach: 'S003',
      tenSach: 'Sách Lịch Sử Thế Giới',
      loaiViPham: 'Mất sách',
      soNgayTre: 0,
      moTaViPham: 'Độc giả báo mất sách',
      mucDoViPham: 'Nặng',
      tienPhat: 150000,
      trangThai: 'Đã phạt',
      ngayViPham: '2024-01-10',
      ngayXuLy: '2024-01-25',
      nguoiXuLy: 'Thủ thư Nguyễn Thị B',
      ghiChu: 'Độc giả đã bồi thường 150% giá trị sách'
    }
  ];

    useEffect(() => {
        loadViolations();
        loadStatistics();
    }, []);

  useEffect(() => {
    filterViolations();
  }, [searchTerm, statusFilter, violationTypeFilter, violations]);

    const loadViolations = async () => {
        try {
            setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setViolations(mockViolations);
        setFilteredViolations(mockViolations);
        setLoading(false);
      }, 1000);
        } catch (error) {
      showToast('Lỗi khi tải danh sách vi phạm', 'error');
            setLoading(false);
        }
    };

    const loadStatistics = async () => {
        try {
      const stats = {
        totalViolations: mockViolations.length,
        pendingViolations: mockViolations.filter(v => v.trangThai === 'Chưa xử lý').length,
        processedViolations: mockViolations.filter(v => v.trangThai === 'Đã xử lý').length,
        finedViolations: mockViolations.filter(v => v.trangThai === 'Đã phạt').length,
        totalFines: mockViolations.reduce((sum, v) => sum + v.tienPhat, 0),
        collectedFines: mockViolations
          .filter(v => v.trangThai === 'Đã phạt')
          .reduce((sum, v) => sum + v.tienPhat, 0)
      };
      setStatistics(stats);
        } catch (error) {
      showToast('Lỗi khi tải thống kê', 'error');
    }
  };

  const filterViolations = () => {
    let filtered = violations;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(violation =>
        violation.tenDG?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        violation.maDG?.toString().includes(searchTerm) ||
        violation.tenSach?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        violation.maSach?.toString().includes(searchTerm)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(violation => violation.trangThai === statusFilter);
    }

    // Filter by violation type
    if (violationTypeFilter !== 'all') {
      filtered = filtered.filter(violation => violation.loaiViPham === violationTypeFilter);
    }

    setFilteredViolations(filtered);
  };

  const handleCreateViolation = async () => {
    try {
      const newViolationData = {
        ...newViolation,
        id: violations.length + 1,
        ngayViPham: new Date().toISOString().split('T')[0],
        ngayXuLy: null,
        nguoiXuLy: null
      };

      setViolations([newViolationData, ...violations]);
      setShowCreateModal(false);
      resetNewViolationForm();
      showToast('Đã tạo báo cáo vi phạm thành công!', 'success');
        } catch (error) {
      showToast('Lỗi khi tạo báo cáo vi phạm', 'error');
    }
  };

  const handleProcessViolation = async (violationId) => {
    try {
      setViolations(prev => 
        prev.map(v => 
          v.id === violationId 
            ? { 
                ...v, 
                trangThai: 'Đã xử lý',
                ngayXuLy: new Date().toISOString().split('T')[0],
                nguoiXuLy: 'Thủ thư hiện tại'
              }
            : v
        )
      );
      showToast('Đã xử lý vi phạm thành công!', 'success');
            } catch (error) {
      showToast('Lỗi khi xử lý vi phạm', 'error');
    }
  };

  const handleFineViolation = async (violationId) => {
    try {
      setViolations(prev => 
        prev.map(v => 
          v.id === violationId 
            ? { 
                ...v, 
                trangThai: 'Đã phạt',
                ngayXuLy: new Date().toISOString().split('T')[0],
                nguoiXuLy: 'Thủ thư hiện tại'
              }
            : v
        )
      );
      showToast('Đã phạt vi phạm thành công!', 'success');
        } catch (error) {
      showToast('Lỗi khi phạt vi phạm', 'error');
    }
  };

  const resetNewViolationForm = () => {
    setNewViolation({
      maDG: '',
      tenDG: '',
      maSach: '',
      tenSach: '',
      loaiViPham: '',
      soNgayTre: 0,
      moTaViPham: '',
      mucDoViPham: '',
      tienPhat: 0,
      trangThai: 'Chưa xử lý',
      ghiChu: ''
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Chưa xử lý': { class: 'status-pending', icon: <FaClock />, text: 'Chưa xử lý' },
      'Đã xử lý': { class: 'status-processed', icon: <FaCheckCircle />, text: 'Đã xử lý' },
      'Đã phạt': { class: 'status-fined', icon: <FaMoneyBillWave />, text: 'Đã phạt' }
    };

    const config = statusConfig[status] || statusConfig['Chưa xử lý'];
    return (
      <span className={`status-badge ${config.class}`}>
        {config.icon} {config.text}
      </span>
    );
  };

  const getViolationTypeBadge = (type) => {
    const typeConfig = {
      'Trả trễ': { class: 'type-late', icon: <FaClock /> },
      'Hư hỏng': { class: 'type-damage', icon: <FaExclamationTriangle /> },
      'Mất': { class: 'type-lost', icon: <FaBan /> }
    };

    const config = typeConfig[type] || typeConfig['Trả trễ'];
    return (
      <span className={`violation-type-badge ${config.class}`}>
        {config.icon} {type}
      </span>
    );
  };

  const getSeverityBadge = (severity) => {
    const severityConfig = {
      'Nhẹ': { class: 'severity-light', color: '#27ae60' },
      'Trung bình': { class: 'severity-medium', color: '#f39c12' },
      'Nặng': { class: 'severity-heavy', color: '#e74c3c' }
    };

    const config = severityConfig[severity] || severityConfig['Trung bình'];
    return (
      <span className={`severity-badge ${config.class}`} style={{ backgroundColor: config.color }}>
        {severity}
      </span>
    );
  };

  const calculateFine = (violationType, severity, daysLate = 0) => {
    const baseRates = {
      'Trả trễ': 5000, // 5000 VND/ngày
      'Hư hỏng': {
        'Nhẹ': 0.3, // 30% giá trị sách
        'Trung bình': 0.7, // 70% giá trị sách
        'Nặng': 1.5 // 150% giá trị sách
      },
      'Mất': 1.5 // 150% giá trị sách
    };

    if (violationType === 'Trả trễ') {
      return daysLate * baseRates['Trả trễ'];
    } else if (violationType === 'Hư hỏng') {
      const bookValue = 50000; // Giá trị sách mặc định
      return bookValue * baseRates['Hư hỏng'][severity];
    } else if (violationType === 'Mất') {
      const bookValue = 50000; // Giá trị sách mặc định
      return bookValue * baseRates['Mất'];
    }

    return 0;
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

  const exportViolationReport = () => {
    // Implement export functionality
    showToast('Đang xuất báo cáo vi phạm...', 'info');
    };

    if (loading) {
        return (
            <div className="violation-management">
        <div className="loading-spinner">Đang tải...</div>
            </div>
        );
    }

    return (
        <div className="violation-management">
      {/* Header */}
            <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <FaExclamationTriangle />
            Quản Lý Vi Phạm
          </h1>
          <p className="page-description">
            Quản lý và theo dõi các vi phạm của độc giả
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            <FaPlus />
            Tạo Báo Cáo Vi Phạm
          </button>
          <button className="btn btn-secondary" onClick={() => setShowStatisticsModal(true)}>
            <FaChartBar />
            Thống Kê
          </button>
          <button className="btn btn-outline" onClick={exportViolationReport}>
            <FaPrint />
            Xuất Báo Cáo
                </button>
        </div>
            </div>

            {/* Statistics Cards */}
      <div className="stats-grid">
                <div className="stat-card">
          <div className="stat-icon">
            <FaExclamationTriangle />
          </div>
          <div className="stat-content">
            <h3>Tổng vi phạm</h3>
            <p className="stat-number">{statistics?.totalViolations || 0}</p>
                </div>
                </div>

                <div className="stat-card">
          <div className="stat-icon">
            <FaClock />
                </div>
          <div className="stat-content">
                    <h3>Chưa xử lý</h3>
            <p className="stat-number">{statistics?.pendingViolations || 0}</p>
          </div>
                </div>

                <div className="stat-card">
          <div className="stat-icon">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
                    <h3>Đã xử lý</h3>
            <p className="stat-number">{statistics?.processedViolations || 0}</p>
          </div>
                </div>

                <div className="stat-card">
          <div className="stat-icon">
            <FaMoneyBillWave />
          </div>
          <div className="stat-content">
                    <h3>Tổng tiền phạt</h3>
            <p className="stat-number">{formatCurrency(statistics?.totalFines || 0)}</p>
          </div>
                </div>
            </div>

      {/* Search and Filters */}
      <div className="search-filters">
        <div className="search-box">
          <FaSearch />
                    <input
                        type="text"
            placeholder="Tìm kiếm theo tên độc giả, mã sách..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
        </div>

        <div className="filters">
                    <select
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
                    >
            <option value="all">Tất cả trạng thái</option>
                        <option value="Chưa xử lý">Chưa xử lý</option>
                        <option value="Đã xử lý">Đã xử lý</option>
                        <option value="Đã phạt">Đã phạt</option>
                    </select>

                    <select
            value={violationTypeFilter} 
            onChange={(e) => setViolationTypeFilter(e.target.value)}
                    >
            <option value="all">Tất cả loại vi phạm</option>
                        <option value="Trả trễ">Trả trễ</option>
                        <option value="Hư hỏng">Hư hỏng</option>
                        <option value="Mất">Mất</option>
                    </select>
                </div>
            </div>

      {/* Violations Table */}
      <div className="violations-table">
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Độc giả</th>
              <th>Sách</th>
              <th>Loại vi phạm</th>
              <th>Mức độ</th>
              <th>Tiền phạt</th>
              <th>Trạng thái</th>
              <th>Ngày vi phạm</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredViolations.map((violation, index) => (
              <tr key={violation.id}>
                <td>{index + 1}</td>
                <td>
                  <div className="member-info">
                    <span className="member-name">{violation.tenDG}</span>
                    <span className="member-id">({violation.maDG})</span>
                  </div>
                </td>
                <td>
                  <div className="book-info">
                    <span className="book-title">{violation.tenSach}</span>
                    <span className="book-id">({violation.maSach})</span>
                  </div>
                </td>
                <td>{getViolationTypeBadge(violation.loaiViPham)}</td>
                <td>{getSeverityBadge(violation.mucDoViPham)}</td>
                <td className="fine-amount">{formatCurrency(violation.tienPhat)}</td>
                <td>{getStatusBadge(violation.trangThai)}</td>
                <td>{formatDate(violation.ngayViPham)}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-icon" 
                      title="Xem chi tiết"
                      onClick={() => {
                        setSelectedViolation(violation);
                        setShowDetailModal(true);
                      }}
                    >
                      <FaEye />
                    </button>
                    
                    {violation.trangThai === 'Chưa xử lý' && (
                      <>
                        <button 
                          className="btn-icon btn-success" 
                          title="Xử lý vi phạm"
                          onClick={() => handleProcessViolation(violation.id)}
                        >
                          <FaCheckCircle />
                        </button>
                        <button 
                          className="btn-icon btn-warning" 
                          title="Phạt vi phạm"
                          onClick={() => handleFineViolation(violation.id)}
                        >
                          <FaMoneyBillWave />
                        </button>
                      </>
                    )}
                    
                    <button className="btn-icon" title="Chỉnh sửa">
                      <FaEdit />
                    </button>
                    <button className="btn-icon btn-danger" title="Xóa">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Violation Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Tạo Báo Cáo Vi Phạm</h2>
              <button 
                className="btn-close"
                onClick={() => setShowCreateModal(false)}
              >
                <FaTimes />
                        </button>
                    </div>
            <div className="modal-body">
                        <div className="form-grid">
                            <div className="form-group">
                  <label>Mã độc giả:</label>
                  <input
                    type="text"
                    value={newViolation.maDG}
                    onChange={(e) => setNewViolation(prev => ({ ...prev, maDG: e.target.value }))}
                    placeholder="Nhập mã độc giả"
                  />
                </div>
                
                <div className="form-group">
                  <label>Tên độc giả:</label>
                                <input
                    type="text"
                    value={newViolation.tenDG}
                    onChange={(e) => setNewViolation(prev => ({ ...prev, tenDG: e.target.value }))}
                    placeholder="Nhập tên độc giả"
                                />
                            </div>
                
                            <div className="form-group">
                                <label>Mã sách:</label>
                                <input
                                    type="text"
                    value={newViolation.maSach}
                    onChange={(e) => setNewViolation(prev => ({ ...prev, maSach: e.target.value }))}
                    placeholder="Nhập mã sách"
                                />
                            </div>
                
                            <div className="form-group">
                                <label>Tên sách:</label>
                                <input
                                    type="text"
                    value={newViolation.tenSach}
                    onChange={(e) => setNewViolation(prev => ({ ...prev, tenSach: e.target.value }))}
                    placeholder="Nhập tên sách"
                                />
                            </div>
                
                            <div className="form-group">
                                <label>Loại vi phạm:</label>
                                <select
                    value={newViolation.loaiViPham}
                    onChange={(e) => setNewViolation(prev => ({ ...prev, loaiViPham: e.target.value }))}
                                >
                                    <option value="">Chọn loại vi phạm</option>
                                    <option value="Trả trễ">Trả trễ</option>
                                    <option value="Hư hỏng">Hư hỏng</option>
                                    <option value="Mất">Mất</option>
                                </select>
                            </div>
                
                            <div className="form-group">
                  <label>Số ngày trễ:</label>
                                <input
                    type="number"
                    value={newViolation.soNgayTre}
                    onChange={(e) => setNewViolation(prev => ({ ...prev, soNgayTre: parseInt(e.target.value) || 0 }))}
                    placeholder="Số ngày trễ"
                                />
                            </div>
                
                            <div className="form-group">
                  <label>Mức độ vi phạm:</label>
                  <select
                    value={newViolation.mucDoViPham}
                    onChange={(e) => setNewViolation(prev => ({ ...prev, mucDoViPham: e.target.value }))}
                  >
                    <option value="">Chọn mức độ</option>
                    <option value="Nhẹ">Nhẹ</option>
                    <option value="Trung bình">Trung bình</option>
                    <option value="Nặng">Nặng</option>
                  </select>
                            </div>
                
                            <div className="form-group">
                  <label>Tiền phạt:</label>
                                <input
                                    type="number"
                    value={newViolation.tienPhat}
                    onChange={(e) => setNewViolation(prev => ({ ...prev, tienPhat: parseInt(e.target.value) || 0 }))}
                    placeholder="Tiền phạt"
                                />
                            </div>
                        </div>
              
              <div className="form-group">
                <label>Mô tả vi phạm:</label>
                            <textarea
                  value={newViolation.moTaViPham}
                  onChange={(e) => setNewViolation(prev => ({ ...prev, moTaViPham: e.target.value }))}
                  placeholder="Mô tả chi tiết vi phạm"
                                rows="3"
                            />
                        </div>
              
              <div className="form-group">
                <label>Ghi chú:</label>
                <textarea
                  value={newViolation.ghiChu}
                  onChange={(e) => setNewViolation(prev => ({ ...prev, ghiChu: e.target.value }))}
                  placeholder="Ghi chú bổ sung"
                  rows="2"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowCreateModal(false)}
              >
                Hủy
                            </button>
                            <button 
                className="btn btn-primary"
                onClick={handleCreateViolation}
              >
                Tạo báo cáo
                            </button>
                        </div>
          </div>
                </div>
            )}

      {/* Violation Detail Modal */}
      {showDetailModal && selectedViolation && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Chi Tiết Vi Phạm</h2>
                                        <button
                className="btn-close"
                onClick={() => setShowDetailModal(false)}
              >
                <FaTimes />
                                        </button>
                                    </div>
            <div className="modal-body">
              <div className="violation-detail">
                <div className="detail-section">
                  <h3>Thông tin độc giả</h3>
                  <div className="detail-row">
                    <span className="label">Mã độc giả:</span>
                    <span className="value">{selectedViolation.maDG}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Tên độc giả:</span>
                    <span className="value">{selectedViolation.tenDG}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Thông tin sách</h3>
                  <div className="detail-row">
                    <span className="label">Mã sách:</span>
                    <span className="value">{selectedViolation.maSach}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Tên sách:</span>
                    <span className="value">{selectedViolation.tenSach}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Thông tin vi phạm</h3>
                  <div className="detail-row">
                    <span className="label">Loại vi phạm:</span>
                    <span className="value">{getViolationTypeBadge(selectedViolation.loaiViPham)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Mức độ:</span>
                    <span className="value">{getSeverityBadge(selectedViolation.mucDoViPham)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Số ngày trễ:</span>
                    <span className="value">{selectedViolation.soNgayTre} ngày</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Tiền phạt:</span>
                    <span className="value fine-amount">{formatCurrency(selectedViolation.tienPhat)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Mô tả:</span>
                    <span className="value">{selectedViolation.moTaViPham}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Trạng thái xử lý</h3>
                  <div className="detail-row">
                    <span className="label">Trạng thái:</span>
                    <span className="value">{getStatusBadge(selectedViolation.trangThai)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Ngày vi phạm:</span>
                    <span className="value">{formatDate(selectedViolation.ngayViPham)}</span>
                  </div>
                  {selectedViolation.ngayXuLy && (
                    <div className="detail-row">
                      <span className="label">Ngày xử lý:</span>
                      <span className="value">{formatDate(selectedViolation.ngayXuLy)}</span>
                    </div>
                  )}
                  {selectedViolation.nguoiXuLy && (
                    <div className="detail-row">
                      <span className="label">Người xử lý:</span>
                      <span className="value">{selectedViolation.nguoiXuLy}</span>
                    </div>
                  )}
                  {selectedViolation.ghiChu && (
                    <div className="detail-row">
                      <span className="label">Ghi chú:</span>
                      <span className="value">{selectedViolation.ghiChu}</span>
                    </div>
                )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowDetailModal(false)}
              >
                Đóng
              </button>
            </div>
            </div>
        </div>
      )}
        </div>
    );
};

export default ViolationManagement; 