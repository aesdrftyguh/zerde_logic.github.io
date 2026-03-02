class BubbleMergeTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content;
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.selected = [];
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
        // A: {target:N, numbers:[...]}  (our format)
        // B: {target:N, bubbles:[...]}  (data.js format)
        const numbers = this.content.numbers || this.content.bubbles || [];
        const target = this.content.target;

        // Target box
        const targetBox = document.createElement('div');
        Object.assign(targetBox.style, {
            background: 'white', borderRadius: '20px',
            padding: 'clamp(14px,4vw,22px)', width: '100%',
            boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
            textAlign: 'center', boxSizing: 'border-box'
        });
        const tLabel = document.createElement('div');
        tLabel.style.fontSize = 'clamp(0.8rem,2.5vw,1rem)';
        tLabel.style.fontWeight = '700'; tLabel.style.color = '#94a3b8';
        tLabel.textContent = 'Мақсат:';
        const tVal = document.createElement('div');
        tVal.style.fontSize = 'clamp(2.5rem,8vw,4rem)';
        tVal.style.fontWeight = '900'; tVal.style.color = '#f59e0b';
        tVal.textContent = target;
        targetBox.appendChild(tLabel);
        targetBox.appendChild(tVal);

        // Sum display
        const sumBox = document.createElement('div');
        Object.assign(sumBox.style, {
            fontSize: 'clamp(1.1rem,3.5vw,1.6rem)', fontWeight: '800',
            color: '#475569', minHeight: '36px', textAlign: 'center'
        });
        this.sumBox = sumBox;

        // Shuffled numbers
        const shuffled = [...numbers].sort(() => Math.random() - 0.5);
        const bubblesWrap = document.createElement('div');
        Object.assign(bubblesWrap.style, {
            display: 'flex', flexWrap: 'wrap', gap: 'clamp(8px,2.5vw,14px)',
            justifyContent: 'center', width: '100%'
        });

        shuffled.forEach(num => {
            const b = document.createElement('div');
            b.textContent = num;
            b.dataset.val = num;
            b.dataset.sel = '0';
            Object.assign(b.style, {
                width: 'clamp(56px,15vw,80px)', height: 'clamp(56px,15vw,80px)',
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#60a5fa,#3b82f6)',
                color: 'white', fontWeight: '900',
                fontSize: 'clamp(1.2rem,4vw,1.9rem)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', touchAction: 'manipulation', userSelect: 'none',
                boxShadow: '0 4px 14px rgba(59,130,246,0.4)',
                transition: 'all 0.15s', flexShrink: '0'
            });
            b.addEventListener('pointerdown', () => b.style.transform = 'scale(0.91)');
            b.addEventListener('pointerup', () => {
                b.style.transform = '';
                if (b.dataset.sel === '0') {
                    b.dataset.sel = '1';
                    b.style.background = 'linear-gradient(135deg,#f59e0b,#d97706)';
                    b.style.boxShadow = '0 4px 14px rgba(245,158,11,0.4)';
                    this.selected.push(num);
                } else {
                    b.dataset.sel = '0';
                    b.style.background = 'linear-gradient(135deg,#60a5fa,#3b82f6)';
                    b.style.boxShadow = '0 4px 14px rgba(59,130,246,0.4)';
                    const idx = this.selected.lastIndexOf(num);
                    if (idx !== -1) this.selected.splice(idx, 1);
                }
                const sum = this.selected.reduce((a, v) => a + v, 0);
                this.sumBox.textContent = this.selected.length
                    ? `${this.selected.join(' + ')} = ${sum}`
                    : '';
            });
            bubblesWrap.appendChild(b);
        });

        // Check button
        const checkBtn = document.createElement('button');
        Object.assign(checkBtn.style, {
            width: '100%', padding: 'clamp(13px,3.5vw,18px)',
            background: 'linear-gradient(135deg,#f59e0b,#d97706)',
            border: 'none', borderRadius: '16px',
            fontSize: 'clamp(1rem,3vw,1.2rem)', fontWeight: '900',
            color: 'white', cursor: 'pointer', touchAction: 'manipulation',
            fontFamily: 'inherit', boxShadow: '0 6px 18px rgba(245,158,11,0.35)'
        });
        checkBtn.textContent = 'Біріктіру ✓';
        checkBtn.addEventListener('pointerup', () => {
            const sum = this.selected.reduce((a, v) => a + v, 0);
            if (sum === target) {
                setTimeout(() => this.onSuccess(), 300);
            } else {
                this.onFail();
                // Reset
                this.selected = [];
                this.sumBox.textContent = '';
                bubblesWrap.querySelectorAll('div').forEach(b => {
                    b.dataset.sel = '0';
                    b.style.background = 'linear-gradient(135deg,#60a5fa,#3b82f6)';
                    b.style.boxShadow = '0 4px 14px rgba(59,130,246,0.4)';
                });
            }
        });

        this.container.appendChild(targetBox);
        this.container.appendChild(sumBox);
        this.container.appendChild(bubblesWrap);
        this.container.appendChild(checkBtn);
    }
}
