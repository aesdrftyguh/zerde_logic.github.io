class StoreLabTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content;
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.total = 0;
        this.render();
    }

    render() {
        this.container.innerHTML = '';
        Object.assign(this.container.style, {
            width: '100%', height: '100%', display: 'flex',
            flexDirection: 'column', alignItems: 'center',
            gap: 'clamp(12px,3vw,20px)', padding: '12px',
            boxSizing: 'border-box', overflowY: 'auto', justifyContent: 'flex-start'
        });

        // Counter display
        const counterBox = document.createElement('div');
        Object.assign(counterBox.style, {
            width: '100%', background: 'white', borderRadius: '20px',
            padding: 'clamp(14px,4vw,24px)', boxSizing: 'border-box',
            boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'
        });

        const counterLabel = document.createElement('div');
        counterLabel.style.fontSize = 'clamp(0.8rem,2.5vw,1rem)';
        counterLabel.style.fontWeight = '700';
        counterLabel.style.color = '#94a3b8';
        counterLabel.textContent = 'Жалпы сома:';

        this.totalDisplay = document.createElement('div');
        this.totalDisplay.style.fontSize = 'clamp(2.5rem,8vw,4rem)';
        this.totalDisplay.style.fontWeight = '900';
        this.totalDisplay.style.color = '#1e293b';
        this.totalDisplay.textContent = '0 ₸';

        const target = document.createElement('div');
        target.style.fontSize = 'clamp(0.85rem,2.5vw,1rem)';
        target.style.fontWeight = '700';
        target.style.color = '#f59e0b';
        target.textContent = `Мақсат: ${this.content.target} ₸`;

        counterBox.appendChild(counterLabel);
        counterBox.appendChild(this.totalDisplay);
        counterBox.appendChild(target);

        // Items shelf
        const shelf = document.createElement('div');
        Object.assign(shelf.style, {
            display: 'flex', flexWrap: 'wrap', gap: 'clamp(8px,2vw,14px)',
            width: '100%', justifyContent: 'center',
            background: 'rgba(255,255,255,0.6)', borderRadius: '18px',
            padding: 'clamp(12px,3vw,20px)', boxSizing: 'border-box'
        });

        this.content.items.forEach(item => {
            const card = document.createElement('div');
            Object.assign(card.style, {
                background: 'white', borderRadius: '16px',
                border: '2px solid #e5e7eb', padding: '12px 10px',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '6px',
                cursor: 'pointer', touchAction: 'manipulation',
                userSelect: 'none', transition: 'all 0.15s',
                boxShadow: '0 3px 10px rgba(0,0,0,0.06)',
                minWidth: 'clamp(70px,18vw,100px)'
            });

            const icon = document.createElement('div');
            icon.style.fontSize = 'clamp(1.8rem,5vw,3rem)';
            icon.textContent = item.emoji || item.icon || '📦';

            const price = document.createElement('div');
            price.style.fontSize = 'clamp(0.8rem,2.5vw,1rem)';
            price.style.fontWeight = '800';
            price.style.color = '#374151';
            price.textContent = `${item.price} ₸`;

            const counter = document.createElement('div');
            counter.style.fontSize = 'clamp(0.7rem,2vw,0.85rem)';
            counter.style.color = '#94a3b8';
            counter.style.fontWeight = '700';
            counter.textContent = '×0';
            card._counter = counter;
            card._count = 0;
            card._price = item.price;

            card.appendChild(icon);
            card.appendChild(price);
            card.appendChild(counter);

            card.addEventListener('pointerdown', () => card.style.transform = 'scale(0.95)');
            card.addEventListener('pointerup', () => {
                card.style.transform = '';
                card._count++;
                counter.textContent = `×${card._count}`;
                this.total += item.price;
                this.totalDisplay.textContent = `${this.total} ₸`;
                this.totalDisplay.style.color = this.total > this.content.target ? '#ef4444' :
                    this.total === this.content.target ? '#10b981' : '#1e293b';
            });

            shelf.appendChild(card);
        });

        // Check button
        const checkBtn = document.createElement('button');
        Object.assign(checkBtn.style, {
            width: '100%', padding: 'clamp(14px,4vw,20px)',
            background: 'linear-gradient(135deg,#f59e0b,#d97706)',
            border: 'none', borderRadius: '16px',
            fontSize: 'clamp(1rem,3vw,1.2rem)', fontWeight: '900',
            color: 'white', cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(245,158,11,0.35)',
            touchAction: 'manipulation', fontFamily: 'inherit'
        });
        checkBtn.textContent = 'Кассаға жіберу 🛒';
        checkBtn.addEventListener('pointerup', () => {
            if (this.total === this.content.target) {
                setTimeout(() => this.onSuccess(), 300);
            } else {
                this.onFail();
                this.total = 0;
                this.totalDisplay.textContent = '0 ₸';
                this.totalDisplay.style.color = '#1e293b';
                shelf.querySelectorAll('div').forEach(c => {
                    if (c._counter) { c._counter.textContent = '×0'; c._count = 0; }
                });
            }
        });

        this.container.appendChild(counterBox);
        this.container.appendChild(shelf);
        this.container.appendChild(checkBtn);
    }
}
