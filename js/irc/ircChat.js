const chatName = ["ddd", "jjj"];

function createChat() {
  return {
    chatName: chatName[Math.floor(Math.random() * chatName.length)],
    message: ["Hello!", "How are you?", "What's up?", "Did you see the news?"][
      Math.floor(Math.random() * 4)
    ],
  };
}

function renderMessage(msg) {
  return `
    <div class="chatName">>${msg.chatName}<</div>
    <div class="message">${msg.message}</div>
    <div class="seperator"></div>
  `;
}

function render() {
  return `
  <div class="irc-chat">
    <div class="irc-chat-header">#wikichat ircs://chat.wikileaks.org/</div>
    
    <div class="irc-chat-messages" id="irc-chat-messages">
      <div class="chatName">
    <div class="message">
        <span class="user">&lt;sysop&gt;</span>
  
  `;
}

export function renderIRCChat() {
  console.log("[IRC][Chat] render called");

  const el = document.getElementById("irc-chat");
  console.log("[IRC][Chat] element:", el);
  if (!el) return;
  el.innerHTML = render();
}

renderIRCChat();
