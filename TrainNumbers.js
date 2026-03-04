/**
 * TrainNumbers — Числовой ряд: найди пропущенное число
 * Простые цветные карточки с числами, одна пуста → выбери нужное
 */
class TrainNumbersTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content;
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.answered = false;
        this.render();
    }

    render() {
        const { sequence, answer, options, story } = this.content;
        this.correctAnswer = answer;

        this.container.innerHTML = '';
        Object.assign(this.container.style, {
            width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 'clamp(12px,3vw,22px)',
            padding: 'clamp(10px,3vw,20px)', boxSizing: 'border-box',
            overflowY: 'auto', fontFamily: "'Nunito', sans-serif",
            justifyContent: 'center'
        });

        // Story card
        if (story) {
            const storyCard = document.createElement('div');
            storyCard.style.cssText = `
                width:100%;padding:clamp(10px,3vw,16px);
                background:linear-gradient(135deg,#eff6ff,#dbeafe);
                border-radius:16px;border:2px solid #bfdbfe;
                font-size:clamp(0.85rem,2.6vw,1rem);font-weight:700;
                color:#1e40af;line-height:1.5;text-align:center;
                box-sizing:border-box;
            `;
            storyCard.textContent = story;
            this.container.appendChild(storyCard);
        }

        // Number cards row
        const cardsRow = document.createElement('div');
        cardsRow.style.cssText = `
            display:flex;align-items:center;justify-content:center;
            gap:clamp(6px,2vw,12px);flex-wrap:wrap;width:100%;
        `;

        // Palette of colors for cards
        const colors = [
            { bg: '#fef3c7', border: '#fbbf24', text: '#92400e' },
            { bg: '#dbeafe', border: '#60a5fa', text: '#1e40af' },
            { bg: '#d1fae5', border: '#34d399', text: '#065f46' },
            { bg: '#fce7f3', border: '#f472b6', text: '#9d174d' },
            { bg: '#ede9fe', border: '#a78bfa', text: '#5b21b6' },
            { bg: '#fee2e2', border: '#f87171', text: '#991b1b' },
        ];

        sequence.forEach((num, idx) => {
            // Arrow between cards
            if (idx > 0) {
                const arrow = document.createElement('div');
                arrow.style.cssText = `
                    font-size:clamp(1rem,3vw,1.6rem);color:#9ca3af;
                    font-weight:900;flex-shrink:0;
                `;
                arrow.textContent = '→';
                cardsRow.appendChild(arrow);
            }

            const isEmpty = num === null || num === '?';
            const c = colors[idx % colors.length];

            const card = document.createElement('div');
            card.style.cssText = `
                width:clamp(56px,15vw,84px);
                height:clamp(56px,15vw,84px);
                border-radius:18px;
                background:${isEmpty ? '#f8fafc' : c.bg};
                border:${isEmpty ? '3px dashed #94a3b8' : '3px solid ' + c.border};
                display:flex;align-items:center;justify-content:center;
                font-size:clamp(1.3rem,4.5vw,2.2rem);
                font-weight:900;
                color:${isEmpty ? '#64748b' : c.text};
                box-shadow:${isEmpty ? 'none' : '0 4px 14px ' + c.border + '44'};
                transition:all 0.3s;
                flex-shrink:0;
            `;

            if (isEmpty) {
                card.textContent = '?';
                this.missingCard = card;
            } else {
                card.textContent = num;
            }

            cardsRow.appendChild(card);
        });

        this.container.appendChild(cardsRow);

        // Hint below cards
        const hint = document.createElement('div');
        hint.style.cssText = `
            font-size:clamp(0.8rem,2.5vw,0.95rem);
            font-weight:700;color:#94a3b8;
            text-align:center;
        `;
        hint.textContent = '👇 Бос орынға қандай сан кіреді?';
        this.container.appendChild(hint);

        // Answer buttons
        const btnRow = document.createElement('div');
        btnRow.style.cssText = `
            display:flex;gap:clamp(10px,3vw,18px);
            justify-content:center;flex-wrap:wrap;
        `;

        const shuffled = [...options].sort(() => Math.random() - 0.5);
        shuffled.forEach(opt => {
            const btn = document.createElement('div');
            btn.style.cssText = `
                width:clamp(64px,18vw,96px);
                height:clamp(64px,18vw,96px);
                background:white;
                border:3px solid #e2e8f0;
                border-radius:18px;
                display:flex;align-items:center;justify-content:center;
                font-size:clamp(1.4rem,4.5vw,2.4rem);
                font-weight:900;color:#1e293b;
                cursor:pointer;
                box-shadow:0 4px 14px rgba(0,0,0,0.06);
                transition:all 0.15s cubic-bezier(0.175,0.885,0.32,1.275);
                touch-action:manipulation;user-select:none;
            `;
            btn.textContent = opt;

            btn.addEventListener('pointerenter', () => {
                if (this.answered) return;
                btn.style.transform = 'translateY(-4px) scale(1.08)';
                btn.style.borderColor = '#6366f1';
                btn.style.boxShadow = '0 8px 24px rgba(99,102,241,0.2)';
            });
            btn.addEventListener('pointerleave', () => {
                if (this.answered) return;
                btn.style.transform = '';
                btn.style.borderColor = '#e2e8f0';
                btn.style.boxShadow = '0 4px 14px rgba(0,0,0,0.06)';
            });
            btn.addEventListener('pointerdown', () => {
                if (this.answered) return;
                btn.style.transform = 'scale(0.93)';
            });
            btn.addEventListener('pointerup', () => {
                if (this.answered) return;
                this._checkAnswer(opt, btn);
            });

            btnRow.appendChild(btn);
        });

        this.container.appendChild(btnRow);

        if (window.SFX) SFX.speak('Бос орынға қандай сан кіреді?');
    }

    _checkAnswer(val, btn) {
        if (this.answered) return;
        this.answered = true;

        if (val === this.correctAnswer) {
            // Fill missing card
            if (this.missingCard) {
                this.missingCard.textContent = val;
                this.missingCard.style.background = 'linear-gradient(135deg,#d1fae5,#a7f3d0)';
                this.missingCard.style.borderColor = '#10b981';
                this.missingCard.style.borderStyle = 'solid';
                this.missingCard.style.color = '#065f46';
                this.missingCard.style.transform = 'scale(1.18)';
                setTimeout(() => { if (this.missingCard) this.missingCard.style.transform = ''; }, 300);
            }
            btn.style.background = 'linear-gradient(135deg,#d1fae5,#a7f3d0)';
            btn.style.borderColor = '#10b981';
            btn.style.transform = 'scale(1.1)';
            this._burst(btn);
            setTimeout(() => this.onSuccess(btn), 700);
        } else {
            btn.style.background = 'linear-gradient(135deg,#fee2e2,#fecaca)';
            btn.style.borderColor = '#ef4444';
            const shakes = ['8px', '-6px', '5px', '-3px', '0'];
            shakes.forEach((x, i) => setTimeout(() => btn.style.transform = `translateX(${x})`, i * 60));
            this.onFail();
            setTimeout(() => {
                this.answered = false;
                btn.style.background = 'white';
                btn.style.borderColor = '#e2e8f0';
                btn.style.transform = '';
            }, 500);
        }
    }

    _burst(el) {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const colors = ['#fbbf24', '#34d399', '#60a5fa', '#f87171', '#a78bfa'];
        for (let i = 0; i < 12; i++) {
            const dot = document.createElement('div');
            const angle = (i / 12) * Math.PI * 2;
            const dist = 32 + Math.random() * 36;
            const size = 6 + Math.random() * 6;
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
