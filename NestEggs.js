/**
 * NestEggs — 🥚 Гнёзда с яйцами для умножения
 * N гнёзд × M яиц = ? Анимированный подсчёт групп
 */
class NestEggsTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content;
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.answered = false;
        this.render();
    }

    render() {
        const { nests, eggsPerNest, answer, options, story } = this.content;

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
                background:linear-gradient(135deg,#fdf4ff,#fae8ff);
                border-radius:16px;border:2px solid #e9d5ff;
                font-size:clamp(0.82rem,2.6vw,0.95rem);font-weight:700;
                color:#6b21a8;line-height:1.5;text-align:center;
                box-sizing:border-box;
            `;
            storyCard.textContent = story;
            this.container.appendChild(storyCard);
        }

        // Equation display
        const eqCard = document.createElement('div');
        eqCard.style.cssText = `
            background:white;border-radius:20px;padding:clamp(10px,3vw,18px) clamp(14px,4vw,28px);
            box-shadow:0 6px 24px rgba(0,0,0,0.07);
            display:flex;align-items:center;gap:clamp(8px,2.5vw,16px);
            font-size:clamp(1.2rem,3.8vw,1.8rem);font-weight:900;color:#374151;
            flex-wrap:wrap;justify-content:center;
        `;
        const opColors = { '×': '#8b5cf6', '+': '#10b981' };
        eqCard.innerHTML = `
            <span style="background:#ede9fe;color:#6d28d9;padding:4px 14px;border-radius:10px;">${nests} ұя</span>
            <span style="color:#8b5cf6;font-size:clamp(1.4rem,4.5vw,2.2rem)">×</span>
            <span style="background:#fef3c7;color:#92400e;padding:4px 14px;border-radius:10px;">${eggsPerNest} жұмыртқа</span>
            <span style="color:#9ca3af">=</span>
            <span style="color:#6366f1;border:3px dashed #a5b4fc;padding:4px 14px;border-radius:10px;min-width:50px;text-align:center">?</span>
        `;
        this.container.appendChild(eqCard);

        // Nests grid
        const nestsGrid = document.createElement('div');
        nestsGrid.style.cssText = `
            display:flex;flex-wrap:wrap;gap:clamp(8px,2.5vw,16px);
            justify-content:center;width:100%;
        `;

        const totalEggs = nests * eggsPerNest;
        this.totalCounter = 0;

        for (let n = 0; n < nests; n++) {
            const nestCard = document.createElement('div');
            nestCard.style.cssText = `
                display:flex;flex-direction:column;align-items:center;gap:6px;
                background:linear-gradient(135deg,#fffbeb,#fef3c7);
                border:2.5px solid #fde68a;border-radius:18px;
                padding:clamp(8px,2.5vw,14px);
                min-width:clamp(80px,22vw,130px);
                box-shadow:0 4px 14px rgba(0,0,0,0.06);
                animation:popIn 0.3s ${n * 0.1}s both;
                cursor:pointer;transition:transform 0.2s;
            `;

            const nestLabel = document.createElement('div');
            nestLabel.style.cssText = `font-size:clamp(0.65rem,2vw,0.8rem);font-weight:800;color:#92400e;`;
            nestLabel.textContent = `${n + 1}-ші ұя`;

            const nestIcon = document.createElement('div');
            nestIcon.style.cssText = `font-size:clamp(1.8rem,5.5vw,3rem);`;
            nestIcon.textContent = '🪹';

            const eggsRow = document.createElement('div');
            eggsRow.style.cssText = `
                display:flex;flex-wrap:wrap;gap:2px;justify-content:center;
                max-width:clamp(70px,18vw,110px);
            `;
            const eggFontSize = eggsPerNest <= 3 ? 'clamp(1.4rem,4vw,2rem)' : eggsPerNest <= 5 ? 'clamp(1rem,3vw,1.4rem)' : 'clamp(0.8rem,2.2vw,1.1rem)';

            for (let e = 0; e < eggsPerNest; e++) {
                const egg = document.createElement('span');
                egg.style.cssText = `font-size:${eggFontSize};animation:popIn 0.2s ${n * 0.12 + e * 0.06}s both;`;
                egg.textContent = '🥚';
                eggsRow.appendChild(egg);
            }

            const eggCount = document.createElement('div');
            eggCount.style.cssText = `
                font-size:clamp(0.75rem,2.3vw,1rem);font-weight:900;
                color:#6d28d9;background:#ede9fe;
                padding:2px 10px;border-radius:10px;
            `;
            eggCount.textContent = `× ${eggsPerNest}`;

            nestCard.appendChild(nestLabel);
            nestCard.appendChild(nestIcon);
            nestCard.appendChild(eggsRow);
            nestCard.appendChild(eggCount);

            nestCard.addEventListener('pointerenter', () => nestCard.style.transform = 'scale(1.05)');
            nestCard.addEventListener('pointerleave', () => nestCard.style.transform = '');

            nestsGrid.appendChild(nestCard);
        }
        this.container.appendChild(nestsGrid);

        // Total counter animation
        const totalWrap = document.createElement('div');
        totalWrap.style.cssText = `
            display:flex;align-items:center;gap:12px;
            background:white;border-radius:16px;
            padding:clamp(8px,2.5vw,14px) clamp(12px,3.5vw,22px);
            box-shadow:0 4px 14px rgba(0,0,0,0.07);
        `;
        totalWrap.innerHTML = `
            <span style="font-size:clamp(1rem,3vw,1.4rem);font-weight:700;color:#6b7280;">Барлығы жұмыртқа:</span>
        `;
        const totalNum = document.createElement('span');
        totalNum.style.cssText = `
            font-size:clamp(1.4rem,4.5vw,2.2rem);font-weight:900;
            color:#6d28d9;min-width:40px;text-align:center;
        `;
        totalNum.textContent = '0';
        totalWrap.appendChild(totalNum);
        this.container.appendChild(totalWrap);

        // Animate counter
        let count = 0;
        const interval = setInterval(() => {
            count++;
            totalNum.textContent = count;
            totalNum.style.transform = 'scale(1.15)';
            setTimeout(() => totalNum.style.transform = '', 100);
            if (count >= totalEggs) clearInterval(interval);
        }, 120);

        // Answer buttons
        const ansLabel = document.createElement('div');
        ansLabel.style.cssText = `font-size:clamp(0.8rem,2.5vw,0.95rem);font-weight:700;color:#94a3b8;`;
        ansLabel.textContent = '👇 Барлық жұмыртқаны сана:';
        this.container.appendChild(ansLabel);

        const btnRow = document.createElement('div');
        btnRow.style.cssText = `display:flex;gap:clamp(8px,2vw,14px);justify-content:center;flex-wrap:wrap;width:100%;`;

        const shuffled = [...options].sort(() => Math.random() - 0.5);
        shuffled.forEach(opt => {
            const btn = document.createElement('div');
            btn.style.cssText = `
                padding:clamp(12px,3.5vw,18px) clamp(18px,5vw,32px);
                background:white;border:3px solid #e5e7eb;
                border-radius:18px;font-size:clamp(1.4rem,4.5vw,2.2rem);
                font-weight:900;color:#1e293b;cursor:pointer;
                box-shadow:0 4px 14px rgba(0,0,0,0.06);
                transition:all 0.15s cubic-bezier(0.175,0.885,0.32,1.275);
                touch-action:manipulation;
            `;
            btn.textContent = opt;
            btn.addEventListener('pointerenter', () => { btn.style.transform = 'translateY(-3px) scale(1.05)'; });
            btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
            btn.addEventListener('pointerup', () => this._checkAnswer(opt, btn, answer));
            btnRow.appendChild(btn);
        });
        this.container.appendChild(btnRow);

        if (window.SFX) SFX.speak(`${nests} ұяда ${eggsPerNest}-ден жұмыртқа. Барлығы нешеу?`);
    }

    _checkAnswer(val, btn, answer) {
        if (this.answered) return;
        this.answered = true;
        if (val === answer) {
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
