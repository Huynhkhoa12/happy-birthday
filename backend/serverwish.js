// serverwish.js

const { sendTelegram } = require("./server");
async function wishHandler(req, res) {
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

        const message =
            "💌 ĐIỀU ƯỚC SINH NHẬT\n\n" +
            "✨ Nội dung:\n" + wish +
            "\n\n🕒 Thời gian: " + time;

        // Gọi lại hàm Telegram của server chính
        const sent = await sendTelegram(message);

        if (!sent) {
            return res.status(502).json({
                success: false,
                message: "Không gửi được điều ước đến Telegram"
            });
        }

        return res.json({
            success: true,
            message: "Đã gửi điều ước đến Telegram"
        });

    } catch (error) {
        console.error("Lỗi wish:", error);

        return res.status(500).json({
            success: false,
            message: "Lỗi máy chủ"
        });
    }
}

module.exports = { wishHandler };