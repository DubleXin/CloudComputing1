import bodyParser from 'body-parser';
import express from 'express';
import { RouteController } from './modules/route/routeController.js';

const app = express();
const port = 3000;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => console.log('server on port: ' + port));
const route = new RouteController(app);
