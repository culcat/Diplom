import express, { Request, Response } from 'express';
import { createOrder } from '../Controllers/Order';
import {bot} from './Users';
import {getAdmin, getCustomer} from "../Controllers/Contact";

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

router.post('/order', async (req: Request, res: Response) => {
    try {
        const { truk_id, user_id, type_id, from, where, distance, weight, endprice, status, created_at } = req.body;
        const getAdmins = await getAdmin();
        const getUserInfo = await getCustomer(Number(user_id));

        const customer = getUserInfo[0];
        const message = `
            Новый заказ:
            Заказчик: ${customer.firstname} ${customer.lastname}
            Телефон: ${customer.phone_number}
            Email: ${customer.email}
            Маршрут: ${from} - ${where}
            Дистанция: ${distance} км.
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
            distance,
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

export default router;
