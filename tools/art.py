"""札の絵を組み込み用に変換する。使い方: python3 tools/art.py [ID ...]

art/raw/<ID>.png（白い背景に黒い影絵）を読み、
- 白い背景を透明にする（明るさで決める。影は黒一色にそろえる）
- 余白を詰めて正方形に置き直し、256×256 に縮める
- art/cards/<ID>.png に書き出す
ID を省くと art/raw/ の全部を変換する。
"""
import sys
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
RAW, OUT = ROOT / 'art' / 'raw', ROOT / 'art' / 'cards'
SIZE, PAD = 256, 0.06


def convert(src: Path, dst: Path) -> None:
    im = Image.open(src).convert('L')
    # 明るいほど透明。真っ白は完全に透明、真っ黒は不透明。途中はなめらかに
    alpha = im.point(lambda v: 255 if v < 70 else 0 if v > 200 else int(255 * (200 - v) / 130))
    box = alpha.getbbox()
    if not box:
        raise ValueError(f'{src.name}: 影が見つからない（真っ白な画像？）')
    alpha = alpha.crop(box)
    side = int(max(alpha.size) * (1 + PAD * 2))
    canvas = Image.new('L', (side, side), 0)
    canvas.paste(alpha, ((side - alpha.width) // 2, (side - alpha.height) // 2))
    canvas = canvas.resize((SIZE, SIZE), Image.LANCZOS)
    out = Image.new('RGBA', (SIZE, SIZE), (27, 18, 10, 0))  # 影の色は札の影と同じ #1b120a
    out.putalpha(canvas)
    dst.parent.mkdir(parents=True, exist_ok=True)
    out.save(dst, optimize=True)


def main(ids):
    files = [RAW / f'{i}.png' for i in ids] if ids else sorted(RAW.glob('*.png'))
    if not files:
        print('art/raw/ に画像が無い')
        return
    for f in files:
        convert(f, OUT / f.name)
        print('変換した:', f.name)
    print('index.html の ART_IMG に足す ID:', ', '.join(f.stem for f in files))


if __name__ == '__main__':
    main(sys.argv[1:])
