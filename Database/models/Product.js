const db = require('../config/db');

class Product {
  // Lấy tất cả sản phẩm (có thể lọc theo category_id)
  static async getAll(category_id = null) {
    let sql = 'SELECT id, name, description, price, image, stock, category_id FROM products';
    const params = [];

    if (category_id) {
      sql += ' WHERE category_id = ?';
      params.push(category_id);
    }

    const [products] = await db.execute(sql, params);
    return products;
  }

  // Lấy chi tiết sản phẩm theo ID
  static async getById(id) {
    const [product] = await db.execute(
      'SELECT id, name, description, price, image, stock FROM products WHERE id = ?',
      [id]
    );

    return product.length ? product[0] : null;
  }

  // Thêm sản phẩm mới
  static async create({ name, description, price, image, stock, category_id }) {
    const [result] = await db.execute(
      'INSERT INTO products (name, description, price, image, stock, category_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, image, stock, category_id]
    );

    return result.insertId;
  }

  // Cập nhật sản phẩm theo ID
  static async update(id, { name, description, price, image, stock, category_id }) {
    const [result] = await db.execute(
      'UPDATE products SET name = ?, description = ?, price = ?, image = ?, stock = ?, category_id = ? WHERE id = ?',
      [name, description, price, image, stock, category_id, id]
    );

    return result.affectedRows > 0;
  }

  // Xóa sản phẩm theo ID
  static async delete(id) {
    const [result] = await db.execute('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Product;
