(function () {
  'use strict';

  const cfg = window.SITE_CONFIG || {};
  const PROJECTS = Array.isArray(window.PROJECTS) ? window.PROJECTS : [];

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  /* ---------- أدوات مساعدة ---------- */

  // إنشاء عناصر DOM بأمان (textContent فقط، دون innerHTML)
  function el(tag, opts, kids) {
    const n = document.createElement(tag);
    if (opts) {
      if (opts.cls) n.className = opts.cls;
      if (opts.text != null) n.textContent = opts.text;
      if (opts.attrs) Object.keys(opts.attrs).forEach(k => n.setAttribute(k, opts.attrs[k]));
    }
    (kids || []).forEach(k => k && n.appendChild(k));
    return n;
  }

  // روابط خارجية: http/https فقط
  function safeUrl(u) {
    if (typeof u !== 'string') return null;
    try {
      const x = new URL(u.trim());
      return (x.protocol === 'https:' || x.protocol === 'http:') ? x.href : null;
    } catch (e) { return null; }
  }

  // الصور: مسارات نسبية أو http/https، وبدون javascript: أو data:
  function safeImage(u) {
    if (typeof u !== 'string' || !u.trim()) return null;
    const s = u.trim();
    if (/^\s*(javascript|data|vbscript):/i.test(s)) return null;
    return s;
  }

  const waNumber = String((cfg.whatsapp && cfg.whatsapp.number) || '').replace(/\D/g, '');
  const waEnabled = waNumber.length >= 8;
  function waLink(message) {
    return 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(message || '');
  }
  const calendlyUrl = safeUrl(cfg.calendly && cfg.calendly.url);

  /* ---------- الاسم والصفة ---------- */
  (function initBrand() {
    const b = cfg.brand || {};
    if (b.name) $$('[data-brand-name]').forEach(n => { n.textContent = b.name; });
    if (b.role) $$('[data-brand-role]').forEach(n => { n.textContent = b.role; });
    if (b.name && b.role) document.title = b.name + ' | ' + b.role;
  })();

  /* ---------- قائمة الجوال ---------- */
  (function initNav() {
    const toggle = $('.menu-toggle');
    const nav = $('#nav');
    if (!toggle || !nav) return;
    function setOpen(open) {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
    }
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.classList.contains('open')) { setOpen(false); toggle.focus(); }
    });
  })();

  /* ---------- واتساب وCalendly ---------- */
  (function initContact() {
    const msg = (cfg.whatsapp && cfg.whatsapp.defaultMessage) || '';
    $$('[data-wa]').forEach(a => {
      if (waEnabled) {
        a.href = waLink(msg);
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      } else if (a.dataset.wa === 'hide') {
        a.hidden = true;
      } // "fallback": يبقى الرابط الداخلي #contact
    });

    const booking = $('#booking');
    if (calendlyUrl && booking) {
      $('#calendly-link').href = calendlyUrl;
      booking.hidden = false;
    }

    if (!waEnabled && !calendlyUrl) {
      const empty = $('#contact-empty');
      if (empty) empty.hidden = false;
    }

    // الزر العائم: يظهر بعد التمرير قليلًا
    const fab = $('#wa-float');
    if (fab && waEnabled && (!cfg.whatsapp || cfg.whatsapp.floatingButton !== false)) {
      fab.href = waLink(msg);
      fab.hidden = false;
      let ticking = false;
      const update = () => { fab.classList.toggle('show', window.scrollY > 600); ticking = false; };
      window.addEventListener('scroll', () => {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
      }, { passive: true });
      update();
    }
  })();

  /* ---------- معرض الأعمال ---------- */
  (function initProjects() {
    const grid = $('#projects-grid');
    const filters = $('#project-filters');
    const empty = $('#projects-empty');
    const dlg = $('#project-dialog');
    const content = $('#pd-content');
    if (!grid || !filters || !empty) return;

    const list = PROJECTS.filter(p => p && typeof p === 'object' && typeof p.name === 'string' && p.name.trim());
    if (!list.length) return; // تبقى الحالة الفارغة ظاهرة

    const statuses = cfg.statuses || {};

    function badge(status) {
      if (!status) return null;
      const label = statuses[status] || String(status);
      return el('span', { cls: 'badge badge-' + String(status).replace(/[^\w-]/g, ''), text: label });
    }

    function thumb(p, alt) {
      const wrap = el('div', { cls: 'thumb' });
      const src = safeImage(p.thumbnail);
      function placeholder() {
        wrap.classList.add('thumb-ph');
        wrap.textContent = '';
        wrap.appendChild(el('span', { cls: 'thumb-letter', text: String(p.name).trim().charAt(0), attrs: { 'aria-hidden': 'true' } }));
      }
      if (src) {
        const img = el('img', { attrs: { src: src, alt: alt || '', loading: 'lazy', decoding: 'async' } });
        img.addEventListener('error', placeholder);
        wrap.appendChild(img);
      } else {
        placeholder();
      }
      return wrap;
    }

    // التصفية
    const categories = Array.from(new Set(list.map(p => (typeof p.category === 'string' ? p.category.trim() : '')).filter(Boolean)));
    let active = 'all';

    function applyFilter() {
      $$('.card', grid).forEach(card => {
        card.hidden = !(active === 'all' || card.dataset.category === active);
      });
      $$('.chip-btn', filters).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.value === active)));
    }

    if (categories.length > 1) {
      [['all', 'الكل']].concat(categories.map(c => [c, c])).forEach(pair => {
        const b = el('button', { cls: 'chip-btn', text: pair[1], attrs: { type: 'button', 'aria-pressed': 'false' } });
        b.dataset.value = pair[0];
        b.addEventListener('click', () => { active = pair[0]; applyFilter(); });
        filters.appendChild(b);
      });
      filters.hidden = false;
    }

    // البطاقات
    list.forEach((p, i) => {
      const card = el('article', { cls: 'card' });
      card.dataset.category = typeof p.category === 'string' ? p.category.trim() : '';
      card.appendChild(thumb(p, ''));

      const meta = el('div', { cls: 'card-meta' });
      if (p.category) meta.appendChild(el('span', { text: p.category }));
      const b = badge(p.status);
      if (b) meta.appendChild(b);

      const btn = el('button', { cls: 'card-link', text: p.name, attrs: { type: 'button', 'aria-haspopup': 'dialog' } });
      btn.addEventListener('click', () => openProject(p, btn));

      card.appendChild(el('div', { cls: 'card-body' }, [
        meta,
        el('h3', null, [btn]),
        p.description ? el('p', { cls: 'card-desc', text: String(p.description) }) : null
      ]));
      grid.appendChild(card);
    });

    grid.hidden = false;
    empty.hidden = true;
    applyFilter();

    // نافذة التفاصيل
    let opener = null;

    function block(title, text) {
      return el('div', null, [el('h4', { text: title }), el('p', { text: String(text) })]);
    }

    function openProject(p, from) {
      if (!dlg || !content) return;
      opener = from;
      content.textContent = '';

      const close = el('button', { cls: 'modal-close', text: 'إغلاق', attrs: { type: 'button' } });
      close.addEventListener('click', () => dlg.close ? dlg.close() : dlg.removeAttribute('open'));
      content.appendChild(close);

      if (safeImage(p.thumbnail)) content.appendChild(thumb(p, 'صورة مصغرة لمشروع ' + p.name));

      const meta = el('div', { cls: 'meta' });
      if (p.category) meta.appendChild(el('span', { text: p.category }));
      const b = badge(p.status);
      if (b) {
        meta.appendChild(el('span', { text: 'حالة النشر:' }));
        meta.appendChild(b);
      }
      content.appendChild(el('div', null, [el('h3', { text: p.name, attrs: { id: 'pd-title' } }), meta]));

      if (p.description) content.appendChild(el('p', { text: String(p.description) }));
      if (p.problem) content.appendChild(block('المشكلة', p.problem));
      if (p.solution) content.appendChild(block('الحل', p.solution));

      if (Array.isArray(p.technologies) && p.technologies.length) {
        const ul = el('ul', { cls: 'tech', attrs: { 'aria-label': 'التقنيات المستخدمة' } });
        p.technologies.forEach(t => ul.appendChild(el('li', { text: String(t) })));
        content.appendChild(el('div', null, [el('h4', { text: 'التقنيات المستخدمة' }), ul]));
      }

      const url = safeUrl(p.previewUrl);
      if (url) {
        content.appendChild(el('a', { cls: 'btn btn-primary', text: 'معاينة المشروع', attrs: { href: url, target: '_blank', rel: 'noopener noreferrer' } }));
      }

      if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
      close.focus();
    }

    if (dlg) {
      dlg.addEventListener('click', e => { if (e.target === dlg && dlg.close) dlg.close(); });
      dlg.addEventListener('close', () => { if (opener) opener.focus(); });
    }
  })();

  /* ---------- قسم الاستثمار ---------- */
  (function initInvest() {
    const form = $('#invest-form');
    if (!form) return;

    const amountEl = $('#amount');
    const currencyEl = $('#currency');
    const typeBox = $('#type-options');
    const ideaEl = $('#idea');
    const amountErr = $('#amount-error');
    const typeErr = $('#type-error');
    const summary = $('#summary');
    const list = $('#summary-list');
    const waBtn = $('#summary-wa');
    const payBtn = $('#pay-btn');
    const payMsg = $('#pay-msg');

    // العملات
    const cur = cfg.currency || {};
    const options = Array.isArray(cur.options) && cur.options.length ? cur.options : [{ code: 'SAR', label: 'ريال سعودي' }];
    options.forEach(o => {
      const opt = el('option', { text: o.label + ' (' + o.code + ')', attrs: { value: o.code } });
      if (o.code === cur.default) opt.selected = true;
      currencyEl.appendChild(opt);
    });

    // أنواع المشاريع
    const types = Array.isArray(cfg.projectTypes) && cfg.projectTypes.length ? cfg.projectTypes : ['موقع تعريفي'];
    types.forEach((t, i) => {
      const id = 'type-' + i;
      typeBox.appendChild(el('input', { attrs: { type: 'radio', name: 'projectType', id: id, value: t } }));
      typeBox.appendChild(el('label', { text: t, attrs: { for: id } }));
    });

    // تحويل الأرقام العربية والفواصل
    function parseAmount(raw) {
      const s = String(raw)
        .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
        .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
        .replace(/٫/g, '.')
        .replace(/[٬,\s]/g, '');
      if (!/^\d+(\.\d{1,2})?$/.test(s)) return NaN;
      return Number(s);
    }

    function setError(input, box, message) {
      box.textContent = message || '';
      if (input) {
        if (message) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
      }
    }

    let lastSummary = null;

    form.addEventListener('submit', e => {
      e.preventDefault();
      summary.hidden = true;

      const raw = amountEl.value.trim();
      const amount = parseAmount(raw);
      const checked = form.querySelector('input[name="projectType"]:checked');
      let firstInvalid = null;

      if (!raw) {
        setError(amountEl, amountErr, 'أدخل قيمة الاستثمار.'); firstInvalid = amountEl;
      } else if (isNaN(amount)) {
        setError(amountEl, amountErr, 'أدخل المبلغ بالأرقام فقط، مثل 5000.'); firstInvalid = amountEl;
      } else if (amount <= 0) {
        setError(amountEl, amountErr, 'يجب أن يكون المبلغ أكبر من صفر.'); firstInvalid = amountEl;
      } else if (amount > 1e9) {
        setError(amountEl, amountErr, 'المبلغ كبير جدًا. تحقق من القيمة المدخلة.'); firstInvalid = amountEl;
      } else {
        setError(amountEl, amountErr, '');
      }

      if (!checked) {
        setError(null, typeErr, 'اختر نوع المشروع.');
        if (!firstInvalid) firstInvalid = typeBox.querySelector('input');
      } else {
        setError(null, typeErr, '');
      }

      if (firstInvalid) { firstInvalid.focus(); return; }

      const currencyOpt = options.find(o => o.code === currencyEl.value) || options[0];
      const amountText = new Intl.NumberFormat('ar-u-nu-latn', { maximumFractionDigits: 2 }).format(amount);
      const idea = ideaEl.value.trim();

      lastSummary = { amount: amount, currency: currencyOpt.code, projectType: checked.value, idea: idea };

      list.textContent = '';
      [['قيمة الاستثمار', amountText + ' ' + currencyOpt.label], ['نوع المشروع', checked.value]]
        .concat(idea ? [['وصف الفكرة', idea]] : [])
        .forEach(row => {
          list.appendChild(el('div', null, [el('dt', { text: row[0] }), el('dd', { text: row[1] })]));
        });

      // رابط واتساب بالرسالة المخصصة
      if (waEnabled) {
        const tpl = (cfg.whatsapp && cfg.whatsapp.investmentMessage) || '{type} {amount} {currency}{idea}';
        const message = tpl
          .replace('{type}', checked.value)
          .replace('{amount}', amountText)
          .replace('{currency}', currencyOpt.label)
          .replace('{idea}', idea ? '\nفكرة المشروع: ' + idea : '');
        waBtn.href = waLink(message);
        waBtn.hidden = false;
      } else {
        waBtn.hidden = true;
      }

      // الدفع معطّل افتراضيًا
      payMsg.hidden = true;
      payBtn.hidden = !(cfg.payment && cfg.payment.enabled === true);

      form.hidden = true;
      summary.hidden = false;
      summary.focus();
      summary.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    // إزالة رسائل الخطأ عند التعديل
    amountEl.addEventListener('input', () => setError(amountEl, amountErr, ''));
    typeBox.addEventListener('change', () => setError(null, typeErr, ''));

    $('#summary-edit').addEventListener('click', () => {
      summary.hidden = true;
      form.hidden = false;
      amountEl.focus();
    });

    // نقطة الربط المستقبلية ببوابة الدفع
    payBtn.addEventListener('click', () => {
      payMsg.hidden = false;
      if (typeof window.startPayment === 'function') {
        payMsg.textContent = 'جارٍ تحويلك إلى بوابة الدفع...';
        window.startPayment(lastSummary);
      } else {
        payMsg.textContent = 'بوابة الدفع غير مربوطة بعد. الدفع يتطلب Backend، راجع ملف README.';
      }
    });
  })();

  /* ---------- الأسئلة الشائعة ---------- */
  (function initFaq() {
    $$('.faq-q').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const open = btn.getAttribute('aria-expanded') !== 'true';
        btn.setAttribute('aria-expanded', String(open));
        item.classList.toggle('open', open);
      });
    });
  })();

  /* ---------- السنة في الفوتر ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
