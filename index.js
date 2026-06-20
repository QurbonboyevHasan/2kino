const TelegramBot = require('node-telegram-bot-api');

// Tokenni Render muhitidan oladi yoki sinov uchun pastga yozishingiz mumkin
const token = process.env.BOT_TOKEN || '8764783594:AAFIbbSH9DNmV0cazosdbXA8y08B5lgGDx0';
const bot = new TelegramBot(token, { polling: true });

// ⚠️ @userinfobot orqali olgan shaxsiy ID raqamingizni shu yerga yozing:
const ADMIN_ID = 8448876562; 
1
// Kinolar ma'lumotlar bazasi (Kod va unga mos file_id joylashgan joy)
const kinolar = {
    '101': 'BAACAgIAAxkBAAICi2o2plH_KSbtNGtQnq_V9ChhHnhMAAITnwACvdW5SXQd9JXekw_LPAQ', // Boyagi skrinshotdagi video kodi
    '1': 'BAACAgIAAxkBAAIC...' // Keyingi qo'shadigan kinolaringiz IDsi
};

// /start buyrug'ini ushlab olish
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `👋 Salom! Kino botimizga xush kelibsiz.\n\n🎬 Kino yuklab olish uchun uning kodini yuboring (Masalan: 101, 1):`);
});

// Foydalanuvchi matn (kino kodi) yuborganida ishlovchi qism
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    // Agar foydalanuvchi buyruq yubormagan bo'lsa va faqat matn yozgan bo'lsa
    if (text && !text.startsWith('/')) {
        if (kinolar[text]) {
            // Kinoni Telegram serveridan file_id orqali srazu yuborish
            bot.sendVideo(chatId, kinolar[text], { caption: `🎬 Siz qidirgan ${text}-kodli kino!` });
        } else {
            bot.sendMessage(chatId, "❌ Kechirasiz, bu kod bilan kino topilmadi. Iltimos, kodni to'g'ri kiritganingizni tekshiring.");
        }
    }
});

// Faqat ADMIN video tashlaganida file_id kodini beruvchi qism
bot.on('video', (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id; // Videoni yuborgan odamning IDsi

    if (userId === ADMIN_ID) {
        const fileId = msg.video.file_id;
        bot.sendMessage(chatId, `📹 Videongizning file_id kodi:\n\n\`${fileId}\``, { parse_mode: 'Markdown' });
    } else {
        // Boshqa foydalanuvchilar video tashlasa rad etiladi
        bot.sendMessage(chatId, "❌ Kechirasiz, botga video yuborish taqiqlangan. Iltimos, faqat kino kodlarini kiriting!");
    }
});

console.log("Kino bot muvaffaqiyatli ishga tushdi...");
console.log("Server 10000-portda muvaffaqiyatli ishlamoqda...");
