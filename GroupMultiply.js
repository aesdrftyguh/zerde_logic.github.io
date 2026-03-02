class GroupMultiplyTemplate {
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

        // Support both structures:
        // A: {groups, perGroup, emoji, answer/options}  (our format)
        // B: {operand1, operand2, emoji, total}  (data.js format)
        const groups = this.content.groups || this.content.operand1 || 2;
        const perGroup = this.content.perGroup || this.content.operand2 || 3;
        const emoji = this.content.emoji || '⭐';
        const answer = this.content.answer || this.content.total || (groups * perGroup);

        // Visual groups
        const groupsWrap = document.createElement('div');
        Object.assign(groupsWrap.style, {
            display: 'flex', flexWrap: 'wrap', gap: 'clamp(8px,2vw,14px)',
            width: '100%', justifyContent: 'center', background: 'white',
            borderRadius: '20px', padding: 'clamp(12px,3vw,20px)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.08)', boxSizing: 'border-box'
        });

        for (let g = 0; g < groups; g++) {
            const group = document.createElement('div');
            Object.assign(group.style, {
                display: 'flex', flexWrap: 'wrap', gap: '4px',
                border: '2px dashed #cbd5e1', borderRadius: '12px',
                padding: '8px', background: '#f8fafc',
                justifyContent: 'center', alignItems: 'center',
                maxWidth: 'clamp(70px,18vw,100px)'
            });
            for (let i = 0; i < perGroup; i++) {
                const item = document.createElement('span');
                item.style.fontSize = 'clamp(1.2rem,3.5vw,2rem)';
                item.textContent = emoji;
                group.appendChild(item);
            }
            groupsWrap.appendChild(group);
        }

        // Equation hint
        const eqHint = document.createElement('div');
        eqHint.style.fontSize = 'clamp(1.2rem,4vw,2rem)';
        eqHint.style.fontWeight = '900';
        eqHint.style.color = '#475569';
        eqHint.style.textAlign = 'center';
        eqHint.textContent = `${groups} × ${perGroup} = ?`;

        // Options
        const opts = this.content.options || this._generateOptions(answer);
        const grid = document.createElement('div');
        Object.assign(grid.style, {
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
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
                if (opt === answer) {
                    btn.style.background = '#d1fae5'; btn.style.borderColor = '#10b981';
                    setTimeout(() => this.onSuccess(btn), 500);
                } else {
                    btn.style.background = '#fee2e2'; btn.style.borderColor = '#ef4444';
                    setTimeout(() => this.onFail(), 600);
                }
            });
            grid.appendChild(btn);
        });

        this.container.appendChild(groupsWrap);
        this.container.appendChild(eqHint);
        this.container.appendChild(grid);
    }

    _generateOptions(correct) {
        const set = new Set([correct]);
        while (set.size < 4) {
            const n = correct + Math.floor(Math.random() * 9) - 4;
            if (n > 0) set.add(n);
        }
        return [...set].sort(() => Math.random() - 0.5);
    }
}
