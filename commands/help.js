const settings = require('../settings');
const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
const os = require('os');

let commandsMeta = [];

try {
    const meta = require(path.join(__dirname, '../lib/commandsMeta.js'));
    commandsMeta = Array.isArray(meta.commands) ? meta.commands : [];
    console.log(`✅ Loaded ${commandsMeta.length} commands`);
} catch (err) {
    console.log('❌ commandsMeta load failed:', err.message);
}

const botStartTime  = Date.now();
const ASSESSMENT_DIR = path.join(__dirname, '../assessment');
const cooldown       = new Map();

const CACHE = {
    files: { webp: [], mp3: [], jpg: [] },
    groups: null,
};

// Rotation — cycles all files before repeating
const ROTATION = { webp: [], mp3: [], jpg: [] };

function nextFile(type) {
    const all = CACHE.files[type];
    if (!all.length) return null;
    if (!ROTATION[type].length) {
        ROTATION[type] = [...all].sort(() => Math.random() - 0.5);
    }
    return path.join(ASSESSMENT_DIR, ROTATION[type].pop());
}

async function preloadAssets() {
    try {
        const files = await fs.readdir(ASSESSMENT_DIR);
        CACHE.files.webp = files.filter(v => v.endsWith('.webp'));
        CACHE.files.mp3  = files.filter(v => v.endsWith('.mp3'));
        CACHE.files.jpg  = files.filter(v => v.endsWith('.jpg') || v.endsWith('.jpeg'));
        console.log(`✅ Cached assets — webp:${CACHE.files.webp.length} mp3:${CACHE.files.mp3.length} jpg:${CACHE.files.jpg.length}`);
    } catch (e) {
        console.log('❌ Asset preload failed:', e.message);
    }
}

preloadAssets();

function extractNumber(jid) {
    return jid.split('@')[0].replace(/[^0-9]/g, '');
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getUptime() {
    const seconds = Math.floor((Date.now() - botStartTime) / 1000);
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (d) return `${d}d ${h}h ${m}m`;
    if (h) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
}

function getRamUsage() {
    const total   = os.totalmem();
    const used    = total - os.freemem();
    const percent = ((used / total) * 100).toFixed(1);
    return `${Math.round(used / 1024 / 1024)}MB/${Math.round(total / 1024 / 1024)}MB (${percent}%)`;
}

function getTimeData() {
    const now       = new Date();
    const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: settings.timezone || 'Africa/Lagos',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        day: '2-digit', month: '2-digit', year: 'numeric',
    });
    const map = {};
    for (const p of formatter.formatToParts(now)) map[p.type] = p.value;
    return {
        time: `${map.hour}:${map.minute}:${map.second}`,
        date: `${map.day}/${map.month}/${map.year}`,
        hour: Number(map.hour),
    };
}

function getGreeting(name) {
    const { hour } = getTimeData();
    if (hour >= 5  && hour < 12) return `🌤️ Good Morning @${name}`;
    if (hour >= 12 && hour < 17) return `☀️ Good Afternoon @${name}`;
    if (hour >= 17 && hour < 21) return `🌙 Good Evening @${name}`;
    return `🌌 Good Night @${name}`;
}

function buildCommandGroups(prefix) {
    if (CACHE.groups) return CACHE.groups;

    const groups     = {};
    const registered = new Set();

    for (const cmd of commandsMeta) {
        if (!cmd?.name) continue;
        const category = cmd.category || 'Other';
        if (!groups[category]) groups[category] = [];
        groups[category].push(cmd.name);
        registered.add(cmd.name);
    }

    const extras = fsSync.readdirSync(__dirname)
        .filter(f => f.endsWith('.js') && !['help.js', 'menu.js', 'settings.js', 'list.js'].includes(f))
        .map(f => f.replace('.js', ''))
        .filter(cmd => !registered.has(cmd));

    if (extras.length) {
        if (!groups.Other) groups.Other = [];
        groups.Other.push(...extras);
    }

    for (const cat in groups) groups[cat].sort();

    CACHE.groups = groups;
    return groups;
}

function buildMenu(data) {
    const { botName, version, prefix, senderName, currentTime, currentDate, uptime, ram, totalCmds, platform, nodeVersion, groups } = data;
    const lines = [];

    lines.push(`╭━━━〔 ${botName} 〕━━⬣`);
    lines.push(`┃ 👤 User: ${senderName}`);
    lines.push(`┃ ⚡ Version: ${version}`);
    lines.push(`┃ 🧩 Commands: ${totalCmds}`);
    lines.push(`┃ 🚀 Uptime: ${uptime}`);
    lines.push(`┃ 💾 RAM: ${ram}`);
    lines.push(`┃ 🖥️ Platform: ${platform}`);
    lines.push(`┃ 📦 Runtime: ${nodeVersion}`);
    lines.push(`┃ ⏰ Time: ${currentTime}`);
    lines.push(`┃ 📅 Date: ${currentDate}`);
    lines.push(`┃ 🎯 Prefix: ${prefix}`);
    lines.push(`╰━━━━━━━━━━━━━━⬣`);
    lines.push('');

    const order = ['AI', 'Download', 'Search', 'Group', 'Games', 'Fun', 'Anime', 'Media', 'Utility', 'Owner', 'NSFW', 'Other'];
    const done  = new Set();

    for (const category of [...order, ...Object.keys(groups)]) {
        if (done.has(category) || !groups[category]?.length) continue;
        done.add(category);
        lines.push(`╭─❍ ${category} [${groups[category].length}]`);
        for (const cmd of groups[category]) lines.push(`┃ ⬡ ${prefix}${cmd}`);
        lines.push(`╰────────────⬣`);
        lines.push('');
    }

    lines.push('╭━━━━━━━━━━━━⬣');
    lines.push('┃ 🌐 wa.me/channel/0029Vb7Ij8wHVvTZ97PlWG3l');
    lines.push('┃ 📚 Follow SKILLI-MD Channel');
    lines.push('┃ 🆓 Completely Free');
    lines.push('╰━━━━━━━━━━━━⬣');
    lines.push(`> © ${botName}`);

    return lines.join('\n');
}

const fakeMeta = {
    key: { participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: 'SKILLI_MENU' },
    message: {
        contactMessage: {
            displayName: 'SKILLI-MD',
            vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:SKILLI-MD\nTEL;waid=254769279076:+254769279076\nEND:VCARD`,
        },
    },
};

async function helpCommand(sock, chatId, message) {
    try {
        const senderId   = message.key.participant || message.key.remoteJid;
        const senderName = message.pushName || extractNumber(senderId);
        const now        = Date.now();

        // Cooldown: 10 seconds
        if (cooldown.has(senderId) && now - cooldown.get(senderId) < 10000) {
            return sock.sendMessage(chatId, { text: '⏳ Please wait before using the menu again.' }, { quoted: message });
        }
        cooldown.set(senderId, now);

        const prefix   = settings.prefix || '.';
        const greeting = getGreeting(senderName);
        const groups   = buildCommandGroups(prefix);
        const totalCmds = Object.values(groups).reduce((a, b) => a + b.length, 0);
        const { time: currentTime, date: currentDate } = getTimeData();

        const menu = `${greeting}\n\n${buildMenu({
            botName:     settings.botName  || 'SKILLI-MD 📚',
            version:     settings.version  || '1.0',
            prefix,
            senderName,
            currentTime,
            currentDate,
            uptime:      getUptime(),
            ram:         getRamUsage(),
            totalCmds,
            platform:    os.platform().toUpperCase(),
            nodeVersion: process.version,
            groups,
        })}`;

        // 1. React to trigger message
        await sock.sendMessage(chatId, { react: { text: '📚', key: message.key } });
        await delay(700);

        await sock.sendPresenceUpdate('composing', chatId);
        await delay(1200);

        // 2. Sticker
        const stickerPath = nextFile('webp');
        if (stickerPath) {
            try {
                await sock.sendMessage(chatId, {
                    sticker: await fs.readFile(stickerPath),
                    contextInfo: { forwardingScore: 999, isForwarded: true },
                }, { quoted: fakeMeta });
            } catch (e) {
                console.log('Sticker send failed:', e.message);
            }
        }

        await delay(1000);

        // 3. JPG image with menu caption
        const imagePath = nextFile('jpg');
        if (imagePath) {
            try {
                const imageBuffer = await fs.readFile(imagePath);
                await sock.sendMessage(chatId, {
                    image: imageBuffer,
                    caption: menu,
                    mentions: [senderId],
                    contextInfo: {
                        mentionedJid: [senderId],
                        forwardingScore: 999,
                        isForwarded: true,
                        externalAdReply: {
                            title: 'SKILLI-MD 📚',
                            body: 'Pair SKILLI-MD • Completely Free 🆓',
                            mediaType: 1,
                            renderLargerThumbnail: true,
                            showAdAttribution: false,
                            thumbnail: imageBuffer,
                            sourceUrl: 'https://whatsapp.com/channel/0029Vb7Ij8wHVvTZ97PlWG3l',
                        },
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: 'REPLACE_WITH_REAL_JID@newsletter',
                            newsletterName: 'SKILLI-MD 📚', // https://whatsapp.com/channel/0029Vb7Ij8wHVvTZ97PlWG3l
                            serverMessageId: 1,
                        },
                    },
                }, { quoted: fakeMeta });
            } catch (e) {
                console.log('Image send failed:', e.message);
                // Fallback: plain text menu if jpg fails
                await sock.sendMessage(chatId, { text: menu, mentions: [senderId] }, { quoted: message });
            }
        } else {
            // No jpg in assessment — send plain text
            await sock.sendMessage(chatId, { text: menu, mentions: [senderId] }, { quoted: message });
        }

        await delay(1500);

        // 4. Audio
        const audioPath = nextFile('mp3');
        if (audioPath) {
            try {
                await sock.sendPresenceUpdate('recording', chatId);
                await delay(800);
                await sock.sendMessage(chatId, {
                    audio: { url: audioPath },
                    mimetype: 'audio/mpeg',
                    ptt: false,
                    contextInfo: { forwardingScore: 999, isForwarded: true },
                }, { quoted: message });
            } catch (e) {
                console.log('Audio send failed:', e.message);
            }
        }

        // 5. Done react
        await sock.sendMessage(chatId, { react: { text: '✅', key: message.key } });

    } catch (err) {
        console.log('HELP ERROR:', err);
        try {
            await sock.sendMessage(chatId, { react: { text: '❌', key: message.key } });
            await sock.sendMessage(chatId, { text: '❌ Failed to load menu.' }, { quoted: message });
        } catch {}
    }
}

module.exports = helpCommand;
