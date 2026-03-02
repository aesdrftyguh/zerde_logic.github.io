class NextInSequenceTemplate {
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

        // ── Sequence display ──────────────────────────────────────────
        const seqCard = document.createElement('div');
        Object.assign(seqCard.style, {
            background: 'white', borderRadius: '20px',
            padding: 'clamp(14px,4vw,24px)', width: '100%',
            boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
            textAlign: 'center', boxSizing: 'border-box'
        });

        const seqRow = document.createElement('div');
        Object.assign(seqRow.style, {
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexWrap: 'wrap', gap: 'clamp(6px,2vw,14px)', width: '100%'
        });

        const sequence = this.content.sequence || [];
        sequence.forEach((item, i) => {
            const cell = document.createElement('div');
            Object.assign(cell.style, {
                minWidth: 'clamp(44px,11vw,70px)', minHeight: 'clamp(44px,11vw,70px)',
                background: '#f8fafc', border: '2px solid #e5e7eb',
                borderRadius: '12px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 'clamp(1.6rem,5.5vw,3rem)', fontWeight: '900',
                color: '#1e293b', padding: '4px'
            });
            cell.textContent = item;
            seqRow.appendChild(cell);

            // Arrow between items
            if (i < sequence.length - 1) {
                const arrow = document.createElement('div');
                arrow.style.fontSize = 'clamp(0.9rem,2.5vw,1.3rem)';
                arrow.style.color = '#94a3b8';
                arrow.style.userSelect = 'none';
                arrow.textContent = '→';
                seqRow.appendChild(arrow);
            }
        });

        // "?" next cell
        const nextArrow = document.createElement('div');
        nextArrow.style.fontSize = 'clamp(0.9rem,2.5vw,1.3rem)';
        nextArrow.style.color = '#94a3b8';
        nextArrow.textContent = '→';
        const nextCell = document.createElement('div');
        Object.assign(nextCell.style, {
            minWidth: 'clamp(44px,11vw,70px)', minHeight: 'clamp(44px,11vw,70px)',
            background: '#fef3c7', border: '2px dashed #f59e0b',
            borderRadius: '12px', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 'clamp(1.4rem,5vw,2.5rem)', fontWeight: '900',
            color: '#d97706', padding: '4px'
        });
        nextCell.textContent = '?';
        this.nextCell = nextCell;
        seqRow.appendChild(nextArrow);
        seqRow.appendChild(nextCell);

        seqCard.appendChild(seqRow);

        // ── Label ──────────────────────────────────────────────────────
        const label = document.createElement('div');
        label.style.fontSize = 'clamp(0.85rem,2.8vw,1.1rem)';
        label.style.fontWeight = '700';
        label.style.color = '#475569';
        label.style.textAlign = 'center';
        label.textContent = 'Жалғасын тап — қайсысы келесі?';

        // ── Options ───────────────────────────────────────────────────
        const options = this.content.options || [];
        const cols = options.length <= 3 ? options.length : 2;
        const optGrid = document.createElement('div');
        Object.assign(optGrid.style, {
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: 'clamp(10px,2.5vw,18px)', width: '100%',
            boxSizing: 'border-box'
        });

        options.forEach(opt => {
            // opt may be {content, correct} or just a string
            const isObj = typeof opt === 'object' && opt !== null;
            const display = isObj ? (opt.content || opt.emoji || String(opt)) : String(opt);
            const isCorrect = isObj ? (opt.correct === true) : false;

            const btn = document.createElement('button');
            btn.textContent = display;
            Object.assign(btn.style, {
                background: 'white', border: '3px solid #e5e7eb',
                borderRadius: '18px', padding: 'clamp(12px,3.5vw,20px)',
                fontSize: 'clamp(1.6rem,6vw,3rem)', fontWeight: '900',
                color: '#1e293b', cursor: 'pointer',
                touchAction: 'manipulation', userSelect: 'none',
                fontFamily: 'inherit', transition: 'all 0.15s',
                minHeight: 'clamp(64px,16vw,90px)', lineHeight: '1.2',
                boxShadow: '0 4px 14px rgba(0,0,0,0.06)'
            });
            btn.addEventListener('pointerdown', () => btn.style.transform = 'scale(0.94)');
            btn.addEventListener('pointerup', () => {
                if (this.answered) return;
                btn.style.transform = '';
                this.answered = true;
                if (isCorrect) {
                    btn.style.background = '#d1fae5'; btn.style.borderColor = '#10b981';
                    nextCell.textContent = display;
                    nextCell.style.background = '#d1fae5'; nextCell.style.borderColor = '#10b981';
                    nextCell.style.color = '#065f46';
                    setTimeout(() => this.onSuccess(btn), 500);
                } else {
                    btn.style.background = '#fee2e2'; btn.style.borderColor = '#ef4444';
                    setTimeout(() => this.onFail(), 600);
                }
            });
            optGrid.appendChild(btn);
        });

        this.container.appendChild(seqCard);
        this.container.appendChild(label);
        this.container.appendChild(optGrid);
    }
}
