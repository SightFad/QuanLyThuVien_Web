import React, { useState, useEffect } from "react";
import {
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaFileAlt,
  FaPrint,
  FaDownload,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaBook,
  FaUsers,
  FaEye,
  FaFilter,
  FaSearch,
  FaSync,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimes,
  FaClock,
} from "react-icons/fa";
import { useToast } from "../../hooks";
import "./ReportManagement.css";

const ReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [reportTypeFilter, setReportTypeFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ fromDate: "", toDate: "" });
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  // Form states for creating new report
  const [newReport, setNewReport] = useState({
    loaiBaoCao: "",
    tieuDe: "",
    noiDung: "",
    ngayTao: new Date().toISOString().split("T")[0],
    nguoiTao: "",
    trangThai: "Chờ duyệt",
  });

  // Mock data for demonstration
  const mockReports = [
    {
      id: 1,
      loaiBaoCao: "Báo cáo doanh thu",
      tieuDe: "Báo cáo doanh thu tháng 1/2024",
      noiDung:
        "Tổng doanh thu: 15,000,000 VNĐ\nSố lượng sách mượn: 150 cuốn\nSố lượng Reader: 45 người",
      ngayTao: "2024-01-31",
      nguoiTao: "Librarian Nguyễn Thị A",
      trangThai: "Đã duyệt",
      nguoiDuyet: "Quản lý Trần Văn B",
      ngayDuyet: "2024-02-01",
      ghiChu: "Báo cáo chính xác",
    },
    {
      id: 2,
      loaiBaoCao: "Báo cáo vi phạm",
      tieuDe: "Báo cáo vi phạm tháng 1/2024",
      noiDung:
        "Tổng số vi phạm: 8 vụ\n- Trễ hạn trả sách: 5 vụ\n- Hư hỏng sách: 2 vụ\n- Mất sách: 1 vụ",
      ngayTao: "2024-01-31",
      nguoiTao: "Librarian Lê Văn C",
      trangThai: "Chờ duyệt",
      nguoiDuyet: null,
      ngayDuyet: null,
      ghiChu: "",
    },
    {
      id: 3,
      loaiBaoCao: "Báo cáo thống kê",
      tieuDe: "Báo cáo thống kê sách mượn nhiều nhất",
      noiDung:
        "Top 5 sách được mượn nhiều nhất:\n1. Sách Giáo Khoa Toán 12 - 25 lượt\n2. Sách Văn Học Việt Nam - 20 lượt\n3. Sách Lịch Sử Thế Giới - 18 lượt\n4. Sách Khoa Học Tự Nhiên - 15 lượt\n5. Sách Tiếng Anh - 12 lượt",
      ngayTao: "2024-01-30",
      nguoiTao: "Librarian Phạm Thị D",
      trangThai: "Đã duyệt",
      nguoiDuyet: "Quản lý Trần Văn B",
      ngayDuyet: "2024-01-31",
      ghiChu: "Thống kê hữu ích",
    },
    {
      id: 4,
      loaiBaoCao: "Báo cáo doanh thu",
      tieuDe: "Báo cáo doanh thu tháng 12/2023",
      noiDung:
        "Tổng doanh thu: 12,500,000 VNĐ\nSố lượng sách mượn: 120 cuốn\nSố lượng Reader: 38 người",
      ngayTao: "2023-12-31",
      nguoiTao: "Librarian Nguyễn Thị A",
      trangThai: "Đã duyệt",
      nguoiDuyet: "Quản lý Trần Văn B",
      ngayDuyet: "2024-01-02",
      ghiChu: "Doanh thu tăng so với tháng trước",
    },
  ];

  useEffect(() => {
    loadReports();
    loadStatistics();
  }, []);

  useEffect(() => {
    filterReports();
  }, [searchTerm, reportTypeFilter, dateRange, reports]);

  const loadReports = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setReports(mockReports);
        setFilteredReports(mockReports);
        setLoading(false);
      }, 1000);
    } catch (error) {
      showToast("Lỗi khi tải danh sách báo cáo", "error");
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = {
        totalReports: mockReports.length,
        pendingReports: mockReports.filter((r) => r.trangThai === "Chờ duyệt")
          .length,
        approvedReports: mockReports.filter((r) => r.trangThai === "Đã duyệt")
          .length,
        revenueReports: mockReports.filter(
          (r) => r.loaiBaoCao === "Báo cáo doanh thu"
        ).length,
        violationReports: mockReports.filter(
          (r) => r.loaiBaoCao === "Báo cáo vi phạm"
        ).length,
        statisticsReports: mockReports.filter(
          (r) => r.loaiBaoCao === "Báo cáo thống kê"
        ).length,
      };
      setStatistics(stats);
    } catch (error) {
      showToast("Lỗi khi tải thống kê", "error");
    }
  };

  const filterReports = () => {
    let filtered = reports;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (report) =>
          report.tieuDe?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.nguoiTao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.loaiBaoCao?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by report type
    if (reportTypeFilter !== "all") {
      filtered = filtered.filter(
        (report) => report.loaiBaoCao === reportTypeFilter
      );
    }

    // Filter by date range
    if (dateRange.fromDate && dateRange.toDate) {
      filtered = filtered.filter((report) => {
        const reportDate = new Date(report.ngayTao);
        const fromDate = new Date(dateRange.fromDate);
        const toDate = new Date(dateRange.toDate);
        return reportDate >= fromDate && reportDate <= toDate;
      });
    }

    setFilteredReports(filtered);
  };

  const handleCreateReport = async () => {
    try {
      const newReportData = {
        ...newReport,
        id: reports.length + 1,
        nguoiDuyet: null,
        ngayDuyet: null,
        ghiChu: "",
      };

      setReports([newReportData, ...reports]);
      setShowCreateModal(false);
      resetNewReportForm();
      showToast("Đã tạo báo cáo thành công!", "success");
    } catch (error) {
      showToast("Lỗi khi tạo báo cáo", "error");
    }
  };

  const handleApproveReport = async (reportId) => {
    try {
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? {
                ...r,
                trangThai: "Đã duyệt",
                ngayDuyet: new Date().toISOString().split("T")[0],
                nguoiDuyet: "Quản lý hiện tại",
                ghiChu: "Báo cáo đã được duyệt",
              }
            : r
        )
      );
      showToast("Đã duyệt báo cáo thành công!", "success");
    } catch (error) {
      showToast("Lỗi khi duyệt báo cáo", "error");
    }
  };

  const handleRejectReport = async (reportId) => {
    try {
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? {
                ...r,
                trangThai: "Từ chối",
                ngayDuyet: new Date().toISOString().split("T")[0],
                nguoiDuyet: "Quản lý hiện tại",
                ghiChu: "Báo cáo bị từ chối",
              }
            : r
        )
      );
      showToast("Đã từ chối báo cáo!", "success");
    } catch (error) {
      showToast("Lỗi khi từ chối báo cáo", "error");
    }
  };

  const resetNewReportForm = () => {
    setNewReport({
      loaiBaoCao: "",
      tieuDe: "",
      noiDung: "",
      ngayTao: new Date().toISOString().split("T")[0],
      nguoiTao: "",
      trangThai: "Chờ duyệt",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      "Chờ duyệt": {
        class: "status-pending",
        icon: <FaClock />,
        text: "Chờ duyệt",
      },
      "Đã duyệt": {
        class: "status-approved",
        icon: <FaCheckCircle />,
        text: "Đã duyệt",
      },
      "Từ chối": {
        class: "status-rejected",
        icon: <FaTimes />,
        text: "Từ chối",
      },
    };

    const config = statusConfig[status] || statusConfig["Chờ duyệt"];
    return (
      <span className={`status-badge ${config.class}`}>
        {config.icon} {config.text}
      </span>
    );
  };

  const getReportTypeIcon = (type) => {
    const iconConfig = {
      "Báo cáo doanh thu": <FaMoneyBillWave />,
      "Báo cáo vi phạm": <FaExclamationTriangle />,
      "Báo cáo thống kê": <FaChartBar />,
    };
    return iconConfig[type] || <FaFileAlt />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const exportReport = (reportId) => {
    // Implement export functionality
    showToast("Đang xuất báo cáo...", "info");
  };

  const printReport = (reportId) => {
    // Implement print functionality
    showToast("Đang in báo cáo...", "info");
  };

  if (loading) {
    return (
      <div className="report-management">
        <div className="loading-spinner">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="report-management">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <FaChartBar />
            Quản Lý Báo Cáo
          </h1>
          <p className="page-description">
            Quản lý và tạo các báo cáo doanh thu, vi phạm và thống kê
          </p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <FaPlus />
            Tạo Báo Cáo
          </button>
          <button className="btn btn-secondary" onClick={loadReports}>
            <FaSync />
            Làm Mới
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FaFileAlt />
          </div>
          <div className="stat-content">
            <h3>Tổng báo cáo</h3>
            <p className="stat-number">{statistics?.totalReports || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaClock />
          </div>
          <div className="stat-content">
            <h3>Chờ duyệt</h3>
            <p className="stat-number">{statistics?.pendingReports || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <h3>Đã duyệt</h3>
            <p className="stat-number">{statistics?.approvedReports || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaMoneyBillWave />
          </div>
          <div className="stat-content">
            <h3>Báo cáo doanh thu</h3>
            <p className="stat-number">{statistics?.revenueReports || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaExclamationTriangle />
          </div>
          <div className="stat-content">
            <h3>Báo cáo vi phạm</h3>
            <p className="stat-number">{statistics?.violationReports || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaChartBar />
          </div>
          <div className="stat-content">
            <h3>Báo cáo thống kê</h3>
            <p className="stat-number">{statistics?.statisticsReports || 0}</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filters">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề, người tạo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <select
            value={reportTypeFilter}
            onChange={(e) => setReportTypeFilter(e.target.value)}
          >
            <option value="all">Tất cả loại báo cáo</option>
            <option value="Báo cáo doanh thu">Báo cáo doanh thu</option>
            <option value="Báo cáo vi phạm">Báo cáo vi phạm</option>
            <option value="Báo cáo thống kê">Báo cáo thống kê</option>
          </select>
        </div>

        <div className="date-filters">
          <input
            type="date"
            value={dateRange.fromDate}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, fromDate: e.target.value }))
            }
            placeholder="Từ ngày"
          />
          <span>đến</span>
          <input
            type="date"
            value={dateRange.toDate}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, toDate: e.target.value }))
            }
            placeholder="Đến ngày"
          />
        </div>
      </div>

      {/* Reports Table */}
      <div className="reports-table">
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Loại báo cáo</th>
              <th>Tiêu đề</th>
              <th>Người tạo</th>
              <th>Ngày tạo</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report, index) => (
              <tr key={report.id}>
                <td>{index + 1}</td>
                <td>
                  <div className="report-type">
                    {getReportTypeIcon(report.loaiBaoCao)}
                    <span>{report.loaiBaoCao}</span>
                  </div>
                </td>
                <td>
                  <div className="report-title">
                    <span className="title-text">{report.tieuDe}</span>
                  </div>
                </td>
                <td>{report.nguoiTao}</td>
                <td>{formatDate(report.ngayTao)}</td>
                <td>{getStatusBadge(report.trangThai)}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-icon"
                      title="Xem chi tiết"
                      onClick={() => {
                        setSelectedReport(report);
                        setShowDetailModal(true);
                      }}
                    >
                      <FaEye />
                    </button>

                    {report.trangThai === "Chờ duyệt" && (
                      <>
                        <button
                          className="btn-icon btn-success"
                          title="Duyệt báo cáo"
                          onClick={() => handleApproveReport(report.id)}
                        >
                          <FaCheckCircle />
                        </button>
                        <button
                          className="btn-icon btn-danger"
                          title="Từ chối báo cáo"
                          onClick={() => handleRejectReport(report.id)}
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}

                    <button
                      className="btn-icon"
                      title="Xuất báo cáo"
                      onClick={() => exportReport(report.id)}
                    >
                      <FaDownload />
                    </button>

                    <button
                      className="btn-icon"
                      title="In báo cáo"
                      onClick={() => printReport(report.id)}
                    >
                      <FaPrint />
                    </button>

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

      {/* Create Report Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Tạo Báo Cáo Mới</h2>
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
                  <label>Loại báo cáo:</label>
                  <select
                    value={newReport.loaiBaoCao}
                    onChange={(e) =>
                      setNewReport((prev) => ({
                        ...prev,
                        loaiBaoCao: e.target.value,
                      }))
                    }
                  >
                    <option value="">Chọn loại báo cáo</option>
                    <option value="Báo cáo doanh thu">Báo cáo doanh thu</option>
                    <option value="Báo cáo vi phạm">Báo cáo vi phạm</option>
                    <option value="Báo cáo thống kê">Báo cáo thống kê</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Tiêu đề:</label>
                  <input
                    type="text"
                    value={newReport.tieuDe}
                    onChange={(e) =>
                      setNewReport((prev) => ({
                        ...prev,
                        tieuDe: e.target.value,
                      }))
                    }
                    placeholder="Nhập tiêu đề báo cáo"
                  />
                </div>

                <div className="form-group">
                  <label>Người tạo:</label>
                  <input
                    type="text"
                    value={newReport.nguoiTao}
                    onChange={(e) =>
                      setNewReport((prev) => ({
                        ...prev,
                        nguoiTao: e.target.value,
                      }))
                    }
                    placeholder="Nhập tên người tạo"
                  />
                </div>

                <div className="form-group">
                  <label>Ngày tạo:</label>
                  <input
                    type="date"
                    value={newReport.ngayTao}
                    onChange={(e) =>
                      setNewReport((prev) => ({
                        ...prev,
                        ngayTao: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Nội dung báo cáo:</label>
                <textarea
                  value={newReport.noiDung}
                  onChange={(e) =>
                    setNewReport((prev) => ({
                      ...prev,
                      noiDung: e.target.value,
                    }))
                  }
                  placeholder="Nhập nội dung báo cáo..."
                  rows="8"
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
              <button className="btn btn-primary" onClick={handleCreateReport}>
                Tạo báo cáo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Detail Modal */}
      {showDetailModal && selectedReport && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Chi Tiết Báo Cáo</h2>
              <button
                className="btn-close"
                onClick={() => setShowDetailModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="report-detail">
                <div className="detail-section">
                  <h3>Thông tin chung</h3>
                  <div className="detail-row">
                    <span className="label">Loại báo cáo:</span>
                    <span className="value">
                      {getReportTypeIcon(selectedReport.loaiBaoCao)}
                      {selectedReport.loaiBaoCao}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Tiêu đề:</span>
                    <span className="value">{selectedReport.tieuDe}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Người tạo:</span>
                    <span className="value">{selectedReport.nguoiTao}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Ngày tạo:</span>
                    <span className="value">
                      {formatDate(selectedReport.ngayTao)}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Trạng thái:</span>
                    <span className="value">
                      {getStatusBadge(selectedReport.trangThai)}
                    </span>
                  </div>
                </div>

                {selectedReport.nguoiDuyet && (
                  <div className="detail-section">
                    <h3>Thông tin duyệt</h3>
                    <div className="detail-row">
                      <span className="label">Người duyệt:</span>
                      <span className="value">{selectedReport.nguoiDuyet}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Ngày duyệt:</span>
                      <span className="value">
                        {formatDate(selectedReport.ngayDuyet)}
                      </span>
                    </div>
                    {selectedReport.ghiChu && (
                      <div className="detail-row">
                        <span className="label">Ghi chú:</span>
                        <span className="value">{selectedReport.ghiChu}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="detail-section">
                  <h3>Nội dung báo cáo</h3>
                  <div className="report-content">
                    <pre>{selectedReport.noiDung}</pre>
                  </div>
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
              <button
                className="btn btn-primary"
                onClick={() => exportReport(selectedReport.id)}
              >
                <FaDownload />
                Xuất báo cáo
              </button>
              <button
                className="btn btn-outline"
                onClick={() => printReport(selectedReport.id)}
              >
                <FaPrint />
                In báo cáo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportManagement;
