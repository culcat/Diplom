import express,{Request,Response} from "express";
import bodyParser from "body-parser";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from 'swagger-ui-express';
import  TelegramBot  from 'node-telegram-bot-api'
import cors from 'cors'
import Users from './Routes/Users'
const app = express()
const port = 3030
const token = '6339257964:AAGGAm0zlRViUhakyjuiZYy5RvXGHlrZUkk'
const chatId = 326646054
const bot = new TelegramBot(token, {polling:true})
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API',
        version: '1.0.0',
    },
};

const options = {
    swaggerDefinition,
    apis: ['./src/Routes/*.ts'],
};
const swaggerSpec = swaggerJSDoc(options);
app.use(cors());
app.use(bodyParser.json());
app.use('/documentation', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use('/api',Users)
app.get('/', async (req: Request, res: Response) => {
  try {
    const message = Math.random()*50;
    await sendTelegramMessage(message);
    res.send('Сообщение успешно отправлено в Telegram');
  } catch (error) {
    console.error('Ошибка отправки сообщения в Telegram:', error);
    res.status(500).send('Ошибка отправки сообщения в Telegram');
  }
});
async function sendTelegramMessage(message: number): Promise<void> {
  try {
    
    await bot.sendMessage(chatId, String(message));
  } catch (error) {
  }
}

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}/documentation`);
});