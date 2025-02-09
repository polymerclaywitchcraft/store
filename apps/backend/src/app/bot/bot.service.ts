import { Injectable } from "@nestjs/common";
import { config } from "../../config";
import { Bot } from "grammy";

@Injectable()
export class BotService {
  private readonly bot: Bot;
  constructor() {
    this.bot = new Bot(config.telegram.token);
  }

  async sendMessage(message: string) {
    await this.bot.api.sendMessage(config.telegram.channelId, message);
  }
}