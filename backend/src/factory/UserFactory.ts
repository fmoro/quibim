import * as crypto from 'crypto';

export type User = {
  name: string;
  email: string;
  password?: string;
  image?: any;
};

export class UserFactory {
  public static CREATE(doc: any): User {
    const user: User = {
      name: doc.name,
      email: doc.email
    };

    if (doc.password) {
      const secret: string = new Date().getTime().toString();
      user.password = `${secret}|${this.hashPassword(secret, doc.password)}`;
    }

    return user;
  }

  private static hashPassword(secret: string, password: string): string {
    return crypto
      .createHmac('sha512', secret)
      .update(password)
      .digest('hex');
  }
}
