import { useEffect, useState } from 'react';

function App() {
  const [students, setStudents] = useState([]);

  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: '',
  });

  // Lưu _id của sinh viên đang sửa.
  // null = đang ở chế độ thêm mới.
  const [editingId, setEditingId] = useState(null);

  // =========================
  // LẤY DANH SÁCH SINH VIÊN
  // =========================
  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students');

      if (!response.ok) {
        throw new Error('Không thể lấy danh sách sinh viên');
      }

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // =========================
  // XỬ LÝ FORM
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // CHỌN SINH VIÊN ĐỂ SỬA
  // =========================
  const handleEdit = (student) => {
    setFormData({
      studentId: student.studentId,
      name: student.name,
      email: student.email,
    });

    setEditingId(student._id);

    // Cuộn lên đầu để dễ nhìn form sửa
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // =========================
  // HỦY SỬA
  // =========================
  const handleCancelEdit = () => {
    setFormData({
      studentId: '',
      name: '',
      email: '',
    });

    setEditingId(null);
  };

  // =========================
  // THÊM / CẬP NHẬT SINH VIÊN
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Nếu editingId có giá trị -> PUT
      // Nếu editingId = null -> POST
      const url = editingId
        ? `/api/students/${editingId}`
        : '/api/students';

      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        if (editingId) {
          alert('Cập nhật sinh viên thành công!');
        } else {
          alert('Thêm sinh viên thành công!');
        }

        // Xóa trắng form
        setFormData({
          studentId: '',
          name: '',
          email: '',
        });

        // Thoát chế độ sửa
        setEditingId(null);

        // Load lại bảng
        fetchStudents();
      } else {
        const errorText = await response.text();

        console.error('Lỗi từ Backend:', errorText);

        if (
          errorText.includes('duplicate') ||
          errorText.includes('E11000')
        ) {
          alert('MSSV đã tồn tại. Vui lòng nhập MSSV khác!');
        } else {
          alert(
            editingId
              ? 'Cập nhật sinh viên thất bại!'
              : 'Thêm sinh viên thất bại!'
          );
        }
      }
    } catch (error) {
      console.error('Lỗi khi lưu sinh viên:', error);
      alert('Không thể kết nối tới Backend!');
    }
  };

  // =========================
  // XÓA SINH VIÊN
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Bạn có chắc chắn muốn xóa sinh viên này không?'
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Xóa sinh viên thành công!');

        // Nếu đang sửa đúng sinh viên vừa xóa
        // thì reset form luôn.
        if (editingId === id) {
          handleCancelEdit();
        }

        fetchStudents();
      } else {
        alert('Có lỗi xảy ra khi xóa sinh viên!');
      }
    } catch (error) {
      console.error('Lỗi khi xóa sinh viên:', error);
      alert('Không thể kết nối tới Backend!');
    }
  };

  return (
    <div
      style={{
        padding: '30px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2 style={{ textAlign: 'center' }}>
        Quản lý Sinh viên (MERN Stack)
      </h2>

      {/* =========================
          FORM THÊM / SỬA
          ========================= */}
      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: '20px',
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
        }}
      >
        <input
          type="text"
          name="studentId"
          placeholder="MSSV"
          value={formData.studentId}
          onChange={handleChange}
          required
          style={{
            padding: '8px',
          }}
        />

        <input
          type="text"
          name="name"
          placeholder="Họ và tên"
          value={formData.name}
          onChange={handleChange}
          required
          style={{
            padding: '8px',
          }}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{
            padding: '8px',
          }}
        />

        <button
          type="submit"
          style={{
            padding: '8px 15px',
            cursor: 'pointer',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            backgroundColor: editingId
              ? '#1890ff'
              : '#4CAF50',
          }}
        >
          {editingId ? 'Cập nhật' : 'Thêm Sinh viên'}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={handleCancelEdit}
            style={{
              padding: '8px 15px',
              cursor: 'pointer',
              backgroundColor: '#999',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            Hủy
          </button>
        )}
      </form>

      {/* =========================
          BẢNG SINH VIÊN
          ========================= */}
      <table
        border="1"
        cellPadding="10"
        style={{
          borderCollapse: 'collapse',
          width: '100%',
          textAlign: 'left',
        }}
      >
        <thead
          style={{
            backgroundColor: '#f2f2f2',
          }}
        >
          <tr>
            <th>MSSV</th>
            <th>Họ Tên</th>
            <th>Email</th>

            <th
              style={{
                width: '150px',
                textAlign: 'center',
              }}
            >
              Thao tác
            </th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.studentId}</td>

              <td>{student.name}</td>

              <td>{student.email}</td>

              <td>
                <div
                  style={{
                    display: 'flex',
                    gap: '5px',
                    justifyContent: 'center',
                  }}
                >
                  {/* NÚT SỬA */}
                  <button
                    type="button"
                    onClick={() => handleEdit(student)}
                    style={{
                      backgroundColor: '#1890ff',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      cursor: 'pointer',
                      borderRadius: '4px',
                    }}
                  >
                    Sửa
                  </button>

                  {/* NÚT XÓA */}
                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(student._id)
                    }
                    style={{
                      backgroundColor: '#ff4d4f',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      cursor: 'pointer',
                      borderRadius: '4px',
                    }}
                  >
                    Xóa
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {students.length === 0 && (
            <tr>
              <td
                colSpan="4"
                style={{
                  textAlign: 'center',
                }}
              >
                Chưa có sinh viên nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;