import TelegramBot from 'node-telegram-bot-api';

let botToken = '8764783594:AAGNIVwzdcvqnGPS-zTAn6d9IfPKlsieOQU';
let kinoBot = new TelegramBot(botToken, { polling: true });

let kinoBaza = {
    '101': { 
        nomi: 'Qasoskorlar: Intiho', 
        janri: 'Fantastika', 
        videoUz: 'BAACAgIAAxkBAAMQajFEqWi0qmw5YC4_hftkiqGCHv8AApCmAAIHE4lJslofX3539ho8BA' 
    },
    '102': { 
        nomi: 'Avatar: Suv Yoli', 
        janri: 'Sarguzasht', 
        videoUz: 'BAACAgIAAxkBAAM2Zk...' 
    }
};

console.log("Kino bot muvaffaqiyatli ishga tushdi...");

kinoBot.on('message', async (xabar) => {
    let chatRaqami = xabar.chat.id;
    let kelganXabar = xabar.text;

    // --- ADMIN UCHUN: Videoning file_id sini olish qismi ---
    if (xabar.video) {
        let faylId = xabar.video.file_id;
        kinoBot.sendMessage(chatRaqami, "🎥 Videongizning file_id kodi:\n\n" + faylId);
        return;
    }

    // --- FOYDALANUVCHILAR UCHUN ---
    if (kelganXabar === '/start') {
        let salomlashishMatni = "👋 Salom! Kino botimizga xush kelibsiz.\n\n🎬 Kino yuklab olish uchun uning kodini yuboring (Masalan: 101, 102):";
        kinoBot.sendMessage(chatRaqami, salomlashishMatni);
    } 
    else if (kelganXabar) {
        let qidirilganKod = kelganXabar.trim();

        if (kinoBaza[qidirilganKod]) {
            let topilganKino = kinoBaza[qidirilganKod];
            
            let taqdimotMatni = "🎬 Kino topildi!\n\n" +
                                "📌 Nomi: " + topilganKino.nomi + "\n" +
                                "🍿 Janri: " + topilganKino.janri;
            
            try {
                await kinoBot.sendVideo(chatRaqami, topilganKino.videoUz, {
                    caption: taqdimotMatni
                });
            } catch (xatolik) {
                kinoBot.sendMessage(chatRaqami, "❌ Videoni yuborishda xatolik yuz berdi. file_id hali kodga kiritilmagan.");
            }
        } 
        else {
            let topilmadiMatni = "❌ Kechirasiz, " + qidirilganKod + " kodli kino topilmadi. Iltimos, kodni tekshirib qaytadan kiriting!";
            kinoBot.sendMessage(chatRaqami, topilmadiMatni);
        }
    }
});
// Server hosting uchun oddiy eshik (Port) ochish
import http from 'http';
http.createServer((req, res) => {
    res.write("Bot ishlamoqda...");
    res.end();
}).listen(process.env.PORT || 3000);