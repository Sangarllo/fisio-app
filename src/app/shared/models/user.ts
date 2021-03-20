export interface IUser {
  uid: string;
  active: boolean;
  name: string;
  surname: string;
  email: string;
  telephone: string;
  address: string;
  locality: string;
  birthdate: string;
  occupation?: string;
  notes?: string;
}

export class User implements IUser {

  public static PATH_URL = 'usuarios';

  constructor(
    public uid: string,
    public active: boolean,
    public name: string,
    public surname: string,
    public email: string,
    public telephone: string,
    public address: string,
    public locality: string,
    public birthdate: string,
    public occupation?: string,
    public notes?: string
     ) {
  }


  static InitDefault(): User {

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayStr = today.toISOString().substr(0, 10);

    return new User(
      '0',
      true,
      '',
      '',
      '',
      '',
      '',
      '',
      todayStr,
      '',
      '',
    );
  }
}
