class CauseEffectTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content;
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.render();
    }

    render() {
        this.container.innerHTML = '';
        Object.assign(this.container.style, {
            width: '100%', height: '100%', display: 'flex',
            flexDirection: 'column', alignItems: 'center',
            justifyContent: 'flex-start', gap: 'clamp(12px,3vw,20px)',
            padding: '14px', boxSizing: 'border-box', overflowY: 'auto'
        });

        // MODE 1: pairs matching (data has pairs: [{cause, effect}])
        if (this.content.pairs && !this.content.options) {
            this._renderPairsMode();
        }
        // MODE 2: single cause with options (data has cause + options)
        else {
            this._renderOptionsMode();
        }
    }

    _renderPairsMode() {
        const pairs = this.content.pairs;
        let matched = 0;
        const total = pairs.length;

        const label = document.createElement('div');
        label.style.fontWeight = '700';
        label.style.fontSize = 'clamp(0.85rem,2.5vw,1rem)';
        label.style.color = '#475569';
        label.style.textAlign = 'center';
        label.textContent = 'Себепті нәтижесімен байланыстыр!';

        // Build shuffled effects
        const effects = pairs.map((p, i) => ({ emoji: p.effect, idx: i }));
        effects.sort(() => Math.random() - 0.5);

        const table = document.createElement('div');
        Object.assign(table.style, {
            display: 'flex', flexDirection: 'column',
            gap: '12px', width: '100%'
        });

        let selectedCause = null;

        pairs.forEach((pair, i) => {
            const row = document.createElement('div');
            Object.assign(row.style, {
                display: 'flex', alignItems: 'center',
                gap: '12px', width: '100%'
            });

            const causeBtn = document.createElement('div');
            causeBtn.dataset.idx = i;
            Object.assign(causeBtn.style, {
                flex: '1', height: 'clamp(60px,14vw,80px)',
                background: 'white', borderRadius: '16px',
                border: '2px solid #e5e7eb', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 'clamp(1.8rem,5vw,2.8rem)',
                cursor: 'pointer', touchAction: 'manipulation',
                userSelect: 'none', transition: 'all 0.15s',
                boxShadow: '0 3px 10px rgba(0,0,0,0.06)'
            });
            causeBtn.textContent = pair.cause;

            const arrow = document.createElement('div');
            arrow.style.fontSize = 'clamp(1rem,3vw,1.4rem)';
            arrow.textContent = '→';

            const effectSlot = document.createElement('div');
            effectSlot.dataset.expectIdx = i;
            Object.assign(effectSlot.style, {
                flex: '1', height: 'clamp(60px,14vw,80px)',
                background: '#f8fafc', borderRadius: '16px',
                border: '2px dashed #cbd5e1', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 'clamp(1.8rem,5vw,2.8rem)',
                userSelect: 'none', transition: 'all 0.15s'
            });
            effectSlot.textContent = '?';

            row.appendChild(causeBtn);
            row.appendChild(arrow);
            row.appendChild(effectSlot);
            table.appendChild(row);
        });

        // Effect buttons
        const effectsRow = document.createElement('div');
        Object.assign(effectsRow.style, {
            display: 'flex', flexWrap: 'wrap', gap: '10px',
            justifyContent: 'center', width: '100%',
            background: 'rgba(255,255,255,0.6)', borderRadius: '16px',
            padding: '12px', boxSizing: 'border-box'
        });

        effects.forEach(eff => {
            const eb = document.createElement('div');
            eb.dataset.idx = eff.idx;
            eb.textContent = eff.emoji;
            Object.assign(eb.style, {
                width: 'clamp(60px,15vw,80px)', height: 'clamp(60px,15vw,80px)',
                background: 'white', borderRadius: '14px',
                border: '2px solid #e5e7eb', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'clamp(1.8rem,5vw,2.8rem)',
                boxShadow: '0 3px 10px rgba(0,0,0,0.06)',
                touchAction: 'manipulation', userSelect: 'none',
                transition: 'all 0.15s', flexShrink: '0'
            });

            let selectedCauseIdx = null;

            // cause tap → select
            table.querySelectorAll('[data-idx]').forEach(cb => {
                cb.addEventListener('pointerup', () => {
                    table.querySelectorAll('[data-idx]').forEach(x => x.style.borderColor = '#e5e7eb');
                    cb.style.borderColor = '#f59e0b';
                    cb.style.background = '#fffbeb';
                    selectedCauseIdx = parseInt(cb.dataset.idx);
                });
            });

            eb.addEventListener('pointerdown', () => eb.style.transform = 'scale(0.94)');
            eb.addEventListener('pointerup', () => {
                eb.style.transform = '';
                if (selectedCauseIdx === null) return;
                const slot = table.querySelector(`[data-expect-idx="${selectedCauseIdx}"]`);
                if (!slot || slot.dataset.filled) return;

                const effectIdx = parseInt(eb.dataset.idx);
                if (effectIdx === selectedCauseIdx) {
                    // Correct!
                    slot.textContent = eb.textContent;
                    slot.style.background = '#d1fae5'; slot.style.borderColor = '#10b981';
                    slot.dataset.filled = '1';
                    eb.style.opacity = '0.3'; eb.style.pointerEvents = 'none';
                    // clear cause highlight
                    table.querySelectorAll('[data-idx]').forEach(x => { x.style.borderColor = '#e5e7eb'; x.style.background = 'white'; });
                    selectedCauseIdx = null;
                    matched++;
                    if (matched >= total) setTimeout(() => this.onSuccess(), 400);
                } else {
                    // Wrong
                    eb.style.background = '#fee2e2'; eb.style.borderColor = '#ef4444';
                    setTimeout(() => { eb.style.background = 'white'; eb.style.borderColor = '#e5e7eb'; }, 600);
                    this.onFail();
                }
            });

            effectsRow.appendChild(eb);
        });

        this.container.appendChild(label);
        this.container.appendChild(table);
        this.container.appendChild(effectsRow);
    }

    _renderOptionsMode() {
        const answered = { v: false };

        // Cause card
        const causeCard = document.createElement('div');
        Object.assign(causeCard.style, {
            width: '100%', background: 'white', borderRadius: '20px',
            padding: 'clamp(16px,4vw,28px)', boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
            textAlign: 'center', boxSizing: 'border-box'
        });

        const causeLabel = document.createElement('div');
        causeLabel.style.fontSize = 'clamp(0.75rem,2.5vw,0.9rem)';
        causeLabel.style.fontWeight = '700'; causeLabel.style.color = '#f59e0b';
        causeLabel.style.textTransform = 'uppercase'; causeLabel.style.marginBottom = '8px';
        causeLabel.textContent = 'СЕБЕП';
        if (this.content.causeImage) {
            const ci = document.createElement('div');
            ci.style.fontSize = 'clamp(3rem,10vw,5rem)'; ci.style.margin = '8px 0';
            ci.textContent = this.content.causeImage; causeCard.appendChild(ci);
        }
        const causeText = document.createElement('div');
        causeText.style.fontSize = 'clamp(1rem,3.5vw,1.4rem)'; causeText.style.fontWeight = '800';
        causeText.style.color = '#1e293b'; causeText.style.lineHeight = '1.4';
        causeText.textContent = this.content.cause;
        causeCard.appendChild(causeLabel); causeCard.appendChild(causeText);

        const arrow = document.createElement('div');
        arrow.style.fontSize = 'clamp(1.5rem,4vw,2rem)'; arrow.textContent = '⬇️';

        const effectLabel = document.createElement('div');
        effectLabel.style.fontSize = 'clamp(0.8rem,2.5vw,1rem)'; effectLabel.style.fontWeight = '700';
        effectLabel.style.color = '#6366f1'; effectLabel.textContent = 'Нәтижесін тап:';

        const opts = [...this.content.options];
        opts.sort(() => Math.random() - 0.5);
        const grid = document.createElement('div');
        Object.assign(grid.style, {
            display: 'grid',
            gridTemplateColumns: opts.length <= 2 ? '1fr' : 'repeat(2,1fr)',
            gap: 'clamp(8px,2vw,14px)', width: '100%', boxSizing: 'border-box'
        });
        opts.forEach(opt => {
            const btn = document.createElement('button');
            Object.assign(btn.style, {
                background: 'white', border: '2px solid #e5e7eb', borderRadius: '16px',
                padding: '14px 10px', fontSize: 'clamp(0.9rem,3vw,1.2rem)', fontWeight: '700',
                color: '#374151', cursor: 'pointer', touchAction: 'manipulation',
                userSelect: 'none', fontFamily: 'inherit', transition: 'all 0.15s',
                minHeight: '54px', lineHeight: '1.3', textAlign: 'center'
            });
            if (opt.icon) {
                btn.innerHTML = `<span style="font-size:1.4rem">${opt.icon}</span> `;
            }
            btn.appendChild(document.createTextNode(opt.text || String(opt)));
            btn.addEventListener('pointerdown', () => btn.style.transform = 'scale(0.95)');
            btn.addEventListener('pointerup', () => {
                if (answered.v) return; btn.style.transform = ''; answered.v = true;
                const correct = (opt.correct === true) || (opt === this.content.correct) || (opt.text === this.content.correct);
                if (correct) {
                    btn.style.background = '#d1fae5'; btn.style.borderColor = '#10b981';
                    setTimeout(() => this.onSuccess(btn), 500);
                } else {
                    btn.style.background = '#fee2e2'; btn.style.borderColor = '#ef4444';
                    setTimeout(() => this.onFail(), 600);
                }
            });
            grid.appendChild(btn);
        });

        this.container.appendChild(causeCard);
        this.container.appendChild(arrow);
        this.container.appendChild(effectLabel);
        this.container.appendChild(grid);
    }
}
