import { Db, GridFSBucket, ObjectID } from 'mongodb';
import { DBConnection } from 'service/DBConnection';
import { Readable } from 'stream';

export class GridFS extends DBConnection {
  public static async UPLOAD(stream: Readable, filename: string): Promise<any> {
    return this.DB.then((db: Db) => {
      const bucket: GridFSBucket = new GridFSBucket(db);

      return new Promise(
        (resolve: any, reject: any): any => {
          stream
            .pipe(bucket.openUploadStream(filename))
            .on('finish', resolve)
            .on('error', reject);
        }
      );
    });
  }

  public static async DOWNLOAD(id: ObjectID): Promise<any> {
    return this.DB.then((db: Db) => {
      const chunks: any[] = [];
      const bucket: GridFSBucket = new GridFSBucket(db);

      return new Promise(
        (resolve: any, reject: any): any => {
          bucket
            .openDownloadStream(id)
            .on('data', (chunk: any) => {
              chunks.push(chunk);
            })
            .on('end', resolve)
            .on('error', reject);
        }
      ).then(() => Buffer.concat(chunks));
    });
  }
}
