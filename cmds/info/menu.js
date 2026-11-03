import db from "#db"
import { getDevice } from 'baileys';
import moment from 'moment-timezone';
import { commands } from '../../lib/system/comandos.js';

export default {
  command: ['allmenu', 'help', 'menu'],
  category: 'info',
  run: async ({ msg, sock, args, usedPrefix: prefix }) => {
    try {
      const now = new Date();
      const tiempo = now.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/,/g, '');
      const tiempo2 = moment.tz('America/Bogota').format('hh:mm A');

      const botId = sock?.user?.id.split(':')[0] + '@s.whatsapp.net' || '';
      const botSettings = await db.getSettings(botId);

      const time = sock.uptime ? formatearMs(Date.now() - sock.uptime) : 'Desconocido';
      const device = getDevice(msg.key.id);

      let menu = `👾 *BALDEONNH4X BOT* 👾\n`;
      menu += `_Tu comunidad gamer definitiva_\n\n`;
      menu += `👤 *Usuario:* ${msg.pushName}\n`;
      menu += `👑 *Creador:* Baldeonnh4x\n`;
      menu += `⚙️ *Tipo:* Sub Bot\n`;
      menu += `📱 *Dispositivo:* ${device}\n`;
      menu += `⏱️ *Activo:* ${time}\n`;
      menu += `📅 *Fecha:* ${tiempo} | ${tiempo2}\n`;
      menu += `\n━━━━━━━━━━━━━━━━━━━━\n\n`;

      // SECCIÓN MANUAL DE STICKERS
      menu += `┌───「 *Stickers* 」───\n`;
      menu += `│ ▸ ${prefix}sticker\n`;
      menu += `│   _Responde a una imagen para hacer sticker._\n`;
      menu += `└──────────────────\n\n`;

      const categoryArg = args[0]?.toLowerCase();
      const categories = {};

      for (const command of commands) {
        const catLower = command.category ? command.category.toLowerCase() : 'otros';
        // IGNORAMOS STICKERS EN EL BUCLE AUTOMÁTICO PARA QUE NO SE DUPLIQUE
        if (['anime', 'nsfw', 'gacha', 'sticker'].includes(catLower)) continue;

        const category = command.category || 'otros';
        if (!categories[category]) categories[category] = [];
        categories[category].push(command);
      }

      if (categoryArg && !categories[categoryArg]) {
        return msg.reply(`❌ La categoría *${categoryArg}* no existe.`)
      }

      for (const [category, cmds] of Object.entries(categories)) {
        if (categoryArg && category.toLowerCase() !== categoryArg) continue;
        const catName = category.charAt(0).toUpperCase() + category.slice(1);

        menu += `┌───「 *${catName}* 」───\n`;
        cmds.forEach((cmd) => {
          const cleanPrefix = prefix.endsWith('.') ? '.' : prefix;
          const aliases = cmd.alias.map(a => `${cleanPrefix}${a.split(/[\/#!+.\-]+/).pop().toLowerCase()}`).join(' | ');

          menu += `│ ▸ ${aliases} ${cmd.uso ? `+ ${cmd.uso}` : ''}\n`;
          menu += `│   _${cmd.desc}_\n`;
        })
        menu += `└──────────────────\n\n`;
      }

      menu += `> *Desarrollado por Baldeonnh4x* 🚀`;

      await sock.sendMessage(msg.chat, { text: menu.trim() }, { quoted: msg });
    } catch (e) {
      console.log("ERROR EN MENU:", e);
      await msg.reply("❌ Ocurrió un error al cargar el menú.");
    }
  },
};

function formatearMs(ms) {
  const segundos = Math.floor(ms / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  return [dias && `${dias}d`, `${horas % 24}h`, `${minutos % 60}m`, `${segundos % 60}s`]
    .filter(Boolean)
    .join(' ');
}