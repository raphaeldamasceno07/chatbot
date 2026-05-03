import { BaileysProvider } from './BaileysProvider.js'

export class BaileysMessageProvider {
  async sendMessage(to: string, body: string) {
    const sock = await BaileysProvider.getSocket()
    await sock.sendMessage(to, { text: body })
  }
}
