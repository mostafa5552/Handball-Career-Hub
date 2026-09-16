/* ============================================================
   HANDBALL CAREER HUB — المنتخبات + البطولات الدولية
   ============================================================ */

// ============================================================
// 1) خريطة المنتخبات حسب الجنسية
// ============================================================
const NATIONAL_TEAM_STRENGTH = {
    'مصر': 82,
    'السعودية': 68,
    'الكويت': 65,
    'إسبانيا': 92,
    'ألمانيا': 85,
    'فرنسا': 95,
    'الدنمارك': 94,
    'المجر': 78,
    'بولندا': 76,
    'كرواتيا': 88,
    'كوريا الجنوبية': 72
};

// ============================================================
// 2) فحص استدعاء المنتخب
// ============================================================
function checkNationalCallup(career) {
    const rating = career.totalRating;
    const rep = career.reputation || 0;

    // الشرط: القوة 75+ أو السمعة 40+
    if (rating < 75 && rep < 40) {
        career.nationalTeam = career.nationalTeam || { called: false };
        return false;
    }

    if (!career.nationalTeam || !career.nationalTeam.called) {
        career.nationalTeam = {
            called: true,
            country: career.nationality,
            strength: NATIONAL_TEAM_STRENGTH[career.nationality] || 70,
            caps: 0,
            goals: 0,
            saves: 0,
            tournaments: []
        };
        saveCareer(career);
        return true; // أول استدعاء
    }

    return false;
}

// ============================================================
// 3) توليد بطولة دولية
// ============================================================
function generateInternationalTournament(career, tournamentId) {
    const tournament = LEAGUES_DB.national_teams.find(t => t.id === tournamentId);
    if (!tournament) return null;

    // توليد 8-16 منتخباً حسب البطولة
    const countries = Object.keys(NATIONAL_TEAM_STRENGTH);
    let participantsCount = 8;
    if (tournamentId === 'world_championship') participantsCount = 16;
    else if (tournamentId === 'ehf_euro') participantsCount = 12;
    else if (tournamentId === 'africa_nations') participantsCount = 10;

    // نضمن وجود منتخب اللاعب
    const myCountry = career.nationality;
    const otherCountries = countries.filter(c => c !== myCountry);
    const shuffled = [...otherCountries].sort(() => Math.random() - 0.5);
    const participants = [myCountry, ...shuffled.slice(0, participantsCount - 1)];

    // توزيع المجموعات
    const groups = [];
    const groupSize = 4;
    for (let i = 0; i < participants.length; i += groupSize) {
        groups.push({
            name: 'المجموعة ' + String.fromCharCode(65 + groups.length),
            teams: participants.slice(i, i + groupSize).map(c => ({
                country: c,
                strength: NATIONAL_TEAM_STRENGTH[c] || 70,
                played: 0,
                won: 0,
                lost: 0,
                points: 0
            }))
        });
    }

    return {
        id: tournamentId,
        name: tournament.name,
        groups: groups,
        stage: 'group',
        knockout: [],
        winner: null,
        myResults: []
    };
}

// ============================================================
// 4) محاكاة بطولة دولية
// ============================================================
function simulateInternationalTournament(career, tournament) {
    // دور المجموعات
    tournament.groups.forEach(group => {
        const teams = group.teams;
        for (let i = 0; i < teams.length; i++) {
            for (let j = i + 1; j < teams.length; j++) {
                const result = simulateMatch(teams[i].strength, teams[j].strength);
                teams[i].played++;
                teams[j].played++;
                if (result.homeGoals > result.awayGoals) {
                    teams[i].won++;
                    teams[i].points += 2;
                } else {
                    teams[j].won++;
                    teams[j].points += 2;
                }
            }
        }
        // ترتيب المجموعة
        group.teams.sort((a, b) => b.points - a.points);
    });

    // أفضل 2 من كل مجموعة
    const qualified = [];
    tournament.groups.forEach(g => {
        qualified.push(g.teams[0], g.teams[1]);
    });

    // دور خروج المغلوب
    tournament.knockout = [];
    for (let i = 0; i < qualified.length; i += 2) {
        if (qualified[i + 1]) {
            tournament.knockout.push({
                home: qualified[i],
                away: qualified[i + 1],
                homeGoals: 0,
                awayGoals: 0,
                played: false
            });
        }
    }

    // محاكاة خروج المغلوب
    while (tournament.knockout.length > 1) {
        const nextRound = [];
        tournament.knockout.forEach(m => {
            if (!m.played) {
                const result = simulateMatch(m.home.strength, m.away.strength);
                m.homeGoals = result.homeGoals;
                m.awayGoals = result.awayGoals;
                m.played = true;
            }
            nextRound.push(m.homeGoals > m.awayGoals ? m.home : m.away);
        });

        const newMatches = [];
        for (let i = 0; i < nextRound.length; i += 2) {
            if (nextRound[i + 1]) {
                newMatches.push({
                    home: nextRound[i],
                    away: nextRound[i + 1],
                    homeGoals: 0,
                    awayGoals: 0,
                    played: false
                });
            }
        }
        if (newMatches.length === 0) {
            tournament.winner = nextRound[0];
            break;
        }
        tournament.knockout = newMatches;
    }

    if (!tournament.winner && tournament.knockout.length === 1) {
        const m = tournament.knockout[0];
        if (!m.played) {
            const result = simulateMatch(m.home.strength, m.away.strength);
            m.homeGoals = result.homeGoals;
            m.awayGoals = result.awayGoals;
            m.played = true;
        }
        tournament.winner = m.homeGoals > m.awayGoals ? m.home : m.away;
    }

    tournament.stage = 'done';

    // إذا فاز منتخب اللاعب، نزيد السمعة
    if (tournament.winner && tournament.winner.country === career.nationality) {
        addReputation(career, 10);
    } else {
        addReputation(career, 3);
    }

    career.nationalTeam.tournaments.push({
        id: tournament.id,
        name: tournament.name,
        winner: tournament.winner ? tournament.winner.country : null,
        myCountry: career.nationality
    });
}

// ============================================================
// 5) بطولة دولية جديدة للمنتخب
// ============================================================
function startInternationalTournament(career, tournamentId) {
    if (!career.nationalTeam || !career.nationalTeam.called) return null;

    const tournament = generateInternationalTournament(career, tournamentId);
    if (!tournament) return null;

    simulateInternationalTournament(career, tournament);
    career.nationalTeam.currentTournament = tournament;
    saveCareer(career);
    return tournament;
}

// ============================================================
// 6) شاشة المنتخب
// ============================================================
function goToNationalTeam() {
    if (!activeCareer) return;
    renderNationalTeamScreen();
    showScreen('screen-national');
}

function renderNationalTeamScreen() {
    if (!activeCareer) return;

    const el = document.getElementById('national-body');
    if (!el) return;

    const nt = activeCareer.nationalTeam;

    if (!nt || !nt.called) {
        el.innerHTML = `
            <div class="empty-message">
                لم يتم استدعاؤك للمنتخب بعد.<br><br>
                <strong>الشرط:</strong> القوة الكلية 75+ أو السمعة 40+<br>
                قوتك الحالية: ${activeCareer.totalRating}<br>
                سمعتك الحالية: ${activeCareer.reputation || 0}
            </div>
        `;
        return;
    }

    let html = `
        <div class="national-header">
            <div class="national-country">${getNationalityFlag(nt.country)} منتخب ${nt.country}</div>
            <div class="national-stats-row">
                <div class="national-stat">
                    <div class="label">المشاركات</div>
                    <div class="value">${nt.caps}</div>
                </div>
                <div class="national-stat">
                    <div class="label">الأهداف/التصديات</div>
                    <div class="value">${activeCareer.position === 'حارس مرمى' ? nt.saves : nt.goals}</div>
                </div>
            </div>
        </div>
    `;

    // زر بدء بطولة
    html += `<div class="section-title">البطولات المتاحة</div>`;

    const tournaments = [
        { id: 'africa_nations', name: 'بطولة الأمم الأفريقية' },
        { id: 'ehf_euro', name: 'بطولة أمم أوروبا' },
        { id: 'asian_champ', name: 'بطولة آسيا' },
        { id: 'world_championship', name: 'كأس العالم' }
    ];

    tournaments.forEach(t => {
        html += `
            <div class="tournament-card">
                <div class="tournament-name">${t.name}</div>
                <button class="btn-primary" onclick="playTournament('${t.id}')">ابدأ البطولة</button>
            </div>
        `;
    });

    // سجل البطولات السابقة
    if (nt.tournaments && nt.tournaments.length > 0) {
        html += `<div class="section-title">سجل البطولات</div>`;
        nt.tournaments.forEach(t => {
            const result = t.winner === t.myCountry ? '🏆 فزت بالبطولة' : `فاز: ${t.winner}`;
            html += `
                <div class="tournament-history-row">
                    <span>${t.name}</span>
                    <span>${result}</span>
                </div>
            `;
        });
    }

    el.innerHTML = html;
}

function playTournament(tournamentId) {
    if (!activeCareer) return;
    const tournament = startInternationalTournament(activeCareer, tournamentId);
    if (tournament) {
        saveCareer(activeCareer);
        const result = tournament.winner && tournament.winner.country === activeCareer.nationality
            ? '🏆 فزت بالبطولة!'
            : `فاز منتخب ${tournament.winner ? tournament.winner.country : 'غير معروف'}`;
        alert(`انتهت البطولة!\n\n${result}\n\nالسمعة: +${tournament.winner && tournament.winner.country === activeCareer.nationality ? 10 : 3}`);
        renderNationalTeamScreen();
    }
}

