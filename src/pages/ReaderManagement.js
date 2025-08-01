import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaUser, FaCalendar, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { apiRequest } from '../config/api';
import ReaderModal from '../components/ReaderModal';
import './ReaderManagement.css';

const ReaderManagement = () => {
  const [readers, setReaders] = useState([]);
  const [filteredReaders, setFilteredReaders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingReader, setEditingReader] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReaders();
  }, []);

  const loadReaders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiRequest('/api/DocGia');
      const mappedReaders = data.map((dg) => ({
        id: dg.maDG,
        name: dg.hoTen || 'Chưa cập nhật',
        email: dg.email || 'Chưa cập nhật',
        phone: dg.sdt || 'Chưa cập nhật',
        address: dg.diaChi || 'Chưa cập nhật',
        gioiTinh: dg.gioiTinh || 'Chưa cập nhật',
        ngaySinh: dg.ngaySinh,
        goiDangKy: dg.goiDangKy || 'Chưa cập nhật',
        ngayDangKy: dg.ngayDangKy,
        status: dg.trangThai || 'active',
        memberSince: dg.ngayDangKy ? new Date(dg.ngayDangKy).toLocaleDateString('vi-VN') : 
                   dg.ngaySinh ? new Date(dg.ngaySinh).toLocaleDateString('vi-VN') : 'Chưa cập nhật',
        totalBorrows: dg.totalBorrows || 0,
        currentBorrows: dg.currentBorrows || 0
      }));
      
      setReaders(mappedReaders);
      setFilteredReaders(mappedReaders);
    } catch (err) {
      console.error("Lỗi khi tải thành viên:", err);
      setError("Không thể kết nối đến máy chủ. Đang hiển thị dữ liệu mẫu.");
      
      // Fallback data với đầy đủ thông tin mới
      const fallbackData = [
        {
          id: 1,
          name: 'Nguyễn Văn A',
          email: 'nguyenvana@email.com',
          phone: '0123456789',
          address: '123 Lê Lợi, Q1, TP.HCM',
          gioiTinh: 'Nam',
          ngaySinh: '1990-05-15',
          goiDangKy: 'thuong',
          ngayDangKy: '2024-01-15',
          status: 'active',
          memberSince: '15/01/2024',
          totalBorrows: 25,
          currentBorrows: 2
        },
        {
          id: 2,
          name: 'Trần Thị B',
          email: 'tranthib@email.com',
          phone: '0987654321',
          address: '456 Nguyễn Huệ, Q3, TP.HCM',
          gioiTinh: 'Nữ',
          ngaySinh: '1995-08-20',
          goiDangKy: 'vip',
          ngayDangKy: '2024-02-20',
          status: 'active',
          memberSince: '20/02/2024',
          totalBorrows: 18,
          currentBorrows: 1
        },
        {
          id: 3,
          name: 'Lê Văn C',
          email: 'levanc@email.com',
          phone: '0555666777',
          address: '789 Võ Văn Tần, Q3, TP.HCM',
          gioiTinh: 'Nam',
          ngaySinh: '1992-12-10',
          goiDangKy: 'sinhvien',
          ngayDangKy: '2024-03-10',
          status: 'active',
          memberSince: '10/03/2024',
          totalBorrows: 32,
          currentBorrows: 3
        },
        {
          id: 4,
          name: 'Phạm Thị D',
          email: 'phamthid@email.com',
          phone: '0333444555',
          address: '321 Điện Biên Phủ, Q3, TP.HCM',
          gioiTinh: 'Nữ',
          ngaySinh: '1988-03-05',
          goiDangKy: 'thuong',
          ngayDangKy: '2024-04-05',
          status: 'active',
          memberSince: '05/04/2024',
          totalBorrows: 15,
          currentBorrows: 0
        }
      ];
      setReaders(fallbackData);
      setFilteredReaders(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = readers.filter(reader =>
      reader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reader.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reader.phone.includes(searchTerm) ||
      reader.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredReaders(filtered);
  }, [searchTerm, readers]);

  const handleAddReader = () => {
    setEditingReader(null);
    setShowModal(true);
  };

  const handleEditReader = (reader) => {
    setEditingReader(reader);
    setShowModal(true);
  };

  const handleDeleteReader = async (readerId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
      try {
        await apiRequest(`/api/DocGia/${readerId}`, {
          method: "DELETE",
        });
        
        await loadReaders();
      } catch (err) {
        alert("Lỗi khi xóa thành viên: " + err.message);
      }
    }
  };

  const handleSaveReader = async (readerData) => {
    try {
      const requestData = {
        hoTen: readerData.name,
        email: readerData.email,
        sdt: readerData.phone,
        diaChi: readerData.address,
        gioiTinh: readerData.gioiTinh,
        ngaySinh: readerData.ngaySinh || null,
        goiDangKy: readerData.goiDangKy,
        ngayDangKy: readerData.ngayDangKy,
        trangThai: readerData.status
      };

      if (editingReader) {
        // Cập nhật
        await apiRequest(`/api/DocGia/${editingReader.id}`, {
          method: "PUT",
          body: JSON.stringify({ ...requestData, maDG: editingReader.id }),
        });
      } else {
        // Thêm mới
        await apiRequest('/api/DocGia', {
          method: "POST",
          body: JSON.stringify(requestData),
        });
      }
      
      await loadReaders();
      setShowModal(false);
      setEditingReader(null);
    } catch (error) {
      alert("Lỗi khi lưu thông tin thành viên: " + error.message);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="badge badge-success">Hoạt động</span>;
      case 'inactive':
        return <span className="badge badge-danger">Không hoạt động</span>;
      default:
        return <span className="badge badge-secondary">Không xác định</span>;
    }
  };

  const getPackageBadge = (packageType) => {
    switch (packageType) {
      case 'thuong':
        return <span className="badge badge-info">Thường</span>;
      case 'vip':
        return <span className="badge badge-warning">VIP</span>;
      case 'sinhvien':
        return <span className="badge badge-primary">Sinh viên</span>;
      default:
        return <span className="badge badge-secondary">Chưa cập nhật</span>;
    }
  };

  if (loading) {
    return (
      <div className="reader-management">
        <div className="loading">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu thành viên...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reader-management">
      <div className="page-header">
        <h1 className="page-title">Quản lý thành viên</h1>
        <p className="page-subtitle">Quản lý thông tin thành viên trong thư viện</p>
      </div>

      {error && (
        <div className="error-banner">
          <FaEnvelope />
          <span>{error}</span>
        </div>
      )}

      <div className="content-section">
        <div className="section-header">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm thành viên theo tên, email, số điện thoại hoặc địa chỉ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="btn btn-primary" onClick={handleAddReader}>
            <FaPlus /> Thêm thành viên mới
          </button>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Mã thành viên</th>
                <th>Thông tin cá nhân</th>
                <th>Liên hệ</th>
                <th>Gói đăng ký</th>
                <th>Ngày tham gia</th>
                <th>Trạng thái</th>
                <th>Thống kê</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredReaders.map((reader) => (
                <tr key={reader.id}>
                  <td>
                    <div className="member-id">
                      <strong>#{reader.id.toString().padStart(4, '0')}</strong>
                    </div>
                  </td>
                  <td>
                    <div className="reader-info">
                      <div className="reader-avatar">
                        <FaUser />
                      </div>
                      <div className="reader-details">
                        <strong>{reader.name}</strong>
                        <div className="member-details">
                          <span><FaCalendar /> {reader.gioiTinh}</span>
                          <span><FaMapMarkerAlt /> {reader.address}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <div><FaEnvelope /> {reader.email}</div>
                      <div><FaPhone /> {reader.phone}</div>
                    </div>
                  </td>
                  <td>
                    {getPackageBadge(reader.goiDangKy)}
                  </td>
                  <td>{reader.memberSince}</td>
                  <td>{getStatusBadge(reader.status)}</td>
                  <td>
                    <div className="stats-info">
                      <div>Tổng: {reader.totalBorrows} lượt</div>
                      <div>Hiện tại: {reader.currentBorrows} cuốn</div>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleEditReader(reader)}
                        title="Chỉnh sửa"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteReader(reader.id)}
                        title="Xóa"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReaders.length === 0 && (
          <div className="empty-state">
            <FaUser />
            <h3>Không tìm thấy thành viên</h3>
            <p>Không có thành viên nào phù hợp với từ khóa tìm kiếm.</p>
          </div>
        )}
      </div>

      {showModal && (
        <ReaderModal
          reader={editingReader}
          onSave={handleSaveReader}
          onClose={() => {
            setShowModal(false);
            setEditingReader(null);
          }}
        />
      )}
    </div>
  );
};

export default ReaderManagement; 