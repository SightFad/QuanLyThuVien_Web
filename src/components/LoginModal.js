import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5280/api/Auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('=== Login Response ===');
        console.log('Backend data:', data);
        console.log('Role from backend:', data.role);
        console.log('Role type:', typeof data.role);
        console.log('Role length:', data.role?.length);
        console.log('Role trimmed:', data.role?.trim());
        console.log('Role trimmed length:', data.role?.trim()?.length);
        
        // Map role from backend to frontend
        let mappedRole = data.role?.trim();
        console.log('Original role from backend:', mappedRole);
        if (mappedRole === 'Warehouse') {
          mappedRole = 'Nhân viên kho sách';
          console.log('Role mapped from Warehouse to Nhân viên kho sách');
        }
        console.log('Final mapped role:', mappedRole);
        
        const userData = {
          username: data.username,
          role: mappedRole,
          email: data.email
        };
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        onLogin(userData);
        onClose();
        
        // Redirect based on role
        console.log('=== Redirect Logic ===');
        console.log('Checking role:', data.role);
        
        setTimeout(() => {
          switch (data.role) {
            case 'Độc giả':
              navigate('/reader/home');
              break;
            case 'Thủ thư':
              navigate('/librarian/dashboard');
              break;
            case 'Kế toán':
            case 'Nhân viên kế toán':
              navigate('/accountant/dashboard');
              break;
            case 'Nhân viên kho sách':
            case 'Trưởng kho':
            case 'warehouse':
            case 'Warehouse':
              console.log('Warehouse role detected, navigating to /warehouse/dashboard');
              navigate('/warehouse/dashboard');
              break;
            case 'Trưởng thư viện':
              navigate('/manager/dashboard');
              break;
            case 'Quản trị viên':
              navigate('/admin');
              break;
            default:
              console.log('No matching role, navigating to /');
              navigate('/');
          }
        }, 100);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <div className="login-modal-header">
          <h2>Đăng nhập</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">
              <FaUser /> Tên đăng nhập
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Nhập tên đăng nhập"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <FaLock /> Mật khẩu
            </label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Nhập mật khẩu"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>


      </div>
    </div>
  );
};

export default LoginModal; 