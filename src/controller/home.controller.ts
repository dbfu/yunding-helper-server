import { Controller, Get, Inject, Query } from '@midwayjs/core';
import { ChessService } from '../service/chess.service';

@Controller('/')
export class HomeController {
  @Inject()
  chessService: ChessService;

  @Get('/')
  async getTest(@Query('name') name: string) {
    console.log(name, 'name');
    return this.chessService.getChessByName(name);
  }
}
