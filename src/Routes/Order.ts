import express, { Request, Response } from 'express';
import {createOrder, getOrder} from '../Controllers/Order';
import {bot} from './Users';
import {getAdmin, getBrand, getCustomer, getTruck, getType} from "../Controllers/Contact";
import GeoDecode from "../Utils/GeoDecode";
import CalculateDistance from "../Utils/calculateDistance";

const router = express.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - truk_id
 *         - user_id
 *         - type_id
 *         - from
 *         - where
 *         - distance
 *         - weight
 *         - endprice
 *         - status
 *         - created_at
 *       properties:
 *         truk_id:
 *           type: integer
 *           description: ID of the truck
 *           example: 1
 *         user_id:
 *           type: integer
 *           description: ID of the user
 *           example: 2
 *         type_id:
 *           type: integer
 *           description: ID of the type
 *           example: 3
 *         from:
 *           type: string
 *           description: Starting location
 *           example: "New York"
 *         where:
 *           type: string
 *           description: Destination location
 *           example: "Los Angeles"
 *         distance:
 *           type: number
 *           description: Distance between locations
 *           example: 4500.5
 *         weight:
 *           type: number
 *           description: Weight of the order
 *           example: 1500
 *         endprice:
 *           type: number
 *           description: Final price of the order
 *           example: 2000.50
 *         status:
 *           type: boolean
 *           description: Status of the order
 *           example: true
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation date of the order
 *           example: "2023-01-01T00:00:00.000Z"
 *
 * /api/order:
 *   post:
 *     summary: Create a new order
 *     description: Creates a new order with the given details.
 *     tags:
 *       - Orders
 *     requestBody:
 *       description: Order details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
/**
 * @swagger
 * /api/order:
 *   get:
 *     summary: Retrieve orders for a user
 *     description: Retrieve all orders for a user by their user ID.
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         description: ID of the user whose orders are to be retrieved.
 *         schema:
 *           type: integer
 *           example: 123
 *     responses:
 *       200:
 *         description: A list of orders.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   order_id:
 *                     type: integer
 *                     description: The order ID.
 *                     example: 1
 *                   user_id:
 *                     type: integer
 *                     description: The user ID.
 *                     example: 123
 *                   product:
 *                     type: string
 *                     description: The product name.
 *                     example: "Laptop"
 *                   quantity:
 *                     type: integer
 *                     description: The quantity of the product.
 *                     example: 1
 *                   price:
 *                     type: number
 *                     format: float
 *                     description: The price of the product.
 *                     example: 999.99
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "Internal Server Error"
 */
router.post('/order', async (req: Request, res: Response) => {
    try {
        const { truk_id, user_id, type_id, from, where, weight, endprice, status, created_at } = req.body;

        const getAdmins = await getAdmin();
        const getUserInfo = await getCustomer(Number(user_id));
        const getTypeOrder = await getType(Number(type_id));
        const getTruckInfo = await getTruck(Number(truk_id));
        const getBrandInfo = await getBrand(getTruckInfo.Brand)
        const fromCoords = await GeoDecode(from);
        const whereCoords = await GeoDecode(where);
        const distanceCalc = await CalculateDistance(fromCoords[0],fromCoords[1], whereCoords[0],whereCoords[1]);
        const customer = getUserInfo[0];
        const message = `
            Новый заказ:
            Заказчик: ${customer.firstname} ${customer.lastname}
            Телефон: ${customer.phone_number}
            Email: ${customer.email}
            Тип: ${getTypeOrder.name}
            Грузовик: ${getBrandInfo.name}
            Маршрут: ${from} - ${where}
            Дистанция: ${Math.round(distanceCalc)} км.
            Вес: ${weight} кг.
            Итоговая цена: ${endprice} руб.
            Статус: ${status}
            Дата создания: ${new Date(created_at).toLocaleDateString()}
        `;

        for (let i = 0; i < getAdmins.length; i++) {
            bot.sendMessage(getAdmins[i].tgid, message);
        }

        const newOrder = await createOrder({
            truk_id,
            user_id,
            type_id,
            from,
            where,
            distanceCalc,
            weight,
            endprice,
            status,
            created_at
        });

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});


router.get('/order', async (req: Request, res: Response) => {
    const {user_id} = req.query;
    try {
        const orders = await getOrder(Number(user_id));
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error });
    }
})
export default router;
