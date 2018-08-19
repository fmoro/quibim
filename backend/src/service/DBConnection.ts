import {
  Db,
  MongoClient
} from 'mongodb';

export abstract class DBConnection {
  protected static client: Promise<MongoClient>;
  protected static dbName: string;

  public static async CONNECT(url: string, dbName: string): Promise<MongoClient> {
    this.dbName = dbName;
    this.client = MongoClient.connect(url, { useNewUrlParser: true });

    return this.client;
  }

  public static async DISCONNECT(): Promise<void> {
    return this.client.then((client: MongoClient) => client.close());
  }

  protected static get DB(): Promise<Db> {
    return this.client.then((client: MongoClient) => client.db(this.dbName));
  }
}
