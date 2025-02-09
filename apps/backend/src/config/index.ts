import 'dotenv/config';
import { IConfig } from './model';

const config: IConfig = {
  telegram: {
    token: process.env.TELEGRAM_TOKEN || '',
    channelId: process.env.TELEGRAM_CHANNEL_ID || '',
  },
};

export { config };
