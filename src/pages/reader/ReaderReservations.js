import React, { useState, useEffect, useMemo } from 'react';
import { FaCalendarAlt, FaBook, FaClock, FaCheck, FaTimes, FaSearch, FaFilter, FaSync } from 'react-icons/fa';
import { usePagination, useToast } from '../../hooks';
import reservationService from '../../services/reservationService';
import { 
  Button, 
  Input, 
  Select, 
  Table, 
  Modal, 
  Card,
  Badge,
  Pagination,
  PageLoading
} from '../../components/shared';
import './ReaderReservations.css';

const ReaderReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  
  const { showToast } = useToast();

  // Lọc đặt trước theo tìm kiếm và trạng thái
  const filteredReservations = useMemo(() => {
    return reservations.filter(reservation => {
      const matchesSearch = reservation.sach?.tenSach?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           reservation.sach?.tacGia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           reservation.sach?.maSach?.toString().includes(searchTerm) ||
                           reservation.docGia?.hoTen?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || reservation.trangThai === statusFilter;
      
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
    goToPage
  } = usePagination(filteredReservations, 10);

  // Cấu hình columns cho Table
  const columns = useMemo(() => [
    {
      key: 'docGia.maDG',
      title: 'Mã thành viên',
      width: '120px',
      render: (_, reservation) => reservation.docGia?.maDG || '-'
    },
    {
      key: 'docGia.hoTen',
      title: 'Họ tên',
      width: '150px',
      render: (_, reservation) => reservation.docGia?.hoTen || '-'
    },
    {
      key: 'sach.maSach',
      title: 'Mã sách',
      width: '100px',
      render: (_, reservation) => reservation.sach?.maSach || '-'
    },
    {
      key: 'sach.tenSach',
      title: 'Tên sách',
      width: '250px',
      render: (_, reservation) => reservation.sach?.tenSach || '-'
    },
    {
      key: 'ngayDat',
      title: 'Ngày đặt trước',
      width: '150px',
      render: (value) => value ? new Date(value).toLocaleDateString('vi-VN') : '-'
    },
    {
      key: 'trangThai',
      title: 'Trạng thái',
      width: '150px',
      render: (value) => {
        const statusConfig = {
          'Đang chờ': { label: 'Chờ xử lý', variant: 'warning' },
          'Đã thông báo': { label: 'Đã thông báo', variant: 'info' },
          'Đã hủy': { label: 'Đã hủy', variant: 'danger' },
          'Đã nhận': { label: 'Đã nhận', variant: 'success' }
        };
        
        const config = statusConfig[value] || { label: value, variant: 'default' };
        return <Badge variant={config.variant}>{config.label}</Badge>;
      }
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: '120px',
      render: (_, reservation) => (
        <div className="action-buttons">
          {reservation.trangThai === 'Đang chờ' && (
            <Button
              variant="ghost"
              size="sm"
              icon={<FaTimes />}
              onClick={() => handleCancelReservation(reservation)}
              title="Hủy đặt trước"
              className="action-button-cancel"
            />
          )}
        </div>
      )
    }
  ], []);

  // Load dữ liệu đặt trước
  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await reservationService.getMyReservations();
      setReservations(data);
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Hủy đặt trước
  const handleCancelReservation = (reservation) => {
    setSelectedReservation(reservation);
    setShowCancelModal(true);
  };

  // Xác nhận hủy đặt trước
  const handleConfirmCancel = async () => {
    if (!selectedReservation) return;

    try {
      setCancelling(true);
      await reservationService.cancelReservation(selectedReservation.id);
      showToast('Hủy đặt trước thành công', 'success');
      await loadReservations();
      setShowCancelModal(false);
      setSelectedReservation(null);
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setCancelling(false);
    }
  };

  // Đóng modal
  const handleCloseModal = () => {
    setShowCancelModal(false);
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
    <div className="reader-reservations">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Phiếu đặt trước sách</h1>
          <p className="page-subtitle">
            Quản lý các đặt trước sách của bạn
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
                { value: '', label: 'Tất cả trạng thái' },
                { value: 'Đang chờ', label: 'Chờ xử lý' },
                { value: 'Đã thông báo', label: 'Đã thông báo' },
                { value: 'Đã nhận', label: 'Đã nhận' },
                { value: 'Đã hủy', label: 'Đã hủy' }
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
              {reservations.filter(r => r.trangThai === 'Đang chờ').length}
            </p>
          </div>
        </Card>
        
        <Card className="stat-card">
          <div className="stat-content">
            <h3 className="stat-title">Đã thông báo</h3>
            <p className="stat-value stat-value-info">
              {reservations.filter(r => r.trangThai === 'Đã thông báo').length}
            </p>
          </div>
        </Card>
        
        <Card className="stat-card">
          <div className="stat-content">
            <h3 className="stat-title">Đã nhận</h3>
            <p className="stat-value stat-value-success">
              {reservations.filter(r => r.trangThai === 'Đã nhận').length}
            </p>
          </div>
        </Card>
      </div>

      {/* Reservations Table */}
      <Card className="table-card">
        <Table
          data={paginatedReservations}
          columns={columns}
          emptyMessage="Không có đặt trước nào"
        />
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

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={handleCloseModal}
        title="Xác nhận hủy đặt trước"
        size="sm"
      >
        {selectedReservation && (
          <div className="cancel-confirmation">
            <p>Bạn có chắc chắn muốn hủy đặt trước sách:</p>
            <div className="book-info">
              <strong>{selectedReservation.sach?.tenSach}</strong>
              <p>Tác giả: {selectedReservation.sach?.tacGia}</p>
              <p>Ngày đặt: {new Date(selectedReservation.ngayDat).toLocaleDateString('vi-VN')}</p>
            </div>
            
            <div className="modal-actions">
              <Button
                variant="secondary"
                onClick={handleCloseModal}
                disabled={cancelling}
              >
                Hủy
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmCancel}
                loading={cancelling}
              >
                Xác nhận hủy
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReaderReservations; 