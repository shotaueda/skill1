---
name: ouchi-no-mikata-slides
description: >
  株式会社LIBEO が「案件ごとのクライアント」向けに作る報告・提案スライドの共通テーマ。
  クライアント名・ロゴは固定ではなく、案件ごとに渡すパラメータ（client/logo）。
  才流（SAIRU）テンプレートの構造的な見せ方を、寒色系のブランド配色（ブルー #2F6FEB を中心＋
  ネイビー・アイス・ミスト）でリスキンしたもの。月次のWeb集客/SEOレポート、施策提案、競合比較、
  ロードマップ、KPI報告、データ運用の課題整理、料金プラン提案、自社紹介（About us）などに適用する。
  コンサルティングレポート水準の情報密度（アイコン・複合パネル・プロセス図・ギャップ分析等）まで
  組み立てられる。出力は原則、編集可能な .pptx（クライアント納品想定）。
  「報告内容に対して誠実で、分かりやすく、正確」であることを最優先する。
  ロゴは案件のクライアントの白ロゴを濃色背景にのみ使用。電話番号やCTAボタンは入れない。
---

# LIBEO クライアント報告・提案スライド 共通テーマ

株式会社LIBEO が、**案件ごとのクライアント**向けに作る報告・提案スライドのための共通テーマ。
**特定の1社に固定されたテーマではない**。花光・その他どの案件でも、クライアント名・ロゴ・数値・
メッセージを差し替えるだけで同じ品質のスライドが作れるように設計している。

配色・レイアウトは才流テンプレートの構造を、寒色系のブランドカラーでリスキンしている。
`theme.js`（PptxGenJS 用のトークン＋共通パーツ）、`assets/`（質感素材・アイコン）、
`reference-deck.pptx`（視覚仕様書 兼 動作見本／全29枚、架空案件「株式会社サンプル」向けで作成）で構成。

> 「制作者＝株式会社LIBEO」は固定（`theme.js` の `LIBEO` 定数に実データを保持）。
> 「クライアント＝案件ごとに変わる相手先」は毎回パラメータで渡す（`client`/`logo`）。
> この2つを混同しない。クライアントの実際のブランドと関係のないロゴ・マスコット・キャラクターは
> 絶対に使わない（そのクライアントの正式なロゴ以外を表紙・締めに置かない）。

## 制作の基本思想（3原則）

1. **誠実さ＞演出**。これはクライアント報告資料。一見おしゃれだが内容が伝わらない形式は避け、
   結論（メッセージライン）と根拠（データ）を明確に示す。勢い重視の装飾（袋文字・斜めリボン・ハーフトーン）は
   **表紙・章扉・締めの濃色面だけ**に限定し、データ面では使わない。
2. **白を主役にする**。地は白（可読性）。ネイビー＝構造、アイス/ミスト＝面のまとまり、ブルー＝アクセント信号。
   ブルー #2F6FEB は**毎スライドに最低1点**効かせ、テーマの統一感を出す。
3. **アクセントを1系統に統一**。ブルーの小マーカー（kicker・メッセージ帯の頭）／ブルーの番号タイルや
   アイコンバッジ（カード）／ブルーの大番号（章扉）——という「ブルーの幾何アクセント」で一貫させる。
   色帯やタイトル下のアンダーラインを装飾として足さない。

---

## 0. 制作者情報（LIBEO自身。固定）

`theme.js` の `LIBEO` 定数に、株式会社LIBEO自身の公開情報を保持している。

```js
const { LIBEO } = require('./theme.js');
// LIBEO.name        => '株式会社LIBEO'
// LIBEO.url         => 'https://libeo.co.jp/'
// LIBEO.address     => '〒550-0013 大阪府大阪市西区新町1-24-11 新町F1ビル502'
// LIBEO.established => '2018年5月8日'
// LIBEO.ceo         => '嘉島 元貴'
// LIBEO.capital     => '資本金900万円'
// LIBEO.business    => 'Webマーケティング・Web制作・プロダクションマネジメント事業'
```

- `titleSlide` の `presenter` は既定値が `LIBEO.name`。案件ごとに指定し直す必要はない
  （表紙下部に「制作: 株式会社LIBEO」相当の表記が自動で入る）。
- 提案書の冒頭やアポ資料で「私たちについて」を見せたい場合は `companyProfile` を使う（§3）。
- これらは**LIBEO自身の情報**であり、**クライアントの情報ではない**。クライアント名・ロゴは
  常に `client`/`logo` パラメータで別途渡す。

---

## 1. デザイン定義

### カラー（必ず役割で使う / `theme.js` の `C`）

| トークン | HEX | 役割 |
|---|---|---|
| `blue` | **#2F6FEB** | ブランド中心色。アクセント信号。kicker・キー数値・マーカー・アイコンバッジ・肯定強調。**毎スライド1点以上** |
| `blueDeep` | #1E4FC0 | 押下・陰影・グラデ下端 |
| `blueTint` | #E3ECFC | 薄い青の面・番号タイル地・ハイライト地 |
| `navy` | **#13223B** | 構造色（才流のネイビーの役割）。表ヘッダ・見出し帯・章扉・チェブロン・ノード・濃色背景 |
| `navy700` | #3C5478 | 副次のネイビー（軸・補助・第二アクセント） |
| `mist` | **#D8E3F0** | ミストブルー。帯・補助背景 |
| `mistLight` | #EAF0F8 | 表のストライプ |
| `ice` | **#EDF2FA** | アイス。カード地・章扉地・メッセージ帯 |
| `green` | **#2E9E6B** | 肯定 / 改善 / 自社の強み |
| `red` | **#D73120** | 否定 / リスク / 悪化 / 注意 |
| `yellow` | #FFD23C | ハイライトマーカー。**1スライドに1語まで** |
| `ink` | #1B2430 | 本文・見出し（紺寄りの黒。純黒は使わない） |
| `muted` | #5B6B82 | 補足・出典・キャプション |
| `rule` | #E1E7F0 | ヘアライン |
| `white` | #FFFFFF | 既定の地。濃色背景上のロゴ/文字 |

**ドミナンス（60/30/10）**: 白 60% / ネイビー＋アイス＋ミスト 30% / ブルー 10%。緑・赤は意味のあるときだけ点で。

### タイポグラフィ

- 和文は**ゴシック体**。`Yu Gothic`（游ゴシック）を主、`Meiryo`/`Hiragino Sans`/`Noto Sans JP` をフォールバック。
- 見出し・メッセージ・数値は **bold:true**。大きな数値は `Arial`（`FONT.num`）。
- サイズ（pt）: タイトル 24 / メッセージ 16 / 見出し 15 / 本文 13 / 小 11 / 出典 9 / 大数値 40。
- **タイトル下にアンダーライン罫を引かない**。間隔とネイビーで階層をつける。
- メッセージラインは `contentSlide` が文字数から自動で1行/2行の帯高さを判定する（`y をハードコードしない`のと同様、
  帯の高さも手で決め打ちしない）。

### ロゴの扱い（クライアントロゴ＝案件ごと／LIBEOロゴ＝固定表記）

- 表紙・締めの中央に置くのは**その案件のクライアントの白ロゴ**（`titleSlide`/`closingSlide` の `logo`）。
  クライアントごとに毎回差し替える。`logo` 未指定なら `client`（社名テキスト・白）で代替表示する。
- 白ロゴなので**濃い背景（表紙・締め）にしか置けない**。本文（白地）や章扉（アイス地）には置かない。
- 「制作: 株式会社LIBEO」は表紙下部メタに控えめに記す（`presenter` の既定値が自動でこれを行う。§0）。

### アクセント・モチーフ

- **ブルーの小マーカー**（角丸の小さな四角, `marker()`）を kicker とメッセージ帯の頭に置き、一貫したリズムを作る。
- カードは**ブルーの丸タイル＋番号、またはアイコンバッジ**（`featureCards`）。章扉は**ブルーの大番号＋縦罫**。
- **アイコンバッジ**（`iconBadge` / `assets/icons/`）: 白いシルエットアイコンを色付き円・角丸四角のバッジに載せる
  パターンで、才流の「オレンジの幾何アクセント」に相当する寒色版の統一モチーフ。多用しすぎず、
  パネルの見出しや工程・カードの主要な1点に絞って使う。

### 質感・寸法

- ハーフトーンのドット（`assets/dot-texture-navy.png` / `assets/dot-texture-blue.png`）は**表紙・章扉・締めの
  濃色/アイス面だけ**に低透明度で。本文面には敷かない。
- カードは角丸＋淡い影（`shadow()`）。エッジに色帯を付けない。
- 16:9＝10in×5.625in。外周マージン 0.55in。本文は `slide.bodyTop`（自動算出）から開始し、**y をハードコードしない**。

---

## 2. 扱うデータ × 最適レイアウト（9系統）

| # | データ系統 | 例 | 第一候補レイアウト |
|---|---|---|---|
| 1 | **定量KPI・実績** | PV/流入推移, 検索順位, CTR, 問い合わせ数, CV率, 売上 | `statCallout`, `miniKpiRow`, 折れ線/棒グラフ＋読み解き（`chartWithInsights`）, `kpiFunnel` |
| 2 | **比較データ** | 業者比較, 料金プラン, 自社vs競合, KBF | `dataTable`（◎○△✕）, `twoColContrast`, `beforeAfterPanels`, `pricingTable` |
| 3 | **地理・地域** | 地域別の実績・指標, 対応エリア | `dataTable`（地域×指標のランキング表）＋必要なら地図画像 |
| 4 | **プロセス・フロー・年表** | 導線設計, カスタマージャーニー, 施策ロードマップ, 実行手順, 節目 | `stepChevrons`, `processTrail`, `ganttChart`, `timeline`, `customerJourney` |
| 5 | **啓発・教育** | 仕組み, 季節性, リスク, 対策 | `featureCards`, `iconList`, `dataTable`（Q&A）, `twoColContrast`（原因→対策） |
| 6 | **事例・実績** | 施策事例, ビフォーアフター, 効果 | `caseStudyCard`, `beforeAfterPanels` |
| 7 | **認識ギャップ・課題発見** | 現場の声とデータの乖離, 思い込みと実態の違い | `gapAnalysis`（persona/quote → 見えているデータ ≠ 実際 → 結論バンド） |
| 8 | **構成・締め・戦略整理** | 表紙, 章扉, 締め, 市場規模, 優先順位, 組織 | `titleSlide`, `sectionDivider`, `closingSlide`, `tamSamSom`, `pyramid`, `orgChart`, `vennDiagram`, `quadrant` |
| 9 | **自社紹介・提案条件** | 私たちについて（LIBEO紹介）, 料金プラン提案 | `companyProfile`, `pricingTable` |

> 数値報告はテンプレ化で当てはめられるが、**難しいのは系統 2〜7 の構造的・概念的なスライド**。
> 本テーマの価値はそこ（比較表・対比・ロードマップ・ファネル・ポジショニング・事例・認識ギャップ）を
> 即座に組めることと、1枚あたりの情報密度をコンサルティングレポート水準まで上げられることにある。

---

## 3. アーキタイプ・ライブラリ（`theme.js` 実装済み）

### 基本パーツ（才流由来）

| 関数 | 用途 |
|---|---|
| `titleSlide(p, {title,subtitle,client,date,presenter,logo})` | 表紙（濃紺＋ドット＋クライアント白ロゴ）。`client`は案件ごとに指定必須。`presenter`既定値はLIBEO |
| `sectionDivider(p, {no,total,title})` | 章扉（大番号ブルー＋縦罫＋タイトルネイビー） |
| `agenda(p, {title,items,page})` | アジェンダ（番号付き2列＋罫） |
| `contentSlide(p, {kicker,message,title,page})` | **全コンテンツ面の枠**。返り値の `slide.bodyTop` を本文の起点に使う。`message` が長い場合は帯が自動で2行分に広がる |
| `statCallout(s,p,{items,y,h})` | 数値ハイライト（大数値＋増減デルタ。緑=改善/赤=悪化） |
| `twoColContrast(s,p,{left,right,...})` | 2カラム対比＋ブルー矢印（課題→施策, ✕→○, ビフォー→アフター 等）。`left.icon`/`right.icon` で見出しにアイコンを添えられる |
| `featureCards(s,p,{cards,...})` | 3〜4列の特長カード（ブルー丸タイル番号。`card.icon` で番号の代わりにアイコンバッジも可） |
| `dataTable(s,p,{columns,rows,colW,dense,...})` | 一般表＋評価表。`◎○△✕` は自動着色（◎青 ○緑 △紺 ✕赤）。`dense:true` で行を詰めて情報量を上げる |
| `stepChevrons(s,p,{steps,...})` | STEPロードマップ |
| `kpiFunnel(s,p,{stages,...})` | KPIツリー/ファネル（目標/現状） |
| `quadrant(s,p,{xLabels,yLabels,nodes,...})` | 2×2ポジショニングマップ（自社=ブルー大） |
| `closingSlide(p,{title,lines,client,logo})` | 締め（濃紺＋クライアント白ロゴ。**電話番号・CTAボタンは入れない**） |
| `note(s,text)` | 出典・注釈 |
| `chartTheme(extra)` | グラフのブランド配色既定 |

### 高密度パーツ（戦略整理・プロセス・アイコン活用・自社紹介・提案条件）

| 関数 | 用途 |
|---|---|
| `iconBadge(s,p,{x,y,d,icon,bg,shape})` | 色付き円/角丸四角＋白アイコン画像。他の多くのパーツの基礎部品 |
| `panel(s,p,{x,y,w,h,head,headColor,icon})` | 汎用の見出し付きコンテナ。返り値のボディ領域に `addChart`/`addText`/`dataTable` を自由配置できる（色ヘッダー付きパネルを並べる構成に対応） |
| `iconList(s,p,{x,y,w,items,badgeColor})` | アイコンバッジ＋テキストの縦リスト。パネル内の「メリット/デメリット」等に |
| `chartWithInsights(s,p,{chartType,chartData,insights,...})` | ネイティブグラフ＋右カラムに読み解き箇条書きの複合パーツ |
| `miniKpiRow(s,p,{items,y,h})` | `statCallout`より薄いKPIストリップ。他パーツと同一スライドに同居させ情報密度を上げる |
| `gapAnalysis(s,p,{persona,quote,left,right,conclusion})` | **認識ギャップ分析**。現場の声/ペルソナ→「見えているデータ」≠「実際に起きていること」→結論バンド |
| `beforeAfterPanels(s,p,{before,after,y,h})` | 自由記述のビフォー/アフター状態比較（数値に限らない） |
| `caseStudyCard(s,p,{cases,...})` | 事例カード（ビフォー→アフターの数値を添えた導入事例紹介） |
| `processTrail(s,p,{steps,zigzag,...})` | ①→②→③の数字/アイコン丸を矢印で連結。`zigzag:true` で上下互い違いに配置 |
| `ganttChart(s,p,{periods,rows,...})` | 期間×タスクのガントチャート |
| `timeline(s,p,{milestones,y})` | 日付付きマイルストーンの年表（ガントより軽い節目共有に） |
| `pyramid(s,p,{layers,...})` | 優先順位ピラミッド（積み上げ図形＋右側凡例） |
| `tamSamSom(s,p,{layers,...})` | TAM-SAM-SOM 等の同心円階層＋右側凡例 |
| `orgChart(s,p,{root,nodes,...})` | 簡易組織図（ルート1＋子ノード） |
| `vennDiagram(s,p,{sets,centerLabel,...})` | 2〜3集合のベン図 |
| `personaCard(s,p,{personas,...})` | ペルソナ/属性カード |
| `customerJourney(s,p,{stages,...})` | フェーズ×タッチポイント/心理/感情スコアのカスタマージャーニー |
| `checklist(s,p,{items,dark,...})` | チェックマーク付きの要点リスト（まとめスライド向け） |
| `conclusionBand(s,p,{text,color,...})` | スライド最下部・全幅の色帯で結論を一言。上部メッセージラインと併用可（情報量の多いスライドの締めに） |
| `calloutBubble(s,p,{x,y,text,color})` | グラフの特定の値に添える小さな吹き出し注釈 |
| `companyProfile(s,p,{name,tagline,facts,stats,y,h})` | **自社紹介**。既定値はLIBEO自身の情報（§0）。提案書冒頭の「私たちについて」に |
| `pricingTable(s,p,{plans,y,h})` | 料金プラン比較。`plans[].featured:true` のプランをネイビーで強調表示 |

**アイコン一覧**（`ICONS` / `assets/icons/*.png`、白シルエット・28種）:
`check` `shield` `trend-up` `trend-down` `warning` `chat` `user` `users` `megaphone` `gear`
`calendar` `refresh` `search` `monitor` `trophy` `cart` `bulb` `target` `clock` `network`
`database` `flag` `funnel` `document` `globe` `pin` `coin` `badge`
（`iconBadge`/`iconList`/`twoColContrast`/`featureCards`/`processTrail`/`panel`/`gapAnalysis`/`checklist` から
`icon: 'xxx'` で指定して使う。追加したい場合は同じ「240x240・白シルエット・透過PNG」で `assets/icons/` に置けばよい）

**未関数化の才流アーキタイプ**（必要時は上記の組み合わせで）：
ピラミッド層別の詳細版（`pyramid`で概ね代替可）、属性/ペルソナ表の表形式版（`dataTable`でも可）、
ガントの依存線表示（`ganttChart`は依存矢印なし。必要なら`LINE`shapeを追加）。

---

## 4. 情報密度を上げるための組み方

クライアント向けの詳細な分析・提案資料（例:「CRM改善提案」「広告効果レポート」）は、
才流の基本形（メッセージ→本文）だけでなく、以下の組み合わせで**1枚に詰め込みすぎず、しかし薄くもしない**
密度に仕上げる。

1. **数値は複合パーツで見せる**。`statCallout`単体で終わらせず、`chartWithInsights`（グラフ＋読み解き）や
   `miniKpiRow`＋`dataTable`（KPIストリップ＋内訳表）のように、1枚に「数字」と「解釈」の両方を乗せる。
2. **「思い込み」と「実態」のズレは`gapAnalysis`で見せる**。現場担当者の発言やペルソナの認識と、
   実際のデータ/事実を対比させ、最後に結論バンドで一言にまとめる型は、課題発見パートで特に有効。
3. **アイコンは意味のある1点に絞って使う**。`iconList`/`iconBadge`/`processTrail`のアイコンは
   「何の話か」を一瞬で伝えるためのラベルであって装飾ではない。1スライドで同じアイコンを繰り返さない。
4. **プロセス・工程・年表は`processTrail`/`ganttChart`/`stepChevrons`/`timeline`を使い分ける**。
   - 3〜5ステップの単純な流れ → `processTrail`（アイコン丸＋矢印）
   - 期間・並行タスクがある実行計画 → `ganttChart`
   - フェーズごとに複数の施策を列挙する中期計画 → `stepChevrons`
   - 日付だけの節目・意思決定ポイントを軽く見せたい → `timeline`
5. **まとめ・締めのスライドは`checklist`＋`conclusionBand`で締める**。要点3つ前後をチェック付きで並べ、
   最後に次月への一言を結論バンドで添えると、才流の「メッセージライン」構造を崩さずに情報量を増やせる。
6. **パネル（`panel`）で自由構成を作る**。既存アーキタイプに当てはまらない構成（例: 色ヘッダー付きの
   比較パネルを2〜3枚並べて中にグラフや表を入れる）は`panel`の返り値ボディ領域を使って自作する。
7. **提案書の冒頭には`companyProfile`でLIBEOを簡潔に紹介**し、料金・体制の提示には`pricingTable`/`orgChart`を使う。
   自己紹介パートに架空の実績数値を盛らない（§0のLIBEO定数のような検証済みの事実のみを使う）。

---

## 5. カスタマイズの進め方（依頼を受けたとき）

1. **目的と相手（案件のクライアント）を確認**。クライアント名・ロゴは毎回この案件用に新しく受け取る。
   過去の別案件のクライアント名やロゴを使い回さない。
2. **データの系統を判定**（§2）。手元データ（GSC/GA4/Salesforce/Ubersuggest 等）を確認。
   数値が未確定なら、必要な数字を1回だけ具体的に尋ねる。
3. **アウトライン設計**（才流の論理順: 背景→課題→施策→計画）。1スライド=1メッセージ。結論文＝`message`。
   分析・提案系の資料では、課題発見に`gapAnalysis`、施策提案に`beforeAfterPanels`/`caseStudyCard`、
   計画に`processTrail`/`ganttChart`/`stepChevrons`/`timeline`のように§4の型を積極的に使い、
   単純な箇条書きスライドを連続させない。
4. **アーキタイプ割当**（§3）。同じ型を連続させない。
5. **`theme.js` で生成 → レンダリング → QA**（§6,7）。
6. **固有要素の反映**：**この案件のクライアント名・ロゴ（あれば `logo` に渡す）**、対象期間。
   **電話番号・CTAボタン・クライアントと無関係なロゴ/マスコットは入れない**。

---

## 6. 制作ワークフロー（PptxGenJS）

```bash
npm install pptxgenjs   # プロジェクト直下に一度だけ
```

```javascript
const T = require('./theme.js');
const { C, LIBEO } = T;

(async () => {
  const p = T.newDeck({ title: 'Web集客 月次レポート' });

  // 表紙: client はこの案件のクライアント名に差し替える。logo があれば白ロゴパスを渡す。
  // presenter は省略可（既定で LIBEO.name = '株式会社LIBEO'）。
  T.titleSlide(p, { title: 'Web集客 月次レポート', subtitle: '2026年6月度',
    client: '（案件のクライアント名）', date: '2026年6月',
    /* logo: '/path/to/client-logo-white.png' */ });

  T.sectionDivider(p, { no: 1, total: 3, title: '今月のサマリー' });

  // コンテンツ面は必ず contentSlide → 返り値 s と s.bodyTop を使う
  const s = T.contentSlide(p, { kicker:'サマリー', title:'KPIハイライト',
    message:'自然検索流入が前月比 +18% と伸長。', page: 3 });
  T.statCallout(s, p, { y: s.bodyTop, h: 1.6, items: [
    { label:'自然検索セッション', value:'24,310', delta:'▲ +18.2%', deltaColor: C.green },
  ]});
  T.note(s, '出典: Google Search Console / GA4');

  // 認識ギャップの例（課題発見パート）
  const s2 = T.contentSlide(p, { kicker:'データ運用', title:'CRMデータと現場実態のズレ',
    message:'CRM上の指標だけでは変化に気づくまで時間がかかっています。', page: 4 });
  T.gapAnalysis(s2, p, { y: s2.bodyTop,
    persona: { icon: 'user', name: 'マーケ担当' },
    quote: '検索広告のこの語句からCVが取れている。強化したい。',
    left: { icon: 'search', head: '見えているデータ', items: ['…'] },
    right: { icon: 'warning', head: '実際に起きていること', items: ['…'] },
    conclusion: '→ データだけでは変化を把握できず、気づきに時間とコストが生じる',
  });

  // 締め: client はこの案件のクライアント名。電話番号・CTAは入れない
  T.closingSlide(p, { client: '（案件のクライアント名）', title: 'ご清覧ありがとうございました',
    lines: ['ご不明点・追加のご要望がございましたら', '担当までお申し付けください。'] });

  await T.save(p, 'out.pptx');
})();
```

```bash
node build.js
python /mnt/skills/public/pptx/scripts/rezip.py out.pptx   # 必須: pptxgenjs 出力を再圧縮
```

要点：
- **本文の y は必ず `s.bodyTop`**。固定値を書かない。
- 影は毎回新規生成（`T.shadow()`）。使い回すと壊れる。
- 色は `#` なし6桁。透明度は `opacity`/`transparency`（8桁hex禁止）。
- グラフはネイティブ（`addChart`＋`T.chartTheme()`、または`chartWithInsights`）。画像化しない。
- CHEVRON系シェイプ（`stepChevrons`/`kpiFunnel`）は左辺が中央でへこむ凹形状なので、
  自作でテキストを重ねる場合は左端から十分な余白（0.4in程度）を取る。

---

## 7. QA（必須）

```bash
python /mnt/skills/public/pptx/scripts/office/soffice.py --headless --convert-to pdf out.pptx
rm -f slide-*.jpg && pdftoppm -jpeg -r 120 out.pdf slide
ls -1 "$PWD"/slide-*.jpg
```

サブエージェント（新しい目）で各スライドを確認：**メッセージ帯と本文の重なり / 文字のはみ出し（特に
CHEVRON・TRIANGLE系シェイプ内の自作テキスト）/ カードの近接 / 余白の偏り / 低コントラスト（淡色スウォッチが
白背景で見えなくなっていないか）/ 出典の衝突 / プレースホルダ残り / **クライアント名・ロゴが正しい案件のものか**。
1巡だけ修正して止める。

---

## やってはいけないこと

- **案件のクライアントと関係のないロゴ・マスコット・キャラクターを使う**（別案件の意匠を流用しない）。
- **電話番号・CTAボタンを入れる**（クライアント報告に不要）。
- 白ロゴを濃色背景以外（白地・アイス地）に置く。
- データ面に袋文字・斜めリボン・ハーフトーンを使う（表紙/章扉/締め限定）。
- タイトル下のアンダーライン罫、カード/スライド端の装飾カラーバー。
- アイス/ミストを地の主役にする（地は白）。
- ブルー・緑・赤を意味なく多用する（緑=肯定/改善, 赤=否定/リスク, 青=アクセント）。
- 1スライドに複数メッセージを詰める。黄色ハイライトを2語以上に使う。
- 数値の出典を省く（`note` で明記）。
- アイコンを装飾目的で乱用する（1スライドで同じ意味の異なるアイコンを重複させない）。
- `companyProfile`（LIBEO自己紹介）に検証していない実績数値を盛る（§0の情報以外は事実確認してから使う）。
