import React, { useState } from 'react';
import { FaCog, FaSave, FaUndo, FaClock, FaMoneyBillWave, FaBook, FaUsers } from 'react-icons/fa';
import './SystemSettings.css';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    borrowingDuration: {
      regular: 14,
      student: 21,
      teacher: 30,
      premium: 45
    },
    maxBooks: {
      regular: 3,
      student: 5,
      teacher: 7,
      premium: 10
    },
    fineRate: 5000,
    reservationHoldDays: 3,
    maxReservations: 3,
    membershipFee: {
      regular: 100000,
      student: 0,
      teacher: 0,
      premium: 200000
    },
    cardFee: 50000
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSettingChange = (category, field, value) => {
    if (category) {
      setSettings(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [field]: parseInt(value) || 0
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [field]: parseInt(value) || 0
      }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const handleReset = () => {
    setSettings({
      borrowingDuration: {
        regular: 14,
        student: 21,
        teacher: 30,
        premium: 45
      },
      maxBooks: {
        regular: 3,
        student: 5,
        teacher: 7,
        premium: 10
      },
      fineRate: 5000,
      reservationHoldDays: 3,
      maxReservations: 3,
      membershipFee: {
        regular: 100000,
        student: 0,
        teacher: 0,
        premium: 200000
      },
      cardFee: 50000
    });
  };

  return (
    <div className="system-settings">
      <div className="page-header">
        <h1><FaCog /> Cấu hình hệ thống</h1>
        <p>Quản lý các thông số và quy tắc hoạt động của thư viện</p>
      </div>

      {showSuccess && (
        <div className="success-message">
          <FaSave />
          <div>
            <h3>Cấu hình đã được lưu!</h3>
            <p>Các thay đổi sẽ có hiệu lực ngay lập tức.</p>
          </div>
        </div>
      )}

      <div className="settings-container">
        <div className="settings-section">
          <h2><FaClock /> Cấu hình thời gian mượn sách</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <label>Thành viên thường (ngày)</label>
              <input
                type="number"
                value={settings.borrowingDuration.regular}
                onChange={(e) => handleSettingChange('borrowingDuration', 'regular', e.target.value)}
                min="1"
                max="90"
              />
            </div>
            <div className="setting-item">
              <label>Sinh viên (ngày)</label>
              <input
                type="number"
                value={settings.borrowingDuration.student}
                onChange={(e) => handleSettingChange('borrowingDuration', 'student', e.target.value)}
                min="1"
                max="90"
              />
            </div>
            <div className="setting-item">
              <label>Giáo viên (ngày)</label>
              <input
                type="number"
                value={settings.borrowingDuration.teacher}
                onChange={(e) => handleSettingChange('borrowingDuration', 'teacher', e.target.value)}
                min="1"
                max="90"
              />
            </div>
            <div className="setting-item">
              <label>Thành viên cao cấp (ngày)</label>
              <input
                type="number"
                value={settings.borrowingDuration.premium}
                onChange={(e) => handleSettingChange('borrowingDuration', 'premium', e.target.value)}
                min="1"
                max="90"
              />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2><FaBook /> Giới hạn số lượng sách</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <label>Thành viên thường (cuốn)</label>
              <input
                type="number"
                value={settings.maxBooks.regular}
                onChange={(e) => handleSettingChange('maxBooks', 'regular', e.target.value)}
                min="1"
                max="20"
              />
            </div>
            <div className="setting-item">
              <label>Sinh viên (cuốn)</label>
              <input
                type="number"
                value={settings.maxBooks.student}
                onChange={(e) => handleSettingChange('maxBooks', 'student', e.target.value)}
                min="1"
                max="20"
              />
            </div>
            <div className="setting-item">
              <label>Giáo viên (cuốn)</label>
              <input
                type="number"
                value={settings.maxBooks.teacher}
                onChange={(e) => handleSettingChange('maxBooks', 'teacher', e.target.value)}
                min="1"
                max="20"
              />
            </div>
            <div className="setting-item">
              <label>Thành viên cao cấp (cuốn)</label>
              <input
                type="number"
                value={settings.maxBooks.premium}
                onChange={(e) => handleSettingChange('maxBooks', 'premium', e.target.value)}
                min="1"
                max="20"
              />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2><FaMoneyBillWave /> Cấu hình phí và tiền phạt</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <label>Phí phạt trả trễ (VNĐ/ngày)</label>
              <input
                type="number"
                value={settings.fineRate}
                onChange={(e) => handleSettingChange(null, 'fineRate', e.target.value)}
                min="0"
                step="1000"
              />
            </div>
            <div className="setting-item">
              <label>Phí làm thẻ (VNĐ)</label>
              <input
                type="number"
                value={settings.cardFee}
                onChange={(e) => handleSettingChange(null, 'cardFee', e.target.value)}
                min="0"
                step="10000"
              />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2><FaUsers /> Cấu hình đặt sách</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <label>Thời gian giữ sách đặt (ngày)</label>
              <input
                type="number"
                value={settings.reservationHoldDays}
                onChange={(e) => handleSettingChange(null, 'reservationHoldDays', e.target.value)}
                min="1"
                max="14"
              />
            </div>
            <div className="setting-item">
              <label>Số lượng đặt sách tối đa</label>
              <input
                type="number"
                value={settings.maxReservations}
                onChange={(e) => handleSettingChange(null, 'maxReservations', e.target.value)}
                min="1"
                max="10"
              />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2><FaMoneyBillWave /> Phí thành viên hàng năm</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <label>Thành viên thường (VNĐ)</label>
              <input
                type="number"
                value={settings.membershipFee.regular}
                onChange={(e) => handleSettingChange('membershipFee', 'regular', e.target.value)}
                min="0"
                step="10000"
              />
            </div>
            <div className="setting-item">
              <label>Sinh viên (VNĐ)</label>
              <input
                type="number"
                value={settings.membershipFee.student}
                onChange={(e) => handleSettingChange('membershipFee', 'student', e.target.value)}
                min="0"
                step="10000"
              />
            </div>
            <div className="setting-item">
              <label>Giáo viên (VNĐ)</label>
              <input
                type="number"
                value={settings.membershipFee.teacher}
                onChange={(e) => handleSettingChange('membershipFee', 'teacher', e.target.value)}
                min="0"
                step="10000"
              />
            </div>
            <div className="setting-item">
              <label>Thành viên cao cấp (VNĐ)</label>
              <input
                type="number"
                value={settings.membershipFee.premium}
                onChange={(e) => handleSettingChange('membershipFee', 'premium', e.target.value)}
                min="0"
                step="10000"
              />
            </div>
          </div>
        </div>

        <div className="settings-actions">
          <button className="btn-secondary" onClick={handleReset}>
            <FaUndo /> Khôi phục mặc định
          </button>
          <button 
            className="btn-primary" 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <div className="spinner"></div>
                Đang lưu...
              </>
            ) : (
              <>
                <FaSave /> Lưu cấu hình
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings; 