import express,{Request,Response} from "express";
import bodyParser from "body-parser";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from 'swagger-ui-express';
import  TelegramBot  from 'node-telegram-bot-api'
import Tariff from './Routes/Tariff'
import cors from 'cors'
import Users from './Routes/Users'
import Feedback from './Routes/Feedback'
import Contact from "./Routes/Contact";
import Services from "./Routes/Services";
const app = express()
const port = 3030

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
app.use('/api',Feedback)
app.use('/api',Tariff)
app.use('/api',Contact)
app.use('/api',Services)
app.use(express.static(__dirname + '/dist'))
app.get('/', async (req: Request, res: Response) => {
  try {

    res.render('index.html');
  } catch (error) {
    console.error( error);
    res.status(500).send(error);
  }
});


app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}/documentation`);
});