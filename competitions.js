/* ============================================================
   HANDBALL CAREER HUB — البطولات (كؤوس + قارية)
   ============================================================ */

// ============================================================
// 1) توليد قرعة الكأس المحلي
// ============================================================
function generateCupBracket(career) {
    const clubs = getClubsByLeague(career.leagueId);
    const cup = LEAGUES_DB.cups.find(c => c.leagueId === career.leagueId);
    if (!cup) return null;

    // خلط الفرق
    const shuffled = [...clubs].sort(() => Math.random() - 0.5);

    // نأخذ 16 فريقاً (أو أقل لو الدوري أصغر)
    const participants = shuffled.slice(0, Math.min(16, shuffled.length));

    // الدور الأول: دور الـ 16
    const round16 = [];
    for (let i = 0; i < participants.length; i += 2) {
        if (participants[i + 1]) {
            round16.push({
                home: participants[i],
                away: participants[i + 1],
                homeGoals: 0,
                awayGoals: 0,
                played: false
            });
        }
    }

    return {
        cupId: cup.id,
        cupName: cup.name,
        stage: 'round16',
        round16: round16,
        quarterFinals: [],
        semiFinals: [],
        final: null,
        winner: null,
        // تواريخ الأدوار (تقريبية)
        dates: {
            round16: { day: 15, month: 2, year: career.year },
            quarterFinals: { day: 15, month: 3, year: career.year },
            semiFinals: { day: 15, month: 4, year: career.year },
            final: { day: 15, month: 5, year: career.year }
        }
    };
}

// ============================================================
// 2) توليد البطولة القارية للأندية
// ============================================================
function generateContinentalCompetition(career) {
    const clubs = getClubsByLeague(career.leagueId);
    const country = career.country;

    // تحديد البطولة القارية حسب القارة
    let competitionId;
    if (['مصر', 'السعودية', 'الكويت'].includes(country)) {
        competitionId = country === 'مصر' ? 'caf_champions' : 'asian_champions';
    } else if (['إسبانيا', 'ألمانيا', 'فرنسا', 'الدنمارك', 'المجر', 'بولندا', 'كرواتيا'].includes(country)) {
        competitionId = 'ehf_champions';
    } else {
        competitionId = 'asian_champions';
    }

    const competition = LEAGUES_DB.continental_clubs.find(c => c.id === competitionId);
    if (!competition) return null;

    // أفضل 4 فرق من الدوري تمثل بلدنا + فرق مولّدة من دول أخرى
    const topClubs = [...clubs].sort((a, b) => b.strength - a.strength).slice(0, 4);

    // مجموعة الفريق الحالي
    const groupTeams = [
        ...topClubs.slice(0, 1), // فريقي
        ...topClubs.slice(1, 4)  // 3 فرق أخرى من نفس الدوري
    ];

    // نضيف فرق وهمية من دول أخرى
    const foreignClubs = [];
    const otherCountries = ['تونس', 'الجزائر', 'المغرب', 'قطر', 'الإمارات', 'البحرين', 'عمان'];
    for (let i = 0; i < 4; i++) {
        foreignClubs.push({
            name: `نادي ${otherCountries[i % otherCountries.length]}`,
            strength: 70 + Math.floor(Math.random() * 15)
        });
    }

    return {
        competitionId: competition.id,
        competitionName: competition.name,
        groups: [
            {
                name: 'المجموعة أ',
                teams: groupTeams
            },
            {
                name: 'المجموعة ب',
                teams: foreignClubs
            }
        ],
        groupMatches: [], // مباريات دور المجموعات
        knockout: [],     // دور خروج المغلوب
        stage: 'group',
        winner: null
    };
}

// ============================================================
// 3) محاكاة دور كامل (الكأس)
// ============================================================
function simulateCupRound(career) {
    const cup = career.cup;
    if (!cup) return;

    const currentStage = cup.stage;
    let currentRound = [];
    let nextStage = '';

    if (currentStage === 'round16') {
        currentRound = cup.round16;
        nextStage = 'quarterFinals';
    } else if (currentStage === 'quarterFinals') {
        currentRound = cup.quarterFinals;
        nextStage = 'semiFinals';
    } else if (currentStage === 'semiFinals') {
        currentRound = cup.semiFinals;
        nextStage = 'final';
    } else if (currentStage === 'final') {
        currentRound = [cup.final];
        nextStage = 'done';
    }

    if (!currentRound || currentRound.length === 0) return;

    const winners = [];

    currentRound.forEach(match => {
        if (match.played) {
            winners.push(match.homeGoals > match.awayGoals ? match.home : match.away);
            return;
        }

        // لو الفريق الحالي طرف في المباراة، نستخدم نتيجة حقيقية (سيتم لعبها عبر المحاكاة)
        if (match.home.name === career.clubName || match.away.name === career.clubName) {
            // لا نحاكيها، ننتظر اللاعب
            winners.push(null);
            return;
        }

        // محاكاة بين الفريقين
        const result = simulateMatch(match.home.strength, match.away.strength);
        match.homeGoals = result.homeGoals;
        match.awayGoals = result.awayGoals;
        match.played = true;

        winners.push(result.homeGoals > result.awayGoals ? match.home : match.away);
    });

    // إذا فيه فرق لم تُحدد بعد (لأن اللاعب لم يلعب)، لا نُنشئ الدور التالي كاملاً
    if (winners.includes(null)) return;

    // إنشاء الدور التالي
    if (nextStage === 'quarterFinals') {
        cup.quarterFinals = buildKnockoutRound(winners, 'ربع النهائي');
        cup.stage = 'quarterFinals';
    } else if (nextStage === 'semiFinals') {
        cup.semiFinals = buildKnockoutRound(winners, 'نصف النهائي');
        cup.stage = 'semiFinals';
    } else if (nextStage === 'final') {
        cup.final = {
            home: winners[0],
            away: winners[1],
            homeGoals: 0,
            awayGoals: 0,
            played: false,
            stage: 'النهائي'
        };
        cup.stage = 'final';
    } else if (nextStage === 'done') {
        cup.winner = winners[0];
        cup.stage = 'done';
    }
}

function buildKnockoutRound(teams, roundName) {
    const matches = [];
    for (let i = 0; i < teams.length; i += 2) {
        if (teams[i + 1]) {
            matches.push({
                home: teams[i],
                away: teams[i + 1],
                homeGoals: 0,
                awayGoals: 0,
                played: false,
                stage: roundName
            });
        }
    }
    return matches;
}

// ============================================================
// 4) محاكاة دور المجموعات (البطولة القارية)
// ============================================================
function simulateContinentalGroupStage(career) {
    const comp = career.continental;
    if (!comp) return;

    // مبسّطة: كل فريق يلعب 6 مباريات (ذهاب وعودة ضد 3 فرق)
    comp.groups.forEach(group => {
        const teams = group.teams;
        for (let i = 0; i < teams.length; i++) {
            for (let j = i + 1; j < teams.length; j++) {
                const result = simulateMatch(teams[i].strength, teams[j].strength);
                // نحفظ النتائج (مبسّط)
                comp.groupMatches.push({
                    group: group.name,
                    home: teams[i].name,
                    away: teams[j].name,
                    homeGoals: result.homeGoals,
                    awayGoals: result.awayGoals
                });
            }
        }
    });

    comp.stage = 'knockout';
    // أفضل فريقين من كل مجموعة
    comp.knockout = buildContinentalKnockout(comp);
}

function buildContinentalKnockout(comp) {
    // مبسّطة: الفريق الأول من كل مجموعة ضد الثاني من الأخرى
    const groupA = comp.groups[0].teams;
    const groupB = comp.groups[1].teams;

    return [
        { home: groupA[0], away: groupB[1], played: false, homeGoals: 0, awayGoals: 0 },
        { home: groupB[0], away: groupA[1], played: false, homeGoals: 0, awayGoals: 0 }
    ];
}

// ============================================================
// 5) موقع فريقي في كأس/بطولة
// ============================================================
function isMyClubInMatch(match, clubName) {
    return match.home.name === clubName || match.away.name === clubName;
}

function isMyClubInCup(career) {
    const cup = career.cup;
    if (!cup) return false;

    const allMatches = [
        ...(cup.round16 || []),
        ...(cup.quarterFinals || []),
        ...(cup.semiFinals || []),
        ...(cup.final ? [cup.final] : [])
    ];

    return allMatches.some(m => isMyClubInMatch(m, career.clubName));
}

// ============================================================
// 6) إنشاء بطولات الموسم (تُستدعى عند بدء الموسم)
// ============================================================
function initSeasonCompetitions(career) {
    if (!career.cup) {
        career.cup = generateCupBracket(career);
    }
    if (!career.continental) {
        career.continental = generateContinentalCompetition(career);
    }
    saveCareer(career);
}

