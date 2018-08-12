import * as express from 'express';
import { user } from 'router/user';

const router: express.Router = express.Router();

router.use('/user', user);

export { router };
