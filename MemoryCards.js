class MemoryCardsTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content;
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.flipped = [];
        this.matched = 0;
        this.locked = false;
        this.render();
    }

    render() {
        this.container.innerHTML = '';
        Object.assign(this.container.style, {
            width: '100%', height: '100%', display: 'flex',
            flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '10px',
            boxSizing: 'border-box', gap: '10px'
        });

        // Support both formats:
        // A: {pairs: [{id, emoji}]}
        // B: {pairs: ['🐶','🐱','🦁']}  ← data.js format
        let pairs;
        const rawPairs = this.content.pairs;
        if (typeof rawPairs[0] === 'string') {
            pairs = rawPairs.map((emoji, i) => ({ id: i, emoji }));
        } else {
            pairs = rawPairs.map((p, i) => ({ id: p.id !== undefined ? p.id : i, emoji: p.emoji || p.content || p }));
        }

        // Build cards array (×2)
        const cards = [];
        pairs.forEach(p => {
            cards.push({ id: p.id, emoji: p.emoji });
            cards.push({ id: p.id, emoji: p.emoji });
        });
        // Shuffle
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }

        const cols = cards.length <= 8 ? 4 : 4;
        const grid = document.createElement('div');
        Object.assign(grid.style, {
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: 'clamp(6px,2vw,12px)',
            width: '100%', maxWidth: '440px'
        });

        // Score bar
        const scoreBar = document.createElement('div');
        Object.assign(scoreBar.style, {
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '8px', padding: '6px 18px',
            background: 'rgba(255,255,255,0.8)', borderRadius: '30px',
            border: '2px solid #e5e7eb', flexShrink: '0',
            fontSize: 'clamp(0.85rem,2.5vw,1rem)', fontWeight: '800', color: '#475569'
        });
        const scoreEl = document.createElement('span');
        scoreEl.textContent = `🃏 Жұп: 0 / ${pairs.length}`;
        scoreBar.appendChild(scoreEl);
        this.container.appendChild(scoreBar);

        const cardEls = [];
        cards.forEach((cardData, idx) => {
            const wrapper = document.createElement('div');
            wrapper.style.perspective = '600px';
            wrapper.style.aspectRatio = '1';

            const inner = document.createElement('div');
            Object.assign(inner.style, {
                position: 'relative', width: '100%', height: '100%',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.4s ease',
                cursor: 'pointer', touchAction: 'manipulation'
            });
            inner._flipped = false;
            inner._matched = false;
            inner._id = cardData.id;
            inner._cardIdx = idx;

            const front = document.createElement('div');
            Object.assign(front.style, {
                position: 'absolute', inset: '0',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                borderRadius: 'clamp(10px,2vw,16px)',
                background: 'linear-gradient(135deg,#fbbf24,#f59e0b)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'clamp(1.2rem,4vw,2rem)', fontWeight: '900', color: 'white',
                boxShadow: '0 4px 12px rgba(245,158,11,0.3)'
            });
            front.textContent = '?';

            const back = document.createElement('div');
            Object.assign(back.style, {
                position: 'absolute', inset: '0',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                borderRadius: 'clamp(10px,2vw,16px)',
                background: 'white', border: '2px solid #e5e7eb',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'clamp(1.4rem,5vw,2.8rem)',
                transform: 'rotateY(180deg)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
            });
            back.textContent = cardData.emoji;

            inner.appendChild(front);
            inner.appendChild(back);
            wrapper.appendChild(inner);
            cardEls.push(inner);

            inner.addEventListener('pointerup', () => {
                if (this.locked || inner._flipped || inner._matched) return;
                inner.style.transform = 'rotateY(180deg)';
                inner._flipped = true;
                this.flipped.push(inner);

                if (this.flipped.length === 2) {
                    this.locked = true;
                    const [a, b] = this.flipped;
                    if (a._id === b._id) {
                        a._matched = b._matched = true;
                        a.querySelector('div:last-child').style.background = '#d1fae5';
                        b.querySelector('div:last-child').style.background = '#d1fae5';
                        this.flipped = [];
                        this.locked = false;
                        this.matched++;
                        if (scoreEl) scoreEl.textContent = `🃏 Жұп: ${this.matched} / ${pairs.length}`;
                        if (this.matched === pairs.length) setTimeout(() => this.onSuccess(), 400);
                    } else {
                        setTimeout(() => {
                            a.style.transform = '';
                            b.style.transform = '';
                            a._flipped = b._flipped = false;
                            this.flipped = [];
                            this.locked = false;
                            this.onFail();
                        }, 900);
                    }
                }
            });

            grid.appendChild(wrapper);
        });

        this.container.appendChild(grid);
    }
}
