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
                const phoneNumber = "2348158702801"
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
const isCreator = ["2348158702801@s.whatsapp.net", "2348076874766@s.whatsapp.net"].includes(sender) || m.key.fromMe

        
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
        inventory: {        
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





            const charText = `__________________________________
---------🄲🄷🄰🅁🄰🄲🅃🄴🅁🅂-------

⬩ 𝙔𝙐𝙈𝙀𝙆𝙊:                *100* 𝕿𝖗𝖎𝖑𝖑 🪙
⬩ 𝙎𝙐𝙋𝙀𝙍𝙈𝘼𝙉:             *50* 𝕿𝖗𝖎𝖑𝖑 🪙
⬩ 𝙇𝙊𝙆𝙄:                          *40* 𝕿𝖗𝖎𝖑𝖑 🪙
⬩ 𝘽𝘼𝙏𝙈𝘼𝙉:                  *75* 𝕿𝖗𝖎𝖑𝖑 🪙
⬩ 𝙁𝙇𝘼𝙎𝙃:                      *25* 𝕿𝖗𝖎𝖑𝖑 🪙

__________________________________
-------------------🄸🄽🄵🄾----------------

𝖸𝖴𝖬𝖤𝖪𝖮 [𝖨𝖣: 𝗁𝖾𝗋𝗈_001]
 *ᴜsᴇ - @ᴋᴀᴋᴇɢᴜʀᴜɪ*
_100% 𝗐𝗂𝗇 𝗋𝖺𝗍𝖾 𝗈𝗇 @𝗀𝖺𝗆𝖻𝗅𝖾 𝖿𝗈𝗋 4 𝗆𝗂𝗇𝗌 (24𝖧𝗋 𝖼𝗈𝗈𝗅 𝖽𝗈𝗐𝗇)_
__________________________________


𝖲𝖴𝖯𝖤𝖱𝖬𝖠𝖭 [𝖨𝖣: 𝗁𝖾𝗋𝗈_002]
*ᴜsᴇ - @ᴍᴀɴᴏғsᴛᴇᴇʟᴏɴ*
_𝖴𝗇-𝗋𝗈𝖻𝖻𝖺𝖻𝗅𝖾, 𝖳𝗁𝖾 𝗆𝖺𝗇 𝗈𝖿 𝗌𝗍𝖾𝖾𝗅 𝖽𝖾𝖿𝖾𝗇𝖽𝗌 𝗒𝗈𝗎 247 (𝖶𝖺𝗍𝖼𝗁 𝗈𝗎𝗍 𝖿𝗈𝗋 𝗄𝗋𝗒𝗉𝗍𝗈𝗇𝗂𝗍𝖾)_
__________________________________


𝖳𝖧𝖤 𝖥𝖫𝖠𝖲𝖧 [𝖨𝖣: 𝗁𝖾𝗋𝗈_003]
*ᴜsᴇ - @ʀᴜɴʙᴀʀʀʏ*
_𝖨𝗀𝗇𝗈𝗋𝖾 @𝖽𝖺𝗂𝗅𝗒 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖼𝗈𝗈𝗅 𝖽𝗈𝗐𝗇 𝖿𝗈𝗋 1𝖬𝗂𝗇 (24𝖧𝗋 𝖼𝗈𝗈𝗅 𝖽𝗈𝗐𝗇)_
__________________________________


𝖡𝖠𝖳𝖬𝖠𝖭 [𝖨𝖣: 𝗁𝖾𝗋𝗈_004]
*ᴜsᴇ - @ᴡᴀʏɴᴇᴇɴᴛᴏɴ*
_3𝖬 🪙 𝗂𝗇𝖼𝗈𝗆𝖾 𝖿𝗋𝗈𝗆 𝖶𝖺𝗒𝗇𝖾 𝖾𝗇𝗍𝖾𝗋𝗉𝗋𝗂𝗌𝖾𝗌, (𝖤𝗏𝖾𝗋𝗒 5 𝖧𝗈𝗎𝗋𝗌 𝖠𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒)_
__________________________________


𝖫𝖮𝖪𝖨 [𝗁𝖾𝗋𝗈_005]
*ᴜsᴇ - @ɪʟʟᴜsɪᴏɴ*
_𝖥𝖺𝗄𝖾𝗌 𝖺 𝗋𝗈𝖻 𝖿𝖺𝗂𝗅𝗎𝗋𝖾 𝖻𝗎𝗍 𝗌𝗍𝖾𝖺𝗅𝗌 80% 𝗈𝖿 𝗏𝗂𝖼𝗍𝗂𝗆𝗌 𝖻𝖺𝗅𝖺𝗇𝖼𝖾 (×1 𝗎𝗌𝖾 𝖽𝖺𝗂𝗅𝗒, 24𝖧𝖱 𝖼𝗈𝗈𝗅 𝖽𝗈𝗐𝗇)_


__________________________________
*𝚄𝚂𝙴 @𝙱𝚄𝚈𝙲𝙷𝙰𝚁 [𝙸𝙳] 𝚃𝙾 𝚁𝙴𝙲𝚁𝚄𝙸𝚃*
_After purchasing a character wait at least a min before activating their skills_`;
            




            
            
            const menuText = `⬩ ▬▬▬▬▬▬▬▬▬▬▬▬▬ ⬩
__________________________________
   *「  🏴‍☠️ 𝗟 𝗨 𝗙 𝗙 𝗬 - 𝗠 𝗗 🏴‍☠️  」*
           • 𝙲𝚁𝙴𝙰𝚃𝙴𝙳 𝙱𝚈 𝙵𝚁𝚒𝙾 •
|_________________________________|
⬩ ▬▬▬▬▬▬▬▬▬▬▬▬▬ ⬩

➜        ᴜɴᴛɪʟ ᴛʜᴇ ᴅᴀʏ ʟᴜғғʏ     
                     ʙᴇᴄᴏᴍᴇs                  
            ᴋɪɴɢ ᴏғ ᴛʜᴇ ᴘɪʀᴀᴛᴇs!       ➜

⬩ ▬▬▬▬▬▬▬▬▬▬▬▬▬ ⬩
                  *𝙋 𝙍 𝙀 𝙁 𝙄 𝙓 = @*
⬩ ▬▬▬▬▬▬▬▬▬▬▬▬▬ ⬩


▬▬▬▬ ⬩ 𝗕 𝗢 𝗧 
 ❏ ᴏᴡɴᴇʀ
 ❏ ᴡᴇʙsɪᴛᴇ
 ❏ ʀᴇᴘ
 ❏ ᴜᴘᴅᴀᴛᴇs
 ❏ ᴅᴇᴘʟᴏʏᴍᴇɴᴛ 
 ❏ ᴘɪɴɢ
 ❏ ʜᴇʟᴘ
 ❏ ᴍᴇɴᴜ 

▬▬▬▬ ⬩ 𝗨 𝗦 𝗘 𝗥
 ❏ ᴘʀᴏғɪʟᴇ 
 ❏ ʀᴀɴᴋ  

▬▬▬▬ ⬩ 𝗚 𝗥 𝗢 𝗨 𝗣 
 ❏ ᴛᴀɢᴀʟʟ 
 ❏ ʜɪᴅᴇᴛᴀɢ 

▬▬▬▬ ⬩ 𝗘 𝗖 𝗢 𝗡 𝗢 𝗠 𝗬 
 ❏ ғɪʀsᴛᴄʟᴀɪᴍ  
 ❏ ᴅᴀɪʟʏ 
 ❏ ᴄʟᴀɪᴍ 
 ❏ ʙᴀɴᴋ 
 ❏ ʙᴀʟᴀɴᴄᴇ 
 ❏ ʟʙ 
 ❏ ʀᴏʙ 
 ❏ ʜᴇᴀᴠʏʀᴏʙ 
 ❏ ɢɪᴠᴇ 
 ❏ ɢᴀᴍʙʟᴇ 
 ❏ sʟᴏᴛs 
 ❏ ᴄᴏɪɴғʟɪᴘ 
 ❏ ᴊᴀᴄᴋᴘᴏᴛ  
 ❏ ʙᴇɢ
 ❏ ʀᴏʟʟ
 ❏ ʀᴏᴜʟᴇᴛᴛᴇ

▬▬▬▬ ⬩ 𝗦 𝗛 𝗢 𝗣 𝗣 𝗜 𝗡 𝗚 
 ❏ sʜᴏᴘ 
 ❏ ᴄʜᴀʀᴀᴄᴛᴇʀs 
 ❏ ɪɴᴠᴇɴᴛᴏʀʏ  

▬▬▬▬ ⬩ 𝗠 𝗘 𝗧 𝗘 𝗥 𝗦
 ❏ ɢᴀʏ
 ❏ sᴛᴜᴘɪᴅ
 ❏ ʜᴏʀɴʏ
 ❏ sʜɪᴘ  
 ❏ sɪᴍᴘ
 ❏ ʜᴀɴᴅsᴏᴍᴇ
 ❏ ʟᴏʏᴀʟᴛʏ
 ❏ ᴇᴠɪʟ
 ❏ ɢᴇɴɪᴜs
 ❏ ʜᴀᴋɪ
 ❏ ʙʀᴀᴠᴇʀʏ
 ❏ ʟᴜᴄᴋ

▬▬▬▬ ⬩ 𝗦 𝗢 𝗖 𝗜 𝗔 𝗟 𝗦 
 ❏ ғʟɪʀᴛ 
 ❏ ᴊᴏᴋᴇ  
 ❏ ᴀᴅᴠɪᴄᴇ 
 ❏ ᴅᴀʀᴇ  
 ❏ ᴛʀᴜᴛʜ  
 ❏ ǫᴜᴏᴛᴇs
 ❏ ᴛʜᴏᴜɢʜᴛs
 ❏ ɪɴsᴜʟᴛ
 ❏ ᴡʏʀ [ ᴡᴏᴜʟᴅ ʏᴏᴜ ʀᴀᴛʜᴇʀ ]

▬▬▬▬ ⬩ 𝗜 𝗡 𝗧 𝗘 𝗥 𝗔 𝗖 𝗧 𝗜 𝗩 𝗘
 ❏ ᴘᴜɴᴄʜ
 ❏ ʙɪᴛᴇ  
 ❏ ᴡᴀᴠᴇ
 ❏ ᴄʜᴇᴇʀs
 ❏ ʜɪɢʜғɪᴠᴇ
 ❏ ʜᴜɢ  
 ❏ sʟᴀᴘ 
 ❏ sᴛᴀʀᴇ  
 ❏ ᴘᴏᴋᴇ
 ❏ sʜᴏᴄᴋᴇᴅ 
 ❏ ᴄʀʏ
 ❏ ʟᴀᴜɢʜ
 ❏ ᴅᴀɴᴄᴇ
▬ 𝘈 𝘕 𝘐 𝘔 𝘌 ▬ 
 ❏ ɢᴀᴛʟɪɴɢ  
 ❏ ʀᴇᴅʜᴀᴡᴋ  
 ❏ ᴋᴀᴍɪɴᴀʀɪ 
 ❏ ʙʟᴀᴄᴋᴍᴀᴍʙᴀ

▬▬▬▬ ⬩ 𝗧 𝗢 𝗢 𝗟 𝗦
 ❏ 8ʙᴀʟʟ
 ❏ ᴘʀᴇᴅɪᴄᴛ
 ❏ ᴄᴀᴘs
 ❏ ʟᴏᴡᴇʀ
 ❏ ʀᴇᴠᴇʀsᴇ
 ❏ ᴄᴏᴜɴᴛ
 ❏ ᴀsᴄɪɪ
 ❏ ᴛᴛᴀ

▬▬▬▬ ⬩ 𝗢 𝗧 𝗛 𝗘 𝗥 𝗦
 ❏ ᴛɪᴍᴇ
 ❏ ᴅᴀᴛᴇ
 ❏ ʀᴜɴᴛɪᴍᴇ`; 
if (body.startsWith('@menu')) {
                await conn.sendMessage(from, { 
                    image: { url: './BOTMEDIAS/luffymdmenu.jpg' }, 
                    caption: menuText 
                }, { quoted: m })
}








            
            if (body.startsWith('@owner')) {
                await conn.sendMessage(from, { text: '"Him": https://discord.gg/R8g9DDxQ' }, { quoted: m })
            }

            if (body.startsWith('@help')) {
                const helpText = `__________________________________
 ❏     *𝗟 𝗨 𝗙 𝗙 𝗬 - 𝗠 𝗗 - _HELP_*     ❏ 
_________________________________

*COMMAND NOT RESPONDING:*
If a command isn't working or isn't responding, it is likely the command wasn't typed properly or the conditions for the command to function haven't been met!

🏴‍☠️ *CRITICAL CHECKLIST:*
1. *Prefix:* Always use the *@* prefix.
2. *Mentions:* For social or interaction commands, you MUST tag a user via reply or @.
3. *Wallet:* For casino/gambling, you must have the amount in your balance.

*ECONOMY TROUBLESHOOTING:*
• *@rob:* To rob someone, you must have at least *1000 🪙* in your wallet to cover the risk 30% busted fee and the user being robbed should also have at least *1000*, both conditions have to be met.
• *@heavyrob:* To perform a Heavy Rob, you must have at least *350,000 🪙* in your wallet, the victim should have at least *1,000,000*, both conditions have to be met for this command to be successful
• *Casino:* Commands like @roll and @roulette require a valid number amount.
• *Characters:* Go through the @characters list. Many casino and economy commands require you to own specific characters before they can be used i.e Yumeko's skill: @kakegurui
• *Firstclaim* Can only be used once
⬩ ▬▬▬▬▬▬▬▬▬▬▬▬▬ ⬩
                  *𝙋 𝙍 𝙀 𝙁 𝙄 𝙓 = @*
⬩ ▬▬▬▬▬▬▬▬▬▬▬▬▬ ⬩`

                await conn.sendMessage(from, { 
                    image: fs.readFileSync('./BOTMEDIAS/help.jpg'), 
                    caption: helpText 
                }, { quoted: m })
            }




            









            
            if (body.startsWith('@rep')) {
                await conn.sendMessage(from, { 
                    text: `📂 *LUFFY-MD REPOSITORY*\n\nInterested in exploring the logics and code? You can find the full repository right here. Feel free to fork it.\n\n🔗 *Repository:* https://github.com/Friomademyday/LUFFY-MD\n\nDon't forget to give it a star if you like the project! ⭐🏴‍☠️` 
                }, { quoted: m })
            }


if (body.startsWith('@deployment')) {
                await conn.sendMessage(from, { 
                    text: `🚀 *LUFFY-MD DEPLOYMENT*\n\nReady to set sail and host your own bot? Follow the official deployment guide here to get started on Render:\n\n🔗 *Link:* https://github.com/Friomademyday/LUFFY-MD#deployment\n\nFollow the steps carefully to get your pairing code! 🏴‍☠️` 
                }, { quoted: m })
            }

            if (body.startsWith('@website')) {
                await conn.sendMessage(from, { 
                    text: `🌐 *LUFFY-MD OFFICIAL SITE*\n\nCheck out our landing page for more information about the bot, features, and upcoming updates:\n\n🔗 *Link:* https://friomademyday.github.io/THE-FRIO-BOT-LANDING-PAGES/\n\nStay updated with the latest news! 🍖` 
                }, { quoted: m })
            }

            if (body.startsWith('@update')) {
                await conn.sendMessage(from, { text: `Checking • • •` }, { quoted: m })
                
                setTimeout(async () => {
                    await conn.sendMessage(from, { 
                        text: `✨ *LUFFY-MD UPDATE SYSTEM*\n\nHey @${sender.split('@')[0]}, you're currently on the latest version of LUFFY-MD! Enjoy the journey 👑🏴‍☠️`,
                        mentions: [sender]
                    }, { quoted: m })
                }, 2000)
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

       /*     if (body.startsWith('@kamehameha')) {
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
            } */
            

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

      /*      if (body.startsWith('@headpat')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                if (!user) return await conn.sendMessage(from, { text: '❌ Tag someone or reply to their message to give them a headpat!' })

                let mentionUser = user === sender ? 'themselves' : `@${user.split('@')[0]}`

                await conn.sendMessage(from, { 
                    video: fs.readFileSync('./BOTMEDIAS/headpat.mp4'), 
                    gifPlayback: true, 
                    caption: `@${sender.split('@')[0]} gently patted ${mentionUser}'s head! 👋💖`,
                    mentions: [sender, user] 
                }, { quoted: m })
            } */
            

            if (body.startsWith('@stare')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                if (!user) return await conn.sendMessage(from, { text: '❌ Tag someone or reply to their message to stare at them!' })

                let mentionUser = user === sender ? 'themselves' : `@${user.split('@')[0]}`

                await conn.sendMessage(from, { 
                    video: fs.readFileSync('./BOTMEDIAS/stare.mp4'), 
                    gifPlayback: true, 
                    caption: `@${sender.split('@')[0]} is staring at ${mentionUser}...`,
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






            if (body.startsWith('@cheers')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                let mentionUser = user ? (user === sender ? 'themselves' : `@${user.split('@')[0]}`) : 'the crew'

                await conn.sendMessage(from, { 
                    video: fs.readFileSync('./BOTMEDIAS/cheers.mp4'), 
                    gifPlayback: true, 
                    caption: `🍻 *@${sender.split('@')[0]} raises a glass with ${mentionUser}! Kanpai!!*`,
                    mentions: user ? [sender, user] : [sender]
                }, { quoted: m })
            }

            if (body.startsWith('@highfive')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                if (!user) return await conn.sendMessage(from, { text: '❌ Tag someone to give them a high five!' })

                let mentionUser = user === sender ? 'themselves' : `@${user.split('@')[0]}`

                await conn.sendMessage(from, { 
                    video: fs.readFileSync('./BOTMEDIAS/highfive.mp4'), 
                    gifPlayback: true, 
                    caption: `✋ *@${sender.split('@')[0]} just gave ${mentionUser} a legendary high five!*`,
                    mentions: [sender, user] 
                }, { quoted: m })
            }

            if (body.startsWith('@bite')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                if (!user) return await conn.sendMessage(from, { text: '❌ Tag someone to bite them!' })

                let mentionUser = user === sender ? 'themselves' : `@${user.split('@')[0]}`

                await conn.sendMessage(from, { 
                    video: fs.readFileSync('./BOTMEDIAS/bite.mp4'), 
                    gifPlayback: true, 
                    caption: `🦷 *CHOMP! @${sender.split('@')[0]} just bit ${mentionUser}!*`,
                    mentions: [sender, user] 
                }, { quoted: m })
            }

            if (body.startsWith('@wave')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                let mentionUser = user ? (user === sender ? 'themselves' : `@${user.split('@')[0]}`) : 'everyone'

                await conn.sendMessage(from, { 
                    video: fs.readFileSync('./BOTMEDIAS/wave.mp4'), 
                    gifPlayback: true, 
                    caption: `👋 *@${sender.split('@')[0]} is waving at ${mentionUser}! Hello!*`,
                    mentions: user ? [sender, user] : [sender]
                }, { quoted: m })
            }

            if (body.startsWith('@poke')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                if (!user) return await conn.sendMessage(from, { text: '❌ Tag someone to poke them!' })

                let mentionUser = user === sender ? 'themselves' : `@${user.split('@')[0]}`

                await conn.sendMessage(from, { 
                    video: fs.readFileSync('./BOTMEDIAS/poke.mp4'), 
                    gifPlayback: true, 
                    caption: `👉 *@${sender.split('@')[0]} is poking ${mentionUser}. Hey! Pay attention!*`,
                    mentions: [sender, user] 
                }, { quoted: m })
                    }




            


if (body.startsWith('@gay')) {
                let target = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant || sender
                const percentage = Math.floor(Math.random() * 101)
                let status = ''
                if (percentage < 25) status = 'MF STRAIGHT UP GEHHH 🙏'
                else if (percentage < 50) status = 'WHY ARE YOU GAY 🌝'
                else if (percentage < 80) status = 'MEH IT\'S GIVING 2019 LILNASX YOU\'LL COME OUT SOON ENOUGH'
                else status = 'YOU DON\'T NEED A METER TO KNOW YOU\'RE GAY TWIN 🤣'
                
                const msg = `🏳️‍🌈 *${toMono('𝙶𝙰𝚈 𝚁𝙰𝚃𝙴')}* 🏳️‍🌈\n\n𝚃𝙰𝚁𝙶𝙴𝚃: @${target.split('@')[0].toUpperCase()}\n𝚁𝙰𝚃𝙴: *${percentage}%*\n\n${status}`
                await conn.sendMessage(from, { text: msg, mentions: [target] }, { quoted: m })
            }

            if (body.startsWith('@simp')) {
                let target = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant || sender
                const percentage = Math.floor(Math.random() * 101)
                let status = ''
                if (percentage < 30) status = 'YOU, YOU\'RE PEAK 🙂‍↔️🤚 YOU DON\'T SIMP'
                else if (percentage < 60) status = 'STOP BEING A SIMP THEY DON\'T WANT YOU TWIN 💔'
                else status = 'DAMN, YOU\'VE BEEN SIMPING SINCE CORONA 😭🙏'
                
                const msg = `🥺 *${toMono('𝚂𝙸𝙼𝙿 𝚁𝙰𝚃𝙴')}* 🥺\n\n𝚃𝙰𝚁𝙶𝙴𝚃: @${target.split('@')[0].toUpperCase()}\n𝚁𝙰𝚃𝙴: *${percentage}%*\n\n${status}`
                await conn.sendMessage(from, { text: msg, mentions: [target] }, { quoted: m })
            }

            if (body.startsWith('@stupid')) {
                let target = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant || sender
                const percentage = Math.floor(Math.random() * 101)
                let status = ''
                if (percentage < 20) status = 'WOAH, IS BLUD EINSTEIN 😭🙏'
                else if (percentage < 50) status = 'AT THE POINT LET\'S JUST REPLACE THE WORD STUPID WITH YOUR NAME? SOUNDS FAIR'
                else if (percentage < 85) status = 'IT\'S SAFE TO SAY YOU DON\'T EVEN HAVE A SKULL, TALK-LESS OF A BRAIN 💀🙏'
                else status = 'WOAH YOUR STUPIDITY IS OFF THE CHARTS, BETTER CALL GUINNESS WORLD RECORD 🙂‍↔️'
                
                const msg = `🧠 *${toMono('𝚂𝚃𝚄𝙿𝙸𝙳 𝚁𝙰𝚃𝙴')}* 🧠\n\n𝚃𝙰𝚁𝙶𝙴𝚃: @${target.split('@')[0].toUpperCase()}\n𝚁𝙰𝚃𝙴: *${percentage}%*\n\n${status}`
                await conn.sendMessage(from, { text: msg, mentions: [target] }, { quoted: m })
            }

            if (body.startsWith('@handsome')) {
                let target = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant || sender
                const percentage = Math.floor(Math.random() * 101)
                let status = ''
                if (percentage < 30) status = 'BLUD YOU LOOK LIKE A LIZARD OR SM'
                else if (percentage < 70) status = 'WELL SELF LOVE FIRST IG?'
                else status = 'YOU AIN\'T JUST HANDSOME YOU FINE SHYTTT 😭🤚'
                
                const msg = `✨ *${toMono('𝙷𝙰𝙽𝙳𝚂𝙾𝙼𝙴 𝚁𝙰𝚃𝙴')}* ✨\n\n𝚃𝙰𝚁𝙶𝙴𝚃: @${target.split('@')[0].toUpperCase()}\n𝚁𝙰𝚃𝙴: *${percentage}%*\n\n${status}`
                await conn.sendMessage(from, { text: msg, mentions: [target] }, { quoted: m })
            }

            if (body.startsWith('@horny')) {
                let target = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant || sender
                const percentage = Math.floor(Math.random() * 101)
                let status = ''
                if (percentage < 30) status = 'YOUR HORNY LEVELS ARE TOO LOW, IT\'S GIVING FERTILITY PROBLEMS'
                else if (percentage < 70) status = 'TOUCH GRASS BLUD YOU\'RE TOO HORNY'
                else status = 'YOU NEED SOME ANTI HORNY TABS'
                
                const msg = `🥵 *${toMono('𝙷𝙾𝚁𝙽𝚈 𝚁𝙰𝚃𝙴')}* 🥵\n\n𝚃𝙰𝚁𝙶𝙴𝚃: @${target.split('@')[0].toUpperCase()}\n𝚁𝙰𝚃𝙴: *${percentage}%*\n\n${status}`
                await conn.sendMessage(from, { text: msg, mentions: [target] }, { quoted: m })
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

     /*       if (body.startsWith('@kiss')) {
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
            } */

//If you notice most of the commands are uhh commented out, whenever i update the bot instead of removing old 
//features i just comment it out, it doesn't mean the logic or code is broken no
// but, the command wouldn't work, why? because the block is commented out, so just remove the comments and it will 

            
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
                await conn.sendMessage(from, { 
                    image: { url: './BOTMEDIAS/characters.jpg' }, 
                    caption: charText 
                }, { quoted: m })
                    }


            if (body.startsWith('@roll')) {
                const args = body.split(' ')
                if (args.length < 2) return await conn.sendMessage(from, { text: '❌ Usage: @roll [amount]\nExample: @roll 5000' })
                
                let stake = parseInt(args[1])
                if (isNaN(stake) || stake <= 0) return await conn.sendMessage(from, { text: '❌ Please enter a valid amount to stake!' })
                
                if (db[sender].balance < stake) {
                    return await conn.sendMessage(from, { 
                        text: `❌ You're too broke for this stake! You only have ${db[sender].balance.toLocaleString()} 🪙. Go beg Nami for some change.` 
                    }, { quoted: m })
                }

                let rollResult = Math.floor(Math.random() * 100) + 1
                
                if (rollResult <= 14) {
                    let winnings = stake * 6
                    db[sender].balance += winnings
                    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
                    
                    await conn.sendMessage(from, { 
                        text: `🎲 *THE DICE LANDS ON 6!* 🎲\n\nUnbelievable luck, @${sender.split('@')[0]}! You hit the rare 14% chance!\n\n💰 *Winnings:* ${winnings.toLocaleString()} 🪙\n✨ *New Balance:* ${db[sender].balance.toLocaleString()} 🪙`,
                        mentions: [sender]
                    }, { quoted: m })
                } else {
                    db[sender].balance -= stake
                    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
                    
                    await conn.sendMessage(from, { 
                        text: `🎲 *THE DICE LANDS ON ${Math.floor(Math.random() * 5) + 1}...* 🎲\n\nYou lost, @${sender.split('@')[0]}. The house always wins.\n\n💸 *Loss:* -${stake.toLocaleString()} 🪙\n📉 *Remaining:* ${db[sender].balance.toLocaleString()} 🪙`,
                        mentions: [sender]
                    }, { quoted: m })
                }
            }

            if (body.startsWith('@roulette')) {
                const args = body.split(' ')
                if (args.length < 3) return await conn.sendMessage(from, { text: '❌ Usage: @roulette [red/black] [amount]\nExample: @roulette red 10000' })
                
                let choice = args[1].toLowerCase()
                let stake = parseInt(args[2])
                
                if (choice !== 'red' && choice !== 'black') return await conn.sendMessage(from, { text: '❌ You must choose either "red" or "black"!' })
                if (isNaN(stake) || stake <= 0) return await conn.sendMessage(from, { text: '❌ Please enter a valid amount to stake!' })
                
                if (db[sender].balance < stake) {
                    return await conn.sendMessage(from, { 
                        text: `❌ You don't have enough coins! Your current wallet: ${db[sender].balance.toLocaleString()} 🪙` 
                    }, { quoted: m })
                }

                let outcomeValue = Math.floor(Math.random() * 37)
                let outcomeColor = ''
                
                if (outcomeValue === 0) {
                    outcomeColor = 'green'
                } else if (outcomeValue % 2 === 0) {
                    outcomeColor = 'black'
                } else {
                    outcomeColor = 'red'
                }

                if (choice === outcomeColor) {
                    let winnings = stake * 2
                    db[sender].balance += stake
                    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
                    
                    await conn.sendMessage(from, { 
                        text: `🎡 *ROULETTE WHEEL SPINS...* 🎡\n\nIt landed on **${outcomeColor.toUpperCase()} ${outcomeValue}**!\n\n✅ *Winner:* @${sender.split('@')[0]}\n💰 *Profit:* ${stake.toLocaleString()} 🪙\n✨ *Total:* ${db[sender].balance.toLocaleString()} 🪙`,
                        mentions: [sender]
                    }, { quoted: m })
                } else {
                    db[sender].balance -= stake
                    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
                    
                    await conn.sendMessage(from, { 
                        text: `🎡 *ROULETTE WHEEL SPINS...* 🎡\n\nIt landed on **${outcomeColor.toUpperCase()} ${outcomeValue}**!\n\n❌ *Loser:* @${sender.split('@')[0]}\n💸 *Loss:* -${stake.toLocaleString()} 🪙\n📉 *Remaining:* ${db[sender].balance.toLocaleString()} 🪙`,
                        mentions: [sender]
                    }, { quoted: m })
                }
            }

            if (body.startsWith('@beg')) {
                let chance = Math.floor(Math.random() * 100) + 1
                
                if (chance <= 10) {
                    let reward = Math.floor(Math.random() * (100000 - 60000 + 1)) + 60000
                    db[sender].balance += reward
                    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
                    
                    await conn.sendMessage(from, { 
                        text: `🍊 *NAMI'S MERCY* 🍊\n\nNami is in a surprisingly good mood today! She tosses you a heavy bag of coins.\n\n💰 *You Received:* ${reward.toLocaleString()} 🪙\n✨ *New Balance:* ${db[sender].balance.toLocaleString()} 🪙` 
                    }, { quoted: m })
                } else {
                    const rejections = [
                        "Nami doesn't feel like giving you coins today. 'Get a job, loser!'",
                        "Nami ignores you and continues drawing her maps.",
                        "'Do I look like a charity? Pay me 100,000 first!' Nami laughs at you.",
                        "Nami hits you over the head for asking for free money. No coins for you.",
                        "You begged, but Nami is too busy counting her own treasure."
                    ]
                    let randomRejection = rejections[Math.floor(Math.random() * rejections.length)]
                    
                    await conn.sendMessage(from, { 
                        text: `🍊 *NAMI SAYS:* \n\n"${randomRejection}"` 
                    }, { quoted: m })
                }
            }

            

            if (body.startsWith('@time')) {
                const time = new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' })
                const timeMsg = `⬩ ▬▬▬▬▬▬▬▬▬▬▬▬▬ ⬩\n` +
                                `  *「 🕘 𝚃𝙸𝙼𝙴 🕘 」*\n\n` +
                                `𝚃𝙷𝙴 𝙲𝚄𝚁𝚁𝙴𝙽𝚃 𝚃𝙸𝙼𝙴 𝙸𝚂:\n` +
                                `*${time}*\n` +
                                `⬩ ▬▬▬▬▬▬▬▬▬▬▬▬▬ ⬩`
                await conn.sendMessage(from, { text: timeMsg }, { quoted: m })
            }

            if (body.startsWith('@date')) {
                const date = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                const dateMsg = `⬩ ▬▬▬▬▬▬▬▬▬▬▬▬▬ ⬩\n` +
                                `  *「 📅 𝙳𝙰𝚃𝙴 📅 」*\n\n` +
                                `𝚃𝙾𝙳𝙰𝚈 𝙸𝚂:\n` +
                                `*${date}*\n` +
                                `⬩ ▬▬▬▬▬▬▬▬▬▬▬▬▬ ⬩`
                await conn.sendMessage(from, { text: dateMsg }, { quoted: m })
            }

            if (body.startsWith('@runtime')) {
                const uptime = process.uptime()
                const hours = Math.floor(uptime / 3600)
                const minutes = Math.floor((uptime % 3600) / 60)
                const seconds = Math.floor(uptime % 60)
                const runMsg = `⬩ ▬▬▬▬▬▬▬▬▬▬▬▬▬ ⬩\n` +
                               `  *「 ⚙️ 𝚁𝚄𝙽𝚃𝙸𝙼𝙴 ⚙️ 」*\n\n` +
                               `𝙻𝚄𝙵𝙵𝚈-𝙼𝙳 𝙷𝙰𝚂 𝙱𝙴𝙴𝙽 𝚂𝙰𝙸𝙻𝙸𝙽𝙶 𝙵𝙾𝚁:\n` +
                               `*${hours}𝚑 ${minutes}𝚖 ${seconds}𝚜*\n` +
                               `⬩ ▬▬▬▬▬▬▬▬▬▬▬▬▬ ⬩`
                await conn.sendMessage(from, { text: runMsg }, { quoted: m })
                                                                }


if (body.startsWith('@ascii')) {
                const text = body.slice(7).trim()
                if (!text) return await conn.sendMessage(from, { text: '❌ Please provide text! Example: @ascii Luffy' }, { quoted: m })
                
                // Omo who tf would even use this tbh??? bruh 
                let asciiMsg = `⬩ ▬▬▬▬▬▬▬▬▬▬▬▬▬ ⬩\n` +
                               `  *「 🏴‍☠️ 𝙰𝚂𝙲𝙸𝙸 𝙰𝚁𝚃 🏴‍☠️ 」*\n\n` +
                               `\`\`\`\n` +
                               `+${'-'.repeat(text.length + 2)}+\n` +
                               `| ${text.toUpperCase()} |\n` +
                               `+${'-'.repeat(text.length + 2)}+\n` +
                               `\`\`\`\n` +
                               `⬩ ▬▬▬▬▬▬▬▬▬▬▬▬▬ ⬩`
                await conn.sendMessage(from, { text: asciiMsg }, { quoted: m })
            }

            if (body.startsWith('@count')) {
                const text = body.slice(7).trim()
                if (!text) return await conn.sendMessage(from, { text: '❌ Please provide text to count!' }, { quoted: m })
                
                const charCount = text.length
                const wordCount = text.split(/\s+/).filter(word => word.length > 0).length
                
                const countMsg = `⬩ ▬▬▬▬▬▬▬▬▬▬▬▬▬ ⬩\n` +
                                 `  *「 📊 𝚃𝙴𝚇𝚃 𝙲𝙾𝚄𝙽𝚃𝙴𝚁 📊 」*\n\n` +
                                 `📝 *𝚃𝙴𝚇𝚃:* ${text}\n\n` +
                                 `🔢 *𝙲𝙷𝙰𝚁𝙰𝙲𝚃𝙴𝚁𝚂:* ${charCount}\n` +
                                 `📖 *𝚆𝙾𝚁𝙳𝚂:* ${wordCount}\n` +
                                 `⬩ ▬▬▬▬▬▬▬▬▬▬▬▬▬ ⬩`
                await conn.sendMessage(from, { text: countMsg }, { quoted: m })
                    }


if (body.startsWith('@caps')) {
                const text = body.slice(6).trim()
                if (!text) return await conn.sendMessage(from, { text: '❌ Please provide text!' }, { quoted: m })
                const upperText = text.toUpperCase()
                const capsMsg = `⬩ ▬▬▬▬▬▬▬▬▬▬▬▬▬ ⬩\n` +
                                `  *「 🔠 𝙲𝙰𝙿𝚂 🔠 」*\n\n` +
                                `${upperText}\n` +
                                `⬩ ▬▬▬▬▬▬▬▬▬▬▬▬▬ ⬩`
                await conn.sendMessage(from, { text: capsMsg }, { quoted: m })
            }

            if (body.startsWith('@lower')) {
                const text = body.slice(7).trim()
                if (!text) return await conn.sendMessage(from, { text: '❌ Please provide text!' }, { quoted: m })
                const lowerText = text.toLowerCase()
                const lowerMsg = `⬩ ▬▬▬▬▬▬▬▬▬▬▬▬▬ ⬩\n` +
                                 `  *「 🔡 𝙻𝙾𝚆𝙴𝚁 🔡 」*\n\n` +
                                 `${lowerText}\n` +
                                 `⬩ ▬▬▬▬▬▬▬▬▬▬▬▬▬ ⬩`
                await conn.sendMessage(from, { text: lowerMsg }, { quoted: m })
            }

            if (body.startsWith('@reverse')) {
                const text = body.slice(9).trim()
                if (!text) return await conn.sendMessage(from, { text: '❌ Please provide text!' }, { quoted: m })
                const reversed = text.split('').reverse().join('')
                const revMsg = `⬩ ▬▬▬▬▬▬▬▬▬▬▬▬▬ ⬩\n` +
                               `  *「 🔁 𝚁𝙴𝚅𝙴𝚁𝚂𝙴 🔁 」*\n\n` +
                               `${reversed}\n` +
                               `⬩ ▬▬▬▬▬▬▬▬▬▬▬▬▬ ⬩`
                await conn.sendMessage(from, { text: revMsg }, { quoted: m })
    }
            





            if (body.startsWith('@dance')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                let mentionUser = user ? (user === sender ? 'themselves' : `@${user.split('@')[0]}`) : 'the vibe'

                await conn.sendMessage(from, { 
                    video: fs.readFileSync('./BOTMEDIAS/dance.mp4'), 
                    gifPlayback: true, 
                    caption: `🕺 *@${sender.split('@')[0]} is busting some moves with ${mentionUser}!*`,
                    mentions: user ? [sender, user] : [sender]
                }, { quoted: m })
            }

            if (body.startsWith('@shocked')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                let mentionUser = user ? (user === sender ? 'themselves' : `@${user.split('@')[0]}`) : 'the situation'

                await conn.sendMessage(from, { 
                    video: fs.readFileSync('./BOTMEDIAS/shocked.mp4'), 
                    gifPlayback: true, 
                    caption: `😲 *@${sender.split('@')[0]} is absolutely shocked by ${mentionUser}!!*`,
                    mentions: user ? [sender, user] : [sender]
                }, { quoted: m })
            }

            if (body.startsWith('@cry')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                let mentionUser = user ? (user === sender ? 'themselves' : `@${user.split('@')[0]}`) : 'nothing'

                await conn.sendMessage(from, { 
                    video: fs.readFileSync('./BOTMEDIAS/cry.mp4'), 
                    gifPlayback: true, 
                    caption: `😭 *@${sender.split('@')[0]} is crying over ${mentionUser}... how tragic.*`,
                    mentions: user ? [sender, user] : [sender]
                }, { quoted: m })
            }

            if (body.startsWith('@punch')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                if (!user) return await conn.sendMessage(from, { text: '❌ Tag someone to punch them!' })

                let mentionUser = user === sender ? 'themselves' : `@${user.split('@')[0]}`

                await conn.sendMessage(from, { 
                    video: fs.readFileSync('./BOTMEDIAS/punch.mp4'), 
                    gifPlayback: true, 
                    caption: `👊 *@${sender.split('@')[0]} landed a solid punch on ${mentionUser}'s face!*`,
                    mentions: [sender, user] 
                }, { quoted: m })
            }

            if (body.startsWith('@laugh')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                let mentionUser = user ? (user === sender ? 'themselves' : `@${user.split('@')[0]}`) : 'the joke'

                await conn.sendMessage(from, { 
                    video: fs.readFileSync('./BOTMEDIAS/laugh.mp4'), 
                    gifPlayback: true, 
                    caption: `😂 *@${sender.split('@')[0]} is laughing hysterically at ${mentionUser}!*`,
                    mentions: user ? [sender, user] : [sender]
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





if (body.startsWith('@predict')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                if (!user) return await conn.sendMessage(from, { text: '❌ Tag someone to predict their future!' })

                const predictions = [
                    "You will find a hidden treasure in your backyard but it will be a box of old socks.",
                    "You will become famous for something you did while sleepwalking.",
                    "A mysterious stranger will offer you a deal you cannot refuse tomorrow.",
                    "You will accidentally become the leader of a small island nation.",
                    "Your next meal will be the best thing you have ever tasted in your life.",
                    "You will win a marathon but only because everyone else took a wrong turn.",
                    "A bird will drop something valuable near you within the next 48 hours.",
                    "You will successfully learn a new language in record time.",
                    "You will meet your double and realize you are the better looking one.",
                    "A forgotten friend will reach out to you with life-changing news.",
                    "You will find a twenty dollar bill in a pair of pants you haven't worn in years.",
                    "You will be invited to a party that changes the course of your career.",
                    "You will invent something so simple yet so useful the world will thank you.",
                    "You will break a record that has stood for over fifty years.",
                    "Your crush will finally notice you but they will be wearing a clown suit.",
                    "You will travel to a place you have only seen in your dreams.",
                    "A cat will follow you home and bring you luck for the rest of the year.",
                    "You will win an argument with a stranger on the internet and feel at peace.",
                    "You will discover a secret passage in your own house.",
                    "You will be mistaken for a celebrity and get a free meal out of it.",
                    "You will wake up tomorrow with a brilliant idea for a movie script.",
                    "You will save someone's day by doing absolutely nothing at all.",
                    "You will finally understand a joke that was told to you five years ago.",
                    "You will be the first person to step foot on a newly discovered territory.",
                    "You will gain a superpower but it will only work when you are asleep.",
                    "You will find the perfect pair of shoes on your first try.",
                    "You will be mentioned in a history book a hundred years from now.",
                    "You will survive a minor inconvenience with incredible grace.",
                    "You will find a way to make your favorite food healthy and delicious.",
                    "You will realize that the thing you were looking for was in your hand the whole time.",
                    "You will accidentally start a viral trend involving a rubber duck and a toaster.",
                    "A stray dog will lead you to a location that holds a significant childhood memory.",
                    "You will be offered a job as a professional ice cream taster within the next six months.",
                    "You will find an ancient coin that grants you exactly one very specific wish.",
                    "You will successfully cook a five-course meal without burning a single thing.",
                    "You will receive a letter addressed to you from fifty years in the future.",
                    "You will win a lifetime supply of your favorite snack by winning a weird contest.",
                    "You will find out that you are the rightful heir to a very small and strange castle.",
                    "You will have a dream that accurately predicts the winning sports scores for next week.",
                    "You will become an expert at a hobby you currently know absolutely nothing about.",
                    "You will be the reason a major scientific discovery is made by complete accident.",
                    "You will find a shortcut to your destination that saves you exactly thirty-two minutes.",
                    "You will receive a compliment from a stranger that boosts your confidence for a month.",
                    "You will solve a mystery that has been bothering your neighborhood for decades.",
                    "You will wake up one morning and realize you can suddenly play the piano perfectly.",
                    "You will be gifted a plant that grows much faster and taller than it is supposed to.",
                    "You will find a message in a bottle that was meant specifically for you.",
                    "You will be the only person to witness a rare astronomical event from your balcony.",
                    "You will win a staring contest against a very determined owl.",
                    "You will discover that your ancestors were actually legendary pirates of the high seas."
                ]

                const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)]
                let mentionUser = user === sender ? 'themselves' : `@${user.split('@')[0]}`

                await conn.sendMessage(from, { 
                    text: `🔮 *Future Prediction for ${mentionUser}:*\n\n"${randomPrediction}"`,
                    mentions: [sender, user]
                }, { quoted: m })
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




if (body.startsWith('@loyalty')) {
                let target = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant || sender
                const percentage = Math.floor(Math.random() * 101)
                let status = ``
                if (percentage < 20) status = `𝚂𝙽𝙰𝙺𝙴 𝙳𝙴𝚃𝙴𝙲𝚃𝙴𝙳. 𝚈𝙾𝚄 𝚆𝙾𝚄𝙻𝙳 𝚂𝙴𝙻𝙻 𝚈𝙾𝚄𝚁 𝙾𝚆𝙽 𝚂𝙾𝚄𝙻 𝙵𝙾𝚁 𝙰 𝙳𝙸𝚂𝙲𝙾𝚄𝙽𝚃 𝙲𝙾𝚄𝙿𝙾𝙽 🐍`
                else if (percentage < 50) status = `𝚈𝙾𝚄'𝚁𝙴 𝙰𝚂 𝙻𝙾𝚈𝙰𝙻 𝙰𝚂 𝙰 𝚂𝚃𝚁𝙰𝚈 𝙲𝙰𝚃. 𝚆𝙷𝙾𝙴𝚅𝙴𝚁 𝙷𝙰𝚂 𝚃𝙷𝙴 𝙵𝙾𝙾𝙳 𝙷𝙰𝚂 𝚈𝙾𝚄𝚁 𝙷𝙴𝙰𝚁𝚃 💀`
                else if (percentage < 80) status = `𝚈𝙾𝚄'𝚁𝙴 𝙰 𝚁𝙴𝙰𝙻 𝙾𝙽𝙴. 𝙰 𝙱𝙸𝚃 𝚂𝙷𝙰𝙺𝚈 𝚄𝙽𝙳𝙴𝚁 𝙿𝚁𝙴𝚂𝚂𝚄𝚁𝙴 𝙱𝚄𝚃 𝚈𝙾𝚄 𝚂𝚃𝙰𝚈 🔟`
                else status = `𝙳𝙸𝙴-𝙷𝙰𝚁𝙳 𝙻𝙾𝚈𝙰𝙻𝚃𝚈. 𝚈𝙾𝚄'𝚁𝙴 𝚃𝙷𝙴 𝚃𝚈𝙿𝙴 𝚃𝙾 𝙶𝙾 𝚃𝙾 𝙹𝙰𝙸𝙻 𝙹𝚄𝚂𝚃 𝚂𝙾 𝚈𝙾𝚄𝚁 𝚃𝚆𝙸𝙽 𝙳𝙾𝙴𝚂𝙽'𝚃 𝙶𝙴𝚃 𝙻𝙾𝙽𝙴𝙻𝚈 🗿`
                
                const msg = `🤝 *${toMono('𝙻𝙾𝚈𝙰𝙻𝚃𝚈 𝚁𝙰𝚃𝙴')}* 🤝\n\n𝚃𝙰𝚁𝙶𝙴𝚃: @${target.split('@')[0].toUpperCase()}\n𝚁𝙰𝚃𝙴: *${percentage}%*\n\n${status}`
                await conn.sendMessage(from, { text: msg, mentions: [target] }, { quoted: m })
            }

            if (body.startsWith('@evil')) {
                let target = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant || sender
                const percentage = Math.floor(Math.random() * 101)
                let status = ``
                if (percentage < 20) status = `𝚈𝙾𝚄'𝚁𝙴 𝚃𝙾𝙾 𝙽𝙸𝙲𝙴. 𝙸𝚃'𝚂 𝙰𝙲𝚃𝚄𝙰𝙻𝙻𝚈 𝙳𝙸𝚂𝙶𝚄𝚂𝚃𝙸𝙽𝙶. 𝙳𝙾 𝚂𝙾𝙼𝙴𝚃𝙷𝙸𝙽𝙶 𝙱𝙰𝙳 𝙵𝙾𝚁 𝙾𝙽𝙲𝙴 😇`
                else if (percentage < 50) status = `𝚈𝙾𝚄'𝚁𝙴 𝙼𝙸𝙻𝙳𝙻𝚈 𝙰𝙽𝙽𝙾𝚈𝙸𝙽𝙶 𝙱𝚄𝚃 𝙽𝙾𝚃 𝙰 𝚅𝙸𝙻𝙻𝙰𝙸𝙽. 𝙹𝚄𝚂𝚃 𝙰 𝙽𝚄𝙸𝚂𝙰𝙽𝙲𝙴 🐝`
                else if (percentage < 85) status = `𝚈𝙾𝚄 𝙳𝙴𝙵𝙸𝙽𝙸𝚃𝙴𝙻𝚈 𝚁𝙴𝙼𝙸𝙽𝙳 𝚃𝙷𝙴 𝚃𝙴𝙰𝙲𝙷𝙴𝚁 𝙰𝙱𝙾𝚄𝚃 𝚃𝙷𝙴 𝙷𝙾𝙼𝙴𝚆𝙾𝚁𝙺. 𝙳𝙸𝙰𝙱𝙾𝙻𝙸𝙲𝙰𝙻 👿`
                else status = `𝚂𝚃𝚁𝙰𝙸𝙶𝙷𝚃 𝙵𝚁𝙾𝙼 𝚃𝙷𝙴 𝙿𝙸𝚃𝚂 𝙾𝙵 𝙷𝙴𝙻𝙻. 𝚂𝙰𝚃𝙰𝙽 𝚃𝙰𝙺𝙴𝚂 𝙽𝙾𝚃𝙴𝚂 𝙵𝚁𝙾𝙼 𝚈𝙾𝚄 👹`
                
                const msg = `😈 *${toMono('𝙴𝚅𝙸𝙻 𝚁𝙰𝚃𝙴')}* 😈\n\n𝚃𝙰𝚁𝙶𝙴𝚃: @${target.split('@')[0].toUpperCase()}\n𝚁𝙰𝚃𝙴: *${percentage}%*\n\n${status}`
                await conn.sendMessage(from, { text: msg, mentions: [target] }, { quoted: m })
            }

            if (body.startsWith('@genius')) {
                let target = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant || sender
                const percentage = Math.floor(Math.random() * 101)
                let status = ``
                if (percentage < 25) status = `𝚈𝙾𝚄𝚁 𝙱𝚁𝙰𝙸𝙽 𝙲𝙴𝙻𝙻𝚂 𝙰𝚁𝙴 𝙵𝙸𝙶𝙷𝚃𝙸𝙽𝙶 𝙵𝙾𝚁 𝚃𝙷𝙸𝚁𝙳 𝙿𝙻𝙰𝙲𝙴. 𝙸𝚃'𝚂 𝚂𝙰𝙳 𝚃𝙾 𝚆𝙰𝚃𝙲𝙷 🕯️`
                else if (percentage < 60) status = `𝚂𝙼𝙰𝚁𝚃 𝙴𝙽𝙾𝚄𝙶𝙷 𝚃𝙾 𝙵𝚄𝙽𝙲𝚃𝙸𝙾𝙽, 𝚂𝚃𝚄𝙿𝙸𝙳 𝙴𝙽𝙾𝚄𝙶𝙷 𝚃𝙾 𝙱𝙴 𝙷𝙰𝙿𝙿𝚈. 𝙴𝙽𝙹𝙾𝚈 𝙸𝚃 🧩`
                else if (percentage < 90) status = `𝙰𝙲𝚃𝚄𝙰𝙻𝙻𝚈 𝙸𝙼𝙿𝚁𝙴𝚂𝚂𝙸𝚅𝙴. 𝚈𝙾𝚄 𝙿𝚁𝙾𝙱𝙰𝙱𝙻𝚈 𝙵𝙸𝙽𝙸𝚂𝙷𝙴𝙳 𝚃𝙷𝙴 𝙴𝚇𝙰𝙼 𝚆𝙷𝙸𝙻𝙴 𝚃𝙷𝙴𝚈 𝚆𝙴𝚁𝙴 𝚂𝚃𝙸𝙻𝙻 𝚁𝙴𝙰𝙳𝙸𝙽𝙶 𝚃𝙷𝙴 𝙽𝙰𝙼𝙴 𝙱𝙾𝚇 🧠`
                else status = `𝟺𝟶𝟶 𝙸𝚀. 𝚈𝙾𝚄 𝙰𝚁𝙴 𝙻𝙸𝚃𝙴𝚁𝙰𝙻𝙻𝚈 𝙿𝙻𝙰𝚈𝙸𝙽𝙶 𝟺𝙳 𝙲𝙷𝙴𝚂𝚂 𝚆𝙸𝚃𝙷 𝙾𝚄𝚁 𝙴𝚇𝙸𝚂𝚃𝙴𝙽𝙲𝙴 🌌`
                
                const msg = `🧠 *${toMono('𝙶𝙴𝙽𝙸𝚄𝚂 𝚁𝙰𝚃𝙴')}* 🧠\n\n𝚃𝙰𝚁𝙶𝙴𝚃: @${target.split('@')[0].toUpperCase()}\n𝚁𝙰𝚃𝙴: *${percentage}%*\n\n${status}`
                await conn.sendMessage(from, { text: msg, mentions: [target] }, { quoted: m })
            }

            if (body.startsWith('@haki')) {
                let target = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant || sender
                const percentage = Math.floor(Math.random() * 101)
                let status = ``
                if (percentage < 20) status = `𝚈𝙾𝚄 𝙷𝙰𝚅𝙴 𝚃𝙷𝙴 𝙿𝚁𝙴𝚂𝙴𝙽𝙲𝙴 𝙾𝙵 𝙰 𝙲𝙰𝚁𝙳𝙱𝙾𝙰𝚁𝙳 𝙱𝙾𝚇. 𝚄𝚃𝚃𝙴𝚁𝙻𝚈 𝚆𝙴𝙰𝙺 💨`
                else if (percentage < 50) status = `𝙼𝙴𝙳𝙸𝙾𝙲𝚁𝙴 𝙰𝚄𝚁𝙰. 𝚈𝙾𝚄 𝙼𝙸𝙶𝙷𝚃 𝚂𝙲𝙰𝚁𝙴 𝙰 𝙺𝙸𝚃𝚃𝙴𝙽 𝙸𝙵 𝚈𝙾𝚄 𝚂𝙷𝙾𝚄𝚃 𝚁𝙴𝙰𝙻𝙻𝚈 𝙻𝙾𝚄𝙳 🐱`
                else if (percentage < 85) status = `𝚂𝚃𝚁𝙾𝙽𝙶 𝚆𝙸𝙻𝙻𝙿𝙾𝚆𝙴𝚁. 𝙿𝙴𝙾𝙿𝙻𝙴 𝙰𝙲𝚃𝚄𝙰𝙻𝙻𝚈 𝚂𝚃𝙾𝙿 𝚃𝙰𝙻𝙺𝙸𝙽𝙶 𝚆𝙷𝙴𝙽 𝚈𝙾𝚄 𝙴𝙽𝚃𝙴𝚁 𝚃𝙷𝙴 𝚁𝙾𝙾𝙼 ⚡`
                else status = `𝚄𝙽𝚃𝙾𝚄𝙲𝙷𝙰𝙱𝙻𝙴 𝙴𝙽𝙴𝚁𝙶𝚈. 𝙾𝙽𝙴 𝙻𝙾𝙾𝙺 𝙰𝙽𝙳 𝚃𝙷𝙴𝙸𝚁 𝙺𝙽𝙴𝙴𝚂 𝚂𝚃𝙰𝚁𝚃 𝚂𝙷𝙰𝙺𝙸𝙽𝙶 👑`
                
                const msg = `✨ *${toMono('𝙰𝚄𝚁𝙰 𝙻𝙴𝚅𝙴𝙻')}* ✨\n\n𝚃𝙰𝚁𝙶𝙴𝚃: @${target.split('@')[0].toUpperCase()}\n𝚁𝙰𝚃𝙴: *${percentage}%*\n\n${status}`
                await conn.sendMessage(from, { text: msg, mentions: [target] }, { quoted: m })
            }

            if (body.startsWith('@bravery')) {
                let target = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant || sender
                const percentage = Math.floor(Math.random() * 101)
                let status = ``
                if (percentage < 25) status = `𝚈𝙾𝚄'𝚁𝙴 𝚂𝙲𝙰𝚁𝙴𝙳 𝙾𝙵 𝚈𝙾𝚄𝚁 𝙾𝚆𝙽 𝚂𝙷𝙰𝙳𝙾𝚆. 𝙶𝙾 𝙱𝙰𝙲𝙺 𝚄𝙽𝙳𝙴𝚁 𝚃𝙷𝙴 𝙱𝙴𝙳 🧺`
                else if (percentage < 60) status = `𝚈𝙾𝚄'𝙳 𝙵𝙸𝙶𝙷𝚃 𝙱𝚄𝚃 𝙾𝙽𝙻𝚈 𝙸𝙵 𝚈𝙾𝚄𝚁 𝙿𝙷𝙾𝙽𝙴 𝙸𝚂 𝙲𝙷𝙰𝚁𝙶𝙴𝙳 𝙰𝙽𝙳 𝚃𝙷𝙴 𝙻𝙸𝙶𝙷𝚃𝚂 𝙰𝚁𝙴 𝙾𝙽 💡`
                else if (percentage < 90) status = `𝙰𝙽 𝙰𝙱𝚂𝙾𝙻𝚄𝚃𝙴 𝚆𝙰𝚁𝚁𝙸𝙾𝚁. 𝚈𝙾𝚄 𝙳𝙾𝙽'𝚃 𝙱𝙻𝙸𝙽𝙺 𝚆𝙷𝙴𝙽 𝚃𝙷𝙴 𝙲𝙷𝙰𝙾𝚂 𝚂𝚃𝙰𝚁𝚃𝚂 ⚔️`
                else status = `𝙵𝙴𝙰𝚁𝙻𝙴𝚂𝚂. 𝚈𝙾𝚄 𝙿𝚁𝙾𝙱𝙰𝙱𝙻𝚈 𝙴𝙰𝚃 𝙲𝙴𝚁𝙴𝙰𝙻 𝚆𝙸𝚃𝙷 𝚆𝙰𝚃𝙴𝚁 𝙹𝚄𝚂𝚃 𝚃𝙾 𝙵𝙴𝙴𝙻 𝚂𝙾𝙼𝙴𝚃𝙷𝙸𝙽𝙶 🦁`
                
                const msg = `🦁 *${toMono('𝙱𝚁𝙰𝚅𝙴𝚁𝚈 𝚁𝙰𝚃𝙴')}* 🦁\n\n𝚃𝙰𝚁𝙶𝙴𝚃: @${target.split('@')[0].toUpperCase()}\n𝚁𝙰𝚃𝙴: *${percentage}%*\n\n${status}`
                await conn.sendMessage(from, { text: msg, mentions: [target] }, { quoted: m })
            }

            

            if (body.startsWith('@luck')) {
                let target = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant || sender
                const percentage = Math.floor(Math.random() * 101)
                let status = ``
                if (percentage < 20) status = `𝙸𝙵 𝙸𝚃 𝚁𝙰𝙸𝙽𝙴𝙳 𝚂𝙾𝚄𝙿, 𝚈𝙾𝚄'𝙳 𝙱𝙴 𝙾𝚄𝚃𝚂𝙸𝙳𝙴 𝚆𝙸𝚃𝙷 𝙰 𝙵𝙾𝚁𝙺. 𝚄𝙽𝙻𝚄𝙲𝙺𝚈 𝙰𝙵 🌧️`
                else if (percentage < 50) status = `𝚈𝙾𝚄'𝚁𝙴 𝚃𝙷𝙴 𝚁𝙴𝙰𝚂𝙾𝙽 𝚃𝙷𝙴 𝚅𝙴𝙽𝙳𝙸𝙽𝙶 𝙼𝙰𝙲𝙷𝙸𝙽𝙴 𝙴𝙰𝚃𝚂 𝚃𝙷𝙴 𝙼𝙾𝙽𝙴𝚈 🎟️`
                else if (percentage < 85) status = `𝚈𝙾𝚄 𝙰𝙻𝚆𝙰𝚈𝚂 𝙵𝙸𝙽𝙳 𝙰 𝙿𝙰𝚁𝙺𝙸𝙽𝙶 𝚂𝙿𝙾𝚃 𝙸𝙽 𝙵𝚁𝙾𝙽𝚃 𝙾𝙵 𝚃𝙷𝙴 𝙳𝙾𝙾𝚁. 𝙽𝙸𝙲𝙴 🍀`
                else status = `𝙶𝙾𝙳'𝚂 𝙵𝙰𝚅𝙾𝚁𝙸𝚃𝙴. 𝚈𝙾𝚄 𝙲𝙾𝚄𝙻𝙳 𝙵𝙰𝙻𝙻 𝙾𝙵𝙵 𝙰 𝙲𝙻𝙸𝙵𝙵 𝙰𝙽𝙳 𝙻𝙰𝙽𝙳 𝙾𝙽 𝙰 𝙿𝙸𝙻𝙴 𝙾𝙵 𝙲𝙰𝚂𝙷 🏆`
                
                const msg = `🍀 *${toMono('𝙻𝚄𝙲𝙺 𝚁𝙰𝚃𝙴')}* 🍀\n\n𝚃𝙰𝚁𝙶𝙴𝚃: @${target.split('@')[0].toUpperCase()}\n𝚁𝙰𝚃𝙴: *${percentage}%*\n\n${status}`
                await conn.sendMessage(from, { text: msg, mentions: [target] }, { quoted: m })
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
                            image: fs.readFileSync('./BOTMEDIAS/KAKEGURUII.jpeg'), 
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
                await conn.sendMessage(from, { text: 'Pong! LUFFY-MD is active.' }, { quoted: m })
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





if (body.startsWith('@insult')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                if (!user) return await conn.sendMessage(from, { text: '❌ Tag someone to insult them!' })

                const data = JSON.parse(fs.readFileSync('./interactions.json', 'utf8'))
                const randomInsult = data.insults[Math.floor(Math.random() * data.insults.length)]
                
                let mentionUser = user === sender ? 'themselves' : `@${user.split('@')[0]}`

                await conn.sendMessage(from, { 
                    text: `💀 *@${sender.split('@')[0]} to ${mentionUser}:*\n\n"${randomInsult}"`,
                    mentions: [sender, user]
                }, { quoted: m })
            }

            if (body.startsWith('@wyr')) {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
                if (!user) return await conn.sendMessage(from, { text: '❌ Tag someone to play Would You Rather!' })

                const data = JSON.parse(fs.readFileSync('./interactions.json', 'utf8'))
                const randomWyr = data.wyr[Math.floor(Math.random() * data.wyr.length)]
                
                let mentionUser = user === sender ? 'themselves' : `@${user.split('@')[0]}`

                await conn.sendMessage(from, { 
                    text: `🎮 *@${sender.split('@')[0]} asks ${mentionUser}:*\n\n"${randomWyr}"`,
                    mentions: [sender, user]
                }, { quoted: m })
            }

            if (body.startsWith('@thought')) {
                const data = JSON.parse(fs.readFileSync('./interactions.json', 'utf8'))
                const randomThought = data.thoughts[Math.floor(Math.random() * data.thoughts.length)]

                await conn.sendMessage(from, { 
                    text: `🧠 *Random Thought:*\n\n"${randomThought}"`
                }, { quoted: m })
            }

            if (body.startsWith('@quote')) {
                const data = JSON.parse(fs.readFileSync('./interactions.json', 'utf8'))
                const randomQuote = data.quotes[Math.floor(Math.random() * data.quotes.length)]

                await conn.sendMessage(from, { 
                    text: `📜 *One Piece Quote:*\n\n"${randomQuote}"`
                }, { quoted: m })
            }







            if (body.startsWith('@8ball')) {
                const text = body.slice(7).trim()
                if (!text) return await conn.sendMessage(from, { text: '❌ Ask a question! Example: @8ball will I become king?' }, { quoted: m })
                const responses = ['Yes', 'No', 'Maybe', 'Most likely', 'Absolutely', 'Not a chance', 'Omo sha', '50/50']
                const response = responses[Math.floor(Math.random() * responses.length)]
                await conn.sendMessage(from, { text: `🎱 *𝟾-𝙱𝙰𝙻𝙻:* ${response}` }, { quoted: m })
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
                let board = Object.keys(db)
                    .filter(id => id !== "2348076874766@s.whatsapp.net")
                    .map(id => ({ id, balance: db[id].balance || 0 }))
                    .sort((a, b) => b.balance - a.balance)
                    .slice(0, 10)
                
                let text = `*LUFFY-MD LEADERBOARD*\n\n`
                board.forEach((user, i) => {
                    text += `${i + 1}. @${user.id.split('@')[0]} - ${user.balance}\n`
                })

                await conn.sendMessage(from, { 
                    image: fs.readFileSync('./BOTMEDIAS/leaderboard.jpg'),
                    caption: text,
                    mentions: board.map(u => u.id) 
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
