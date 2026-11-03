import { normalizeJid, resolveParticipantJid, resolveJidSync, deleteCachedMeta, getCachedMeta, setCachedMeta } from '#serialize';
import db from "#db"
import chalk from 'chalk';
import moment from 'moment-timezone';
import { prepareWAMessageMedia } from 'baileys';
import fs from 'fs';

function getGroupAdmins(participants) {
  return (participants ?? []).filter(p => p.admin === 'admin' || p.admin === 'superadmin').map(p => p.id).filter(Boolean);
}

function resolveEventParticipant(p, sock) {
  if (typeof p === 'string') return resolveJidSync(p, sock) || p;
  return resolveParticipantJid(p, sock) || normalizeJid(p.id || p.phoneNumber || p.jid || p.lid || '') || '';
}

export default async (sock, msg) => {
  sock.ev.on('group-participants.update', async (anu) => {
    try {
      if (['add', 'remove', 'leave', 'promote', 'demote'].includes(anu.action)) {
        deleteCachedMeta(anu.id);
      }

      const metadata = await (async () => {
        const cached = getCachedMeta(anu.id);
        if (cached) return cached;
        for (let i = 0; i < 3; i++) {
          const m = await sock.groupMetadata(anu.id).catch(() => null);
          if (m) { setCachedMeta(anu.id, m); return m; }
          await new Promise(r => setTimeout(r, 1500));
        }
        return null;
      })();

      const groupAdmins = metadata ? getGroupAdmins(metadata.participants) : [];
      const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';

      const chat = await db.getChat(anu.id);
      const botSettings = await db.getSettings(botId);

      const primaryBotId = chat?.primaryBot;
      const isSelf = (botSettings?.self ?? 0) || (chat?.isMute ?? false);

      if (isSelf) return;

      const now = new Date();
      const colombianTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Bogota' }));
      const tiempo = colombianTime.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/,/g, '');
      const tiempo2 = moment.tz('America/Bogota').format('hh:mm A');
      const memberCount = metadata?.participants?.length || 0;

      for (const p of anu.participants) {
        const jid = resolveEventParticipant(p, sock);
        if (!jid) continue;

        const phone = jid.split('@')[0];
        const avatar = await sock.profilePictureUrl(jid, 'image').catch(() => null);

        const contextBase = {
          mentionedJid: [jid].filter(Boolean),
          isForwarded: false
        };

        // --- BIENVENIDA + AUDIO + RANGO ---
        if (anu.action === 'add' && chat?.welcome && (!primaryBotId || primaryBotId === botId)) {
          if (!metadata) continue;

          const defaultWelcome = `¡Bienvenido/a @user a nuestra comunidad gaming! 🎮 

Nos alegra muchísimo que te unas a nuestro grupo. Aquí podrás compartir tu pasión y conocer gente nueva. 

Para mantener el buen ambiente, te pedimos seguir nuestras reglas:
1. Mantén el respeto mutuo en todo momento. Los insultos y la toxicidad no están permitidos.
2. Está prohibido enviar redes sociales personales al grupo.
3. Prohibido compartir cualquier tipo de contenido explícito o sexual.
4. El contenido enviado debe ser exclusivamente sobre videojuegos y temas relacionados.

¡Que te diviertas mucho!`;

          const rawWelcome = (chat.welcomeMessage && chat.welcomeMessage.trim() !== '') ? chat.welcomeMessage : defaultWelcome;

          const caption = rawWelcome
            .replace(/@user/g, `@${phone}`)
            .replace(/@group/g, metadata.subject || '')
            .replace(/@desc/g, metadata.desc || 'Sin descripción')
            .replace(/@members/g, memberCount)
            .replace(/@time/g, `${tiempo} ${tiempo2}`);

          // 1. Enviar Mensaje de Bienvenida (Reglas)
          await sock.sendMessage(anu.id, {
            text: caption.trim(),
            contextInfo: contextBase
          }, { quoted: null });

          // 2. Enviar Audio Automático
          const audioPath = './media/bienvenida.mp3';
          if (fs.existsSync(audioPath)) {
            const audioBuffer = fs.readFileSync(audioPath);
            await sock.sendMessage(anu.id, {
              audio: audioBuffer,
              mimetype: 'audio/mp4',
              ptt: false
            });
          }

          // 3. Enviar Mensaje de Rango
          const userData = await db.getUser(jid);
          let rangoUser = '🥉 Bronce';
          if (userData.exp > 1000) rangoUser = '🥈 Plata';
          if (userData.exp > 5000) rangoUser = '🥇 Oro';
          if (userData.exp > 15000) rangoUser = '💎 Platino';
          if (userData.exp > 30000) rangoUser = '👑 Diamante';

          const mensajeRango = `⚔️ *SISTEMA DE RANGOS* ⚔️\n\nEl jugador @${phone} acaba de unirse con el rango:\n\n👉 *${rangoUser}*\n\n_Usa el comando .rango para ver tu progreso y empieza a subir de nivel._`;

          await sock.sendMessage(anu.id, {
            text: mensajeRango,
            mentions: [jid]
          });
        }

        // --- DESPEDIDA ---
        if ((anu.action === 'remove' || anu.action === 'leave') && chat?.goodbye && (!primaryBotId || primaryBotId === botId)) {
          if (!metadata) continue;

          const caption = `👋 *@${phone}* ha salido del grupo.\nAhora somos *${memberCount}* miembros.`;

          await sock.sendMessage(anu.id, {
            text: caption.trim(),
            contextInfo: contextBase
          }, { quoted: null });
        }

        // --- ALERTAS DE ADMIN ---
        if (anu.action === 'promote' && chat?.alerts && (!primaryBotId || primaryBotId === botId)) {
          const authorJid = normalizeJid(anu.author) || anu.author;
          await sock.sendMessage(anu.id, {
            text: `⭐ *@${phone}* ha sido promovido a Administrador por *@${authorJid.split('@')[0]}*.`,
            mentions: [jid, authorJid, ...groupAdmins]
          });
        }

        if (anu.action === 'demote' && chat?.alerts && (!primaryBotId || primaryBotId === botId)) {
          const authorJid = normalizeJid(anu.author) || anu.author;
          await sock.sendMessage(anu.id, {
            text: `⚠️ *@${phone}* ha sido degradado de Administrador por *@${authorJid.split('@')[0]}*.`,
            mentions: [jid, authorJid, ...groupAdmins]
          });
        }
      }
    } catch (err) {
      console.log(chalk.gray(`[ EVENT ERROR ] -> ${err}`));
    }
  });
};