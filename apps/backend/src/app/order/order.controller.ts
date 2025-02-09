import { Body, Controller, Post } from "@nestjs/common";
import { BotService } from "../bot/bot.service";
import * as _ from 'lodash';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface FormData {
  email: string;
  instagram: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

interface Order {
  cart: CartItem[];
  formData: FormData;
}


@Controller("order")
export class OrderController {
  constructor(
    private readonly botService: BotService,
  ) {}

  @Post()
  async createOrder(@Body() body: Order) {
    let textMessage = '';
    try {
      const items = body.cart.map(item => {
        return `${item.quantity}x ${item.name} - ${item.price}€`;
      });
      textMessage = `New order from ${body.formData.firstName} ${body.formData.lastName} (${body.formData.email} / ${body.formData.instagram})\n\n ${items.join('\n')}`;
    } catch (e) {
      console.error(e);
    }
    const rawData = JSON.stringify(body, null, 2);
    const tgMessage = await this.botService.sendMessage(textMessage);
    // message += `<code>${rawData}</code>`;
    await this.botService.sendMessage(rawData, tgMessage.message_id);
    return { success: true };
  }
}