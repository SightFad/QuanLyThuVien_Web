import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendar, FaEdit, FaSave, FaTimes, FaBook } from 'react-icons/fa';
import { readerService } from '../../services';
import './ReaderProfile.css';

const ReaderProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const profileData = await readerService.getProfile();
      setProfile(profileData);
      setEditForm({
        email: profileData.email || '',
        sdt: profileData.sdt || '',
        diaChi: profileData.diaChi || '',
        ngaySinh: profileData.ngaySinh || ''
      });
    } catch (error) {
      console.error('Error loading profile data:', error);
      setError('Không thể tải thông tin cá nhân. Vui lòng thử lại.');
      
      // Fallback to empty profile
      const fallbackProfile = {
        id: 0,
        hoTen: 'N/A',
        email: '',
        sdt: '',
        diaChi: '',
        gioiTinh: '',
        ngaySinh: '',
        loaiDocGia: 'Thuong',
        capBac: 'Thuong',
        memberStatus: 'DaThanhToan',
        ngayDangKy: '',
        ngayHetHan: '',
        phiThanhVien: 0,
        soSachToiDa: 5,
        soNgayMuonToiDa: 14,
        soLanGiaHanToiDa: 2,
        soNgayGiaHan: 7,
        statistics: {
          totalBorrows: 0,
          totalFines: 0
        }
      };
      setProfile(fallbackProfile);
      setEditForm({
        email: '',
        sdt: '',
        diaChi: '',
        ngaySinh: ''
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      email: profile.email || '',
      sdt: profile.sdt || '',
      diaChi: profile.diaChi || '',
      ngaySinh: profile.ngaySinh || ''
    });
  };

  const handleSave = async () => {
    try {
      await readerService.updateProfile(editForm);
      
      // Reload profile data to get updated information
      await loadProfileData();
      
      setIsEditing(false);
      alert('Thông tin đã được cập nhật thành công!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DaThanhToan':
        return <span className="badge badge-success">Hoạt động</span>;
      case 'ChuaThanhToan':
        return <span className="badge badge-warning">Chưa thanh toán</span>;
      case 'BiKhoa':
        return <span className="badge badge-danger">Bị khóa</span>;
      default:
        return <span className="badge badge-secondary">Không xác định</span>;
    }
  };

  const getLoaiDocGiaText = (loaiDocGia) => {
    switch (loaiDocGia) {
      case 'VIP':
        return 'VIP';
      case 'Thuong':
        return 'Thường';
      default:
        return loaiDocGia || 'Thường';
    }
  };

  const getCapBacText = (capBac) => {
    switch (capBac) {
      case 'CaoCap':
        return 'Cao cấp';
      case 'TrungCap':
        return 'Trung cấp';
      case 'Thuong':
        return 'Thường';
      default:
        return capBac || 'Thường';
    }
  };

  if (loading) {
    return (
      <div className="reader-profile">
        <div className="loading">
          <div className="spinner"></div>
          <p>Đang tải thông tin cá nhân...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reader-profile">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={loadProfileData} className="btn btn-primary">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reader-profile">
      <div className="page-header">
        <h1 className="page-title">Thông tin cá nhân</h1>
        <p className="page-subtitle">Quản lý thông tin tài khoản của bạn</p>
      </div>

      <div className="profile-content">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <FaUser />
          </div>
          <div className="profile-info">
            <h2>{profile.hoTen}</h2>
            <p className="member-id">Mã thành viên: {profile.id}</p>
            {getStatusBadge(profile.memberStatus)}
          </div>
          <div className="profile-actions">
            {!isEditing ? (
              <button className="btn btn-primary" onClick={handleEdit}>
                <FaEdit /> Chỉnh sửa
              </button>
            ) : (
              <div className="edit-actions">
                <button className="btn btn-success" onClick={handleSave}>
                  <FaSave /> Lưu
                </button>
                <button className="btn btn-secondary" onClick={handleCancel}>
                  <FaTimes /> Hủy
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="profile-grid">
          {/* Personal Information */}
          <div className="content-section">
            <div className="section-header">
              <h3 className="section-title">
                <FaUser /> Thông tin cá nhân
              </h3>
            </div>
            
            <div className="info-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Họ và tên</label>
                  <p className="info-value">{profile.hoTen}</p>
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Nhập email"
                    />
                  ) : (
                    <p className="info-value">{profile.email || 'Chưa cập nhật'}</p>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Số điện thoại</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="sdt"
                      value={editForm.sdt}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Nhập số điện thoại"
                    />
                  ) : (
                    <p className="info-value">{profile.sdt || 'Chưa cập nhật'}</p>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Ngày sinh</label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="ngaySinh"
                      value={editForm.ngaySinh}
                      onChange={handleChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="info-value">{profile.ngaySinh || 'Chưa cập nhật'}</p>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Địa chỉ</label>
                {isEditing ? (
                  <textarea
                    name="diaChi"
                    value={editForm.diaChi}
                    onChange={handleChange}
                    className="form-input"
                    rows="3"
                    placeholder="Nhập địa chỉ"
                  />
                ) : (
                  <p className="info-value">{profile.diaChi || 'Chưa cập nhật'}</p>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Giới tính</label>
                  <p className="info-value">{profile.gioiTinh || 'Chưa cập nhật'}</p>
                </div>
                <div className="form-group">
                  <label className="form-label">Loại độc giả</label>
                  <p className="info-value">{getLoaiDocGiaText(profile.loaiDocGia)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="content-section">
            <div className="section-header">
              <h3 className="section-title">Thống kê mượn sách</h3>
            </div>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <FaBook />
                </div>
                <div className="stat-info">
                  <div className="stat-number">{profile.statistics?.totalBorrows || 0}</div>
                  <div className="stat-label">Tổng lượt mượn</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <FaCalendar />
                </div>
                <div className="stat-info">
                  <div className="stat-number">{profile.soSachToiDa || 5}</div>
                  <div className="stat-label">Sách được mượn tối đa</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <FaUser />
                </div>
                <div className="stat-info">
                  <div className="stat-number">{profile.soNgayMuonToiDa || 14}</div>
                  <div className="stat-label">Ngày mượn tối đa</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <FaTimes />
                </div>
                <div className="stat-info">
                  <div className="stat-number">{profile.statistics?.totalFines || 0}</div>
                  <div className="stat-label">Tổng tiền phạt (VNĐ)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="content-section">
            <div className="section-header">
              <h3 className="section-title">Thông tin tài khoản</h3>
            </div>
            
            <div className="account-info">
              <div className="info-item">
                <label className="info-label">Mã thành viên:</label>
                <span className="info-value">{profile.id}</span>
              </div>
              <div className="info-item">
                <label className="info-label">Trạng thái:</label>
                <span className="info-value">{getStatusBadge(profile.memberStatus)}</span>
              </div>
              <div className="info-item">
                <label className="info-label">Cấp bậc:</label>
                <span className="info-value">{getCapBacText(profile.capBac)}</span>
              </div>
              <div className="info-item">
                <label className="info-label">Ngày đăng ký:</label>
                <span className="info-value">{profile.ngayDangKy || 'Chưa cập nhật'}</span>
              </div>
              <div className="info-item">
                <label className="info-label">Ngày hết hạn:</label>
                <span className="info-value">{profile.ngayHetHan || 'Chưa cập nhật'}</span>
              </div>
              <div className="info-item">
                <label className="info-label">Phí thành viên:</label>
                <span className="info-value">{profile.phiThanhVien?.toLocaleString('vi-VN') || 0} VNĐ</span>
              </div>
              {profile.ngayDangKy && (
                <div className="info-item">
                  <label className="info-label">Thời gian thành viên:</label>
                  <span className="info-value">
                    {Math.floor((new Date() - new Date(profile.ngayDangKy)) / (1000 * 60 * 60 * 24))} ngày
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReaderProfile; 