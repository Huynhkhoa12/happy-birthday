document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENT
    ====================================================== */

    const envelope =
        document.getElementById("envelope");

    const seal =
        document.getElementById("seal");

    const letterScene =
        document.getElementById("letterScene");

    const message =
        document.getElementById("message");

    const continueBtn =
        document.getElementById("continueBtn");

    const cakeScreen =
        document.getElementById("cakeScreen");

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
        document.getElementById(
            "selectedTicketNumber"
        );

    const scratchArea =
        document.querySelector(".scratch-area");

    const scratchCanvas =
        document.getElementById(
            "scratchCanvas"
        );

    const moneyPrize =
        document.getElementById(
            "moneyPrize"
        );

    const scratchProgress =
        document.getElementById(
            "scratchProgress"
        );

    const claimSuccess =
        document.getElementById(
            "claimSuccess"
        );

    const successMoney =
        document.getElementById(
            "successMoney"
        );

    const finalClaimBtn =
        document.getElementById(
            "finalClaimBtn"
        );


    /* =====================================================
       NỘI DUNG THƯ
    ====================================================== */

    const letterText =
        `Hôm nay là một ngày thật đặc biệt, vì đó là ngày một người con gái rất đặc biệt xuất hiện trên thế giới này.

Anh mong tuổi mới của em sẽ luôn có thật nhiều niềm vui, luôn xinh đẹp, hạnh phúc và gặp thật nhiều điều may mắn.

Cảm ơn em vì đã xuất hiện trong cuộc đời anh.

Chúc em sinh nhật vui vẻ ❤️`;


    /* =====================================================
       6 PHẦN QUÀ
    ====================================================== */

    const prizes = [
        "5.000.000 VNĐ",
        "7.000.000 VNĐ",
        "9.000.000 VNĐ",
        "11.000.000 VNĐ",
        "13.000.000 VNĐ",
        "15.000.000 VNĐ"
    ];


    let selectedNumber = null;

    let selectedPrize = null;

    let typingTimer = null;

    let scratching = false;

    let revealed = false;


    /* =====================================================
       MỞ THƯ BẰNG CON DẤU TRÒN
    ====================================================== */

    seal.addEventListener("click", () => {

        if (
            envelope.classList.contains("open")
        ) {
            return;
        }

        envelope.classList.add("open");

        setTimeout(() => {
            typeLetter();
        }, 1000);

    });


    /* =====================================================
       GÕ THƯ
    ====================================================== */

    function typeLetter() {

        clearInterval(typingTimer);

        message.textContent = "";

        continueBtn.classList.remove(
            "show"
        );

        let index = 0;

        typingTimer = setInterval(() => {

            message.textContent +=
                letterText[index];

            index++;

            if (
                index >=
                letterText.length
            ) {

                clearInterval(
                    typingTimer
                );

                setTimeout(() => {

                    continueBtn.classList.add(
                        "show"
                    );

                }, 500);

            }

        }, 25);

    }


    /* =====================================================
       THƯ → BÁNH KEM
    ====================================================== */

    continueBtn.addEventListener(
        "click",
        () => {

            letterScene.style.display =
                "none";

            cakeScreen.classList.add(
                "show"
            );

            /*
             * Nến tắt sau 1.8 giây
             */

            setTimeout(() => {

                cakeScreen.classList.add(
                    "candles-off"
                );

            }, 1800);

            /*
             * MỞ QUÀ xuất hiện
             */

            setTimeout(() => {

                openGiftBtn.classList.add(
                    "show"
                );

            }, 2300);

        }
    );


    /* =====================================================
       BÁNH KEM → 6 THẺ
    ====================================================== */

    openGiftBtn.addEventListener(
        "click",
        () => {

            cakeScreen.classList.remove(
                "show"
            );

            setTimeout(() => {

                scratchScreen.classList.add(
                    "show"
                );

            }, 400);

        }
    );


    /* =====================================================
       CHỌN 1 TRONG 6 THẺ
    ====================================================== */

    tickets.forEach(ticket => {

        ticket.addEventListener(
            "click",
            () => {

                if (
                    selectedNumber !== null
                ) {
                    return;
                }

                selectedNumber =
                    Number(
                        ticket.dataset.ticket
                    );

                selectedPrize =
                    prizes[
                        selectedNumber - 1
                    ];

                selectedTicketNumber.textContent =
                    String(
                        selectedNumber
                    ).padStart(2, "0");


                ticketSelection.style.display =
                    "none";


                selectedTicket.classList.add(
                    "show"
                );


                setupScratch();

            }
        );

    });


    /* =====================================================
       KHỞI TẠO THẺ CÀO
    ====================================================== */

    function setupScratch() {

        const width =
            scratchArea.clientWidth;

        const height =
            scratchArea.clientHeight;


        scratchCanvas.width =
            width;

        scratchCanvas.height =
            height;


        const ctx =
            scratchCanvas.getContext(
                "2d"
            );


        revealed = false;

        scratching = false;


        /*
         * Tiền nằm bên dưới lớp bạc.
         */

        moneyPrize.textContent =
            selectedPrize;


        /*
         * Tạo lớp bạc.
         */

        const gradient =
            ctx.createLinearGradient(
                0,
                0,
                width,
                height
            );


        gradient.addColorStop(
            0,
            "#777777"
        );

        gradient.addColorStop(
            .18,
            "#eeeeee"
        );

        gradient.addColorStop(
            .35,
            "#9b9b9b"
        );

        gradient.addColorStop(
            .5,
            "#f5f5f5"
        );

        gradient.addColorStop(
            .68,
            "#888888"
        );

        gradient.addColorStop(
            .85,
            "#dedede"
        );

        gradient.addColorStop(
            1,
            "#707070"
        );


        ctx.fillStyle =
            gradient;


        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        /*
         * Chữ trên lớp bạc.
         */

        ctx.fillStyle =
            "rgba(255,255,255,.9)";

        ctx.font =
            "600 18px Segoe UI, Arial, sans-serif";

        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "middle";

        ctx.fillText(
            "CÀO ĐỂ MỞ QUÀ",
            width / 2,
            height / 2
        );


        scratchCanvas.style.display =
            "block";

        scratchCanvas.style.opacity =
            "1";


        scratchProgress.textContent =
            "Cào lớp bạc để mở phần quà";

    }


    /* =====================================================
       TỌA ĐỘ CÀO
    ====================================================== */

    function getPosition(event) {

        const rect =
            scratchCanvas.getBoundingClientRect();

        let clientX;

        let clientY;


        if (
            event.touches &&
            event.touches.length
        ) {

            clientX =
                event.touches[0].clientX;

            clientY =
                event.touches[0].clientY;

        } else {

            clientX =
                event.clientX;

            clientY =
                event.clientY;

        }


        return {

            x: clientX -
                rect.left,

            y: clientY -
                rect.top

        };

    }


    /* =====================================================
       BẮT ĐẦU CÀO
    ====================================================== */

    function startScratch(event) {

        scratching = true;

        scratch(event);

    }


    /* =====================================================
       CÀO
    ====================================================== */

    function scratch(event) {

        if (!scratching ||
            revealed
        ) {
            return;
        }

        event.preventDefault();


        const ctx =
            scratchCanvas.getContext(
                "2d"
            );


        const position =
            getPosition(event);


        ctx.globalCompositeOperation =
            "destination-out";


        ctx.beginPath();


        ctx.arc(
            position.x,
            position.y,
            26,
            0,
            Math.PI * 2
        );


        ctx.fill();


        checkScratch();

    }


    /* =====================================================
       DỪNG CÀO
    ====================================================== */

    function stopScratch() {

        scratching = false;

    }


    /* =====================================================
       KIỂM TRA CÀO ĐỦ
    ====================================================== */

    function checkScratch() {

        const ctx =
            scratchCanvas.getContext(
                "2d"
            );


        const imageData =
            ctx.getImageData(
                0,
                0,
                scratchCanvas.width,
                scratchCanvas.height
            );


        let transparent = 0;


        /*
         * Lấy mẫu pixel để nhẹ máy.
         */

        for (
            let i = 3; i < imageData.data.length; i += 16
        ) {

            if (
                imageData.data[i] < 100
            ) {

                transparent++;

            }

        }


        const total =
            imageData.data.length / 16;


        const percent =
            transparent / total;


        /*
         * Cào khoảng 55% là mở.
         */

        if (
            percent >= .55
        ) {

            revealPrize();

        }

    }


    /* =====================================================
       CÀO XONG
       → HIỆN TIỀN
       → TỰ ĐỘNG CHÚC MỪNG
    ====================================================== */

    function revealPrize() {

        if (revealed) {
            return;
        }


        revealed = true;

        scratching = false;


        scratchCanvas.style.opacity =
            "0";


        /*
         * Cho nhìn thấy phần tiền
         * trong một khoảng ngắn.
         */

        setTimeout(() => {

            scratchCanvas.style.display =
                "none";


            scratchProgress.textContent =
                "Đã mở phần quà";


            /*
             * Sau 700ms tự động
             * chuyển sang CHÚC MỪNG.
             */

            setTimeout(() => {

                selectedTicket.style.display =
                    "none";


                successMoney.textContent =
                    selectedPrize;


                claimSuccess.classList.add(
                    "show"
                );

            }, 700);

        }, 450);

    }


    /* =====================================================
       MOUSE EVENTS
    ====================================================== */

    scratchCanvas.addEventListener(
        "mousedown",
        startScratch
    );

    scratchCanvas.addEventListener(
        "mousemove",
        scratch
    );

    scratchCanvas.addEventListener(
        "mouseup",
        stopScratch
    );

    scratchCanvas.addEventListener(
        "mouseleave",
        stopScratch
    );


    /* =====================================================
       TOUCH EVENTS
    ====================================================== */

    scratchCanvas.addEventListener(
        "touchstart",
        startScratch, {
            passive: false
        }
    );

    scratchCanvas.addEventListener(
        "touchmove",
        scratch, {
            passive: false
        }
    );

    scratchCanvas.addEventListener(
        "touchend",
        stopScratch
    );


    /* =====================================================
       NHẬN QUÀ
       WEB → RENDER → TELEGRAM
    ====================================================== */

    finalClaimBtn.addEventListener(
        "click",
        async() => {

            if (
                selectedNumber === null ||
                !selectedPrize
            ) {
                return;
            }


            finalClaimBtn.disabled =
                true;

            finalClaimBtn.textContent =
                "ĐANG XÁC NHẬN...";


            const data = {

                ticket: selectedNumber,

                prize: selectedPrize,

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
                        "Server error"
                    );

                }


                const result =
                    await response.json();


                if (!result.success) {

                    throw new Error(
                        "Claim failed"
                    );

                }


                finalClaimBtn.textContent =
                    "ĐÃ NHẬN QUÀ ✓";


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
                    "Không thể kết nối máy chủ. Vui lòng thử lại."
                );

            }

        }
    );

});