class ShapeConstructorTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content;
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.placed = 0;
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

        const blueprint = this.content.blueprint || {};
        const parts = this.content.parts || [];
        const totalSlots = (blueprint.slots || []).length;

        // ── Blueprint area ────────────────────────────────────────────
        const bpCard = document.createElement('div');
        Object.assign(bpCard.style, {
            background: 'white', borderRadius: '20px',
            padding: 'clamp(12px,3vw,20px)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.07)',
            width: '100%', boxSizing: 'border-box',
            display: 'flex', justifyContent: 'center'
        });

        const bpTitle = document.createElement('div');
        bpTitle.style.fontWeight = '700';
        bpTitle.style.fontSize = 'clamp(0.8rem,2.5vw,1rem)';
        bpTitle.style.color = '#64748b';
        bpTitle.style.marginBottom = '10px';
        bpTitle.textContent = 'Үйді фигуралардан сала отырыз!';

        const canvas = document.createElement('div');
        Object.assign(canvas.style, {
            position: 'relative',
            width: 'min(220px, 100%)', height: 'min(260px, 60vw)',
            background: '#f8fafc', borderRadius: '16px',
            border: '2px dashed #e5e7eb'
        });
        this.canvas = canvas;
        this.slots = {};

        // Place slots visually
        (blueprint.slots || []).forEach(slot => {
            const slotEl = document.createElement('div');
            const sz = parseInt(slot.size) || 60;
            const mobileScale = 0.7;
            Object.assign(slotEl.style, {
                position: 'absolute',
                left: `calc(${slot.x} * ${mobileScale})`,
                top: `calc(${slot.y} * ${mobileScale})`,
                width: `${Math.round(sz * mobileScale)}px`,
                height: `${Math.round(sz * mobileScale)}px`,
                border: '2.5px dashed #94a3b8',
                borderRadius: slot.shape === 'circle' ? '50%' :
                    slot.shape === 'triangle' ? '0' : '4px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(148,163,184,0.05)', transition: 'background 0.3s'
            });
            if (slot.shape === 'triangle') {
                slotEl.style.border = 'none';
                slotEl.style.width = '0'; slotEl.style.height = '0';
                const tsz = Math.round(sz * mobileScale);
                slotEl.style.borderLeft = `${tsz / 2}px solid transparent`;
                slotEl.style.borderRight = `${tsz / 2}px solid transparent`;
                slotEl.style.borderBottom = `${tsz}px dashed #94a3b8`;
                slotEl.style.background = 'none';
            }
            slotEl.dataset.slotId = slot.id;
            slotEl.dataset.shape = slot.shape;
            canvas.appendChild(slotEl);
            this.slots[slot.id] = slotEl;
        });

        bpCard.appendChild(canvas);

        const bpOuter = document.createElement('div');
        bpOuter.appendChild(bpTitle);
        bpOuter.appendChild(bpCard);

        // ── Parts tray ────────────────────────────────────────────────
        const trayLabel = document.createElement('div');
        trayLabel.style.fontWeight = '700';
        trayLabel.style.fontSize = 'clamp(0.8rem,2.5vw,1rem)';
        trayLabel.style.color = '#64748b';
        trayLabel.textContent = 'Фигуралар — дұрыс орынға қой:';

        const tray = document.createElement('div');
        Object.assign(tray.style, {
            display: 'flex', flexWrap: 'wrap', gap: 'clamp(10px,3vw,18px)',
            justifyContent: 'center', width: '100%',
            background: 'rgba(255,255,255,0.6)', borderRadius: '16px',
            padding: 'clamp(12px,3vw,18px)', boxSizing: 'border-box'
        });

        let selectedPart = null;

        parts.forEach(part => {
            const btn = document.createElement('div');
            btn.dataset.shape = part.shape;
            btn.dataset.id = part.id;
            btn.style.cursor = 'pointer';
            btn.style.touchAction = 'manipulation';
            btn.style.transition = 'transform 0.15s, box-shadow 0.15s';
            btn.style.userSelect = 'none';

            const sz = 50;
            if (part.shape === 'circle') {
                Object.assign(btn.style, {
                    width: `${sz}px`, height: `${sz}px`, borderRadius: '50%',
                    background: part.color || '#6366f1',
                    border: '3px solid rgba(0,0,0,0.15)'
                });
            } else if (part.shape === 'triangle') {
                btn.style.width = '0'; btn.style.height = '0';
                btn.style.borderLeft = `${sz / 2}px solid transparent`;
                btn.style.borderRight = `${sz / 2}px solid transparent`;
                btn.style.borderBottom = `${sz}px solid ${part.color || '#ef4444'}`;
                btn.style.border = 'none';
                btn.style.borderLeft = `${sz / 2}px solid transparent`;
                btn.style.borderRight = `${sz / 2}px solid transparent`;
                btn.style.borderBottom = `${sz}px solid ${part.color || '#ef4444'}`;
            } else {
                Object.assign(btn.style, {
                    width: `${sz}px`, height: `${sz}px`, borderRadius: '8px',
                    background: part.color || '#f59e0b',
                    border: '3px solid rgba(0,0,0,0.15)'
                });
            }

            btn.addEventListener('pointerdown', () => {
                // Deselect previous
                if (selectedPart) {
                    selectedPart.style.transform = '';
                    selectedPart.style.boxShadow = '';
                }
                selectedPart = btn;
                btn.style.transform = 'scale(1.18)';
                btn.style.boxShadow = '0 0 0 4px #f59e0b88';
            });
            tray.appendChild(btn);
        });

        // Clicking a slot places the selected part
        canvas.addEventListener('pointerup', e => {
            if (!selectedPart) return;
            const x = e.offsetX;
            const y = e.offsetY;

            // Find closest matching slot
            let closest = null;
            let closestDist = Infinity;
            (blueprint.slots || []).forEach(slot => {
                const sz = parseInt(slot.size) || 60;
                const scale = 0.7;
                const sx = parseFloat(slot.x) * scale + (sz * scale) / 2;
                const sy = parseFloat(slot.y) * scale + (sz * scale) / 2;
                const dist = Math.hypot(x - sx, y - sy);
                if (dist < closestDist) {
                    closestDist = dist; closest = slot;
                }
            });

            if (closest && closestDist < 80) {
                const partShape = selectedPart.dataset.shape;
                const slotEl = this.slots[closest.id];
                if (partShape === closest.shape && !slotEl.dataset.filled) {
                    // Match!
                    slotEl.dataset.filled = '1';
                    slotEl.style.background = selectedPart.style.background ||
                        (selectedPart.style.borderBottomColor
                            ? selectedPart.style.borderBottomColor + '88' : '#6366f199');
                    slotEl.style.borderStyle = 'solid'; slotEl.style.borderColor = '#10b981';
                    selectedPart.style.opacity = '0.35';
                    selectedPart.style.pointerEvents = 'none';
                    selectedPart.style.transform = '';
                    selectedPart.style.boxShadow = '';
                    selectedPart = null;
                    this.placed++;
                    if (this.placed >= totalSlots) setTimeout(() => this.onSuccess(), 400);
                } else if (partShape !== closest.shape) {
                    this.onFail();
                    selectedPart.style.transform = '';
                    selectedPart.style.boxShadow = '';
                    selectedPart = null;
                }
            }
        });

        this.container.appendChild(bpOuter);
        this.container.appendChild(trayLabel);
        this.container.appendChild(tray);
    }
}
