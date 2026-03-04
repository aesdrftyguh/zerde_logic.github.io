/**
 * ChocoDivide — 🍫 Шоколадка ломается, части раздаются персонажам
 * Тема: деление
 */
class ChocoDivideTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content;
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.answered = false;
        this.render();
    }

    render() {
        const { total, divideBy, answer, options, story, itemEmoji = '🍫' } = this.content;
        this.correctAnswer = answer;

        this.container.innerHTML = '';
        Object.assign(this.container.style, {
            width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 'clamp(8px,2vw,14px)',
            padding: 'clamp(8px,3vw,16px)', boxSizing: 'border-box',
            overflowY: 'auto', fontFamily: "'Nunito', sans-serif"
        });

        // Story card
        if (story) {
            const storyCard = document.createElement('div');
            storyCard.style.cssText = `
                width:100%;padding:clamp(10px,3vw,14px);
                background:linear-gradient(135deg,#fff7ed,#ffedd5);
                border-radius:16px;border:2px solid #fed7aa;
                font-size:clamp(0.82rem,2.6vw,0.95rem);font-weight:700;
                color:#9a3412;line-height:1.5;text-align:center;
                box-sizing:border-box;
            `;
            storyCard.textContent = story;
            this.container.appendChild(storyCard);
        }

        // Equation display
        const eqCard = document.createElement('div');
        eqCard.style.cssText = `
            background:white;border-radius:18px;
            padding:clamp(8px,2.5vw,14px) clamp(14px,4vw,24px);
            box-shadow:0 4px 18px rgba(0,0,0,0.07);
            display:flex;align-items:center;gap:clamp(8px,2.5vw,14px);
            font-size:clamp(1.3rem,4vw,2rem);font-weight:900;
            color:#374151;flex-wrap:wrap;justify-content:center;
        `;
        eqCard.innerHTML = `
            <span style="background:#fef3c7;color:#92400e;padding:4px 14px;border-radius:10px">${total} ${itemEmoji}</span>
            <span style="color:#f59e0b;font-size:clamp(1.4rem,4.5vw,2.2rem)">÷</span>
            <span style="background:#eff6ff;color:#1e40af;padding:4px 14px;border-radius:10px">${divideBy} адам</span>
            <span style="color:#9ca3af">=</span>
            <span style="color:#6366f1;border:3px dashed #a5b4fc;padding:4px 14px;border-radius:10px;min-width:44px;text-align:center">?</span>
        `;
        this.container.appendChild(eqCard);

        // Chocolate grid visualization
        const chocoLabel = document.createElement('div');
        chocoLabel.style.cssText = `font-size:clamp(0.75rem,2.3vw,0.9rem);font-weight:700;color:#6b7280;`;
        chocoLabel.textContent = `${total} затты ${divideBy}-ге тең бөл:`;
        this.container.appendChild(chocoLabel);

        // Groups display
        const groupsWrap = document.createElement('div');
        groupsWrap.style.cssText = `
            display:flex;flex-wrap:wrap;gap:clamp(8px,2.5vw,14px);
            justify-content:center;width:100%;
        `;

        const personEmojis = ['👧', '👦', '🧒', '👩', '👨', '🧑'];
        for (let g = 0; g < divideBy; g++) {
            const group = document.createElement('div');
            group.style.cssText = `
                display:flex;flex-direction:column;align-items:center;gap:6px;
                background:linear-gradient(135deg,#f5f3ff,#ede9fe);
                border:2.5px solid #c4b5fd;border-radius:16px;
                padding:clamp(8px,2.5vw,14px);
                min-width:clamp(70px,20vw,110px);
                box-shadow:0 4px 12px rgba(139,92,246,0.1);
                animation:popIn 0.3s ${g * 0.1}s both;
            `;

            const person = document.createElement('div');
            person.style.cssText = `font-size:clamp(1.6rem,5vw,2.4rem);`;
            person.textContent = personEmojis[g % personEmojis.length];

            const share = document.createElement('div');
            share.style.cssText = `
                display:flex;flex-wrap:wrap;gap:2px;justify-content:center;
                max-width:clamp(70px,18vw,110px);
            `;
            const shareFs = answer <= 3 ? 'clamp(1.3rem,4vw,2rem)' : answer <= 5 ? 'clamp(1rem,3vw,1.5rem)' : 'clamp(0.8rem,2.3vw,1.1rem)';
            for (let e = 0; e < answer; e++) {
                const piece = document.createElement('span');
                piece.style.cssText = `
                    font-size:${shareFs};line-height:1;
                    animation:popIn 0.15s ${g * 0.12 + e * 0.08}s both;
                `;
                piece.textContent = itemEmoji;
                share.appendChild(piece);
            }

            const countBadge = document.createElement('div');
            countBadge.style.cssText = `
                font-size:clamp(0.75rem,2.3vw,0.95rem);font-weight:900;
                color:#6d28d9;background:#ede9fe;
                padding:2px 10px;border-radius:10px;
            `;
            countBadge.textContent = '× ' + answer;

            group.appendChild(person);
            group.appendChild(share);
            group.appendChild(countBadge);
            groupsWrap.appendChild(group);
        }
        this.container.appendChild(groupsWrap);

        // Answer buttons
        const ansLabel = document.createElement('div');
        ansLabel.style.cssText = `font-size:clamp(0.8rem,2.5vw,0.95rem);font-weight:700;color:#94a3b8;`;
        ansLabel.textContent = '👇 Әр адамға нешеу тиеді?';
        this.container.appendChild(ansLabel);

        const btnRow = document.createElement('div');
        btnRow.style.cssText = `display:flex;gap:clamp(8px,2vw,14px);justify-content:center;flex-wrap:wrap;width:100%;`;

        const shuffled = [...options].sort(() => Math.random() - 0.5);
        shuffled.forEach(opt => {
            const btn = document.createElement('div');
            btn.style.cssText = `
                display:flex;flex-direction:column;align-items:center;gap:4px;
                padding:clamp(10px,3vw,16px) clamp(14px,4vw,24px);
                background:white;border:3px solid #e5e7eb;
                border-radius:18px;cursor:pointer;
                box-shadow:0 4px 14px rgba(0,0,0,0.06);
                transition:all 0.15s cubic-bezier(0.175,0.885,0.32,1.275);
                touch-action:manipulation;
            `;
            const preview = document.createElement('div');
            preview.style.cssText = `display:flex;gap:2px;flex-wrap:wrap;justify-content:center;max-width:70px;`;
            const showN = Math.min(opt, 5);
            for (let i = 0; i < showN; i++) {
                const s = document.createElement('span');
                s.style.cssText = `font-size:${opt <= 3 ? '1.2rem' : '0.9rem'};`;
                s.textContent = itemEmoji;
                preview.appendChild(s);
            }
            const numEl = document.createElement('div');
            numEl.style.cssText = `font-size:clamp(1.4rem,4.5vw,2.2rem);font-weight:900;color:#1e293b;`;
            numEl.textContent = opt;
            btn.appendChild(preview);
            btn.appendChild(numEl);

            btn.addEventListener('pointerenter', () => { btn.style.transform = 'translateY(-3px) scale(1.05)'; });
            btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
            btn.addEventListener('pointerup', () => this._checkAnswer(opt, btn));
            btnRow.appendChild(btn);
        });
        this.container.appendChild(btnRow);

        if (window.SFX) SFX.speak(`${total} затты ${divideBy} адамға тең бөл. Әр адамға нешеу тиеді?`);
    }

    _checkAnswer(val, btn) {
        if (this.answered) return;
        this.answered = true;
        if (val === this.correctAnswer) {
            btn.style.background = 'linear-gradient(135deg,#d1fae5,#a7f3d0)';
            btn.style.borderColor = '#10b981';
            btn.style.transform = 'scale(1.08)';
            this._burst(btn);
            setTimeout(() => this.onSuccess(btn), 600);
        } else {
            btn.style.background = 'linear-gradient(135deg,#fee2e2,#fecaca)';
            btn.style.borderColor = '#ef4444';
            const shakes = ['8px', '-6px', '5px', '-3px', '0'];
            shakes.forEach((x, i) => setTimeout(() => btn.style.transform = `translateX(${x})`, i * 60));
            this.onFail();
            setTimeout(() => { this.answered = false; btn.style.background = 'white'; btn.style.borderColor = '#e5e7eb'; btn.style.transform = ''; }, 500);
        }
    }

    _burst(el) {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const colors = ['#fbbf24', '#34d399', '#60a5fa', '#f87171', '#a78bfa'];
        for (let i = 0; i < 14; i++) {
            const dot = document.createElement('div');
            const angle = (i / 14) * Math.PI * 2;
            const dist = 36 + Math.random() * 40;
            const size = 6 + Math.random() * 7;
            Object.assign(dot.style, {
                position: 'fixed', left: cx + 'px', top: cy + 'px',
                width: size + 'px', height: size + 'px',
                borderRadius: '50%', background: colors[i % colors.length],
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
