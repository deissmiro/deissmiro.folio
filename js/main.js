/* ---------- nav pill follows hover ---------- */
(() => {
  const tabs = document.getElementById('tabs');
  const pill = tabs.querySelector('.pill');
  const links = [...tabs.querySelectorAll('a')];
  let active = tabs.querySelector('[aria-current]');
  const heroLink = document.getElementById('heroLink'), heroText = document.getElementById('heroLinkText');
  const route = () => {
    const views = { '#work': 'work', '#about': 'about', '#case-home': 'case-home', '#case-glyphs': 'case-glyphs', '#case-start-ds': 'case-startds', '#case-kite': 'case-kite' }; // '#case-ds' hidden for now
    const v = views[location.hash] || (location.hash && location.hash !== '#' ? 'notfound' : 'about');
    const nf = document.getElementById('view-notfound'); if (nf) nf.hidden = v !== 'notfound';
    document.body.dataset.view = v;
    document.getElementById('view-work').hidden = v !== 'work';
    document.getElementById('view-about').hidden = v !== 'about';
    document.querySelectorAll('.cs').forEach(c => c.hidden = c.id !== 'view-' + v);
    const csH = document.querySelector('#view-' + v + ' h1');
    if (csH) document.querySelector('#csMini .t').textContent = csH.textContent;
    const tab = v === 'about' ? 'about' : 'work';
    links.forEach(a => a.toggleAttribute('aria-current', a.getAttribute('href') === '#' + tab));
    links.forEach(a => a.hasAttribute('aria-current') && a.setAttribute('aria-current', 'page'));
    active = tabs.querySelector('[aria-current]');
    heroLink.href = v === 'work' ? '#about' : '#work';
    heroText.textContent = v === 'work' ? 'About' : 'Work';
    document.title = { work: 'Miro Deiss Portfolio', about: 'Miro Deiss — About', 'case-home': 'Homepage and Search Redesign — Miro Deiss', 'case-glyphs': 'Kite Glyphs — Miro Deiss', 'case-startds': 'START Design System — Miro Deiss', 'case-kite': 'Making Tutu’s Design System Flexible — Miro Deiss', notfound: 'Page not found — Miro Deiss', 'case-ds': 'Kite Design System — Miro Deiss' }[v];
    place(active);
  };
  addEventListener('hashchange', () => { route(); scrollTo({ top: 0, behavior: 'instant' in document.documentElement.style ? 'instant' : 'auto' }); });
  const place = (el) => { pill.style.width = el.offsetWidth + 'px'; pill.style.transform = `translateX(${el.offsetLeft}px)`; };
  const init = () => { pill.style.transition = 'none'; place(active); pill.offsetWidth; pill.style.transition = ''; };
  route();
  addEventListener('resize', init);
  document.fonts ? document.fonts.ready.then(init) : init();
  init();
})();

/* ---------- phone mockups (placeholders; swap for real screenshots) ---------- */
(() => {
  const SHOTS = {
  "home": "assets/img/common/work-home.webp",
  "search": "assets/img/common/work-search.webp",
  "extras": "assets/img/common/work-extras.webp",
  "cmp_new": "assets/img/home/cmp_new.webp",
  "tutu_results": "assets/img/common/tutu-results.webp",
  "tutu_search": "assets/img/common/tutu-search.webp",
  "tutu_web": "assets/img/common/tutu-web.webp",
  "start_web": "assets/img/start/start-web.webp",
  "start_tv": "assets/img/start/start-tv.webp",
  "start_title": "assets/img/start/start-title.webp",
  "start_profile": "assets/img/start/start-profile.webp",
  "glyphs": "assets/img/glyphs/plugin.webp",
  "kite": "assets/img/kite/cover.webp"
};
  const alts = { home: 'Tutu home screen', search: 'Search results', extras: 'Review and add-ons', cmp_new: 'New Tutu home screen', tutu_results: 'Tutu search results with an alternative route', tutu_search: 'Tutu unified search', tutu_web: 'Tutu web home page', start_web: 'START web home page', start_tv: 'START live TV player', start_title: 'START series page', start_profile: 'START profile with tasks', glyphs: 'Kite Glyphs plugin in Figma', kite: 'Two floating cards: a frosted interface screen above a purple token card' };
  document.querySelectorAll('.shot[data-screen]').forEach((el) => {
    const k = el.dataset.screen;
    el.insertAdjacentHTML('afterbegin', `<img class="ph" src="${SHOTS[k]}" alt="${alts[k]}" draggable="false">`);
    const ph = el.querySelector('.ph');
    if (el.tagName !== 'A') return; // static screenshots: no hover motion
    el.addEventListener('pointerenter', () => { ph.style.setProperty('--s', 1.03); setTimeout(() => el.classList.add('live'), 250); });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - .5, ny = (e.clientY - r.top) / r.height - .5;
      ph.style.setProperty('--tx', (nx * 4).toFixed(1) + 'px');
      ph.style.setProperty('--ty', (ny * 3 - 1).toFixed(1) + 'px');
      ph.style.setProperty('--rot', (nx * .6).toFixed(2) + 'deg');
    });
    el.addEventListener('pointerleave', () => {
      el.classList.remove('live');
      ['--tx','--ty','--rot'].forEach(p => ph.style.setProperty(p, p === '--rot' ? '0deg' : '0px'));
      ph.style.setProperty('--s', 1);
    });
  });
})();



/* ---------- search verticals ---------- */
(() => {
  const SH = {
  "v_all": "assets/img/home/v_all.webp",
  "v_avia": "assets/img/home/v_avia.webp",
  "v_bus": "assets/img/home/v_bus.webp",
  "v_train": "assets/img/home/v_train.webp",
  "v_stay": "assets/img/home/v_stay.webp",
  "v_car": "assets/img/home/v_car.webp"
};
  const root = document.getElementById('verts');
  if (!root) return;
  const cards = [...root.querySelectorAll('.vcard')];
  cards.forEach(img => { img.src = SH[img.dataset.v]; img.draggable = false; });
  const n = cards.length;
  const X = [0, .206, .37, .5], S = [1, .78, .58, .45], O = [1, .55, .25, 0];
  let active = 1, paused = false, visible = false, timer = 0;
  const layout = () => {
    const w = root.clientWidth;
    cards.forEach((c, k) => {
      let d = k - active;
      if (d > n / 2) d -= n; if (d < -n / 2) d += n;
      const a = Math.min(Math.abs(d), 3), sgn = Math.sign(d);
      c.style.transform = `translate(-50%, -50%) translateX(${(sgn * X[a] * w).toFixed(1)}px) scale(${S[a]})`;
      c.style.opacity = O[a];
      c.style.zIndex = 10 - a;
      c.setAttribute('aria-hidden', String(a !== 0));
    });
  };
  const go = (k) => { active = (k + n) % n; layout(); };
  const loop = () => { clearTimeout(timer); timer = setTimeout(() => { if (!paused && visible) go(active + 1); loop(); }, 2600); };
  cards.forEach((c, k) => c.addEventListener('click', () => go(k)));
  root.addEventListener('pointerenter', () => paused = true);
  root.addEventListener('pointerleave', () => paused = false);
  root.addEventListener('keydown', e => { if (e.key === 'ArrowRight') go(active + 1); if (e.key === 'ArrowLeft') go(active - 1); });
  let sx = null;
  root.addEventListener('pointerdown', e => { sx = e.clientX; });
  root.addEventListener('pointerup', e => { if (sx !== null && Math.abs(e.clientX - sx) > 40) go(active + (e.clientX < sx ? 1 : -1)); sx = null; });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: .3 }).observe(root);
  new ResizeObserver(layout).observe(root);
  layout();
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) loop();
})();

/* ---------- design system case ---------- */
(() => {
  const RAMPS = {
    aubergine: 'F3F0FF CBBAFE A887FA 986FF7 8A56F4 7D3FF0 7028EB 6618E0 5F17C5 5617AA 4D1590 37105E 1D082F 0F0417',
    orchid: 'FAF0FF F0D1FE E6B3FD E0A5FC DB96FB D688FA D07AF8 CA6CF6 C55FF4 BF51F2 B944F0 AD2AEB 9E19DD 9418CD',
    azure: 'F0FAFF B7E9FF 7ED7FE 62CEFD 46C5FC 2BBCFB 0FB3FA 05A3E7 058FCA 057BAE 056792 033F59 011822 010A0F',
    fuchsia: 'FFF0F5 FFCCDC FFA8C3 FF96B7 FF84AB FF729E FF6092 FF4E86 FF3C79 FF2A6D FF1861 F3004C CF0041 BD003C',
    persimmon: 'FFF5F2 F5D7CB F3B19B F39A7C F47852 F85F30 FD5623 D93508 B7300B 96290D 76230E 4D1A0E 31130D 1B0C09',
    strawberry: 'FFEEE8 FFE4DB FFBBA3 FFA282 FF8B63 FD7344 F05824 D94311 BD3808 AA330B 842708 5F1C05 391103 000000',
    tangerine: 'FFF7F0 FFD9B6 FFBC7D FFAD60 FF9E43 FF8F27 FF800A EC7200 D06400 B35600 964800 5D2D00 231100 0F0700',
    banana: 'FFF8B5 FFF29C FFDD3E FFCF32 FFC725 FFB719 DE7300 C75D00 B54B00 A64500 8E3900 702900 4C1E00 000000',
    lime: 'F6FFD1 F0FFB3 E5FF80 E0FF66 DBFF4D D6FF33 D0FF1A C6F00E ADE300 95C900 7EAE00 537900 2C4300 1A2900',
    halva: 'F5F5F9 E5E5F1 D5D5E6 C5C6DA ABADC7 9496B4 7D82A0 696D8D 555A7A 444967 343954 252A40 181C2D 000000'
  };
  const STEPS = [100, 200, 300, 350, 400, 450, 500, 550, 600, 650, 700, 800, 900, 950];

  // palette grid
  const pal = document.getElementById('pal'), note = document.getElementById('palNote');
  Object.entries(RAMPS).forEach(([name, list]) => list.split(' ').forEach((hex, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.style.background = '#' + hex;
    const label = `${name}-${STEPS[i]} · #${hex}`;
    b.setAttribute('aria-label', label);
    const showIt = () => { note.textContent = label; };
    b.addEventListener('mouseenter', showIt); b.addEventListener('focus', showIt);
    b.addEventListener('click', () => {
      const done = () => { note.textContent = `Copied #${hex}`; setTimeout(showIt, 1200); };
      try { navigator.clipboard.writeText('#' + hex).then(done, showIt); } catch (e) { showIt(); }
    });
    pal.appendChild(b);
  }));

  // work card mosaic
  const grid = document.getElementById('dsGrid');
  const pick = ['aubergine', 'orchid', 'azure', 'fuchsia', 'tangerine', 'banana', 'lime', 'halva'];
  pick.forEach(n => RAMPS[n].split(' ').forEach(hex => { const i = document.createElement('i'); i.style.background = '#' + hex; grid.appendChild(i); }));
  const hero = document.getElementById('dsHero');
  ['aubergine', 'orchid', 'azure', 'fuchsia', 'persimmon', 'tangerine', 'banana', 'lime', 'halva'].forEach(n => RAMPS[n].split(' ').forEach(hex => { const i = document.createElement('i'); i.style.background = '#' + hex; hero.appendChild(i); }));
  const card = grid.closest('.ds-shot');
  card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    grid.style.setProperty('--gx', (((e.clientX - r.left) / r.width - .5) * 12).toFixed(1) + 'px');
    grid.style.setProperty('--gy', (((e.clientY - r.top) / r.height - .5) * 10).toFixed(1) + 'px');
  });
  card.addEventListener('pointerleave', () => { grid.style.setProperty('--gx', '0px'); grid.style.setProperty('--gy', '0px'); });


})();

/* ---------- case boards ---------- */
(() => {
  const mini = document.getElementById('csMini');
  const hdr = document.querySelector('body > header'), toTop = document.getElementById('toTop');
  const onScroll = () => {
    const title = document.querySelector('.cs:not([hidden]) h1');
    const show = !!title && title.getBoundingClientRect().bottom < hdr.offsetHeight;
    mini.classList.toggle('show', show);
    hdr.classList.toggle('compact', show);
    mini.setAttribute('aria-hidden', String(!show));
    mini.querySelector('a').tabIndex = show ? 0 : -1;
    toTop.classList.toggle('show', scrollY > innerHeight * 1.2);
    document.documentElement.style.setProperty('--hdr-h', hdr.offsetHeight + 'px');
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('hashchange', () => setTimeout(onScroll, 50));
  onScroll();
  toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));
  const SH = {
  "spec_web": "assets/img/home/spec-web-2.webp",
  "spec_search": "assets/img/home/spec-search-2.webp",
  "hm_hotels": "assets/img/home/hm_hotels.webp",
  "hm_bus": "assets/img/home/hm_bus.webp",
  "hm_avia": "assets/img/home/hm_avia.webp",
  "search_hm": "assets/img/home/search_hm.webp",
  "au_header": "assets/img/home/au_header.webp",
  "au_promo": "assets/img/home/au_promo.webp",
  "au_verts": "assets/img/home/au_verts.webp",
  "au_tabbar": "assets/img/home/au_tabbar.webp",
  "bench": "assets/img/home/bench.webp"
};
  document.querySelectorAll('.board:not(.cmp) img[data-k]').forEach(img => { img.src = SH[img.dataset.k]; img.draggable = false; });
  document.querySelectorAll('.board.hov').forEach(b => {
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect();
      b.style.setProperty('--mx', ((e.clientX - r.left) / r.width - .5).toFixed(3));
      b.style.setProperty('--my', ((e.clientY - r.top) / r.height - .5).toFixed(3));
      b.style.setProperty('--h', 1);
    });
    b.addEventListener('pointerleave', () => { b.style.setProperty('--mx', 0); b.style.setProperty('--my', 0); b.style.setProperty('--h', 0); });
  });
})();

/* ---------- floating tags ---------- */
window.__pointer = { x: innerWidth / 2, y: innerHeight / 3, t: 0 };
addEventListener('pointermove', (e) => { const p = window.__pointer; p.x = e.clientX; p.y = e.clientY; p.t = performance.now(); }, { passive: true });
(() => {
  const wrap = document.getElementById('stageWrap');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tags = [...wrap.querySelectorAll('.tag')].map((el, i) => ({
    el, x: +el.dataset.x, y: +el.dataset.y, r: +el.dataset.r, d: +el.dataset.d,
    cx: 0, cy: 0, cr: 0, cs: 1, hover: false, phase: i * 1.7
  }));
  tags.forEach(t => {
    t.el.addEventListener('pointerenter', () => t.hover = true);
    t.el.addEventListener('pointerleave', () => t.hover = false);
  });
  const tick = (now) => {
    const p = window.__pointer, r = wrap.getBoundingClientRect();
    const mx = (p.x - (r.left + r.width / 2)) / (innerWidth / 2);
    const my = (p.y - (r.top + r.height / 2)) / (innerHeight / 2);
    const s = now / 1000;
    for (const t of tags) {
      // parallax toward cursor
      let tx = mx * 14 * t.d, ty = my * 10 * t.d;
      // repel when the cursor gets close
      const w = t.el.offsetWidth, h = t.el.offsetHeight;
      const ex = r.left + t.x + w / 2 + t.cx, ey = r.top + t.y + h / 2 + t.cy;
      const dx = ex - p.x, dy = ey - p.y, dist = Math.hypot(dx, dy) || 1;
      if (!t.hover && dist < 110) { const f = (1 - dist / 110) * 26; tx += dx / dist * f; ty += dy / dist * f; }
      // ambient float
      if (!reduce) { tx += Math.sin(s * .9 + t.phase) * 3; ty += Math.cos(s * 1.1 + t.phase) * 4; }
      const tr = t.hover ? 0 : t.r + mx * 4 * t.d + (reduce ? 0 : Math.sin(s * .7 + t.phase) * 1.5);
      const ts = t.hover ? 1.18 : 1;
      t.cx += (tx - t.cx) * .09; t.cy += (ty - t.cy) * .09; t.cr += (tr - t.cr) * .12; t.cs += (ts - t.cs) * .18;
      t.el.style.transform = `translate3d(${(t.x + t.cx).toFixed(2)}px, ${(t.y + t.cy).toFixed(2)}px, 0) rotate(${t.cr.toFixed(2)}deg) scale(${t.cs.toFixed(3)})`;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();

/* ---------- email popover ---------- */
(() => {
  const btn = document.getElementById('mailBtn'), pop = document.getElementById('mailPop'), copy = document.getElementById('mailCopy'), addr = document.getElementById('mailAddr');
  const set = (open) => { pop.hidden = !open; btn.setAttribute('aria-expanded', String(open)); };
  btn.addEventListener('click', (e) => { e.stopPropagation(); set(pop.hidden); });
  document.addEventListener('click', (e) => { if (!pop.hidden && !pop.contains(e.target)) set(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !pop.hidden) { set(false); btn.focus(); } });
  copy.addEventListener('click', () => {
    const ok = () => { copy.textContent = 'Copied'; copy.classList.add('done'); setTimeout(() => { copy.textContent = 'Copy address'; copy.classList.remove('done'); }, 1600); };
    const fallback = () => { const r = document.createRange(); r.selectNodeContents(addr); const s = getSelection(); s.removeAllRanges(); s.addRange(r); };
    try { navigator.clipboard.writeText(addr.textContent).then(ok, fallback); } catch (err) { fallback(); }
  });
})();

/* hero: web / app switch */
(() => {
  const sw = document.querySelector('.hero-sw'); if (!sw) return;
  sw.querySelectorAll('.seg button').forEach(b => b.addEventListener('click', () => {
    sw.dataset.mode = b.dataset.m;
    sw.querySelectorAll('.seg button').forEach(x => x.setAttribute('aria-selected', x === b));
  }));
})();

/* before / after drag compare (hero + search rows) */
(() => {
  const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const sw = document.querySelector('.hero-sw');
  const make = box => {
    const range = box.querySelector('.cmpx-range');
    let touched = false, running = false;
    const set = v => { box.style.setProperty('--p', v + '%'); range.value = v; };
    range.addEventListener('input', () => { touched = true; box.classList.add('touched'); set(+range.value); });
    return () => {
      if (touched || running) return; running = true;
      const keys = [[0, 50], [700, 32], [1500, 68], [2200, 50]];
      const t0 = performance.now();
      const step = now => {
        if (touched) { running = false; return; }
        const t = now - t0; let i = 0;
        while (i < keys.length - 2 && t > keys[i + 1][0]) i++;
        const [ta, va] = keys[i], [tb, vb] = keys[i + 1];
        set(va + (vb - va) * ease(Math.min(1, Math.max(0, (t - ta) / (tb - ta)))));
        if (t < keys[keys.length - 1][0]) requestAnimationFrame(step); else running = false;
      };
      requestAnimationFrame(step);
    };
  };
  const heroBoxes = sw ? [...sw.querySelectorAll('.cmpx')].map(b => ({ b, hint: make(b) })) : [];
  const heroVisible = b => sw.dataset.mode === (b.classList.contains('is-app') ? 'app' : 'web');
  if (sw) {
    let seen = false;
    new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting && !seen) { seen = true; heroBoxes.forEach(h => heroVisible(h.b) && setTimeout(h.hint, 400)); }
    }), { threshold: .5 }).observe(sw);
    sw.querySelectorAll('.seg button').forEach(btn => btn.addEventListener('click', () =>
      setTimeout(() => heroBoxes.forEach(h => heroVisible(h.b) && h.hint()), 350)));
  }
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { io.unobserve(e.target); setTimeout(e.target._hint, 300); }
  }), { threshold: .6 });
  document.querySelectorAll('.cmpx.in-plate').forEach(b => { b._hint = make(b); io.observe(b); });
})();

/* cursor tip "View case" over clickable previews */
(() => {
  const tip = document.createElement('div');
  tip.className = 'cursor-tip'; tip.textContent = 'View case'; tip.setAttribute('aria-hidden', 'true');
  document.body.appendChild(tip);
  let x = 0, y = 0, cx = 0, cy = 0, on = false, raf = 0;
  const loop = () => {
    cx += (x - cx) * .22; cy += (y - cy) * .22;
    tip.style.transform = `translate3d(${cx + 16}px, ${cy + 18}px, 0) rotate(-5deg) scale(${on ? 1 : .6})`;
    raf = (on || Math.abs(x - cx) > .5) ? requestAnimationFrame(loop) : 0;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
  document.addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; if (on) kick(); }, { passive: true });
  document.addEventListener('pointerover', e => {
    if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    const hit = e.target.closest('a.shot');
    if (hit && !on) { tip.textContent = ({ '#case-home': 'View case: Homepage redesign', '#case-glyphs': 'View case: Kite Glyphs', '#case-start-ds': 'View case: START Design System', '#case-kite': 'View case: Flexible design system' })[hit.getAttribute('href')] || 'View case'; on = true; cx = x; cy = y; tip.classList.add('on'); kick(); }
    else if (!hit && on) { on = false; tip.classList.remove('on'); kick(); }
  });
  addEventListener('scroll', () => { if (on && !document.elementFromPoint(x, y)?.closest('a.shot')) { on = false; tip.classList.remove('on'); } }, { passive: true });
})();

/* mobile: start wide boards from the middle */
(() => {
  const center = () => document.querySelectorAll('.wide-fig.pan .shot-plate').forEach(p => {
    if (p.scrollWidth > p.clientWidth + 4 && !p.dataset.c) { p.scrollLeft = (p.scrollWidth - p.clientWidth) / 2; p.dataset.c = 1; }
  });
  document.querySelectorAll('.wide-fig.pan img').forEach(i => i.complete ? center() : i.addEventListener('load', center));
  addEventListener('hashchange', () => setTimeout(center, 50));
  addEventListener('resize', center);
  setTimeout(center, 300);
})();

/* skeletons, image errors and avatar fallback */
(() => {
  const SEL = '.board img, .shot-plate img, .gal-card img, .shot img, .cmpx img';
  const box = img => img.closest('.board, .shot-plate, .gal-card, .shot, .cmpx') || img.parentElement;
  const done = img => { const b = box(img); b.classList.remove('sk'); img.classList.add('in'); };
  const fail = img => {
    const b = box(img); b.classList.remove('sk'); b.classList.add('img-err');
    if (b.querySelector('.err-msg')) return;
    const m = document.createElement('div'); m.className = 'err-msg';
    m.innerHTML = '<span>Image didn’t load</span><button type="button">Try again</button>';
    m.querySelector('button').addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      b.classList.remove('img-err'); b.classList.add('sk'); m.remove();
      const src = img.getAttribute('src'); img.src = ''; img.src = src.split('#')[0] + (src.includes('?') ? '&' : '?') + 'r=' + Date.now();
    });
    b.appendChild(m);
  };
  const watch = img => {
    if (img.dataset.skw) return; img.dataset.skw = 1;
    img.addEventListener('load', () => done(img)); img.addEventListener('error', () => fail(img));
    if (img.complete && img.getAttribute('src')) { img.naturalWidth ? done(img) : fail(img); }
    else box(img).classList.add('sk');
  };
  const scan = () => document.querySelectorAll(SEL).forEach(watch);
  scan(); setTimeout(scan, 0); addEventListener('hashchange', () => setTimeout(scan, 0));
  new MutationObserver(scan).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['src'] });

  // avatar: show a still picture if the 3D model can't load
  const stage = document.getElementById('stage'), ava = document.getElementById('meAva');
  const fallback = () => {
    if (!stage || stage.classList.contains('ready') || stage.classList.contains('fallback')) return;
    stage.classList.add('fallback');
    stage.insertAdjacentHTML('beforeend', '<img class="ava-still" src="favicon-512.png" alt="Miro Deiss avatar">');
    if (ava && !ava.querySelector('canvas')) ava.insertAdjacentHTML('beforeend', '<img class="ava-still" src="favicon-512.png" alt="">');
  };
  setTimeout(fallback, 9000);
  addEventListener('avatar-failed', fallback);
})();

/* image viewer: click a case image to look at it in detail */
(() => {
  const SEL = '.cs .board img, .cs .shot-plate img, .cs .gal-card img, .cs .fig img, .cs .pair img, .cs .ba2 img';
  const ok = img => img.closest('.cs') && !img.closest('.cmpx') && !img.closest('.hero-sw') && !img.closest('.roles-plate');
  const v = document.createElement('div');
  v.className = 'zv'; v.hidden = true; v.setAttribute('role', 'dialog'); v.setAttribute('aria-modal', 'true'); v.setAttribute('aria-label', 'Image viewer');
  v.innerHTML = '<div class="zv-card" tabindex="-1"><div class="zv-media"><div class="zv-stage"><img class="zv-img" alt=""></div>' +
    '<button class="zv-btn zv-prev" type="button" aria-label="Previous image"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 6l-6 6 6 6"/></svg></button>' +
    '<button class="zv-btn zv-next" type="button" aria-label="Next image"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 6l6 6-6 6"/></svg></button></div>' +
    '<button class="zv-btn zv-close" type="button" aria-label="Close">✕</button>' +
    '<div class="zv-bar"><span class="zv-cap"></span><span class="zv-n"></span><span class="zv-hint">Click to zoom</span></div></div>';
  document.body.appendChild(v);
  const stage = v.querySelector('.zv-stage'), big = v.querySelector('.zv-img');
  let list = [], i = 0, zoom = false, last = null;
  const caption = img => { const f = img.closest('figure'); const c = f && f.querySelector('figcaption'); return (c ? c.textContent : img.alt || '').trim(); };
  const show = k => {
    i = (k + list.length) % list.length; const src = list[i];
    setZoom(false); big.src = src.currentSrc || src.src; big.alt = src.alt || '';
    v.querySelector('.zv-cap').textContent = caption(src);
    v.querySelector('.zv-n').textContent = list.length > 1 ? `${i + 1} / ${list.length}` : '';
    v.classList.toggle('single', list.length < 2);
  };
  const setZoom = (z, e) => {
    const can = big.naturalWidth > stage.clientWidth || big.naturalHeight > stage.clientHeight;
    zoom = z && can; v.classList.toggle('zoomed', zoom); v.classList.toggle('nozoom', !can);
    if (zoom && e) { const r = big.getBoundingClientRect(); const fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
      requestAnimationFrame(() => { stage.scrollLeft = fx * stage.scrollWidth - stage.clientWidth / 2; stage.scrollTop = fy * stage.scrollHeight - stage.clientHeight / 2; }); }
  };
  const open = img => {
    const view = img.closest('.cs'); list = [...view.querySelectorAll(SEL)].filter(ok);
    last = document.activeElement; v.hidden = false; document.documentElement.classList.add('zv-lock');
    show(list.indexOf(img)); v.querySelector('.zv-card').focus({ preventScroll: true });
  };
  const close = () => { v.hidden = true; setZoom(false); document.documentElement.classList.remove('zv-lock'); last && last.focus && last.focus(); };
  big.addEventListener('load', () => v.classList.toggle('nozoom', !(big.naturalWidth > stage.clientWidth || big.naturalHeight > stage.clientHeight)));
  document.addEventListener('click', e => {
    const img = e.target.closest && e.target.closest('img');
    if (!img || !v.hidden || !img.matches(SEL) || !ok(img) || img.closest('.img-err')) return;
    e.preventDefault(); open(img);
  });
  // drag to pan when zoomed
  let drag = null, moved = false;
  stage.addEventListener('pointerdown', e => { if (!zoom || e.pointerType !== 'mouse') return; drag = { x: e.clientX, y: e.clientY, l: stage.scrollLeft, t: stage.scrollTop }; moved = false; stage.setPointerCapture(e.pointerId); });
  stage.addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (Math.abs(dx) + Math.abs(dy) > 4) moved = true; stage.scrollLeft = drag.l - dx; stage.scrollTop = drag.t - dy; });
  stage.addEventListener('pointerup', () => { drag = null; });
  stage.addEventListener('click', e => {
    if (moved) { moved = false; return; }
    if (e.target === big) setZoom(!zoom, e);
  });
  v.querySelector('.zv-close').addEventListener('click', close);
  v.addEventListener('click', e => { if (e.target === v) close(); });
  v.querySelector('.zv-prev').addEventListener('click', () => show(i - 1));
  v.querySelector('.zv-next').addEventListener('click', () => show(i + 1));
  addEventListener('keydown', e => {
    if (v.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft' && list.length > 1) show(i - 1);
    else if (e.key === 'ArrowRight' && list.length > 1) show(i + 1);
  });
  addEventListener('hashchange', () => { if (!v.hidden) close(); });
})();

/* START DS: Figma-like variable modes */
(() => {
  const fx = document.querySelector('.fx'); if (!fx) return;
  const frames = fx.querySelectorAll('.fx-frame'), name = fx.querySelector('.fx-sel-name');
  const MODES = { title: 'brand', profile: 'theme' };
  const state = { title: '1', profile: 'dark' };
  const paint = () => {
    const sel = fx.dataset.sel, col = MODES[sel];
    frames.forEach(f => { f.classList.toggle('sel', f.dataset.frame === sel); f.dataset.mode = state[f.dataset.frame]; });
    name.textContent = sel === 'title' ? 'Title' : 'Profile';
    fx.querySelectorAll('.fx-row').forEach(r => {
      const on = r.dataset.col === col; r.classList.toggle('off', !on);
      r.querySelectorAll('button').forEach(b => { b.disabled = !on; b.setAttribute('aria-checked', on && b.dataset.v === state[sel]); });
    });
  };
  const select = f => { fx.dataset.sel = f; paint(); };
  frames.forEach(f => {
    f.addEventListener('click', () => { fx.classList.add('touched'); select(f.dataset.frame); });
    f.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(f.dataset.frame); } });
  });
  fx.querySelectorAll('.fx-row button').forEach(b => b.addEventListener('click', () => { fx.classList.add('touched'); state[fx.dataset.sel] = b.dataset.v; paint(); }));
  paint();
  // demo once in view: flip brand, then select profile and flip theme
  let done = false;
  const step = (t, fn) => setTimeout(() => { if (!fx.classList.contains('touched')) fn(); }, t);
  new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting || done) return; done = true;
    step(1200, () => { state.title = '2'; paint(); });
    step(2600, () => { state.title = '1'; paint(); });
    step(3600, () => select('profile'));
    step(4600, () => { state.profile = 'light'; paint(); });
    step(6000, () => { state.profile = 'dark'; paint(); });
    step(7000, () => select('title'));
  }), { threshold: .5 }).observe(fx);
})();

/* drafts: visible in previews, hidden on the live site */
(() => { if (/(^|\.)mirodeiss\.com$/.test(location.hostname)) document.querySelectorAll('[data-draft]').forEach(e => e.remove()); })();

/* Kite: sync the Figma mode panel with the screen recording */
(() => {
  document.querySelectorAll('.theme-demo').forEach(fig => {
    const scr = fig.querySelector('.td-screen'), ctrl = fig.querySelector('.td-ctrl');
    if (!scr || !ctrl) return;
    const SW = [[1.5, 'light'], [3.35, 'dark'], [5.7, 'light'], [7.85, 'dark']];
    const SEG = { dark: [0.0, 1.15], light: [1.6, 2.65] }, LEAD = 0.95;
    const RATE = 0.85; scr.defaultPlaybackRate = scr.playbackRate = RATE;
    scr.addEventListener('play', () => { scr.playbackRate = RATE; });
    let fired = new Set(), last = 0, stopAt = null;
    const play = mode => { const [a, b] = SEG[mode]; stopAt = b; ctrl.currentTime = a; ctrl.playbackRate = RATE; ctrl.play().catch(() => {}); };
    ctrl.addEventListener('timeupdate', () => { if (stopAt != null && ctrl.currentTime >= stopAt) { ctrl.pause(); stopAt = null; } });
    ctrl.addEventListener('loadedmetadata', () => { ctrl.currentTime = 1.0; });
    scr.addEventListener('timeupdate', () => {
      const t = scr.currentTime;
      if (t < last - 1) fired = new Set();
      last = t;
      SW.forEach(([ts, mode], i) => { if (!fired.has(i) && t >= ts - LEAD) { fired.add(i); play(mode); } });
    });
  });
})();

// Kite: plates cycle like a gif, with a fake Figma "Variable modes" panel
document.querySelectorAll('.roles-sw').forEach(fig => {
  const imgs = [...fig.querySelectorAll('.roles-plate img')];
  const vm = fig.querySelector('.vm');
  const parse = img => (img.dataset.modes || '').split(';').filter(Boolean).map(x => x.split('='));
  const vals = [];
  if (vm) {
    vm.innerHTML = '<div class="vm-h">Variable modes<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="2" y="2" width="5" height="12" rx="2.5"/><path d="M7 5.5l3-3a2.1 2.1 0 013 3l-6 6"/><circle cx="4.5" cy="11.5" r=".6" fill="currentColor"/></svg></div>' +
      parse(imgs[0]).map(([k]) => '<div class="vm-r"><span>' + k + '</span><div class="vm-v"><b></b><i></i></div></div>').join('');
    vm.querySelectorAll('.vm-v b').forEach(b => vals.push(b));
  }
  let cur = 0;
  const paint = (flash) => parse(imgs[cur]).forEach(([, v], k) => {
    const b = vals[k]; if (!b) return;
    if (b.textContent !== v) { b.textContent = v; if (flash) { const box = b.parentNode; box.classList.add('hit'); setTimeout(() => box.classList.remove('hit'), 700); } }
  });
  paint(false);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  setInterval(() => {
    if (document.hidden) return;
    const r = fig.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
    imgs[cur].classList.remove('on'); cur = (cur + 1) % imgs.length; imgs[cur].classList.add('on');
    paint(true);
    imgs[(cur + 1) % imgs.length].loading = 'eager';
  }, 1800);
});

// Kite hero: cycle modes like Figma variable modes
document.querySelectorAll('.kite-hero').forEach(h => {
  const modes = ['Light', 'Dark', 'White label'];
  const pill = h.querySelector('.kh-pill');
  let i = 0;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  setInterval(() => {
    if (document.hidden) return;
    const r = h.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
    i = (i + 1) % modes.length;
    const old = pill.querySelector('.kh-t:not(.out)');
    const nu = document.createElement('span'); nu.className = 'kh-t in'; nu.textContent = modes[i];
    pill.appendChild(nu);
    h.dataset.mode = i;
    requestAnimationFrame(() => requestAnimationFrame(() => { nu.classList.remove('in'); old.classList.add('out'); }));
    setTimeout(() => old.remove(), 600);
  }, 1800);
});
