const SECTIONS = [
    {
        id: 'logic',
        title: '1-БӨЛІМ — ЛОГИКА ЖӘНЕ ОЙЛАУ',
        icon: '🧠',
        color: '#8b5cf6', // Violet
        categories: [
            { id: 'logic_patterns', title: 'Жемістермен есеп', icon: '🍎', stars: 0, total: 3 },
            { id: 'logic_odd_one', title: 'Артық затты тап', icon: '❌', stars: 0, total: 3 },
            { id: 'logic_prediction', title: 'Жалғасын тап', icon: '🔮', stars: 0, total: 3 },
            { id: 'logic_cause_effect', title: 'Себеп-салдар', icon: '⚡', stars: 0, total: 3 },
            { id: 'logic_spatial', title: 'Кеңістіктік ойлау', icon: '📐', stars: 0, total: 3 },
            { id: 'logic_classification', title: 'Жіктеу', icon: '📂', stars: 0, total: 3 },
            { id: 'logic_sequence', title: 'Іс-әрекет реті', icon: '📋', stars: 0, total: 3 },
            { id: 'logic_visual', title: 'Суретті логика', icon: '🖼️', stars: 0, total: 3 },
            { id: 'logic_true_false', title: 'Шын немесе жалған', icon: '✅', stars: 0, total: 3 },
        ]
    },
    {
        id: 'math',
        title: '2-БӨЛІМ — МАТЕМАТИКА ЖӘНЕ САНДАР',
        icon: '🔢',
        color: '#3b82f6', // Blue
        categories: [
            { id: 'math_add_sub', title: 'Қосу және азайту', icon: '➕', stars: 0, total: 3 },
            { id: 'math_compare', title: 'Сандарды салыстыру', icon: '⚖️', stars: 0, total: 3 },
            { id: 'math_missing', title: 'Түсіп қалған сан', icon: '❓', stars: 0, total: 3 },
            { id: 'math_multiply', title: 'Көбейту', icon: '✖️', stars: 0, total: 3 },
            { id: 'math_divide', title: 'Бөлу', icon: '➗', stars: 0, total: 3 },
            { id: 'math_word_problems', title: 'Мәтіндік есептер', icon: '📝', stars: 0, total: 3 },
            { id: 'math_measurements', title: 'Шамалармен жұмыс', icon: '📏', stars: 0, total: 3 },
            { id: 'math_geometry', title: 'Геометрия', icon: '🔺', stars: 0, total: 3 },
            { id: 'math_logic', title: 'Математикалық логика', icon: '📊', stars: 0, total: 3 },
        ]
    },
    {
        id: 'attention',
        title: '3-БӨЛІМ — ЗЕЙІН ЖӘНЕ ЕСТЕ САҚТАУ',
        icon: '👀',
        color: '#eab308', // Yellow/Gold
        categories: [
            { id: 'attn_diff', title: 'Айырмашылықты тап', icon: '🔍', stars: 0, total: 3 },
            { id: 'attn_memory_repeat', title: 'Есте сақта және қайтала', icon: '🧠', stars: 0, total: 3 },
            { id: 'attn_missing', title: 'Не жоғалды?', icon: '👻', stars: 0, total: 3 },
            { id: 'attn_condition', title: 'Шарт бойынша тап', icon: '🎯', stars: 0, total: 3 },
            { id: 'attn_patterns', title: 'Визуалды өрнектер', icon: '🧩', stars: 0, total: 3 },
            { id: 'attn_concentration', title: 'Зейін қою', icon: '🧘', stars: 0, total: 3 },
            { id: 'attn_visual_memory', title: 'Көру жады', icon: '👁️', stars: 0, total: 3 },
            { id: 'attn_maze', title: 'Лабиринттер', icon: '🌀', stars: 0, total: 3 },
            { id: 'attn_count', title: 'Зейінді санау', icon: '⏱️', stars: 0, total: 3 },
        ]
    }
];

const TASKS = {
    'logic_patterns': [
        {
            id: 'pat_01',
            template: 'visualmath',
            instruction: '🍎 Алмаларды қос!',
            content: {
                emoji: '🍎',
                operand1: 3, operator: '+', operand2: 2,
                answer: 5, options: [4, 5, 6],
                story: 'Себетте 3 алма бар еді. Тағы 2 алма қосты. Барлығы нешеу?'
            }
        },
        {
            id: 'pat_02',
            template: 'visualmath',
            instruction: '🍌 Банандарды азайт!',
            content: {
                emoji: '🍌',
                operand1: 6, operator: '-', operand2: 2,
                answer: 4, options: [3, 4, 5],
                story: 'Маймылда 6 банан болды. 2-еуін жеді. Нешеуі қалды?'
            }
        },
        {
            id: 'pat_03',
            template: 'visualmath',
            instruction: '🍓 Жидектерді қос!',
            content: {
                emoji: '🍓',
                operand1: 4, operator: '+', operand2: 3,
                answer: 7, options: [6, 7, 8],
                story: 'Бір тақтайшада 4 жидек, екіншісінде 3 жидек. Барлығы нешеу?'
            }
        }
    ],
    'logic_odd_one': [
        {
            id: 'odd_01',
            template: 'oddoneout',
            instruction: 'Артық затты тап: Бір ғана жеміс емес!',
            content: {
                items: [
                    { content: '🍎', isOdd: false },
                    { content: '🍌', isOdd: false },
                    { content: '🍇', isOdd: false },
                    { content: '🍊', isOdd: false },
                    { content: '🥕', isOdd: true }, // Carrot - not a fruit!
                    { content: '🍓', isOdd: false }
                ]
            }
        },
        {
            id: 'odd_02',
            template: 'oddoneout',
            instruction: 'Артық затты тап: Бір ғана ұшпайды!',
            content: {
                items: [
                    { content: '🦅', isOdd: false },
                    { content: '🦋', isOdd: false },
                    { content: '🐝', isOdd: false },
                    { content: '🐢', isOdd: true }, // Turtle - can't fly!
                    { content: '🦆', isOdd: false },
                    { content: '🦉', isOdd: false }
                ]
            }
        },
        {
            id: 'odd_03',
            template: 'oddoneout',
            instruction: 'Артық затты тап: Бір ғана түс басқа!',
            content: {
                items: [
                    { content: '🔴', isOdd: false },
                    { content: '🍎', isOdd: false },
                    { content: '❤️', isOdd: false },
                    { content: '🟢', isOdd: true }, // Green - different color!
                    { content: '🌹', isOdd: false },
                    { content: '🍓', isOdd: false }
                ]
            }
        }
    ],
    'logic_prediction': [
        {
            id: 'next_01',
            template: 'nextinsequence',
            instruction: 'Жалғасын тап: Қандай сан келесі?',
            content: {
                sequence: ['1️⃣', '2️⃣', '3️⃣', '4️⃣'],
                options: [
                    { content: '5️⃣', correct: true },
                    { content: '6️⃣', correct: false },
                    { content: '3️⃣', correct: false }
                ]
            }
        },
        {
            id: 'next_02',
            template: 'nextinsequence',
            instruction: 'Жалғасын тап: Ай фазалары...',
            content: {
                sequence: ['🌑', '🌓', '🌕'],
                options: [
                    { content: '🌗', correct: true },
                    { content: '🌑', correct: false },
                    { content: '☀️', correct: false }
                ]
            }
        },
        {
            id: 'next_03',
            template: 'nextinsequence',
            instruction: 'Жалғасын тап: Өсімдік өсуі...',
            content: {
                sequence: ['🌱', '🌿', '🌳'],
                options: [
                    { content: '🍎', correct: true },
                    { content: '🌱', correct: false },
                    { content: '🔥', correct: false }
                ]
            }
        }
    ],
    'logic_cause_effect': [
        {
            id: 'cause_01',
            template: 'causeeffect',
            instruction: 'Себепті салдарымен байланыстыр!',
            content: {
                pairs: [
                    { cause: '☀️', effect: '🌡️' }, // Sun → Hot
                    { cause: '☁️', effect: '🌧️' }, // Cloud → Rain
                    { cause: '🌱', effect: '🌳' }  // Seed → Tree
                ]
            }
        },
        {
            id: 'cause_02',
            template: 'causeeffect',
            instruction: 'Не болады? Себепті тап!',
            content: {
                pairs: [
                    { cause: '🔥', effect: '💨' }, // Fire → Smoke
                    { cause: '💧', effect: '🌊' }, // Drop → Water
                    { cause: '🍎', effect: '🌳' }  // Apple → Tree
                ]
            }
        },
        {
            id: 'cause_03',
            template: 'causeeffect',
            instruction: 'Логикалық байланыс тап!',
            content: {
                pairs: [
                    { cause: '🥚', effect: '🐣' }, // Egg → Chick
                    { cause: '🌙', effect: '⭐' }, // Moon → Stars
                    { cause: '🌧️', effect: '🌈' }  // Rain → Rainbow
                ]
            }
        }
    ],
    'logic_spatial': [
        {
            id: 'spatial_01',
            template: 'spatial',
            instruction: 'Қайсысы айналдырылған?',
            content: {
                original: '👉',
                options: [
                    { content: '👈', correct: true, transform: 'scaleX(-1)' },
                    { content: '👆', correct: false },
                    { content: '👇', correct: false }
                ]
            }
        },
        {
            id: 'spatial_02',
            template: 'spatial',
            instruction: 'Қайсысы айнадағы көрініс?',
            content: {
                original: '🌙',
                options: [
                    { content: '🌙', correct: true, transform: 'scaleX(-1)' },
                    { content: '☀️', correct: false },
                    { content: '⭐', correct: false }
                ]
            }
        },
        {
            id: 'spatial_03',
            template: 'spatial',
            instruction: '90° айналдырылған фигура?',
            content: {
                original: '⬆️',
                options: [
                    { content: '➡️', correct: true },
                    { content: '⬅️', correct: false },
                    { content: '⬇️', correct: false }
                ]
            }
        }
    ],
    'logic_classification': [
        {
            id: 'class_01',
            template: 'classification',
            instruction: 'Жануарларды топтарға бөл!',
            content: {
                categories: [
                    { name: 'Үй жануарлары', accepts: ['dog', 'cat', 'cow'] },
                    { name: 'Жабайы жануарлар', accepts: ['lion', 'elephant', 'tiger'] }
                ],
                items: [
                    { content: '🐶', category: 'Үй жануарлары' },
                    { content: '🦁', category: 'Жабайы жануарлар' },
                    { content: '🐱', category: 'Үй жануарлары' },
                    { content: '🐘', category: 'Жабайы жануарлар' }
                ]
            }
        },
        {
            id: 'class_02',
            template: 'classification',
            instruction: 'Тамақты түріне қарай бөл!',
            content: {
                categories: [
                    { name: 'Жемістер', accepts: ['apple', 'banana', 'grape'] },
                    { name: 'Көкөністер', accepts: ['carrot', 'tomato', 'broccoli'] }
                ],
                items: [
                    { content: '🍎', category: 'Жемістер' },
                    { content: '🥕', category: 'Көкөністер' },
                    { content: '🍌', category: 'Жемістер' },
                    { content: '🍅', category: 'Көкөністер' }
                ]
            }
        },
        {
            id: 'class_03',
            template: 'classification',
            instruction: 'Көлікті түріне қарай бөл!',
            content: {
                categories: [
                    { name: 'Жер көлігі', accepts: ['car', 'bus', 'bike'] },
                    { name: 'Әуе көлігі', accepts: ['plane', 'helicopter', 'rocket'] }
                ],
                items: [
                    { content: '🚗', category: 'Жер көлігі' },
                    { content: '✈️', category: 'Әуе көлігі' },
                    { content: '🚌', category: 'Жер көлігі' },
                    { content: '🚁', category: 'Әуе көлігі' }
                ]
            }
        }
    ],
    'logic_sequence': [
        {
            id: 'seq_action_01',
            template: 'actionsequence',
            instruction: 'Таңғы іс-әрекеттер реті',
            content: {
                steps: [
                    { content: '😴', order: 0 }, // Wake up
                    { content: '🚿', order: 1 }, // Shower
                    { content: '🍳', order: 2 }, // Breakfast
                    { content: '🎒', order: 3 }  // Go to school
                ]
            }
        },
        {
            id: 'seq_action_02',
            template: 'actionsequence',
            instruction: 'Ағаш өсу реті',
            content: {
                steps: [
                    { content: '🌰', order: 0 }, // Seed
                    { content: '🌱', order: 1 }, // Sprout
                    { content: '🌿', order: 2 }, // Plant
                    { content: '🌳', order: 3 }  // Tree
                ]
            }
        },
        {
            id: 'seq_action_03',
            template: 'actionsequence',
            instruction: 'Күн мезгілдерін дұрыс ретімен орналастыр: Таң → Түс → Кеш → Түн',
            content: {
                steps: [
                    { content: '🌅', text: 'Таң (Ерте таңертең)', order: 0 },
                    { content: '☀️', text: 'Күндіз (Түстен кейін)', order: 1 },
                    { content: '🌆', text: 'Кеш (Күн батқанда)', order: 2 },
                    { content: '🌙', text: 'Түн (Ұйықтау уақыты)', order: 3 }
                ]
            }
        }
    ],
    'logic_visual': [
        {
            id: 'visual_01',
            template: 'visuallogic',
            instruction: 'Өрнекті толықтыр!',
            content: {
                grid: [
                    ['🔴', '🔵', '🔴'],
                    ['🔵', '🔴', '🔵'],
                    ['🔴', '🔵', '?']
                ],
                options: [
                    { content: '🔴', correct: true },
                    { content: '🔵', correct: false },
                    { content: '🟢', correct: false }
                ]
            }
        },
        {
            id: 'visual_02',
            template: 'visuallogic',
            instruction: 'Қандай фигура келесі?',
            content: {
                grid: [
                    ['⭐', '⭐', '🌙'],
                    ['⭐', '⭐', '🌙'],
                    ['⭐', '⭐', '?']
                ],
                options: [
                    { content: '🌙', correct: true },
                    { content: '⭐', correct: false },
                    { content: '☀️', correct: false }
                ]
            }
        },
        {
            id: 'visual_03',
            template: 'visuallogic',
            instruction: 'Логикалық өрнек!',
            content: {
                grid: [
                    ['🍎', '🍌', '🍎'],
                    ['🍌', '🍎', '🍌'],
                    ['🍎', '?', '🍎']
                ],
                options: [
                    { content: '🍌', correct: true },
                    { content: '🍎', correct: false },
                    { content: '🍇', correct: false }
                ]
            }
        }
    ],
    'logic_true_false': [
        {
            id: 'tf_01',
            template: 'truefalse',
            instruction: 'Бұл дұрыс па?',
            content: {
                statement: 'Балық суда жүзеді',
                image: '🐟',
                isTrue: true
            }
        },
        {
            id: 'tf_02',
            template: 'truefalse',
            instruction: 'Бұл шын ба?',
            content: {
                statement: 'Күн түнде жарқырайды',
                image: '☀️',
                isTrue: false
            }
        },
        {
            id: 'tf_03',
            template: 'truefalse',
            instruction: 'Дұрыс па?',
            content: {
                statement: 'Құстар ұша алады',
                image: '🦅',
                isTrue: true
            }
        }
    ],
    'math_add_sub': [
        {
            id: 'math_as_bd_01',
            template: 'basketdrag',
            instruction: '🧺 Алмаларды корзинаға сал!',
            content: {
                emoji: '🍎',
                operand1: 3, operator: '+', operand2: 4,
                answer: 7, options: [6, 7, 8],
                story: 'Себетте 3 алма бар. Тағы 4 алма қосты. Корзинаға салып, барлығын сана!'
            }
        },
        {
            id: 'math_as_bd_02',
            template: 'basketdrag',
            instruction: '🧺 Банандарды жи!',
            content: {
                emoji: '🍌',
                operand1: 5, operator: '+', operand2: 3,
                answer: 8, options: [7, 8, 9],
                story: 'Маймыл 5 банан, тағы 3 банан тапты. Корзинаға жинап, санашы!'
            }
        },
        {
            id: 'math_as_bd_03',
            template: 'basketdrag',
            instruction: '🧺 Жұлдыздарды жинала!',
            content: {
                emoji: '⭐',
                operand1: 6, operator: '+', operand2: 4,
                answer: 10, options: [9, 10, 11],
                story: 'Аспаннан 6 жұлдыз түсті, тағы 4 жұлдыз шықты. Барлығы санашы!'
            }
        }
    ],
    'math_compare': [
        {
            id: 'math_cmp_sc_01',
            template: 'livescales',
            instruction: '⚖️ Таразыда салыстыр!',
            content: {
                leftEmoji: '🍎', leftCount: 7,
                rightEmoji: '🍊', rightCount: 4,
                answer: '>',
                story: 'Таразының сол жағында 7 алма, оң жағында 4 апельсин. Қайсысы ауыр?'
            }
        },
        {
            id: 'math_cmp_sc_02',
            template: 'livescales',
            instruction: '⚖️ Санды салыстыр!',
            content: {
                leftEmoji: '🐟', leftCount: 3,
                rightEmoji: '🐟', rightCount: 8,
                answer: '<',
                story: 'Сол жақта 3 балық, оң жақта 8 балық бар. Қайсы жағы кіші?'
            }
        },
        {
            id: 'math_cmp_sc_03',
            template: 'livescales',
            instruction: '⚖️ Тең бе, жоқ па?',
            content: {
                leftEmoji: '🌸', leftCount: 5,
                rightEmoji: '🌸', rightCount: 5,
                answer: '=',
                story: 'Екі жақта да 5-тен гүл бар. Таразы тең бе?'
            }
        }
    ],
    'math_missing': [
        {
            id: 'math_miss_tn_01',
            template: 'trainnumbers',
            instruction: '🚂 Поездда қай сан жоқ?',
            content: {
                sequence: [3, null, 5, 6, 7],
                answer: 4,
                options: [2, 4, 8],
                story: 'Сандар поезы жүреді: 3, ?, 5, 6, 7. Бос вагонды тол!'
            }
        },
        {
            id: 'math_miss_tn_02',
            template: 'trainnumbers',
            instruction: '🚂 Ондықтар поезды!',
            content: {
                sequence: [10, 20, 30, null, 50],
                answer: 40,
                options: [35, 40, 45],
                story: 'Ондықтар: 10, 20, 30, ?, 50. Жетіспеген ондықты тап!'
            }
        },
        {
            id: 'math_miss_tn_03',
            template: 'trainnumbers',
            instruction: '🚂 Кері санау поезды!',
            content: {
                sequence: [9, 8, null, 6, 5],
                answer: 7,
                options: [4, 7, 10],
                story: 'Поезд кері санайды: 9, 8, ?, 6, 5. Жоқ санды тап!'
            }
        }
    ],
    'math_multiply': [
        {
            id: 'math_mult_ne_01',
            template: 'nesteggs',
            instruction: '🪹 Ұялардағы жұмыртқаларды сана!',
            content: {
                nests: 3,
                eggsPerNest: 2,
                answer: 6,
                options: [5, 6, 8],
                story: '3 ұяда 2-ден жұмыртқа бар. Барлығы нешеу? 3 × 2 = ?'
            }
        },
        {
            id: 'math_mult_ne_02',
            template: 'nesteggs',
            instruction: '🪹 4 ұяда 3-тен жұмыртқа!',
            content: {
                nests: 4,
                eggsPerNest: 3,
                answer: 12,
                options: [9, 12, 16],
                story: '4 ұяда 3-тен жұмыртқа бар. Барлығы нешеу? 4 × 3 = ?'
            }
        },
        {
            id: 'math_mult_ne_03',
            template: 'nesteggs',
            instruction: '🪹 2 ұяда 5-тен жұмыртқа!',
            content: {
                nests: 2,
                eggsPerNest: 5,
                answer: 10,
                options: [8, 10, 12],
                story: '2 ұяда 5-тен жұмыртқа бар. Барлығы нешеу? 2 × 5 = ?'
            }
        }
    ],
    'math_divide': [
        {
            id: 'math_div_cd_01',
            template: 'chocodivide',
            instruction: '🍕 Пиццаны достарға тең бөл!',
            content: {
                total: 6,
                divideBy: 2,
                answer: 3,
                options: [2, 3, 4],
                itemEmoji: '🍕',
                story: '6 пицца бар. 2 досыңа тең бөл. Әрқайсысына нешеу тиеді?'
            }
        },
        {
            id: 'math_div_cd_02',
            template: 'chocodivide',
            instruction: '🥕 Сәбізді қояндарға бөл!',
            content: {
                total: 8,
                divideBy: 4,
                answer: 2,
                options: [1, 2, 3],
                itemEmoji: '🥕',
                story: '8 сәбіз бар. 4 қоянға тең бөл. Әр қоянға нешеуі?'
            }
        },
        {
            id: 'math_div_cd_03',
            template: 'chocodivide',
            instruction: '🍩 Пончикті балаларға бөл!',
            content: {
                total: 9,
                divideBy: 3,
                answer: 3,
                options: [2, 3, 4],
                itemEmoji: '🍩',
                story: '9 пончик бар. 3 балаға тең бөл. Әрқайсысына нешеу тиеді?'
            }
        }
    ],
    'math_word_problems': [
        {
            id: 'math_wp_bd_01',
            template: 'basketdrag',
            instruction: '🧺 Доптарды жинашы!',
            content: {
                emoji: '🏀',
                operand1: 5, operator: '+', operand2: 3,
                answer: 8, options: [7, 8, 9],
                story: 'Ерланда 5 доп, Айзатта 3 доп. Екі корзинадан жинап, барлығын сана!'
            }
        },
        {
            id: 'math_wp_bd_02',
            template: 'basketdrag',
            instruction: '🧺 Балапандарды жина!',
            content: {
                emoji: '🐣',
                operand1: 4, operator: '+', operand2: 5,
                answer: 9, options: [8, 9, 10],
                story: 'Бір қораяда 4, екінші қораяда 5 балапан. Барлығы корзинаға жина!'
            }
        },
        {
            id: 'math_wp_bd_03',
            template: 'basketdrag',
            instruction: '🧺 Гүлдерді жина!',
            content: {
                emoji: '🌸',
                operand1: 6, operator: '+', operand2: 4,
                answer: 10, options: [9, 10, 11],
                story: 'Бақшада 6 қызыл, 4 ақ гүл өсті. Корзинаға жинап сана!'
            }
        }
    ],
    'math_measurements': [
        {
            id: 'math_meas_01',
            template: 'weightlab',
            instruction: 'Салмақты сезін: Ең АУЫР затты тап және ортаға қой!',
            content: {
                objects: [
                    { id: 'feather', emoji: '🪶', weight: 1 },
                    { id: 'stone', emoji: '🪨', weight: 10 },
                    { id: 'apple', emoji: '🍎', weight: 3 }
                ],
                targetWeight: 10
            }
        },
        {
            id: 'math_meas_sc_01',
            template: 'livescales',
            instruction: '⚖️ Қайсысы ауырырақ?',
            content: {
                leftEmoji: '🏋️', leftCount: 10,
                rightEmoji: '🪶', rightCount: 2,
                answer: '>',
                story: 'Таразы: сол жақта 10 кг, оң жақта 2 кг. Қайсысы ауыр?'
            }
        },
        {
            id: 'math_meas_sc_02',
            template: 'livescales',
            instruction: '⚖️ Сантиметрді салыстыр!',
            content: {
                leftEmoji: '📏', leftCount: 5,
                rightEmoji: '📏', rightCount: 8,
                answer: '<',
                story: 'Сол таяқша 5 см, оң таяқша 8 см. Қайсысы қысқа?'
            }
        }
    ],
    'math_geometry': [
        {
            id: 'geo_symmetry_01',
            template: 'symmetry',
            instruction: 'Симметрия: Оң жақтағы торды сол жақтағыдай етіп боя (айнадағыдай)',
            content: {
                size: 5,
                pattern: [
                    [1, 1, 1, 0, 0],
                    [0, 0, 1, 0, 0],
                    [0, 0, 1, 1, 0],
                    [0, 0, 1, 0, 0],
                    [1, 1, 1, 0, 0]
                ],
                target: [
                    [0, 0, 1, 1, 1],
                    [0, 0, 1, 0, 0],
                    [0, 1, 1, 0, 0],
                    [0, 0, 1, 0, 0],
                    [0, 0, 1, 1, 1]
                ]
            }
        },
        {
            id: 'geo_cubes_01',
            template: 'cubecount',
            instruction: 'Зейін қой: Суретте барлығы неше текше (кубик) бар?',
            content: {
                layout: [[2, 1], [1, 1]],
                answer: 5, options: [4, 5, 6]
            }
        },
        {
            id: 'geo_safe_01',
            template: 'safecode',
            instruction: '🔐 Геометрия кодын тер!',
            content: {
                equation: '🔺 + 🔷 = ? бұрыш',
                answer: 7,
                story: 'Үшбұрышта 3 бұрыш, төртбұрышта 4 бұрыш. Барлығы нешеу?',
                hint: '3 + 4 = ?'
            }
        }
    ],
    'math_logic': [
        {
            id: 'math_log_sc_01',
            template: 'safecode',
            instruction: '🔐 Сейфтің кодын тап!',
            content: {
                equation: '🍎 + 🍎 + 🍎 = ?',
                answer: 15,
                story: 'Әр 🍎 = 5. 3 алма барлығы: 5 + 5 + 5 = ?',
                hint: '5 × 3 = ?'
            }
        },
        {
            id: 'math_log_sc_02',
            template: 'safecode',
            instruction: '🔐 Жасырын санды тап!',
            content: {
                equation: '? + 4 = 10',
                answer: 6,
                story: 'Жасырын санға 4 қосқанда 10 шығады. Жасырын сан қандай?',
                hint: '10 - 4 = ?'
            }
        },
        {
            id: 'math_log_sc_03',
            template: 'safecode',
            instruction: '🔐 Кодты шеш де сейфті аш!',
            content: {
                equation: '🌟 × 🌟 = ? (🌟 = 3)',
                answer: 9,
                story: 'Жұлдыздың мәні = 3. Екі жұлдызды көбейт: 3 × 3 = ?',
                hint: '3 × 3 = ?'
            }
        }
    ],

    'attn_visual_memory': [
        {
            id: 'attn_mem_01',
            template: 'memorycards',
            instruction: 'Жұптарды тап!',
            content: {
                pairs: ['🐶', '🐱', '🦁']
            }
        },
        {
            id: 'attn_mem_02',
            template: 'memorycards',
            instruction: 'Жемістерді есіңе сақта!',
            content: {
                pairs: ['🍎', '🍌', '🍇', '🍉']
            }
        },
        {
            id: 'attn_mem_03',
            template: 'memorycards',
            instruction: 'Пішіндерді тап!',
            content: {
                pairs: ['🔴', '🟦', '🔺', '⭐']
            }
        }
    ],
    'attn_diff_easy': [
        {
            id: 'attn_diff_01',
            template: 'oddoneout',
            instruction: 'Өзгеше смайликті тап!',
            content: {
                items: ['😀', '😀', '😃', '😀'],
                correct: 2
            }
        },
        {
            id: 'attn_diff_02',
            template: 'oddoneout',
            instruction: 'Қайсысы басқа?',
            content: {
                items: ['🍎', '🍎', '🍎', '🍅'],
                correct: 3
            }
        },
        {
            id: 'attn_diff_03',
            template: 'oddoneout',
            instruction: 'Айырмашылықты тап!',
            content: {
                items: ['🚗', '🚙', '🚗', '🚗'],
                correct: 1
            }
        }
    ],
    'attn_missing_seq': [
        {
            id: 'attn_miss_01',
            template: 'mathmissing',
            instruction: 'Не жетіспейді?',
            content: {
                sequence: ['🐱', '🐶', null, '🐹'],
                options: ['🐰', '🐵', '🦊'],
                correct: '🐰'
            }
        },
        {
            id: 'attn_miss_02',
            template: 'mathmissing',
            instruction: 'Ретін тап',
            content: {
                sequence: ['🌞', null, '🌧️', '❄️'],
                options: ['☁️', '🌤️', '⛈️'],
                correct: '🌤️'
            }
        }
    ],
    'attn_condition_easy': [
        {
            id: 'attn_cond_01',
            template: 'classification',
            instruction: 'Түстерді ажырат: Қызыл және Көк',
            content: {
                categories: [
                    { id: 'red', title: 'Қызыл 🔴', items: ['🍎', '🍓', '🚗'] },
                    { id: 'blue', title: 'Көк 🔵', items: ['🚙', '🫐', '🧢'] }
                ]
            }
        }
    ],
    'attn_patterns': [
        {
            id: 'attn_pat_01',
            template: 'visuallogic',
            instruction: 'Өрнекті жалғастыр',
            content: {
                grid: [
                    ['🟩', '🟧', '🟩'],
                    ['🟧', '🟩', '🟧'],
                    ['🟩', '🟧', '?']
                ],
                options: [
                    { content: '🟩', correct: true },
                    { content: '🟧', correct: false },
                    { content: '🟦', correct: false }
                ]
            }
        }
    ],
    'attn_maze': [
        {
            id: 'attn_maze_01',
            template: 'multiplechoice',
            instruction: 'Қоянға сәбізге жетуге көмектес!',
            content: {
                question: 'Қай жол дұрыс?',
                image: '🐰 ➡️ 🥕',
                options: [
                    { content: 'Жол 1', correct: true },
                    { content: 'Жол 2', correct: false }
                ]
            }
        }
    ],
    'attn_count': [
        {
            id: 'attn_cnt_01',
            template: 'multiplechoice',
            instruction: 'Барлығы неше жұлдыз?',
            content: {
                question: 'Суреттегі жұлдыздарды сана:',
                image: '⭐⭐⭐⭐⭐',
                options: [
                    { content: '4', correct: false },
                    { content: '5', correct: true },
                    { content: '6', correct: false }
                ]
            }
        },
        {
            id: 'attn_cnt_02',
            template: 'multiplechoice',
            instruction: 'Неше құс бар?',
            content: {
                question: '🐦🐦 🐦',
                options: [
                    { content: '2', correct: false },
                    { content: '3', correct: true },
                    { content: '4', correct: false }
                ]
            }
        }
    ],
    'attn_diff': [
        // 1. Memory Cards - Find matching pairs
        {
            id: 'diff_01',
            template: 'memorycards',
            instruction: 'Жұптарды тап: Бірдей жануарлар жұбын есте сақта!',
            content: {
                pairs: ['🦊', '🐻', '🐰', '🦁']
            }
        },
        // 2. Spatial Rotation - Find the rotated shape
        {
            id: 'diff_02',
            template: 'spatial',
            instruction: 'Айырмашылықты тап: Қайсысы айналдырылған?',
            content: {
                original: '🔺',
                options: [
                    { content: '🔻', correct: true, transform: 'rotate(180deg)' },
                    { content: '🔺', correct: false },
                    { content: '◀️', correct: false }
                ]
            }
        },
        // 3. Classification - Sort by category with twist
        {
            id: 'diff_03',
            template: 'classification',
            instruction: 'Айырмашылықты тап: Жануарлар мен Көліктер',
            content: {
                categories: [
                    { id: 'animals', label: 'ЖАНУАРЛАР 🐾', color: '#10b981' },
                    { id: 'vehicles', label: 'КӨЛІКТЕР 🚗', color: '#3b82f6' }
                ],
                items: [
                    { id: 'i1', content: '🦁', category: 'animals' },
                    { id: 'i2', content: '🚗', category: 'vehicles' },
                    { id: 'i3', content: '🐘', category: 'animals' },
                    { id: 'i4', content: '✈️', category: 'vehicles' },
                    { id: 'i5', content: '🐸', category: 'animals' },
                    { id: 'i6', content: '🚂', category: 'vehicles' }
                ]
            }
        }
    ],
    'attn_memory_repeat': [
        // 1. Shadows - Match object to shadow
        {
            id: 'mem_01',
            template: 'matching',
            instruction: 'Көлеңкесін тап: Кімнің көлеңкесі?',
            content: {
                pairs: [
                    { id: 'p1', left: { content: '🐰' }, right: { content: '👤' } },
                    { id: 'p2', left: { content: '🌵' }, right: { content: '⬛' } },
                    { id: 'p3', left: { content: '✈️' }, right: { content: '➕' } }
                ]
            }
        },
        // 2. Emotion Match - Match face to feeling
        {
            id: 'mem_02',
            template: 'matching',
            instruction: 'Сезімді тап: Кейіпкерді сезіміне қос!',
            content: {
                pairs: [
                    { id: 'p1', left: { content: '😄' }, right: { content: '🎉' } },
                    { id: 'p2', left: { content: '😢' }, right: { content: '🌧️' } },
                    { id: 'p3', left: { content: '😠' }, right: { content: '🌋' } }
                ]
            }
        },
        // 3. Water Reflection - Physics/Nature logic
        {
            id: 'mem_03',
            template: 'spatial',
            instruction: 'Судағы бейне: Қайсысы дұрыс?',
            content: {
                original: '🌳',
                options: [
                    { content: '🌳', correct: false },
                    { content: '🌳', correct: true, transform: 'rotate(180deg) scaleX(-1)' },
                    { content: '🌵', correct: false }
                ]
            }
        }
    ],
    'attn_missing': [
        // 1. Detective - What is missing from the picture?
        {
            id: 'miss_01',
            template: 'multiplechoice',
            instruction: 'Мұқият қара: Суретте не жоқ?',
            content: {
                question: '🍎 🍌 🍇 🍓',
                options: [
                    { content: '🍎', correct: false },
                    { content: '🍊', correct: true },
                    { content: '🍇', correct: false }
                ]
            }
        },
        // 2. What animal disappeared?
        {
            id: 'miss_02',
            template: 'multiplechoice',
            instruction: 'Мұқият қара! Қайсысы жоғалды?',
            content: {
                question: 'Аулада ойнаған жануарлар:\n🐶 🐱 🐰 🐹\nБіреуі кетіп қалды! Кім жоқ?',
                image: '🐶 🐱  🐹',
                options: [
                    { content: '🐰 Қоян', correct: true },
                    { content: '🐶 Ит', correct: false },
                    { content: '🐱 Мысық', correct: false }
                ]
            }
        },
        // 3. Missing Piece - Complete the object
        {
            id: 'miss_03',
            template: 'matching',
            instruction: 'Бөлшегін тап: Қай бөлік жетіспейді?',
            content: {
                pairs: [
                    { id: 'p1', left: { content: '🍕' }, right: { content: '🍰' } },
                    { id: 'p2', left: { content: '🧩' }, right: { content: '🟦' } },
                    { id: 'p3', left: { content: '🚗' }, right: { content: '🛞' } }
                ]
            }
        }
    ],
    'attn_condition': [
        // 1. Rule-based Odd One Out
        {
            id: 'cond_01',
            template: 'oddoneout',
            instruction: 'Ереже: Барлығы ДӨҢГЕЛЕК және САРЫ болуы керек. Қайсысы артық?',
            content: {
                items: [
                    { content: '🟡', isOdd: false },
                    { content: '🟡', isOdd: false },
                    { content: '🟨', isOdd: true },
                    { content: '🟡', isOdd: false },
                    { content: '🟡', isOdd: false },
                    { content: '🟡', isOdd: false }
                ]
            }
        },
        // 2. Find All Matching (Classification)
        {
            id: 'cond_02',
            template: 'classification',
            instruction: 'Тап: 3 бұрыштан КӨП бұрышы бар фигуралар',
            content: {
                categories: [
                    { id: 'yes', label: 'ДҰРЫС ✅', color: '#22c55e' },
                    { id: 'no', label: 'БҰРЫС ❌', color: '#ef4444' }
                ],
                items: [
                    { id: 'i1', content: '🟩', category: 'yes' },
                    { id: 'i2', content: '🔺', category: 'no' },
                    { id: 'i3', content: '⭐', category: 'yes' },
                    { id: 'i4', content: '⏺️', category: 'no' },
                    { id: 'i5', content: '🔷', category: 'yes' }
                ]
            }
        },
        // 3. Basket sorting by complex condition
        {
            id: 'cond_03',
            template: 'classification',
            instruction: 'Себетке сал: Тек КӨК және КӨЛІК емес!',
            content: {
                categories: [
                    { id: 'target', label: 'КЕРЕК 📥', color: '#3b82f6' },
                    { id: 'trash', label: 'КЕРЕК ЕМЕС 🗑️', color: '#94a3b8' }
                ],
                items: [
                    { id: 'i1', content: '📘', category: 'target' },
                    { id: 'i2', content: '🚙', category: 'trash' },
                    { id: 'i3', content: '🧢', category: 'target' },
                    { id: 'i4', content: '🍎', category: 'trash' },
                    { id: 'i5', content: '🖌️', category: 'trash' }
                ]
            }
        }
    ],
    'attn_patterns': [
        // Level 1 — Sunset landscape (3×3, 3 missing)
        {
            id: 'pat_pp_01',
            template: 'patternpuzzle',
            instruction: '🌅 Күн батыс көрінісін қалпына келтір!',
            content: {
                pattern: [
                    ['🌤️', '☀️', '🌤️'],
                    ['🌅', '🌅', '🌅'],
                    ['🌿', '🌿', '🌿']
                ],
                missing: [3, 4, 5]
            }
        },
        // Level 2 — Rainbow fruit (3×3, 3 missing)
        {
            id: 'pat_pp_02',
            template: 'patternpuzzle',
            instruction: '🌈 Түстер реті бойынша жемістерді орналастыр!',
            content: {
                pattern: [
                    ['🍎', '🍊', '🍋'],
                    ['🍏', '🫐', '🍇'],
                    ['🍓', '🍒', '🍑']
                ],
                missing: [1, 5, 7]
            }
        },
        // Level 3 — Animal grid (3×3, 4 missing)
        {
            id: 'pat_pp_03',
            template: 'patternpuzzle',
            instruction: '🐾 Жануарлар торын толықтыр!',
            content: {
                pattern: [
                    ['🦁', '🐯', '🦊'],
                    ['🐸', '🐧', '🐺'],
                    ['🐻', '🦝', '🦔']
                ],
                missing: [0, 2, 6, 8]
            }
        },
        // Level 4 — Under the sea (3×4, 4 missing)
        {
            id: 'pat_pp_04',
            template: 'patternpuzzle',
            instruction: '🌊 Теңіз табанын суретін жасал!',
            content: {
                pattern: [
                    ['🌊', '🌊', '🌊', '🌊'],
                    ['🐠', '🐡', '🦈', '🐙'],
                    ['🪸', '🐚', '⭐', '🦀']
                ],
                missing: [4, 6, 9, 11]
            }
        },
        // Level 5 — Space scene (3×4, 5 missing, hardest)
        {
            id: 'pat_pp_05',
            template: 'patternpuzzle',
            instruction: '🚀 Ғарыш суретін қалпына келтір — ең қиын деңгей!',
            content: {
                pattern: [
                    ['⭐', '🌟', '✨', '⭐'],
                    ['🪐', '🚀', '🌙', '🛸'],
                    ['🌌', '☄️', '🔭', '🌌']
                ],
                missing: [1, 5, 6, 9, 10]
            }
        }
    ],
    'attn_concentration': [
        // 1. Quick Math (Divisible by 3) -> Classification
        {
            id: 'conc_01',
            template: 'classification',
            instruction: 'Тез сана: 3-ке бөлінетін сандарды тап!',
            content: {
                categories: [
                    { id: 'div3', label: '3-ке бөлінеді ÷3', color: '#8b5cf6' },
                    { id: 'other', label: 'Басқалар', color: '#9ca3af' }
                ],
                items: [
                    { id: 'i1', content: '3', category: 'div3' },
                    { id: 'i2', content: '6', category: 'div3' },
                    { id: 'i3', content: '9', category: 'div3' },
                    { id: 'i4', content: '4', category: 'other' },
                    { id: 'i5', content: '5', category: 'other' },
                    { id: 'i6', content: '7', category: 'other' }
                ]
            }
        },
        // 2. Memory/Track object (Simulated with MemoryCards)
        {
            id: 'conc_02',
            template: 'memorycards',
            instruction: 'Есте сақта: Бірдей заттарды қайда жасырды?',
            content: {
                pairs: ['⌚', '🕶️', '🔑', '🪙']
            }
        },
        // 3. Find differences (Odd One Out - subtle)
        {
            id: 'conc_03',
            template: 'oddoneout',
            instruction: 'Айырмашылықты тап: Бір смайлик өзгеше!',
            content: {
                items: [
                    { content: '🙂', isOdd: false },
                    { content: '🙂', isOdd: false },
                    { content: '🙂', isOdd: false },
                    { content: '🙃', isOdd: true },
                    { content: '🙂', isOdd: false },
                    { content: '🙂', isOdd: false }
                ]
            }
        }
    ],
    'attn_visual_memory': [
        // Level 1 — Fruits (4 items, easy)
        {
            id: 'vmem_01',
            template: 'visualmemory',
            instruction: '🍓 Жемістердің орнын есте сақта, сосын дұрыс орналастыр!',
            content: {
                items: ['🍎', '🍌', '🍇', '🍒'],
                target: '🍎'
            }
        },
        // Level 2 — Space (4 items)
        {
            id: 'vmem_02',
            template: 'visualmemory',
            instruction: '🚀 Ғарыш заттарының орнын жатта, сосын қайтара орналастыр!',
            content: {
                items: ['🚀', '🌙', '⭐', '🪐'],
                target: '🌙'
            }
        },
        // Level 3 — Ocean (6 items, medium)
        {
            id: 'vmem_03',
            template: 'visualmemory',
            instruction: '🌊 Теңіз тіршілігін жадыңа сала! 6 зат — мұқият қара!',
            content: {
                items: ['🐠', '🦈', '🐙', '🦑', '🐚', '🦀'],
                target: '🐙'
            }
        },
        // Level 4 — Kitchen (6 items)
        {
            id: 'vmem_04',
            template: 'visualmemory',
            instruction: '👨‍🍳 Ас үй заттарын дұрыс орынға қой — барлығын есте сақта!',
            content: {
                items: ['🍳', '🥄', '🍴', '🫕', '🥢', '🧂'],
                target: '🍳'
            }
        },
        // Level 5 — Jungle animals (6 items, hardest)
        {
            id: 'vmem_05',
            template: 'visualmemory',
            instruction: '🌴 Джунгли! Барлық 6 жануардың орнын жатта — уақыт аз!',
            content: {
                items: ['🦁', '🐯', '🦊', '🐸', '🦜', '🐍'],
                target: '🦁'
            }
        }
    ],
    'attn_maze': [
        {
            id: 'maze_01',
            template: 'maze',
            instruction: 'Лабиринт: Мысыққа балыққа жетуге көмектес!',
            content: {
                grid: [
                    [0, 1, 0, 0],
                    [0, 0, 0, 1],
                    [1, 1, 0, 0]
                ],
                start: [0, 0],
                end: [0, 3],
                emoji: '🐱',
                target: '🐟'
            }
        },
        {
            id: 'maze_02',
            template: 'maze',
            instruction: 'Жолды тап: Қоян сәбізге баруы керек!',
            content: {
                grid: [
                    [0, 0, 1, 0],
                    [1, 0, 0, 0],
                    [0, 1, 1, 0]
                ],
                start: [0, 0],
                end: [2, 3],
                emoji: '🐰',
                target: '🥕'
            }
        }
    ],
    'attn_count': [
        {
            id: 'count_01',
            template: 'counting',
            instruction: 'Санап үйрен: Суретте неше үйрек бар?',
            content: {
                items: [
                    { emoji: '🦆', count: 4 },
                    { emoji: '🐸', count: 2 }
                ],
                targetEmoji: '🦆',
                answer: 4
            }
        },
        {
            id: 'count_02',
            template: 'counting',
            instruction: 'Зейін қой: Неше жұлдыз көріп тұрсың?',
            content: {
                items: [
                    { emoji: '⭐', count: 7 },
                    { emoji: '🌙', count: 3 }
                ],
                targetEmoji: '⭐',
                answer: 7
            }
        }
    ]
};
