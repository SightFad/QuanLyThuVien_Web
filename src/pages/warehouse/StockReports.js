import React, { useState, useEffect } from 'react';
import { FaPlus, FaExclamationTriangle, FaBook, FaChartBar, FaChartPie, FaEye, FaEdit, FaTrash, FaDownload, FaPrint, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';
import './StockReports.css';

const StockReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    damaged: 0,
    lost: 0,
    lowStock: 0
  });

  useEffect(() => {
    // Mock data for stock reports
    const mockReports = [
      {
        id: 1,
        reportNumber: 'BC001',
        title: 'Báo cáo sách hư hỏng tháng 1/2024',
        type: 'damaged',
        priority: 'high',
        status: 'pending',
        reportedBy: 'Nguyễn Văn A',
        reportDate: '2024-01-15',
        affectedBooks: 25,
        estimatedLoss: 2500000,
        description: 'Phát hiện 25 cuốn sách bị hư hỏng do ẩm mốc, cần xử lý gấp',
        actions: 'Cần khử trùng và sửa chữa'
      },
      {
        id: 2,
        reportNumber: 'BC002',
        title: 'Báo cáo sách mất tích quý 1',
        type: 'lost',
        priority: 'medium',
        status: 'investigating',
        reportedBy: 'Trần Thị B',
        reportDate: '2024-02-01',
        affectedBooks: 8,
        estimatedLoss: 800000,
        description: '8 cuốn sách bị mất trong quá trình mượn trả, đang điều tra',
        actions: 'Đang tìm kiếm và liên hệ thành viên'
      },
      {
        id: 3,
        reportNumber: 'BC003',
        title: 'Cảnh báo sách sắp hết',
        type: 'low-stock',
        priority: 'high',
        status: 'resolved',
        reportedBy: 'Lê Văn C',
        reportDate: '2024-02-10',
        affectedBooks: 15,
        estimatedLoss: 0,
        description: '15 đầu sách chỉ còn 1-2 cuốn, cần bổ sung gấp',
        actions: 'Đã đặt hàng bổ sung'
      },
      {
        id: 4,
        reportNumber: 'BC004',
        title: 'Báo cáo sách cũ cần thay thế',
        type: 'damaged',
        priority: 'low',
        status: 'pending',
        reportedBy: 'Phạm Thị D',
        reportDate: '2024-02-20',
        affectedBooks: 45,
        estimatedLoss: 4500000,
        description: '45 cuốn sách cũ bị rách nát, cần thay thế',
        actions: 'Chờ phê duyệt ngân sách'
      },
      {
        id: 5,
        reportNumber: 'BC005',
        title: 'Báo cáo sách bị mượn quá hạn',
        type: 'lost',
        priority: 'medium',
        status: 'investigating',
        reportedBy: 'Hoàng Văn E',
        reportDate: '2024-03-01',
        affectedBooks: 12,
        estimatedLoss: 1200000,
        description: '12 cuốn sách bị mượn quá hạn hơn 6 tháng',
        actions: 'Đang liên hệ thành viên để thu hồi'
      }
    ];

    setReports(mockReports);
    
    // Calculate stats
    const total = mockReports.length;
    const damaged = mockReports.filter(report => report.type === 'damaged').length;
    const lost = mockReports.filter(report => report.type === 'lost').length;
    const lowStock = mockReports.filter(report => report.type === 'low-stock').length;
    
    setStats({ total, damaged, lost, lowStock });
    setLoading(false);
  }, []);

  const getTypeBadge = (type) => {
    switch (type) {
      case 'damaged':
        return <span className="badge badge-critical">Hư hỏng</span>;
      case 'lost':
        return <span className="badge badge-warning">Mất tích</span>;
      case 'low-stock':
        return <span className="badge badge-info">Sắp hết</span>;
      default:
        return <span className="badge badge-info">Khác</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge badge-warning">Chờ xử lý</span>;
      case 'investigating':
        return <span className="badge badge-info">Đang điều tra</span>;
      case 'resolved':
        return <span className="badge badge-success">Đã xử lý</span>;
      default:
        return <span className="badge badge-info">Không xác định</span>;
    }
  };

  const getPriorityIndicator = (priority) => {
    return <span className={`priority-indicator priority-${priority}`}></span>;
  };

  const handleNewReport = () => {
    alert('Chức năng tạo báo cáo mới sẽ được phát triển');
  };

  const handleViewReport = (report) => {
    alert(`Xem chi tiết báo cáo: ${report.title}`);
  };

  const handleEditReport = (report) => {
    alert(`Chỉnh sửa báo cáo: ${report.title}`);
  };

  const handleDeleteReport = (report) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa báo cáo "${report.title}"?`)) {
      setReports(reports.filter(r => r.id !== report.id));
      // Recalculate stats
      const newReports = reports.filter(r => r.id !== report.id);
      const total = newReports.length;
      const damaged = newReports.filter(r => r.type === 'damaged').length;
      const lost = newReports.filter(r => r.type === 'lost').length;
      const lowStock = newReports.filter(r => r.type === 'low-stock').length;
      setStats({ total, damaged, lost, lowStock });
    }
  };

  const handleExportReport = () => {
    alert('Chức năng xuất báo cáo sẽ được phát triển');
  };

  const handlePrintReport = () => {
    alert('Chức năng in báo cáo sẽ được phát triển');
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="stock-reports">
      <div className="page-header">
        <h1 className="page-title">Báo cáo tồn kho</h1>
        <p className="page-subtitle">Quản lý báo cáo về sách hư hỏng, mất, cần bổ sung</p>
      </div>

      <div className="content-section">
        {/* Statistics */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div>
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Tổng báo cáo</div>
              </div>
              <div className="stat-icon total">
                <FaChartBar />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div>
                <div className="stat-value">{stats.damaged}</div>
                <div className="stat-label">Sách hư hỏng</div>
              </div>
              <div className="stat-icon damaged">
                <FaExclamationTriangle />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div>
                <div className="stat-value">{stats.lost}</div>
                <div className="stat-label">Sách mất tích</div>
              </div>
              <div className="stat-icon lost">
                <FaExclamationCircle />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div>
                <div className="stat-value">{stats.lowStock}</div>
                <div className="stat-label">Sắp hết sách</div>
              </div>
              <div className="stat-icon low-stock">
                <FaInfoCircle />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-container">
            <h3>
              <FaChartBar />
              Thống kê theo loại báo cáo
            </h3>
            <div className="chart-placeholder">
              Biểu đồ phân loại báo cáo sẽ được hiển thị ở đây
            </div>
          </div>

          <div className="chart-container">
            <h3>
              <FaChartPie />
              Thống kê theo trạng thái
            </h3>
            <div className="chart-placeholder">
              Biểu đồ trạng thái báo cáo sẽ được hiển thị ở đây
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <div className="reports-section">
          <div className="section-header">
            <h2 className="section-title">
              <FaBook />
              Danh sách báo cáo
            </h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-success" onClick={handleExportReport}>
                <FaDownload /> Xuất báo cáo
              </button>
              <button className="btn btn-warning" onClick={handlePrintReport}>
                <FaPrint /> In báo cáo
              </button>
              <button className="btn btn-primary" onClick={handleNewReport}>
                <FaPlus /> Tạo báo cáo mới
              </button>
            </div>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Mã báo cáo</th>
                  <th>Tiêu đề</th>
                  <th>Loại</th>
                  <th>Mức độ</th>
                  <th>Trạng thái</th>
                  <th>Người báo cáo</th>
                  <th>Sách bị ảnh hưởng</th>
                  <th>Thiệt hại</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td>
                      <strong>{report.reportNumber}</strong>
                    </td>
                    <td>
                      <div>
                        <strong>{report.title}</strong>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                          {report.description}
                        </div>
                      </div>
                    </td>
                    <td>{getTypeBadge(report.type)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {getPriorityIndicator(report.priority)}
                        {report.priority === 'high' ? 'Cao' : 
                         report.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                      </div>
                    </td>
                    <td>{getStatusBadge(report.status)}</td>
                    <td>{report.reportedBy}</td>
                    <td>
                      <strong>{report.affectedBooks}</strong> cuốn
                    </td>
                    <td>
                      {report.estimatedLoss > 0 ? (
                        <span style={{ color: '#dc2626', fontWeight: '600' }}>
                          {report.estimatedLoss.toLocaleString()}đ
                        </span>
                      ) : (
                        <span style={{ color: '#10b981' }}>Không có</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleViewReport(report)}
                          title="Xem chi tiết"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleEditReport(report)}
                          title="Chỉnh sửa"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteReport(report)}
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

          {reports.length === 0 && (
            <div className="empty-state">
              <h3>Chưa có báo cáo nào</h3>
              <p>Tạo báo cáo mới để theo dõi tình trạng kho sách.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockReports; 