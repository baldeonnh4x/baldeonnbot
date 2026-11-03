import fs from 'fs'
import path from 'path'

export default {
  command: ['musica', 'audio'],
  category: 'downloader',
  description: 'Reproduce un archivo de audio local.',
  run: async ({ msg, sock, args }) => {
    try {
      const requestedFile = args[0] ? args.join(' ') : 'cancion1.mp3'
      const fileName = requestedFile.endsWith('.mp3') ? requestedFile : `${requestedFile}.mp3`
      const filePath = path.resolve(process.cwd(), 'media', fileName)

      if (!fs.existsSync(filePath)) {
        return msg.reply(`❌ El archivo de audio *${fileName}* no existe en la carpeta \`./media/\`.\n\n👉 Por favor, guarda el archivo en la ruta:\n\`./media/${fileName}\``)
      }

      const audioBuffer = fs.readFileSync(filePath)

      await sock.sendMessage(
        msg.chat,
        {
          audio: audioBuffer,
          mimetype: 'audio/mpeg',
          fileName: fileName,
          ptt: false
        },
        { quoted: msg }
      )
    } catch (e) {
      await msg.reply(`❌ Error al enviar el audio local: ${e.message}`)
    }
  }
}