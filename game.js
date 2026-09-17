/* ============================================================
   HANDBALL CAREER HUB — كل دوال النظام
   النسخة الكاملة النهائية (المرحلة 9)
   ============================================================ */

// ============================================================
// 1) نظام الحفظ (Storage)
// ============================================================
const STORAGE_KEY = 'handball_career_hub_careers';

function getAllCareers() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}

function saveCareer(career) {
    const careers = getAllCareers();
    const index = careers.findIndex(c => c.id === career.id);
    if (index >= 0) {
        careers[index] = career;
    } else {
        careers.push(career);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(careers));
}

function deleteCareer(careerId) {
    const careers = getAllCareers().filter(c => c.id !== careerId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(careers));
}

function generateId() {
    return 'career_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
}

// ============================================================
// 2) واجهة المستخدم (UI Helpers)
// ============================================================
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) target.classList.add('active');
    window.scrollTo(0, 0);
}

function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ============================================================
// 3) التقويم (Calendar)
// ============================================================
const MONTHS_AR = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

const DAYS_AR = [
    'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'
];

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function getDayName(day, month, year) {
    const date = new Date(year, month - 1, day);
    return DAYS_AR[date.getDay()];
}

function formatDate(day, month, year) {
    return `${getDayName(day, month, year)} ${day} ${MONTHS_AR[month - 1]} ${year}`;
}

function advanceDay(career) {
    career.day++;
    const maxDays = daysInMonth(career.month, career.year);
    if (career.day > maxDays) {
        career.day = 1;
        career.month++;
        if (career.month > 12) {
            career.month = 1;
            career.year++;
        }
    }
    return career;
}

function generateSeasonCalendar(career) {
    const calendar = [];
    const clubs = getClubsByLeague(career.leagueId);
    const myClub = career.clubName;
    const opponents = clubs.filter(c => c.name !== myClub);

    let currentDay = 25;
    let currentMonth = 9;
    let currentYear = 2026;

    const totalMatches = opponents.length * 2;
    let opponentIndex = 0;
    let isHome = true;

    for (let i = 0; i < totalMatches; i++) {
        const gap = 5 + Math.floor(Math.random() * 4);

        calendar.push({
            type: 'league',
            matchNumber: i + 1,
            day: currentDay,
            month: currentMonth,
            year: currentYear,
            opponent: opponents[opponentIndex].name,
            opponentStrength: opponents[opponentIndex].strength,
            isHome: isHome,
            played: false,
            myScore: 0,
            oppScore: 0
        });

        currentDay += gap;
        while (currentDay > daysInMonth(currentMonth, currentYear)) {
            currentDay -= daysInMonth(currentMonth, currentYear);
            currentMonth++;
            if (currentMonth > 12) {
                currentMonth = 1;
                currentYear++;
            }
        }

        if (isHome) {
            isHome = false;
        } else {
            isHome = true;
            opponentIndex++;
            if (opponentIndex >= opponents.length) opponentIndex = 0;
        }
    }

    return calendar;
}

function getMatchToday(career) {
    if (!career.calendar) return null;
    return career.calendar.find(m =>
        !m.played &&
        m.day === career.day &&
        m.month === career.month &&
        m.year === career.year
    );
}

// ============================================================
// 4) التطوير (Development)
// ============================================================
function getUpgradeCost(currentLevel) {
    const level = currentLevel - 60;
    return 25 + (level * 5);
}

function upgradeStat(career, statKey) {
    const currentValue = career.stats[statKey];
    const cost = getUpgradeCost(currentValue);

    if (career.points < cost) {
        return { success: false, message: `تحتاج ${cost} نقطة، لديك ${career.points} فقط.` };
    }

    if (currentValue >= 99) {
        return { success: false, message: 'هذه الخاصية وصلت للحد الأقصى (99).' };
    }

    career.points -= cost;
    career.stats[statKey] = currentValue + 1;
    recalculateTotalRating(career);

    return { success: true, message: `تم تطوير ${getStatName(statKey, career.position)} إلى ${currentValue + 1}!` };
}

function recalculateTotalRating(career) {
    const values = Object.values(career.stats);
    career.totalRating = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

function getStatName(key, position) {
    const names = {
        shooting: 'التسديد',
        passing: 'التمرير',
        speed: 'السرعة',
        physical: 'البدنية',
        power: 'القوة',
        diving: 'الارتماء',
        saving: 'التصدي'
    };
    return names[key] || key;
}

function getStatsForPosition(position) {
    if (position === 'حارس مرمى') {
        return ['diving', 'passing', 'saving', 'physical', 'power'];
    }
    return ['shooting', 'passing', 'speed', 'physical', 'power'];
}

function awardMatchPoints(career, rating, goals, saves) {
    let points = 0;
    if (career.position === 'حارس مرمى') {
        points = Math.round(saves * 0.8) + Math.round(rating * 2);
    } else {
        points = Math.round(goals * 1.2) + Math.round(rating * 2);
    }
    points = Math.max(3, Math.min(20, points));
    career.points += points;
    return points;
}

// ============================================================
// 5) منطق الكارير (Career Logic)
// ============================================================
let activeCareer = null;

function openPlayerCareer(careerId) {
    const career = getAllCareers().find(c => c.id === careerId);
    if (!career) return;

    if (!career.calendar) {
        career.calendar = generateSeasonCalendar(career);
        saveCareer(career);
    }

    // تهيئة ميزات المرحلة 9 (لو غير مهيّأة)
    if (typeof initFitness === 'function') initFitness(career);
    if (typeof initFans === 'function') initFans(career);
    if (!career.achievements) career.achievements = [];
    if (!career.weather && typeof rollWeather === 'function') career.weather = rollWeather();
    if (!career.youthSquad && typeof generateYouthSquad === 'function') {
        career.youthSquad = generateYouthSquad(career);
    }

    activeCareer = career;
    renderCareerScreen();
    showScreen('screen-career');
}

function renderCareerScreen() {
    if (!activeCareer) return;

    const dateEl = document.getElementById('career-date');
    if (dateEl) {
        let dateText = formatDate(activeCareer.day, activeCareer.month, activeCareer.year);
        // إضافة أيقونة الطقس
        if (activeCareer.weather && typeof getWeatherEffect === 'function') {
            const eff = getWeatherEffect(activeCareer.weather);
            dateText += ` ${eff.icon || ''}`;
        }
        dateEl.textContent = dateText;
    }

    const infoEl = document.getElementById('career-player-info');
    if (infoEl) {
        const flag = getNationalityFlag(activeCareer.nationality);
        let injuryBadge = '';
        if (typeof isInjured === 'function' && isInjured(activeCareer)) {
            injuryBadge = `<div class="career-sub" style="color:#e63946;font-weight:bold;">
                🩹 مصاب: ${activeCareer.injury.name} (${activeCareer.injury.daysRemaining} يوم)
            </div>`;
        }

        // شريط اللياقة والفورم
        let fitnessBar = '';
        if (typeof initFitness === 'function') {
            initFitness(activeCareer);
            fitnessBar = `
                <div style="display:flex;gap:8px;margin-top:8px;font-size:0.75rem;">
                    <span style="color:#06d6a0;">لياقة: ${activeCareer.fitness}%</span>
                    <span style="color:#ffd60a;">فورم: ${activeCareer.form}%</span>
                    <span style="color:#ff6b35;">جماهير: ${activeCareer.fans || 50}%</span>
                </div>
            `;
        }

        infoEl.innerHTML = `
            <div class="career-name">${activeCareer.playerName}</div>
            <div class="career-sub">${activeCareer.clubName} — ${activeCareer.leagueName}</div>
            <div class="career-sub">${activeCareer.position} | ${flag} ${activeCareer.nationality}</div>
            ${injuryBadge}
            ${fitnessBar}
        `;
    }

    const ratingEl = document.getElementById('career-rating');
    if (ratingEl) ratingEl.textContent = activeCareer.totalRating;

    const pointsEl = document.getElementById('career-points');
    if (pointsEl) pointsEl.textContent = activeCareer.points;

    updateCareerActionButton();
    renderRecentMatches();
}

function updateCareerActionButton() {
    const actionBtn = document.getElementById('career-action-btn');
    if (!actionBtn) return;

    // لو مصاب
    if (typeof isInjured === 'function' && isInjured(activeCareer)) {
        actionBtn.textContent = `🩹 مصاب (${activeCareer.injury.daysRemaining} يوم)`;
        actionBtn.classList.remove('btn-match');
        return;
    }

    const matchToday = getMatchToday(activeCareer);

    if (matchToday) {
        actionBtn.textContent = `⚽ دخول المباراة ضد ${matchToday.opponent}`;
        actionBtn.classList.add('btn-match');
    } else {
        actionBtn.textContent = '⏭️ تخطي اليوم';
        actionBtn.classList.remove('btn-match');
    }
}

function handleCareerAction() {
    if (!activeCareer) return;

    // لو مصاب، لا يمكنه اللعب
    if (typeof isInjured === 'function' && isInjured(activeCareer)) {
        const injury = activeCareer.injury;
        alert(`🩹 أنت مصاب: ${injury.name}\nالمتبقي: ${injury.daysRemaining} أيام\n\nلن تتمكن من اللعب حتى تتعافى.`);
        return;
    }

    const matchToday = getMatchToday(activeCareer);

    if (matchToday) {
        startMatch(matchToday);
    } else {
        skipDay();
    }
}

function skipDay() {
    if (!activeCareer) return;

    // تعافي من الإصابات
    if (typeof recoverInjury === 'function' && activeCareer.injury) {
        const healed = recoverInjury(activeCareer, 1);
        if (healed) showToast('✅ شُفيت من الإصابة!');
    }

    // استعادة اللياقة تدريجياً (لو غير مصاب)
    if (typeof restoreFitness === 'function' && !activeCareer.injury) {
        restoreFitness(activeCareer, 3);
    }

    // تحديث الطقس كل يوم
    if (typeof rollWeather === 'function') {
        activeCareer.weather = rollWeather();
    }

    advanceDay(activeCareer);
    simulateLeagueDay(activeCareer);
    saveCareer(activeCareer);
    renderCareerScreen();
}

function saveAndExit() {
    if (activeCareer) saveCareer(activeCareer);
    activeCareer = null;
    showScreen('screen-main');
}

function renderRecentMatches() {
    const el = document.getElementById('career-recent-matches');
    if (!el || !activeCareer.calendar) return;

    const played = activeCareer.calendar.filter(m => m.played).slice(-5).reverse();

    if (played.length === 0) {
        el.innerHTML = '<div class="empty-message">لم تلعب أي مباراة بعد.</div>';
        return;
    }

    el.innerHTML = played.map(m => {
        const result = m.myScore > m.oppScore ? 'فوز' : (m.myScore < m.oppScore ? 'خسارة' : 'تعادل');
        const cls = m.myScore > m.oppScore ? 'win' : (m.myScore < m.oppScore ? 'loss' : 'draw');
        return `
            <div class="match-history-item ${cls}">
                <span>${m.opponent}</span>
                <span>${m.myScore} - ${m.oppScore}</span>
                <span class="result-tag">${result}</span>
            </div>
        `;
    }).join('');
}

// ============================================================
// 6) شاشة التطوير
// ============================================================
function goToDevelopment() {
    if (!activeCareer) return;
    renderDevelopmentScreen();
    showScreen('screen-development');
}

function renderDevelopmentScreen() {
    if (!activeCareer) return;

    const stats = getStatsForPosition(activeCareer.position);
    const el = document.getElementById('development-stats');
    if (!el) return;

    el.innerHTML = stats.map(key => {
        const value = activeCareer.stats[key];
        const cost = getUpgradeCost(value);
        const canAfford = activeCareer.points >= cost && value < 99;
        return `
            <div class="stat-row">
                <div class="stat-info">
                    <span class="stat-name">${getStatName(key, activeCareer.position)}</span>
                    <span class="stat-value">${value}</span>
                </div>
                <div class="stat-bar">
                    <div class="stat-bar-fill" style="width:${value}%"></div>
                </div>
                <button class="btn-upgrade ${canAfford ? '' : 'disabled'}"
                        onclick="tryUpgrade('${key}')">
                    تطوير (${cost} نقطة)
                </button>
            </div>
        `;
    }).join('');

    const pointsEl = document.getElementById('dev-points');
    if (pointsEl) pointsEl.textContent = activeCareer.points;

    const ratingEl = document.getElementById('dev-rating');
    if (ratingEl) ratingEl.textContent = activeCareer.totalRating;
}

function tryUpgrade(statKey) {
    if (!activeCareer) return;
    const result = upgradeStat(activeCareer, statKey);
    if (result.success) {
        saveCareer(activeCareer);
        showToast(result.message);
        if (typeof playSuccessSound === 'function') playSuccessSound();
        renderDevelopmentScreen();
    } else {
        showToast(result.message);
    }
}