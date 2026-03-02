class MatchingTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content;
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.pairs = content.pairs || [];
        this.leftSelected = null;
        this.rightSelected = null;
        this.matchesFound = 0;
        this.render();
    }

    render() {
        this.container.innerHTML = '';
        Object.assign(this.container.style, {
            width: '100%', height: '100%', display: 'flex',
            flexDirection: 'row', flexWrap: 'wrap',
            alignItems: 'flex-start', justifyContent: 'center',
            gap: 'clamp(10px,3vw,24px)', padding: '12px',
            boxSizing: 'border-box', overflowY: 'auto'
        });

        const leftItems = this.pairs.map(p => ({ ...p.left, pairId: p.id, side: 'left' }));
        const rightItems = this.pairs.map(p => ({ ...p.right, pairId: p.id, side: 'right' }));
        rightItems.sort(() => Math.random() - 0.5);

        const makeCol = () => {
            const col = document.createElement('div');
            Object.assign(col.style, {
                display: 'flex', flexDirection: 'column',
                gap: 'clamp(8px,2vw,14px)', flex: '1',
                minWidth: '130px', maxWidth: '48%'
            });
            return col;
        };

        const leftCol = makeCol();
        const rightCol = makeCol();

        leftItems.forEach(item => leftCol.appendChild(this.createCard(item)));
        rightItems.forEach(item => rightCol.appendChild(this.createCard(item)));

        this.container.appendChild(leftCol);
        this.container.appendChild(rightCol);
    }

    createCard(item) {
        const card = document.createElement('div');
        Object.assign(card.style, {
            background: 'white', border: '2px solid transparent',
            borderRadius: '16px', padding: 'clamp(10px,3vw,18px) 10px',
            textAlign: 'center', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.07)',
            transition: 'all 0.15s', touchAction: 'manipulation',
            userSelect: 'none', fontSize: 'clamp(1.6rem,5vw,2.5rem)',
            minHeight: 'clamp(60px,14vw,85px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        });
        card.textContent = item.content;
        card.dataset.pairId = item.pairId;
        card.dataset.side = item.side;

        card.addEventListener('pointerdown', () => card.style.transform = 'scale(0.95)');
        card.addEventListener('pointerup', () => {
            card.style.transform = '';
            this.handleClick(card);
        });
        return card;
    }

    handleClick(card) {
        if (card.dataset.matched) return;
        if (card.dataset.selected) {
            card.dataset.selected = '';
            card.style.border = '2px solid transparent';
            card.style.background = 'white';
            if (card.dataset.side === 'left') this.leftSelected = null;
            else this.rightSelected = null;
            return;
        }

        if (card.dataset.side === 'left') {
            if (this.leftSelected) {
                this.leftSelected.dataset.selected = '';
                this.leftSelected.style.border = '2px solid transparent';
                this.leftSelected.style.background = 'white';
            }
            this.leftSelected = card;
        } else {
            if (this.rightSelected) {
                this.rightSelected.dataset.selected = '';
                this.rightSelected.style.border = '2px solid transparent';
                this.rightSelected.style.background = 'white';
            }
            this.rightSelected = card;
        }

        card.dataset.selected = '1';
        card.style.border = '3px solid #f59e0b';
        card.style.background = '#fffbeb';

        if (this.leftSelected && this.rightSelected) {
            if (this.leftSelected.dataset.pairId === this.rightSelected.dataset.pairId) {
                [this.leftSelected, this.rightSelected].forEach(c => {
                    c.dataset.matched = '1';
                    c.dataset.selected = '';
                    c.style.background = '#d1fae5';
                    c.style.border = '3px solid #10b981';
                });
                this.leftSelected = this.rightSelected = null;
                this.matchesFound++;
                if (window.SFX) SFX.playClick();
                if (this.matchesFound === this.pairs.length) setTimeout(() => this.onSuccess(), 400);
            } else {
                const l = this.leftSelected, r = this.rightSelected;
                l.style.background = '#fee2e2'; l.style.border = '3px solid #ef4444';
                r.style.background = '#fee2e2'; r.style.border = '3px solid #ef4444';
                setTimeout(() => {
                    [l, r].forEach(c => {
                        c.style.background = 'white';
                        c.style.border = '2px solid transparent';
                        c.dataset.selected = '';
                    });
                    this.leftSelected = this.rightSelected = null;
                    this.onFail();
                }, 700);
            }
        }
    }
}
