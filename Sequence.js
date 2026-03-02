class SequenceTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content;
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.dragClone = null;
        this.activeDragEl = null;
        this.lastTarget = null;
        this.placedCount = 0;
        this.render();
    }

    render() {
        this.container.innerHTML = '';
        Object.assign(this.container.style, {
            width: '100%', height: '100%', display: 'flex',
            flexDirection: 'column', alignItems: 'center',
            gap: 'clamp(14px,3vw,28px)', padding: '14px',
            boxSizing: 'border-box', overflowY: 'auto', justifyContent: 'flex-start'
        });

        // Target sequence row (slots)
        const slotRow = document.createElement('div');
        slotRow.className = 'seq-slots';
        Object.assign(slotRow.style, {
            display: 'flex', flexWrap: 'wrap', gap: 'clamp(6px,2vw,14px)',
            justifyContent: 'center', width: '100%',
            background: 'rgba(255,255,255,0.6)', borderRadius: '20px',
            padding: 'clamp(12px,3vw,20px)', boxSizing: 'border-box'
        });

        const seq = this.content.sequence;
        this.slots = seq.map((item, i) => {
            const slot = document.createElement('div');
            slot.className = 'seq-slot';
            slot.dataset.index = i;
            slot.dataset.correct = item.id || item.content;
            Object.assign(slot.style, {
                width: 'clamp(60px,16vw,85px)', height: 'clamp(60px,16vw,85px)',
                background: '#f8fafc', border: '2px dashed #cbd5e1',
                borderRadius: '16px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 'clamp(1.6rem,5vw,3rem)',
                transition: 'all 0.2s'
            });
            if (item.visible) {
                slot.textContent = item.content;
                slot.style.background = 'white';
                slot.style.border = '2px solid #e5e7eb';
            }
            this.enableSlotDrop(slot, item.visible);
            slotRow.appendChild(slot);
            return slot;
        });

        // Options (draggable)
        const options = [...this.content.options];
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }

        const optRow = document.createElement('div');
        Object.assign(optRow.style, {
            display: 'flex', flexWrap: 'wrap', gap: 'clamp(8px,2vw,16px)',
            justifyContent: 'center', width: '100%',
            background: 'rgba(255,255,255,0.5)', borderRadius: '20px',
            padding: 'clamp(10px,3vw,18px)', boxSizing: 'border-box'
        });

        options.forEach(opt => {
            const el = document.createElement('div');
            el.dataset.id = opt.id || opt.content;
            el.textContent = opt.content;
            Object.assign(el.style, {
                width: 'clamp(58px,15vw,80px)', height: 'clamp(58px,15vw,80px)',
                background: 'white', borderRadius: '14px',
                border: '2px solid #e5e7eb', cursor: 'grab',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'clamp(1.5rem,5vw,2.8rem)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                touchAction: 'none', userSelect: 'none', flexShrink: '0'
            });
            this.enableOptionDrag(el);
            optRow.appendChild(el);
        });

        this.container.appendChild(slotRow);
        this.container.appendChild(optRow);
    }

    enableOptionDrag(el) {
        el.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            this.activeDragEl = el;
            el.setPointerCapture(e.pointerId);
            el.style.opacity = '0.3';

            this.dragClone = el.cloneNode(true);
            Object.assign(this.dragClone.style, {
                position: 'fixed', pointerEvents: 'none',
                zIndex: '9999', opacity: '0.95',
                width: '75px', height: '75px', borderRadius: '14px',
                fontSize: '2.5rem', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                background: 'white', boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                transform: 'scale(1.1)',
                left: (e.clientX - 37) + 'px', top: (e.clientY - 37) + 'px'
            });
            document.body.appendChild(this.dragClone);
        });

        el.addEventListener('pointermove', (e) => {
            if (!this.dragClone) return;
            this.dragClone.style.left = (e.clientX - 37) + 'px';
            this.dragClone.style.top = (e.clientY - 37) + 'px';
            this.lastTarget = document.elementFromPoint(e.clientX, e.clientY);
            document.querySelectorAll('.seq-slot').forEach(s => {
                if (s.dataset.filled) return;
                const r = s.getBoundingClientRect();
                const over = e.clientX >= r.left && e.clientX <= r.right &&
                    e.clientY >= r.top && e.clientY <= r.bottom;
                s.style.borderColor = over ? '#f59e0b' : '#cbd5e1';
                s.style.background = over ? '#fef3c7' : '#f8fafc';
            });
        });

        el.addEventListener('pointerup', (e) => {
            if (!this.activeDragEl) return;
            if (this.dragClone) { this.dragClone.remove(); this.dragClone = null; }
            el.style.opacity = '1';

            const slot = this.lastTarget ? this.lastTarget.closest('.seq-slot') : null;
            document.querySelectorAll('.seq-slot').forEach(s => {
                s.style.borderColor = '#cbd5e1';
                s.style.background = '#f8fafc';
            });

            if (slot && !slot.dataset.filled) {
                if (slot.dataset.correct === el.dataset.id) {
                    slot.textContent = el.textContent;
                    slot.style.background = '#d1fae5';
                    slot.style.border = '2px solid #10b981';
                    slot.dataset.filled = '1';
                    el.remove();
                    this.placedCount++;
                    const total = this.slots.filter(s => !s.dataset.visible).length;
                    if (window.SFX) SFX.playClick();
                    if (this.placedCount >= this.content.options.length) setTimeout(() => this.onSuccess(), 400);
                } else {
                    slot.style.borderColor = '#ef4444';
                    slot.style.background = '#fee2e2';
                    setTimeout(() => {
                        slot.style.borderColor = '#cbd5e1';
                        slot.style.background = '#f8fafc';
                    }, 600);
                    if (window.SFX) SFX.playError();
                    this.onFail();
                }
            }
            this.activeDragEl = null;
            this.lastTarget = null;
        });
    }

    enableSlotDrop(slot, isVisible) {
        if (isVisible) return; // visible slots are pre-filled, skip
    }
}
