import React, { useState, useEffect } from 'react';
import { FaTimes, FaCheck, FaBook, FaUser, FaCalendarAlt, FaMoneyBillWave, FaInfoCircle } from 'react-icons/fa';
import FinePaymentModal from './FinePaymentModal';
import './ReturnModal.css';

const ReturnModal = ({ isOpen, onClose, borrowData, onConfirm }) => {
  const [returnData, setReturnData] = useState({
    returnDate: '',
    actualReturnDate: '',
    borrowedDays: 0,
    fineAmount: 0,
    notes: '',
    condition: 'good', // good, damaged, lost
    librarianNotes: ''
  });

  const [errors, setErrors] = useState({});
  const [showFinePaymentModal, setShowFinePaymentModal] = useState(false);
  const [finePaymentData, setFinePaymentData] = useState(null);

  useEffect(() => {
    if (isOpen && borrowData) {
      const today = new Date();
      const borrowDate = new Date(borrowData.borrowDate);
      const dueDate = new Date(borrowData.returnDate);
      
      // Tính số ngày mượn
      const borrowedDays = Math.floor((today - borrowDate) / (1000 * 60 * 60 * 24));
      
      // Tính tiền phạt dựa trên các trường hợp
      const daysLate = Math.max(0, Math.floor((today - dueDate) / (1000 * 60 * 60 * 24)));
      let fineAmount = 0;
      
      // Phạt trễ hạn: 5000 VND/ngày sau 30 ngày
      if (daysLate > 30) {
        fineAmount += (daysLate - 30) * 5000;
      }
      
      // Phạt hư sách: 100,000 VND
      // Phạt mất sách: 200,000 VND
      // (Sẽ được tính dựa trên condition khi user chọn)

      setReturnData({
        returnDate: borrowData.returnDate,
        actualReturnDate: today.toISOString().split('T')[0],
        borrowedDays: borrowedDays,
        fineAmount: fineAmount,
        notes: borrowData.notes || '',
        condition: 'good',
        librarianNotes: ''
      });
    }
  }, [isOpen, borrowData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'condition') {
      // Tính toán lại tiền phạt khi thay đổi tình trạng sách
      const today = new Date();
      const dueDate = new Date(borrowData.returnDate);
      const daysLate = Math.max(0, Math.floor((today - dueDate) / (1000 * 60 * 60 * 24)));
      let fineAmount = 0;
      
      // Phạt trễ hạn: 5000 VND/ngày sau 30 ngày
      if (daysLate > 30) {
        fineAmount += (daysLate - 30) * 5000;
      }
      
      // Phạt hư sách: 100,000 VND
      if (value === 'damaged') {
        fineAmount += 100000;
      }
      
      // Phạt mất sách: 200,000 VND
      if (value === 'lost') {
        fineAmount += 200000;
      }
      
      setReturnData(prev => ({
        ...prev,
        [name]: value,
        fineAmount: fineAmount
      }));
    } else {
      setReturnData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!returnData.actualReturnDate) {
      newErrors.actualReturnDate = 'Ngày trả thực tế là bắt buộc';
    }
    
    if (!returnData.condition) {
      newErrors.condition = 'Tình trạng sách là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Kiểm tra xem có cần thanh toán phạt không
    if (returnData.fineAmount > 0 || returnData.condition !== 'good') {
      // Hiển thị modal thanh toán phạt
      setFinePaymentData({
        readerId: borrowData.readerId,
        readerName: borrowData.readerName,
        bookId: borrowData.bookId,
        bookTitle: borrowData.bookTitle,
        fineAmount: returnData.fineAmount,
        condition: returnData.condition
      });
      setShowFinePaymentModal(true);
    } else {
      // Không có phạt, tiến hành trả sách ngay
      completeReturnProcess();
    }
  };

  const handleFinePaymentConfirm = (finePayment) => {
    // Sau khi thanh toán phạt thành công, tiến hành trả sách
    completeReturnProcess(finePayment);
  };

  const completeReturnProcess = (finePayment = null) => {
    // Tạo phiếu trả sách
    const returnSlip = {
      id: Date.now(),
      borrowId: borrowData.id,
      readerId: borrowData.readerId,
      readerName: borrowData.readerName,
      bookId: borrowData.bookId,
      bookTitle: borrowData.bookTitle,
      borrowDate: borrowData.borrowDate,
      dueDate: borrowData.returnDate,
      actualReturnDate: returnData.actualReturnDate,
      borrowedDays: returnData.borrowedDays,
      fineAmount: returnData.fineAmount,
      condition: returnData.condition,
      notes: returnData.notes,
      librarianNotes: returnData.librarianNotes,
      finePayment: finePayment, // Thêm thông tin thanh toán phạt
      status: 'completed',
      createdAt: new Date().toISOString()
    };

    console.log('Phiếu trả sách:', returnSlip);
    
    // Thông báo thành công
    let successMessage = `✅ Phiếu trả sách đã được tạo thành công!

📋 Thông tin phiếu trả:
• Mã phiếu: ${returnSlip.id}
• Thành viên: ${returnSlip.readerName}
• Sách: ${returnSlip.bookTitle}
• Ngày trả: ${new Date(returnSlip.actualReturnDate).toLocaleDateString('vi-VN')}
• Số ngày mượn: ${returnSlip.borrowedDays} ngày
• Tình trạng: ${returnSlip.condition === 'good' ? 'Tốt' : returnSlip.condition === 'damaged' ? 'Hư hỏng' : 'Mất'}`;

    if (finePayment) {
      successMessage += `
• Tiền phạt: ${finePayment.fineAmount.toLocaleString('vi-VN')} VND
• Đã thanh toán: ${finePayment.paymentMethod === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}
${finePayment.transactionCode ? `• Mã giao dịch: ${finePayment.transactionCode}` : ''}`;
    } else {
      successMessage += `
• Tiền phạt: Không có`;
    }

    successMessage += `

💡 Sách đã được trả thành công!`;

    alert(successMessage);

    // Gọi callback để cập nhật trạng thái phiếu mượn
    if (onConfirm) {
      onConfirm(returnData);
    }
    
    onClose();
  };

  const getConditionText = (condition) => {
    switch (condition) {
      case 'good': return 'Tốt';
      case 'damaged': return 'Hư hỏng';
      case 'lost': return 'Mất';
      default: return 'Tốt';
    }
  };

  if (!isOpen || !borrowData) return null;

  return (
    <div className="return-modal-overlay">
      <div className="return-modal">
        <div className="return-modal-header">
          <h2>
            <FaBook className="header-icon" />
            Phiếu Trả Sách
          </h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="return-form">
          {/* Thông tin phiếu mượn */}
          <div className="form-section">
            <h3 className="section-title">
              <FaInfoCircle className="section-icon" />
              Thông Tin Phiếu Mượn
            </h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Mã phiếu mượn:</label>
                <span className="info-value">{borrowData.id}</span>
              </div>
              <div className="info-item">
                <label>Thành viên:</label>
                <span className="info-value">{borrowData.readerName}</span>
              </div>
              <div className="info-item">
                <label>Sách:</label>
                <span className="info-value">{borrowData.bookTitle}</span>
              </div>
              <div className="info-item">
                <label>Ngày mượn:</label>
                <span className="info-value">
                  {new Date(borrowData.borrowDate).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="info-item">
                <label>Hạn trả:</label>
                <span className="info-value">
                  {new Date(borrowData.returnDate).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="info-item">
                <label>Số ngày mượn:</label>
                <span className="info-value">{returnData.borrowedDays} ngày</span>
              </div>
            </div>
          </div>

          {/* Thông tin trả sách */}
          <div className="form-section">
            <h3 className="section-title">
              <FaCalendarAlt className="section-icon" />
              Thông Tin Trả Sách
            </h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="actualReturnDate">
                  <FaCalendarAlt className="input-icon" />
                  Ngày trả thực tế *
                </label>
                <input
                  type="date"
                  id="actualReturnDate"
                  name="actualReturnDate"
                  value={returnData.actualReturnDate}
                  onChange={handleInputChange}
                  className={errors.actualReturnDate ? 'error' : ''}
                />
                {errors.actualReturnDate && (
                  <span className="error-message">{errors.actualReturnDate}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="condition">
                  <FaBook className="input-icon" />
                  Tình trạng sách *
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={returnData.condition}
                  onChange={handleInputChange}
                  className={errors.condition ? 'error' : ''}
                >
                  <option value="good">Tốt</option>
                  <option value="damaged">Hư hỏng</option>
                  <option value="lost">Mất</option>
                </select>
                {errors.condition && (
                  <span className="error-message">{errors.condition}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="notes">
                  <FaInfoCircle className="input-icon" />
                  Ghi chú phiếu mượn
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={returnData.notes}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Ghi chú từ phiếu mượn..."
                  readOnly
                />
              </div>

              <div className="form-group">
                <label htmlFor="librarianNotes">
                  <FaInfoCircle className="input-icon" />
                  Ghi chú thủ thư
                </label>
                <textarea
                  id="librarianNotes"
                  name="librarianNotes"
                  value={returnData.librarianNotes}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Ghi chú của thủ thư khi nhận sách..."
                />
              </div>
            </div>
          </div>

          {/* Thông tin phạt */}
          {returnData.fineAmount > 0 && (
            <div className="form-section fine-section">
              <h3 className="section-title">
                <FaMoneyBillWave className="section-icon" />
                Thông Tin Phạt
              </h3>
              <div className="fine-info">
                <div className="fine-item">
                  <label>Số ngày trả muộn:</label>
                  <span className="fine-value">
                    {Math.max(0, Math.floor((new Date(returnData.actualReturnDate) - new Date(returnData.returnDate)) / (1000 * 60 * 60 * 24)))} ngày
                  </span>
                </div>
                <div className="fine-item">
                  <label>Tình trạng sách:</label>
                  <span className="fine-value">
                    {returnData.condition === 'good' ? 'Tốt' : returnData.condition === 'damaged' ? 'Hư hỏng' : 'Mất'}
                  </span>
                </div>
                <div className="fine-item">
                  <label>Tiền phạt:</label>
                  <span className="fine-amount">
                    {returnData.fineAmount.toLocaleString('vi-VN')} VND
                  </span>
                </div>
                <div className="fine-item">
                  <label>Lưu ý:</label>
                  <span className="fine-note">
                    Phải thanh toán phạt trước khi trả sách thành công
                  </span>
                </div>
              </div>
            </div>
          )}

                     {/* Nút hành động */}
           <div className="form-actions">
             <button type="button" className="cancel-button" onClick={onClose}>
               <FaTimes />
               Hủy
             </button>
             <button type="submit" className="submit-button">
               <FaCheck />
               {returnData.fineAmount > 0 || returnData.condition !== 'good' 
                 ? 'Tiến Hành Thanh Toán' 
                 : 'Xác Nhận Trả Sách'}
             </button>
           </div>
         </form>
       </div>

       {/* Modal thanh toán phạt */}
       {showFinePaymentModal && finePaymentData && (
         <FinePaymentModal
           isOpen={showFinePaymentModal}
           onClose={() => setShowFinePaymentModal(false)}
           fineData={finePaymentData}
           onConfirm={handleFinePaymentConfirm}
         />
       )}
     </div>
   );
 };

export default ReturnModal; 