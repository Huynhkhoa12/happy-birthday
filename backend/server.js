const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// ===============================
// TELEGRAM CONFIG
// ===============================

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json({ limit: "20kb" }));

// ===============================
// SEND TELEGRAM MESSAGE
// ===============================

async function sendTelegram(message) {
    if (!BOT_TOKEN || !CHAT_ID) {
        throw new Error("Chưa cấu hình BOT_TOKEN hoặc CHAT_ID");
    }

    const response = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message
            })
        }
    );

    const data = await response.json();

    if (!response.ok || !data.ok) {
        console.error("Telegram API lỗi:", data);
        throw new Error(data.description || "Telegram gửi tin thất bại");
    }

    console.log("✅ Đã gửi Telegram");
    return true;
}

// ===============================
// CLAIMS FILE
// ===============================

const claimsFile = path.join(__dirname, "claims.json");

// ===============================
// API: RECEIVE GIFT
// ===============================

app.post("/api/claim", async(req, res) => {
    try {
        const { ticket, prize, time } = req.body || {};

        if (ticket == null || prize == null) {
            return res.status(400).json({
                success: false,
                message: "Thiếu thông tin vé hoặc phần thưởng"
            });
        }

        const claim = {
            id: Date.now(),
            ticket,
            prize,
            time: time || new Date().toLocaleString("vi-VN", {
                timeZone: "Asia/Ho_Chi_Minh"
            }),
            ip: req.ip
        };

        let claims = [];

        try {
            if (fs.existsSync(claimsFile)) {
                const file = fs.readFileSync(claimsFile, "utf8");
                if (file.trim()) {
                    claims = JSON.parse(file);
                    if (!Array.isArray(claims)) claims = [];
                }
            }
        } catch (error) {
            console.error("Không đọc được claims.json:", error);
            claims = [];
        }

        claims.push(claim);

        fs.writeFileSync(
            claimsFile,
            JSON.stringify(claims, null, 2),
            "utf8"
        );

        const telegramMessage =
            "🎁 CÓ NGƯỜI VỪA NHẬN QUÀ!\n\n" +
            `🎟️ Vé: ${ticket}\n\n` +
            `💰 Phần thưởng: ${prize}\n\n` +
            `🕐 Thời gian: ${claim.time}\n\n` +
            `🆔 ID: ${claim.id}`;

        await sendTelegram(telegramMessage);

        return res.json({
            success: true,
            message: "Đã nhận yêu cầu và gửi thông báo Telegram"
        });
    } catch (error) {
        console.error("Lỗi /api/claim:", error);

        return res.status(500).json({
            success: false,
            message: "Không xử lý được yêu cầu nhận quà"
        });
    }
});

// ===============================
// API: SEND BIRTHDAY WISH
// ===============================

app.post("/api/wish", async(req, res) => {
    try {
        const wish = String(
            (req.body && req.body.wish) || ""
        ).trim();

        if (!wish || wish.length > 160) {
            return res.status(400).json({
                success: false,
                message: "Điều ước phải có từ 1 đến 160 ký tự"
            });
        }

        const time = new Date().toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh"
        });

        const telegramMessage =
            "💌 ĐIỀU ƯỚC SINH NHẬT\n\n" +
            `✨ Nội dung: ${wish}\n\n` +
            `🕒 Thời gian: ${time}`;

        await sendTelegram(telegramMessage);

        console.log("💌 Đã gửi điều ước:", wish);

        return res.json({
            success: true,
            message: "Đã gửi điều ước đến Telegram"
        });
    } catch (error) {
        console.error("Lỗi /api/wish:", error);

        return res.status(500).json({
            success: false,
            message: "Không gửi được điều ước đến Telegram"
        });
    }
});

// ===============================
// TEST BACKEND
// ===============================

app.get("/", (req, res) => {
    res.send("Backend Happy Birthday đang chạy ❤️");
});

// ===============================
// START SERVER
// ===============================

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend đang chạy tại port ${PORT}`);
});