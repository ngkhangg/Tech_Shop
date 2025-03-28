const Email = require("../models/Email");

exports.sendContactEmail = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
    }

    await Email.sendContactEmail({ name, email, message });

    res.status(200).json({ message: "Email đã được gửi thành công!" });
  } catch (error) {
    console.error("Lỗi gửi email:", error);
    res.status(500).json({ message: `Gửi email thất bại! Lỗi: ${error.message}` });
  }
};
