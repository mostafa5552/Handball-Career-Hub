<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="theme-color" content="#0a1929">
    <title>HANDBALL CAREER HUB</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div id="app">

        <!-- ============ الشاشة الرئيسية ============ -->
        <section id="screen-main" class="screen active">
            <div class="logo">
                <h1>HANDBALL</h1>
                <h2>CAREER HUB</h2>
                <p class="subtitle">لعبة مهنة لاعب ومدرب كرة اليد</p>
            </div>
            <div class="menu-buttons">
                <button class="btn-primary" onclick="goToSavedCareers()">📂 دخول مهنة محفوظة</button>
                <button class="btn-primary" onclick="goToNewCareer()">➕ مهنة جديدة</button>
            </div>
        </section>

        <!-- ============ شاشة المهن المحفوظة ============ -->
        <section id="screen-saved" class="screen">
            <header class="screen-header">
                <button class="btn-back" onclick="showScreen('screen-main')">← رجوع</button>
                <h2>المهن المحفوظة</h2>
            </header>
            <div id="saved-careers-list" class="careers-list"></div>
        </section>

        <!-- ============ شاشة اختيار نوع المهنة ============ -->
        <section id="screen-new" class="screen">
            <header class="screen-header">
                <button class="btn-back" onclick="showScreen('screen-main')">← رجوع</button>
                <h2>اختر نوع المهنة</h2>
            </header>
            <div class="menu-buttons">
                <button class="btn-primary" onclick="goToPlayerCreation()">🏃 مهنة لاعب</button>
                <button class="btn-primary" onclick="goToCoachCreation()">📋 مهنة مدرب</button>
            </div>
        </section>

        <!-- ============ شاشة إنشاء لاعب ============ -->
        <section id="screen-player-create" class="screen">
            <header class="screen-header">
                <button class="btn-back" onclick="showScreen('screen-new')">← رجوع</button>
                <h2>إنشاء لاعب جديد</h2>
            </header>
            <form id="player-form" class="form">
                <label>اسم اللاعب</label>
                <input type="text" id="player-name" required placeholder="مثال: محمد أحمد">

                <label>الجنسية</label>
                <select id="player-nationality" required>
                    <option value="">اختر الجنسية</option>
                </select>

                <label>المركز</label>
                <select id="player-position" required>
                    <option value="">اختر المركز</option>
                    <option value="مهاجم">مهاجم (ظهير)</option>
                    <option value="جناح">جناح</option>
                    <option value="لاعب دائرة">لاعب دائرة (بيفوت)</option>
                    <option value="حارس مرمى">حارس مرمى</option>
                </select>

                <button type="submit" class="btn-primary">التالي ←</button>
            </form>
        </section>

        <!-- ============ شاشة اختيار الدوري ============ -->
        <section id="screen-league-select" class="screen">
            <header class="screen-header">
                <button class="btn-back" onclick="showScreen('screen-player-create')">← رجوع</button>
                <h2>اختر الدوري</h2>
            </header>
            <div id="leagues-list" class="list-container"></div>
        </section>

        <!-- ============ شاشة اختيار النادي ============ -->
        <section id="screen-club-select" class="screen">
            <header class="screen-header">
                <button class="btn-back" onclick="goToLeagueSelect()">← رجوع</button>
                <h2>اختر النادي</h2>
            </header>
            <div id="clubs-list" class="list-container"></div>
        </section>

        <!-- ============ شاشة الكارير ============ -->
        <section id="screen-career" class="screen">
            <div class="career-topbar">
                <span id="career-date">—</span>
                <div class="career-actions">
                    <button class="btn-small" onclick="goToDevelopment()">📈 تطوير</button>
                    <button class="btn-small" onclick="saveAndExit()">💾 حفظ</button>
                </div>
            </div>

            <div class="career-card">
                <div id="career-player-info"></div>
            </div>

            <div class="career-stats-row">
                <div class="stat-box">
                    <div class="stat-label">القوة الكلية</div>
                    <div class="stat-number" id="career-rating">60</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">النقاط</div>
                    <div class="stat-number" id="career-points">0</div>
                </div>
            </div>

            <button id="career-action-btn" class="btn-primary" onclick="handleCareerAction()">⏭️ تخطي اليوم</button>

            <!-- أزرار البطولات -->
            <div class="career-competitions-row">
                <button class="btn-competition" onclick="goToLeagueTable()">📊 جدول الدوري</button>
                <button class="btn-competition" onclick="goToMySquad()">👥 فريقي</button>
                <button class="btn-competition" onclick="goToCup()">🏆 الكأس</button>
                <button class="btn-competition" onclick="goToContinental()">🌍 البطولة القارية</button>
            </div>

            <div class="section-title">آخر المباريات</div>
            <div id="career-recent-matches"></div>
        </section>

        <!-- ============ شاشة التطوير ============ -->
        <section id="screen-development" class="screen">
            <header class="screen-header">
                <button class="btn-back" onclick="showScreen('screen-career')">← رجوع</button>
                <h2>التطوير الذاتي</h2>
            </header>

            <div class="dev-header">
                <div class="dev-header-item">
                    <div class="label">النقاط المتاحة</div>
                    <div class="value" id="dev-points">0</div>
                </div>
                <div class="dev-header-item">
                    <div class="label">القوة الكلية</div>
                    <div class="value" id="dev-rating">60</div>
                </div>
            </div>

            <div id="development-stats"></div>
        </section>

        <!-- ============ شاشة جدول الدوري ============ -->
        <section id="screen-league-table" class="screen">
            <header class="screen-header">
                <button class="btn-back" onclick="showScreen('screen-career')">← رجوع</button>
                <h2 id="league-table-title">جدول الدوري</h2>
            </header>
            <div id="league-table-position" class="league-position-badge">مركزك: —</div>
            <div class="league-table-container">
                <table class="league-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>الفريق</th>
                            <th>ل</th>
                            <th>ف</th>
                            <th>ت</th>
                            <th>خ</th>
                            <th>له:عليه</th>
                            <th>نقاط</th>
                        </tr>
                    </thead>
                    <tbody id="league-table-body"></tbody>
                </table>
            </div>
        </section>

        <!-- ============ شاشة الكأس ============ -->
        <section id="screen-cup" class="screen">
            <header class="screen-header">
                <button class="btn-back" onclick="showScreen('screen-career')">← رجوع</button>
                <h2 id="cup-title">الكأس</h2>
            </header>
            <div id="cup-bracket"></div>
        </section>

        <!-- ============ شاشة البطولة القارية ============ -->
        <section id="screen-continental" class="screen">
            <header class="screen-header">
                <button class="btn-back" onclick="showScreen('screen-career')">← رجوع</button>
                <h2 id="continental-title">البطولة القارية</h2>
            </header>
            <div id="continental-body"></div>
        </section>

        <!-- ============ شاشة فريقي ============ -->
        <section id="screen-squad" class="screen">
            <header class="screen-header">
                <button class="btn-back" onclick="showScreen('screen-career')">← رجوع</button>
                <h2 id="squad-title">قائمة الفريق</h2>
            </header>
            <div id="squad-list"></div>
        </section>

        <!-- ============ شاشة المحاكاة ============ -->
        <section id="screen-match" class="screen">
            <div class="match-topbar">
                <div class="match-team">
                    <div class="match-club-name" id="match-my-club">—</div>
                    <div class="match-score" id="match-my-score">0</div>
                </div>
                <div class="match-center">
                    <div class="match-time" id="match-clock">00:00</div>
                    <div class="match-vs">ضد</div>
                </div>
                <div class="match-team">
                    <div class="match-club-name" id="match-opp-club">—</div>
                    <div class="match-score" id="match-opp-score">0</div>
                </div>
            </div>

            <div class="match-progress-bar">
                <div class="match-progress-fill" id="match-progress"></div>
            </div>

            <div class="match-scenario-box">
                <div class="match-minute" id="match-minute">الدقيقة 1</div>
                <div class="match-scenario" id="match-scenario-text">—</div>
            </div>

            <div class="match-choices" id="match-choices"></div>

            <div class="match-final-overlay" id="match-final" style="display:none;">
                <div class="match-final-card">
                    <h2 id="match-final-title">نهاية المباراة</h2>
                    <div class="match-final-score" id="match-final-score">0 - 0</div>
                    <div class="match-final-stats" id="match-final-stats"></div>
                    <button class="btn-primary" onclick="closeMatchAndReturn()">العودة للكارير</button>
                </div>
            </div>
        </section>

    </div>

    <!-- ============ ملفات الجافاسكربت ============ -->
    <script src="js/database.js"></script>
    <script src="js/names.js"></script>
    <script src="js/game.js"></script>
    <script src="js/league-sim.js"></script>
    <script src="js/match.js"></script>
    <script src="js/competitions.js"></script>
    <script src="js/competitions-ui.js"></script>
    <script src="js/app.js"></script>
</body>
</html>