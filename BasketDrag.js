/**
 * BasketDrag — 🧺 Перетаскивание emoji в корзину
 * Дети тапают/кликают предметы → они летят в корзину → счётчик растёт
 * Тема: сложение и вычитание
 */
class BasketDragTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content;
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.answered = false;
        this.collectedA = 0;
        this.collectedB = 0;
        this.phase = 'A'; // 'A' → collect left, 'B' → collect right, 'answer' → choose answer
        this.render();
    }

    render() {
        const {
            emoji = '🍎',
            emoji2,
            operand1, operator = '+', operand2,
            answer, options,
            story
        } = this.content;

        this.emoji1 = emoji;
        this.emoji2 = emoji2 || emoji;
        this.operand1 = operand1;
        this.operand2 = operand2;
        this.operator = operator;
        this.correctAnswer = answer;
        this.options = options;

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

        // Phase indicator
        this.phaseLabel = document.createElement('div');
        this.phaseLabel.style.cssText = `
            font-size:clamp(0.8rem,2.5vw,1rem);font-weight:800;
            color:#6366f1;background:#eef2ff;
            padding:6px 18px;border-radius:20px;
        `;
        this.container.appendChild(this.phaseLabel);

        // Main area: items + basket
        const mainRow = document.createElement('div');
        mainRow.style.cssText = `
            display:flex;align-items:center;justify-content:center;
            gap:clamp(10px,3vw,24px);width:100%;flex-wrap:wrap;
        `;

        // Items area (left)
        this.itemsArea = document.createElement('div');
        this.itemsArea.style.cssText = `
            display:flex;flex-wrap:wrap;gap:clamp(4px,1.5vw,8px);
            justify-content:center;
            max-width:clamp(140px,40vw,220px);
            min-height:clamp(80px,20vw,130px);
            align-items:center;
        `;
        mainRow.appendChild(this.itemsArea);

        // Arrow
        const arrow = document.createElement('div');
        arrow.style.cssText = `font-size:clamp(1.4rem,4vw,2.2rem);animation:pulse 1s infinite;`;
        arrow.textContent = '👉';
        mainRow.appendChild(arrow);

        // Basket area (right)
        const basketWrap = document.createElement('div');
        basketWrap.style.cssText = `display:flex;flex-direction:column;align-items:center;gap:6px;`;

        this.basketEl = document.createElement('div');
        this.basketEl.style.cssText = `
            width:clamp(80px,22vw,120px);height:clamp(80px,22vw,120px);
            background:linear-gradient(135deg,#fef3c7,#fde68a);
            border:3px dashed #f59e0b;border-radius:20px;
            display:flex;flex-direction:column;align-items:center;
            justify-content:center;gap:4px;
            font-size:clamp(2rem,6vw,3.5rem);
            transition:all 0.3s;cursor:pointer;
            position:relative;overflow:hidden;
        `;
        this.basketEl.textContent = '🧺';

        this.basketCountEl = document.createElement('div');
        this.basketCountEl.style.cssText = `
            font-size:clamp(1.4rem,4.5vw,2.2rem);font-weight:900;
            color:#374151;
        `;
        this.basketCountEl.textContent = '0';

        basketWrap.appendChild(this.basketEl);
        basketWrap.appendChild(this.basketCountEl);
        mainRow.appendChild(basketWrap);
        this.container.appendChild(mainRow);

        // Equation display
        this.eqDisplay = document.createElement('div');
        this.eqDisplay.style.cssText = `
            display:flex;align-items:center;gap:clamp(6px,2vw,12px);
            font-size:clamp(1.4rem,4.5vw,2.2rem);font-weight:900;
            color:#1e293b;background:white;border-radius:16px;
            padding:clamp(8px,2.5vw,14px) clamp(14px,4vw,24px);
            box-shadow:0 4px 18px rgba(0,0,0,0.07);
        `;
        this.container.appendChild(this.eqDisplay);

        // Answer buttons (hidden initially)
        this.answerArea = document.createElement('div');
        this.answerArea.style.cssText = `
            display:none;flex-direction:column;align-items:center;gap:10px;width:100%;
        `;
        const ansLabel = document.createElement('div');
        ansLabel.style.cssText = `font-size:clamp(0.8rem,2.5vw,1rem);font-weight:700;color:#94a3b8;`;
        ansLabel.textContent = '👇 Дұрыс жауапты таңда:';
        this.answerArea.appendChild(ansLabel);

        const btnRow = document.createElement('div');
        btnRow.style.cssText = `display:flex;gap:clamp(8px,2vw,14px);justify-content:center;flex-wrap:wrap;`;

        const shuffled = [...options].sort(() => Math.random() - 0.5);
        shuffled.forEach(opt => {
            const btn = document.createElement('div');
            btn.style.cssText = `
                padding:clamp(12px,3.5vw,18px) clamp(18px,5vw,32px);
                background:white;border:3px solid #e5e7eb;
                border-radius:18px;font-size:clamp(1.4rem,4.5vw,2.2rem);
                font-weight:900;color:#1e293b;cursor:pointer;
                box-shadow:0 4px 14px rgba(0,0,0,0.06);
                transition:all 0.15s;touch-action:manipulation;
            `;

            // Show emoji count on button
            const miniGrid = document.createElement('div');
            miniGrid.style.cssText = `display:flex;flex-wrap:wrap;justify-content:center;gap:2px;max-width:80px;margin-bottom:4px;`;
            const showN = Math.min(opt, 6);
            const fsz = opt <= 3 ? '1.3rem' : '0.9rem';
            for (let i = 0; i < showN; i++) {
                const s = document.createElement('span');
                s.style.cssText = `font-size:${fsz};line-height:1;`;
                s.textContent = this.emoji1;
                miniGrid.appendChild(s);
            }

            const numEl = document.createElement('div');
            numEl.textContent = opt;

            btn.appendChild(miniGrid);
            btn.appendChild(numEl);
            btn.setAttribute('data-value', opt);

            btn.addEventListener('pointerenter', () => { btn.style.transform = 'translateY(-3px) scale(1.05)'; btn.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; });
            btn.addEventListener('pointerleave', () => { btn.style.transform = ''; btn.style.boxShadow = '0 4px 14px rgba(0,0,0,0.06)'; });
            btn.addEventListener('pointerup', () => this._checkAnswer(opt, btn));
            btnRow.appendChild(btn);
        });

        this.answerArea.appendChild(btnRow);
        this.container.appendChild(this.answerArea);

        this._startPhaseA();
    }

    _startPhaseA() {
        this.phase = 'A';
        this.collectedA = 0;
        this.basketCountEl.textContent = '0';
        this.phaseLabel.textContent = `1️⃣ ${this.operand1} затты корзинаға сал!`;
        this._buildItems(this.operand1, this.emoji1);
        this._updateEq();
    }

    _startPhaseB() {
        this.phase = 'B';
        this.collectedB = 0;
        this.phaseLabel.textContent = `2️⃣ Тагы ${this.operand2} затты қос!`;
        this._buildItems(this.operand2, this.emoji2);
        this._updateEq();

        // basket bounce
        this.basketEl.style.transform = 'scale(1.15)';
        setTimeout(() => this.basketEl.style.transform = '', 300);
    }

    _startAnswerPhase() {
        this.phase = 'answer';
        this.phaseLabel.textContent = '❓ Жауапты таңда!';
        this.itemsArea.innerHTML = '';
        this.answerArea.style.display = 'flex';
        this._updateEq();
    }

    _buildItems(count, emoji) {
        this.itemsArea.innerHTML = '';
        const fontSize = count <= 4 ? 'clamp(2rem,6vw,3rem)' : count <= 7 ? 'clamp(1.5rem,5vw,2.2rem)' : 'clamp(1.1rem,3.5vw,1.6rem)';
        for (let i = 0; i < count; i++) {
            const item = document.createElement('div');
            item.style.cssText = `
                font-size:${fontSize};cursor:pointer;
                transition:all 0.2s;touch-action:manipulation;
                animation:popIn 0.2s ${i * 0.06}s both;
                user-select:none;
            `;
            item.textContent = emoji;

            item.addEventListener('pointerenter', () => { item.style.transform = 'scale(1.2) rotate(10deg)'; });
            item.addEventListener('pointerleave', () => { item.style.transform = ''; });
            item.addEventListener('pointerup', (e) => {
                e.stopPropagation();
                this._collectItem(item, emoji);
            });
            this.itemsArea.appendChild(item);
        }
    }

    _collectItem(item, emoji) {
        if (item.dataset.collected) return;
        item.dataset.collected = '1';
        item.style.opacity = '0.3';
        item.style.transform = 'scale(0.5)';
        item.style.pointerEvents = 'none';

        // Fly animation to basket
        const itemRect = item.getBoundingClientRect();
        const basketRect = this.basketEl.getBoundingClientRect();
        const fly = document.createElement('div');
        fly.style.cssText = `
            position:fixed;left:${itemRect.left}px;top:${itemRect.top}px;
            font-size:${item.style.fontSize || '2rem'};
            pointer-events:none;z-index:9999;
            transition:all 0.4s cubic-bezier(0.4,0,0.2,1);
        `;
        fly.textContent = emoji;
        document.body.appendChild(fly);

        requestAnimationFrame(() => {
            setTimeout(() => {
                fly.style.left = basketRect.left + basketRect.width / 2 - 16 + 'px';
                fly.style.top = basketRect.top + basketRect.height / 2 - 16 + 'px';
                fly.style.opacity = '0';
                fly.style.transform = 'scale(0.3)';
            }, 20);
        });
        setTimeout(() => fly.remove(), 480);

        // Basket bounce
        this.basketEl.style.transform = 'scale(1.1)';
        setTimeout(() => this.basketEl.style.transform = '', 200);

        if (this.phase === 'A') {
            this.collectedA++;
            this.basketCountEl.textContent = this.collectedA;
            if (this.collectedA >= this.operand1) {
                setTimeout(() => this._startPhaseB(), 400);
            }
        } else if (this.phase === 'B') {
            this.collectedB++;
            const total = this.collectedA + this.collectedB;
            this.basketCountEl.textContent = total;
            if (this.collectedB >= this.operand2) {
                setTimeout(() => this._startAnswerPhase(), 400);
            }
        }

        if (window.SFX) SFX.playClick();
    }

    _updateEq() {
        const a = this.phase === 'A' ? '?' : this.operand1;
        const b = (this.phase === 'A' || this.phase === 'B') ? '?' : this.operand2;
        const res = this.phase === 'answer' ? '?' : '';
        const opColors = { '+': '#10b981', '-': '#ef4444', '×': '#8b5cf6', '÷': '#f59e0b' };
        const col = opColors[this.operator] || '#374151';

        this.eqDisplay.innerHTML = `
            <span style="color:#374151">${this.operand1}</span>
            <span style="color:${col};font-size:clamp(1.2rem,4vw,2rem)">${this.operator}</span>
            <span style="color:#374151">${this.operand2}</span>
            <span style="color:#94a3b8">=</span>
            <span style="color:#6366f1;border:3px dashed #a5b4fc;border-radius:10px;padding:2px 12px;min-width:50px;text-align:center">?</span>
        `;
    }

    _checkAnswer(val, btn) {
        if (this.answered) return;
        this.answered = true;

        if (val === this.correctAnswer) {
            btn.style.background = 'linear-gradient(135deg,#d1fae5,#a7f3d0)';
            btn.style.borderColor = '#10b981';
            btn.style.color = '#065f46';
            btn.style.transform = 'scale(1.08)';
            this._burst(btn);
            setTimeout(() => this.onSuccess(btn), 600);
        } else {
            btn.style.background = 'linear-gradient(135deg,#fee2e2,#fecaca)';
            btn.style.borderColor = '#ef4444';
            const shakes = ['8px', '-6px', '5px', '-3px', '0'];
            shakes.forEach((x, i) => setTimeout(() => btn.style.transform = `translateX(${x})`, i * 60));
            this.onFail();
            setTimeout(() => {
                this.answered = false;
                btn.style.background = 'white';
                btn.style.borderColor = '#e5e7eb';
                btn.style.transform = '';
            }, 500);
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
                borderRadius: Math.random() > 0.4 ? '50%' : '3px',
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
