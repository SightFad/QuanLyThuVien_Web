import React, { useState } from 'react';
import { FaUserPlus, FaIdCard, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSave, FaTimes } from 'react-icons/fa';
import './MemberRegistration.css';

const MemberRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    idNumber: '',
    membershipType: 'regular',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('emergency.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        idNumber: '',
        membershipType: 'regular',
        emergencyContact: {
          name: '',
          phone: '',
          relationship: ''
        }
      });
      
      setTimeout(() => setShowSuccess(false), 3000);
    }, 2000);
  };

  const validateForm = () => {
    return formData.fullName && 
           formData.email && 
           formData.phone && 
           formData.address && 
           formData.dateOfBirth && 
           formData.idNumber;
  };

  return (
    <div className="member-registration">
      <div className="page-header">
        <h1><FaUserPlus /> Đăng ký thành viên thư viện</h1>
        <p>Quy trình đăng ký làm thẻ thư viện cho độc giả mới</p>
      </div>

      {showSuccess && (
        <div className="success-message">
          <FaIdCard />
          <div>
            <h3>Đăng ký thành công!</h3>
            <p>Thẻ thư viện đã được tạo và gửi đến email của thành viên.</p>
          </div>
        </div>
      )}

      <div className="registration-container">
        <div className="registration-form">
          <h2>Thông tin cá nhân</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="fullName">
                  <FaUserPlus /> Họ và tên *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  placeholder="Nhập họ và tên đầy đủ"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <FaEnvelope /> Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="example@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  <FaPhone /> Số điện thoại *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="0123456789"
                />
              </div>

              <div className="form-group">
                <label htmlFor="dateOfBirth">
                  <FaIdCard /> Ngày sinh *
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="idNumber">
                  <FaIdCard /> Số CMND/CCCD *
                </label>
                <input
                  type="text"
                  id="idNumber"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="123456789012"
                />
              </div>

              <div className="form-group">
                <label htmlFor="membershipType">
                  <FaIdCard /> Loại thẻ thành viên
                </label>
                <select
                  id="membershipType"
                  name="membershipType"
                  value={formData.membershipType}
                  onChange={handleInputChange}
                >
                  <option value="regular">Thành viên thường</option>
                  <option value="student">Sinh viên</option>
                  <option value="teacher">Giáo viên</option>
                  <option value="premium">Thành viên cao cấp</option>
                </select>
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="address">
                <FaMapMarkerAlt /> Địa chỉ *
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                placeholder="Nhập địa chỉ đầy đủ"
                rows="3"
              />
            </div>

            <div className="emergency-contact">
              <h3>Thông tin liên hệ khẩn cấp</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="emergencyName">
                    <FaUserPlus /> Họ và tên
                  </label>
                  <input
                    type="text"
                    id="emergencyName"
                    name="emergency.name"
                    value={formData.emergencyContact.name}
                    onChange={handleInputChange}
                    placeholder="Họ và tên người liên hệ"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="emergencyPhone">
                    <FaPhone /> Số điện thoại
                  </label>
                  <input
                    type="tel"
                    id="emergencyPhone"
                    name="emergency.phone"
                    value={formData.emergencyContact.phone}
                    onChange={handleInputChange}
                    placeholder="0123456789"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="emergencyRelationship">
                    <FaUserPlus /> Mối quan hệ
                  </label>
                  <input
                    type="text"
                    id="emergencyRelationship"
                    name="emergency.relationship"
                    value={formData.emergencyContact.relationship}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Bố, mẹ, vợ/chồng..."
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setFormData({
                  fullName: '',
                  email: '',
                  phone: '',
                  address: '',
                  dateOfBirth: '',
                  idNumber: '',
                  membershipType: 'regular',
                  emergencyContact: {
                    name: '',
                    phone: '',
                    relationship: ''
                  }
                })}
              >
                <FaTimes /> Xóa form
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={!validateForm() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <FaSave /> Tạo thẻ thành viên
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="registration-info">
          <h3>Hướng dẫn đăng ký</h3>
          <div className="info-section">
            <h4>Yêu cầu tài liệu</h4>
            <ul>
              <li>CMND/CCCD còn hiệu lực</li>
              <li>Ảnh 3x4 (2 tấm)</li>
              <li>Giấy xác nhận (nếu là sinh viên/giáo viên)</li>
            </ul>
          </div>

          <div className="info-section">
            <h4>Loại thẻ thành viên</h4>
            <div className="membership-types">
              <div className="type-item">
                <strong>Thành viên thường:</strong>
                <span>Mượn tối đa 3 sách, thời hạn 14 ngày</span>
              </div>
              <div className="type-item">
                <strong>Sinh viên:</strong>
                <span>Mượn tối đa 5 sách, thời hạn 21 ngày</span>
              </div>
              <div className="type-item">
                <strong>Giáo viên:</strong>
                <span>Mượn tối đa 7 sách, thời hạn 30 ngày</span>
              </div>
              <div className="type-item">
                <strong>Thành viên cao cấp:</strong>
                <span>Mượn tối đa 10 sách, thời hạn 45 ngày</span>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h4>Phí thành viên</h4>
            <ul>
              <li>Phí làm thẻ: 50.000 VNĐ</li>
              <li>Phí thường niên: 100.000 VNĐ</li>
              <li>Miễn phí cho sinh viên và giáo viên</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberRegistration; 