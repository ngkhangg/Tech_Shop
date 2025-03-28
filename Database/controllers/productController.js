const Product = require('../models/Product');

// Lấy danh sách sản phẩm
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAll(req.query.category_id);
    res.status(200).json(products);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    res.status(500).json({ error: "Lỗi server khi lấy danh sách sản phẩm" });
  }
};

// Lấy sản phẩm theo ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID sản phẩm không hợp lệ" });
    }

    const product = await Product.getById(id);
    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error);
    res.status(500).json({ error: "Lỗi server khi lấy sản phẩm" });
  }
};

// Thêm sản phẩm mới
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, image, stock, category_id } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!name || !price || stock === undefined || !category_id) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin sản phẩm' });
    }

    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ message: 'Giá sản phẩm phải là số dương' });
    }

    if (isNaN(stock) || stock < 0) {
      return res.status(400).json({ message: 'Số lượng tồn kho phải là số không âm' });
    }

    // Gọi phương thức create từ Model
    const productId = await Product.create({ name, description, price, image, stock, category_id });

    res.status(201).json({ message: 'Sản phẩm đã được thêm', productId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Cập nhật sản phẩm theo ID
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image, stock, category_id } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!name || !price || stock === undefined || !category_id) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin sản phẩm' });
    }

    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ message: 'Giá sản phẩm phải là số dương' });
    }

    if (isNaN(stock) || stock < 0) {
      return res.status(400).json({ message: 'Số lượng tồn kho phải là số không âm' });
    }

    const [result] = await db.execute(
      'UPDATE products SET name = ?, description = ?, price = ?, image = ?, stock = ?, category_id = ? WHERE id = ?',
      [name, description, price, image, stock, category_id, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }

    res.status(200).json({ message: 'Sản phẩm đã được cập nhật' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Xóa sản phẩm theo ID
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID sản phẩm không hợp lệ" });
    }

    const isDeleted = await Product.delete(id);
    if (!isDeleted) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }

    res.status(200).json({ message: 'Sản phẩm đã được xóa' });
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    res.status(500).json({ error: "Lỗi server khi xóa sản phẩm" });
  }
};
