import { Inject } from '@midwayjs/core';
import { Job, IJob } from '@midwayjs/cron';
import { ChessService } from '../service/chess.service';

@Job({
  cronTime: '0 0 0 * * *',
  start: true,
})
export class DataSyncCheckerJob implements IJob {
  @Inject()
  chessService: ChessService;

  async onTick() {
    console.log('hello');

    console.log(await this.chessService.updateData());
  }
}
