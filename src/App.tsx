import { useEffect, useMemo, useRef, useState } from 'react';
import catalogData from '../data/data.json';
import type { Card, Catalog } from './types';

const catalog = catalogData as Catalog;
const ALL = 'ALL';

const rarityTone: Record<string, string> = {
  'SPR※': '#69c5ff', 'ER※': '#47e6a0', 'RR※': '#ff5c7c', 'GR※': '#f4d100', 'CR※': '#c98cff',
  SPR: '#65b7f3', ER: '#50c995', RR: '#e94f70', C: '#c7c7c7', U: '#9b8dff', SR: '#dce6eb', GR: '#d6a82f', CR: '#b775d9',
};

const characterLabels: Record<string, string> = {
  'Twilight Sparkle': '紫悦', Fluttershy: '柔柔', 'Pinkie Pie': '碧琪', Applejack: '苹果嘉儿',
  'Rainbow Dash': '云宝', Rarity: '珍奇', Spike: '穗龙', 'Apple Bloom': '苹果丽丽',
  'Sweetie Belle': '甜贝儿', Scootaloo: '醒目露露', 'Big McIntosh': '大麦', 'Granny Smith': '史密夫婆婆',
  Trixie: '崔克西', Gilda: '吉尔达', 'Diamond Tiara': '钻石皇冠', 'Silver Spoon': '银勺',
  'Mayor Mare': '麦尔市长', Owlowiscious: '猫头鹰欧洛', Angel: '安吉尔', Gummy: '无牙鳄',
  Winona: '薇诺娜', Tank: '坦克', Opal: '奥泊', Zecora: '可拉', Other: '非角色卡',
};

function assetUrl(source: string) {
  return `${import.meta.env.BASE_URL}${source}`;
}

function CardTile({ card, onOpen }: { card: Card; onOpen: (card: Card) => void }) {
  return (
    <button
      className="card-tile"
      type="button"
      onClick={() => onOpen(card)}
      aria-label={`查看 ${card.name} ${card.code}`}
      data-testid="card-tile"
      style={{ '--rarity-color': rarityTone[card.rarity] ?? '#f4d100' } as React.CSSProperties}
    >
      <span className="card-image-wrap">
        <img src={assetUrl(card.image)} alt={`${card.name} ${card.code}`} loading="lazy" />
        <span className="foil-sweep" aria-hidden="true" />
      </span>
      <span className="card-meta">
        <span>
          <strong>{card.name}</strong>
          <small>{card.code}</small>
        </span>
        <span className="rarity-badge">{card.rarity}</span>
      </span>
    </button>
  );
}

function CardDialog({ card, cards, onSelect, onClose }: { card: Card; cards: Card[]; onSelect: (card: Card) => void; onClose: () => void }) {
  const [showBack, setShowBack] = useState(false);
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const cardIndex = cards.findIndex((item) => item.id === card.id);
  const previousCard = cardIndex > 0 ? cards[cardIndex - 1] : null;
  const nextCard = cardIndex >= 0 && cardIndex < cards.length - 1 ? cards[cardIndex + 1] : null;

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.classList.add('dialog-open');
    closeButtonRef.current?.focus();

    return () => {
      document.body.classList.remove('dialog-open');
      previouslyFocused?.focus();
    };
  }, []);

  useEffect(() => {
    const handleDialogKeys = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'Tab') {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const focusableElements = Array.from(dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        )).filter((element) => element.getAttribute('aria-hidden') !== 'true');

        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const activeElement = document.activeElement;

        if (!dialog.contains(activeElement)) {
          event.preventDefault();
          (event.shiftKey ? lastElement : firstElement).focus();
        } else if (event.shiftKey && activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
        return;
      }

      if (event.key === 'ArrowLeft' && previousCard) onSelect(previousCard);
      if (event.key === 'ArrowRight' && nextCard) onSelect(nextCard);
    };
    window.addEventListener('keydown', handleDialogKeys);
    return () => window.removeEventListener('keydown', handleDialogKeys);
  }, [nextCard, onClose, onSelect, previousCard]);

  useEffect(() => {
    setShowBack(false);
    dialogRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [card.id]);

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={dialogRef} className="card-dialog" role="dialog" aria-modal="true" aria-labelledby="card-dialog-title">
        <button ref={closeButtonRef} className="icon-button close-button" type="button" onClick={onClose} aria-label="关闭卡片详情"><span aria-hidden="true" /></button>
        <div className="dialog-stage">
          <button
            className="dialog-card-trigger"
            type="button"
            onClick={() => setShowBack((value) => !value)}
            aria-label={showBack ? `Show front of ${card.name}，查看${card.nameZh}正面` : `Show back of ${card.name}，查看${card.nameZh}背面`}
            aria-pressed={showBack}
          >
            <span className={`flip-card ${showBack ? 'is-back' : ''}`}>
              <img className="flip-face flip-front" src={assetUrl(card.image)} alt={`${card.name}，${card.nameZh}，正面`} />
              <img className="flip-face flip-back" src={assetUrl(card.backImage)} alt={`${card.name}，${card.nameZh}，背面`} />
            </span>
            <span className="flip-hint" aria-hidden="true">
              <strong>{showBack ? 'SHOW FRONT' : 'CLICK TO FLIP'}</strong>
              <small>{showBack ? '查看正面' : '点击翻面'}</small>
            </span>
          </button>
        </div>
        <div className="dialog-copy">
          <p className="dialog-kicker">
            <span>{card.type} · {card.rarityName}</span>
          </p>
          <h2 id="card-dialog-title"><span>{card.name}</span></h2>
          <div className="detail-grid">
            <span><small className="detail-label"><b>CARD NO.</b></small><strong>{card.code}</strong></span>
            <span><small className="detail-label"><b>RARITY</b></small><strong><b>{card.rarity}</b><small>{card.rarityNameZh}</small></strong></span>
            <span><small className="detail-label"><b>CHARACTER</b></small><strong><b>{card.character}</b><small>{card.characterZh}</small></strong></span>
            <span><small className="detail-label"><b>SOURCE</b></small><strong><b>KAYOU OFFICIAL</b><small>卡游官方</small></strong></span>
          </div>
          <nav className="dialog-nav" aria-label="卡片翻页">
            <button type="button" disabled={!previousCard} onClick={() => previousCard && onSelect(previousCard)} aria-label={previousCard ? `上一张：${previousCard.nameZh} ${previousCard.code}` : '已经是第一张卡片'}>
              <span className="nav-arrow" aria-hidden="true">‹</span>
              <span><b>PREVIOUS CARD</b><small>上一张</small></span>
            </button>
            <span className="dialog-position" aria-label={`第 ${cardIndex + 1} 张，共 ${cards.length} 张`}>
              <b>{String(cardIndex + 1).padStart(3, '0')}</b><i>/</i><small>{String(cards.length).padStart(3, '0')}</small>
            </span>
            <button className="next-card-button" type="button" disabled={!nextCard} onClick={() => nextCard && onSelect(nextCard)} aria-label={nextCard ? `下一张：${nextCard.nameZh} ${nextCard.code}` : '已经是最后一张卡片'}>
              <span><b>NEXT CARD</b><small>下一张</small></span>
              <span className="nav-arrow" aria-hidden="true">›</span>
            </button>
          </nav>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const [rarity, setRarity] = useState(ALL);
  const [character, setCharacter] = useState(ALL);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const characterNames = useMemo(() => {
    const names = [...new Set(catalog.cards.map((card) => card.character))];
    return names.sort((a, b) => {
      if (a === 'Other') return 1;
      if (b === 'Other') return -1;
      return a.localeCompare(b);
    });
  }, []);

  const rarityCounts = useMemo(() => {
    const counts = new Map<string, number>();
    catalog.cards
      .filter((card) => character === ALL || card.character === character)
      .forEach((card) => counts.set(card.rarity, (counts.get(card.rarity) ?? 0) + 1));
    return counts;
  }, [character]);

  const characterOptions = useMemo(() => {
    const counts = new Map<string, number>();
    catalog.cards
      .filter((card) => rarity === ALL || card.rarity === rarity)
      .forEach((card) => counts.set(card.character, (counts.get(card.character) ?? 0) + 1));
    return characterNames.map((name) => [name, counts.get(name) ?? 0] as const);
  }, [characterNames, rarity]);

  const rarityScopeCount = useMemo(
    () => [...rarityCounts.values()].reduce((total, count) => total + count, 0),
    [rarityCounts],
  );

  const filteredCards = useMemo(() => {
    return catalog.cards.filter((card) => {
      const matchesRarity = rarity === ALL || card.rarity === rarity;
      const matchesCharacter = character === ALL || card.character === character;
      return matchesRarity && matchesCharacter;
    });
  }, [rarity, character]);

  const heroCards = [
    catalog.cards.find((card) => card.name === 'Twilight Sparkle' && card.rarity === 'RR※'),
    catalog.cards.find((card) => card.name === 'Fluttershy' && card.rarity === 'RR※'),
    catalog.cards.find((card) => card.name === 'Pinkie Pie' && card.rarity === 'RR※'),
  ].filter(Boolean) as Card[];

  function resetFilters() {
    setRarity(ALL);
    setCharacter(ALL);
  }

  function openFeaturedCard(card: Card) {
    resetFilters();
    setSelectedCard(card);
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <span className="header-atmosphere" aria-hidden="true"><span className="header-glow" /></span>
        <a className="wordmark" href="#top" aria-label="Friendship Archive 首页">FRIENDSHIP<br /><span>ARCHIVE</span></a>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">MY LITTLE PONY · TRADING CARD GALLERY</p>
            <h1 id="hero-title"><span>FRIENDSHIP</span><br />WONDERLAND</h1>
            <p className="hero-description">浏览、筛选并翻看卡游官方卡面。<br />每一张卡，都是一段友谊的闪光档案。</p>
            <a className="yellow-button hero-cta" href="#gallery"><span className="button-label">浏览全部卡片</span><span aria-hidden="true">↓</span></a>
          </div>
          <div className="hero-stage" aria-label="精选卡片">
            <span className="hero-glow" aria-hidden="true" />
            {heroCards.map((card, index) => (
              <button className={`hero-card hero-card-${index + 1}`} type="button" key={card.id} onClick={() => openFeaturedCard(card)} aria-label={`查看 ${card.name}`}>
                <img src={assetUrl(card.image)} alt={card.name} />
              </button>
            ))}
          </div>
          <div className="hero-stats" aria-label="卡库统计">
            <span><strong>{catalog.rarityOrder.length}</strong><small>RARITY TIERS</small></span>
            <span><strong>{catalog.collection.cardCount}</strong><small>CARDS</small></span>
            <span><strong>{characterOptions.length - 1}</strong><small>CHARACTERS</small></span>
          </div>
        </section>

        <section className="gallery-section" id="gallery">
          <div className="section-heading">
            <div>
              <p className="eyebrow">LIST OF CARDS</p>
              <h2>友谊卡片档案</h2>
            </div>
            <p><strong>{filteredCards.length}</strong> / {catalog.cards.length} 张卡片</p>
          </div>

          <div className="filters" id="filters">
            <div className="filter-row rarity-filter" aria-label="按稀有度筛选">
              <span className="filter-label">RARITY</span>
              <button className={rarity === ALL ? 'active' : ''} type="button" onClick={() => setRarity(ALL)}>ALL <small>{rarityScopeCount}</small></button>
              {catalog.rarityOrder.map((item) => (
                <button
                  className={rarity === item ? 'active' : ''}
                  type="button"
                  key={item}
                  onClick={() => setRarity(item)}
                  disabled={(rarityCounts.get(item) ?? 0) === 0}
                  style={{ '--rarity-color': rarityTone[item] } as React.CSSProperties}
                >{item} <small>{rarityCounts.get(item) ?? 0}</small></button>
              ))}
            </div>
            <div className="filter-tools">
              <label>
                <span>CHARACTER</span>
                <select value={character} onChange={(event) => setCharacter(event.target.value)} aria-label="按角色筛选">
                  <option value={ALL}>全部角色</option>
                  {characterOptions.map(([name, count]) => (
                    <option value={name} key={name} disabled={count === 0}>{characterLabels[name] ?? name} · {name} ({count})</option>
                  ))}
                </select>
              </label>
              <button className="reset-button" type="button" onClick={resetFilters}>重置筛选</button>
            </div>
          </div>

          {filteredCards.length > 0 ? (
            <div className="card-grid">
              {filteredCards.map((card) => <CardTile card={card} onOpen={setSelectedCard} key={card.id} />)}
            </div>
          ) : (
            <div className="empty-state">
              <span>0</span><h3>没有找到匹配卡片</h3><p>试试更换角色或稀有度。</p>
              <button className="yellow-button" type="button" onClick={resetFilters}>查看全部卡片</button>
            </div>
          )}
        </section>
      </main>

      <footer>
        <div className="footer-brand">
          <span className="footer-mark">FRIENDSHIP ARCHIVE</span>
          <small>© 2026</small>
        </div>
        <nav className="footer-nav" aria-label="Footer navigation">
          <a className="footer-link" href={catalog.collection.source} target="_blank" rel="noreferrer">
            官方卡表 · OFFICIAL CARD LIST
          </a>
        </nav>
      </footer>

      {selectedCard && <CardDialog card={selectedCard} cards={filteredCards} onSelect={setSelectedCard} onClose={() => setSelectedCard(null)} />}
    </div>
  );
}
