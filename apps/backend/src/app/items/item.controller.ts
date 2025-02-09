import { Controller, Get } from "@nestjs/common";

@Controller("items")
export class ItemController {

  @Get()
  async getItems() {
    return [
      { id: 1, name: "Item 1" },
      { id: 2, name: "Item 2" },
      { id: 3, name: "Item 3" },
    ];
  }
}