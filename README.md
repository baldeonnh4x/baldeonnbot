<div align="center">
  <h1>👾 Baldeonnh4x Bot 🎮</h1>
  <p><b>La experiencia definitiva para tu comunidad gamer en WhatsApp.</b></p>
  
  [![Node.js](https://img.shields.io/badge/Node.js-v22+-green.svg)](https://nodejs.org/)
  [![Baileys](https://img.shields.io/badge/Library-Baileys-blue.svg)](https://github.com/WhiskeySockets/Baileys)
  [![License](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)
</div>

---

## 📖 Descripción

**Baldeonnh4x Bot** es un asistente de WhatsApp de alto rendimiento, diseñado específicamente para comunidades de videojuegos. Ha sido optimizado para ser ligero, rápido y libre de funciones innecesarias (como contenido NSFW o sistemas de waifus). 

Cuenta con un sistema de rangos competitivo, economía interactiva, descargas multimedia y herramientas de utilidad avanzadas.

---

## ✨ Características Principales

- **⚔️ Sistema de Rangos:** Los jugadores escalan desde Bronce hasta Diamante según su actividad en el grupo.
- **💰 Economía RPG:** Trabaja, roba, mina y apuesta monedas en el casino con tus amigos.
- **🎵 Descargas Multimedia:** Música de YouTube en alta calidad (`.play`), TikTok, Instagram, Spotify y más.
- **🖼️ Stickers:** Crea stickers a partir de imágenes o videos de forma sencilla.
- **🛠️ Herramientas Gamer:** 
  - Revela fotos de "Ver una sola vez" (`.ver`).
  - Mejora la calidad de imágenes (`.hd`).
  - Reconoce canciones (`.shazam`).
  - Remueve fondos de imágenes (`.removebg`).
- **👋 Bienvenidas Automáticas:** Recibe a los nuevos con reglas, formato de presentación, redes sociales y audio.
- **🤖 Inteligencia Artificial:** Integración con ChatGPT.
- **🛡️ Moderación:** Comandos de administración (`.warn`, `.kick`, `.promote`, `.antilink`).

---

## 🚀 Guía de Instalación

### 🛠️ Requisitos Previos (Termux / Android)

Para ejecutar el bot las 24 horas desde tu celular, necesitas instalar las dependencias del sistema. Abre **Termux** y ejecuta:

```bash
# 1. Actualizar el sistema
pkg update -y && pkg upgrade -y

# 2. Instalar herramientas base
pkg install -y git nodejs-lts ffmpeg build-essential python imagemagick libvips

# 3. Instalar gestores de paquetes globales
npm install -g yarn pm2
