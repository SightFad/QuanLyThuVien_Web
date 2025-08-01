import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaMoneyBillWave, FaFileAlt, FaFilter, FaPrint, FaCalculator, FaLock, FaUnlock, FaPlus, FaChartBar } from 'react-icons/fa';
import { fineService } from '../../services/fineService';
import { useToast } from '../../hooks';
import './FineManagement.css';

const FineManagement = () => {
  const [fines, setFines] = useState([]);
  const [filteredFines, setFilteredFines] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [violationTypeFilter, setViolationTypeFilter] = useState('all');
  const [selectedFine, setSelectedFine] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStatisticsModal, setShowStatisticsModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ fromDate: null, toDate: null });
  
  const { showToast } = useToast();

  // Form states for creating new fine
  const [newFine, setNewFine] = useState({
    maDG: '',
    loaiViPham: '',
    maSach: '',
    tenSach: '',
    soTien: 0,
    hinhThucThanhToan: 'TienMat',
    ghiChu: '',
    soNgayTre: 0,
    maPhieuMuon: '',
    maBaoCaoViPham: '',
    maGiaoDich: ''
  });

  useEffect(() => {
    loadFines();
    loadStatistics();
  }, []);

  useEffect(() => {
    filterFines();
  }, [searchTerm, statusFilter, violationTypeFilter, fines]);

  const loadFines = async () => {
    try {
      setLoading(true);
      const data = await fineService.getAllFines();
      setFines(data);
      setFilteredFines(data);
    } catch (error) {
      showToast('Lỗi khi tải danh sách phạt tiền', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await fineService.getStatistics(dateRange.fromDate, dateRange.toDate);
      setStatistics(stats);
    } catch (error) {
      showToast('Lỗi khi tải thống kê', 'error');
    }
  };

  const filterFines = () => {
    let filtered = fines;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(fine =>
        fine.tenDG?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fine.maDG?.toString().includes(searchTerm) ||
        fine.tenSach?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fine.maPhieuThu?.toString().includes(searchTerm)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(fine => fine.trangThai === statusFilter);
    }

    // Filter by violation type
    if (violationTypeFilter !== 'all') {
      filtered = filtered.filter(fine => fine.loaiViPham === violationTypeFilter);
    }

    setFilteredFines(filtered);
  };

  const handlePayment = async (fine) => {
    setSelectedFine(fine);
    setShowPaymentModal(true);
  };

  const confirmPayment = async () => {
    try {
      await fineService.processPayment(selectedFine.maPhieuThu, 'Thủ thư');
      showToast('Thanh toán phạt tiền thành công', 'success');
      setShowPaymentModal(false);
      loadFines();
      loadStatistics();
    } catch (error) {
      showToast('Lỗi khi xử lý thanh toán', 'error');
    }
  };

  const handleCreateFine = async () => {
    try {
      const fineData = {
        ...newFine,
        nguoiThu: 'Thủ thư',
        ngayThu: new Date().toISOString()
      };

      await fineService.createFine(fineData);
      showToast('Tạo phiếu phạt tiền thành công', 'success');
      setShowCreateModal(false);
      resetNewFineForm();
      loadFines();
      loadStatistics();
    } catch (error) {
      showToast('Lỗi khi tạo phiếu phạt tiền', 'error');
    }
  };

  const resetNewFineForm = () => {
    setNewFine({
      maDG: '',
      loaiViPham: '',
      maSach: '',
      tenSach: '',
      soTien: 0,
      hinhThucThanhToan: 'TienMat',
      ghiChu: '',
      soNgayTre: 0,
      maPhieuMuon: '',
      maBaoCaoViPham: '',
      maGiaoDich: ''
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'ChuaThu': { text: 'Chưa thanh toán', class: 'badge-warning' },
      'DaThu': { text: 'Đã thanh toán', class: 'badge-success' },
      'Huy': { text: 'Đã hủy', class: 'badge-danger' }
    };

    const config = statusConfig[status] || { text: status, class: 'badge-secondary' };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getViolationTypeBadge = (type) => {
    const typeConfig = {
      'Trả trễ': { text: 'Trả trễ', class: 'badge-warning' },
      'Hư hỏng': { text: 'Hư hỏng', class: 'badge-danger' },
      'Mất': { text: 'Mất sách', class: 'badge-dark' }
    };

    const config = typeConfig[type] || { text: type, class: 'badge-secondary' };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getTotalFines = () => {
    return filteredFines.reduce((total, fine) => total + fine.soTien, 0);
  };

  const getUnpaidFines = () => {
    return filteredFines
      .filter(fine => fine.trangThai === 'ChuaThu')
      .reduce((total, fine) => total + fine.soTien, 0);
  };

  const exportToExcel = () => {
    // Implement export functionality
    showToast('Tính năng xuất Excel đang được phát triển', 'info');
  };

  if (loading) {
    return (
      <div className="fine-management">
        <div className="loading-spinner">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="fine-management">
      <div className="page-header">
        <h1>Quản lý phạt tiền</h1>
        <div className="header-actions">
          <button 
            className="btn btn-primary" 
            onClick={() => setShowStatisticsModal(true)}
          >
            <FaChartBar /> Thống kê
          </button>
          <button 
            className="btn btn-success" 
            onClick={() => setShowCreateModal(true)}
          >
            <FaPlus /> Tạo phiếu phạt
          </button>
          <button className="btn btn-secondary" onClick={exportToExcel}>
            <FaPrint /> Xuất Excel
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="statistics-cards">
        <div className="stat-card">
          <div className="stat-icon">
            <FaMoneyBillWave />
          </div>
          <div className="stat-content">
            <h3>{fineService.formatFineAmount(getTotalFines())}</h3>
            <p>Tổng tiền phạt</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon warning">
            <FaLock />
          </div>
          <div className="stat-content">
            <h3>{fineService.formatFineAmount(getUnpaidFines())}</h3>
            <p>Chưa thanh toán</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon info">
            <FaFileAlt />
          </div>
          <div className="stat-content">
            <h3>{filteredFines.length}</h3>
            <p>Tổng phiếu phạt</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success">
            <FaUnlock />
          </div>
          <div className="stat-content">
            <h3>{filteredFines.filter(f => f.trangThai === 'DaThu').length}</h3>
            <p>Đã thanh toán</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, mã độc giả, tên sách..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-controls">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="ChuaThu">Chưa thanh toán</option>
            <option value="DaThu">Đã thanh toán</option>
            <option value="Huy">Đã hủy</option>
          </select>
          <select
            value={violationTypeFilter}
            onChange={(e) => setViolationTypeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tất cả loại vi phạm</option>
            <option value="Trả trễ">Trả trễ</option>
            <option value="Hư hỏng">Hư hỏng</option>
            <option value="Mất">Mất sách</option>
          </select>
        </div>
      </div>

      {/* Fines Table */}
      <div className="table-container">
        <table className="fines-table">
          <thead>
            <tr>
              <th>Mã phiếu</th>
              <th>Độc giả</th>
              <th>Loại vi phạm</th>
              <th>Sách vi phạm</th>
              <th>Số tiền</th>
              <th>Ngày thu</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredFines.map((fine) => (
              <tr key={fine.maPhieuThu}>
                <td>#{fine.maPhieuThu}</td>
                <td>
                  <div>
                    <strong>{fine.tenDG}</strong>
                    <br />
                    <small>Mã: {fine.maDG}</small>
                  </div>
                </td>
                <td>{getViolationTypeBadge(fine.loaiViPham)}</td>
                <td>
                  <div>
                    <strong>{fine.tenSach}</strong>
                    {fine.soNgayTre > 0 && (
                      <>
                        <br />
                        <small>Trễ {fine.soNgayTre} ngày</small>
                      </>
                    )}
                  </div>
                </td>
                <td>
                  <strong className="amount">
                    {fineService.formatFineAmount(fine.soTien)}
                  </strong>
                </td>
                <td>{new Date(fine.ngayThu).toLocaleDateString('vi-VN')}</td>
                <td>{getStatusBadge(fine.trangThai)}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => setSelectedFine(fine)}
                      title="Xem chi tiết"
                    >
                      <FaEye />
                    </button>
                    {fine.trangThai === 'ChuaThu' && (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handlePayment(fine)}
                        title="Thanh toán"
                      >
                        <FaMoneyBillWave />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedFine && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Thanh toán phạt tiền</h3>
              <button onClick={() => setShowPaymentModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="payment-details">
                <p><strong>Độc giả:</strong> {selectedFine.tenDG}</p>
                <p><strong>Sách:</strong> {selectedFine.tenSach}</p>
                <p><strong>Loại vi phạm:</strong> {fineService.getViolationTypeText(selectedFine.loaiViPham)}</p>
                <p><strong>Số tiền:</strong> {fineService.formatFineAmount(selectedFine.soTien)}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowPaymentModal(false)}>
                Hủy
              </button>
              <button className="btn btn-success" onClick={confirmPayment}>
                Xác nhận thanh toán
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Fine Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal large">
            <div className="modal-header">
              <h3>Tạo phiếu phạt tiền mới</h3>
              <button onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Mã độc giả *</label>
                  <input
                    type="text"
                    value={newFine.maDG}
                    onChange={(e) => setNewFine({...newFine, maDG: e.target.value})}
                    placeholder="Nhập mã độc giả"
                  />
                </div>
                <div className="form-group">
                  <label>Loại vi phạm *</label>
                  <select
                    value={newFine.loaiViPham}
                    onChange={(e) => setNewFine({...newFine, loaiViPham: e.target.value})}
                  >
                    <option value="">Chọn loại vi phạm</option>
                    <option value="Trả trễ">Trả trễ</option>
                    <option value="Hư hỏng">Hư hỏng</option>
                    <option value="Mất">Mất sách</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Mã sách</label>
                  <input
                    type="text"
                    value={newFine.maSach}
                    onChange={(e) => setNewFine({...newFine, maSach: e.target.value})}
                    placeholder="Nhập mã sách"
                  />
                </div>
                <div className="form-group">
                  <label>Tên sách</label>
                  <input
                    type="text"
                    value={newFine.tenSach}
                    onChange={(e) => setNewFine({...newFine, tenSach: e.target.value})}
                    placeholder="Nhập tên sách"
                  />
                </div>
                <div className="form-group">
                  <label>Số tiền *</label>
                  <input
                    type="number"
                    value={newFine.soTien}
                    onChange={(e) => setNewFine({...newFine, soTien: parseFloat(e.target.value) || 0})}
                    placeholder="Nhập số tiền phạt"
                  />
                </div>
                <div className="form-group">
                  <label>Số ngày trễ</label>
                  <input
                    type="number"
                    value={newFine.soNgayTre}
                    onChange={(e) => setNewFine({...newFine, soNgayTre: parseInt(e.target.value) || 0})}
                    placeholder="Số ngày trễ (nếu có)"
                  />
                </div>
                <div className="form-group">
                  <label>Hình thức thanh toán</label>
                  <select
                    value={newFine.hinhThucThanhToan}
                    onChange={(e) => setNewFine({...newFine, hinhThucThanhToan: e.target.value})}
                  >
                    <option value="TienMat">Tiền mặt</option>
                    <option value="ChuyenKhoan">Chuyển khoản</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Mã giao dịch</label>
                  <input
                    type="text"
                    value={newFine.maGiaoDich}
                    onChange={(e) => setNewFine({...newFine, maGiaoDich: e.target.value})}
                    placeholder="Mã giao dịch (nếu chuyển khoản)"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Ghi chú</label>
                  <textarea
                    value={newFine.ghiChu}
                    onChange={(e) => setNewFine({...newFine, ghiChu: e.target.value})}
                    placeholder="Nhập ghi chú..."
                    rows="3"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                Hủy
              </button>
              <button className="btn btn-primary" onClick={handleCreateFine}>
                Tạo phiếu phạt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Modal */}
      {showStatisticsModal && statistics && (
        <div className="modal-overlay">
          <div className="modal large">
            <div className="modal-header">
              <h3>Thống kê phạt tiền</h3>
              <button onClick={() => setShowStatisticsModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="statistics-grid">
                <div className="stat-item">
                  <h4>Tổng quan</h4>
                  <p>Tổng phiếu phạt: {statistics.totalFines}</p>
                  <p>Tổng tiền: {fineService.formatFineAmount(statistics.totalAmount)}</p>
                  <p>Đã thanh toán: {fineService.formatFineAmount(statistics.paidAmount)}</p>
                  <p>Chưa thanh toán: {fineService.formatFineAmount(statistics.unpaidAmount)}</p>
                </div>
                <div className="stat-item">
                  <h4>Theo loại vi phạm</h4>
                  <p>Trả trễ: {statistics.overdueFines} phiếu</p>
                  <p>Hư hỏng: {statistics.damagedFines} phiếu</p>
                  <p>Mất sách: {statistics.lostFines} phiếu</p>
                </div>
                <div className="stat-item full-width">
                  <h4>Top độc giả vi phạm nhiều nhất</h4>
                  <div className="top-violators">
                    {statistics.topViolators?.map((violator, index) => (
                      <div key={violator.maDG} className="violator-item">
                        <span className="rank">#{index + 1}</span>
                        <span className="name">{violator.tenDG}</span>
                        <span className="violations">{violator.violationCount} lần</span>
                        <span className="amount">{fineService.formatFineAmount(violator.totalFineAmount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowStatisticsModal(false)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FineManagement; 