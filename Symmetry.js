class SymmetryTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content;
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.userGrid = null;
        this.render();
    }

    render() {
        this.container.innerHTML = '';
        Object.assign(this.container.style, {
            width: '100%', height: '100%', display: 'flex',
            flexDirection: 'column', alignItems: 'center',
            justifyContent: 'flex-start', gap: 'clamp(12px,3vw,20px)',
            padding: '12px', boxSizing: 'border-box', overflowY: 'auto'
        });

        const size = this.content.size || 5;
        const pattern = this.content.pattern || [];
        const target = this.content.target || [];

        // Init user grid as all zeros
        this.userGrid = Array.from({ length: size }, () => new Array(size).fill(0));

        const label = document.createElement('div');
        label.style.fontSize = 'clamp(0.8rem,2.5vw,1rem)';
        label.style.fontWeight = '700'; label.style.color = '#475569';
        label.style.textAlign = 'center';
        label.textContent = 'Сол жақтың айнасын оң жақта бояңыз';

        // ── Two grids side by side ─────────────────────────────────────
        const gridsRow = document.createElement('div');
        Object.assign(gridsRow.style, {
            display: 'flex', gap: 'clamp(10px,3vw,20px)',
            width: '100%', justifyContent: 'center', alignItems: 'flex-start'
        });

        const cellSz = 'clamp(26px,7.5vw,42px)';
        const gap = 'clamp(2px,0.8vw,4px)';

        const makeGrid = (gridData, interactive) => {
            const wrap = document.createElement('div');
            Object.assign(wrap.style, {
                display: 'grid',
                gridTemplateColumns: `repeat(${size}, ${cellSz})`,
                gap: gap
            });

            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) {
                    const cell = document.createElement('div');
                    const filled = gridData[r] && gridData[r][c] === 1;
                    Object.assign(cell.style, {
                        width: cellSz, height: cellSz,
                        borderRadius: 'clamp(4px,1vw,6px)',
                        background: filled ? '#6366f1' : (interactive ? '#f8fafc' : '#f1f5f9'),
                        border: interactive ? '1.5px solid #e5e7eb' : '1.5px solid #e2e8f0',
                        cursor: interactive ? 'pointer' : 'default',
                        transition: 'background 0.15s',
                        boxSizing: 'border-box'
                    });
                    if (interactive) {
                        cell._r = r; cell._c = c;
                        cell.addEventListener('pointerdown', () => {
                            const wasOn = this.userGrid[r][c] === 1;
                            this.userGrid[r][c] = wasOn ? 0 : 1;
                            cell.style.background = this.userGrid[r][c] === 1 ? '#f59e0b' : '#f8fafc';
                        });
                    }
                    wrap.appendChild(cell);
                }
            }
            return wrap;
        };

        // Left - pattern (read-only)
        const leftWrap = document.createElement('div');
        Object.assign(leftWrap.style, {
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px'
        });
        const leftLabel = document.createElement('div');
        leftLabel.style.fontSize = 'clamp(0.65rem,2vw,0.8rem)';
        leftLabel.style.fontWeight = '700'; leftLabel.style.color = '#6366f1';
        leftLabel.textContent = 'Үлгі / Образец';
        leftWrap.appendChild(leftLabel);
        leftWrap.appendChild(makeGrid(pattern, false));

        // Mirror line
        const mirrorLine = document.createElement('div');
        Object.assign(mirrorLine.style, {
            width: '4px', background: 'linear-gradient(180deg,#f59e0b,#6366f1)',
            borderRadius: '2px', alignSelf: 'stretch', minHeight: '80px', flexShrink: '0'
        });

        // Right - interactive
        const rightWrap = document.createElement('div');
        Object.assign(rightWrap.style, {
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px'
        });
        const rightLabel = document.createElement('div');
        rightLabel.style.fontSize = 'clamp(0.65rem,2vw,0.8rem)';
        rightLabel.style.fontWeight = '700'; rightLabel.style.color = '#f59e0b';
        rightLabel.textContent = 'Жауабыңыз / Ответ';
        rightWrap.appendChild(rightLabel);
        rightWrap.appendChild(makeGrid([], true));

        gridsRow.appendChild(leftWrap);
        gridsRow.appendChild(mirrorLine);
        gridsRow.appendChild(rightWrap);

        // ── Check button ──────────────────────────────────────────────
        const checkBtn = document.createElement('button');
        Object.assign(checkBtn.style, {
            width: '100%', padding: 'clamp(13px,3.5vw,18px)',
            background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
            border: 'none', borderRadius: '14px',
            fontSize: 'clamp(1rem,3vw,1.2rem)', fontWeight: '900',
            color: 'white', cursor: 'pointer', touchAction: 'manipulation',
            fontFamily: 'inherit', boxShadow: '0 5px 16px rgba(99,102,241,0.35)',
            transition: 'transform 0.15s'
        });
        checkBtn.textContent = 'Тексеру ✓';
        checkBtn.addEventListener('pointerdown', () => checkBtn.style.transform = 'scale(0.97)');
        checkBtn.addEventListener('pointerup', () => {
            checkBtn.style.transform = '';
            // Compare userGrid with target
            let correct = true;
            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) {
                    const expectedVal = target[r] ? target[r][c] : 0;
                    if ((this.userGrid[r][c] || 0) !== expectedVal) {
                        correct = false; break;
                    }
                }
                if (!correct) break;
            }
            if (correct) setTimeout(() => this.onSuccess(), 300);
            else this.onFail();
        });

        this.container.appendChild(label);
        this.container.appendChild(gridsRow);
        this.container.appendChild(checkBtn);
    }
}
