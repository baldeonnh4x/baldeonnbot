import db from "#db"

const DEFAULT_WELCOME = `Bienvenido/a @user, a nuestra comunidad gaming! 🎮 Nos alegra muchísimo que te unas a nuestro grupo de jugadores. Aquí podrás compartir tu pasión y conocer gente nueva. 

Para mantener el buen ambiente, te pedimos seguir nuestras reglas:
1. Mantén el respeto mutuo en todo momento. Los insultos y la toxicidad no están permitidos.
2. Está prohibido enviar redes sociales personales al grupo.
3. Prohibido compartir cualquier tipo de contenido explícito o sexual.
4. El contenido enviado debe ser exclusivamente sobre videojuegos y temas relacionados.

¡Que te diviertas mucho!`;

export default {
  command: ['setwelcome'],
  category: 'grupo',
  isAdmin: true,
  run: async ({ msg, sock, args, command, text, usedPrefix: prefix }) => {
    const chatId = msg.chat;
    const chat = await db.getChat(msg.chat)

    if (!args.length) {
      return msg.reply(`ꕤ ꨩᰰ𑪐𑂺 ˳ ׄ Set Welcome ࣭𑁯ᰍ   ̊ ܃܃

*❒ Variables disponibles:*
𖣣ֶㅤ֯⌗ ✤ ⬭ @user    
> → Mención del nuevo integrante

𖣣ֶㅤ֯⌗ ✤ ⬭ @group   
> → Nombre del grupo

𖣣ֶㅤ֯⌗ ✤ ⬭ @desc    
> → Descripción del grupo

𖣣ֶㅤ֯⌗ ✤ ⬭ @members 
> → Número de miembros actuales

𖣣ֶㅤ֯⌗ ✤ ⬭ @time    
> → Fecha y hora

✿ Si deseas restablecerlo al mensaje gaming por defecto:
${prefix + command} 0

*Mensaje actual:*
${chat.welcomeMessage || DEFAULT_WELCOME}`);
    }

    if (args[0] === '0') {
      chat.welcomeMessage = DEFAULT_WELCOME;
      await db.updateChat(msg.chat, 'welcomeMessage', chat.welcomeMessage);
      return msg.reply('✐ Mensaje de bienvenida restablecido al valor por defecto (Comunidad Gaming).');
    }

    const texto = args.join(' ');
    chat.welcomeMessage = texto;

    await db.updateChat(msg.chat, 'welcomeMessage', chat.welcomeMessage);
    msg.reply(`✐ Nuevo mensaje de bienvenida configurado correctamente.`);
  }
};