/* 花光向け レポートテーマ — 参照デッキ（視覚仕様書）生成
 * theme.js の全パーツ（才流由来の基本パーツ＋今回追加した高密度パーツ）を
 * 一通り使い切ったサンプル。新しいスライドを作る際のコピー元にする。 */
const T = require('./theme.js');
const { C } = T;

(async () => {
  const p = T.newDeck({ title: 'Web集客 月次レポート' });

  /* 1. 表紙 */
  T.titleSlide(p, {
    title: 'Web集客 月次レポート',
    subtitle: '2026年6月度',
    client: '株式会社花光',          // logo: '/path/to/hanamitsu-logo-white.png' を渡せばロゴに
    date: '2026年6月',
    presenter: '株式会社LIBEO',
  });

  /* 2. アジェンダ */
  T.agenda(p, {
    title: '本日お伝えすること',
    page: 1,
    items: [
      '今月のサマリー（KPIハイライト）', '検索流入の推移と要因', 'データ運用の認識ギャップ',
      '競合サイトとのポジション比較', '改善のビフォー/アフター', '来月の打ち手とロードマップ',
    ],
  });

  /* 3. 章扉 */
  T.sectionDivider(p, { no: 1, total: 3, title: '今月のサマリー' });

  /* 4. 数値ハイライト */
  {
    const s = T.contentSlide(p, {
      kicker: 'サマリー', page: 3,
      title: 'KPIハイライト',
      message: '自然検索流入が前月比 +18% と伸長。問い合わせ数も過去最高を更新しました。',
    });
    T.statCallout(s, p, {
      y: s.bodyTop, h: 1.6,
      items: [
        { label: '自然検索セッション', value: '24,310', unit: '', delta: '▲ +18.2%', deltaColor: C.green },
        { label: '問い合わせ件数', value: '86', unit: '件', delta: '▲ +12件', deltaColor: C.green },
        { label: '電話CV率', value: '3.4', unit: '%', delta: '▼ -0.2pt', deltaColor: C.red },
        { label: '平均掲載順位', value: '8.6', unit: '位', delta: '▲ +1.3', deltaColor: C.green },
      ],
    });
    T.note(s, '出典: Google Search Console / GA4（2026-06-01〜06-30）。電話CVは Salesforce 連携データ。');
  }

  /* 5. グラフ＋読み解き（複合パーツで密度アップ） */
  {
    const s = T.contentSlide(p, {
      kicker: 'サマリー', page: 4,
      title: '検索流入の推移',
      message: '4月の構造化データ実装以降、表示回数・クリック数ともに右肩上がりです。',
    });
    T.chartWithInsights(s, p, {
      chartType: p.charts.LINE,
      chartData: [{ name: 'クリック数', labels: ['1月', '2月', '3月', '4月', '5月', '6月'], values: [12100, 13050, 13800, 16200, 20500, 24310] }],
      chartOptions: { lineSize: 3, lineSmooth: true, lineDataSymbol: 'circle', showValue: false },
      y: s.bodyTop, h: 2.7,
      insights: ['4月の構造化データ実装が起点', '地域ページのリライトが寄与', '指名検索も微増傾向'],
    });
  }

  /* 6. ミニKPIストリップ＋評価表（1枚の情報密度を上げる構成） */
  {
    const s = T.contentSlide(p, {
      kicker: 'サマリー', page: 5,
      title: '主要指標と媒体別の内訳',
      message: '全体指標に加えて、媒体別の内訳まで1枚で俯瞰できるようにしています。',
    });
    T.miniKpiRow(s, p, {
      y: s.bodyTop, h: 0.62,
      items: [
        { label: 'セッション', value: '24,310', delta: '▲18.2%', deltaColor: C.green },
        { label: '問い合わせ', value: '86', unit: '件', delta: '▲12件', deltaColor: C.green },
        { label: 'CV率', value: '3.4', unit: '%', delta: '▼0.2pt', deltaColor: C.red },
        { label: '平均順位', value: '8.6', unit: '位', delta: '▲1.3', deltaColor: C.green },
      ],
    });
    T.dataTable(s, p, {
      y: s.bodyTop + 0.85, dense: true,
      colW: [2.6, 1.7, 1.7, 1.7, 1.15],
      columns: ['媒体', 'セッション', '問い合わせ', 'CV率', '評価'],
      rows: [
        ['自然検索（SEO）', '15,420', '52件', '3.4%', '◎'],
        ['Google広告', '5,280', '21件', '4.0%', '○'],
        ['SNS経由', '2,140', '8件', '3.7%', '○'],
        ['指名検索', '1,470', '5件', '3.4%', '△'],
      ],
    });
  }

  /* 7. 認識ギャップ分析（現場の声 × データの実態） */
  {
    const s = T.contentSlide(p, {
      kicker: 'データ運用', page: 6,
      title: 'CRMデータと現場実態のズレ',
      message: 'CRM上の指標だけでは「問い合わせ質の変化」に気づくまで時間がかかっています。',
    });
    T.gapAnalysis(s, p, {
      y: s.bodyTop,
      persona: { icon: 'user', name: 'マーケ担当' },
      quote: '検索広告で「対応外×薬剤名×効かない」の語句からCVが取れている。この系統を強化したい。',
      left: {
        icon: 'search', head: 'CRMで見えているデータ',
        items: ['問い合わせ率は上昇（数値上は良好）', '失注理由は「対象外」として記録', '現調獲得率が低下（原因が見えない）'],
      },
      right: {
        icon: 'warning', head: '実際に起きていること',
        items: ['低単価層（対応外の問い合わせ）が増加', '現調まで至らない問い合わせが増えている', '失注内訳がCRM上で区別できない'],
      },
      conclusion: '→ CRMのデータだけでは「問い合わせ質の変化」を把握できず、気づきに時間とコストが生じる',
    });
  }

  /* 8. 2カラム対比（アイコン付き見出し） */
  {
    const s = T.contentSlide(p, {
      kicker: '課題と打ち手', page: 7,
      title: '残課題と次の一手',
      message: '流入は伸びた一方、CV率に伸びしろ。導線とフォームの改善を優先します。',
    });
    T.twoColContrast(s, p, {
      y: s.bodyTop, h: 2.7,
      left: { head: '現状の課題', headColor: C.red, icon: 'warning', items: [
        'コラム流入は多いが問い合わせに繋がりにくい', '電話CTAがファーストビュー外', 'フォーム離脱率が 62% と高い', 'スマホでの表示速度に改善余地',
      ] },
      right: { head: '来月の施策', headColor: C.green, icon: 'check', items: [
        'コラム末尾に地域別CTAを設置', '追従電話ボタンを常時表示', 'フォーム項目を9→5に削減', '画像のWebP化・遅延読込を実装',
      ] },
    });
  }

  /* 9. ビフォー/アフター（自由記述の状態比較） */
  {
    const s = T.contentSlide(p, {
      kicker: '改善提案', page: 8,
      title: 'フォーム改善のビフォー/アフター',
      message: '入力項目を絞り、スマホでの完了率を優先したフォームに刷新します。',
    });
    T.beforeAfterPanels(s, p, {
      y: s.bodyTop, h: 2.6,
      before: { label: 'Before', title: '入力9項目・完了率38%', items: ['氏名・フリガナを別項目で要求', '住所を都道府県〜番地まで必須', '相談内容を自由記述のみ'] },
      after: { label: 'After', title: '入力5項目・完了率想定55%+', items: ['フリガナは自動生成に変更', '市区町村までの入力に簡略化', '相談内容はチェック選択式に'] },
    });
  }

  /* 10. 特長カード（アイコン付き） */
  {
    const s = T.contentSlide(p, {
      kicker: '提案', page: 9,
      title: '次フェーズで強化する3領域',
      message: '「コンテンツ」「導線」「指名検索」の3点を同時に伸ばす設計です。',
    });
    T.featureCards(s, p, {
      y: s.bodyTop, h: 2.7,
      cards: [
        { icon: 'document', title: '地域コンテンツの拡充', body: '市区町村別ページを30件追加し、ローカル検索の網羅率を高める。' },
        { icon: 'funnel', title: 'CV導線の最適化', body: '追従CTA・フォーム改善で、流入を取りこぼさず問い合わせへ繋ぐ。' },
        { icon: 'megaphone', title: '指名検索の育成', body: 'SNS・実績PRでブランド想起を高め、安定した指名流入を作る。' },
      ],
    });
  }

  /* 11. 評価表（◎○△✕） */
  {
    const s = T.contentSlide(p, {
      kicker: '競合比較', page: 10,
      title: '主要KBFでの競合ポジション',
      message: '「実績の見せ方」「保証の手厚さ」で優位。価格表現に改善余地があります。',
    });
    T.dataTable(s, p, {
      y: s.bodyTop,
      colW: [2.6, 1.5, 1.45, 1.45, 1.45],
      columns: ['購買決定要因（KBF）', '当サイト', 'A社', 'B社', 'C社'],
      rows: [
        ['施工実績の網羅性', '◎', '○', '△', '✕'],
        ['料金のわかりやすさ', '△', '◎', '○', '○'],
        ['保証制度の手厚さ', '◎', '△', '○', '✕'],
        ['対応エリアの広さ', '○', '◎', '△', '○'],
        ['口コミ・評判', '○', '○', '◎', '△'],
      ],
    });
    T.note(s, '◎ 優位 / ○ 同等 / △ やや劣位 / ✕ 劣位。評価は2026年6月時点の各社サイト調査に基づく。');
  }

  /* 12. ポジショニングマップ */
  {
    const s = T.contentSlide(p, {
      kicker: '競合環境', page: 11,
      title: 'ポジショニングマップ',
      message: '「実績の豊富さ × 価格の明快さ」で、当サイトは右上の空白地帯を狙えます。',
    });
    T.quadrant(s, p, {
      y: s.bodyTop, h: 2.8,
      xLabels: ['価格が不透明', '価格が明快'],
      yLabels: ['実績が豊富', '実績が乏しい'],
      nodes: [
        { label: '当サイト', x: 0.55, y: 0.6, self: true },
        { label: 'A社', x: 0.5, y: -0.3 },
        { label: 'B社', x: -0.5, y: 0.4 },
        { label: 'C社', x: -0.6, y: -0.5 },
      ],
    });
  }

  /* 13. ベン図（重複領域の説明） */
  {
    const s = T.contentSlide(p, {
      kicker: '市場理解', page: 12,
      title: '狙うべき顧客ニーズの重なり',
      message: '「価格重視」と「実績重視」が交差する層に対して、保証訴求が刺さります。',
    });
    T.vennDiagram(s, p, {
      y: s.bodyTop, h: 2.9,
      sets: [
        { label: '価格重視層', note: '見積もり比較を重視' },
        { label: '実績重視層', note: '施工件数・口コミを重視' },
        { label: '保証重視層', note: '長期保証の有無を重視' },
      ],
      centerLabel: '狙うべき\n中心顧客',
    });
  }

  /* 14. 組織図（対応体制） */
  {
    const s = T.contentSlide(p, {
      kicker: '実行体制', page: 13,
      title: 'プロジェクト実行体制',
      message: 'LIBEO側のディレクターを窓口に、専門チームで各施策を分担します。',
    });
    T.orgChart(s, p, {
      y: s.bodyTop,
      root: 'ディレクター（窓口）',
      nodes: [
        { title: 'SEO担当', sub: 'コンテンツ・内部対策' },
        { title: '広告運用担当', sub: 'Google/SNS広告' },
        { title: 'デザイナー', sub: 'LP・バナー制作' },
        { title: 'データ分析担当', sub: 'GA4/CRM連携' },
      ],
    });
  }

  /* 15. TAM-SAM-SOM */
  {
    const s = T.contentSlide(p, {
      kicker: '市場規模', page: 14,
      title: '対応可能な市場規模の整理',
      message: '当面はSOM（即応可能な顧客）の刈り取り精度を優先して高めます。',
    });
    T.tamSamSom(s, p, {
      y: s.bodyTop, h: 2.9,
      layers: [
        { label: 'TAM', value: '約120億円', desc: '地域の関連市場全体' },
        { label: 'SAM', value: '約38億円', desc: '対応可能エリア×客層' },
        { label: 'SOM', value: '約4.2億円', desc: '当面刈り取り可能な需要' },
      ],
    });
  }

  /* 16. ガントチャート */
  {
    const s = T.contentSlide(p, {
      kicker: 'ロードマップ', page: 15,
      title: '実行スケジュール（ガント）',
      message: '7月にデータ基盤を整備し、8月以降は導線改善と計測を並行して進めます。',
    });
    T.ganttChart(s, p, {
      y: s.bodyTop,
      periods: ['7月', '8月', '9月', '10月', '11月', '12月'],
      rows: [
        { name: 'CRM項目整備', start: 0, span: 1.5, color: C.blue },
        { name: '地域ページ拡充', start: 0.5, span: 2, color: C.navy700 },
        { name: 'フォーム改善', start: 1.5, span: 1, color: C.green },
        { name: '追従CTA実装', start: 2, span: 1, color: C.green },
        { name: '効果測定・改善', start: 3, span: 3, color: C.blue },
      ],
    });
  }

  /* 17. ピラミッド階層 */
  {
    const s = T.contentSlide(p, {
      kicker: '戦略整理', page: 16,
      title: '取り組みの優先順位ピラミッド',
      message: '土台となるデータ精度から着手し、最終的に指名検索の育成へ積み上げます。',
    });
    T.pyramid(s, p, {
      y: s.bodyTop, h: 2.9,
      layers: [
        { label: '指名検索の育成', desc: 'ブランド想起' },
        { label: 'CV導線の最適化', desc: 'フォーム・CTA改善' },
        { label: 'コンテンツ拡充', desc: '地域ページ・構造化データ' },
        { label: 'データ精度の担保', desc: 'CRM/GA4の整備' },
      ],
    });
  }

  /* 18. 事例カード */
  {
    const s = T.contentSlide(p, {
      kicker: '参考事例', page: 17,
      title: '類似施策での改善事例',
      message: '同種の施策で、いずれも問い合わせ数が2倍前後に伸びた実績があります。',
    });
    T.caseStudyCard(s, p, {
      y: s.bodyTop, h: 2.9,
      cases: [
        { title: '地域ページ拡充事例', summary: '近隣30エリアのページを新設し、地域名×サービス名の検索順位が改善。', before: '32件/月', after: '68件/月', metricLabel: '問い合わせ件数' },
        { title: 'フォーム改善事例', summary: '入力項目を半減し、スマホ完了率を重視したUIに刷新。', before: '35%', after: '58%', metricLabel: 'フォーム完了率' },
        { title: '追従CTA導入事例', summary: 'コラム記事に追従型の電話・問い合わせボタンを常時表示。', before: '1.8%', after: '3.6%', metricLabel: 'CV率' },
      ],
    });
  }

  /* 19. ペルソナカード */
  {
    const s = T.contentSlide(p, {
      kicker: '顧客理解', page: 18,
      title: '主要ペルソナの整理',
      message: '年齢層・検討軸の異なる2つのペルソナに向けて、訴求を出し分けます。',
    });
    T.personaCard(s, p, {
      y: s.bodyTop, h: 2.9,
      personas: [
        { name: '緊急対応layer', role: '30代・持ち家・初回相談', traits: ['トラブル発生で即日対応を希望', '価格より対応速度を重視', 'スマホで検索し即電話'] },
        { name: '比較検討layer', role: '40代・持ち家・複数社比較中', traits: ['3〜5社を見積もり比較', '保証内容と実績を重視', 'コラムを読み込んでから問い合わせ'] },
        { name: '情報収集layer', role: '50代・将来の備えとして検討', traits: ['まだ緊急性は低い', '事例・口コミを重視', 'メルマガや資料請求で情報収集'] },
      ],
    });
  }

  /* 20. カスタマージャーニー */
  {
    const s = T.contentSlide(p, {
      kicker: '顧客理解', page: 19,
      title: '問い合わせまでのカスタマージャーニー',
      message: '比較検討フェーズでの離脱が最も多く、事例コンテンツの拡充が鍵になります。',
    });
    T.customerJourney(s, p, {
      y: s.bodyTop,
      stages: [
        { name: '認知', touchpoint: '検索広告・SNS広告', thought: '「対応してくれる会社はあるか」', emotion: 3 },
        { name: '興味', touchpoint: 'コラム記事・事例ページ', thought: '「ここは信頼できそうか」', emotion: 3 },
        { name: '比較検討', touchpoint: '料金ページ・口コミサイト', thought: '「他社と比べてどうか」', emotion: 2 },
        { name: '問い合わせ', touchpoint: 'フォーム・電話', thought: '「今すぐ相談したい」', emotion: 4 },
        { name: '契約後', touchpoint: '施工・アフターフォロー', thought: '「対応は満足できたか」', emotion: 5 },
      ],
    });
  }

  /* 21. プロセストレイル（zigzag） */
  {
    const s = T.contentSlide(p, {
      kicker: '実行プロセス', page: 20,
      title: 'データ改善の実行プロセス',
      message: '「発見→分類→ルール化→運用定着」の4段階で、CRMデータの精度を上げます。',
    });
    T.processTrail(s, p, {
      y: s.bodyTop + 0.5, zigzag: true,
      steps: [
        { icon: 'search', label: 'エラーケースの発見' },
        { icon: 'funnel', label: '課題の分類' },
        { icon: 'document', label: '記入ルール整備' },
        { icon: 'refresh', label: '定期運用に定着' },
      ],
    });
  }

  /* 22. チェックリスト（まとめ） */
  {
    const s = T.contentSlide(p, {
      kicker: 'まとめ', page: 21,
      title: '今月のまとめと次のステップ',
      message: 'データ精度・導線・指名検索の3点を来月も継続してモニタリングします。',
    });
    T.checklist(s, p, {
      y: s.bodyTop,
      items: [
        '記載漏れの定期チェックでデータ精度を確保する',
        'フォーム改善とCTA常時表示でCV導線を強化する',
        '地域コンテンツを拡充し指名検索の育成につなげる',
      ],
    });
    T.conclusionBand(s, p, { text: '→ 来月は「データ精度」と「CV導線」の両輪で改善を継続します。' });
  }

  /* 23. 章扉（2） */
  T.sectionDivider(p, { no: 2, total: 3, title: '来月の打ち手' });

  /* 24. KPIファネル */
  {
    const s = T.contentSlide(p, {
      kicker: '目標設定', page: 23,
      title: '来期のKPIツリー',
      message: '流入→相談→受注の各段階で目標を設定し、ボトルネックを可視化します。',
    });
    T.kpiFunnel(s, p, {
      y: s.bodyTop,
      stages: [
        { name: '検索流入', metric: 'セッション/月', target: '32,000', actual: '24,310' },
        { name: 'サイト相談', metric: '問い合わせ/月', target: '120', actual: '86' },
        { name: '商談', metric: '現地調査/月', target: '70', actual: '52' },
        { name: '受注', metric: '成約/月', target: '40', actual: '29' },
      ],
    });
  }

  /* 25. STEPロードマップ */
  {
    const s = T.contentSlide(p, {
      kicker: 'ロードマップ', page: 24,
      title: '中期ロードマップ（3フェーズ）',
      message: 'まず土台（コンテンツ）、次に刈り取り（導線）、最後にブランド（指名）の順で積み上げます。',
    });
    T.stepChevrons(s, p, {
      y: s.bodyTop,
      steps: [
        { label: 'STEP 1', period: '7〜9月', items: ['地域ページ拡充', '構造化データ完備', '内部リンク最適化'] },
        { label: 'STEP 2', period: '10〜12月', items: ['CV導線の全面改善', 'フォーム最適化', 'A/Bテスト運用'] },
        { label: 'STEP 3', period: '1〜3月', items: ['指名検索の育成', '実績・口コミPR', 'SNS連携強化'] },
      ],
    });
  }

  /* 26. 締め */
  T.closingSlide(p, {
    client: '株式会社花光',          // logo を渡せば白ロゴを表示
    title: 'ご清覧ありがとうございました',
    lines: ['ご不明点・追加のご要望がございましたら', '担当までお申し付けください。'],
  });

  await T.save(p, 'reference-deck.pptx');
  console.log('done');
})();
