/**
 * AudioManager — ZerdeLogic
 * Озвучка на казахском языке с числами, emoji-фильтрацией и
 * надёжной работой на мобильных устройствах (iOS + Android).
 */
class AudioManager {
    constructor() {
        this._ctxReady = false;
        this.ctx = null;
        this.synth = window.speechSynthesis;
        this.enabled = localStorage.getItem('sfx_enabled') !== 'false';
        this._voices = [];
        this._voiceReady = false;
        this._speakQueue = [];
        this._speaking = false;

        // Загружаем голоса (на iOS они приходят асинхронно)
        this._loadVoices();
        if (this.synth) {
            this.synth.onvoiceschanged = () => this._loadVoices();
        }

        // Инициализируем AudioContext по первому пользовательскому действию
        document.addEventListener('pointerdown', () => this._resumeCtx(), { once: true });
        document.addEventListener('touchstart', () => this._resumeCtx(), { once: true });
    }

    // ── Числа на казахском ─────────────────────────────────────────────
    static KK_ONES = [
        '', 'бір', 'екі', 'үш', 'төрт', 'бес',
        'алты', 'жеті', 'сегіз', 'тоғыз', 'он',
        'он бір', 'он екі', 'он үш', 'он төрт', 'он бес',
        'он алты', 'он жеті', 'он сегіз', 'он тоғыз'
    ];
    static KK_TENS = [
        '', 'он', 'жиырма', 'отыз', 'қырық', 'елу',
        'алпыс', 'жетпіс', 'сексен', 'тоқсан'
    ];
    static KK_SPECIAL = {
        '0': 'нөл', '100': 'жүз', '200': 'екі жүз', '300': 'үш жүз',
        '400': 'төрт жүз', '500': 'бес жүз', '1000': 'мың'
    };

    /** Конвертируем число (0–999) в казахское слово */
    _numToKK(n) {
        n = parseInt(n);
        if (isNaN(n)) return null;
        const sp = AudioManager.KK_SPECIAL[String(n)];
        if (sp) return sp;
        if (n < 20) return AudioManager.KK_ONES[n] || 'нөл';
        if (n < 100) {
            const t = AudioManager.KK_TENS[Math.floor(n / 10)];
            const o = n % 10 ? AudioManager.KK_ONES[n % 10] : '';
            return o ? `${t} ${o}` : t;
        }
        if (n < 1000) {
            const h = Math.floor(n / 100);
            const rest = n % 100;
            const hStr = h === 1 ? 'жүз' : `${AudioManager.KK_ONES[h]} жүз`;
            const rStr = rest ? ' ' + this._numToKK(rest) : '';
            return hStr + rStr;
        }
        return String(n);
    }

    // ── Казахские слова для emoji и символов ──────────────────────────
    static EMOJI_WORDS = {
        '🍎': 'алма', '🍌': 'банан', '🍇': 'жүзім', '🍒': 'шие', '🍊': 'апельсин',
        '🍋': 'лимон', '🍓': 'құлпынай', '🍑': 'шабдал', '🍏': 'жасыл алма',
        '🫐': 'көкжидек', '🍒': 'шие', '🍉': 'қарбыз', '🥝': 'киви',
        '🐶': 'ит', '🐱': 'мысық', '🐰': 'қоян', '🐸': 'бақа', '🐯': 'жолбарыс',
        '🦁': 'арыстан', '🐻': 'аю', '🐧': 'пингвин', '🦊': 'түлкі', '🐺': 'қасқыр',
        '🐘': 'піл', '🦒': 'жираф', '🐍': 'жылан', '🦜': 'тоты құс',
        '🚗': 'көлік', '✈️': 'ұшақ', '🚀': 'зымыран', '🚢': 'кеме',
        '⭐': 'жұлдыз', '🌙': 'ай', '☀️': 'күн', '🌧️': 'жаңбыр',
        '🌅': 'таң', '🌆': 'кеш', '🌿': 'жапырақ', '🌳': 'ағаш',
        '🍳': 'табақша', '🥄': 'қасық', '🍴': 'шанышқы', '🧂': 'тұз',
        '🐠': 'балық', '🦈': 'акула', '🐙': 'аэлекопод', '🦑': 'кальмар',
        '🦀': 'шаян', '🐚': 'ракушка', '🪸': 'маржан',
        '❤️': 'жүрек', '⭐': 'жұлдыз', '🏆': 'кубок', '💎': 'бриллиант',
        '🔥': 'от', '🎮': 'ойын', '📊': 'статистика',
        '?': 'сұрақ белгісі', '❓': 'сұрақ белгісі'
    };

    /**
     * Предобработка текста:
     * 1. Убираем emoji (или заменяем казахским словом)
     * 2. Числа → казахские слова
     * 3. Убираем спецсимволы
     */
    _preprocess(text) {
        if (!text) return '';

        let result = String(text);

        // Заменяем emoji на казахские слова
        for (const [emoji, word] of Object.entries(AudioManager.EMOJI_WORDS)) {
            result = result.split(emoji).join(`, ${word}, `);
        }

        // Убираем оставшиеся emoji (Unicode ranges)
        result = result.replace(
            /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE0F}\u{20E3}\u{200D}]/gu,
            ' '
        );

        // Числа → казахские слова
        result = result.replace(/\b(\d+)\b/g, (match, num) => {
            const kk = this._numToKK(parseInt(num));
            return kk || match;
        });

        // Убираем лишние символы и пробелы
        result = result.replace(/[%+\-=_|\\/<>{}[\]]/g, ' ');
        result = result.replace(/\s+/g, ' ').trim();
        result = result.replace(/,\s*,/g, ',');

        return result;
    }

    // ── Загрузка голосов ──────────────────────────────────────────────
    _loadVoices() {
        if (!this.synth) return;
        this._voices = this.synth.getVoices();

        // Приоритет: казахский → русский → любой
        this._preferredVoice = this._voices.find(v =>
            v.lang && v.lang.toLowerCase().startsWith('kk')
        ) || this._voices.find(v =>
            v.lang && v.lang.toLowerCase().startsWith('ru')
        ) || this._voices.find(v =>
            v.lang && v.lang.toLowerCase().startsWith('en')
        ) || null;

        this._voiceReady = true;
        // Flush queued speaks
        if (this._speakQueue.length) {
            const t = this._speakQueue.shift();
            if (t) this.speak(t);
        }
    }

    // ── AudioContext (звуки) ──────────────────────────────────────────
    _resumeCtx() {
        if (this._ctxReady) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this._ctxReady = true;
        } catch (e) { /* ignore */ }
    }

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('sfx_enabled', this.enabled);
        if (this.synth) this.synth.cancel();
        return this.enabled;
    }

    // ── Генератор тонов ───────────────────────────────────────────────
    playTone(freq, type, duration, vol = 0.1) {
        if (!this.enabled || !this._ctxReady || !this.ctx) return;
        try {
            if (this.ctx.state === 'suspended') this.ctx.resume();
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(vol, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) { /* ignore */ }
    }

    playHover() { this.playTone(800, 'sine', 0.1, 0.05); }
    playClick() { this.playTone(300, 'triangle', 0.15, 0.1); }

    playWin() {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, i) => setTimeout(() => this.playTone(freq, 'sine', 0.3, 0.1), i * 100));
    }

    playFail() {
        this.playTone(180, 'sawtooth', 0.35, 0.08);
        setTimeout(() => this.playTone(140, 'sawtooth', 0.4, 0.08), 280);
    }

    // ── Речевой синтез ────────────────────────────────────────────────
    speak(rawText) {
        if (!this.enabled || !this.synth) return;

        // Если голоса ещё не загружены — ставим в очередь
        if (!this._voiceReady) {
            this._speakQueue.push(rawText);
            return;
        }

        const text = this._preprocess(rawText);
        if (!text || text.length < 1) return;

        // Отменяем текущую речь
        try { this.synth.cancel(); } catch (e) { /* ok */ }

        // Небольшая задержка — важно для iOS (без неё cancel не успевает)
        setTimeout(() => {
            const utt = new SpeechSynthesisUtterance(text);

            // Язык: если есть казахский голос — казахский, иначе русский (для чисел)
            if (this._preferredVoice) {
                utt.voice = this._preferredVoice;
                // Определяем lang по голосу
                utt.lang = this._preferredVoice.lang || 'ru-RU';
            } else {
                // Фолбэк: русский — числа и слова он произносит понятно
                utt.lang = 'ru-RU';
            }

            utt.rate = 0.85;   // чуть медленнее — для детей
            utt.pitch = 1.1;   // чуть выше — дружелюбнее
            utt.volume = 1.0;

            // Workaround: iOS прерывает речь через ~15с — разбиваем на части
            const chunks = this._splitIntoChunks(text, 100);
            this._speakChunks(chunks, utt.lang, utt.rate, utt.pitch);
        }, 50);
    }

    /** Разбивает длинный текст на части по границам слов */
    _splitIntoChunks(text, maxLen) {
        if (text.length <= maxLen) return [text];
        const chunks = [];
        const sentences = text.split(/[,\.!?:]+/);
        let current = '';
        sentences.forEach(s => {
            s = s.trim();
            if (!s) return;
            if ((current + ' ' + s).length > maxLen) {
                if (current) chunks.push(current.trim());
                current = s;
            } else {
                current += (current ? ' ' : '') + s;
            }
        });
        if (current.trim()) chunks.push(current.trim());
        return chunks.length ? chunks : [text.slice(0, maxLen)];
    }

    /** Произносит массив чанков последовательно */
    _speakChunks(chunks, lang, rate, pitch) {
        if (!chunks.length) return;
        const text = chunks.shift();
        if (!text) return this._speakChunks(chunks, lang, rate, pitch);

        const utt = new SpeechSynthesisUtterance(text);
        utt.lang = lang;
        utt.rate = rate;
        utt.pitch = pitch;
        utt.volume = 1.0;

        if (this._preferredVoice) utt.voice = this._preferredVoice;

        utt.onend = () => {
            if (chunks.length) this._speakChunks(chunks, lang, rate, pitch);
        };
        utt.onerror = () => {
            if (chunks.length) this._speakChunks(chunks, lang, rate, pitch);
        };

        try {
            this.synth.speak(utt);
        } catch (e) { /* ignore */ }
    }

    /**
     * Говорит только число на казахском
     * Например: SFX.speakNumber(5) → «бес»
     */
    speakNumber(n) {
        const word = this._numToKK(n);
        if (word) this.speak(word);
    }
}

// ── Глобальный экземпляр ──────────────────────────────────────────────
const SFX = new AudioManager();
