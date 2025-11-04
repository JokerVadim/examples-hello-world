import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  console.log("📨 Request received:", req.method);
  
  // СРАЗУ отвечаем 200 OK для Telegram
  const response = new Response(JSON.stringify({ status: "OK" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

  // Асинхронно обрабатываем POST (не блокируем ответ)
  if (req.method === "POST") {
    try {
      const body = await req.json();
      console.log("📝 Body received");
      
      if (body.message?.text === "/start") {
        const chatId = body.message.chat.id;
        const userName = body.message.from.first_name || "User";
        
        console.log(`🎯 /start from ${userName} (${chatId})`);
        
        // Отвечаем в Telegram (асинхронно)
        fetch("https://api.telegram.org/bot6691235654:AAFsKfPaN3N5qAcGBT7NLdIZDHeMH5s61aE/sendMessage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: `✅ ${userName}, бот РАБОТАЕТ! 🚀\nID: ${chatId}`,
          }),
        }).then(() => console.log("✅ Ответ отправлен"));
      }
    } catch (error) {
      console.log("❌ Error:", error);
    }
  }

  return response;
});

console.log("🚀 Deno Bot Server started!");
