import express, { Request, Response } from 'express';
import * as db from '../Controllers/Users';
import * as crypto from 'crypto';
import jwt, { TokenExpiredError, verify } from 'jsonwebtoken';
import TelegramBot from 'node-telegram-bot-api';

const router = express.Router();
/**
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
 *         description: Имя пользователя
 *       - in: query
 *         name: password_hashed
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
 * /api/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     description: Создает нового пользователя в системе
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               phone_number:
 *                 type: string
 *                 description: Номер телефона пользователя
 *               password_hashed:
 *                 type: string
 *                 description: Захешированный пароль пользователя
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
 *               properties:  userId:
 *                   type: string
 *                   description: Идентификатор нового пользователя
 *                 phone_number:
 *                   type: string
 *                   description: Номер телефона нового пользователя
 *                 password_hashed:
 *                   type: string
 *                   description: Захешированный пароль нового пользователя
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

/**
 * @openapi
 * /api/2fa:
 *   get:
 *     summary: 2фа
 *     tags:
 *       - Пользователи
 *     parameters:
 *       - in: query
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Имя пользователя
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: number
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

const token = '6339257964:AAGGAm0zlRViUhakyjuiZYy5RvXGHlrZUkk'

export const bot = new TelegramBot(token, {polling:true})
function code(min:number,max:number){
    return Math.random() * (max-min)+min
} 

async function sendTelegramMessage(message: number, chatId:number): Promise<void> {
    try {
      
      await bot.sendMessage(Number(chatId), String(message));
    } catch (error) {
    }
  }

  
function generateSecretKey():string{
    const secretKey = crypto.randomBytes(64).toString('hex');
    return secretKey;
}
const secretkey = generateSecretKey()
console.log(secretkey);


router.get('/login', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.query;
        // const tgid = await db.GetTgID(String(username))
        const fa = code(1000,9999)
        const fastr = String(fa)
         // db.updateCode(String(username),parseInt(fastr))
        const user = await db.getUserByUsername(username as string);
        // await sendTelegramMessage(parseInt(fastr),Number(tgid.tgid))
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
        }

        const token = jwt.sign({ username }, secretkey, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/verify', async (req: Request, res: Response) => {
    try {
        const { token } = req.query;
        console.log('Received Token:', token);

        if (!token) {
            return res.status(401).json({ error: 'Token is required' });
        }

        const decoded = jwt.verify(token as string, secretkey) as jwt.JwtPayload;
        console.log('Decoded Payload:', decoded);

        if (!decoded.username) {
            return res.status(401).json({ error: 'Invalid token structure' });
        }

        
        const userInfo = await db.getUserByUsername(decoded.username);

        // Return user information in the response
        res.status(200).json({userInfo});
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return res.status(401).json({ error: 'Token has expired' });
        }

        console.error('Error verifying token:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
});
// router.get('/2fa', async (req: Request, res: Response) => {
//     try {
//         const { username, code } = req.query;
//         const codeDB = await db.checkCode(String(username));
//
//         if (Number(code) == codeDB.code) {
//         const token = jwt.sign({ username }, secretkey, { expiresIn: '1h' });
//             res.status(200).json({ token });
//         } else {
//             res.status(401).json({ error: 'Invalid code' });
//         }
//     } catch (e) {
//         console.error('Error checking code:', e);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });


router.post('/register', async (req: Request, res: Response) => {
    try {
        const { phone_number, password_hashed,email,firstname,lastname,thirdname,tgid,company } = req.body;

        if (!phone_number || !password_hashed ) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const existingUser = await db.getUserByUsername(phone_number);

        if (existingUser) {
            return res.status(400).json({ error: 'User with this username already exists' });
        }

        const userId = await db.createUser(phone_number, password_hashed,email,firstname,lastname,thirdname,tgid,company);

        // Generate a token for the newly registered user
        const token = jwt.sign({ phone_number }, secretkey, { expiresIn: '1h' });

        res.status(201).json({  userId, phone_number, password_hashed,token });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





export default router;