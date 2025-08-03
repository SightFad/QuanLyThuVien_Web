/**
 * UserInfo Component - Hiển thị thông tin chi tiết người dùng và loại độc giả
 */
import React from 'react';
import { userService } from '../services';
import './UserInfo.css';

const UserInfo = () => {
  const user = userService.getCurrentUser();
  const readerInfo = userService.getReaderInfo();
  const permissions = userService.getReaderPermissions();
  const debugInfo = userService.getDebugInfo();

  if (!user) {
    return (
      <div className="user-info-container">
        <div className="user-info-card">
          <h3>❌ Chưa đăng nhập</h3>
          <p>Vui lòng đăng nhập để xem thông tin người dùng.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-info-container">
      <div className="user-info-card">
        <div className="user-header">
          <h2>👤 Thông tin người dùng</h2>
          <span className={`role-badge ${user.role.toLowerCase()}`}>
            {user.role}
          </span>
        </div>

        {/* Thông tin cơ bản */}
        <div className="info-section">
          <h3>📋 Thông tin cơ bản</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>User ID:</label>
              <span>{user.userId}</span>
            </div>
            <div className="info-item">
              <label>Tên đăng nhập:</label>
              <span>{user.username}</span>
            </div>
            <div className="info-item">
              <label>Họ tên:</label>
              <span>{userService.getDisplayName()}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{userService.getEmail()}</span>
            </div>
            <div className="info-item">
              <label>Vai trò:</label>
              <span>{user.role}</span>
            </div>
          </div>
        </div>

        {/* Thông tin Reader (nếu có) */}
        {userService.isReader() && readerInfo && (
          <div className="info-section reader-section">
            <h3>📚 Thông tin độc giả</h3>
            <div className="reader-status">
              <div className={`status-indicator ${readerInfo.isActive ? 'active' : 'inactive'}`}>
                {readerInfo.isActive ? '✅ Hoạt động' : '❌ Không hoạt động'}
              </div>
              {readerInfo.isVip && (
                <div className="vip-badge">⭐ VIP</div>
              )}
            </div>

            <div className="info-grid">
              <div className="info-item">
                <label>Mã độc giả:</label>
                <span>{readerInfo.docGiaId}</span>
              </div>
              <div className="info-item">
                <label>Loại độc giả:</label>
                <span className={`reader-type ${readerInfo.loaiDocGia?.toLowerCase()}`}>
                  {readerInfo.loaiDocGia}
                </span>
              </div>
              <div className="info-item">
                <label>Cấp bậc:</label>
                <span className={`reader-level ${readerInfo.capBac?.toLowerCase()}`}>
                  {readerInfo.capBac}
                </span>
              </div>
              <div className="info-item">
                <label>Trạng thái thành viên:</label>
                <span className={`member-status ${readerInfo.memberStatus?.toLowerCase()}`}>
                  {readerInfo.memberStatus}
                </span>
              </div>
              <div className="info-item">
                <label>Ngày hết hạn:</label>
                <span>{readerInfo.ngayHetHan ? new Date(readerInfo.ngayHetHan).toLocaleDateString('vi-VN') : 'Chưa có'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Quyền hạn (nếu là Reader) */}
        {permissions && (
          <div className="info-section permissions-section">
            <h3>🔐 Quyền hạn và giới hạn</h3>
            <div className="permissions-grid">
              <div className="permission-item">
                <label>Có thể mượn sách:</label>
                <span className={permissions.canBorrow ? 'yes' : 'no'}>
                  {permissions.canBorrow ? '✅ Có' : '❌ Không'}
                </span>
              </div>
              <div className="permission-item">
                <label>Số sách tối đa:</label>
                <span className="limit-value">{permissions.maxBooks} cuốn</span>
              </div>
              <div className="permission-item">
                <label>Số ngày mượn tối đa:</label>
                <span className="limit-value">{permissions.maxDays} ngày</span>
              </div>
              <div className="permission-item">
                <label>Có thể đặt trước:</label>
                <span className={permissions.canReserve ? 'yes' : 'no'}>
                  {permissions.canReserve ? '✅ Có' : '❌ Không'}
                </span>
              </div>
              {permissions.priorityReservation && (
                <div className="permission-item">
                  <label>Ưu tiên đặt trước:</label>
                  <span className="yes">✅ VIP</span>
                </div>
              )}
              {permissions.extendedRenewal && (
                <div className="permission-item">
                  <label>Gia hạn mở rộng:</label>
                  <span className="yes">✅ VIP</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Debug Info */}
        <div className="info-section debug-section">
          <h3>🔧 Debug Info</h3>
          <div className="debug-info">
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;