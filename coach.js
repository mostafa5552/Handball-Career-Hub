/* ============================================================
   HANDBALL CAREER HUB — منطق مهنة المدرب
   ============================================================ */

let activeCoach = null;

// ============================================================
// 1) إنشاء مدرب جديد
// ============================================================
function createCoach(name, nationality, leagueId, clubName) {
    const league = getLeagueById(leagueId);
    const club = getClubByName(leagueId, clubName);
    if (!league || !club) return null;

    const coach = {
        id: generateId(),
        type: 'coach',
        coachName: name,
        nationality: nationality,
        leagueId: leagueId,
        leagueName: league.name,
        clubName: club.name,
        clubStrength: club.strength,
        country: league.country,
        createdAt: Date.now(),

        // مهارات المدرب
        stats: {
            tactics: 60,
            motivation: 60,
            negotiation: 60,
            fitness: 60,
            youth: 60
        },
        totalRating: 60,
        points: 0,
        reputation: 0,

        // التكتيك الحالي
        tactic: 'متوازن', // هجومي / دفاعي / متوازن
        formation: null,  // التشكيل الأساسي

        // التقويم
        season: '2026/2027',
        day: 25,
        month: 9,
        year: 2026,

        // الإحصائيات
        wins: 0,
        draws: 0,
        losses: 0,
        matchesManaged: 0
    };

    // توليد قوائم اللاعبين
    coach.squads = {};
    const clubs = getClubsByLeague(leagueId);
    clubs.forEach(c => {
        coach.squads[c.name] = generateSquad(leagueId, c.name, c.strength, league.country);
    });

    // جدول الدوري
    coach.leagueTable = buildLeagueTable(coach);

    // بطولات
    initSeasonCompetitions(coach);

    // اختيار التشكيل الأولي (7 لاعبين)
    coach.formation = selectBestSeven(coach.squads[coach.clubName]);

    saveCareer(coach);
    return coach;
}

// ============================================================
// 2) اختيار أفضل 7 لاعبين (تشكيل افتراضي)
// ============================================================
function selectBestSeven(squad) {
    if (!squad || squad.length === 0) return [];

    // ترتيب حسب التقييم
    const sorted = [...squad].sort((a, b) => b.rating - a.rating);

    // اختيار: حارس + 6 لاعبين ميدانيين
    const goalkeeper = sorted.find(p => p.position === 'حارس مرمى');
    const fieldPlayers = sorted.filter(p => p.position !== 'حارس مرمى').slice(0, 6);

    return [goalkeeper, ...fieldPlayers].filter(Boolean);
}

// ============================================================
// 3) فتح كارير المدرب
// ============================================================
function openCoachCareer(careerId) {
    const coach = getAllCareers().find(c => c.id === careerId);
    if (!coach) return;

    if (!coach.calendar) {
        coach.calendar = generateSeasonCalendar(coach);
        saveCareer(coach);
    }

    activeCoach = coach;
    renderCoachScreen();
    showScreen('screen-coach');
}

// ============================================================
// 4) عرض شاشة المدرب
// ============================================================
function renderCoachScreen() {
    if (!activeCoach) return;

    // التاريخ
    const dateEl = document.getElementById('coach-date');
    if (dateEl) {
        dateEl.textContent = formatDate(activeCoach.day, activeCoach.month, activeCoach.year);
    }

    // معلومات المدرب
    const infoEl = document.getElementById('coach-info');
    if (infoEl) {
        const flag = getNationalityFlag(activeCoach.nationality);
        infoEl.innerHTML = `
            <div class="career-name">${activeCoach.coachName}</div>
            <div class="career-sub">${activeCoach.clubName} — ${activeCoach.leagueName}</div>
            <div class="career-sub">مدرب | ${flag} ${activeCoach.nationality}</div>
        `;
    }

    // الإحصائيات
    const ratingEl = document.getElementById('coach-rating');
    if (ratingEl) ratingEl.textContent = activeCoach.totalRating;

    const pointsEl = document.getElementById('coach-points');
    if (pointsEl) pointsEl.textContent = activeCoach.points;

    // سجل المباريات
    const recordEl = document.getElementById('coach-record');
    if (recordEl) {
        recordEl.textContent = `${activeCoach.wins}ف - ${activeCoach.draws}ت - ${activeCoach.losses}خ`;
    }

    // الزر الرئيسي
    const actionBtn = document.getElementById('coach-action-btn');
    if (actionBtn) {
        const matchToday = getMatchToday(activeCoach);
        if (matchToday) {
            actionBtn.textContent = `⚽ دخول المباراة ضد ${matchToday.opponent}`;
            actionBtn.classList.add('btn-match');
        } else {
            actionBtn.textContent = '⏭️ تخطي اليوم';
            actionBtn.classList.remove('btn-match');
        }
    }

    // آخر المباريات
    renderCoachRecentMatches();
}

// ============================================================
// 5) زر العمل (تخطي يوم / مباراة)
// ============================================================
function handleCoachAction() {
    if (!activeCoach) return;
    const matchToday = getMatchToday(activeCoach);

    if (matchToday) {
        startCoachMatch(matchToday);
    } else {
        advanceDay(activeCoach);
        simulateLeagueDay(activeCoach);
        saveCareer(activeCoach);
        renderCoachScreen();
    }
}

// ============================================================
// 6) آخر المباريات
// ============================================================
function renderCoachRecentMatches() {
    const el = document.getElementById('coach-recent-matches');
    if (!el || !activeCoach.calendar) return;

    const played = activeCoach.calendar.filter(m => m.played).slice(-5).reverse();

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
// 7) تطوير المدرب (نفس منطق اللاعب لكن مهارات مختلفة)
// ============================================================
function getCoachStatName(key) {
    const names = {
        tactics: 'التكتيك',
        motivation: 'التحفيز',
        negotiation: 'التفاوض',
        fitness: 'البدنية',
        youth: 'تطوير الشباب'
    };
    return names[key] || key;
}

function goToCoachDevelopment() {
    if (!activeCoach) return;
    renderCoachDevelopmentScreen();
    showScreen('screen-coach-development');
}

function renderCoachDevelopmentScreen() {
    if (!activeCoach) return;

    const stats = Object.keys(activeCoach.stats);
    const el = document.getElementById('coach-development-stats');
    if (!el) return;

    el.innerHTML = stats.map(key => {
        const value = activeCoach.stats[key];
        const cost = getUpgradeCost(value);
        const canAfford = activeCoach.points >= cost && value < 99;
        return `
            <div class="stat-row">
                <div class="stat-info">
                    <span class="stat-name">${getCoachStatName(key)}</span>
                    <span class="stat-value">${value}</span>
                </div>
                <div class="stat-bar">
                    <div class="stat-bar-fill" style="width:${value}%"></div>
                </div>
                <button class="btn-upgrade ${canAfford ? '' : 'disabled'}"
                        onclick="tryCoachUpgrade('${key}')">
                    تطوير (${cost} نقطة)
                </button>
            </div>
        `;
    }).join('');

    const pointsEl = document.getElementById('coach-dev-points');
    if (pointsEl) pointsEl.textContent = activeCoach.points;

    const ratingEl = document.getElementById('coach-dev-rating');
    if (ratingEl) ratingEl.textContent = activeCoach.totalRating;
}

function tryCoachUpgrade(statKey) {
    if (!activeCoach) return;
    const currentValue = activeCoach.stats[statKey];
    const cost = getUpgradeCost(currentValue);

    if (activeCoach.points < cost) {
        showToast(`تحتاج ${cost} نقطة، لديك ${activeCoach.points} فقط.`);
        return;
    }

    if (currentValue >= 99) {
        showToast('هذه المهارة وصلت للحد الأقصى (99).');
        return;
    }

    activeCoach.points -= cost;
    activeCoach.stats[statKey] = currentValue + 1;

    const values = Object.values(activeCoach.stats);
    activeCoach.totalRating = Math.round(values.reduce((a, b) => a + b, 0) / values.length);

    saveCareer(activeCoach);
    showToast(`تم تطوير ${getCoachStatName(statKey)} إلى ${currentValue + 1}!`);
    renderCoachDevelopmentScreen();
}

// ============================================================
// 8) شاشة التشكيل
// ============================================================
function goToFormation() {
    if (!activeCoach) return;
    renderFormationScreen();
    showScreen('screen-formation');
}

function renderFormationScreen() {
    if (!activeCoach) return;

    const el = document.getElementById('formation-body');
    if (!el) return;

    const squad = activeCoach.squads[activeCoach.clubName] || [];
    const selectedIds = (activeCoach.formation || []).map(p => p.name);

    let html = `<div class="section-title">التشكيل الأساسي (7 لاعبين)</div>`;

    // اللاعبون المختارون
    html += `<div class="formation-list">`;
    (activeCoach.formation || []).forEach((p, i) => {
        const posIcon = p.position === 'حارس مرمى' ? '🧤' : p.position === 'جناح' ? '🏃' : p.position === 'لاعب دائرة' ? '🎯' : '💪';
        html += `
            <div class="formation-player selected">
                <span>${posIcon} ${p.name}</span>
                <span class="formation-rating">${p.rating}</span>
            </div>
        `;
    });
    html += `</div>`;

    // باقي اللاعبين (للتبديل)
    html += `<div class="section-title">باقي الفريق</div>`;
    html += `<div class="formation-list">`;
    squad.filter(p => !selectedIds.includes(p.name)).forEach(p => {
        const posIcon = p.position === 'حارس مرمى' ? '🧤' : p.position === 'جناح' ? '🏃' : p.position === 'لاعب دائرة' ? '🎯' : '💪';
        html += `
            <div class="formation-player" onclick="swapFormationPlayer('${p.name}')">
                <span>${posIcon} ${p.name}</span>
                <span class="formation-rating">${p.rating}</span>
            </div>
        `;
    });
    html += `</div>`;

    // التكتيك
    html += `<div class="section-title">التكتيك</div>`;
    html += `<div class="tactic-row">`;
    ['هجومي', 'متوازن', 'دفاعي'].forEach(t => {
        const isActive = activeCoach.tactic === t;
        html += `<button class="tactic-btn ${isActive ? 'active' : ''}" onclick="setTactic('${t}')">${t}</button>`;
    });
    html += `</div>`;

    el.innerHTML = html;
}

function setTactic(tactic) {
    if (!activeCoach) return;
    activeCoach.tactic = tactic;
    saveCareer(activeCoach);
    renderFormationScreen();
}

function swapFormationPlayer(playerName) {
    if (!activeCoach) return;
    const squad = activeCoach.squads[activeCoach.clubName];
    const player = squad.find(p => p.name === playerName);
    if (!player) return;

    // استبدل أضعف لاعب في التشكيل
    const sorted = [...activeCoach.formation].sort((a, b) => a.rating - b.rating);
    const weakest = sorted[0];

    // لا تبدل حارساً بلاعب ميداني أو العكس
    if ((weakest.position === 'حارس مرمى') !== (player.position === 'حارس مرمى')) {
        showToast('لا يمكن تبديل حارس بلاعب ميداني');
        return;
    }

    const idx = activeCoach.formation.indexOf(weakest);
    activeCoach.formation[idx] = player;

    saveCareer(activeCoach);
    renderFormationScreen();
}

// ============================================================
// 9) قوة الفريق الفعلية (تتأثر بالتشكيل والتكتيك)
// ============================================================
function calcTeamStrength(coach) {
    if (!coach.formation || coach.formation.length === 0) {
        return coach.clubStrength;
    }

    // متوسط تقييم التشكيل
    const avgRating = coach.formation.reduce((sum, p) => sum + p.rating, 0) / coach.formation.length;

    // تأثير التكتيك
    let tacticBonus = 0;
    if (coach.tactic === 'هجومي') tacticBonus = 3;
    else if (coach.tactic === 'دفاعي') tacticBonus = 2;
    else tacticBonus = 4;

    // تأثير مهارة التكتيك للمدرب
    const tacticsBonus = ((coach.stats.tactics - 60) / 39) * 5;

    // تأثير التحفيز
    const motivationBonus = ((coach.stats.motivation - 60) / 39) * 3;

    return Math.round(avgRating + tacticBonus + tacticsBonus + motivationBonus);
}

// ============================================================
// 10) راتب المدرب
// ============================================================
function calcCoachSalary(coach) {
    return Math.round((coach.clubStrength * 150) + (coach.totalRating * 200) + (coach.reputation * 300));
}

// ============================================================
// 11) مكافأة نقاط المدرب بعد المباراة
// ============================================================
function awardCoachPoints(coach, result, goalsFor, goalsAgainst) {
    let points = 0;

    if (result === 'win') points += 12;
    else if (result === 'draw') points += 6;
    else points += 3;

    // مكافأة الأداء الهجومي/الدفاعي
    const goalDiff = goalsFor - goalsAgainst;
    if (goalDiff > 5) points += 3;
    else if (goalDiff < -5) points -= 2;

    points = Math.max(2, Math.min(20, points));
    coach.points += points;
    return points;
}

