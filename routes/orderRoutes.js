import express from "express";
const router = express.Router();
import {
	addOrderItems,
	getOrderById,
	updateOrderToPaid,
	updateOrderToDelivered,
	getMyOrders,
	getOrders,
} from "../controllers/orderController.js";
import {
	createCharge,
	handleWebhook,
	listAllCharges,
	listAllEvents,
} from "../controllers/paymentController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders);
router.route("/myorders").get(protect, getMyOrders);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

router.route("/payment/charge").post(protect, createCharge).get(listAllCharges);
router.route("/payment/webhook").get(handleWebhook);
router.route("/payment/events").get(listAllEvents);

export default router;
