import * as express from 'express';

const router: express.Router = express.Router();

import { UserController } from 'controller/UserController';

router.get('/', UserController.LIST);
router.post('/', UserController.CREATE);
router.put('/', UserController.UPDATE);
router.get('/:id', UserController.GET);
router.delete('/:id', UserController.DELETE);
router.post('/:id/uploadImage', UserController.UPLOAD_IMAGE);
router.get('/:id/downloadImage', UserController.DOWNLOAD_IMAGE);

export { router as user };
