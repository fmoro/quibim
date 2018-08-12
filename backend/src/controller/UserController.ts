
import { exec, ExecException } from 'child_process';
import { Request, Response } from 'express';
import * as fileUpload from 'express-fileupload';
import { User, UserFactory } from 'factory/UserFactory';
import * as fs from 'fs';
import { Cursor, InsertOneWriteOpResult, ObjectID } from 'mongodb';
import { GridFS } from 'service/GridFS';
import { UserService } from 'service/UserService';
import { promisify } from 'util';

export class UserController {
  public static async LIST(req: Request, res: Response): Promise<void> {
    try {
      const cursor: Cursor = await UserService.FIND();
      const results: any[] = await cursor.toArray();
      res.send(results);
    } catch (err) {
      console.error(err);
      res.status(500);
      res.send(err);
    }
  }

  public static async CREATE(req: Request, res: Response): Promise<void> {
    try {
      const user: User = UserFactory.CREATE(req.body);
      const result: InsertOneWriteOpResult = await UserService.INSERT_ONE(user);
      res.send(result.insertedId);
    } catch (err) {
      console.error(err);
      res.status(500);
      res.send(err);
    }
  }

  public static async GET(req: Request, res: Response): Promise<void> {
    const id: string = req.params.id;
    if (!id) {
      res.status(400);
      res.send({ message: 'ID not provided' });
    } else {
      try {
        const objectId: ObjectID = new ObjectID(id);
        const result: any = await UserService.FIND_ONE({ _id: objectId });
        if (!result) {
          res.status(404);
          res.send({ message: `Unable to find user ${id}`});
        } else {
          res.send(result);
        }
      } catch (err) {
        console.error(err);
        res.status(500);
        res.send(err);
      }
    }
  }

  public static async UPDATE(req: Request, res: Response): Promise<void> {
    const id: string = req.params.id;
    if (!id) {
      res.status(400);
      res.send({ message: 'ID not provided' });
    } else {
      try {
        const objectId: ObjectID = new ObjectID(id);
        const { name, email, _} = req.body;
        const result: any = await UserService.FIND_ONE_AND_REPLACE({ name, email, _id: objectId });
        if (!result) {
          res.status(404);
          res.send({ message: `Unable to find user ${id}`});
        } else {
          res.sendStatus(204);
        }
      } catch (err) {
        console.error(err);
        res.status(500);
        res.send(err);
      }
    }
  }

  public static async DELETE(req: Request, res: Response): Promise<void> {
    const id: string = req.params.id;
    if (!id) {
      res.status(400);
      res.send({ message: 'ID not provided' });
    } else {
      try {
        const objectId: ObjectID = new ObjectID(id);
        const { name, email, _} = req.body;
        const result: any = await UserService.FIND_ONE_AND_DELETE({ _id: objectId });
        if (!result) {
          res.status(404);
          res.send({ message: `Unable to find user ${id}`});
        } else {
          res.sendStatus(204);
        }
      } catch (err) {
        console.error(err);
        res.status(500);
        res.send(err);
      }
    }
  }

  public static async UPLOAD_IMAGE(req: Request, res: Response): Promise<void> {
    const id: string = req.params.id;
    if (!id) {
      res.status(400);
      res.send({ message: 'ID not provided' });
    } else if (!req.files) {
      res.status(400);
      res.send({ message: 'No files were uploaded' });
    } else {
      try {
        const objectId: ObjectID = new ObjectID(id);
        const imagePath: any = await UserController.dcm2jpg((<fileUpload.UploadedFile>req.files.image));
        const fileDoc: any = await GridFS.UPLOAD(fs.createReadStream(imagePath.filename), (<any>req.files.image).name);
        const result: any = await UserService.SET_IMAGE(objectId, new ObjectID(fileDoc._id));
        res.send(result);
      } catch (err) {
        console.error(err);
        res.status(500);
        res.send(err);
      }
    }
  }

  public static async DOWNLOAD_IMAGE(req: Request, res: Response): Promise<void> {
    const id: string = req.params.id;
    if (!id) {
      res.status(400);
      res.send({ message: 'ID not provided' });
    } else {
      try {
        const objectId: ObjectID = new ObjectID(id);
        const user: any = await UserService.FIND_ONE({ _id: objectId });
        if (!user) {
          res.status(404);
          res.send({ message: `Unable to find user ${id}`});
        } else if (!user.image) {
          res.status(404);
          res.send({ message: `User ${id} has no image`});
        } else {
          const imageId: ObjectID = new ObjectID(user.image);
          const image: Buffer = await GridFS.DOWNLOAD(imageId);
          res.send(image);
        }
      } catch (err) {
        console.error(err);
        res.status(500);
        res.send(err);
      }
    }
  }

  private static async dcm2jpg(file: fileUpload.UploadedFile): Promise<{}> {
    return new Promise((resolve: any, reject: any): any => {
      file.mv(`/tmp/${file.name}`, (err: any) => {
        if (err) {
          return reject('Error moving image');
        }
        const execPromisified: any = promisify(exec);

        return execPromisified(`./dcm4che/bin/dcm2jpg /tmp/${file.name} /tmp/${file.name}.jpg`)
          .then((stdout: string, stderr: string) => {
            return resolve({filename: `/tmp/${file.name}.jpg`});
          });
      });
    });
  }
}
