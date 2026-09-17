/* ============================================================
   HANDBALL CAREER HUB — محاكاة مباريات المدرب
   ============================================================ */

let currentCoachMatch = null;

// ============================================================
// 1) بدء مباراة المدرب
// ============================================================
function startCoachMatch(matchData) {
    if (!activeCoach) return;

    const myStrength = calcTeamStrength(activeCoach);
    const oppStrength = matchData.opponentStrength;

    currentCoachMatch = {
        matchData: matchData,
        opponent: matchData.opponent,
        opponentStrength: oppStrength,
        myClub: activeCoach.clubName,
        myStrength: myStrength,

        myScore: 0,
        oppScore: 0,

        elapsedSeconds: 0,
        totalSeconds: 90,
        matchMinute: 1,

        // أحداث المباراة
        events: [],
        currentTactic: activeCoach.tactic,

        isFinished: false,
        timerInterval: null,
        lastGoalCheck: 0
    };

    // تحديث الواجهة
    document.getElementById('coach-match-my-club').textContent = activeCoach.clubName;
    document.getElementById('coach-match-opp-club').textContent = matchData.opponent;
    document.getElementById('coach-match-my-score').textContent = '0';
    document.getElementById('coach-match-opp-score').textContent = '0';
    document.getElementById('coach-match-clock').textContent = '00:00';
    document.getElementById('coach-match-progress').style.width = '0%';
    document.getElementById('coach-match-events').innerHTML = '<div class="empty-message">المباراة لم تبدأ بعد</div>';
    document.getElementById('coach-match-final').style.display = 'none';
    document.getElementById('coach-match-tactic-btn').textContent = `التكتيك: ${currentCoachMatch.currentTactic}`;

    showScreen('screen-coach-match');

    startCoachMatchTimer();
}

// ============================================================
// 2) مؤقّت مباراة المدرب
// ============================================================
function startCoachMatchTimer() {
    if (currentCoachMatch.timerInterval) {
        clearInterval(currentCoachMatch.timerInterval);
    }

    currentCoachMatch.timerInterval = setInterval(() => {
        if (!currentCoachMatch || currentCoachMatch.isFinished) return;

        currentCoachMatch.elapsedSeconds += 0.1;

        const sec = Math.floor(currentCoachMatch.elapsedSeconds);
        const mm = String(Math.floor(sec / 60)).padStart(2, '0');
        const ss = String(sec % 60).padStart(2, '0');
        document.getElementById('coach-match-clock').textContent = `${mm}:${ss}`;

        const progress = (currentCoachMatch.elapsedSeconds / currentCoachMatch.totalSeconds) * 100;
        document.getElementById('coach-match-progress').style.width = Math.min(100, progress) + '%';

        currentCoachMatch.matchMinute = Math.min(
            60,
            Math.floor((currentCoachMatch.elapsedSeconds / currentCoachMatch.totalSeconds) * 60) + 1
        );

        // محاكاة الأحداث كل ثانية
        if (currentCoachMatch.elapsedSeconds - currentCoachMatch.lastGoalCheck >= 1.5) {
            currentCoachMatch.lastGoalCheck = currentCoachMatch.elapsedSeconds;
            simulateCoachMatchEvent();
        }

        if (currentCoachMatch.elapsedSeconds >= currentCoachMatch.totalSeconds) {
            endCoachMatch();
        }
    }, 100);
}

// ============================================================
// 3) محاكاة حدث في المباراة
// ============================================================
function simulateCoachMatchEvent() {
    if (!currentCoachMatch) return;

    // تأثير التكتيك على قوة الفريق
    let myEffectiveStrength = currentCoachMatch.myStrength;
    if (currentCoachMatch.currentTactic === 'هجومي') myEffectiveStrength += 5;
    else if (currentCoachMatch.currentTactic === 'دفاعي') myEffectiveStrength -= 3;

    const myAttack = myEffectiveStrength / 100;
    const oppAttack = currentCoachMatch.opponentStrength / 100;

    // احتمال تسجيل فريقي
    const myChance = Math.max(0, Math.min(0.25, (myAttack - oppAttack * 0.4) * 0.15));
    // احتمال تسجيل المنافس
    const oppChance = Math.max(0, Math.min(0.25, (oppAttack - myAttack * 0.4) * 0.15));

    const roll = Math.random();

    if (roll < myChance) {
        currentCoachMatch.myScore++;
        document.getElementById('coach-match-my-score').textContent = currentCoachMatch.myScore;
        addMatchEvent(`⚽ هدف لفريقنا! الدقيقة ${currentCoachMatch.matchMinute}`, 'event-goal');
    } else if (roll < myChance + oppChance) {
        currentCoachMatch.oppScore++;
        document.getElementById('coach-match-opp-score').textContent = currentCoachMatch.oppScore;
        addMatchEvent(`❌ هدف للمنافس. الدقيقة ${currentCoachMatch.matchMinute}`, 'event-miss');
    } else {
        // حدث عادي
        if (Math.random() < 0.3) {
            const events = [
                'هجمة خطيرة لفريقنا...',
                'تصدي رائع من حارسنا!',
                'المنافس يفقد الكرة',
                'ضغط دفاعي قوي من فريقنا',
                'فرصة ضائعة...'
            ];
            const eventText = events[Math.floor(Math.random() * events.length)];
            addMatchEvent(`• ${eventText} الدقيقة ${currentCoachMatch.matchMinute}`, 'event-normal');
        }
    }
}

function addMatchEvent(text, className) {
    if (!currentCoachMatch) return;

    currentCoachMatch.events.unshift({ text, className, minute: currentCoachMatch.matchMinute });

    // نعرض آخر 8 أحداث فقط
    const recent = currentCoachMatch.events.slice(0, 8);
    const el = document.getElementById('coach-match-events');
    if (el) {
        el.innerHTML = recent.map(e =>
            `<div class="match-event ${e.className}">${e.text}</div>`
        ).join('');
    }
}

// ============================================================
// 4) تغيير التكتيك أثناء المباراة
// ============================================================
function toggleCoachMatchTactic() {
    if (!currentCoachMatch) return;

    const tactics = ['هجومي', 'متوازن', 'دفاعي'];
    const idx = tactics.indexOf(currentCoachMatch.currentTactic);
    currentCoachMatch.currentTactic = tactics[(idx + 1) % tactics.length];

    document.getElementById('coach-match-tactic-btn').textContent = `التكتيك: ${currentCoachMatch.currentTactic}`;
    addMatchEvent(`📋 تغيير التكتيك إلى: ${currentCoachMatch.currentTactic}`, 'event-tactic');
}

// ============================================================
// 5) نهاية المباراة
// ============================================================
function endCoachMatch() {
    if (!currentCoachMatch || currentCoachMatch.isFinished) return;

    currentCoachMatch.isFinished = true;
    clearInterval(currentCoachMatch.timerInterval);

    // تحديد النتيجة
    let result;
    if (currentCoachMatch.myScore > currentCoachMatch.oppScore) {
        result = 'win';
        activeCoach.wins++;
    } else if (currentCoachMatch.myScore < currentCoachMatch.oppScore) {
        result = 'loss';
        activeCoach.losses++;
    } else {
        result = 'draw';
        activeCoach.draws++;
    }
    activeCoach.matchesManaged++;

    // منح النقاط
    const pointsEarned = awardCoachPoints(
        activeCoach,
        result,
        currentCoachMatch.myScore,
        currentCoachMatch.oppScore
    );

    // الراتب
    const salary = calcCoachSalary(activeCoach) / 4; // راتب أسبوعي
    activeCoach.money = (activeCoach.money || 0) + salary;

    // السمعة
    let repGain = result === 'win' ? 4 : result === 'draw' ? 1 : -2;
    activeCoach.reputation = Math.max(0, (activeCoach.reputation || 0) + repGain);

    // تحديث بيانات المباراة
    const matchInCalendar = activeCoach.calendar.find(m =>
        m.day === currentCoachMatch.matchData.day &&
        m.month === currentCoachMatch.matchData.month &&
        m.year === currentCoachMatch.matchData.year &&
        m.opponent === currentCoachMatch.matchData.opponent
    );
    if (matchInCalendar) {
        matchInCalendar.played = true;
        matchInCalendar.myScore = currentCoachMatch.myScore;
        matchInCalendar.oppScore = currentCoachMatch.oppScore;
    }

    saveCareer(activeCoach);

    // عرض النتيجة
    document.getElementById('coach-match-final-score').textContent =
        `${currentCoachMatch.myScore} - ${currentCoachMatch.oppScore}`;

    const resultText = result === 'win' ? '🏆 فوز' : result === 'loss' ? '😔 خسارة' : '🤝 تعادل';
    document.getElementById('coach-match-final-title').textContent = resultText;

    const statsHTML = `
        <div class="final-stat-row">
            <span>النتيجة</span>
            <span>${currentCoachMatch.myScore} - ${currentCoachMatch.oppScore}</span>
        </div>
        <div class="final-stat-row">
            <span>النقاط المكتسبة</span>
            <span>+${pointsEarned}</span>
        </div>
        <div class="final-stat-row">
            <span>الراتب</span>
            <span>+$${Math.round(salary).toLocaleString()}</span>
        </div>
        <div class="final-stat-row">
            <span>السمعة</span>
            <span>${repGain >= 0 ? '+' : ''}${repGain}</span>
        </div>
    `;
    document.getElementById('coach-match-final-stats').innerHTML = statsHTML;
    document.getElementById('coach-match-final').style.display = 'flex';
}

function closeCoachMatchAndReturn() {
    if (currentCoachMatch && currentCoachMatch.timerInterval) {
        clearInterval(currentCoachMatch.timerInterval);
    }
    currentCoachMatch = null;
    activeCoach = getAllCareers().find(c => c.id === activeCoach.id);
    renderCoachScreen();
    showScreen('screen-coach');
}

// ============================================================
// 6) إنشاء مدرب (من شاشة الإنشاء)
// ============================================================
let newCoachData = {};

function goToCoachCreation() {
    populateCoachNationalities();
    populateCoachLeagues();
    showScreen('screen-coach-create');
}

function populateCoachNationalities() {
    const select = document.getElementById('coach-nationality');
    if (!select) return;
    if (select.options.length > 1) return;

    NATIONALITIES_DB.forEach(n => {
        const opt = document.createElement('option');
        opt.value = n.name;
        opt.textContent = `${n.flag} ${n.name}`;
        select.appendChild(opt);
    });
}

function populateCoachLeagues() {
    const select = document.getElementById('coach-league');
    if (!select) return;
    if (select.options.length > 1) return;

    LEAGUES_DB.leagues.forEach(l => {
        const opt = document.createElement('option');
        opt.value = l.id;
        opt.textContent = `${l.flag} ${l.name}`;
        select.appendChild(opt);
    });
}

// عند تغيير الدوري، نحدّث قائمة الأندية
document.addEventListener('change', (e) => {
    if (e.target && e.target.id === 'coach-league') {
        const leagueId = e.target.value;
        const clubSelect = document.getElementById('coach-club');
        if (!clubSelect) return;

        clubSelect.innerHTML = '<option value="">اختر النادي</option>';
        const clubs = getClubsByLeague(leagueId);
        clubs.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.name;
            opt.textContent = `${c.name} (قوة ${c.strength})`;
            clubSelect.appendChild(opt);
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const coachForm = document.getElementById('coach-form');
    if (coachForm) {
        coachForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('coach-name').value.trim();
            const nationality = document.getElementById('coach-nationality').value;
            const leagueId = document.getElementById('coach-league').value;
            const clubName = document.getElementById('coach-club').value;

            if (!name || !nationality || !leagueId || !clubName) {
                alert('يرجى ملء جميع الحقول');
                return;
            }

            const coach = createCoach(name, nationality, leagueId, clubName);
            if (coach) {
                activeCoach = coach;
                renderCoachScreen();
                showScreen('screen-coach');
            }
        });
    }
});

