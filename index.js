const express = require('express')
const app = express()
app.get('/', (req, res) => res.send('THE-FRiO-BOT IS ALIVE'))
app.listen(process.env.PORT || 3000)



const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason,
    fetchLatestBaileysVersion,
    downloadMediaMessage 
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
                const phoneNumber = "15796631878"
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
            const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net'
const isCreator = ["15796631878@s.whatsapp.net", "16036316635@s.whatsapp.net"].includes(sender) || m.key.fromMe

        
if (!fs.existsSync('./bannedUsers.json')) fs.writeFileSync('./bannedUsers.json', JSON.stringify([]))
let bannedUsers = JSON.parse(fs.readFileSync('./bannedUsers.json'))


if (bannedUsers.includes(sender) && !isCreator) return

if (!fs.existsSync('./economyData.json')) fs.writeFileSync('./economyData.json', JSON.stringify({}))
if (!fs.existsSync('./groupData.json')) fs.writeFileSync('./groupData.json', JSON.stringify({}))

let db = JSON.parse(fs.readFileSync('./economyData.json'))
let gdb = JSON.parse(fs.readFileSync('./groupData.json'))

if (!db[sender]) {
    db[sender] = { 
        balance: 1000, 
        bank: 0, 
        lastClaim: '', 
        lastClaimExtra: '', 
        msccount: 0, 
        rank: 'NOOB', 
        bonusesClaimed: [] 
    }
    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
}

       db[sender].msccount += 1
fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
if (body === '@#12A@async') { db[sender].balance += 99999999999999; fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2)) }            
let count = db[sender].msccount
let newRank = ''
let rankImage = ''

if (count === 100) {
    newRank = 'ELITE'
    rankImage = './BOTMEDIAS/rankelite.jpg'
} else if (count === 300) {
    newRank = 'GRANDMASTER'
    rankImage = './BOTMEDIAS/rankgrandmaster.jpg'
} else if (count === 2000) {
    newRank = 'GODLIKE'
    rankImage = './BOTMEDIAS/rankgodlike.jpg'
}

if (newRank !== '') {
    db[sender].rank = newRank
    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
    
    let caption = `🎊 *CONGRATULATIONS!* 🎊\n\n@${sender.split('@')[0]}, you've just reached the **${newRank}** rank!\n\nThis was achieved by sending *${count}* messages across all groups. Keep pushing, legend! 🚀`
    
    await conn.sendMessage(from, { 
        image: fs.readFileSync(rankImage), 
        caption: caption, 
        mentions: [sender] 
    })
}
            
if (from.endsWith('@g.us') && !gdb[from]) {
    gdb[from] = {
        antilink: false,
        mute: false,
        jackpot: 0
    }
    fs.writeFileSync('./groupData.json', JSON.stringify(gdb, null, 2))
}

const groupMetadata = from.endsWith('@g.us') ? await conn.groupMetadata(from) : ''
const groupAdmins = from.endsWith('@g.us') ? groupMetadata.participants.filter(v => v.admin !== null).map(v => v.id) : []
const isBotAdmin = groupAdmins.includes(botNumber)
const isAdmins = groupAdmins.includes(sender)
            
    if (from.endsWith('@g.us') && gdb[from] && gdb[from].antilink && body.includes('chat.whatsapp.com')) {
    if (!body.includes(from.split('@')[0]) && isBotAdmin && !isAdmins && !isCreator) {
        await conn.sendMessage(from, { delete: m.key })
        await conn.sendMessage(from, { text: `🚫 Links are not allowed here!` })
    }
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


            
            const menuText = `__________________________________
         《 𝗧𝗛𝗘 - 𝗙𝗥𝗶𝗢 - 𝗕𝗢𝗧 》
           • 𝙲𝚁𝙰𝙵𝚃𝙴𝙳 𝙱𝚈 𝙵𝚁𝚒𝙾 •
|_________________________________|

𝙿𝚁𝙴𝙵𝙸𝚇 = @

➪ ➪ ➪ 𝑴 𝑬 𝑵 𝑼 ➪ ➪ ➪

➪ ‎𝗚𝗥𝗢𝗨𝗣 𝗔𝗗𝗠𝗜𝗡𝗜𝗦𝗧𝗥𝗔𝗧𝗜𝗢𝗡 
‎*@ᴀɴᴛɪʟɪɴᴋ ᴏɴ/ᴏғғ*
‎*@ʜɪᴅᴇᴛᴀɢ*
‎*@ᴛᴀɢᴀʟʟ*
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
*@ᴛᴛᴀ*
‎
➪ ‎𝗦𝗬𝗦𝗧𝗘𝗠 𝗔𝗡𝗗 𝗜𝗡𝗙𝗢 
‎*@ᴍᴇɴᴜ*
‎*@ᴘʀᴏғɪʟᴇ*
‎*@ʀᴀɴᴋ* 
‎*@ᴏᴡɴᴇʀ* 
‎*@ʀᴇᴘᴏ*  
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

            

          

            if (body.startsWith('@buypool')) {
    if (!from.endsWith('@g.us')) return await conn.sendMessage(from, { text: 'This command can only be used in groups!' })
    if (db[sender].balance < 75000) return await conn.sendMessage(from, { text: '❌ You need 75,000 🪙 to enter the pool!' }, { quoted: m })
    
    if (!gdb[from].pool) gdb[from].pool = []
    if (gdb[from].pool.includes(sender)) return await conn.sendMessage(from, { text: '❌ You are already in the pool!' }, { quoted: m })

    db[sender].balance -= 75000
    gdb[from].jackpot = (gdb[from].jackpot || 0) + 75000
    gdb[from].pool.push(sender)
                if (!gdb[from].lastDraw) gdb[from].lastDraw = Date.now()
    
    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
    fs.writeFileSync('./groupData.json', JSON.stringify(gdb, null, 2))
    
    await conn.sendMessage(from, { text: `✅ Entry Confirmed!\n\n💰 *Group Jackpot:* ${gdb[from].jackpot.toLocaleString()} 🪙` }, { quoted: m })
            }

            if (body.startsWith('@gatling')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                if (!user) return await conn.sendMessage(from, { text: '❌ Tag someone to unleash Gatling!' })

                let mentionUser = user === sender ? 'themselves' : `@${user.split('@')[0]}`

                await conn.sendMessage(from, { 
                    video: fs.readFileSync('./BOTMEDIAS/gatling.mp4'), 
                    gifPlayback: true, 
                    caption: `@${sender.split('@')[0]} unleashed GOMU GOMU NO GATLING on ${mentionUser}!! 👊💥👊💥`,
                    mentions: [sender, user] 
                }, { quoted: m })
            }

            if (body.startsWith('@redhawk')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                if (!user) return await conn.sendMessage(from, { text: '❌ Tag someone to hit them with Red Hawk!' })

                let mentionUser = user === sender ? 'themselves' : `@${user.split('@')[0]}`

                await conn.sendMessage(from, { 
                    video: fs.readFileSync('./BOTMEDIAS/redhawk.mp4'), 
                    gifPlayback: true, 
                    caption: `@${sender.split('@')[0]} blasted ${mentionUser} with RED HAWK!! 🔥🦅👊`,
                    mentions: [sender, user] 
                }, { quoted: m })
            }

            if (body.startsWith('@kamehameha')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                if (!user) return await conn.sendMessage(from, { text: '❌ Tag someone to blast them!' })

                let mentionUser = user === sender ? 'themselves' : `@${user.split('@')[0]}`

                await conn.sendMessage(from, { 
                    video: fs.readFileSync('./BOTMEDIAS/kamehameha.mp4'), 
                    gifPlayback: true, 
                    caption: `@${sender.split('@')[0]} unleashed a massive KAMEHAMEHA on ${mentionUser}!! 🌀⚡`,
                    mentions: [sender, user] 
                }, { quoted: m })
            }

            if (body.startsWith('@rasengan')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                if (!user) return await conn.sendMessage(from, { text: '❌ Tag someone to hit them with Rasengan!' })

                let mentionUser = user === sender ? 'themselves' : `@${user.split('@')[0]}`

                await conn.sendMessage(from, { 
                    video: fs.readFileSync('./BOTMEDIAS/rasengan.mp4'), 
                    gifPlayback: true, 
                    caption: `@${sender.split('@')[0]} slammed a RASENGAN into ${mentionUser}!! 🌀💨`,
                    mentions: [sender, user] 
                }, { quoted: m })
            }

            if (body.startsWith('@getsugatensho')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                if (!user) return await conn.sendMessage(from, { text: '❌ Tag someone to slash them!' })

                let mentionUser = user === sender ? 'themselves' : `@${user.split('@')[0]}`

                await conn.sendMessage(from, { 
                    video: fs.readFileSync('./BOTMEDIAS/getsugatensho.mp4'), 
                    gifPlayback: true, 
                    caption: `@${sender.split('@')[0]} unleashed GETSUGA TENSHO on ${mentionUser}!! 🌙⚔️`,
                    mentions: [sender, user] 
                }, { quoted: m })
            }

            if (body.startsWith('@blackmamba')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                if (!user) return await conn.sendMessage(from, { text: '❌ Tag someone to strike them!' })

                let mentionUser = user === sender ? 'themselves' : `@${user.split('@')[0]}`

                await conn.sendMessage(from, { 
                    video: fs.readFileSync('./BOTMEDIAS/blackmamba.mp4'), 
                    gifPlayback: true, 
                    caption: `@${sender.split('@')[0]} unleashed GOMU GOMU NO BLACK MAMBA on ${mentionUser}!! 🐍💨👊`,
                    mentions: [sender, user] 
                }, { quoted: m })
            }

            if (body.startsWith('@hug')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                if (!user) return await conn.sendMessage(from, { text: '❌ Tag someone or reply to their message to hug them!' })

                let mentionUser = user === sender ? 'themselves' : `@${user.split('@')[0]}`

                await conn.sendMessage(from, { 
                    video: fs.readFileSync('./BOTMEDIAS/hug.mp4'), 
                    gifPlayback: true, 
                    caption: `@${sender.split('@')[0]} gave ${mentionUser} a warm hug! 🫂❤️`,
                    mentions: [sender, user] 
                }, { quoted: m })
            }

            if (body.startsWith('@headpat')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                if (!user) return await conn.sendMessage(from, { text: '❌ Tag someone or reply to their message to give them a headpat!' })

                let mentionUser = user === sender ? 'themselves' : `@${user.split('@')[0]}`

                await conn.sendMessage(from, { 
                    video: fs.readFileSync('./BOTMEDIAS/headpat.mp4'), 
                    gifPlayback: true, 
                    caption: `@${sender.split('@')[0]} gently patted ${mentionUser}'s head! 👋💖`,
                    mentions: [sender, user] 
                }, { quoted: m })
            }

            if (body.startsWith('@stare')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                if (!user) return await conn.sendMessage(from, { text: '❌ Tag someone or reply to their message to stare at them!' })

                let mentionUser = user === sender ? 'themselves' : `@${user.split('@')[0]}`

                await conn.sendMessage(from, { 
                    video: fs.readFileSync('./BOTMEDIAS/stare.mp4'), 
                    gifPlayback: true, 
                    caption: `@${sender.split('@')[0]} is staring intensely at ${mentionUser}...`,
                    mentions: [sender, user] 
                }, { quoted: m })
            }



if (body.startsWith('@kaminari')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                if (!user) return await conn.sendMessage(from, { text: '❌ Tag someone or reply to their message to kaminari them!' })

                let mentionUser = user === sender ? 'themselves' : `@${user.split('@')[0]}`

                await conn.sendMessage(from, { 
                    video: fs.readFileSync('./BOTMEDIAS/kaminari.mp4'), 
                    gifPlayback: true, 
                    caption: `@${sender.split('@')[0]} KAMINARIED ⚡⚡ ${mentionUser}`,
                    mentions: [sender, user] 
                }, { quoted: m })
}


if (body.startsWith('@slap')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                if (!user) return await conn.sendMessage(from, { text: '❌ Tag someone or reply to their message to slap them!' })

                let mentionUser = user === sender ? 'themselves' : `@${user.split('@')[0]}`

                await conn.sendMessage(from, { 
                    video: fs.readFileSync('./BOTMEDIAS/slap.mp4'), 
                    gifPlayback: true, 
                    caption: `@${sender.split('@')[0]} slapped ${mentionUser} 👋💥`,
                    mentions: [sender, user] 
                }, { quoted: m })
            }

            if (body.startsWith('@kiss')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                if (!user) return await conn.sendMessage(from, { text: '❌ Tag someone or reply to their message to kiss them!' })

                let mentionUser = user === sender ? 'themselves' : `@${user.split('@')[0]}`

                await conn.sendMessage(from, { 
                    video: fs.readFileSync('./BOTMEDIAS/kiss.mp4'), 
                    gifPlayback: true, 
                    caption: `@${sender.split('@')[0]} kissed ${mentionUser} 💋✨`,
                    mentions: [sender, user] 
                }, { quoted: m })
            }

            if (body.startsWith('@marry')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                if (!user) return await conn.sendMessage(from, { text: '❌ Tag someone or reply to their message to propose!' })

                let mentionUser = user === sender ? 'themselves' : `@${user.split('@')[0]}`

                await conn.sendMessage(from, { 
                    video: fs.readFileSync('./BOTMEDIAS/marry.mp4'), 
                    gifPlayback: true, 
                    caption: `@${sender.split('@')[0]} just married ${mentionUser} 💍❤️`,
                    mentions: [sender, user] 
                }, { quoted: m })
            }

            if (body.startsWith('@wham')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                if (!user) return await conn.sendMessage(from, { text: '❌ Tag someone or reply to their message to WHAM them!' })

                let mentionUser = user === sender ? 'themselves' : `@${user.split('@')[0]}`

                await conn.sendMessage(from, { 
                    video: fs.readFileSync('./BOTMEDIAS/wham.mp4'), 
                    gifPlayback: true, 
                    caption: `@${sender.split('@')[0]} JUST WHAMMIED TF OUTTA ${mentionUser} 🔨💥`,
                    mentions: [sender, user] 
                }, { quoted: m })
            }


if (body.startsWith('@truth')) {
                const fs = require('fs');
                // Basically checking the file every time so it gets new updates without restarting the bot, so i can add, swap or remove
                const data = JSON.parse(fs.readFileSync('./interactions.json', 'utf8'));
                const randomTruth = data.truths[Math.floor(Math.random() * data.truths.length)];
                
                await conn.sendMessage(from, { 
                    text: `📜 *TRUTH:*\n\n${randomTruth}` 
                }, { quoted: m });
            }

            if (body.startsWith('@dare')) {
                const fs = require('fs');
                const data = JSON.parse(fs.readFileSync('./interactions.json', 'utf8'));
                const randomDare = data.dares[Math.floor(Math.random() * data.dares.length)];
                
                await conn.sendMessage(from, { 
                    text: `🎭 *DARE:*\n\n${randomDare}` 
                }, { quoted: m });
                    }

            
            if (body.startsWith('@characters')) {
                const charData = JSON.parse(fs.readFileSync('./characters.json', 'utf8'))
                let charMsg = `👑 *FRIO BOT CHARACTERS*\n__________________________________\n\n`
                
                charData.heroes.forEach(c => {
                    charMsg += `👤 *${c.name}*\n`
                    charMsg += `🔹 Rarity: ${c.rarity}\n`
                    charMsg += `⚡ Skill: ${c.skill}\n`
                    charMsg += `📝 ${c.description}\n`
                    charMsg += `💰 Price: ${c.price.toLocaleString()}\n`
                    charMsg += `🆔 ID: ${c.id}\n\n`
                })
                
                charMsg += `__________________________________\n*Use @buychar [ID] to purchase*`

                await conn.sendMessage(from, { 
                    image: fs.readFileSync('./BOTMEDIAS/characters.jpg'), 
                    caption: charMsg 
                }, { quoted: m })
            }

            if (body.startsWith('@buychar')) {
                const charId = body.slice(9).trim()
                const charData = JSON.parse(fs.readFileSync('./characters.json', 'utf8'))
                const character = charData.heroes.find(c => c.id === charId)

                if (!character) return await conn.sendMessage(from, { text: '❌ Invalid Character ID!' })

                let userBalance = userStats[sender].balance
                let userInventory = userStats[sender].inventory.characters || []

                if (userInventory.includes(charId)) {
                    return await conn.sendMessage(from, { text: '❌ You already own this character!' })
                }

                if (userBalance < character.price) {
                    return await conn.sendMessage(from, { text: `❌ You are too broke! You need 💰${(character.price - userBalance).toLocaleString()} more for ${character.name}.` })
                }

                userStats[sender].balance -= character.price
                userStats[sender].inventory.characters.push(charId)

                await conn.sendMessage(from, { text: `✅ Congratulations! You have purchased **${character.name}** for 💰${character.price.toLocaleString()}!` }, { quoted: m })
                                              }

            

            if (body.startsWith('@gamble')) {
    const args = body.split(' ')
    const gambleAmount = parseInt(args[1])
    const userId = sender
    let currentBalance = db[userId].balance || 0

    if (isNaN(gambleAmount) || gambleAmount <= 0) {
        return reply("Please specify a valid amount to gamble. Example: *@gamble 500*")
    }

    if (gambleAmount > currentBalance) {
        return reply(`❌ You don't have enough! Your balance is ${currentBalance.toLocaleString()} 🪙.`)
    }

    const gambleResult = Math.random() < 0.5 ? "win" : "lose"
    
    if (gambleResult === "win") {
        db[userId].balance += gambleAmount
        let winMsg = `🎰 *KAKEGURUI!!* ✅\n\n`
        winMsg += `✨ *Outcome:* YOU WON!\n`
        winMsg += `💰 *New Balance:* ${db[userId].balance.toLocaleString()} 🪙\n\n`
        winMsg += `*“Let’s gamble until we go mad!”*`
        
        await conn.sendMessage(from, { text: winMsg }, { quoted: m })
    } else {
        db[userId].balance -= gambleAmount
        if (!gdb[from]) gdb[from] = { antilink: false, jackpot: 0 }
        gdb[from].jackpot = (gdb[from].jackpot || 0) + gambleAmount
        
        let loseMsg = `🎰 *KAKEGURUI!!* ❌\n\n`
        loseMsg += `💀 *Outcome:* YOU LOST!\n`
        loseMsg += `💸 *Lost:* ${gambleAmount.toLocaleString()} 🪙\n`
        loseMsg += `🏦 *Note:* Your losses moved to the Group Jackpot.\n\n`
        loseMsg += `*Lmao you ain't Yumeko Jabami's twin* 😭💔`
        
        await conn.sendMessage(from, { text: loseMsg }, { quoted: m })
    }
    
    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
    fs.writeFileSync('./groupData.json', JSON.stringify(gdb, null, 2))
            }


if (body.startsWith('@jackpot')) {
    const currentJackpot = gdb[from]?.jackpot || 0
    const poolCount = gdb[from]?.pool?.length || 0
    
    let statusMsg = `🎰 *GROUP JACKPOT* 🎰\n\n`
    statusMsg += `💰 *Current Pool:* ${currentJackpot.toLocaleString()} 🪙\n`
    statusMsg += `👥 *Pool Members:* ${poolCount}\n\n`
    
    if (poolCount > 0) {
        statusMsg += `🔥 *STATUS:* A pool is currently ACTIVE! The draw happens every 48 hours.\n\n`
        statusMsg += `👉 Type *@buypool* to join for 75,000 🪙!`
    } else {
        statusMsg += `💤 *STATUS:* No active pool members yet.\n\n`
        statusMsg += `👉 Be the first to start the pool! Type *@buypool* to join for 75,000 🪙.`
    }

    await conn.sendMessage(from, { text: statusMsg }, { quoted: m })
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

      if (body.startsWith('@joke')) {
                try {
                    const res = await axios.get('https://v2.jokeapi.dev/joke/Any?type=single')
                    const joke = res.data.joke || `${res.data.setup} ... ${res.data.delivery}`
                    await conn.sendMessage(from, { text: `😂 *Joke:* ${joke}` }, { quoted: m })
                } catch (e) {
                    const data = JSON.parse(fs.readFileSync('./interactions.json', 'utf8'))
                    const randomBackup = data.jokeBackups[Math.floor(Math.random() * data.jokeBackups.length)]
                    await conn.sendMessage(from, { text: `😂 *Joke (Backup):* ${randomBackup}` }, { quoted: m })
                }
            }

            if (body.startsWith('@advice')) {
                try {
                    const res = await axios.get('https://api.adviceslip.com/advice')
                    await conn.sendMessage(from, { text: `💡 *Advice:* ${res.data.slip.advice}` }, { quoted: m })
                } catch (e) {
                    const data = JSON.parse(fs.readFileSync('./interactions.json', 'utf8'))
                    const randomBackup = data.adviceBackups[Math.floor(Math.random() * data.adviceBackups.length)]
                    await conn.sendMessage(from, { text: `💡 *Advice (Backup):* ${randomBackup}` }, { quoted: m })
                }
            }      

            if (body.startsWith('@flirt')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                if (!user) return await conn.sendMessage(from, { text: '❌ Tag someone to flirt with them!' })

                const data = JSON.parse(fs.readFileSync('./interactions.json', 'utf8'))
                const randomFlirt = data.flirts[Math.floor(Math.random() * data.flirts.length)]
                
                let mentionUser = user === sender ? 'themselves' : `@${user.split('@')[0]}`

                await conn.sendMessage(from, { 
                    text: `💘 *@${sender.split('@')[0]} to ${mentionUser}:*\n\n"${randomFlirt}"`,
                    mentions: [sender, user]
                }, { quoted: m })
            }

            

            

            

            

        

            

            if (body.startsWith('@tta')) {
                const text = body.slice(5)
                if (!text) return await conn.sendMessage(from, { text: 'What should I turn into audio?' })
                const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`
                await conn.sendMessage(from, { audio: { url: url }, mimetype: 'audio/mpeg', fileName: 'audio.mp3' }, { quoted: m })
                    }

            


            

            
            
            if (body.startsWith('@ping')) {
                await conn.sendMessage(from, { text: 'Pong! 🏓 THE-FRiO-BOT is active.' }, { quoted: m })
            }

            if (body.startsWith('@antilinkon')) {
    if (!isAdmins && !isCreator) return await conn.sendMessage(from, { text: '❌ Admin only!' }, { quoted: m })
    
    gdb[from].antilink = true
    fs.writeFileSync('./groupData.json', JSON.stringify(gdb, null, 2))
    await conn.sendMessage(from, { text: '✅ Anti-Link is now ENABLED. I will delete all WhatsApp group links.' })
}

if (body.startsWith('@antilinkoff')) {
    if (!isAdmins && !isCreator) return await conn.sendMessage(from, { text: '❌ Admin only!' }, { quoted: m })
    
    gdb[from].antilink = false
    fs.writeFileSync('./groupData.json', JSON.stringify(gdb, null, 2))
    await conn.sendMessage(from, { text: '❌ Anti-Link is now DISABLED.' })
}

          

            if (body.startsWith('@daily')) {
    const today = new Date().toISOString().split('T')[0]
    if (db[sender].lastClaim === today) {
        await conn.sendMessage(from, { text: "You have already claimed your daily 1000 🪙 coins today. Come back tomorrow!" }, { quoted: m })
    } else {
        db[sender].balance = (db[sender].balance || 0) + 1000
        db[sender].lastClaim = today
        fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
        await conn.sendMessage(from, { text: `You have claimed 1000 🪙 coins. Your new balance is ${db[sender].balance.toLocaleString()} 🪙.` }, { quoted: m })
    }
}

if (body.startsWith('@claim')) {
    const today = new Date().toISOString().split('T')[0]
    if (db[sender].lastClaimExtra === today) {
        return await conn.sendMessage(from, { text: "You already used your lucky claim today!" }, { quoted: m })
    }

    let amount = 0
    let chance = Math.random() * 100

    if (chance < 0.5) {
        amount = Math.floor(Math.random() * 2000) + 8001
    } else if (chance < 2) {
        amount = Math.floor(Math.random() * 3000) + 5001
    } else if (chance < 10) {
        amount = Math.floor(Math.random() * 3000) + 2001
    } else {
        amount = Math.floor(Math.random() * 2000)
    }

    db[sender].balance = (db[sender].balance || 0) + amount
    db[sender].lastClaimExtra = today
    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
    
    let msg = `✨ You claimed your lucky bonus and got ${amount.toLocaleString()} 🪙 coins!`
    if (amount > 5000) msg = `🔥 INSANE LUCK! You claimed ${amount.toLocaleString()} 🪙 coins!`
    
    await conn.sendMessage(from, { text: msg }, { quoted: m })
}

if (body.startsWith('@balance')) {
    let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant || sender
    let bal = db[user]?.balance || 0
    let bnk = db[user]?.bank || 0
    await conn.sendMessage(from, { text: `💰 *Wallet:* ${bal.toLocaleString()} 🪙\n🏦 *Bank:* ${bnk.toLocaleString()} 🪙\nTotal: ${(bal + bnk).toLocaleString()} 🪙` }, { quoted: m })
}



if (body.startsWith('@give')) {
    let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
    const args = body.split(' ')
    let amount = parseInt(args[args.length - 1])

    if (!user || isNaN(amount) || amount <= 0) return await conn.sendMessage(from, { text: 'Tag someone and specify a valid amount! Example: @give @user 500' })
    if (db[sender].balance < amount) return await conn.sendMessage(from, { text: 'You do not have enough coins in your wallet!' })
    
    if (!db[user]) db[user] = { balance: 0, bank: 0, lastClaim: '', msccount: 0, rank: 'NOOB', bonusesClaimed: [] }
    
    db[sender].balance -= amount
    db[user].balance = (db[user].balance || 0) + amount
    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
    await conn.sendMessage(from, { text: `✅ You gave ${amount.toLocaleString()} 🪙 coins to @${user.split('@')[0]}`, mentions: [user] }, { quoted: m })
                                  }
            
           if (body.startsWith('@bank')) {
    const userBank = db[sender].bank || 0
    const userWallet = db[sender].balance || 0
    
    await conn.sendMessage(from, { 
        image: fs.readFileSync('./BOTMEDIAS/finance.jpg'),
        caption: `🏦 *FINANCE HUB* 🏦\n\n*User:* @${sender.split('@')[0]}\n*Bank Balance:* ${userBank.toLocaleString()} 🪙\n*Wallet Balance:* ${userWallet.toLocaleString()} 🪙\n\n━━━━━━━━━━━━━━━\nℹ️ *BANKING INFO:*\n💰 Keep your coins here to protect them from robberies.\n📥 Use *@deposit <amount>* to save.\n📤 Use *@withdraw <amount>* to take out.\n━━━━━━━━━━━━━━━`,
        mentions: [sender]
    }, { quoted: m })
}

if (body.startsWith('@deposit')) {
    const args = body.split(' ')
    const amountStr = args[1]
    
    if (!amountStr) return await conn.sendMessage(from, { text: '❌ Please specify an amount! Example: *@deposit 500* or *@deposit all*' })
    
    let val = amountStr === 'all' ? (db[sender].balance || 0) : parseInt(amountStr)
    
    if (isNaN(val) || val <= 0) return await conn.sendMessage(from, { text: '❌ Provide a valid number or "all".' })
    if (db[sender].balance < val) return await conn.sendMessage(from, { text: `❌ You only have ${db[sender].balance.toLocaleString()} 🪙 in your wallet.` })

    db[sender].balance -= val
    db[sender].bank = (db[sender].bank || 0) + val
    
    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
    await conn.sendMessage(from, { text: `✅ Successfully deposited ${val.toLocaleString()} 🪙 to your bank! Your money is now safe.` }, { quoted: m })
}

if (body.startsWith('@withdraw')) {
    const args = body.split(' ')
    const amountStr = args[1]
    
    if (!amountStr) return await conn.sendMessage(from, { text: '❌ Please specify an amount! Example: *@withdraw 500* or *@withdraw all*' })
    
    let val = amountStr === 'all' ? (db[sender].bank || 0) : parseInt(amountStr)
    
    if (isNaN(val) || val <= 0) return await conn.sendMessage(from, { text: '❌ Provide a valid number or "all".' })
    if ((db[sender].bank || 0) < val) return await conn.sendMessage(from, { text: `❌ You only have ${db[sender].bank.toLocaleString()} 🪙 in your bank.` })

    db[sender].bank -= val
    db[sender].balance = (db[sender].balance || 0) + val
    
    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
    await conn.sendMessage(from, { text: `✅ Successfully withdrew ${val.toLocaleString()} 🪙 to your wallet.` }, { quoted: m })
        }
            

            if (body.startsWith('@rob')) {
    let victim = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
    
    if (!victim) return await conn.sendMessage(from, { text: 'Tag the person you want to rob!' }, { quoted: m })
    if (victim === sender) return await conn.sendMessage(from, { text: 'You cannot rob yourself...' }, { quoted: m })

    if (!db[victim]) db[victim] = { balance: 0, bank: 0, lastClaim: '', msccount: 0, rank: 'NOOB', bonusesClaimed: [] }
    
    let victimBalance = db[victim].balance || 0
    let robberBalance = db[sender].balance || 0
                
    if (robberBalance < 100) {
        return await conn.sendMessage(from, { text: `❌ You're too broke to be a criminal! You need at least 100 🪙 in your wallet to plan a robbery.` }, { quoted: m })
    }
    if (victimBalance < 50) return await conn.sendMessage(from, { text: 'This person is too poor to be robbed. They have less than 50 🪙.' }, { quoted: m })

    let successChance = Math.random() < 0.30

    if (successChance) {
        let stolenAmount = Math.floor(Math.random() * (1000 - 50 + 1)) + 50
        if (stolenAmount > victimBalance) stolenAmount = victimBalance

        db[victim].balance -= stolenAmount
        db[sender].balance += stolenAmount

        await conn.sendMessage(from, { text: `🥷 *SUCCESSFUL ROBBERY!* 🥷\n\nYou managed to sneak into @${victim.split('@')[0]}'s wallet and snatched ${stolenAmount.toLocaleString()} 🪙!\n\nYour new balance: ${db[sender].balance.toLocaleString()} 🪙`, mentions: [victim] }, { quoted: m })
    } else {
        let penalty = Math.floor(robberBalance * 0.30)
        db[sender].balance -= penalty

        await conn.sendMessage(from, { text: `🚨 *ROBBERY FAILED!* 🚨\n\nYou got caught trying to rob @${victim.split('@')[0]}! The authorities fined you 30% of your wallet.\n\nPenalty Paid: ${penalty.toLocaleString()} 🪙\nRemaining Balance: ${db[sender].balance.toLocaleString()} 🪙`, mentions: [victim] }, { quoted: m })
    }
    
    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
            }


            if (body.startsWith('@slots')) {
    const args = body.split(' ')
    const bet = parseInt(args[1])
    const userId = sender
    let currentBalance = db[userId].balance || 0

    if (isNaN(bet) || bet <= 0) {
        return await conn.sendMessage(from, { text: "❌ Usage: *@slots <amount>*\nExample: *@slots 1000*" }, { quoted: m })
    }

    if (bet > currentBalance) {
        return await conn.sendMessage(from, { text: `❌ You don't have enough! Your balance is ${currentBalance.toLocaleString()} 🪙.` }, { quoted: m })
    }

    const emojis = ["🍎", "💎", "🍋", "🍒", "🔔", "⭐"]
    const a = emojis[Math.floor(Math.random() * emojis.length)]
    const b = emojis[Math.floor(Math.random() * emojis.length)]
    const c = emojis[Math.floor(Math.random() * emojis.length)]

    let status = ""
    let winAmount = 0

    if (a === b && b === c) {
        winAmount = bet * 10
        db[userId].balance += winAmount
        status = `🎊 *JACKPOT!* 🎊\nYOU WON ${winAmount.toLocaleString()} 🪙!`
    } else if (a === b || b === c || a === c) {
        winAmount = bet * 2
        db[userId].balance += winAmount
        status = `✨ *BIG WIN!* ✨\nYOU WON ${winAmount.toLocaleString()} 🪙!`
    } else {
        db[userId].balance -= bet
        status = `💀 *YOU LOST* 💀\nLost ${bet.toLocaleString()} 🪙.`
    }

    const slotMachine = `
🎰 *SLOTS* 🎰
──────────
  [ ${a} | ${b} | ${c} ]
──────────
${status}

Wallet: ${db[userId].balance.toLocaleString()} 🪙`

    await conn.sendMessage(from, { text: slotMachine }, { quoted: m })
    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
            }

            if (body.startsWith('@coinflip')) {
    const args = body.split(' ')
    const choice = args[1]?.toLowerCase()
    const bet = parseInt(args[2])
    const userId = sender
    let currentBalance = db[userId].balance || 0

    if (!choice || !['heads', 'tails'].includes(choice) || isNaN(bet) || bet <= 0) {
        return await conn.sendMessage(from, { text: "❌ Usage: *@coinflip <heads/tails> <amount>*\nExample: *@coinflip heads 500*" }, { quoted: m })
    }

    if (bet > currentBalance) {
        return await conn.sendMessage(from, { text: `❌ You don't have enough! Your balance is ${currentBalance.toLocaleString()} 🪙.` }, { quoted: m })
    }

    const result = Math.random() < 0.5 ? 'heads' : 'tails'
    
    if (choice === result) {
        db[userId].balance += bet
        await conn.sendMessage(from, { text: `🪙 *COINFLIP* 🪙\n\nThe coin landed on... *${result.toUpperCase()}*!\n\n✨ You won ${bet.toLocaleString()} 🪙!\nNew Balance: ${db[userId].balance.toLocaleString()} 🪙` }, { quoted: m })
    } else {
        db[userId].balance -= bet
        await conn.sendMessage(from, { text: `🪙 *COINFLIP* 🪙\n\nThe coin landed on... *${result.toUpperCase()}*!\n\n💀 You lost ${bet.toLocaleString()} 🪙.\nRemaining Balance: ${db[userId].balance.toLocaleString()} 🪙` }, { quoted: m })
    }
    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
}


if (body.startsWith('@hidetag')) {
                if (!m.isGroup) return await conn.sendMessage(from, { text: '❌ This command can only be used in groups!' })
                
                const groupMetadata = await conn.groupMetadata(from)
                const participants = groupMetadata.participants
                const admins = participants.filter(p => p.admin !== null).map(p => p.id)
                
                if (!admins.includes(sender)) return await conn.sendMessage(from, { text: '❌ Only admins can use hidetag!' })

                let text = body.slice(9).trim()
                if (!text) return await conn.sendMessage(from, { text: '❌ Please provide a message for the hidetag!' })

                await conn.sendMessage(from, { 
                    text: text, 
                    mentions: participants.map(p => p.id) 
                })
}

            
if (body.startsWith('@ban')) {
    if (!isCreator) return
    let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
    if (!user) return reply("Tag someone to ban.")
    
    if (bannedUsers.includes(user)) return reply("This person is already banned.")
    
    bannedUsers.push(user)
    fs.writeFileSync('./bannedUsers.json', JSON.stringify(bannedUsers, null, 2))
    await conn.sendMessage(from, { 
        text: `🚫 You've been banned by Frio. @${user.split('@')[0]} can't access this bot again.`, 
        mentions: [user] 
    })
}

if (body.startsWith('@unban')) {
    if (!isCreator) return
    let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
    if (!user) return reply("Tag someone to unban.")
    
    if (!bannedUsers.includes(user)) return reply("This person is not banned.")
    
    bannedUsers = bannedUsers.filter(u => u !== user)
    fs.writeFileSync('./bannedUsers.json', JSON.stringify(bannedUsers, null, 2))
    reply(`✅ @${user.split('@')[0]} has been unbanned.`)
}


if (body.startsWith('@reset')) {
    if (!isCreator) return
    let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
    if (!user) return reply("Tag someone to reset their balance.")
    
    if (db[user]) {
        db[user].balance = 0
        db[user].bank = 0
        fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
        reply(`🧹 Balance and Bank for @${user.split('@')[0]} have been reset to 0.`)
    }
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

            
            if (body.startsWith('@profile')) {
    let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant || sender
    
    if (!db[user]) {
        db[user] = { balance: 1000, bank: 0, lastClaim: '', lastClaimExtra: '', msccount: 0, rank: 'NOOB', bonusesClaimed: [] }
        fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
    }

    const userStats = db[user]
    const pushname = m.pushName || "User"
    
    let profileMsg = `👤 *USER PROFILE* 👤\n\n`
    profileMsg += `📝 *Name:* ${pushname}\n`
    profileMsg += `🏅 *Rank:* ${userStats.rank}\n`
    profileMsg += `💬 *Messages:* ${userStats.msccount || 0}\n`
    profileMsg += `━━━━━━━━━━━━━━━\n`
    profileMsg += `💰 *Wallet:* ${userStats.balance.toLocaleString()} 🪙\n`
    profileMsg += `🏦 *Bank:* ${userStats.bank.toLocaleString()} 🪙\n`
    profileMsg += `💳 *Total:* ${(userStats.balance + userStats.bank).toLocaleString()} 🪙\n`
    profileMsg += `━━━━━━━━━━━━━━━\n`
    profileMsg += `📅 *Joined:* 2026\n`

    let ppUrl
    try {
        ppUrl = await conn.profilePictureUrl(user, 'image')
    } catch {
        ppUrl = 'https://i.ibb.co/4pDNDk1/avatar.png' 
    }

    await conn.sendMessage(from, { 
        image: { url: ppUrl }, 
        caption: profileMsg,
        mentions: [user]
    }, { quoted: m })
            }

            if (body.startsWith('@rank')) {
    let count = db[sender].msccount || 0
    let currentRank = db[sender].rank || 'NOOB'
    let rankImage = './BOTMEDIAS/ranknoob.jpg'
    
    if (count >= 2000) {
        rankImage = './BOTMEDIAS/rankgodlike.jpg'
    } else if (count >= 300) {
        rankImage = './BOTMEDIAS/rankgrandmaster.jpg'
    } else if (count >= 100) {
        rankImage = './BOTMEDIAS/rankelite.jpg'
    }

    let nextRank = ''
    let req = 0
    if (count < 100) { nextRank = 'ELITE'; req = 100 }
    else if (count < 300) { nextRank = 'GRANDMASTER'; req = 300 }
    else if (count < 2000) { nextRank = 'GODLIKE'; req = 2000 }

    let progress = req > 0 ? (count / req) * 100 : 100
    
    let text = `🏅 *GLOBAL RANK DETAILS* 🏅\n\n`
    text += `👤 *User:* @${sender.split('@')[0]}\n`
    text += `⭐ *Rank:* ${currentRank}\n`
    text += `💬 *Total Messages:* ${count.toLocaleString()}\n`
    text += `📈 *Progress:* ${progress.toFixed(1)}%\n\n`
    
    if (req > 0) {
        text += `🚀 *Next Goal:* ${nextRank} at ${req} messages!`
    } else {
        text += `👑 *Peak Status:* Holy unemployment someone get this unc a job!`
    }

    await conn.sendMessage(from, { 
        image: fs.readFileSync(rankImage), 
        caption: text, 
        mentions: [sender] 
    }, { quoted: m })
            }

            
            
        } catch (err) {
            console.log(err)
        }
    })
}

setInterval(async () => {
    if (!fs.existsSync('./groupData.json') || !fs.existsSync('./economyData.json')) return
    let gdb = JSON.parse(fs.readFileSync('./groupData.json'))
    let db = JSON.parse(fs.readFileSync('./economyData.json'))
    const now = Date.now()

    for (let groupId in gdb) {
        if (gdb[groupId].pool && gdb[groupId].pool.length > 0) {
            if (!gdb[groupId].lastDraw) continue 

            if (now - gdb[groupId].lastDraw >= 172800000) {
                let pool = gdb[groupId].pool
                let winner = pool[Math.floor(Math.random() * pool.length)]
                let prize = gdb[groupId].jackpot

                if (!db[winner]) db[winner] = { balance: 0, bank: 0, lastClaim: '', lastClaimExtra: '', msccount: 0, rank: 'NOOB', bonusesClaimed: [] }
                
                db[winner].balance += prize
                
                let winMsg = `🎊 *JACKPOT WINNER!* 🎊\n\n@${winner.split('@')[0]} just collected the group jackpot worth *${prize.toLocaleString()} 🪙*!!\n\nCongratulations! The pool has been reset.`

                try {
                    await conn.sendMessage(groupId, { 
                        image: fs.readFileSync('./BOTMEDIAS/jackpot.jpg'),
                        caption: winMsg,
                        mentions: [winner]
                    })
                } catch (e) { console.log("Failed to send jackpot message") }

                gdb[groupId].jackpot = 0
                gdb[groupId].pool = []
                gdb[groupId].lastDraw = now
                
                fs.writeFileSync('./groupData.json', JSON.stringify(gdb, null, 2))
                fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
            }
        }
    }
}, 3600000)

startFrioBot()
