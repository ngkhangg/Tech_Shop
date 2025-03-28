const User = require("../models/User");

// Lấy tất cả người dùng
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.status(200).json(users);
  } catch (err) {
    console.error("Lỗi truy vấn database:", err);
    res.status(500).json({ error: "Lỗi truy vấn database" });
  }
};

// Lấy người dùng theo ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.getById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User không tồn tại!" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("Lỗi truy vấn database:", err);
    res.status(500).json({ error: "Lỗi truy vấn database" });
  }
};

// Thêm người dùng mới
exports.createUser = async (req, res) => {
  try {
    const { email, name, role } = req.body;

    if (!email || !name || !role) {
      return res.status(400).json({ error: "Vui lòng nhập đầy đủ thông tin!" });
    }

    // Kiểm tra email đã tồn tại chưa
    if (await User.emailExists(email)) {
      return res.status(400).json({ error: "Email đã tồn tại!" });
    }

    const userId = await User.create({ email, name, role });
    res.status(201).json({ message: "Thêm user thành công!", userId });
  } catch (err) {
    console.error("Lỗi thêm user:", err);
    res.status(500).json({ error: "Lỗi khi thêm user" });
  }
};

// Cập nhật thông tin người dùng
exports.updateUser = async (req, res) => {
  try {
    const { email, name, role } = req.body;
    const userId = req.params.id;

    if (!email || !name || !role) {
      return res.status(400).json({ error: "Vui lòng nhập đầy đủ thông tin!" });
    }

    const success = await User.update(userId, { email, name, role });

    if (!success) {
      return res.status(404).json({ error: "User không tồn tại!" });
    }

    res.status(200).json({ message: "Cập nhật thành công!" });
  } catch (err) {
    console.error("Lỗi cập nhật user:", err);
    res.status(500).json({ error: "Lỗi khi cập nhật user" });
  }
};

// Xóa người dùng
exports.deleteUser = async (req, res) => {
  try {
    const success = await User.delete(req.params.id);

    if (!success) {
      return res.status(404).json({ error: "User không tồn tại!" });
    }

    res.status(200).json({ message: "Xóa user thành công!" });
  } catch (err) {
    console.error("Lỗi xóa user:", err);
    res.status(500).json({ error: "Lỗi khi xóa user" });
  }
};
