/* ============================================================
   HANDBALL CAREER HUB — محرك المحاكاة التفاعلية
   النسخة الكاملة النهائية (المرحلة 9)
   ============================================================ */

let currentMatch = null;

// ============================================================
// 1) قوالب السيناريوهات للمهاجمين
// ============================================================
const FIELD_SCENARIOS = [
    {
        text: 'أنت على انفراد بالحارس! اختر اتجاه التسديد.',
        choices: [
            { key: 'right', icon: '➡️', text: 'سدد يمين' },
            { key: 'left', icon: '⬅️', text: 'سدد يسار' },
            { key: 'high', icon: '⬆️', text: 'ارفع فوق' },
            { key: 'low', icon: '⬇️', text: 'سدد أسفل' }
        ]
    },
    {
        text: 'تستقبل الكرة من زميلك عند حافة منطقة الجزاء. الحارس يغطي الزاوية اليمنى.',
        choices: [
            { key: 'right', icon: '➡️', text: 'سدد يمين' },
            { key: 'left', icon: '⬅️', text: 'سدد يسار' },
            { key: 'high', icon: '⬆️', text: 'ارفع فوق' },
            { key: 'low', icon: '⬇️', text: 'سدد أسفل' }
        ]
    },
    {
        text: 'هجمة مرتدة! أنت تجري نحو المرمى بسرعة، والحارس يخرج لمواجهتك.',
        choices: [
            { key: 'right', icon: '➡️', text: 'سدد يمين' },
            { key: 'left', icon: '⬅️', text: 'سدد يسار' },
            { key: 'high', icon: '⬆️', text: 'ارفع فوق' },
            { key: 'low', icon: '⬇️', text: 'سدد أسفل' }
        ]
    },
    {
        text: 'رمية من 7 أمتار! الحارس يتحرك على خط المرمى.',
        choices: [
            { key: 'right', icon: '➡️', text: 'سدد يمين' },
            { key: 'left', icon: '⬅️', text: 'سدد يسار' },
            { key: 'high', icon: '⬆️', text: 'ارفع فوق' },
            { key: 'low', icon: '⬇️', text: 'سدد أسفل' }
        ]
    },
    {
        text: 'تخترق الدفاع وتقترب من المرمى. المدافع يضغط عليك.',
        choices: [
            { key: 'right', icon: '➡️', text: 'سدد يمين' },
            { key: 'left', icon: '⬅️', text: 'سدد يسار' },
            { key: 'high', icon: '⬆️', text: 'ارفع فوق' },
            { key: 'low', icon: '⬇️', text: 'سدد أسفل' }
        ]
    }
];

// ============================================================
// 2) قوالب السيناريوهات لحارس المرمى
// ============================================================
const GOALKEEPER_SCENARIOS = [
    {
        text: 'المهاجم يقترب منك ويسدد! اختر اتجاه تصديك.',
        choices: [
            { key: 'right', icon: '➡️', text: 'ارتمِ يمين' },
            { key: 'left', icon: '⬅️', text: 'ارتمِ يسار' },
            { key: 'high', icon: '⬆️', text: 'اقفز عالياً' },
            { key: 'low', icon: '⬇️', text: 'انزل للأسفل' }
        ]
    },
    {
        text: 'الجناح يسدد من الزاوية الضيقة!',
        choices: [
            { key: 'right', icon: '➡️', text: 'ارتمِ يمين' },
            { key: 'left', icon: '⬅️', text: 'ارتمِ يسار' },
            { key: 'high', icon: '⬆️', text: 'اقفز عالياً' },
            { key: 'low', icon: '⬇️', text: 'انزل للأسفل' }
        ]
    },
    {
        text: 'رمية من 7 أمتار! اللاعب ينظر نحو الزاوية اليسرى.',
        choices: [
            { key: 'right', icon: '➡️', text: 'ارتمِ يمين' },
            { key: 'left', icon: '⬅️', text: 'ارتمِ يسار' },
            { key: 'high', icon: '⬆️', text: 'اقفز عالياً' },
            { key: 'low', icon: '⬇️', text: 'انزل للأسفل' }
        ]
    },
    {
        text: 'هجمة مرتدة! لاعب سريع ينفرد بك.',
        choices: [
            { key: 'right', icon: '➡️', text: 'ارتمِ يمين' },
            { key: 'left', icon: '⬅️', text: 'ارتمِ يسار' },
            { key: 'high', icon: '⬆️', text: 'اقفز عالياً' },
            { key: 'low', icon: '⬇️', text: 'انزل للأسفل' }
        ]
    }
];

// ============================================================
// 3) حساب احتمالات التسجيل (اللاعب)
// ============================================================
function calcGoalProbability(career, choiceKey) {
    const mainStat = career.stats.shooting;
    const oppStrength = currentMatch.opponentStrength || 70;
    const myStrength = career.clubStrength || 70;
    const pressure = (oppStrength - myStrength) / 200;

    const baseProbabilities = {
        right: 0.50,
        left: 0.48,
        high: 0.38,
        low: 0.55
    };

    const statBonus = ((mainStat - 60) / 39) * 0.25;
    let prob = baseProbabilities[choiceKey] + statBonus - pressure;

    // تأثير اللياقة والفورم (المرحلة 9)
    if (typeof getFitnessMultiplier === 'function') {
        prob *= getFitnessMultiplier(career);
    }
    if (typeof getFormMultiplier === 'function') {
        prob *= getFormMultiplier(career);
    }

    // تأثير الطقس (المرحلة 9)
    if (career.weather && typeof getWeatherEffect === 'function') {
        const eff = getWeatherEffect(career.weather);
        if (eff.shooting) prob += eff.shooting;
    }

    prob = Math.max(0.10, Math.min(0.85, prob));
    return prob;
}

// ============================================================
// 4) حساب احتمالات التصدي (الحارس)
// ============================================================
function calcSaveProbability(career, choiceKey) {
    const mainStat = career.stats.saving;
    const oppStrength = currentMatch.opponentStrength || 70;
    const myStrength = career.clubStrength || 70;
    const pressure = (myStrength - oppStrength) / 200;

    const baseProbabilities = {
        right: 0.45,
        left: 0.43,
        high: 0.35,
        low: 0.50
    };

    const statBonus = ((mainStat - 60) / 39) * 0.30;
    let prob = baseProbabilities[choiceKey] + statBonus - pressure;

    // تأثير اللياقة والفورم (المرحلة 9)
    if (typeof getFitnessMultiplier === 'function') {
        prob *= getFitnessMultiplier(career);
    }
    if (typeof getFormMultiplier === 'function') {
        prob *= getFormMultiplier(career);
    }

    prob = Math.max(0.10, Math.min(0.80, prob));
    return prob;
}

// ============================================================
// 5) حل القرار (نتيجة الاختيار)
// ============================================================
function resolveChoice(career, choiceKey) {
    const isGK = career.position === 'حارس مرمى';
    const prob = isGK
        ? calcSaveProbability(career, choiceKey)
        : calcGoalProbability(career, choiceKey);

    const roll = Math.random();

    if (roll < prob) {
        return isGK
            ? { outcome: 'save', label: '🛡️ تصدي رائع!', points: 3 }
            : { outcome: 'goal', label: '⚽ هدددف!', points: 3 };
    } else if (roll < prob + 0.15) {
        return isGK
            ? { outcome: 'save', label: '🛡️ تصدي بصعوبة!', points: 2 }
            : { outcome: 'goal', label: '⚽ هدف بصعوبة!', points: 2 };
    } else {
        return isGK
            ? { outcome: 'miss', label: '❌ هدف في مرماك', points: -1 }
            : { outcome: 'miss', label: '❌ أضعت الكرة!', points: -1 };
    }
}

// ============================================================
// 6) حساب عدد القرارات في المباراة (7-20)
// ============================================================
function calcMatchDecisions(career) {
    const isGK = career.position === 'حارس مرمى';
    const mainStat = isGK ? career.stats.saving : career.stats.shooting;

    const base = 7;
    const statBonus = Math.floor(((mainStat - 60) / 39) * 10);
    const randomBonus = Math.floor(Math.random() * 4);

    let total = base + statBonus + randomBonus;

    // تأثير اللياقة على عدد القرارات (اللاعب المتعب يلعب أقل)
    if (typeof getFitnessMultiplier === 'function') {
        total = Math.round(total * getFitnessMultiplier(career));
    }

    return Math.min(20, Math.max(5, total));
}

// ============================================================
// 7) بدء المباراة
// ============================================================
function startMatch(matchData) {
    if (!activeCareer) return;

    // تحديث الطقس لكل مباراة
    if (typeof rollWeather === 'function') {
        activeCareer.weather = rollWeather();
    }

    const totalDecisions = calcMatchDecisions(activeCareer);

    currentMatch = {
        matchData: matchData,
        opponent: matchData.opponent,
        opponentStrength: matchData.opponentStrength,
        myClub: activeCareer.clubName,
        isHome: matchData.isHome,

        myScore: 0,
        oppScore: 0,

        elapsedSeconds: 0,
        totalSeconds: 90,
        matchMinute: 1,
        totalMatchMinutes: 60,

        decisionsTotal: totalDecisions,
        decisionsMade: 0,
        currentScenario: null,

        goals: 0,
        saves: 0,
        misses: 0,
        ratingPoints: 0,

        isFinished: false,
        waitingForChoice: false,
        timerInterval: null,
        lastOppGoalCheck: 0
    };

    document.getElementById('match-my-club').textContent = currentMatch.myClub;
    document.getElementById('match-opp-club').textContent = currentMatch.opponent;
    document.getElementById('match-my-score').textContent = '0';
    document.getElementById('match-opp-score').textContent = '0';
    document.getElementById('match-clock').textContent = '00:00';
    document.getElementById('match-progress').style.width = '0%';
    document.getElementById('match-final').style.display = 'none';

    showScreen('screen-match');

    nextScenario();
    startMatchTimer();
}

// ============================================================
// 8) المؤقّت (90 ثانية)
// ============================================================
function startMatchTimer() {
    if (currentMatch.timerInterval) {
        clearInterval(currentMatch.timerInterval);
    }

    currentMatch.timerInterval = setInterval(() => {
        if (!currentMatch || currentMatch.isFinished) return;
        if (currentMatch.waitingForChoice) return;

        currentMatch.elapsedSeconds += 0.1;

        const sec = Math.floor(currentMatch.elapsedSeconds);
        const mm = String(Math.floor(sec / 60)).padStart(2, '0');
        const ss = String(sec % 60).padStart(2, '0');
        document.getElementById('match-clock').textContent = `${mm}:${ss}`;

        const progress = (currentMatch.elapsedSeconds / currentMatch.totalSeconds) * 100;
        document.getElementById('match-progress').style.width = Math.min(100, progress) + '%';

        currentMatch.matchMinute = Math.min(
            currentMatch.totalMatchMinutes,
            Math.floor((currentMatch.elapsedSeconds / currentMatch.totalSeconds) * currentMatch.totalMatchMinutes) + 1
        );

        simulateOpponentGoals();

        if (currentMatch.elapsedSeconds >= currentMatch.totalSeconds) {
            endMatch();
        }
    }, 100);
}

// ============================================================
// 9) محاكاة أهداف المنافس
// ============================================================
function simulateOpponentGoals() {
    if (!currentMatch) return;
    if (currentMatch.elapsedSeconds - currentMatch.lastOppGoalCheck < 1) return;
    currentMatch.lastOppGoalCheck = currentMatch.elapsedSeconds;

    const oppAttackStrength = currentMatch.opponentStrength / 100;
    const myDefenseStrength = activeCareer.clubStrength / 100;

    const goalChance = (oppAttackStrength - myDefenseStrength * 0.5) * 0.08;
    const chance = Math.max(0, Math.min(0.15, goalChance));

    if (Math.random() < chance) {
        currentMatch.oppScore++;
        document.getElementById('match-opp-score').textContent = currentMatch.oppScore;
    }
}

// ============================================================
// 10) السيناريو التالي
// ============================================================
function nextScenario() {
    if (!currentMatch || currentMatch.isFinished) return;

    if (currentMatch.decisionsMade >= currentMatch.decisionsTotal) {
        return;
    }

    const isGK = activeCareer.position === 'حارس مرمى';
    const scenarios = isGK ? GOALKEEPER_SCENARIOS : FIELD_SCENARIOS;
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

    currentMatch.currentScenario = scenario;
    currentMatch.waitingForChoice = true;

    document.getElementById('match-minute').textContent = `الدقيقة ${currentMatch.matchMinute}`;
    document.getElementById('match-scenario-text').textContent = scenario.text;

    const choicesEl = document.getElementById('match-choices');
    choicesEl.innerHTML = scenario.choices.map(c => `
        <button class="choice-btn" onclick="makeChoice('${c.key}')">
            <span class="choice-icon">${c.icon}</span>
            <span class="choice-text">${c.text}</span>
        </button>
    `).join('');
}

// ============================================================
// 11) تنفيذ القرار (مع الأصوات)
// ============================================================
function makeChoice(choiceKey) {
    if (!currentMatch || !currentMatch.waitingForChoice) return;

    currentMatch.waitingForChoice = false;
    currentMatch.decisionsMade++;

    document.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);

    const result = resolveChoice(activeCareer, choiceKey);

    if (result.outcome === 'goal') {
        currentMatch.goals++;
        currentMatch.myScore++;
        currentMatch.ratingPoints += result.points;
        document.getElementById('match-my-score').textContent = currentMatch.myScore;
        if (typeof playGoalSound === 'function') playGoalSound();
    } else if (result.outcome === 'save') {
        currentMatch.saves++;
        currentMatch.ratingPoints += result.points;
        if (typeof playSaveSound === 'function') playSaveSound();
    } else {
        currentMatch.misses++;
        currentMatch.ratingPoints += result.points;
        if (typeof playMissSound === 'function') playMissSound();

        if (activeCareer.position !== 'حارس مرمى') {
            if (Math.random() < 0.5) {
                currentMatch.oppScore++;
                document.getElementById('match-opp-score').textContent = currentMatch.oppScore;
            }
        } else {
            currentMatch.oppScore++;
            document.getElementById('match-opp-score').textContent = currentMatch.oppScore;
        }
    }

    const outcomeClass = result.outcome === 'goal' ? 'outcome-goal'
                       : result.outcome === 'save' ? 'outcome-save'
                       : 'outcome-miss';

    document.getElementById('match-scenario-text').innerHTML = `
        ${currentMatch.currentScenario.text}
        <div class="match-outcome-badge ${outcomeClass}">${result.label}</div>
    `;

    setTimeout(() => {
        if (!currentMatch || currentMatch.isFinished) return;

        if (currentMatch.decisionsMade >= currentMatch.decisionsTotal) {
            document.getElementById('match-choices').innerHTML = '';
        } else {
            nextScenario();
        }
    }, 1200);
}

// ============================================================
// 12) نهاية المباراة (كل التأثيرات مدمجة)
// ============================================================
function endMatch() {
    if (!currentMatch || currentMatch.isFinished) return;

    currentMatch.isFinished = true;
    currentMatch.waitingForChoice = false;
    clearInterval(currentMatch.timerInterval);

    document.getElementById('match-choices').innerHTML = '';

    // حساب التقييم النهائي (1-10)
    let rating;
    if (activeCareer.position === 'حارس مرمى') {
        rating = Math.max(1, Math.min(10,
            Math.round((currentMatch.saves / 2) + (currentMatch.ratingPoints / 5) + 3)
        ));
    } else {
        rating = Math.max(1, Math.min(10,
            Math.round((currentMatch.goals * 0.8) + (currentMatch.ratingPoints / 5) + 3)
        ));
    }

    // منح النقاط
    const pointsEarned = awardMatchPoints(
        activeCareer,
        rating,
        currentMatch.goals,
        currentMatch.saves
    );

    // الراتب الأسبوعي
    const weeklySalary = activeCareer.contract
        ? activeCareer.contract.salary
        : (typeof calcSalary === 'function' ? calcSalary(activeCareer) : 0);
    activeCareer.money = (activeCareer.money || 0) + weeklySalary;

    // السمعة حسب التقييم
    let repGain = 0;
    if (rating >= 9) repGain = 5;
    else if (rating >= 7) repGain = 3;
    else if (rating >= 5) repGain = 1;
    else if (rating <= 3) repGain = -1;

    if (typeof addReputation === 'function') {
        addReputation(activeCareer, repGain);
    }

    // ===== تأثيرات المرحلة 9 =====
    if (typeof consumeFitness === 'function') {
        consumeFitness(activeCareer, currentMatch.decisionsMade);
    }
    if (typeof updateForm === 'function') {
        updateForm(activeCareer, rating);
    }
    if (typeof initFans === 'function') {
        const result = currentMatch.myScore > currentMatch.oppScore ? 'فوز'
                     : currentMatch.myScore < currentMatch.oppScore ? 'خسارة' : 'تعادل';
        updateFans(activeCareer, rating, result);
    }

    // محاولة إصابة
    let newInjury = null;
    if (typeof rollInjury === 'function') {
        newInjury = rollInjury(activeCareer);
    }

    // تحديث الإنجازات
    if (typeof checkAchievements === 'function') {
        checkAchievements(activeCareer);
    }

    // تحديث بيانات المباراة في التقويم
    const matchInCalendar = activeCareer.calendar.find(m =>
        m.day === currentMatch.matchData.day &&
        m.month === currentMatch.matchData.month &&
        m.year === currentMatch.matchData.year &&
        m.opponent === currentMatch.matchData.opponent
    );
    if (matchInCalendar) {
        matchInCalendar.played = true;
        matchInCalendar.myScore = currentMatch.myScore;
        matchInCalendar.oppScore = currentMatch.oppScore;
        matchInCalendar.playerRating = rating;
        matchInCalendar.playerGoals = currentMatch.goals;
        matchInCalendar.playerSaves = currentMatch.saves;
    }

    // محاولة استدعاء للمنتخب
    let newCallup = false;
    if (typeof checkNationalCallup === 'function') {
        newCallup = checkNationalCallup(activeCareer);
    }

    // محاولة توليد عروض
    let gotOffers = false;
    if (typeof maybeGenerateOffers === 'function') {
        gotOffers = maybeGenerateOffers(activeCareer);
    }

    saveCareer(activeCareer);

    // عرض النتيجة النهائية
    document.getElementById('match-final-score').textContent =
        `${currentMatch.myScore} - ${currentMatch.oppScore}`;

    const resultText = currentMatch.myScore > currentMatch.oppScore ? '🏆 فوز'
                     : currentMatch.myScore < currentMatch.oppScore ? '😔 خسارة'
                     : '🤝 تعادل';
    document.getElementById('match-final-title').textContent = resultText;

    const isGK = activeCareer.position === 'حارس مرمى';

    let extraNotices = '';

    if (newInjury) {
        extraNotices += `<div class="final-stat-row" style="color:#e63946;font-weight:bold;">
            <span>🩹 إصابة: ${newInjury.name}</span>
            <span>${newInjury.daysRemaining} يوم</span>
        </div>`;
    }
    if (newCallup) {
        extraNotices += `<div class="final-stat-row" style="color:#06d6a0;font-weight:bold;">
            <span>🎉 تم استدعاؤك للمنتخب!</span>
            <span>${activeCareer.nationality}</span>
        </div>`;
    }
    if (gotOffers) {
        extraNotices += `<div class="final-stat-row" style="color:#ffd60a;font-weight:bold;">
            <span>💼 وصلت عروض جديدة!</span>
            <span>افتح صفحة العروض</span>
        </div>`;
    }

    const fitnessAfter = activeCareer.fitness || 100;
    const formAfter = activeCareer.form || 70;

    const statsHTML = `
        <div class="final-stat-row">
            <span>${isGK ? 'التصديات' : 'الأهداف'}</span>
            <span>${isGK ? currentMatch.saves : currentMatch.goals}</span>
        </div>
        <div class="final-stat-row">
            <span>${isGK ? 'الأهداف في مرماك' : 'الفرص الضائعة'}</span>
            <span>${isGK ? currentMatch.oppScore : currentMatch.misses}</span>
        </div>
        <div class="final-stat-row">
            <span>تقييمك في المباراة</span>
            <span>${rating} / 10</span>
        </div>
        <div class="final-stat-row">
            <span>النقاط المكتسبة</span>
            <span>+${pointsEarned}</span>
        </div>
        <div class="final-stat-row">
            <span>الراتب الأسبوعي</span>
            <span>+$${weeklySalary.toLocaleString()}</span>
        </div>
        <div class="final-stat-row">
            <span>السمعة</span>
            <span>${repGain >= 0 ? '+' : ''}${repGain}</span>
        </div>
        <div class="final-stat-row">
            <span>اللياقة بعد المباراة</span>
            <span>${fitnessAfter}%</span>
        </div>
        <div class="final-stat-row">
            <span>الفورم</span>
            <span>${formAfter}%</span>
        </div>
        ${extraNotices}
    `;
    document.getElementById('match-final-stats').innerHTML = statsHTML;

    // صوت الصافرة النهائية
    if (typeof playWhistleSound === 'function') playWhistleSound();

    document.getElementById('match-final').style.display = 'flex';
}

// ============================================================
// 13) العودة للكارير
// ============================================================
function closeMatchAndReturn() {
    if (currentMatch && currentMatch.timerInterval) {
        clearInterval(currentMatch.timerInterval);
    }

    // إعادة تحميل الكارير من التخزين للتأكد من أحدث البيانات
    if (activeCareer) {
        const fresh = getAllCareers().find(c => c.id === activeCareer.id);
        if (fresh) activeCareer = fresh;
    }

    currentMatch = null;
    renderCareerScreen();
    showScreen('screen-career');
}