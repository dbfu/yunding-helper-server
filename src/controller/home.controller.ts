import { Controller, Get, Inject } from '@midwayjs/core';
import { ChessService } from '../service/chess.service';

@Controller('/')
export class HomeController {
  @Inject()
  chessService: ChessService;

  @Get('/')
  async getTest() {
    return this.chessService.updateData();
  }
}
