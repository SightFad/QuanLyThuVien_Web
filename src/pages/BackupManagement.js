import React, { useState } from 'react';
import { FaDatabase, FaDownload, FaUpload, FaHistory, FaClock, FaCheck } from 'react-icons/fa';
import './BackupManagement.css';

const BackupManagement = () => {
  const [backupHistory, setBackupHistory] = useState([
    {
      id: 1,
      date: '2024-01-15 23:00:00',
      type: 'automatic',
      status: 'completed',
      size: '2.5 GB',
      duration: '15 phút'
    },
    {
      id: 2,
      date: '2024-01-14 23:00:00',
      type: 'automatic',
      status: 'completed',
      size: '2.4 GB',
      duration: '14 phút'
    },
    {
      id: 3,
      date: '2024-01-13 15:30:00',
      type: 'manual',
      status: 'completed',
      size: '2.3 GB',
      duration: '12 phút'
    }
  ]);

  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleCreateBackup = () => {
    setIsCreatingBackup(true);
    setTimeout(() => {
      const newBackup = {
        id: backupHistory.length + 1,
        date: new Date().toLocaleString('vi-VN'),
        type: 'manual',
        status: 'completed',
        size: '2.6 GB',
        duration: '16 phút'
      };
      setBackupHistory([newBackup, ...backupHistory]);
      setIsCreatingBackup(false);
    }, 3000);
  };

  const handleRestore = (backupId) => {
    setIsRestoring(true);
    setTimeout(() => {
      setIsRestoring(false);
    }, 5000);
  };

  return (
    <div className="backup-management">
      <div className="page-header">
        <h1><FaDatabase /> Quản lý sao lưu dữ liệu</h1>
        <p>Thực hiện sao lưu và khôi phục dữ liệu hệ thống</p>
      </div>

      <div className="backup-overview">
        <div className="overview-card">
          <div className="overview-icon">
            <FaDatabase />
          </div>
          <div className="overview-content">
            <h3>Tổng dung lượng dữ liệu</h3>
            <div className="overview-value">2.6 GB</div>
          </div>
        </div>
        <div className="overview-card">
          <div className="overview-icon">
            <FaHistory />
          </div>
          <div className="overview-content">
            <h3>Sao lưu cuối cùng</h3>
            <div className="overview-value">15/01/2024 23:00</div>
          </div>
        </div>
        <div className="overview-card">
          <div className="overview-icon">
            <FaClock />
          </div>
          <div className="overview-content">
            <h3>Lịch sao lưu tự động</h3>
            <div className="overview-value">Hàng ngày lúc 23:00</div>
          </div>
        </div>
      </div>

      <div className="backup-actions">
        <button 
          className="btn-primary"
          onClick={handleCreateBackup}
          disabled={isCreatingBackup}
        >
          {isCreatingBackup ? (
            <>
              <div className="spinner"></div>
              Đang tạo sao lưu...
            </>
          ) : (
            <>
              <FaDownload /> Tạo sao lưu thủ công
            </>
          )}
        </button>
      </div>

      <div className="backup-history">
        <h2>Lịch sử sao lưu</h2>
        <div className="backup-table">
          <table>
            <thead>
              <tr>
                <th>Ngày giờ</th>
                <th>Loại</th>
                <th>Trạng thái</th>
                <th>Kích thước</th>
                <th>Thời gian</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {backupHistory.map(backup => (
                <tr key={backup.id}>
                  <td>{backup.date}</td>
                  <td>
                    <span className={`backup-type ${backup.type}`}>
                      {backup.type === 'automatic' ? 'Tự động' : 'Thủ công'}
                    </span>
                  </td>
                  <td>
                    <span className={`backup-status ${backup.status}`}>
                      <FaCheck /> Hoàn thành
                    </span>
                  </td>
                  <td>{backup.size}</td>
                  <td>{backup.duration}</td>
                  <td>
                    <button 
                      className="btn-restore"
                      onClick={() => handleRestore(backup.id)}
                      disabled={isRestoring}
                    >
                      <FaUpload /> Khôi phục
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="backup-info">
        <h3>Thông tin về sao lưu</h3>
        <div className="info-grid">
          <div className="info-item">
            <h4>Sao lưu tự động</h4>
            <p>Hệ thống tự động sao lưu dữ liệu hàng ngày lúc 23:00</p>
          </div>
          <div className="info-item">
            <h4>Sao lưu thủ công</h4>
            <p>Có thể tạo sao lưu bất cứ lúc nào khi cần thiết</p>
          </div>
          <div className="info-item">
            <h4>Khôi phục dữ liệu</h4>
            <p>Chỉ khôi phục khi thực sự cần thiết và có sự cho phép</p>
          </div>
          <div className="info-item">
            <h4>Lưu trữ</h4>
            <p>Dữ liệu sao lưu được lưu trữ an toàn trong 30 ngày</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupManagement; 