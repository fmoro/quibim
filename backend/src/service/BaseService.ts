import {
  Cursor,
  Db,
  FilterQuery,
  FindAndModifyWriteOpResultObject,
  InsertOneWriteOpResult
} from 'mongodb';

import { DBConnection } from 'service/DBConnection';

export abstract class BaseService extends DBConnection {
  protected static collection: string = '';

  public static async FIND(query?: FilterQuery<any>): Promise<Cursor> {
    return this.DB.then((db: Db) => {
      return db.collection(this.collection).find(query);
    });
  }

  public static async FIND_ONE(filter: Object): Promise<any> {
    return this.DB.then((db: Db) => {
      return db.collection(this.collection).findOne(filter);
    });
  }

  public static async INSERT_ONE(doc: Object): Promise<InsertOneWriteOpResult> {
    return this.DB.then((db: Db) => {
      return db.collection(this.collection).insertOne(doc);
    });
  }

  public static async FIND_ONE_AND_REPLACE(
    doc: Object | any
  ): Promise<FindAndModifyWriteOpResultObject> {
    return this.DB.then((db: Db) => {
      const { _id, ...data } = doc;

      return db
        .collection(this.collection)
        .findOneAndReplace({ _id }, data);
    });
  }

  public static async FIND_ONE_AND_UPDATE(
    doc: Object | any
  ): Promise<FindAndModifyWriteOpResultObject> {
    return this.DB.then((db: Db) => {
      const { _id, ...data } = doc;

      return db
        .collection(this.collection)
        .findOneAndReplace({ _id }, { $set: data });
    });
  }

  public static async FIND_ONE_AND_DELETE(
    doc: Object | any
  ): Promise<FindAndModifyWriteOpResultObject> {
    return this.DB.then((db: Db) => {
      return db
        .collection(this.collection)
        .findOneAndDelete({ _id: doc._id });
    });
  }
}
