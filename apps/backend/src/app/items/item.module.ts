import { Module } from "@nestjs/common";
import { ItemController } from "./item.controller";

@Module({
  imports: [],
  controllers: [ItemController],
  providers: [],
})
export class ItemModule {}
