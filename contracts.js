/* ============================================================
   HANDBALL CAREER HUB — العقود + العروض + الانتقالات
   ============================================================ */

// ============================================================
// 1) نظام السمعة
// ============================================================
function getReputationLevel(reputation) {
    if (reputation >= 90) return 'أسطورة عالمية';
    if (reputation >= 75) return 'نجم عالمي';
    if (reputation >= 60) return 'نجم قاري';
    if (reputation >= 45) return 'لاعب محترف';
    if (reputation >= 30) return 'لاعب واعد';
    return 'مبتدئ';
}

function addReputation(career, amount) {
    career.reputation = Math.min(100, (career.reputation || 0) + amount);
}

// ============================================================
// 2) حساب راتب اللاعب
// ============================================================
function calcSalary(career) {
    const rating = career.totalRating;
    const rep = career.reputation || 0;
    // الراتب = (القوة × 100) + (السمعة × 200) بالدولار أسبوعياً
    return Math.round((rating * 100) + (rep * 200));
}

// ============================================================
// 3) توليد عقد جديد
// ============================================================
function generateContract(career, clubName, clubStrength) {
    const years = 2 + Math.floor(Math.random() * 3); // 2-4 سنوات
    const rating = career.totalRating;
    const rep = career.reputation || 0;

    // الراتب حسب القوة والسمعة
    const baseSalary = (clubStrength * 80) + (rating * 100) + (rep * 150);
    const salary = Math.round(baseSalary * (0.9 + Math.random() * 0.2));

    // مكافأة التوقيع
    const signingBonus = Math.round(salary * 4 * Math.random());

    return {
        clubName: clubName,
        clubStrength: clubStrength,
        salary: salary,
        years: years,
        signingBonus: signingBonus,
        startDate: { day: career.day, month: career.month, year: career.year },
        endDate: {
            day: career.day,
            month: career.month,
            year: career.year + years
        }
    };
}

// ============================================================
// 4) توليد العروض
// ============================================================
function generateOffers(career) {
    const offers = [];
    const rep = career.reputation || 0;
    const rating = career.totalRating;

    // لا عروض إذا السمعة أقل من 20
    if (rep < 20 && rating < 70) return offers;

    // عدد العروض حسب السمعة والقوة
    let numOffers = 0;
    if (rep >= 80) numOffers = 3 + Math.floor(Math.random() * 3);
    else if (rep >= 60) numOffers = 2 + Math.floor(Math.random() * 2);
    else if (rep >= 40) numOffers = 1 + Math.floor(Math.random() * 2);
    else numOffers = Math.floor(Math.random() * 2);

    // نادي اللاعب الحالي
    const myClub = career.clubName;
    const myStrength = career.clubStrength;

    // كل الأندية في كل الدوريات
    const allClubs = [];
    LEAGUES_DB.leagues.forEach(league => {
        const clubs = getClubsByLeague(league.id);
        clubs.forEach(club => {
            if (club.name !== myClub) {
                allClubs.push({
                    ...club,
                    leagueId: league.id,
                    leagueName: league.name,
                    country: league.country
                });
            }
        });
    });

    // فلترة: الأندية اللي قوتها أعلى من فريقي بقليل أو أعلى
    const candidateClubs = allClubs.filter(c => {
        const strengthDiff = c.strength - myStrength;
        // يقبل الأندية اللي أعلى بقليل أو أقل بقليل (حسب السمعة)
        if (rep >= 80) return strengthDiff >= -3;
        if (rep >= 60) return strengthDiff >= -5 && strengthDiff <= 15;
        if (rep >= 40) return strengthDiff >= -10 && strengthDiff <= 8;
        return strengthDiff >= -5 && strengthDiff <= 3;
    });

    // خلط واختيار عدد محدد
    const shuffled = candidateClubs.sort(() => Math.random() - 0.5);

    for (let i = 0; i < Math.min(numOffers, shuffled.length); i++) {
        const club = shuffled[i];
        const contract = generateContract(career, club.name, club.strength);
        offers.push({
            id: 'offer_' + Date.now() + '_' + i,
            club: club,
            contract: contract,
            date: { day: career.day, month: career.month, year: career.year }
        });
    }

    return offers;
}

// ============================================================
// 5) قبول عرض
// ============================================================
function acceptOffer(career, offerId) {
    const offer = (career.offers || []).find(o => o.id === offerId);
    if (!offer) return false;

    // تحديث بيانات الفريق
    career.clubName = offer.club.name;
    career.clubStrength = offer.club.strength;
    career.leagueId = offer.club.leagueId;
    career.leagueName = offer.club.leagueName;
    career.country = offer.club.country;
    career.contract = offer.contract;

    // مكافأة التوقيع
    career.money = (career.money || 0) + offer.contract.signingBonus;

    // توليد قوائم اللاعبين للدوري الجديد (لو لم تكن موجودة)
    if (!career.squads) career.squads = {};
    const clubs = getClubsByLeague(career.leagueId);
    clubs.forEach(c => {
        if (!career.squads[c.name]) {
            career.squads[c.name] = generateSquad(
                career.leagueId,
                c.name,
                c.strength,
                career.country
            );
        }
    });

    // إعادة توليد التقويم والجدول
    career.calendar = generateSeasonCalendar(career);
    career.leagueTable = buildLeagueTable(career);

    // مسح العروض
    career.offers = [];

    // زيادة السمعة (نقلة موفقة)
    addReputation(career, 5);

    saveCareer(career);
    return true;
}

// ============================================================
// 6) رفض عرض
// ============================================================
function rejectOffer(career, offerId) {
    career.offers = (career.offers || []).filter(o => o.id !== offerId);
    saveCareer(career);
}

// ============================================================
// 7) تجديد العقد
// ============================================================
function renewContract(career) {
    const newContract = generateContract(career, career.clubName, career.clubStrength);
    career.contract = newContract;
    saveCareer(career);
    return newContract;
}

// ============================================================
// 8) فحص انتهاء العقد
// ============================================================
function isContractExpiring(career) {
    if (!career.contract) return false;
    const end = career.contract.endDate;
    const current = { day: career.day, month: career.month, year: career.year };

    // لو باقي أقل من 6 شهور
    const endMonths = end.year * 12 + end.month;
    const currentMonths = current.year * 12 + current.month;

    return (endMonths - currentMonths) <= 6;
}

function isContractExpired(career) {
    if (!career.contract) return false;
    const end = career.contract.endDate;
    const current = { day: career.day, month: career.month, year: career.year };

    if (current.year > end.year) return true;
    if (current.year === end.year && current.month > end.month) return true;
    if (current.year === end.year && current.month === end.month && current.day >= end.day) return true;

    return false;
}

