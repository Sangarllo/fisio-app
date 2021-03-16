export interface ISession {
  id: string;
  active: boolean;
  userId: string;
  date: string;
  symptoms: string;
}

export class Session implements ISession {

  public static PATH_URL = 'consultas';

  constructor(
    public id: string,
    public active: boolean,
    public userId: string,
    public date: string,
    public symptoms: string,
     ) {
  }


  static InitDefault(userId: string): Session {

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayStr = today.toISOString().substr(0, 10);

    return new Session(
      '0',
      true,
      userId,
      todayStr,
      '',
    );
  }
}
