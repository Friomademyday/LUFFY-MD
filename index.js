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
