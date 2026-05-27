const fs = require('fs');
const isOwnerOrSudo = require('../lib/isOwner');

const STATE_PATH = './data/ghostmode.json';

function readState() {
    try {
        if (!fs.existsSync(STATE_PATH)) return { enabled: false };
        return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8') || '{}');
    } catch { return { enabled: false }; }
}

function writeState(enabled) {
    try {
        if (!fs.existsSync('./data')) fs.mkdirSync('./data', { recursive: true });
        fs.writeFileSync(STATE_PATH, JSON.stringify({ enabled: !!enabled }, null, 2));
    } catch (e) { console.error('ghostmode writeState error:', e.message); }
}

function isGhostEnabled() {
    try { return !!readState().enabled; } catch { return false; }
}

async function ghostmodeCommand(sock, chatId, message, args) {
    const senderId = message.key.participant || message.key.remoteJid;
    const isAuthorized = await isOwnerOrSudo(senderId, sock, chatId);

    if (!message.key.fromMe && !isAuthorized) {
        await sock.sendMessage(chatId, { text: '❌ Only owner or sudo can use this command.' }, { quoted: message });
        return;
    }

    const sub = (args || '').trim().toLowerCase();
    const state = readState();

    if (sub === 'on') {
        writeState(true);
        await sock.sendPresenceUpdate('unavailable');
        await sock.sendMessage(chatId, { text: '👻 Ghost mode *ON* — bot now appears offline.' }, { quoted: message });
    } else if (sub === 'off') {
        writeState(false);
        await sock.sendPresenceUpdate('available');
        await sock.sendMessage(chatId, { text: '✅ Ghost mode *OFF* — bot now appears online.' }, { quoted: message });
    } else if (sub === 'status') {
        await sock.sendMessage(chatId, { text: `Ghost mode is currently *${state.enabled ? 'ON' : 'OFF'}*` }, { quoted: message });
    } else {
        // toggle
        const newState = !state.enabled;
        writeState(newState);
        await sock.sendPresenceUpdate(newState ? 'unavailable' : 'available');
        await sock.sendMessage(chatId, { text: `👻 Ghost mode *${newState ? 'ON' : 'OFF'}*` }, { quoted: message });
    }
}

module.exports = { ghostmodeCommand, isGhostEnabled };
