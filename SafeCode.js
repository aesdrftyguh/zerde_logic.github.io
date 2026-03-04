/**
 * SafeCode — 🔐 Сейф с числовой клавиатурой
 * Реши задачу → нажми цифры на клавиатуре → сейф открывается
 * Тема: математическая логика, уравнения
 */
class SafeCodeTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content;
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.answered = false;
        this.enteredCode = '';
        this.render();
    }

    render() {
        const { equation, answer, story, hint } = this.content;
        this.correctAnswer = String(answer);

        this.container.innerHTML = '';
        Object.assign(this.container.style, {
            width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 'clamp(8px,2vw,12px)',
            padding: 'clamp(8px,3vw,14px)', boxSizing: 'border-box',
            overflowY: 'auto', fontFamily: "'Nunito', sans-serif"
        });

        // Story / problem card
        const problemCard = document.createElement('div');
        problemCard.style.cssText = `
            width:100%;padding:clamp(10px,3vw,16px);
            background:linear-gradient(135deg,#1e293b,#334155);
            border-radius:18px;border:2px solid #475569;
            box-shadow:0 8px 28px rgba(0,0,0,0.2);
            text-align:center;box-sizing:border-box;
        `;

        if (story) {
            const storyEl = document.createElement('div');
            storyEl.style.cssText = `font-size:clamp(0.8rem,2.5vw,0.95rem);color:#94a3b8;margin-bottom:8px;line-height:1.5;`;
            storyEl.textContent = story;
            problemCard.appendChild(storyEl);
        }

        const eqEl = document.createElement('div');
        eqEl.style.cssText = `
            font-size:clamp(1.4rem,4.5vw,2.2rem);font-weight:900;
            color:#f8fafc;letter-spacing:2px;
        `;
        eqEl.textContent = equation;
        problemCard.appendChild(eqEl);

        if (hint) {
            const hintEl = document.createElement('div');
            hintEl.style.cssText = `font-size:clamp(0.7rem,2.2vw,0.85rem);color:#fbbf24;margin-top:6px;font-weight:700;`;
            hintEl.textContent = `💡 ${hint}`;
            problemCard.appendChild(hintEl);
        }
        this.container.appendChild(problemCard);

        // Safe visual
        const safeWrap = document.createElement('div');
        safeWrap.style.cssText = `display:flex;flex-direction:column;align-items:center;gap:6px;`;

        this.safeEl = document.createElement('div');
        this.safeEl.style.cssText = `
            font-size:clamp(4rem,13vw,7rem);
            filter:drop-shadow(0 8px 20px rgba(0,0,0,0.25));
            transition:all 0.5s cubic-bezier(0.175,0.885,0.32,1.275);
            cursor:default;user-select:none;
            animation:float 3s infinite ease-in-out;
        `;
        this.safeEl.textContent = '🔒';

        // Code display on safe
        this.codeDisplay = document.createElement('div');
        this.codeDisplay.style.cssText = `
            display:flex;gap:clamp(4px,1.5vw,8px);align-items:center;
        `;
        const digits = this.correctAnswer.length;
        this.digitEls = [];
        for (let i = 0; i < digits; i++) {
            const digitBox = document.createElement('div');
            digitBox.style.cssText = `
                width:clamp(36px,10vw,54px);height:clamp(36px,10vw,54px);
                background:#1e293b;border:3px solid #64748b;
                border-radius:10px;display:flex;align-items:center;justify-content:center;
                font-size:clamp(1.4rem,4vw,2rem);font-weight:900;color:#f8fafc;
                transition:all 0.2s;
            `;
            digitBox.textContent = '_';
            this.digitEls.push(digitBox);
            this.codeDisplay.appendChild(digitBox);
        }

        safeWrap.appendChild(this.safeEl);
        safeWrap.appendChild(this.codeDisplay);
        this.container.appendChild(safeWrap);

        // Numpad keyboard
        const numpad = document.createElement('div');
        numpad.style.cssText = `
            display:grid;grid-template-columns:repeat(3,1fr);
            gap:clamp(6px,2vw,10px);width:clamp(180px,55vw,280px);
        `;

        const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✓'];
        keys.forEach(k => {
            const key = document.createElement('div');
            const isAction = k === '⌫' || k === '✓';
            key.style.cssText = `
                height:clamp(44px,13vw,60px);border-radius:14px;
                display:flex;align-items:center;justify-content:center;
                font-size:${k === '✓' ? 'clamp(1.2rem,3.5vw,1.8rem)' : 'clamp(1.2rem,3.8vw,1.8rem)'};
                font-weight:900;cursor:pointer;
                background:${k === '✓' ? 'linear-gradient(135deg,#10b981,#059669)' : k === '⌫' ? 'linear-gradient(135deg,#ef4444,#dc2626)' : 'linear-gradient(135deg,#334155,#1e293b)'};
                color:${isAction ? 'white' : '#f1f5f9'};
                box-shadow:0 4px 14px rgba(0,0,0,0.18);
                transition:all 0.1s;touch-action:manipulation;
                border:${k === '✓' ? '2px solid #34d399' : k === '⌫' ? '2px solid #f87171' : '2px solid #475569'};
                user-select:none;
            `;
            key.textContent = k;

            key.addEventListener('pointerdown', () => {
                key.style.transform = 'scale(0.93)';
                key.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
            });
            key.addEventListener('pointerup', () => {
                key.style.transform = '';
                key.style.boxShadow = '0 4px 14px rgba(0,0,0,0.18)';
                if (!this.answered) this._pressKey(k);
            });
            numpad.appendChild(key);
        });
        this.container.appendChild(numpad);

        if (window.SFX) SFX.speak('Код теріп, сейфті аш!');
    }

    _pressKey(k) {
        if (k === '⌫') {
            if (this.enteredCode.length > 0) {
                this.enteredCode = this.enteredCode.slice(0, -1);
                this._updateDisplay();
            }
            if (window.SFX) SFX.playClick();
        } else if (k === '✓') {
            this._submit();
        } else {
            if (this.enteredCode.length < this.correctAnswer.length) {
                this.enteredCode += k;
                this._updateDisplay();
                if (window.SFX) SFX.playClick();
            }
        }
    }

    _updateDisplay() {
        this.digitEls.forEach((el, i) => {
            const ch = this.enteredCode[i] || '_';
            const filled = i < this.enteredCode.length;
            el.textContent = ch;
            el.style.borderColor = filled ? '#6366f1' : '#64748b';
            el.style.background = filled ? '#1e3a5f' : '#1e293b';
            if (filled) {
                el.style.transform = 'scale(1.1)';
                setTimeout(() => el.style.transform = '', 150);
            }
        });
    }

    _submit() {
        if (this.enteredCode.length < this.correctAnswer.length) return;
        if (this.answered) return;
        this.answered = true;

        if (this.enteredCode === this.correctAnswer) {
            // Open safe animation
            this.safeEl.textContent = '🔓';
            this.safeEl.style.transform = 'scale(1.25) rotate(5deg)';
            this.safeEl.style.filter = 'drop-shadow(0 12px 30px rgba(16,185,129,0.5))';
            setTimeout(() => {
                this.safeEl.textContent = '💰';
                this.safeEl.style.transform = '';
            }, 400);

            this.digitEls.forEach(el => {
                el.style.background = '#064e3b';
                el.style.borderColor = '#10b981';
                el.style.color = '#6ee7b7';
            });
            this._burst();
            setTimeout(() => this.onSuccess(this.safeEl), 800);
        } else {
            // Shake safe
            this.safeEl.style.animation = 'none';
            const shakeFrames = ['10px', '-8px', '6px', '-4px', '0'];
            shakeFrames.forEach((x, i) => {
                setTimeout(() => this.safeEl.style.transform = `translateX(${x})`, i * 70);
            });
            setTimeout(() => {
                this.safeEl.style.animation = '';
                this.safeEl.style.transform = '';
            }, 400);

            this.digitEls.forEach(el => {
                el.style.borderColor = '#ef4444';
                el.style.background = '#3f1c1c';
            });

            this.onFail();
            setTimeout(() => {
                this.answered = false;
                this.enteredCode = '';
                this._updateDisplay();
                this.digitEls.forEach(el => {
                    el.style.borderColor = '#64748b';
                    el.style.background = '#1e293b';
                });
            }, 700);
        }
    }

    _burst() {
        const rect = this.safeEl.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const golds = ['#fbbf24', '#f59e0b', '#fde68a', '#34d399', '#60a5fa'];
        for (let i = 0; i < 20; i++) {
            const dot = document.createElement('div');
            const angle = (i / 20) * Math.PI * 2;
            const dist = 44 + Math.random() * 56;
            const size = 6 + Math.random() * 9;
            Object.assign(dot.style, {
                position: 'fixed', left: cx + 'px', top: cy + 'px',
                width: size + 'px', height: size + 'px',
                borderRadius: Math.random() > 0.4 ? '50%' : '2px',
                background: golds[i % golds.length],
                pointerEvents: 'none', zIndex: '9998',
                transition: `all ${0.5 + Math.random() * 0.4}s ease-out`
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
            setTimeout(() => dot.remove(), 1000);
        }
    }
}
