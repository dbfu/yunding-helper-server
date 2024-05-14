import { Provide } from '@midwayjs/core';

import chess from '../data/chess.json';
import { Chess } from '../entity/chess';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ReturnModelType } from '@typegoose/typegoose';

import zh from '../data/zh.json';

@Provide()
export class ChessService {
  @InjectEntityModel(Chess)
  chessModel: ReturnModelType<typeof Chess>;

  async getChess() {
    return chess;
  }

  async getChessByName(name: string) {
    return this.getChessInfo(name);
  }

  async updateData() {
    return this.getChessInfo(chess[0]);
  }

  async getChessInfo(name: string) {
    const code = chess[name];

    if (!code) return { name: 'error' };
    let chessInfo: Chess = await this.chessModel.findOne({ code });

    console.log(chessInfo);

    if (chessInfo) {
      return chessInfo;
    }

    let data = (await fetch(
      `https://d2.tft.tools/stats2/unit/1100/${code}/14091/1`
    ).then(res => res.text())) as any;

    data = JSON.parse(data);

    console.log(data);

    chessInfo = {
      icon: `https://ap.tft.tools/img/face/${data.unitId}.jpg`,
    } as Chess;

    chessInfo.count = data.base.count;
    chessInfo.rate = data.base.rate;
    chessInfo.won = data.base.won;
    chessInfo.top4 = data.base.top4;
    chessInfo.name = zh.s11Unitsi18n[data.unitId];

    const augmentsMap = data.augments.reduce((map, item) => {
      map[item.id] = item;
      return map;
    }, {});

    const countList = data.augments
      .toSorted((x, y) => y.count - x.count)
      .slice(0, 10);

    const placeList = countList
      .toSorted((x, y) => x.count - y.count)
      .slice(0, 10)
      .map(item => item.id);
    const wonList = countList
      .toSorted((x, y) => y.won - x.won)
      .slice(0, 10)
      .map(item => item.id);
    const top4List = countList
      .toSorted((x, y) => y.top4 - x.top4)
      .slice(0, 10)
      .map(item => item.id);

    const commonList = wonList
      .filter(item => top4List.includes(item))
      .filter(item => placeList.includes(item))
      .slice(0, 5);

    console.log(commonList, 'commonList');

    chessInfo.augments = commonList
      .map(id => {
        console.log(id);

        const item = augmentsMap[id];

        return `${zh.s11Augmentsi18n[item.id]}`;
      })
      .join(' ');

    chessInfo.items = data.items
      .filter(o => o.count > 100000)
      .toSorted((x, y) => x.place - y.place)
      .slice(0, 5)
      .map(item => {
        return `${zh.s11Itemsi18n[item.items]}`;
      })
      .join(' ');

    chessInfo.units = data.units
      .filter(o => o.count > 100000)
      .toSorted((x, y) => x.place - y.place)
      .slice(0, 8)
      .map(item => `${zh.s11Unitsi18n[item.id]}`)
      .join(' ');

    chessInfo.traits = data.traits
      .filter(o => o.count > 10000 && o.id[1] > 1)
      .toSorted((x, y) => y.top4 - x.top4)
      .slice(0, 6)
      .map(item => {
        return `${item.id[1]}${zh.s11Traitsi18n[item.id[0]]}`;
      })
      .join(' ');

    chessInfo.code = code;

    const { id } = await this.chessModel.create(chessInfo); // an "

    console.log(id, 'id');

    return await this.chessModel.findOne({ id }).exec();
  }
}
