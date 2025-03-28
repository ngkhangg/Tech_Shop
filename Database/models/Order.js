const db = require("../config/db");

const Order = {
    create: async (user_id, total_price, order_number) => {
        if (user_id === undefined || total_price === undefined || order_number === undefined) {
            throw new Error("Thiếu tham số khi tạo đơn hàng.");
        }

        const [result] = await db.execute(
            "INSERT INTO orders (user_id, total_price, status, order_number) VALUES (?, ?, 'pending', ?)",
            [user_id ?? null, total_price ?? 0, order_number ?? null]
        );

        return result.insertId;
    },

    getById: async (id) => {
        if (!id) throw new Error("ID đơn hàng không hợp lệ.");

        const [rows] = await db.execute("SELECT * FROM orders WHERE id = ?", [id]);
        return rows.length > 0 ? rows[0] : null;
    },

    getByUserId: async (user_id) => {
        if (!user_id) throw new Error("User ID không hợp lệ.");

        const [rows] = await db.execute(
            "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
            [user_id]
        );
        return rows;
    },

    updateStatus: async (id, status) => {
        if (!id || !status) throw new Error("Thiếu thông tin cập nhật trạng thái.");

        const [result] = await db.execute(
            "UPDATE orders SET status = ? WHERE id = ?",
            [status, id]
        );

        return result.affectedRows > 0;
    },

    delete: async (id) => {
        if (!id) throw new Error("ID đơn hàng không hợp lệ.");

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            await connection.execute("DELETE FROM order_items WHERE order_id = ?", [id]);
            const [result] = await connection.execute("DELETE FROM orders WHERE id = ?", [id]);

            await connection.commit();
            return result.affectedRows > 0;
        } catch (error) {
            await connection.rollback();
            console.error("Lỗi khi xóa đơn hàng:", error);
            throw error;
        } finally {
            connection.release();
        }
    },
};

module.exports = Order;
