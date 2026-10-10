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
    // Đang để 10 giây để thử nghiệm.
    // =============================================
    const BIRTHDAY_TIME = Date.now() + 10 * 1000;

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

    function updateCountdown() {
        const remaining = BIRTHDAY_TIME - Date.now();

        if (remaining <= 0) {
            showLetterScene();
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
            showLetterScene();
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

    async function startMusic() {
        if (!bgMusic) return;

        try {
            bgMusic.volume = 0.35;
            await bgMusic.play();
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

                if (continueBtn) {
                    continueBtn.classList.add("show");
                }
            }
        }, 28);
    }

    // =============================================
    // 6. MỞ PHONG BÌ
    // =============================================
    if (seal) {
        seal.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (envelopeWrapper) {
                envelopeWrapper.classList.add("open");
            }

            if (envelope) {
                envelope.classList.add("open");
            }

            startMusic();
            setTimeout(typeLetter, 700);
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

            if (cake) {
                cake.classList.remove("candles-off");
            }

            if (openGiftBtn) {
                openGiftBtn.classList.remove("show");
            }

            setTimeout(() => {
                if (cake) {
                    cake.classList.add("candles-off");
                }
            }, 1800);

            setTimeout(() => {
                if (openGiftBtn) {
                    openGiftBtn.classList.add("show");
                }
            }, 2500);
        });
    }

    // =============================================
    // 8. XÀO 6 THẺ
    // =============================================
    let ticketShuffleReady = false;
    let shuffleTimers = [];

    function clearShuffleTimers() {
        shuffleTimers.forEach((timer) => clearTimeout(timer));
        shuffleTimers = [];
    }

    function startTicketShuffle() {
        clearShuffleTimers();
        ticketShuffleReady = false;

        if (!ticketsContainer || tickets.length === 0) {
            console.error("Không tìm thấy .tickets hoặc .ticket trong HTML.");
            return;
        }

        // Đưa các thẻ về vị trí gốc trước khi bắt đầu.
        ticketsContainer.classList.remove("is-shuffling");

        tickets.forEach((ticket) => {
            ticket.classList.remove("flipped", "shuffling");
            ticket.style.pointerEvents = "none";
            ticket.style.transform = "";
            ticket.style.order = "";
        });

        // Bước 1: hiện đầy đủ mệnh giá.
        showTicketPrices();

        // Bước 2: chờ để người xem nhìn thấy tiền.
        shuffleTimers.push(setTimeout(() => {
            // Bước 3: lật úp thẻ.
            tickets.forEach((ticket) => {
                ticket.classList.add("flipped");
            });

            // Bước 4: chạy animation xào.
            shuffleTimers.push(setTimeout(() => {
                ticketsContainer.classList.add("is-shuffling");

                tickets.forEach((ticket) => {
                    ticket.classList.add("shuffling");
                });

                // Bước 5: xào xong, trở về mặt trước và vị trí ban đầu.
                shuffleTimers.push(setTimeout(() => {
                    tickets.forEach((ticket) => {
                        ticket.classList.remove("shuffling", "flipped");

                        ticket.style.transform = "";
                        ticket.style.order = "";
                        ticket.style.pointerEvents = "auto";
                    });

                    ticketsContainer.classList.remove("is-shuffling");

                    // Chỉ xóa mệnh giá, không xóa ảnh hoặc nền thẻ.
                    hideTicketPrices();

                    ticketShuffleReady = true;
                }, 2700));
            }, 450));
        }, 1500));
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

            selectedNumber = ticket.dataset.ticket || "1";

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

            try {
                const response = await fetch(
                    "https://happy-birthday-vsiz.onrender.com/api/claim", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(data)
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

                alert("Không thể gửi yêu cầu. Vui lòng thử lại.");
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
        envelopeWrapper.classList.remove("open");
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