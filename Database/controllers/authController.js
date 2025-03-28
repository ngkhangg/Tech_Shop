const jwt = require("jsonwebtoken");
const User = require("../models/User");
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// Đăng ký
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Vui lòng nhập đầy đủ thông tin" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Mật khẩu phải có ít nhất 6 ký tự" });
    }

    // Kiểm tra email đã tồn tại chưa
    if (await User.emailExists(email)) {
      return res.status(400).json({ error: "Email đã tồn tại" });
    }

    // Tạo user
    await User.create({ name, email, password });
    res.status(201).json({ message: "Đăng ký thành công! Bạn có thể đăng nhập ngay." });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    res.status(500).json({ error: "Lỗi server, thử lại sau" });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Vui lòng nhập email và mật khẩu" });

    // Lấy user từ email
    const user = await User.findByEmail(email);
    if (!user) return res.status(401).json({ error: "Email không tồn tại" });

    // Kiểm tra mật khẩu
    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Mật khẩu không đúng" });

    // Tạo JWT token
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: "1h" });

    res.status(200).json({ id: user.id, name: user.name, email: user.email, role: user.role, token });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    res.status(500).json({ error: "Lỗi server, thử lại sau" });
  }
};

// Đăng xuất
exports.logout = (req, res) => {
  res.status(200).json({ message: "Đăng xuất thành công" });
};
