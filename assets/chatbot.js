import { getReply, suggestedQuestions, faqCategories, faqItems } from './chatbot-answers.js';

if (!document.querySelector('program-chatbot')) {
  const host = document.createElement('program-chatbot');
  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = `
    <link rel="stylesheet" href="/Local_StartUP/assets/chatbot.css">
    <button class="launcher" type="button" aria-expanded="false" aria-controls="chat-panel" aria-label="프로그램 문의 챗봇 열기">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H8l-5 3V11.5A7.5 7.5 0 0 1 10.5 4h2a7.5 7.5 0 0 1 7.5 7.5Z" stroke="currentColor" stroke-width="1.7"/><path d="M8 11.5h8M8 15h5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
      <span>궁금한 점 물어보기</span><span class="launcher-plus" aria-hidden="true">+</span>
    </button>
    <section class="panel" id="chat-panel" role="dialog" aria-modal="false" aria-labelledby="chat-title" hidden>
      <header class="header"><div class="avatar" aria-hidden="true">✳</div><div><p class="eyebrow">빛결</p><h2 id="chat-title">프로그램 안내</h2></div><button class="close" type="button" aria-label="챗봇 닫기">×</button></header>
      <p class="mode"><span aria-hidden="true"></span> FAQ 기반 자동 안내</p>
      <div class="messages" role="log" aria-label="문의 대화" aria-live="polite" aria-relevant="additions" tabindex="0"></div>
      <section class="faq-browser" aria-label="전체 FAQ" hidden>
        <div class="faq-browser-heading"><h3>궁금한 상황을 찾아보세요</h3><button class="back-to-chat" type="button">대화로 돌아가기</button></div>
        <label class="category-label" for="faq-category">질문 분야</label><select id="faq-category" aria-controls="faq-questions"></select>
        <p class="faq-count" role="status"></p><div class="faq-questions" id="faq-questions"></div>
      </section>
      <div class="faq-toolbar"><span class="faq-total"></span><button class="browse-faq" type="button" aria-expanded="false">전체 FAQ 보기 ↗</button></div>
      <div class="suggestions" aria-label="추천 질문"></div>
      <form class="composer"><label class="sr-only" for="question">궁금한 점</label><textarea id="question" name="question" rows="1" maxlength="500" placeholder="궁금한 점을 입력해주세요" aria-describedby="chat-hint" required></textarea><button class="send" type="submit" aria-label="질문 보내기">↑</button></form>
      <p class="hint" id="chat-hint">개인정보는 입력하지 마세요 · 대화는 저장되지 않아요</p>
    </section>`;
  document.body.append(host);

  const launcher = root.querySelector('.launcher');
  const panel = root.querySelector('.panel');
  const messages = root.querySelector('.messages');
  const form = root.querySelector('form');
  const input = root.querySelector('textarea');
  const suggestions = root.querySelector('.suggestions');
  const faqBrowser = root.querySelector('.faq-browser');
  const browseButton = root.querySelector('.browse-faq');
  const categorySelect = root.querySelector('#faq-category');
  const faqQuestions = root.querySelector('.faq-questions');
  const faqCount = root.querySelector('.faq-count');
  root.querySelector('.faq-total').textContent = `${faqCategories.length}개 분야 · ${faqItems.length}개 FAQ`;
  let previousTopic = null;

  function showFaq(open) {
    faqBrowser.hidden = !open;
    messages.hidden = open;
    suggestions.hidden = open;
    browseButton.setAttribute('aria-expanded', String(open));
    browseButton.textContent = open ? '대화 보기 ↩' : '전체 FAQ 보기 ↗';
    (open ? categorySelect : input).focus();
    if (!open) messages.scrollTop = messages.scrollHeight;
  }

  function renderQuestions() {
    faqQuestions.replaceChildren();
    const items = faqItems.filter(item => item.category === categorySelect.value);
    faqCount.textContent = `${items.length}개 질문 · 선택하면 답변을 안내해드려요`;
    for (const item of items) {
      const button = document.createElement('button');
      button.type = 'button'; button.textContent = item.question;
      button.addEventListener('click', () => { showFaq(false); send(item.question); });
      faqQuestions.append(button);
    }
    faqBrowser.scrollTop = 0;
  }
  for (const category of faqCategories) {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.label;
    categorySelect.append(option);
  }
  renderQuestions();
  categorySelect.addEventListener('change', renderQuestions);
  browseButton.addEventListener('click', () => showFaq(faqBrowser.hidden));
  root.querySelector('.back-to-chat').addEventListener('click', () => showFaq(false));

  function setOpen(open) {
    panel.hidden = !open;
    launcher.setAttribute('aria-expanded', String(open));
    launcher.setAttribute('aria-label', open ? '프로그램 문의 챗봇 닫기' : '프로그램 문의 챗봇 열기');
    (open ? input : launcher).focus();
  }

  function appendMessage(text, who = 'bot', apply = false) {
    const message = document.createElement('div');
    message.className = `message ${who}`;
    const label = document.createElement('span');
    label.className = 'message-label';
    label.textContent = who === 'bot' ? '안내 도우미' : '나';
    const content = document.createElement('p');
    content.textContent = text;
    message.append(label, content);
    if (apply) {
      const link = document.createElement('a');
      link.className = 'apply-link';
      link.href = '/Local_StartUP/apply/';
      link.textContent = '관심 신청하기 ↗';
      message.append(link);
    }
    messages.append(message);
    // Keep this page's temporary conversation bounded; never persist it.
    while (messages.children.length > 41) messages.firstElementChild.remove();
    messages.scrollTop = messages.scrollHeight;
  }

  function send(question) {
    const text = question.trim();
    if (!text || text.length > 500) return;
    if (!faqBrowser.hidden) showFaq(false);
    appendMessage(text, 'user');
    const reply = getReply(text, previousTopic);
    previousTopic = reply.topic;
    appendMessage(reply.text, 'bot', reply.apply);
    input.value = '';
    input.focus();
  }

  appendMessage(`안녕하세요! 빛결이 궁금하신가요?\n참여 대상부터 전시·신청 변경까지, ${faqItems.length}개 FAQ로 안내해드릴게요. 질문을 직접 입력하거나 ‘전체 FAQ’에서 상황을 찾아보세요.`);
  for (const question of suggestedQuestions) {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = question;
    button.addEventListener('click', () => send(question));
    suggestions.append(button);
  }
  launcher.addEventListener('click', () => setOpen(panel.hidden));
  root.querySelector('.close').addEventListener('click', () => setOpen(false));
  root.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) { event.preventDefault(); setOpen(false); }
  });
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault(); form.requestSubmit();
    }
  });
  form.addEventListener('submit', event => { event.preventDefault(); send(input.value); });
}
