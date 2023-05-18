import * as express from 'express';
import { Parameters, CTSearch } from './types';
const app = express();
const port = 3000;

app.post('/', (req, res) => {
  const body: Parameters = req.body;

  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
