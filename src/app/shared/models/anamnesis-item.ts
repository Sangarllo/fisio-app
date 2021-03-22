/* eslint-disable @typescript-eslint/naming-convention */
export interface IAnamnesisItem {
  id: string;
  active: boolean;
  userId: string;
  date: string;
  reason?: string; // motivo de la consulta
  diagnosis?: string; // diagnóstico
  background?: string; // antecedentes
  performance?: string; // actuación del fisioterapeuta
  notes?: string;
  username?: string;
}

export class AnamnesisItem implements IAnamnesisItem {

  public static PATH_URL = 'anamnesis';

  constructor(
    public id: string,
    public active: boolean,
    public userId: string,
    public date: string,
    public reason?: string,
    public diagnosis?: string,
    public background?: string,
    public performance?: string,
    public notes?: string,
    public username?: string,
     ) {
  }

  static InitDefault(userId: string): AnamnesisItem {

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayStr = today.toISOString().substr(0, 10);

    return new AnamnesisItem(
      '0',
      true,
      userId,
      todayStr,
      '',
      '',
      '',
      '',
      '',
      ''
    );
  }
}
