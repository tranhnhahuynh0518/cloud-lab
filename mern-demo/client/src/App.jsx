import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: ''
  });

  // Câu 47: Gọi API lấy danh sách sinh viên từ Backend
  const fetchStudents = async () => {
    try {
      // ĐÃ SỬA LINK NGẮN GỌN ĐỂ TRÁNH LỖI CORS
      const response = await fetch('/api/students');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
    }
  };

  // Tự động chạy fetchStudents khi trang vừa load xong
  useEffect(() => {
    fetchStudents();
  }, []);

  // Cập nhật giá trị State khi người dùng gõ vào Form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Câu 49: Gửi dữ liệu từ React đến API POST để thêm sinh viên
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ĐÃ SỬA LINK NGẮN GỌN ĐỂ TRÁNH LỖI CORS
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Thêm sinh viên thành công!');
        setFormData({ studentId: '', name: '', email: '' }); // Xóa trắng form sau khi thêm
        fetchStudents(); // Gọi lại hàm lấy danh sách để update bảng ngay lập tức
      }
    } catch (error) {
      console.error('Lỗi khi thêm sinh viên:', error);
    }
  };

  // --- PHẦN MỚI THÊM: HÀM XÓA SINH VIÊN ---
  const handleDelete = async (id) => {
    // Hiện bảng hỏi xác nhận trước khi xóa
    if (!window.confirm('Bạn có chắc chắn muốn xóa dữ liệu này không?')) return;
    
    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchStudents(); // Cập nhật lại danh sách ngay lập tức sau khi xóa
      } else {
        alert('Có lỗi xảy ra khi xóa!');
      }
    } catch (error) {
      console.error('Lỗi khi gọi API xóa:', error);
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Quản lý Sinh viên (MERN Stack)</h2>

      {/* Câu 48: Tạo Form nhập MSSV, Họ tên và Email */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input 
          type="text" name="studentId" placeholder="MSSV" 
          value={formData.studentId} onChange={handleChange} required 
          style={{ padding: '8px' }}
        />
        <input 
          type="text" name="name" placeholder="Họ và tên" 
          value={formData.name} onChange={handleChange} required 
          style={{ padding: '8px' }}
        />
        <input 
          type="email" name="email" placeholder="Email" 
          value={formData.email} onChange={handleChange} required 
          style={{ padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 15px', cursor: 'pointer' }}>Thêm Sinh viên</button>
      </form>

      {/* Bảng hiển thị danh sách */}
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'left' }}>
        <thead style={{ backgroundColor: '#f2f2f2' }}>
          <tr>
            <th>MSSV</th>
            <th>Họ Tên</th>
            <th>Email</th>
            {/* --- PHẦN MỚI THÊM: CỘT THAO TÁC --- */}
            <th style={{ width: '80px', textAlign: 'center' }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.studentId}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              {/* --- PHẦN MỚI THÊM: NÚT XÓA --- */}
              <td style={{ textAlign: 'center' }}>
                <button 
                  onClick={() => handleDelete(student._id)} 
                  style={{ backgroundColor: '#ff4d4f', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr>
              {/* Đã sửa colSpan từ 3 thành 4 vì bảng bây giờ có 4 cột */}
              <td colSpan="4" style={{ textAlign: 'center' }}>Chưa có sinh viên nào.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;