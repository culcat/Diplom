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
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Имя пользователя
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
 * /api/register:
 *   post:
 *     summary: Регистрация
 *     tags:
 *       - Пользователи
 *     requestBody:
 *       description: JSON object containing user registration information.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username for the new user.
 *               password:
 *                 type: string
 *                 description: The password for the new user.
 *             required:
 *               - username
 *               - password
 *     responses:
 *       '201':
 *         description: User successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: number
 *                   description: The unique identifier for the newly created user.
 *                 username:
 *                   type: string
 *                   description: The username of the newly created user.
 *                 token:
 *                   type: string
 *                   description: Authentication token for the newly registered user.
 *       '400':
 *         description: Bad Request. Missing required fields or user with the same username already exists.
 *       '500':
 *         description: Internal Server Error. Something went wrong on the server.
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

const bot = new TelegramBot(token, {polling:true})
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
        const tgid = await db.GetTgID(String(username))
        const fa = code(1000,9999)
        const fastr = String(fa)
         db.updateCode(String(username),parseInt(fastr))
        const user = await db.getUserByUsername(username as string);
        await sendTelegramMessage(parseInt(fastr),Number(tgid.tgid))
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
router.get('/2fa', async (req: Request, res: Response) => {
    try {
        const { username, code } = req.query;
        const codeDB = await db.checkCode(String(username));
        
        if (Number(code) == codeDB.code) {
        const token = jwt.sign({ username }, secretkey, { expiresIn: '1h' });
            res.status(200).json({ token });
        } else {
            res.status(401).json({ error: 'Invalid code' });
        }
    } catch (e) {
        console.error('Error checking code:', e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/register', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        if (!username || !password ) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const existingUser = await db.getUserByUsername(username);

        if (existingUser) {
            return res.status(400).json({ error: 'User with this username already exists' });
        }

        const userId = await db.createUser(username, password);

        // Generate a token for the newly registered user
        const token = jwt.sign({ username }, secretkey, { expiresIn: '1h' });

        res.status(201).json({  userId, username, password,token });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





export default router;