// Paywall Generator — строит макет по docs/design-spec.md.
// Создаёт стили (цвет, текст, тени), компоненты с вариантами и экраны на Auto Layout.
// Повторный запуск безопасен: стили обновляются по имени, ранее сгенерированные слои удаляются.

// ---------- Токены (синхронно с docs/design-spec.md) ----------

const COLORS = {
  'bg/page': '#F5F3FF',
  'bg/surface': '#FFFFFF',
  'brand/primary': '#6C4CF5',
  'brand/primary-disabled': '#B9AAFA',
  'brand/primary-soft': '#EEEAFE',
  'accent/amber': '#FFB020',
  'accent/star': '#FFC83D',
  'text/primary': '#1F1A3D',
  'text/secondary': '#6B6785',
  'text/on-primary': '#FFFFFF',
  'border/default': '#E4E0F5',
  'border/radio': '#CFC9E8',
  'skeleton': '#E9E5F8',
  'success': '#1FA971',
  'success/soft': '#E3F7EF',
  'error': '#E5484D',
  'error/soft': '#FDECEC',
  'error/text': '#B4232A',
};

// [начертание Nunito, size, line height, upper?]
const TEXT = {
  'title': ['ExtraBold', 28, 34],
  'body': ['Medium', 16, 22],
  'feature': ['SemiBold', 15, 20],
  'card-title': ['Bold', 17, 22],
  'price': ['ExtraBold', 20, 24],
  'caption': ['Medium', 13, 18],
  'caption-strong': ['Bold', 13, 18],
  'badge': ['ExtraBold', 11, 14, true],
  'button': ['ExtraBold', 18, 24],
  'link': ['Bold', 15, 20],
  'banner': ['SemiBold', 14, 20],
  'legal': ['Medium', 12, 16],
};

const EFFECTS = {
  'shadow/selected': { hex: '#6C4CF5', a: 0.16, x: 0, y: 8, blur: 24 },
  'shadow/cta': { hex: '#6C4CF5', a: 0.3, x: 0, y: 8, blur: 20 },
  'shadow/footer': { hex: '#1F1A3D', a: 0.08, x: 0, y: -4, blur: 24 },
};

// Lucide icons (viewBox 0 0 24 24)
const LUCIDE = {
  'x': '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  'check': '<path d="M20 6 9 17l-5-5"/>',
  'info': '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  'circle-alert': '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
  'shield-check': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  'gamepad-2': '<line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/>',
  'sparkles': '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
  'wifi-off': '<path d="M12 20h.01"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/><path d="M5 12.859a10 10 0 0 1 5.17-2.69"/><path d="M19 12.859a10 10 0 0 0-2.007-1.523"/><path d="M2 8.82a15 15 0 0 1 4.177-2.643"/><path d="M22 8.82a15 15 0 0 0-11.288-3.764"/><path d="m2 2 20 20"/>',
};

const NBSP = ' ';
const S = { paint: {}, text: {}, effect: {} };

// ---------- Утилиты ----------

function rgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}

function tag(node) {
  node.setPluginData('gen', '1');
  return node;
}

async function fillWith(node, color) {
  await node.setFillStyleIdAsync(S.paint[color].id);
}

async function strokeWith(node, color, weight) {
  node.strokeWeight = weight;
  node.strokeAlign = 'INSIDE';
  await node.setStrokeStyleIdAsync(S.paint[color].id);
}

async function effectWith(node, effect) {
  await node.setEffectStyleIdAsync(S.effect[effect].id);
}

// o: { name, dir: 'h'|'v', gap, pad: [t,r,b,l], main, cross, w, h, radius }
// w/h заданы → ось фиксирована, иначе Hug.
function configure(node, o) {
  if (o.name) node.name = o.name;
  node.fills = [];
  node.clipsContent = false;
  if (o.dir) {
    node.layoutMode = o.dir === 'v' ? 'VERTICAL' : 'HORIZONTAL';
    node.itemSpacing = o.gap || 0;
    const p = o.pad || [0, 0, 0, 0];
    node.paddingTop = p[0];
    node.paddingRight = p[1];
    node.paddingBottom = p[2];
    node.paddingLeft = p[3];
    node.primaryAxisAlignItems = o.main || 'MIN';
    node.counterAxisAlignItems = o.cross || 'MIN';
  }
  if (o.w != null || o.h != null) {
    node.resize(o.w != null ? o.w : Math.max(node.width, 1), o.h != null ? o.h : Math.max(node.height, 1));
  }
  if (o.dir) {
    const wMode = o.w != null ? 'FIXED' : 'AUTO';
    const hMode = o.h != null ? 'FIXED' : 'AUTO';
    if (node.layoutMode === 'HORIZONTAL') {
      node.primaryAxisSizingMode = wMode;
      node.counterAxisSizingMode = hMode;
    } else {
      node.primaryAxisSizingMode = hMode;
      node.counterAxisSizingMode = wMode;
    }
  }
  if (o.radius != null) node.cornerRadius = o.radius;
  return node;
}

function frame(o) {
  return configure(figma.createFrame(), o);
}

function component(o) {
  return configure(figma.createComponent(), o);
}

// Добавить ребёнка в auto layout и задать ему Fill/Hug/Fixed
function add(parent, child, h, v) {
  parent.appendChild(child);
  if (h) child.layoutSizingHorizontal = h;
  if (v) child.layoutSizingVertical = v;
  return child;
}

async function txt(chars, style, color, align, name) {
  const t = figma.createText();
  await t.setTextStyleIdAsync(S.text[style].id);
  t.characters = chars;
  await fillWith(t, color);
  if (align) t.textAlignHorizontal = align;
  t.name = name || chars;
  return t;
}

function setText(instance, name, value) {
  const t = instance.findOne(function (n) { return n.type === 'TEXT' && n.name === name; });
  if (!t) throw new Error('Не найден текстовый слой "' + name + '" в ' + instance.name);
  t.characters = value;
}

async function bindStrokes(node, color) {
  const vectors = node.findAll(function (n) { return 'strokes' in n && n.strokes.length > 0; });
  for (const v of vectors) await v.setStrokeStyleIdAsync(S.paint[color].id);
}

// Иконка рисуется в 24×24 с увеличенным stroke и масштабируется до size,
// поэтому итоговая толщина линии ровно strokePx.
async function icon(name, size, strokePx, color) {
  const sw = +(strokePx * 24 / size).toFixed(4);
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" ' +
    'stroke="#000000" stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round">' + LUCIDE[name] + '</svg>';
  const node = figma.createNodeFromSvg(svg);
  node.name = 'Icon/' + name;
  node.fills = [];
  node.clipsContent = false;
  if (size !== 24) node.rescale(size / 24);
  await bindStrokes(node, color);
  return node;
}

async function spinner() {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">' +
    '<path d="M10 1.5A8.5 8.5 0 1 1 1.5 10" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/></svg>';
  const node = figma.createNodeFromSvg(svg);
  node.name = 'Spinner';
  node.fills = [];
  await bindStrokes(node, 'text/on-primary');
  return node;
}

// ---------- Подготовка: шрифты, стили, страницы ----------

async function loadFonts() {
  const all = await figma.listAvailableFontsAsync();
  const nunito = all.filter(function (f) { return f.fontName.family === 'Nunito'; });
  const byStyle = {};
  for (const f of nunito) byStyle[f.fontName.style.replace(/\s+/g, '').toLowerCase()] = f.fontName;

  const fonts = {};
  for (const key of Object.keys(TEXT)) {
    const want = TEXT[key][0];
    const font = byStyle[want.toLowerCase()];
    if (!font) throw new Error('Шрифт Nunito ' + want + ' недоступен в Figma');
    fonts[want] = font;
  }
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  for (const k of Object.keys(fonts)) await figma.loadFontAsync(fonts[k]);
  return fonts;
}

async function createStyles(fonts) {
  const paints = await figma.getLocalPaintStylesAsync();
  const texts = await figma.getLocalTextStylesAsync();
  const effects = await figma.getLocalEffectStylesAsync();
  const find = function (list, name) { return list.find(function (s) { return s.name === name; }); };

  for (const name of Object.keys(COLORS)) {
    const s = find(paints, name) || figma.createPaintStyle();
    s.name = name;
    s.paints = [{ type: 'SOLID', color: rgb(COLORS[name]), opacity: 1 }];
    S.paint[name] = s;
  }

  for (const name of Object.keys(TEXT)) {
    const def = TEXT[name];
    const s = find(texts, name) || figma.createTextStyle();
    s.name = name;
    s.fontName = fonts[def[0]];
    s.fontSize = def[1];
    s.lineHeight = { unit: 'PIXELS', value: def[2] };
    s.letterSpacing = { unit: 'PIXELS', value: 0 };
    s.paragraphSpacing = 0;
    s.textCase = def[3] ? 'UPPER' : 'ORIGINAL';
    S.text[name] = s;
  }

  for (const name of Object.keys(EFFECTS)) {
    const e = EFFECTS[name];
    const s = find(effects, name) || figma.createEffectStyle();
    s.name = name;
    const c = rgb(e.hex);
    s.effects = [{
      type: 'DROP_SHADOW',
      color: { r: c.r, g: c.g, b: c.b, a: e.a },
      offset: { x: e.x, y: e.y },
      radius: e.blur,
      spread: 0,
      visible: true,
      blendMode: 'NORMAL',
      showShadowBehindNode: false,
    }];
    S.effect[name] = s;
  }
}

async function preparePage(name) {
  // Пустой «Page 1» в новом файле переиспользуем под Screens
  let page = figma.root.children.find(function (p) { return p.name === name; });
  if (!page && name === 'Screens' && figma.root.children.length === 1) {
    const only = figma.root.children[0];
    await only.loadAsync();
    if (only.children.length === 0) {
      only.name = name;
      page = only;
    }
  }
  if (!page) {
    page = figma.createPage();
    page.name = name;
  }
  await page.loadAsync();
  for (const n of page.children.slice()) {
    if (n.getPluginData('gen') === '1') n.remove();
  }
  return page;
}

function styleVariantSet(set, name) {
  set.name = name;
  set.layoutMode = 'VERTICAL';
  set.primaryAxisSizingMode = 'AUTO';
  set.counterAxisSizingMode = 'AUTO';
  set.itemSpacing = 24;
  set.paddingTop = set.paddingRight = set.paddingBottom = set.paddingLeft = 24;
  set.fills = [];
  set.strokes = [{ type: 'SOLID', color: rgb('#9747FF') }];
  set.strokeWeight = 1;
  set.dashPattern = [6, 4];
  set.cornerRadius = 8;
  set.clipsContent = false;
}

// ---------- Компоненты ----------

async function buildComponents(page) {
  const C = {};
  let cursorY = 0;
  function place(node) {
    tag(node);
    node.x = 0;
    node.y = cursorY;
    cursorY += node.height + 80;
  }

  // CloseButton: зона нажатия 44, видимый круг 36
  C.close = component({ name: 'CloseButton', dir: 'h', main: 'CENTER', cross: 'CENTER', w: 44, h: 44 });
  const circle = frame({ name: 'Circle', dir: 'h', main: 'CENTER', cross: 'CENTER', w: 36, h: 36, radius: 18 });
  await fillWith(circle, 'bg/surface');
  circle.appendChild(await icon('x', 20, 2, 'text/secondary'));
  C.close.appendChild(circle);
  place(C.close);

  // Illustration 128×128
  C.illustration = component({ name: 'Illustration', w: 128, h: 128 });
  const bgCircle = figma.createEllipse();
  bgCircle.name = 'Circle';
  bgCircle.resize(128, 128);
  await fillWith(bgCircle, 'brand/primary-soft');
  C.illustration.appendChild(bgCircle);
  const star = figma.createStar();
  star.name = 'Star';
  star.resize(72, 72);
  star.pointCount = 5;
  star.innerRadius = 0.45;
  star.cornerRadius = 6;
  star.x = 28;
  star.y = 28;
  await fillWith(star, 'accent/star');
  C.illustration.appendChild(star);
  const dots = [[12, 100, 14, 'accent/amber'], [8, 18, 98, 'brand/primary']];
  for (const d of dots) {
    const e = figma.createEllipse();
    e.name = 'Dot';
    e.resize(d[0], d[0]);
    e.x = d[1];
    e.y = d[2];
    await fillWith(e, d[3]);
    C.illustration.appendChild(e);
  }
  place(C.illustration);

  // SuccessIcon 112×112
  C.successIcon = component({ name: 'SuccessIcon', dir: 'h', main: 'CENTER', cross: 'CENTER', w: 112, h: 112, radius: 56 });
  await fillWith(C.successIcon, 'success/soft');
  C.successIcon.appendChild(await icon('check', 56, 3, 'success'));
  place(C.successIcon);

  // FeatureRow (Icon=Gamepad/Shield/Sparkles)
  const features = [
    ['Gamepad', 'gamepad-2', 'Все 120 уровней и мини-игр'],
    ['Shield', 'shield-check', 'Никакой рекламы'],
    ['Sparkles', 'sparkles', 'Новые задания каждую неделю'],
  ];
  C.feature = [];
  for (const f of features) {
    const c = component({ name: 'Icon=' + f[0], dir: 'h', gap: 12, cross: 'CENTER', w: 318 });
    const box = frame({ name: 'IconBox', dir: 'h', main: 'CENTER', cross: 'CENTER', w: 28, h: 28, radius: 8 });
    await fillWith(box, 'brand/primary-soft');
    box.appendChild(await icon(f[1], 16, 2, 'brand/primary'));
    add(c, box);
    add(c, await txt(f[2], 'feature', 'text/primary', null, 'Label'), 'FILL');
    C.feature.push(c);
  }
  const featureSet = figma.combineAsVariants(C.feature, page);
  styleVariantSet(featureSet, 'FeatureRow');
  place(featureSet);

  // OfferCard (Selected × Badge)
  C.offer = {};
  const offerVariants = [];
  for (const sel of [true, false]) {
    for (const badge of [true, false]) {
      const c = component({ name: 'Selected=' + sel + ', Badge=' + badge, dir: 'h', gap: 12, cross: 'CENTER', pad: [16, 16, 16, 16], w: 350, radius: 20 });
      await fillWith(c, 'bg/surface');
      await strokeWith(c, sel ? 'brand/primary' : 'border/default', 2);
      if (sel) await effectWith(c, 'shadow/selected');

      const radio = frame({ name: 'Radio', w: 24, h: 24 });
      const ring = figma.createEllipse();
      ring.resize(24, 24);
      if (sel) {
        ring.name = 'Fill';
        await fillWith(ring, 'brand/primary');
        radio.appendChild(ring);
        const dot = figma.createEllipse();
        dot.name = 'Dot';
        dot.resize(10, 10);
        dot.x = 7;
        dot.y = 7;
        await fillWith(dot, 'bg/surface');
        radio.appendChild(dot);
      } else {
        ring.name = 'Ring';
        ring.fills = [];
        await strokeWith(ring, 'border/radio', 2);
        radio.appendChild(ring);
      }
      add(c, radio);

      const info = frame({ name: 'Info', dir: 'v', gap: 4 });
      add(c, info, 'FILL');
      add(info, await txt('Год', 'card-title', 'text/primary', null, 'Title'), 'FILL');
      add(info, await txt('2' + NBSP + '990' + NBSP + '₽ в год', 'caption', 'text/secondary', null, 'Subtitle'), 'FILL');

      const price = frame({ name: 'Price', dir: 'v', gap: 2, cross: 'MAX' });
      add(c, price);
      add(price, await txt('249' + NBSP + '₽', 'price', 'text/primary', 'RIGHT', 'Amount'));
      add(price, await txt('в месяц', 'caption', 'text/secondary', 'RIGHT', 'Period'));

      if (badge) {
        const b = frame({ name: 'Badge', dir: 'h', pad: [3, 8, 3, 8], radius: 10 });
        await fillWith(b, 'accent/amber');
        add(b, await txt('Выгода 50%', 'badge', 'text/primary', null, 'BadgeLabel'));
        c.appendChild(b);
        b.layoutPositioning = 'ABSOLUTE';
        b.constraints = { horizontal: 'MAX', vertical: 'MIN' };
        b.x = c.width - 16 - b.width;
        b.y = -10;
      }
      C.offer[sel + ',' + badge] = c;
      offerVariants.push(c);
    }
  }
  const offerSet = figma.combineAsVariants(offerVariants, page);
  styleVariantSet(offerSet, 'OfferCard');
  place(offerSet);

  // CtaButton (State)
  C.cta = {};
  const ctaDefs = [
    ['Default', 'brand/primary', 'Открыть всё за 2' + NBSP + '990' + NBSP + '₽'],
    ['Disabled', 'brand/primary-disabled', 'Загружаем тарифы…'],
    ['Loading', 'brand/primary', 'Оформляем покупку…'],
  ];
  for (const d of ctaDefs) {
    const c = component({ name: 'State=' + d[0], dir: 'h', gap: 8, main: 'CENTER', cross: 'CENTER', w: 350, h: 56, radius: 16 });
    await fillWith(c, d[1]);
    if (d[0] === 'Default') await effectWith(c, 'shadow/cta');
    if (d[0] === 'Loading') add(c, await spinner());
    add(c, await txt(d[2], 'button', 'text/on-primary', 'CENTER', 'Label'));
    C.cta[d[0]] = c;
  }
  const ctaSet = figma.combineAsVariants([C.cta.Default, C.cta.Disabled, C.cta.Loading], page);
  styleVariantSet(ctaSet, 'CtaButton');
  place(ctaSet);

  // Banner (Type)
  C.banner = {};
  const bannerDefs = [
    ['Error', 'error/soft', 'circle-alert', 'error', 'error/text', 'Не удалось оформить покупку'],
    ['Info', 'brand/primary-soft', 'info', 'brand/primary', 'text/primary', 'Покупки не найдены'],
  ];
  for (const d of bannerDefs) {
    const c = component({ name: 'Type=' + d[0], dir: 'h', gap: 10, cross: 'CENTER', pad: [12, 12, 12, 12], w: 350, radius: 14 });
    await fillWith(c, d[1]);
    add(c, await icon(d[2], 20, 2, d[3]));
    add(c, await txt(d[5], 'banner', d[4], null, 'Label'), 'FILL');
    C.banner[d[0]] = c;
  }
  const bannerSet = figma.combineAsVariants([C.banner.Error, C.banner.Info], page);
  styleVariantSet(bannerSet, 'Banner');
  place(bannerSet);

  // SecondaryButton
  C.secondary = component({ name: 'SecondaryButton', dir: 'h', main: 'CENTER', cross: 'CENTER', pad: [0, 20, 0, 20], h: 44, radius: 12 });
  await fillWith(C.secondary, 'brand/primary-soft');
  add(C.secondary, await txt('Повторить', 'link', 'brand/primary', null, 'Label'));
  place(C.secondary);

  return C;
}

// ---------- Экраны ----------

function screenRoot(name) {
  const root = frame({ name: name, dir: 'v', w: 390, h: 844 });
  root.clipsContent = true;
  return root;
}

async function buildFooter(root, C, o) {
  const footer = frame({ name: 'Footer', dir: 'v', gap: 4, pad: [16, 20, 16, 20], cross: 'CENTER' });
  await fillWith(footer, 'bg/surface');
  footer.topLeftRadius = 24;
  footer.topRightRadius = 24;
  footer.bottomLeftRadius = 0;
  footer.bottomRightRadius = 0;
  await effectWith(footer, 'shadow/footer');
  add(root, footer, 'FILL', 'HUG');

  const actions = frame({ name: 'Actions', dir: 'v', gap: 12 });
  add(footer, actions, 'FILL');
  if (o.banner) add(actions, C.banner[o.banner].createInstance(), 'FILL');
  const cta = C.cta[o.cta].createInstance();
  add(actions, cta, 'FILL');
  if (o.ctaLabel) setText(cta, 'Label', o.ctaLabel);

  let restore = null;
  if (!o.minimal) {
    restore = frame({ name: 'RestoreLink', dir: 'h', main: 'CENTER', cross: 'CENTER', pad: [0, 12, 0, 12], h: 44 });
    add(footer, restore);
    add(restore, await txt('Восстановить покупки', 'link', 'brand/primary', null, 'Label'));
    add(footer, await txt('Тестовая покупка · Отмена в любой момент', 'legal', 'text/secondary', 'CENTER', 'Legal'));
  }
  return { footer: footer, restore: restore };
}

// o: { offers: 'cards'|'skeleton'|'error', cta, ctaLabel, banner, dim }
async function paywallScreen(C, name, o) {
  const root = screenRoot(name);
  await fillWith(root, 'bg/page');

  const content = frame({ name: 'Content', dir: 'v', gap: 24, pad: [8, 20, 24, 20], cross: 'CENTER' });
  add(root, content, 'FILL', 'FILL');
  content.clipsContent = true;

  const header = frame({ name: 'Header', dir: 'v', cross: 'CENTER' });
  add(content, header, 'FILL');
  const topBar = frame({ name: 'TopBar', dir: 'h', main: 'MAX', cross: 'CENTER', h: 44 });
  add(header, topBar, 'FILL');
  add(topBar, C.close.createInstance());

  const hero = frame({ name: 'Hero', dir: 'v', gap: 16, cross: 'CENTER' });
  add(header, hero, 'FILL');
  add(hero, C.illustration.createInstance());
  const texts = frame({ name: 'Texts', dir: 'v', gap: 8, cross: 'CENTER' });
  add(hero, texts, 'FILL');
  add(texts, await txt('Открой все уровни!', 'title', 'text/primary', 'CENTER', 'Title'), 'FILL');
  add(texts, await txt('Развивающие игры и задания для детей\n4–8 лет без рекламы', 'body', 'text/secondary', 'CENTER', 'Subtitle'), 'FILL');

  const features = frame({ name: 'Features', dir: 'v', gap: 12, pad: [16, 16, 16, 16], radius: 20 });
  await fillWith(features, 'bg/surface');
  add(content, features, 'FILL');
  for (const f of C.feature) add(features, f.createInstance(), 'FILL');

  const offerList = frame({ name: 'OfferList', dir: 'v', gap: 12 });
  add(content, offerList, 'FILL');

  if (o.offers === 'cards') {
    add(offerList, C.offer['true,true'].createInstance(), 'FILL');
    const month = C.offer['false,false'].createInstance();
    add(offerList, month, 'FILL');
    setText(month, 'Title', 'Месяц');
    setText(month, 'Subtitle', 'Оплата каждый месяц');
    setText(month, 'Amount', '499' + NBSP + '₽');
  } else if (o.offers === 'skeleton') {
    for (let i = 0; i < 2; i++) {
      const r = figma.createRectangle();
      r.name = 'Skeleton';
      r.resize(350, 76);
      r.cornerRadius = 20;
      await fillWith(r, 'skeleton');
      add(offerList, r, 'FILL');
    }
  } else if (o.offers === 'error') {
    const block = frame({ name: 'OffersError', dir: 'v', gap: 12, pad: [20, 20, 20, 20], cross: 'CENTER', radius: 20 });
    await fillWith(block, 'bg/surface');
    add(offerList, block, 'FILL');
    add(block, await icon('wifi-off', 24, 2, 'error'));
    const t = frame({ name: 'Texts', dir: 'v', gap: 4, cross: 'CENTER' });
    add(block, t, 'FILL');
    add(t, await txt('Не удалось загрузить тарифы', 'card-title', 'text/primary', 'CENTER', 'Title'), 'FILL');
    add(t, await txt('Проверьте интернет и попробуйте снова', 'caption', 'text/secondary', 'CENTER', 'Subtitle'), 'FILL');
    add(block, C.secondary.createInstance());
  }

  const f = await buildFooter(root, C, o);
  if (o.dim) {
    offerList.opacity = 0.5;
    if (f.restore) f.restore.opacity = 0.5;
  }
  return root;
}

async function successScreen(C) {
  const root = screenRoot('Paywall / Success');
  await fillWith(root, 'bg/page');

  const content = frame({ name: 'Content', dir: 'v', gap: 24, pad: [0, 20, 0, 20], main: 'CENTER', cross: 'CENTER' });
  add(root, content, 'FILL', 'FILL');
  add(content, C.successIcon.createInstance());

  const texts = frame({ name: 'Texts', dir: 'v', gap: 8, cross: 'CENTER' });
  add(content, texts, 'FILL');
  add(texts, await txt('Готово! Всё открыто', 'title', 'text/primary', 'CENTER', 'Title'), 'FILL');
  add(texts, await txt('Тариф «Год» активирован.\nПриятной игры!', 'body', 'text/secondary', 'CENTER', 'Subtitle'), 'FILL');

  const receipt = frame({ name: 'Receipt', dir: 'h', main: 'SPACE_BETWEEN', cross: 'CENTER', pad: [12, 16, 12, 16], radius: 16 });
  await fillWith(receipt, 'bg/surface');
  add(content, receipt, 'FILL');
  add(receipt, await txt('Номер покупки', 'caption', 'text/secondary', null, 'Label'));
  add(receipt, await txt('#7F3A2C', 'caption-strong', 'text/primary', null, 'Value'));

  await buildFooter(root, C, { cta: 'Default', ctaLabel: 'Начать играть', minimal: true });
  return root;
}

// ---------- Main ----------

async function main() {
  const fonts = await loadFonts();
  await createStyles(fonts);

  // Screens первым: пустой «Page 1» нового файла переименуется в Screens
  const screensPage = await preparePage('Screens');
  const componentsPage = await preparePage('Components');

  await figma.setCurrentPageAsync(componentsPage);
  const C = await buildComponents(componentsPage);

  await figma.setCurrentPageAsync(screensPage);
  const screens = [
    await paywallScreen(C, 'Paywall / Default', { offers: 'cards', cta: 'Default' }),
    await paywallScreen(C, 'Paywall / Loading', { offers: 'skeleton', cta: 'Disabled' }),
    await paywallScreen(C, 'Paywall / Offers error', { offers: 'error', cta: 'Disabled', ctaLabel: 'Открыть всё' }),
    await paywallScreen(C, 'Paywall / Purchasing', { offers: 'cards', cta: 'Loading', dim: true }),
    await paywallScreen(C, 'Paywall / Purchase error', { offers: 'cards', cta: 'Default', ctaLabel: 'Попробовать снова', banner: 'Error' }),
    await paywallScreen(C, 'Paywall / Restored', { offers: 'cards', cta: 'Default', banner: 'Info' }),
    await successScreen(C),
  ];
  screens.forEach(function (s, i) {
    screensPage.appendChild(s);
    tag(s);
    s.x = i * (390 + 80);
    s.y = 0;
  });
  figma.viewport.scrollAndZoomIntoView(screens);
}

main().then(
  function () { figma.closePlugin('✅ Макет создан: страницы Screens и Components'); },
  function (e) {
    console.error(e);
    figma.closePlugin('❌ Ошибка: ' + (e && e.message ? e.message : e));
  }
);
