import express from "express";
import {bot} from './Users'
import * as db from '../Controllers/Contact';
import {Request, Response} from "express";


const router = express.Router();
/**
 * @swagger
 * /api/Contact:
 *   post:
 *     summary: Отправить сообщение администраторам
 *     description: >
 *       Этот эндпоинт позволяет отправить сообщение администраторам из контактной формы.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Имя отправителя
 *               phone_number:
 *                 type: string
 *                 description: Номер телефона отправителя
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email отправителя
 *               goal:
 *                 type: string
 *                 description: Цель обращения
 *             required:
 *               - name
 *               - phone_number
 *               - email
 *               - goal
 *     responses:
 *       '200':
 *         description: Успешное отправление сообщения
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Сообщение о успешной отправке
 *       '500':
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Описание ошибки сервера
 *     tags:
 *       - Contact
 */
router.post('/Contact', async (req: Request, res: Response) => {
    try {
        const { name, phone_number,email,goal } = req.body;

        const result =await db.getAdmin()
        const message = `Имя: ${name}\nНомер телефона: ${phone_number}\nEmail: ${email}\nЦель обращения: ${goal}`
        for(let i=0;i<result.length;i++){
            await bot.sendMessage(result[i].tgid, message)
        }



        res.status(200).json({ message: 'Message sent successfully' });

    } catch (e) {
        console.error('Error checking code:', e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



export default router