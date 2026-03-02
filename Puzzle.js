class PuzzleTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content;
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.placedCount = 0;
        this.render();
    }

    render() {
        this.container.innerHTML = '';
        Object.assign(this.container.style, {
            width: '100%', height: '100%', display: 'flex',
            flexDirection: 'column', alignItems: 'center',
            gap: 'clamp(14px,3vw,22px)', padding: '14px',
            boxSizing: 'border-box', overflowY: 'auto', justifyContent: 'flex-start'
        });

        // ── Detect mode ───────────────────────────────────────────────
        // MODE A (simple): {emoji: '🦊'}  ← data.js attn_patterns
        // MODE B (full):   {slots:[...], pieces:[...], gridSize:N}
        const isSimple = !!this.content.emoji && !this.content.slots;

        if (isSimple) {
            this._renderEmojiPuzzle();
        } else {
            this._renderSlotPuzzle();
        }
    }

    // ── Simple emoji puzzle: cut 3x3 grid, place pieces ─────────────
    _renderEmojiPuzzle() {
        const emoji = this.content.emoji || '🎯';
        const GRID = 3;
        const totalPieces = GRID * GRID;

        const label = document.createElement('div');
        label.style.fontWeight = '700';
        label.style.fontSize = 'clamp(0.85rem,2.8vw,1.05rem)';
        label.style.color = '#475569';
        label.style.textAlign = 'center';
        label.textContent = 'Пазлды жина — барлық бөліктерді орнына тастаңыз!';

        // Target preview (small hint)
        const hint = document.createElement('div');
        Object.assign(hint.style, {
            background: 'white', borderRadius: '14px',
            padding: '10px 18px', boxShadow: '0 4px 14px rgba(0,0,0,0.07)',
            fontSize: 'clamp(2.5rem,10vw,5rem)', textAlign: 'center'
        });
        hint.textContent = emoji;

        const hintLabel = document.createElement('div');
        hintLabel.style.fontSize = 'clamp(0.65rem,2vw,0.8rem)';
        hintLabel.style.color = '#94a3b8'; hintLabel.style.fontWeight = '600';
        hintLabel.textContent = 'Мақсат';

        // Board: 3x3 empty slots
        const board = document.createElement('div');
        Object.assign(board.style, {
            display: 'grid', gridTemplateColumns: `repeat(${GRID}, 1fr)`,
            gap: '3px', padding: '10px',
            background: '#f1f5f9', borderRadius: '18px',
            width: `min(280px, 90vw)`, boxSizing: 'border-box'
        });

        const slots = [];
        for (let i = 0; i < totalPieces; i++) {
            const slot = document.createElement('div');
            Object.assign(slot.style, {
                aspectRatio: '1', background: '#e2e8f0',
                borderRadius: '10px', border: '2px dashed #94a3b8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'clamp(1.2rem,4vw,2rem)', transition: 'all 0.2s',
                userSelect: 'none'
            });
            slot.dataset.index = i;
            slot.dataset.filled = '0';
            board.appendChild(slot);
            slots.push(slot);
        }

        // Pieces tray: shuffled pieces numbered 1..N
        const labels = ['↖', '↑', '↗', '←', '⬛', '→', '↙', '↓', '↘'];
        const pieceOrder = Array.from({ length: totalPieces }, (_, i) => i)
            .sort(() => Math.random() - 0.5);

        const tray = document.createElement('div');
        Object.assign(tray.style, {
            display: 'flex', flexWrap: 'wrap', gap: '8px',
            justifyContent: 'center', padding: '10px',
            background: 'rgba(255,255,255,0.6)', borderRadius: '14px',
            width: '100%', boxSizing: 'border-box'
        });

        let selectedPiece = null;

        pieceOrder.forEach(idx => {
            const piece = document.createElement('div');
            piece.dataset.pieceIdx = idx;
            const colors = ['#fbbf24', '#34d399', '#60a5fa', '#f87171', '#a78bfa', '#fb923c', '#4ade80', '#38bdf8', '#e879f9'];
            Object.assign(piece.style, {
                width: 'clamp(42px,12vw,60px)', height: 'clamp(42px,12vw,60px)',
                borderRadius: '10px', background: colors[idx % colors.length],
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'clamp(0.9rem,3vw,1.3rem)', fontWeight: '900',
                color: 'white', cursor: 'pointer', touchAction: 'manipulation',
                userSelect: 'none', transition: 'all 0.15s', flexShrink: '0',
                boxShadow: '0 3px 8px rgba(0,0,0,0.15)'
            });
            piece.textContent = labels[idx];

            piece.addEventListener('pointerdown', () => {
                if (piece.dataset.placed === '1') return;
                if (selectedPiece) {
                    selectedPiece.style.transform = '';
                    selectedPiece.style.boxShadow = '0 3px 8px rgba(0,0,0,0.15)';
                }
                selectedPiece = piece;
                piece.style.transform = 'scale(1.15)';
                piece.style.boxShadow = '0 0 0 4px #fff, 0 0 0 7px #f59e0b';
            });
            tray.appendChild(piece);
        });

        // Slot tap — place selected piece
        slots.forEach(slot => {
            slot.addEventListener('pointerup', () => {
                if (!selectedPiece || slot.dataset.filled === '1') return;
                const pieceIdx = parseInt(selectedPiece.dataset.pieceIdx);
                const slotIdx = parseInt(slot.dataset.index);

                if (pieceIdx === slotIdx) {
                    // Correct placement
                    const colors = ['#fbbf24', '#34d399', '#60a5fa', '#f87171', '#a78bfa', '#fb923c', '#4ade80', '#38bdf8', '#e879f9'];
                    slot.dataset.filled = '1';
                    slot.style.background = colors[pieceIdx % colors.length];
                    slot.style.borderStyle = 'solid';
                    slot.style.borderColor = '#10b981';
                    slot.textContent = labels[pieceIdx];
                    slot.style.color = 'white';
                    slot.style.fontSize = 'clamp(1rem,3.5vw,1.8rem)';
                    slot.style.fontWeight = '900';
                    selectedPiece.style.opacity = '0.3';
                    selectedPiece.style.pointerEvents = 'none';
                    selectedPiece.style.transform = '';
                    selectedPiece = null;
                    this.placedCount++;
                    if (this.placedCount >= totalPieces) {
                        // Show full emoji in center
                        setTimeout(() => this.onSuccess(), 500);
                    }
                } else {
                    // Wrong slot
                    slot.style.background = '#fee2e2';
                    setTimeout(() => { slot.style.background = '#e2e8f0'; }, 500);
                    selectedPiece.style.transform = '';
                    selectedPiece.style.boxShadow = '0 3px 8px rgba(0,0,0,0.15)';
                    selectedPiece = null;
                    this.onFail();
                }
            });
        });

        const hintWrap = document.createElement('div');
        Object.assign(hintWrap.style, {
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
        });
        hintWrap.appendChild(hintLabel);
        hintWrap.appendChild(hint);

        this.container.appendChild(label);
        this.container.appendChild(hintWrap);
        this.container.appendChild(board);
        this.container.appendChild(tray);
    }

    // ── Full slot-based puzzle ────────────────────────────────────────
    _renderSlotPuzzle() {
        const boardSize = this.content.gridSize || 3;
        const board = document.createElement('div');
        Object.assign(board.style, {
            display: 'grid',
            gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
            gap: '4px', width: '100%', maxWidth: `${boardSize * 90}px`,
            padding: '10px', background: '#f1f5f9',
            borderRadius: '18px', boxSizing: 'border-box'
        });

        const rawSlots = this.content.slots || [];
        let totalPieces = 0;

        rawSlots.forEach((slot, i) => {
            const el = document.createElement('div');
            Object.assign(el.style, {
                aspectRatio: '1', background: '#e2e8f0',
                borderRadius: '10px', border: '2px dashed #94a3b8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'clamp(1.4rem,4vw,2.5rem)', minWidth: 'clamp(50px,12vw,80px)',
                transition: 'all 0.2s'
            });
            if (slot.prefilled) {
                el.textContent = slot.content;
                el.style.background = 'white';
                el.style.border = '2px solid #e5e7eb';
            } else {
                totalPieces++;
                el.dataset.index = i;
                el.dataset.accepts = slot.content;
            }
            board.appendChild(el);
        });

        const pieces = (this.content.pieces || []).slice()
            .sort(() => Math.random() - 0.5);
        const tray = document.createElement('div');
        Object.assign(tray.style, {
            display: 'flex', flexWrap: 'wrap', gap: '10px',
            justifyContent: 'center', padding: '10px'
        });

        let selectedPiece = null;
        pieces.forEach(p => {
            const btn = document.createElement('div');
            btn.textContent = p.content;
            btn.dataset.content = p.content;
            Object.assign(btn.style, {
                width: 'clamp(50px,13vw,72px)', height: 'clamp(50px,13vw,72px)',
                background: 'white', borderRadius: '12px',
                border: '2px solid #e5e7eb', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 'clamp(1.6rem,5vw,2.5rem)', cursor: 'pointer',
                touchAction: 'manipulation', userSelect: 'none',
                transition: 'all 0.15s', boxShadow: '0 3px 8px rgba(0,0,0,0.07)'
            });
            btn.addEventListener('pointerdown', () => {
                if (selectedPiece) selectedPiece.style.transform = '';
                selectedPiece = btn;
                btn.style.transform = 'scale(1.15)';
            });
            tray.appendChild(btn);
        });

        board.addEventListener('pointerup', e => {
            if (!selectedPiece) return;
            const slot = e.target.closest('[data-accepts]');
            if (!slot || slot.dataset.filled) return;
            if (selectedPiece.dataset.content === slot.dataset.accepts) {
                slot.textContent = selectedPiece.dataset.content;
                slot.style.background = '#d1fae5'; slot.style.borderStyle = 'solid';
                slot.style.borderColor = '#10b981'; slot.dataset.filled = '1';
                selectedPiece.style.opacity = '0.3'; selectedPiece.style.pointerEvents = 'none';
                selectedPiece.style.transform = ''; selectedPiece = null;
                this.placedCount++;
                if (this.placedCount >= totalPieces) setTimeout(() => this.onSuccess(), 400);
            } else {
                selectedPiece.style.transform = ''; selectedPiece = null;
                this.onFail();
            }
        });

        this.container.appendChild(board);
        this.container.appendChild(tray);
    }
}
