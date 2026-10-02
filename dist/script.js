(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 700px)');
  const menuButton = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const hero = document.querySelector('.hero');
  const journeyStep = document.querySelector('.journey-step');
  const journeyTitle = document.querySelector('.journey-title');
  const journeyDetail = document.querySelector('.journey-detail');
  const services = document.querySelector('.services');
  const serviceTrack = document.querySelector('.service-track');
  const serviceProgress = document.querySelector('.service-progress span');
  const smile = document.querySelector('.smile');
  const smileImage = document.querySelector('.smile-image');
  const smilePhoto = document.querySelector('.smile-image img');
  const cta = document.querySelector('.final-cta');
  const ctaPhoto = document.querySelector('.cta-image img');
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  let queued = false;
  let currentJourney = -1;

  const journey = [
    { step: '01 / NOTICE', title: 'A concern worth exploring', detail: 'A damaged tooth or persistent bad breath can make close conversations feel uncomfortable. A dental examination can help find the cause.' },
    { step: '02 / EXAMINE', title: 'Look beneath the surface', detail: 'An examination and appropriate imaging can help the dentist understand the tooth and discuss possible care.' },
    { step: '03 / PLAN', title: 'Care shaped around you', detail: 'Your dentist can explain options, including whether a tooth can be preserved or needs another treatment.' },
    { step: '04 / SMILE', title: 'A smile to share', detail: 'After suitable care, many people feel more at ease smiling and speaking with friends. Every outcome is individual.' }
  ];

  document.getElementById('year').textContent = new Date().getFullYear();
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-ready')));

  function closeMenu() {
    mobileMenu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('menu-open');
  }
  menuButton.addEventListener('click', () => {
    const opening = mobileMenu.hidden;
    mobileMenu.hidden = !opening;
    menuButton.setAttribute('aria-expanded', String(opening));
    menuButton.setAttribute('aria-label', opening ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', opening);
  });
  mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 900) closeMenu(); requestTick(); }, { passive: true });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .13, rootMargin: '0px 0px -5% 0px' });
  document.querySelectorAll('[data-reveal]').forEach(element => revealObserver.observe(element));

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('in-view', entry.isIntersecting));
  }, { threshold: .18 });
  document.querySelectorAll('.technology, .final-cta').forEach(element => sectionObserver.observe(element));

  function render() {
    queued = false;
    if (reducedMotion.matches) return;
    const viewport = window.innerHeight;
    const heroRect = hero.getBoundingClientRect();
    const heroProgress = clamp(-heroRect.top / Math.max(1, hero.offsetHeight - viewport));
    const smoothstep = (start, end, value) => {
      const point = clamp((value - start) / (end - start));
      return point * point * (3 - 2 * point);
    };
    const scanIn = smoothstep(.15, .38, heroProgress);
    const restoreIn = smoothstep(.56, .82, heroProgress);
    hero.style.setProperty('--defect-opacity', String(1 - scanIn));
    hero.style.setProperty('--scan-opacity', String(scanIn * (1 - restoreIn)));
    hero.style.setProperty('--restored-opacity', String(restoreIn));
    hero.style.setProperty('--hero-rotate', `${-13 + heroProgress * 27}deg`);
    hero.style.setProperty('--hero-scale', String(1 + Math.sin(heroProgress * Math.PI) * .04));
    const stage = heroProgress < .24 ? 0 : heroProgress < .5 ? 1 : heroProgress < .76 ? 2 : 3;
    if (stage !== currentJourney) {
      currentJourney = stage;
      journeyStep.textContent = journey[stage].step;
      journeyTitle.textContent = journey[stage].title;
      journeyDetail.textContent = journey[stage].detail;
    }
    if (!mobile.matches) {
      const servicesRect = services.getBoundingClientRect();
      const scrollDistance = Math.max(1, services.offsetHeight - viewport);
      const progress = clamp(-servicesRect.top / scrollDistance);
      const travel = Math.max(0, serviceTrack.scrollWidth - window.innerWidth);
      serviceTrack.style.transform = `translate3d(${-travel * progress}px, 0, 0)`;
      serviceProgress.style.transform = `scaleX(${Math.max(.15, progress)})`;
    } else {
      serviceTrack.style.transform = '';
    }
    const smileRect = smile.getBoundingClientRect();
    if (smileRect.top < viewport && smileRect.bottom > 0) {
      const reveal = clamp((viewport * .85 - smileRect.top) / (viewport * .8));
      smileImage.style.clipPath = `inset(0 ${50 - reveal * 50}% 0 ${50 - reveal * 50}%)`;
      smilePhoto.style.transform = `scale(${1.08 - reveal * .08})`;
    }
    const ctaRect = cta.getBoundingClientRect();
    if (ctaRect.top < viewport && ctaRect.bottom > 0) {
      const offset = clamp((viewport - ctaRect.top) / (viewport + ctaRect.height));
      ctaPhoto.style.transform = `scale(${1.12 - offset * .07}) translateY(${(offset - .5) * 22}px)`;
    }
  }
  function requestTick() { if (!queued) { queued = true; requestAnimationFrame(render); } }
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick, { passive: true });
  requestTick();

  const panelWidth = () => serviceTrack.querySelector('.service-panel').getBoundingClientRect().width + 20;
  document.querySelector('.service-prev').addEventListener('click', () => {
    if (mobile.matches) serviceTrack.scrollBy({ left: -panelWidth(), behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    else window.scrollBy({ top: -(services.offsetHeight - window.innerHeight) / 3, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  });
  document.querySelector('.service-next').addEventListener('click', () => {
    if (mobile.matches) serviceTrack.scrollBy({ left: panelWidth(), behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    else window.scrollBy({ top: (services.offsetHeight - window.innerHeight) / 3, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  });
  serviceTrack.addEventListener('scroll', () => {
    if (mobile.matches) {
      const max = Math.max(1, serviceTrack.scrollWidth - serviceTrack.clientWidth);
      serviceProgress.style.transform = `scaleX(${Math.max(.15, serviceTrack.scrollLeft / max)})`;
    }
  }, { passive: true });

  const technologySteps = {
    scanner: { phase: '01 / CAPTURE', heading: 'A clearer first look.', description: 'A handheld scanner captures a digital impression. Your dentist can use the on-screen model to discuss what they see and plan the next step.', tag: 'SCAN / 01<br>FORM ANALYSIS', note: 'DIGITAL IMPRESSION<br>VISUAL STUDY' },
    opg: { phase: '02 / ASSESS', heading: 'See the wider picture.', description: 'A panoramic OPG X-ray can show the jaws and teeth in one view, helping the dentist assess concerns that may not be visible during an examination.', tag: 'IMAGE / 02<br>PANORAMIC VIEW', note: 'DENTAL IMAGING<br>VISUAL STUDY' },
    laser: { phase: '03 / TREAT', heading: 'Care with a focused touch.', description: 'A dental laser may be used for selected soft-tissue procedures. Your dentist will explain whether it is suitable and what the treatment involves.', tag: 'LASER / 03<br>FOCUSED CARE', note: 'TREATMENT TOOL<br>VISUAL STUDY' },
    crown: { phase: '04 / RESTORE', heading: 'Shape a precise fit.', description: 'Digital design and milling can help create a zirconia crown matched to a treatment plan. The dentist checks fit and function before it is placed.', tag: 'CROWN / 04<br>DIGITAL DESIGN', note: 'CERAMIC RESTORATION<br>VISUAL STUDY' }
  };
  const techStage = document.querySelector('.scan-stage');
  const techButtons = [...document.querySelectorAll('[data-tech]')];
  const techViews = [...document.querySelectorAll('[data-tech-view]')];
  const techKeys = Object.keys(technologySteps);
  let activeTechKey = 'scanner';
  function showTechnology(key) {
    const step = technologySteps[key];
    if (!step) return;
    activeTechKey = key;
    techStage.dataset.active = key;
    techButtons.forEach(button => {
      const selected = button.dataset.tech === key;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    techViews.forEach(view => {
      const selected = view.dataset.techView === key;
      view.classList.toggle('is-active', selected);
      view.setAttribute('aria-hidden', String(!selected));
    });
    document.getElementById('tech-phase').textContent = step.phase;
    document.getElementById('tech-heading').textContent = step.heading;
    document.getElementById('tech-description').textContent = step.description;
    document.getElementById('tech-stage-tag').innerHTML = step.tag;
    document.getElementById('tech-stage-note').innerHTML = step.note;
  }
  techButtons.forEach(button => button.addEventListener('click', () => showTechnology(button.dataset.tech)));
  document.getElementById('tech-prev').addEventListener('click', () => showTechnology(techKeys[(techKeys.indexOf(activeTechKey) - 1 + techKeys.length) % techKeys.length]));
  document.getElementById('tech-next').addEventListener('click', () => showTechnology(techKeys[(techKeys.indexOf(activeTechKey) + 1) % techKeys.length]));
  showTechnology('scanner');

  const bookingDialog = document.getElementById('booking-dialog');
  const serviceDialog = document.getElementById('service-dialog');
  const serviceDetails = {
    implants: { kicker: '01 / RESTORE', title: 'Dental implants', description: 'DENTIN offers dental implants as one option for replacing a missing tooth. The dentist can assess your oral health and discuss whether this approach is suitable for you.' },
    root: { kicker: '02 / PRESERVE', title: 'Root canal treatment', description: 'Root canal treatment may help preserve a tooth affected by infection or damage. An examination is needed to understand the tooth and choose the right care.' },
    aligners: { kicker: '03 / REFINE', title: 'Invisible aligners', description: 'Clear aligners can be considered for some alignment concerns. Your dentist can examine your bite and explain the treatment plan and expected timeline.' },
    scaling: { kicker: '04 / MAINTAIN', title: 'Scaling and polishing', description: 'Professional cleaning can remove plaque and tartar. Your dentist can also discuss oral hygiene, gum health, and possible causes of persistent bad breath.' }
  };
  function openBooking() {
    closeMenu();
    if (serviceDialog.open) serviceDialog.close();
    if (!bookingDialog.open) bookingDialog.showModal();
  }
  document.querySelectorAll('[data-book]').forEach(button => button.addEventListener('click', openBooking));
  document.querySelectorAll('[data-service]').forEach(button => button.addEventListener('click', () => {
    const detail = serviceDetails[button.dataset.service];
    document.getElementById('service-kicker').textContent = detail.kicker;
    document.getElementById('service-title').textContent = detail.title;
    document.getElementById('service-description').textContent = detail.description;
    serviceDialog.showModal();
  }));
  document.querySelectorAll('.site-dialog').forEach(dialog => {
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  });

  const bookingForm = document.getElementById('booking-form');
  const bookingReady = document.getElementById('booking-ready');
  const bookingDate = bookingForm.elements.date;
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  bookingDate.min = localToday;
  bookingForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!bookingForm.reportValidity()) return;
    const values = Object.fromEntries(new FormData(bookingForm));
    const date = new Date(`${values.date}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    document.getElementById('booking-summary').textContent = `${values.name}, you prefer ${date} in the ${values.time.toLowerCase()} for ${values.reason.toLowerCase()}. We’ll include your contact number in the message.`;
    const subject = `Appointment request — ${values.name}`;
    const body = `Hello DENTIN,\n\nI would like to request an appointment.\n\nName: ${values.name}\nPhone: ${values.phone}\nPreferred date: ${date}\nPreferred time: ${values.time}\nReason: ${values.reason}\n\nPlease let me know what is available. Thank you.`;
    document.getElementById('booking-email').href = `mailto:appointments@dentinoralexperts.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    bookingForm.hidden = true;
    bookingReady.hidden = false;
    bookingReady.querySelector('h3').focus?.();
  });
  document.getElementById('booking-edit').addEventListener('click', () => {
    bookingReady.hidden = true;
    bookingForm.hidden = false;
    bookingForm.elements.name.focus();
  });

  const reviews = [
    { title: 'Clear explanations and thoughtful follow-up.', summary: 'Narasinga Rao described how Dr. Sharma explained the condition of his teeth, discussed the treatment, and checked on him afterward.', name: 'Narasinga Rao', treatment: 'Root canal and crowns · Verified Practo story' },
    { title: 'A more conservative path to care.', summary: 'Gangadhar shared that Dr. Sharma first tried pulp capping and a filling. In his case, that meant a root canal was not needed.', name: 'Gangadhar', treatment: 'Dental filling · Verified Practo story' },
    { title: 'Reassurance during a difficult visit.', summary: 'Kunal said the team checked on his comfort through a wisdom tooth extraction, and Dr. Sharma followed up after the procedure.', name: 'Kunal', treatment: 'Wisdom tooth extraction · Verified Practo story' },
    { title: 'Seeing the reason behind the pain.', summary: 'Litu Patra described how X-rays and intraoral photos helped explain his tooth pain, and appreciated the follow-up after treatment.', name: 'Litu Patra', treatment: 'Wisdom tooth and root canal care · Verified Practo story' },
    { title: 'Patient answers and practical guidance.', summary: 'Ravi Shankar said Dr. Sharma explained his dental concerns carefully and gave guidance on caring for his teeth after treatment.', name: 'Ravi Shankar', treatment: 'Root canal and dental care · Verified Practo story' }
  ];
  let reviewIndex = 0;
  let reviewTimer;
  const reviewCard = document.querySelector('.review-card');
  const reviewContent = document.querySelector('.review-content');
  const reviewDots = [...document.querySelectorAll('[data-review]')];
  function showReview(index) {
    const nextIndex = (index + reviews.length) % reviews.length;
    if (nextIndex === reviewIndex) return;
    clearTimeout(reviewTimer);
    reviewContent.classList.add('is-changing');
    reviewTimer = setTimeout(() => {
      reviewIndex = nextIndex;
      const review = reviews[reviewIndex];
      document.getElementById('review-quote').textContent = review.title;
      document.getElementById('review-summary').textContent = review.summary;
      document.getElementById('review-name').textContent = review.name;
      document.getElementById('review-treatment').textContent = review.treatment;
      document.getElementById('review-count').textContent = `${String(reviewIndex + 1).padStart(2, '0')} / ${String(reviews.length).padStart(2, '0')}`;
      document.querySelector('.review-label').textContent = `PATIENT STORY / ${String(reviewIndex + 1).padStart(2, '0')}`;
      reviewDots.forEach((dot, dotIndex) => {
        const selected = dotIndex === reviewIndex;
        dot.classList.toggle('is-active', selected);
        if (selected) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
      reviewCard.style.setProperty('--review-progress', `${((reviewIndex + 1) / reviews.length) * 100}%`);
      reviewContent.classList.remove('is-changing');
    }, reducedMotion.matches ? 0 : 190);
  }
  document.getElementById('review-prev').addEventListener('click', () => showReview(reviewIndex - 1));
  document.getElementById('review-next').addEventListener('click', () => showReview(reviewIndex + 1));
  reviewDots.forEach(dot => dot.addEventListener('click', () => showReview(Number(dot.dataset.review))));
  let touchStartX = 0;
  reviewCard.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
  reviewCard.addEventListener('touchend', event => {
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 45) showReview(reviewIndex + (delta < 0 ? 1 : -1));
  }, { passive: true });

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reducedMotion.matches) {
    document.querySelectorAll('.magnetic').forEach(button => {
      button.addEventListener('pointermove', event => {
        const box = button.getBoundingClientRect();
        const x = (event.clientX - box.left - box.width / 2) * .12;
        const y = (event.clientY - box.top - box.height / 2) * .18;
        button.style.transform = `translate(${x}px, ${y}px)`;
      });
      button.addEventListener('pointerleave', () => { button.style.transform = ''; });
    });
  }
})();
