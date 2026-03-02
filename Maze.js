class MazeTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content;
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        // Support: start as [r,c] array OR {r,c} object
        const startRaw = content.start || [0, 0];
        this.playerPos = Array.isArray(startRaw)
            ? { r: startRaw[0], c: startRaw[1] }
            : { r: startRaw.r, c: startRaw.c };
        const endRaw = content.end || [0, 0];
        this.endPos = Array.isArray(endRaw)
            ? { r: endRaw[0], c: endRaw[1] }
            : { r: endRaw.r, c: endRaw.c };
        this.moves = 0;
        this.gameOver = false;
        this.render();
    }

    render() {
        this.container.innerHTML = '';
        Object.assign(this.container.style, {
            width: '100%', height: '100%', display: 'flex',
            flexDirection: 'column', alignItems: 'center',
            justifyContent: 'flex-start', gap: 'clamp(10px,2.5vw,18px)',
            padding: '12px', boxSizing: 'border-box', overflowY: 'auto'
        });

        const maze = this.content.grid;
        const rows = maze.length;
        const cols = maze[0].length;

        // Build maze grid
        const mazeWrap = document.createElement('div');
        Object.assign(mazeWrap.style, {
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: '3px', width: '100%',
            maxWidth: `${cols * 65}px`,
            background: '#334155', borderRadius: '14px',
            padding: '6px', boxSizing: 'border-box'
        });

        this.cells = [];
        for (let r = 0; r < rows; r++) {
            const rowCells = [];
            for (let c = 0; c < cols; c++) {
                const cell = maze[r][c];
                const isStart = r === this.playerPos.r && c === this.playerPos.c;
                const isEnd = r === this.endPos.r && c === this.endPos.c;
                const isWall = cell === 1;

                const el = document.createElement('div');
                const sz = 'clamp(34px,9.5vw,54px)';
                Object.assign(el.style, {
                    width: sz, height: sz,
                    borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 'clamp(1rem,3vw,1.5rem)',
                    background: isWall ? '#0f172a' :
                        isEnd ? '#d1fae5' : '#f8fafc',
                    border: isWall ? 'none' : '1px solid #e2e8f0',
                    transition: 'background 0.2s'
                });

                if (isStart) {
                    el.textContent = this.content.emoji || this.content.playerEmoji || '🦊';
                    el.style.background = '#fef3c7';
                }
                if (isEnd && !isStart) {
                    el.textContent = this.content.target || '🏁';
                }

                rowCells.push(el);
                mazeWrap.appendChild(el);
            }
            this.cells.push(rowCells);
        }

        // D-pad
        const dpad = document.createElement('div');
        Object.assign(dpad.style, {
            display: 'grid',
            gridTemplateAreas: `". up ." "left . right" ". down ."`,
            gridTemplateColumns: 'repeat(3,1fr)',
            gridTemplateRows: 'repeat(3,1fr)',
            gap: '6px', width: 'clamp(140px,36vw,190px)'
        });

        const makeBtn = (emoji, area, dr, dc) => {
            const btn = document.createElement('button');
            btn.textContent = emoji;
            Object.assign(btn.style, {
                gridArea: area,
                fontSize: 'clamp(1.3rem,4vw,2rem)',
                background: 'white', border: '2px solid #e5e7eb',
                borderRadius: '12px', padding: '10px',
                cursor: 'pointer', touchAction: 'manipulation',
                fontFamily: 'inherit', transition: 'all 0.12s',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                aspectRatio: '1'
            });
            btn.addEventListener('pointerdown', () => { btn.style.transform = 'scale(0.88)'; btn.style.background = '#f1f5f9'; });
            btn.addEventListener('pointerup', () => { btn.style.transform = ''; btn.style.background = 'white'; this.move(dr, dc); });
            return btn;
        };

        dpad.appendChild(makeBtn('⬆️', 'up', -1, 0));
        dpad.appendChild(makeBtn('⬅️', 'left', 0, -1));
        dpad.appendChild(makeBtn('➡️', 'right', 0, 1));
        dpad.appendChild(makeBtn('⬇️', 'down', 1, 0));

        this.mazeWrap = mazeWrap;
        this.container.appendChild(mazeWrap);
        this.container.appendChild(dpad);
    }

    move(dr, dc) {
        if (this.gameOver) return;
        const maze = this.content.grid;
        const nr = this.playerPos.r + dr;
        const nc = this.playerPos.c + dc;

        if (nr < 0 || nr >= maze.length || nc < 0 || nc >= maze[0].length) return;
        if (maze[nr][nc] === 1) {
            // Hit wall - shake and fail
            this.mazeWrap.style.transform = 'translateX(-4px)';
            setTimeout(() => this.mazeWrap.style.transform = '', 200);
            this.onFail();
            return;
        }

        // Clear old position
        const oldCell = this.cells[this.playerPos.r][this.playerPos.c];
        const isOldEnd = this.playerPos.r === this.endPos.r && this.playerPos.c === this.endPos.c;
        oldCell.textContent = isOldEnd ? (this.content.target || '🏁') : '';
        oldCell.style.background = isOldEnd ? '#d1fae5' : '#f8fafc';

        // Move player
        this.playerPos = { r: nr, c: nc };
        const newCell = this.cells[nr][nc];
        newCell.textContent = this.content.emoji || this.content.playerEmoji || '🦊';
        newCell.style.background = '#fef3c7';
        this.moves++;

        // Win check
        if (nr === this.endPos.r && nc === this.endPos.c) {
            this.gameOver = true;
            newCell.style.background = '#d1fae5';
            setTimeout(() => this.onSuccess(), 400);
        }
    }
}
