class ProjectionTemplate {
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
            justifyContent: 'flex-start', gap: 'clamp(14px,3vw,24px)',
            padding: '14px', boxSizing: 'border-box', overflowY: 'auto'
        });

        // Instruction
        const inst = document.createElement('div');
        inst.style.fontSize = 'clamp(0.9rem,3vw,1.1rem)';
        inst.style.fontWeight = '700';
        inst.style.color = '#475569';
        inst.style.textAlign = 'center';
        inst.textContent = this.content.instruction || 'Жоғарыдан қараған кезде қандай пішін болады?';

        // Object view
        const objCard = document.createElement('div');
        Object.assign(objCard.style, {
            background: 'white', borderRadius: '20px',
            padding: 'clamp(16px,4vw,28px)', width: '100%',
            boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
            textAlign: 'center', boxSizing: 'border-box'
        });

        const objView = document.createElement('div');
        objView.style.fontSize = 'clamp(4rem,14vw,7rem)';
        objView.textContent = this.content.object;
        objCard.appendChild(objView);

        if (this.content.objectLabel) {
            const l = document.createElement('div');
            l.style.fontSize = 'clamp(0.85rem,2.5vw,1rem)';
            l.style.fontWeight = '700';
            l.style.color = '#94a3b8';
            l.style.marginTop = '8px';
            l.textContent = this.content.objectLabel;
            objCard.appendChild(l);
        }

        // Options
        const opts = [...this.content.options];
        for (let i = opts.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [opts[i], opts[j]] = [opts[j], opts[i]];
        }

        const grid = document.createElement('div');
        Object.assign(grid.style, {
            display: 'grid',
            gridTemplateColumns: `repeat(2, 1fr)`,
            gap: 'clamp(8px,2vw,14px)', width: '100%', boxSizing: 'border-box'
        });

        opts.forEach(opt => {
            const card = document.createElement('div');
            Object.assign(card.style, {
                background: 'white', borderRadius: '18px',
                border: '2px solid #e5e7eb', padding: 'clamp(12px,3vw,20px)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 'clamp(2rem,7vw,3.5rem)', cursor: 'pointer',
                boxShadow: '0 3px 10px rgba(0,0,0,0.06)',
                touchAction: 'manipulation', userSelect: 'none',
                transition: 'all 0.15s', gap: '6px', aspectRatio: '1'
            });

            card.textContent = opt.content;
            if (opt.label) {
                const l = document.createElement('div');
                l.style.fontSize = 'clamp(0.7rem,2vw,0.9rem)';
                l.style.fontWeight = '700';
                l.style.color = '#94a3b8';
                l.textContent = opt.label;
                card.appendChild(l);
            }

            card.addEventListener('pointerdown', () => card.style.transform = 'scale(0.94)');
            card.addEventListener('pointerup', () => {
                if (this.answered) return;
                card.style.transform = '';
                this.answered = true;
                if (opt.correct) {
                    card.style.background = '#d1fae5'; card.style.borderColor = '#10b981';
                    setTimeout(() => this.onSuccess(card), 500);
                } else {
                    card.style.background = '#fee2e2'; card.style.borderColor = '#ef4444';
                    setTimeout(() => this.onFail(), 600);
                }
            });
            grid.appendChild(card);
        });

        this.container.appendChild(inst);
        this.container.appendChild(objCard);
        this.container.appendChild(grid);
    }
}
