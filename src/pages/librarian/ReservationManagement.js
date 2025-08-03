import React, { useState, useEffect, useMemo } from "react";
import {
  FaSearch,
  FaEdit,
  FaEye,
  FaFilter,
  FaSync,
  FaCheck,
  FaTimes,
  FaBell,
} from "react-icons/fa";
import { usePagination, useToast } from "../../hooks";
import reservationService from "../../services/reservationService";
import {
  Button,
  Input,
  Select,
  Table,
  Modal,
  Card,
  Badge,
  Pagination,
  PageLoading,
} from "../../components/shared";
import "./ReservationManagement.css";

const ReservationManagement = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const { showToast } = useToast();

  // Lọc đặt trước theo tìm kiếm và trạng thái
  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const matchesSearch =
        reservation.sach?.tenSach
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        reservation.sach?.tacGia
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        reservation.sach?.maSach?.toString().includes(searchTerm) ||
        reservation.docGia?.hoTen
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        reservation.docGia?.maDG?.toString().includes(searchTerm);

      const matchesStatus =
        !statusFilter || reservation.trangThai === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reservations, searchTerm, statusFilter]);

  // Phân trang
  const {
    currentData: paginatedReservations,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    goToPage,
  } = usePagination(filteredReservations, 10);

  // Load dữ liệu đặt trước
  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await reservationService.getAllReservations();
      setReservations(data);
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Xem chi tiết đặt trước
  const handleViewReservation = (reservation) => {
    setSelectedReservation(reservation);
    setShowStatusModal(true);
  };

  // Cập nhật trạng thái đặt trước
  const handleUpdateStatus = async (reservation, status) => {
    try {
      setUpdatingStatus(true);
      await reservationService.updateReservationStatus(reservation.id, status);

      const statusMessages = {
        "Đã thông báo": "Đã thông báo cho Reader",
        "Đã nhận": "Đã xác nhận Reader nhận sách",
        "Đã hủy": "Đã hủy đặt trước",
      };

      showToast(
        statusMessages[status] || "Cập nhật trạng thái thành công",
        "success"
      );
      await loadReservations();
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Xử lý thay đổi trạng thái từ checkbox
  const handleStatusChange = async (reservationId, newStatus) => {
    try {
      setUpdatingStatus(true);
      await reservationService.updateReservationStatus(
        reservationId,
        newStatus
      );

      const statusMessages = {
        "Đang chờ": "Đã chuyển về trạng thái chờ xử lý",
        "Đã thông báo": "Đã thông báo cho Reader",
        "Đã hủy": "Đã hủy đặt trước",
      };

      showToast(
        statusMessages[newStatus] || "Cập nhật trạng thái thành công",
        "success"
      );
      await loadReservations();
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Đóng modal
  const handleCloseModal = () => {
    setShowStatusModal(false);
    setSelectedReservation(null);
  };

  // Làm mới dữ liệu
  const handleRefresh = () => {
    loadReservations();
  };

  // Load dữ liệu khi component mount
  useEffect(() => {
    loadReservations();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <PageLoading size="lg" text="Đang tải danh sách đặt trước..." />
      </div>
    );
  }

  return (
    <div className="reservation-management">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">PHIẾU ĐẶT TRƯỚC SÁCH</h1>
          <p className="page-subtitle">
            Quản lý và xử lý các yêu cầu đặt trước sách của Reader
          </p>
        </div>
        <Button
          variant="primary"
          icon={<FaSync />}
          onClick={handleRefresh}
          title="Làm mới"
        >
          Làm mới
        </Button>
      </div>

      {/* Filters */}
      <Card className="filters-card">
        <div className="filters-content">
          <div className="search-filter">
            <Input
              placeholder="Tìm kiếm đặt trước..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="status-filter">
            <Select
              placeholder="Lọc theo trạng thái"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-select"
              options={[
                { value: "", label: "Tất cả trạng thái" },
                { value: "Đang chờ", label: "Chờ xử lý" },
                { value: "Đã thông báo", label: "Đã thông báo" },
                { value: "Đã nhận", label: "Đã nhận" },
                { value: "Đã hủy", label: "Đã hủy" },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <div className="statistics-grid">
        <Card className="stat-card">
          <div className="stat-content">
            <h3 className="stat-title">Tổng số đặt trước</h3>
            <p className="stat-value">{reservations.length}</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-content">
            <h3 className="stat-title">Chờ xử lý</h3>
            <p className="stat-value stat-value-warning">
              {reservations.filter((r) => r.trangThai === "Đang chờ").length}
            </p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-content">
            <h3 className="stat-title">Đã thông báo</h3>
            <p className="stat-value stat-value-info">
              {
                reservations.filter((r) => r.trangThai === "Đã thông báo")
                  .length
              }
            </p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-content">
            <h3 className="stat-title">Đã nhận</h3>
            <p className="stat-value stat-value-success">
              {reservations.filter((r) => r.trangThai === "Đã nhận").length}
            </p>
          </div>
        </Card>
      </div>

      {/* Reservations Table */}
      <Card className="table-card">
        <div className="table-container">
          <table className="reservation-table">
            <thead>
              <tr>
                <th>Mã thành viên</th>
                <th>Họ tên</th>
                <th>Mã sách</th>
                <th>Tên sách</th>
                <th>Ngày đặt trước</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReservations.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{ textAlign: "center", padding: "40px" }}
                  >
                    Không có đặt trước nào
                  </td>
                </tr>
              ) : (
                paginatedReservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td>{reservation.docGia?.maDG || "-"}</td>
                    <td>{reservation.docGia?.hoTen || "-"}</td>
                    <td>{reservation.sach?.maSach || "-"}</td>
                    <td>{reservation.sach?.tenSach || "-"}</td>
                    <td>
                      {reservation.ngayDat
                        ? new Date(reservation.ngayDat).toLocaleDateString(
                            "vi-VN"
                          )
                        : "-"}
                    </td>
                    <td>
                      <div className="status-checkboxes">
                        {[
                          {
                            key: "pending",
                            label: "Chờ xử lý",
                            value: "Đang chờ",
                          },
                          {
                            key: "notified",
                            label: "Đã thông báo",
                            value: "Đã thông báo",
                          },
                          {
                            key: "cancelled",
                            label: "Đã hủy",
                            value: "Đã hủy",
                          },
                        ].map((option) => (
                          <label key={option.key} className="status-checkbox">
                            <input
                              type="checkbox"
                              checked={reservation.trangThai === option.value}
                              onChange={() =>
                                handleStatusChange(reservation.id, option.value)
                              }
                              disabled={updatingStatus}
                            />
                            <span className="checkbox-label">
                              {option.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<FaEye />}
                          onClick={() => handleViewReservation(reservation)}
                          title="Xem chi tiết"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="table-pagination">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={goToPage}
            />
          </div>
        )}
      </Card>

      {/* Reservation Details Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={handleCloseModal}
        title={
          selectedReservation
            ? `Chi tiết đặt trước: ${selectedReservation.sach?.tenSach}`
            : "Chi tiết đặt trước"
        }
        size="md"
      >
        {selectedReservation && (
          <div className="reservation-details">
            <div className="detail-section">
              <h4>Thông tin Reader</h4>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Mã thành viên:</span>
                  <span className="info-value">
                    {selectedReservation.docGia?.maDG}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Họ tên:</span>
                  <span className="info-value">
                    {selectedReservation.docGia?.hoTen}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">
                    {selectedReservation.docGia?.email}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Số điện thoại:</span>
                  <span className="info-value">
                    {selectedReservation.docGia?.soDienThoai}
                  </span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4>Thông tin sách</h4>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Mã sách:</span>
                  <span className="info-value">
                    {selectedReservation.sach?.maSach}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Tên sách:</span>
                  <span className="info-value">
                    {selectedReservation.sach?.tenSach}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Tác giả:</span>
                  <span className="info-value">
                    {selectedReservation.sach?.tacGia}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Thể loại:</span>
                  <span className="info-value">
                    {selectedReservation.sach?.theLoai}
                  </span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4>Thông tin đặt trước</h4>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Ngày đặt:</span>
                  <span className="info-value">
                    {selectedReservation.ngayDat
                      ? new Date(
                          selectedReservation.ngayDat
                        ).toLocaleDateString("vi-VN")
                      : "-"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Trạng thái hiện tại:</span>
                  <span className="info-value">
                    <Badge
                      variant={
                        selectedReservation.trangThai === "Đang chờ"
                          ? "warning"
                          : selectedReservation.trangThai === "Đã thông báo"
                          ? "info"
                          : selectedReservation.trangThai === "Đã nhận"
                          ? "success"
                          : "danger"
                      }
                    >
                      {selectedReservation.trangThai}
                    </Badge>
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <Button variant="secondary" onClick={handleCloseModal}>
                Đóng
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReservationManagement;
