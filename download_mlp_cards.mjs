import fs from 'node:fs';
import path from 'node:path';

const sourceHtml = process.argv[2] || '/tmp/mlp_kayou_audit.html';
const outputRoot = path.resolve(process.argv[3] || 'public/imgs');
const sourcePage = 'https://www.kayouofficial.com/en-US/series/series-2nicsllo';
const html = fs.readFileSync(sourceHtml, 'utf8').replace(/\\\"/g, '"');

const cards = [...html.matchAll(/\{"id":"merch-[^}]+\}/g)]
  .map((match) => {
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  })
  .filter((card) => card?.image && card?.backImage && card?.rarity && card?.name)
  .sort((a, b) => a.sortOrder - b.sortOrder);

if (cards.length !== 191) {
  throw new Error(`Expected 191 cards from the official page, found ${cards.length}`);
}

const translatedNames = {
  'Twilight Sparkle': '紫悦_Twilight Sparkle',
  Fluttershy: '柔柔_Fluttershy',
  'Pinkie Pie': '碧琪_Pinkie Pie',
  Applejack: '苹果嘉儿_Applejack',
  'Rainbow Dash': '云宝_Rainbow Dash',
  Rarity: '珍奇_Rarity',
  Spike: '穗龙_Spike',
  'Apple Bloom': '苹果丽丽_Apple Bloom',
  'Sweetie Belle': '甜贝儿_Sweetie Belle',
  Scootaloo: '醒目露露_Scootaloo',
  'Big McIntosh': '大麦_Big McIntosh',
  'Granny Smith': '史密夫婆婆_Granny Smith',
  Trixie: '崔克西_Trixie',
  Gilda: '吉尔达_Gilda',
  'Diamond Tiara': '钻石皇冠_Diamond Tiara',
  'Silver Spoon': '银勺_Silver Spoon',
  'Mayor Mare': '麦尔市长_Mayor Mare',
  Owlowiscious: '猫头鹰欧洛_Owlowiscious',
  Angel: '安吉尔_Angel',
  Gummy: '无牙鳄_Gummy',
  Winona: '薇诺娜_Winona',
  Tank: '坦克_Tank',
  Opal: '奥泊_Opal',
  Zecora: '可拉_Zecora',
};

const characterRarities = new Set(['RR※', 'GR※', 'CR※', 'RR', 'U', 'SR', 'GR', 'CR']);

function legacyCategory(card) {
  if (translatedNames[card.name] && (characterRarities.has(card.rarity) || card.rarity === 'C')) {
    return translatedNames[card.name];
  }
  if (card.rarity === 'ER' || card.rarity === 'ER※') return '_非角色卡/场景';
  if (card.rarity === 'SPR' || card.rarity === 'SPR※') return '_非角色卡/事件与道具';
  return '_非角色卡/剧情';
}

function safeName(value) {
  return value.replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, ' ').trim();
}

function cardPaths(card) {
  const folder = safeName(card.name);
  const stem = `${safeName(card.idCode)}__${safeName(card.name)}`;
  return {
    folder,
    front: path.join(folder, `${stem}__front.png`),
    back: path.join(folder, `${stem}__back.png`),
    legacy: path.join(legacyCategory(card), `${stem}.png`),
  };
}

function pngDimensions(file) {
  if (!fs.existsSync(file)) return null;
  const data = fs.readFileSync(file);
  if (data.length < 24 || data.toString('hex', 0, 8) !== '89504e470d0a1a0a') return null;
  return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
}

function csv(value) {
  const text = String(value ?? '');
  return `"${text.replaceAll('"', '""')}"`;
}

function removeEmptyTree(directory) {
  if (!fs.existsSync(directory) || !fs.statSync(directory).isDirectory()) return;
  for (const entry of fs.readdirSync(directory)) {
    const child = path.join(directory, entry);
    if (fs.statSync(child).isDirectory()) removeEmptyTree(child);
  }
  if (fs.readdirSync(directory).length === 0) fs.rmdirSync(directory);
}

fs.mkdirSync(outputRoot, { recursive: true });
const metadataRoot = path.join(outputRoot, '_metadata');
const backAssetsRoot = path.join(metadataRoot, 'back-assets');
fs.mkdirSync(backAssetsRoot, { recursive: true });

const downloads = new Map();
for (const card of cards) {
  const files = cardPaths(card);
  const officialFolder = path.join(outputRoot, files.folder);
  const front = path.join(outputRoot, files.front);
  const back = path.join(outputRoot, files.back);
  const legacy = path.join(outputRoot, files.legacy);
  const backAsset = path.join(backAssetsRoot, path.basename(new URL(card.backImage).pathname));

  fs.mkdirSync(officialFolder, { recursive: true });
  if (!fs.existsSync(front) && fs.existsSync(legacy)) fs.renameSync(legacy, front);
  if (!fs.existsSync(front)) downloads.set(front, card.image);
  if (!pngDimensions(backAsset)) downloads.set(backAsset, card.backImage);
  if (!fs.existsSync(back) && fs.existsSync(backAsset)) fs.linkSync(backAsset, back);
}

for (const directory of new Set(cards.map((card) => path.join(outputRoot, legacyCategory(card).split('/')[0])))) {
  removeEmptyTree(directory);
}

const curlConfig = [];
const downloadEntries = [...downloads];
for (const [index, [destination, url]] of downloadEntries.entries()) {
  curlConfig.push(`url = "${url}"`);
  curlConfig.push(`output = "${destination}"`);
  if (index < downloadEntries.length - 1) curlConfig.push('next');
}
fs.writeFileSync(path.join(metadataRoot, 'downloads.cfg'), `${curlConfig.join('\n')}\n`);

const normalizedCards = cards.map((card) => {
  const files = cardPaths(card);
  const frontDimensions = pngDimensions(path.join(outputRoot, files.front));
  const backDimensions = pngDimensions(path.join(outputRoot, files.back));
  return {
    officialMetadata: card,
    localFiles: {
      folder: files.folder,
      front: files.front,
      back: files.back,
    },
    verification: {
      frontDimensions,
      backDimensions,
      frontDimensionsMatchMetadata: Boolean(
        frontDimensions
        && frontDimensions.width === card.imageWidth
        && frontDimensions.height === card.imageHeight
      ),
    },
  };
});

fs.writeFileSync(
  path.join(metadataRoot, 'cards.json'),
  `${JSON.stringify({ sourcePage, cardCount: cards.length, cards: normalizedCards }, null, 2)}\n`,
);

const indexRows = [[
  'idCode', 'name', 'rarity', 'rarityId', 'sortOrder',
  'metadataImageWidth', 'metadataImageHeight', 'actualFrontWidth', 'actualFrontHeight',
  'frontDimensionsMatchMetadata', 'frontPath', 'backPath', 'frontUrl', 'backUrl',
]];
for (const entry of normalizedCards) {
  const card = entry.officialMetadata;
  const verification = entry.verification;
  indexRows.push([
    card.idCode,
    card.name,
    card.rarity,
    card.rarityId,
    card.sortOrder,
    card.imageWidth,
    card.imageHeight,
    verification.frontDimensions?.width ?? '',
    verification.frontDimensions?.height ?? '',
    verification.frontDimensionsMatchMetadata,
    entry.localFiles.front,
    entry.localFiles.back,
    card.image,
    card.backImage,
  ]);
}
fs.writeFileSync(
  path.join(metadataRoot, 'index.csv'),
  `${indexRows.map((row) => row.map(csv).join(',')).join('\n')}\n`,
);

fs.writeFileSync(
  path.join(outputRoot, 'README.txt'),
  [
    '来源：KAYOU 官方 My Little Pony TCG - Fantasy Wonderland',
    sourcePage,
    '',
    '目录严格使用官网 metadata 的 name 字段，不使用人工翻译或推断类别。',
    '文件名格式：{idCode}__{name}__front/back.png。',
    '卡游官网的 18 张 U 卡尺寸 metadata 与 CDN 原图尺寸不一致；本地保留 CDN 原图，差异记录在 _metadata/index.csv。',
  ].join('\n'),
);

console.log(JSON.stringify({
  cards: cards.length,
  downloadsRequired: downloads.size,
  uniqueBackImages: new Set(cards.map((card) => card.backImage)).size,
  outputRoot,
}, null, 2));
