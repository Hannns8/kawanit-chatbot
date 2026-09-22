const topicButtons = [...document.querySelectorAll('[data-topic]')];
const form = document.querySelector('#chat-form');
const input = document.querySelector('#message-input');
const sendButton = document.querySelector('#send-button');
const clearButton = document.querySelector('#clear-button');
const messages = document.querySelector('#messages');
const welcome = document.querySelector('#welcome');
const chatScroll = document.querySelector('#chat-scroll');
const errorBanner = document.querySelector('#error-banner');
const statusLabel = document.querySelector('#status-label');

let selectedTopic = 'web';
let sending = false;

function showError(text) {
  errorBanner.textContent = text;
  errorBanner.hidden = !text;
}

function scrollToBottom() {
  chatScroll.scrollTop = chatScroll.scrollHeight;
}

function addMessage(role, text, topic) {
  welcome.hidden = true;
  const article = document.createElement('article');
  article.className = `message ${role === 'user' ? 'user' : 'assistant'}`;

  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = role === 'user' ? '●' : '✦';

  const wrap = document.createElement('div');
  wrap.className = 'bubble-wrap';
  const label = document.createElement('div');
  label.className = 'message-label';
  label.textContent = role === 'user' ? `Kamu · ${topicButtons.find(button => button.dataset.topic === topic)?.dataset.label ?? 'IT'}` : 'KawanIT';
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  // textContent memastikan jawaban model tidak dieksekusi sebagai HTML.
  bubble.textContent = text;
  wrap.append(label, bubble);
  article.append(avatar, wrap);
  messages.append(article);
  scrollToBottom();
  return article;
}

async function loadHistory() {
  try {
    const response = await fetch('/api/history');
    if (!response.ok) throw new Error();
    const data = await response.json();
    for (const item of data.messages) addMessage(item.role, item.text, item.topic);
  } catch {
    showError('Riwayat belum bisa dimuat. Muat ulang halaman untuk mencoba lagi.');
  }
}

async function loadStatus() {
  try {
    const response = await fetch('/api/status');
    const data = await response.json();
    statusLabel.textContent = data.ready ? 'Siap membantu belajar' : 'API key belum terbaca · mulai ulang server';
  } catch {
    statusLabel.textContent = 'Server tidak terhubung';
  }
}

topicButtons.forEach(button => button.addEventListener('click', () => {
  selectedTopic = button.dataset.topic;
  topicButtons.forEach(item => item.classList.toggle('active', item === button));
  input.focus();
}));

document.querySelectorAll('[data-prompt]').forEach(button => button.addEventListener('click', () => {
  topicButtons.find(item => item.dataset.topic === button.dataset.suggestionTopic)?.click();
  input.value = button.dataset.prompt;
  input.focus();
}));

input.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    form.requestSubmit();
  }
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  const message = input.value.trim();
  if (!message || sending) return;
  sending = true;
  sendButton.disabled = true;
  showError('');
  const userMessage = addMessage('user', message, selectedTopic);
  input.value = '';
  const pending = addMessage('assistant', 'Sedang menyusun jawaban...', selectedTopic);
  pending.querySelector('.bubble').classList.add('typing');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, topic: selectedTopic }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Gagal mengirim pesan.');
    pending.querySelector('.bubble').classList.remove('typing');
    pending.querySelector('.bubble').textContent = data.answer;
  } catch (error) {
    pending.remove();
    userMessage.remove();
    input.value = message;
    if (!messages.children.length) welcome.hidden = false;
    showError(error.message || 'Terjadi kesalahan. Coba lagi.');
  } finally {
    sending = false;
    sendButton.disabled = false;
    input.focus();
    scrollToBottom();
  }
});

clearButton.addEventListener('click', async () => {
  if (sending) return;
  showError('');
  try {
    const response = await fetch('/api/history', { method: 'DELETE' });
    if (!response.ok) throw new Error();
    messages.replaceChildren();
    welcome.hidden = false;
    input.focus();
  } catch {
    showError('Percakapan belum bisa dihapus. Coba lagi.');
  }
});

loadStatus();
loadHistory();
