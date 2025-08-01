import React, { useState, useEffect } from 'react';
import { FaClipboardList, FaPlus, FaSave, FaPrint, FaTrash, FaEdit, FaEye, FaTimes } from 'react-icons/fa';
import { useToast } from '../../hooks';
import inventoryCheckService from '../../services/inventoryCheckService';
import './InventoryChecks.css';

const InventoryChecks = () => {
  const { showToast } = useToast();
  
  // Form state
  const [checkForm, setCheckForm] = useState({
    kyKiemKe: '',
    ngayKiemKe: new Date().toISOString().split('T')[0],
    nhanVienThucHien: ''
  });

  // Book details table
  const [bookDetails, setBookDetails] = useState([]);
  const [currentBook, setCurrentBook] = useState({
    maSach: '',
    tenSach: '',
    soLuongHeThong: 0,
    soLuongThucTe: 0,
    chenhLech: 0,
    ghiChu: ''
  });

  // UI state
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load checks on component mount
  useEffect(() => {
    loadChecks();
  }, []);

  const loadChecks = async () => {
    try {
      setLoading(true);
      const data = await inventoryCheckService.getAllInventoryChecks();
      setChecks(data);
    } catch (error) {
      showToast('Có lỗi xảy ra khi tải danh sách phiếu kiểm kê', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Generate check code
  useEffect(() => {
    const generateCheckCode = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
      return `${year}${month}${day}${random}`;
    };

    if (!checkForm.kyKiemKe) {
      setCheckForm(prev => ({ ...prev, kyKiemKe: generateCheckCode() }));
    }
  }, [checkForm.kyKiemKe]);

  // Calculate discrepancy
  const calculateDiscrepancy = (systemQty, actualQty) => {
    return actualQty - systemQty;
  };

  // Handle form input changes
  const handleFormChange = (field, value) => {
    setCheckForm(prev => ({ ...prev, [field]: value }));
  };

  // Handle book detail changes
  const handleBookChange = (field, value) => {
    const updatedBook = { ...currentBook, [field]: value };
    
    // Auto calculate discrepancy
    if (field === 'soLuongHeThong' || field === 'soLuongThucTe') {
      updatedBook.chenhLech = calculateDiscrepancy(
        updatedBook.soLuongHeThong, 
        updatedBook.soLuongThucTe
      );
    }
    
    setCurrentBook(updatedBook);
  };

  // Add book to table
  const addBookToTable = () => {
    if (!currentBook.maSach || !currentBook.tenSach) {
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
      soLuongHeThong: 0,
      soLuongThucTe: 0,
      chenhLech: 0,
      ghiChu: ''
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
        soLuongHeThong: 0,
        soLuongThucTe: 0,
        chenhLech: 0,
        ghiChu: ''
      });
    }
  };

  // Save check
  const saveCheck = async () => {
    if (!checkForm.nhanVienThucHien) {
      showToast('Vui lòng nhập tên nhân viên thực hiện', 'error');
      return;
    }

    if (bookDetails.length === 0) {
      showToast('Vui lòng thêm ít nhất một sách vào danh sách', 'error');
      return;
    }

    setLoading(true);
    try {
      const checkData = {
        ...checkForm,
        chiTietSach: bookDetails
      };

      await inventoryCheckService.createInventoryCheck(checkData);
      
      showToast('Lưu phiếu kiểm kê thành công!', 'success');
      resetForm();
      loadChecks(); // Reload the list
    } catch (error) {
      showToast('Có lỗi xảy ra khi lưu phiếu kiểm kê', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setCheckForm({
      kyKiemKe: '',
      ngayKiemKe: new Date().toISOString().split('T')[0],
      nhanVienThucHien: ''
    });
    setBookDetails([]);
    setCurrentBook({
      maSach: '',
      tenSach: '',
      soLuongHeThong: 0,
      soLuongThucTe: 0,
      chenhLech: 0,
      ghiChu: ''
    });
    setEditingIndex(-1);
    setShowForm(false);
  };

  // Format discrepancy
  const formatDiscrepancy = (discrepancy) => {
    if (discrepancy === 0) return '0';
    return discrepancy > 0 ? `+${discrepancy}` : `${discrepancy}`;
  };

  return (
    <div className="inventory-checks">
      <div className="page-header">
        <h1><FaClipboardList /> Phiếu kiểm kê sách</h1>
        <p>Quản lý kiểm kê sách trong kho thư viện</p>
      </div>

      {!showForm ? (
        <div className="checks-list">
          <div className="actions-bar">
            <button 
              className="btn btn-primary" 
              onClick={() => setShowForm(true)}
            >
              <FaPlus /> Tạo phiếu kiểm kê mới
        </button>
      </div>

      <div className="checks-table">
        <table>
          <thead>
            <tr>
                  <th>Kỳ kiểm kê</th>
                  <th>Ngày kiểm kê</th>
                  <th>Nhân viên thực hiện</th>
                  <th>Số lượng sách</th>
                  <th>Số sách chênh lệch</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
                {checks.map((check) => (
                <tr key={check.id}>
                    <td>{check.kyKiemKe}</td>
                    <td>{check.ngayKiemKe}</td>
                    <td>{check.nhanVienThucHien}</td>
                    <td>{check.chiTietSach?.length || 0}</td>
                  <td>
                      {check.chiTietSach?.filter(book => book.chenhLech !== 0).length || 0}
                  </td>
                  <td>
                      <span className={`status-badge ${check.trangThai}`}>
                        {check.trangThai === 'pending' ? 'Chờ xử lý' : 
                         check.trangThai === 'completed' ? 'Hoàn thành' : 
                         check.trangThai === 'cancelled' ? 'Đã hủy' : check.trangThai}
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
        <div className="check-form">
          <div className="form-header">
            <h2>Phiếu kiểm kê sách</h2>
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
                onClick={saveCheck}
                disabled={loading}
              >
                <FaSave /> Lưu kiểm kê
              </button>
            </div>
          </div>

          {/* General Information Section */}
          <div className="form-section">
            <h3>Thông tin chung</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Kỳ kiểm kê:</label>
                <input
                  type="text"
                  value={checkForm.kyKiemKe}
                  onChange={(e) => handleFormChange('kyKiemKe', e.target.value)}
                  placeholder="Mã kỳ kiểm kê tự động"
                  readOnly
                />
              </div>
              
              <div className="form-group">
                <label>Ngày kiểm kê:</label>
                <input
                  type="date"
                  value={checkForm.ngayKiemKe}
                  onChange={(e) => handleFormChange('ngayKiemKe', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label>Nhân viên thực hiện:</label>
                <input
                  type="text"
                  value={checkForm.nhanVienThucHien}
                  onChange={(e) => handleFormChange('nhanVienThucHien', e.target.value)}
                  placeholder="Nhập tên nhân viên thực hiện"
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
                  <label>Số lượng hệ thống:</label>
                  <input
                    type="number"
                    min="0"
                    value={currentBook.soLuongHeThong}
                    onChange={(e) => handleBookChange('soLuongHeThong', parseInt(e.target.value) || 0)}
                    placeholder="SL hệ thống"
                  />
                </div>
                
                <div className="form-group">
                  <label>Số lượng thực tế:</label>
                  <input
                    type="number"
                    min="0"
                    value={currentBook.soLuongThucTe}
                    onChange={(e) => handleBookChange('soLuongThucTe', parseInt(e.target.value) || 0)}
                    placeholder="SL thực tế"
                  />
              </div>
                
              <div className="form-group">
                  <label>Chênh lệch:</label>
                  <input
                    type="text"
                    value={formatDiscrepancy(currentBook.chenhLech)}
                    readOnly
                    className="readonly"
                  />
              </div>
                
              <div className="form-group">
                  <label>Ghi chú:</label>
                  <input
                    type="text"
                    value={currentBook.ghiChu}
                    onChange={(e) => handleBookChange('ghiChu', e.target.value)}
                    placeholder="Ghi chú (nếu có)"
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
                    <th>SL hệ thống</th>
                    <th>SL thực tế</th>
                    <th>Chênh lệch</th>
                    <th>Ghi chú</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {bookDetails.map((book, index) => (
                    <tr key={book.id || index}>
                      <td>{index + 1}</td>
                      <td>{book.maSach}</td>
                      <td>{book.tenSach}</td>
                      <td>{book.soLuongHeThong}</td>
                      <td>{book.soLuongThucTe}</td>
                      <td className={book.chenhLech !== 0 ? 'discrepancy' : ''}>
                        {formatDiscrepancy(book.chenhLech)}
                      </td>
                      <td>{book.ghiChu || '...'}</td>
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
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryChecks; 