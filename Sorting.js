class SortingTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content;
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.itemCount = content.items.length;
        this.placedCount = 0;
        this.dragClone = null;
        this.activeDragEl = null;
        this.lastTarget = null;
        this.render();
    }

    render() {
        this.container.innerHTML = '';
        Object.assign(this.container.style, {
            width: '100%', height: '100%', display: 'flex',
            flexDirection: 'column', alignItems: 'center',
            justifyContent: 'flex-start', gap: '16px',
            padding: '12px', boxSizing: 'border-box', overflowY: 'auto'
        });

        // Drop zones
        const zonesWrap = document.createElement('div');
        Object.assign(zonesWrap.style, {
            display: 'flex', flexDirection: 'column',
            gap: '12px', width: '100%'
        });

        this.content.zones.forEach(zone => {
            const z = document.createElement('div');
            z.className = 'drop-zone';
            z.dataset.id = zone.id;
            z.dataset.accept = JSON.stringify(zone.accept);
            Object.assign(z.style, {
                background: 'white', borderRadius: '18px',
                border: '2px dashed #cbd5e1',
                display: 'flex', alignItems: 'center',
                gap: '14px', padding: '14px 20px',
                minHeight: '70px', width: '100%',
                boxSizing: 'border-box', boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
                transition: 'all 0.2s', flexWrap: 'wrap'
            });
            const ico = document.createElement('span');
            ico.style.fontSize = 'clamp(2rem,6vw,3rem)';
            ico.textContent = zone.icon;
            const lbl = document.createElement('span');
            lbl.style.fontSize = 'clamp(0.9rem,3vw,1.2rem)';
            lbl.style.fontWeight = '800';
            lbl.style.color = '#4b5563';
            lbl.textContent = zone.label;
            z.appendChild(ico);
            z.appendChild(lbl);
            this.enableDrop(z);
            zonesWrap.appendChild(z);
        });

        // Items tray
        const tray = document.createElement('div');
        tray.style.display = 'flex';
        tray.style.flexWrap = 'wrap';
        tray.style.gap = 'clamp(8px,2vw,16px)';
        tray.style.justifyContent = 'center';
        tray.style.width = '100%';
        tray.style.padding = '14px';
        tray.style.background = 'rgba(255,255,255,0.6)';
        tray.style.borderRadius = '20px';
        tray.style.boxSizing = 'border-box';

        this.content.items.forEach(item => {
            const el = document.createElement('div');
            el.dataset.type = item.type;
            Object.assign(el.style, {
                background: 'white', borderRadius: '16px',
                boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 'clamp(60px,15vw,85px)', height: 'clamp(60px,15vw,85px)',
                fontSize: 'clamp(2rem,6vw,3.2rem)', cursor: 'grab',
                touchAction: 'none', userSelect: 'none',
                transition: 'opacity 0.2s', flexShrink: '0'
            });
            el.textContent = item.content;
            this.enableDrag(el);
            tray.appendChild(el);
        });

        this.container.appendChild(zonesWrap);
        this.container.appendChild(tray);
    }

    enableDrag(el) {
        // Pointer Events (works for both touch and mouse)
        el.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            this.activeDragEl = el;
            el.setPointerCapture(e.pointerId);
            el.style.opacity = '0.35';

            this.dragClone = el.cloneNode(true);
            Object.assign(this.dragClone.style, {
                position: 'fixed', pointerEvents: 'none',
                zIndex: '9999', opacity: '0.9',
                width: '80px', height: '80px',
                fontSize: '2.8rem', borderRadius: '14px',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', background: 'white',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                transform: 'scale(1.12)',
                left: (e.clientX - 40) + 'px',
                top: (e.clientY - 40) + 'px'
            });
            document.body.appendChild(this.dragClone);
        });

        el.addEventListener('pointermove', (e) => {
            if (!this.activeDragEl || !this.dragClone) return;
            e.preventDefault();
            this.dragClone.style.left = (e.clientX - 40) + 'px';
            this.dragClone.style.top = (e.clientY - 40) + 'px';
            this.lastTarget = document.elementFromPoint(e.clientX, e.clientY);
            document.querySelectorAll('.drop-zone').forEach(z => {
                const r = z.getBoundingClientRect();
                const over = e.clientX >= r.left && e.clientX <= r.right &&
                    e.clientY >= r.top && e.clientY <= r.bottom;
                z.style.borderColor = over ? '#f59e0b' : '#cbd5e1';
                z.style.background = over ? '#fef3c7' : 'white';
                z.style.transform = over ? 'scale(1.02)' : 'scale(1)';
            });
        });

        el.addEventListener('pointerup', (e) => {
            if (!this.activeDragEl) return;
            if (this.dragClone) { this.dragClone.remove(); this.dragClone = null; }
            el.style.opacity = '1';

            const zone = this.lastTarget ? this.lastTarget.closest('.drop-zone') : null;
            document.querySelectorAll('.drop-zone').forEach(z => {
                z.style.borderColor = '#cbd5e1';
                z.style.background = 'white';
                z.style.transform = 'scale(1)';
            });

            if (zone) {
                const accepted = JSON.parse(zone.dataset.accept);
                if (accepted.includes(el.dataset.type)) {
                    const clone = document.createElement('span');
                    clone.textContent = el.textContent;
                    clone.style.fontSize = 'clamp(1.4rem,4vw,2.2rem)';
                    zone.appendChild(clone);
                    el.remove();
                    this.placedCount++;
                    if (window.SFX) SFX.playClick();
                    if (this.placedCount >= this.itemCount) setTimeout(() => this.onSuccess(), 400);
                } else {
                    if (window.SFX) SFX.playError();
                    this.onFail();
                }
            }
            this.activeDragEl = null;
            this.lastTarget = null;
        });
    }

    enableDrop(zone) {
        zone.addEventListener('dragover', e => e.preventDefault());
        zone.addEventListener('drop', e => {
            e.preventDefault();
            const type = e.dataTransfer.getData('text/plain');
            const accepted = JSON.parse(zone.dataset.accept);
            if (accepted.includes(type)) {
                const drag = window.draggedElement;
                if (drag) {
                    const clone = document.createElement('span');
                    clone.textContent = drag.textContent;
                    clone.style.fontSize = '2rem';
                    zone.appendChild(clone);
                    drag.remove();
                    this.placedCount++;
                    if (window.SFX) SFX.playClick();
                    if (this.placedCount >= this.itemCount) setTimeout(() => this.onSuccess(), 400);
                }
            } else {
                if (window.SFX) SFX.playError();
                this.onFail();
            }
        });
    }
}
