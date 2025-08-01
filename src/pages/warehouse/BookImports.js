import React, { useState, useEffect } from 'react';
import { FaTruck, FaPlus, FaSave, FaPrint, FaTrash, FaEdit, FaEye, FaTimes } from 'react-icons/fa';
import { useToast } from '../../hooks';
import phieuNhapKhoService from '../../services/phieuNhapKhoService';
import './BookImports.css';

const BookImports = () => {
  const { showToast } = useToast();
  
  // Form state
  const [importForm, setImportForm] = useState({
    maPhieu: '',
    ngayNhap: new Date().toISOString().split('T')[0],
    nhaCungCap: '',
    ghiChu: ''
  });

  // Book details table
  const [bookDetails, setBookDetails] = useState([]);
  const [currentBook, setCurrentBook] = useState({
    maSach: '',
    tenSach: '',
    soLuong: 1,
    donGia: 0,
    thanhTien: 0
  });

  // UI state
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [imports, setImports] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load imports on component mount
  useEffect(() => {
    loadImports();
  }, []);

  const loadImports = async () => {
    try {
      setLoading(true);
      const data = await phieuNhapKhoService.getAllPhieuNhapKho();
      setImports(data);
    } catch (error) {
      showToast('Có lỗi xảy ra khi tải danh sách phiếu nhập kho', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Generate import code
  useEffect(() => {
    const generateImportCode = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `NK-${year}${month}${day}-${random}`;
    };

    if (!importForm.maPhieu) {
      setImportForm(prev => ({ ...prev, maPhieu: generateImportCode() }));
    }
  }, [importForm.maPhieu]);

  // Calculate total amount
  const calculateTotal = () => {
    return bookDetails.reduce((total, book) => total + book.thanhTien, 0);
  };

  // Handle form input changes
  const handleFormChange = (field, value) => {
    setImportForm(prev => ({ ...prev, [field]: value }));
  };

  // Handle book detail changes
  const handleBookChange = (field, value) => {
    const updatedBook = { ...currentBook, [field]: value };
    
    // Auto calculate thanhTien
    if (field === 'soLuong' || field === 'donGia') {
      updatedBook.thanhTien = updatedBook.soLuong * updatedBook.donGia;
    }
    
    setCurrentBook(updatedBook);
  };

  // Add book to table
  const addBookToTable = () => {
    if (!currentBook.maSach || !currentBook.tenSach || currentBook.soLuong <= 0) {
      showToast('Vui lòng nhập đầy đủ thông tin sách', 'error');
      return;
    }

    if (editingIndex >= 0) {
      // Update existing book
      const updatedDetails = [...bookDetails];
      updatedDetails[editingIndex] = { ...currentBook };
      setBookDetails(updatedDetails);
      setEditingIndex(-1);
    } else {
      // Add new book
      setBookDetails(prev => [...prev, { ...currentBook, id: Date.now() }]);
    }

    // Reset current book
    setCurrentBook({
      maSach: '',
      tenSach: '',
      soLuong: 1,
      donGia: 0,
      thanhTien: 0
    });
  };

  // Edit book in table
  const editBook = (index) => {
    setCurrentBook({ ...bookDetails[index] });
    setEditingIndex(index);
  };

  // Remove book from table
  const removeBook = (index) => {
    setBookDetails(prev => prev.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(-1);
      setCurrentBook({
        maSach: '',
        tenSach: '',
        soLuong: 1,
        donGia: 0,
        thanhTien: 0
      });
    }
  };

  // Save import
  const saveImport = async () => {
    if (!importForm.nhaCungCap) {
      showToast('Vui lòng nhập tên nhà cung cấp', 'error');
      return;
    }

    if (bookDetails.length === 0) {
      showToast('Vui lòng thêm ít nhất một sách vào danh sách', 'error');
      return;
    }

    setLoading(true);
    try {
      const importData = {
        ...importForm,
        chiTietSach: bookDetails
      };

      await phieuNhapKhoService.createPhieuNhapKho(importData);
      
      showToast('Lưu phiếu nhập kho thành công!', 'success');
      resetForm();
      loadImports(); // Reload the list
    } catch (error) {
      showToast('Có lỗi xảy ra khi lưu phiếu nhập kho', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setImportForm({
      maPhieu: '',
      ngayNhap: new Date().toISOString().split('T')[0],
      nhaCungCap: '',
      ghiChu: ''
    });
    setBookDetails([]);
    setCurrentBook({
      maSach: '',
      tenSach: '',
      soLuong: 1,
      donGia: 0,
      thanhTien: 0
    });
    setEditingIndex(-1);
    setShowForm(false);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="book-imports">
      <div className="page-header">
        <h1><FaTruck /> Phiếu nhập kho sách</h1>
        <p>Quản lý nhập sách vào kho thư viện</p>
      </div>

      {!showForm ? (
        <div className="imports-list">
          <div className="actions-bar">
            <button 
              className="btn btn-primary" 
              onClick={() => setShowForm(true)}
            >
              <FaPlus /> Tạo phiếu nhập mới
        </button>
      </div>

      <div className="imports-table">
        <table>
          <thead>
            <tr>
                  <th>Mã phiếu</th>
                  <th>Ngày nhập</th>
              <th>Nhà cung cấp</th>
              <th>Số lượng sách</th>
                  <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
                {imports.map((importItem) => (
                <tr key={importItem.id}>
                    <td>{importItem.maPhieu}</td>
                    <td>{importItem.ngayNhap}</td>
                    <td>{importItem.nhaCungCap}</td>
                    <td>{importItem.chiTietSach?.length || 0}</td>
                    <td>{formatCurrency(importItem.tongTien || 0)}</td>
                    <td>
                      <span className={`status-badge ${importItem.trangThai}`}>
                        {importItem.trangThai === 'pending' ? 'Chờ xử lý' : 
                         importItem.trangThai === 'completed' ? 'Hoàn thành' : 
                         importItem.trangThai === 'cancelled' ? 'Đã hủy' : importItem.trangThai}
                    </span>
                  </td>
                  <td>
                      <button className="btn-icon" title="Xem chi tiết">
                        <FaEye />
                      </button>
                      <button className="btn-icon" title="In phiếu">
                        <FaPrint />
                      </button>
                  </td>
                </tr>
                ))}
          </tbody>
        </table>
      </div>
        </div>
      ) : (
        <div className="import-form">
          <div className="form-header">
            <h2>Phiếu nhập kho sách</h2>
            <div className="form-actions">
              <button 
                className="btn btn-secondary" 
                onClick={resetForm}
                disabled={loading}
              >
                <FaTimes /> Hủy
              </button>
              <button 
                className="btn btn-primary" 
                onClick={saveImport}
                disabled={loading}
              >
                <FaSave /> Lưu phiếu
              </button>
            </div>
          </div>

          {/* General Information Section */}
          <div className="form-section">
            <h3>Thông tin chung</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Mã phiếu:</label>
                <input
                  type="text"
                  value={importForm.maPhieu}
                  onChange={(e) => handleFormChange('maPhieu', e.target.value)}
                  placeholder="Mã phiếu tự động"
                  readOnly
                />
              </div>
              
              <div className="form-group">
                <label>Ngày nhập:</label>
                <input
                  type="date"
                  value={importForm.ngayNhap}
                  onChange={(e) => handleFormChange('ngayNhap', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label>Nhà cung cấp:</label>
                <input
                  type="text"
                  value={importForm.nhaCungCap}
                  onChange={(e) => handleFormChange('nhaCungCap', e.target.value)}
                  placeholder="Nhập tên nhà cung cấp"
                />
              </div>
              
              <div className="form-group">
                <label>Ghi chú:</label>
                <textarea
                  value={importForm.ghiChu}
                  onChange={(e) => handleFormChange('ghiChu', e.target.value)}
                  placeholder="Ghi chú về phiếu nhập"
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* Book Details Section */}
          <div className="form-section">
            <h3>Chi tiết sách</h3>
            
            {/* Add Book Form */}
            <div className="add-book-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Mã sách:</label>
                  <input
                    type="text"
                    value={currentBook.maSach}
                    onChange={(e) => handleBookChange('maSach', e.target.value)}
                    placeholder="Nhập mã sách"
                  />
                </div>
                
                <div className="form-group">
                  <label>Tên sách:</label>
                  <input
                    type="text"
                    value={currentBook.tenSach}
                    onChange={(e) => handleBookChange('tenSach', e.target.value)}
                    placeholder="Nhập tên sách"
                  />
                </div>
                
                <div className="form-group">
                  <label>Số lượng:</label>
                  <input
                    type="number"
                    min="1"
                    value={currentBook.soLuong}
                    onChange={(e) => handleBookChange('soLuong', parseInt(e.target.value) || 0)}
                    placeholder="Số lượng"
                  />
                </div>
                
                <div className="form-group">
                  <label>Đơn giá:</label>
                  <input
                    type="number"
                    min="0"
                    value={currentBook.donGia}
                    onChange={(e) => handleBookChange('donGia', parseInt(e.target.value) || 0)}
                    placeholder="Đơn giá (VNĐ)"
                  />
                </div>
                
                <div className="form-group">
                  <label>Thành tiền:</label>
                  <input
                    type="text"
                    value={formatCurrency(currentBook.thanhTien)}
                    readOnly
                    className="readonly"
                  />
                </div>
                
                <div className="form-group">
                  <label>&nbsp;</label>
                  <button 
                    className="btn btn-success" 
                    onClick={addBookToTable}
                  >
                    <FaPlus /> {editingIndex >= 0 ? 'Cập nhật' : 'Thêm sách'}
                  </button>
                </div>
              </div>
            </div>

            {/* Book Details Table */}
            <div className="book-details-table">
              <table>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã sách</th>
                    <th>Tên sách</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {bookDetails.map((book, index) => (
                    <tr key={book.id || index}>
                      <td>{index + 1}</td>
                      <td>{book.maSach}</td>
                      <td>{book.tenSach}</td>
                      <td>{book.soLuong}</td>
                      <td>{formatCurrency(book.donGia)}</td>
                      <td>{formatCurrency(book.thanhTien)}</td>
                      <td>
              <button 
                          className="btn-icon" 
                          onClick={() => editBook(index)}
                          title="Sửa"
              >
                          <FaEdit />
              </button>
                        <button 
                          className="btn-icon btn-danger" 
                          onClick={() => removeBook(index)}
                          title="Xóa"
                        >
                          <FaTrash />
              </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="5" className="text-right"><strong>Tổng cộng:</strong></td>
                    <td><strong>{formatCurrency(calculateTotal())}</strong></td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookImports; 