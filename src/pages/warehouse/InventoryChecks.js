import React, { useState } from 'react';
import { FaClipboardList, FaPlus, FaCheck, FaTimes, FaExclamationTriangle, FaEye, FaEdit, FaCalendarAlt, FaUser, FaBoxes } from 'react-icons/fa';
import './InventoryChecks.css';

const InventoryChecks = () => {
  const [checks, setChecks] = useState([
    {
      id: 1,
      checkCode: 'CHECK-2024-001',
      checkType: 'Kiểm kê định kỳ',
      startDate: '2024-01-15',
      endDate: '2024-01-20',
      status: 'in_progress',
      totalBooks: 1250,
      checkedBooks: 800,
      discrepancies: 12,
      assignedTo: 'Nguyễn Văn A',
      notes: 'Kiểm kê toàn bộ kho sách theo quy định'
    },
    {
      id: 2,
      checkCode: 'CHECK-2024-002',
      checkType: 'Kiểm tra hư hỏng',
      startDate: '2024-01-10',
      endDate: '2024-01-12',
      status: 'completed',
      totalBooks: 500,
      checkedBooks: 500,
      discrepancies: 5,
      assignedTo: 'Trần Thị B',
      notes: 'Kiểm tra sách hư hỏng và báo cáo'
    },
    {
      id: 3,
      checkCode: 'CHECK-2024-003',
      checkType: 'Kiểm kê theo thể loại',
      startDate: '2024-01-25',
      endDate: '2024-01-30',
      status: 'planned',
      totalBooks: 300,
      checkedBooks: 0,
      discrepancies: 0,
      assignedTo: 'Lê Văn C',
      notes: 'Kiểm kê sách văn học và tiểu thuyết'
    }
  ]);

  const [showNewCheckModal, setShowNewCheckModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredChecks = checks.filter(check => 
    filterStatus === 'all' || check.status === filterStatus
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      planned: { label: 'Đã lên kế hoạch', class: 'planned' },
      in_progress: { label: 'Đang thực hiện', class: 'in-progress' },
      completed: { label: 'Hoàn thành', class: 'completed' },
      cancelled: { label: 'Đã hủy', class: 'cancelled' }
    };
    return statusConfig[status] || { label: status, class: 'unknown' };
  };

  const getProgressPercentage = (checked, total) => {
    return total > 0 ? Math.round((checked / total) * 100) : 0;
  };

  const handleCreateCheck = () => {
    setShowNewCheckModal(true);
  };

  const handleStartCheck = (checkId) => {
    setChecks(prev => prev.map(check => 
      check.id === checkId 
        ? { ...check, status: 'in_progress' }
        : check
    ));
  };

  const handleCompleteCheck = (checkId) => {
    setChecks(prev => prev.map(check => 
      check.id === checkId 
        ? { ...check, status: 'completed', checkedBooks: check.totalBooks }
        : check
    ));
  };

  const handleCancelCheck = (checkId) => {
    setChecks(prev => prev.map(check => 
      check.id === checkId 
        ? { ...check, status: 'cancelled' }
        : check
    ));
  };

  return (
    <div className="inventory-checks">
      <div className="page-header">
        <h1><FaClipboardList /> Quản lý kiểm kê kho</h1>
        <p>Theo dõi và quản lý các đợt kiểm kê kho sách</p>
      </div>

      <div className="check-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FaClipboardList />
          </div>
          <div className="stat-content">
            <div className="stat-number">{checks.length}</div>
            <div className="stat-label">Tổng đợt kiểm kê</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaBoxes />
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {checks.reduce((sum, check) => sum + check.totalBooks, 0)}
            </div>
            <div className="stat-label">Tổng sách cần kiểm</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaCheck />
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {checks.filter(check => check.status === 'completed').length}
            </div>
            <div className="stat-label">Đã hoàn thành</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaExclamationTriangle />
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {checks.reduce((sum, check) => sum + check.discrepancies, 0)}
            </div>
            <div className="stat-label">Sai lệch phát hiện</div>
          </div>
        </div>
      </div>

      <div className="check-controls">
        <div className="filter-section">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="planned">Đã lên kế hoạch</option>
            <option value="in_progress">Đang thực hiện</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>

        <button className="btn-primary" onClick={handleCreateCheck}>
          <FaPlus /> Tạo đợt kiểm kê mới
        </button>
      </div>

      <div className="checks-table">
        <table>
          <thead>
            <tr>
              <th>Mã kiểm kê</th>
              <th>Loại kiểm kê</th>
              <th>Thời gian</th>
              <th>Tiến độ</th>
              <th>Sai lệch</th>
              <th>Người thực hiện</th>
              <th>Trạng thái</th>
              <th>Ghi chú</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredChecks.map(check => {
              const statusConfig = getStatusBadge(check.status);
              const progressPercentage = getProgressPercentage(check.checkedBooks, check.totalBooks);
              return (
                <tr key={check.id}>
                  <td>
                    <strong>{check.checkCode}</strong>
                  </td>
                  <td>
                    <div className="check-type">
                      <span>{check.checkType}</span>
                    </div>
                  </td>
                  <td>
                    <div className="date-range">
                      <div className="date-info">
                        <FaCalendarAlt />
                        <span>Từ: {check.startDate}</span>
                      </div>
                      <div className="date-info">
                        <FaCalendarAlt />
                        <span>Đến: {check.endDate}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="progress-section">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                      <div className="progress-text">
                        {check.checkedBooks}/{check.totalBooks} ({progressPercentage}%)
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="discrepancy-info">
                      {check.discrepancies > 0 ? (
                        <span className="discrepancy-badge">
                          {check.discrepancies} lỗi
                        </span>
                      ) : (
                        <span className="no-discrepancy">Không có</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="assignee-info">
                      <FaUser />
                      <span>{check.assignedTo}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${statusConfig.class}`}>
                      {statusConfig.label}
                    </span>
                  </td>
                  <td>
                    <div className="notes-cell">
                      {check.notes}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {check.status === 'planned' && (
                        <>
                          <button 
                            className="btn-icon success" 
                            title="Bắt đầu kiểm kê"
                            onClick={() => handleStartCheck(check.id)}
                          >
                            <FaCheck />
                          </button>
                          <button 
                            className="btn-icon danger" 
                            title="Hủy kiểm kê"
                            onClick={() => handleCancelCheck(check.id)}
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                      {check.status === 'in_progress' && (
                        <button 
                          className="btn-icon success" 
                          title="Hoàn thành kiểm kê"
                          onClick={() => handleCompleteCheck(check.id)}
                        >
                          <FaCheck />
                        </button>
                      )}
                      <button className="btn-icon" title="Xem chi tiết">
                        <FaEye />
                      </button>
                      <button className="btn-icon" title="Chỉnh sửa">
                        <FaEdit />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredChecks.length === 0 && (
        <div className="empty-state">
          <FaClipboardList />
          <p>Không có đợt kiểm kê nào phù hợp</p>
        </div>
      )}

      {/* New Check Modal */}
      {showNewCheckModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Tạo đợt kiểm kê mới</h2>
              <button 
                className="btn-close"
                onClick={() => setShowNewCheckModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Loại kiểm kê</label>
                <select>
                  <option>Kiểm kê định kỳ</option>
                  <option>Kiểm tra hư hỏng</option>
                  <option>Kiểm kê theo thể loại</option>
                  <option>Kiểm kê đột xuất</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Ngày bắt đầu</label>
                  <input type="date" />
                </div>
                <div className="form-group">
                  <label>Ngày kết thúc</label>
                  <input type="date" />
                </div>
              </div>
              <div className="form-group">
                <label>Người thực hiện</label>
                <select>
                  <option>Nguyễn Văn A</option>
                  <option>Trần Thị B</option>
                  <option>Lê Văn C</option>
                </select>
              </div>
              <div className="form-group">
                <label>Phạm vi kiểm kê</label>
                <select>
                  <option>Toàn bộ kho</option>
                  <option>Theo kệ</option>
                  <option>Theo thể loại</option>
                  <option>Theo nhà xuất bản</option>
                </select>
              </div>
              <div className="form-group">
                <label>Ghi chú</label>
                <textarea placeholder="Ghi chú về đợt kiểm kê..."></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowNewCheckModal(false)}
              >
                Hủy
              </button>
              <button className="btn-primary">
                Tạo đợt kiểm kê
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryChecks; 