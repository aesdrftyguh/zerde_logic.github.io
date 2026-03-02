class TrueFalseTemplate {
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
            justifyContent: 'center', gap: 'clamp(20px,5vw,40px)',
            padding: '20px', boxSizing: 'border-box'
        });

        // Statement card
        const card = document.createElement('div');
        Object.assign(card.style, {
            background: 'white', borderRadius: '24px',
            padding: 'clamp(20px,5vw,40px)', width: '100%',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            textAlign: 'center', boxSizing: 'border-box'
        });

        // image or emoji
        const imgEmoji = this.content.image || this.content.emoji;
        if (imgEmoji) {
            const img = document.createElement('div');
            img.style.fontSize = 'clamp(4rem,15vw,8rem)';
            img.style.marginBottom = '16px';
            img.textContent = imgEmoji;
            card.appendChild(img);
        }

        const stmt = document.createElement('div');
        stmt.style.fontSize = 'clamp(1.1rem,4vw,1.7rem)';
        stmt.style.fontWeight = '800';
        stmt.style.color = '#1e293b';
        stmt.style.lineHeight = '1.4';
        stmt.textContent = this.content.statement;
        card.appendChild(stmt);

        // Buttons row
        const row = document.createElement('div');
        Object.assign(row.style, {
            display: 'flex', gap: 'clamp(12px,3vw,24px)',
            width: '100%', justifyContent: 'center'
        });

        // Support both isTrue and correct fields
        const correctAnswer = 'isTrue' in this.content ? this.content.isTrue :
            'correct' in this.content ? this.content.correct : true;

        const makeBtn = (label, emoji, bgColor, borderColor, isCorrect) => {
            const btn = document.createElement('button');
            Object.assign(btn.style, {
                flex: '1', maxWidth: '160px', minHeight: 'clamp(70px,18vw,100px)',
                background: 'white', border: `3px solid ${borderColor}`,
                borderRadius: '20px', fontWeight: '900',
                color: bgColor, cursor: 'pointer',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '6px',
                transition: 'all 0.15s ease', touchAction: 'manipulation',
                userSelect: 'none', fontFamily: 'inherit'
            });
            const e = document.createElement('div');
            e.style.fontSize = 'clamp(1.8rem,6vw,3rem)';
            e.textContent = emoji;
            const l = document.createElement('div');
            l.style.fontSize = 'clamp(0.8rem,2.5vw,1rem)';
            l.style.fontWeight = '900';
            l.textContent = label;
            btn.appendChild(e);
            btn.appendChild(l);

            btn.addEventListener('pointerdown', () => btn.style.transform = 'scale(0.94)');
            btn.addEventListener('pointerup', () => {
                if (this.answered) return;
                btn.style.transform = '';
                this.answered = true;
                if (isCorrect) {
                    btn.style.background = '#d1fae5'; btn.style.borderColor = '#10b981';
                    setTimeout(() => this.onSuccess(btn), 500);
                } else {
                    btn.style.background = '#fee2e2'; btn.style.borderColor = '#ef4444';
                    setTimeout(() => this.onFail(), 600);
                }
            });
            return btn;
        };

        row.appendChild(makeBtn('ДҰРЫС', '✅', '#065f46', '#10b981', correctAnswer === true));
        row.appendChild(makeBtn('ДҰРЫС ЕМЕС', '❌', '#7f1d1d', '#ef4444', correctAnswer === false));

        this.container.appendChild(card);
        this.container.appendChild(row);
    }
}
