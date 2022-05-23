import pkg from "coinbase-commerce-node";
import expressAsyncHandler from "express-async-handler";
import dotenv from "dotenv"
dotenv.config()
import Order from "../models/orderModel.js";



const { Client, resources, Webhook } = pkg;

Client.init(process.env.COINBASE_KEY); //Add your Coinbase Key

const createCharge = expressAsyncHandler(async (req, res) => {
	const { Charge } = resources;
	const { amount, order_id } = req.body;

	const chargeData = {
    name: 'Best Watches',
    description: 'Please proceed to make payment',
    local_price: {
      amount,
      currency: 'USD',
    },
    pricing_type: 'fixed_price',
    metadata: {
      user: req.user._id,
      order: order_id,
    },
    brand_logo_url:
      'https://res.cloudinary.com/switch-design/image/upload/v1644181558/image-1641374406635_pdozc7.jpg', // Add website logo
    brand_color: '#0000FF',
    logo_url:
      'https://res.cloudinary.com/switch-design/image/upload/v1644181558/image-1641374406635_pdozc7.jpg', //Add website logo
    redirect_url: `http://www.bestwatchesdeals.com//order/${order_id}`,
    cancel_url: `http://www.bestwatchesdeals.com//order/${order_id}`,
  };

	const charge = await Charge.create(chargeData);
	res.json(charge);
});

const handleWebhook = expressAsyncHandler(async (req, res) => {
	const rawBody = req.rawBody;
	const signature = req.headers["x-cc-webhook-signature"];
	const webhookSecret = process.env.WEBHOOK_SECRET; // Add your webhook secret

	const event = Webhook.verifyEventBody(rawBody, signature, webhookSecret);

	if (event.type === "charge:confirmed") {
		// Update Order to Paid and Get set for delivery.
		await Order.findByIdAndUpdate(
			event.data.metadata.order,
			{
				paid: true,
			},
			{ new: true, useFindAndModify: false }
		);
	}

	if (event.type === "charge:pending") {
		// Update Order Payment to Pending....
	}

	if (event.type === "charge:created") {
		// A charge has been created.
	}
	if (event.type === "charge:failed") {
		// Update Order Payment to failed.
	}
	if (event.type === "charge:delayed") {
		// Update Order Payment to delayed.
	}
	if (event.type === "charge:resolved") {
		// Update Order to Paid and get set for delivery
	}

	res.json(event);
});

const listAllCharges = expressAsyncHandler(async (req, res) => {
	const { Charge } = resources;
	const allCharges = await Charge.list();

	res.json(allCharges);
});

const listAllEvents = expressAsyncHandler(async (req, res) => {
	const { Event } = resources;
	const allEvents = await Event.list();

	res.json(allEvents);
});

export { createCharge, handleWebhook, listAllCharges, listAllEvents };
