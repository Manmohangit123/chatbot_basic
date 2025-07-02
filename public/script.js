async function sendMessage() {
  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");

  const userMessage = input.value.trim();
  if (userMessage === "") return;

  appendMessage("You", userMessage, "user");
  input.value = "";

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!res.ok) {
      // 🔴 Handle backend errors (e.g. 400, 500)
      const errorData = await res.json();
      appendMessage("AI", errorData.reply || "AI server error.", "bot");
      return;
    }

    const data = await res.json();

    if (!data.reply || typeof data.reply !== "string") {
      appendMessage("AI", "Empty or invalid AI response.", "bot");
      return;
    }

    appendMessage("AI", data.reply, "bot");
  } catch (error) {
    console.error("❌ Fetch error:", error);
    appendMessage("AI", "Error getting response. Try again.", "bot");
  }
}

function appendMessage(sender, text, className) {
  const chatBox = document.getElementById("chat-box");
  const message = document.createElement("div");
  message.classList.add("message", className);
  message.innerText = `${sender}: ${text}`;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}
