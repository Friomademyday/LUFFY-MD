<div align="center">

# 🏴‍☠️ **LUFFY - MD** 🏴‍☠️

<img src="./BOTMEDIAS/luffymdmenu.jpg" width="100%" alt="Luffy Menu">

</div>

### **Description**
LUFFY-MD is a powerful and interactive WhatsApp multi-device bot designed to bring the spirit of adventure to your groups. It is packed with high-speed commands, a deep economy system, and immersive pirate interactions.

**Theme:** "Until the day Luffy becomes king of the pirates" 🍖🏴‍☠️




## **PURPOSE**


LUFFY-MD was not created to perform basic admin features. If you want a member of your group kicked or added, **do it yourself**—you are perfectly capable! This bot is designed to be a companion for entertainment, not a digital janitor. 

It was created strictly for **fun purposes**, which is why the focus is entirely on the Casino system, interactive pirate roleplay, and community games. 
***



## **How to Use**

**Prefix Briefing**
The bot responds to commands starting with a specific prefix ( `@` ). Make sure to include the prefix followed by the command name (e.g., `@menu`) to get started.

**Interactions**
Use the crew-based interaction commands to engage with other members. You can `@slap`, `@punch`, `@dance`, or `@cheers` with your friends. Most commands support tagging a user to target them specifically with One Piece themed captions and GIFs.

**Economy Features**
The bot features a persistent economy system where you can earn and spend coins. Test your luck at the casino with `@roll` or `@roulette`, or try your luck begging Nami for coins using `@beg`. Always keep an eye on your wallet!

---

<div align="center">
<img src="./BOTMEDIAS/luffy2.jpg" width="100%" alt="Luffy Crew">
</div>

## **Deployment**

**Deploying on Render**

Follow these steps to set sail:

* **Fork the Repository:** Create a copy of this repository on your own GitHub account.
* **Head over to Render:** Go to [Render.com](https://render.com) and log in.
* **Create a Web Service:** Select "New +" and choose "Web Service".
* **Connect GitHub:** Connect your GitHub account and select the forked repository.
* **Environment Variables:** Under the "Environment" tab, add your phone number variable (e.g., `SESSION_ID` or `PHONE_NUMBER`). This is where the bot knows which number to generate the code for.
* **Runtime:** Node
* **Build Command:** `npm install`
* **Start Command:** `node index.js`
* **Instance Type:** Select "Free" (works fine) or a paid instance if you prefer more power.
* **Click Create Web Service:** Let Render build the environment.

**Connecting to WhatsApp**
Once the build is finished, watch the Render logs carefully. You will see a unique **8-character pairing code** (e.g., XXXX-XXXX). Go to WhatsApp > Linked Devices > Link with Phone Number, and enter that code. Once connected, the logs will show: **THE-FRIO-BOT Online ✅**

---

## **Keep the Bot Active (24/7)**

To prevent Render from putting the bot to sleep:

1.  Copy the **Live URL** provided by Render for your web service.
2.  Go to [Uptimerobot.com](https://uptimerobot.com) and log in.
3.  **Create a New Monitor:**
    * **Monitor Type:** HTTP(s)
    * **Friendly Name:** LUFFY-MD
    * **URL:** Paste your Render URL.
    * **Interval:** 5 minutes.
4.  Click **Start Monitoring**. This keeps the bot active indefinitely.

---

## **WARNING**

**Terms and Conditions (T&C)**

* **WhatsApp Policy:** WhatsApp does NOT officially support bots. By using LUFFY-MD, you acknowledge that your account could be flagged or banned by WhatsApp's automated systems.
* **Liability:** We are not responsible for any banned accounts, loss of data, or damages resulting from the use of this software.
* **Usage:** Use this bot responsibly. Avoid spamming commands in official or sensitive groups to reduce the risk of reports and bans.
* **Privacy:** This bot does not store your private messages; however, economy data and interaction logs are stored locally for the bot to function.

---
