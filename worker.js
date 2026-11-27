/**
 * CoffeeShop Cloudflare Worker
 * Handles table booking form submissions and sends them to Telegram.
 */

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*", // You can restrict this to your GitHub Pages domain later
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ success: false, message: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      const { person, date, time } = await request.json();

      // Basic validation
      if (!person || !date || !time) {
        return new Response(JSON.stringify({ success: false, message: "Missing required fields" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const message = `🔔 Новая бронь!\n\n👤 Кол-во персон: ${person}\n📅 Дата: ${date}\n⏰ Время: ${time}`;

      // Use environment variables for sensitive data
      // env.BOT_TOKEN and env.CHAT_ID must be set in Cloudflare Worker dashboard
      const botToken = env.BOT_TOKEN;
      const chatId = env.CHAT_ID;

      if (!botToken || !chatId) {
        throw new Error("Worker configuration error: BOT_TOKEN or CHAT_ID is missing");
      }

      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

      const response = await fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      });

      const result = await response.json();

      if (result.ok) {
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*" // Adjust to your GitHub Pages domain
          },
        });
      } else {
        console.error("Telegram API Error:", result);
        return new Response(JSON.stringify({ success: false, message: "Failed to send message to Telegram" }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          },
        });
      }
    } catch (error) {
      console.error("Worker Error:", error.message);
      return new Response(JSON.stringify({ success: false, message: "Server error" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
      });
    }
  },
};
