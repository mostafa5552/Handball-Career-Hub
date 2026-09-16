/* ============================================================
   HANDBALL CAREER HUB — واجهة العقود والعروض
   ============================================================ */

// ============================================================
// 1) شاشة العقد الحالي
// ============================================================
function goToContract() {
    if (!activeCareer) return;
    renderContractScreen();
    showScreen('screen-contract');
}

function renderContractScreen() {
    if (!activeCareer) return;

    const el = document.getElementById('contract-body');
    if (!el) return;

    const c = activeCareer.contract || {
        clubName: activeCareer.clubName,
        salary: calcSalary(activeCareer),
        years: 2,
        endDate: { day: activeCareer.day, month: activeCareer.month, year: activeCareer.year + 2 }
    };

    const rep = activeCareer.reputation || 0;
    const money = activeCareer.money || 0;

    el.innerHTML = `
        <div class="contract-card">
            <div class="contract-row">
                <span>النادي</span>
                <span class="contract-value">${activeCareer.clubName}</span>
            </div>
            <div class="contract-row">
                <span>الراتب الأسبوعي</span>
                <span class="contract-value">$${c.salary.toLocaleString()}</span>
            </div>
            <div class="contract-row">
                <span>مدة العقد</span>
                <span class="contract-value">${c.years} سنوات</span>
            </div>
            <div class="contract-row">
                <span>ينتهي في</span>
                <span class="contract-value">${c.endDate.day}/${c.endDate.month}/${c.endDate.year}</span>
            </div>
        </div>

        <div class="contract-card" style="margin-top:12px;">
            <div class="contract-row">
                <span>رصيدك المالي</span>
                <span class="contract-value">$${money.toLocaleString()}</span>
            </div>
            <div class="contract-row">
                <span>السمعة</span>
                <span class="contract-value">${rep} / 100</span>
            </div>
            <div class="contract-row">
                <span>المستوى</span>
                <span class="contract-value">${getReputationLevel(rep)}</span>
            </div>
        </div>

        <button class="btn-primary" style="margin-top:16px;" onclick="requestRenewal()">
            🔄 طلب تجديد العقد
        </button>
    `;
}

function requestRenewal() {
    if (!activeCareer) return;
    const newC = renewContract(activeCareer);
    showToast(`✅ تم تجديد عقدك لمدة ${newC.years} سنوات`);
    renderContractScreen();
}

// ============================================================
// 2) شاشة العروض
// ============================================================
function goToOffers() {
    if (!activeCareer) return;
    renderOffersScreen();
    showScreen('screen-offers');
}

function renderOffersScreen() {
    if (!activeCareer) return;

    const el = document.getElementById('offers-body');
    if (!el) return;

    const offers = activeCareer.offers || [];

    if (offers.length === 0) {
        el.innerHTML = `
            <div class="empty-message">
                لا توجد عروض حالياً.<br><br>
                العروض تأتي حسب:<br>
                • قوتك (${activeCareer.totalRating})<br>
                • سمعتك (${activeCareer.reputation || 0})<br><br>
                استمر في الأداء الجيد!
            </div>
        `;
        return;
    }

    el.innerHTML = offers.map(o => `
        <div class="offer-card">
            <div class="offer-club-name">${o.club.name}</div>
            <div class="offer-club-league">${o.club.leagueName} — ${o.club.country}</div>
            <div class="offer-club-strength">قوة النادي: ${o.club.strength}</div>

            <div class="offer-details">
                <div class="offer-row">
                    <span>الراتب الأسبوعي</span>
                    <span class="offer-value">$${o.contract.salary.toLocaleString()}</span>
                </div>
                <div class="offer-row">
                    <span>مدة العقد</span>
                    <span class="offer-value">${o.contract.years} سنوات</span>
                </div>
                <div class="offer-row">
                    <span>مكافأة التوقيع</span>
                    <span class="offer-value">$${o.contract.signingBonus.toLocaleString()}</span>
                </div>
            </div>

            <div class="offer-actions">
                <button class="btn-accept" onclick="handleAcceptOffer('${o.id}')">✅ قبول</button>
                <button class="btn-reject" onclick="handleRejectOffer('${o.id}')">❌ رفض</button>
            </div>
        </div>
    `).join('');
}

function handleAcceptOffer(offerId) {
    if (!activeCareer) return;
    if (!confirm('هل تريد الانتقال لهذا النادي؟ سيبدأ موسم جديد.')) return;

    const success = acceptOffer(activeCareer, offerId);
    if (success) {
        showToast('🎉 تم الانتقال للنادي الجديد!');
        activeCareer = getAllCareers().find(c => c.id === activeCareer.id);
        renderCareerScreen();
        showScreen('screen-career');
    }
}

function handleRejectOffer(offerId) {
    if (!activeCareer) return;
    rejectOffer(activeCareer, offerId);
    renderOffersScreen();
}

// ============================================================
// 3) توليد عروض تلقائي بعد مباراة
// ============================================================
function maybeGenerateOffers(career) {
    // 20% فرصة لعروض جديدة بعد كل 5 مباريات
    const played = career.calendar ? career.calendar.filter(m => m.played).length : 0;
    if (played < 5 || played % 5 !== 0) return false;

    if (Math.random() > 0.4) return false;

    const newOffers = generateOffers(career);
    if (newOffers.length === 0) return false;

    career.offers = [...(career.offers || []), ...newOffers];
    saveCareer(career);
    return true;
}

