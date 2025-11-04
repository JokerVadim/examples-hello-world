Deno.serve(async (req) => {
  console.log("📨 Request:", req.method);
  
  // Сразу отвечаем OK
  const response = { status: "OK" };
  
  if (req.method === "POST") {
    try {
      const body = await req.json();
      console.log("📝 Body:", JSON.stringify(body));
      
      // Мгновенно отвечаем на /start
      if (body.message?.text === "/start") {
        const chatId = body.message.chat.id;
        const name = body.message.from.first_name || "Друг";
        
        console.log(`🎯 /start from ${name} (${chatId})`);
        
        // 1. Мгновенный ответ через Deno
        fetch("https://api.telegram.org/bot6691235654:AAFsKfPaN3N5qAcGBT7NLdIZDHeMH5s61aE/sendMessage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: `✅ Привет, ${name}! Бот работает через Deno! 🚀\nТвой ID: ${chatId}`
          })
        }).then(() => console.log("✅ Ответ отправлен"));
        
        // 2. Отправляем статистику в GAS (асинхронно)
        fetch("https://script.google.com/macros/s/AKfycbzheUEzR7g9fBb08Ik-8oCP2d4mCrwFeJNIPSiyQlMOt9F4rR-bGHC4bVh70j7rT8ROyg/exec", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "statistics",
            chatId: chatId,
            userData: {
              username: body.message.from.username || "",
              firstName: body.message.from.first_name || "",
              lastName: body.message.from.last_name || ""
            }
          })
        }).then(() => console.log("📊 Статистика отправлена в GAS"));
      }
    } catch(e) {
      console.log("❌ Error:", e);
    }
  }
  
  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
});
