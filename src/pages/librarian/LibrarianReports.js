import React, { useState, useEffect } from 'react';
import { FaChartBar, FaChartLine, FaChartPie, FaDownload, FaPrint, FaCalendarAlt, FaBook, FaUsers, FaExchangeAlt } from 'react-icons/fa';
import './LibrarianReports.css';

const LibrarianReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [reportData, setReportData] = useState({});

  // Mock data
  useEffect(() => {
    const mockData = {
      overview: {
        totalBooks: 1250,
        totalReaders: 450,
        totalBorrows: 320,
        totalReturns: 298,
        overdueBooks: 22,
        totalFines: 1500000,
        popularBooks: [
          { title: 'Lập trình Python', borrows: 45 },
          { title: 'Cơ sở dữ liệu', borrows: 38 },
          { title: 'Mạng máy tính', borrows: 32 },
          { title: 'Thuật toán nâng cao', borrows: 28 },
          { title: 'Lập trình Web', borrows: 25 }
        ],
        categoryStats: [
          { category: 'Công nghệ', count: 45 },
          { category: 'Kinh tế', count: 32 },
          { category: 'Văn học', count: 28 },
          { category: 'Khoa học', count: 25 },
          { category: 'Lịch sử', count: 20 }
        ]
      },
      borrowing: {
        dailyStats: [
          { date: '2024-02-01', borrows: 12, returns: 10 },
          { date: '2024-02-02', borrows: 15, returns: 12 },
          { date: '2024-02-03', borrows: 8, returns: 14 },
          { date: '2024-02-04', borrows: 20, returns: 16 },
          { date: '2024-02-05', borrows: 18, returns: 19 },
          { date: '2024-02-06', borrows: 22, returns: 21 },
          { date: '2024-02-07', borrows: 25, returns: 23 }
        ],
        readerStats: [
          { reader: 'Nguyễn Văn A', borrows: 8, returns: 7 },
          { reader: 'Trần Thị B', borrows: 6, returns: 5 },
          { reader: 'Lê Văn C', borrows: 5, returns: 4 },
          { reader: 'Phạm Thị D', borrows: 4, returns: 4 },
          { reader: 'Hoàng Văn E', borrows: 3, returns: 3 }
        ]
      },
      overdue: {
        overdueBooks: [
          {
            reader: 'Nguyễn Văn A',
            book: 'Lập trình Python',
            dueDate: '2024-02-01',
            daysOverdue: 6,
            fine: 30000
          },
          {
            reader: 'Trần Thị B',
            book: 'Cơ sở dữ liệu',
            dueDate: '2024-02-03',
            daysOverdue: 4,
            fine: 20000
          },
          {
            reader: 'Lê Văn C',
            book: 'Mạng máy tính',
            dueDate: '2024-02-05',
            daysOverdue: 2,
            fine: 10000
          }
        ],
        totalOverdue: 22,
        totalFines: 1500000
      }
    };
    setReportData(mockData);
  }, []);

  const getPeriodLabel = () => {
    const labels = {
      week: 'Tuần này',
      month: 'Tháng này',
      quarter: 'Quý này',
      year: 'Năm nay'
    };
    return labels[selectedPeriod] || 'Tháng này';
  };

  const getReportLabel = () => {
    const labels = {
      overview: 'Báo cáo tổng quan',
      borrowing: 'Báo cáo mượn trả',
      overdue: 'Báo cáo quá hạn'
    };
    return labels[selectedReport] || 'Báo cáo tổng quan';
  };

  const exportReport = () => {
    // Simulate export functionality
    alert('Báo cáo đã được xuất thành công!');
  };

  const printReport = () => {
    window.print();
  };

  const renderOverviewReport = () => (
    <div className="overview-report">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FaBook />
          </div>
          <div className="stat-content">
            <div className="stat-value">{reportData.overview?.totalBooks || 0}</div>
            <div className="stat-label">Tổng số sách</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-content">
            <div className="stat-value">{reportData.overview?.totalReaders || 0}</div>
            <div className="stat-label">Tổng thành viên</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaExchangeAlt />
          </div>
          <div className="stat-content">
            <div className="stat-value">{reportData.overview?.totalBorrows || 0}</div>
            <div className="stat-label">Lượt mượn</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaCalendarAlt />
          </div>
          <div className="stat-content">
            <div className="stat-value">{reportData.overview?.overdueBooks || 0}</div>
            <div className="stat-label">Sách quá hạn</div>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <h3>Sách phổ biến</h3>
          <div className="popular-books">
            {reportData.overview?.popularBooks?.map((book, index) => (
              <div key={index} className="book-item">
                <div className="book-info">
                  <div className="book-title">{book.title}</div>
                  <div className="book-borrows">{book.borrows} lượt mượn</div>
                </div>
                <div className="book-bar">
                  <div 
                    className="book-progress" 
                    style={{ width: `${(book.borrows / 45) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-container">
          <h3>Thống kê theo thể loại</h3>
          <div className="category-stats">
            {reportData.overview?.categoryStats?.map((category, index) => (
              <div key={index} className="category-item">
                <div className="category-info">
                  <div className="category-name">{category.category}</div>
                  <div className="category-count">{category.count} sách</div>
                </div>
                <div className="category-bar">
                  <div 
                    className="category-progress" 
                    style={{ width: `${(category.count / 45) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="additional-stats">
        <div className="chart-container">
          <h3>Thống kê hoạt động</h3>
          <div className="activity-stats">
            <div className="activity-item">
              <div className="activity-icon">
                <FaExchangeAlt />
              </div>
              <div className="activity-info">
                <div className="activity-value">{reportData.overview?.totalReturns || 0}</div>
                <div className="activity-label">Lượt trả sách</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">
                <FaCalendarAlt />
              </div>
              <div className="activity-info">
                <div className="activity-value">{(reportData.overview?.totalFines || 0).toLocaleString()}đ</div>
                <div className="activity-label">Tổng tiền phạt</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">
                <FaUsers />
              </div>
              <div className="activity-info">
                <div className="activity-value">{Math.round((reportData.overview?.totalBorrows || 0) / (reportData.overview?.totalReaders || 1) * 100) / 100}</div>
                <div className="activity-label">Tỷ lệ mượn/thành viên</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBorrowingReport = () => (
    <div className="borrowing-report">
      <div className="chart-container">
        <h3>Thống kê mượn trả theo ngày</h3>
        <div className="daily-chart">
          {reportData.borrowing?.dailyStats?.map((day, index) => (
            <div key={index} className="day-bar">
              <div className="day-label">{new Date(day.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</div>
              <div className="bar-container">
                <div className="borrow-bar" style={{ height: `${(day.borrows / 25) * 100}%` }}>
                  <span className="bar-value">{day.borrows}</span>
                </div>
                <div className="return-bar" style={{ height: `${(day.returns / 25) * 100}%` }}>
                  <span className="bar-value">{day.returns}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color borrow-color"></div>
            <span>Mượn</span>
          </div>
          <div className="legend-item">
            <div className="legend-color return-color"></div>
            <span>Trả</span>
          </div>
        </div>
      </div>

      <div className="chart-container">
                    <h3>Top thành viên mượn sách</h3>
        <div className="reader-stats">
          {reportData.borrowing?.readerStats?.map((reader, index) => (
            <div key={index} className="reader-item">
              <div className="reader-info">
                <div className="reader-name">{reader.reader}</div>
                <div className="reader-stats">
                  <span>Mượn: {reader.borrows}</span>
                  <span>Trả: {reader.returns}</span>
                </div>
              </div>
              <div className="reader-bar">
                <div 
                  className="reader-progress" 
                  style={{ width: `${(reader.borrows / 8) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOverdueReport = () => (
    <div className="overdue-report">
      <div className="overdue-summary">
        <div className="summary-card">
          <div className="summary-value">{reportData.overdue?.totalOverdue || 0}</div>
          <div className="summary-label">Sách quá hạn</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{(reportData.overdue?.totalFines || 0).toLocaleString()}đ</div>
          <div className="summary-label">Tổng tiền phạt</div>
        </div>
      </div>

      <div className="overdue-table-container">
        <h3>Danh sách sách quá hạn</h3>
        <table className="overdue-table">
          <thead>
            <tr>
                              <th>Thành viên</th>
              <th>Sách</th>
              <th>Hạn trả</th>
              <th>Số ngày quá hạn</th>
              <th>Tiền phạt</th>
            </tr>
          </thead>
          <tbody>
            {reportData.overdue?.overdueBooks?.map((book, index) => (
              <tr key={index}>
                <td>{book.reader}</td>
                <td>{book.book}</td>
                <td>{new Date(book.dueDate).toLocaleDateString('vi-VN')}</td>
                <td>
                  <span className="overdue-days">{book.daysOverdue} ngày</span>
                </td>
                <td>{book.fine.toLocaleString()}đ</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'overview':
        return renderOverviewReport();
      case 'borrowing':
        return renderBorrowingReport();
      case 'overdue':
        return renderOverdueReport();
      default:
        return renderOverviewReport();
    }
  };

  return (
    <div className="librarian-reports">
      <div className="reports-header">
        <h1>Báo Cáo Thư Viện</h1>
        <div className="reports-controls">
          <div className="controls-left">
            <div className="report-filter">
              <label htmlFor="period">Thời gian:</label>
              <select
                id="period"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="week">Tuần này</option>
                <option value="month">Tháng này</option>
                <option value="quarter">Quý này</option>
                <option value="year">Năm nay</option>
              </select>
            </div>
            <div className="report-filter">
              <label htmlFor="report-type">Loại báo cáo:</label>
              <select
                id="report-type"
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
              >
                <option value="overview">Tổng quan</option>
                <option value="borrowing">Mượn trả</option>
                <option value="overdue">Quá hạn</option>
              </select>
            </div>
          </div>
          <div className="action-buttons">
            <button className="btn-export" onClick={exportReport}>
              <FaDownload /> Xuất báo cáo
            </button>
            <button className="btn-print" onClick={printReport}>
              <FaPrint /> In báo cáo
            </button>
          </div>
        </div>
      </div>

      <div className="reports-content">
        <div className="report-info">
          <h2>{getPeriodLabel()} - {getReportLabel()}</h2>
          <p>Ngày tạo: {new Date().toLocaleDateString('vi-VN')}</p>
        </div>

        {renderReportContent()}
      </div>
    </div>
  );
};

export default LibrarianReports; 