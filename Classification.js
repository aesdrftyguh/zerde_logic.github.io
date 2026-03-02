class ClassificationTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content;
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.mistakes = 0;
        this.placed = 0;
        this.render();
    }

    render() {
        this.container.innerHTML = '';
        Object.assign(this.container.style, {
            width: '100%', height: '100%', display: 'flex',
            flexDirection: 'column', alignItems: 'center',
            justifyContent: 'flex-start', gap: 'clamp(10px,2.5vw,16px)',
            padding: '12px', boxSizing: 'border-box', overflowY: 'auto'
        });

        const rawCats = this.content.categories || [];
        // Support multiple category formats:
        // A: {id, label, color}  ← standard
        // B: {name, accepts:[...]}  ← logic_classification format
        // C: {id, title, items:[...]}  ← attn format
        const normalizedCats = rawCats.map((cat, i) => {
            const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
            // id
            const id = cat.id || cat.name || cat.title || `cat${i}`;
            // label
            const label = cat.label || cat.name || cat.title || `Топ ${i + 1}`;
            // color
            const color = cat.color || colors[i % colors.length];
            // items embedded in category (attn format)
            const embeddedItems = cat.items ? cat.items.map(it => ({
                id: Math.random().toString(36).slice(2),
                content: it,
                category: id
            })) : [];
            return { id, label, color, embeddedItems };
        });

        // Items: from content.items or embedded in categories
        let items = this.content.items || [];
        if (items.length === 0) {
            normalizedCats.forEach(cat => {
                cat.embeddedItems.forEach(it => items.push(it));
            });
        }
        // Normalize items
        const normalizedItems = items.map((item, i) => ({
            id: item.id || `item${i}`,
            content: typeof item === 'string' ? item : (item.content || item.emoji || String(item)),
            category: item.category || (item.isOdd === false ? normalizedCats[0]?.id : normalizedCats[1]?.id)
        }));

        // Shuffle items for display
        const shuffled = [...normalizedItems].sort(() => Math.random() - 0.5);

        // ── Bucket containers ─────────────────────────────────────────
        const bucketsRow = document.createElement('div');
        Object.assign(bucketsRow.style, {
            display: 'flex', gap: 'clamp(8px,2vw,14px)',
            width: '100%', flexWrap: 'wrap'
        });

        const bucketEls = {};
        normalizedCats.forEach(cat => {
            const bucket = document.createElement('div');
            bucket.dataset.catId = cat.id;
            const borderColor = cat.color;
            // Lighten bg: hex → rgba(color, 0.08)
            const r = parseInt(cat.color.slice(1, 3), 16);
            const g = parseInt(cat.color.slice(3, 5), 16);
            const b = parseInt(cat.color.slice(5, 7), 16);

            Object.assign(bucket.style, {
                flex: '1', minWidth: 'clamp(100px,30vw,180px)',
                minHeight: 'clamp(80px,20vw,120px)', borderRadius: '16px',
                border: `2.5px dashed ${borderColor}`,
                background: `rgba(${r},${g},${b},0.07)`,
                padding: '8px', boxSizing: 'border-box',
                display: 'flex', flexDirection: 'column', gap: '6px',
                transition: 'background 0.2s', overflowY: 'auto'
            });

            const catLabel = document.createElement('div');
            catLabel.style.fontWeight = '900';
            catLabel.style.fontSize = 'clamp(0.7rem,2.5vw,0.95rem)';
            catLabel.style.color = cat.color;
            catLabel.style.textAlign = 'center';
            catLabel.style.padding = '4px';
            catLabel.style.flexShrink = '0';
            catLabel.textContent = cat.label;

            const itemsArea = document.createElement('div');
            Object.assign(itemsArea.style, {
                display: 'flex', flexWrap: 'wrap', gap: '6px',
                justifyContent: 'center', minHeight: '40px', flex: '1'
            });

            bucket.appendChild(catLabel);
            bucket.appendChild(itemsArea);
            bucket.dataset.itemsArea = '1';
            bucketEls[cat.id] = { bucket, itemsArea, color: cat.color, borderColor };
            bucketsRow.appendChild(bucket);
        });

        // ── Items tray ────────────────────────────────────────────────
        const tray = document.createElement('div');
        Object.assign(tray.style, {
            display: 'flex', flexWrap: 'wrap', gap: 'clamp(8px,2vw,12px)',
            justifyContent: 'center', width: '100%',
            background: 'rgba(255,255,255,0.6)', borderRadius: '16px',
            padding: '12px', boxSizing: 'border-box',
            boxShadow: '0 3px 10px rgba(0,0,0,0.06)'
        });

        let clickedItem = null;

        const makeItemEl = (item) => {
            const el = document.createElement('div');
            el.textContent = item.content;
            el.dataset.category = String(item.category);
            el.dataset.id = item.id;
            Object.assign(el.style, {
                width: 'clamp(44px,12vw,65px)', height: 'clamp(44px,12vw,65px)',
                background: 'white', borderRadius: '12px',
                border: '2px solid #e5e7eb', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 'clamp(1.4rem,4.5vw,2.4rem)',
                cursor: 'pointer', touchAction: 'manipulation',
                userSelect: 'none', transition: 'all 0.15s', flexShrink: '0',
                boxShadow: '0 3px 8px rgba(0,0,0,0.07)'
            });
            el.addEventListener('pointerdown', () => {
                el.style.transform = 'scale(0.9)';
                el.style.borderColor = '#f59e0b';
                el.style.background = '#fffbeb';
                clickedItem = el;
            });
            el.addEventListener('pointerup', () => {
                el.style.transform = '';
            });
            return el;
        };

        shuffled.forEach(item => {
            const el = makeItemEl(item);
            tray.appendChild(el);
        });

        // Bucket tap logic — match clicked item to bucket
        normalizedCats.forEach(cat => {
            const { bucket, itemsArea, color } = bucketEls[cat.id];

            const hitArea = document.createElement('div');
            Object.assign(hitArea.style, {
                position: 'absolute', inset: '0', zIndex: '2'
            });
            bucket.style.position = 'relative';
            bucket.appendChild(hitArea);

            bucket.addEventListener('pointerup', (e) => {
                if (!clickedItem) return;
                const itemCat = String(clickedItem.dataset.category);
                // normalize for comparison
                const correctCatId = String(cat.id);
                // check match by id or by label name
                const correctCatObj = normalizedCats.find(c =>
                    String(c.id) === itemCat ||
                    String(c.label) === itemCat ||
                    String(c.label).includes(itemCat) ||
                    itemCat.includes(String(c.id))
                );
                const isCorrect = correctCatObj && correctCatObj.id === cat.id;

                if (isCorrect) {
                    // Move to bucket
                    const cloned = clickedItem.cloneNode(true);
                    Object.assign(cloned.style, {
                        background: `rgba(${parseInt(color.slice(1, 3), 16)},${parseInt(color.slice(3, 5), 16)},${parseInt(color.slice(5, 7), 16)},0.1)`,
                        borderColor: color, cursor: 'default', pointerEvents: 'none'
                    });
                    itemsArea.appendChild(cloned);
                    clickedItem.style.opacity = '0.3';
                    clickedItem.style.pointerEvents = 'none';
                    clickedItem = null;
                    this.placed++;
                    if (this.placed >= normalizedItems.length) {
                        setTimeout(() => this.onSuccess(), 400);
                    }
                } else {
                    // Wrong bucket
                    if (clickedItem) {
                        clickedItem.style.background = '#fee2e2';
                        clickedItem.style.borderColor = '#ef4444';
                        setTimeout(() => {
                            if (clickedItem) {
                                clickedItem.style.background = 'white';
                                clickedItem.style.borderColor = '#e5e7eb';
                            }
                        }, 600);
                    }
                    clickedItem = null;
                    this.mistakes++;
                    this.onFail();
                }
            });
        });

        this.container.appendChild(bucketsRow);
        this.container.appendChild(tray);
    }
}
