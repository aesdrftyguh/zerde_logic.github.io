class SpatialTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content;
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.answered = false;
        this.render();
    }

    render() {
        this.container.innerHTML = '';
        Object.assign(this.container.style, {
            width: '100%', height: '100%', display: 'flex',
            flexDirection: 'column', alignItems: 'center',
            justifyContent: 'flex-start', gap: 'clamp(18px,4.5vw,36px)',
            padding: '14px', boxSizing: 'border-box', overflowY: 'auto'
        });

        // Original item display
        const originalCard = document.createElement('div');
        Object.assign(originalCard.style, {
            background: 'white', borderRadius: '24px',
            padding: 'clamp(20px,6vw,36px)', width: '100%',
            boxShadow: '0 8px 28px rgba(0,0,0,0.09)',
            textAlign: 'center', boxSizing: 'border-box', position: 'relative'
        });

        const origLabel = document.createElement('div');
        origLabel.style.fontSize = 'clamp(0.7rem,2.2vw,0.9rem)';
        origLabel.style.fontWeight = '700'; origLabel.style.color = '#94a3b8';
        origLabel.style.textTransform = 'uppercase';
        origLabel.style.marginBottom = '10px';
        origLabel.textContent = 'БАСТАПҚЫ / ORIGINAL';

        const origDisplay = document.createElement('div');
        origDisplay.style.fontSize = 'clamp(3rem,14vw,6rem)';
        origDisplay.style.lineHeight = '1.1';
        origDisplay.style.userSelect = 'none';
        origDisplay.textContent = this.content.original || '';

        originalCard.appendChild(origLabel);
        originalCard.appendChild(origDisplay);

        // Question label
        const qLabel = document.createElement('div');
        qLabel.style.fontSize = 'clamp(0.85rem,2.8vw,1.1rem)';
        qLabel.style.fontWeight = '700'; qLabel.style.color = '#475569';
        qLabel.style.textAlign = 'center';
        qLabel.textContent = 'Қайсысы дұрыс?';

        // Options grid
        const options = this.content.options || [];
        const cols = options.length <= 3 ? options.length : 2;
        const optGrid = document.createElement('div');
        Object.assign(optGrid.style, {
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(cols, 3)}, 1fr)`,
            gap: 'clamp(10px,2.5vw,20px)', width: '100%',
            boxSizing: 'border-box'
        });

        options.forEach(opt => {
            const isCorrect = opt.correct === true;
            const display = opt.content || opt.emoji || '';
            const transform = opt.transform || '';

            const card = document.createElement('div');
            Object.assign(card.style, {
                background: 'white', borderRadius: '18px',
                border: '3px solid #e5e7eb', padding: 'clamp(14px,4vw,22px)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: '8px', cursor: 'pointer', touchAction: 'manipulation',
                userSelect: 'none', transition: 'all 0.15s',
                boxShadow: '0 4px 14px rgba(0,0,0,0.06)', minHeight: 'clamp(80px,20vw,120px)'
            });

            const emoji = document.createElement('div');
            emoji.style.fontSize = 'clamp(2.2rem,8vw,4rem)';
            emoji.style.lineHeight = '1.1';
            emoji.style.userSelect = 'none';
            emoji.style.display = 'inline-block';
            if (transform) emoji.style.transform = transform;
            emoji.textContent = display;
            card.appendChild(emoji);

            card.addEventListener('pointerdown', () => card.style.transform = 'scale(0.94)');
            card.addEventListener('pointerup', () => {
                if (this.answered) return;
                card.style.transform = '';
                this.answered = true;
                if (isCorrect) {
                    card.style.background = '#d1fae5'; card.style.borderColor = '#10b981';
                    setTimeout(() => this.onSuccess(card), 500);
                } else {
                    card.style.background = '#fee2e2'; card.style.borderColor = '#ef4444';
                    setTimeout(() => this.onFail(), 600);
                }
            });
            optGrid.appendChild(card);
        });

        this.container.appendChild(originalCard);
        this.container.appendChild(qLabel);
        this.container.appendChild(optGrid);
    }
}
