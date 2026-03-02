class MathMissingTemplate {
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
            justifyContent: 'center', gap: 'clamp(20px,5vw,36px)',
            padding: '20px', boxSizing: 'border-box'
        });

        // Support both: 
        // MODE A: sequence array [1, 2, null, 4] 
        // MODE B: equation string "3 + _ = 7"
        const eqCard = document.createElement('div');
        Object.assign(eqCard.style, {
            background: 'white', borderRadius: '24px',
            padding: 'clamp(20px,5vw,36px)', width: '100%',
            boxShadow: '0 8px 28px rgba(0,0,0,0.09)',
            textAlign: 'center', boxSizing: 'border-box'
        });

        const eqRow = document.createElement('div');
        Object.assign(eqRow.style, {
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexWrap: 'wrap',
            gap: 'clamp(6px,2vw,12px)', fontSize: 'clamp(1.8rem,6vw,3.5rem)',
            fontWeight: '900', color: '#1e293b'
        });

        let answer = this.content.correct !== undefined ? this.content.correct : this.content.answer;
        let blankEl = null;

        if (this.content.sequence) {
            // MODE A: sequence [1, 2, null, 4]
            this.content.sequence.forEach((val, i) => {
                if (i > 0) {
                    const sep = document.createElement('span');
                    sep.style.color = '#94a3b8';
                    sep.style.fontSize = 'clamp(1rem,3vw,1.6rem)';
                    sep.textContent = '→';
                    eqRow.appendChild(sep);
                }
                const box = document.createElement('div');
                Object.assign(box.style, {
                    minWidth: 'clamp(44px,11vw,65px)', height: 'clamp(44px,11vw,65px)',
                    background: val === null ? '#fef3c7' : '#f8fafc',
                    border: val === null ? '3px dashed #f59e0b' : '2px solid #e5e7eb',
                    borderRadius: '12px', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    color: val === null ? '#d97706' : '#1e293b'
                });
                box.textContent = val === null ? '?' : val;
                if (val === null) blankEl = box;
                eqRow.appendChild(box);
            });
        } else if (this.content.equation) {
            // MODE B: equation string "3 + _ = 7"
            const parts = this.content.equation.split('_');
            parts.forEach((part, i) => {
                if (part.trim()) {
                    const span = document.createElement('span');
                    span.textContent = part.trim();
                    eqRow.appendChild(span);
                }
                if (i < parts.length - 1) {
                    blankEl = document.createElement('span');
                    Object.assign(blankEl.style, {
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        minWidth: 'clamp(44px,11vw,65px)', height: 'clamp(44px,11vw,65px)',
                        background: '#fef3c7', border: '3px dashed #f59e0b',
                        borderRadius: '12px', color: '#d97706', fontWeight: '900',
                        fontSize: 'clamp(1.4rem,4vw,2.5rem)'
                    });
                    blankEl.textContent = '?';
                    eqRow.appendChild(blankEl);
                }
            });
        }

        this.blankEl = blankEl;
        eqCard.appendChild(eqRow);

        // Options
        const opts = this.content.options || this._generateOptions(answer);
        const grid = document.createElement('div');
        Object.assign(grid.style, {
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 'clamp(10px,2.5vw,18px)', width: '100%', boxSizing: 'border-box'
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
                if (String(opt) === String(answer)) {
                    btn.style.background = '#d1fae5'; btn.style.borderColor = '#10b981';
                    if (blankEl) {
                        blankEl.textContent = opt;
                        blankEl.style.background = '#d1fae5';
                        blankEl.style.borderColor = '#10b981';
                        blankEl.style.color = '#065f46';
                    }
                    setTimeout(() => this.onSuccess(btn), 500);
                } else {
                    btn.style.background = '#fee2e2'; btn.style.borderColor = '#ef4444';
                    setTimeout(() => this.onFail(), 600);
                }
            });
            grid.appendChild(btn);
        });

        this.container.appendChild(eqCard);
        this.container.appendChild(grid);
    }

    _generateOptions(correct) {
        const n = Number(correct);
        const set = new Set([n]);
        while (set.size < 4) {
            const r = n + Math.floor(Math.random() * 9) - 4;
            if (r >= 0) set.add(r);
        }
        return [...set].sort(() => Math.random() - 0.5);
    }
}
