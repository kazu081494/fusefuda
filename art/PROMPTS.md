# 札の絵：画像生成AIへの指示文

月花乱舞の札の絵を、画像生成AI（Midjourney・DALL·E・Stable Diffusion など）で作るための指示文と決まり。
できた画像は、このチャットに貼るか `art/raw/` に置けば、組み込みは Claude がやる（背景を透明にして、小さく変換して、札に差し込む）。

## 画像の決まり

- **黒い影絵を、真っ白な背景に**描かせる。背景の透明化は後でこちらでやるので、透明な背景を頼まなくてよい
- 正方形（1:1）。1024×1024 前後
- 影は**真っ黒一色**。灰色のぼかし・地面の影・枠・文字・落款（はんこ）は入れない
- 主役を真ん中に、上下左右に少し余白を残す
- 白く抜きたいところ（目・模様など）は、白い地がそのまま抜けるように描かせる
- ファイル名は下の表の **ID**（例：`oiuchi.png`）。名前が違っても、どの札か書いてくれれば合わせる

## 画風の見本（決まった）

**偵察の梟（`art/raw/teisatsu.png`、Gemini で作成）を全部の札の画風の見本にする。** 切り絵のような鋭い彫りがあり、体の大部分は黒く塗りつぶし、白い彫りは目と大きな羽の切れ込みなど数本だけ。手札の小さい札（幅6〜7mm）でも形が分かる細かさにとどめる。

最初に作った細かい彫りの多い版は、手札の大きさだと白い彫りが潰れて灰色のかたまりに見えたので、「彫りを少なく、太く」で作り直した。

### Gemini で残りを作る手順
1. 新しいチャットで、見本の梟の画像を貼る
2. 次の文に、下の表の「絵の中身」を入れて送る

```
この梟と同じ切り絵の画風で、別の絵を作ってください。
描くもの：（ここに絵の中身）
・体の大部分は黒く塗りつぶし、白い彫りは太いものを数本だけ
・白い背景に黒一色。紙の写真ではなく平らな画像で、紙の縁や影は入れない
・文字や枠は入れない。正方形で、真ん中に置いてまわりに少し余白
```

## 共通の書き方（全部の指示文の後ろに付ける）

画風をそろえるため、どの札の指示文にも、後ろにこれを付ける。

```
, Japanese kage-e shadow puppet silhouette, solid pure black shape on a plain pure white background, crisp clean edges, elegant Edo-period style, flat, no gradients, no shading, no ground shadow, no text, no border, no signature, centered with margin
```

Midjourney なら、さらに最後に付ける：

```
 --ar 1:1 --style raw --no color, text, frame, gray
```

うまく影絵にならないときは、指示文の先頭に `black silhouette of` を付けると安定しやすい。

### Stable Diffusion で作るとき

Stable Diffusion は「描いてほしいもの（プロンプト）」と「描いてほしくないもの（ネガティブプロンプト）」を分けて書く。

- **プロンプト**：下の表の指示文 ＋ 共通の書き方（上と同じ）
- **ネガティブプロンプト**（全部の札で同じ）：

```
color, colorful, gray, gradient, shading, ground shadow, text, letters, watermark, signature, frame, border, photo, realistic, 3d, blurry, multiple subjects, cropped
```

- **モデル**：商用で使えるものを選ぶ。SDXL（base 1.0）か FLUX.1 schnell がおすすめ。FLUX.1 dev は商用不可なので使わない。SD 3.5 は年間売上が一定額までなら無料で商用可。使う前に、そのモデルのライセンスのページで確かめる
- **大きさ**：SDXL・FLUX なら 1024×1024
- **画風をそろえるコツ**：
  - 気に入った1枚ができたら、その「シード値」を控えておき、ほかの札でも同じシード値を使う
  - IP-Adapter（画像を画風の見本にする機能）があれば、気に入った1枚を見本にする
- **導入**：Fooocus か Stability Matrix を使うと、まとめて入れられて手軽。どちらも無料

### ChatGPT・Gemini で作るとき

指示文と共通の書き方をつなげて、そのまま貼る。
2枚目からは、1枚目の画像を貼って「この画像と同じ画風で」と頼むと、画風がそろいやすい。

## 型の絵（素の札・舞台）

| ID | 使う所 | 絵の中身 | 指示文（共通の書き方の前に置く） |
|---|---|---|---|
| `A` | 素の攻撃の札 | 振りかざした刀 | `a katana sword raised diagonally, with round tsuba guard and wrapped handle` |
| `D` | 素の防御の札 | 開いた唐傘 | `an open Japanese oil-paper umbrella (wagasa) seen from the side, ribs visible as thin white lines` |
| `T` | 罠の札（裏向き） | 狐（手影絵） | `a fox head made as a hand shadow puppet, pointed ears, long snout, small white eye` |
| `samurai` | 舞台の侍 | 構える侍・全身 | `full body samurai in hakama standing in a ready stance, holding a katana forward, topknot hair, facing right` |

## 攻撃の札

| ID | 札 | 絵の中身 | 指示文 |
|---|---|---|---|
| `oiuchi` | 追い討ち | 二筋の斬撃 | `two parallel curved sword slash arcs, like crescent moon strokes` |
| `kantsu` | 貫通 | 輪を貫く槍 | `a long Japanese spear (yari) piercing through a round ring shield` |
| `sutemi` | 捨て身 | 折れた刀 | `a broken katana, the blade snapped in two with the tip flying away` |
| `rengeki` | 連撃 | 三筋の爪痕 | `three fast diagonal slash marks side by side, like claw marks` |
| `teisatsu` | 偵察 | 梟 | `an owl perched and staring, big round white eyes, ear tufts` |
| `yokoku` | 予告 | 矢文 | `an arrow with a folded letter tied to its shaft (yabumi)` |
| `iai` | 居合 | 鞘の刀と一閃 | `a katana half drawn from its scabbard, with a single sharp flash slash line above` |
| `kuzushi` | 崩し | 崩れる石垣 | `a stone castle wall block cracking apart, pieces falling` |
| `hikeshi` | 火消し | 手桶と水 | `a wooden water bucket (teoke) splashing water drops, Edo firefighter style` |
| `youdou` | 陽動 | 蝶 | `a butterfly with spread wings, graceful` |
| `senkou` | 線香花火 | 線香花火 | `a hanging Japanese sparkler (senko hanabi) with a glowing ball and thin sparks bursting` |

## 防御の札

| ID | 札 | 絵の中身 | 指示文 |
|---|---|---|---|
| `hangeki` | 反撃 | 返す一撃 | `a samurai turning back a sword strike, deflecting and countering, dynamic pose` |
| `ukenagashi` | 受け流し | 柳 | `drooping willow branches swaying in the wind` |
| `meisou` | 瞑想 | 座禅 | `a monk sitting in zazen meditation, seen from the front, calm` |
| `kakuran` | 撹乱 | 手裏剣 | `a ninja throwing star (shuriken) with four points and a white hole in the center` |
| `fuuji` | 封じ手 | 錠前 | `an old Japanese padlock (wajo) with a white keyhole` |
| `mikiri` | 見切り | 目 | `a single sharp eye, almond shaped, with a white iris and black pupil` |
| `zanshin` | 残心 | 弓を引く | `a Japanese archer drawing a long bow (yumi), kyudo stance, side view` |
| `kamae` | 構え | 構える侍 | `a samurai holding a katana in a guard stance (chudan no kamae), side view` |
| `hikiashi` | 退き足 | 足跡 | `two bare footprints walking backward, with a straw sandal (waraji)` |
| `tessen` | 鉄扇 | 開いた扇 | `an open Japanese iron war fan (tessen), ribs as thin white lines` |

## 罠の札

| ID | 札 | 絵の中身 | 指示文 |
|---|---|---|---|
| `otoshiana` | 落とし穴 | 竹槍の穴 | `a pit trap in the ground with sharp bamboo spikes inside, seen from the side` |
| `kaeshi` | 返し罠 | とらばさみ | `an open jaw trap with sharp teeth, ready to snap` |
| `dorobou` | 気力泥棒 | 盗人の風呂敷 | `a thief carrying a big furoshiki bundle on his back, sneaking, Edo period` |
| `machibuse` | 待ち伏せ | 草むらの目 | `tall grass with a pair of white eyes peeking out from inside` |
| `ashikase` | 足かせ | 鉄球と鎖 | `a heavy iron ball with a chain and shackle` |
| `naruko` | 鳴子 | 鳴子 | `a naruko bird clapper: wooden boards with bamboo sticks hanging from a rope` |
| `kagemusha` | 影武者 | 二重の侍 | `two identical samurai standing, one in front and one as a shadow double behind` |
| `kitsunebi` | 狐火 | 狐火 | `will-o-the-wisp fox fires (kitsunebi), several floating flames around a fox silhouette` |

## 組み込むとき（Claude がやること）

1. 届いた画像を `art/raw/<ID>.png` に置く
2. `python3 tools/art.py` を走らせる。白い背景を透明にし、影を黒にそろえ、256×256 に縮めて `art/cards/<ID>.png` に書き出す
3. `index.html` の `ART_IMG` に ID を足す。足した札だけ画像になり、まだの札は今の影絵のまま
4. 公開ページ（artifact）には `art/cards/` の画像も一緒に載せる

## 権利

広告収入を目指すので、**使った画像生成サービスの規約で、商用利用が認められているか**を確かめてから使う。有料プランでないと商用不可のサービスもある。どのサービスで作ったかは、ここに書いておく。

- 使ったサービス：Google Gemini（偵察の梟、返し罠、舞台の侍）。返し罠と侍は3枚を1枚にまとめた小さい画像（512×512）から切り出したので、粗い。1枚ずつ大きく作り直したら差し替える。侍は元の絵が左向きだったので左右反転した。商用利用の可否は Gemini の利用規約で確かめること（未確認）
