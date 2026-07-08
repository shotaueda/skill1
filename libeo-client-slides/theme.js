/**
 * 株式会社LIBEO クライアント報告・提案スライド — Slide Theme Module  (for PptxGenJS)
 * ------------------------------------------------------------
 * 株式会社LIBEO が「案件ごとのクライアント」向けに作る報告・提案スライドの共通テーマ。
 * クライアント名・ロゴは固定ではなく、常に呼び出し側が渡すパラメータ（client/logo）。
 * 才流テンプレートの「構造的な見せ方」を、寒色系のブランド配色
 * （ブルー #2F6FEB 中心＋ネイビー・アイス・ミスト）でリスキンしたもの。
 *
 * 使い方:
 *   const T = require('./theme.js');
 *   const pptx = T.newDeck();
 *   T.titleSlide(pptx, { client: '株式会社◯◯', ... }); // client は案件ごとに差し替え
 *   const s = T.contentSlide(pptx, { kicker, message, title, page });
 *   ...(s に対して addText/addShape 等を重ねる)...
 *   await T.save(pptx, 'out.pptx');
 *
 * 座標系は 16:9 = 10in × 5.625in。
 */
const path = require('path');

/* 制作者（LIBEO自身）の会社情報。案件によらず固定。表紙/締めの制作者表記の既定値や、
 * LIBEO自己紹介スライド（companyProfile）に使う。 */
const LIBEO = {
  name: '株式会社LIBEO',
  url: 'https://libeo.co.jp/',
  address: '〒550-0013 大阪府大阪市西区新町1-24-11 新町F1ビル502',
  established: '2018年5月8日',
  ceo: '嘉島 元貴',
  capital: '資本金900万円',
  business: 'Webマーケティング・Web制作・プロダクションマネジメント事業',
  tagline: 'SEO・検索広告・SNS広告・Web制作をワンストップで支援',
};

/* =========================================================
 * 1. デザイントークン
 * =======================================================*/
const C = {
  blue:        '2F6FEB', // ブランド中心色（必ず毎スライドに1点は効かせる）
  blueDeep:    '1E4FC0', // 押下/陰影/グラデ下端
  blueTint:    'E3ECFC', // 薄いブルーの面・ハイライト地
  navy:        '13223B', // 構造色（濃紺＝才流のネイビーの役割）見出し帯・表ヘッダ・章扉
  navy700:     '3C5478', // 副次のネイビー
  mist:        'D8E3F0', // ミストブルー（帯・補助背景）
  mistLight:   'EAF0F8', // 表のストライプ等
  ice:         'EDF2FA', // アイス（カード地・章扉地）
  green:       '2E9E6B', // 肯定/CV/改善/自社の強み
  greenDeep:   '227A52',
  red:         'D73120', // 緊急/否定/リスク/注意
  redTint:     'FBE3E0',
  yellow:      'FFD23C', // ハイライトマーカー（キーワード/数値の下線・蛍光）※多用しない
  ink:         '1B2430', // 本文・見出し（紺寄りの黒）
  muted:       '5B6B82', // 補足・出典・キャプション
  rule:        'E1E7F0', // ヘアライン（寒色グレー）
  white:       'FFFFFF',
  paper:       'FFFFFF', // 既定の地は白（可読性最優先）
};

const FONT = {
  // 日本語: 游ゴシック系を主、Meiryo/Noto をフォールバック想定。
  // PowerPoint 側でレンダリングされるため、配布先環境にあるフォントを指定する。
  jp:       'Yu Gothic',          // 本文
  jpBold:   'Yu Gothic',          // 太字も同ファミリ（bold:true で太らせる）
  jpHeavy:  'Yu Gothic',          // 見出し（bold:true 必須）
  num:      'Arial',              // 大きな数値は欧文の方が締まる場合に
};

// フォントサイズ（pt）
const SZ = {
  titleSlide: 40, titleSlideSub: 16,
  sectionNo: 18, sectionTitle: 32,
  kicker: 11, message: 16, slideTitle: 24,
  h: 15, body: 13, small: 11, caption: 9,
  statBig: 40, statUnit: 14, statLabel: 11,
};

// 余白・寸法（inch）
const M = {
  edge: 0.55,            // スライド外周マージン
  contentTop: 1.42,      // メッセージ+タイトル下の本文開始 y
  footer: 5.22,          // フッター帯 y
  W: 10, H: 5.625,
  colGap: 0.3,
};

const RADIUS = { card: 0.12, tile: 0.08, pill: 0.5 };

const ASSETS = path.join(__dirname, 'assets');
const A = {
  dotsNavy: path.join(ASSETS, 'dot-texture-navy.png'),
  dotsBlue: path.join(ASSETS, 'dot-texture-blue.png'),
};

/* 単色（白）のフラットアイコン一式。iconBadge() 等で色付きバッジの上に重ねて使う。
 * 追加・差し替えは assets/icons/*.png（240x240, 白シルエット, 透過）に置くだけでよい。 */
const ICON_DIR = path.join(ASSETS, 'icons');
const ICON_NAMES = [
  'badge', 'bulb', 'calendar', 'cart', 'chat', 'check', 'clock', 'coin', 'database',
  'document', 'flag', 'funnel', 'gear', 'globe', 'megaphone', 'monitor', 'network',
  'pin', 'refresh', 'search', 'shield', 'target', 'trend-down', 'trend-up', 'trophy',
  'user', 'users', 'warning',
];
const ICONS = {};
ICON_NAMES.forEach((name) => { ICONS[name] = path.join(ICON_DIR, `${name}.png`); });

/* =========================================================
 * 2. デッキ初期化・保存
 * =======================================================*/
function newDeck(meta = {}) {
  const pptxgen = require('pptxgenjs');
  const p = new pptxgen();
  p.layout = 'LAYOUT_16x9';
  p.author = meta.author || '株式会社LIBEO';
  p.company = meta.company || '株式会社LIBEO';
  p.title = meta.title || 'レポート';
  p._footerLabel = meta.footerLabel || '';  // フッター左の小さなラベル（任意。既定は無し）
  return p;
}
async function save(p, fileName) {
  await p.writeFile({ fileName });
  return fileName;
}

/* 影は毎回新規生成（pptxgenjs はオブジェクトを破壊的に変更するため共有禁止） */
const shadow = (o = {}) => ({ type: 'outer', color: '000000', blur: 7, offset: 3, angle: 90, opacity: 0.12, ...o });

/* =========================================================
 * 3. 共通パーツ
 * =======================================================*/

/* ブルーの小マーカー（家マークに代わる中立的なアクセント。kicker / メッセージ帯の頭に） */
function marker(slide, p, { x, y, size = 0.16 } = {}) {
  slide.addShape(p.shapes.ROUNDED_RECTANGLE, {
    x, y, w: size, h: size, rectRadius: 0.04, fill: { color: C.blue }, line: { type: 'none' },
  });
}

/** アイコンバッジ（色付き円/角丸四角 + 白いアイコン画像）。多くの新パーツの基礎部品。 */
function iconBadge(slide, p, { x, y, d = 0.56, icon, bg = C.blue, shape = 'circle', shadowOn = false } = {}) {
  const shapeType = shape === 'square' ? p.shapes.ROUNDED_RECTANGLE : p.shapes.OVAL;
  slide.addShape(shapeType, {
    x, y, w: d, h: d, ...(shape === 'square' ? { rectRadius: d * 0.22 } : {}),
    fill: { color: bg }, line: { type: 'none' }, ...(shadowOn ? { shadow: shadow() } : {}),
  });
  if (icon && ICONS[icon]) {
    const pad = d * 0.26;
    slide.addImage({ path: ICONS[icon], x: x + pad, y: y + pad, w: d - pad * 2, h: d - pad * 2 });
  }
  return { cx: x + d / 2, cy: y + d / 2, d };
}

/** 濃色背景にクライアントの白ロゴを置く（ロゴ未指定なら社名テキストで代替） */
function brandLogo(slide, p, { logo, name, x, y, w, h, align = 'center' } = {}) {
  if (logo) {
    slide.addImage({ path: logo, x, y, w, h, sizing: { type: 'contain', w, h } });
  } else if (name) {
    slide.addText(name, {
      x: x - (align === 'center' ? 0 : 0), y, w, h, align, valign: 'middle',
      fontFace: FONT.jpBold, bold: true, fontSize: 18, color: C.white, charSpacing: 2, margin: 0,
    });
  }
}

/** フッター（ページ番号＋任意の小ラベル）— 章扉以外の全コンテンツ面に置く */
function footer(slide, p, page) {
  const label = (p && p._footerLabel) || '';
  if (label) slide.addText(label, {
    x: M.edge, y: M.footer, w: 5, h: 0.3, fontFace: FONT.jp,
    fontSize: SZ.caption, color: C.muted, valign: 'middle', margin: 0, charSpacing: 1,
  });
  if (page != null) slide.addText(String(page), {
    x: M.W - M.edge - 0.6, y: M.footer, w: 0.6, h: 0.3, fontFace: FONT.jp,
    fontSize: SZ.caption, color: C.muted, align: 'right', valign: 'middle', margin: 0,
  });
}

/**
 * 標準コンテンツ面の枠（才流の「メッセージライン→タイトル→本文」を踏襲）
 *  - kicker:  小見出し（任意, ブルーの category ラベル）
 *  - message: 言いたいこと1〜2行（このスライドの結論）
 *  - title:   スライドタイトル（トピック名）
 *  - page:    ページ番号
 * 返り値: 本文を置ける slide
 */
function contentSlide(p, { kicker, message, title, page } = {}) {
  const s = p.addSlide();
  s.background = { color: C.paper };
  let y = 0.42;

  // kicker（任意）— 小さなブルーマーカー + ブルー文字
  if (kicker) {
    marker(s, p, { x: M.edge, y: y + 0.03, size: 0.16 });
    s.addText(kicker, {
      x: M.edge + 0.26, y, w: 6, h: 0.24, fontFace: FONT.jpBold, bold: true,
      fontSize: SZ.kicker, color: C.blue, valign: 'middle', margin: 0, charSpacing: 1,
    });
    y += 0.26;
  }
  // スライドタイトル
  s.addText(title || '', {
    x: M.edge, y, w: M.W - M.edge * 2, h: 0.46, fontFace: FONT.jpHeavy, bold: true,
    fontSize: SZ.slideTitle, color: C.ink, valign: 'middle', margin: 0,
  });
  y += 0.5;
  // メッセージライン（アイス地のバーに結論を1〜2行。長文は自動で帯を2行分の高さにする）
  if (message) {
    const approxCharsPerLine = 34; // 帯の幅・16pt太字での概算折り返し文字数
    const lines = Math.max(1, Math.ceil(message.length / approxCharsPerLine));
    const boxH = lines >= 2 ? 0.74 : 0.46;
    s.addShape(p.shapes.ROUNDED_RECTANGLE, {
      x: M.edge, y, w: M.W - M.edge * 2, h: boxH, rectRadius: RADIUS.tile,
      fill: { color: C.ice }, line: { type: 'none' },
    });
    // 左端にブルーの小マーカー（アクセント。エッジ帯ではなくマーカー）
    marker(s, p, { x: M.edge + 0.18, y: y + 0.15, size: 0.16 });
    s.addText(message, {
      x: M.edge + 0.5, y, w: M.W - M.edge * 2 - 0.7, h: boxH, fontFace: FONT.jpBold, bold: true,
      fontSize: SZ.message, color: C.navy, valign: 'middle', margin: 0,
    });
    y += boxH;
  }
  footer(s, p, page);
  // 本文開始Y（メッセージ帯の下に 0.18in の余白）。各パーツはこれを基準にする。
  s.bodyTop = +(y + 0.18).toFixed(2);
  return s;
}

/** 表紙（濃紺背景。logo に白ロゴのパスを渡すと中央上に配置。無ければ社名テキスト） */
function titleSlide(p, { title, subtitle, client, date, presenter = LIBEO.name, logo } = {}) {
  const s = p.addSlide();
  s.background = { color: C.navy };
  // 質感: 控えめなドット
  s.addImage({ path: A.dotsBlue, x: 0, y: 0, w: M.W, h: M.H, transparency: 55 });
  // 中央やや上にクライアントの白ロゴ（濃色背景なので白で映える）
  brandLogo(s, p, { logo, name: client, x: (M.W - 3.0) / 2, y: 1.05, w: 3.0, h: 0.8, align: 'center' });
  s.addText(title || 'タイトル', {
    x: 0.8, y: 2.2, w: M.W - 1.6, h: 0.9, align: 'center', valign: 'middle',
    fontFace: FONT.jpHeavy, bold: true, fontSize: SZ.titleSlide, color: C.white, margin: 0,
  });
  if (subtitle) s.addText(subtitle, {
    x: 0.8, y: 3.08, w: M.W - 1.6, h: 0.4, align: 'center',
    fontFace: FONT.jp, fontSize: SZ.titleSlideSub, color: C.mist, margin: 0,
  });
  // 下部メタ情報
  const meta = [date, presenter].filter(Boolean).join('   |   ');
  if (meta) s.addText(meta, {
    x: 0.8, y: 4.55, w: M.W - 1.6, h: 0.35, align: 'center',
    fontFace: FONT.jp, fontSize: 12, color: C.mist, margin: 0, charSpacing: 1,
  });
  return s;
}

/** 章扉 */
function sectionDivider(p, { no, title, total } = {}) {
  const s = p.addSlide();
  s.background = { color: C.ice };
  s.addImage({ path: A.dotsNavy, x: 0, y: 0, w: M.W, h: M.H, transparency: 60 });
  // 大きな番号（ブルー）
  if (no != null) s.addText(String(no).padStart(2, '0'), {
    x: 0.9, y: 2.0, w: 2.2, h: 1.6, fontFace: FONT.num, bold: true,
    fontSize: 100, color: C.blue, align: 'left', valign: 'middle', margin: 0,
  });
  // 区切りの細い縦罫（機能的）
  s.addShape(p.shapes.LINE, { x: 3.05, y: 2.25, w: 0, h: 1.1, line: { color: C.blue, width: 2 } });
  s.addText(title || '', {
    x: 3.35, y: 2.0, w: 5.8, h: 1.6, fontFace: FONT.jpHeavy, bold: true,
    fontSize: SZ.sectionTitle, color: C.navy, valign: 'middle', margin: 0,
  });
  if (total != null && no != null) s.addText(`${no} / ${total}`, {
    x: M.W - M.edge - 1.2, y: M.footer, w: 1.2, h: 0.3, fontFace: FONT.jp,
    fontSize: SZ.caption, color: C.navy700, align: 'right', valign: 'middle', margin: 0,
  });
  return s;
}

/** アジェンダ（番号付き2列。才流の体裁） */
function agenda(p, { title = '本日お伝えすること', items = [], page } = {}) {
  const s = contentSlide(p, { title, page });
  const top = 1.55, colW = 4.25, rowH = 0.52, perCol = Math.ceil(items.length / 2);
  items.forEach((it, i) => {
    const col = i < perCol ? 0 : 1;
    const row = i - col * perCol;
    const x = M.edge + col * (colW + 0.5);
    const y = top + row * rowH;
    s.addText(String(i + 1).padStart(2, '0'), {
      x, y, w: 0.5, h: rowH - 0.08, fontFace: FONT.num, bold: true,
      fontSize: 15, color: C.blue, valign: 'middle', margin: 0,
    });
    s.addText(it, {
      x: x + 0.55, y, w: colW - 0.55, h: rowH - 0.08, fontFace: FONT.jp,
      fontSize: SZ.body, color: C.ink, valign: 'middle', margin: 0,
    });
    s.addShape(p.shapes.LINE, { x, y: y + rowH - 0.06, w: colW, h: 0, line: { color: C.rule, width: 1 } });
  });
  return s;
}

/* ---- 数値ハイライト（KPIの大きな数字 callouts） ---- */
function statCallout(s, p, { items = [], y = 1.6, h = 1.5 } = {}) {
  const n = items.length, gap = 0.25;
  const w = (M.W - M.edge * 2 - gap * (n - 1)) / n;
  items.forEach((it, i) => {
    const x = M.edge + i * (w + gap);
    s.addShape(p.shapes.ROUNDED_RECTANGLE, {
      x, y, w, h, rectRadius: RADIUS.card, fill: { color: C.ice }, line: { type: 'none' },
      shadow: shadow(),
    });
    s.addText(it.label || '', {
      x: x + 0.15, y: y + 0.18, w: w - 0.3, h: 0.3, align: 'center',
      fontFace: FONT.jp, fontSize: SZ.statLabel, color: C.muted, margin: 0,
    });
    s.addText([
      { text: String(it.value), options: { fontFace: FONT.num, bold: true, fontSize: SZ.statBig, color: it.color || C.blue } },
      { text: it.unit ? ' ' + it.unit : '', options: { fontFace: FONT.jpBold, bold: true, fontSize: SZ.statUnit, color: C.navy } },
    ], { x: x + 0.1, y: y + 0.45, w: w - 0.2, h: 0.7, align: 'center', valign: 'middle', margin: 0 });
    if (it.delta) s.addText(it.delta, {
      x: x + 0.15, y: y + h - 0.38, w: w - 0.3, h: 0.28, align: 'center',
      fontFace: FONT.jpBold, bold: true, fontSize: SZ.small,
      color: it.deltaColor || C.green, margin: 0,
    });
  });
}

/* ---- コンパクトKPIストリップ（statCallout より薄く、他パーツと同一スライドに同居させて情報密度を上げる） ---- */
function miniKpiRow(s, p, { items = [], y = 1.6, h = 0.62 } = {}) {
  const n = items.length, gap = 0.2;
  const w = (M.W - M.edge * 2 - gap * (n - 1)) / n;
  items.forEach((it, i) => {
    const x = M.edge + i * (w + gap);
    s.addShape(p.shapes.ROUNDED_RECTANGLE, {
      x, y, w, h, rectRadius: RADIUS.tile, fill: { color: C.white },
      line: { color: C.rule, width: 1 },
    });
    s.addShape(p.shapes.RECTANGLE, { x, y, w: 0.06, h, fill: { color: it.color || C.blue }, line: { type: 'none' } });
    s.addText(it.label || '', {
      x: x + 0.18, y: y + 0.06, w: w - 0.3, h: h * 0.4, fontFace: FONT.jp,
      fontSize: 9, color: C.muted, valign: 'bottom', margin: 0,
    });
    s.addText([
      { text: String(it.value), options: { fontFace: FONT.num, bold: true, fontSize: 15, color: it.color || C.blue } },
      { text: it.unit ? ' ' + it.unit : '', options: { fontFace: FONT.jp, fontSize: 9, color: C.navy } },
      it.delta ? { text: '   ' + it.delta, options: { fontFace: FONT.jpBold, bold: true, fontSize: 9, color: it.deltaColor || C.green } } : null,
    ].filter(Boolean), { x: x + 0.18, y: y + h * 0.42, w: w - 0.3, h: h * 0.5, valign: 'top', margin: 0 });
  });
}

/* ---- グラフ＋読み解きカードの複合パーツ（1枚の情報密度を上げる定番構成） ---- */
function chartWithInsights(s, p, { chartType, chartData, chartOptions = {}, insights = [], heading = '読み解き', y = 1.6, h = 2.7, chartW } = {}) {
  const gap = 0.3;
  const rightW = 2.4;
  const leftW = chartW || (M.W - M.edge * 2 - rightW - gap);
  s.addChart(chartType, chartData, chartTheme({ x: M.edge, y, w: leftW, h, ...chartOptions }));
  const rx = M.edge + leftW + gap;
  s.addShape(p.shapes.ROUNDED_RECTANGLE, {
    x: rx, y, w: rightW, h, rectRadius: RADIUS.card, fill: { color: C.ice }, line: { type: 'none' }, shadow: shadow(),
  });
  s.addText(heading, {
    x: rx + 0.2, y: y + 0.2, w: rightW - 0.4, h: 0.3, fontFace: FONT.jpBold, bold: true,
    fontSize: 13, color: C.blue, margin: 0,
  });
  s.addText(
    insights.map((t) => ({ text: t, options: { bullet: { code: '2022' }, breakLine: true, paraSpaceAfter: 8 } })),
    { x: rx + 0.2, y: y + 0.6, w: rightW - 0.35, h: h - 0.75, fontFace: FONT.jp, fontSize: 11, color: C.ink, valign: 'top', margin: 0 }
  );
  return { chartX: M.edge, chartW: leftW, insightX: rx, insightW: rightW };
}

/* ---- 2カラム対比（才流の「悩み→課題 / ✕→○ / 声→インサイト」） ---- */
function twoColContrast(s, p, { left, right, y = 1.6, h = 3.0, arrow = true } = {}) {
  const gap = arrow ? 0.7 : 0.4;
  const w = (M.W - M.edge * 2 - gap) / 2;
  const block = (side, x) => {
    const headColor = side.headColor || C.navy;
    s.addShape(p.shapes.ROUNDED_RECTANGLE, {
      x, y, w, h, rectRadius: RADIUS.card, fill: { color: C.white },
      line: { color: C.rule, width: 1 }, shadow: shadow(),
    });
    s.addShape(p.shapes.ROUNDED_RECTANGLE, {
      x, y, w, h: 0.5, rectRadius: RADIUS.tile, fill: { color: headColor }, line: { type: 'none' },
    });
    s.addShape(p.shapes.RECTANGLE, { x, y: y + 0.25, w, h: 0.25, fill: { color: headColor }, line: { type: 'none' } });
    const headTextX = side.icon ? x + 0.56 : x + 0.2;
    if (side.icon && ICONS[side.icon]) s.addImage({ path: ICONS[side.icon], x: x + 0.16, y: y + 0.11, w: 0.28, h: 0.28 });
    s.addText(side.head || '', {
      x: headTextX, y, w: x + w - 0.15 - headTextX, h: 0.5, fontFace: FONT.jpBold, bold: true,
      fontSize: SZ.h, color: C.white, valign: 'middle', margin: 0,
    });
    const bullets = (side.items || []).map((t, i) => ({
      text: t, options: { bullet: { code: '2022' }, color: C.ink, fontSize: SZ.body,
        fontFace: FONT.jp, breakLine: true, paraSpaceAfter: 8 },
    }));
    s.addText(bullets, { x: x + 0.25, y: y + 0.65, w: w - 0.5, h: h - 0.8, valign: 'top', margin: 0 });
  };
  block(left, M.edge);
  block(right, M.edge + w + gap);
  if (arrow) s.addShape(p.shapes.CHEVRON, {
    x: M.edge + w + 0.12, y: y + h / 2 - 0.28, w: 0.46, h: 0.56,
    fill: { color: C.blue }, line: { type: 'none' },
  });
}

/* ---- アイコン無し・3〜4列の特長カード（icon の代わりに番号） ---- */
function featureCards(s, p, { cards = [], y = 1.6, h = 2.9 } = {}) {
  const n = cards.length, gap = 0.3;
  const w = (M.W - M.edge * 2 - gap * (n - 1)) / n;
  cards.forEach((c, i) => {
    const x = M.edge + i * (w + gap);
    s.addShape(p.shapes.ROUNDED_RECTANGLE, {
      x, y, w, h, rectRadius: RADIUS.card, fill: { color: C.white },
      line: { color: C.rule, width: 1 }, shadow: shadow(),
    });
    // ブルーの丸タイル + 番号 or アイコン（モチーフ統一）
    const cx = x + w / 2;
    if (c.icon && ICONS[c.icon]) {
      iconBadge(s, p, { x: cx - 0.32, y: y + 0.28, d: 0.64, icon: c.icon, bg: c.iconBg || C.blue });
    } else {
      s.addShape(p.shapes.OVAL, { x: cx - 0.32, y: y + 0.28, w: 0.64, h: 0.64, fill: { color: C.blueTint }, line: { type: 'none' } });
      s.addText(String(i + 1).padStart(2, '0'), {
        x: cx - 0.32, y: y + 0.28, w: 0.64, h: 0.64, align: 'center', valign: 'middle',
        fontFace: FONT.num, bold: true, fontSize: 22, color: C.blue, margin: 0,
      });
    }
    s.addText(c.title || '', {
      x: x + 0.2, y: y + 1.05, w: w - 0.4, h: 0.6, align: 'center', valign: 'middle',
      fontFace: FONT.jpBold, bold: true, fontSize: SZ.h, color: C.navy, margin: 0,
    });
    s.addText(c.body || '', {
      x: x + 0.22, y: y + 1.62, w: w - 0.44, h: h - 1.75, align: 'center', valign: 'top',
      fontFace: FONT.jp, fontSize: SZ.small, color: C.ink, margin: 0,
    });
  });
}

/* ---- 評価表（◎○△✕） / 一般表 ---- */
const MARK = { '◎': C.blue, '○': C.green, '◯': C.green, '△': C.navy700, '✕': C.red, '×': C.red, '-': C.muted };
function dataTable(s, p, { columns = [], rows = [], y = 1.6, h, colW, firstColLeft = true, dense = false } = {}) {
  const fontSize = dense ? SZ.caption + 1 : SZ.small;
  const rowH = dense ? 0.27 : 0.34;
  const head = columns.map((c, i) => ({
    text: c, options: {
      fill: { color: C.navy }, color: C.white, bold: true, fontFace: FONT.jpBold,
      fontSize, align: i === 0 && firstColLeft ? 'left' : 'center', valign: 'middle',
    },
  }));
  const body = rows.map((r, ri) => r.map((cell, ci) => {
    const txt = typeof cell === 'object' ? cell.text : cell;
    const isMark = MARK[txt] != null && String(txt).length <= 1;
    return {
      text: String(txt),
      options: {
        fill: { color: ri % 2 ? C.mistLight : C.white },
        color: isMark ? MARK[txt] : C.ink,
        bold: isMark || (typeof cell === 'object' && cell.bold) || false,
        fontFace: FONT.jp, fontSize,
        align: ci === 0 && firstColLeft ? 'left' : 'center', valign: 'middle',
        ...(typeof cell === 'object' ? cell.options : {}),
      },
    };
  }));
  s.addTable([head, ...body], {
    x: M.edge, y, w: M.W - M.edge * 2, ...(h ? { h } : {}), ...(colW ? { colW } : {}),
    border: { type: 'solid', pt: 0.75, color: C.rule },
    rowH, margin: [3, 5, 3, 5], autoPage: false,
  });
}

/* ---- STEP チェブロン（ロードマップ） ---- */
function stepChevrons(s, p, { steps = [], y = 1.7 } = {}) {
  const n = steps.length, gap = 0.08, h = 0.7;
  const w = (M.W - M.edge * 2 - gap * (n - 1)) / n;
  steps.forEach((st, i) => {
    const x = M.edge + i * (w + gap);
    s.addShape(p.shapes.CHEVRON, {
      x, y, w, h, fill: { color: i === 0 ? C.blue : C.navy }, line: { type: 'none' },
    });
    // CHEVRON は左辺が中央でへこむ凹形状のため、テキストは中央がへこむ分だけ余分に右へ逃がす
    s.addText([
      { text: (st.label || `STEP ${i + 1}`) + '\n', options: { fontFace: FONT.jpBold, bold: true, fontSize: 12, color: C.white } },
      { text: st.period || '', options: { fontFace: FONT.jp, fontSize: 9, color: 'DCE7FB' } },
    ], { x: x + 0.42, y, w: w - 0.55, h, valign: 'middle', align: 'center', margin: 0 });
    // 下に概要テキスト
    if (st.items) s.addText(
      st.items.map((t) => ({ text: t, options: { bullet: { code: '2022' }, fontFace: FONT.jp, fontSize: SZ.small, color: C.ink, breakLine: true, paraSpaceAfter: 6 } })),
      { x: x + 0.05, y: y + h + 0.2, w: w - 0.1, h: 2.3, valign: 'top', margin: 0 }
    );
  });
}

/* ---- KPIファネル（4段階チェブロン + 目標/現状） ---- */
function kpiFunnel(s, p, { stages = [], y = 1.8 } = {}) {
  const n = stages.length, gap = 0.1, h = 0.66;
  const w = (M.W - M.edge * 2 - gap * (n - 1)) / n;
  stages.forEach((st, i) => {
    const x = M.edge + i * (w + gap);
    s.addShape(p.shapes.CHEVRON, { x, y, w, h, fill: { color: C.navy }, line: { type: 'none' } });
    s.addText(st.name || '', { x: x + 0.38, y, w: w - 0.5, h, align: 'center', valign: 'middle', fontFace: FONT.jpBold, bold: true, fontSize: 12, color: C.white, margin: 0 });
    const cardY = y + h + 0.25;
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x, y: cardY, w, h: 1.5, rectRadius: RADIUS.tile, fill: { color: C.white }, line: { color: C.rule, width: 1 }, shadow: shadow() });
    s.addText(st.metric || '', { x: x + 0.1, y: cardY + 0.12, w: w - 0.2, h: 0.3, align: 'center', fontFace: FONT.jp, fontSize: SZ.small, color: C.muted, margin: 0 });
    s.addText([
      { text: '目標 ', options: { fontFace: FONT.jp, fontSize: 10, color: C.muted } },
      { text: String(st.target || '-'), options: { fontFace: FONT.num, bold: true, fontSize: 20, color: C.blue } },
    ], { x: x + 0.1, y: cardY + 0.42, w: w - 0.2, h: 0.45, align: 'center', valign: 'middle', margin: 0 });
    s.addText([
      { text: '現状 ', options: { fontFace: FONT.jp, fontSize: 10, color: C.muted } },
      { text: String(st.actual || '-'), options: { fontFace: FONT.num, bold: true, fontSize: 16, color: C.navy } },
    ], { x: x + 0.1, y: cardY + 0.92, w: w - 0.2, h: 0.4, align: 'center', valign: 'middle', margin: 0 });
  });
}

/* ---- 2x2 ポジショニングマップ ---- */
function quadrant(s, p, { xLabels = ['', ''], yLabels = ['', ''], nodes = [], y = 1.55, h = 3.2 } = {}) {
  const x0 = M.edge + 1.0, w = M.W - M.edge * 2 - 2.0;
  const cx = x0 + w / 2, cy = y + h / 2;
  // 軸
  s.addShape(p.shapes.LINE, { x: x0, y: cy, w, h: 0, line: { color: C.navy700, width: 1.5 } });
  s.addShape(p.shapes.LINE, { x: cx, y, w: 0, h, line: { color: C.navy700, width: 1.5 } });
  // 軸ラベル
  s.addText(xLabels[1], { x: x0 + w - 1.6, y: cy + 0.05, w: 1.6, h: 0.3, align: 'right', fontFace: FONT.jp, fontSize: SZ.small, color: C.muted, margin: 0 });
  s.addText(xLabels[0], { x: x0, y: cy + 0.05, w: 1.6, h: 0.3, align: 'left', fontFace: FONT.jp, fontSize: SZ.small, color: C.muted, margin: 0 });
  s.addText(yLabels[0], { x: cx + 0.1, y, w: 2.2, h: 0.3, align: 'left', fontFace: FONT.jp, fontSize: SZ.small, color: C.muted, margin: 0 });
  s.addText(yLabels[1], { x: cx - 2.3, y: y + h - 0.3, w: 2.2, h: 0.3, align: 'right', fontFace: FONT.jp, fontSize: SZ.small, color: C.muted, margin: 0 });
  // ノード（自社はブルー、他はネイビー）
  nodes.forEach((nd) => {
    const px = cx + (nd.x || 0) * (w / 2 - 0.5);
    const py = cy - (nd.y || 0) * (h / 2 - 0.4);
    const d = nd.self ? 0.62 : 0.5;
    s.addShape(p.shapes.OVAL, { x: px - d / 2, y: py - d / 2, w: d, h: d, fill: { color: nd.self ? C.blue : C.navy }, line: { type: 'none' }, shadow: shadow({ opacity: 0.18 }) });
    s.addText(nd.label || '', { x: px - 0.7, y: py - 0.18, w: 1.4, h: 0.36, align: 'center', valign: 'middle', fontFace: FONT.jpBold, bold: true, fontSize: 10, color: C.white, margin: 0 });
  });
}

/* ---- ベン図（2〜3集合の重なり） ---- */
function vennDiagram(s, p, { sets = [], y = 1.6, h = 3.0, centerLabel } = {}) {
  const n = Math.max(2, Math.min(3, sets.length));
  const cx = M.W / 2, cy = y + h / 2;
  const r = Math.min(h, 3.2) / 2.3;
  const palette = [C.blue, C.navy700, C.green];
  const positions2 = [{ dx: -r * 0.42, dy: 0 }, { dx: r * 0.42, dy: 0 }];
  const positions3 = [{ dx: 0, dy: -r * 0.36 }, { dx: -r * 0.42, dy: r * 0.22 }, { dx: r * 0.42, dy: r * 0.22 }];
  const positions = n === 2 ? positions2 : positions3;
  const d = r * 1.5;
  sets.slice(0, n).forEach((set, i) => {
    const pos = positions[i];
    s.addShape(p.shapes.OVAL, {
      x: cx + pos.dx - d / 2, y: cy + pos.dy - d / 2, w: d, h: d,
      fill: { color: palette[i % palette.length], transparency: 62 },
      line: { color: palette[i % palette.length], width: 1.5 },
    });
  });
  const labelPos2 = [{ x: cx - r * 1.55, y: cy - 0.15 }, { x: cx + r * 0.85, y: cy - 0.15 }];
  const labelPos3 = [{ x: cx - 0.85, y: cy - r * 1.35 }, { x: cx - r * 1.55, y: cy + r * 0.65 }, { x: cx + r * 0.85, y: cy + r * 0.65 }];
  const labelPos = n === 2 ? labelPos2 : labelPos3;
  sets.slice(0, n).forEach((set, i) => {
    s.addText(set.label || '', {
      x: labelPos[i].x, y: labelPos[i].y, w: 1.7, h: 0.3, align: 'center',
      fontFace: FONT.jpBold, bold: true, fontSize: SZ.small, color: palette[i % palette.length], margin: 0,
    });
    if (set.note) s.addText(set.note, {
      x: labelPos[i].x, y: labelPos[i].y + 0.28, w: 1.7, h: 0.5, align: 'center',
      fontFace: FONT.jp, fontSize: 9, color: C.muted, margin: 0,
    });
  });
  if (centerLabel) s.addText(centerLabel, {
    x: cx - 1.0, y: cy - 0.25, w: 2.0, h: 0.5, align: 'center', valign: 'middle',
    fontFace: FONT.jpBold, bold: true, fontSize: SZ.small, color: C.white, margin: 0,
  });
}

/** ---- 組織図（ルート1 + 子ノード） ---- */
function orgChart(s, p, { root, nodes = [], y = 1.6 } = {}) {
  const boxW = 2.0, boxH = 0.6;
  const rootX = M.W / 2 - boxW / 2, rootY = y;
  s.addShape(p.shapes.ROUNDED_RECTANGLE, {
    x: rootX, y: rootY, w: boxW, h: boxH, rectRadius: RADIUS.tile,
    fill: { color: C.navy }, line: { type: 'none' }, shadow: shadow(),
  });
  s.addText(root || '', {
    x: rootX, y: rootY, w: boxW, h: boxH, align: 'center', valign: 'middle',
    fontFace: FONT.jpBold, bold: true, fontSize: SZ.h, color: C.white, margin: 0,
  });
  const n = nodes.length, gap = 0.35;
  const childW = Math.min(1.9, (M.W - M.edge * 2 - gap * (n - 1)) / n);
  const totalW = n * childW + (n - 1) * gap;
  const startX = M.W / 2 - totalW / 2;
  const trunkY = rootY + boxH + 0.28;
  const childY = trunkY + 0.05;
  s.addShape(p.shapes.LINE, { x: M.W / 2, y: rootY + boxH, w: 0, h: 0.28, line: { color: C.navy700, width: 1.25 } });
  if (n > 1) s.addShape(p.shapes.LINE, {
    x: startX + childW / 2, y: trunkY, w: totalW - childW, h: 0, line: { color: C.navy700, width: 1.25 },
  });
  nodes.forEach((nd, i) => {
    const x = startX + i * (childW + gap);
    s.addShape(p.shapes.LINE, { x: x + childW / 2, y: trunkY, w: 0, h: 0.12, line: { color: C.navy700, width: 1.25 } });
    s.addShape(p.shapes.ROUNDED_RECTANGLE, {
      x, y: childY + 0.12, w: childW, h: boxH, rectRadius: RADIUS.tile,
      fill: { color: C.white }, line: { color: C.navy700, width: 1 }, shadow: shadow(),
    });
    s.addText([
      { text: (nd.title || '') + '\n', options: { fontFace: FONT.jpBold, bold: true, fontSize: 11, color: C.ink } },
      { text: nd.sub || '', options: { fontFace: FONT.jp, fontSize: 8.5, color: C.muted } },
    ], { x, y: childY + 0.12, w: childW, h: boxH, align: 'center', valign: 'middle', margin: 0 });
  });
}

/** ---- TAM-SAM-SOM（同心円 + 右側凡例） ---- */
function tamSamSom(s, p, { layers = [], y = 1.6, h = 3.0 } = {}) {
  const n = layers.length || 3;
  const maxD = Math.min(h, 3.1);
  const cx = M.edge + maxD / 2 + 0.2, cy = y + h / 2;
  const palette = [C.mist, C.blueTint, C.blue, C.navy];
  const textPalette = [C.ink, C.ink, C.white, C.white];
  for (let i = 0; i < n; i++) {
    const d = maxD * (n - i) / n;
    s.addShape(p.shapes.OVAL, {
      x: cx - d / 2, y: cy - d / 2, w: d, h: d,
      fill: { color: palette[Math.min(i, palette.length - 1)] }, line: { color: C.white, width: 2 },
    });
  }
  const last = n - 1;
  s.addText([
    { text: (layers[last].label || '') + '\n', options: { fontFace: FONT.jpBold, bold: true, fontSize: 11, color: textPalette[Math.min(last, textPalette.length - 1)] } },
    { text: layers[last].value || '', options: { fontFace: FONT.num, bold: true, fontSize: 15, color: textPalette[Math.min(last, textPalette.length - 1)] } },
  ], { x: cx - 0.7, y: cy - 0.35, w: 1.4, h: 0.7, align: 'center', valign: 'middle', margin: 0 });

  const legX = cx + maxD / 2 + 0.5;
  const legW = M.W - M.edge - legX;
  const rowH = h / n;
  layers.forEach((L, i) => {
    const ly = y + i * rowH;
    s.addShape(p.shapes.ROUNDED_RECTANGLE, {
      x: legX, y: ly + rowH / 2 - 0.09, w: 0.18, h: 0.18, rectRadius: 0.04,
      fill: { color: palette[Math.min(i, palette.length - 1)] }, line: { color: C.rule, width: 0.75 },
    });
    s.addText([
      { text: (L.label || '') + '  ', options: { fontFace: FONT.jpBold, bold: true, fontSize: SZ.small, color: C.ink } },
      { text: L.value || '', options: { fontFace: FONT.num, bold: true, fontSize: SZ.small, color: C.blue } },
    ], { x: legX + 0.28, y: ly, w: legW - 0.28, h: rowH * 0.5, valign: 'bottom', margin: 0 });
    if (L.desc) s.addText(L.desc, {
      x: legX + 0.28, y: ly + rowH * 0.5, w: legW - 0.28, h: rowH * 0.5, fontFace: FONT.jp,
      fontSize: 9, color: C.muted, valign: 'top', margin: 0,
    });
  });
}

/** ---- ガントチャート（期間 x タスク） ---- */
function ganttChart(s, p, { periods = [], rows = [], y = 1.6, nameW = 2.2 } = {}) {
  const rowH = 0.4;
  const chartW = M.W - M.edge * 2 - nameW;
  const colW = chartW / periods.length;
  periods.forEach((label, i) => {
    s.addShape(p.shapes.RECTANGLE, { x: M.edge + nameW + i * colW, y, w: colW, h: 0.28, fill: { color: C.navy }, line: { color: C.white, width: 0.5 } });
    s.addText(label, {
      x: M.edge + nameW + i * colW, y, w: colW, h: 0.28, align: 'center', valign: 'middle',
      fontFace: FONT.jpBold, bold: true, fontSize: SZ.small, color: C.white, margin: 0,
    });
  });
  const bodyY = y + 0.28;
  rows.forEach((r, ri) => {
    const ry = bodyY + ri * rowH;
    if (ri % 2) s.addShape(p.shapes.RECTANGLE, { x: M.edge, y: ry, w: M.W - M.edge * 2, h: rowH, fill: { color: C.mistLight }, line: { type: 'none' } });
    s.addText(r.name || '', {
      x: M.edge + 0.1, y: ry, w: nameW - 0.15, h: rowH, valign: 'middle',
      fontFace: FONT.jp, fontSize: SZ.small, color: C.ink, margin: 0,
    });
    const barX = M.edge + nameW + (r.start || 0) * colW;
    const barW = (r.span || 1) * colW;
    s.addShape(p.shapes.ROUNDED_RECTANGLE, {
      x: barX + 0.03, y: ry + 0.07, w: Math.max(barW - 0.06, 0.1), h: rowH - 0.14, rectRadius: 0.06,
      fill: { color: r.color || C.blue }, line: { type: 'none' },
    });
  });
  for (let i = 0; i <= periods.length; i++) {
    s.addShape(p.shapes.LINE, { x: M.edge + nameW + i * colW, y: bodyY, w: 0, h: rowH * rows.length, line: { color: C.rule, width: 0.75 } });
  }
  s.addShape(p.shapes.LINE, { x: M.edge, y: bodyY, w: M.W - M.edge * 2, h: 0, line: { color: C.rule, width: 0.75 } });
}

/** ---- ピラミッド階層（上=希少/戦略, 下=基盤。TRIANGLE+RECTANGLE の積み上げ） ---- */
function pyramid(s, p, { layers = [], y = 1.6, h = 3.0 } = {}) {
  const n = layers.length;
  const rowGap = 0.06;
  const rowH = (h - (n - 1) * rowGap) / n;
  const maxW = 3.9;
  const cx = M.edge + maxW / 2 + 0.1;
  const palette = [C.navy, C.navy700, C.blue, C.blueTint, C.mist];
  const legX = M.edge + maxW + 0.55;
  const legW = M.W - M.edge - legX;
  // 頂点(上・小)から底辺(下・大)まで積み上げる。文字は図形内に入れず右の凡例に出す（頂点付近の凹みでの文字切れを避ける）。
  layers.forEach((L, i) => {
    const w = maxW * ((i + 1) / n);
    const x = cx - w / 2;
    const ly = y + i * (rowH + rowGap);
    const color = palette[Math.min(i, palette.length - 1)];
    if (i === 0) {
      s.addShape(p.shapes.ISOSCELES_TRIANGLE, { x, y: ly, w, h: rowH, fill: { color }, line: { color: C.white, width: 1.5 } });
    } else {
      s.addShape(p.shapes.RECTANGLE, { x, y: ly, w, h: rowH, fill: { color }, line: { color: C.white, width: 1.5 } });
    }
    s.addShape(p.shapes.ROUNDED_RECTANGLE, {
      x: legX, y: ly + rowH / 2 - 0.09, w: 0.18, h: 0.18, rectRadius: 0.04,
      fill: { color }, line: { color: C.rule, width: 0.75 },
    });
    s.addText(L.label || '', {
      x: legX + 0.28, y: ly, w: legW - 0.28, h: rowH * 0.55, fontFace: FONT.jpBold, bold: true,
      fontSize: SZ.small, color: C.ink, valign: 'bottom', margin: 0,
    });
    if (L.desc) s.addText(L.desc, {
      x: legX + 0.28, y: ly + rowH * 0.5, w: legW - 0.28, h: rowH * 0.5, fontFace: FONT.jp,
      fontSize: 9.5, color: C.muted, valign: 'top', margin: 0,
    });
  });
}

/** ---- 事例カード（ビフォー→アフターの効果を添えた事例紹介） ---- */
function caseStudyCard(s, p, { cases = [], y = 1.6, h = 2.9 } = {}) {
  const n = cases.length, gap = 0.3;
  const w = (M.W - M.edge * 2 - gap * (n - 1)) / n;
  cases.forEach((c, i) => {
    const x = M.edge + i * (w + gap);
    s.addShape(p.shapes.ROUNDED_RECTANGLE, {
      x, y, w, h, rectRadius: RADIUS.card, fill: { color: C.white },
      line: { color: C.rule, width: 1 }, shadow: shadow(),
    });
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.42, rectRadius: RADIUS.tile, fill: { color: C.navy }, line: { type: 'none' } });
    s.addShape(p.shapes.RECTANGLE, { x, y: y + 0.21, w, h: 0.21, fill: { color: C.navy }, line: { type: 'none' } });
    s.addText(c.title || '', {
      x: x + 0.15, y, w: w - 0.3, h: 0.42, fontFace: FONT.jpBold, bold: true,
      fontSize: SZ.small, color: C.white, valign: 'middle', margin: 0,
    });
    s.addText(c.summary || '', {
      x: x + 0.18, y: y + 0.55, w: w - 0.36, h: h - 0.55 - (c.before ? 0.85 : 0.15),
      fontFace: FONT.jp, fontSize: 10.5, color: C.ink, valign: 'top', margin: 0,
    });
    if (c.before && c.after) {
      const my = y + h - 0.72;
      s.addShape(p.shapes.LINE, { x: x + 0.18, y: my - 0.06, w: w - 0.36, h: 0, line: { color: C.rule, width: 0.75 } });
      s.addText([
        { text: c.before, options: { fontFace: FONT.num, bold: true, fontSize: 14, color: C.muted } },
        { text: '  →  ', options: { fontFace: FONT.jp, fontSize: 12, color: C.navy700 } },
        { text: c.after, options: { fontFace: FONT.num, bold: true, fontSize: 16, color: C.blue } },
      ], { x: x + 0.15, y: my, w: w - 0.3, h: 0.32, align: 'center', margin: 0 });
      if (c.metricLabel) s.addText(c.metricLabel, {
        x: x + 0.15, y: my + 0.3, w: w - 0.3, h: 0.24, align: 'center',
        fontFace: FONT.jp, fontSize: 9, color: C.muted, margin: 0,
      });
    }
  });
}

/** ---- ペルソナ/属性カード ---- */
function personaCard(s, p, { personas = [], y = 1.6, h = 2.9 } = {}) {
  const n = personas.length, gap = 0.3;
  const w = (M.W - M.edge * 2 - gap * (n - 1)) / n;
  personas.forEach((per, i) => {
    const x = M.edge + i * (w + gap);
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: RADIUS.card, fill: { color: C.ice }, line: { type: 'none' }, shadow: shadow() });
    s.addShape(p.shapes.OVAL, { x: x + w / 2 - 0.34, y: y + 0.22, w: 0.68, h: 0.68, fill: { color: C.blueTint }, line: { color: C.blue, width: 1.25 } });
    s.addText(per.initial || (per.name || '?').slice(0, 1), {
      x: x + w / 2 - 0.34, y: y + 0.22, w: 0.68, h: 0.68, align: 'center', valign: 'middle',
      fontFace: FONT.num, bold: true, fontSize: 20, color: C.blue, margin: 0,
    });
    s.addText(per.name || '', {
      x: x + 0.1, y: y + 0.98, w: w - 0.2, h: 0.28, align: 'center',
      fontFace: FONT.jpBold, bold: true, fontSize: SZ.h, color: C.ink, margin: 0,
    });
    s.addText(per.role || '', {
      x: x + 0.1, y: y + 1.26, w: w - 0.2, h: 0.24, align: 'center',
      fontFace: FONT.jp, fontSize: 10, color: C.muted, margin: 0,
    });
    const bullets = (per.traits || []).map((t) => ({
      text: t, options: { bullet: { code: '2022' }, color: C.ink, fontSize: 10, fontFace: FONT.jp, breakLine: true, paraSpaceAfter: 5 },
    }));
    s.addText(bullets, { x: x + 0.22, y: y + 1.58, w: w - 0.44, h: h - 1.7, valign: 'top', margin: 0 });
  });
}

/** ---- カスタマージャーニー（フェーズ×タッチポイント/心理/感情スコア） ---- */
function customerJourney(s, p, { stages = [], y = 1.6 } = {}) {
  const n = stages.length, gap = 0.15;
  const w = (M.W - M.edge * 2 - gap * (n - 1)) / n;
  stages.forEach((st, i) => {
    const x = M.edge + i * (w + gap);
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.4, rectRadius: RADIUS.tile, fill: { color: C.navy }, line: { type: 'none' } });
    s.addText(st.name || '', {
      x, y, w, h: 0.4, align: 'center', valign: 'middle', fontFace: FONT.jpBold, bold: true, fontSize: SZ.small, color: C.white, margin: 0,
    });
    const cardY = y + 0.5;
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x, y: cardY, w, h: 1.3, rectRadius: RADIUS.tile, fill: { color: C.white }, line: { color: C.rule, width: 1 }, shadow: shadow() });
    s.addText(st.touchpoint || '', {
      x: x + 0.1, y: cardY + 0.08, w: w - 0.2, h: 0.55, fontFace: FONT.jp, fontSize: 9.5, color: C.ink, valign: 'top', margin: 0,
    });
    s.addText(st.thought || '', {
      x: x + 0.1, y: cardY + 0.65, w: w - 0.2, h: 0.55, fontFace: FONT.jp, fontSize: 9, italic: true, color: C.muted, valign: 'top', margin: 0,
    });
    const barAreaY = cardY + 1.42, barAreaH = 0.5;
    s.addShape(p.shapes.RECTANGLE, { x: x + w / 2 - 0.09, y: barAreaY, w: 0.18, h: barAreaH, fill: { color: C.rule }, line: { type: 'none' } });
    const emo = Math.max(1, Math.min(5, st.emotion || 3));
    const filledH = barAreaH * (emo / 5);
    const emoColor = emo >= 4 ? C.green : emo <= 2 ? C.red : C.navy700;
    s.addShape(p.shapes.RECTANGLE, { x: x + w / 2 - 0.09, y: barAreaY + (barAreaH - filledH), w: 0.18, h: filledH, fill: { color: emoColor }, line: { type: 'none' } });
  });
}

/** ---- 汎用の見出し付きパネル（コンテナ）。中に addChart/addText/dataTable 等を自由に重ねられる。
 * 返り値のボディ領域（x,y,w,h）を使って内容を配置する。 ---- */
function panel(s, p, { x, y, w, h, head, headColor = C.navy, bodyColor = C.white, icon } = {}) {
  s.addShape(p.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: RADIUS.card, fill: { color: bodyColor }, line: { color: C.rule, width: 1 }, shadow: shadow(),
  });
  let bodyTop = y + 0.14;
  if (head) {
    const hh = 0.44;
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x, y, w, h: hh, rectRadius: RADIUS.tile, fill: { color: headColor }, line: { type: 'none' } });
    s.addShape(p.shapes.RECTANGLE, { x, y: y + hh / 2, w, h: hh / 2, fill: { color: headColor }, line: { type: 'none' } });
    const tx = icon ? x + 0.5 : x + 0.18;
    if (icon && ICONS[icon]) s.addImage({ path: ICONS[icon], x: x + 0.14, y: y + hh / 2 - 0.13, w: 0.26, h: 0.26 });
    s.addText(head, {
      x: tx, y, w: x + w - 0.15 - tx, h: hh, fontFace: FONT.jpBold, bold: true,
      fontSize: SZ.h, color: C.white, valign: 'middle', margin: 0,
    });
    bodyTop = y + hh + 0.14;
  }
  return { x: x + 0.18, y: bodyTop, w: w - 0.36, h: y + h - bodyTop - 0.14, panelX: x, panelY: y, panelW: w, panelH: h };
}

/** ---- アイコン付き縦リスト（パネル内の「メリット/デメリット」等、箇条書きより視認性を上げたい時） ---- */
function iconList(s, p, { x, y, w, items = [], rowH = 0.5, badgeColor = C.blue, iconD = 0.34, textColor = C.ink, fontSize = SZ.body } = {}) {
  items.forEach((it, i) => {
    const ry = y + i * rowH;
    const hasIcon = it.icon && ICONS[it.icon];
    if (hasIcon) iconBadge(s, p, { x, y: ry + (rowH - iconD) / 2, d: iconD, icon: it.icon, bg: it.badgeColor || badgeColor });
    s.addText(it.text || '', {
      x: x + (hasIcon ? iconD + 0.16 : 0), y: ry, w: w - (hasIcon ? iconD + 0.16 : 0), h: rowH,
      fontFace: FONT.jp, fontSize, color: textColor, valign: 'middle', margin: 0,
    });
  });
}

/** ---- プロセストレイル（① → ② → ③ の数字/アイコン丸を矢印で連結。zigzag で上下互い違いに） ---- */
function processTrail(s, p, { steps = [], y = 1.8, zigzag = false, badgeColor = C.blue, d = 0.62 } = {}) {
  const n = steps.length;
  const w = M.W - M.edge * 2;
  const gap = n > 1 ? (w - d) / (n - 1) : 0;
  const centerOf = (i) => {
    const cx = M.edge + d / 2 + i * gap;
    const cy = zigzag && i % 2 === 1 ? y - 0.32 : y + 0.32;
    return { cx, cy };
  };
  for (let i = 0; i < n - 1; i++) {
    const a = centerOf(i), b = centerOf(i + 1);
    s.addShape(p.shapes.LINE, {
      x: Math.min(a.cx, b.cx) + d * 0.42, y: Math.min(a.cy, b.cy),
      w: Math.max(Math.abs(b.cx - a.cx) - d * 0.84, 0.05), h: Math.abs(b.cy - a.cy),
      flipV: b.cy < a.cy, line: { color: C.navy700, width: 1.5, dashType: 'solid' },
    });
  }
  steps.forEach((st, i) => {
    const { cx, cy } = centerOf(i);
    iconBadge(s, p, { x: cx - d / 2, y: cy - d / 2, d, icon: st.icon, bg: st.color || badgeColor, shadowOn: true });
    if (!st.icon) s.addText(String(i + 1), {
      x: cx - d / 2, y: cy - d / 2, w: d, h: d, align: 'center', valign: 'middle',
      fontFace: FONT.num, bold: true, fontSize: 20, color: C.white, margin: 0,
    });
    s.addText(st.label || '', {
      x: cx - 0.85, y: cy + d / 2 + 0.08, w: 1.7, h: 0.6, align: 'center', valign: 'top',
      fontFace: FONT.jp, fontSize: SZ.small, color: C.ink, margin: 0,
    });
  });
}

/** ---- 認識ギャップ分析（現場の声/ペルソナ → 見えているデータ ≠ 実際に起きていること → 結論バンド）
 * 「データの数字と現場実態のズレ」を1枚で見せる時の定番構成。 ---- */
function gapAnalysis(s, p, { persona = {}, quote, left = {}, right = {}, conclusion, y = 1.55 } = {}) {
  const pd = 0.72;
  iconBadge(s, p, { x: M.edge, y, d: pd, icon: persona.icon || 'user', bg: C.navy700 });
  s.addText(persona.name || '', {
    x: M.edge - 0.2, y: y + pd + 0.02, w: pd + 0.4, h: 0.24, align: 'center',
    fontFace: FONT.jp, fontSize: 9, color: C.muted, margin: 0,
  });
  const qx = M.edge + pd + 0.25;
  s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: qx, y, w: M.W - M.edge - qx, h: pd, rectRadius: RADIUS.card, fill: { color: C.ice }, line: { type: 'none' } });
  s.addText(quote || '', {
    x: qx + 0.2, y: y + 0.08, w: M.W - M.edge - qx - 0.4, h: pd - 0.16,
    fontFace: FONT.jp, fontSize: 10.5, color: C.ink, valign: 'middle', margin: 0,
  });

  const boxY = y + pd + 0.24, boxH = 1.55, gap = 0.55;
  const boxW = (M.W - M.edge * 2 - gap) / 2;
  const box = (data, x, accentColor) => {
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x, y: boxY, w: boxW, h: boxH, rectRadius: RADIUS.card, fill: { color: C.white }, line: { color: C.rule, width: 1 }, shadow: shadow() });
    if (data.icon) iconBadge(s, p, { x: x + 0.16, y: boxY + 0.14, d: 0.32, icon: data.icon, bg: accentColor });
    s.addText(data.head || '', {
      x: x + 0.6, y: boxY + 0.12, w: boxW - 0.75, h: 0.34, fontFace: FONT.jpBold, bold: true,
      fontSize: SZ.small, color: C.ink, valign: 'middle', margin: 0,
    });
    const bullets = (data.items || []).map((t) => ({ text: t, options: { bullet: { code: '2022' }, color: C.ink, fontSize: 10, fontFace: FONT.jp, breakLine: true, paraSpaceAfter: 5 } }));
    s.addText(bullets, { x: x + 0.2, y: boxY + 0.54, w: boxW - 0.4, h: boxH - 0.64, valign: 'top', margin: 0 });
  };
  box(left, M.edge, C.blue);
  box(right, M.edge + boxW + gap, C.red);
  s.addText('≠', {
    x: M.edge + boxW, y: boxY + boxH / 2 - 0.3, w: gap, h: 0.6, align: 'center', valign: 'middle',
    fontFace: FONT.num, bold: true, fontSize: 26, color: C.navy700, margin: 0,
  });

  if (conclusion) {
    const cy2 = boxY + boxH + 0.18;
    s.addShape(p.shapes.RECTANGLE, { x: M.edge, y: cy2, w: M.W - M.edge * 2, h: 0.44, fill: { color: C.navy }, line: { type: 'none' } });
    s.addText(conclusion, {
      x: M.edge + 0.2, y: cy2, w: M.W - M.edge * 2 - 0.4, h: 0.44,
      fontFace: FONT.jpBold, bold: true, fontSize: 12, color: C.white, valign: 'middle', margin: 0,
    });
  }
}

/** ---- ビフォー/アフター パネル（数値に限らない自由記述の状態比較。事例カードより大きく書きたい時） ---- */
function beforeAfterPanels(s, p, { before = {}, after = {}, y = 1.6, h = 2.6 } = {}) {
  const gap = 0.8;
  const w = (M.W - M.edge * 2 - gap) / 2;
  const block = (data, x, isAfter) => {
    s.addShape(p.shapes.ROUNDED_RECTANGLE, {
      x, y, w, h, rectRadius: RADIUS.card, fill: { color: isAfter ? C.navy : C.mistLight },
      line: isAfter ? { type: 'none' } : { color: C.rule, width: 1 },
    });
    s.addText(data.label || (isAfter ? 'After' : 'Before'), {
      x: x + 0.2, y: y + 0.15, w: w - 0.4, h: 0.3, fontFace: FONT.jpBold, bold: true,
      fontSize: 13, color: isAfter ? C.white : C.navy700, margin: 0,
    });
    if (data.title) s.addText(data.title, {
      x: x + 0.2, y: y + 0.48, w: w - 0.4, h: 0.4, fontFace: FONT.jpBold, bold: true,
      fontSize: 14, color: isAfter ? C.white : C.ink, margin: 0,
    });
    const bullets = (data.items || []).map((t) => ({ text: t, options: { bullet: { code: '2022' }, color: isAfter ? C.mist : C.ink, fontSize: 11, fontFace: FONT.jp, breakLine: true, paraSpaceAfter: 6 } }));
    s.addText(bullets, { x: x + 0.22, y: y + 0.95, w: w - 0.44, h: h - 1.1, valign: 'top', margin: 0 });
  };
  block(before, M.edge, false);
  block(after, M.edge + w + gap, true);
  s.addShape(p.shapes.CHEVRON, { x: M.edge + w + 0.17, y: y + h / 2 - 0.28, w: 0.46, h: 0.56, fill: { color: C.blue }, line: { type: 'none' } });
}

/** ---- 結論バンド（スライド最下部・全幅の色帯で結論を一言。上部メッセージラインと併用可） ---- */
function conclusionBand(s, p, { text, y = 4.78, h = 0.44, color = C.navy, textColor = C.white } = {}) {
  s.addShape(p.shapes.RECTANGLE, { x: 0, y, w: M.W, h, fill: { color }, line: { type: 'none' } });
  s.addText(text || '', {
    x: M.edge, y, w: M.W - M.edge * 2, h, fontFace: FONT.jpBold, bold: true, fontSize: 13, color: textColor, valign: 'middle', margin: 0,
  });
}

/** ---- チェックリスト（まとめスライド等。dark:true で濃紺背景上の帯に） ---- */
function checklist(s, p, { items = [], y = 1.6, rowH = 0.62, dark = false } = {}) {
  items.forEach((it, i) => {
    const ry = y + i * rowH;
    const rh = rowH - 0.12;
    s.addShape(p.shapes.ROUNDED_RECTANGLE, {
      x: M.edge, y: ry, w: M.W - M.edge * 2, h: rh, rectRadius: RADIUS.tile,
      fill: { color: dark ? C.navy700 : C.ice }, line: { type: 'none' },
    });
    iconBadge(s, p, { x: M.edge + 0.14, y: ry + rh / 2 - 0.15, d: 0.3, icon: 'check', bg: C.blue });
    s.addText(typeof it === 'string' ? it : it.text || '', {
      x: M.edge + 0.58, y: ry, w: M.W - M.edge * 2 - 0.75, h: rh,
      fontFace: FONT.jp, fontSize: SZ.body, color: dark ? C.white : C.ink, valign: 'middle', margin: 0,
    });
  });
}

/** ---- コールアウト吹き出し（グラフの特定の値に一言添える） ---- */
function calloutBubble(s, p, { x, y, w = 1.1, h = 0.44, text, color = C.blue } = {}) {
  s.addShape(p.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, fill: { color }, line: { type: 'none' }, shadow: shadow({ opacity: 0.2 }) });
  s.addShape(p.shapes.OVAL, { x: x + w / 2 - 0.06, y: y + h - 0.05, w: 0.12, h: 0.12, fill: { color }, line: { type: 'none' } });
  s.addText(text || '', {
    x, y, w, h, align: 'center', valign: 'middle', fontFace: FONT.jpBold, bold: true, fontSize: 11, color: C.white, margin: 0,
  });
}

/** ---- LIBEO自己紹介パネル（提案書の冒頭等で「私たちについて」を見せる時。
 * name/tagline/facts の既定値は LIBEO 自身の情報） ---- */
function companyProfile(s, p, { name = LIBEO.name, tagline = LIBEO.tagline, facts = [], stats = [], y = 1.6, h = 2.9 } = {}) {
  const leftW = 4.6, gap = 0.4;
  const rightX = M.edge + leftW + gap, rightW = M.W - M.edge - rightX;
  s.addText(name, { x: M.edge, y, w: leftW, h: 0.4, fontFace: FONT.jpHeavy, bold: true, fontSize: 18, color: C.navy, margin: 0 });
  if (tagline) s.addText(tagline, { x: M.edge, y: y + 0.42, w: leftW, h: 0.5, fontFace: FONT.jp, fontSize: 11, color: C.muted, margin: 0 });
  const factY = y + 1.05;
  facts.forEach((f, i) => {
    const fy = factY + i * 0.4;
    s.addText(f.label || '', {
      x: M.edge, y: fy, w: 1.3, h: 0.34, fontFace: FONT.jpBold, bold: true, fontSize: 10, color: C.navy700, valign: 'middle', margin: 0,
    });
    s.addText(f.value || '', {
      x: M.edge + 1.35, y: fy, w: leftW - 1.35, h: 0.34, fontFace: FONT.jp, fontSize: 11, color: C.ink, valign: 'middle', margin: 0,
    });
  });
  const n = stats.length || 1, rowGap = 0.15, rowH = (h - (n - 1) * rowGap) / n;
  stats.forEach((st, i) => {
    const sy = y + i * (rowH + rowGap);
    s.addShape(p.shapes.ROUNDED_RECTANGLE, {
      x: rightX, y: sy, w: rightW, h: rowH, rectRadius: RADIUS.card, fill: { color: C.ice }, line: { type: 'none' }, shadow: shadow(),
    });
    s.addText(st.label || '', { x: rightX + 0.2, y: sy + 0.1, w: rightW - 0.4, h: 0.3, fontFace: FONT.jp, fontSize: 10, color: C.muted, margin: 0 });
    s.addText([
      { text: String(st.value), options: { fontFace: FONT.num, bold: true, fontSize: 24, color: C.blue } },
      { text: st.unit ? ' ' + st.unit : '', options: { fontFace: FONT.jpBold, bold: true, fontSize: 11, color: C.navy } },
    ], { x: rightX + 0.2, y: sy + 0.36, w: rightW - 0.4, h: rowH - 0.5, valign: 'middle', margin: 0 });
  });
}

/** ---- プラン比較表（料金プラン。featured:true のプランをネイビーで強調） ---- */
function pricingTable(s, p, { plans = [], y = 1.6, h = 2.9 } = {}) {
  const n = plans.length, gap = 0.25;
  const w = (M.W - M.edge * 2 - gap * (n - 1)) / n;
  plans.forEach((pl, i) => {
    const x = M.edge + i * (w + gap);
    const featured = !!pl.featured;
    const topY = featured ? y - 0.1 : y;
    const boxH = featured ? h + 0.1 : h;
    s.addShape(p.shapes.ROUNDED_RECTANGLE, {
      x, y: topY, w, h: boxH, rectRadius: RADIUS.card,
      fill: { color: featured ? C.navy : C.white },
      line: featured ? { type: 'none' } : { color: C.rule, width: 1 },
      shadow: shadow(featured ? { opacity: 0.22 } : {}),
    });
    if (featured) {
      s.addShape(p.shapes.ROUNDED_RECTANGLE, {
        x: x + w / 2 - 0.55, y: topY - 0.15, w: 1.1, h: 0.28, rectRadius: 0.14, fill: { color: C.blue }, line: { type: 'none' },
      });
      s.addText('おすすめ', {
        x: x + w / 2 - 0.55, y: topY - 0.15, w: 1.1, h: 0.28, align: 'center', valign: 'middle',
        fontFace: FONT.jpBold, bold: true, fontSize: 9, color: C.white, margin: 0,
      });
    }
    s.addText(pl.name || '', {
      x: x + 0.2, y: topY + 0.22, w: w - 0.4, h: 0.32, align: 'center',
      fontFace: FONT.jpBold, bold: true, fontSize: 14, color: featured ? C.white : C.ink, margin: 0,
    });
    s.addText([
      { text: String(pl.price || ''), options: { fontFace: FONT.num, bold: true, fontSize: 24, color: featured ? C.white : C.blue } },
      { text: pl.priceUnit ? ' ' + pl.priceUnit : '', options: { fontFace: FONT.jp, fontSize: 11, color: featured ? C.mist : C.muted } },
    ], { x: x + 0.2, y: topY + 0.58, w: w - 0.4, h: 0.46, align: 'center', margin: 0 });
    const bullets = (pl.items || []).map((t) => ({
      text: t, options: { bullet: { code: '2713' }, color: featured ? C.white : C.ink, fontSize: 10.5, fontFace: FONT.jp, breakLine: true, paraSpaceAfter: 6 },
    }));
    s.addText(bullets, { x: x + 0.3, y: topY + 1.18, w: w - 0.5, h: boxH - 1.3, valign: 'top', margin: 0 });
  });
}

/** ---- タイムライン（日付付きマイルストーン。zigzag上下でganttより軽い年表向け） ---- */
function timeline(s, p, { milestones = [], y = 2.7 } = {}) {
  const n = milestones.length;
  const x0 = M.edge + 0.35, x1 = M.W - M.edge - 0.35;
  s.addShape(p.shapes.LINE, { x: x0, y, w: x1 - x0, h: 0, line: { color: C.navy700, width: 2 } });
  const step = n > 1 ? (x1 - x0) / (n - 1) : 0;
  milestones.forEach((ms, i) => {
    const cx = n > 1 ? x0 + i * step : (x0 + x1) / 2;
    const d = 0.22;
    s.addShape(p.shapes.OVAL, {
      x: cx - d / 2, y: y - d / 2, w: d, h: d, fill: { color: ms.color || C.blue }, line: { color: C.white, width: 2 },
    });
    const above = i % 2 === 0;
    const dateY = above ? y - 0.42 : y + 0.2;
    const labelY = above ? y - 0.78 : y + 0.42;
    const descY = above ? y - 1.18 : y + 0.78;
    s.addText(ms.date || '', {
      x: cx - 0.8, y: dateY, w: 1.6, h: 0.22, align: 'center',
      fontFace: FONT.num, bold: true, fontSize: 10, color: C.navy700, margin: 0,
    });
    s.addText(ms.label || '', {
      x: cx - 0.85, y: labelY, w: 1.7, h: 0.32, align: 'center',
      fontFace: FONT.jpBold, bold: true, fontSize: 11, color: C.ink, margin: 0,
    });
    if (ms.desc) s.addText(ms.desc, {
      x: cx - 0.85, y: descY, w: 1.7, h: 0.36, align: 'center',
      fontFace: FONT.jp, fontSize: 9, color: C.muted, margin: 0,
    });
  });
}

/* ---- 注釈/出典（スライド下部・本文より小さく） ---- */
function note(s, text, { y = 4.78 } = {}) {
  s.addText(text, { x: M.edge, y, w: M.W - M.edge * 2, h: 0.3, fontFace: FONT.jp, fontSize: SZ.caption, color: C.muted, italic: true, margin: 0 });
}

/** 締め（濃紺背景。CTAや電話番号は入れない。logo に白ロゴを渡せば中央上に配置） */
function closingSlide(p, { title = 'ご清覧ありがとうございました', lines = [], client, logo } = {}) {
  const s = p.addSlide();
  s.background = { color: C.navy };
  s.addImage({ path: A.dotsBlue, x: 0, y: 0, w: M.W, h: M.H, transparency: 55 });
  brandLogo(s, p, { logo, name: client, x: (M.W - 3.0) / 2, y: 1.45, w: 3.0, h: 0.7, align: 'center' });
  s.addText(title, {
    x: 0.8, y: 2.45, w: M.W - 1.6, h: 0.7, align: 'center', valign: 'middle',
    fontFace: FONT.jpHeavy, bold: true, fontSize: 28, color: C.white, margin: 0,
  });
  if (lines.length) s.addText(lines.join('\n'), {
    x: 1, y: 3.25, w: M.W - 2, h: 0.9, align: 'center',
    fontFace: FONT.jp, fontSize: 13, color: C.mist, lineSpacingMultiple: 1.3, margin: 0,
  });
  return s;
}

/* ---- ブランド配色のチャート既定 ---- */
function chartTheme(extra = {}) {
  return {
    chartColors: [C.blue, C.navy, C.green, C.mist, C.navy700, C.red],
    chartArea: { fill: { color: C.white } },
    catAxisLabelColor: C.muted, valAxisLabelColor: C.muted,
    catAxisLabelFontFace: FONT.jp, valAxisLabelFontFace: FONT.jp,
    catAxisLabelFontSize: 10, valAxisLabelFontSize: 10,
    valGridLine: { color: C.rule, size: 0.5 }, catGridLine: { style: 'none' },
    showLegend: false, ...extra,
  };
}

module.exports = {
  C, FONT, SZ, M, RADIUS, A, ICONS, LIBEO, shadow,
  newDeck, save, marker, iconBadge, brandLogo, footer, contentSlide, titleSlide, sectionDivider,
  agenda, statCallout, miniKpiRow, chartWithInsights, twoColContrast, featureCards, dataTable, stepChevrons,
  kpiFunnel, quadrant, vennDiagram, orgChart, tamSamSom, ganttChart, pyramid, caseStudyCard,
  personaCard, customerJourney, panel, iconList, processTrail, gapAnalysis, beforeAfterPanels,
  conclusionBand, checklist, calloutBubble, companyProfile, pricingTable, timeline, note, closingSlide, chartTheme,
};
