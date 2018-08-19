import { json, urlencoded } from 'body-parser';
import * as express from 'express';
import * as fileUpload from 'express-fileupload';

import { router } from 'router/index';

import { DBConnection } from 'service/DBConnection';

// Create MongoDB connection
const dbUrl: string = process.env.dbUrl || 'mongodb://localhost:27017';
const dbName: string = process.env.dbName || 'quibim';
DBConnection.CONNECT(dbUrl, dbName);

/**
 * Index
 */
const app: express.Application = express.default();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(fileUpload.default());

app.use((req: any, res: any, next: any) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
  );

  // res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Expose-Headers', 'Authentication');

  next();
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Quibim backend is runing on port 3000!');
});

app.use('/', router);
