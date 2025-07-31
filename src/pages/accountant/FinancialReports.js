import React, { useState, useEffect } from 'react';
import { FaFileInvoiceDollar, FaDownload, FaCalendarAlt, FaChartBar, FaChartLine, FaChartPie, FaTable, FaPrint } from 'react-icons/fa';
import './FinancialReports.css';

const FinancialReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  // State cho báo cáo doanh thu
  const [baoCaodoanhThu, setBaoCaodoanhThu] = useState(null);
  const [baoCaodoanhThuLoading, setBaoCaodoanhThuLoading] = useState(false);
  const [tuNgay, setTuNgay] = useState('');
  const [denNgay, setDenNgay] = useState('');
  const [loaiBaoCao, setLoaiBaoCao] = useState('tonghop'); // tonghop, phithanhvien, phiphat

  useEffect(() => {
    // Mock data
    const mockReports = [
      {
        id: 1,
        title: 'Báo cáo doanh thu tháng 1/2024',
        type: 'revenue',
        period: '2024-01',
        generatedDate: '2024-01-31',
        totalRevenue: 2500000,
        totalExpenses: 1800000,
        netProfit: 700000,
        membershipFees: 1200000,
        fines: 800000,
        otherIncome: 500000,
        bookPurchases: 1500000,
        maintenance: 200000,
        otherExpenses: 100000,
        status: 'completed'
      },
      {
        id: 2,
        title: 'Báo cáo phí phạt tháng 1/2024',
        type: 'fines',
        period: '2024-01',
        generatedDate: '2024-01-31',
        totalFines: 800000,
        collectedFines: 600000,
        pendingFines: 200000,
        overdueFines: 150000,
        fineBreakdown: {
          'Trả sách trễ': 500000,
          'Sách hư hỏng': 200000,
          'Mất sách': 100000
        },
        status: 'completed'
      },
      {
        id: 3,
        title: 'Báo cáo phí thành viên tháng 1/2024',
        type: 'membership',
        period: '2024-01',
        generatedDate: '2024-01-31',
        totalMembers: 150,
        newMembers: 25,
        renewedMembers: 100,
        expiredMembers: 25,
        totalRevenue: 1200000,
        averageRevenue: 8000,
        status: 'completed'
      },
      {
        id: 4,
        title: 'Báo cáo chi tiêu mua sách tháng 1/2024',
        type: 'purchases',
        period: '2024-01',
        generatedDate: '2024-01-31',
        totalPurchases: 1500000,
        totalBooks: 120,
        averagePrice: 12500,
        topCategories: {
          'Sách giáo khoa': 500000,
          'Sách văn học': 400000,
          'Sách kỹ thuật': 300000,
          'Sách tham khảo': 300000
        },
        status: 'completed'
      }
    ];

    setTimeout(() => {
      setReports(mockReports);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Function để lấy báo cáo doanh thu
  const layBaoCaoDoanhThu = async () => {
    if (!tuNgay || !denNgay) {
      alert('Vui lòng chọn từ ngày và đến ngày');
      return;
    }

    setBaoCaodoanhThuLoading(true);
    try {
      let url = '';
      switch (loaiBaoCao) {
        case 'phithanhvien':
          url = `http://localhost:5000/api/BaoCao/phi-thanh-vien?tuNgay=${tuNgay}&denNgay=${denNgay}`;
          break;
        case 'phiphat':
          url = `http://localhost:5000/api/BaoCao/phi-phat?tuNgay=${tuNgay}&denNgay=${denNgay}`;
          break;
        default:
          url = `http://localhost:5000/api/BaoCao/doanh-thu?tuNgay=${tuNgay}&denNgay=${denNgay}`;
          break;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setBaoCaodoanhThu(data);
      } else {
        alert('Có lỗi xảy ra khi lấy báo cáo');
      }
    } catch (error) {
      console.error('Lỗi:', error);
      alert('Có lỗi xảy ra khi kết nối server');
    } finally {
      setBaoCaodoanhThuLoading(false);
    }
  };

  // Function để in báo cáo
  const inBaoCao = () => {
    window.print();
  };

  // Function để xuất Excel (mock)
  const xuatExcel = () => {
    alert('Tính năng xuất Excel sẽ được phát triển sau');
  };

  const getReportIcon = (type) => {
    const icons = {
      revenue: <FaChartBar />,
      fines: <FaFileInvoiceDollar />,
      membership: <FaChartPie />,
      purchases: <FaChartLine />
    };
    return icons[type] || <FaFileInvoiceDollar />;
  };

  const getReportTypeName = (type) => {
    const names = {
      revenue: 'Doanh thu',
      fines: 'Phí phạt',
      membership: 'Phí thành viên',
      purchases: 'Mua sách'
    };
    return names[type] || type;
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`status-badge ${status === 'completed' ? 'status-completed' : 'status-pending'}`}>
        {status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="financial-reports">
      <div className="page-header">
        <h1><FaFileInvoiceDollar /> Báo cáo tài chính</h1>
        <p>Báo cáo doanh thu, phí phạt, phí thành viên và chi tiêu thư viện</p>
      </div>

      <div className="period-selector">
        <div className="period-controls">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="period-select"
          >
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="quarter">Quý này</option>
            <option value="year">Năm nay</option>
          </select>
          <button className="btn-generate">
            <FaChartBar /> Tạo báo cáo mới
          </button>
        </div>
      </div>

      <div className="reports-grid">
        {reports.map(report => (
          <div key={report.id} className="report-card">
            <div className="report-header">
              <div className="report-title">
                <div className="report-icon">
                  {getReportIcon(report.type)}
                </div>
                <div className="report-info">
                  <h3>{report.title}</h3>
                  <p className="report-type">{getReportTypeName(report.type)}</p>
                </div>
              </div>
              <div className="report-actions">
                {getStatusBadge(report.status)}
                <button className="btn-download" title="Tải xuống">
                  <FaDownload />
                </button>
              </div>
            </div>

            <div className="report-content">
              {report.type === 'revenue' && (
                <div className="revenue-breakdown">
                  <div className="revenue-item">
                    <span className="label">Tổng doanh thu:</span>
                    <span className="value positive">{formatCurrency(report.totalRevenue)}</span>
                  </div>
                  <div className="revenue-item">
                    <span className="label">Tổng chi phí:</span>
                    <span className="value negative">{formatCurrency(report.totalExpenses)}</span>
                  </div>
                  <div className="revenue-item highlight">
                    <span className="label">Lợi nhuận ròng:</span>
                    <span className="value positive">{formatCurrency(report.netProfit)}</span>
                  </div>
                  <div className="revenue-details">
                    <div className="detail-section">
                      <h4>Thu nhập:</h4>
                      <div className="detail-item">
                        <span>Phí thành viên:</span>
                        <span>{formatCurrency(report.membershipFees)}</span>
                      </div>
                      <div className="detail-item">
                        <span>Phí phạt:</span>
                        <span>{formatCurrency(report.fines)}</span>
                      </div>
                      <div className="detail-item">
                        <span>Thu nhập khác:</span>
                        <span>{formatCurrency(report.otherIncome)}</span>
                      </div>
                    </div>
                    <div className="detail-section">
                      <h4>Chi phí:</h4>
                      <div className="detail-item">
                        <span>Mua sách:</span>
                        <span>{formatCurrency(report.bookPurchases)}</span>
                      </div>
                      <div className="detail-item">
                        <span>Bảo trì:</span>
                        <span>{formatCurrency(report.maintenance)}</span>
                      </div>
                      <div className="detail-item">
                        <span>Chi phí khác:</span>
                        <span>{formatCurrency(report.otherExpenses)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {report.type === 'fines' && (
                <div className="fines-breakdown">
                  <div className="fines-summary">
                    <div className="summary-item">
                      <span className="label">Tổng phí phạt:</span>
                      <span className="value">{formatCurrency(report.totalFines)}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Đã thu:</span>
                      <span className="value positive">{formatCurrency(report.collectedFines)}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Chờ thu:</span>
                      <span className="value warning">{formatCurrency(report.pendingFines)}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Quá hạn:</span>
                      <span className="value negative">{formatCurrency(report.overdueFines)}</span>
                    </div>
                  </div>
                  <div className="fines-details">
                    <h4>Chi tiết phí phạt:</h4>
                    {Object.entries(report.fineBreakdown).map(([reason, amount]) => (
                      <div key={reason} className="fine-item">
                        <span>{reason}:</span>
                        <span>{formatCurrency(amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {report.type === 'membership' && (
                <div className="membership-breakdown">
                  <div className="membership-summary">
                    <div className="summary-item">
                      <span className="label">Tổng thành viên:</span>
                      <span className="value">{report.totalMembers}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Thành viên mới:</span>
                      <span className="value positive">+{report.newMembers}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Gia hạn:</span>
                      <span className="value">{report.renewedMembers}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Hết hạn:</span>
                      <span className="value negative">-{report.expiredMembers}</span>
                    </div>
                  </div>
                  <div className="membership-revenue">
                    <h4>Doanh thu thành viên:</h4>
                    <div className="revenue-item">
                      <span className="label">Tổng doanh thu:</span>
                      <span className="value positive">{formatCurrency(report.totalRevenue)}</span>
                    </div>
                    <div className="revenue-item">
                      <span className="label">Trung bình/người:</span>
                      <span className="value">{formatCurrency(report.averageRevenue)}</span>
                    </div>
                  </div>
                </div>
              )}

              {report.type === 'purchases' && (
                <div className="purchases-breakdown">
                  <div className="purchases-summary">
                    <div className="summary-item">
                      <span className="label">Tổng chi tiêu:</span>
                      <span className="value negative">{formatCurrency(report.totalPurchases)}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Số sách mua:</span>
                      <span className="value">{report.totalBooks}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Giá trung bình:</span>
                      <span className="value">{formatCurrency(report.averagePrice)}</span>
                    </div>
                  </div>
                  <div className="purchases-details">
                    <h4>Chi tiêu theo danh mục:</h4>
                    {Object.entries(report.topCategories).map(([category, amount]) => (
                      <div key={category} className="category-item">
                        <span>{category}:</span>
                        <span>{formatCurrency(amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="report-footer">
              <div className="report-meta">
                <span className="generated-date">
                  <FaCalendarAlt /> Tạo ngày: {report.generatedDate}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reports.length === 0 && (
        <div className="empty-state">
          <FaFileInvoiceDollar />
          <p>Không có báo cáo nào được tạo</p>
        </div>
      )}

      {/* Báo cáo doanh thu theo biểu mẫu */}
      <div className="bao-cao-doanh-thu-section">
        <div className="section-header">
          <h2><FaTable /> Báo cáo doanh thu theo biểu mẫu</h2>
          <p>Báo cáo doanh thu phí thành viên và phí phạt theo định dạng chuẩn</p>
        </div>

        <div className="bao-cao-controls">
          <div className="control-group">
            <label>Từ ngày:</label>
            <input
              type="date"
              value={tuNgay}
              onChange={(e) => setTuNgay(e.target.value)}
              className="date-input"
            />
          </div>
          <div className="control-group">
            <label>Đến ngày:</label>
            <input
              type="date"
              value={denNgay}
              onChange={(e) => setDenNgay(e.target.value)}
              className="date-input"
            />
          </div>
          <div className="control-group">
            <label>Loại báo cáo:</label>
            <select
              value={loaiBaoCao}
              onChange={(e) => setLoaiBaoCao(e.target.value)}
              className="select-input"
            >
              <option value="tonghop">Tổng hợp</option>
              <option value="phithanhvien">Phí thành viên (BM10)</option>
              <option value="phiphat">Phí phạt (BM11)</option>
            </select>
          </div>
          <button
            className="btn-generate-bao-cao"
            onClick={layBaoCaoDoanhThu}
            disabled={baoCaodoanhThuLoading}
          >
            {baoCaodoanhThuLoading ? 'Đang tải...' : 'Tạo báo cáo'}
          </button>
        </div>

        {baoCaodoanhThu && (
          <div className="bao-cao-result">
            <div className="bao-cao-header">
              <h3>{baoCaodoanhThu.TieuDe || 'Báo cáo doanh thu'}</h3>
              <div className="bao-cao-actions">
                <button className="btn-print" onClick={inBaoCao}>
                  <FaPrint /> In báo cáo
                </button>
                <button className="btn-excel" onClick={xuatExcel}>
                  <FaDownload /> Xuất Excel
                </button>
              </div>
            </div>

            {loaiBaoCao === 'phithanhvien' && baoCaodoanhThu.DanhSach && (
              <div className="bao-cao-table-container">
                <table className="bao-cao-table">
                  <thead>
                    <tr>
                      <th>Ngày báo cáo</th>
                      <th>Loại thẻ</th>
                      <th>Thành tiền (VNĐ)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {baoCaodoanhThu.DanhSach.map((item, index) => (
                      <tr key={index}>
                        <td>{new Date(item.NgayBaoCao).toLocaleDateString('vi-VN')}</td>
                        <td>{item.LoaiThe}</td>
                        <td className="amount">{formatCurrency(item.ThanhTien)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="total-row">
                      <td colSpan="2"><strong>Tổng cộng:</strong></td>
                      <td className="total-amount">
                        <strong>{formatCurrency(baoCaodoanhThu.TongDoanhThu || 0)}</strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {loaiBaoCao === 'phiphat' && baoCaodoanhThu.DanhSach && (
              <div className="bao-cao-table-container">
                <table className="bao-cao-table">
                  <thead>
                    <tr>
                      <th>Ngày báo cáo</th>
                      <th>Nguồn thu</th>
                      <th>Số lượng</th>
                      <th>Thành tiền (VNĐ)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {baoCaodoanhThu.DanhSach.map((item, index) => (
                      <tr key={index}>
                        <td>{new Date(item.NgayBaoCao).toLocaleDateString('vi-VN')}</td>
                        <td>{item.NguonThu}</td>
                        <td className="quantity">{item.SoLuong}</td>
                        <td className="amount">{formatCurrency(item.ThanhTien)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="total-row">
                      <td colSpan="3"><strong>Tổng cộng:</strong></td>
                      <td className="total-amount">
                        <strong>{formatCurrency(baoCaodoanhThu.TongDoanhThu || 0)}</strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {loaiBaoCao === 'tonghop' && baoCaodoanhThu.BaoCao && (
              <div className="bao-cao-tong-hop">
                <div className="tong-hop-section">
                  <h4>Báo cáo doanh thu phí thành viên (BM10)</h4>
                  <table className="bao-cao-table">
                    <thead>
                      <tr>
                        <th>Ngày báo cáo</th>
                        <th>Loại thẻ</th>
                        <th>Thành tiền (VNĐ)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {baoCaodoanhThu.BaoCao.DanhSachPhiThanhVien?.map((item, index) => (
                        <tr key={index}>
                          <td>{new Date(item.NgayBaoCao).toLocaleDateString('vi-VN')}</td>
                          <td>{item.LoaiThe}</td>
                          <td className="amount">{formatCurrency(item.ThanhTien)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="total-row">
                        <td colSpan="2"><strong>Tổng phí thành viên:</strong></td>
                        <td className="total-amount">
                          <strong>{formatCurrency(baoCaodoanhThu.BaoCao.TongDoanhThuPhiThanhVien || 0)}</strong>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="tong-hop-section">
                  <h4>Báo cáo doanh thu phí phạt (BM11)</h4>
                  <table className="bao-cao-table">
                    <thead>
                      <tr>
                        <th>Ngày báo cáo</th>
                        <th>Nguồn thu</th>
                        <th>Số lượng</th>
                        <th>Thành tiền (VNĐ)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {baoCaodoanhThu.BaoCao.DanhSachPhiPhat?.map((item, index) => (
                        <tr key={index}>
                          <td>{new Date(item.NgayBaoCao).toLocaleDateString('vi-VN')}</td>
                          <td>{item.NguonThu}</td>
                          <td className="quantity">{item.SoLuong}</td>
                          <td className="amount">{formatCurrency(item.ThanhTien)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="total-row">
                        <td colSpan="3"><strong>Tổng phí phạt:</strong></td>
                        <td className="total-amount">
                          <strong>{formatCurrency(baoCaodoanhThu.BaoCao.TongDoanhThuPhiPhat || 0)}</strong>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="tong-hop-summary">
                  <h4>Tổng kết doanh thu</h4>
                  <div className="summary-grid">
                    <div className="summary-item">
                      <span className="label">Tổng doanh thu phí thành viên:</span>
                      <span className="value positive">{formatCurrency(baoCaodoanhThu.BaoCao.TongDoanhThuPhiThanhVien || 0)}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Tổng doanh thu phí phạt:</span>
                      <span className="value positive">{formatCurrency(baoCaodoanhThu.BaoCao.TongDoanhThuPhiPhat || 0)}</span>
                    </div>
                    <div className="summary-item highlight">
                      <span className="label">Tổng doanh thu:</span>
                      <span className="value positive">{formatCurrency(baoCaodoanhThu.BaoCao.TongDoanhThu || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialReports; 