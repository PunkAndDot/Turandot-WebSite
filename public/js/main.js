/* ============================
   TURANDOT — Основной JavaScript
   ============================ */

document.addEventListener('DOMContentLoaded', () => {
  initVhFix();
  initPreloader();
  initHeader();
  initBurger();
  initScrollAnimations();
  initMenuTabs();
  initLightbox();
  initReservationForm();
  initMobileScrollSnap();
});

/* ============================
   Исправление 100vh для Safari
   ============================ */

function initVhFix() {
  function setVh() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
  }

  setVh();
  window.addEventListener('resize', setVh);
  window.addEventListener('orientationchange', () => {
    setTimeout(setVh, 100);
  });
}

/* ============================
   Прелоадер
   ============================ */

function initPreloader() {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;

  const isFirstVisit = !sessionStorage.getItem('turandot_visited');
  const showDelay = isFirstVisit ? 800 : 200;

  if (isFirstVisit) {
    sessionStorage.setItem('turandot_visited', '1');
  } else {
    preloader.classList.add('preloader--fast');
  }

  function hidePreloader() {
    setTimeout(() => {
      preloader.classList.add('preloader--hidden');
    }, showDelay);
  }

  if (document.readyState === 'complete') {
    hidePreloader();
  } else {
    window.addEventListener('load', hidePreloader);
  }

  // Fallback: скрыть через 5 сек (мобильные устройства могут загружаться дольше)
  setTimeout(() => {
    preloader.classList.add('preloader--hidden');
  }, 5000);

  // Перехват переходов по внутренним ссылкам
  document.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

      e.preventDefault();

      preloader.classList.remove('preloader--hidden');
      preloader.classList.add('preloader--fast');

      setTimeout(() => {
        window.location.href = href;
      }, 200);
    });
  });
}

/* ============================
   Шапка при скролле
   ============================ */

function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  if (typeof fullpage_api === 'undefined' && window.innerWidth > 768) {
    const onScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
}

/* ============================
   Мобильное меню
   ============================ */

function initBurger() {
  const burger = document.querySelector('.burger');
  const navList = document.querySelector('.nav__list');
  if (!burger || !navList) return;

  burger.addEventListener('click', () => {
    burger.classList.toggle('burger--active');
    navList.classList.toggle('nav__list--open');
    document.body.style.overflow = navList.classList.contains('nav__list--open') ? 'hidden' : '';
  });

  // Закрытие при клике на ссылку
  navList.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('burger--active');
      navList.classList.remove('nav__list--open');
      document.body.style.overflow = '';
    });
  });
}

/* ============================
   Анимации при скролле
   ============================ */

function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add(
          entry.target.classList.contains('fade-in') ? 'fade-in--visible' :
          entry.target.classList.contains('fade-in-left') ? 'fade-in-left--visible' :
          'fade-in-right--visible'
        );
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ============================
   Табы меню
   ============================ */

function initMenuTabs() {
  const tabs = document.querySelectorAll('.menu-tab');
  const categories = document.querySelectorAll('.menu-category');
  if (!tabs.length || !categories.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.category;

      // Обновить активный таб
      tabs.forEach(t => t.classList.remove('menu-tab--active'));
      tab.classList.add('menu-tab--active');

      // Показать нужную категорию
      categories.forEach(cat => {
        if (cat.dataset.category === target) {
          cat.style.display = 'grid';
          cat.style.animation = 'fadeIn 0.4s ease';
        } else {
          cat.style.display = 'none';
        }
      });
    });
  });

  // Показать первую категорию
  if (categories.length) {
    categories[0].style.display = 'grid';
  }
}

/* ============================
   Лайтбокс для галереи
   ============================ */

function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery__item');
  if (!galleryItems.length) return;

  // Создать лайтбокс
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <button class="lightbox__close" aria-label="Закрыть">&times;</button>
    <img class="lightbox__img" src="" alt="">
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('.lightbox__img');
  const lightboxClose = lightbox.querySelector('.lightbox__close');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('lightbox--active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  function closeLightbox() {
    lightbox.classList.remove('lightbox--active');
    document.body.style.overflow = '';
  }
}

/* ============================
   Форма бронирования
   ============================ */

function initReservationForm() {
  const form = document.querySelector('#reservation-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Валидация
    if (!data.name || !data.phone || !data.date || !data.time || !data.guests) {
      showNotification('Пожалуйста, заполните все обязательные поля', 'error');
      return;
    }

    // Имитация отправки
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      form.reset();
      showNotification('Ваша заявка на бронирование отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
    }, 1500);
  });
}

/* ============================
   Уведомления
   ============================ */

function showNotification(message, type = 'info') {
  // Удалить предыдущие уведомления
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.innerHTML = `
    <div class="notification__content">
      <p>${message}</p>
      <button class="notification__close">&times;</button>
    </div>
  `;

  // Стили для уведомления
  Object.assign(notification.style, {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    zIndex: '3000',
    maxWidth: '400px',
    padding: '1.25rem 1.5rem',
    borderRadius: '4px',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: '1rem',
    animation: 'slideIn 0.4s ease',
    background: type === 'success' ? '#0F1A2E' : type === 'error' ? '#8B2E2E' : '#1A2940',
    color: '#FAF6F0'
  });

  document.body.appendChild(notification);

  const closeBtn = notification.querySelector('.notification__close');
  closeBtn.addEventListener('click', () => notification.remove());

  // Автоскрытие
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    notification.style.transition = 'all 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

/* ============================
   Модальные окна
   ============================ */

function openModal(id) {
  const modal = document.getElementById('modal-' + id);
  if (!modal) return;
  modal.classList.add('modal--active');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const modal = document.getElementById('modal-' + id);
  if (!modal) return;
  modal.classList.remove('modal--active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal--active').forEach(modal => {
      modal.classList.remove('modal--active');
    });
    document.body.style.overflow = '';
  }
});

/* ============================
   Scroll-Snap анимации (мобилка)
   ============================ */

function initMobileScrollSnap() {
  if (window.innerWidth > 768) return;

  var fullpage = document.getElementById('fullpage');
  var header = document.querySelector('.header');
  var sections = fullpage ? fullpage.querySelectorAll('.fp-section') : [];
  if (!fullpage || !sections.length) return;

  fullpage.addEventListener('scroll', function() {
    header.classList.toggle('header--scrolled', fullpage.scrollTop > 50);
  }, { passive: true });

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, {
    root: fullpage,
    threshold: 0.5
  });

  sections.forEach(function(s) { observer.observe(s); });
  sections[0].classList.add('in-view');
}
