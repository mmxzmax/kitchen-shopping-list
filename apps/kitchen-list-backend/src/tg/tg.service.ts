import { Inject, Injectable } from '@nestjs/common';
import { TG_BOT } from './tg-bot-provider';
import TelegramBot from 'node-telegram-bot-api';
import { UsersService } from '../users/users.service';
import { UserShopListService } from '../user-shop-list/user-shop-list.service';

function extractListName(str: string) {
  const matches = str.match(/"(.*?)"/);
  return matches ? matches[1] : str;
}

@Injectable()
export class TgService {
  constructor(
    @Inject(TG_BOT) private readonly tgBot: TelegramBot,
    private usersService: UsersService,
    private shopList: UserShopListService
  ) {
    tgBot.on('message', (msg) => {
      console.log(msg);
      if (msg.text.includes('/start')) {
        this.linkToUser(msg);
      }
    });
    tgBot.on('callback_query', (msg) => {
      this.compliteGood(msg);
    });
  }

  async compliteGood(msg) {
    const [listId, goodId] = JSON.parse(atob(msg.data));
    await this.shopList.setGoodComplete(+listId, +goodId);
    await this.tgBot.deleteMessage(msg.message.chat.id, msg.message.message_id);
    const buttons: unknown[] = msg.message.reply_markup.inline_keyboard;
    const toDelete = buttons.findIndex((b) => b[0]?.callback_data === msg.data);
    buttons.splice(toDelete, 1);
    await this.sendToContact(
      msg.message.chat.id,
      buttons?.length
        ? msg.message.text
        : `по списку: "${extractListName(
            msg.message.text
          )}" все куплено. Вы Молодец! ;-)`,
      {
        reply_markup: JSON.stringify({
          inline_keyboard: [...buttons],
        }),
      }
    );
  }

  async linkToUser(msg) {
    const uid = msg.text.replace('/start', '').trim();
    const user = await this.usersService.getUserByTgUid(uid);
    const { chat } = msg;
    if (user) {
      await this.usersService.addContact(
        user.id,
        chat.id,
        `${chat?.first_name} ${chat?.last_name} ${
          chat?.username ? '@' + chat.username : ''
        }`
      );
    }
  }

  async createListMessage(userId: number, contactId: number, listId: number) {
    const contact = await this.usersService.getTgChat(contactId);
    const list = await this.shopList.listById(userId, listId);
    const options = {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          ...list.goods
            .filter((g) => !list.completedGoods?.find((c) => c.id === g.id))
            .map((item) => [
              {
                text: item.name,
                callback_data: btoa(JSON.stringify([listId, item.id])),
              },
            ]),
        ],
      }),
    };
    await this.sendToContact(
      contact.chatId,
      `Привет, вот список покупок "${list.name}"`,
      options
    );
  }

  async sendToContact(chatId: number, message: string, opt) {
    return this.tgBot.sendMessage(chatId, message, opt);
  }
}
