import { prop } from '@typegoose/typegoose';

export class Chess {
  @prop()
  public code: string;
  @prop()
  public name: string;
  @prop()
  public count: number;
  @prop()
  public rate: number;
  @prop()
  public won: number;
  @prop()
  public top4: number;
  @prop()
  public augments: string;
  @prop()
  public items: string;
  @prop()
  public units: string;
  @prop()
  public traits: string;
  @prop()
  public icon: string;
}
