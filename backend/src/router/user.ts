import * as express from 'express';

const router: express.Router = express.Router();

import { UserController } from 'controller/UserController';

router.get('/', UserController.LIST);
router.post('/', UserController.CREATE);
router.get('/:id', UserController.GET);
router.put('/:id', UserController.UPDATE);
router.delete('/:id', UserController.DELETE);
router.post('/:id/uploadImage', UserController.UPLOAD_IMAGE);
router.get('/:id/downloadImage', UserController.DOWNLOAD_IMAGE);

export { router as user };
