import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FaSearch, FaEdit, FaEye, FaFilter, FaSync } from 'react-icons/fa';
import bookService from '../../services/bookService';
import bookStatusService from '../../services/bookStatusService';
import { usePagination, useToast } from '../../hooks';
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
import './BookStatusManagement.css';

const BookStatusManagement = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  
  const { showToast } = useToast();

  // Lọc sách theo tìm kiếm và trạng thái
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.id?.toString().includes(searchTerm);
      
      const matchesStatus = !statusFilter || book.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [books, searchTerm, statusFilter]);

  // Phân trang
  const {
    currentData: paginatedBooks,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    goToPage
  } = usePagination(filteredBooks, 10);

  // Cấu hình columns cho Table
  const columns = useMemo(() => [
    {
      key: 'id',
      title: 'Mã sách',
      width: '100px'
    },
    {
      key: 'title',
      title: 'Tên sách',
      width: '250px'
    },
    {
      key: 'author',
      title: 'Tác giả',
      width: '150px'
    },
    {
      key: 'category',
      title: 'Thể loại',
      width: '120px'
    },
    {
      key: 'quantity',
      title: 'Tổng số',
      width: '80px'
    },
    {
      key: 'available',
      title: 'Còn lại',
      width: '80px'
    },
    {
      key: 'status',
      title: 'Trạng thái',
      width: '120px',
      render: (value) => (
        <Badge 
          variant={value === 'available' ? 'success' : value === 'borrowed' ? 'warning' : 'error'}
          text={value === 'available' ? 'Có sẵn' : value === 'borrowed' ? 'Đã mượn' : value}
        />
      )
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: '120px',
      render: (_, book) => (
        <div className="action-buttons">
          <Button
            variant="ghost"
            size="sm"
            icon={<FaEye />}
            onClick={() => handleViewBook(book)}
            title="Xem chi tiết"
          />
          <Button
            variant="ghost"
            size="sm"
            icon={<FaEdit />}
            onClick={() => handleUpdateStatus(book)}
            title="Cập nhật trạng thái"
            className="action-button-edit"
          />
        </div>
      )
    }
  ], []);

  // Load dữ liệu sách
  const loadBooks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await bookService.getBooks();
      setBooks(data);
    } catch (error) {
      showToast('Lỗi khi tải danh sách sách', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Xem chi tiết sách
  const handleViewBook = useCallback((book) => {
    setSelectedBook(book);
    setShowStatusModal(true);
  }, []);

  // Cập nhật trạng thái sách
  const handleUpdateStatus = useCallback((book) => {
    setSelectedBook(book);
    setNewStatus(book.status || '');
    setStatusNote('');
    setShowStatusModal(true);
  }, []);

  // Lưu cập nhật trạng thái
  const handleSaveStatus = useCallback(async () => {
    if (!selectedBook || !newStatus) {
      showToast('Vui lòng chọn trạng thái mới', 'warning');
      return;
    }

    try {
      setUpdatingStatus(true);
      await bookStatusService.updateBookStatus(selectedBook.id, {
        TrangThai: newStatus,
        GhiChu: statusNote,
        NgayCapNhat: new Date()
      });

      showToast('Cập nhật trạng thái sách thành công', 'success');
      
      // Cập nhật danh sách sách
      await loadBooks();
      
      setShowStatusModal(false);
      setSelectedBook(null);
      setNewStatus('');
      setStatusNote('');
    } catch (error) {
      showToast('Lỗi khi cập nhật trạng thái sách', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  }, [selectedBook, newStatus, statusNote, showToast, loadBooks]);

  // Đóng modal
  const handleCloseModal = useCallback(() => {
    setShowStatusModal(false);
    setSelectedBook(null);
    setNewStatus('');
    setStatusNote('');
  }, []);

  // Làm mới dữ liệu
  const handleRefresh = useCallback(() => {
    loadBooks();
  }, [loadBooks]);

  // Load dữ liệu khi component mount
  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  if (loading) {
    return (
      <div className="loading-container">
        <PageLoading size="lg" text="Đang tải danh sách sách..." />
      </div>
    );
  }

  return (
    <div className="book-status-management">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Quản lý trạng thái sách</h1>
          <p className="page-subtitle">
            Cập nhật trạng thái sách trong thư viện
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
              placeholder="Tìm kiếm sách..."
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
                ...bookStatusService.getAvailableStatuses()
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <div className="statistics-grid">
        <Card className="stat-card">
          <div className="stat-content">
            <h3 className="stat-title">Tổng số sách</h3>
            <p className="stat-value">{books.length}</p>
          </div>
        </Card>
        
        <Card className="stat-card">
          <div className="stat-content">
            <h3 className="stat-title">Có sẵn</h3>
            <p className="stat-value stat-value-success">
              {books.filter(b => b.status === 'available').length}
            </p>
          </div>
        </Card>
        
        <Card className="stat-card">
          <div className="stat-content">
            <h3 className="stat-title">Đã mượn</h3>
            <p className="stat-value stat-value-info">
              {books.filter(b => b.status === 'borrowed').length}
            </p>
          </div>
        </Card>
        
        <Card className="stat-card">
          <div className="stat-content">
            <h3 className="stat-title">Bảo trì/Hỏng</h3>
            <p className="stat-value stat-value-danger">
              {books.filter(b => b.status === 'maintenance' || b.status === 'damaged').length}
            </p>
          </div>
        </Card>
      </div>

      {/* Books Table */}
      <Card className="table-card">
        <Table
          data={paginatedBooks}
          columns={columns}
          emptyMessage="Không tìm thấy sách nào"
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

      {/* Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={handleCloseModal}
        title={selectedBook ? `Cập nhật trạng thái: ${selectedBook.title}` : 'Chi tiết sách'}
        size="md"
      >
        {selectedBook && (
          <div className="book-details">
            <div className="book-info">
              <div className="info-row">
                <span className="info-label">Mã sách:</span>
                <span className="info-value">{selectedBook.id}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Tên sách:</span>
                <span className="info-value">{selectedBook.title}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Tác giả:</span>
                <span className="info-value">{selectedBook.author}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Thể loại:</span>
                <span className="info-value">{selectedBook.category}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Trạng thái hiện tại:</span>
                <Badge 
                  variant={selectedBook.status === 'available' ? 'success' : selectedBook.status === 'borrowed' ? 'warning' : 'error'}
                  text={selectedBook.status === 'available' ? 'Có sẵn' : selectedBook.status === 'borrowed' ? 'Đã mượn' : selectedBook.status}
                />
              </div>
            </div>

            <div className="status-update-form">
              <div className="form-group">
                <label className="form-label">Trạng thái mới:</label>
                <Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="status-select"
                  options={[
                    { value: '', label: 'Chọn trạng thái' },
                    ...bookStatusService.getAvailableStatuses()
                  ]}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ghi chú (tùy chọn):</label>
                <Input
                  type="text"
                  placeholder="Nhập ghi chú..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="note-input"
                />
              </div>
            </div>

            <div className="modal-actions">
              <Button
                variant="secondary"
                onClick={handleCloseModal}
                disabled={updatingStatus}
              >
                Hủy
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveStatus}
                loading={updatingStatus}
                disabled={!newStatus}
              >
                Cập nhật
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BookStatusManagement; 