<template>
  <div class="user-management">
    <h2>Quản lý tài khoản</h2>
    <p v-if="isLoading">Đang tải dữ liệu...</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <table v-else>
      <thead>
        <tr>
          <th>ID</th>
          <th>Email</th>
          <th>Tên</th>
          <th>Vai trò</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.role }}</td>
          <td>
            <button class="btn edit" @click="openUserModal(user)">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn delete" @click="deleteUser(user.id)">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal thêm/sửa tài khoản -->
    <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        <h3>{{ editingUser ? "Chỉnh sửa tài khoản" : "Thêm tài khoản" }}</h3>

        <div class="input-group">
          <label>Họ và Tên:</label>
          <input v-model="userForm.name" type="text" placeholder="Nhập họ và tên" required />
        </div>
        <div class="input-group">
          <label>Email:</label>
          <input v-model="userForm.email" type="email" placeholder="Nhập email" required />
        </div>
        <div class="input-group">
          <label>Mật khẩu:</label>
          <input v-model="userForm.password" type="password" placeholder="Nhập mật khẩu" required />
        </div>

        <div class="input-group">
          <label>Vai trò</label>
          <select v-model="userForm.role">
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
          </select>
        </div>

        <div class="modal-footer">
          <button class="btn save" @click="saveUser" :disabled="isSaving">
            {{ isSaving ? "Đang lưu..." : "Lưu" }}
          </button>
          <button class="btn close" @click="closeModal">Đóng</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  name: "UserManagement",
  setup() {
    const API_BASE_URL = "http://localhost:3000";
    const users = ref([]);
    const isLoading = ref(false);
    const isSaving = ref(false);
    const isModalOpen = ref(false);
    const editingUser = ref(null);
    const userForm = ref({ email: "", name: "", password: "", role: "customer" });
    const errorMessage = ref("");

    const openUserModal = (user) => {
      if (user) {
        editingUser.value = { ...user };
        userForm.value = { ...user, password: "" }; // Xóa mật khẩu khi chỉnh sửa
      } else {
        clearForm();
      }
      isModalOpen.value = true;
    };

    const closeModal = () => {
      isModalOpen.value = false;
    };

    const clearForm = () => {
      editingUser.value = null;
      userForm.value = { email: "", name: "", password: "", role: "customer" };
      errorMessage.value = "";
    };

    const saveUser = async () => {
      if (!userForm.value.email || !userForm.value.name || !userForm.value.password) {
        errorMessage.value = "Vui lòng điền đầy đủ thông tin!";
        return;
      }
      isSaving.value = true;
      errorMessage.value = "";
      try {
        const method = editingUser.value ? "PUT" : "POST";
        const url = editingUser.value
          ? `${API_BASE_URL}/users/${editingUser.value.id}`
          : `${API_BASE_URL}/users`;

        const validRoles = ['admin', 'customer'];
        if (!validRoles.includes(userForm.value.role)) {
          errorMessage.value = "Vai trò không hợp lệ!";
          return;
        }

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userForm.value),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error response:", errorData);
          throw new Error("Lỗi khi lưu tài khoản!");
        }
        await fetchUsers();
        closeModal();
      } catch (error) {
        errorMessage.value = error.message || "Lỗi khi lưu tài khoản!";
      } finally {
        isSaving.value = false;
      }
    };

    const deleteUser = async (userId) => {
      if (!confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) return;
      try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, { method: "DELETE" });
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error deleting user:", errorData);
          throw new Error("Lỗi khi xóa tài khoản!");
        }

        await fetchUsers();
      } catch (error) {
        errorMessage.value = error.message || "Lỗi khi xóa tài khoản!";
      }
    };

    const fetchUsers = async () => {
      isLoading.value = true;
      errorMessage.value = "";
      try {
        const res = await fetch(`${API_BASE_URL}/users`);

        if (!res.ok) {
          throw new Error("Lỗi khi tải danh sách tài khoản!");
        }

        users.value = await res.json();
      } catch (error) {
        errorMessage.value = error.message || "Lỗi khi tải danh sách tài khoản!";
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(fetchUsers);

    return {
      users,
      isLoading,
      isSaving,
      isModalOpen,
      userForm,
      editingUser,
      openUserModal,
      closeModal,
      saveUser,
      deleteUser,
      errorMessage,
    };
  },
};
</script>

<style scoped>
.user-management {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 10px;
  animation: fadeIn 0.5s ease-in-out;
}

h2 {
  text-align: center;
  font-size: 26px;
  color: #333;
  margin-bottom: 20px;
  font-weight: bold;
  text-transform: uppercase;
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.btn i {
  font-size: 16px;
}

.btn.edit {
  background: linear-gradient(to right, #f1c40f, #f39c12);
  color: black;
}

.btn.delete {
  background: linear-gradient(to right, #e74c3c, #c0392b);
  color: white;
}

.btn:hover {
  transform: scale(1.1);
  opacity: 0.9;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.5s ease-in-out;
}

th,
td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: center;
}

th {
  background: linear-gradient(to right, #71b8ff, #00bfff);
  font-weight: bold;
  color: white;
}

tbody tr:nth-child(even) {
  background: #f9f9f9;
}

td:last-child {
  display: flex;
  justify-content: center;
  gap: 10px;
}

/* Hiệu ứng modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.4s ease-in-out;
}

.modal-content {
  background: linear-gradient(to bottom, #f0f8ff, #cce7ff);
  padding: 25px;
  border-radius: 10px;
  width: 420px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  animation: popUp 0.3s ease-in-out;
}

.modal-content h3 {
  margin-bottom: 15px;
  font-size: 22px;
  color: #333;
  font-weight: bold;
}

.modal-content label {
    display: block;
    text-align: left;
    font-weight: 600;
    color: #444;
    margin: 10px 0 5px;
}


.modal-content input,
.modal-content textarea,
.modal-content select {
    width: 100%;
    padding: 10px;
    border: 2px solid #ddd;
    border-radius: 6px;
    font-size: 16px;
    transition: all 0.3s ease;
    box-sizing: border-box;
}

.modal-content input:focus,
.modal-content select:focus,
.modal-content textarea:focus {
    border-color: #007bff;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.4);
    outline: none;
}

.modal-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
}

.modal-footer .btn {
    flex: 1;
    margin: 0 5px;
}

.input-group {
  text-align: left;
  margin-bottom: 15px;
}

.input-group label {
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 5px;
}

.input-group input,
.input-group select {
  width: 100%;
  padding: 12px;
  border: 2px solid #bdc3c7;
  border-radius: 6px;
  font-size: 16px;
  transition: all 0.3s ease-in-out;
  background: #ecf0f1;
  color: #2c3e50;
}

.input-group input:focus,
.input-group select:focus {
  border-color: #3498db;
  box-shadow: 0 0 8px rgba(52, 152, 219, 0.4);
  outline: none;
}

/* Nút trong modal */
.modal-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.modal-footer .btn {
  flex: 1;
  margin: 0 5px;
}

.btn.save {
  background: linear-gradient(to right, #71b8ff, #00bfff);
  color: white;
}

.btn.close {
  background: linear-gradient(to right, #849baa, #cdcecf);
  color: white;
}

/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes popUp {
  from {
    transform: scale(0.9);
  }
  to {
    transform: scale(1);
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

</style>
