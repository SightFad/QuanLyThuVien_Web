import React, { useState, useEffect } from 'react';
import { FaDatabase, FaDownload, FaUpload, FaHistory, FaClock, FaCheck, FaCog, FaExclamationTriangle } from 'react-icons/fa';
import { adminService } from '../services';
import './BackupManagement.css';

const BackupManagement = () => {
  const [backupHistoryData, setBackupHistoryData] = useState({
    backups: [],
    pagination: { page: 1, pageSize: 10, totalCount: 0, totalPages: 0 },
    databaseInfo: { tableCount: 0, recordCount: 0, sizeInMB: 0 },
    statistics: { totalBackups: 0, successfulBackups: 0, failedBackups: 0 }
  });
  const [backupStatus, setBackupStatus] = useState(null);
  const [backupSettings, setBackupSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadBackupData();
  }, [currentPage]);

  const loadBackupData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load backup history, status, and settings in parallel
      const [historyData, statusData, settingsData] = await Promise.all([
        adminService.getBackupHistory({ page: currentPage, pageSize: 10 }),
        adminService.getBackupStatus(),
        adminService.getBackupSettings()
      ]);
      
      setBackupHistoryData(historyData);
      setBackupStatus(statusData);
      setBackupSettings(settingsData);
    } catch (error) {
      console.error('Error loading backup data:', error);
      setError('Không thể tải dữ liệu backup. Đang hiển thị dữ liệu fallback.');
      
      // Fallback to default data
      const fallbackHistory = adminService.createFallbackBackupHistory();
      setBackupHistoryData(fallbackHistory);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async (options = {}) => {
    try {
      setIsCreatingBackup(true);
      setError('');
      
      const backupData = {
        type: 'manual',
        description: options.description || 'Manual backup created from admin panel',
        includeUserData: options.includeUserData !== false,
        includeSystemData: options.includeSystemData !== false,
        enableCompression: options.enableCompression !== false
      };
      
      const result = await adminService.createBackup(backupData);
      
      // Reload backup history after creation
      await loadBackupData();
      
      alert(`Backup được tạo thành công! Dự kiến hoàn thành lúc ${new Date(result.estimatedCompletion).toLocaleString('vi-VN')}`);
    } catch (error) {
      console.error('Error creating backup:', error);
      setError(`Lỗi khi tạo backup: ${error.message}`);
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const handleRestore = async (backup) => {
    if (!window.confirm(`Bạn có chắc chắn muốn khôi phục backup từ ngày ${backup.date}?\n\nCảnh báo: Thao tác này sẽ ghi đè dữ liệu hiện tại!`)) {
      return;
    }
    
    try {
      setIsRestoring(true);
      setSelectedBackup(backup);
      setError('');
      
      const restoreOptions = {
        overwriteExisting: true,
        restoreUserData: true,
        restoreSystemData: true,
        createBackupBeforeRestore: true
      };
      
      const result = await adminService.restoreBackup(backup.id, restoreOptions);
      
      alert(`Quá trình khôi phục đã được khởi tạo. Dự kiến hoàn thành lúc ${new Date(result.estimatedCompletion).toLocaleString('vi-VN')}`);
      
      // Reload data after restore
      await loadBackupData();
    } catch (error) {
      console.error('Error restoring backup:', error);
      setError(`Lỗi khi khôi phục backup: ${error.message}`);
    } finally {
      setIsRestoring(false);
      setSelectedBackup(null);
    }
  };

  const handleDeleteBackup = async (backup) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa backup từ ngày ${backup.date}?`)) {
      return;
    }
    
    try {
      await adminService.deleteBackup(backup.id);
      await loadBackupData();
      alert('Xóa backup thành công!');
    } catch (error) {
      console.error('Error deleting backup:', error);
      setError(`Lỗi khi xóa backup: ${error.message}`);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleUpdateSettings = async (newSettings) => {
    try {
      await adminService.updateBackupSettings(newSettings);
      setBackupSettings(newSettings);
      setShowSettings(false);
      alert('Cập nhật cài đặt backup thành công!');
    } catch (error) {
      console.error('Error updating backup settings:', error);
      setError(`Lỗi khi cập nhật cài đặt: ${error.message}`);
    }
  };

  // Extract data for easier access
  const { backups, pagination, databaseInfo, statistics } = backupHistoryData;

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
              {backupHistoryData.map(backup => (
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