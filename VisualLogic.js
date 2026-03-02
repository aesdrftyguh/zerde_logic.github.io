class VisualLogicTemplate {
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
            justifyContent: 'flex-start', gap: 'clamp(16px,4vw,28px)',
            padding: '14px', boxSizing: 'border-box', overflowY: 'auto'
        });

        const grid = this.content.grid || [];
        const options = this.content.options || [];

        // ── Grid display ──────────────────────────────────────────────
        const gridCard = document.createElement('div');
        Object.assign(gridCard.style, {
            background: 'white', borderRadius: '22px',
            padding: 'clamp(14px,4vw,24px)', width: '100%',
            boxShadow: '0 6px 22px rgba(0,0,0,0.09)', boxSizing: 'border-box'
        });

        const cols = grid.length > 0 ? grid[0].length : 3;
        const gridEl = document.createElement('div');
        Object.assign(gridEl.style, {
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: 'clamp(6px,2vw,12px)', width: '100%'
        });

        grid.forEach(row => {
            row.forEach(cell => {
                const el = document.createElement('div');
                Object.assign(el.style, {
                    aspectRatio: '1', background: '#f8fafc',
                    borderRadius: 'clamp(8px,2vw,14px)',
                    border: cell === '?' ? '2.5px dashed #f59e0b' : '2px solid #e5e7eb',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 'clamp(1.5rem,5.5vw,3rem)',
                    background: cell === '?' ? '#fef3c7' : '#f8fafc',
                    userSelect: 'none'
                });
                el.textContent = cell;
                if (cell === '?') el.style.color = '#d97706';
                gridEl.appendChild(el);
            });
        });

        gridCard.appendChild(gridEl);

        // ── Label ──────────────────────────────────────────────────────
        const label = document.createElement('div');
        label.style.fontSize = 'clamp(0.85rem,2.8vw,1.1rem)';
        label.style.fontWeight = '700'; label.style.color = '#475569';
        label.style.textAlign = 'center';
        label.textContent = '«?» орнына нені қоясың?';

        // ── Options ───────────────────────────────────────────────────
        const optRow = document.createElement('div');
        Object.assign(optRow.style, {
            display: 'flex', gap: 'clamp(10px,3vw,20px)',
            justifyContent: 'center', flexWrap: 'wrap', width: '100%'
        });

        options.forEach(opt => {
            const display = opt.content || opt.emoji || String(opt);
            const isCorrect = opt.correct === true;

            const btn = document.createElement('div');
            btn.textContent = display;
            Object.assign(btn.style, {
                width: 'clamp(70px,20vw,110px)', height: 'clamp(70px,20vw,110px)',
                background: 'white', borderRadius: '18px',
                border: '3px solid #e5e7eb', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 'clamp(2rem,7vw,3.5rem)', cursor: 'pointer',
                touchAction: 'manipulation', userSelect: 'none',
                transition: 'all 0.15s', flexShrink: '0',
                boxShadow: '0 4px 14px rgba(0,0,0,0.07)'
            });
            btn.addEventListener('pointerdown', () => btn.style.transform = 'scale(0.93)');
            btn.addEventListener('pointerup', () => {
                if (this.answered) return;
                btn.style.transform = '';
                this.answered = true;
                if (isCorrect) {
                    btn.style.background = '#d1fae5'; btn.style.borderColor = '#10b981';
                    // Fill in the ? cell
                    const qCell = gridEl.querySelector('div:last-child') ||
                        Array.from(gridEl.children).find(c => c.textContent === '?');
                    if (qCell) {
                        qCell.textContent = display;
                        qCell.style.background = '#d1fae5'; qCell.style.borderColor = '#10b981';
                        qCell.style.border = '2.5px solid #10b981';
                        qCell.style.color = '#065f46';
                    }
                    setTimeout(() => this.onSuccess(btn), 500);
                } else {
                    btn.style.background = '#fee2e2'; btn.style.borderColor = '#ef4444';
                    setTimeout(() => this.onFail(), 600);
                }
            });
            optRow.appendChild(btn);
        });

        this.container.appendChild(gridCard);
        this.container.appendChild(label);
        this.container.appendChild(optRow);
    }
}
