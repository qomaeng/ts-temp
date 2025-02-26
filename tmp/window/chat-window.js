document.addEventListener('DOMContentLoaded', () => {
  const helloMessage =
    '안녕하세요! 저는 ALL#ai ALLI(올리)입니다.\n' +
    '"ALL"과 발음이 비슷한 제 이름처럼, 모든 것을 도와주는 든든한 조력자가 되어드리겠습니다.\n' +
    'ERP 시스템 사용에 대해 궁금한 점이 있으시면 언제든 물어보세요!';

  const state = {
    messages: [
      {
        type: 'ai',
        text: helloMessage,
        feedback: null,
        time: formatTime(new Date()),
      },
    ],
    isTyping: false,
  };

  const elements = {
    messages: document.getElementById('chatMessages'),
    input: document.getElementById('messageInput'),
    form: document.getElementById('messageForm'),
    clearChat: document.getElementById('clearChat'),
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
    content.style.width = 'fit-content';

    const lines = message.text.split('\n');
    lines.forEach((line, index) => {
      const span = document.createElement('span');
      span.textContent = line;
      content.appendChild(span);
      if (index < lines.length - 1) {
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

    if (message.type === 'ai' && !message.isTyping) {
      const feedback = document.createElement('div');
      feedback.className = 'feedback-buttons';

      const thumbsUp = document.createElement('button');
      const thumbsDown = document.createElement('button');

      thumbsUp.className = 'feedback-button thumbs-up';
      thumbsUp.innerHTML = '<i class="fa-solid fa-thumbs-up"></i>';
      thumbsUp.setAttribute('aria-label', '도움이 됨');
      thumbsUp.onclick = (event) => {
        handleFeedback(message, true, event);
        thumbsUp.classList.add('active');
        thumbsDown.classList.remove('active');
      };

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
    const scrollHeight = elements.messages.scrollHeight;
    const paddingBottom = 80; // Match the padding-bottom from CSS
    elements.messages.scrollTop = scrollHeight - paddingBottom;
  }

  function addMessage(message) {
    state.messages.push(message);
    const messageElement = createMessageElement(message);
    elements.messages.appendChild(messageElement);
    scrollToBottom();
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

    fetch('/rag', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: trimmedText }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }

        indicator.remove();
        state.isTyping = false;

        addMessage({
          type: 'ai',
          text: data.result || data.response,
          feedback: null,
          time: formatTime(new Date()),
          isTyping: false,
        });

        return;
      })
      .catch((error) => {
        indicator.remove();
        state.isTyping = false;

        console.error('Error:', error);
        addMessage({
          type: 'ai',
          text: `죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.\n에러 내용: ${error.message}`,
          feedback: null,
          time: formatTime(new Date()),
          isTyping: false,
        });
      });
  }

  function clearChat() {
    state.messages = [
      {
        type: 'ai',
        text: helloMessage,
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

  // Initialize the chat window
  function initialize() {
    elements.form.addEventListener('submit', handleSubmit);
    elements.clearChat.addEventListener('click', clearChat);

    window.focus();
    elements.input.focus();

    state.messages.forEach((message) => {
      elements.messages.appendChild(createMessageElement(message));
    });

    initializeInput();
  }

  // Initialize when the window loads
  initialize();
});
