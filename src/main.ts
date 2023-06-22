import * as express from 'express';
import { CTSearch, Parameters } from './types';
import * as bodyParser from 'body-parser';

import { ResultService } from './services/results.service';
const app = express();

app.use(bodyParser.json({}));
const port = 3000;
//Services

app.post('/servivuelo', async (req, res) => {
  const body: Parameters = req.body;
  const resultService: ResultService = new ResultService();
  const result: CTSearch[] = await resultService.getResults(body);

  res.send(result);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
