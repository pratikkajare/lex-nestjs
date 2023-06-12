import { Body, Controller, Get, Post } from '@nestjs/common';
import { LexService } from './app.service';

@Controller('message')
export class AppController {
  constructor(private readonly lexService: LexService) {}

  @Post('bot')
  async sendMessage(
    @Body('sessionId') sessionId: string,
    @Body('text') text: string,
  ) {
    console.log(sessionId, 'aalo');
    console.log(text, 'text');
    try {
      const response = await this.lexService.postText(sessionId, text);

      return response;
    } catch (error) {
      console.error('Error sending message to Lex:', error);
      throw error;
    }
  }

  @Post('convertExcelToJson')
  async convertExcelToJson() {
    this.lexService.convertExcelToJson();
  }
}
