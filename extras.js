/* ============================================================
   HANDBALL CAREER HUB — الميزات المتقدمة (المرحلة 9)
   يشمل: اللياقة + الفورم + الإصابات + التدريبات + الإعلام +
         الجماهير + الجوائز + الإنجازات + الطقس + الشباب
   ============================================================ */

// ============================================================
// 1) نظام اللياقة والفورم
// ============================================================
function initFitness(career) {
    if (career.fitness === undefined) {
        career.fitness = 100; // 0-100
        career.form = 70;     // 0-100
        career.morale = 75;   // 0-100
    }
}

function consumeFitness(career, decisionsCount) {
    initFitness(career);
    // كل قرار = -1 لياقة تقريباً
    const cost = Math.round(decisionsCount * 0.8) + 5;
    career.fitness = Math.max(0, career.fitness - cost);

    // لو اللياقة أقل من 40، احتمالات التسجيل تنخفض
    return career.fitness;
}

function restoreFitness(career, amount) {
    initFitness(career);
    career.fitness = Math.min(100, career.fitness + amount);
}

function updateForm(career, rating) {
    initFitness(career);
    // الفورم يتأثر بالتقييم في المباراة
    if (rating >= 8) career.form = Math.min(100, career.form + 8);
    else if (rating >= 6) career.form = Math.min(100, career.form + 4);
    else if (rating >= 4) career.form = Math.max(0, career.form - 3);
    else career.form = Math.max(0, career.form - 8);

    // المورال يتأثر بالنتيجة
    return career.form;
}

function getFitnessMultiplier(career) {
    initFitness(career);
    // لياقة 100 = 1.0، لياقة 50 = 0.85، لياقة 20 = 0.70
    if (career.fitness >= 80) return 1.0;
    if (career.fitness >= 60) return 0.92;
    if (career.fitness >= 40) return 0.82;
    if (career.fitness >= 20) return 0.70;
    return 0.55;
}

function getFormMultiplier(career) {
    initFitness(career);
    if (career.form >= 80) return 1.05;
    if (career.form >= 60) return 1.0;
    if (career.form >= 40) return 0.95;
    return 0.88;
}

// ============================================================
// 2) نظام الإصابات
// ============================================================
const INJURY_TYPES = [
    { name: 'شد عضلي', minDays: 5, maxDays: 12, severity: 'خفيف' },
    { name: 'التواء كاحل', minDays: 10, maxDays: 25, severity: 'متوسط' },
    { name: 'كسر إصبع', minDays: 20, maxDays: 40, severity: 'متوسط' },
    { name: 'تمزق رباط', minDays: 40, maxDays: 90, severity: 'خطير' },
    { name: 'إصابة كتف', minDays: 15, maxDays: 35, severity: 'متوسط' },
    { name: 'ارتجاج', minDays: 7, maxDays: 18, severity: 'خفيف' }
];

function rollInjury(career) {
    initFitness(career);

    if (career.injury) return null; // مصاب بالفعل

    // احتمالية الإصابة
    let chance = 0.05; // 5% أساسي

    // البدنية المنخفضة تزيد الخطر
    const physical = career.stats.physical || 60;
    if (physical < 70) chance += 0.03;
    if (physical < 60) chance += 0.04;

    // اللياقة المنخفضة تزيد الخطر
    if (career.fitness < 50) chance += 0.05;
    if (career.fitness < 30) chance += 0.08;

    // الطقس الممطر يزيد الخطر
    if (career.weather === 'ممطر') chance += 0.04;

    if (Math.random() > chance) return null;

    // اختر إصابة
    const injury = INJURY_TYPES[Math.floor(Math.random() * INJURY_TYPES.length)];
    const days = injury.minDays + Math.floor(Math.random() * (injury.maxDays - injury.minDays));

    career.injury = {
        name: injury.name,
        severity: injury.severity,
        daysRemaining: days,
        totalDays: days
    };

    saveCareer(career);
    return career.injury;
}

function recoverInjury(career, daysPassed) {
    if (!career.injury) return false;

    career.injury.daysRemaining -= daysPassed;

    if (career.injury.daysRemaining <= 0) {
        career.injury = null;
        saveCareer(career);
        return true; // شُفي
    }
    return false;
}

function isInjured(career) {
    return career.injury && career.injury.daysRemaining > 0;
}

// ============================================================
// 3) نظام التدريبات
// ============================================================
const TRAINING_TYPES = {
    player: [
        { key: 'shooting', name: 'تدريب التسديد', icon: '🎯', desc: '+2 تسديد', gain: 2 },
        { key: 'passing', name: 'تدريب التمرير', icon: '🤝', desc: '+2 تمرير', gain: 2 },
        { key: 'speed', name: 'تدريب السرعة', icon: '⚡', desc: '+2 سرعة', gain: 2 },
        { key: 'physical', name: 'تدريب بدني', icon: '💪', desc: '+2 بدنية', gain: 2 },
        { key: 'power', name: 'تدريب القوة', icon: '🏋️', desc: '+2 قوة', gain: 2 },
        { key: 'rest', name: 'راحة', icon: '😴', desc: '+15 لياقة', gain: 0 }
    ],
    goalkeeper: [
        { key: 'diving', name: 'تدريب الارتماء', icon: '🤸', desc: '+2 ارتماء', gain: 2 },
        { key: 'passing', name: 'تدريب التمرير', icon: '🤝', desc: '+2 تمرير', gain: 2 },
        { key: 'saving', name: 'تدريب التصدي', icon: '🧤', desc: '+2 تصدي', gain: 2 },
        { key: 'physical', name: 'تدريب بدني', icon: '💪', desc: '+2 بدنية', gain: 2 },
        { key: 'power', name: 'تدريب القوة', icon: '🏋️', desc: '+2 قوة', gain: 2 },
        { key: 'rest', name: 'راحة', icon: '😴', desc: '+15 لياقة', gain: 0 }
    ]
};

function doTraining(career, trainingKey) {
    const isGK = career.position === 'حارس مرمى';
    const trainings = isGK ? TRAINING_TYPES.goalkeeper : TRAINING_TYPES.player;
    const training = trainings.find(t => t.key === trainingKey);
    if (!training) return null;

    if (trainingKey === 'rest') {
        restoreFitness(career, 15);
        career.form = Math.min(100, career.form + 3);
        saveCareer(career);
        return { message: '😴 استرحت واستعدت لياقتك!', gain: '+15 لياقة' };
    }

    // التدريب يستهلك لياقة
    career.fitness = Math.max(0, career.fitness - 8);

    // لكنه يطوّر المهارة
    const cap = 99;
    const oldVal = career.stats[trainingKey];
    if (oldVal >= cap) {
        saveCareer(career);
        return { message: 'وصلت للحد الأقصى في هذه المهارة!', gain: '' };
    }

    career.stats[trainingKey] = Math.min(cap, oldVal + training.gain);
    recalculateTotalRating(career);
    saveCareer(career);

    return { message: `💪 ${training.name} — تطورت!`, gain: `+${training.gain} ${getStatName(trainingKey, career.position)}` };
}

// ============================================================
// 4) نظام الإعلام
// ============================================================
const MEDIA_QUESTIONS = [
    {
        question: 'كيف تقيّم أداءك في المباراة الأخيرة؟',
        answers: [
            { text: 'أدائي كان ممتازاً وأسعى للأفضل', repChange: -1, fansChange: -3, moraleChange: 5, type: 'متعجرف' },
            { text: 'أعمل بجد وأطوّر نفسي باستمرار', repChange: 2, fansChange: 3, moraleChange: 3, type: 'متواضع' },
            { text: 'الفريق أهم من الأفراد', repChange: 3, fansChange: 5, moraleChange: 2, type: 'جماعي' }
        ]
    },
    {
        question: 'ما رأيك في فريقك الحالي؟',
        answers: [
            { text: 'فريق رائع وأشعر بالانتماء', repChange: 1, fansChange: 6, moraleChange: 3, type: 'مخلص' },
            { text: 'أتمنى الانتقال لنادٍ أكبر', repChange: 3, fansChange: -8, moraleChange: -2, type: 'طموح' },
            { text: 'نعمل على التحسن يوماً بعد يوم', repChange: 1, fansChange: 2, moraleChange: 1, type: 'محايد' }
        ]
    },
    {
        question: 'هل تستعد للمنتخب؟',
        answers: [
            { text: 'أحلم بتمثيل بلدي في المحافل الدولية', repChange: 4, fansChange: 4, moraleChange: 5, type: 'وطني' },
            { text: 'أركز على ناديي حالياً', repChange: -1, fansChange: -3, moraleChange: 0, type: 'واقعي' },
            { text: 'أنا جاهز لأي تحدٍ', repChange: 2, fansChange: 2, moraleChange: 3, type: 'واعد' }
        ]
    },
    {
        question: 'ما هدفك هذا الموسم؟',
        answers: [
            { text: 'الفوز بالدوري والكأس', repChange: 3, fansChange: 5, moraleChange: 4, type: 'طموح' },
            { text: 'تحقيق أفضل إحصائيات شخصية', repChange: 1, fansChange: -2, moraleChange: 2, type: 'فردي' },
            { text: 'مساعدة الفريق في كل مباراة', repChange: 2, fansChange: 3, moraleChange: 3, type: 'جماعي' }
        ]
    }
];

function getRandomMediaQuestion() {
    return MEDIA_QUESTIONS[Math.floor(Math.random() * MEDIA_QUESTIONS.length)];
}

function answerMediaQuestion(career, answerIndex, question) {
    const answer = question.answers[answerIndex];
    if (!answer) return null;

    initFitness(career);
    career.reputation = Math.max(0, Math.min(100, (career.reputation || 0) + answer.repChange));
    career.fans = Math.max(0, Math.min(100, (career.fans || 50) + answer.fansChange));
    career.morale = Math.max(0, Math.min(100, career.morale + answer.moraleChange));
    career.form = Math.max(0, Math.min(100, career.form + Math.round(answer.moraleChange / 2)));

    saveCareer(career);
    return answer;
}

// ============================================================
// 5) نظام حب الجماهير
// ============================================================
function initFans(career) {
    if (career.fans === undefined) career.fans = 50;
}

function updateFans(career, rating, result) {
    initFans(career);
    let change = 0;

    if (rating >= 8) change += 5;
    else if (rating >= 6) change += 2;
    else if (rating <= 3) change -= 4;

    if (result === 'فوز') change += 3;
    else if (result === 'خسارة') change -= 2;

    career.fans = Math.max(0, Math.min(100, career.fans + change));
    return change;
}

// ============================================================
// 6) نظام الجوائز
// ============================================================
function calcSeasonAwards(career) {
    if (!career.calendar) return null;

    const played = career.calendar.filter(m => m.played);
    if (played.length === 0) return null;

    const totalGoals = played.reduce((s, m) => s + (m.playerGoals || 0), 0);
    const totalSaves = played.reduce((s, m) => s + (m.playerSaves || 0), 0);
    const ratings = played.filter(m => m.playerRating).map(m => m.playerRating);
    const avgRating = ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0;

    const isGK = career.position === 'حارس مرمى';

    return {
        topScorer: !isGK && totalGoals >= 50,
        topGoalkeeper: isGK && totalSaves >= 100,
        mvp: avgRating >= 8.0,
        totalGoals,
        totalSaves,
        avgRating: avgRating.toFixed(1)
    };
}

// ============================================================
// 7) نظام الإنجازات
// ============================================================
const ACHIEVEMENTS = [
    { id: 'first_match', name: 'أول مباراة', desc: 'لعبت أول مباراة رسمية', icon: '🎬' },
    { id: 'first_goal', name: 'أول هدف', desc: 'سجلت أول هدف في مسيرتك', icon: '⚽' },
    { id: 'first_save', name: 'أول تصدي', desc: 'قمت بأول تصدي رسمي', icon: '🧤' },
    { id: '10_goals', name: '10 أهداف', desc: 'سجلت 10 أهداف', icon: '🎯' },
    { id: '50_goals', name: '50 هدفاً', desc: 'سجلت 50 هدفاً', icon: '🔥' },
    { id: '100_goals', name: '100 هدف', desc: 'سجلت 100 هدف', icon: '💯' },
    { id: '50_saves', name: '50 تصدياً', desc: 'قمت بـ50 تصدياً', icon: '🛡️' },
    { id: 'rating_10', name: 'أداء مثالي', desc: 'حصلت على تقييم 10/10', icon: '⭐' },
    { id: 'first_win', name: 'أول فوز', desc: 'فزت في أول مباراة', icon: '🏆' },
    { id: 'national', name: 'المنتخب', desc: 'تم استدعاؤك للمنتخب', icon: '🌐' },
    { id: 'transfer', name: 'الانتقال الأول', desc: 'انتقلت لنادٍ جديد', icon: '💼' },
    { id: 'reputation_50', name: 'نجم صاعد', desc: 'وصلت سمعتك 50', icon: '🌟' }
];

function checkAchievements(career) {
    if (!career.achievements) career.achievements = [];
    const newlyUnlocked = [];

    const played = career.calendar ? career.calendar.filter(m => m.played) : [];
    const totalGoals = played.reduce((s, m) => s + (m.playerGoals || 0), 0);
    const totalSaves = played.reduce((s, m) => s + (m.playerSaves || 0), 0);
    const maxRating = Math.max(0, ...played.map(m => m.playerRating || 0));
    const wins = played.filter(m => m.myScore > m.oppScore).length;

    const checks = [
        { id: 'first_match', cond: played.length >= 1 },
        { id: 'first_goal', cond: totalGoals >= 1 },
        { id: 'first_save', cond: totalSaves >= 1 },
        { id: '10_goals', cond: totalGoals >= 10 },
        { id: '50_goals', cond: totalGoals >= 50 },
        { id: '100_goals', cond: totalGoals >= 100 },
        { id: '50_saves', cond: totalSaves >= 50 },
        { id: 'rating_10', cond: maxRating >= 10 },
        { id: 'first_win', cond: wins >= 1 },
        { id: 'national', cond: career.nationalTeam && career.nationalTeam.called },
        { id: 'reputation_50', cond: (career.reputation || 0) >= 50 }
    ];

    checks.forEach(c => {
        if (c.cond && !career.achievements.includes(c.id)) {
            career.achievements.push(c.id);
            newlyUnlocked.push(ACHIEVEMENTS.find(a => a.id === c.id));
        }
    });

    if (newlyUnlocked.length > 0) saveCareer(career);
    return newlyUnlocked;
}

// ============================================================
// 8) نظام الطقس
// ============================================================
const WEATHER_TYPES = ['صافٍ', 'ممطر', 'حار', 'بارد', 'غائم'];

function rollWeather() {
    return WEATHER_TYPES[Math.floor(Math.random() * WEATHER_TYPES.length)];
}

function getWeatherEffect(weather) {
    switch (weather) {
        case 'ممطر': return { shooting: -0.05, injury: +0.04, icon: '🌧️' };
        case 'حار': return { shooting: -0.02, fitness: -5, icon: '☀️' };
        case 'بارد': return { shooting: -0.03, injury: +0.02, icon: '❄️' };
        case 'غائم': return { shooting: 0, icon: '☁️' };
        default: return { shooting: +0.02, icon: '🌤️' };
    }
}

// ============================================================
// 9) نظام فريق الشباب
// ============================================================
function generateYouthSquad(career) {
    const country = career.country || 'مصر';
    const players = [];
    for (let i = 0; i < 8; i++) {
        const p = generatePlayer(country, null, 50 + Math.floor(Math.random() * 15));
        p.age = 16 + Math.floor(Math.random() * 3);
        p.isYouth = true;
        players.push(p);
    }
    return players;
}

function promoteYouthPlayer(career, youthName) {
    if (!career.youthSquad) return false;
    const idx = career.youthSquad.findIndex(p => p.name === youthName);
    if (idx === -1) return false;

    const youth = career.youthSquad.splice(idx, 1)[0];
    // نضيفه لقائمة الفريق الأول
    if (!career.squads[career.clubName]) career.squads[career.clubName] = [];
    career.squads[career.clubName].push({
        name: youth.name,
        nationality: youth.nationality,
        position: youth.position,
        stats: youth.stats,
        rating: youth.rating,
        age: youth.age,
        isPromoted: true
    });

    saveCareer(career);
    return true;
}

// ============================================================
// 10) شاشة التدريب
// ============================================================
function goToTraining() {
    if (!activeCareer) return;
    renderTrainingScreen();
    showScreen('screen-training');
}

function renderTrainingScreen() {
    if (!activeCareer) return;

    initFitness(activeCareer);
    const el = document.getElementById('training-body');
    if (!el) return;

    const isGK = activeCareer.position === 'حارس مرمى';
    const trainings = isGK ? TRAINING_TYPES.goalkeeper : TRAINING_TYPES.player;

    let html = `
        <div class="training-status">
            <div class="training-stat">
                <div class="label">اللياقة</div>
                <div class="value">${activeCareer.fitness}%</div>
            </div>
            <div class="training-stat">
                <div class="label">الفورم</div>
                <div class="value">${activeCareer.form}%</div>
            </div>
            <div class="training-stat">
                <div class="label">المعنويات</div>
                <div class="value">${activeCareer.morale}%</div>
            </div>
        </div>
    `;

    trainings.forEach(t => {
        html += `
            <button class="training-card" onclick="handleTraining('${t.key}')">
                <div class="training-icon">${t.icon}</div>
                <div class="training-info">
                    <div class="training-name">${t.name}</div>
                    <div class="training-desc">${t.desc}</div>
                </div>
            </button>
        `;
    });

    el.innerHTML = html;
}

function handleTraining(trainingKey) {
    if (!activeCareer) return;
    const result = doTraining(activeCareer, trainingKey);
    if (result) {
        showToast(result.message + (result.gain ? ' — ' + result.gain : ''));
        if (typeof playSuccessSound === 'function') playSuccessSound();
        renderTrainingScreen();
    }
}

// ============================================================
// 11) شاشة الإعلام
// ============================================================
let currentMediaQuestion = null;

function goToMedia() {
    if (!activeCareer) return;
    currentMediaQuestion = getRandomMediaQuestion();
    renderMediaScreen();
    showScreen('screen-media');
}

function renderMediaScreen() {
    if (!activeCareer || !currentMediaQuestion) return;

    const el = document.getElementById('media-body');
    if (!el) return;

    let html = `
        <div class="media-press">
            <div class="media-journalist">📰 الصحافة الرياضية</div>
            <div class="media-question">${currentMediaQuestion.question}</div>
        </div>
        <div class="media-answers">
    `;

    currentMediaQuestion.answers.forEach((a, i) => {
        html += `<button class="media-answer" onclick="handleMediaAnswer(${i})">${a.text}</button>`;
    });

    html += `</div>`;
    el.innerHTML = html;
}

function handleMediaAnswer(index) {
    if (!activeCareer || !currentMediaQuestion) return;
    const answer = answerMediaQuestion(activeCareer, index, currentMediaQuestion);
    if (answer) {
        showToast(`📰 ${answer.type} — السمعة ${answer.repChange >= 0 ? '+' : ''}${answer.repChange}`);
        currentMediaQuestion = null;
        goToMedia();
    }
}

// ============================================================
// 12) شاشة الإنجازات
// ============================================================
function goToAchievements() {
    if (!activeCareer) return;
    renderAchievementsScreen();
    showScreen('screen-achievements');
}

function renderAchievementsScreen() {
    if (!activeCareer) return;

    const el = document.getElementById('achievements-body');
    if (!el) return;

    const unlocked = activeCareer.achievements || [];

    let html = `
        <div class="achievements-progress">
            <div class="progress-text">${unlocked.length} / ${ACHIEVEMENTS.length}</div>
            <div class="progress-bar"><div class="progress-fill" style="width:${(unlocked.length / ACHIEVEMENTS.length) * 100}%"></div></div>
        </div>
        <div class="achievements-list">
    `;

    ACHIEVEMENTS.forEach(a => {
        const isUnlocked = unlocked.includes(a.id);
        html += `
            <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-icon">${isUnlocked ? a.icon : '🔒'}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${a.name}</div>
                    <div class="achievement-desc">${a.desc}</div>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    el.innerHTML = html;
}

// ============================================================
// 13) شاشة الجوائز
// ============================================================
function goToAwards() {
    if (!activeCareer) return;
    renderAwardsScreen();
    showScreen('screen-awards');
}

function renderAwardsScreen() {
    if (!activeCareer) return;

    const el = document.getElementById('awards-body');
    if (!el) return;

    const awards = calcSeasonAwards(activeCareer);
    const isGK = activeCareer.position === 'حارس مرمى';

    if (!awards) {
        el.innerHTML = '<div class="empty-message">لم تلعب أي مباراة بعد</div>';
        return;
    }

    let html = `<div class="awards-card">
        <div class="awards-header">الموسم ${activeCareer.season}</div>
        <div class="awards-row"><span>${isGK ? 'إجمالي التصديات' : 'إجمالي الأهداف'}</span><span>${isGK ? awards.totalSaves : awards.totalGoals}</span></div>
        <div class="awards-row"><span>متوسط التقييم</span><span>${awards.avgRating}</span></div>
    </div>`;

    // الجوائز المفتوحة
    if (awards.topScorer) {
        html += `<div class="award-badge gold">🥇 هداف الدوري</div>`;
    }
    if (awards.topGoalkeeper) {
        html += `<div class="award-badge gold">🥇 أفضل حارس</div>`;
    }
    if (awards.mvp) {
        html += `<div class="award-badge silver">⭐ أفضل لاعب في الدوري</div>`;
    }
    if (!awards.topScorer && !awards.topGoalkeeper && !awards.mvp) {
        html += `<div class="empty-message">لا جوائز حتى الآن — استمر في الأداء الجيد!</div>`;
    }

    el.innerHTML = html;
}

// ============================================================
// 14) شاشة الشباب
// ============================================================
function goToYouth() {
    if (!activeCoach && !activeCareer) return;
    const career = activeCoach || activeCareer;

    if (!career.youthSquad) {
        career.youthSquad = generateYouthSquad(career);
        saveCareer(career);
    }

    renderYouthScreen();
    showScreen('screen-youth');
}

function renderYouthScreen() {
    const career = activeCoach || activeCareer;
    if (!career) return;

    const el = document.getElementById('youth-body');
    if (!el) return;

    let html = `<div class="section-title">فريق الشباب (تحت 19)</div>`;

    (career.youthSquad || []).forEach(p => {
        const posIcon = p.position === 'حارس مرمى' ? '🧤' : p.position === 'جناح' ? '🏃' : p.position === 'لاعب دائرة' ? '🎯' : '💪';
        html += `
            <div class="youth-player">
                <div class="youth-info">
                    <span>${posIcon} ${p.name}</span>
                    <span class="youth-meta">${p.age} سنة | قوة ${p.rating}</span>
                </div>
                <button class="btn-promote" onclick="promotePlayer('${p.name}')">تصعيد</button>
            </div>
        `;
    });

    el.innerHTML = html;
}

function promotePlayer(name) {
    const career = activeCoach || activeCareer;
    if (!career) return;
    if (promoteYouthPlayer(career, name)) {
        showToast('🎉 تم تصعيد اللاعب للفريق الأول!');
        renderYouthScreen();
    }
}

