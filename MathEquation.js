class MathEquationTemplate {
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
            justifyContent: 'center', gap: 'clamp(20px,5vw,40px)',
            padding: '20px', boxSizing: 'border-box'
        });

        // Support both:
        // A: {equation: "5 + 3 = ?", answer: 8, options:[...]}  (equation string)
        // B: {operand1:{type,value}, operator:'×', operand2:{type,value}, answer:N, options:[...]}  (data.js)
        const eqCard = document.createElement('div');
        Object.assign(eqCard.style, {
            background: 'white', borderRadius: '24px',
            padding: 'clamp(20px,6vw,40px)', width: '100%',
            boxShadow: '0 8px 28px rgba(0,0,0,0.09)',
            textAlign: 'center', boxSizing: 'border-box'
        });

        const eqText = document.createElement('div');
        eqText.style.fontSize = 'clamp(2rem,8vw,4rem)';
        eqText.style.fontWeight = '900';
        eqText.style.color = '#1e293b';
        eqText.style.letterSpacing = '4px';
        eqText.style.lineHeight = '1.3';

        if (this.content.equation) {
            // Format A - equation string
            eqText.textContent = this.content.equation;
        } else if (this.content.operand1 !== undefined) {
            // Format B - operand objects
            const getVal = (op) => {
                if (op && typeof op === 'object') {
                    if (op.type === 'visual') return `${op.value}×${op.count}`;
                    return op.value !== undefined ? op.value : op;
                }
                return op;
            };
            const left = getVal(this.content.operand1);
            const right = getVal(this.content.operand2);
            const op = this.content.operator || '?';
            eqText.textContent = `${left} ${op} ${right} = ?`;
        }
        eqCard.appendChild(eqText);

        // Visual if provided
        if (this.content.visual) {
            const vis = document.createElement('div');
            vis.style.fontSize = 'clamp(1.6rem,5vw,2.5rem)';
            vis.style.marginTop = '12px';
            vis.textContent = this.content.visual;
            eqCard.appendChild(vis);
        }

        // Options
        const answer = this.content.answer;
        const opts = this.content.options
            ? (typeof this.content.options[0] === 'object' ? this.content.options.map(o => o.value !== undefined ? o.value : o) : this.content.options)
            : this._generateOptions(answer);
        const grid = document.createElement('div');
        Object.assign(grid.style, {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 'clamp(10px,2.5vw,18px)', width: '100%', boxSizing: 'border-box'
        });

        opts.forEach(opt => {
            const btn = document.createElement('button');
            btn.textContent = opt;
            Object.assign(btn.style, {
                background: 'white', border: '3px solid #e5e7eb',
                borderRadius: '18px', padding: 'clamp(14px,4vw,22px)',
                fontSize: 'clamp(1.6rem,5vw,2.5rem)', fontWeight: '900',
                color: '#1e293b', cursor: 'pointer',
                touchAction: 'manipulation', userSelect: 'none',
                fontFamily: 'inherit', transition: 'all 0.15s', minHeight: '70px'
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

        this.container.appendChild(eqCard);
        this.container.appendChild(grid);
    }

    _generateOptions(correct) {
        const n = Number(correct);
        const set = new Set([n]);
        while (set.size < 4) {
            const r = n + Math.floor(Math.random() * 7) - 3;
            if (r >= 0) set.add(r);
        }
        return [...set].sort(() => Math.random() - 0.5);
    }
}
