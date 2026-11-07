const menu = document.querySelector('#navigation');
const menuButton = document.querySelector('.menu-toggle');
const menuIcon = menuButton.querySelector('span');
const smallScreen = window.matchMedia('(max-width: 760px)');
const photoViewer = document.querySelector('#photo-viewer');

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
  if (event.key === 'Escape' && !photoViewer.open && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false);
    menuButton.focus();
  }
});

if (typeof photoViewer.showModal === 'function') {
  const fullPhoto = document.createElement('img');
  photoViewer.querySelector('.photo-viewer-frame').append(fullPhoto);

  for (const link of document.querySelectorAll('a[data-photo]')) {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

      event.preventDefault();
      const photo = link.querySelector('img');
      fullPhoto.src = link.href;
      fullPhoto.alt = photo.alt;
      link.focus({ preventScroll: true });
      photoViewer.showModal();
    });
  }
}

const memoryTrack = document.querySelector('.memory-track');
const memorySlides = Array.from(memoryTrack.querySelectorAll('.memory-slide'));
const memoryControls = document.querySelector('.memory-controls');
const memoryPages = memoryControls.querySelector('.memory-pages');
const memoryPosition = memoryControls.querySelector('.memory-position');
const bengaliNumber = new Intl.NumberFormat('bn-IN');

if (memorySlides.length > 1) {
  let activeSlide = -1;
  const lastSlide = memorySlides.length - 1;
  const slideNumber = (index) => bengaliNumber.format(index + 1);
  const currentSlide = () => {
    const width = memoryTrack.clientWidth;
    return width ? Math.min(lastSlide, Math.max(0, Math.round(memoryTrack.scrollLeft / width))) : 0;
  };

  function goToSlide(index) {
    const wrappedIndex = (index + memorySlides.length) % memorySlides.length;
    memoryTrack.scrollTo({
      left: wrappedIndex * memoryTrack.clientWidth,
      behavior: Math.abs(wrappedIndex - currentSlide()) > 1 ? 'instant' : 'auto',
    });
  }

  const photoButtons = memorySlides.map((slide, index) => {
    const button = document.createElement('button');
    const title = slide.querySelector('h3').textContent;
    const year = slide.querySelector('time')?.textContent.trim();
    button.type = 'button';
    button.textContent = year || slideNumber(index);
    button.setAttribute('aria-label', year ? year + ' সালের ছবি — ' + title : title);
    button.setAttribute('aria-controls', memoryTrack.id);
    button.addEventListener('click', () => goToSlide(index));
    return button;
  });

  function updateSlidePosition() {
    const index = currentSlide();
    if (index === activeSlide) return;
    photoButtons[activeSlide]?.removeAttribute('aria-current');
    photoButtons[index].setAttribute('aria-current', 'true');
    memoryPosition.textContent = 'ছবি ' + slideNumber(index) + ' / ' + slideNumber(lastSlide);
    activeSlide = index;
  }

  memoryPages.append(...photoButtons);
  memoryTrack.tabIndex = 0;
  memoryControls.hidden = false;
  updateSlidePosition();

  memoryTrack.addEventListener('scroll', updateSlidePosition, { passive: true });
  memoryControls.querySelector('.memory-prev').addEventListener('click', () => goToSlide(currentSlide() - 1));
  memoryControls.querySelector('.memory-next').addEventListener('click', () => goToSlide(currentSlide() + 1));
  memoryTrack.addEventListener('keydown', (event) => {
    if (event.target !== memoryTrack) return;
    const targets = {
      ArrowLeft: currentSlide() - 1,
      ArrowRight: currentSlide() + 1,
      Home: 0,
      End: lastSlide,
    };
    const target = targets[event.key];
    if (typeof target !== 'number') return;
    event.preventDefault();
    goToSlide(target);
  });
}

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
