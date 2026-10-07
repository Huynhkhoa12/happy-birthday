const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

// Render sẽ cấp PORT.
// Khi chạy máy tính thì dùng 3000.
const PORT = process.env.PORT || 3000;

// ===============================
// TELEGRAM
// ===============================

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// Hàm gửi thông báo Telegram
async function sendTelegram(message) {
    if (!BOT_TOKEN || !CHAT_ID) {
        console.log("⚠️ Chưa cấu hình BOT_TOKEN hoặc CHAT_ID");
        return;
    }

    try {
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

        if (!data.ok) {
            console.log("❌ Telegram lỗi:", data);
        } else {
            console.log("✅ Đã gửi thông báo Telegram");
        }

    } catch (error) {
        console.error(
            "❌ Không gửi được Telegram:",
            error
        );
    }
}


// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());

app.use(express.json());


// ===============================
// FILE LƯU DỮ LIỆU
// ===============================

const claimsFile = path.join(
    __dirname,
    "claims.json"
);


// ===============================
// API NHẬN QUÀ
// ===============================

app.post(
    "/api/claim",
    async(req, res) => {

        try {

            const {
                ticket,
                prize,
                time
            } = req.body;


            // ===============================
            // TẠO CLAIM
            // ===============================

            const claim = {

                id: Date.now(),

                ticket: ticket,

                prize: prize,

                time: time,

                ip: req.ip

            };


            let claims = [];


            // ===============================
            // ĐỌC CLAIMS.JSON
            // ===============================

            try {

                if (
                    fs.existsSync(
                        claimsFile
                    )
                ) {

                    const file =
                        fs.readFileSync(
                            claimsFile,
                            "utf8"
                        );


                    if (file.trim()) {

                        claims =
                            JSON.parse(
                                file
                            );

                    }

                }

            } catch (error) {

                console.log(
                    "Không đọc được claims.json"
                );

                claims = [];

            }


            // ===============================
            // THÊM CLAIM
            // ===============================

            claims.push(
                claim
            );


            // ===============================
            // LƯU CLAIM
            // ===============================

            fs.writeFileSync(
                claimsFile,
                JSON.stringify(
                    claims,
                    null,
                    2
                ),
                "utf8"
            );


            // ===============================
            // CONSOLE
            // ===============================

            console.log("");

            console.log(
                "=============================="
            );

            console.log(
                "🎁 CÓ NGƯỜI NHẬN QUÀ"
            );

            console.log(
                "Vé:",
                ticket
            );

            console.log(
                "Phần thưởng:",
                prize
            );

            console.log(
                "Thời gian:",
                time
            );

            console.log(
                "=============================="
            );

            console.log("");


            // ===============================
            // GỬI TELEGRAM
            // ===============================

            const telegramMessage =

                `🎁 CÓ NGƯỜI VỪA NHẬN QUÀ!

🎟️ Vé: ${ticket}

💰 Phần thưởng: ${prize}

🕐 Thời gian: ${time}

🆔 ID: ${claim.id}`;


            await sendTelegram(
                telegramMessage
            );


            // ===============================
            // TRẢ KẾT QUẢ
            // ===============================

            res.json({

                success: true,

                message: "Đã nhận yêu cầu nhận quà"

            });


        } catch (error) {

            console.error(
                error
            );


            res.status(500).json({

                success: false,

                message: "Có lỗi xảy ra"

            });

        }

    }
);


// ===============================
// TEST BACKEND
// ===============================

app.get(
    "/",
    (req, res) => {

        res.send(
            "Backend Happy Birthday đang chạy ❤️"
        );

    }
);


// ===============================
// CHẠY SERVER
// ===============================

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `Backend đang chạy tại port ${PORT}`
        );

    }
);