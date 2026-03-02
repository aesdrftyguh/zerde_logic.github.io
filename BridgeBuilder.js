class BridgeBuilderTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content;
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.placed = 0;
        this.totalWidth = 0;
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

        // Support:
        // A: {instruction, pieces:[{id,icon}], slotCount, correctPieces}  (our format)
        // B: {width:15, blocks:[5,3,7,...]}  (data.js format)
        const isFormatB = this.content.blocks !== undefined;
        const target = this.content.width || this.content.target || 10;
        const blocks = this.content.blocks || [];

        const inst = document.createElement('div');
        inst.style.fontSize = 'clamp(0.9rem,3vw,1.1rem)';
        inst.style.fontWeight = '700'; inst.style.color = '#475569';
        inst.style.textAlign = 'center';
        inst.textContent = isFormatB
            ? `Ұзындығы дәл ${target} болатын көпір сал!`
            : (this.content.instruction || 'Көпір сал!');

        // Bridge target display
        const targetRow = document.createElement('div');
        Object.assign(targetRow.style, {
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'white', borderRadius: '16px',
            padding: 'clamp(12px,3vw,18px)', boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
            boxSizing: 'border-box', width: '100%', justifyContent: 'center'
        });

        const tLabel = document.createElement('span');
        tLabel.style.fontSize = 'clamp(0.85rem,2.5vw,1rem)';
        tLabel.style.fontWeight = '700'; tLabel.style.color = '#64748b';
        tLabel.textContent = `Мақсат: ${target} бірлік`;

        const progressBar = document.createElement('div');
        Object.assign(progressBar.style, {
            flex: '1', height: '20px', background: '#f1f5f9',
            borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0'
        });
        const progressFill = document.createElement('div');
        Object.assign(progressFill.style, {
            height: '100%', width: '0%', borderRadius: '10px',
            background: 'linear-gradient(90deg,#10b981,#059669)',
            transition: 'width 0.3s ease'
        });
        progressBar.appendChild(progressFill);
        this.progressFill = progressFill;

        const sumLabel = document.createElement('span');
        sumLabel.style.fontSize = 'clamp(0.85rem,2.5vw,1rem)';
        sumLabel.style.fontWeight = '900'; sumLabel.style.color = '#1e293b';
        sumLabel.style.minWidth = '40px'; sumLabel.style.textAlign = 'right';
        sumLabel.textContent = '0';
        this.sumLabel = sumLabel;

        targetRow.appendChild(tLabel);
        targetRow.appendChild(progressBar);
        targetRow.appendChild(sumLabel);

        // Scene
        const scene = document.createElement('div');
        Object.assign(scene.style, {
            width: '100%', background: 'linear-gradient(180deg,#bfdbfe 50%,#86efac 50%)',
            borderRadius: '18px', padding: 'clamp(14px,4vw,22px)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
            minHeight: 'clamp(80px,20vw,110px)', boxSizing: 'border-box', overflow: 'hidden'
        });

        const leftBank = document.createElement('div');
        leftBank.style.fontSize = 'clamp(1.6rem,5vw,2.5rem)';
        leftBank.textContent = this.content.leftEmoji || '🌳';
        const rightBank = document.createElement('div');
        rightBank.style.fontSize = 'clamp(1.6rem,5vw,2.5rem)';
        rightBank.textContent = this.content.rightEmoji || '🏠';

        const bridgeArea = document.createElement('div');
        Object.assign(bridgeArea.style, {
            flex: '1', margin: '0 8px', display: 'flex',
            alignItems: 'flex-end', justifyContent: 'center',
            gap: '2px', minHeight: '40px', flexWrap: 'wrap'
        });
        this.bridgeArea = bridgeArea;

        scene.appendChild(leftBank);
        scene.appendChild(bridgeArea);
        scene.appendChild(rightBank);

        // Block buttons
        const blocksRow = document.createElement('div');
        Object.assign(blocksRow.style, {
            display: 'flex', flexWrap: 'wrap', gap: 'clamp(6px,2vw,12px)',
            justifyContent: 'center', width: '100%',
            background: 'rgba(255,255,255,0.6)', borderRadius: '14px',
            padding: '12px', boxSizing: 'border-box'
        });

        const blockEmojis = ['🪵', '🧱', '🪨', '🪜', '📦'];
        blocks.forEach((size, i) => {
            const btn = document.createElement('button');
            const emoji = blockEmojis[i % blockEmojis.length];
            btn.innerHTML = `${emoji}<br><small style="font-size:0.7em;font-weight:900;color:#374151">+${size}</small>`;
            Object.assign(btn.style, {
                background: 'white', border: '2px solid #e5e7eb',
                borderRadius: '12px', padding: '8px 12px',
                fontSize: 'clamp(1.2rem,3.5vw,1.8rem)',
                cursor: 'pointer', touchAction: 'manipulation',
                fontFamily: 'inherit', transition: 'all 0.15s', lineHeight: '1.2'
            });
            btn.addEventListener('pointerdown', () => btn.style.transform = 'scale(0.94)');
            btn.addEventListener('pointerup', () => {
                btn.style.transform = '';
                if (btn.disabled) return;
                btn.disabled = true;
                btn.style.opacity = '0.5';
                this.totalWidth += size;
                // Add block to bridge
                const block = document.createElement('div');
                Object.assign(block.style, {
                    height: `${Math.max(16, size * 4)}px`,
                    width: `${Math.max(20, size * 6)}px`,
                    background: '#92400e', borderRadius: '4px 4px 0 0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', color: '#fef3c7', fontWeight: '700'
                });
                block.textContent = size;
                this.bridgeArea.appendChild(block);
                // Update progress
                const pct = Math.min(100, (this.totalWidth / target) * 100);
                this.progressFill.style.width = `${pct}%`;
                this.progressFill.style.background = this.totalWidth > target
                    ? 'linear-gradient(90deg,#ef4444,#dc2626)'
                    : 'linear-gradient(90deg,#10b981,#059669)';
                this.sumLabel.textContent = this.totalWidth;
                this.sumLabel.style.color = this.totalWidth > target ? '#ef4444' :
                    this.totalWidth === target ? '#10b981' : '#1e293b';
            });
            blocksRow.appendChild(btn);
        });

        // Check button
        const checkBtn = document.createElement('button');
        Object.assign(checkBtn.style, {
            width: '100%', padding: 'clamp(12px,3.5vw,18px)',
            background: 'linear-gradient(135deg,#f59e0b,#d97706)',
            border: 'none', borderRadius: '14px',
            fontSize: 'clamp(1rem,3vw,1.2rem)', fontWeight: '900',
            color: 'white', cursor: 'pointer', touchAction: 'manipulation',
            fontFamily: 'inherit', boxShadow: '0 5px 16px rgba(245,158,11,0.35)'
        });
        checkBtn.textContent = 'Тексеру! 🌉';
        checkBtn.addEventListener('pointerup', () => {
            if (this.totalWidth === target) setTimeout(() => this.onSuccess(), 300);
            else this.onFail();
        });

        this.container.appendChild(inst);
        this.container.appendChild(targetRow);
        this.container.appendChild(scene);
        this.container.appendChild(blocksRow);
        this.container.appendChild(checkBtn);
    }
}
