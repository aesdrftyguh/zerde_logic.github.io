class CubeCountTemplate {
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
            justifyContent: 'flex-start', gap: 'clamp(18px,4vw,30px)',
            padding: '14px', boxSizing: 'border-box', overflowY: 'auto'
        });

        const layout = this.content.layout || [[1]];
        const answer = this.content.answer;
        const options = this.content.options || this._generateOptions(answer);

        // ── Visual cube stack ────────────────────────────────────────
        const vizCard = document.createElement('div');
        Object.assign(vizCard.style, {
            background: 'white', borderRadius: '22px',
            padding: 'clamp(16px,5vw,30px)', width: '100%',
            boxShadow: '0 8px 26px rgba(0,0,0,0.08)',
            textAlign: 'center', boxSizing: 'border-box'
        });

        const vizTitle = document.createElement('div');
        vizTitle.style.fontWeight = '700';
        vizTitle.style.color = '#94a3b8';
        vizTitle.style.fontSize = 'clamp(0.75rem,2.2vw,0.9rem)';
        vizTitle.style.marginBottom = '12px';
        vizTitle.textContent = 'Неше текше (кубик) бар?';

        // Render layout as a 2D stack view
        const stackWrap = document.createElement('div');
        Object.assign(stackWrap.style, {
            display: 'flex', flexDirection: 'column', gap: '4px',
            alignItems: 'center'
        });

        layout.forEach((rowData, ri) => {
            const row = document.createElement('div');
            Object.assign(row.style, {
                display: 'flex', gap: '4px', alignItems: 'flex-end', justifyContent: 'center'
            });

            rowData.forEach((stackHeight, ci) => {
                const col = document.createElement('div');
                Object.assign(col.style, {
                    display: 'flex', flexDirection: 'column', gap: '3px', alignItems: 'center'
                });
                // Stack cubes from bottom to top
                for (let h = 0; h < stackHeight; h++) {
                    const cube = this._makeCubeEl(ri, ci, h, stackHeight);
                    col.prepend(cube); // prepend so top cubes appear first in DOM
                }
                row.appendChild(col);
            });

            stackWrap.appendChild(row);
        });

        vizCard.appendChild(vizTitle);
        vizCard.appendChild(stackWrap);

        // ── Options ───────────────────────────────────────────────────
        const grid = document.createElement('div');
        Object.assign(grid.style, {
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'clamp(10px,2.5vw,18px)', width: '100%', boxSizing: 'border-box'
        });

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.textContent = opt;
            Object.assign(btn.style, {
                background: 'white', border: '3px solid #e5e7eb',
                borderRadius: '18px', padding: 'clamp(14px,4vw,22px)',
                fontSize: 'clamp(1.6rem,5vw,2.5rem)', fontWeight: '900',
                color: '#1e293b', cursor: 'pointer',
                touchAction: 'manipulation', userSelect: 'none',
                fontFamily: 'inherit', transition: 'all 0.15s', minHeight: '68px'
            });
            btn.addEventListener('pointerdown', () => btn.style.transform = 'scale(0.95)');
            btn.addEventListener('pointerup', () => {
                if (this.answered) return;
                btn.style.transform = '';
                this.answered = true;
                if (opt === answer) {
                    btn.style.background = '#d1fae5'; btn.style.borderColor = '#10b981';
                    setTimeout(() => this.onSuccess(btn), 500);
                } else {
                    btn.style.background = '#fee2e2'; btn.style.borderColor = '#ef4444';
                    setTimeout(() => this.onFail(), 600);
                }
            });
            grid.appendChild(btn);
        });

        this.container.appendChild(vizCard);
        this.container.appendChild(grid);
    }

    _makeCubeEl(ri, ci, hi, maxH) {
        const cube = document.createElement('div');
        const sz = 'clamp(28px,8vw,50px)';
        // Color gradient by height
        const hue = 220 + (hi / Math.max(maxH - 1, 1)) * 40;
        Object.assign(cube.style, {
            width: sz, height: sz, borderRadius: '6px',
            background: `hsl(${hue},65%,${55 + hi * 4}%)`,
            border: `2px solid hsl(${hue},65%,${40 + hi * 4}%)`,
            boxShadow: `inset 2px 2px 4px rgba(255,255,255,0.3), 2px 2px 4px rgba(0,0,0,0.15)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: '0'
        });
        // Top face highlight
        const top = document.createElement('div');
        Object.assign(top.style, {
            width: '60%', height: '20%', background: 'rgba(255,255,255,0.25)',
            borderRadius: '3px', position: 'absolute', top: '8%', left: '20%'
        });
        cube.style.position = 'relative';
        cube.appendChild(top);
        return cube;
    }

    _generateOptions(correct) {
        const arr = [correct - 1, correct, correct + 1].filter(n => n > 0);
        while (arr.length < 3) arr.push(correct + arr.length);
        return arr.sort(() => Math.random() - 0.5);
    }
}
