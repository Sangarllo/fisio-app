/* eslint-disable @typescript-eslint/naming-convention */
export interface ISession {
  id: string;
  active: boolean;
  userId: string;
  anamnesisId: string;
  date: string;
  painRank?: number;
  symptoms?: string;
  treatment?: string;
  anamnesisTxt?: string;
}

export class Session implements ISession {

  public static PATH_URL = 'sesiones';

  constructor(
    public id: string,
    public active: boolean,
    public userId: string,
    public anamnesisId: string,
    public date: string,
    public painRank?: number,
    public symptoms?: string,
    public treatment?: string,
     ) {
  }

  static InitDefault(userId: string, anamnesisId: string): Session {

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayStr = today.toISOString().substr(0, 10);

    return new Session(
      '0',
      true,
      userId,
      anamnesisId,
      todayStr,
      null,
      '',
      '',
    );
  }
}
