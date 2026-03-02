class WeightLabTemplate {
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

        // Support:
        // A: {objects:[{id,emoji,weight}], targetWeight:N}  ← data.js format
        // B: {weights:[...], leftFixed:{...}}               ← interactive balance format
        const objects = this.content.objects || this.content.weights;
        const targetWeight = this.content.targetWeight;

        if (objects && targetWeight !== undefined) {
            // Simple mode: pick the heaviest/lightest object
            this._renderPickMode(objects, targetWeight);
        } else if (this.content.weights) {
            this._renderBalanceMode();
        } else {
            this.container.innerHTML = '<div style="color:#94a3b8;text-align:center">Деректер жоқ</div>';
        }
    }

    _renderPickMode(objects, targetWeight) {
        const inst = document.createElement('div');
        inst.style.fontSize = 'clamp(0.9rem,3vw,1.1rem)';
        inst.style.fontWeight = '700';
        inst.style.color = '#475569';
        inst.style.textAlign = 'center';
        inst.textContent = targetWeight === Math.min(...objects.map(o => o.weight))
            ? 'Ең ЖЕҢІЛ затты тап! ⬆️'
            : 'Ең АУЫР затты тап! ⬇️';

        // Balance scale visual
        const scaleWrap = document.createElement('div');
        Object.assign(scaleWrap.style, {
            width: '100%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '8px', position: 'relative'
        });

        const pivot = document.createElement('div');
        Object.assign(pivot.style, {
            width: '8px', background: '#64748b', height: '60px',
            borderRadius: '4px', position: 'absolute', left: '50%',
            marginLeft: '-4px', bottom: '0'
        });

        const beam = document.createElement('div');
        Object.assign(beam.style, {
            width: '80%', height: '6px', background: '#94a3b8',
            borderRadius: '3px', position: 'relative', top: '-30px'
        });
        scaleWrap.appendChild(pivot);
        scaleWrap.appendChild(beam);

        // Object cards
        const cardsRow = document.createElement('div');
        Object.assign(cardsRow.style, {
            display: 'flex', flexWrap: 'wrap', gap: 'clamp(10px,3vw,18px)',
            justifyContent: 'center', width: '100%'
        });

        objects.forEach(obj => {
            const card = document.createElement('div');
            Object.assign(card.style, {
                background: 'white', borderRadius: '18px',
                border: '2px solid #e5e7eb', padding: 'clamp(14px,4vw,22px)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '10px', cursor: 'pointer',
                touchAction: 'manipulation', userSelect: 'none',
                boxShadow: '0 4px 14px rgba(0,0,0,0.07)',
                transition: 'all 0.15s', flex: '1',
                minWidth: 'clamp(80px,20vw,110px)', maxWidth: '130px'
            });

            const emoji = document.createElement('div');
            emoji.style.fontSize = 'clamp(2.5rem,8vw,4rem)';
            emoji.textContent = obj.emoji;

            card.appendChild(emoji);
            card.addEventListener('pointerdown', () => card.style.transform = 'scale(0.95)');
            card.addEventListener('pointerup', () => {
                if (this.answered) return;
                card.style.transform = '';
                this.answered = true;
                if (obj.weight === targetWeight) {
                    card.style.background = '#d1fae5'; card.style.borderColor = '#10b981';
                    setTimeout(() => this.onSuccess(card), 500);
                } else {
                    card.style.background = '#fee2e2'; card.style.borderColor = '#ef4444';
                    setTimeout(() => this.onFail(), 600);
                }
            });
            cardsRow.appendChild(card);
        });

        this.container.appendChild(inst);
        this.container.appendChild(cardsRow);
    }

    _renderBalanceMode() {
        // Full interactive balance with drag
        const leftWeight = { v: 0 };
        const rightWeight = { v: 0 };

        const inst = document.createElement('div');
        inst.style.fontWeight = '700';
        inst.style.color = '#475569';
        inst.style.textAlign = 'center';
        inst.style.fontSize = 'clamp(0.9rem,3vw,1.1rem)';
        inst.textContent = this.content.instruction || 'Таразыны теңест!';

        const beam = document.createElement('div');
        Object.assign(beam.style, {
            width: '80%', height: '6px', background: '#94a3b8',
            borderRadius: '3px', margin: '20px auto', transition: 'transform 0.4s ease'
        });

        const pansRow = document.createElement('div');
        Object.assign(pansRow.style, {
            display: 'flex', gap: '12px', width: '100%', justifyContent: 'center'
        });

        const makePan = (side) => {
            const pan = document.createElement('div');
            Object.assign(pan.style, {
                flex: '1', maxWidth: '45%', minHeight: 'clamp(70px,18vw,100px)',
                background: 'white', borderRadius: '14px', border: '2px dashed #cbd5e1',
                display: 'flex', flexWrap: 'wrap', alignItems: 'center',
                justifyContent: 'center', gap: '6px', padding: '8px',
                boxSizing: 'border-box', transition: 'all 0.2s',
                boxShadow: '0 3px 10px rgba(0,0,0,0.06)', userSelect: 'none'
            });
            pan.dataset.side = side;
            return pan;
        };
        const leftPan = makePan('left');
        const rightPan = makePan('right');
        pansRow.appendChild(leftPan);
        pansRow.appendChild(rightPan);

        if (this.content.leftFixed) {
            const lf = this.content.leftFixed;
            const el = document.createElement('div');
            el.style.fontSize = 'clamp(1.4rem,4vw,2rem)';
            el.textContent = lf.icon;
            leftPan.appendChild(el);
            leftWeight.v = lf.weight;
        }

        const tray = document.createElement('div');
        Object.assign(tray.style, {
            display: 'flex', flexWrap: 'wrap', gap: '10px',
            justifyContent: 'center', width: '100%',
            background: 'rgba(255,255,255,0.6)', borderRadius: '16px',
            padding: '12px', boxSizing: 'border-box'
        });

        const weights = this.content.weights || [];
        weights.forEach(w => {
            const el = document.createElement('div');
            el.dataset.weight = w.value;
            Object.assign(el.style, {
                background: '#dbeafe', border: '2px solid #93c5fd',
                borderRadius: '10px', padding: '8px 12px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                cursor: 'pointer', touchAction: 'manipulation', userSelect: 'none',
                flexShrink: '0', transition: 'all 0.2s'
            });
            const icon = document.createElement('div');
            icon.style.fontSize = 'clamp(1.2rem,3.5vw,1.8rem)';
            icon.textContent = w.icon || '⚖️';
            const lbl = document.createElement('div');
            lbl.style.fontSize = 'clamp(0.7rem,2vw,0.85rem)';
            lbl.style.fontWeight = '800'; lbl.style.color = '#1e40af';
            lbl.textContent = `${w.value}кг`;
            el.appendChild(icon); el.appendChild(lbl);

            let tapSide = 'right';
            el.addEventListener('pointerup', () => {
                if (el.dataset.used) return;
                el.dataset.used = '1';
                el.style.opacity = '0.4';
                const pan = tapSide === 'left' ? leftPan : rightPan;
                const clone = document.createElement('div');
                clone.style.fontSize = 'clamp(1.2rem,3.5vw,1.8rem)';
                clone.textContent = w.icon || '⚖️';
                pan.appendChild(clone);
                if (tapSide === 'left') leftWeight.v += w.value;
                else rightWeight.v += w.value;
                // Toggle side
                tapSide = tapSide === 'left' ? 'right' : 'left';
                const diff = rightWeight.v - leftWeight.v;
                beam.style.transform = `rotate(${Math.max(-18, Math.min(18, diff * 2))}deg)`;
            });
            tray.appendChild(el);
        });

        const checkBtn = document.createElement('button');
        Object.assign(checkBtn.style, {
            width: '100%', padding: 'clamp(12px,3.5vw,18px)',
            background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
            border: 'none', borderRadius: '14px', fontSize: 'clamp(1rem,3vw,1.2rem)',
            fontWeight: '900', color: 'white', cursor: 'pointer',
            touchAction: 'manipulation', fontFamily: 'inherit'
        });
        checkBtn.textContent = 'Тексеру ⚖️';
        checkBtn.addEventListener('pointerup', () => {
            if (leftWeight.v === rightWeight.v) setTimeout(() => this.onSuccess(), 300);
            else this.onFail();
        });

        this.container.appendChild(inst);
        this.container.appendChild(beam);
        this.container.appendChild(pansRow);
        this.container.appendChild(tray);
        this.container.appendChild(checkBtn);
    }
}
