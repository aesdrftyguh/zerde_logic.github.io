class ShareDivideTemplate {
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
            justifyContent: 'flex-start', gap: 'clamp(14px,3vw,22px)',
            padding: '14px', boxSizing: 'border-box', overflowY: 'auto'
        });

        // Support both:
        // A: {story, storyEmoji, personEmoji, parts, options, answer}  (our format)
        // B: {total, divisor, emoji, answer}  (data.js format)
        const total = this.content.total;
        const divisor = this.content.divisor || this.content.parts;
        const emoji = this.content.emoji || this.content.storyEmoji || '🍓';
        const answer = this.content.answer;

        // Story/info card
        const storyCard = document.createElement('div');
        Object.assign(storyCard.style, {
            background: 'white', borderRadius: '20px',
            padding: 'clamp(14px,4vw,24px)', width: '100%',
            boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
            textAlign: 'center', boxSizing: 'border-box'
        });

        if (emoji) {
            const e = document.createElement('div');
            e.style.fontSize = 'clamp(3rem,10vw,5rem)';
            e.style.marginBottom = '10px';
            e.textContent = emoji;
            storyCard.appendChild(e);
        }

        const storyText = document.createElement('div');
        storyText.style.fontSize = 'clamp(0.95rem,3.2vw,1.3rem)';
        storyText.style.fontWeight = '700';
        storyText.style.color = '#1e293b';
        storyText.style.lineHeight = '1.5';

        if (this.content.story) {
            storyText.textContent = this.content.story;
        } else if (total && divisor) {
            storyText.textContent = `${total} ${emoji} затты ${divisor} кісіге тең бөл!`;
        }
        storyCard.appendChild(storyText);

        // Visual split — show total items
        const itemsRow = document.createElement('div');
        Object.assign(itemsRow.style, {
            display: 'flex', flexWrap: 'wrap', gap: '6px',
            justifyContent: 'center', width: '100%',
            background: 'white', borderRadius: '16px',
            padding: '12px', boxSizing: 'border-box',
            boxShadow: '0 3px 10px rgba(0,0,0,0.06)'
        });
        if (total) {
            for (let i = 0; i < Math.min(total, 20); i++) {
                const s = document.createElement('span');
                s.style.fontSize = 'clamp(1.2rem,3.5vw,2rem)';
                s.textContent = emoji;
                itemsRow.appendChild(s);
            }
        }

        // Divisor buckets
        const bucketsRow = document.createElement('div');
        Object.assign(bucketsRow.style, {
            display: 'flex', gap: '10px', width: '100%',
            justifyContent: 'center', flexWrap: 'wrap'
        });
        if (divisor) {
            const personEmoji = this.content.personEmoji || '👤';
            for (let p = 0; p < Math.min(divisor, 6); p++) {
                const b = document.createElement('div');
                Object.assign(b.style, {
                    flex: '1', minWidth: 'clamp(50px,12vw,75px)',
                    background: '#f8fafc', borderRadius: '12px',
                    border: '2px dashed #cbd5e1', padding: '8px 4px',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: '4px',
                    fontSize: 'clamp(1.2rem,3.5vw,1.8rem)'
                });
                b.textContent = personEmoji;
                bucketsRow.appendChild(b);
            }
        }

        // Answer options
        const opts = this.content.options || this._generateOptions(answer);
        const grid = document.createElement('div');
        Object.assign(grid.style, {
            display: 'grid', gridTemplateColumns: 'repeat(2,1fr)',
            gap: 'clamp(10px,2.5vw,16px)', width: '100%', boxSizing: 'border-box'
        });

        opts.forEach(opt => {
            const btn = document.createElement('button');
            btn.textContent = opt;
            Object.assign(btn.style, {
                background: 'white', border: '3px solid #e5e7eb',
                borderRadius: '18px', padding: 'clamp(14px,4vw,20px)',
                fontSize: 'clamp(1.6rem,5vw,2.4rem)', fontWeight: '900',
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

        this.container.appendChild(storyCard);
        if (total) this.container.appendChild(itemsRow);
        if (divisor) this.container.appendChild(bucketsRow);
        this.container.appendChild(grid);
    }

    _generateOptions(correct) {
        const set = new Set([correct]);
        while (set.size < 4) {
            const n = correct + Math.floor(Math.random() * 7) - 3;
            if (n > 0) set.add(n);
        }
        return [...set].sort(() => Math.random() - 0.5);
    }
}
