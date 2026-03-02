class CountingTemplate {
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
            justifyContent: 'flex-start', gap: 'clamp(14px,3vw,22px)',
            padding: '14px', boxSizing: 'border-box', overflowY: 'auto'
        });

        // Instruction
        const inst = document.createElement('div');
        inst.style.fontSize = 'clamp(0.9rem,3vw,1.1rem)';
        inst.style.fontWeight = '700';
        inst.style.color = '#475569';
        inst.style.textAlign = 'center';
        inst.textContent = this.content.instruction || 'Санай!';

        // Support:
        // A: {items:[{emoji, count}], targetEmoji:'...', answer:N}  ← data.js format
        // B: {objects:[{emoji, count}], question:'...', answer:N}   ← our format  
        const items = this.content.items || this.content.objects || [];
        const targetEmoji = this.content.targetEmoji;
        const answer = this.content.answer;

        // Display all items (highlight target)
        const displayBox = document.createElement('div');
        Object.assign(displayBox.style, {
            background: 'white', borderRadius: '20px',
            padding: 'clamp(12px,3.5vw,22px)', width: '100%',
            boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
            display: 'flex', flexWrap: 'wrap',
            justifyContent: 'center', gap: 'clamp(6px,2vw,10px)',
            boxSizing: 'border-box'
        });

        items.forEach(item => {
            const isTarget = targetEmoji && item.emoji === targetEmoji;
            for (let i = 0; i < item.count; i++) {
                const el = document.createElement('span');
                el.style.fontSize = 'clamp(1.4rem,5vw,2.8rem)';
                el.style.display = 'inline-flex';
                el.style.alignItems = 'center';
                el.style.justifyContent = 'center';
                el.style.transition = 'transform 0.2s';
                el.textContent = item.emoji;
                if (isTarget) {
                    el.style.filter = 'drop-shadow(0 2px 4px rgba(245,158,11,0.5))';
                } else {
                    el.style.opacity = '0.5';
                }
                displayBox.appendChild(el);
            }
        });

        // Target ask
        if (targetEmoji) {
            const ask = document.createElement('div');
            ask.style.fontSize = 'clamp(0.85rem,2.5vw,1.05rem)';
            ask.style.fontWeight = '700';
            ask.style.color = '#64748b';
            ask.style.textAlign = 'center';
            ask.textContent = `${targetEmoji} — нешеу?`;
            this.container.appendChild(inst);
            this.container.appendChild(displayBox);
            this.container.appendChild(ask);
        } else {
            this.container.appendChild(inst);
            this.container.appendChild(displayBox);
        }

        // Option buttons
        const opts = this.content.options || this._generateOptions(answer);
        const grid = document.createElement('div');
        Object.assign(grid.style, {
            display: 'grid', gridTemplateColumns: 'repeat(2,1fr)',
            gap: 'clamp(10px,2.5vw,16px)', width: '100%', boxSizing: 'border-box'
        });

        opts.forEach(opt => {
            const btn = document.createElement('button');
            btn.textContent = opt;
            Object.assign(btn.style, {
                background: 'white', border: '3px solid #e5e7eb',
                borderRadius: '18px', padding: 'clamp(14px,4vw,20px)',
                fontSize: 'clamp(1.6rem,5vw,2.4rem)', fontWeight: '900',
                color: '#1e293b', cursor: 'pointer',
                touchAction: 'manipulation', userSelect: 'none',
                fontFamily: 'inherit', transition: 'all 0.15s', minHeight: '68px'
            });
            btn.addEventListener('pointerdown', () => btn.style.transform = 'scale(0.95)');
            btn.addEventListener('pointerup', () => {
                if (this.answered) return;
                btn.style.transform = '';
                this.answered = true;
                if (opt == answer) {
                    btn.style.background = '#d1fae5'; btn.style.borderColor = '#10b981';
                    setTimeout(() => this.onSuccess(btn), 500);
                } else {
                    btn.style.background = '#fee2e2'; btn.style.borderColor = '#ef4444';
                    setTimeout(() => this.onFail(), 600);
                }
            });
            grid.appendChild(btn);
        });

        this.container.appendChild(grid);
    }

    _generateOptions(correct) {
        const n = Number(correct);
        const set = new Set([n]);
        while (set.size < 4) {
            const r = n + Math.floor(Math.random() * 7) - 3;
            if (r > 0) set.add(r);
        }
        return [...set].sort(() => Math.random() - 0.5);
    }
}
