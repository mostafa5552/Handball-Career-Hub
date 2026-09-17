/* ============================================================
   HANDBALL CAREER HUB — محاكاة نتائج الدوري
   ============================================================ */

// ============================================================
// 1) جدول الدوري
// ============================================================
// يُبنى مرة واحدة عند بدء المهنة
function buildLeagueTable(career) {
    const clubs = getClubsByLeague(career.leagueId);
    return clubs.map(c => ({
        name: c.name,
        strength: c.strength,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0
    }));
}

// ============================================================
// 2) محاكاة مباراة بين فريقين
// ============================================================
function simulateMatch(homeStrength, awayStrength) {
    // القوة الفعلية = قوة + عشوائية
    const home = homeStrength + Math.floor(Math.random() * 15) - 5 + 3; // +3 لأفضلية الأرض
    const away = awayStrength + Math.floor(Math.random() * 15) - 5;

    // الأهداف بين 13 و 64
    const homeGoals = Math.max(13, Math.min(64, Math.round(home * 0.6 + Math.random() * 10)));
    const awayGoals = Math.max(13, Math.min(64, Math.round(away * 0.6 + Math.random() * 10)));

    return { homeGoals, awayGoals };
}

// ============================================================
// 3) تحديث الجدول بمباراة
// ============================================================
function updateTable(table, homeName, awayName, homeGoals, awayGoals) {
    const home = table.find(t => t.name === homeName);
    const away = table.find(t => t.name === awayName);
    if (!home || !away) return;

    home.played++;
    away.played++;

    home.goalsFor += homeGoals;
    home.goalsAgainst += awayGoals;
    away.goalsFor += awayGoals;
    away.goalsAgainst += homeGoals;

    if (homeGoals > awayGoals) {
        home.won++;
        away.lost++;
        home.points += 2;
    } else if (homeGoals < awayGoals) {
        away.won++;
        home.lost++;
        away.points += 2;
    } else {
        home.drawn++;
        away.drawn++;
        home.points++;
        away.points++;
    }
}

// ============================================================
// 4) محاكاة كل مباريات يوم معين
// ============================================================
function simulateLeagueDay(career) {
    if (!career.leagueTable) {
        career.leagueTable = buildLeagueTable(career);
    }

    // مباريات اليوم الحالي
    const todayMatches = career.calendar.filter(m =>
        m.day === career.day &&
        m.month === career.month &&
        m.year === career.year &&
        m.type === 'league'
    );

    // مباريات الفريق الحالي
    const myMatch = todayMatches.find(m => !m.played);

    // محاكاة مباريات الفرق الأخرى (لو مباراة الفريق الحالي لم تُلعب بعد، لا نحسبها)
    const clubs = getClubsByLeague(career.leagueId);
    const otherClubs = clubs.filter(c => c.name !== career.clubName);

    // نولّد مباراة عشوائية لكل زوج من الفرق الأخرى اليوم
    // لتبسيط المحاكاة: كل يوم فيه مباراة للفريق، نلعب مباريات الفرق الأخرى بنفس العدد
    if (myMatch) {
        // خصم عشوائي للفرق الأخرى
        const shuffled = [...otherClubs].sort(() => Math.random() - 0.5);

        for (let i = 0; i < shuffled.length - 1; i += 2) {
            const home = shuffled[i];
            const away = shuffled[i + 1];
            const result = simulateMatch(home.strength, away.strength);
            updateTable(career.leagueTable, home.name, away.name, result.homeGoals, result.awayGoals);
        }
    }
}

// ============================================================
// 5) ترتيب الجدول
// ============================================================
function getSortedTable(career) {
    if (!career.leagueTable) {
        career.leagueTable = buildLeagueTable(career);
    }
    return [...career.leagueTable].sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        const diffA = a.goalsFor - a.goalsAgainst;
        const diffB = b.goalsFor - b.goalsAgainst;
        if (diffB !== diffA) return diffB - diffA;
        return b.goalsFor - a.goalsFor;
    });
}

// ============================================================
// 6) موقع فريقي في الجدول
// ============================================================
function getMyPosition(career) {
    const table = getSortedTable(career);
    return table.findIndex(t => t.name === career.clubName) + 1;
}

