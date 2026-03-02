class OddOneOutTemplate {
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
            justifyContent: 'center', gap: 'clamp(18px,4vw,36px)',
            padding: '16px', boxSizing: 'border-box'
        });

        // Support both:
        // A: {items: [{content, isOdd}]}  ← logic/classification format
        // B: {items: ['😀','😀','😃'], correct: 2}  ← simple format
        let items = this.content.items || [];
        let processedItems;

        if (typeof items[0] === 'string') {
            // Format B - simple string array with correct index
            const correctIdx = this.content.correct;
            processedItems = items.map((emoji, i) => ({
                content: emoji,
                isOdd: i === correctIdx
            }));
        } else if (items[0] && items[0].content !== undefined && items[0].isOdd !== undefined) {
            // Format A - already has isOdd
            processedItems = items.map(item => ({ content: item.content, isOdd: item.isOdd }));
        } else {
            // Fallback
            processedItems = items.map((item, i) => ({
                content: typeof item === 'string' ? item : item.content,
                isOdd: item.isOdd || false
            }));
        }

        // Shuffle
        for (let i = processedItems.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [processedItems[i], processedItems[j]] = [processedItems[j], processedItems[i]];
        }

        const label = document.createElement('div');
        label.style.fontSize = 'clamp(0.85rem,3vw,1.1rem)';
        label.style.fontWeight = '700'; label.style.color = '#64748b';
        label.style.textAlign = 'center';
        label.textContent = 'Артық затты тап!';

        const cols = processedItems.length <= 4 ? 2 : 3;
        const grid = document.createElement('div');
        Object.assign(grid.style, {
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: 'clamp(8px,2.5vw,18px)', width: '100%', boxSizing: 'border-box'
        });

        processedItems.forEach(item => {
            const card = document.createElement('div');
            Object.assign(card.style, {
                background: 'white', borderRadius: '18px',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: 'clamp(10px,3vw,18px)',
                boxShadow: '0 4px 14px rgba(0,0,0,0.07)',
                cursor: 'pointer', border: '3px solid transparent',
                transition: 'all 0.15s', touchAction: 'manipulation',
                userSelect: 'none', minHeight: 'clamp(70px,18vw,110px)'
            });

            const icon = document.createElement('div');
            icon.style.fontSize = 'clamp(2rem,7vw,4rem)';
            icon.textContent = item.content;
            card.appendChild(icon);

            card.addEventListener('pointerdown', () => card.style.transform = 'scale(0.94)');
            card.addEventListener('pointerup', () => {
                if (this.answered) return;
                card.style.transform = '';
                this.answered = true;
                if (item.isOdd) {
                    card.style.background = '#d1fae5'; card.style.borderColor = '#10b981';
                    setTimeout(() => this.onSuccess(card), 500);
                } else {
                    card.style.background = '#fee2e2'; card.style.borderColor = '#ef4444';
                    setTimeout(() => this.onFail(), 600);
                }
            });
            grid.appendChild(card);
        });

        this.container.appendChild(label);
        this.container.appendChild(grid);
    }
}
