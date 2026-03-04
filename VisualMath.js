/**
 * VisualMath — числа как emoji-картинки
 * 3 + 4 показывается как 🍎🍎🍎 + 🍎🍎🍎🍎 = ?
 * Полная мобильная оптимизация.
 */
class VisualMathTemplate {
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
            justifyContent: 'flex-start', gap: 'clamp(10px,2.5vw,18px)',
            padding: 'clamp(8px,3vw,16px)', boxSizing: 'border-box',
            overflowY: 'auto'
        });

        const {
            emoji = '🍎',
            emoji2,           // second emoji (optional, for subtraction scenes)
            operand1, operator = '+', operand2, answer, options,
            story             // optional story text e.g. "Алида 3 алма бар..."
        } = this.content;

        const displayEmoji1 = emoji;
        const displayEmoji2 = emoji2 || emoji;

        // ── Story card (optional) ─────────────────────────────────────
        if (story) {
            const storyCard = document.createElement('div');
            Object.assign(storyCard.style, {
                width: '100%', padding: 'clamp(10px,3vw,16px)',
                background: 'linear-gradient(135deg,#fff7ed,#ffedd5)',
                borderRadius: '18px', border: '2px solid #fed7aa',
                fontSize: 'clamp(0.82rem,2.6vw,1rem)', fontWeight: '700',
                color: '#9a3412', lineHeight: '1.5', textAlign: 'center',
                boxSizing: 'border-box', flexShrink: '0'
            });
            storyCard.textContent = story;
            this.container.appendChild(storyCard);
        }

        // ── Main equation area ────────────────────────────────────────
        const eqCard = document.createElement('div');
        Object.assign(eqCard.style, {
            width: '100%', background: 'white', borderRadius: '22px',
            padding: 'clamp(12px,3.5vw,24px)',
            boxShadow: '0 8px 28px rgba(0,0,0,0.07)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 'clamp(10px,2vw,16px)', boxSizing: 'border-box', flexShrink: '0'
        });

        // Emoji grids row: [grid1] [op] [grid2] [=] [?]
        const eqRow = document.createElement('div');
        Object.assign(eqRow.style, {
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 'clamp(6px,2vw,14px)', flexWrap: 'wrap', width: '100%'
        });

        // Left operand grid
        const leftGrid = this._makeEmojiGrid(operand1, displayEmoji1, '#fef3c7', '#fbbf24');
        eqRow.appendChild(leftGrid);

        // Operator badge
        const opBadge = this._makeOpBadge(operator);
        eqRow.appendChild(opBadge);

        // Right operand grid
        const rightGrid = this._makeEmojiGrid(operand2, displayEmoji2, '#eff6ff', '#60a5fa');
        eqRow.appendChild(rightGrid);

        // Equals sign
        const eqSign = document.createElement('div');
        Object.assign(eqSign.style, {
            fontWeight: '900', fontSize: 'clamp(1.6rem,5vw,2.8rem)',
            color: '#374151'
        });
        eqSign.textContent = '=';
        eqRow.appendChild(eqSign);

        // Answer placeholder (?)
        const answerBox = document.createElement('div');
        Object.assign(answerBox.style, {
            width: 'clamp(52px,14vw,80px)', height: 'clamp(52px,14vw,80px)',
            borderRadius: '16px', background: '#f8fafc',
            border: '3px dashed #cbd5e1',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: '900', fontSize: 'clamp(1.6rem,5.5vw,2.8rem)', color: '#94a3b8',
            transition: 'all 0.3s ease', flexShrink: '0'
        });
        answerBox.textContent = '?';
        this.answerBox = answerBox;
        eqRow.appendChild(answerBox);

        eqCard.appendChild(eqRow);

        // Number line (small visual number line under equation)
        const numLine = this._makeNumberLine(operand1, operand2, operator, answer);
        if (numLine) eqCard.appendChild(numLine);

        this.container.appendChild(eqCard);

        // ── Answer buttons ────────────────────────────────────────────
        const promptLabel = document.createElement('div');
        Object.assign(promptLabel.style, {
            fontWeight: '900', fontSize: 'clamp(0.8rem,2.5vw,1rem)',
            color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px',
            flexShrink: '0'
        });
        promptLabel.textContent = '👇 Дұрыс жауапты таңда:';

        const btnRow = document.createElement('div');
        Object.assign(btnRow.style, {
            display: 'flex', gap: 'clamp(8px,2vw,14px)',
            justifyContent: 'center', flexWrap: 'wrap',
            width: '100%', flexShrink: '0'
        });

        const shuffled = [...options].sort(() => Math.random() - 0.5);
        shuffled.forEach(opt => {
            const btn = this._makeAnswerBtn(opt, answer, displayEmoji1, displayEmoji2, operator);
            btnRow.appendChild(btn);
        });

        this.container.appendChild(promptLabel);
        this.container.appendChild(btnRow);

        // Announce via speech
        if (window.SFX) {
            const opWord = { '+': 'қосу', '-': 'азайту', '×': 'көбейту', '÷': 'бөлу' }[operator] || '';
            SFX.speak(`${operand1} ${opWord} ${operand2} тең неге?`);
        }
    }

    // ── Emoji grid (count × emoji) ────────────────────────────────────
    _makeEmojiGrid(count, emoji, bgColor, borderColor) {
        const wrap = document.createElement('div');
        Object.assign(wrap.style, {
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: '4px', flexShrink: '0'
        });

        // Number label above grid
        const numLabel = document.createElement('div');
        numLabel.style.cssText = `font-weight:900;font-size:clamp(1rem,3.5vw,1.6rem);
            color:#374151;line-height:1;`;
        numLabel.textContent = count;

        // Grid of emoji
        const gridWrap = document.createElement('div');
        Object.assign(gridWrap.style, {
            background: bgColor,
            border: `2.5px solid ${borderColor}`,
            borderRadius: '14px',
            padding: 'clamp(6px,1.8vw,10px)',
            display: 'flex', flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: `clamp(80px,${Math.min(count, 5) * 32}px, 170px)`,
            gap: 'clamp(2px,0.8vw,5px)',
            minWidth: 'clamp(44px,10vw,64px)',
            minHeight: 'clamp(44px,10vw,64px)',
            alignItems: 'center',
            flexShrink: '0'
        });

        // Show max 9 emoji items, if more show "+N"
        const maxShow = 9;
        const showCount = Math.min(count, maxShow);
        const fontSize = count <= 4 ? 'clamp(1.4rem,4.5vw,2.2rem)'
            : count <= 6 ? 'clamp(1.1rem,3.5vw,1.8rem)'
                : 'clamp(0.9rem,2.8vw,1.4rem)';

        for (let i = 0; i < showCount; i++) {
            const el = document.createElement('span');
            el.style.cssText = `font-size:${fontSize};line-height:1;display:block;`;
            el.textContent = emoji;
            gridWrap.appendChild(el);
        }
        if (count > maxShow) {
            const extra = document.createElement('span');
            extra.style.cssText = `font-size:clamp(0.8rem,2.5vw,1rem);font-weight:900;
                color:#6b7280;line-height:1;`;
            extra.textContent = `+${count - maxShow}`;
            gridWrap.appendChild(extra);
        }

        wrap.appendChild(numLabel);
        wrap.appendChild(gridWrap);
        return wrap;
    }

    // ── Operator badge ────────────────────────────────────────────────
    _makeOpBadge(op) {
        const colors = {
            '+': ['#d1fae5', '#10b981'],
            '-': ['#fee2e2', '#ef4444'],
            '×': ['#ede9fe', '#8b5cf6'],
            '÷': ['#fef3c7', '#f59e0b']
        };
        const [bg, col] = colors[op] || ['#f1f5f9', '#64748b'];
        const badge = document.createElement('div');
        Object.assign(badge.style, {
            width: 'clamp(36px,9vw,54px)', height: 'clamp(36px,9vw,54px)',
            borderRadius: '50%', background: bg,
            border: `2.5px solid ${col}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: '900', fontSize: 'clamp(1.2rem,4vw,2rem)', color: col,
            flexShrink: '0', boxShadow: `0 2px 8px ${col}33`
        });
        badge.textContent = op;
        return badge;
    }

    // ── Number line ───────────────────────────────────────────────────
    _makeNumberLine(op1, op2, operator, answer) {
        if (answer > 20 || op1 > 20 || op2 > 20) return null;
        const max = Math.max(answer, op1 + op2, 12);
        const wrap = document.createElement('div');
        Object.assign(wrap.style, {
            display: 'flex', alignItems: 'center', gap: '0',
            width: '100%', overflowX: 'auto', paddingBottom: '4px'
        });

        for (let i = 0; i <= Math.min(max, 15); i++) {
            const tick = document.createElement('div');
            Object.assign(tick.style, {
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                flex: '1', minWidth: 'clamp(18px,5vw,28px)'
            });

            const dot = document.createElement('div');
            const isAnswer = i === answer;
            const isOp1 = i === op1;
            Object.assign(dot.style, {
                width: isAnswer ? 'clamp(16px,4vw,22px)' : 'clamp(10px,2.5vw,14px)',
                height: isAnswer ? 'clamp(16px,4vw,22px)' : 'clamp(10px,2.5vw,14px)',
                borderRadius: '50%',
                background: isAnswer ? '#10b981' : isOp1 ? '#fbbf24' : '#e5e7eb',
                transition: 'all 0.3s',
                boxShadow: isAnswer ? '0 0 0 3px #d1fae5' : ''
            });

            const lbl = document.createElement('div');
            lbl.style.cssText = `font-size:clamp(0.6rem,1.8vw,0.75rem);font-weight:700;
                color:${isAnswer ? '#10b981' : '#94a3b8'};margin-top:3px;`;
            lbl.textContent = i;

            const line = document.createElement('div');
            Object.assign(line.style, {
                width: '100%', height: '2px',
                background: i < answer ? '#10b98155' : '#e5e7eb',
                marginBottom: '4px'
            });

            tick.appendChild(line);
            tick.appendChild(dot);
            tick.appendChild(lbl);
            wrap.appendChild(tick);
        }
        return wrap;
    }

    // ── Answer button ─────────────────────────────────────────────────
    _makeAnswerBtn(value, correct, emoji1, emoji2, operator) {
        const btn = document.createElement('div');
        Object.assign(btn.style, {
            flex: '1', minWidth: 'clamp(80px,25vw,120px)',
            maxWidth: 'clamp(110px,32vw,160px)',
            background: 'white',
            border: '3px solid #e5e7eb',
            borderRadius: '18px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 'clamp(4px,1.5vw,8px)', cursor: 'pointer',
            padding: 'clamp(10px,3vw,18px) clamp(6px,2vw,12px)',
            boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
            transition: 'all 0.15s cubic-bezier(0.175,0.885,0.32,1.275)',
            touchAction: 'manipulation', userSelect: 'none'
        });

        // Mini emoji preview for the answer value
        const preview = document.createElement('div');
        Object.assign(preview.style, {
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
            gap: '2px', maxWidth: '90px'
        });
        const showCount = Math.min(value, 6);
        const emojiSize = value <= 3 ? 'clamp(1.2rem,3.5vw,1.8rem)' : 'clamp(0.85rem,2.5vw,1.2rem)';
        for (let i = 0; i < showCount; i++) {
            const e = document.createElement('span');
            e.style.cssText = `font-size:${emojiSize};line-height:1;`;
            // Alternate emoji2 color for subtraction/visual variety
            e.textContent = (operator === '-' && i >= correct - (correct - value)) ? emoji2 : emoji1;
            preview.appendChild(e);
        }
        if (value > 6) {
            const dots = document.createElement('span');
            dots.style.cssText = `font-size:clamp(0.7rem,2vw,0.9rem);color:#6b7280;font-weight:900;`;
            dots.textContent = `…+${value - 6}`;
            preview.appendChild(dots);
        }

        // Number
        const num = document.createElement('div');
        num.style.cssText = `font-weight:900;font-size:clamp(1.4rem,4.5vw,2.2rem);
            color:#1e293b;line-height:1;`;
        num.textContent = value;

        btn.appendChild(preview);
        btn.appendChild(num);

        // Hover/press effect
        btn.addEventListener('pointerenter', () => {
            if (this.answered) return;
            btn.style.transform = 'translateY(-3px) scale(1.03)';
            btn.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
        });
        btn.addEventListener('pointerleave', () => {
            if (this.answered) return;
            btn.style.transform = '';
            btn.style.boxShadow = '0 4px 14px rgba(0,0,0,0.06)';
        });
        btn.addEventListener('pointerdown', () => {
            if (this.answered) return;
            btn.style.transform = 'scale(0.95)';
        });
        btn.addEventListener('pointerup', () => {
            if (this.answered) return;
            this.answered = true;

            if (value === correct) {
                // ✅ Correct
                btn.style.background = 'linear-gradient(135deg,#d1fae5,#a7f3d0)';
                btn.style.borderColor = '#10b981';
                btn.style.transform = 'scale(1.06)';
                num.style.color = '#065f46';

                // Fill answer box
                this.answerBox.textContent = value;
                this.answerBox.style.background = '#d1fae5';
                this.answerBox.style.borderColor = '#10b981';
                this.answerBox.style.borderStyle = 'solid';
                this.answerBox.style.color = '#065f46';

                // Bounce animation on answer box
                this.answerBox.style.transform = 'scale(1.2)';
                setTimeout(() => this.answerBox.style.transform = 'scale(1)', 200);

                // Burst particles
                this._burst(btn);
                setTimeout(() => this.onSuccess(btn), 500);
            } else {
                // ❌ Wrong
                btn.style.background = 'linear-gradient(135deg,#fee2e2,#fecaca)';
                btn.style.borderColor = '#ef4444';
                btn.style.transform = '';
                num.style.color = '#991b1b';

                // Shake button
                const shakes = ['8px', '-6px', '5px', '-3px', '0'];
                shakes.forEach((x, i) => {
                    setTimeout(() => btn.style.transform = `translateX(${x})`, i * 60);
                });

                this.onFail();
                // Re-enable after shake
                setTimeout(() => { this.answered = false; btn.style.background = 'white'; btn.style.borderColor = '#e5e7eb'; num.style.color = '#1e293b'; }, 500);
            }
        });

        return btn;
    }

    // ── Confetti burst ────────────────────────────────────────────────
    _burst(el) {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const colors = ['#fbbf24', '#34d399', '#60a5fa', '#f87171', '#a78bfa'];
        for (let i = 0; i < 14; i++) {
            const dot = document.createElement('div');
            const angle = (i / 14) * Math.PI * 2;
            const dist = 32 + Math.random() * 36;
            const size = 6 + Math.random() * 6;
            Object.assign(dot.style, {
                position: 'fixed', left: cx + 'px', top: cy + 'px',
                width: size + 'px', height: size + 'px',
                borderRadius: Math.random() > 0.4 ? '50%' : '2px',
                background: colors[i % colors.length],
                pointerEvents: 'none', zIndex: '9998',
                transition: `all ${0.4 + Math.random() * 0.3}s ease-out`
            });
            document.body.appendChild(dot);
            requestAnimationFrame(() => {
                setTimeout(() => {
                    dot.style.left = (cx + Math.cos(angle) * dist) + 'px';
                    dot.style.top = (cy + Math.sin(angle) * dist) + 'px';
                    dot.style.opacity = '0';
                    dot.style.transform = 'scale(0)';
                }, 10);
            });
            setTimeout(() => dot.remove(), 800);
        }
    }
}
