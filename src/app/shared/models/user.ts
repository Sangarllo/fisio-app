export interface IUser {
  uid: string;
  email: string;
  active: boolean;
  displayName: string;
}

export class User implements IUser {

  public static PATH_URL = 'usuarios';

  constructor(
    public uid: string,
    public active: boolean,
    public email: string,
    public displayName: string,
     ) {
  }

  static InitDefault(): User {
    return new User(
      '0',
      true,
      '',
      ''
    );
  }
}
