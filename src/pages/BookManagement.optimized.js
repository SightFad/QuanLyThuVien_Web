import React, { useState, useCallback, useMemo } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import BookModal from "../components/BookModal";
import { 
  LoadingSpinner, 
  SearchBox, 
  Table, 
  Button,
  StatusBadge,
  Pagination
} from "../components/shared";
import { useApi, useDebounce, usePagination } from "../hooks";
import "./BookManagement.css";

const BookManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Sử dụng custom hook cho API calls
  const { data: books = [], loading, error, refetch } = useApi(
    "https://libraryapi20250714182231-dvf7buahgwdmcmg7.southeastasia-01.azurewebsites.net/api/Sach",
    {},
    true
  );

  // Map dữ liệu API
  const mappedBooks = useMemo(() => {
    return books.map((book) => ({
      id: book.maSach,
      title: book.tenSach,
      author: book.tacGia,
      isbn: book.isbn,
      category: book.theLoai,
      publisher: book.nhaXuatBan,
      publishYear: book.namXB,
      quantity: book.soLuong,
      available: book.soLuongConLai,
      location: book.viTriLuuTru,
    }));
  }, [books]);

  // Lọc sách
  const filteredBooks = useMemo(() => {
    if (!debouncedSearchTerm) return mappedBooks;
    
    return mappedBooks.filter(
      (book) =>
        book.title?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        book.author?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        book.isbn?.includes(debouncedSearchTerm)
    );
  }, [mappedBooks, debouncedSearchTerm]);

  // Pagination
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
      width: '200px'
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
      key: 'publisher',
      title: 'NXB',
      width: '150px'
    },
    {
      key: 'publishYear',
      title: 'Năm XB',
      width: '80px'
    },
    {
      key: 'quantity',
      title: 'Số lượng',
      width: '80px'
    },
    {
      key: 'available',
      title: 'Còn lại',
      width: '80px',
      render: (value, row) => (
        <StatusBadge 
          status={value > 0 ? 'active' : 'inactive'}
        >
          {value}
        </StatusBadge>
      )
    },
    {
      key: 'location',
      title: 'Vị trí',
      width: '100px'
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
            icon={<FaEdit />}
            onClick={() => handleEditBook(book)}
            title="Chỉnh sửa"
          />
          <Button
            variant="ghost"
            size="sm"
            icon={<FaTrash />}
            onClick={() => handleDeleteBook(book.id)}
            title="Xóa"
            className="text-red-600 hover:bg-red-50"
          />
        </div>
      )
    }
  ], []);

  // Event handlers
  const handleAddBook = useCallback(() => {
    setEditingBook(null);
    setShowModal(true);
  }, []);

  const handleEditBook = useCallback((book) => {
    setEditingBook(book);
    setShowModal(true);
  }, []);

  const handleDeleteBook = useCallback((bookId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sách này?")) {
      // TODO: Implement delete API call
      console.log("Deleting book:", bookId);
      refetch();
    }
  }, [refetch]);

  const handleSaveBook = useCallback((bookData) => {
    // TODO: Implement save API call
    console.log("Saving book:", bookData);
    setShowModal(false);
    refetch();
  }, [refetch]);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setEditingBook(null);
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" text="Đang tải danh sách sách..." />;
  }

  if (error) {
    return (
      <div className="error-state">
        <p>Có lỗi xảy ra khi tải dữ liệu: {error}</p>
        <Button onClick={refetch}>Thử lại</Button>
      </div>
    );
  }

  return (
    <div className="book-management">
      <div className="page-header">
        <h1 className="page-title">
          <FaSearch />
          Quản lý sách
        </h1>
        <p className="page-subtitle">
          Quản lý thông tin sách trong thư viện
        </p>
      </div>

      {/* Search and Actions */}
      <div className="content-section">
        <div className="section-header">
          <SearchBox
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Tìm kiếm theo tên sách, tác giả hoặc ISBN..."
            className="flex-1"
          />
          <Button
            variant="primary"
            icon={<FaPlus />}
            onClick={handleAddBook}
          >
            Thêm sách mới
          </Button>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          data={paginatedBooks}
          loading={loading}
          emptyMessage="Không tìm thấy sách nào"
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={goToPage}
          />
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <BookModal
          book={editingBook}
          onSave={handleSaveBook}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default React.memo(BookManagement);