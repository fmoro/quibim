import {
  Db,
  FindAndModifyWriteOpResultObject,
  FindOneAndReplaceOption,
  ObjectID
} from 'mongodb';
import { BaseService } from 'service/BaseService';

export class UserService extends BaseService {
  protected static collection: string = 'users';

  public static async SET_IMAGE(
    id: ObjectID,
    imageId: ObjectID,
    options?: FindOneAndReplaceOption
  ): Promise<FindAndModifyWriteOpResultObject> {
    return super.FIND_ONE_AND_UPDATE({ _id: id, image: imageId }, options);
  }
}
