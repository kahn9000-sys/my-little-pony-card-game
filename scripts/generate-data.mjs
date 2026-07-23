import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(import.meta.dirname, '..');
const sourcePath = path.join(projectRoot, 'public/imgs/_metadata/cards.json');
const destinationPath = path.join(projectRoot, 'data/data.json');
const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

const characters = new Set([
  'Twilight Sparkle', 'Fluttershy', 'Pinkie Pie', 'Applejack', 'Rainbow Dash', 'Rarity',
  'Spike', 'Apple Bloom', 'Sweetie Belle', 'Scootaloo', 'Big McIntosh', 'Granny Smith',
  'Trixie', 'Gilda', 'Diamond Tiara', 'Silver Spoon', 'Mayor Mare', 'Owlowiscious',
  'Angel', 'Gummy', 'Winona', 'Tank', 'Opal', 'Zecora',
]);

const rarityNames = {
  'SPR※': 'Shining Sapphire Rare',
  'ER※': 'Shining Emerald Rare',
  'RR※': 'Shining Ruby Rare',
  'GR※': 'Shining Gold Rare',
  'CR※': 'Shining Colorful Rare',
  SPR: 'Sapphire Rare',
  ER: 'Emerald Rare',
  RR: 'Ruby Rare',
  C: 'Common',
  U: 'Uncommon',
  SR: 'Silver Rare',
  GR: 'Gold Rare',
  CR: 'Colorful Rare',
};

const rarityNamesZh = {
  'SPR※': '闪耀蓝宝石稀有',
  'ER※': '闪耀祖母绿稀有',
  'RR※': '闪耀红宝石稀有',
  'GR※': '闪耀黄金稀有',
  'CR※': '闪耀彩虹稀有',
  SPR: '蓝宝石稀有',
  ER: '祖母绿稀有',
  RR: '红宝石稀有',
  C: '普通',
  U: '非普通',
  SR: '银色稀有',
  GR: '黄金稀有',
  CR: '彩虹稀有',
};

const typeNamesZh = {
  Character: '角色卡',
  Scene: '场景卡',
  'Event & Item': '事件与道具卡',
  Story: '剧情卡',
};

const nameTranslations = {
  'Accidentally Burnt Book': '意外烧焦的书',
  Angel: '安吉尔',
  'Apple Bloom': '苹果丽丽',
  Applejack: '苹果嘉儿',
  'Attend to Cure': '悉心照料',
  'Award Ceremony': '颁奖典礼',
  'Big McIntosh': '大麦',
  'Canterlot Tower': '坎特洛特高塔',
  'Carousel Boutique': '旋转木马精品店',
  Cloudominium: '云中城堡',
  'Curing Philomena -- A Very Sick Patient': '治疗菲洛米娜——病重的患者',
  'Curing Philomena -- Intensive Care': '治疗菲洛米娜——精心照料',
  'Curing Philomena -- Rebirth': '治疗菲洛米娜——浴火重生',
  'Curing Philomena -- Turning to Ash': '治疗菲洛米娜——化为灰烬',
  'Cycling for Friends': '为朋友骑行',
  'Deliver letters': '递送信件',
  'Diamond Tiara': '钻石皇冠',
  'Dig for Gems': '挖掘宝石',
  Fluttershy: '柔柔',
  "Fluttershy's Bell": '柔柔的铃铛',
  "Fluttershy's Cottage": '柔柔的小屋',
  'Found Scroll': '发现卷轴',
  Gilda: '吉尔达',
  'Golden Oak Library': '金橡树图书馆',
  'Granny Smith': '史密夫婆婆',
  'Griffon the Brush Off——Losing her temper': '狮鹫的冷落——大发脾气',
  'Griffon the Brush Off——Old Pal Here': '狮鹫的冷落——老朋友来了',
  'Griffon the Brush Off——The Party Goes On': '狮鹫的冷落——派对继续',
  'Griffon the Brush Off——Welcome Party': '狮鹫的冷落——欢迎派对',
  Gummy: '无牙鳄',
  'Hair Curling': '卷头发',
  'Head Up to the Night Sky': '仰望夜空',
  'Hoof Power Test': '马蹄力量测试',
  Horseshoe: '马蹄铁',
  'Make a Cake': '制作蛋糕',
  'Manehattan Streets': '马哈顿街道',
  'Mayor Mare': '麦尔市长',
  'Messy Henhouse': '凌乱的鸡舍',
  Opal: '奥泊',
  'Over a Barrel——Bedtime Story': '针锋相对——睡前故事',
  'Over a Barrel——Bury the Hatchet': '针锋相对——冰释前嫌',
  'Over a Barrel——Tit for Tat': '针锋相对——针锋相对',
  'Over a Barrel——Train Heist': '针锋相对——火车劫案',
  'Overspeed Warning!': '超速警告！',
  Owlowiscious: '猫头鹰欧洛',
  'Party of One -- Invitation Declined': '独自派对——邀请被拒',
  'Party of One -- Sad & Lonely Pinkie': '独自派对——伤心孤独的碧琪',
  'Party of One -- Something Fishy': '独自派对——有点不对劲',
  'Party of One -- Surprise Birthday Party': '独自派对——惊喜生日派对',
  'Pillow Fight': '枕头大战',
  'Pinkie Pie': '碧琪',
  "Pinkie Pie's Flying Device": '碧琪的飞行装置',
  'Ponyville Street': '小马谷街道',
  'Ponyville Suburb': '小马谷郊区',
  'Prepared to Go': '准备出发',
  'Rain Under the Roof': '屋檐下的雨',
  'Rainbow Dash': '云宝',
  Rarity: '珍奇',
  Recorder: '竖笛',
  'Road at Sweet Apple Acres': '甜苹果园小路',
  Scootaloo: '醒目露露',
  'Silver Spoon': '银勺',
  Soda: '汽水',
  Spike: '穗龙',
  'Stairs of Cloudsdale': '云中城阶梯',
  'Sugarcube Corner': '方糖甜品屋',
  'Suited For Success——Fashion Flops': '成功的礼服——时尚败笔',
  'Suited For Success——First Edition': '成功的礼服——初版礼服',
  'Suited For Success——Suited Up!': '成功的礼服——盛装登场！',
  'Suited For Success——Too Much Advice': '成功的礼服——太多建议',
  'Sunlight in the Rain': '雨中阳光',
  'Super Spicy Sauce': '超辣酱汁',
  'Sweet Apple Acres': '甜苹果园',
  'Sweetie Belle': '甜贝儿',
  Tank: '坦克',
  'Tense Competition': '紧张的比赛',
  'The Ticket Master -- All or None': '票落谁家——要么全有要么全无',
  'The Ticket Master -- Friends Frenzy': '票落谁家——朋友争抢',
  'The Ticket Master -- Two Tickets to the Gala': '票落谁家——两张庆典门票',
  'The Ticket Master -- Wish Granted': '票落谁家——愿望成真',
  'Thimble Pack': '顶针包',
  'Time for Clean-up!': '打扫时间！',
  Trixie: '崔克西',
  'Twilight Sparkle': '紫悦',
  'Washing Day': '洗衣日',
  Winona: '薇诺娜',
  'Wire Accident': '电线事故',
  Zecora: '可拉',
};

function typeFor(card) {
  if (characters.has(card.name)) return 'Character';
  if (card.rarity.startsWith('ER')) return 'Scene';
  if (card.rarity.startsWith('SPR')) return 'Event & Item';
  return 'Story';
}

function imageDimensionsFromUrl(url, fallback) {
  const match = url.match(/-(\d+)-(\d+)\.[a-z0-9]+(?:\?.*)?$/i);
  if (!match) return fallback;
  return { width: Number(match[1]), height: Number(match[2]) };
}

const cards = source.cards.map(({ officialMetadata, localFiles, verification }) => {
  const type = typeFor(officialMetadata);
  const character = characters.has(officialMetadata.name) ? officialMetadata.name : 'Other';
  const metadataDimensions = imageDimensionsFromUrl(officialMetadata.image, {
    width: officialMetadata.imageWidth,
    height: officialMetadata.imageHeight,
  });

  return ({
  id: officialMetadata.id,
  code: officialMetadata.idCode,
  name: officialMetadata.name,
  nameZh: nameTranslations[officialMetadata.name] ?? officialMetadata.name,
  rarity: officialMetadata.rarity,
  rarityName: rarityNames[officialMetadata.rarity] ?? officialMetadata.rarity,
  rarityNameZh: rarityNamesZh[officialMetadata.rarity] ?? officialMetadata.rarity,
  rarityId: officialMetadata.rarityId,
  sortOrder: officialMetadata.sortOrder,
  character,
  characterZh: character === 'Other' ? '非角色卡' : nameTranslations[character],
  type,
  typeZh: typeNamesZh[type],
  image: `imgs/${localFiles.front}`,
  backImage: `imgs/${localFiles.back}`,
  sourceImage: officialMetadata.image,
  sourceBackImage: officialMetadata.backImage,
  dimensions: {
    metadata: metadataDimensions,
    actual: verification.frontDimensions,
    matchesMetadata:
      verification.frontDimensions.width === metadataDimensions.width
      && verification.frontDimensions.height === metadataDimensions.height,
  },
  });
});

const data = {
  collection: {
    id: 'fantasy-wonderland-001-na',
    title: 'Fantasy Wonderland',
    subtitle: 'Friendship Archive',
    productName: 'My Little Pony Trading Card Game — Fantasy Wonderlands',
    cardCount: cards.length,
    source: source.sourcePage,
    visualReference: 'https://www.kayouofficial.com/en-US/series/series-9blxjfqa',
  },
  rarityOrder: ['SPR※', 'ER※', 'RR※', 'GR※', 'CR※', 'SPR', 'ER', 'RR', 'C', 'U', 'SR', 'GR', 'CR'],
  characters: [...characters],
  cards,
};

fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
fs.writeFileSync(destinationPath, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Generated ${cards.length} cards at ${destinationPath}`);
