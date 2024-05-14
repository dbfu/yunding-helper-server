import { MidwayConfig } from '@midwayjs/core';
import { User } from '../entity/user';
import { Chess } from '../entity/chess';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1715658408616_3811',
  koa: {
    port: 7001,
  },
  mongoose: {
    dataSource: {
      default: {
        uri: 'mongodb://110.42.213.160:27017/chess',
        options: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          user: '',
          pass: '',
        },
        // 关联实体
        entities: [User, Chess],
      },
    },
  },
} as MidwayConfig;
