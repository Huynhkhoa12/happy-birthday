document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENT
    ===================================================== */

    const letterScene =
        document.getElementById("letterScene");

    const envelopeWrapper =
        document.querySelector(".envelope-wrapper");

    const envelope =
        document.getElementById("envelope");

    const seal =
        document.getElementById("seal");

    const message =
        document.getElementById("message");

    const continueBtn =
        document.getElementById("continueBtn");

    const cakeScreen =
        document.getElementById("cakeScreen");

    const cake =
        document.querySelector(".cake");

    const openGiftBtn =
        document.getElementById("openGiftBtn");

    const scratchScreen =
        document.getElementById("scratchScreen");

    const ticketSelection =
        document.getElementById("ticketSelection");

    const tickets =
        document.querySelectorAll(".ticket");

    const selectedTicket =
        document.getElementById("selectedTicket");

    const selectedTicketNumber =
        document.getElementById("selectedTicketNumber");

    const scratchCanvas =
        document.getElementById("scratchCanvas");

    const scratchProgress =
        document.getElementById("scratchProgress");

    const moneyPrize =
        document.getElementById("moneyPrize");

    const claimSuccess =
        document.getElementById("claimSuccess");

    const successMoney =
        document.getElementById("successMoney");

    const finalClaimBtn =
        document.getElementById("finalClaimBtn");

    const musicBtn =
        document.getElementById("musicBtn");


    /* =====================================================
       PHẦN THƯỞNG CỐ ĐỊNH
    ===================================================== */

    const ACTUAL_PRIZE =
        "15.000.000 VNĐ";


    let selectedNumber = null;


    /* =====================================================
       AUDIO
       
       HTML của bạn đang có thể có 2 bgMusic.
       Chỉ sử dụng audio đầu tiên.
    ===================================================== */

    const audioList =
        document.querySelectorAll("#bgMusic");

    const bgMusic =
        audioList.length > 0 ?
        audioList[0] :
        null;


    function updateMusicButton() {

        if (!musicBtn) return;

        if (!bgMusic) {

            musicBtn.textContent = "🔇";
            musicBtn.title = "Không tìm thấy nhạc";

            return;
        }


        if (bgMusic.paused) {

            musicBtn.textContent = "🔇";
            musicBtn.title = "Bật nhạc";

        } else {

            musicBtn.textContent = "🔊";
            musicBtn.title = "Tắt nhạc";
        }
    }


    async function startMusic() {

        if (!bgMusic) return;

        try {

            bgMusic.volume = 0.35;

            await bgMusic.play();

        } catch (error) {

            /*
             * Trình duyệt có thể chặn autoplay.
             * Không được làm ảnh hưởng việc mở thư.
             */

            console.warn(
                "Không thể tự động phát nhạc:",
                error
            );
        }

        updateMusicButton();
    }


    function stopMusic() {

        if (!bgMusic) return;

        /*
         * CHỈ PAUSE.
         * Không reload.
         * Không reset currentTime.
         */

        bgMusic.pause();

        updateMusicButton();
    }


    /* =====================================================
       NÚT NHẠC
    ===================================================== */

    if (musicBtn) {

        musicBtn.addEventListener("click", async(event) => {

            event.preventDefault();
            event.stopPropagation();

            if (!bgMusic) return;


            if (bgMusic.paused) {

                await startMusic();

            } else {

                stopMusic();
            }

        });
    }


    if (bgMusic) {

        bgMusic.addEventListener(
            "play",
            updateMusicButton
        );

        bgMusic.addEventListener(
            "pause",
            updateMusicButton
        );

        bgMusic.addEventListener(
            "error",
            () => {

                console.warn(
                    "Không tìm thấy file ./music/birthday.mp3"
                );

                updateMusicButton();
            }
        );
    }


    /* =====================================================
       NỘI DUNG LÁ THƯ
    ===================================================== */

    const letterText =
        `Hôm nay là một ngày thật đặc biệt, vì đó là ngày một người con gái rất đặc biệt xuất hiện trên thế giới này.

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

            message.textContent +=
                letterText.charAt(index);

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


    /* =====================================================
       MỞ PHONG BÌ
       
       QUAN TRỌNG:
       CSS GỐC CỦA BẠN DÙNG:
       
       .envelope-wrapper.open
       
       nên JS phải thêm class open vào
       envelopeWrapper.
    ===================================================== */

    if (seal) {

        seal.addEventListener("click", (event) => {

            event.preventDefault();
            event.stopPropagation();


            /*
             * MỞ PHONG BÌ
             */

            if (envelopeWrapper) {

                envelopeWrapper.classList.add("open");
            }


            /*
             * Thêm vào envelope luôn để tương thích
             * nếu có CSS khác dùng #envelope.open.
             */

            if (envelope) {

                envelope.classList.add("open");
            }


            /*
             * PHÁT NHẠC
             *
             * Nếu nhạc lỗi thì thư vẫn mở.
             */

            startMusic();


            /*
             * Chờ animation mở nắp
             * rồi bắt đầu gõ.
             */

            setTimeout(() => {

                typeLetter();

            }, 700);

        });
    }


    /* =====================================================
       TIẾP TỤC -> BÁNH
    ===================================================== */

    if (continueBtn) {

        continueBtn.addEventListener("click", (event) => {

            event.preventDefault();
            event.stopPropagation();


            clearInterval(typingTimer);


            /*
             * Ẩn màn phong bì
             */

            if (letterScene) {

                letterScene.style.display =
                    "none";
            }


            /*
             * Hiện bánh
             */

            if (cakeScreen) {

                cakeScreen.classList.add("show");
            }


            /*
             * Tắt nến
             */

            setTimeout(() => {

                if (cake) {

                    cake.classList.add(
                        "candles-off"
                    );
                }

            }, 1800);


            /*
             * Hiện nút MỞ QUÀ
             */

            setTimeout(() => {

                if (openGiftBtn) {

                    openGiftBtn.classList.add(
                        "show"
                    );
                }

            }, 2500);

        });
    }


    /* =====================================================
       MỞ QUÀ -> MÀN CHỌN VÉ
    ===================================================== */

    if (openGiftBtn) {

        openGiftBtn.addEventListener("click", (event) => {

            event.preventDefault();
            event.stopPropagation();


            /*
             * Ẩn bánh
             */

            if (cakeScreen) {

                cakeScreen.classList.remove(
                    "show"
                );
            }


            /*
             * Hiện scratch screen
             */

            if (scratchScreen) {

                scratchScreen.classList.add(
                    "show"
                );
            }


            /*
             * Hiện 6 vé
             */

            if (ticketSelection) {

                ticketSelection.style.display =
                    "block";
            }


            /*
             * Ẩn thẻ cào lớn
             */

            if (selectedTicket) {

                selectedTicket.classList.remove(
                    "show"
                );
            }

        });
    }


    /* =====================================================
       CHỌN VÉ
    ===================================================== */

    tickets.forEach((ticket) => {

        ticket.addEventListener("click", (event) => {

            event.preventDefault();
            event.stopPropagation();


            /*
             * Lấy số vé
             */

            selectedNumber =
                ticket.dataset.ticket || "";


            /*
             * Hiện số vé trên thẻ cào
             */

            if (selectedTicketNumber) {

                selectedTicketNumber.textContent =
                    selectedNumber;
            }


            /*
             * Ẩn danh sách 6 vé
             */

            if (ticketSelection) {

                ticketSelection.style.display =
                    "none";
            }


            /*
             * Hiện thẻ cào
             */

            if (selectedTicket) {

                selectedTicket.classList.add(
                    "show"
                );
            }


            /*
             * Tạo canvas sau khi card đã hiện.
             */

            setTimeout(() => {

                initScratch();

            }, 100);

        });

    });


    /* =====================================================
       SCRATCH VARIABLES
    ===================================================== */

    let ctx = null;

    let scratching = false;

    let revealed = false;

    let lastCheck = 0;


    /* =====================================================
       KHỞI TẠO THẺ CÀO
    ===================================================== */

    function initScratch() {

        if (!scratchCanvas) return;


        revealed = false;

        scratching = false;


        scratchCanvas.style.opacity =
            "1";

        scratchCanvas.style.pointerEvents =
            "auto";


        requestAnimationFrame(() => {

            const area =
                scratchCanvas.parentElement;

            if (!area) return;


            const rect =
                area.getBoundingClientRect();


            const width =
                Math.max(
                    1,
                    Math.floor(rect.width)
                );


            const height =
                Math.max(
                    1,
                    Math.floor(rect.height)
                );


            const dpr =
                Math.max(
                    1,
                    window.devicePixelRatio || 1
                );


            /*
             * Canvas thật
             */

            scratchCanvas.width =
                Math.floor(width * dpr);

            scratchCanvas.height =
                Math.floor(height * dpr);


            /*
             * Canvas hiển thị
             */

            scratchCanvas.style.width =
                width + "px";

            scratchCanvas.style.height =
                height + "px";


            ctx =
                scratchCanvas.getContext(
                    "2d", {
                        willReadFrequently: true
                    }
                );


            if (!ctx) return;


            ctx.setTransform(
                dpr,
                0,
                0,
                dpr,
                0,
                0
            );


            ctx.globalCompositeOperation =
                "source-over";


            /* =================================================
               LỚP BẠC
            ================================================= */

            const gradient =
                ctx.createLinearGradient(
                    0,
                    0,
                    width,
                    height
                );


            gradient.addColorStop(
                0,
                "#777"
            );

            gradient.addColorStop(
                0.2,
                "#cfcfcf"
            );

            gradient.addColorStop(
                0.45,
                "#f4f4f4"
            );

            gradient.addColorStop(
                0.65,
                "#c3c3c3"
            );

            gradient.addColorStop(
                1,
                "#777"
            );


            ctx.fillStyle =
                gradient;


            ctx.fillRect(
                0,
                0,
                width,
                height
            );


            /* =================================================
               CHỮ TRÊN LỚP BẠC
            ================================================= */

            ctx.fillStyle =
                "rgba(50,50,50,.7)";


            ctx.font =
                "600 18px Arial, sans-serif";


            ctx.textAlign =
                "center";


            ctx.textBaseline =
                "middle";


            ctx.fillText(
                "CÀO ĐỂ MỞ QUÀ",
                width / 2,
                height / 2
            );


            if (scratchProgress) {

                scratchProgress.textContent =
                    "Cào lớp bạc để mở phần quà";
            }

        });
    }


    /* =====================================================
       VỊ TRÍ POINTER
    ===================================================== */

    function getPointerPosition(event) {

        if (!scratchCanvas) {

            return {
                x: 0,
                y: 0
            };
        }


        const rect =
            scratchCanvas.getBoundingClientRect();


        let point = event;


        if (
            event.touches &&
            event.touches.length > 0
        ) {

            point =
                event.touches[0];
        }


        return {

            x: point.clientX -
                rect.left,

            y: point.clientY -
                rect.top

        };
    }


    /* =====================================================
       CÀO
    ===================================================== */

    function scratch(event) {

        if (!ctx ||
            !scratchCanvas ||
            revealed
        ) {

            return;
        }


        event.preventDefault();


        const pos =
            getPointerPosition(event);


        ctx.save();


        ctx.globalCompositeOperation =
            "destination-out";


        ctx.beginPath();


        ctx.arc(
            pos.x,
            pos.y,
            30,
            0,
            Math.PI * 2
        );


        ctx.fill();


        ctx.restore();


        checkScratch();
    }


    /* =====================================================
       KIỂM TRA % CÀO
    ===================================================== */

    function checkScratch() {

        if (!ctx ||
            !scratchCanvas
        ) {

            return;
        }


        const now =
            Date.now();


        if (
            now - lastCheck <
            120
        ) {

            return;
        }


        lastCheck =
            now;


        const imageData =
            ctx.getImageData(
                0,
                0,
                scratchCanvas.width,
                scratchCanvas.height
            );


        const data =
            imageData.data;


        let transparent = 0;

        let total = 0;


        /*
         * Lấy mẫu mỗi 32 byte.
         */

        for (
            let i = 3; i < data.length; i += 32
        ) {

            total++;


            if (
                data[i] < 100
            ) {

                transparent++;
            }
        }


        const percent =
            total > 0 ?
            transparent / total * 100 :
            0;


        if (scratchProgress) {

            scratchProgress.textContent =
                `Đã cào ${Math.min(
                    Math.round(percent),
                    100
                )}%`;
        }


        /*
         * Đủ 45% -> tự mở
         */

        if (percent >= 45) {

            revealPrize();
        }

    }


    /* =====================================================
       MOUSE
    ===================================================== */

    if (scratchCanvas) {

        scratchCanvas.addEventListener(
            "mousedown",
            (event) => {

                scratching = true;

                scratch(event);
            }
        );


        scratchCanvas.addEventListener(
            "mousemove",
            (event) => {

                if (scratching) {

                    scratch(event);
                }
            }
        );


        document.addEventListener(
            "mouseup",
            () => {

                scratching = false;
            }
        );


        /* =================================================
           TOUCH
        ================================================= */

        scratchCanvas.addEventListener(
            "touchstart",
            (event) => {

                scratching = true;

                scratch(event);

            }, {
                passive: false
            }
        );


        scratchCanvas.addEventListener(
            "touchmove",
            (event) => {

                if (scratching) {

                    scratch(event);
                }

            }, {
                passive: false
            }
        );


        scratchCanvas.addEventListener(
            "touchend",
            () => {

                scratching = false;
            }
        );

    }


    /* =====================================================
       HIỆN PHẦN QUÀ
    ===================================================== */

    function revealPrize() {

        if (revealed) return;


        revealed = true;


        /*
         * Luôn 15 triệu
         */

        if (moneyPrize) {

            moneyPrize.textContent =
                ACTUAL_PRIZE;
        }


        if (scratchProgress) {

            scratchProgress.textContent =
                "Đã mở phần quà ❤️";
        }


        /*
         * Làm lớp bạc biến mất
         */

        if (scratchCanvas) {

            scratchCanvas.style.transition =
                "opacity .45s ease";

            scratchCanvas.style.opacity =
                "0";

            scratchCanvas.style.pointerEvents =
                "none";
        }


        /*
         * Tự chuyển sang CHÚC MỪNG
         */

        setTimeout(() => {

            if (selectedTicket) {

                selectedTicket.classList.remove(
                    "show"
                );
            }


            if (scratchScreen) {

                scratchScreen.classList.remove(
                    "show"
                );
            }


            if (successMoney) {

                successMoney.textContent =
                    ACTUAL_PRIZE;
            }


            if (claimSuccess) {

                claimSuccess.classList.add(
                    "show"
                );
            }

        }, 700);

    }


    /* =====================================================
       NHẬN QUÀ
    ===================================================== */

    if (finalClaimBtn) {

        finalClaimBtn.addEventListener(
            "click",
            async(event) => {

                event.preventDefault();
                event.stopPropagation();


                if (finalClaimBtn.disabled) {
                    return;
                }


                finalClaimBtn.disabled =
                    true;


                finalClaimBtn.textContent =
                    "ĐANG GỬI...";


                const data = {

                    ticket: selectedNumber,

                    prize: ACTUAL_PRIZE,

                    time: new Date()
                        .toLocaleString(
                            "vi-VN"
                        )
                };


                try {

                    const response =
                        await fetch(
                            "https://happy-birthday-vsiz.onrender.com/api/claim", {
                                method: "POST",

                                headers: {
                                    "Content-Type": "application/json"
                                },

                                body: JSON.stringify(
                                    data
                                )
                            }
                        );


                    if (!response.ok) {

                        throw new Error(
                            `HTTP ${response.status}`
                        );
                    }


                    finalClaimBtn.textContent =
                        "ĐÃ GỬI ❤️";


                } catch (error) {

                    console.error(
                        "Lỗi gửi quà:",
                        error
                    );


                    finalClaimBtn.disabled =
                        false;


                    finalClaimBtn.textContent =
                        "NHẬN QUÀ";


                    alert(
                        "Không thể gửi yêu cầu. Vui lòng thử lại."
                    );
                }

            }
        );
    }


    /* =====================================================
       RESIZE CANVAS
    ===================================================== */

    let resizeTimer = null;


    window.addEventListener(
        "resize",
        () => {

            clearTimeout(resizeTimer);


            resizeTimer =
                setTimeout(() => {

                    if (
                        selectedTicket &&
                        selectedTicket.classList.contains(
                            "show"
                        ) &&
                        !revealed
                    ) {

                        initScratch();
                    }

                }, 200);

        }
    );


    /* =====================================================
       TRẠNG THÁI BAN ĐẦU
    ===================================================== */

    if (envelopeWrapper) {

        envelopeWrapper.classList.remove(
            "open"
        );
    }


    if (envelope) {

        envelope.classList.remove(
            "open"
        );
    }


    if (letterScene) {

        letterScene.style.display =
            "";
    }


    if (cakeScreen) {

        cakeScreen.classList.remove(
            "show"
        );
    }


    if (scratchScreen) {

        scratchScreen.classList.remove(
            "show"
        );
    }


    if (claimSuccess) {

        claimSuccess.classList.remove(
            "show"
        );
    }


    if (selectedTicket) {

        selectedTicket.classList.remove(
            "show"
        );
    }


    if (ticketSelection) {

        ticketSelection.style.display =
            "block";
    }


    updateMusicButton();

});