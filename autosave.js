/* ============================================================
   HANDBALL CAREER HUB — الحفظ التلقائي + الموسم الجديد
   ============================================================ */

// ============================================================
// 1) حفظ تلقائي كل 30 ثانية
// ============================================================
let autosaveInterval = null;

function startAutosave() {
    if (autosaveInterval) clearInterval(autosaveInterval);

    autosaveInterval = setInterval(() => {
        if (activeCareer) {
            saveCareer(activeCareer);
            console.log('💾 حفظ تلقائي (لاعب)');
        }
        if (activeCoach) {
            saveCareer(activeCoach);
            console.log('💾 حفظ تلقائي (مدرب)');
        }
    }, 30000);
}

// ============================================================
// 2) فحص نهاية الموسم (30 مباراة)
// ============================================================
function checkSeasonEnd(career) {
    if (!career.calendar) return false;

    const totalMatches = career.calendar.length;
    const playedMatches = career.calendar.filter(m => m.played).length;

    return playedMatches >= totalMatches;
}

// ============================================================
// 3) بدء موسم جديد
// ============================================================
function startNewSeason(career) {
    // زيادة رقم الموسم
    const currentYear = parseInt(career.season.split('/')[0]);
    const nextYear = currentYear + 1;
    career.season = `${nextYear}/${nextYear + 1}`;

    // إعادة تعيين التاريخ
    career.day = 25;
    career.month = 9;
    career.year = nextYear;

    // توليد تقويم جديد
    career.calendar = generateSeasonCalendar(career);

    // إعادة بناء الجدول
    career.leagueTable = buildLeagueTable(career);

    // مسح البطولات القديمة
    career.cup = null;
    career.continental = null;
    initSeasonCompetitions(career);

    // مكافأة نهاية الموسم
    const seasonBonus = 5000 + (career.totalRating * 100);
    career.money = (career.money || 0) + seasonBonus;

    // زيادة السمعة حسب الترتيب
    const position = getMyPosition(career);
    if (position === 1) {
        addReputation(career, 15);
    } else if (position <= 3) {
        addReputation(career, 8);
    } else if (position <= 6) {
        addReputation(career, 3);
    }

    // حفظ
    saveCareer(career);

    return {
        season: career.season,
        position: position,
        bonus: seasonBonus
    };
}

// ============================================================
// 4) التحقق عند كل تخطي يوم
// ============================================================
function maybeStartNewSeason(career) {
    if (!checkSeasonEnd(career)) return null;

    // انتظر حتى يؤكد اللاعب
    return {
        needsNewSeason: true,
        season: career.season
    };
}

