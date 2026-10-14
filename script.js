// =================================================================
// HIỆU ỨNG NỀN VÀ PHÁO HOA (canvas)
// =================================================================
const FX = (() => {
    const reduced = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const GOLDS = ["#f9e7ae", "#f5dc9e", "#d4ad5a", "#fff2c6", "#ffffff"];
    const MIX = ["#f9e7ae", "#d4ad5a", "#ee6a8c", "#ffb3c4", "#fff6e6", "#ff8fa8"];
    const dpr = () => Math.min(2, window.devicePixelRatio || 1);

    const ambient = document.getElementById("fxAmbient");
    const burst = document.getElementById("fxBurst");
    const actx = ambient ? ambient.getContext("2d") : null;
    const bctx = burst ? burst.getContext("2d") : null;
    let W = 0,
        H = 0;

    function resize() {
        W = window.innerWidth;
        H = window.innerHeight;
        [ambient, burst].forEach((c) => {
            if (!c) return;
            c.width = Math.round(W * dpr());
            c.height = Math.round(H * dpr());
        });
        if (actx) actx.setTransform(dpr(), 0, 0, dpr(), 0, 0);
        if (bctx) bctx.setTransform(dpr(), 0, 0, dpr(), 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    const rnd = (a, b) => a + Math.random() * (b - a);
    const pick = (list) => list[Math.floor(Math.random() * list.length)];

    // ---------- bụi vàng bay lơ lửng ----------
    const dust = [];
    const DUST = reduced ? 0 : (W < 600 ? 34 : 64);

    for (let i = 0; i < DUST; i++) {
        dust.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r: rnd(.6, 2.1),
            vy: rnd(.1, .4),
            vx: rnd(-.12, .12),
            ph: Math.random() * 6.28,
            sp: rnd(.6, 1.8),
            c: pick(GOLDS)
        });
    }

    function drawDust(t) {
        if (!actx) return;
        actx.clearRect(0, 0, W, H);

        for (const p of dust) {
            p.y -= p.vy;
            p.x += p.vx + Math.sin(t / 1800 + p.ph) * .12;

            if (p.y < -6) {
                p.y = H + 6;
                p.x = Math.random() * W;
            }
            if (p.x < -6) p.x = W + 6;
            if (p.x > W + 6) p.x = -6;

            const a = .25 + .55 * (.5 + .5 * Math.sin(t / 1000 * p.sp + p.ph));

            actx.globalAlpha = a;
            actx.fillStyle = p.c;
            actx.shadowColor = p.c;
            actx.shadowBlur = p.r * 5;
            actx.beginPath();
            actx.arc(p.x, p.y, p.r, 0, 6.2832);
            actx.fill();
        }

        actx.globalAlpha = 1;
        actx.shadowBlur = 0;
    }

    // ---------- confetti / tia lửa / trái tim ----------
    const parts = [];
    let running = false;
    let last = 0;

    function add(p) {
        if (parts.length < 900) parts.push(p);
        if (!running) {
            running = true;
            last = performance.now();
            requestAnimationFrame(burstLoop);
        }
    }

    function confetti(x, y, count, o) {
        if (reduced) return;
        o = Object.assign({ spread: Math.PI * 2, angle: -Math.PI / 2, power: 9, colors: MIX, gravity: .22 }, o);

        for (let i = 0; i < count; i++) {
            const a = o.angle + (Math.random() - .5) * o.spread;
            const v = rnd(.35, 1) * o.power;
            const kind = Math.random();

            add({
                k: kind < .12 ? "heart" : kind < .5 ? "rect" : "strip",
                x,
                y,
                vx: Math.cos(a) * v,
                vy: Math.sin(a) * v,
                g: o.gravity,
                drag: .985,
                w: rnd(5, 10),
                h: rnd(3, 6),
                rot: Math.random() * 6.28,
                vr: rnd(-.25, .25),
                tilt: Math.random() * 6.28,
                c: pick(o.colors),
                life: rnd(90, 170),
                age: 0
            });
        }
    }

    function firework(x, y, color) {
        if (reduced) return;
        const n = 46;
        const base = color || pick(MIX);

        for (let i = 0; i < n; i++) {
            const a = (i / n) * 6.2832 + rnd(-.05, .05);
            const v = rnd(2.2, 5.6);

            add({
                k: "spark",
                x,
                y,
                vx: Math.cos(a) * v,
                vy: Math.sin(a) * v,
                g: .05,
                drag: .965,
                r: rnd(1.2, 2.4),
                c: Math.random() < .3 ? "#ffffff" : base,
                life: rnd(46, 80),
                age: 0
            });
        }

        // quầng sáng ngắn
        add({ k: "flash", x, y, r: 6, life: 14, age: 0, c: base });
    }

    // Pháo thăng thiên: bay từ đáy màn hình lên độ cao ty rồi nổ.
    function rocket(x, ty, color, shape) {
        if (reduced) return;
        const g = .12;
        const startY = H + 10;
        const dist = Math.max(80, startY - ty);

        add({
            k: "rocket",
            x,
            y: startY,
            vx: rnd(-.5, .5),
            vy: -Math.sqrt(2 * g * dist),
            g,
            drag: 1,
            r: 2.4,
            c: color || pick(MIX),
            shape: shape || "ring",
            life: 600,
            age: 0
        });
    }

    // Pháo nổ hình trái tim
    function heartBurst(x, y, color) {
        if (reduced) return;
        const base = color || "#ff8fa8";
        const n = 70;

        for (let i = 0; i < n; i++) {
            const t = (i / n) * 6.2832;
            const hx = 16 * Math.pow(Math.sin(t), 3);
            const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

            add({
                k: "spark",
                x,
                y,
                vx: hx * .3,
                vy: hy * .3,
                g: .03,
                drag: .955,
                r: rnd(1.4, 2.4),
                c: Math.random() < .25 ? "#ffffff" : base,
                life: rnd(70, 95),
                age: 0
            });
        }

        add({ k: "flash", x, y, r: 10, life: 16, age: 0, c: base });
    }

    function rain(ms) {
        if (reduced) return;
        const end = performance.now() + ms;

        (function tick() {
            if (performance.now() > end) return;
            confetti(rnd(0, W), -10, 3, { spread: .8, angle: Math.PI / 2, power: 3.4, gravity: .06 });
            setTimeout(tick, 80);
        })();
    }

    function show(ms, count) {
        if (reduced) return;
        const n = count || 6;

        for (let i = 0; i < n; i++) {
            setTimeout(() => firework(rnd(W * .15, W * .85), rnd(H * .12, H * .5)), i * (ms / n) + rnd(0, 120));
        }
    }

    function burstLoop(now) {
        const dt = Math.min(2.2, (now - last) / 16.67);
        last = now;

        bctx.clearRect(0, 0, W, H);

        for (let i = parts.length - 1; i >= 0; i--) {
            const p = parts[i];
            p.age += dt;

            if (p.age >= p.life) { parts.splice(i, 1); continue; }

            const f = 1 - p.age / p.life;

            if (p.k === "flash") {
                const r = p.r + p.age * 5;
                const g = bctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
                g.addColorStop(0, "rgba(255,255,255," + (.7 * f) + ")");
                g.addColorStop(1, "rgba(255,230,160,0)");
                bctx.fillStyle = g;
                bctx.beginPath();
                bctx.arc(p.x, p.y, r, 0, 6.2832);
                bctx.fill();
                continue;
            }

            p.vx *= Math.pow(p.drag || 1, dt);
            p.vy = p.vy * Math.pow(p.drag || 1, dt) + p.g * dt;
            p.x += p.vx * dt;
            p.y += p.vy * dt;

            if (p.k === "rocket") {
                // tới đỉnh thì nổ
                if (p.vy >= -.4) {
                    parts.splice(i, 1);
                    if (p.shape === "heart") heartBurst(p.x, p.y, p.c);
                    else firework(p.x, p.y, p.c);
                    continue;
                }

                bctx.globalAlpha = 1;
                bctx.fillStyle = "#fff6e0";
                bctx.shadowColor = p.c;
                bctx.shadowBlur = 14;
                bctx.beginPath();
                bctx.arc(p.x, p.y, p.r, 0, 6.2832);
                bctx.fill();
                bctx.shadowBlur = 0;

                // vệt lửa phía sau
                add({
                    k: "spark",
                    x: p.x + rnd(-1, 1),
                    y: p.y + 3,
                    vx: rnd(-.3, .3),
                    vy: rnd(.4, 1.2),
                    g: .02,
                    drag: .94,
                    r: rnd(.6, 1.4),
                    c: Math.random() < .5 ? "#ffd9a0" : p.c,
                    life: rnd(14, 28),
                    age: 0
                });
                continue;
            }

            if (p.k === "spark") {
                bctx.globalAlpha = Math.min(1, f * 1.6);
                bctx.fillStyle = p.c;
                bctx.shadowColor = p.c;
                bctx.shadowBlur = 10;
                bctx.beginPath();
                bctx.arc(p.x, p.y, p.r * (.4 + f * .8), 0, 6.2832);
                bctx.fill();
                // vệt đuôi
                bctx.globalAlpha *= .35;
                bctx.beginPath();
                bctx.arc(p.x - p.vx * 1.6, p.y - p.vy * 1.6, p.r * .6 * f, 0, 6.2832);
                bctx.fill();
                bctx.shadowBlur = 0;
                continue;
            }

            p.rot += p.vr * dt;
            p.tilt += .12 * dt;

            bctx.globalAlpha = Math.min(1, f * 2.2);
            bctx.fillStyle = p.c;
            bctx.save();
            bctx.translate(p.x, p.y);
            bctx.rotate(p.rot);

            if (p.k === "heart") {
                bctx.font = Math.round(p.w * 1.7) + "px serif";
                bctx.textAlign = "center";
                bctx.textBaseline = "middle";
                bctx.fillText("♥", 0, 0);
            } else {
                // lật 3D giả bằng scaleY theo tilt
                bctx.scale(1, Math.cos(p.tilt));
                if (p.k === "strip") bctx.fillRect(-p.w, -1.2, p.w * 2, 2.4);
                else bctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            }

            bctx.restore();
        }

        bctx.globalAlpha = 1;

        if (parts.length) {
            requestAnimationFrame(burstLoop);
        } else {
            running = false;
            bctx.clearRect(0, 0, W, H);
        }
    }

    // vòng lặp nền, tạm dừng khi tab bị ẩn
    function ambientLoop(t) {
        if (!document.hidden) drawDust(t);
        requestAnimationFrame(ambientLoop);
    }

    if (DUST) requestAnimationFrame(ambientLoop);

    return { confetti, firework, rocket, heartBurst, show, rain, size: () => ({ W, H }) };
})();

// Vị trí giữa phần tử, dùng làm tâm pháo
function centerOf(el) {
    if (!el) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

// Ảnh nền trôi: rải ngẫu nhiên vị trí, cỡ, tốc độ
(function scatterPhotos() {
    const imgs = [...document.querySelectorAll(".falling-photos img")];
    const small = window.innerWidth < 600;

    imgs.forEach((img, i) => {
        const w = (small ? 54 : 70) + Math.random() * (small ? 26 : 50);

        img.style.setProperty("--x", (4 + (i / imgs.length) * 90 + Math.random() * 4 - 2).toFixed(1) + "%");
        img.style.setProperty("--w", w.toFixed(0) + "px");
        img.style.setProperty("--dur", (26 + Math.random() * 20).toFixed(1) + "s");
        img.style.setProperty("--delay", (-Math.random() * 40).toFixed(1) + "s");
        img.style.setProperty("--r0", (Math.random() * 24 - 12).toFixed(1) + "deg");
        img.style.setProperty("--r1", (Math.random() * 30 - 15).toFixed(1) + "deg");
        img.style.setProperty("--blur", (1 + Math.random() * 2.4).toFixed(1) + "px");
        img.style.setProperty("--op", (.08 + Math.random() * .1).toFixed(2));
        img.addEventListener("error", () => img.remove());
    });
})();

document.addEventListener("DOMContentLoaded", () => {
    // =============================================
    // 1. CÁC PHẦN TỬ HTML
    // =============================================
    const $ = (id) => document.getElementById(id);

    const birthdayCountdown = $("birthdayCountdown");
    const letterScene = $("letterScene");
    const envelopeWrapper = document.querySelector(".envelope-wrapper");
    const envelope = $("envelope");
    const seal = $("seal");
    const message = $("message");
    const continueBtn = $("continueBtn");

    const cakeScreen = $("cakeScreen");
    const cake = document.querySelector(".cake");
    const openGiftBtn = $("openGiftBtn");

    const scratchScreen = $("scratchScreen");
    const ticketSelection = $("ticketSelection");
    const tickets = [...document.querySelectorAll(".ticket")];
    const ticketsContainer = document.querySelector(".tickets");

    const selectedTicket = $("selectedTicket");
    const selectedTicketNumber = $("selectedTicketNumber");
    const scratchCanvas = $("scratchCanvas");
    const scratchProgress = $("scratchProgress");
    const moneyPrize = $("moneyPrize");

    const claimSuccess = $("claimSuccess");
    const successMoney = $("successMoney");
    const finalClaimBtn = $("finalClaimBtn");
    const musicBtn = $("musicBtn");
    const bgMusic = $("bgMusic");

    // =============================================
    // 2. ĐẾM NGƯỢC
    // Đếm ngược tới 0h ngày 12/01/2027 (giờ Việt Nam).
    // Muốn test nhanh: bỏ // ở dòng test và thêm // vào dòng trên nó.
    // =============================================
    // const BIRTHDAY_TIME = new Date("2027-01-12T00:00:00+07:00").getTime(); // ngày thật
    const BIRTHDAY_TIME = Date.now() + 10 * 1000; // TEST 10 giây

    let countdownTimer = null;

    function showLetterScene() {
        if (countdownTimer !== null) {
            clearInterval(countdownTimer);
            countdownTimer = null;
        }

        if (birthdayCountdown) {
            birthdayCountdown.style.display = "none";
        }

        if (letterScene) {
            letterScene.style.display = "";
        }
    }

    // =============================================
    // 2B. MÀN HÌNH HAPPY BIRTHDAY + PHÁO HOA
    // =============================================
    const hbScene = $("hbScene");
    const hbBtn = $("hbBtn");
    const HB_REDUCED = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let hbTimers = [];
    let hbLoop = null;
    let hbShown = false;

    const hbRand = (a, b) => a + Math.random() * (b - a);
    const HB_COLORS = ["#f9e7ae", "#ee6a8c", "#ffb3c4", "#d4ad5a", "#ff8fa8", "#fff6e6"];

    // Tách chữ thành từng ký tự để hiện lần lượt
    (function splitHbLetters() {
        if (!hbScene) return;
        let index = 0;

        hbScene.querySelectorAll("[data-split]").forEach((line) => {
            const text = line.textContent.trim();
            line.textContent = "";

            [...text].forEach((ch) => {
                const span = document.createElement("span");
                span.textContent = ch;
                if (ch === " ") span.className = "hb-space";
                span.style.setProperty("--i", index++);
                line.appendChild(span);
            });
        });
    })();

    function hbLater(fn, ms) {
        hbTimers.push(setTimeout(fn, ms));
    }

    function stopCelebration() {
        hbTimers.forEach(clearTimeout);
        hbTimers = [];
        clearInterval(hbLoop);
        hbLoop = null;
    }

    function showCelebration() {
        if (countdownTimer !== null) {
            clearInterval(countdownTimer);
            countdownTimer = null;
        }

        if (birthdayCountdown) birthdayCountdown.style.display = "none";
        if (letterScene) letterScene.style.display = "none";

        // Không có màn hình này thì đi thẳng tới phong bì
        if (!hbScene) {
            showLetterScene();
            return;
        }

        if (hbShown) return;
        hbShown = true;

        hbScene.classList.add("show");

        if (HB_REDUCED) {
            hbScene.classList.add("reveal", "ready");
            return;
        }

        const size = () => FX.size();

        // 1. Loạt pháo đầu tiên bắn lên
        [0, 300, 600, 900, 1200, 1450].forEach((t, k) => {
            hbLater(() => {
                const { W, H } = size();
                const x = W * (0.14 + (k % 6) * 0.145) + hbRand(-20, 20);
                FX.rocket(x, H * hbRand(0.14, 0.34), HB_COLORS[k % HB_COLORS.length]);
            }, t);
        });

        // 2. Pháo trái tim ở giữa + chữ hiện ra
        hbLater(() => {
            const { W, H } = size();
            FX.rocket(W / 2, H * 0.24, "#ff8fa8", "heart");
        }, 1700);

        hbLater(() => hbScene.classList.add("reveal"), 2450);

        // 3. Màn kết bùng nổ
        hbLater(() => {
            const { W, H } = size();
            FX.confetti(W / 2, H * 0.4, 110, { power: 12, spread: 6.28, gravity: .16 });
            FX.rocket(W * 0.25, H * 0.2, "#f9e7ae");
            FX.rocket(W * 0.75, H * 0.2, "#ffb3c4");
        }, 3100);

        hbLater(() => FX.rain(3000), 3400);

        // 4. Hiện nút sang lá thư
        hbLater(() => hbScene.classList.add("ready"), 4200);

        // 5. Pháo hoa bắn nhẹ liên tục cho đến khi rời trang
        hbLater(() => {
            hbLoop = setInterval(() => {
                if (document.hidden) return;
                const { W, H } = size();
                FX.rocket(
                    W * hbRand(0.12, 0.88),
                    H * hbRand(0.12, 0.38),
                    HB_COLORS[Math.floor(Math.random() * HB_COLORS.length)],
                    Math.random() < 0.18 ? "heart" : "ring"
                );
            }, 1100);
        }, 4000);
    }

    if (hbScene) {
        // Chạm vào màn hình: bắn pháo tới đúng chỗ chạm
        hbScene.addEventListener("click", (event) => {
            if (event.target.closest("button")) return;
            const color = HB_COLORS[Math.floor(Math.random() * HB_COLORS.length)];
            FX.rocket(event.clientX, event.clientY, color, Math.random() < 0.3 ? "heart" : "ring");
        });
    }

    if (hbBtn) {
        hbBtn.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            stopCelebration();
            startMusic();

            hbScene.classList.remove("show");

            setTimeout(() => {
                hbScene.classList.remove("reveal", "ready");
                showLetterScene();
            }, 500);
        });
    }

    function updateCountdown() {
        const remaining = BIRTHDAY_TIME - Date.now();

        if (remaining <= 0) {
            showCelebration();
            return;
        }

        const secondsLeft = Math.floor(remaining / 1000);
        const days = Math.floor(secondsLeft / 86400);
        const hours = Math.floor((secondsLeft % 86400) / 3600);
        const minutes = Math.floor((secondsLeft % 3600) / 60);
        const seconds = secondsLeft % 60;

        function updateNumber(id, value, digits = 2) {
            const element = $(id);

            if (element) {
                element.textContent = String(value).padStart(digits, "0");
            }
        }

        updateNumber("countDays", days, 3);
        updateNumber("countHours", hours);
        updateNumber("countMinutes", minutes);
        updateNumber("countSeconds", seconds);
    }

    function initBirthdayCountdown() {
        if (!birthdayCountdown || !letterScene) return;

        if (Date.now() >= BIRTHDAY_TIME) {
            showCelebration();
            return;
        }

        birthdayCountdown.style.display = "flex";
        letterScene.style.display = "none";

        updateCountdown();
        countdownTimer = setInterval(updateCountdown, 250);
    }

    // =============================================
    // 3. GIÁ TRỊ QUÀ
    // =============================================
    const ACTUAL_PRIZE = "15.000.000 VNĐ";

    const ticketPrizes = [
        "5.000.000đ",
        "7.000.000đ",
        "9.000.000đ",
        "11.000.000đ",
        "13.000.000đ",
        "15.000.000đ"
    ];

    let selectedNumber = null;

    // Hiện mệnh giá trên mặt trước trước khi xào.
    function showTicketPrices() {
        tickets.forEach((ticket, index) => {
            const prize = ticket.querySelector(".ticket-prize");

            if (prize) {
                prize.textContent = ticketPrizes[index] || "";
                prize.style.display = "";
            }
        });
    }

    // Xóa tiền nhưng giữ nguyên ảnh và thiết kế của thẻ.
    function hideTicketPrices() {
        tickets.forEach((ticket) => {
            const prize = ticket.querySelector(".ticket-prize");

            if (prize) {
                prize.textContent = "";
                prize.style.display = "none";
            }
        });
    }

    showTicketPrices();

    // =============================================
    // 4. NHẠC NỀN
    // =============================================
    function updateMusicButton() {
        if (!musicBtn) return;

        musicBtn.textContent = !bgMusic || bgMusic.paused ? "🔇" : "🔊";
    }

    let musicStarted = false;

    async function startMusic() {
        if (!bgMusic) return;

        try {
            bgMusic.volume = 0.35;
            await bgMusic.play();
            musicStarted = true;
        } catch (error) {
            console.warn("Trình duyệt chưa cho phép phát nhạc:", error);
        }

        updateMusicButton();
    }

    function stopMusic() {
        if (!bgMusic) return;

        bgMusic.pause();
        updateMusicButton();
    }

    if (musicBtn) {
        musicBtn.addEventListener("click", async(event) => {
            event.preventDefault();

            if (!bgMusic) return;

            if (bgMusic.paused) {
                await startMusic();
            } else {
                stopMusic();
            }
        });
    }

    if (bgMusic) {
        bgMusic.addEventListener("play", updateMusicButton);
        bgMusic.addEventListener("pause", updateMusicButton);
    }

    // =============================================
    // 5. NỘI DUNG LÁ THƯ
    // =============================================
    const letterText = `Hôm nay là một ngày thật đặc biệt, vì đó là ngày một người con gái rất đặc biệt xuất hiện trên thế giới này.

Anh mong tuổi mới của em sẽ luôn có thật nhiều niềm vui, luôn xinh đẹp, hạnh phúc và gặp thật nhiều điều may mắn.

Cảm ơn em vì đã xuất hiện trong cuộc đời anh.

Chúc em sinh nhật vui vẻ ❤️`;

    let typingTimer = null;

    function typeLetter() {
        if (!message) return;

        clearInterval(typingTimer);
        message.textContent = "";
        message.classList.add("typing");

        if (continueBtn) {
            continueBtn.classList.remove("show");
        }

        let index = 0;

        typingTimer = setInterval(() => {
            message.textContent += letterText.charAt(index);
            index++;

            if (index >= letterText.length) {
                clearInterval(typingTimer);
                typingTimer = null;
                message.classList.remove("typing");

                if (continueBtn) {
                    continueBtn.classList.add("show");
                }
            }
        }, 28);
    }

    // =============================================
    // 6. MỞ PHONG BÌ
    // =============================================
    const REDUCED = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Mốc thời gian (ms): thư trượt ra, thư bay ra giữa, bắt đầu gõ chữ
    const T = REDUCED ? { rise: 0, reading: 300, type: 700 } : { rise: 1050, reading: 2350, type: 3800 };

    let envelopeOpened = false;

    // Hạt vàng và trái tim bay ra từ một điểm trên phong bì
    function burst(count, top) {
        if (!envelopeWrapper || REDUCED) return;

        const fragment = document.createDocumentFragment();

        for (let i = 0; i < count; i++) {
            const el = document.createElement("i");
            const isHeart = i % 5 === 0;
            const angle = Math.random() * Math.PI * 2;
            const distance = 90 + Math.random() * 190;

            el.className = "burst" + (isHeart ? " heart" : "");
            if (isHeart) el.textContent = "♥";

            el.style.top = top;
            el.style.setProperty("--dx", Math.cos(angle) * distance + "px");
            el.style.setProperty("--dy", Math.sin(angle) * distance * 0.8 - 30 + "px");
            el.style.setProperty("--dur", (0.9 + Math.random() * 0.8).toFixed(2) + "s");
            el.style.setProperty("--delay", (Math.random() * 0.15).toFixed(2) + "s");
            el.style.setProperty("--s", (0.6 + Math.random() * 0.9).toFixed(2));
            el.style.setProperty("--size", Math.round(10 + Math.random() * 10) + "px");
            el.addEventListener("animationend", () => el.remove());

            fragment.appendChild(el);
        }

        envelopeWrapper.appendChild(fragment);
    }

    if (seal) {
        seal.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (envelopeOpened) return;
            envelopeOpened = true;

            // 1. Con dấu vỡ, nắp phong bì mở ra
            if (envelopeWrapper) {
                envelopeWrapper.classList.add("open");
            }

            if (envelope) {
                envelope.classList.add("open");
            }

            burst(18, "calc(50% + 24px)"); {
                const c = centerOf(seal);
                FX.confetti(c.x, c.y, 34, { power: 7, spread: 5.4, angle: -1.57 });
            }
            startMusic();

            // 2. Thư trượt ra khỏi phong bì
            setTimeout(() => {
                if (envelopeWrapper) envelopeWrapper.classList.add("rise");
            }, T.rise);

            // 3. Thư bay ra giữa màn hình, phong bì mờ dần
            setTimeout(() => {
                if (envelopeWrapper) envelopeWrapper.classList.add("reading");
                burst(26, "50%");
                FX.show(1200, 3);
            }, T.reading);

            // 4. Gõ chữ
            setTimeout(typeLetter, T.type);
        });
    }

    // =============================================
    // 7. TỪ LÁ THƯ ĐẾN BÁNH SINH NHẬT
    // =============================================
    if (continueBtn) {
        continueBtn.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            clearInterval(typingTimer);

            if (letterScene) {
                letterScene.style.display = "none";
            }

            if (cakeScreen) {
                cakeScreen.classList.add("show");
            }

            resetCake();
            setTimeout(showWish, 1300);
        });
    }

    // Thổi nến: chạm vào bánh (tự thổi sau 9 giây nếu chưa chạm)
    const cakeStage = $("cakeStage");
    const cakeHint = $("cakeHint");
    const cakeSub = $("cakeSub");
    let cakeBlown = false;
    let cakeAuto = null;

    // ---- Ghi điều ước vào giấy ----
    const wishOverlay = $("wishOverlay");
    const wishForm = $("wishForm");
    const wishText = $("wishText");
    const wishCount = $("wishCount");
    const wishSend = $("wishSend");
    const wishSkip = $("wishSkip");
    let wishDone = false;
    let wishValue = "";

    // Gửi điều ước về máy chủ (máy chủ chuyển tiếp sang Telegram).
    // Chạy ngầm, không chặn hiệu ứng; thử lại 1 lần nếu máy chủ đang ngủ.
    const API_BASE = "https://happy-birthday-vsiz.onrender.com";

    // Đánh thức máy chủ miễn phí sớm để lúc gửi không phải chờ.
    fetch(API_BASE, { mode: "no-cors" }).catch(() => {});

    async function sendWish(text) {
        const body = JSON.stringify({
            wish: text,
            time: new Date().toLocaleString("vi-VN")
        });

        for (let attempt = 0; attempt < 2; attempt++) {
            try {
                const controller = new AbortController();
                const timer = setTimeout(() => controller.abort(), 60000);
                const response = await fetch(API_BASE + "/api/wish", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body,
                    signal: controller.signal,
                    keepalive: true
                });
                clearTimeout(timer);
                if (response.ok) return true;
            } catch (error) {
                console.warn("Gửi điều ước lần " + (attempt + 1) + " lỗi:", error);
            }
            await new Promise((r) => setTimeout(r, 2000));
        }

        return false;
    }

    function showWish() {
        if (!wishOverlay || wishDone) return;
        wishOverlay.classList.remove("sending");
        wishOverlay.classList.add("show");
        wishOverlay.setAttribute("aria-hidden", "false");
        setTimeout(() => { if (wishText) wishText.focus({ preventScroll: true }); }, 700);
    }

    function finishWish(sent) {
        if (wishDone) return;
        wishDone = true;

        if (cakeSub) {
            cakeSub.textContent = sent ?
                "Điều ước đã bay lên rồi ✨ Giờ hãy thổi nến nhé" :
                "Giờ hãy thổi nến nhé ✨";
        }

        if (cakeHint) cakeHint.style.opacity = "";
        armCake();
    }

    function hideWish() {
        wishOverlay.classList.remove("show", "sending");
        wishOverlay.setAttribute("aria-hidden", "true");
    }

    if (wishText) {
        wishText.addEventListener("input", () => {
            const n = wishText.value.length;
            wishCount.textContent = n + "/160";
            wishSend.disabled = wishText.value.trim().length === 0;
        });
    }

    if (wishForm) {
        wishForm.addEventListener("submit", (event) => {
            event.preventDefault();
            wishValue = wishText.value.trim();
            if (!wishValue || wishDone) return;

            wishSend.disabled = true;
            wishText.blur();
            sendWish(wishValue);
            wishOverlay.classList.add("sending");

            // paper bay lên: rắc kim tuyến theo đường bay
            const start = centerOf(wishForm);
            const fly = REDUCED ? 0 : 1100;

            setTimeout(() => {
                FX.confetti(start.x, start.y, 40, { power: 6, spread: 6.28, gravity: .05 });
            }, fly * .5);
            setTimeout(() => {
                FX.confetti(start.x, start.y * .4, 60, { power: 8, spread: 6.28, angle: -1.57, gravity: .08 });
                FX.show(900, 3);
            }, fly + 200);

            setTimeout(() => {
                hideWish();
                finishWish(true);
            }, REDUCED ? 200 : 2500);
        });
    }

    if (wishSkip) {
        wishSkip.addEventListener("click", () => {
            hideWish();
            finishWish(false);
        });
    }

    function resetCake() {
        wishDone = false;
        wishValue = "";
        if (wishText) {
            wishText.value = "";
            wishCount.textContent = "0/160";
            wishSend.disabled = true;
        }
        if (wishOverlay) hideWish();
        if (cakeHint) cakeHint.style.opacity = "0";
        cakeBlown = false;
        clearTimeout(cakeAuto);
        if (cake) cake.classList.remove("candles-off");
        if (cakeStage) cakeStage.classList.remove("done");
        if (openGiftBtn) openGiftBtn.classList.remove("show");
        if (cakeSub) cakeSub.textContent = "Hãy nhắm mắt và ước một điều nhé ❤️";
    }

    function armCake() {
        cakeAuto = setTimeout(blowCandles, 9000);
    }

    function blowCandles() {
        if (cakeBlown || !wishDone) return;
        cakeBlown = true;
        clearTimeout(cakeAuto);

        if (cake) cake.classList.add("candles-off");
        if (cakeStage) cakeStage.classList.add("done");
        if (cakeSub) cakeSub.textContent = "Điều ước của em sẽ thành sự thật ✨";

        const c = centerOf(cakeStage);
        FX.confetti(c.x, c.y - 70, 90, { power: 11, spread: 2.6, angle: -1.57, gravity: .2 });
        setTimeout(() => FX.show(1400, 4), 350);

        setTimeout(() => {
            if (openGiftBtn) openGiftBtn.classList.add("show");
        }, 1100);
    }

    if (cakeStage) {
        cakeStage.addEventListener("click", blowCandles);
    }

    // =============================================
    // 8. XÀO 6 THẺ
    // Lật úp -> gom thành chồng -> xào chia đôi 3 lượt
    // -> chia bài về chỗ -> lật lại.
    // =============================================
    let ticketShuffleReady = false;
    let shuffleRun = 0;

    const ticketNote = ticketSelection ?
        ticketSelection.querySelector(".ticket-note") :
        null;
    const NOTE_DEFAULT = ticketNote ? ticketNote.textContent.trim() : "";
    const CAN_ANIMATE = typeof Element.prototype.animate === "function";

    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const rand = (min, max) => min + Math.random() * (max - min);

    function shuffled(list) {
        const copy = list.slice();

        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }

        return copy;
    }

    function setNote(text, live) {
        if (!ticketNote) return;

        ticketNote.textContent = text;
        ticketNote.classList.toggle("is-live", Boolean(live));
    }

    // Đưa mọi thẻ về trạng thái gốc.
    function resetTickets() {
        tickets.forEach((ticket) => {
            if (typeof ticket.getAnimations === "function") {
                ticket.getAnimations().forEach((animation) => animation.cancel());
            }

            ticket.classList.remove("is-back");
            ticket.style.transform = "";
            ticket.style.transition = "";
            ticket.style.zIndex = "";
        });

        if (ticketsContainer) {
            ticketsContainer
                .querySelectorAll(".deck-glow, .burst")
                .forEach((element) => element.remove());
        }
    }

    // Hạt vàng và trái tim bắn ra từ giữa chồng bài.
    function deckSparkles(count) {
        if (!ticketsContainer) return;

        const maxDistance = Math.min(190, window.innerWidth * 0.4);
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < count; i++) {
            const element = document.createElement("i");
            const isHeart = i % 4 === 0;
            const angle = Math.random() * Math.PI * 2;
            const distance = rand(60, maxDistance);

            element.className = "burst" + (isHeart ? " heart" : "");
            if (isHeart) element.textContent = "♥";

            element.style.top = "50%";
            element.style.setProperty("--dx", Math.cos(angle) * distance + "px");
            element.style.setProperty("--dy", Math.sin(angle) * distance * 0.7 + "px");
            element.style.setProperty("--dur", rand(0.8, 1.4).toFixed(2) + "s");
            element.style.setProperty("--delay", rand(0, 0.12).toFixed(2) + "s");
            element.style.setProperty("--s", rand(0.6, 1.4).toFixed(2));
            element.style.setProperty("--size", Math.round(rand(10, 18)) + "px");
            element.addEventListener("animationend", () => element.remove());

            fragment.appendChild(element);
        }

        ticketsContainer.appendChild(fragment);
    }

    async function playShuffle(alive) {
        const box = ticketsContainer.getBoundingClientRect();
        const centerX = box.left + box.width / 2;
        const centerY = box.top + box.height / 2;
        const spread = Math.min(tickets[0].offsetWidth * 0.62, window.innerWidth * 0.26);
        const STACK = 0.8;
        const ids = tickets.map((_, index) => index);

        // Độ dời để mỗi thẻ về giữa khu vực thẻ.
        const home = tickets.map((ticket) => {
            const rect = ticket.getBoundingClientRect();

            return {
                x: centerX - (rect.left + rect.width / 2),
                y: centerY - (rect.top + rect.height / 2)
            };
        });

        const poses = tickets.map(() => ({ x: 0, y: 0, r: 0, s: 1, ry: 0 }));

        tickets.forEach((ticket) => {
            ticket.style.transition = "none";
        });

        const pose = (p) =>
            `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px) ` +
            `rotate(${p.r.toFixed(1)}deg) scale(${p.s.toFixed(3)}) ` +
            `perspective(900px) rotateY(${p.ry.toFixed(1)}deg)`;

        // Di chuyển một thẻ sang tư thế mới, có nhấc lên một chút giữa đường.
        function animateTo(index, target, options) {
            const o = Object.assign({
                duration: 500,
                delay: 0,
                easing: "cubic-bezier(.2,.8,.2,1)",
                lift: 0,
                spin: 0
            }, options);

            const from = poses[index];
            const to = Object.assign({}, from, target);
            const mid = {
                x: (from.x + to.x) / 2,
                y: (from.y + to.y) / 2 - o.lift,
                r: (from.r + to.r) / 2 + o.spin,
                s: Math.max(from.s, to.s) + (o.lift ? 0.05 : 0),
                ry: (from.ry + to.ry) / 2
            };

            poses[index] = to;

            const animation = tickets[index].animate(
                [
                    { transform: pose(from) },
                    { transform: pose(mid) },
                    { transform: pose(to) }
                ], {
                    duration: o.duration,
                    delay: o.delay,
                    easing: o.easing,
                    fill: "both"
                }
            );

            return animation.finished.catch(() => {});
        }

        // Lật thẻ; đổi mặt đúng lúc thẻ đứng nghiêng.
        function flip(index, toBack, delay) {
            setTimeout(() => {
                if (alive()) tickets[index].classList.toggle("is-back", toBack);
            }, delay + 280);

            return animateTo(index, { ry: toBack ? 180 : 0 }, {
                duration: 560,
                delay,
                easing: "ease-in-out",
                lift: 14
            });
        }

        const stackPose = (index, order) => ({
            x: home[index].x + rand(-4, 4),
            y: home[index].y - order * 3,
            r: rand(-5, 5),
            s: STACK,
            ry: 180
        });

        const glow = document.createElement("div");
        glow.className = "deck-glow";
        ticketsContainer.prepend(glow);
        void glow.offsetWidth;

        // A. Lật úp lần lượt từng thẻ, rồi giấu mệnh giá.
        await Promise.all(ids.map((i) => flip(i, true, i * 70)));
        if (!alive()) return;

        hideTicketPrices();
        await wait(150);
        if (!alive()) return;

        // B. Gom thành một chồng ở giữa.
        glow.classList.add("on");

        let deck = ids.slice();

        await Promise.all(deck.map((i, order) => {
            tickets[i].style.zIndex = String(10 + order);

            return animateTo(i, stackPose(i, order), {
                duration: 650,
                delay: order * 55,
                lift: 20,
                spin: rand(-8, 8)
            });
        }));
        if (!alive()) return;

        deckSparkles(10);

        // C. Xào: chia đôi chồng bài, rồi chen xen kẽ vào nhau. Làm 3 lượt.
        for (let round = 0; round < 3; round++) {
            const half = deck.length / 2;
            const left = deck.slice(0, half);
            const right = deck.slice(half);
            const splitOptions = {
                duration: 280,
                lift: 10,
                easing: "cubic-bezier(.2,.9,.3,1)"
            };

            await Promise.all([
                ...left.map((i, k) => animateTo(i, {
                    x: home[i].x - spread,
                    y: home[i].y - k * 4 - 8,
                    r: -9 + k * 2,
                    s: STACK,
                    ry: 180
                }, Object.assign({ delay: k * 20 }, splitOptions))),
                ...right.map((i, k) => animateTo(i, {
                    x: home[i].x + spread,
                    y: home[i].y - k * 4 - 8,
                    r: 9 - k * 2,
                    s: STACK,
                    ry: 180
                }, Object.assign({ delay: k * 20 }, splitOptions)))
            ]);
            if (!alive()) return;

            const first = round % 2 === 0 ? left : right;
            const second = round % 2 === 0 ? right : left;

            deck = [];
            for (let k = 0; k < half; k++) {
                deck.push(first[k], second[k]);
            }

            await Promise.all(deck.map((i, order) => {
                setTimeout(() => {
                    tickets[i].style.zIndex = String(10 + order);
                }, order * 42);

                return animateTo(i, stackPose(i, order), {
                    duration: 280,
                    delay: order * 42,
                    lift: 16,
                    spin: rand(-6, 6)
                });
            }));
            if (!alive()) return;

            deckSparkles(6);
        }

        // D. Chia bài: từng thẻ bay về đúng chỗ của mình.
        await wait(180);
        if (!alive()) return;

        glow.classList.remove("on");

        await Promise.all(shuffled(ids).map((i, order) =>
            animateTo(i, { x: 0, y: 0, r: 0, s: 1, ry: 180 }, {
                duration: 700,
                delay: order * 100,
                lift: 40,
                spin: rand(-7, 7),
                easing: "cubic-bezier(.2,.9,.25,1.1)"
            })
        ));
        if (!alive()) return;

        await wait(120);
        if (!alive()) return;

        // E. Lật lại mặt trước (không còn mệnh giá).
        await Promise.all(ids.map((i) => flip(i, false, i * 70)));
        if (!alive()) return;

        deckSparkles(10);
        await wait(250);
    }

    async function startTicketShuffle() {
        const run = ++shuffleRun;
        const alive = () => run === shuffleRun;

        ticketShuffleReady = false;

        if (!ticketsContainer || tickets.length === 0) {
            console.error("Không tìm thấy .tickets hoặc .ticket trong HTML.");
            return;
        }

        resetTickets();
        ticketsContainer.classList.add("is-shuffling");

        tickets.forEach((ticket) => {
            ticket.style.pointerEvents = "none";
        });

        // Bước 1: hiện đầy đủ mệnh giá để người xem nhìn thấy.
        showTicketPrices();
        setNote("Đang xáo trộn các phần quà, em nhìn kỹ nhé...", true);

        const fancy = CAN_ANIMATE && !REDUCED;

        await wait(fancy ? 1500 : 600);
        if (!alive()) return;

        // Bước 2: lật úp, xào, chia bài, lật lại.
        if (fancy) {
            try {
                await playShuffle(alive);
            } catch (error) {
                console.warn("Lỗi hiệu ứng xáo thẻ:", error);
            }

            if (!alive()) return;
        }

        // Bước 3: xong, trả thẻ về vị trí gốc và cho phép chọn.
        hideTicketPrices();
        resetTickets();

        ticketsContainer.classList.remove("is-shuffling");

        tickets.forEach((ticket) => {
            ticket.style.pointerEvents = "auto";
        });

        setNote(NOTE_DEFAULT, false);
        ticketShuffleReady = true;
    }

    // =============================================
    // 9. NÚT MỞ QUÀ
    // =============================================
    if (openGiftBtn) {
        openGiftBtn.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (cakeScreen) {
                cakeScreen.classList.remove("show");
            }

            if (scratchScreen) {
                scratchScreen.classList.add("show");
            }

            // Giữ phần tử cha hiển thị vì thẻ cào nằm bên trong.
            if (ticketSelection) {
                ticketSelection.style.display = "block";

                const smallHeading =
                    ticketSelection.querySelector(".ticket-heading-small");

                const heading =
                    ticketSelection.querySelector(".ticket-heading");

                if (smallHeading) smallHeading.style.display = "";
                if (heading) heading.style.display = "";
            }

            if (ticketsContainer) {
                ticketsContainer.style.display = "";
            }

            selectedNumber = null;
            ticketShuffleReady = false;

            if (selectedTicket) {
                selectedTicket.classList.remove("show");
            }

            if (claimSuccess) {
                claimSuccess.classList.remove("show");
            }

            if (finalClaimBtn) {
                finalClaimBtn.disabled = false;
                finalClaimBtn.textContent = "NHẬN QUÀ";
            }

            startTicketShuffle();
        });
    }

    // =============================================
    // 10. CHỌN THẺ SAU KHI XÀO
    // =============================================
    tickets.forEach((ticket) => {
        ticket.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (!ticketShuffleReady) return;

            selectedNumber = ticket.dataset.ticket || "1"; {
                const c = centerOf(ticket);
                FX.confetti(c.x, c.y, 26, { power: 6, spread: 6.28 });
            }

            if (selectedTicketNumber) {
                selectedTicketNumber.textContent =
                    String(selectedNumber).padStart(2, "0");
            }

            if (moneyPrize) {
                moneyPrize.textContent = ACTUAL_PRIZE;
            }

            if (successMoney) {
                successMoney.textContent = ACTUAL_PRIZE;
            }

            // Ẩn tiêu đề và danh sách thẻ.
            // Không ẩn ticketSelection vì thẻ cào nằm bên trong.
            if (ticketSelection) {
                const smallHeading =
                    ticketSelection.querySelector(".ticket-heading-small");

                const heading =
                    ticketSelection.querySelector(".ticket-heading");

                if (smallHeading) smallHeading.style.display = "none";
                if (heading) heading.style.display = "none";
            }

            if (ticketsContainer) {
                ticketsContainer.style.display = "none";
            }

            if (selectedTicket) {
                selectedTicket.classList.add("show");
            }

            // Đợi thẻ cào hiển thị rồi mới khởi tạo canvas.
            requestAnimationFrame(() => {
                setTimeout(initScratch, 100);
            });
        });
    });

    // =============================================
    // 11. KHỞI TẠO LỚP BẠC CỦA THẺ CÀO
    // =============================================
    let ctx = null;
    let scratching = false;
    let revealed = false;
    let lastCheck = 0;

    function initScratch() {
        if (!scratchCanvas) return;

        revealed = false;
        scratching = false;
        lastCheck = 0;

        scratchCanvas.style.opacity = "1";
        scratchCanvas.style.pointerEvents = "auto";
        scratchCanvas.style.transition = "";

        requestAnimationFrame(() => {
            // Đo canvas thực tế, không đo phần tử cha.
            const rect = scratchCanvas.getBoundingClientRect();
            const width = Math.max(1, Math.round(rect.width));
            const height = Math.max(1, Math.round(rect.height));
            const dpr = Math.max(1, window.devicePixelRatio || 1);

            // Chỉ chỉnh độ phân giải bên trong canvas.
            // Không tự gán width/height CSS nên tránh làm lệch khung.
            scratchCanvas.width = Math.round(width * dpr);
            scratchCanvas.height = Math.round(height * dpr);

            ctx = scratchCanvas.getContext("2d", {
                willReadFrequently: true
            });

            if (!ctx) return;

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.globalCompositeOperation = "source-over";

            const gradient = ctx.createLinearGradient(
                0, 0, width, height
            );

            gradient.addColorStop(0, "#777777");
            gradient.addColorStop(0.2, "#cfcfcf");
            gradient.addColorStop(0.45, "#f4f4f4");
            gradient.addColorStop(0.65, "#c3c3c3");
            gradient.addColorStop(1, "#777777");

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = "rgba(50,50,50,.8)";
            ctx.font = "600 18px Arial, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("CÀO ĐỂ MỞ QUÀ", width / 2, height / 2);

            if (scratchProgress) {
                scratchProgress.textContent = "Cào lớp bạc để mở phần quà";
            }

            if (moneyPrize) {
                moneyPrize.textContent = ACTUAL_PRIZE;
            }
        });
    }

    // =============================================
    // 12. TỌA ĐỘ CHUỘT / CẢM ỨNG
    // =============================================
    function getPointerPosition(event) {
        const rect = scratchCanvas.getBoundingClientRect();

        const point =
            event.touches && event.touches.length ?
            event.touches[0] :
            event;

        return {
            x: point.clientX - rect.left,
            y: point.clientY - rect.top
        };
    }

    // =============================================
    // 13. CÀO LỚP BẠC
    // =============================================
    function scratch(event) {
        if (!ctx || !scratchCanvas || revealed) return;

        event.preventDefault();

        const position = getPointerPosition(event);

        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(position.x, position.y, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        checkScratch();
    }

    // =============================================
    // 14. KIỂM TRA TỶ LỆ CÀO
    // =============================================
    function checkScratch() {
        if (!ctx || !scratchCanvas || revealed) return;

        const now = Date.now();

        if (now - lastCheck < 120) return;
        lastCheck = now;

        const imageData = ctx.getImageData(
            0,
            0,
            scratchCanvas.width,
            scratchCanvas.height
        );

        const data = imageData.data;
        let transparent = 0;
        let total = 0;

        for (let i = 3; i < data.length; i += 32) {
            total++;

            if (data[i] < 100) {
                transparent++;
            }
        }

        const percent = total > 0 ?
            (transparent / total) * 100 :
            0;

        if (scratchProgress) {
            scratchProgress.textContent =
                `Đã cào ${Math.min(Math.round(percent), 100)}%`;
        }

        if (percent >= 45) {
            revealPrize();
        }
    }

    // =============================================
    // 15. SỰ KIỆN CÀO BẰNG CHUỘT VÀ ĐIỆN THOẠI
    // =============================================
    if (scratchCanvas) {
        scratchCanvas.addEventListener("mousedown", (event) => {
            scratching = true;
            scratch(event);
        });

        scratchCanvas.addEventListener("mousemove", (event) => {
            if (scratching) {
                scratch(event);
            }
        });

        document.addEventListener("mouseup", () => {
            scratching = false;
        });

        scratchCanvas.addEventListener("touchstart", (event) => {
            scratching = true;
            scratch(event);
        }, { passive: false });

        scratchCanvas.addEventListener("touchmove", (event) => {
            if (scratching) {
                scratch(event);
            }
        }, { passive: false });

        scratchCanvas.addEventListener("touchend", () => {
            scratching = false;
        });
    }

    // =============================================
    // 16. HIỆN KẾT QUẢ SAU KHI CÀO
    // =============================================
    function revealPrize() {
        if (revealed) return;

        revealed = true;
        FX.show(1500, 5); {
            const c = centerOf(scratchCanvas);
            FX.confetti(c.x, c.y, 70, { power: 10, spread: 5, angle: -1.57 });
        }

        if (moneyPrize) {
            moneyPrize.textContent = ACTUAL_PRIZE;
        }

        if (scratchProgress) {
            scratchProgress.textContent = "Đã mở phần quà ❤️";
        }

        if (scratchCanvas) {
            scratchCanvas.style.transition = "opacity .45s ease";
            scratchCanvas.style.opacity = "0";
            scratchCanvas.style.pointerEvents = "none";
        }

        setTimeout(() => {
            if (selectedTicket) {
                selectedTicket.classList.remove("show");
            }

            if (scratchScreen) {
                scratchScreen.classList.remove("show");
            }

            if (successMoney) {
                successMoney.textContent = ACTUAL_PRIZE;
            }

            if (claimSuccess) {
                claimSuccess.classList.add("show");
            }

            FX.rain(3500);
            FX.show(2400, 7);
        }, 700);
    }

    // =============================================
    // 17. NÚT NHẬN QUÀ
    // =============================================
    if (finalClaimBtn) {
        finalClaimBtn.addEventListener("click", async(event) => {
            event.preventDefault();
            event.stopPropagation();

            if (finalClaimBtn.disabled) return;

            finalClaimBtn.disabled = true;
            finalClaimBtn.textContent = "ĐANG GỬI...";

            const data = {
                ticket: selectedNumber,
                prize: ACTUAL_PRIZE,
                time: new Date().toLocaleString("vi-VN")
            };

            // Máy chủ miễn phí có thể mất vài chục giây để khởi động.
            const controller = new AbortController();
            const abortTimer = setTimeout(() => controller.abort(), 60000);
            const slowTimer = setTimeout(() => {
                finalClaimBtn.textContent = "MÁY CHỦ ĐANG KHỞI ĐỘNG...";
            }, 6000);

            try {
                const response = await fetch(
                    "https://happy-birthday-vsiz.onrender.com/api/claim", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(data),
                        signal: controller.signal
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                finalClaimBtn.textContent = "ĐÃ GỬI ❤️";
            } catch (error) {
                console.error("Lỗi gửi yêu cầu nhận quà:", error);

                finalClaimBtn.disabled = false;
                finalClaimBtn.textContent = "NHẬN QUÀ";

                alert(
                    error.name === "AbortError" ?
                    "Máy chủ phản hồi quá lâu. Vui lòng thử lại sau ít phút." :
                    "Không thể gửi yêu cầu. Vui lòng thử lại."
                );
            } finally {
                clearTimeout(abortTimer);
                clearTimeout(slowTimer);
            }
        });
    }

    // =============================================
    // 18. CẬP NHẬT CANVAS KHI ĐỔI KÍCH THƯỚC
    // =============================================
    let resizeTimer = null;

    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {
            if (
                selectedTicket &&
                selectedTicket.classList.contains("show") &&
                !revealed
            ) {
                initScratch();
            }
        }, 200);
    });

    // =============================================
    // 19. TRẠNG THÁI BAN ĐẦU
    // =============================================
    if (envelopeWrapper) {
        envelopeWrapper.classList.remove("open", "rise", "reading");
    }

    if (envelope) {
        envelope.classList.remove("open");
    }

    if (cakeScreen) {
        cakeScreen.classList.remove("show");
    }

    if (scratchScreen) {
        scratchScreen.classList.remove("show");
    }

    if (claimSuccess) {
        claimSuccess.classList.remove("show");
    }

    if (selectedTicket) {
        selectedTicket.classList.remove("show");
    }

    if (ticketSelection) {
        ticketSelection.style.display = "block";
    }

    initBirthdayCountdown();
    updateMusicButton();
});