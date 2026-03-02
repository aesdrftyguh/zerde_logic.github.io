class MultipleChoiceTemplate {
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
            justifyContent: 'flex-start', gap: '20px',
            padding: '20px', boxSizing: 'border-box', overflowY: 'auto'
        });

        // Question card
        const qCard = document.createElement('div');
        Object.assign(qCard.style, {
            background: 'white', borderRadius: '20px',
            padding: 'clamp(16px,4vw,28px)', width: '100%',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            textAlign: 'center', boxSizing: 'border-box'
        });

        if (this.content.image) {
            const img = document.createElement('div');
            img.style.fontSize = 'clamp(4rem,15vw,7rem)';
            img.style.marginBottom = '12px';
            img.textContent = this.content.image;
            qCard.appendChild(img);
        }

        const qText = document.createElement('div');
        qText.style.fontSize = 'clamp(1.1rem,3.5vw,1.6rem)';
        qText.style.fontWeight = '800';
        qText.style.color = '#1e293b';
        qText.style.lineHeight = '1.4';
        qText.textContent = this.content.question;
        qCard.appendChild(qText);

        // Options grid
        const grid = document.createElement('div');
        const cols = this.content.options.length <= 2 ? 1 : 2;
        Object.assign(grid.style, {
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: 'clamp(8px,2vw,16px)',
            width: '100%', boxSizing: 'border-box'
        });

        this.content.options.forEach(opt => {
            const btn = document.createElement('button');
            Object.assign(btn.style, {
                background: 'white', border: '2px solid #e5e7eb',
                borderRadius: '16px', padding: 'clamp(14px,3vw,22px) 12px',
                fontSize: 'clamp(1rem,3vw,1.3rem)', fontWeight: '700',
                color: '#374151', cursor: 'pointer',
                transition: 'all 0.15s ease', width: '100%',
                minHeight: '56px', touchAction: 'manipulation',
                userSelect: 'none', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            });

            if (opt.icon) {
                const icon = document.createElement('span');
                icon.style.fontSize = 'clamp(1.4rem,4vw,2rem)';
                icon.textContent = opt.icon;
                btn.appendChild(icon);
            }
            const label = document.createElement('span');
            const displayText = typeof opt === 'object'
                ? (opt.content || opt.text || opt.emoji || JSON.stringify(opt))
                : String(opt);
            label.textContent = displayText;
            btn.appendChild(label);

            btn.addEventListener('pointerdown', () => {
                if (this.answered) return;
                btn.style.transform = 'scale(0.96)';
            });
            btn.addEventListener('pointerup', () => {
                if (this.answered) return;
                btn.style.transform = '';
                this.answered = true;
                const isCorrect = (opt.correct === true) || (opt === this.content.correct) || (opt.text === this.content.correct);
                if (isCorrect) {
                    btn.style.background = '#d1fae5';
                    btn.style.borderColor = '#10b981';
                    btn.style.color = '#065f46';
                    setTimeout(() => this.onSuccess(btn), 500);
                } else {
                    btn.style.background = '#fee2e2';
                    btn.style.borderColor = '#ef4444';
                    btn.style.color = '#7f1d1d';
                    setTimeout(() => this.onFail(), 600);
                }
            });

            grid.appendChild(btn);
        });

        this.container.appendChild(qCard);
        this.container.appendChild(grid);
    }
}
