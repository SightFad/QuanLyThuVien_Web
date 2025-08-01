import React, { useState, useEffect } from 'react';
import { FaFileAlt, FaPlus, FaSearch, FaFilter, FaEye, FaEdit, FaTrash, FaCheck, FaTimes, FaTimesCircle } from 'react-icons/fa';
import { useToast } from '../../hooks';
import { bookProposalService } from '../../services/bookProposalService';
import './PurchaseProposals.css';

const PurchaseProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingId, setRejectingId] = useState(null);
  
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [proposalsData, statsData] = await Promise.all([
        bookProposalService.getAllProposals(),
        bookProposalService.getStatistics()
      ]);
      
      setProposals(proposalsData);
      setStatistics(statsData);
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = proposal.tieuDe.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proposal.tenNguoiDeXuat.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || proposal.trangThai === filterStatus;
    const matchesPriority = filterPriority === 'all' || proposal.mucDoUuTien === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Chờ duyệt': { text: 'Chờ duyệt', class: 'status-pending' },
      'Đã duyệt': { text: 'Đã duyệt', class: 'status-approved' },
      'Từ chối': { text: 'Từ chối', class: 'status-rejected' }
    };
    const config = statusConfig[status] || { text: status, class: 'status-default' };
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'Cao': { text: 'Cao', class: 'priority-high' },
      'Trung bình': { text: 'Trung bình', class: 'priority-medium' },
      'Thấp': { text: 'Thấp', class: 'priority-low' }
    };
    const config = priorityConfig[priority] || { text: priority, class: 'priority-default' };
    return <span className={`priority-badge ${config.class}`}>{config.text}</span>;
  };

  const formatCurrency = (amount) => {
    return bookProposalService.formatCurrency(amount);
  };

  const handleViewDetail = async (proposal) => {
    try {
      const detail = await bookProposalService.getProposalById(proposal.maDeXuat);
      setSelectedProposal(detail);
      setShowDetailModal(true);
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const handleApprove = async (id) => {
    try {
      setApproving(true);
      await bookProposalService.approveRejectProposal({
        maDeXuat: id,
        maNguoiDuyet: 1, // TODO: Get current user ID
        trangThai: 'Đã duyệt',
        ghiChu: 'Đã duyệt đề xuất'
      });
      
      showToast('Duyệt đề xuất thành công!', 'success');
      await loadData();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async (id) => {
    setRejectingId(id);
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    try {
      setRejecting(true);
      await bookProposalService.approveRejectProposal({
        maDeXuat: rejectingId,
        maNguoiDuyet: 1, // TODO: Get current user ID
        trangThai: 'Từ chối',
        lyDoTuChoi: rejectReason,
        ghiChu: 'Từ chối đề xuất'
      });
      
      showToast('Từ chối đề xuất thành công!', 'success');
      setShowRejectModal(false);
      setRejectReason('');
      setRejectingId(null);
      await loadData();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setRejecting(false);
    }
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
            <div className="stat-value">{statistics?.tongDeXuat || 0}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaCheck />
          </div>
          <div className="stat-content">
            <h3>Đã duyệt</h3>
            <div className="stat-value">{statistics?.daDuyet || 0}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaTimes />
          </div>
          <div className="stat-content">
            <h3>Từ chối</h3>
            <div className="stat-value">{statistics?.tuChoi || 0}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaFileAlt />
          </div>
          <div className="stat-content">
            <h3>Chờ duyệt</h3>
            <div className="stat-value">{statistics?.choDuyet || 0}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaFileAlt />
          </div>
          <div className="stat-content">
            <h3>Tổng chi phí</h3>
            <div className="stat-value">{formatCurrency(statistics?.tongChiPhi || 0)}</div>
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
            <option value="Chờ duyệt">Chờ duyệt</option>
            <option value="Đã duyệt">Đã duyệt</option>
            <option value="Từ chối">Từ chối</option>
          </select>
          <select 
            value={filterPriority} 
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="all">Tất cả mức độ</option>
            <option value="Cao">Cao</option>
            <option value="Trung bình">Trung bình</option>
            <option value="Thấp">Thấp</option>
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
          <div key={proposal.maDeXuat} className="proposal-card">
            <div className="proposal-header">
              <div className="proposal-title">
                <h3>{proposal.tieuDe}</h3>
                <div className="proposal-badges">
                  {getStatusBadge(proposal.trangThai)}
                  {getPriorityBadge(proposal.mucDoUuTien)}
                </div>
              </div>
              <div className="proposal-actions">
                <button 
                  className="btn-icon" 
                  title="Xem chi tiết"
                  onClick={() => handleViewDetail(proposal)}
                >
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
                <span className="info-value">{proposal.tenNguoiDeXuat} ({proposal.chucVuNguoiDeXuat})</span>
              </div>
              <div className="info-row">
                <span className="info-label">Ngày đề xuất:</span>
                <span className="info-value">{new Date(proposal.ngayDeXuat).toLocaleDateString('vi-VN')}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Chi phí dự kiến:</span>
                <span className="info-value cost">{formatCurrency(proposal.chiPhiDuKien)}</span>
              </div>
            </div>

            <div className="proposal-description">
              <p>{proposal.moTa}</p>
            </div>

            <div className="books-summary">
              <h4>Danh sách sách ({proposal.chiTietDeXuatMuaSachs?.length || 0} cuốn):</h4>
              <div className="books-list">
                {proposal.chiTietDeXuatMuaSachs?.slice(0, 3).map((book, index) => (
                  <div key={index} className="book-item">
                    <span className="book-title">{book.tenSach}</span>
                    <span className="book-quantity">x{book.soLuong}</span>
                  </div>
                ))}
                {proposal.chiTietDeXuatMuaSachs?.length > 3 && (
                  <div className="more-books">
                    +{proposal.chiTietDeXuatMuaSachs.length - 3} cuốn khác
                  </div>
                )}
              </div>
            </div>

            {proposal.trangThai === 'Chờ duyệt' && (
              <div className="proposal-actions-footer">
                <button 
                  className="btn-approve"
                  onClick={() => handleApprove(proposal.maDeXuat)}
                  disabled={approving}
                >
                  <FaCheck /> {approving ? 'Đang duyệt...' : 'Duyệt'}
                </button>
                <button 
                  className="btn-reject"
                  onClick={() => handleReject(proposal.maDeXuat)}
                  disabled={rejecting}
                >
                  <FaTimes /> {rejecting ? 'Đang từ chối...' : 'Từ chối'}
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

      {/* Detail Modal */}
      {showDetailModal && selectedProposal && (
        <div className="modal-overlay">
          <div className="modal large">
            <div className="modal-header">
              <h2>Chi tiết đề xuất mua sách</h2>
              <button 
                className="modal-close"
                onClick={() => setShowDetailModal(false)}
              >
                <FaTimesCircle />
              </button>
            </div>
            <div className="modal-body">
              <div className="proposal-detail">
                <div className="detail-section">
                  <h3>Thông tin chung</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Tiêu đề:</label>
                      <span>{selectedProposal.tieuDe}</span>
                    </div>
                    <div className="detail-item">
                      <label>Người đề xuất:</label>
                      <span>{selectedProposal.tenNguoiDeXuat} ({selectedProposal.chucVuNguoiDeXuat})</span>
                    </div>
                    <div className="detail-item">
                      <label>Ngày đề xuất:</label>
                      <span>{new Date(selectedProposal.ngayDeXuat).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="detail-item">
                      <label>Mức độ ưu tiên:</label>
                      <span>{getPriorityBadge(selectedProposal.mucDoUuTien)}</span>
                    </div>
                    <div className="detail-item">
                      <label>Trạng thái:</label>
                      <span>{getStatusBadge(selectedProposal.trangThai)}</span>
                    </div>
                    <div className="detail-item">
                      <label>Chi phí dự kiến:</label>
                      <span className="cost">{formatCurrency(selectedProposal.chiPhiDuKien)}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Mô tả</h3>
                  <p>{selectedProposal.moTa}</p>
                </div>

                {selectedProposal.lyDoTuChoi && (
                  <div className="detail-section">
                    <h3>Lý do từ chối</h3>
                    <p>{selectedProposal.lyDoTuChoi}</p>
                  </div>
                )}

                <div className="detail-section">
                  <h3>Danh sách sách ({selectedProposal.chiTietDeXuatMuaSachs?.length || 0} cuốn)</h3>
                  <div className="books-table">
                    <table>
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Tên sách</th>
                          <th>Tác giả</th>
                          <th>ISBN</th>
                          <th>Thể loại</th>
                          <th>Nhà xuất bản</th>
                          <th>Số lượng</th>
                          <th>Đơn giá</th>
                          <th>Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedProposal.chiTietDeXuatMuaSachs?.map((book, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{book.tenSach}</td>
                            <td>{book.tacGia}</td>
                            <td>{book.isbn}</td>
                            <td>{book.theLoai}</td>
                            <td>{book.nhaXuatBan}</td>
                            <td>{book.soLuong}</td>
                            <td>{formatCurrency(book.donGia)}</td>
                            <td>{formatCurrency(book.thanhTien)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowDetailModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Từ chối đề xuất</h2>
              <button 
                className="modal-close"
                onClick={() => setShowRejectModal(false)}
              >
                <FaTimesCircle />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Lý do từ chối:</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Nhập lý do từ chối đề xuất..."
                  rows={4}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowRejectModal(false)}
                disabled={rejecting}
              >
                Hủy
              </button>
              <button 
                className="btn-reject"
                onClick={confirmReject}
                disabled={rejecting || !rejectReason.trim()}
              >
                {rejecting ? 'Đang từ chối...' : 'Từ chối'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseProposals; 