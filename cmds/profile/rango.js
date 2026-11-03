import db from "#db"

export default {
    command: ['rango', 'rank', 'nivel'],
    category: 'profile',
    description: 'Muestra tu rango actual en el servidor.',
    run: async ({ msg, sock }) => {
        const user = await db.getUser(msg.sender)

        const exp = user.exp || 0
        let rango = '🥉 Bronce'

        if (exp > 1000) rango = '🥈 Plata'
        if (exp > 5000) rango = '🥇 Oro'
        if (exp > 15000) rango = '💎 Platino'
        if (exp > 30000) rango = '👑 Diamante'

        await sock.sendMessage(msg.chat, {
            text: `👤 *Jugador:* @${msg.sender.split('@')[0]}\n🏆 *Rango:* ${rango}\n✨ *Experiencia:* ${exp} XP`,
            mentions: [msg.sender]
        }, { quoted: msg })
    }
}