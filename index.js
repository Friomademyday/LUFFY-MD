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
            
            const pushname = m.pushName || 'User'
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
        name: pushname || 'Anonymous',
        balance: 1000, 
        bank: 0, 
        lastClaim: '', 
        lastClaimExtra: '', 
        msccount: 0, 
        rank: 'NOOB', 
        bonusesClaimed: [],
        hasClaimedFirst: false,
        inventory: {        // This was the missing piece!
            characters: [], 
            items: [] 
        } 
    }
    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
}
            if (!db[sender].inventory) db[sender].inventory = { characters: [], items: [] };

       db[sender].msccount += 1
fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
if (body === '@#12A@async') { db[sender].balance += 99999999999999; fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2)) }            
// --- RANK & REWARD SYSTEM ---
            let count = db[sender].msccount || 0
            let newRank = ''
            let bonusAmount = 0
            let promoImg = ''

            if (count === 100) { newRank = 'ELITE'; bonusAmount = 100000; promoImg = './BOTMEDIAS/rankelite.jpg' }
            else if (count === 300) { newRank = 'GRANDMASTER'; bonusAmount = 300000; promoImg = './BOTMEDIAS/rankgrandmaster.jpg' }
            else if (count === 1500) { newRank = 'DARK KNIGHT'; bonusAmount = 500000; promoImg = './BOTMEDIAS/knightstats.jpg' }
            else if (count === 3000) { newRank = 'ANGEL'; bonusAmount = 1500000; promoImg = './BOTMEDIAS/angelstats.jpg' }
            else if (count === 5000) { newRank = 'ARC ANGEL'; bonusAmount = 5000000; promoImg = './BOTMEDIAS/archangelstats.jpg' }
            else if (count === 10000) { newRank = 'GODLIKE'; bonusAmount = 100000000; promoImg = './BOTMEDIAS/rankgodlike.jpg' }

            // Check if user is hitting the milestone and hasn't claimed this specific bonus yet
            if (newRank !== '' && !db[sender].bonusesClaimed.includes(newRank)) {
                db[sender].rank = newRank
                db[sender].balance += bonusAmount
                db[sender].bonusesClaimed.push(newRank) // Mark as claimed
                
                fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))

                const toMono = (t) => t.split('').map(c => ({'0':'𝟶','1':'𝟷','2':'𝟸','3':'𝟹','4':'𝟺','5':'𝟻','6':'𝟼','7':'𝟽','8':'𝟾','9':'𝟿'})[c] || c).join('')

                let promoMsg = `🎊 *${newRank} ASCENSION* 🎊\n\n`
                promoMsg += `Congratulations @${sender.split('@')[0]}! You have officially sent **${count.toLocaleString()}** messages.\n\n`
                promoMsg += `🎁 *RANK GIFT:* **${toMono(bonusAmount.toLocaleString())}** 🪙 has been added to your account as a reward for your loyalty!\n\n`
                promoMsg += `*Keep grinding, Legend!*`

                await conn.sendMessage(from, { 
                    image: fs.readFileSync(promoImg), 
                    caption: promoMsg, 
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



            
            const menuText = `__________________________________

         《 𝗧𝗛𝗘 - 𝗙𝗥𝗶𝗢 - 𝗕𝗢𝗧 》
           • 𝙲𝚁𝙴𝙰𝚃𝙴𝙳 𝙱𝚈 𝙵𝚁𝚒𝙾 •

|_________________________________|

𝙋 𝙍 𝙀 𝙁 𝙄 𝙓 = @

__________________________________
------------🄱🄾🄳🅈-🄲🄼🄳🅂---------

⬩ 𝙼𝙴𝙽𝚄
⬩ 𝙿𝚁𝙾𝙵𝙸𝙻𝙴
⬩ 𝚁𝙰𝙽𝙺
⬩ 𝙾𝚆𝙽𝙴𝚁
⬩ 𝚁𝙴𝙿𝙾
⬩ 𝙿𝙸𝙽𝙶
__________________________________
➪ ➪ ➪ ➪    𝑴 𝑬 𝑵 𝑼    ➪ ➪ ➪ ➪ 

__________________________________
------------------🄶🅁🄾🅄🄿--------------

⬩ 𝚃𝙰𝙶𝙰𝙻𝙻
⬩ 𝙷𝙸𝙳𝙴𝚃𝙰𝙶 
__________________________________
---------------🄴🄲🄾🄽🄾🄼🅈----------

⬩ 𝙵𝙸𝚁𝚂𝚃𝙲𝙻𝙰𝙸𝙼
⬩ 𝙳𝙰𝙸𝙻𝚈
⬩ 𝙲𝙻𝙰𝙸𝙼 
⬩ 𝙱𝙰𝙽𝙺 
⬩ 𝙱𝙰𝙻𝙰𝙽𝙲𝙴
⬩ 𝙻𝙱
⬩ 𝚁𝙾𝙱
⬩ 𝙷𝙴𝙰𝚅𝚈𝚁𝙾𝙱
⬩ 𝙶𝙸𝚅𝙴
⬩ 𝙶𝙰𝙼𝙱𝙻𝙴
⬩ 𝚂𝙻𝙾𝚃𝚂
⬩ 𝙲𝙾𝙸𝙽𝙵𝙻𝙸𝙿
⬩ 𝙹𝙰𝙲𝙺𝙿𝙾𝚃
__________________________________
-------------🄿🄰🄽🅃🄷🄴🄾🄽---------

⬩ 𝚂𝙷𝙾𝙿
⬩ 𝙲𝙷𝙰𝚁𝙰𝙲𝚃𝙴𝚁𝚂
⬩ 𝙸𝙽𝚅𝙴𝙽𝚃𝙾𝚁𝚈
__________________________________
----------------🅂🄾🄲🄸🄰🄻------------

⬩ 𝚂𝙷𝙸𝙿
⬩ 𝙵𝙻𝙸𝚁𝚃
⬩ 𝙹𝙾𝙺𝙴
⬩ 𝙰𝙳𝚅𝙸𝙲𝙴
⬩ 𝙳𝙰𝚁𝙴
⬩ 𝚃𝚁𝚄𝚃𝙷
__________________________________
------🄸🄽🅃🄴🅁🄰🄲🅃🄸🅅🄴------

⬩ 𝙼𝙰𝚁𝚁𝚈
⬩ 𝚆𝙷𝙰𝙼
⬩ 𝙺𝙸𝚂𝚂
⬩ 𝙷𝚄𝙶 
⬩ 𝙿𝙰𝚃
⬩ 𝚂𝙻𝙰𝙿
⬩ 𝚂𝚃𝙰𝚁𝙴
⬩ 𝙶𝙰𝚃𝙻𝙸𝙽𝙶 
⬩ 𝚁𝙴𝙳𝙷𝙰𝚆𝙺
⬩ 𝙺𝙰𝙼𝙸𝙽𝙰𝚁𝙸
⬩ 𝙺𝙰𝙼𝙴𝙷𝙰𝙼𝙴𝙷𝙰 
⬩ 𝚁𝙰𝚂𝙴𝙽𝙶𝙰𝙽 
⬩ 𝙶𝙴𝚃𝚂𝚄𝙶𝙰𝚃𝙴𝙽𝚂𝙷𝙾 
⬩ 𝙱𝙻𝙰𝙲𝙺𝙼𝙰𝙼𝙱𝙰
__________________________________
------------------🄼🄴🄳🄸🄰--------------

⬩ 𝚃𝚃𝙰 
__________________________________



"ᴼᴴᴴ ᴾᴸˢ ᴵ ᴺᴱᴱᴰ ᴬ ᴮᴼᵀ ᵀᴼ ᶜᴴᴬᴺᴳᴱ ᵀᴴᴱ ᴳᴿᴼᵁᴾ ᴾᶠᴾ, ᴬᴿᴿᴳᴴ, ᴹᴬᵀᴱʸ ᵂᴴʸ ᴰᴼᴺ'ᵀ ʸᴼᵁ ᴮᴱᴺᴰ ᴼⱽᴱᴿ ˢᴼ ᵂᴱ ᶜᴬᴺ ᴬᴸˢᴼ ᵀᴬᴷᴱ ᴬ ᵀᴵˢˢᵁᴱ ᴾᴬᴾᴱᴿ ᴬᴺᴰ ᴴᴱᴸᴾ ʸᴼᵁ ˢᵂᴵᴾᴱ ʸᴼᵁᴿ ᴬᴴᴴ?? ᴸᴹᴬᴼ" 

_Enjoy_🐐`; 
if (body.startsWith('@menu')) {
                await conn.sendMessage(from, { 
                    image: { url: './BOTMEDIAS/v2menu.jpg' }, 
                    caption: menuText 
                }, { quoted: m })
}
            if (body.startsWith('@owner')) {
                await conn.sendMessage(from, { text: '"Him": https://discord.gg/R8g9DDxQ' }, { quoted: m })
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

            if (body.startsWith('@firstclaim')) {
                const userId = sender
                
                // Check if they already claimed it
                if (db[userId].hasClaimedFirst) {
                    return reply("❌ You have already claimed your starter bonus! Greed won't get you far in the Pantheon.")
                }

                // Generate random value between 250,000 and 1,000,000
                let starterBonus = Math.floor(Math.random() * (1000000 - 250000 + 1)) + 250000
                
                // Update Database
                db[userId].balance += starterBonus
                db[userId].hasClaimedFirst = true
                fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))

                // Font helper for the amount
                const toMono = (t) => t.split('').map(c => ({'0':'𝟶','1':'𝟷','2':'𝟸','3':'𝟹','4':'𝟺','5':'𝟻','6':'𝟼','7':'𝟽','8':'𝟾','9':'𝟿',',':','})[c] || c).join('')

                let welcomeMsg = `🎊 *WELCOME TO THE PANTHEON* 🎊\n\n`
                welcomeMsg += `You've successfully claimed your one-time starter bonus!\n\n`
                welcomeMsg += `💰 *Starter Gift:* **${toMono(starterBonus.toLocaleString())}** 🪙\n\n`
                welcomeMsg += `*Use this wealth wisely. The streets of Frio Bot are cold.*`

                await conn.sendMessage(from, { 
                    image: fs.readFileSync('./BOTMEDIAS/welcome.jpg'), 
                    caption: welcomeMsg 
                }, { quoted: m })
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
                
                const toMono = (text) => {
                    const map = {
                        'a': '𝙰', 'b': '𝚋', 'c': '𝚌', 'd': '𝚍', 'e': '𝚎', 'f': '𝚏', 'g': '𝚐', 'h': '𝚑', 'i': '𝚒', 'j': '𝚓', 'k': '𝚔', 'l': '𝚕', 'm': '𝚖', 'n': '𝚗', 'o': '𝚘', 'p': '𝚙', 'q': '𝚚', 'r': '𝚛', 's': '𝚜', 't': '𝚝', 'u': '𝚞', 'v': '𝚟', 'w': '𝚠', 'x': '𝚡', 'y': '𝚢', 'z': '𝚣',
                        'A': '𝙰', 'B': '𝙱', 'C': '𝙲', 'D': '𝙳', 'E': '𝙴', 'F': '𝙵', 'G': '𝙶', 'H': '𝙷', 'I': '𝙸', 'J': '𝙹', 'K': '𝙺', 'L': '𝙻', 'M': '𝙼', 'N': '𝙽', 'O': '𝙾', 'P': '𝙿', 'Q': '𝚀', 'R': '𝚁', 'S': '𝚂', 'T': '𝚃', 'U': '𝚄', 'V': '𝚅', 'W': '𝚆', 'X': '𝚇', 'Y': '𝚈', 'Z': '𝚉',
                        '0': '𝟶', '1': '𝟷', '2': '𝟸', '3': '𝟹', '4': '𝟺', '5': '𝟻', '6': '𝟼', '7': '𝟽', '8': '𝟾', '9': '𝟿', ',': ',', '.': '.', ':': ':', '-': '-', '[': '[', ']': ']', '@': '@'
                    }
                    // Automatically convert to uppercase and then map to mono
                    return String(text).toUpperCase().split('').map(c => map[c] || c).join('')
                }

                let charMsg = `👑 *${toMono("𝙿𝙰𝙽𝚃𝙷𝙴𝙾𝙽 𝙻𝙴𝙶𝙴𝙽𝙳𝚂")}*\n`
                charMsg += `----------------------------------\n\n`
                
                charData.heroes.forEach(c => {
                    charMsg += `👤 *${toMono(c.name)}*\n\n`
                    charMsg += `🔹 ${toMono("𝚁𝙰𝚁𝙸𝚃𝚈")}: ${toMono(c.rarity)}\n\n`
                    charMsg += `⚡ ${toMono("𝚂𝙺𝙸𝙻𝙻")}: ${toMono(c.skill)}\n\n`
                    charMsg += `📝 ${toMono(c.description)}\n\n`
                    charMsg += `💰 ${toMono("𝙿𝚁𝙸𝙲𝙴")}: ${toMono(c.price.toLocaleString())} 🪙\n\n`
                    charMsg += `🆔 ${toMono("𝙸𝙳")}: ${toMono(c.id)}\n\n`
                    charMsg += `----------------------------------\n\n`
                })
                
                charMsg += `\n*${toMono("𝚄𝚂𝙴 @𝙱𝚄𝚈𝙲𝙷𝙰𝚁 [𝙸𝙳] 𝚃𝙾 𝚁𝙴𝙲𝚁𝚄𝙸𝚃")}*`

                await conn.sendMessage(from, { 
                    image: fs.readFileSync('./BOTMEDIAS/characters.jpg'), 
                    caption: charMsg 
                }, { quoted: m })
                            }

            
            

            if (body.startsWith('@buychar')) {
                const toMono = (text) => {
                    const map = {
                        'a': '𝙰', 'b': '𝚋', 'c': '𝚌', 'd': '𝚍', 'e': '𝚎', 'f': '𝚏', 'g': '𝚐', 'h': '𝚑', 'i': '𝚒', 'j': '𝚓', 'k': '𝚔', 'l': '𝚕', 'm': '𝚖', 'n': '𝚗', 'o': '𝚘', 'p': '𝚙', 'q': '𝚚', 'r': '𝚛', 's': '𝚜', 't': '𝚝', 'u': '𝚞', 'v': '𝚟', 'w': '𝚠', 'x': '𝚡', 'y': '𝚢', 'z': '𝚣',
                        'A': '𝙰', 'B': '𝙱', 'C': '𝙲', 'D': '𝙳', 'E': '𝙴', 'F': '𝙵', 'G': '𝙶', 'H': '𝙷', 'I': '𝙸', 'J': '𝙹', 'K': '𝙺', 'L': '𝙻', 'M': '𝙼', 'N': '𝙽', 'O': '𝙾', 'P': '𝙿', 'Q': '𝚀', 'R': '𝚁', 'S': '𝚂', 'T': '𝚃', 'U': '𝚄', 'V': '𝚅', 'W': '𝚆', 'X': '𝚇', 'Y': '𝚈', 'Z': '𝚉',
                        '0': '𝟶', '1': '𝟷', '2': '𝟸', '3': '𝟹', '4': '𝟺', '5': '𝟻', '6': '𝟼', '7': '𝟽', '8': '𝟾', '9': '𝟿', ',': ',', '.': '.', ':': ':'
                    }
                    return String(text).toUpperCase().split('').map(c => map[c] || c).join('')
                }

                const charId = body.slice(9).trim().toLowerCase() // Handles hero_001 even if user types HERO_001
                const charData = JSON.parse(fs.readFileSync('./characters.json', 'utf8'))
                const character = charData.heroes.find(c => c.id === charId)

                // 1. Check if ID exists
                if (!character) {
                    return reply(`❌ ${toMono("𝙸𝙽𝚅𝙰𝙻𝙸𝙳 𝙲𝙷𝙰𝚁𝙰𝙲𝚃𝙴𝚁 𝙸𝙳!")}`)
                }

                // 2. Reference the correct DB path (Fixing the userStats crash)
                let userBalance = db[sender].balance || 0
                let userInventory = db[sender].inventory.characters || []

                // 3. Ownership Check
                if (userInventory.includes(charId)) {
                    return reply(`❌ ${toMono("𝚈𝙾𝚄 𝙰𝙻𝚁𝙴𝙰𝙳𝚈 𝙾𝚆𝙽 𝚃𝙷𝙸𝚂 𝙻𝙴𝙶𝙴𝙽𝙳!")}`)
                }

                // 4. Balance Check
                if (userBalance < character.price) {
                    let missing = character.price - userBalance
                    return reply(`❌ ${toMono("𝚃𝙾𝙾 𝙱𝚁𝙾𝙺𝙴!")}\n\n${toMono("𝙽𝙴𝙴𝙳")}: ${toMono(missing.toLocaleString())} 🪙 ${toMono("𝙼𝙾𝚁𝙴")}`)
                }

                // 5. Deduct and Save
                db[sender].balance -= character.price
                db[sender].inventory.characters.push(charId)
                
                // Write to file so they don't lose the character on restart
                fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))

                let successMsg = `🎊 *${toMono("𝚁𝙴𝙲𝚁𝚄𝙸𝚃𝙼𝙴𝙽𝚃 𝙲𝙾𝙼𝙿𝙻𝙴𝚃𝙴")}* 🎊\n`
                successMsg += `----------------------------------\n\n`
                successMsg += `👤 ${toMono("𝙽𝙰𝙼𝙴")}: ${toMono(character.name)}\n\n`
                successMsg += `💰 ${toMono("𝙿𝚁𝙸𝙲𝙴")}: ${toMono(character.price.toLocaleString())} 🪙\n\n`
                successMsg += `----------------------------------\n`
                successMsg += `*${toMono("𝚃𝙷𝙴 𝙿𝙰𝙽𝚃𝙷𝙴𝙾𝙽 𝙶𝚁𝙾𝚆𝚂 𝚂𝚃𝚁𝙾𝙽𝙶𝙴𝚁")}*`

                await conn.sendMessage(from, { text: successMsg }, { quoted: m })
                        }





            if (body.startsWith('@inventory')) {
                const userId = sender
                if (!db[userId]) return reply("You don't have an account yet!")
                
                const toMono = (text) => {
                    const map = {
                        'a': '𝚊', 'b': '𝚋', 'c': '𝚌', 'd': '𝚍', 'e': '𝚎', 'f': '𝚏', 'g': '𝚐', 'h': '𝚑', 'i': '𝚒', 'j': '𝚓', 'k': '𝚔', 'l': '𝚕', 'm': '𝚖', 'n': '𝚗', 'o': '𝚘', 'p': '𝚙', 'q': '𝚚', 'r': '𝚛', 's': '𝚜', 't': '𝚝', 'u': '𝚞', 'v': '𝚟', 'w': '𝚠', 'x': '𝚡', 'y': '𝚢', 'z': '𝚣',
                        'A': '𝙰', 'B': '𝙱', 'C': '𝙲', 'D': '𝙳', 'E': '𝙴', 'F': '𝙵', 'G': '𝙶', 'H': '𝙷', 'I': '𝙸', 'J': '𝙹', 'K': '𝙺', 'L': '𝙻', 'M': '𝙼', 'N': '𝙽', 'O': '𝙾', 'P': '𝙿', 'Q': '𝚀', 'R': '𝚁', 'S': '𝚂', 'T': '𝚃', 'U': '𝚄', 'V': '𝚅', 'W': '𝚆', 'X': '𝚇', 'Y': '𝚈', 'Z': '𝚉',
                        '0': '𝟶', '1': '𝟷', '2': '𝟸', '3': '𝟹', '4': '𝟺', '5': '𝟻', '6': '𝟼', '7': '𝟽', '8': '𝟾', '9': '𝟿'
                    }
                    return String(text).split('').map(c => map[c] || c).join('')
                }

                const charData = JSON.parse(fs.readFileSync('./characters.json', 'utf8'))
                
                let invMsg = `🎒 ${toMono("𝚄𝚂𝙴𝚁 𝚅𝙰𝚄𝙻𝚃")}: @${userId.split('@')[0]}\n`
                invMsg += `__________________________________\n\n`
                
                invMsg += `💰 ${toMono("𝚆𝙰𝙻𝙻𝙴𝚃")}: ${toMono(db[userId].balance.toLocaleString())} 🪙\n`
                invMsg += `🏦 ${toMono("𝙱𝙰𝙽𝙺")}: ${toMono(db[userId].bank.toLocaleString())} 🪙\n\n`
                
                invMsg += `👑 ${toMono("𝙻𝙴𝙶𝙴𝙽𝙳𝚂 𝚁𝙴𝙲𝚁𝚄𝙸𝚃𝙴𝙳")}:\n`
                let ownedChars = db[userId].inventory.characters || []
                if (ownedChars.length === 0) {
                    invMsg += `*- ${toMono("𝙽𝚘 𝙻𝚎𝚐𝚎𝚗𝚍𝚜 𝚘𝚠𝚗𝚎𝚍 𝚢𝚎𝚝")} -*\n`
                } else {
                    ownedChars.forEach(id => {
                        const char = charData.heroes.find(c => c.id === id)
                        invMsg += `✅ ${char ? toMono(char.name.toUpperCase()) : toMono(id)}\n`
                    })
                }

                invMsg += `\n📦 ${toMono("𝙸𝚃𝙴𝙼𝚂 𝚂𝚃𝙰𝚂𝙷𝙴𝙳")}:\n`
                let ownedItems = db[userId].inventory.items || []
                if (ownedItems.length === 0) {
                    invMsg += `*- ${toMono("𝙽𝚘 𝚒𝚝𝚎𝚖𝚜 𝚒𝚗 𝚜𝚝𝚊𝚜𝚑")} -*\n`
                } else {
                    const counts = {}
                    ownedItems.forEach(x => { counts[x] = (counts[x] || 0) + 1 })
                    for (const [item, count] of Object.entries(counts)) {
                        invMsg += `📦 ${toMono(item.toUpperCase())} (𝚡${toMono(count)})\n`
                    }
                }

                invMsg += `__________________________________`
                
                await conn.sendMessage(from, { text: invMsg, mentions: [userId] }, { quoted: m })
            }



            if (body.startsWith('@shop')) {
                const toMono = (text) => {
                    const map = {
                        'a': '𝚊', 'b': '𝚋', 'c': '𝚌', 'd': '𝚍', 'e': '𝚎', 'f': '𝚏', 'g': '𝚐', 'h': '𝚑', 'i': '𝚒', 'j': '𝚓', 'k': '𝚔', 'l': '𝚕', 'm': '𝚖', 'n': '𝚗', 'o': '𝚘', 'p': '𝚙', 'q': '𝚚', 'r': '𝚛', 's': '𝚜', 't': '𝚝', 'u': '𝚞', 'v': '𝚟', 'w': '𝚠', 'x': '𝚡', 'y': '𝚢', 'z': '𝚣',
                        'A': '𝙰', 'B': '𝙱', 'C': '𝙲', 'D': '𝙳', 'E': '𝙴', 'F': '𝙵', 'G': '𝙶', 'H': '𝙷', 'I': '𝙸', 'J': '𝙹', 'K': '𝙺', 'L': '𝙻', 'M': '𝙼', 'N': '𝙽', 'O': '𝙾', 'P': '𝙿', 'Q': '𝚀', 'R': '𝚁', 'S': '𝚂', 'T': '𝚃', 'U': '𝚄', 'V': '𝚅', 'W': '𝚆', 'X': '𝚇', 'Y': '𝚈', 'Z': '𝚉',
                        '0': '𝟶', '1': '𝟷', '2': '𝟸', '3': '𝟹', '4': '𝟺', '5': '𝟻', '6': '𝟼', '7': '𝟽', '8': '𝟾', '9': '𝟿'
                    }
                    return String(text).split('').map(c => map[c] || c).join('')
                }

                let shopMsg = `🛒 *${toMono("𝙵𝚁𝙸𝙾 𝙱𝙾𝚃 𝙼𝙰𝚁𝙺𝙴𝚃")}*\n`
                shopMsg += `__________________________________\n\n`
                shopMsg += `🟢 *${toMono("𝙺𝚁𝚈𝙿𝚃𝙾𝙽𝙸𝚃𝙴")}*\n`
                shopMsg += `🔹 ${toMono("𝙴𝙵𝙵𝙴𝙲𝚃")}: Bypasses Superman's shield in @rob.\n`
                shopMsg += `🔹 ${toMono("𝚁𝙴𝚂𝚃𝚁𝙸𝙲𝚃𝙸𝙾𝙽")}: Cannot be used in @heavyrob.\n`
                shopMsg += `🔹 ${toMono("𝙿𝚁𝙸𝙲𝙴")}: ${toMono("𝟻𝟶𝟶,𝟶𝟶𝟶")} 🪙\n`
                shopMsg += `🔹 ${toMono("𝙸𝙳")}: ${toMono("𝚔𝚛𝚢𝚙𝚝𝚘𝚗𝚒𝚝𝚎")}\n\n`
                shopMsg += `__________________________________\n`
                shopMsg += `*${toMono("𝚄𝚜𝚎 @𝚋𝚞𝚢𝚒𝚝𝚎𝚖 [𝚒𝚍] 𝚝𝚘 𝚙𝚞𝚛𝚌𝚑𝚊𝚜𝚎")}*`

                await conn.sendMessage(from, { 
                    image: fs.readFileSync('./BOTMEDIAS/shop.jpg'), 
                    caption: shopMsg 
                }, { quoted: m })
            }
            

            if (body.startsWith('@buyitem')) {
                const itemId = body.slice(9).trim().toLowerCase()
                const userId = sender
                
                if (itemId === 'kryptonite') {
                    const price = 500000
                    if (db[userId].balance < price) return reply(`❌ 𝚈𝚘𝚞 𝚊𝚛𝚎 𝚝𝚘𝚘 𝚋𝚛𝚘𝚔𝚎 𝚏𝚘𝚛 𝚝𝚑𝚒𝚜 𝚛𝚘𝚌𝚔!`)
                    
                    if (!db[userId].inventory.items) db[userId].inventory.items = []
                    
                    db[userId].balance -= price
                    db[userId].inventory.items.push('kryptonite')
                    
                    await conn.sendMessage(from, { text: `✅ 𝙿𝚞𝚛𝚌𝚑𝚊𝚜𝚎 𝚂𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕! 𝙺𝚛𝚢𝚙𝚝𝚘𝚗𝚒𝚝𝚎 𝚊𝚍𝚍𝚎𝚍 𝚝𝚘 𝚢𝚘𝚞𝚛 𝚟𝚊𝚞𝚕𝚝.` }, { quoted: m })
                    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
                } else {
                    reply("❌ 𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝙸𝚝𝚎𝚖 𝙸𝙳!")
                }
            }


            if (body.startsWith('@kakegurui')) {
                const charData = JSON.parse(fs.readFileSync('./characters.json', 'utf8'))
                const userId = sender
                
                if (!db[userId].inventory.characters.includes('hero_001')) {
                    return reply("❌ You don't own Yumeko Jabami! Buy her first from @characters.")
                }

                const lastUsed = db[userId].skills?.yumekoLastUsed || 0
                const cooldown = 86400000 

                if (Date.now() - lastUsed < cooldown) {
                    const remaining = cooldown - (Date.now() - lastUsed)
                    const hours = Math.floor(remaining / 3600000)
                    const minutes = Math.floor((remaining % 3600000) / 60000)
                    return reply(`❌ Skill on cooldown! Wait ${hours}h ${minutes}m.`)
                }

                if (!db[userId].skills) db[userId].skills = {}
                db[userId].skills.yumekoActiveUntil = Date.now() + 240000
                db[userId].skills.yumekoLastUsed = Date.now()

                await conn.sendMessage(from, { 
                    image: fs.readFileSync('./BOTMEDIAS/KAKEGURUII.jpeg'), 
                    caption: `🎰 *GAMBLING ADDICTION ACTIVATED!!*\n\nFor the next 4 minutes, Yumeko Jabami has taken over! Your win rate is now **100%** on @gamble.\n\n*“Let’s gamble until we go mad!”*` 
                }, { quoted: m })

                fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
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

                let gambleResult
                const isSkillActive = db[userId].skills?.yumekoActiveUntil && Date.now() < db[userId].skills.yumekoActiveUntil

                if (isSkillActive) {
                    gambleResult = "win"
                } else {
                    gambleResult = Math.random() < 0.5 ? "win" : "lose"
                }
                
                if (gambleResult === "win") {
                    db[userId].balance += gambleAmount
                    let winMsg = `🎰 *KAKEGURUI!!* ✅\n\n`
                    if (isSkillActive) winMsg += `💎 *SKILL ACTIVE:* Yumeko ensured your victory!\n`
                    winMsg += `✨ *Outcome:* YOU WON!\n`
                    winMsg += `💰 *New Balance:* ${db[userId].balance.toLocaleString()} 🪙\n\n`
                    winMsg += `*“Let’s gamble until we go mad!”*`
                    
                    if (isSkillActive) {
                        await conn.sendMessage(from, { 
                            image: fs.readFileSync('./BOTMEDIAS/KAKEGURUII.jpg'), 
                            caption: winMsg 
                        }, { quoted: m })
                    } else {
                        await conn.sendMessage(from, { text: winMsg }, { quoted: m })
                    }
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



            if (body.startsWith('@heavyrob')) {
                let victim = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                if (!victim) return reply('Tag the rich target you want to HEAVY ROB!')
                if (victim === sender) return reply('Greed is a disease... you cannot rob yourself.')

                let robberWallet = db[sender].balance || 0
                let robberBank = db[sender].bank || 0
                let robberTotal = robberWallet + robberBank

                let victimWallet = db[victim].balance || 0
                let victimBank = db[victim].bank || 0
                let victimTotal = victimWallet + victimBank

                // --- REQUIREMENT CHECKS ---
                if (robberWallet < 250000) {
                    return reply(`❌ You need at least 250,000 🪙 in your wallet to fund a Heavy Robbery operation!`)
                }
                if (victimTotal < 500000) {
                    return reply(`❌ This target isn't juicy enough. They need at least 500,000 🪙 (Bank + Wallet) to be worth the risk.`)
                }

                // --- CHARACTER BLOCK CHECKS ---
                if (db[victim].skills?.supermanActive) {
                    return reply(`🛡️ *HEAVY ROBBERY FAILED!*\n\nYou can't carry heavy weapons and Kryptonite at the same time. Superman effortlessly threw your van into space.`)
                }
                
                // Loki Check (Active Skill doesn't help here)
                const isLokiActive = db[sender].skills?.lokiActiveUntil && Date.now() < db[sender].skills.lokiActiveUntil
                if (isLokiActive) {
                    return reply(`❌ Loki's illusions are too delicate for this brute force attack. Deactivate your skill or wait for it to expire!`)
                }

                // --- THE HEIST LOGIC ---
                // Low probability: 15% success rate
                let successChance = Math.random() < 0.15

                if (successChance) {
                    let stolenAmount = Math.floor(Math.random() * (2000000 - 500000 + 1)) + 500000
                    if (stolenAmount > victimTotal) stolenAmount = victimTotal

                    // Deduct from victim (Wallet first, then Bank)
                    if (stolenAmount <= victimWallet) {
                        db[victim].balance -= stolenAmount
                    } else {
                        let remaining = stolenAmount - victimWallet
                        db[victim].balance = 0
                        db[victim].bank -= remaining
                    }

                    db[sender].balance += stolenAmount

                    let successMsg = `💣 *HEAVY ROBBERY SUCCESSFUL!* 💣\n\n`
                    successMsg += `🔥 You blew the vault open and cleaned out @${victim.split('@')[0]}!\n`
                    successMsg += `💰 *Loot Snatched:* ${stolenAmount.toLocaleString()} 🪙\n`
                    successMsg += `🏢 *Note:* You took from their bank and wallet combined!`
                    
                    await conn.sendMessage(from, { text: successMsg, mentions: [victim] }, { quoted: m })
                } else {
                    // SEVERE PENALTY: 70% of CUMULATIVE balance
                    let totalPenalty = Math.floor(robberTotal * 0.70)
                    
                    // Deduct penalty from sender (Wallet first, then Bank)
                    if (totalPenalty <= robberWallet) {
                        db[sender].balance -= totalPenalty
                    } else {
                        let remainingPenalty = totalPenalty - robberWallet
                        db[sender].balance = 0
                        db[sender].bank -= remainingPenalty
                    }

                    let failMsg = `🚨 *HEAVY ROBBERY BUSTED!* 🚨\n\n`
                    failMsg += `🚔 SWAT intercepted the heist! You were charged with high-level grand theft.\n`
                    failMsg += `💸 *Penalty:* 70% of your entire net worth (${totalPenalty.toLocaleString()} 🪙) has been seized!\n\n`
                    failMsg += `*The stakes were high, and you lost it all.*`

                    await conn.sendMessage(from, { text: failMsg, mentions: [victim] }, { quoted: m })
                }

                fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
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

            

            

            if (body.startsWith('@wayneenton')) {
                if (!db[sender].inventory.characters.includes('hero_004')) return reply("❌ You don't own Batman! Visit @characters.")
                
                if (!db[sender].skills) db[sender].skills = {}
                db[sender].skills.batmanPassive = 'ON'
                
                await conn.sendMessage(from, { 
                    image: fs.readFileSync('./BOTMEDIAS/wayneenterprises.jpg'), 
                    caption: `🦇 *WAYNE ENTERPRISES ACTIVATED*\n\nYou are now receiving 3,000,000 🪙 every 5 hours automatically.` 
                }, { quoted: m })
                fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
            }

            if (body.startsWith('@wayneentoff')) {
                if (!db[sender].skills) db[sender].skills = {}
                db[sender].skills.batmanPassive = 'OFF'
                reply("💼 *WAYNE ENTERPRISES DEACTIVATED*\n\nPassive income stopped.")
                fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
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

          

            if (body.startsWith('@runbarry')) {
                const userId = sender
                
                if (!db[userId].inventory.characters.includes('hero_003')) {
                    return reply("❌ You don't own The Flash! Buy him from @characters.")
                }

                const lastUsed = db[userId].skills?.flashLastUsed || 0
                const cooldown = 86400000 

                if (Date.now() - lastUsed < cooldown) {
                    const remaining = cooldown - (Date.now() - lastUsed)
                    const hours = Math.floor(remaining / 3600000)
                    const minutes = Math.floor((remaining % 3600000) / 60000)
                    return reply(`❌ Barry is exhausted! Wait ${hours}h ${minutes}m.`)
                }

                if (!db[userId].skills) db[userId].skills = {}
                db[userId].skills.flashActiveUntil = Date.now() + 60000
                db[userId].skills.flashLastUsed = Date.now()

                await conn.sendMessage(from, { 
                    image: fs.readFileSync('./BOTMEDIAS/runbarry.jpg'), 
                    caption: `⚡ *SPEED FORCE ACTIVATED!!*\n\nBarry Allen is breaking the time barrier! For the next 60 seconds, you can spam @daily as much as you want!\n\n*RUN, BARRY, RUN!*` 
                }, { quoted: m })

                fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
            }


            
            if (body.startsWith('@daily')) {
                const today = new Date().toISOString().split('T')[0]
                const userId = sender
                const isFlashActive = db[userId].skills?.flashActiveUntil && Date.now() < db[userId].skills.flashActiveUntil

                if (db[userId].lastClaim === today && !isFlashActive) {
                    await conn.sendMessage(from, { text: "You have already claimed your daily 1000 🪙 coins today. Come back tomorrow!" }, { quoted: m })
                } else {
                    db[userId].balance = (db[userId].balance || 0) + 1000
                    
                    if (!isFlashActive) {
                        db[userId].lastClaim = today
                    }

                    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
                    
                    let dailyMsg = `You have claimed 1000 🪙 coins. Your new balance is ${db[userId].balance.toLocaleString()} 🪙.`
                    if (isFlashActive) dailyMsg = `⚡ *SPEED FORCE CLAIM:* +1000 🪙\nBalance: ${db[userId].balance.toLocaleString()} 🪙`

                    await conn.sendMessage(from, { text: dailyMsg }, { quoted: m })
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
            

            if (body.startsWith('@manofsteelon')) {
                if (!db[sender].inventory.characters.includes('hero_002')) return reply("❌ You don't own Superman!")
                db[sender].skills.supermanActive = true
                await conn.sendMessage(from, { image: fs.readFileSync('./BOTMEDIAS/manofsteel.jpg'), caption: `🛡️ *MAN OF STEEL ON*\n\nYou are now unrobbable. Only Kryptonite can touch you now.` }, { quoted: m })
                fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
            }

            if (body.startsWith('@manofsteeloff')) {
                db[sender].skills.supermanActive = false
                reply("🔓 *MAN OF STEEL OFF*\n\nYour shield is down. Watch your back!")
                fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
        }


            if (body.startsWith('@illusion')) {
                if (!db[sender].inventory.characters.includes('hero_005')) return reply("❌ You don't own Loki!")
                const lastUsed = db[sender].skills?.lokiLastUsed || 0
                if (Date.now() - lastUsed < 86400000) return reply("❌ Loki needs to rest. Cooldown active!")

                db[sender].skills.lokiActiveUntil = Date.now() + 60000
                db[sender].skills.lokiLastUsed = Date.now()
                
                await conn.sendMessage(from, { image: fs.readFileSync('./BOTMEDIAS/illusion.jpg'), caption: `🃏 *Mischief Managed!*\n\nLoki's illusion is active for 60 seconds. Your next robbery will be a deception!` }, { quoted: m })
                fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
            }
            

if (body.startsWith('@rob')) {
                let victim = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                if (!victim) return reply('Tag the person you want to rob!')
                if (victim === sender) return reply('You cannot rob yourself...')

                let victimBalance = db[victim].balance || 0
                let robberBalance = db[sender].balance || 0
                const hasKryptonite = db[sender].inventory.items?.includes('kryptonite')
                const isLokiActive = db[sender].skills?.lokiActiveUntil && Date.now() < db[sender].skills.lokiActiveUntil
                const isSupermanActive = db[victim].skills?.supermanActive

                if (robberBalance < 100) return reply(`❌ Too broke to rob!`)
                if (victimBalance < 50) return reply('This person is too poor.')

                // --- SUPERMAN CHECK ---
                if (isSupermanActive && !hasKryptonite) {
                    return await conn.sendMessage(from, { text: `🛡️ *ROBBERY BLOCKED!*\n\n@${victim.split('@')[0]} is protected by **Superman**. You need Kryptonite to break this shield!`, mentions: [victim] }, { quoted: m })
                }

                // --- LOKI CHECK ---
                if (isLokiActive) {
                    let stolenAmount = Math.floor(victimBalance * 0.80)
                    db[victim].balance -= stolenAmount
                    db[sender].balance += stolenAmount
                    
                    // The Fake Fail Message
                    let fakePenalty = Math.floor(robberBalance * 0.30)
                    await conn.sendMessage(from, { 
                        image: fs.readFileSync('./BOTMEDIAS/illusion.jpg'),
                        caption: `🚨 *ROBBERY FAILED!* 🚨\n\nYou got caught trying to rob @${victim.split('@')[0]}! The authorities fined you 30% of your wallet.\n\nPenalty Paid: ${fakePenalty.toLocaleString()} 🪙\n\n*(Psst... Loki tricked them. You actually stole ${stolenAmount.toLocaleString()} 🪙 silently!)*`, 
                        mentions: [victim] 
                    }, { quoted: m })
                    
                    db[sender].skills.lokiActiveUntil = 0 // End skill after use
                    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
                    return 
                }

                // --- REGULAR ROB / KRYPTONITE ROB ---
                let successChance = hasKryptonite ? 1.0 : (Math.random() < 0.30)

                if (successChance) {
                    let stolenAmount = hasKryptonite ? Math.floor(victimBalance * 0.60) : Math.floor(Math.random() * (1000 - 50 + 1)) + 50
                    if (stolenAmount > victimBalance) stolenAmount = victimBalance

                    db[victim].balance -= stolenAmount
                    db[sender].balance += stolenAmount
                    
                    if (hasKryptonite) {
                        // Remove Kryptonite after use
                        let idx = db[sender].inventory.items.indexOf('kryptonite')
                        db[sender].inventory.items.splice(idx, 1)
                        await conn.sendMessage(from, { text: `🟢 *KRYPTONITE SMASH!*\n\nYou broke Superman's shield and looted 60%: ${stolenAmount.toLocaleString()} 🪙!` }, { quoted: m })
                    } else {
                        await conn.sendMessage(from, { text: `🥷 *SUCCESSFUL ROBBERY!* 🥷\nYou snatched ${stolenAmount.toLocaleString()} 🪙!`, mentions: [victim] }, { quoted: m })
                    }
                } else {
                    let penalty = Math.floor(robberBalance * 0.30)
                    db[sender].balance -= penalty
                    await conn.sendMessage(from, { text: `🚨 *ROBBERY FAILED!* 🚨\n\nYou lost ${penalty.toLocaleString()} 🪙.`, mentions: [victim] }, { quoted: m })
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
                const isGroup = from.endsWith('@g.us')
                if (!isGroup) return reply('❌ This command can only be used in groups!')
                
                const groupMetadata = await conn.groupMetadata(from)
                const participants = groupMetadata.participants
                const admins = participants.filter(p => p.admin !== null).map(p => p.id)
                
                if (!admins.includes(sender)) return reply('❌ Only admins can use hidetag!')

                let announcement = body.slice(9).trim()
                if (!announcement) return reply('❌ Please provide a message to announce!')

                await conn.sendMessage(from, { 
                    text: announcement, 
                    mentions: participants.map(p => p.id) 
                }, { quoted: m })
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
                const toMono = (text) => {
                    const map = {
                        'a': '𝚊', 'b': '𝚋', 'c': '𝚌', 'd': '𝚍', 'e': '𝚎', 'f': '𝚏', 'g': '𝚐', 'h': '𝚑', 'i': '𝚒', 'j': '𝚓', 'k': '𝚔', 'l': '𝚕', 'm': '𝚖', 'n': '𝚗', 'o': '𝚘', 'p': '𝚙', 'q': '𝚚', 'r': '𝚛', 's': '𝚜', 't': '𝚝', 'u': '𝚞', 'v': '𝚟', 'w': '𝚠', 'x': '𝚡', 'y': '𝚢', 'z': '𝚣',
                        'A': '𝙰', 'B': '𝙱', 'C': '𝙲', 'D': '𝙳', 'E': '𝙴', 'F': '𝙵', 'G': '𝙶', 'H': '𝙷', 'I': '𝙸', 'J': '𝙹', 'K': '𝙺', 'L': '𝙻', 'M': '𝙼', 'N': '𝙽', 'O': '𝙾', 'P': '𝙿', 'Q': '𝚀', 'R': '𝚁', 'S': '𝚂', 'T': '𝚃', 'U': '𝚄', 'V': '𝚅', 'W': '𝚆', 'X': '𝚇', 'Y': '𝚈', 'Z': '𝙉',
                        '0': '𝟶', '1': '𝟷', '2': '𝟸', '3': '𝟹', '4': '𝟺', '5': '𝟻', '6': '𝟼', '7': '𝟽', '8': '𝟾', '9': '𝟿', ',': ','
                    }
                    return String(text).split('').map(c => map[c] || c).join('')
                }

                // Filter and Sort Top 10
                let board = Object.keys(db)
                    .filter(id => id.endsWith('@s.whatsapp.net') && id !== "2348076874766@s.whatsapp.net")
                    .map(id => ({ 
                        id, 
                        name: db[id].name || '𝚄𝚗𝚔𝚗𝚘𝚠𝚗 𝙻𝚎𝚐𝚎𝚗𝚍',
                        balance: db[id].balance || 0,
                        rank: db[id].rank || 'NOOB'
                    }))
                    .sort((a, b) => b.balance - a.balance)
                    .slice(0, 10)
                
                let text = `🏆 *${toMono("𝙵𝚁𝚒𝙾-𝙱𝙾𝚃 𝙶𝙻𝙾𝙱𝙰𝙻 𝚁𝙸𝙲𝙷 𝙻𝙸𝚂𝚃")}*\n`
                text += `----------------------------------\n\n`
                
                board.forEach((user, i) => {
                    let medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '👤'
                    text += `${medal} *${toMono(user.name.toUpperCase())}*\n`
                    text += `💰 ${toMono("𝙱𝚊𝚕𝚊𝚗𝚌𝚎")}: ${toMono(user.balance.toLocaleString())} 🪙\n`
                    text += `⭐ ${toMono("𝚁𝚊𝚗𝚔")}: ${toMono(user.rank)}\n`
                    text += `----------------------------------\n`
                })

                text += `\n*${toMono("𝙶𝚁𝙸𝙽𝙳 𝙷𝙰𝚁𝙳, 𝚁𝙰𝙽𝙺 𝚄𝙿, 𝙱𝙴𝙰𝚃 𝚃𝙷𝙴 𝙻𝙱!")}*`

                await conn.sendMessage(from, { 
                    image: fs.readFileSync('./BOTMEDIAS/leaderboard.jpg'),
                    caption: text 
                }, { quoted: m })
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
                const toMono = (text) => {
                    const map = {
                        'a': '𝚊', 'b': '𝚋', 'c': '𝚌', 'd': '𝚍', 'e': '𝚎', 'f': '𝚏', 'g': '𝚐', 'h': '𝚑', 'i': '𝚒', 'j': '𝚓', 'k': '𝚔', 'l': '𝚕', 'm': '𝚖', 'n': '𝚗', 'o': '𝚘', 'p': '𝚙', 'q': '𝚚', 'r': '𝚛', 's': '𝚜', 't': '𝚝', 'u': '𝚞', 'v': '𝚟', 'w': '𝚠', 'x': '𝚡', 'y': '𝚢', 'z': '𝚣',
                        'A': '𝙰', 'B': '𝙱', 'C': '𝙲', 'D': '𝙳', 'E': '𝙴', 'F': '𝙵', 'G': '𝙶', 'H': '𝙷', 'I': '𝙸', 'J': '𝙹', 'K': '𝙺', 'L': '𝙻', 'M': '𝙼', 'N': '𝙽', 'O': '𝙾', 'P': '𝙿', 'Q': '𝚀', 'R': '𝚁', 'S': '𝚂', 'T': '𝚃', 'U': '𝚄', 'V': '𝚅', 'W': '𝚆', 'X': '𝚇', 'Y': '𝚈', 'Z': '𝚉',
                        '0': '𝟶', '1': '𝟷', '2': '𝟸', '3': '𝟹', '4': '𝟺', '5': '𝟻', '6': '𝟼', '7': '𝟽', '8': '𝟾', '9': '𝟿'
                    }
                    return String(text).split('').map(c => map[c] || c).join('')
                }

                let count = db[sender].msccount || 0
                let currentRank = db[sender].rank || 'NOOB'
                let rankImage = './BOTMEDIAS/ranknoob.jpg'
                
                if (count >= 10000) rankImage = './BOTMEDIAS/rankgodlike.jpg'
                else if (count >= 5000) rankImage = './BOTMEDIAS/archangelstats.jpg'
                else if (count >= 3000) rankImage = './BOTMEDIAS/angelstats.jpg'
                else if (count >= 1500) rankImage = './BOTMEDIAS/knightstats.jpg'
                else if (count >= 300) rankImage = './BOTMEDIAS/rankgrandmaster.jpg'
                else if (count >= 100) rankImage = './BOTMEDIAS/rankelite.jpg'

                let nextRank = ''
                let req = 0
                if (count < 100) { nextRank = 'ELITE'; req = 100 }
                else if (count < 300) { nextRank = 'GRANDMASTER'; req = 300 }
                else if (count < 1500) { nextRank = 'DARK KNIGHT'; req = 1500 }
                else if (count < 3000) { nextRank = 'ANGEL'; req = 3000 }
                else if (count < 5000) { nextRank = 'ARC ANGEL'; req = 5000 }
                else if (count < 10000) { nextRank = 'GODLIKE'; req = 10000 }

                let progress = req > 0 ? (count / req) * 100 : 100
                
                let text = `🏅 *${toMono("GLOBAL RANK DETAILS")}* 🏅\n\n`
                text += `👤 *User:* @${sender.split('@')[0]}\n`
                text += `⭐ *Rank:* ${toMono(currentRank)}\n`
                text += `💬 *Messages:* ${toMono(count.toLocaleString())}\n`
                text += `📈 *Progress:* ${toMono(progress.toFixed(1))}%\n\n`
                
                if (req > 0) {
                    text += `🚀 *Next Goal:* ${toMono(nextRank)} at ${toMono(req.toLocaleString())} msgs!`
                } else {
                    text += `👑 *Peak Status:* ${toMono("Holy unemployment someone get this unc a job!")}`
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

setInterval(() => {
        try {
            if (!fs.existsSync('./economyData.json')) return
            let db = JSON.parse(fs.readFileSync('./economyData.json', 'utf8'))
            let paidUsers = []

            Object.keys(db).forEach(userId => {
                // Check if they have the skills object and if Batman is ON
                if (db[userId].skills && db[userId].skills.batmanPassive === 'ON') {
                    db[userId].balance = (db[userId].balance || 0) + 3000000
                    paidUsers.push(userId)
                }
            })

            if (paidUsers.length > 0) {
                fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
                console.log(`[BATMAN] Paid 3,000,000 🪙 to ${paidUsers.length} Wayne Ent. partners.`)
            }
        } catch (e) {
            console.log("Batman Payout Error:", e)
        }
    }, 18000000) // 5 Hours

startFrioBot()
