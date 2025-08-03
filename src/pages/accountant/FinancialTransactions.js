import React, { useState } from 'react';
import { FaMoneyBillWave, FaSearch, FaFilter, FaDownload, FaPlus } from 'react-icons/fa';
import './FinancialTransactions.css';

const FinancialTransactions = () => {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      date: '2024-01-15',
      type: 'membership_fee',
      memberName: 'Nguyễn Văn A',
      amount: 100000,
      paymentMethod: 'cash',
      status: 'completed',
      description: 'Phí thành viên năm 2024'
    },
    {
      id: 2,
      date: '2024-01-14',
      type: 'fine',
      memberName: 'Trần Thị B',
      amount: 25000,
      paymentMethod: 'bank_transfer',
      status: 'completed',
      description: 'Phạt trả sách trễ'
    },
    {
      id: 3,
      date: '2024-01-13',
      type: 'card_fee',
      memberName: 'Lê Văn C',
      amount: 50000,
      paymentMethod: 'wallet',
      status: 'pending',
      description: 'Phí làm thẻ mới'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalRevenue = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingAmount = transactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="financial-transactions">
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
            <div className="overview-value">{totalRevenue.toLocaleString()} VNĐ</div>
          </div>
        </div>
        <div className="overview-card">
          <div className="overview-icon">
            <FaMoneyBillWave />
          </div>
          <div className="overview-content">
            <h3>Chờ xử lý</h3>
            <div className="overview-value">{pendingAmount.toLocaleString()} VNĐ</div>
          </div>
        </div>
        <div className="overview-card">
          <div className="overview-icon">
            <FaMoneyBillWave />
          </div>
          <div className="overview-content">
            <h3>Tổng giao dịch</h3>
            <div className="overview-value">{transactions.length}</div>
          </div>
        </div>
      </div>

      <div className="transaction-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên thành viên hoặc mô tả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn-search">
            <FaSearch />
          </button>
        </div>

        <div className="filter-section">
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">Tất cả loại giao dịch</option>
            <option value="membership_fee">Phí thành viên</option>
            <option value="fine">Tiền phạt</option>
            <option value="card_fee">Phí làm thẻ</option>
          </select>

          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="completed">Hoàn thành</option>
            <option value="pending">Chờ xử lý</option>
            <option value="cancelled">Đã hủy</option>
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
            {filteredTransactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{transaction.date}</td>
                <td>
                  <span className={`transaction-type ${transaction.type}`}>
                    {transaction.type === 'membership_fee' ? 'Phí thành viên' :
                     transaction.type === 'fine' ? 'Tiền phạt' : 'Phí làm thẻ'}
                  </span>
                </td>
                <td>{transaction.memberName}</td>
                <td>{transaction.description}</td>
                <td>{transaction.amount.toLocaleString()} VNĐ</td>
                <td>
                  <span className={`payment-method ${transaction.paymentMethod}`}>
                    {transaction.paymentMethod === 'cash' ? 'Tiền mặt' :
                     transaction.paymentMethod === 'bank_transfer' ? 'Chuyển khoản' : 'Ví điện tử'}
                  </span>
                </td>
                <td>
                  <span className={`transaction-status ${transaction.status}`}>
                    {transaction.status === 'completed' ? 'Hoàn thành' :
                     transaction.status === 'pending' ? 'Chờ xử lý' : 'Đã hủy'}
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

      {filteredTransactions.length === 0 && (
        <div className="empty-state">
          <FaMoneyBillWave />
          <p>Không tìm thấy giao dịch nào phù hợp</p>
        </div>
      )}
    </div>
  );
};

export default FinancialTransactions; 