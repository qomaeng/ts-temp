document.addEventListener('DOMContentLoaded', () => {
  const state = {
    isOpen: false,
    messages: [
      {
        type: 'ai',
        text: '안녕하세요! 👋 AI 어시스턴트입니다. 무엇을 도와드릴까요?',
        feedback: null,
        time: formatTime(new Date()),
      },
    ],
    isTyping: false,
  };

  const elements = {
    container: document.getElementById('chatContainer'),
    toggle: document.getElementById('chatToggle'),
    window: document.getElementById('chatWindow'),
    messages: document.getElementById('chatMessages'),
    input: document.getElementById('messageInput'),
    form: document.getElementById('messageForm'),
    overlay: document.getElementById('chatOverlay'),
    clearChat: document.getElementById('clearChat'),
    closeChat: document.getElementById('closeChat'),
  };

  function formatTime(date) {
    return date.toLocaleString('ko-KR', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  function createMessageElement(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.type}`;

    const content = document.createElement('div');
    content.className = 'message-content';

    const formattedText = message.text.split('\n').map((line) => {
      const span = document.createElement('span');
      span.textContent = line;
      return span;
    });

    formattedText.forEach((span, index) => {
      content.appendChild(span);
      if (index < formattedText.length - 1) {
        content.appendChild(document.createElement('br'));
      }
    });

    messageDiv.appendChild(content);

    const meta = document.createElement('div');
    meta.className = 'message-meta';

    const timestamp = document.createElement('span');
    timestamp.className = 'message-timestamp';
    timestamp.textContent = message.time;
    meta.appendChild(timestamp);

    if (message.type === 'ai') {
      const feedback = document.createElement('div');
      feedback.className = 'feedback-buttons';

      const thumbsUp = document.createElement('button');
      thumbsUp.className = 'feedback-button thumbs-up';
      thumbsUp.innerHTML = '<i class="fa-solid fa-thumbs-up"></i>';
      thumbsUp.setAttribute('aria-label', '��움이 됨');
      thumbsUp.onclick = (event) => {
        handleFeedback(message, true, event);
        thumbsUp.classList.add('active');
        thumbsDown.classList.remove('active');
      };

      const thumbsDown = document.createElement('button');
      thumbsDown.className = 'feedback-button thumbs-down';
      thumbsDown.innerHTML = '<i class="fa-solid fa-thumbs-down"></i>';
      thumbsDown.setAttribute('aria-label', '도움이 되지 않음');
      thumbsDown.onclick = (event) => {
        handleFeedback(message, false, event);
        thumbsDown.classList.add('active');
        thumbsUp.classList.remove('active');
      };

      if (message.feedback !== null) {
        if (message.feedback) {
          thumbsUp.classList.add('active');
        } else {
          thumbsDown.classList.add('active');
        }
      }

      feedback.appendChild(thumbsUp);
      feedback.appendChild(thumbsDown);
      meta.appendChild(feedback);
    }

    messageDiv.appendChild(meta);
    return messageDiv;
  }

  function handleFeedback(message, isPositive, event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    createParticles(x, y, isPositive ? 'bg-green-500' : 'bg-red-500');
    message.feedback = isPositive;
  }

  function createParticles(x, y, color) {
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = `absolute w-1.5 h-1.5 rounded-full ${color} pointer-events-none`;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.transform = 'translate(-50%, -50%)';
      particle.style.animation = 'particle-burst 0.5s ease-out forwards';
      document.body.appendChild(particle);

      const angle = (i / 8) * 360;
      particle.style.setProperty('--angle', `${angle}deg`);

      setTimeout(() => particle.remove(), 500);
    }
  }

  function scrollToBottom() {
    elements.messages.scrollTop = elements.messages.scrollHeight;
  }

  function toggleChat() {
    state.isOpen = !state.isOpen;
    elements.window.style.display = state.isOpen ? 'flex' : 'none';
    elements.overlay.style.display = state.isOpen ? 'block' : 'none';
    elements.toggle.querySelector('.chat-icon').style.display = state.isOpen
      ? 'none'
      : 'block';
    elements.toggle.querySelector('.close-icon').style.display = state.isOpen
      ? 'block'
      : 'none';

    if (state.isOpen) {
      elements.input.focus();
      scrollToBottom();
    }
  }

  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'message ai';

    const indicatorContent = document.createElement('div');
    indicatorContent.className = 'message-content typing-indicator';

    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      dot.className = 'typing-dot';
      indicatorContent.appendChild(dot);
    }

    indicator.appendChild(indicatorContent);

    const meta = document.createElement('div');
    meta.className = 'message-meta';

    const timestamp = document.createElement('span');
    timestamp.className = 'message-timestamp';
    timestamp.textContent = formatTime(new Date());
    meta.appendChild(timestamp);

    indicator.appendChild(meta);

    elements.messages.appendChild(indicator);
    scrollToBottom();
    return indicator;
  }

  function addMessage(message) {
    state.messages.push(message);
    elements.messages.appendChild(createMessageElement(message));
    scrollToBottom();
  }

  function handleSubmit(event) {
    event.preventDefault();
    const input = elements.input;
    const rawText = input.value;
    const trimmedText = rawText.replace(/^\s+|\s+$/g, '');

    if (!trimmedText) {
      input.value = '';
      input.style.height = '44px';
      input.classList.remove('expanded');
      return;
    }

    addMessage({
      type: 'user',
      text: trimmedText,
      time: formatTime(new Date()),
    });

    input.value = '';
    input.style.height = '44px';
    input.classList.remove('expanded');
    input.focus();

    state.isTyping = true;
    const indicator = showTypingIndicator();

    setTimeout(() => {
      indicator.remove();
      state.isTyping = false;

      addMessage({
        type: 'ai',
        text: `말씀하신 내용은: ${trimmedText} 입니다. 어떤 도움이 필요하신가요?`,
        feedback: null,
        time: formatTime(new Date()),
      });
    }, 2000);
  }

  function clearChat() {
    state.messages = [
      {
        type: 'ai',
        text: '안녕하세요! 👋 AI 어시스턴트입니다. 무엇을 도와드릴까요?',
        feedback: null,
        time: formatTime(new Date()),
      },
    ];

    elements.messages.innerHTML = '';
    elements.messages.appendChild(createMessageElement(state.messages[0]));
    scrollToBottom();
  }

  function initializeInput() {
    const input = elements.input;

    function adjustHeight() {
      input.style.height = '44px';
      const scrollHeight = input.scrollHeight;

      const hasContent = input.value.replace(/^\s+|\s+$/g, '').length > 0;

      if (!hasContent) {
        input.style.height = '44px';
        input.classList.remove('expanded');
        return;
      }

      const newHeight = Math.min(scrollHeight, 150);

      if (scrollHeight > 44) {
        input.classList.add('expanded');
      } else {
        input.classList.remove('expanded');
      }

      input.style.height = `${newHeight}px`;
    }

    input.style.height = '44px';

    input.addEventListener('input', () => {
      adjustHeight();

      if (!input.value.replace(/^\s+|\s+$/g, '')) {
        input.style.height = '44px';
        input.classList.remove('expanded');
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (e.shiftKey) {
          setTimeout(adjustHeight, 0);
          return;
        } else {
          e.preventDefault();
          const trimmedContent = input.value.replace(/^\s+|\s+$/g, '');
          if (trimmedContent) {
            handleSubmit(e);
          } else {
            input.value = '';
            input.style.height = '44px';
            input.classList.remove('expanded');
          }
        }
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        setTimeout(() => {
          const trimmedContent = input.value.replace(/^\s+|\s+$/g, '');
          if (!trimmedContent) {
            input.style.height = '44px';
            input.classList.remove('expanded');
          } else {
            adjustHeight();
          }
        }, 0);
      }
    });

    input.addEventListener('paste', () => {
      setTimeout(() => {
        const trimmedContent = input.value.replace(/^\s+|\s+$/g, '');
        if (!trimmedContent) {
          input.style.height = '44px';
          input.classList.remove('expanded');
        } else {
          adjustHeight();
        }
      }, 0);
    });

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const trimmedContent = input.value.replace(/^\s+|\s+$/g, '');
      if (trimmedContent) {
        handleSubmit(e);
      } else {
        input.value = '';
        input.style.height = '44px';
        input.classList.remove('expanded');
      }
    });

    setTimeout(adjustHeight, 0);
  }

  // Initialize event listeners
  elements.toggle.addEventListener('click', toggleChat);
  elements.clearChat.addEventListener('click', clearChat);
  elements.closeChat.addEventListener('click', toggleChat);
  elements.overlay.addEventListener('click', toggleChat);

  // Initialize input handling
  initializeInput();

  // Initialize messages
  state.messages.forEach((message) => {
    elements.messages.appendChild(createMessageElement(message));
  });
});
