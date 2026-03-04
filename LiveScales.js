/**
 * LiveScales — ⚖️ Живые весы для сравнения чисел
 * Emoji-предметы на чашах весов, анимированный перевес, выбери знак > < =
 */
class LiveScalesTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content;
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.answered = false;
        this.render();
    }

    render() {
        const { leftEmoji, leftCount, rightEmoji, rightCount, answer, story } = this.content;
        // answer: '>', '<', or '='
        this.correctAnswer = answer;

        this.container.innerHTML = '';
        Object.assign(this.container.style, {
            width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 'clamp(8px,2vw,14px)',
            padding: 'clamp(8px,3vw,16px)', boxSizing: 'border-box',
            overflowY: 'auto', fontFamily: "'Nunito', sans-serif"
        });

        // Story
        if (story) {
            const storyCard = document.createElement('div');
            storyCard.style.cssText = `
                width:100%;padding:clamp(10px,3vw,14px);
                background:linear-gradient(135deg,#ecfdf5,#d1fae5);
                border-radius:16px;border:2px solid #6ee7b7;
                font-size:clamp(0.82rem,2.6vw,0.95rem);font-weight:700;
                color:#065f46;line-height:1.5;text-align:center;
                box-sizing:border-box;
            `;
            storyCard.textContent = story;
            this.container.appendChild(storyCard);
        }

        // Scales container
        const scalesWrap = document.createElement('div');
        scalesWrap.style.cssText = `
            width:100%;display:flex;flex-direction:column;
            align-items:center;position:relative;
        `;

        // Beam pivot
        const pivotHeight = 'clamp(60px,18vw,110px)';
        const pivot = document.createElement('div');
        pivot.style.cssText = `
            width:clamp(10px,3vw,16px);height:${pivotHeight};
            background:linear-gradient(180deg,#6b7280,#374151);
            border-radius:8px 8px 4px 4px;margin:0 auto;
            box-shadow:0 4px 12px rgba(0,0,0,0.15);
        `;

        // Beam (balance bar)
        const beamWrap = document.createElement('div');
        beamWrap.style.cssText = `position:relative;width:100%;display:flex;justify-content:center;`;

        const diff = leftCount - rightCount;
        const maxTilt = 18; // degrees
        const tiltDeg = Math.max(-maxTilt, Math.min(maxTilt, diff * (maxTilt / Math.max(Math.abs(diff), 1))));

        this.beam = document.createElement('div');
        this.beam.style.cssText = `
            width:clamp(220px,68vw,400px);height:clamp(10px,2.5vw,14px);
            background:linear-gradient(90deg,#6b7280,#9ca3af,#6b7280);
            border-radius:7px;
            transform:rotate(${tiltDeg}deg);
            transition:transform 1.2s cubic-bezier(0.34,1.56,0.64,1);
            box-shadow:0 4px 12px rgba(0,0,0,0.12);
            transform-origin:center;
        `;
        beamWrap.appendChild(this.beam);
        scalesWrap.appendChild(beamWrap);

        // Pans row
        const pansRow = document.createElement('div');
        pansRow.style.cssText = `
            display:flex;justify-content:space-between;
            align-items:flex-start;width:clamp(220px,68vw,400px);
            margin-top:clamp(-16px,-4vw,-22px);
        `;

        // Left pan
        const leftPan = this._makePan(leftEmoji, leftCount, '#fef3c7', '#fbbf24', tiltDeg > 1, true);
        // Right pan
        const rightPan = this._makePan(rightEmoji, rightCount, '#eff6ff', '#60a5fa', tiltDeg < -1, false);

        pansRow.appendChild(leftPan);
        pansRow.appendChild(rightPan);
        scalesWrap.appendChild(pansRow);
        scalesWrap.appendChild(pivot);
        this.container.appendChild(scalesWrap);

        // Number comparison row
        const numRow = document.createElement('div');
        numRow.style.cssText = `
            display:flex;align-items:center;gap:clamp(10px,3vw,20px);
            background:white;border-radius:18px;
            padding:clamp(8px,2.5vw,14px) clamp(14px,4vw,28px);
            box-shadow:0 4px 14px rgba(0,0,0,0.07);
            font-size:clamp(1.4rem,4.5vw,2.2rem);font-weight:900;
        `;
        numRow.innerHTML = `
            <span style="color:#92400e">${leftCount}</span>
            <span style="font-size:clamp(2rem,6vw,3rem);color:#6366f1;border:3px dashed #a5b4fc;border-radius:12px;padding:0 12px;min-width:50px;text-align:center;">?</span>
            <span style="color:#1e40af">${rightCount}</span>
        `;
        this.container.appendChild(numRow);

        // Sign buttons
        const btnLabel = document.createElement('div');
        btnLabel.style.cssText = `font-size:clamp(0.8rem,2.5vw,0.95rem);font-weight:700;color:#94a3b8;`;
        btnLabel.textContent = '👇 Дұрыс таңбаны таңда:';
        this.container.appendChild(btnLabel);

        const btnRow = document.createElement('div');
        btnRow.style.cssText = `display:flex;gap:clamp(10px,3vw,20px);justify-content:center;`;

        const signs = [
            { sym: '>', label: 'Үлкен', color: '#ef4444', bg: '#fef2f2' },
            { sym: '=', label: 'Тең', color: '#10b981', bg: '#f0fdf4' },
            { sym: '<', label: 'Кіші', color: '#3b82f6', bg: '#eff6ff' }
        ];

        signs.forEach(s => {
            const btn = document.createElement('div');
            btn.style.cssText = `
                width:clamp(64px,18vw,96px);height:clamp(64px,18vw,96px);
                background:${s.bg};border:3px solid ${s.color}33;
                border-radius:18px;display:flex;flex-direction:column;
                align-items:center;justify-content:center;gap:4px;
                cursor:pointer;transition:all 0.15s cubic-bezier(0.175,0.885,0.32,1.275);
                box-shadow:0 4px 14px ${s.color}22;touch-action:manipulation;
            `;
            const signEl = document.createElement('div');
            signEl.style.cssText = `font-size:clamp(1.6rem,5vw,2.6rem);font-weight:900;color:${s.color};`;
            signEl.textContent = s.sym;
            const labelEl = document.createElement('div');
            labelEl.style.cssText = `font-size:clamp(0.6rem,1.8vw,0.75rem);font-weight:700;color:${s.color};`;
            labelEl.textContent = s.label;

            btn.appendChild(signEl);
            btn.appendChild(labelEl);

            btn.addEventListener('pointerenter', () => { btn.style.transform = 'scale(1.1)'; btn.style.borderColor = s.color; btn.style.background = s.bg.replace('f', 'e'); });
            btn.addEventListener('pointerleave', () => { btn.style.transform = ''; btn.style.borderColor = s.color + '33'; });
            btn.addEventListener('pointerup', () => this._checkAnswer(s.sym, btn, s.color));
            btnRow.appendChild(btn);
        });
        this.container.appendChild(btnRow);

        if (window.SFX) SFX.speak(`${leftCount} және ${rightCount}. Қайсысы үлкен?`);
    }

    _makePan(emoji, count, bg, border, heavy, isLeft) {
        const panWrap = document.createElement('div');
        panWrap.style.cssText = `
            display:flex;flex-direction:column;align-items:center;
            margin-top:${heavy ? 'clamp(18px,5vw,30px)' : '0'};
            transition:margin-top 1.2s cubic-bezier(0.34,1.56,0.64,1);
        `;

        // String
        const string = document.createElement('div');
        string.style.cssText = `
            width:2px;height:clamp(20px,6vw,36px);
            background:#6b7280;
        `;

        // Pan dish
        const pan = document.createElement('div');
        pan.style.cssText = `
            width:clamp(80px,22vw,130px);
            min-height:clamp(55px,15vw,85px);
            background:${bg};
            border:3px solid ${border};border-radius:50% 50% 40% 40%;
            display:flex;flex-wrap:wrap;gap:2px;
            justify-content:center;align-items:center;
            padding:clamp(6px,2vw,10px);
            box-shadow:0 6px 16px ${border}44;
            position:relative;
        `;

        // Number badge
        const countBadge = document.createElement('div');
        countBadge.style.cssText = `
            position:absolute;top:-14px;
            ${isLeft ? 'left:-14px' : 'right:-14px'};
            background:${border};color:white;
            font-size:clamp(0.7rem,2vw,0.9rem);font-weight:900;
            width:clamp(24px,6vw,32px);height:clamp(24px,6vw,32px);
            border-radius:50%;display:flex;align-items:center;justify-content:center;
        `;
        countBadge.textContent = count;
        pan.appendChild(countBadge);

        // Items
        const maxShow = Math.min(count, 6);
        const fs = count <= 3 ? 'clamp(1.4rem,4vw,2rem)' : count <= 5 ? 'clamp(1rem,3vw,1.5rem)' : 'clamp(0.8rem,2.3vw,1.1rem)';
        for (let i = 0; i < maxShow; i++) {
            const item = document.createElement('span');
            item.style.cssText = `font-size:${fs};line-height:1;`;
            item.textContent = emoji;
            pan.appendChild(item);
        }
        if (count > 6) {
            const more = document.createElement('span');
            more.style.cssText = `font-size:clamp(0.7rem,2vw,0.9rem);font-weight:900;color:#6b7280;`;
            more.textContent = `+${count - 6}`;
            pan.appendChild(more);
        }

        panWrap.appendChild(string);
        panWrap.appendChild(pan);
        return panWrap;
    }

    _checkAnswer(val, btn, color) {
        if (this.answered) return;
        this.answered = true;

        if (val === this.correctAnswer) {
            btn.style.background = 'linear-gradient(135deg,#d1fae5,#a7f3d0)';
            btn.style.borderColor = '#10b981';
            btn.style.transform = 'scale(1.1)';
            this._burst(btn);
            setTimeout(() => this.onSuccess(btn), 600);
        } else {
            btn.style.background = 'linear-gradient(135deg,#fee2e2,#fecaca)';
            btn.style.borderColor = '#ef4444';
            const shakes = ['8px', '-6px', '5px', '-3px', '0'];
            shakes.forEach((x, i) => setTimeout(() => btn.style.transform = `translateX(${x})`, i * 60));
            this.onFail();
            setTimeout(() => { this.answered = false; btn.style.background = '#fef2f2'; btn.style.borderColor = color + '33'; btn.style.transform = ''; }, 500);
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
