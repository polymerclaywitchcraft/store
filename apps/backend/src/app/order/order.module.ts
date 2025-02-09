import { Module } from "@nestjs/common";
import { BotModule } from "../bot/bot.module";
import { OrderController } from "./order.controller";

@Module({
  controllers: [OrderController],
  imports: [BotModule],
  providers: [],
  exports: [],
})
export class OrderModule {}