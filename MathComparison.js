class MathComparisonTemplate {
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
            justifyContent: 'center', gap: 'clamp(20px,5vw,36px)',
            padding: '20px', boxSizing: 'border-box'
        });

        // Determine left/right display values
        const left = this.content.left;
        const right = this.content.right;

        const makeBox = (val) => {
            const box = document.createElement('div');
            Object.assign(box.style, {
                flex: '1', maxWidth: 'clamp(100px,26vw,160px)',
                minHeight: 'clamp(80px,20vw,120px)',
                background: '#f8fafc', borderRadius: '20px',
                border: '2px solid #e5e7eb',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: '6px', padding: '10px', boxSizing: 'border-box'
            });

            // Support {type:'visual', value:'🍎', count:N} or {type:'number', value:N} or plain number/string
            if (val && typeof val === 'object') {
                if (val.type === 'visual') {
                    // Show emojis
                    const emojiRow = document.createElement('div');
                    emojiRow.style.display = 'flex';
                    emojiRow.style.flexWrap = 'wrap';
                    emojiRow.style.justifyContent = 'center';
                    emojiRow.style.gap = '2px';
                    emojiRow.style.fontSize = 'clamp(1.2rem,3.5vw,1.8rem)';
                    for (let i = 0; i < val.count; i++) {
                        const s = document.createElement('span');
                        s.textContent = val.value;
                        emojiRow.appendChild(s);
                    }
                    box.appendChild(emojiRow);
                    const num = document.createElement('div');
                    num.style.fontSize = 'clamp(1.2rem,3.5vw,1.8rem)';
                    num.style.fontWeight = '900'; num.style.color = '#1e293b';
                    num.textContent = val.count;
                    box.appendChild(num);
                } else {
                    // number type
                    const num = document.createElement('div');
                    num.style.fontSize = 'clamp(2rem,8vw,3.5rem)';
                    num.style.fontWeight = '900'; num.style.color = '#1e293b';
                    num.textContent = val.value !== undefined ? val.value : val;
                    box.appendChild(num);
                }
            } else {
                // plain number or string
                const num = document.createElement('div');
                num.style.fontSize = 'clamp(2rem,8vw,3.5rem)';
                num.style.fontWeight = '900'; num.style.color = '#1e293b';
                num.textContent = val;
                box.appendChild(num);
            }
            return box;
        };

        const compareRow = document.createElement('div');
        Object.assign(compareRow.style, {
            display: 'flex', alignItems: 'center',
            gap: 'clamp(10px,3vw,20px)', width: '100%',
            justifyContent: 'center', background: 'white',
            borderRadius: '24px', padding: 'clamp(16px,4vw,28px)',
            boxShadow: '0 8px 28px rgba(0,0,0,0.08)', boxSizing: 'border-box'
        });

        this.signBox = document.createElement('div');
        Object.assign(this.signBox.style, {
            width: 'clamp(48px,12vw,70px)', height: 'clamp(48px,12vw,70px)',
            background: '#dbeafe', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 'clamp(1.6rem,5vw,2.5rem)', fontWeight: '900',
            color: '#1e40af', flexShrink: '0'
        });
        this.signBox.textContent = '?';

        compareRow.appendChild(makeBox(left));
        compareRow.appendChild(this.signBox);
        compareRow.appendChild(makeBox(right));

        // Sign buttons
        const btnRow = document.createElement('div');
        Object.assign(btnRow.style, {
            display: 'flex', gap: 'clamp(10px,3vw,20px)',
            width: '100%', justifyContent: 'center'
        });

        const signs = ['<', '=', '>'];
        signs.forEach(sign => {
            const btn = document.createElement('button');
            btn.textContent = sign;
            Object.assign(btn.style, {
                flex: '1', maxWidth: '100px',
                height: 'clamp(60px,16vw,90px)',
                background: 'white', border: '3px solid #e5e7eb',
                borderRadius: '18px', fontSize: 'clamp(1.6rem,5vw,2.8rem)',
                fontWeight: '900', color: '#1e293b', cursor: 'pointer',
                touchAction: 'manipulation', fontFamily: 'inherit',
                userSelect: 'none', transition: 'all 0.15s'
            });
            btn.addEventListener('pointerdown', () => btn.style.transform = 'scale(0.94)');
            btn.addEventListener('pointerup', () => {
                if (this.answered) return;
                btn.style.transform = '';
                this.answered = true;
                if (sign === this.content.answer) {
                    btn.style.background = '#d1fae5'; btn.style.borderColor = '#10b981';
                    this.signBox.textContent = sign; this.signBox.style.background = '#d1fae5';
                    setTimeout(() => this.onSuccess(btn), 500);
                } else {
                    btn.style.background = '#fee2e2'; btn.style.borderColor = '#ef4444';
                    setTimeout(() => this.onFail(), 600);
                }
            });
            btnRow.appendChild(btn);
        });

        this.container.appendChild(compareRow);
        this.container.appendChild(btnRow);
    }
}
