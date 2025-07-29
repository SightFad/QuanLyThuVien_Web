import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaUser } from 'react-icons/fa';
import ReaderModal from '../components/ReaderModal';
import './ReaderManagement.css';

const ReaderManagement = () => {
  const [readers, setReaders] = useState([]);
  const [filteredReaders, setFilteredReaders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingReader, setEditingReader] = useState(null);
  const [loading, setLoading] = useState(true);

const apiUrl =
    "http://localhost:5280/api/DocGia";

  useEffect(() => {
    setLoading(true);
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        const mappedReaders = data.map((dg) => ({
          id: dg.maDG,
          name: dg.hoTen,
          email: dg.email,
          phone: dg.sdt,
          address: dg.diaChi,
          memberSince: dg.ngaySinh ? new Date(dg.ngaySinh).toLocaleDateString('vi-VN') : 'Chưa cập nhật',
          status: 'active',
          totalBorrows: Math.floor(Math.random() * 50) + 1,
          currentBorrows: Math.floor(Math.random() * 5) + 1
        }));
        setReaders(mappedReaders);
        setFilteredReaders(mappedReaders);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tải độc giả:", err);
        // Fallback data khi API không hoạt động
        const fallbackData = [
          {
            id: 1,
            name: 'Nguyễn Văn A',
            email: 'nguyenvana@email.com',
            phone: '0123456789',
            address: '123 Lê Lợi, Q1, TP.HCM',
            memberSince: '15/01/2024',
            status: 'active',
            totalBorrows: 25,
            currentBorrows: 2
          },
          {
            id: 2,
            name: 'Trần Thị B',
            email: 'tranthib@email.com',
            phone: '0987654321',
            address: '456 Nguyễn Huệ, Q3, TP.HCM',
            memberSince: '20/02/2024',
            status: 'active',
            totalBorrows: 18,
            currentBorrows: 1
          },
          {
            id: 3,
            name: 'Lê Văn C',
            email: 'levanc@email.com',
            phone: '0555666777',
            address: '789 Võ Văn Tần, Q3, TP.HCM',
            memberSince: '10/03/2024',
            status: 'active',
            totalBorrows: 32,
            currentBorrows: 3
          },
          {
            id: 4,
            name: 'Phạm Thị D',
            email: 'phamthid@email.com',
            phone: '0333444555',
            address: '321 Điện Biên Phủ, Q3, TP.HCM',
            memberSince: '05/04/2024',
            status: 'active',
            totalBorrows: 15,
            currentBorrows: 0
          }
        ];
        setReaders(fallbackData);
        setFilteredReaders(fallbackData);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = readers.filter(reader =>
      reader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reader.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reader.phone.includes(searchTerm)
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

  const handleDeleteReader = (readerId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa độc giả này?')) {
      fetch(`${apiUrl}/${readerId}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (!res.ok) {
            return res.text().then((text) => { throw new Error(text); });
          }
          // Xóa thành công, reload lại danh sách
          refreshReaders();
        })
        .catch((err) => alert("Lỗi khi xóa độc giả: " + err));
    }
  };

  const handleSaveReader = (readerData) => {
    const requestData = {
      hoTen: readerData.name,
      email: readerData.email,
      sdt: readerData.phone,
      diaChi: readerData.address,
      gioiTinh: readerData.gioiTinh,
      ngaySinh: readerData.ngaySinh || null
    };
    if (editingReader) {
      // Cập nhật
      fetch(`${apiUrl}/${editingReader.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...requestData, maDG: editingReader.id }),
      })
        .then((res) => {
          if (!res.ok) {
            return res.text().then((text) => { throw new Error(text); });
          }
          refreshReaders();
        })
        .catch((err) => alert("Lỗi khi cập nhật độc giả: " + err));
    } else {
      // Thêm mới
      fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      })
        .then(async (res) => {
          if (!res.ok) {
            const text = await res.text();
            alert("Lỗi khi thêm độc giả: " + text);
            return;
          }
          return res.json();
        })
        .then(() => refreshReaders())
        .catch((err) => alert("Lỗi khi thêm độc giả: " + err));
    }
    setShowModal(false);
    setEditingReader(null);
  };

  const refreshReaders = () => {
    setLoading(true);
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        const mappedReaders = data.map((dg) => ({
          id: dg.maDG,
          name: dg.hoTen,
          email: dg.email,
          phone: dg.sdt,
          address: dg.diaChi,
        }));
        setReaders(mappedReaders);
        setFilteredReaders(mappedReaders);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tải độc giả:", err);
        setLoading(false);
      });
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

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="reader-management">
      <div className="page-header">
        <h1 className="page-title">Quản lý độc giả</h1>
        <p className="page-subtitle">Quản lý thông tin độc giả trong thư viện</p>
      </div>

      <div className="content-section">
        <div className="section-header">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm độc giả theo tên, email hoặc số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="btn btn-primary" onClick={handleAddReader}>
            <FaPlus /> Thêm độc giả mới
          </button>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Mã độc giả</th>
                <th>Thông tin</th>
                <th>Liên hệ</th>
                <th>Ngày tham gia</th>
                <th>Trạng thái</th>
                <th>Thống kê</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredReaders.map((reader) => (
                <tr key={reader.id}>
                  <td>#{reader.id.toString().padStart(4, '0')}</td>
                  <td>
                    <div className="reader-info">
                      <div className="reader-avatar">
                        <FaUser />
                      </div>
                      <div className="reader-details">
                        <strong>{reader.name}</strong>
                        <small>{reader.address}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <div>{reader.email}</div>
                      <div>{reader.phone}</div>
                    </div>
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
            <h3>Không tìm thấy độc giả</h3>
            <p>Không có độc giả nào phù hợp với từ khóa tìm kiếm.</p>
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