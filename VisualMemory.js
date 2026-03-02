class VisualMemoryTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content;
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.correctMap = []; // [{slotIdx, emoji}]
        this.placedCount = 0;
        this.phase = 'memorize'; // 'memorize' | 'recall'
        this.render();
    }

    render() {
        this.container.innerHTML = '';
        Object.assign(this.container.style, {
            width: '100%', height: '100%', display: 'flex',
            flexDirection: 'column', alignItems: 'center',
            justifyContent: 'flex-start', gap: '10px',
            padding: '10px', boxSizing: 'border-box', overflowY: 'auto',
            userSelect: 'none'
        });

        // Parse data
        const rawItems = this.content.items || [];
        const displayItems = typeof rawItems[0] === 'string'
            ? rawItems
            : rawItems.map(i => i.content || String(i));
        const target = this.content.target || displayItems[0];

        // We'll memorize ALL items and their positions
        // Grid size
        const n = displayItems.length;
        const cols = n <= 4 ? 2 : 3;

        // ── Phase banner ──────────────────────────────────────────────
        const banner = this._makeBanner('👁 Жадыңа сақта!', '#fef3c7', '#b45309', '⏱ 4с');
        this.banner = banner;
        this.bannerLabel = banner.querySelector('.bLabel');
        this.bannerTimer = banner.querySelector('.bTimer');

        // ── Grid ─────────────────────────────────────────────────────
        const gridWrap = document.createElement('div');
        Object.assign(gridWrap.style, {
            background: 'white', borderRadius: '22px',
            padding: 'clamp(10px,3vw,18px)',
            boxShadow: '0 8px 28px rgba(0,0,0,0.08)',
            width: '100%', boxSizing: 'border-box', flexShrink: '0'
        });

        const grid = document.createElement('div');
        Object.assign(grid.style, {
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: 'clamp(6px,2vw,12px)'
        });
        this.grid = grid;
        this.slots = [];

        displayItems.forEach((emoji, idx) => {
            const slot = this._makeSlot(idx, emoji, cols);
            grid.appendChild(slot);
            this.slots.push(slot);
            this.correctMap.push({ slotIdx: idx, emoji });
        });

        gridWrap.appendChild(grid);

        // ── Tray (hidden during memorize) ────────────────────────────
        const trayLabel = document.createElement('div');
        trayLabel.style.cssText = `font-weight:900;font-size:clamp(0.75rem,2.2vw,0.9rem);
            color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;
            width:100%;display:none;`;
        trayLabel.textContent = '✋ Перетащи каждый предмет на своё место:';
        this.trayLabel = trayLabel;

        const tray = document.createElement('div');
        Object.assign(tray.style, {
            display: 'none', flexWrap: 'wrap', gap: 'clamp(8px,2vw,14px)',
            justifyContent: 'center', padding: 'clamp(10px,3vw,16px)',
            background: 'rgba(255,255,255,0.7)', borderRadius: '18px',
            border: '2px dashed #e5e7eb', width: '100%',
            boxSizing: 'border-box', minHeight: '80px',
            alignItems: 'center', flexShrink: '0'
        });
        this.tray = tray;

        // Score tracker
        const scorePill = document.createElement('div');
        Object.assign(scorePill.style, {
            display: 'none', padding: '6px 18px',
            background: 'rgba(255,255,255,0.9)', borderRadius: '30px',
            border: '2px solid #e5e7eb', fontWeight: '900',
            fontSize: 'clamp(0.85rem,2.5vw,1rem)', color: '#475569',
            flexShrink: '0'
        });
        scorePill.textContent = `📍 Орналастырылды: 0 / ${n}`;
        this.scorePill = scorePill;
        this.totalItems = n;

        this.container.appendChild(banner);
        this.container.appendChild(gridWrap);
        this.container.appendChild(trayLabel);
        this.container.appendChild(tray);
        this.container.appendChild(scorePill);

        // ── Phase 1: Memorize countdown ──────────────────────────────
        this._runMemorizePhase(displayItems, cols);
    }

    // ── PHASE 1: Memorize ─────────────────────────────────────────────
    _runMemorizePhase(displayItems, cols) {
        let sec = 4;
        this.bannerTimer.textContent = `⏱ ${sec}с`;

        // Highlight target item specially
        this.slots.forEach((slot, i) => {
            if (displayItems[i] === this.content.target) {
                slot.style.boxShadow = '0 0 0 3px #fbbf24, 0 4px 16px rgba(245,158,11,0.4)';
            }
            // Entrance animation - stagger
            slot.style.opacity = '0';
            slot.style.transform = 'scale(0.7)';
            setTimeout(() => {
                slot.style.transition = 'all 0.35s cubic-bezier(0.175,0.885,0.32,1.275)';
                slot.style.opacity = '1';
                slot.style.transform = 'scale(1)';
            }, i * 80 + 50);
        });

        const tick = setInterval(() => {
            sec--;
            if (sec > 0) {
                this.bannerTimer.textContent = `⏱ ${sec}с`;
                // Pulse timer
                this.bannerTimer.style.transform = 'scale(1.2)';
                setTimeout(() => this.bannerTimer.style.transform = '', 200);
            } else {
                clearInterval(tick);
                this._switchToRecall(displayItems, cols);
            }
        }, 1000);
    }

    // ── PHASE 2: Recall (drag & drop) ────────────────────────────────
    _switchToRecall(displayItems, cols) {
        this.phase = 'recall';

        // Update banner
        this.bannerLabel.textContent = '🎯 Заттарды дұрыс орынға апар!';
        this.bannerTimer.textContent = '';
        Object.assign(this.banner.style, {
            background: 'linear-gradient(135deg,#eff6ff,#dbeafe)',
            borderColor: '#93c5fd'
        });
        this.bannerLabel.style.color = '#1d4ed8';

        // Clear slots
        this.slots.forEach((slot, i) => {
            // Flip-hide animation
            slot.style.transition = 'transform 0.3s ease';
            slot.style.transform = 'rotateY(90deg)';
            setTimeout(() => {
                slot.querySelector('.slot-emoji').textContent = '';
                slot.style.background = '#f8fafc';
                slot.style.border = '2.5px dashed #cbd5e1';
                slot.style.boxShadow = '';
                slot.style.transform = 'rotateY(0deg)';
                slot.dataset.filled = '0';
                slot.dataset.correctEmoji = displayItems[i];
            }, 300 + i * 40);
        });

        // Show tray + score after animation
        setTimeout(() => {
            this.trayLabel.style.display = 'block';
            this.tray.style.display = 'flex';
            this.scorePill.style.display = 'block';

            // Create draggable cards (shuffled)
            const shuffled = [...displayItems].sort(() => Math.random() - 0.5);
            shuffled.forEach((emoji, idx) => {
                const card = this._makeDraggableCard(emoji);
                // Stagger entrance
                card.style.opacity = '0';
                card.style.transform = 'scale(0) rotate(-10deg)';
                setTimeout(() => {
                    card.style.transition = 'all 0.4s cubic-bezier(0.175,0.885,0.32,1.275)';
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1) rotate(0)';
                }, idx * 80);
                this.tray.appendChild(card);
            });

            // Enable drop zones
            this._enableDropZones();
        }, 400 + displayItems.length * 50);
    }

    // ── Make a draggable card ─────────────────────────────────────────
    _makeDraggableCard(emoji) {
        const card = document.createElement('div');
        card.dataset.emoji = emoji;
        card.dataset.draggable = '1';
        const sz = 'clamp(52px,14vw,72px)';
        Object.assign(card.style, {
            width: sz, height: sz, borderRadius: '16px',
            background: 'white', border: '2.5px solid #e5e7eb',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 'clamp(1.6rem,5vw,2.6rem)', cursor: 'grab',
            boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
            flexShrink: '0', touchAction: 'none',
            transition: 'transform 0.15s, box-shadow 0.15s, opacity 0.2s',
            zIndex: '1', position: 'relative'
        });
        card.textContent = emoji;

        this._attachDrag(card);
        return card;
    }

    // ── Drag Logic ───────────────────────────────────────────────────
    _attachDrag(card) {
        let ghost = null;
        let startX, startY, origParent, origSibling;

        const onMove = (e) => {
            if (!ghost) return;
            const pt = e.touches ? e.touches[0] : e;
            ghost.style.left = (pt.clientX - ghost._offX) + 'px';
            ghost.style.top = (pt.clientY - ghost._offY) + 'px';

            // Highlight slot under ghost
            this.slots.forEach(slot => {
                const r = slot.getBoundingClientRect();
                const inside = pt.clientX > r.left && pt.clientX < r.right &&
                    pt.clientY > r.top && pt.clientY < r.bottom;
                if (inside && slot.dataset.filled === '0') {
                    slot.style.background = '#eff6ff';
                    slot.style.borderColor = '#60a5fa';
                    slot.style.transform = 'scale(1.05)';
                } else {
                    slot.style.background = '#f8fafc';
                    slot.style.borderColor = '#cbd5e1';
                    slot.style.transform = 'scale(1)';
                }
            });
        };

        const onUp = (e) => {
            if (!ghost) return;
            document.removeEventListener('pointermove', onMove);
            document.removeEventListener('pointerup', onUp);

            const pt = e.changedTouches ? e.changedTouches[0] : e;

            // Find a matching unfilled slot
            let dropped = false;
            for (const slot of this.slots) {
                const r = slot.getBoundingClientRect();
                if (pt.clientX > r.left && pt.clientX < r.right &&
                    pt.clientY > r.top && pt.clientY < r.bottom &&
                    slot.dataset.filled === '0') {

                    const dragEmoji = card.dataset.emoji;
                    const correctEmoji = slot.dataset.correctEmoji;

                    if (dragEmoji === correctEmoji) {
                        // ✅ Correct!
                        this._placeCorrect(slot, card, dragEmoji);
                        dropped = true;
                    } else {
                        // ❌ Wrong slot — shake and return
                        this._wrongDrop(slot, card, ghost);
                        dropped = true;
                    }
                    break;
                }
            }

            if (!dropped) {
                // Return card to tray
                this._returnCard(card, ghost);
            }

            ghost.remove();
            ghost = null;

            // Reset slots highlight
            this.slots.forEach(slot => {
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

            const pt = e;
            const rect = card.getBoundingClientRect();

            // Create ghost
            ghost = document.createElement('div');
            ghost.textContent = card.dataset.emoji;
            ghost._offX = pt.clientX - rect.left;
            ghost._offY = pt.clientY - rect.top;
            Object.assign(ghost.style, {
                position: 'fixed',
                left: (pt.clientX - ghost._offX) + 'px',
                top: (pt.clientY - ghost._offY) + 'px',
                width: rect.width + 'px', height: rect.height + 'px',
                borderRadius: '16px', background: 'white',
                border: '3px solid #fbbf24',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'clamp(1.6rem,5vw,2.6rem)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
                zIndex: '9999', pointerEvents: 'none',
                transform: 'scale(1.15) rotate(-3deg)',
                transition: 'none'
            });
            document.body.appendChild(ghost);

            // Dim original
            card.style.opacity = '0.4';
            card.style.transform = 'scale(0.9)';

            document.addEventListener('pointermove', onMove);
            document.addEventListener('pointerup', onUp);
        });
    }

    // ── Correct placement ─────────────────────────────────────────────
    _placeCorrect(slot, card, emoji) {
        slot.dataset.filled = '1';
        const slotEmoji = slot.querySelector('.slot-emoji');
        slotEmoji.textContent = emoji;
        slotEmoji.style.transform = 'scale(0)';

        // Snap animation
        slot.style.background = '#d1fae5';
        slot.style.borderColor = '#10b981';
        slot.style.borderStyle = 'solid';
        slot.style.transform = 'scale(1)';

        setTimeout(() => {
            slotEmoji.style.transition = 'transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275)';
            slotEmoji.style.transform = 'scale(1)';
        }, 20);

        // Particles burst on slot
        this._burst(slot);

        // Remove card from tray
        card.style.transition = 'all 0.25s';
        card.style.opacity = '0';
        card.style.transform = 'scale(0)';
        setTimeout(() => card.remove(), 250);

        this.placedCount++;
        this.scorePill.textContent = `📍 Орналастырылды: ${this.placedCount} / ${this.totalItems}`;

        // Win check
        if (this.placedCount >= this.totalItems) {
            setTimeout(() => this.onSuccess(), 500);
        }
    }

    // ── Wrong drop ───────────────────────────────────────────────────
    _wrongDrop(slot, card, ghost) {
        // Shake slot
        slot.style.transition = 'transform 0.1s';
        slot.style.background = '#fee2e2';
        slot.style.borderColor = '#ef4444';
        const shakes = [8, -6, 5, -4, 2, 0];
        shakes.forEach((x, i) => {
            setTimeout(() => {
                slot.style.transform = `translateX(${x}px)`;
                if (i === shakes.length - 1) {
                    slot.style.background = '#f8fafc';
                    slot.style.borderColor = '#cbd5e1';
                    slot.style.transform = 'scale(1)';
                }
            }, i * 60);
        });

        // Return card
        this._returnCard(card, ghost);
        this.onFail();
    }

    // ── Return card to tray ───────────────────────────────────────────
    _returnCard(card, ghost) {
        card.style.transition = 'all 0.3s cubic-bezier(0.175,0.885,0.32,1.275)';
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
    }

    // ── Confetti burst on slot ────────────────────────────────────────
    _burst(slot) {
        const rect = slot.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const colors = ['#fbbf24', '#34d399', '#60a5fa', '#f87171', '#a78bfa'];
        for (let i = 0; i < 10; i++) {
            const dot = document.createElement('div');
            const angle = (i / 10) * Math.PI * 2;
            const dist = 30 + Math.random() * 30;
            Object.assign(dot.style, {
                position: 'fixed',
                left: cx + 'px', top: cy + 'px',
                width: '8px', height: '8px', borderRadius: '50%',
                background: colors[i % colors.length],
                pointerEvents: 'none', zIndex: '9998',
                transition: `all ${0.4 + Math.random() * 0.3}s ease-out`,
                transform: 'scale(1)'
            });
            document.body.appendChild(dot);
            setTimeout(() => {
                dot.style.left = (cx + Math.cos(angle) * dist) + 'px';
                dot.style.top = (cy + Math.sin(angle) * dist) + 'px';
                dot.style.opacity = '0';
                dot.style.transform = 'scale(0)';
            }, 20);
            setTimeout(() => dot.remove(), 800);
        }
    }

    // ── Slot element builder ──────────────────────────────────────────
    _makeSlot(idx, emoji, cols) {
        const slot = document.createElement('div');
        const sz = 'clamp(60px,17vw,90px)';
        Object.assign(slot.style, {
            width: sz, height: sz,
            background: '#f8fafc', border: '2.5px solid #e5e7eb',
            borderRadius: '16px', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 'clamp(1.8rem,6vw,3rem)',
            transition: 'all 0.25s ease',
            position: 'relative', overflow: 'hidden'
        });
        slot.dataset.filled = '1'; // filled during memorize phase
        slot.dataset.correctEmoji = emoji;
        slot.dataset.slotIdx = idx;

        const emojiEl = document.createElement('span');
        emojiEl.className = 'slot-emoji';
        emojiEl.style.transition = 'transform 0.3s';
        emojiEl.textContent = emoji;
        slot.appendChild(emojiEl);
        return slot;
    }

    // ── Enable slots as drop targets ──────────────────────────────────
    _enableDropZones() {
        // Slots already respond via pointermove/up tracking in _attachDrag
        // Just ensure filled=0 is set
        this.slots.forEach(slot => { slot.dataset.filled = '0'; });
    }

    // ── Banner builder ────────────────────────────────────────────────
    _makeBanner(label, bg, color, timer) {
        const b = document.createElement('div');
        Object.assign(b.style, {
            width: '100%', borderRadius: '16px', padding: '10px 16px',
            background: bg, border: `2px solid ${color}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxSizing: 'border-box', flexShrink: '0',
            transition: 'all 0.4s ease'
        });
        const lbl = document.createElement('div');
        lbl.className = 'bLabel';
        lbl.style.cssText = `font-weight:900;font-size:clamp(0.85rem,2.8vw,1.05rem);color:${color};`;
        lbl.textContent = label;
        const tmr = document.createElement('div');
        tmr.className = 'bTimer';
        tmr.style.cssText = `font-weight:900;font-size:clamp(1.2rem,4vw,1.6rem);color:${color};
            transition:transform 0.2s;min-width:48px;text-align:right;`;
        tmr.textContent = timer;
        b.appendChild(lbl);
        b.appendChild(tmr);
        return b;
    }
}
