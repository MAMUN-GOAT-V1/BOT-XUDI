const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const axios = require("axios");

module.exports = {
    config: {
        name: "upt",
        aliases: ["upt", "botup"],
        version: "1.0",
        author: "〲MAMUNツ࿐ T.T　o.O",
        countDown: 5,
        role: 0,
        shortDescription: "Show uptime with user's profile picture"
    },

    run: async ({ api, event }) => {
        try {
            // Get user profile picture
            const userId = event.senderID;
            const picUrl = `https://graph.facebook.com/${userId}/picture?type=large&width=500&height=500&access_token=${process.env.FB_TOKEN}`;
            const response = await axios.get(picUrl, { responseType: "arraybuffer" });
            const userPic = await loadImage(Buffer.from(response.data, "binary"));

            // Convert uptime
            const ms = process.uptime() * 1000;
            const seconds = Math.floor((ms / 1000) % 60);
            const minutes = Math.floor((ms / (1000 * 60)) % 60);
            const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
            const days = Math.floor(ms / (1000 * 60 * 60 * 24));
            const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

            // Create canvas
            const canvas = createCanvas(800, 400);
            const ctx = canvas.getContext("2d");

            // Background
            ctx.fillStyle = "#1e1e1e";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw profile pic
            const picSize = 150;
            ctx.drawImage(userPic, canvas.width - picSize - 30, 30, picSize, picSize);

            // Add uptime text
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 40px Arial";
            ctx.fillText("〲MAMUNツ࿐ T.T　o.O", 50, 100);
            ctx.font = "30px Arial";
            ctx.fillText(`Uptime: ${uptimeString}`, 50, 200);

            // Save and send image
            const pathImg = __dirname + "/uptime.png";
            fs.writeFileSync(pathImg, canvas.toBuffer("image/png"));

            return api.sendMessage(
                { body: "", attachment: fs.createReadStream(pathImg) },
                event.threadID,
                () => fs.unlinkSync(pathImg),
                event.messageID
            );

        } catch (err) {
            console.error(err);
            return api.sendMessage("❌ Could not fetch profile picture.", event.threadID, event.messageID);
        }
    }
};
