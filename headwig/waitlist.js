const dialog = document.querySelector('#waitlist');
const form = document.querySelector('#waitlist-form');
const status = document.querySelector('#form-status');
const submit = document.querySelector('#submit-waitlist');
const video = document.querySelector('.demo video');
const videoCta = document.querySelector('.demo-cta');
const syncVideoCta = () => { videoCta.hidden = video.paused || video.ended; };
['play', 'pause', 'ended'].forEach((eventName) => video.addEventListener(eventName, syncVideoCta));
syncVideoCta();
document.querySelectorAll('.waitlist-trigger').forEach((button) => {
  button.addEventListener('click', () => dialog.showModal());
});
document.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
let joined = false;
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (joined || submit.disabled) return;
  const endpoint = window.HEADWIG_WAITLIST_URL;
  if (!endpoint || !/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(endpoint)) {
    status.textContent = 'The waitlist is opening soon. Please check back shortly.';
    return;
  }
  submit.disabled = true;
  submit.textContent = 'Adding you…';
  status.textContent = '';
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: new URLSearchParams(new FormData(form)),
      signal: AbortSignal.timeout(25000),
      credentials: 'omit'
    });
    if (!response.ok) throw new Error('Request failed');
    const result = await response.json();
    if (!result.ok || result.schema !== 2) throw new Error('Submission not confirmed with current fields');
    joined = true;
    submit.textContent = 'You’re on the list ✓';
    status.textContent = 'Thank you for being here. I’ll email you when Headwig is ready. — Harsh';
    form.querySelectorAll('input, select, textarea').forEach((field) => { field.disabled = true; });
  } catch {
    status.textContent = 'I couldn’t confirm your signup. Please try again. Your details are still here.';
    submit.disabled = false;
    submit.textContent = 'Try again ↗';
  }
});
