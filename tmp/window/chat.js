document.addEventListener('DOMContentLoaded', () => {
  let chatWindow = null;
  let checkInterval = null;

  function openChatWindow() {
    const width = 400;
    const height = 600;
    const left = window.screen.width - width - 20;
    const top = (window.screen.height - height) / 2;

    // Check if window exists and is not closed
    if (chatWindow && !chatWindow.closed) {
      chatWindow.focus();
      return;
    }

    // Clear existing interval if any
    if (checkInterval) {
      clearInterval(checkInterval);
      checkInterval = null;
    }

    // Reset if window was closed
    if (chatWindow && chatWindow.closed) {
      chatWindow = null;
    }

    // Open new window if none exists
    if (!chatWindow) {
      chatWindow = window.open(
        'chat-window.html',
        'AI_Chat',
        `width=${width},
                 height=${height},
                 left=${left},
                 top=${top},
                 resizable=yes,
                 scrollbars=yes,
                 status=no,
                 menubar=no,
                 toolbar=no,
                 location=no`,
      );

      if (chatWindow) {
        setupWindowHandlers();

        // Set up new interval check
        checkInterval = setInterval(() => {
          if (chatWindow && chatWindow.closed) {
            chatWindow = null;
            clearInterval(checkInterval);
            checkInterval = null;
          }
        }, 1000);
      }
    }
  }

  function setupWindowHandlers() {
    // Handle window close
    chatWindow.onbeforeunload = () => {
      chatWindow = null;
      if (checkInterval) {
        clearInterval(checkInterval);
        checkInterval = null;
      }
    };
  }

  function toggleChat() {
    if (!chatWindow || chatWindow.closed) {
      openChatWindow();
    } else {
      chatWindow.focus();
    }
  }

  // Handle page unload
  window.addEventListener('beforeunload', () => {
    if (chatWindow && !chatWindow.closed) {
      chatWindow.close();
    }
    if (checkInterval) {
      clearInterval(checkInterval);
      checkInterval = null;
    }
  });

  // Initialize click handler
  document.getElementById('chatToggle').addEventListener('click', toggleChat);
});
