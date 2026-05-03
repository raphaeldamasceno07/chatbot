import { WhatsAppEvents } from '@/http/webhooks/whatsapp-events.js' // Certifique-se de que o caminho está correto
import makeWASocket, {
  DisconnectReason,
  fetchLatestWaWebVersion,
  useMultiFileAuthState,
  type WASocket,
} from '@whiskeysockets/baileys'
import { readdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import QRCode from 'qrcode'

export class BaileysProvider {
  private static socket: WASocket | null = null
  private static readonly AUTH_PATH = 'auth_info_baileys'

  /**
   * Padrão Singleton: Garante que exista apenas uma conexão ativa.
   */
  static async getSocket(): Promise<WASocket> {
    if (!this.socket) {
      await this.initialize()
    }
    return this.socket!
  }

  /**
   * Inicializa a conexão e configura os ouvintes de eventos.
   */
  private static async initialize() {
    const { version } = await fetchLatestWaWebVersion()

    // Carrega o estado da autenticação da pasta definida no Docker Compose
    const { state, saveCreds } = await useMultiFileAuthState(this.AUTH_PATH)

    this.socket = makeWASocket({
      auth: state,
      version,
      printQRInTerminal: false, // Desativamos o padrão para usar o QRCode colorido com qrcode-terminal se preferir, ou apenas logar
    })

    // SALVAMENTO DE CREDENCIAIS: Essencial para não perder a conexão ao reiniciar o container
    this.socket.ev.on('creds.update', saveCreds)

    // CONFIGURAÇÃO DOS EVENTOS: Vincula o listener de mensagens assim que o socket é criado
    WhatsAppEvents.setup(this.socket)

    // MONITORAMENTO DA CONEXÃO
    this.socket.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update

      // Exibe o QR Code no terminal quando necessário
      if (qr) {
        console.log('⚡ Novo QR Code gerado. Escaneie para conectar:')
        const terminalQR = await QRCode.toString(qr, {
          type: 'terminal',
          small: true,
        })
        console.log(terminalQR)
      }

      if (connection === 'close') {
        const statusCode = (lastDisconnect?.error as any)?.output?.statusCode

        /**
         * LÓGICA DE DESCONEXÃO PELO CELULAR:
         * O código DisconnectReason.loggedOut (401) indica que o usuário foi no WhatsApp
         * do celular e clicou em "Sair de todos os dispositivos".
         */
        const shouldLogout = statusCode === DisconnectReason.loggedOut

        if (shouldLogout) {
          console.log(
            '📢 Sessão encerrada pelo celular. Iniciando limpeza completa...',
          )
          await this.logout() // Limpa arquivos e reseta o socket
        } else {
          /**
           * RECONEXÃO AUTOMÁTICA:
           * Se a conexão caiu por internet ou erro de servidor, tentamos reconectar
           * sem apagar os arquivos, pois a sessão ainda é válida.
           */
          console.log('🔄 Conexão perdida. Tentando reconectar...')
          this.socket = null
          await this.getSocket()
        }
      } else if (connection === 'open') {
        console.log('✅ WhatsApp conectado e pronto para receber mensagens!')
      }
    })
  }

  /**
   * DESCONEXÃO ATIVA:
   * Esta função pode ser chamada por uma rota de API ou internamente.
   * Ela limpa a pasta de autenticação, resolvendo o erro de permissão que você teve.
   */
  static async logout() {
    try {
      console.log('🧹 Iniciando processo de logout e limpeza de arquivos...')

      if (this.socket) {
        // 1. Encerra a conexão formalmente
        this.socket.end(undefined)
        this.socket = null
      }

      // 2. Aguarda um curto período (500ms a 1s)
      // Isso dá tempo para o Sistema Operacional liberar os arquivos que a Baileys estava usando
      await new Promise((resolve) => setTimeout(resolve, 3000))
    } catch (err) {
      console.error('Erro durante o encerramento do socket:', err)
    } finally {
      try {
        console.log('🗑️ Esvaziando arquivos de autenticação...')

        // Em vez de deletar a PASTA, deletamos tudo o que está DENTRO dela
        const files = readdirSync(this.AUTH_PATH)

        for (const file of files) {
          const filePath = join(this.AUTH_PATH, file)
          try {
            rmSync(filePath, { recursive: true, force: true })
          } catch (fileErr) {
            console.error(
              `Não foi possível remover o arquivo específico: ${filePath}`,
              fileErr,
            )
          }
        }

        console.log(
          '✅ Conteúdo da sessão removido. A pasta raiz foi mantida para evitar conflito com o Docker.',
        )
        await this.getSocket()
      } catch (rmErr) {
        console.error('⚠️ Falha crítica ao acessar a pasta de auth:', rmErr)
      }

      this.socket = null
    }
  }
}
