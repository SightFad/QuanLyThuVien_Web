import React, { useState, useEffect } from 'react';
import { FaTimes, FaCheck, FaUser, FaMoneyBillWave, FaCalendarAlt, FaBook, FaCreditCard, FaInfoCircle } from 'react-icons/fa';
import './FinePaymentModal.css';

const FinePaymentModal = ({ isOpen, onClose, fineData, onConfirm }) => {
  const [paymentData, setPaymentData] = useState({
    memberId: '',
    memberName: '',
    fineAmount: 0,
    paymentDate: '',
    violatingBookId: '',
    violatingBookTitle: '',
    fineReason: '',
    paymentMethod: 'cash', // cash, bank
    transactionCode: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && fineData) {
      const today = new Date();
      setPaymentData({
        memberId: fineData.readerId || '',
        memberName: fineData.readerName || '',
        fineAmount: fineData.fineAmount || 0,
        paymentDate: today.toISOString().split('T')[0],
        violatingBookId: fineData.bookId || '',
        violatingBookTitle: fineData.bookTitle || '',
        fineReason: fineData.condition === 'damaged' ? 'damaged' : 
                   fineData.condition === 'lost' ? 'lost' : 'late',
        paymentMethod: 'cash',
        transactionCode: ''
      });
    }
  }, [isOpen, fineData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
    
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
    
    if (!paymentData.memberId) {
      newErrors.memberId = 'Mã thành viên là bắt buộc';
    }
    
    if (!paymentData.fineAmount || paymentData.fineAmount <= 0) {
      newErrors.fineAmount = 'Phí phạt phải là số dương';
    }
    
    if (!paymentData.paymentDate) {
      newErrors.paymentDate = 'Ngày thanh toán là bắt buộc';
    }
    
    if (!paymentData.violatingBookId) {
      newErrors.violatingBookId = 'Mã sách vi phạm là bắt buộc';
    }
    
    if (!paymentData.fineReason) {
      newErrors.fineReason = 'Lý do phạt là bắt buộc';
    }
    
    if (!paymentData.paymentMethod) {
      newErrors.paymentMethod = 'Hình thức thanh toán là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Tạo phiếu thu phí phạt
    const finePayment = {
      id: Date.now(),
      memberId: paymentData.memberId,
      memberName: paymentData.memberName,
      fineAmount: paymentData.fineAmount,
      paymentDate: paymentData.paymentDate,
      violatingBookId: paymentData.violatingBookId,
      violatingBookTitle: paymentData.violatingBookTitle,
      fineReason: paymentData.fineReason,
      paymentMethod: paymentData.paymentMethod,
      transactionCode: paymentData.transactionCode,
      status: 'paid',
      createdAt: new Date().toISOString()
    };

    console.log('Phiếu thu phí phạt:', finePayment);
    
    // Thông báo thành công
    alert(`✅ Thanh toán phí phạt thành công!

📋 Thông tin thanh toán:
• Mã phiếu: ${finePayment.id}
• Thành viên: ${finePayment.memberName}
• Sách vi phạm: ${finePayment.violatingBookTitle}
• Số tiền: ${finePayment.fineAmount.toLocaleString('vi-VN')} VND
• Ngày thanh toán: ${new Date(finePayment.paymentDate).toLocaleDateString('vi-VN')}
• Lý do: ${getFineReasonText(finePayment.fineReason)}
• Hình thức: ${finePayment.paymentMethod === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}
${finePayment.transactionCode ? `• Mã giao dịch: ${finePayment.transactionCode}` : ''}

💡 Bây giờ có thể tiến hành trả sách!`);

    // Gọi callback để tiếp tục quy trình trả sách
    if (onConfirm) {
      onConfirm(finePayment);
    }
    
    onClose();
  };

  const getFineReasonText = (reason) => {
    switch (reason) {
      case 'late': return 'Trễ hạn';
      case 'damaged': return 'Hư sách';
      case 'lost': return 'Mất sách';
      default: return 'Trễ hạn';
    }
  };

  const getFineReasonDescription = (reason) => {
    switch (reason) {
      case 'late': return 'Trả sách quá hạn quy định';
      case 'damaged': return 'Sách bị hư hỏng khi trả';
      case 'lost': return 'Sách bị mất';
      default: return 'Trả sách quá hạn quy định';
    }
  };

  if (!isOpen || !fineData) return null;

  return (
    <div className="fine-payment-modal-overlay">
      <div className="fine-payment-modal">
        <div className="fine-payment-modal-header">
          <h2>
            <FaMoneyBillWave className="header-icon" />
            Phiếu Thu Phí Phạt
          </h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="fine-payment-form">
          {/* Thông tin thành viên */}
          <div className="form-section">
            <h3 className="section-title">
              <FaUser className="section-icon" />
              Thông Tin Thành Viên
            </h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="memberId">
                  <FaUser className="input-icon" />
                  Mã thành viên *
                </label>
                <input
                  type="text"
                  id="memberId"
                  name="memberId"
                  value={paymentData.memberId}
                  onChange={handleInputChange}
                  className={errors.memberId ? 'error' : ''}
                  placeholder="Nhập mã thành viên..."
                />
                {errors.memberId && (
                  <span className="error-message">{errors.memberId}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="memberName">
                  <FaUser className="input-icon" />
                  Họ tên
                </label>
                <input
                  type="text"
                  id="memberName"
                  name="memberName"
                  value={paymentData.memberName}
                  onChange={handleInputChange}
                  readOnly
                  className="readonly"
                />
                <small className="field-note">Tự động điền từ mã thành viên</small>
              </div>
            </div>
          </div>

          {/* Thông tin phạt */}
          <div className="form-section">
            <h3 className="section-title">
              <FaMoneyBillWave className="section-icon" />
              Thông Tin Phạt
            </h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fineAmount">
                  <FaMoneyBillWave className="input-icon" />
                  Phí phạt (VNĐ) *
                </label>
                <input
                  type="number"
                  id="fineAmount"
                  name="fineAmount"
                  value={paymentData.fineAmount}
                  onChange={handleInputChange}
                  className={errors.fineAmount ? 'error' : ''}
                  placeholder="0"
                  min="0"
                />
                {errors.fineAmount && (
                  <span className="error-message">{errors.fineAmount}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="paymentDate">
                  <FaCalendarAlt className="input-icon" />
                  Ngày thanh toán *
                </label>
                <input
                  type="date"
                  id="paymentDate"
                  name="paymentDate"
                  value={paymentData.paymentDate}
                  onChange={handleInputChange}
                  className={errors.paymentDate ? 'error' : ''}
                />
                {errors.paymentDate && (
                  <span className="error-message">{errors.paymentDate}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="violatingBookId">
                  <FaBook className="input-icon" />
                  Mã sách vi phạm *
                </label>
                <input
                  type="text"
                  id="violatingBookId"
                  name="violatingBookId"
                  value={paymentData.violatingBookId}
                  onChange={handleInputChange}
                  className={errors.violatingBookId ? 'error' : ''}
                  placeholder="Nhập mã sách..."
                />
                {errors.violatingBookId && (
                  <span className="error-message">{errors.violatingBookId}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="violatingBookTitle">
                  <FaBook className="input-icon" />
                  Tên sách vi phạm
                </label>
                <input
                  type="text"
                  id="violatingBookTitle"
                  name="violatingBookTitle"
                  value={paymentData.violatingBookTitle}
                  onChange={handleInputChange}
                  readOnly
                  className="readonly"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="fineReason">
                <FaInfoCircle className="input-icon" />
                Lý do phạt *
              </label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="fineReason"
                    value="late"
                    checked={paymentData.fineReason === 'late'}
                    onChange={handleInputChange}
                  />
                  <span className="radio-label">Trễ hạn</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="fineReason"
                    value="damaged"
                    checked={paymentData.fineReason === 'damaged'}
                    onChange={handleInputChange}
                  />
                  <span className="radio-label">Hư sách</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="fineReason"
                    value="lost"
                    checked={paymentData.fineReason === 'lost'}
                    onChange={handleInputChange}
                  />
                  <span className="radio-label">Mất sách</span>
                </label>
              </div>
              {errors.fineReason && (
                <span className="error-message">{errors.fineReason}</span>
              )}
              <small className="field-note">
                {getFineReasonDescription(paymentData.fineReason)}
              </small>
            </div>
          </div>

          {/* Hình thức thanh toán */}
          <div className="form-section">
            <h3 className="section-title">
              <FaCreditCard className="section-icon" />
              Hình Thức Thanh Toán
            </h3>
            
            <div className="form-group">
              <label htmlFor="paymentMethod">
                <FaCreditCard className="input-icon" />
                Chọn hình thức thanh toán *
              </label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentData.paymentMethod === 'cash'}
                    onChange={handleInputChange}
                  />
                  <span className="radio-label">Tiền mặt</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank"
                    checked={paymentData.paymentMethod === 'bank'}
                    onChange={handleInputChange}
                  />
                  <span className="radio-label">Chuyển khoản ngân hàng</span>
                </label>
              </div>
              {errors.paymentMethod && (
                <span className="error-message">{errors.paymentMethod}</span>
              )}
            </div>

            {paymentData.paymentMethod === 'bank' && (
              <div className="form-group">
                <label htmlFor="transactionCode">
                  <FaCreditCard className="input-icon" />
                  Mã giao dịch
                </label>
                <input
                  type="text"
                  id="transactionCode"
                  name="transactionCode"
                  value={paymentData.transactionCode}
                  onChange={handleInputChange}
                  placeholder="Nhập mã giao dịch ngân hàng..."
                />
                <small className="field-note">Có thể thêm mã giao dịch để theo dõi</small>
              </div>
            )}
          </div>

          {/* Nút hành động */}
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              <FaTimes />
              Hủy
            </button>
            <button type="submit" className="submit-button">
              <FaCheck />
              Xác Nhận Thanh Toán
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinePaymentModal; 