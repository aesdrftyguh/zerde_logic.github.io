class ActionSequenceTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content;
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.selectedOrder = [];
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

        // Support both:
        // A: {steps:[{id,text,icon}], correctOrder:[...ids], instruction} (our format)
        // B: {steps:[{content, order}], instruction}  (data.js format)
        const steps = this.content.steps || [];
        // Detect format B: no id field
        const isFormatB = steps.length > 0 && !steps[0].id;

        // If data.js format, convert to internal format
        const normalized = steps.map((s, i) => ({
            id: s.id || i,
            text: s.text || '',
            icon: s.icon || s.content || '',
            order: s.order !== undefined ? s.order : i
        }));

        // Correct order by sorted order field
        const correctOrder = [...normalized].sort((a, b) => a.order - b.order).map(s => s.id);

        // Shuffle for display
        const shuffled = [...normalized].sort(() => Math.random() - 0.5);

        // Instruction
        const inst = document.createElement('div');
        Object.assign(inst.style, {
            fontSize: 'clamp(0.85rem,2.8vw,1.05rem)', fontWeight: '700',
            color: '#475569', textAlign: 'center', lineHeight: '1.4'
        });
        inst.textContent = this.content.instruction || 'Дұрыс ретімен орналастыр';

        // Answer area header
        const answerHeader = document.createElement('div');
        Object.assign(answerHeader.style, {
            width: '100%', fontWeight: '900',
            fontSize: 'clamp(0.75rem,2.2vw,0.9rem)', color: '#94a3b8',
            textTransform: 'uppercase', letterSpacing: '0.5px'
        });
        answerHeader.textContent = '✅ Жауабым (ретімен орналастыр):';

        // Answer area
        const answerArea = document.createElement('div');
        Object.assign(answerArea.style, {
            width: '100%', minHeight: 'clamp(60px,15vw,90px)',
            background: 'rgba(255,255,255,0.6)', borderRadius: '16px',
            border: '2px dashed #cbd5e1', display: 'flex',
            flexDirection: 'column', gap: '6px',
            padding: '10px', boxSizing: 'border-box', transition: 'all 0.2s'
        });
        const answerHint = document.createElement('div');
        answerHint.style.color = '#cbd5e1'; answerHint.style.fontSize = 'clamp(0.75rem,2.5vw,0.9rem)';
        answerHint.style.fontWeight = '700'; answerHint.style.textAlign = 'center';
        answerHint.textContent = '👆 Төмендегі карточкаларды тиіп осында орналастыр';
        answerArea.appendChild(answerHint);
        this.answerArea = answerArea;

        // Cards tray
        const trayHeader = document.createElement('div');
        Object.assign(trayHeader.style, {
            width: '100%', fontWeight: '900',
            fontSize: 'clamp(0.75rem,2.2vw,0.9rem)', color: '#94a3b8',
            textTransform: 'uppercase', letterSpacing: '0.5px'
        });
        trayHeader.textContent = '📋 Карточкалар (рет шатастырылған):';

        const tray = document.createElement('div');
        Object.assign(tray.style, {
            display: 'flex', flexDirection: 'column', gap: '8px', width: '100%'
        });
        this.tray = tray;

        shuffled.forEach(step => {
            const card = this.createCard(step);
            tray.appendChild(card);
        });

        // Check button
        const checkBtn = document.createElement('button');
        Object.assign(checkBtn.style, {
            width: '100%', padding: 'clamp(12px,3.5vw,18px)',
            background: 'linear-gradient(135deg,#f59e0b,#d97706)',
            border: 'none', borderRadius: '14px',
            fontSize: 'clamp(0.95rem,3vw,1.15rem)', fontWeight: '900',
            color: 'white', cursor: 'pointer', touchAction: 'manipulation',
            fontFamily: 'inherit', boxShadow: '0 5px 16px rgba(245,158,11,0.35)',
            transition: 'transform 0.15s'
        });
        checkBtn.textContent = 'Тексеру ✓';
        checkBtn.addEventListener('pointerdown', () => checkBtn.style.transform = 'scale(0.97)');
        checkBtn.addEventListener('pointerup', () => {
            checkBtn.style.transform = '';
            // Compare selectedOrder to correctOrder
            if (this.selectedOrder.length !== correctOrder.length) {
                this.onFail(); return;
            }
            const isCorrect = this.selectedOrder.every((id, i) => String(id) === String(correctOrder[i]));
            if (isCorrect) setTimeout(() => this.onSuccess(), 300);
            else this.onFail();
        });

        this.container.appendChild(inst);
        this.container.appendChild(answerHeader);
        this.container.appendChild(answerArea);
        this.container.appendChild(trayHeader);
        this.container.appendChild(tray);
        this.container.appendChild(checkBtn);
    }

    createCard(step) {
        const card = document.createElement('div');
        card.dataset.id = step.id;
        card.dataset.inAnswer = '0';
        Object.assign(card.style, {
            background: 'white', borderRadius: '14px',
            border: '2px solid #e5e7eb', padding: 'clamp(10px,2.5vw,14px)',
            display: 'flex', alignItems: 'center', gap: '12px',
            cursor: 'pointer', touchAction: 'manipulation',
            boxShadow: '0 3px 10px rgba(0,0,0,0.06)',
            transition: 'all 0.15s', userSelect: 'none'
        });

        const emoji = document.createElement('span');
        emoji.style.fontSize = 'clamp(1.8rem,5vw,2.8rem)';
        emoji.style.flexShrink = '0';
        emoji.textContent = step.icon;

        card.appendChild(emoji);

        if (step.text) {
            const text = document.createElement('span');
            text.style.fontSize = 'clamp(0.85rem,3vw,1.05rem)';
            text.style.fontWeight = '700';
            text.style.color = '#1e293b';
            text.style.lineHeight = '1.3';
            text.textContent = step.text;
            card.appendChild(text);
        }

        card.addEventListener('pointerdown', () => card.style.transform = 'scale(0.97)');
        card.addEventListener('pointerup', () => {
            card.style.transform = '';
            if (card.dataset.inAnswer === '0') {
                // Move to answer area
                card.dataset.inAnswer = '1';
                card.style.borderColor = '#f59e0b';
                card.style.background = '#fffbeb';
                // Remove hint if present
                const hint = this.answerArea.querySelector('div');
                if (hint && hint.textContent.includes('👆')) hint.remove();
                this.answerArea.appendChild(card);
                this.selectedOrder.push(step.id);
            } else {
                // Move back to tray
                card.dataset.inAnswer = '0';
                card.style.borderColor = '#e5e7eb';
                card.style.background = 'white';
                this.tray.appendChild(card);
                this.selectedOrder = this.selectedOrder.filter(id => String(id) !== String(step.id));
            }
        });

        return card;
    }
}
