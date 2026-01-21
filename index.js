const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason,
    fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys")
const pino = require("pino")
const { Boom } = require("@hapi/boom")
const chalk = require("chalk")
const fs = require("fs")

async function startFrioBot() {
    const { state, saveCreds } = await useMultiFileAuthState('FrioSession')
    const { version } = await fetchLatestBaileysVersion()
    
    const conn = makeWASocket({
        version,
        logger: pino({ level: "silent" }),
        printQRInTerminal: false,
        auth: state,
        browser: ["Ubuntu", "Chrome", "20.0.04"]
    })

    if (!conn.authState.creds.registered) {
        console.log(chalk.yellow("Connection stabilizing... code appearing in 10s"))
        setTimeout(async () => {
            try {
                const phoneNumber = "2348076874766"
                const code = await conn.requestPairingCode(phoneNumber.trim())
                console.log(chalk.black(chalk.bgCyan(`Pairing Code: ${code}`)))
            } catch (e) {
                console.log(chalk.red("Error requesting code. Check if number is correct."))
            }
        }, 10000)
    }

    conn.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update
        if (connection === "close") {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode
            if (reason !== DisconnectReason.loggedOut) { 
                startFrioBot()
            }
        } else if (connection === "open") {
            console.log(chalk.green("THE-FRiO-BOT is Online"))
        }
    })

    conn.ev.on("creds.update", saveCreds)

    conn.ev.on("messages.upsert", async (chatUpdate) => {
        try {
            const m = chatUpdate.messages[0]
            if (!m.message) return
            const from = m.key.remoteJid
            const type = Object.keys(m.message)[0]
            const body = (type === 'conversation') ? m.message.conversation : (type == 'extendedTextMessage') ? m.message.extendedTextMessage.text : ''
       const sender = m.key.participant || m.key.remoteJid
const isCreator = ["2348076874766@s.whatsapp.net"].includes(sender) || m.key.fromMe

if (!fs.existsSync('./economyData.json')) fs.writeFileSync('./economyData.json', JSON.stringify({}))
let db = JSON.parse(fs.readFileSync('./economyData.json'))
            if (!fs.existsSync('./groupData.json')) fs.writeFileSync('./groupData.json', JSON.stringify({}))
let gdb = JSON.parse(fs.readFileSync('./groupData.json'))

if (m.key.remoteJid.endsWith('@g.us') && !gdb[from]) {
    gdb[from] = {
        antilink: false,
        mute: false
    }
    fs.writeFileSync('./groupData.json', JSON.stringify(gdb, null, 2))
}

            if (m.key.remoteJid.endsWith('@g.us') && gdb[from] && gdb[from].antilink && body.includes('chat.whatsapp.com')) {
    const groupMetadata = await conn.groupMetadata(from)
    const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net'
    const isBotAdmin = groupMetadata.participants.find(p => p.id === botNumber)?.admin
    const isSenderAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin

    if (!body.includes(from.split('@')[0]) && isBotAdmin && !isSenderAdmin && !isCreator) {
        await conn.sendMessage(from, { delete: m.key })
        await conn.sendMessage(from, { text: `🚫 Links are not allowed here!` })
    }

                if (!db[sender]) db[sender] = { balance: 0, lastDaily: 0 }
            }

            const jokes = [
    "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    "Parallel lines have so much in common. It’s a shame they’ll never meet.",
    "My wife told me to stop impersonating a flamingo. I had to put my foot down.",
    "I failed math so many times at school, I can’t even tell you.",
    "What’s the best thing about Switzerland? I don’t know, but the flag is a big plus.",
    "I’m reading a book on anti-gravity. It’s impossible to put down!",
    "I used to be a baker, but I couldn't make enough dough.",
    "Why don't skeletons fight each other? They don't have the guts."
]

const advice = [
    "Never trust a skinny cook.",
    "If you’re the smartest person in the room, you’re in the wrong room.",
    "Always borrow money from a pessimist. They don’t expect it back.",
    "The early bird might get the worm, but the second mouse gets the cheese.",
    "If you want to go fast, go alone. If you want to go far, go together.",
    "Don't worry about what others think. They don't do it very often.",
    "A clean house is a sign of a wasted life.",
    "If you think you are too small to make a difference, try sleeping with a mosquito."
]

const flirts = [
    "Is your name Wi-Fi? Because I'm really feeling a connection.",
    "Do you believe in love at first sight, or should I walk by again?",
    "If you were a triangle, you'd be acute one.",
    "I’m not a photographer, but I can definitely picture us together.",
    "Are you a charger? Because I’m dying without you.",
    "Do you have a bandage? I scraped my knee falling for you.",
    "Aside from being sexy, what do you do for a living?",
    "If I could rearrange the alphabet, I’d put 'U' and 'I' together."
]

const truths = [
    "What is the most embarrassing thing in your search history?",
    "Who in this group would you want to be stranded on an island with?",
    "What’s a secret you’ve never told anyone in this chat?",
    "Have you ever ghosted someone?",
    "What’s the most childish thing you still do?",
    "If you could trade lives with someone for a day, who would it be?",
    "What is your biggest deal-breaker in a relationship?"
]

const dares = [
    "Send a screenshot of your recent call log.",
    "Record yourself saying 'I am a little teapot' in a high-pitched voice.",
    "Text your crush and tell them you like them, then show proof.",
    "Type your name using only your nose.",
    "Reveal the last thing you searched for on YouTube.",
    "Describe the person you like without saying their name.",
    "Send a photo of the inside of your fridge."
]
            
            const menuText = `__________________________________
         《 𝗧𝗛𝗘 - 𝗙𝗥𝗶𝗢 - 𝗕𝗢𝗧 》
           • 𝙲𝚁𝙰𝙵𝚃𝙴𝙳 𝙱𝚈 𝙵𝚁𝚒𝙾 •
|_________________________________|

𝙿𝚁𝙴𝙵𝙸𝚇 = @

➪ ➪ ➪ 𝑴 𝑬 𝑵 𝑼 ➪ ➪ ➪

➪ ‎𝗚𝗥𝗢𝗨𝗣 𝗔𝗗𝗠𝗜𝗡𝗜𝗦𝗧𝗥𝗔𝗧𝗜𝗢𝗡 
‎*@ᴘʀᴏᴍᴏᴛᴇ*
‎*@ᴅᴇᴍᴏᴛᴇ*
‎*@ᴍᴜᴛᴇ* 
‎*@ᴜɴᴍᴜᴛᴇ* 
‎*@ᴋɪᴄᴋ*
‎*@ᴀɴᴛɪʟɪɴᴋ ᴏɴ/ᴏғғ*
‎*@ʜɪᴅᴇᴛᴀɢ*
‎*@ᴛᴀɢᴀʟʟ*
‎*@ʟɪɴᴋ* 
‎
➪ ‎𝗘𝗖𝗢𝗡𝗢𝗠𝗬 𝗦𝗬𝗦𝗧𝗘𝗠𝗦 
‎*@ᴅᴀɪʟʏ*
‎*@ʙᴀʟᴀɴᴄᴇ*
‎*@ʙᴀɴᴋ*
‎*@ᴄʟᴀɪᴍ*
‎*@ʀᴏʙ*
‎*@ɢɪᴠᴇ*
‎*@ʟʙ*
‎*@ɢᴀᴍʙʟᴇ*
‎*@sʟᴏᴛs*
‎*@ᴄᴏɪɴғʟɪᴘ*
‎*@ᴊᴀᴄᴋᴘᴏᴛ*
‎*@ᴄᴏᴏʟᴅᴏᴡɴs*

➪ ‎𝗦𝗢𝗖𝗜𝗔𝗟 𝗔𝗡𝗗 𝗜𝗡𝗧𝗘𝗥𝗔𝗖𝗧𝗜𝗩𝗘 
‎*@sʜɪᴘ*
‎*@ᴍᴀʀʀʏ*
‎*@ᴡʜᴀᴍ*
‎*@ᴋɪss*
*@ʜᴜɢ*
*@ᴘᴀᴛ*
‎*@sʟᴀᴘ*
‎*@sᴛᴀʀᴇ*
‎*@ғʟɪʀᴛ*
‎*@ᴊᴏᴋᴇ*
‎*@ᴀᴅᴠɪᴄᴇ* 
‎*@ᴅᴀʀᴇ*
*@ᴛʀᴜᴛʜ* 

➪ ‎𝗠𝗘𝗗𝗜𝗔 𝗔𝗡𝗗 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗦 ➪
‎*@sᴘᴏᴛɪғʏ*
‎*@ᴛɪᴋᴛᴏᴋ*
‎*@ɪɴsᴛᴀ*
‎*@ғʙ*
‎*@sᴛɪᴄᴋᴇʀ* 
‎*@ᴛᴏɪᴍɢ*
‎*@ᴛᴛs*
‎*@ᴛᴛᴀ*
‎
➪ ‎𝗦𝗬𝗦𝗧𝗘𝗠 𝗔𝗡𝗗 𝗜𝗡𝗙𝗢 
‎*@ᴍᴇɴᴜ*
‎*@ᴘʀᴏғɪʟᴇ*
‎*@ʀᴀɴᴋ* 
‎*@ᴏᴡɴᴇʀ* 
‎*@ʀᴇᴘᴏ* 
‎*@ᴡᴇʙsɪᴛᴇ* 
‎*@ᴘɪɴɢ*
‎

"ᴼᴴᴴ ᴾᴸˢ ᴵ ᴺᴱᴱᴰ ᴬ ᴮᴼᵀ ᵀᴼ ᶜᴴᴬᴺᴳᴱ ᵀᴴᴱ ᴳᴿᴼᵁᴾ ᴾᶠᴾ, ᴬᴿᴿᴳᴴ, ᴹᴬᵀᴱʸ ᵂᴴʸ ᴰᴼᴺ'ᵀ ʸᴼᵁ ᴮᴱᴺᴰ ᴼⱽᴱᴿ ˢᴼ ᵂᴱ ᶜᴬᴺ ᴬᴸˢᴼ ᵀᴬᴷᴱ ᴬ ᵀᴵˢˢᵁᴱ ᴾᴬᴾᴱᴿ ᴬᴺᴰ ᴴᴱᴸᴾ ʸᴼᵁ ˢᵂᴵᴾᴱ ʸᴼᵁᴿ ᴬᴴᴴ?? ᴸᴹᴬᴼ" 

_Enjoy_🐐`; 
if (body.startsWith('@menu')) {
                await conn.sendMessage(from, { 
                    image: { url: './BOTMEDIAS/menu.jpg' }, 
                    caption: menuText 
                }, { quoted: m })
}
            if (body.startsWith('@owner')) {
                await conn.sendMessage(from, { text: '"Him": https://github.com/Friomademyday/' }, { quoted: m })
            }

            if (body.startsWith('@promote')) {
                const groupMetadata = await conn.groupMetadata(from)
                const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net'
                const isBotAdmin = groupMetadata.participants.find(p => p.id === botNumber)?.admin
                const isSenderAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin
                if (!isBotAdmin) return await conn.sendMessage(from, { text: 'I need admin powers to promote others.' })
                if (!isSenderAdmin && !isCreator) return
                let users = m.message.extendedTextMessage?.contextInfo?.mentionedJid || []
                if (m.message.extendedTextMessage?.contextInfo?.quotedMessage) {
                    users.push(m.message.extendedTextMessage.contextInfo.participant)
                }
                if (users.length === 0) return await conn.sendMessage(from, { text: 'Tag or reply to someone to promote.' })
                await conn.groupParticipantsUpdate(from, users, "promote")
                await conn.sendMessage(from, { text: '✅ User(s) promoted to Admin.' })
            }

            if (body.startsWith('@ship')) {
                let users = m.message.extendedTextMessage?.contextInfo?.mentionedJid || []
                let quoted = m.message.extendedTextMessage?.contextInfo?.participant
                
                let user1, user2
                if (users.length >= 2) {
                    user1 = users[0]
                    user2 = users[1]
                } else if (quoted && users.length === 1) {
                    user1 = quoted
                    user2 = users[0]
                } else if (quoted) {
                    user1 = sender
                    user2 = quoted
                } else if (users.length === 1) {
                    user1 = sender
                    user2 = users[0]
                }

                if (!user1 || !user2) return await conn.sendMessage(from, { text: 'Tag two people or reply to someone to ship!' })
                
                const percent = Math.floor(Math.random() * 101)
                let status = ''
                if (percent < 25) status = 'Extremely Low Probability. Just stay friends. 💀'
                else if (percent < 50) status = 'Low Chance. It\'s going to be a struggle. 📉'
                else if (percent < 75) status = 'Good Match! There is definitely something there. ❤️'
                else status = 'Perfect Match! Marriage is calling. 🥂'

                const shipText = `🚢 *SHIPPER* 🚢\n\n@${user1.split('@')[0]}  ➕  @${user2.split('@')[0]}\n\n*Probability:* ${percent}%\n*Verdict:* ${status}`
                
                await conn.sendMessage(from, { text: shipText, mentions: [user1, user2] }, { quoted: m })
            }

            

            if (body.startsWith('@kiss')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                if (!user) return await conn.sendMessage(from, { text: 'You need to tag someone or reply to their message to kiss them!' })
                await conn.sendMessage(from, { 
                    video: { url: './BOTMEDIAS/kiss.gif' }, 
                    gifPlayback: true, 
                    caption: `You just kissed 💋 @${user.split('@')[0]}`,
                    mentions: [user] 
                }, { quoted: m })
            }

            if (body.startsWith('@marry')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                if (!user) return await conn.sendMessage(from, { text: 'You need to tag someone or reply to their message to marry them!' })
                await conn.sendMessage(from, { 
                    video: { url: './BOTMEDIAS/marry.gif' }, 
                    gifPlayback: true, 
                    caption: `*CONGRATULATIONS* you've married 🥂 @${user.split('@')[0]}`,
                    mentions: [user] 
                }, { quoted: m })
            }

            if (body.startsWith('@hug')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                if (!user) return await conn.sendMessage(from, { text: 'You need to tag someone or reply to their message to hug them!' })
                await conn.sendMessage(from, { 
                    video: { url: './BOTMEDIAS/hug.gif' }, 
                    gifPlayback: true, 
                    caption: `You just hugged 🤗 @${user.split('@')[0]}`,
                    mentions: [user] 
                }, { quoted: m })
            }

            if (body.startsWith('@slap')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                if (!user) return await conn.sendMessage(from, { text: 'You need to tag someone or reply to their message to slap them!' })
                await conn.sendMessage(from, { 
                    video: { url: './BOTMEDIAS/slap.gif' }, 
                    gifPlayback: true, 
                    caption: `You just slapped @${user.split('@')[0]}`,
                    mentions: [user] 
                }, { quoted: m })
            }

            if (body.startsWith('@headpat')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                if (!user) return await conn.sendMessage(from, { text: 'You need to tag someone or reply to their message to headpat them!' })
                await conn.sendMessage(from, { 
                    video: { url: './BOTMEDIAS/headpat.gif' }, 
                    gifPlayback: true, 
                    caption: `You just gave @${user.split('@')[0]} a head pat 🐰`,
                    mentions: [user] 
                }, { quoted: m })
            }

            if (body.startsWith('@stare')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                if (!user) return await conn.sendMessage(from, { text: 'You need to tag someone or reply to their message to stare at them!' })
                await conn.sendMessage(from, { 
                    video: { url: './BOTMEDIAS/stare.gif' }, 
                    gifPlayback: true, 
                    caption: `You just hit @${user.split('@')[0]} with the stare 🗿`,
                    mentions: [user] 
                }, { quoted: m })
            }

            if (body.startsWith('@wham')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                if (!user) return await conn.sendMessage(from, { text: 'You need to tag someone or reply to their message to wham them!' })
                await conn.sendMessage(from, { 
                    video: { url: './BOTMEDIAS/wham.gif' }, 
                    gifPlayback: true, 
                    caption: `You just WHAMMIED ‼️ TF outta @${user.split('@')[0]}`,
                    mentions: [user] 
                }, { quoted: m })
            }

            if (body.startsWith('@tagall')) {
                const groupMetadata = await conn.groupMetadata(from)
                const isSenderAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin
                if (!isSenderAdmin && !isCreator) return
                const participants = groupMetadata.participants
                let message = `📢 *ATTENTION EVERYONE*\n\n`
                message += body.slice(8) || 'The Captain is calling!'
                message += `\n\n`
                for (let mem of participants) {
                    message += `⚓ @${mem.id.split('@')[0]}\n`
                }
                await conn.sendMessage(from, { text: message, mentions: participants.map(a => a.id) })
            }

            if (body.startsWith('@repo')) {
                await conn.sendMessage(from, { text: '📦 *THE-FRiO-BOT REPO:*\n\nhttps://github.com/Friomademyday/THE-FRIO-BOT-MD-/' }, { quoted: m })
            }

            if (body.startsWith('@sticker') || body.startsWith('@s')) {
                const isQuotedImage = type === 'extendedTextMessage' && m.message.extendedTextMessage.contextInfo.quotedMessage?.imageMessage
                const isQuotedVideo = type === 'extendedTextMessage' && m.message.extendedTextMessage.contextInfo.quotedMessage?.videoMessage
                
                let buffer
                if (type === 'imageMessage' || isQuotedImage) {
                    const message = isQuotedImage ? m.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage : m.message.imageMessage
                    const stream = await downloadContentFromMessage(message, 'image')
                    let b = Buffer.from([])
                    for await(const chunk of stream) { b = Buffer.concat([b, chunk]) }
                    buffer = b
                } else if (type === 'videoMessage' || isQuotedVideo) {
                    const message = isQuotedVideo ? m.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : m.message.videoMessage
                    if (message.seconds > 10) return await conn.sendMessage(from, { text: 'Video too long!' })
                    const stream = await downloadContentFromMessage(message, 'video')
                    let b = Buffer.from([])
                    for await(const chunk of stream) { b = Buffer.concat([b, chunk]) }
                    buffer = b
                }

                if (buffer) {
                    await conn.sendMessage(from, { 
                        sticker: buffer, 
                        packname: 'THE-FRiO-BOT', 
                        author: 'FRiO' 
                    }, { quoted: m })
                } else {
                    await conn.sendMessage(from, { text: 'Reply to an image or video!' })
                }
            }

            if (body.startsWith('@joke')) {
                const joke = jokes[Math.floor(Math.random() * jokes.length)]
                await conn.sendMessage(from, { text: joke }, { quoted: m })
            }

            if (body.startsWith('@tts')) {
                const text = body.slice(5)
                if (!text) return await conn.sendMessage(from, { text: 'Give me some text to speak!' })
                const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`
                await conn.sendMessage(from, { audio: { url: url }, fileName: 'tts.mp3', mimetype: 'audio/mpeg', ptt: true }, { quoted: m })
            }

            if (body.startsWith('@toimg')) {
                const isQuotedSticker = type === 'extendedTextMessage' && m.message.extendedTextMessage.contextInfo.quotedMessage?.stickerMessage
                if (!isQuotedSticker) return await conn.sendMessage(from, { text: 'Reply to a non-animated sticker to convert it to an image.' })
                const stream = await downloadContentFromMessage(m.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage, 'image')
                let buffer = Buffer.from([])
                for await(const chunk of stream) { buffer = Buffer.concat([buffer, chunk]) }
                await conn.sendMessage(from, { image: buffer, caption: 'Done! ✨' }, { quoted: m })
                    }

            if (body.startsWith('@tiktok')) {
                const url = body.slice(8)
                if (!url) return await conn.sendMessage(from, { text: 'Please provide a TikTok link!' })
                const response = await fetch(`https://api.tiklydown.eu.org/api/download?url=${url}`)
                const data = await response.json()
                await conn.sendMessage(from, { video: { url: data.video.noWatermark }, caption: 'Here is your TikTok video!' }, { quoted: m })
            }

            if (body.startsWith('@insta')) {
                const url = body.slice(7)
                if (!url) return await conn.sendMessage(from, { text: 'Please provide an Instagram link!' })
                const res = await fetch(`https://api.vreden.my.id/api/igdownload?url=${url}`)
                const data = await res.json()
                await conn.sendMessage(from, { video: { url: data.result[0].url }, caption: 'Here is your Instagram media!' }, { quoted: m })
            }

            if (body.startsWith('@spotify')) {
                const query = body.slice(9)
                if (!query) return await conn.sendMessage(from, { text: 'What song should I search for?' })
                const res = await fetch(`https://api.vreden.my.id/api/spotify?query=${query}`)
                const data = await res.json()
                await conn.sendMessage(from, { audio: { url: data.result.download }, mimetype: 'audio/mpeg', fileName: `${data.result.title}.mp3` }, { quoted: m })
            }

            if (body.startsWith('@fb')) {
                const url = body.slice(4)
                if (!url) return await conn.sendMessage(from, { text: 'Please provide a Facebook video link!' })
                const res = await fetch(`https://api.vreden.my.id/api/fbdown?url=${url}`)
                const data = await res.json()
                await conn.sendMessage(from, { video: { url: data.result.normal }, caption: 'Facebook video downloaded!' }, { quoted: m })
            }

            if (body.startsWith('@tta')) {
                const text = body.slice(5)
                if (!text) return await conn.sendMessage(from, { text: 'What should I turn into audio?' })
                const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`
                await conn.sendMessage(from, { audio: { url: url }, mimetype: 'audio/mpeg', fileName: 'audio.mp3' }, { quoted: m })
                    }

            

            if (body.startsWith('@advice')) {
                const adv = advice[Math.floor(Math.random() * advice.length)]
                await conn.sendMessage(from, { text: adv }, { quoted: m })
            }

            if (body.startsWith('@flirt')) {
                const flirt = flirts[Math.floor(Math.random() * flirts.length)]
                await conn.sendMessage(from, { text: flirt }, { quoted: m })
            }

            if (body.startsWith('@truth')) {
                const truth = truths[Math.floor(Math.random() * truths.length)]
                await conn.sendMessage(from, { text: `🧐 *Truth:* ${truth}` }, { quoted: m })
            }

            if (body.startsWith('@dare')) {
                const dare = dares[Math.floor(Math.random() * dares.length)]
                await conn.sendMessage(from, { text: `😈 *Dare:* ${dare}` }, { quoted: m })
            }
            
            if (body.startsWith('@ping')) {
                await conn.sendMessage(from, { text: 'Pong! 🏓 THE-FRiO-BOT is active.' }, { quoted: m })
            }

            if (body.startsWith('@antilink')) {
                const groupMetadata = await conn.groupMetadata(from)
                const isSenderAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin
                if (!isSenderAdmin && !isCreator) return
                
                if (body.includes('off')) {
                    gdb[from].antilink = false
                    await conn.sendMessage(from, { text: '✅ Anti-link has been turned OFF.' })
                } else {
                    gdb[from].antilink = true
                    await conn.sendMessage(from, { text: '✅ Anti-link has been turned ON.' })
                }
                fs.writeFileSync('./groupData.json', JSON.stringify(gdb, null, 2))
            }

            if (body.startsWith('@mute')) {
                const groupMetadata = await conn.groupMetadata(from)
                const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net'
                const isBotAdmin = groupMetadata.participants.find(p => p.id === botNumber)?.admin
                const isSenderAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin
                
                if (!isBotAdmin) return await conn.sendMessage(from, { text: 'I need to be an admin to mute the group.' })
                if (!isSenderAdmin && !isCreator) return

                await conn.groupSettingUpdate(from, 'announcement')
                await conn.sendMessage(from, { text: '🔒 Group has been muted. Only admins can send messages.' })
            }

            if (body.startsWith('@unmute')) {
                const groupMetadata = await conn.groupMetadata(from)
                const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net'
                const isBotAdmin = groupMetadata.participants.find(p => p.id === botNumber)?.admin
                const isSenderAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin

                if (!isBotAdmin) return await conn.sendMessage(from, { text: 'I need to be an admin to unmute the group.' })
                if (!isSenderAdmin && !isCreator) return

                await conn.groupSettingUpdate(from, 'not_announcement')
                await conn.sendMessage(from, { text: '🔓 Group has been unmuted. Everyone can send messages.' })
            }

            if (body.startsWith('@kick')) {
                const groupMetadata = await conn.groupMetadata(from)
                const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net'
                const isBotAdmin = groupMetadata.participants.find(p => p.id === botNumber)?.admin
                const isSenderAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin

                if (!isBotAdmin) return await conn.sendMessage(from, { text: 'I need to be an admin to kick users.' })
                if (!isSenderAdmin && !isCreator) return

                let users = m.message.extendedTextMessage?.contextInfo?.mentionedJid || []
                if (m.message.extendedTextMessage?.contextInfo?.quotedMessage) {
                    users.push(m.message.extendedTextMessage.contextInfo.participant)
                }

                if (users.length === 0) return await conn.sendMessage(from, { text: 'Tag a user or reply to their message to kick them.' })
                
                for (let u of users) {
                    await conn.groupParticipantsUpdate(from, [u], "remove")
                }
            }

            if (body.startsWith('@daily')) {
                const lastDaily = db[sender].lastDaily
                const cooldown = 86400000 
                if (Date.now() - lastDaily < cooldown) {
                    const remaining = cooldown - (Date.now() - lastDaily)
                    const hours = Math.floor(remaining / 3600000)
                    const minutes = Math.floor((remaining % 3600000) / 60000)
                    return await conn.sendMessage(from, { text: `⏳ You already claimed today. Come back in ${hours}h ${minutes}m.` }, { quoted: m })
                }
                if (!isCreator) db[sender].balance = (db[sender].balance || 0) + 1000
                db[sender].lastDaily = Date.now()
                fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
                await conn.sendMessage(from, { text: `✅ Daily reward of 1,000 coins claimed!` }, { quoted: m })
            }

            if (body.startsWith('@lb')) {
                let board = Object.keys(db)
                    .filter(id => id !== "2348076874766@s.whatsapp.net")
                    .map(id => ({ id, balance: db[id].balance || 0 }))
                    .sort((a, b) => b.balance - a.balance)
                    .slice(0, 10)
                
                let text = `🏆 *THE-FRiO-BOT LEADERBOARD*\n\n`
                board.forEach((user, i) => {
                    text += `${i + 1}. @${user.id.split('@')[0]} - ${user.balance}\n`
                })
                await conn.sendMessage(from, { text, mentions: board.map(u => u.id) }, { quoted: m })
            }

            
            if (body.startsWith('@demote')) {
                const groupMetadata = await conn.groupMetadata(from)
                const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net'
                const isBotAdmin = groupMetadata.participants.find(p => p.id === botNumber)?.admin
                const isSenderAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin

                if (!isBotAdmin) return await conn.sendMessage(from, { text: 'I need admin powers to demote others.' })
                if (!isSenderAdmin && !isCreator) return

                let users = m.message.extendedTextMessage?.contextInfo?.mentionedJid || []
                if (m.message.extendedTextMessage?.contextInfo?.quotedMessage) {
                    users.push(m.message.extendedTextMessage.contextInfo.participant)
                }
                if (users.length === 0) return await conn.sendMessage(from, { text: 'Tag or reply to someone to demote.' })
                
                await conn.groupParticipantsUpdate(from, users, "demote")
                await conn.sendMessage(from, { text: '✅ User(s) demoted to Member.' })
            }

            if (body.startsWith('@hidetag')) {
                const groupMetadata = await conn.groupMetadata(from)
                const isSenderAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin
                if (!isSenderAdmin && !isCreator) return

                let participants = groupMetadata.participants
                await conn.sendMessage(from, { text: body.slice(9) || 'Hello everyone!', mentions: participants.map(a => a.id) })
            }

            if (body.startsWith('@link')) {
                const groupMetadata = await conn.groupMetadata(from)
                const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net'
                const isBotAdmin = groupMetadata.participants.find(p => p.id === botNumber)?.admin
                if (!isBotAdmin) return await conn.sendMessage(from, { text: 'I need to be an admin to generate the link.' })
                
                const code = await conn.groupInviteCode(from)
                await conn.sendMessage(from, { text: `https://chat.whatsapp.com/${code}` }, { quoted: m })
                                                                      }


            
        } catch (err) {
            console.log(err)
        }
    })
}

startFrioBot()
