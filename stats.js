/* ============================================================
   HANDBALL CAREER HUB — إحصائيات اللاعب/المدرب
   ============================================================ */

// ============================================================
// 1) حساب إحصائيات الموسم للاعب
// ============================================================
function getSeasonStats(career) {
    if (!career.calendar) return null;

    const played = career.calendar.filter(m => m.played);

    const totalGoals = played.reduce((sum, m) => sum + (m.playerGoals || 0), 0);
    const totalSaves = played.reduce((sum, m) => sum + (m.playerSaves || 0), 0);
    const ratings = played.filter(m => m.playerRating).map(m => m.playerRating);
    const avgRating = ratings.length > 0
        ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
        : '0.0';

    const wins = played.filter(m => m.myScore > m.oppScore).length;
    const draws = played.filter(m => m.myScore === m.oppScore).length;
    const losses = played.filter(m => m.myScore < m.oppScore).length;

    const isGK = career.position === 'حارس مرمى';

    return {
        matchesPlayed: played.length,
        goals: isGK ? 0 : totalGoals,
        saves: isGK ? totalSaves : 0,
        avgRating: avgRating,
        wins: wins,
        draws: draws,
        losses: losses,
        position: getMyPosition(career)
    };
}

// ============================================================
// 2) شاشة الإحصائيات
// ============================================================
function goToStats() {
    if (!activeCareer && !activeCoach) return;

    const career = activeCareer || activeCoach;
    const el = document.getElementById('stats-body');
    if (!el) return;

    if (career.type === 'player') {
        const s = getSeasonStats(career);
        if (!s) {
            el.innerHTML = '<div class="empty-message">لا توجد إحصائيات بعد</div>';
            return;
        }

        const isGK = career.position === 'حارس مرمى';
        el.innerHTML = `
            <div class="stats-card">
                <div class="stats-header">الموسم ${career.season}</div>
                <div class="stats-row"><span>المباريات الملعوبة</span><span>${s.matchesPlayed}</span></div>
                ${isGK
                    ? `<div class="stats-row"><span>إجمالي التصديات</span><span>${s.saves}</span></div>`
                    : `<div class="stats-row"><span>إجمالي الأهداف</span><span>${s.goals}</span></div>`
                }
                <div class="stats-row"><span>متوسط التقييم</span><span>${s.avgRating}</span></div>
                <div class="stats-row"><span>الانتصارات</span><span>${s.wins}</span></div>
                <div class="stats-row"><span>التعادلات</span><span>${s.draws}</span></div>
                <div class="stats-row"><span>الخسائر</span><span>${s.losses}</span></div>
                <div class="stats-row"><span>ترتيب الفريق</span><span>${s.position}</span></div>
            </div>

            <div class="stats-card" style="margin-top:12px;">
                <div class="stats-header">المسيرة الكلية</div>
                <div class="stats-row"><span>القوة الحالية</span><span>${career.totalRating}</span></div>
                <div class="stats-row"><span>السمعة</span><span>${career.reputation || 0} / 100</span></div>
                <div class="stats-row"><span>المستوى</span><span>${getReputationLevel(career.reputation || 0)}</span></div>
                <div class="stats-row"><span>المال</span><span>$${(career.money || 0).toLocaleString()}</span></div>
            </div>
        `;
    } else if (career.type === 'coach') {
        el.innerHTML = `
            <div class="stats-card">
                <div class="stats-header">الموسم ${career.season}</div>
                <div class="stats-row"><span>المباريات المُدارة</span><span>${career.matchesManaged || 0}</span></div>
                <div class="stats-row"><span>الانتصارات</span><span>${career.wins || 0}</span></div>
                <div class="stats-row"><span>التعادلات</span><span>${career.draws || 0}</span></div>
                <div class="stats-row"><span>الخسائر</span><span>${career.losses || 0}</span></div>
                <div class="stats-row"><span>التكتيك المفضل</span><span>${career.tactic || 'متوازن'}</span></div>
            </div>

            <div class="stats-card" style="margin-top:12px;">
                <div class="stats-header">المسيرة الكلية</div>
                <div class="stats-row"><span>قوة المدرب</span><span>${career.totalRating}</span></div>
                <div class="stats-row"><span>السمعة</span><span>${career.reputation || 0} / 100</span></div>
                <div class="stats-row"><span>المال</span><span>$${(career.money || 0).toLocaleString()}</span></div>
            </div>
        `;
    }

    showScreen('screen-stats');
}

