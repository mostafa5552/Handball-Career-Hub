/* ============================================================
   HANDBALL CAREER HUB — نقطة البداية
   ============================================================ */

function goToSavedCareers() {
    renderSavedCareers();
    showScreen('screen-saved');
}

function goToNewCareer() {
    showScreen('screen-new');
}

function renderSavedCareers() {
    const list = document.getElementById('saved-careers-list');
    if (!list) return;

    const careers = getAllCareers();

    if (careers.length === 0) {
        list.innerHTML = '<div class="empty-message">لا توجد مهن محفوظة بعد.<br>ابدأ مهنة جديدة!</div>';
        return;
    }

    list.innerHTML = careers.map(c => {
        const name = c.playerName || c.coachName || 'بدون اسم';
        const type = c.type === 'player' ? '🏃 لاعب' : '📋 مدرب';
        const flag = getNationalityFlag(c.nationality || '');
        return `
            <div class="career-item" onclick="loadCareer('${c.id}')">
                <div>
                    <strong>${flag} ${name}</strong>
                    <div style="font-size:0.85rem;color:#8fa9c4;margin-top:4px;">
                        ${type} — ${c.clubName || ''}
                    </div>
                </div>
                <button class="btn-back" onclick="event.stopPropagation(); removeCareer('${c.id}')">🗑️</button>
            </div>
        `;
    }).join('');
}

function loadCareer(careerId) {
    const career = getAllCareers().find(c => c.id === careerId);
    if (!career) return;

    if (career.type === 'player') {
        openPlayerCareer(careerId);
    } else if (career.type === 'coach') {
        openCoachCareer(careerId);
    }

    startAutosave();
}

function removeCareer(careerId) {
    if (confirm('هل تريد حذف هذه المهنة نهائياً؟')) {
        deleteCareer(careerId);
        renderSavedCareers();
    }
}

let newPlayerData = {};

function goToPlayerCreation() {
    populateNationalities();
    showScreen('screen-player-create');
}

function populateNationalities() {
    const select = document.getElementById('player-nationality');
    if (!select) return;
    if (select.options.length > 1) return;

    NATIONALITIES_DB.forEach(n => {
        const opt = document.createElement('option');
        opt.value = n.name;
        opt.textContent = `${n.flag} ${n.name}`;
        select.appendChild(opt);
    });
}

let selectedLeagueId = null;

function goToLeagueSelect() {
    const list = document.getElementById('leagues-list');
    if (!list) return;

    list.innerHTML = LEAGUES_DB.leagues.map(l => `
        <div class="list-item" onclick="selectLeague('${l.id}')">
            <span><span class="flag">${l.flag}</span>${l.name}</span>
            <span style="color:#8fa9c4;font-size:0.85rem;">${l.tier === 1 ? 'الدرجة الأولى' : 'الدرجة الثانية'}</span>
        </div>
    `).join('');
    showScreen('screen-league-select');
}

function selectLeague(leagueId) {
    selectedLeagueId = leagueId;
    const league = getLeagueById(leagueId);
    const list = document.getElementById('clubs-list');
    const clubs = getClubsByLeague(leagueId);

    if (!list) return;

    list.innerHTML = clubs.map(c => `
        <div class="list-item" onclick="selectClub('${c.name}')">
            <span>${c.name}</span>
            <span style="color:#8fa9c4;font-size:0.85rem;">قوة ${c.strength}</span>
        </div>
    `).join('');

    const titleEl = document.querySelector('#screen-club-select h2');
    if (titleEl) titleEl.textContent = 'اختر النادي — ' + league.name;

    showScreen('screen-club-select');
}

function selectClub(clubName) {
    const league = getLeagueById(selectedLeagueId);
    const club = getClubByName(selectedLeagueId, clubName);
    if (!league || !club) return;

    const isGoalkeeper = newPlayerData.position === 'حارس مرمى';

    const career = {
        id: generateId(),
        type: 'player',
        playerName: newPlayerData.name,
        nationality: newPlayerData.nationality,
        position: newPlayerData.position,
        leagueId: selectedLeagueId,
        leagueName: league.name,
        clubName: club.name,
        clubStrength: club.strength,
        country: league.country,
        createdAt: Date.now(),
        stats: isGoalkeeper
            ? { diving: 60, passing: 60, saving: 60, physical: 60, power: 60 }
            : { shooting: 60, passing: 60, speed: 60, physical: 60, power: 60 },
        totalRating: 60,
        points: 0,
        reputation: 0,
        money: 5000,
        season: '2026/2027',
        day: 25,
        month: 9,
        year: 2026
    };

    career.contract = generateContract(career, club.name, club.strength);

    career.squads = {};
    const clubs = getClubsByLeague(selectedLeagueId);
    clubs.forEach(c => {
        career.squads[c.name] = generateSquad(
            selectedLeagueId,
            c.name,
            c.strength,
            league.country
        );
    });

    career.leagueTable = buildLeagueTable(career);
    initSeasonCompetitions(career);
    career.offers = [];

    saveCareer(career);
    openPlayerCareer(career.id);
    startAutosave();
}

function saveAndExit() {
    if (activeCareer) saveCareer(activeCareer);
    activeCareer = null;
    showScreen('screen-main');
}

function saveAndExitCoach() {
    if (activeCoach) saveCareer(activeCoach);
    activeCoach = null;
    showScreen('screen-main');
}

function goBackFromTable() {
    if (activeCoach) showScreen('screen-coach');
    else showScreen('screen-career');
}

function goBackFromStats() {
    if (activeCoach) showScreen('screen-coach');
    else showScreen('screen-career');
}

function goBackToMainCareer() {
    if (activeCoach) showScreen('screen-coach');
    else showScreen('screen-career');
}

// بدء الحفظ التلقائي
document.addEventListener('DOMContentLoaded', () => {
    startAutosave();

    const playerForm = document.getElementById('player-form');
    if (playerForm) {
        playerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            newPlayerData = {
                name: document.getElementById('player-name').value.trim(),
                nationality: document.getElementById('player-nationality').value,
                position: document.getElementById('player-position').value
            };
            goToLeagueSelect();
        });
    }
});