'use strict';
const dialogTriggers = new Map([
  [document.querySelector('#personal-telegram'), document.querySelector('#contact-dialog')]
]);
for (const [trigger, dialog] of dialogTriggers) {
  let originalOverflow = '';
  trigger.addEventListener('click', () => {
    originalOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  });
  dialog.querySelector('.close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); dialog.close(); }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = originalOverflow;
    trigger.focus({preventScroll:true});
  });
}
let toastTimer;
const toast = document.querySelector('#toast');
function announce(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('visible');
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 3200);
}
document.querySelector('#copy-contract').addEventListener('click', async event => {
  const address = event.currentTarget.dataset.address;
  try {
    await navigator.clipboard.writeText(address);
    announce('Full contract address copied.');
  } catch {
    const input = document.querySelector('#manual-contract');
    input.hidden = false;
    input.focus();
    input.select();
    announce('Address selected. Press ⌘C or Ctrl+C to copy.');
  }
});
