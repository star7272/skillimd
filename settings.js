// ============================================
//  SKILLI-MD
//  Channel: https://whatsapp.com/channel/0029Vb7Ij8wHVvTZ97PlWG3l
//  © 2026 SkilliTech — All rights reserved
// ============================================
const settings = {
  // ─── Bot Identity ───────────────────────────────────────────────────────────
  packname:    'SKILLI-MD',
  author:      '‎',                         // Sticker author (invisible char = no watermark)
  botName:     'SKILLI-MD',
  botOwner:    'SKILLI-MD',
  ownerNumber: '254738017513',             // Your number — no + or spaces

  // ─── Behaviour ──────────────────────────────────────────────────────────────
  prefix:      '.',                         // Command prefix: . ! / # etc.
  commandMode: 'public',                    // 'public' | 'private'
  version:     '1.0.2',

  // ─── Newsletter / Channel ───────────────────────────────────────────────────
  newsletterJid:        'REPLACE_WITH_REAL_JID@newsletter', // Bot logs real JID on first connect
  newsletterName:       'SKILLI-MD 📚',
  channelLink:          'https://whatsapp.com/channel/0029Vb7Ij8wHVvTZ97PlWG3l',
  autoFollowNewsletter: true,
  autoReactNewsletter:  true,
  reactEmojis: ['🤖','🔥','💯','❤️','👍','💫','✨','👏','😎','🚀','⚡','💥','🌟','💪'],

  // ─── Social / Links ─────────────────────────────────────────────────────────
  website:    'https://whatsapp.com/channel/0029Vb7Ij8wHVvTZ97PlWG3l',
  githubRepo: 'https://github.com/star7272/SKILLI-MD',

  // ─── API Keys ───────────────────────────────────────────────────────────────
  giphyApiKey: 'qnl7ssQChTdPjsKta2Ax2LMaGXz303tq',

  // ─── Performance ────────────────────────────────────────────────────────────
  maxStoreMessages:   20,
  storeWriteInterval: 10000,

  // ─── Misc ───────────────────────────────────────────────────────────────────
  description:  'A powerful multi-device WhatsApp bot by SkilliTech.',
  updateZipUrl: 'https://github.com/AstaTech/Skilli-md/archive/refs/heads/main.zip',

  // ─── Timezone ───────────────────────────────────────────────────────────────
  timezone: 'Africa/Nairobi',
};

module.exports = settings;
