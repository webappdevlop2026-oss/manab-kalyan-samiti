const menu = document.querySelector('#navigation');
const menuButton = document.querySelector('.menu-toggle');
const menuIcon = menuButton.querySelector('span');
const smallScreen = window.matchMedia('(max-width: 760px)');

function setMenuOpen(open) {
  menu.hidden = smallScreen.matches && !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'মেনু বন্ধ করুন' : 'মেনু খুলুন');
  menuIcon.textContent = open ? '×' : '☰';
}

function updateNavigation() {
  menuButton.hidden = !smallScreen.matches;
  setMenuOpen(false);
}

updateNavigation();
smallScreen.addEventListener('change', updateNavigation);
menuButton.addEventListener('click', () => {
  setMenuOpen(menuButton.getAttribute('aria-expanded') === 'false');
});

menu.addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (!link || !smallScreen.matches) return;

  const destination = document.getElementById(link.hash.slice(1));
  if (destination) {
    destination.tabIndex = -1;
    destination.focus({ preventScroll: true });
  }
  setMenuOpen(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false);
    menuButton.focus();
  }
});

const sharePanel = document.querySelector('.share');
const shareButton = sharePanel.querySelector('button');
const shareStatus = sharePanel.querySelector('.share-status');
const shareFallback = sharePanel.querySelector('.share-fallback');
const shareField = shareFallback.querySelector('input');

sharePanel.hidden = !/^https?:$/.test(location.protocol);
shareButton.addEventListener('click', async () => {
  const url = new URL(location.href);
  url.hash = '';
  url.search = '';
  const invitation = {
    title: document.title,
    text: 'মানব কল্যাণ সমিতির শ্যামা কালীপূজায় আপনাকে স্বাগত। রঞ্জন বাজার, দাসপাড়া, দুবরাজপুর, বীরভূম।',
    url: url.href,
  };

  shareStatus.textContent = '';
  shareFallback.hidden = true;

  if (navigator.share) {
    try {
      await navigator.share(invitation);
      return;
    } catch (error) {
      if (error.name === 'AbortError') return;
    }
  }

  try {
    await navigator.clipboard.writeText(invitation.text + '\n' + invitation.url);
    shareStatus.textContent = 'আমন্ত্রণ ও লিংক কপি হয়েছে।';
  } catch {
    shareStatus.textContent = 'নিচের লিংকটি কপি করে পাঠান।';
    shareFallback.hidden = false;
    shareField.value = invitation.url;
    shareField.focus();
    shareField.select();
  }
});
