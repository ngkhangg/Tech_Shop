const Order = require("../models/Order");
const OrderDetail = require("../models/OrderDetail");
const db = require("../config/db");

// Tạo đơn hàng
exports.createOrder = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { user_id, items, total_price } = req.body;

    // Log để kiểm tra dữ liệu đầu vào
    console.log("Dữ liệu nhận từ frontend:", JSON.stringify(req.body, null, 2));

    if (!user_id || !items || !Array.isArray(items) || items.length === 0 || total_price === undefined) {
      return res.status(400).json({ message: "Dữ liệu đơn hàng không hợp lệ" });
    }

    await connection.beginTransaction();

    // Kiểm tra tồn kho
    for (const item of items) {
      console.log("Kiểm tra sản phẩm:", item);

      // Kiểm tra nếu frontend gửi key sai (ví dụ: `id` thay vì `product_id`)
      if (!item.product_id && item.id) {
        item.product_id = item.id; // Chuyển đổi `id` thành `product_id`
      }

      if (!item.product_id || !item.quantity || !item.price) {
        console.error("Lỗi: Thiếu thông tin sản phẩm", item);
        throw new Error("Thiếu thông tin sản phẩm trong đơn hàng.");
      }

      const [stockResult] = await connection.execute(
        "SELECT stock FROM products WHERE id = ?",
        [item.product_id]
      );

      if (stockResult.length === 0) {
        throw new Error(`Sản phẩm ID ${item.product_id} không tồn tại`);
      }

      const stock = stockResult[0].stock;
      if (item.quantity > stock) {
        throw new Error(`Sản phẩm ID ${item.product_id} không đủ hàng tồn kho`);
      }
    }

    // Lấy số thứ tự đơn hàng tiếp theo
    const [orderNumberResult] = await connection.execute(
      "SELECT COALESCE(MAX(order_number), 0) + 1 AS next_order_number FROM orders WHERE user_id = ?",
      [user_id]
    );
    const orderNumber = orderNumberResult.length > 0 ? orderNumberResult[0].next_order_number : 1;

    // Tạo đơn hàng
    const orderId = await Order.create(user_id, total_price, orderNumber);

    // Thêm sản phẩm vào đơn hàng
    for (const item of items) {
      await OrderDetail.addItem(orderId, item.product_id, item.quantity, item.price);

      await connection.execute(
        "UPDATE products SET stock = stock - ? WHERE id = ?",
        [item.quantity, item.product_id]
      );
    }

    await connection.commit();
    res.status(201).json({
      message: "Đơn hàng tạo thành công",
      orderId,
      orderName: `Đơn hàng #${orderNumber}`,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Lỗi khi tạo đơn hàng:", error);
    res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
};

// Lấy danh sách đơn hàng
exports.getOrders = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ message: "Thiếu user_id" });
    }

    const orders = await Order.getByUserId(user_id);
    for (let order of orders) {
      order.items = await OrderDetail.getByOrderId(order.id);
    }

    res.json(orders);
  } catch (error) {
    console.error("Lỗi lấy danh sách đơn hàng:", error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách đơn hàng", error: error.message });
  }
};

// Lấy chi tiết đơn hàng
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.getById(id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    order.items = await OrderDetail.getByOrderId(id);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy đơn hàng", error: error.message });
  }
};

// Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    const updated = await Order.updateStatus(id, status);
    if (!updated) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    res.json({ message: "Cập nhật trạng thái đơn hàng thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật trạng thái đơn hàng", error: error.message });
  }
};

// Xóa đơn hàng
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Order.delete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    res.json({ message: "Xóa đơn hàng thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa đơn hàng", error: error.message });
  }
};
