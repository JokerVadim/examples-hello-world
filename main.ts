import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  console.log("📨 Request received:", req.method, req.url);
  
  // ВАЖНО: Отвечаем 200 на ЛЮБОЙ запрос!
  if (req.method === "GET") {
    console.log("✅ GET request - webhook check");
    return new Response(JSON.stringify({ status: "OK", method: "GET" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (req.method === "POST") {
    try {
      const body = await req.json();
      console.log("📝 Body:", JSON.stringify(body));
      
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
    
    return new Response(JSON.stringify({ status: "OK", method: "POST" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Для любых других методов
  return new Response(JSON.stringify({ status: "OK" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

console.log("🚀 Deno Telegram Bot started!");
