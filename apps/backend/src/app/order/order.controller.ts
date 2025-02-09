import { Body, Controller, Post } from "@nestjs/common";
import { BotService } from "../bot/bot.service";

@Controller("order")
export class OrderController {
  constructor(
    private readonly botService: BotService,
  ) {}

  @Post()
  async createOrder(@Body() body: any) {
    const data = JSON.stringify(body, null, 2);
    await this.botService.sendMessage(data);
    return { success: true };
  }
}