import express, { Request, Response } from "express";
import * as db from "../Controllers/Users";
import * as crypto from "crypto";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import TelegramBot from "node-telegram-bot-api";
import bcrypt from "bcrypt";

const router = express.Router();

/**
 * @openapi
 * /api/login:
 *   get:
 *     summary: Вход
 *     tags:
 *       - Пользователи
 *     parameters:
 *       - in: query
 *         name: phone_number
 *         required: true
 *         schema:
 *           type: string
 *         description: Номер телефона
 *       - in: query
 *         name: password
 *         required: true
 *         schema:
 *           type: string
 *         description: Пароль пользователя
 *     responses:
 *       '200':
 *         description: Успешная авторизация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT токен
 *       '401':
 *         description: Неверное имя пользователя или пароль
 *       '500':
 *         description: Внутренняя ошибка сервера
 */
/**
 * @openapi
 * tags:
 *   - name: Пользователи
 *     description: Управление пользователями системы
 * /api/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     description: Создает нового пользователя в системе
 *     tags:
 *       - Пользователи
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone_number:
 *                 type: string
 *                 description: Номер телефона пользователя
 *               password:
 *                 type: string
 *                 description: Пароль пользователя
 *               email:
 *                 type: string
 *                 description: Email пользователя
 *               firstname:
 *                 type: string
 *                 description: Имя пользователя
 *               lastname:
 *                 type: string
 *                 description: Фамилия пользователя
 *               thirdname:
 *                 type: string
 *                 description: Отчество пользователя
 *               tgid:
 *                 type: string
 *                 description: Telegram ID пользователя
 *               company:
 *                 type: string
 *                 description: Название компании пользователя
 *     responses:
 *       '201':
 *         description: Успешно создан новый пользователь
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: Идентификатор нового пользователя
 *                 phone_number:
 *                   type: string
 *                   description: Номер телефона нового пользователя
 *                 token:
 *                   type: string
 *                   description: JWT токен для нового пользователя
 *       '400':
 *         description: Некорректный запрос, отсутствуют обязательные поля или пользователь с таким номером телефона уже существует
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Описание ошибки
 *       '500':
 *         description: Внутренняя ошибка сервера при создании пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Описание ошибки
 */
/**
 * @openapi
 * /api/verify:
 *   get:
 *     summary: Вход
 *     tags:
 *       - Пользователи
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Имя пользователя
 *
 *     responses:
 *       '200':
 *         description: Успешная авторизация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT токен
 *       '401':
 *         description: Invalid token
 *       '500':
 *         description: Внутренняя ошибка сервера
 */
const token = "YOUR_TELEGRAM_BOT_TOKEN";

export const bot = new TelegramBot(token, { polling: true });
function code(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}

async function sendTelegramMessage(message: number, chatId: number): Promise<void> {
    try {
        await bot.sendMessage(Number(chatId), String(message));
    } catch (error) {
        console.error("Error sending message:", error);
    }
}

function generateSecretKey(): string {
    const secretKey = crypto.randomBytes(64).toString("hex");
    return secretKey;
}
const secretkey = generateSecretKey();
console.log(secretkey);

router.get("/login", async (req: Request, res: Response) => {
    try {
        const { phone_number, password } = req.query;
        const user = await db.getUserByUsername(phone_number as string);

        if (!user) {
            return res.status(401).json({ error: "Неверное имя пользователя или пароль" });
        }

        const passwordMatch = await bcrypt.compare(password as string, user.password_hashed);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Неверное имя пользователя или пароль" });
        }

        const token = jwt.sign({ phone_number }, secretkey, {
            expiresIn: "1h",
        });

        res.status(200).json({ token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/verify", async (req: Request, res: Response) => {
    try {
        const { token } = req.query;
        console.log("Received Token:", token);

        if (!token) {
            return res.status(401).json({ error: "Token is required" });
        }

        const decoded = jwt.verify(token as string, secretkey) as jwt.JwtPayload;
        console.log("Decoded Payload:", decoded);

        if (!decoded.phone_number) {
            return res.status(401).json({ error: "Invalid token structure" });
        }

        const user = await db.getUserByUsername(decoded.phone_number);

        res.status(200).json({ user });
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return res.status(401).json({ error: "Token has expired" });
        }

        console.error("Error verifying token:", error);
        res.status(401).json({ error: "Invalid token" });
    }
});

router.post("/register", async (req: Request, res: Response) => {
    try {
        const { phone_number, password, email, firstname, lastname, thirdname, tgid, company } = req.body;

        if (!phone_number || !password) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const existingUser = await db.getUserByUsername(phone_number);

        if (existingUser) {
            return res.status(400).json({ error: "User with this phone number already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userId = await db.createUser(phone_number, hashedPassword, email, firstname, lastname, thirdname, tgid, company);

        const token = jwt.sign({ phone_number }, secretkey, {
            expiresIn: "1h",
        });

        res.status(201).json({ userId, phone_number, token });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
