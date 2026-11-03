import ytsearch from 'yt-search'
import { Ytdl } from '@distube/ytdl-core'
import { getBuffer } from '#serialize'

const ytdl = new Ytdl()

async function downloadAudioStream(url) {
  const stream = ytdl.download(url, {
    filter: { hasAudio: true, hasVideo: false },
    quality: 'highestaudio'
  })
  const chunks = []
  for await (const chunk of stream) {
    chunks.push(chunk)
  }
  return Buffer.concat(chunks)
}

export default {
  command: ['play', 'ytmp3', 'ytaudio', 'playaudio'],
  category: 'downloader',
  description: 'Descarga audio de YouTube buscando por título o URL.',
  run: async ({ msg, sock, args }) => {
    try {
      if (!args[0]) {
        return msg.reply('🎵 Por favor, ingresa el nombre o enlace del video que deseas descargar.\n\n*Ejemplo:* .play Mía Completa')
      }

      const text = args.join(' ')
      const searchResult = await ytsearch(text)
      const video = searchResult.videos?.[0] || searchResult.all?.[0]

      if (!video) {
        return msg.reply('❌ No se encontró ningún resultado para tu búsqueda.')
      }

      const { title, author, timestamp: duration, views, url, image } = video
      const vistas = (views || 0).toLocaleString()
      const canal = author?.name || author || 'Desconocido'

      let thumbBuffer = null
      try {
        if (image) thumbBuffer = await getBuffer(image)
      } catch (e) { }

      const caption = `🎵 *YOUTUBE PLAY* 🎵\n\n` +
        `🎶 *Título:* ${title}\n` +
        `👤 *Canal:* ${canal}\n` +
        `⏱️ *Duración:* ${duration || 'N/A'}\n` +
        `👁️ *Vistas:* ${vistas}\n\n` +
        `⏳ _Descargando audio, por favor espera..._`

      if (thumbBuffer) {
        await sock.sendMessage(msg.chat, { image: thumbBuffer, caption }, { quoted: msg })
      } else {
        await msg.reply(caption)
      }

      const audioBuffer = await downloadAudioStream(url)

      if (!audioBuffer || audioBuffer.length === 0) {
        return msg.reply('❌ No se pudo procesar el audio del video.')
      }

      const cleanTitle = (title || 'audio').replace(/[\\/:*?"<>|]/g, '')
      const mensaje = {
        audio: audioBuffer,
        mimetype: 'audio/mpeg',
        fileName: `${cleanTitle}.mp3`,
        ptt: false
      }

      await sock.sendMessage(msg.chat, mensaje, { quoted: msg })
    } catch (e) {
      await msg.reply(`❌ Ocurrió un error al procesar el comando: ${e.message}`)
    }
  }
}