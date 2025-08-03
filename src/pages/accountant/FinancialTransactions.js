import React, { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaSearch, FaFilter, FaDownload, FaPlus } from 'react-icons/fa';
import { accountantService } from '../../services';
import './FinancialTransactions.css';

const FinancialTransactions = () => {
  const [transactionsData, setTransactionsData] = useState({
    transactions: [],
    pagination: { page: 1, pageSize: 10, totalCount: 0, totalPages: 0 },
    summary: { totalRevenue: 0, pendingAmount: 0, totalTransactions: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadTransactions();
  }, [searchTerm, filterType, filterStatus, currentPage]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        search: searchTerm,
        type: filterType,
        status: filterStatus,
        page: currentPage,
        pageSize: 10
      };
      
      const data = await accountantService.getTransactions(params);
      setTransactionsData(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
      setError('Không thể tải dữ liệu giao dịch. Đang hiển thị dữ liệu fallback.');
      
      // Fallback to empty data
      const fallbackData = accountantService.createFallbackTransactionsData();
      setTransactionsData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  // Extract data for easier access
  const { transactions, pagination, summary } = transactionsData;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleTypeChange = (e) => {
    setFilterType(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="financial-transactions">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu giao dịch...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="financial-transactions">
      {error && (
        <div className="error-banner">
          <p>⚠️ {error}</p>
        </div>
      )}
      
      <div className="page-header">
        <h1><FaMoneyBillWave /> Giao dịch tài chính</h1>
        <p>Quản lý và theo dõi các giao dịch tài chính của thư viện</p>
      </div>

      <div className="financial-overview">
        <div className="overview-card">
          <div className="overview-icon">
            <FaMoneyBillWave />
          </div>
          <div className="overview-content">
            <h3>Tổng doanh thu</h3>
            <div className="overview-value">{summary.totalRevenue.toLocaleString()} VNĐ</div>
          </div>
        </div>
        <div className="overview-card">
          <div className="overview-icon">
            <FaMoneyBillWave />
          </div>
          <div className="overview-content">
            <h3>Chờ xử lý</h3>
            <div className="overview-value">{summary.pendingAmount.toLocaleString()} VNĐ</div>
          </div>
        </div>
        <div className="overview-card">
          <div className="overview-icon">
            <FaMoneyBillWave />
          </div>
          <div className="overview-content">
            <h3>Tổng giao dịch</h3>
            <div className="overview-value">{summary.totalTransactions}</div>
          </div>
        </div>
      </div>

      <div className="transaction-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên thành viên hoặc mô tả..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className="btn-search">
            <FaSearch />
          </button>
        </div>

        <div className="filter-section">
          <select 
            value={filterType} 
            onChange={handleTypeChange}
          >
            <option value="all">Tất cả loại giao dịch</option>
            <option value="PhiThanhVien">Phí thành viên</option>
            <option value="PhiPhat">Tiền phạt</option>
            <option value="PhiLamThe">Phí làm thẻ</option>
          </select>

          <select 
            value={filterStatus} 
            onChange={handleStatusChange}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="DaThu">Đã thu</option>
            <option value="ChuaThu">Chưa thu</option>
            <option value="DaHuy">Đã hủy</option>
          </select>
        </div>

        <div className="action-buttons">
          <button className="btn-secondary">
            <FaDownload /> Xuất báo cáo
          </button>
          <button className="btn-primary">
            <FaPlus /> Tạo giao dịch mới
          </button>
        </div>
      </div>

      <div className="transactions-table">
        <table>
          <thead>
            <tr>
              <th>Ngày</th>
              <th>Loại giao dịch</th>
              <th>Thành viên</th>
              <th>Mô tả</th>
              <th>Số tiền</th>
              <th>Phương thức</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{transaction.date}</td>
                <td>
                  <span className={`transaction-type ${transaction.type}`}>
                    {transaction.type === 'PhiThanhVien' ? 'Phí thành viên' :
                     transaction.type === 'PhiPhat' ? 'Tiền phạt' : 
                     transaction.type === 'PhiLamThe' ? 'Phí làm thẻ' : transaction.type}
                  </span>
                </td>
                <td>{transaction.memberName}</td>
                <td>{transaction.description}</td>
                <td>{transaction.amount.toLocaleString()} VNĐ</td>
                <td>
                  <span className={`payment-method ${transaction.paymentMethod}`}>
                    {transaction.paymentMethod === 'cash' ? 'Tiền mặt' :
                     transaction.paymentMethod === 'bank_transfer' ? 'Chuyển khoản' : 
                     transaction.paymentMethod === 'wallet' ? 'Ví điện tử' : transaction.paymentMethod}
                  </span>
                </td>
                <td>
                  <span className={`transaction-status ${transaction.status}`}>
                    {transaction.status === 'DaThu' ? 'Đã thu' :
                     transaction.status === 'ChuaThu' ? 'Chưa thu' : 
                     transaction.status === 'DaHuy' ? 'Đã hủy' : transaction.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="Xem chi tiết">
                      <FaSearch />
                    </button>
                    <button className="btn-icon" title="Chỉnh sửa">
                      <FaPlus />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {transactions.length === 0 && !loading && (
        <div className="empty-state">
          <FaMoneyBillWave />
          <p>Không có giao dịch nào</p>
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn-pagination"
          >
            Trước
          </button>
          
          <span className="pagination-info">
            Trang {currentPage} / {pagination.totalPages} 
            ({pagination.totalCount} giao dịch)
          </span>
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.totalPages}
            className="btn-pagination"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default FinancialTransactions; 