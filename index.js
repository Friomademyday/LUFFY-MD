const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    makeInMemoryStore,
    fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys")
const pino = require("pino")
const { Boom } = require("@hapi/boom")
const fs = require("fs")
const chalk = require("chalk")
const readline = require("readline")

const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) })

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))

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
        const phoneNumber = "2348076874766"
        const code = await conn.requestPairingCode(phoneNumber.trim())
        console.log(chalk.black(chalk.bgCyan(`Pairing Code: ${code}`)))
    }

    conn.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update
        if (connection === "close") {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode
            if (reason === DisconnectReason.loggedOut) { 
                process.exit()
            } else { 
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
            const sender = m.key.participant || m.key.remoteJid
            const type = Object.keys(m.message)[0]
            const body = (type === 'conversation') ? m.message.conversation : (type == 'imageMessage') ? m.message.imageMessage.caption : (type == 'videoMessage') ? m.message.videoMessage.caption : (type == 'extendedTextMessage') ? m.message.extendedTextMessage.text : ''
            
            const isCreator = ["2348076874766@s.whatsapp.net"].includes(sender) || m.key.fromMe

            if (!fs.existsSync('./economyData.json')) fs.writeFileSync('./economyData.json', JSON.stringify({}))
            let db = JSON.parse(fs.readFileSync('./economyData.json'))

            if (!db[sender]) {
                db[sender] = {
                    xp: 0,
                    balance: isCreator ? "Infinite" : 0,
                    messages: 0,
                    gamesWon: 0,
                    rank: "Noob",
                    lastDaily: 0,
                    bannedUntil: 0
                }
                fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
            }

            if (body.startsWith('@rank')) {
                const user = db[sender]
                let imgPath = './BOTMEDIAS/ranknoob.jpg'
                let caption = `🏆 *RANK PROFILE*\n\n⭐ XP: ${user.xp}\n💬 Messages: ${user.messages}\n🎮 Games Won: ${user.gamesWon}\n🏦 Wallet: ${user.balance}`
                
                if (isCreator) {
                    imgPath = './BOTMEDIAS/him.jpg'
                    caption = `When an individual surpasses levels in which numbers, 1s and 0s cant quantify, the one who holds all accounts, databases and structures of every user, simply put he...is him`
                } else {
                    if (user.rank === 'Elite') imgPath = './BOTMEDIAS/rankelite.jpg'
                    if (user.rank === 'GrandMaster') imgPath = './BOTMEDIAS/rankgrandmaster.jpg'
                    if (user.rank === 'GodLike') imgPath = './BOTMEDIAS/rankgodlike.jpg'
                }

                await conn.sendMessage(from, { image: { url: imgPath }, caption: caption }, { quoted: m })
            }

            if (body.startsWith('@balance')) {
                const balance = db[sender].balance
                await conn.sendMessage(from, { text: `🏦 *Wallet Balance*\n\nUser: @${sender.split('@')[0]}\nBalance: ${balance}`, mentions: [sender] }, { quoted: m })
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
                
                if (!isCreator) {
                    db[sender].balance = (db[sender].balance || 0) + 1000
                }
                db[sender].lastDaily = Date.now()
                fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
                await conn.sendMessage(from, { text: `✅ Daily reward of 1,000 coins claimed!` }, { quoted: m })
            }

        } catch (err) {
            console.log(err)
        }
    })
}

startFrioBot()
