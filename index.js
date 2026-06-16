import express from 'express';
import TelegramBot from 'node-telegram-bot-api';

const botToken = process.env.BOT_TOKEN || '8764783594:AAGNIVwzdcvqnGPS-zTAn6d9IfPKlsieOQU'; 
const kinoBot = new TelegramBot(botToken, { polling: true });

let kinoBaza = {
    '101': { 
        nomi: 'Qasoskorlar: Intiho', 
        janri: 'Fantastika', 
        videoUz: 'BAACAgIAAxkBAAMQajFEqWi0qmw5YC4_hftkiqGCHv8AApCmAAIHE4lJslofX3539ho8BA' 
    },
    '1': { 
        nomi: 'OLOVLI KAPSULA', 
        janri: '', 
        videoUz: 'BAACAgIAAxkBAANeajF3QUewY9gZu8nH5xpNOpSXagMAAnepAAIHE5FJ7jeYHSWFDQ48BA' 
    }
};

console.log("Kino bot muvaffaqiyatli ishga tushdi...");

kinoBot.on('message', async (xabar) => {  
    let chatRaqami = xabar.chat.id;
    let kelganXabar = xabar.text;

    if (xabar.video) {
        let faylId = xabar.video.file_id;
        kinoBot.sendMessage(chatRaqami, "🎥 Videongizning file_id kodi:\n\n" + faylId);
        return;
    }

    if (kelganXabar === '/start') {
        let salomlashishMatni = "👋 Salom! Kino botimizga xush kelibsiz.\n\n🎬 Kino yuklab olish uchun uning kodini yuboring (Masalan: 101, 1):";
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
                kinoBot.sendMessage(chatRaqami, "❌ Videoni yuborishda xatolik yuz berdi.");
            }
        } 
        else {
            let topilmadiMatni = "❌ Kechirasiz, " + qidirilganKod + " kodli kino topilmadi. Iltimos, kodni tekshirib qaytadan kiriting!";
            kinoBot.sendMessage(chatRaqami, topilmadiMatni);
        }
    }
});

const app = express();
app.get('/', (req, res) => {
    res.send('Bot online holatda!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server ${port}-portda muvaffaqiyatli ishlamoqda...`);
});
