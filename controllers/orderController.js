const Orders = require("../schema/order.model.js");

const getAllOrder = async (req, res) => {
  try {
    const { brand, page, limit } = req.query;

    const orders = await Orders.paginate(
      {},
      {
        page: (page && isNaN(page)) == false ? parseInt(page) : 1,
        limit: (limit && isNaN(limit)) == false ? parseInt(limit) : 4,
        brand: brand,
        populate: [
          {
            path: "ownerId",
            select: "fullName role",
          },
        ],
      }
    );

    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const { productId, productName, quantity, totalCost, shippingStatus } =
      req.body;

    const newOrder = {
      productId,
      productName,
      quantity,
      totalCost,
      shippingStatus,
    };

    if (!productName || !productId || !quantity || !totalCost) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const order = await Orders.create({
      ownerId: req.decoded.ownerId,
      orders: [newOrder],
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error creating order",
      error: error.message || error,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Orders.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching order", error: error.message });
  }
};

const updateOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId, productName, quantity, totalCost } = req.body;

    const order = await Orders.findOneAndUpdate(
      { _id: id, "orders.productId": productId }, // find order with matching product
      {
        $set: {
          "orders.$.productName": productName,
          "orders.$.quantity": quantity,
          "orders.$.totalCost": totalCost,
        },
      },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order or product not found" });
    }

    res.status(200).json({
      message: "Product in order updated successfully!",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating order",
      error: error.message,
    });
  }
};

// old updateShippingStatus before socket
// const updateShippingStatus = async (req, res) => {
//   try {
//     const { shippingStatus, productId } = req.body;

//     const order = await Orders.findOneAndUpdate(
//       { _id: req.params.id, "orders.productId": productId }, // find order + product
//       { $set: { "orders.$.shippingStatus": shippingStatus } }, // update just that product
//       { new: true }
//     );

//     if (!order) {
//       return res.status(404).json({ message: "Order or product not found" });
//     }

//     res.status(200).json({ message: "Shipping status updated", order });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error updating order",
//       error: error.message,
//     });
//   }
// };

const updateShippingStatus = async (req, res) => {
  try {
    const { shippingStatus, productId } = req.body;

    const order = await Orders.findOneAndUpdate(
      { _id: req.params.id, "orders.productId": productId },
      { $set: { "orders.$.shippingStatus": shippingStatus } },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order or product not found" });
    }

    const ioServer = req.app.get("ioServer");
    const updatedProduct = order.orders.find(
      (o) => o.productId.toString() === productId
    );

    if (updatedProduct) {
      console.log(
        `Emitting shippingStatusUpdated to user ${order.ownerId} for order ${order._id}`
      );
      ioServer.to(order.ownerId.toString()).emit("send-message", {
        orderId: order._id,
        productId: updatedProduct.productId,
        title: "New shipping status",
        message: `Your last order shipping status has been updated to ${updatedProduct.shippingStatus}`,
      });
    }

    res.status(200).json({ message: "Shipping status updated", order });
  } catch (error) {
    res.status(500).json({
      message: "Error updating order",
      error: error.message,
    });
    console.log("error from updating shipping status", error);
  }
};

const deleteOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Orders.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order deleted successfully!",
      order,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting order", error: error.message });
  }
};

const orderHistory = async (req, res) => {
  try {
    const { role, ownerId } = req.decoded;
    const { page, limit } = req.query;

    let query = {};

    if (role === "customer") {
      query.ownerId = ownerId;
    }

    const orders = await Orders.paginate(query, {
      page: (page && isNaN(page)) == false ? parseInt(page) : 1,
      limit: (limit && isNaN(limit)) == false ? parseInt(limit) : 4,
      // brand: brand,
      populate: [
        {
          path: "ownerId",
          select: "fullName email role",
        },
        {
          path: "orders.productId",
          select: "name price brand",
        },
      ],
    });

    res.status(200).json({
      message: "Order history fetched successfully",
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching order history",
      error: error.message,
    });
  }
};

module.exports = {
  getAllOrder,
  createOrder,
  getOrderById,
  updateOrderById,
  deleteOrderById,
  updateShippingStatus,
  orderHistory,
};
