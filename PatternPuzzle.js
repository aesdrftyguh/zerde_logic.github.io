class PatternPuzzleTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content;
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.placedCount = 0;
        this.totalMissing = 0;
        this.render();
    }

    render() {
        this.container.innerHTML = '';
        Object.assign(this.container.style, {
            width: '100%', height: '100%', display: 'flex',
            flexDirection: 'column', alignItems: 'center',
            justifyContent: 'flex-start', gap: 'clamp(8px,2vw,14px)',
            padding: 'clamp(8px,2vw,14px)', boxSizing: 'border-box',
            overflowY: 'auto', userSelect: 'none'
        });

        // ── Parse data ────────────────────────────────────────────────
        // pattern: full 2D grid  e.g. [['🌅','🌅',...],...]
        // missing: array of flat indices e.g. [1,4,7]
        const pattern = this.content.pattern || [];
        const cols = pattern[0]?.length || 3;
        const flatPattern = pattern.flat();
        const missingIdx = this.content.missing || [];
        this.totalMissing = missingIdx.length;
        this.correctAnswers = missingIdx.map(i => flatPattern[i]);

        // ── Header ────────────────────────────────────────────────────
        const header = document.createElement('div');
        Object.assign(header.style, {
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', gap: '10px', flexShrink: '0'
        });

        const instrLabel = document.createElement('div');
        Object.assign(instrLabel.style, {
            fontWeight: '900', fontSize: 'clamp(0.75rem,2.5vw,0.95rem)',
            color: '#475569', flex: '1', lineHeight: '1.3'
        });
        instrLabel.textContent = '🧩 Бос орындарды тауып, суретті толықтыр!';

        // Hint thumbnail (small preview of full pattern)
        const hintWrap = document.createElement('div');
        Object.assign(hintWrap.style, {
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: '3px', flexShrink: '0'
        });
        const hintLabel = document.createElement('div');
        hintLabel.style.cssText = 'font-size:0.6rem;font-weight:800;color:#94a3b8;text-transform:uppercase;';
        hintLabel.textContent = 'Нәтиже:';

        const hintGrid = document.createElement('div');
        Object.assign(hintGrid.style, {
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: '2px', padding: '4px',
            background: 'rgba(255,255,255,0.8)', borderRadius: '8px',
            border: '1.5px solid #e5e7eb'
        });
        flatPattern.forEach(emoji => {
            const t = document.createElement('div');
            t.style.cssText = 'width:22px;height:22px;font-size:0.85rem;display:flex;' +
                'align-items:center;justify-content:center;border-radius:4px;';
            t.textContent = emoji;
            hintGrid.appendChild(t);
        });
        hintWrap.appendChild(hintLabel);
        hintWrap.appendChild(hintGrid);
        header.appendChild(instrLabel);
        header.appendChild(hintWrap);

        // ── Main puzzle grid ──────────────────────────────────────────
        const gridCard = document.createElement('div');
        Object.assign(gridCard.style, {
            background: 'white', borderRadius: '22px',
            padding: 'clamp(10px,3vw,18px)',
            boxShadow: '0 8px 28px rgba(0,0,0,0.08)',
            width: '100%', boxSizing: 'border-box', flexShrink: '0'
        });

        const grid = document.createElement('div');
        Object.assign(grid.style, {
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: 'clamp(5px,1.5vw,10px)'
        });

        this.slotEls = [];

        flatPattern.forEach((emoji, idx) => {
            const isMissing = missingIdx.includes(idx);
            const cell = document.createElement('div');
            const sz = `clamp(50px,${Math.floor(75 / cols)}vw,80px)`;
            Object.assign(cell.style, {
                width: sz, height: sz,
                borderRadius: '12px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 'clamp(1.4rem,5vw,2.4rem)',
                transition: 'all 0.25s cubic-bezier(0.175,0.885,0.32,1.275)',
                boxSizing: 'border-box', position: 'relative'
            });

            if (isMissing) {
                Object.assign(cell.style, {
                    background: '#f8fafc',
                    border: '2.5px dashed #cbd5e1',
                });
                cell.dataset.filled = '0';
                cell.dataset.correctEmoji = emoji;
                cell.dataset.flatIdx = idx;

                // Question mark
                const qm = document.createElement('span');
                qm.className = 'slot-qmark';
                qm.style.cssText = 'font-size:clamp(1.2rem,4vw,1.8rem);color:#cbd5e1;font-weight:900;';
                qm.textContent = '?';
                cell.appendChild(qm);

                // Emoji display (hidden until filled)
                const emojiEl = document.createElement('span');
                emojiEl.className = 'slot-emoji';
                emojiEl.style.cssText = 'position:absolute;transform:scale(0);transition:transform 0.35s cubic-bezier(0.175,0.885,0.32,1.275);';
                cell.appendChild(emojiEl);

                this.slotEls.push(cell);
            } else {
                // Pre-filled tile
                Object.assign(cell.style, {
                    background: '#f1f5f9',
                    border: '2px solid #e5e7eb'
                });
                cell.textContent = emoji;
                // Entrance animation
                cell.style.opacity = '0';
                cell.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    cell.style.opacity = '1';
                    cell.style.transform = 'scale(1)';
                }, idx * 40 + 50);
            }

            grid.appendChild(cell);
        });

        gridCard.appendChild(grid);

        // ── Score pill ────────────────────────────────────────────────
        const scorePill = document.createElement('div');
        Object.assign(scorePill.style, {
            padding: '5px 16px', background: 'rgba(255,255,255,0.9)',
            borderRadius: '30px', border: '2px solid #e5e7eb',
            fontWeight: '900', fontSize: 'clamp(0.8rem,2.5vw,0.95rem)',
            color: '#475569', flexShrink: '0'
        });
        scorePill.textContent = `🧩 Орын: 0 / ${this.totalMissing}`;
        this.scorePill = scorePill;

        // ── Tray label ────────────────────────────────────────────────
        const trayLabel = document.createElement('div');
        Object.assign(trayLabel.style, {
            width: '100%', fontWeight: '900',
            fontSize: 'clamp(0.75rem,2.2vw,0.9rem)', color: '#94a3b8',
            textTransform: 'uppercase', letterSpacing: '0.5px', flexShrink: '0'
        });
        trayLabel.textContent = '✋ Тайлды тауып, дұрыс орынға сүйре:';

        // ── Pieces tray ───────────────────────────────────────────────
        const tray = document.createElement('div');
        Object.assign(tray.style, {
            display: 'flex', flexWrap: 'wrap', gap: 'clamp(8px,2vw,14px)',
            justifyContent: 'center', padding: 'clamp(10px,3vw,16px)',
            background: 'rgba(255,255,255,0.7)', borderRadius: '18px',
            border: '2px dashed #e5e7eb', width: '100%',
            boxSizing: 'border-box', minHeight: '80px',
            alignItems: 'center', flexShrink: '0'
        });
        this.tray = tray;

        // Shuffle missing pieces
        const shuffledPieces = [...this.correctAnswers].sort(() => Math.random() - 0.5);
        shuffledPieces.forEach((emoji, i) => {
            const card = this._makePieceCard(emoji, i);
            tray.appendChild(card);
        });

        // ── Assemble ──────────────────────────────────────────────────
        this.container.appendChild(header);
        this.container.appendChild(gridCard);
        this.container.appendChild(scorePill);
        this.container.appendChild(trayLabel);
        this.container.appendChild(tray);

        // Enable drag on all slots
        this._enableDropZones();
    }

    // ── Create draggable piece card ───────────────────────────────────
    _makePieceCard(emoji, delay = 0) {
        const card = document.createElement('div');
        card.dataset.emoji = emoji;
        card.dataset.draggable = '1';
        const sz = 'clamp(52px,14vw,68px)';
        Object.assign(card.style, {
            width: sz, height: sz, borderRadius: '14px',
            background: 'linear-gradient(135deg,#fff,#f8fafc)',
            border: '2.5px solid #e5e7eb',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 'clamp(1.6rem,5vw,2.4rem)', cursor: 'grab',
            boxShadow: '0 4px 16px rgba(0,0,0,0.09)',
            flexShrink: '0', touchAction: 'none',
            transition: 'all 0.2s cubic-bezier(0.175,0.885,0.32,1.275)',
            opacity: '0', transform: 'scale(0) rotate(-8deg)'
        });
        card.textContent = emoji;

        // Entrance animation
        requestAnimationFrame(() => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1) rotate(0)';
            }, delay * 80 + 100);
        });

        this._attachDrag(card);
        return card;
    }

    // ── Drag logic ────────────────────────────────────────────────────
    _attachDrag(card) {
        let ghost = null;

        const onMove = (e) => {
            if (!ghost) return;
            const pt = e.touches ? e.touches[0] : e;
            ghost.style.left = (pt.clientX - ghost._offX) + 'px';
            ghost.style.top = (pt.clientY - ghost._offY) + 'px';

            // Highlight hovered slot
            this.slotEls.forEach(slot => {
                if (slot.dataset.filled !== '0') return;
                const r = slot.getBoundingClientRect();
                const over = pt.clientX > r.left && pt.clientX < r.right &&
                    pt.clientY > r.top && pt.clientY < r.bottom;
                slot.style.background = over ? '#eff6ff' : '#f8fafc';
                slot.style.borderColor = over ? '#60a5fa' : '#cbd5e1';
                slot.style.transform = over ? 'scale(1.08)' : 'scale(1)';
            });
        };

        const onUp = (e) => {
            if (!ghost) return;
            document.removeEventListener('pointermove', onMove);
            document.removeEventListener('pointerup', onUp);

            const pt = e;
            let dropped = false;

            for (const slot of this.slotEls) {
                if (slot.dataset.filled !== '0') continue;
                const r = slot.getBoundingClientRect();
                if (pt.clientX > r.left && pt.clientX < r.right &&
                    pt.clientY > r.top && pt.clientY < r.bottom) {

                    const dragEmoji = card.dataset.emoji;
                    const correctEmoji = slot.dataset.correctEmoji;

                    if (dragEmoji === correctEmoji) {
                        this._placeCorrect(slot, card, dragEmoji);
                    } else {
                        this._wrongDrop(slot, card);
                    }
                    dropped = true;
                    break;
                }
            }

            if (!dropped) {
                // Return to tray
                card.style.opacity = '1';
                card.style.transform = 'scale(1) rotate(0)';
            }

            ghost.remove();
            ghost = null;

            // Reset all slot highlights
            this.slotEls.forEach(slot => {
                if (slot.dataset.filled === '0') {
                    slot.style.background = '#f8fafc';
                    slot.style.borderColor = '#cbd5e1';
                    slot.style.transform = 'scale(1)';
                }
            });
        };

        card.addEventListener('pointerdown', (e) => {
            if (card.dataset.draggable !== '1') return;
            e.preventDefault();
            card.setPointerCapture(e.pointerId);

            const rect = card.getBoundingClientRect();
            ghost = document.createElement('div');
            ghost._offX = e.clientX - rect.left;
            ghost._offY = e.clientY - rect.top;
            ghost.textContent = card.dataset.emoji;
            Object.assign(ghost.style, {
                position: 'fixed',
                left: (e.clientX - ghost._offX) + 'px',
                top: (e.clientY - ghost._offY) + 'px',
                width: rect.width + 'px', height: rect.height + 'px',
                borderRadius: '14px',
                background: 'white',
                border: '3px solid #f59e0b',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'clamp(1.6rem,5vw,2.4rem)',
                boxShadow: '0 16px 40px rgba(0,0,0,0.22)',
                zIndex: '9999', pointerEvents: 'none',
                transform: 'scale(1.18) rotate(-4deg)',
                transition: 'none'
            });
            document.body.appendChild(ghost);

            card.style.opacity = '0.35';
            card.style.transform = 'scale(0.9)';

            document.addEventListener('pointermove', onMove);
            document.addEventListener('pointerup', onUp);
        });
    }

    // ── Place correctly ───────────────────────────────────────────────
    _placeCorrect(slot, card, emoji) {
        slot.dataset.filled = '1';
        const qm = slot.querySelector('.slot-qmark');
        const em = slot.querySelector('.slot-emoji');

        if (qm) qm.style.display = 'none';
        em.textContent = emoji;
        em.style.transform = 'scale(1)';

        slot.style.background = '#d1fae5';
        slot.style.borderColor = '#10b981';
        slot.style.borderStyle = 'solid';

        // Particle burst
        this._burst(slot);

        // Remove piece card
        card.style.transition = 'all 0.2s';
        card.style.opacity = '0';
        card.style.transform = 'scale(0)';
        setTimeout(() => card.remove(), 200);

        this.placedCount++;
        this.scorePill.textContent = `🧩 Орын: ${this.placedCount} / ${this.totalMissing}`;

        if (this.placedCount >= this.totalMissing) {
            // All filled — show celebration
            setTimeout(() => {
                this.slotEls.forEach(s => {
                    s.style.background = '#d1fae5';
                    s.style.borderColor = '#10b981';
                });
                this.onSuccess();
            }, 400);
        }
    }

    // ── Wrong drop ────────────────────────────────────────────────────
    _wrongDrop(slot, card) {
        // Red flash + shake
        slot.style.background = '#fee2e2';
        slot.style.borderColor = '#ef4444';
        const shakes = [10, -8, 6, -4, 2, 0];
        shakes.forEach((x, i) => {
            setTimeout(() => {
                slot.style.transform = `translateX(${x}px)`;
                if (i === shakes.length - 1) {
                    slot.style.background = '#f8fafc';
                    slot.style.borderColor = '#cbd5e1';
                }
            }, i * 55);
        });

        // Return card
        card.style.opacity = '1';
        card.style.transform = 'scale(1) rotate(0)';
        this.onFail();
    }

    // ── Confetti burst ────────────────────────────────────────────────
    _burst(slot) {
        const rect = slot.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const colors = ['#fbbf24', '#34d399', '#60a5fa', '#f87171', '#a78bfa', '#fb923c'];
        for (let i = 0; i < 12; i++) {
            const dot = document.createElement('div');
            const angle = (i / 12) * Math.PI * 2;
            const dist = 28 + Math.random() * 32;
            const size = 5 + Math.random() * 5;
            Object.assign(dot.style, {
                position: 'fixed', left: cx + 'px', top: cy + 'px',
                width: size + 'px', height: size + 'px',
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                background: colors[i % colors.length],
                pointerEvents: 'none', zIndex: '9998',
                transition: `all ${0.35 + Math.random() * 0.25}s ease-out`,
                transform: 'scale(1)'
            });
            document.body.appendChild(dot);
            requestAnimationFrame(() => {
                setTimeout(() => {
                    dot.style.left = (cx + Math.cos(angle) * dist) + 'px';
                    dot.style.top = (cy + Math.sin(angle) * dist) + 'px';
                    dot.style.opacity = '0';
                    dot.style.transform = 'scale(0) rotate(180deg)';
                }, 10);
            });
            setTimeout(() => dot.remove(), 700);
        }
    }

    // ── Enable slots ──────────────────────────────────────────────────
    _enableDropZones() {
        this.slotEls.forEach(slot => { slot.dataset.filled = '0'; });
    }
}
