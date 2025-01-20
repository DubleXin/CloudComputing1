import bodyParser from 'body-parser';
import express from 'express';

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => console.log('server on port: ' + port));

app.get('/', (_req, res) => {
  res.send('OK');
});
