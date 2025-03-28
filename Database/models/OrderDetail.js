const db = require("../config/db");

const OrderDetail = {
  // Thêm sản phẩm vào đơn hàng
  addItem: async (order_id, product_id, quantity, price) => {
    await db.execute(
      "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
      [order_id, product_id, quantity, price]
    );
  },

  // Lấy danh sách sản phẩm của đơn hàng
  getByOrderId: async (order_id) => {
    const [rows] = await db.execute(
      `SELECT oi.product_id, oi.quantity, oi.price, 
              p.name AS product_name, p.image AS product_image
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [order_id]
    );
    return rows;
  },

  // Xóa tất cả sản phẩm theo order_id
  deleteByOrderId: async (order_id) => {
    const [result] = await db.execute("DELETE FROM order_items WHERE order_id = ?", [order_id]);
    return result.affectedRows > 0;
  },
};

module.exports = OrderDetail;
