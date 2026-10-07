/* =========================================================
   HAPPY BIRTHDAY ❤️
   FULL SCRIPT.JS
========================================================= */


/* =========================================================
   1. PHONG THƯ
========================================================= */

const envelope = document.getElementById("envelope");
const openBtn = document.getElementById("openBtn");
const letterScene = document.getElementById("letterScene");

const message = document.getElementById("message");
const continueBtn = document.getElementById("continueBtn");


/* =========================================================
   2. MÀN HÌNH BÁNH
========================================================= */

const cakeScreen = document.getElementById("cakeScreen");
const openGiftBtn = document.getElementById("openGiftBtn");


/* =========================================================
   3. MÀN HÌNH VÉ
========================================================= */

const scratchScreen = document.getElementById("scratchScreen");

const ticketSelection =
    document.getElementById("ticketSelection");

const selectedTicket =
    document.getElementById("selectedTicket");

const tickets =
    document.querySelectorAll(".ticket");


/* =========================================================
   4. THẺ CÀO
========================================================= */

const modernCard =
    document.querySelector(".modern-card");

const scratchArea =
    document.querySelector(".scratch-area");

const scratchCanvas =
    document.getElementById("scratchCanvas");

const hiddenReward =
    document.querySelector(".hidden-reward");

const moneyPrize =
    document.getElementById("moneyPrize");

const hiddenMoney =
    document.getElementById("hiddenMoney");

const claimBtn =
    document.getElementById("claimBtn");


/* =========================================================
   5. THÔNG BÁO NHẬN QUÀ
========================================================= */

const claimSuccess =
    document.getElementById("claimSuccess");

const successMoney =
    document.getElementById("successMoney");


/* =========================================================
   6. BIẾN
========================================================= */

let selectedTicketNumber = "";
let selectedPrize = "";

let isDrawing = false;
let revealed = false;

let typingInterval = null;


/* =========================================================
   7. PHẦN THƯỞNG
========================================================= */

const prizes = [
    "5.000.000 VNĐ",
    "7.000.000 VNĐ",
    "9.000.000 VNĐ",
    "11.000.000 VNĐ",
    "13.000.000 VNĐ",
    "15.000.000 VNĐ"
];


/* =========================================================
   8. NỘI DUNG LÁ THƯ
========================================================= */

const letterText = `Chúc mừng sinh nhật em ❤️

Hôm nay là một ngày thật đặc biệt,
vì đó là ngày một người con gái rất đặc biệt xuất hiện trên thế giới này.

Anh mong tuổi mới của em sẽ luôn có thật nhiều niềm vui,
luôn xinh đẹp, hạnh phúc và gặp thật nhiều điều may mắn.

Cảm ơn em vì đã xuất hiện trong cuộc đời anh.

Chúc em sinh nhật vui vẻ ❤️`;


/* =========================================================
   9. MỞ PHONG THƯ
========================================================= */

if (openBtn) {

    openBtn.addEventListener("click", function(e) {

        e.stopPropagation();

        if (envelope.classList.contains("open")) {
            return;
        }

        envelope.classList.add("open");


        /* -----------------------------------------
           Bắt đầu viết thư
        ----------------------------------------- */

        setTimeout(function() {

            typeLetter();

        }, 900);

    });

}


/* =========================================================
   10. GÕ LÁ THƯ
========================================================= */

function typeLetter() {

    if (!message) {
        return;
    }

    clearInterval(typingInterval);

    message.textContent = "";

    continueBtn.classList.remove("show");

    let index = 0;


    typingInterval = setInterval(function() {

        message.textContent +=
            letterText.charAt(index);

        index++;


        if (index >= letterText.length) {

            clearInterval(typingInterval);


            /* -----------------------------------------
               Hiện nút TIẾP TỤC
            ----------------------------------------- */

            setTimeout(function() {

                continueBtn.classList.add("show");

            }, 500);

        }

    }, 25);

}


/* =========================================================
   11. TIẾP TỤC → BÁNH
========================================================= */

if (continueBtn) {

    continueBtn.addEventListener("click", function(e) {

        e.stopPropagation();


        /* -----------------------------------------
           Ẩn phong thư
        ----------------------------------------- */

        letterScene.style.display = "none";


        /* -----------------------------------------
           Hiện bánh
        ----------------------------------------- */

        cakeScreen.classList.add("show");

    });

}


/* =========================================================
   12. MỞ QUÀ → CHỌN VÉ
========================================================= */

if (openGiftBtn) {

    openGiftBtn.addEventListener("click", function() {

        /* -----------------------------------------
           Ẩn bánh
        ----------------------------------------- */

        cakeScreen.classList.remove("show");


        /* -----------------------------------------
           Hiện màn hình vé
        ----------------------------------------- */

        setTimeout(function() {

            scratchScreen.classList.add("show");

        }, 300);

    });

}


/* =========================================================
   13. CHỌN VÉ
========================================================= */

tickets.forEach(function(ticket) {

    ticket.addEventListener("click", function() {

        /* -----------------------------------------
           Không cho chọn lần 2
        ----------------------------------------- */

        if (selectedTicketNumber !== "") {
            return;
        }


        /* -----------------------------------------
           Lấy số vé
        ----------------------------------------- */

        selectedTicketNumber =
            ticket.getAttribute("data-ticket");


        const ticketNumber =
            Number(selectedTicketNumber);


        /* -----------------------------------------
           Lấy phần thưởng
        ----------------------------------------- */

        selectedPrize =
            prizes[ticketNumber - 1];


        console.log(
            "Đã chọn vé:",
            selectedTicketNumber
        );

        console.log(
            "Phần thưởng:",
            selectedPrize
        );


        /* -----------------------------------------
           ẨN 5 VÉ CÒN LẠI
        ----------------------------------------- */

        tickets.forEach(function(otherTicket) {

            if (otherTicket !== ticket) {

                otherTicket.style.display = "none";

            }

        });


        /* -----------------------------------------
           Vé được chọn
        ----------------------------------------- */

        ticket.style.transform =
            "scale(1.05)";


        /* -----------------------------------------
           Chờ một chút rồi mở thẻ cào
        ----------------------------------------- */

        setTimeout(function() {

            ticketSelection.style.display = "none";

            selectedTicket.classList.add("show");


            /* -----------------------------------------
               Khởi tạo canvas
            ----------------------------------------- */

            setTimeout(function() {

                setupScratchCard();

            }, 100);

        }, 500);

    });

});


/* =========================================================
   14. KHỞI TẠO THẺ CÀO
========================================================= */

function setupScratchCard() {

    if (!scratchCanvas || !scratchArea) {

        console.error(
            "Không tìm thấy scratchCanvas hoặc scratchArea"
        );

        return;
    }


    /* -----------------------------------------
       Lấy kích thước vùng cào
    ----------------------------------------- */

    const width =
        scratchArea.clientWidth;

    const height =
        scratchArea.clientHeight;


    /* -----------------------------------------
       Canvas đúng kích thước
    ----------------------------------------- */

    scratchCanvas.width = width;
    scratchCanvas.height = height;


    scratchCanvas.style.width =
        width + "px";

    scratchCanvas.style.height =
        height + "px";


    const ctx =
        scratchCanvas.getContext("2d");


    /* -----------------------------------------
       Reset
    ----------------------------------------- */

    ctx.globalCompositeOperation =
        "source-over";

    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    revealed = false;
    isDrawing = false;


    /* -----------------------------------------
       Hiện canvas
    ----------------------------------------- */

    scratchCanvas.style.display = "block";
    scratchCanvas.style.opacity = "1";


    /* -----------------------------------------
       ẨN TIỀN TRƯỚC KHI CÀO
    ----------------------------------------- */

    if (moneyPrize) {

        moneyPrize.style.display = "none";

        moneyPrize.textContent = "";

    }


    if (hiddenMoney) {

        hiddenMoney.style.display = "none";

        hiddenMoney.textContent = "";

    }


    /* -----------------------------------------
       ẨN NÚT NHẬN QUÀ
    ----------------------------------------- */

    claimBtn.classList.remove("show");

    claimBtn.style.display = "none";

    claimBtn.disabled = false;

    claimBtn.textContent = "NHẬN QUÀ ❤️";


    /* -----------------------------------------
       Vẽ lớp bạc
    ----------------------------------------- */

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
        0.2,
        "#dddddd"
    );

    gradient.addColorStop(
        0.4,
        "#999999"
    );

    gradient.addColorStop(
        0.6,
        "#eeeeee"
    );

    gradient.addColorStop(
        0.8,
        "#888888"
    );

    gradient.addColorStop(
        1,
        "#cccccc"
    );


    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /* -----------------------------------------
       Vẽ hiệu ứng bạc
    ----------------------------------------- */

    for (let i = 0; i < 20; i++) {

        ctx.fillStyle =
            "rgba(255,255,255,0.12)";

        ctx.beginPath();

        ctx.arc(
            Math.random() * width,
            Math.random() * height,
            Math.random() * 18 + 5,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }


    /* -----------------------------------------
       Chữ trên lớp bạc
    ----------------------------------------- */

    ctx.fillStyle = "#555555";

    ctx.font =
        "bold 16px Georgia";

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";


    ctx.fillText(
        "CÀO ĐỂ MỞ QUÀ",
        width / 2,
        height / 2
    );

}


/* =========================================================
   15. LẤY VỊ TRÍ CÀO
========================================================= */

function getScratchPosition(event) {

    const rect =
        scratchCanvas.getBoundingClientRect();


    let clientX;
    let clientY;


    /* -----------------------------------------
       Điện thoại
    ----------------------------------------- */

    if (
        event.touches &&
        event.touches.length > 0
    ) {

        clientX =
            event.touches[0].clientX;

        clientY =
            event.touches[0].clientY;

    }


    /* -----------------------------------------
       Máy tính
    ----------------------------------------- */
    else {

        clientX =
            event.clientX;

        clientY =
            event.clientY;

    }


    return {

        x: clientX - rect.left,

        y: clientY - rect.top

    };

}


/* =========================================================
   16. BẮT ĐẦU CÀO
========================================================= */

function startScratch(event) {

    if (revealed) {
        return;
    }

    isDrawing = true;

    scratch(event);

}


/* =========================================================
   17. CÀO
========================================================= */

function scratch(event) {

    if (!isDrawing || revealed) {
        return;
    }


    event.preventDefault();


    const ctx =
        scratchCanvas.getContext("2d");


    const position =
        getScratchPosition(event);


    /* -----------------------------------------
       Xóa lớp bạc
    ----------------------------------------- */

    ctx.globalCompositeOperation =
        "destination-out";


    ctx.beginPath();


    ctx.arc(
        position.x,
        position.y,
        24,
        0,
        Math.PI * 2
    );


    ctx.fill();


    /* -----------------------------------------
       Kiểm tra %
    ----------------------------------------- */

    checkScratchPercentage();

}


/* =========================================================
   18. DỪNG CÀO
========================================================= */

function stopScratch() {

    isDrawing = false;

}


/* =========================================================
   19. KIỂM TRA % ĐÃ CÀO
========================================================= */

function checkScratchPercentage() {

    if (revealed) {
        return;
    }


    const ctx =
        scratchCanvas.getContext("2d");


    const width =
        scratchCanvas.width;

    const height =
        scratchCanvas.height;


    const imageData =
        ctx.getImageData(
            0,
            0,
            width,
            height
        );


    const data =
        imageData.data;


    let transparentPixels = 0;

    let totalCheckedPixels = 0;


    /*
       Kiểm tra mỗi 16 pixel
       để tránh lag.
    */

    for (
        let i = 3; i < data.length; i += 16
    ) {

        totalCheckedPixels++;


        if (data[i] < 50) {

            transparentPixels++;

        }

    }


    const percentage =
        transparentPixels /
        totalCheckedPixels;


    console.log(
        "Đã cào:",
        Math.round(percentage * 100) + "%"
    );


    /* -----------------------------------------
       CÀO ĐỦ 60%
    ----------------------------------------- */

    if (percentage >= 0.60) {

        revealReward();

    }

}


/* =========================================================
   20. HIỆN PHẦN THƯỞNG
========================================================= */

function revealReward() {

    if (revealed) {
        return;
    }


    revealed = true;

    isDrawing = false;


    console.log(
        "🎉 Đã cào đủ 60%"
    );


    /* -----------------------------------------
       HIỆN TIỀN
    ----------------------------------------- */

    if (moneyPrize) {

        moneyPrize.textContent =
            selectedPrize;

        moneyPrize.style.display =
            "block";

    }


    if (hiddenMoney) {

        hiddenMoney.textContent =
            selectedPrize;

        hiddenMoney.style.display =
            "block";

    }


    /* -----------------------------------------
       Làm canvas mờ
    ----------------------------------------- */

    scratchCanvas.style.opacity = "0";


    setTimeout(function() {

        scratchCanvas.style.display =
            "none";


        /* -------------------------------------
           HIỆN NÚT NHẬN QUÀ
        ------------------------------------- */

        claimBtn.style.display =
            "block";


        claimBtn.classList.add(
            "show"
        );


        console.log(
            "✅ Nút NHẬN QUÀ đã hiện"
        );


    }, 600);

}


/* =========================================================
   21. SỰ KIỆN CHUỘT
========================================================= */

scratchCanvas.addEventListener(
    "mousedown",
    function(event) {

        startScratch(event);

    }
);


scratchCanvas.addEventListener(
    "mousemove",
    function(event) {

        scratch(event);

    }
);


scratchCanvas.addEventListener(
    "mouseup",
    function() {

        stopScratch();

    }
);


scratchCanvas.addEventListener(
    "mouseleave",
    function() {

        stopScratch();

    }
);


/* =========================================================
   22. SỰ KIỆN ĐIỆN THOẠI
========================================================= */

scratchCanvas.addEventListener(
    "touchstart",
    function(event) {

        startScratch(event);

    }, {
        passive: false
    }
);


scratchCanvas.addEventListener(
    "touchmove",
    function(event) {

        scratch(event);

    }, {
        passive: false
    }
);


scratchCanvas.addEventListener(
    "touchend",
    function() {

        stopScratch();

    }
);


/* =========================================================
   23. NHẬN QUÀ
========================================================= */

claimBtn.addEventListener(
    "click",
    async function() {

        console.log(
            "🎁 Đang gửi yêu cầu..."
        );


        /* -----------------------------------------
           Kiểm tra
        ----------------------------------------- */

        if (!selectedTicketNumber ||
            !selectedPrize
        ) {

            alert(
                "Bạn chưa chọn vé!"
            );

            return;

        }


        /* -----------------------------------------
           Khóa nút
        ----------------------------------------- */

        claimBtn.disabled = true;

        claimBtn.textContent =
            "ĐANG GỬI...";


        /* -----------------------------------------
           Dữ liệu gửi backend
        ----------------------------------------- */

        const data = {

            ticket: selectedTicketNumber,

            prize: selectedPrize,

            time: new Date()
                .toLocaleString("vi-VN")

        };


        console.log(
            "Dữ liệu gửi:",
            data
        );


        try {

            /* -----------------------------------------
               Gửi tới backend
            ----------------------------------------- */

            const response =
                await fetch(
                    "https://happy-birthday-vsiz.onrender.com/api/claim", {

                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(data)

                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Backend trả về lỗi " +
                    response.status
                );

            }


            const result =
                await response.json();


            console.log(
                "Backend trả về:",
                result
            );


            if (!result.success) {

                throw new Error(
                    "Backend không xác nhận"
                );

            }


            /* -----------------------------------------
               Gửi thành công
            ----------------------------------------- */

            selectedTicket.style.display =
                "none";


            /* -----------------------------------------
               Hiện thông báo
            ----------------------------------------- */

            successMoney.textContent =
                selectedPrize;


            claimSuccess.classList.add(
                "show"
            );


            /* -----------------------------------------
               Hiệu ứng tiền
            ----------------------------------------- */

            moneyRain();


        } catch (error) {

            console.error(
                "❌ Lỗi:",
                error
            );


            alert(
                "Không thể gửi yêu cầu!\n\n" +
                "Hãy kiểm tra backend đang chạy:\n" +
                "http://localhost:3000"
            );


            /* -----------------------------------------
               Mở lại nút
            ----------------------------------------- */

            claimBtn.disabled = false;

            claimBtn.textContent =
                "NHẬN QUÀ ❤️";

        }

    }
);


/* =========================================================
   24. HIỆU ỨNG TIỀN RƠI
========================================================= */

function moneyRain() {

    for (
        let i = 0; i < 25; i++
    ) {

        const money =
            document.createElement("div");


        money.textContent = "💰";


        money.style.position =
            "fixed";


        money.style.left =
            Math.random() * 100 + "vw";


        money.style.top =
            "-50px";


        money.style.fontSize =
            Math.random() * 20 + 20 + "px";


        money.style.zIndex =
            "9999";


        money.style.pointerEvents =
            "none";


        money.style.transition =
            "transform 3s linear, opacity 3s linear";


        document.body.appendChild(
            money
        );


        setTimeout(function() {

            money.style.transform =
                "translateY(" +
                (window.innerHeight + 100) +
                "px) rotate(" +
                (Math.random() * 720 - 360) +
                "deg)";


            money.style.opacity = "0";


        }, 50);


        setTimeout(function() {

            money.remove();

        }, 3200);

    }

}


/* =========================================================
   25. RESIZE
========================================================= */

window.addEventListener(
    "resize",
    function() {

        if (
            selectedTicket.classList.contains(
                "show"
            ) &&
            !revealed
        ) {

            setupScratchCard();

        }

    }
);


/* =========================================================
   26. KHỞI ĐỘNG
========================================================= */

console.log(
    "❤️ Happy Birthday website đã chạy!"
);

console.log(
    "🎁 Backend:",
    "http://localhost:3000"
);