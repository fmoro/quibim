import {
  Db,
  FindAndModifyWriteOpResultObject,
  ObjectID
} from 'mongodb';
import { BaseService } from 'service/BaseService';

export class UserService extends BaseService {
  protected static collection: string = 'users';

  public static async SET_IMAGE(
    id: ObjectID,
    imageId: ObjectID
  ): Promise<FindAndModifyWriteOpResultObject> {
    return this.DB.then((db: Db) => {
      return db
        .collection(this.collection)
        .findOneAndReplace({ _id: id }, { $set: { image: imageId }});
    });
  }
}
