import React, { useState } from 'react';
import { FaPlus, FaTimes, FaSave, FaArrowLeft } from 'react-icons/fa';
import { useToast } from '../../hooks';
import { bookProposalService } from '../../services/bookProposalService';
import './CreateProposal.css';

const CreateProposal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    tieuDe: '',
    mucDoUuTien: 'Trung bình',
    moTa: '',
    ghiChu: '',
    chiTietDeXuatMuaSachs: []
  });

  const [newBook, setNewBook] = useState({
    tenSach: '',
    tacGia: '',
    isbn: '',
    theLoai: '',
    nhaXuatBan: '',
    namXuatBan: '',
    soLuong: 1,
    donGia: 0,
    lyDo: '',
    ghiChu: ''
  });

  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addBook = () => {
    if (!newBook.tenSach.trim()) {
      showToast('Vui lòng nhập tên sách', 'error');
      return;
    }

    if (newBook.soLuong <= 0) {
      showToast('Số lượng phải lớn hơn 0', 'error');
      return;
    }

    if (newBook.donGia < 0) {
      showToast('Đơn giá không được âm', 'error');
      return;
    }

    setFormData(prev => ({
      ...prev,
      chiTietDeXuatMuaSachs: [...prev.chiTietDeXuatMuaSachs, { ...newBook }]
    }));

    setNewBook({
      tenSach: '',
      tacGia: '',
      isbn: '',
      theLoai: '',
      nhaXuatBan: '',
      namXuatBan: '',
      soLuong: 1,
      donGia: 0,
      lyDo: '',
      ghiChu: ''
    });
  };

  const removeBook = (index) => {
    setFormData(prev => ({
      ...prev,
      chiTietDeXuatMuaSachs: prev.chiTietDeXuatMuaSachs.filter((_, i) => i !== index)
    }));
  };

  const calculateTotalCost = () => {
    return formData.chiTietDeXuatMuaSachs.reduce((total, book) => {
      return total + (book.soLuong * book.donGia);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tieuDe.trim()) {
      showToast('Vui lòng nhập tiêu đề đề xuất', 'error');
      return;
    }

    if (formData.chiTietDeXuatMuaSachs.length === 0) {
      showToast('Vui lòng thêm ít nhất một cuốn sách', 'error');
      return;
    }

    try {
      setLoading(true);
      
      const proposalData = {
        ...formData,
        maNguoiDeXuat: 1, // TODO: Get current user ID
        chiPhiDuKien: calculateTotalCost()
      };

      await bookProposalService.createProposal(proposalData);
      
      showToast('Tạo đề xuất thành công!', 'success');
      onSuccess();
      onClose();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-proposal">
      <div className="create-proposal-header">
        <button className="btn-back" onClick={onClose}>
          <FaArrowLeft /> Quay lại
        </button>
        <h2>Tạo đề xuất mua sách mới</h2>
      </div>

      <form onSubmit={handleSubmit} className="proposal-form">
        <div className="form-section">
          <h3>Thông tin chung</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Tiêu đề đề xuất *</label>
              <input
                type="text"
                name="tieuDe"
                value={formData.tieuDe}
                onChange={handleInputChange}
                placeholder="Nhập tiêu đề đề xuất..."
                required
              />
            </div>

            <div className="form-group">
              <label>Mức độ ưu tiên *</label>
              <select
                name="mucDoUuTien"
                value={formData.mucDoUuTien}
                onChange={handleInputChange}
                required
              >
                <option value="Cao">Cao</option>
                <option value="Trung bình">Trung bình</option>
                <option value="Thấp">Thấp</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Mô tả</label>
              <textarea
                name="moTa"
                value={formData.moTa}
                onChange={handleInputChange}
                placeholder="Mô tả chi tiết về đề xuất mua sách..."
                rows={4}
              />
            </div>

            <div className="form-group full-width">
              <label>Ghi chú</label>
              <textarea
                name="ghiChu"
                value={formData.ghiChu}
                onChange={handleInputChange}
                placeholder="Ghi chú bổ sung..."
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Danh sách sách ({formData.chiTietDeXuatMuaSachs.length} cuốn)</h3>
          
          <div className="add-book-section">
            <h4>Thêm sách mới</h4>
            <div className="book-form-grid">
              <div className="form-group">
                <label>Tên sách *</label>
                <input
                  type="text"
                  name="tenSach"
                  value={newBook.tenSach}
                  onChange={handleBookInputChange}
                  placeholder="Nhập tên sách..."
                />
              </div>

              <div className="form-group">
                <label>Tác giả</label>
                <input
                  type="text"
                  name="tacGia"
                  value={newBook.tacGia}
                  onChange={handleBookInputChange}
                  placeholder="Nhập tác giả..."
                />
              </div>

              <div className="form-group">
                <label>ISBN</label>
                <input
                  type="text"
                  name="isbn"
                  value={newBook.isbn}
                  onChange={handleBookInputChange}
                  placeholder="Nhập ISBN..."
                />
              </div>

              <div className="form-group">
                <label>Thể loại</label>
                <input
                  type="text"
                  name="theLoai"
                  value={newBook.theLoai}
                  onChange={handleBookInputChange}
                  placeholder="Nhập thể loại..."
                />
              </div>

              <div className="form-group">
                <label>Nhà xuất bản</label>
                <input
                  type="text"
                  name="nhaXuatBan"
                  value={newBook.nhaXuatBan}
                  onChange={handleBookInputChange}
                  placeholder="Nhập nhà xuất bản..."
                />
              </div>

              <div className="form-group">
                <label>Năm xuất bản</label>
                <input
                  type="number"
                  name="namXuatBan"
                  value={newBook.namXuatBan}
                  onChange={handleBookInputChange}
                  placeholder="Nhập năm xuất bản..."
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>

              <div className="form-group">
                <label>Số lượng *</label>
                <input
                  type="number"
                  name="soLuong"
                  value={newBook.soLuong}
                  onChange={handleBookInputChange}
                  placeholder="Nhập số lượng..."
                  min="1"
                />
              </div>

              <div className="form-group">
                <label>Đơn giá (VNĐ) *</label>
                <input
                  type="number"
                  name="donGia"
                  value={newBook.donGia}
                  onChange={handleBookInputChange}
                  placeholder="Nhập đơn giá..."
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Lý do</label>
                <input
                  type="text"
                  name="lyDo"
                  value={newBook.lyDo}
                  onChange={handleBookInputChange}
                  placeholder="Lý do cần mua sách này..."
                />
              </div>

              <div className="form-group">
                <label>Ghi chú</label>
                <input
                  type="text"
                  name="ghiChu"
                  value={newBook.ghiChu}
                  onChange={handleBookInputChange}
                  placeholder="Ghi chú về sách..."
                />
              </div>

              <div className="form-group">
                <button
                  type="button"
                  className="btn-add-book"
                  onClick={addBook}
                >
                  <FaPlus /> Thêm sách
                </button>
              </div>
            </div>
          </div>

          {formData.chiTietDeXuatMuaSachs.length > 0 && (
            <div className="books-list">
              <h4>Danh sách sách đã thêm</h4>
              <div className="books-table">
                <table>
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Tên sách</th>
                      <th>Tác giả</th>
                      <th>Số lượng</th>
                      <th>Đơn giá</th>
                      <th>Thành tiền</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.chiTietDeXuatMuaSachs.map((book, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{book.tenSach}</td>
                        <td>{book.tacGia}</td>
                        <td>{book.soLuong}</td>
                        <td>{bookProposalService.formatCurrency(book.donGia)}</td>
                        <td>{bookProposalService.formatCurrency(book.soLuong * book.donGia)}</td>
                        <td>
                          <button
                            type="button"
                            className="btn-remove"
                            onClick={() => removeBook(index)}
                          >
                            <FaTimes />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="form-summary">
          <div className="summary-item">
            <span>Tổng số sách:</span>
            <span>{formData.chiTietDeXuatMuaSachs.length} cuốn</span>
          </div>
          <div className="summary-item">
            <span>Tổng chi phí dự kiến:</span>
            <span className="total-cost">{bookProposalService.formatCurrency(calculateTotalCost())}</span>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={loading || formData.chiTietDeXuatMuaSachs.length === 0}
          >
            <FaSave />
            {loading ? 'Đang tạo...' : 'Tạo đề xuất'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProposal; 