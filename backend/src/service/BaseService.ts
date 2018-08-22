import {
  Cursor,
  Db,
  FilterQuery,
  FindAndModifyWriteOpResultObject,
  FindOneAndReplaceOption,
  FindOneOptions,
  InsertOneWriteOpResult
} from 'mongodb';

import { DBConnection } from 'service/DBConnection';

export abstract class BaseService extends DBConnection {
  protected static collection: string = '';

  public static async FIND(
    query?: FilterQuery<any>,
    options?: FindOneOptions
  ): Promise<Cursor> {
    return this.DB.then((db: Db) => {
      return db.collection(this.collection).find(query || {}, options);
    });
  }

  public static async FIND_ONE(
    filter: Object,
    options?: FindOneOptions
  ): Promise<any> {
    return this.DB.then((db: Db) => {
      return db.collection(this.collection).findOne(filter, options);
    });
  }

  public static async INSERT_ONE(doc: Object): Promise<InsertOneWriteOpResult> {
    return this.DB.then((db: Db) => {
      return db.collection(this.collection).insertOne(doc);
    });
  }

  public static async FIND_ONE_AND_REPLACE(
    doc: Object | any,
    options?: FindOneAndReplaceOption
  ): Promise<FindAndModifyWriteOpResultObject> {
    return this.DB.then((db: Db) => {
      const { _id, ...data } = doc;

      return db
        .collection(this.collection)
        .findOneAndReplace({ _id }, data, options);
    });
  }

  public static async FIND_ONE_AND_UPDATE(
    doc: Object | any,
    options?: FindOneAndReplaceOption
  ): Promise<FindAndModifyWriteOpResultObject> {
    return this.DB.then((db: Db) => {
      const { _id, ...data } = doc;

      return db
        .collection(this.collection)
        .findOneAndUpdate({ _id }, { $set: data }, options);
    });
  }

  public static async FIND_ONE_AND_DELETE(
    doc: Object | any,
    options?: Object
  ): Promise<FindAndModifyWriteOpResultObject> {
    return this.DB.then((db: Db) => {
      return db
        .collection(this.collection)
        .findOneAndDelete({ _id: doc._id }, options);
    });
  }
}
