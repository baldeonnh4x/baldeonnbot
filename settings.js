import fs from 'fs';
import { watchFile, unwatchFile } from 'fs'
import { fileURLToPath } from 'url'

// 👑 Tu configuración
global.owner = ['593963133528']
global.botname = 'Baldeonnh4x'
global.namebot = 'Baldeonnh4x'
global.namebot2 = 'Baldeonnh4x'

// 🔗 APIs (Las dejamos por si algún comando las usa)
global.api = {
  url: 'https://api.stellarwa.xyz',
  key: 'proyectsV2',
  url2: 'https://api.evogb.org',
  key2: 'putostodos'
}

// 💬 Mensajes del sistema (Limpios y profesionales)
global.msgglobal = '❌ Ocurrió un error interno. Contacta al creador (Baldeonnh4x).'
global.dev = `👑 Desarrollado por Baldeonnh4x`

global.mess = {
  socket: '⚠️ Este comando solo puede ser ejecutado por el sistema.',
  admin: '⚠️ Este comando es exclusivo para Administradores del Grupo.',
  botAdmin: '⚠️ El bot necesita ser Administrador para ejecutar este comando.',
  nsfw: '🚫 Los comandos NSFW están desactivados en este grupo.',
  comandooff: '🚫 Este comando está desactivado.'
}

global.my = {
  ch: "120363407128588763@newsletter"
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  import(`${file}?update=${Date.now()}`)
})