/**
 * Презентация ГЛАВНЫЙ к защите: слайды и шаги-«биты», два режима (презентация / обзор),
 * карта переходов, секундомер, печать в PDF. Без зависимостей и без сети.
 *
 * Страница открывается обзором (прокрутка); кнопка «Презентация» в шапке включает показ, Esc — выходит из него.
 * Клавиши: → Space PageDown — дальше; ← PageUp — назад; 1–9 — слайд по номеру; Home / End;
 * M — карта; T — секундомер; E — презентация ↔ обзор; Esc — закрыть. Анимации включены всегда (?still — выключить).
 * Адрес помнит позицию: #bpmn.2 — слайд «Процесс», третий шаг. ?present / ?explore — режим, ?export — без кнопок.
 */
(() => {
  'use strict'

  /** map — какое состояние рисунка (0…3) показывает каждый шаг; слайд впереди стоит в состоянии 0, поэтому при входе анимация проигрывается. */
  const SLIDES = [
    { id: 'title', title: 'ГЛАВНЫЙ — платформа управления качеством', short: 'Титул', stage: 0, bits: 1 },
    { id: 'goal', title: 'Что в космосе ГЛАВНОЕ?', short: 'Главное', stage: 0, bits: 1 },
    { id: 'arch', title: '12 архитектурных решений роста сложности', short: 'Архитектура', stage: 1, bits: 1 },
    { id: 'bpmn', title: 'Процесс в BPMN: вся схема, инцидент, подпроцесс «Брак»', short: 'Процесс', stage: 2, bits: 3, bitNames: ['вид сверху', 'инцидент на ЗТ-3', 'подпроцесс «Брак»'] },
    { id: 'late', title: 'Инцидент в работе: изолятор и перепроверка', short: 'Контроль', stage: 2, bits: 1, map: [1] },
    { id: 'scope', title: 'Область риска: сколько изделий под подозрением', short: 'Область риска', stage: 2, bits: 1 },
    { id: 'demo', title: 'Демонстрация: гифка и живой стенд', short: 'Показ', stage: 3, bits: 1 },
    { id: 'value', title: 'Итог: не пропустить опасное, не держать лишнее, не повторить ошибку', short: 'Итог', stage: 0, bits: 1 },
    { id: 'final', title: 'Спасибо за внимание к ГЛАВНОМУ · КБ «Поехали»', short: 'Финал', stage: 0, bits: 1 },
  ]
  const QR = 'M0 0h7v1h-7zM8 0h1v1h-1zM12 0h1v1h-1zM15 0h4v1h-4zM22 0h7v1h-7zM0 1h1v1h-1zM6 1h1v1h-1zM9 1h1v1h-1zM13 1h2v1h-2zM16 1h2v1h-2zM20 1h1v1h-1zM22 1h1v1h-1zM28 1h1v1h-1zM0 2h1v1h-1zM2 2h3v1h-3zM6 2h1v1h-1zM8 2h1v1h-1zM10 2h2v1h-2zM14 2h4v1h-4zM19 2h2v1h-2zM22 2h1v1h-1zM24 2h3v1h-3zM28 2h1v1h-1zM0 3h1v1h-1zM2 3h3v1h-3zM6 3h1v1h-1zM9 3h1v1h-1zM11 3h1v1h-1zM14 3h1v1h-1zM17 3h3v1h-3zM22 3h1v1h-1zM24 3h3v1h-3zM28 3h1v1h-1zM0 4h1v1h-1zM2 4h3v1h-3zM6 4h1v1h-1zM9 4h1v1h-1zM11 4h5v1h-5zM17 4h1v1h-1zM22 4h1v1h-1zM24 4h3v1h-3zM28 4h1v1h-1zM0 5h1v1h-1zM6 5h1v1h-1zM8 5h2v1h-2zM11 5h1v1h-1zM15 5h1v1h-1zM17 5h1v1h-1zM20 5h1v1h-1zM22 5h1v1h-1zM28 5h1v1h-1zM0 6h7v1h-7zM8 6h1v1h-1zM10 6h1v1h-1zM12 6h1v1h-1zM14 6h1v1h-1zM16 6h1v1h-1zM18 6h1v1h-1zM20 6h1v1h-1zM22 6h7v1h-7zM9 7h2v1h-2zM14 7h3v1h-3zM18 7h1v1h-1zM20 7h1v1h-1zM0 8h1v1h-1zM2 8h1v1h-1zM6 8h2v1h-2zM10 8h2v1h-2zM13 8h2v1h-2zM18 8h1v1h-1zM20 8h1v1h-1zM23 8h1v1h-1zM26 8h1v1h-1zM28 8h1v1h-1zM0 9h3v1h-3zM4 9h2v1h-2zM8 9h2v1h-2zM11 9h4v1h-4zM17 9h1v1h-1zM19 9h2v1h-2zM22 9h1v1h-1zM27 9h2v1h-2zM0 10h1v1h-1zM2 10h2v1h-2zM5 10h2v1h-2zM9 10h2v1h-2zM12 10h1v1h-1zM15 10h1v1h-1zM19 10h1v1h-1zM23 10h1v1h-1zM25 10h2v1h-2zM28 10h1v1h-1zM2 11h2v1h-2zM5 11h1v1h-1zM7 11h2v1h-2zM10 11h1v1h-1zM12 11h2v1h-2zM19 11h2v1h-2zM22 11h4v1h-4zM0 12h1v1h-1zM2 12h1v1h-1zM4 12h4v1h-4zM11 12h1v1h-1zM13 12h1v1h-1zM15 12h2v1h-2zM20 12h1v1h-1zM22 12h2v1h-2zM28 12h1v1h-1zM0 13h1v1h-1zM2 13h2v1h-2zM5 13h1v1h-1zM7 13h4v1h-4zM12 13h1v1h-1zM16 13h1v1h-1zM18 13h3v1h-3zM22 13h2v1h-2zM27 13h2v1h-2zM0 14h1v1h-1zM2 14h1v1h-1zM4 14h1v1h-1zM6 14h2v1h-2zM9 14h3v1h-3zM13 14h2v1h-2zM16 14h1v1h-1zM19 14h4v1h-4zM24 14h1v1h-1zM28 14h1v1h-1zM1 15h3v1h-3zM5 15h1v1h-1zM14 15h3v1h-3zM18 15h5v1h-5zM24 15h1v1h-1zM1 16h1v1h-1zM6 16h1v1h-1zM9 16h2v1h-2zM13 16h2v1h-2zM20 16h1v1h-1zM22 16h2v1h-2zM28 16h1v1h-1zM2 17h1v1h-1zM7 17h4v1h-4zM12 17h3v1h-3zM17 17h1v1h-1zM19 17h2v1h-2zM22 17h2v1h-2zM26 17h3v1h-3zM0 18h4v1h-4zM6 18h2v1h-2zM10 18h1v1h-1zM15 18h1v1h-1zM19 18h1v1h-1zM24 18h2v1h-2zM28 18h1v1h-1zM3 19h1v1h-1zM5 19h1v1h-1zM9 19h2v1h-2zM13 19h1v1h-1zM18 19h1v1h-1zM20 19h3v1h-3zM0 20h5v1h-5zM6 20h1v1h-1zM10 20h1v1h-1zM13 20h1v1h-1zM15 20h2v1h-2zM19 20h7v1h-7zM27 20h1v1h-1zM8 21h2v1h-2zM12 21h1v1h-1zM16 21h1v1h-1zM18 21h1v1h-1zM20 21h1v1h-1zM24 21h3v1h-3zM28 21h1v1h-1zM0 22h7v1h-7zM8 22h1v1h-1zM10 22h5v1h-5zM16 22h1v1h-1zM18 22h1v1h-1zM20 22h1v1h-1zM22 22h1v1h-1zM24 22h1v1h-1zM28 22h1v1h-1zM0 23h1v1h-1zM6 23h1v1h-1zM9 23h1v1h-1zM14 23h3v1h-3zM19 23h2v1h-2zM24 23h1v1h-1zM28 23h1v1h-1zM0 24h1v1h-1zM2 24h3v1h-3zM6 24h1v1h-1zM9 24h1v1h-1zM11 24h4v1h-4zM16 24h1v1h-1zM19 24h7v1h-7zM0 25h1v1h-1zM2 25h3v1h-3zM6 25h1v1h-1zM10 25h5v1h-5zM17 25h1v1h-1zM21 25h1v1h-1zM24 25h4v1h-4zM0 26h1v1h-1zM2 26h3v1h-3zM6 26h1v1h-1zM8 26h3v1h-3zM12 26h2v1h-2zM15 26h3v1h-3zM19 26h3v1h-3zM24 26h1v1h-1zM27 26h2v1h-2zM0 27h1v1h-1zM6 27h1v1h-1zM9 27h4v1h-4zM14 27h1v1h-1zM16 27h1v1h-1zM19 27h5v1h-5zM25 27h1v1h-1zM0 28h7v1h-7zM8 28h1v1h-1zM14 28h3v1h-3zM20 28h1v1h-1zM25 28h1v1h-1zM28 28h1v1h-1z'

  const $ = (id) => document.getElementById(id)
  const root = document.documentElement
  const q = location.search
  try { localStorage.removeItem('glavny-deck') } catch { /* хранилище недоступно */ } // раньше здесь запоминалось «без анимаций»
  const fromHash = (() => {
    const [id, b] = location.hash.replace('#', '').split('.')
    const i = SLIDES.findIndex((s) => s.id === id)
    return i >= 0 ? { slide: i, bit: Math.min(Number(b) || 0, SLIDES[i].bits - 1) } : null
  })()
  const deck = {
    slide: fromHash ? fromHash.slide : 0,
    bit: fromHash ? fromHash.bit : 0,
    mode: q.includes('present') ? 'present' : 'explore',
    fs: false,
    motion: !q.includes('still'), // анимации включены всегда; выключить можно только адресом ?still
    export: q.includes('export'),
    printing: false,
    map: false,
    clock: false,
    t0: 0,
  }
  const TOTAL = SLIDES.reduce((n, s) => n + s.bits, 0)
  const full = () => deck.mode === 'explore' || deck.printing

  /* ───────── построение рисунков ───────── */

  /** Лента: детали идут слева направо через сварку и контроль к сборке. A — контроля после сварки нет, B — есть. */
  function conveyor(el) {
    const y = Number(el.dataset.y), yd = Number(el.dataset.yd), yu = Number(el.dataset.yu), mode = el.dataset.mode, mini = el.dataset.mini === '1'
    const T = 16, N = 8, BAD = 3, per = T / N
    const sparkDelay = ((((330 + 80) / 1760) * T) % per) - per
    const badDelay = -BAD * per
    let s = ''
    s += `<line class="rail" x1="0" x2="1600" y1="${y - 58}" y2="${y - 58}"/><line class="rail" x1="0" x2="1600" y1="${y + 58}" y2="${y + 58}"/>`
    s += `<line class="belt" x1="0" x2="1600" y1="${y}" y2="${y}"/>`
    // станции
    s += `<rect class="st-box" x="292" y="${y - 84}" width="76" height="168" rx="16"/>`
    if (mode === 'B') {
      s += `<path class="divline flow" d="M800 ${y} C 860 ${y}, 900 ${yd}, 960 ${yd}"/>`
      s += `<rect class="iso" x="${960 - 62}" y="${yd - (mini ? 38 : 50)}" width="124" height="${mini ? 76 : 100}" rx="18"/>`
      s += `<path class="holdline flow" d="M1020 ${y} C 1080 ${y}, 1090 ${yu}, 1150 ${yu}"/>`
      s += `<rect class="holdz" x="${1150 - 62}" y="${yu - (mini ? 38 : 50)}" width="124" height="${mini ? 76 : 100}" rx="18"/>`
    }
    s += `<circle class="asm" cx="1330" cy="${y}" r="80"/>`
    // детали
    for (let i = 0; i < N; i++) {
      const bad = i === BAD, hold = mode === 'B' && i === BAD + 1
      const frac = (i / N + 0.03) % 1
      const sx = -80 + 1760 * frac
      const sc = sx < 342 ? 'transparent' : bad ? '#fb7185' : hold ? '#fbbf24' : mode === 'B' && sx > 800 ? '#34d399' : '#7dd3fc'
      const d = `animation-delay:${(-i * per).toFixed(2)}s`
      s += `<g class="it ${bad ? 'bad' : hold ? 'hold' : 'ok'} m${mode}" style="--y:${y}px;--yd:${yd}px;--yu:${yu}px;--sx:${sx.toFixed(0)}px;${d}">`
      s += `<g class="seam" style="--sc:${sc};${d}"><use href="#fl" x="-36" y="-36" width="72" height="72"/>`
      if (bad) s += `<circle class="burn" cx="9.7" cy="-9.7" r="4.6" style="${d}"/>`
      s += '</g></g>'
    }
    // поверх деталей: вспышка сварки, луч контроля
    s += `<g transform="translate(330 ${y})"><circle class="spark" r="52" style="animation-delay:${sparkDelay.toFixed(3)}s;transform-box:fill-box;transform-origin:center"/></g>`
    if (mode === 'B') {
      s += `<g transform="translate(800 ${y})"><rect class="post" x="-9" y="-92" width="18" height="18" rx="4"/><rect class="post" x="-9" y="74" width="18" height="18" rx="4"/><line class="beam" y1="-74" y2="74"/><circle class="ping" r="46"/></g>`
    } else {
      s += `<g class="ghostgate" transform="translate(800 ${y})"><rect class="post" x="-9" y="-92" width="18" height="18" rx="4"/><rect class="post" x="-9" y="74" width="18" height="18" rx="4"/><line y1="-74" y2="74"/></g>`
      s += `<g class="late" style="animation-delay:${badDelay.toFixed(2)}s"><circle cx="1330" cy="${y}" r="80"/><text x="1330" y="${y - 104}">дефект дошёл до сборки</text></g>`
    }
    if (!mini) {
      s += `<text class="st-lbl" x="330" y="${y + 128}">СВАРКА</text><text class="st-sub" x="330" y="${y + 152}">критичная операция</text>`
      s += `<text class="st-lbl" x="800" y="${y + 128}" ${mode === 'B' ? 'fill="#22d3ee" style="fill:#22d3ee"' : 'style="fill:#475569"'}>КОНТРОЛЬ</text>`
      s += `<text class="st-sub" x="800" y="${y + 152}">${mode === 'B' ? 'сразу после операции' : 'после сварки его нет'}</text>`
      s += `<text class="st-lbl" x="1330" y="${y + 128}">СБОРКА</text><text class="st-sub" x="1330" y="${y + 152}">финал маршрута</text>`
      if (mode === 'B') {
        s += `<text class="st-lbl" x="1040" y="${yd - 4}" style="text-anchor:start;fill:#fb7185">ИЗОЛЯТОР</text><text class="st-sub" x="1040" y="${yd + 20}" style="text-anchor:start">дефект не ушёл дальше</text>`
        s += `<text class="st-lbl" x="1230" y="${yu - 4}" style="text-anchor:start;fill:#fbbf24">ПРИДЕРЖАНО</text><text class="st-sub" x="1230" y="${yu + 20}" style="text-anchor:start">перепроверка: камера и рентген</text>`
      }
    }
    el.innerHTML = s
  }

  const BUILD = { conveyor }
  document.querySelectorAll('[data-build]').forEach((el) => BUILD[el.dataset.build](el))
  $('qr').setAttribute('d', QR)

  /* ───────── состояние → экран ───────── */

  function bitOf(i) {
    const s = SLIDES[i]
    if (full() || i < deck.slide) return s.bits - 1
    return i > deck.slide ? 0 : deck.bit
  }
  /** Состояние рисунка слайда: у слайда впереди — исходное (0), у текущего и пройденных — по карте шага. */
  function visOf(i) {
    const s = SLIDES[i]
    if (!full() && i > deck.slide) return 0
    const b = bitOf(i)
    return s.map ? s.map[b] : b
  }
  /** Состояние рисунка b — на сам слайд: классы ge/at и видимость элементов шага. */
  function paint(el, b) {
    for (let k = 0; k < 4; k++) { el.classList.toggle('ge' + k, b >= k); el.classList.toggle('at' + k, b === k) }
    el.querySelectorAll('[data-on]').forEach((n) => {
      const on = Number(n.dataset.on), until = n.dataset.until == null ? 99 : Number(n.dataset.until)
      n.classList.toggle('off', b < on || b > until)
      if (n.dataset.dim != null) n.classList.toggle('dim', b > Number(n.dataset.dim))
    })
  }
  function apply() {
    SLIDES.forEach((s, i) => {
      const el = document.querySelector(`#${s.id}:not(.pclone)`)
      el.classList.toggle('active', i === deck.slide)
      paint(el, visOf(i))
    })
    const step = SLIDES.slice(0, deck.slide).reduce((n, s) => n + s.bits, 0) + deck.bit + 1
    $('counter').textContent = `${step} / ${TOTAL}`
    const s = SLIDES[deck.slide]
    if (!deck.printing) history.replaceState(null, '', `${location.pathname}${location.search}#${s.id}${deck.bit ? '.' + deck.bit : ''}`)
    $('map').classList.toggle('open', deck.map)
    if (deck.map) drawMap()
  }
  function chrome() {
    root.classList.toggle('present', deck.mode === 'present')
    root.classList.toggle('explore', deck.mode === 'explore')
    root.classList.toggle('still', !deck.motion)
    root.classList.toggle('export', deck.export)
    if (deck.mode === 'explore') expand(); else if (!deck.printing) collapse()
    fit()
  }
  function fit() {
    const w = window.innerWidth, h = window.innerHeight
    const k = deck.mode === 'explore' && w < h ? w / 1600 : Math.min(w / 1600, h / 900)
    root.style.setProperty('--k', k.toFixed(4))
    document.querySelectorAll('.slide').forEach((el) => { el.style.height = deck.mode === 'explore' && w < h ? `${Math.ceil(900 * k) + 16}px` : '' })
  }
  /** Экран шага в обзоре: последний шаг слайда — сам слайд, ранние шаги — его копии. */
  function screenOf(slide, bit) {
    const s = SLIDES[slide]
    return (bit < s.bits - 1 && document.querySelector(`#${s.id}.pclone[data-bit="${bit}"]`)) || document.querySelector(`#${s.id}:not(.pclone)`)
  }
  function scrollToSlide(instant) {
    if (deck.mode !== 'explore') { window.scrollTo(0, 0); return }
    const el = screenOf(deck.slide, deck.bit)
    if (el) el.scrollIntoView({ behavior: instant || !deck.motion ? 'auto' : 'smooth', block: 'start' })
  }

  function goTo(slide, bit = 0, instant = false) {
    deck.slide = Math.max(0, Math.min(SLIDES.length - 1, slide))
    deck.bit = Math.max(0, Math.min(SLIDES[deck.slide].bits - 1, bit))
    deck.map = false
    apply()
    requestAnimationFrame(() => scrollToSlide(instant))
  }
  /** Дальше и назад — всегда на один шаг, и в показе, и в обзоре: ни один шаг слайда не пропускается. */
  function next() {
    if (!deck.t0) { deck.t0 = Date.now() }
    if (deck.bit < SLIDES[deck.slide].bits - 1) { if (deck.mode === 'explore') goTo(deck.slide, deck.bit + 1); else { deck.bit++; apply() } } else if (deck.slide < SLIDES.length - 1) goTo(deck.slide + 1, 0)
  }
  function prev() {
    if (deck.bit > 0) { if (deck.mode === 'explore') goTo(deck.slide, deck.bit - 1); else { deck.bit--; apply() } } else if (deck.slide > 0) goTo(deck.slide - 1, SLIDES[deck.slide - 1].bits - 1)
  }
  function setMode(m) { deck.mode = m; chrome(); apply(); requestAnimationFrame(() => scrollToSlide(true)) }
  /** Показ: во весь экран, с текущего шага. Выход — Esc или кнопка. */
  function enterPresent() {
    setMode('present')
    if (root.requestFullscreen) root.requestFullscreen().catch(() => { /* браузер не дал — показ идёт в окне */ })
  }
  function exitPresent() {
    if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => { /* уже вышли */ })
    setMode('explore')
  }
  document.addEventListener('fullscreenchange', () => {
    const on = !!document.fullscreenElement
    if (!on && deck.fs && deck.mode === 'present') setMode('explore') // Esc во весь экран забирает браузер — выходим из показа вслед за ним
    deck.fs = on
  })

  function drawMap() {
    const rows = SLIDES.map((s, i) => {
      const pills = s.bitNames ? `<span class="pills">${s.bitNames.map((b, j) => `<button class="pill" data-go="${i}.${j}">${j + 1} · ${b}</button>`).join('')}</span>` : ''
      return `<div class="row${i === deck.slide ? ' cur' : ''}" data-go="${i}.0"><span class="k">${i + 1}</span><span><span class="tt">${s.title}</span>${pills}</span></div>`
    }).join('')
    $('map').firstElementChild.innerHTML = `<div class="top"><span class="cap">Карта слайдов</span><button class="btn sm" data-act="map">закрыть · Esc</button></div><div class="grid">${rows}</div>`
      + '<div class="keys"><kbd>→</kbd> <kbd>Space</kbd> дальше · <kbd>←</kbd> назад · <kbd>1–9</kbd> слайд · <kbd>M</kbd> карта · <kbd>T</kbd> секундомер · <kbd>E</kbd> показ / обзор · <kbd>Esc</kbd> выйти из показа</div>'
  }

  /** В обзоре (прокрутка, телефон) и в PDF каждый шаг — отдельный экран: ранние шаги слайда — его копии. */
  function expand() {
    if (document.querySelector('.pclone')) return
    SLIDES.forEach((s) => {
      const src = document.querySelector(`#${s.id}:not(.pclone)`)
      for (let b = 0; b < s.bits - 1; b++) {
        const c = src.cloneNode(true)
        c.classList.add('pclone'); c.classList.remove('active')
        c.dataset.bit = String(b)
        src.parentNode.insertBefore(c, src)
        paint(c, s.map ? s.map[b] : b)
        obs.observe(c)
      }
    })
  }
  function collapse() { document.querySelectorAll('.pclone').forEach((n) => n.remove()) }

  /** PDF — печатью браузера: страница 1600 × 900 на каждый шаг. */
  function printOn() {
    if (deck.printing) return
    deck.printing = true; root.classList.add('printing'); apply(); expand()
  }
  function printOff() {
    deck.printing = false; root.classList.remove('printing')
    if (deck.mode !== 'explore') collapse()
    apply()
  }
  function toPdf() { printOn(); window.print() }
  window.addEventListener('beforeprint', printOn)
  window.addEventListener('afterprint', printOff)

  /* ───────── управление ───────── */

  const ACT = {
    next, prev, pdf: toPdf, present: enterPresent, leave: exitPresent,
    map: () => { deck.map = !deck.map; apply() },
    restart: () => { deck.t0 = 0; goTo(0) },
  }
  document.addEventListener('click', (e) => {
    const t = e.target instanceof Element ? e.target : null
    if (!t) return
    const go = t.closest('[data-go]')
    if (go) { const [i, b] = go.dataset.go.split('.').map(Number); e.stopPropagation(); return goTo(i, b) }
    const a = t.closest('[data-act]')
    if (a && ACT[a.dataset.act]) return ACT[a.dataset.act]()
    if (t === $('map')) { deck.map = false; apply() }
  })
  $('home').addEventListener('click', () => goTo(0))

  const has = (e, ...keys) => keys.includes(e.key) || keys.includes(e.key.toLowerCase())
  window.addEventListener('keydown', (e) => {
    const t = e.target
    if (t instanceof HTMLElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName)) return
    if (e.ctrlKey || e.metaKey || e.altKey) return
    if (e.key === 'Escape') { if (deck.map) { deck.map = false; return apply() } if (deck.mode === 'present') exitPresent(); return }
    if (has(e, 'm', 'ь')) { deck.map = !deck.map; return apply() }
    if (deck.map) return
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) { if (e.key === 'Enter' && t instanceof HTMLElement && ['BUTTON', 'A'].includes(t.tagName)) return; e.preventDefault(); next() }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); prev() }
    else if (e.key === 'Home') { e.preventDefault(); goTo(0) }
    else if (e.key === 'End') { e.preventDefault(); goTo(SLIDES.length - 1, 99) }
    else if (has(e, 'e', 'у')) (deck.mode === 'present' ? exitPresent : enterPresent)()
    else if (has(e, 't', 'е')) { deck.clock = !deck.clock; $('clock').classList.toggle('on', deck.clock) }
    else if (/^[1-9]$/.test(e.key)) goTo(Number(e.key) - 1)
  })

  let sx = 0, sy = 0
  window.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY }, { passive: true })
  window.addEventListener('touchend', (e) => {
    if (deck.mode !== 'present' || deck.map) return
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) (dx < 0 ? next : prev)()
  }, { passive: true })

  const obs = new IntersectionObserver((es) => {
    if (deck.mode !== 'explore' || deck.printing) return
    for (const e of es) {
      if (!e.isIntersecting) continue
      const i = SLIDES.findIndex((s) => s.id === e.target.id)
      if (i < 0) continue
      const b = e.target.classList.contains('pclone') ? Number(e.target.dataset.bit) : SLIDES[i].bits - 1
      if (i !== deck.slide || b !== deck.bit) { deck.slide = i; deck.bit = b; apply() }
    }
  }, { rootMargin: '-45% 0px -50% 0px' })
  SLIDES.forEach((s) => obs.observe(document.querySelector(`#${s.id}:not(.pclone)`)))

  window.addEventListener('resize', fit)
  setInterval(() => {
    if (!deck.clock) return
    const sec = deck.t0 ? Math.floor((Date.now() - deck.t0) / 1000) : 0
    $('clock').textContent = `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`
  }, 500)

  /* ───────── звёздное небо ───────── */
  ;(() => {
    const c = $('stars'), ctx = c.getContext('2d')
    if (!ctx) return
    let w = 0, h = 0, stars = [], raf = 0, t = 0
    const resize = () => {
      const d = Math.min(window.devicePixelRatio || 1, 2)
      w = c.width = window.innerWidth * d; h = c.height = window.innerHeight * d
      stars = Array.from({ length: Math.round((w * h) / 11000 / d) }, () => ({ x: Math.random() * w, y: Math.random() * h, r: (Math.random() * 1.3 + 0.3) * d, z: Math.random() * 0.8 + 0.2, tw: Math.random() * Math.PI * 2 }))
    }
    const draw = () => {
      t += 0.008
      ctx.clearRect(0, 0, w, h)
      for (const s of stars) {
        const a = deck.motion ? 0.35 + 0.45 * Math.sin(t * (0.6 + s.z) + s.tw) : 0.55
        ctx.beginPath(); ctx.fillStyle = `rgba(${s.z > 0.7 ? '190,230,255' : '255,255,255'},${a * s.z})`; ctx.arc(s.x, s.y, s.r * (0.7 + s.z * 0.5), 0, Math.PI * 2); ctx.fill()
      }
      raf = deck.motion && !document.hidden ? requestAnimationFrame(draw) : 0
    }
    resize(); draw()
    window.addEventListener('resize', () => { resize(); if (!raf) draw() })
    document.addEventListener('visibilitychange', () => { if (!raf) draw() })
    setInterval(() => { if (!raf && deck.motion && !document.hidden) draw() }, 1000)
  })()

  /** Подзаголовок титула растянут ровно по ширине слова ГЛАВНЫЙ. */
  function fitSub() {
    const h1 = $('fith1'), s = $('fitsub')
    if (!h1 || !s || !h1.offsetWidth || !s.offsetWidth) return
    s.style.fontSize = ''
    const base = parseFloat(getComputedStyle(s).fontSize)
    s.style.fontSize = `${(base * (h1.offsetWidth - 14)) / s.offsetWidth}px`
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitSub)
  window.addEventListener('load', fitSub)

  chrome()
  apply()
  requestAnimationFrame(() => scrollToSlide(true))
})()
