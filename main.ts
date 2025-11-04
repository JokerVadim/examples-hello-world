import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  console.log("📨 Request received:", req.method);
  
  // Сразу отвечаем OK для Telegram
  const response = { status: "OK" };
  
  // Асинхронно обрабатываем POST запросы
  if (req.method === "POST") {
    try {
      const body = await req.json();
      console.log("📝 Body:", JSON.stringify(body));
      
      // Обрабатываем команду /start
      if (body.message?.text === "/start") {
        const chatId = body.message.chat.id;
        const userName = body.message.from.first_name || "User";
        
        console.log(`🎯 /start from ${userName} (${chatId})`);
        
        // Отвечаем в Telegram
        const telegramUrl = "https://api.telegram.org/bot6691235654:AAFsKfPaN3N5qAcGBT7NLdIZDHeMH5s61aE/sendMessage";
        await fetch(telegramUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: `✅ Привет, ${userName}! Бот работает через Deno! 🚀\nТвой ID: ${chatId}`
          }),
        });
        
        console.log("✅ Ответ отправлен в Telegram");
      }
    } catch (error) {
      console.log("❌ Error:", error);
    }
  }
  
  // Всегда возвращаем 200 OK
  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
});

console.log("🚀 Deno Telegram Bot started!");
