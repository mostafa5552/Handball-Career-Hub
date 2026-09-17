/* ============================================================
   HANDBALL CAREER HUB — مولّد الأسماء حسب الجنسية
   ============================================================ */

// ============================================================
// بنوك الأسماء حسب الجنسية
// ============================================================
const NAME_BANK = {
    'مصر': {
        first: ['محمد', 'أحمد', 'محمود', 'مصطفى', 'كريم', 'حسن', 'علي', 'حسين', 'عمر', 'يوسف',
                'إبراهيم', 'خالد', 'طارق', 'سامي', 'هشام', 'عمرو', 'وليد', 'شريف', 'رامي', 'أيمن',
                'عبدالله', 'مروان', 'زياد', 'يحيى', 'أنس', 'باسم', 'حاتم', 'سيف', 'فارس', 'آدم'],
        last: ['أحمد', 'حسن', 'محمود', 'عبد الرحمن', 'السيد', 'إبراهيم', 'خليل', 'فؤاد', 'شاكر',
               'رمضان', 'عبد العزيز', 'الشناوي', 'مصطفى', 'زكي', 'فهمي', 'طه', 'نجيب', 'رشدي',
               'سعيد', 'منصور', 'عبد الله', 'صابر', 'حمدي', 'كمال', 'لطفي']
    },
    'السعودية': {
        first: ['عبدالله', 'محمد', 'أحمد', 'سلطان', 'فهد', 'خالد', 'عبدالعزيز', 'سعود', 'تركي',
                'بندر', 'ماجد', 'نواف', 'مشعل', 'عبدالرحمن', 'يوسف', 'عمر', 'سعد', 'طلال',
                'راكان', 'صالح', 'إبراهيم', 'حسن', 'علي', 'حسين'],
        last: ['العتيبي', 'القحطاني', 'الشمري', 'الدوسري', 'الغامدي', 'الحربي', 'الزهراني',
               'المطيري', 'العنزي', 'السبيعي', 'الرشيدي', 'البلوي', 'الجهني', 'العسيري',
               'الشهري', 'الخالدي', 'المالكي', 'السلمي', 'الثقفي']
    },
    'الكويت': {
        first: ['عبدالله', 'فهد', 'يوسف', 'خالد', 'بدر', 'طلال', 'مشعل', 'عبدالعزيز', 'ناصر',
                'جابر', 'صالح', 'أحمد', 'محمد', 'علي', 'حسين', 'مبارك', 'سعود'],
        last: ['العنزي', 'المطيري', 'الرشيدي', 'الشمري', 'الفضلي', 'العجمي', 'الرشدان',
               'العدواني', 'الخالدي', 'الصباح', 'السعيد', 'المسلم', 'البدر', 'الفهد']
    },
    'إسبانيا': {
        first: ['Carlos', 'Javier', 'Miguel', 'Antonio', 'José', 'David', 'Juan', 'Daniel',
                'Pablo', 'Sergio', 'Alejandro', 'Fernando', 'Adrián', 'Diego', 'Álvaro',
                'Iván', 'Rubén', 'Gonzalo', 'Marcos', 'Raúl', 'Víctor', 'Jorge', 'Hugo', 'Martín'],
        last: ['García', 'Martínez', 'López', 'Sánchez', 'González', 'Rodríguez', 'Fernández',
               'Gómez', 'Ruiz', 'Díaz', 'Moreno', 'Álvarez', 'Romero', 'Alonso', 'Gutiérrez',
               'Navarro', 'Torres', 'Domínguez', 'Vázquez', 'Ramos', 'Gil', 'Serrano', 'Blanco']
    },
    'ألمانيا': {
        first: ['Lukas', 'Jonas', 'Maximilian', 'Felix', 'Paul', 'Leon', 'Finn', 'Elias',
                'Noah', 'Ben', 'Luis', 'Niklas', 'Julian', 'Tim', 'Jan', 'Moritz', 'Philipp',
                'Tobias', 'Kevin', 'Fabian', 'Marvin', 'Dominik', 'Simon', 'David'],
        last: ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner',
               'Becker', 'Schulz', 'Hoffmann', 'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf',
               'Schröder', 'Neumann', 'Schwarz', 'Zimmermann', 'Braun', 'Krüger', 'Hofmann']
    },
    'فرنسا': {
        first: ['Lucas', 'Hugo', 'Louis', 'Gabriel', 'Jules', 'Adam', 'Raphaël', 'Nathan',
                'Théo', 'Tom', 'Léo', 'Mathis', 'Enzo', 'Noah', 'Ethan', 'Antoine', 'Maxime',
                'Julien', 'Thomas', 'Alexandre', 'Nicolas', 'Clément', 'Pierre', 'Paul'],
        last: ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand',
               'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David',
               'Bertrand', 'Roux', 'Vincent', 'Fournier', 'Morel', 'Girard', 'André']
    },
    'الدنمارك': {
        first: ['Magnus', 'Mathias', 'Mikkel', 'Frederik', 'Emil', 'Oliver', 'Noah', 'William',
                'Lucas', 'Oscar', 'Anton', 'Carl', 'Alfred', 'Oskar', 'Marius', 'Andreas',
                'Mikkel', 'Rasmus', 'Mads', 'Jonas', 'Nikolaj', 'Sebastian', 'Kasper'],
        last: ['Nielsen', 'Jensen', 'Hansen', 'Pedersen', 'Andersen', 'Christensen', 'Larsen',
               'Sørensen', 'Rasmussen', 'Jørgensen', 'Petersen', 'Madsen', 'Kristensen',
               'Olsen', 'Thomsen', 'Christiansen', 'Poulsen', 'Johansen', 'Møller', 'Mortensen']
    },
    'المجر': {
        first: ['Bence', 'Máté', 'Dániel', 'Levente', 'Balázs', 'Marcell', 'Ádám', 'Dávid',
                'Zsombor', 'Botond', 'Kristóf', 'Milán', 'Nándor', 'Zoltán', 'Gergő', 'Attila',
                'Tamás', 'László', 'Péter', 'István', 'Gábor', 'Ferenc', 'János'],
        last: ['Nagy', 'Kovács', 'Tóth', 'Szabó', 'Horváth', 'Varga', 'Kiss', 'Molnár',
               'Németh', 'Farkas', 'Balogh', 'Papp', 'Takács', 'Juhász', 'Lakatos', 'Mészáros',
               'Oláh', 'Simon', 'Rácz', 'Fekete', 'Szűcs', 'Török', 'Fodor']
    },
    'بولندا': {
        first: ['Jakub', 'Szymon', 'Antoni', 'Jan', 'Filip', 'Michał', 'Wiktor', 'Piotr',
                'Kacper', 'Bartosz', 'Kamil', 'Mateusz', 'Adam', 'Krzysztof', 'Paweł',
                'Tomasz', 'Marcin', 'Łukasz', 'Marek', 'Andrzej', 'Wojciech'],
        last: ['Nowak', 'Kowalski', 'Wiśniewski', 'Wójcik', 'Kowalczyk', 'Kamiński',
               'Lewandowski', 'Zieliński', 'Szymański', 'Woźniak', 'Dąbrowski', 'Kozłowski',
               'Jankowski', 'Mazur', 'Kwiatkowski', 'Krawczyk', 'Piotrowski', 'Grabowski']
    },
    'كرواتيا': {
        first: ['Ivan', 'Marko', 'Luka', 'Josip', 'Ante', 'Filip', 'Matej', 'Nikola',
                'Petar', 'Tomislav', 'David', 'Kristijan', 'Stjepan', 'Marin', 'Dario',
                'Domagoj', 'Borna', 'Lovro', 'Andrej', 'Zvonimir'],
        last: ['Horvat', 'Kovačević', 'Babić', 'Marić', 'Jurić', 'Novak', 'Kovačić', 'Knežević',
               'Vuković', 'Marković', 'Petrović', 'Matić', 'Tomić', 'Pavlović', 'Božić',
               'Blažević', 'Grgić', 'Pavić', 'Radić', 'Filipović']
    },
    'كوريا الجنوبية': {
        first: ['Min-jun', 'Seo-jun', 'Ji-ho', 'Ha-jun', 'Do-yun', 'Ji-hu', 'Jun-seo',
                'Hyun-woo', 'Ji-hun', 'Seung-min', 'Tae-yang', 'Jae-min', 'Dong-hyun',
                'Sung-min', 'Woo-jin', 'Kyung-ho'],
        last: ['Kim', 'Lee', 'Park', 'Choi', 'Jung', 'Kang', 'Cho', 'Yoon', 'Jang', 'Lim',
               'Han', 'Oh', 'Seo', 'Shin', 'Kwon', 'Hwang', 'Ahn', 'Song']
    }
};

// ============================================================
// دالة توليد اسم عشوائي حسب الجنسية
// ============================================================
function generatePlayerName(nationality) {
    const bank = NAME_BANK[nationality] || NAME_BANK['مصر'];
    const first = bank.first[Math.floor(Math.random() * bank.first.length)];
    const last = bank.last[Math.floor(Math.random() * bank.last.length)];
    return `${first} ${last}`;
}

// ============================================================
// دالة توليد لاعب كامل
// ============================================================
function generatePlayer(nationality, position, strength) {
    const positions = ['مهاجم', 'جناح', 'لاعب دائرة', 'حارس مرمى'];
    const chosenPosition = position || positions[Math.floor(Math.random() * positions.length)];

    // القوة الأساسية حسب قوة الفريق
    const baseStat = Math.max(55, Math.min(90, strength + Math.floor(Math.random() * 10) - 5));

    const isGK = chosenPosition === 'حارس مرمى';
    const stats = isGK
        ? {
            diving: baseStat + Math.floor(Math.random() * 6) - 3,
            passing: baseStat + Math.floor(Math.random() * 6) - 3,
            saving: baseStat + Math.floor(Math.random() * 6) - 3,
            physical: baseStat + Math.floor(Math.random() * 6) - 3,
            power: baseStat + Math.floor(Math.random() * 6) - 3
        }
        : {
            shooting: baseStat + Math.floor(Math.random() * 6) - 3,
            passing: baseStat + Math.floor(Math.random() * 6) - 3,
            speed: baseStat + Math.floor(Math.random() * 6) - 3,
            physical: baseStat + Math.floor(Math.random() * 6) - 3,
            power: baseStat + Math.floor(Math.random() * 6) - 3
        };

    const total = Math.round(Object.values(stats).reduce((a, b) => a + b, 0) / 5);

    return {
        name: generatePlayerName(nationality),
        nationality: nationality,
        position: chosenPosition,
        stats: stats,
        rating: total,
        age: 18 + Math.floor(Math.random() * 15) // 18-32
    };
}

// ============================================================
// توليد قائمة 15 لاعباً لفريق
// ============================================================
function generateSquad(leagueId, clubName, clubStrength, country) {
    // توزيع المراكز
    const positions = [
        'حارس مرمى', 'حارس مرمى',
        'جناح', 'جناح', 'جناح', 'جناح',
        'مهاجم', 'مهاجم', 'مهاجم', 'مهاجم',
        'لاعب دائرة', 'لاعب دائرة', 'لاعب دائرة',
        'جناح', 'مهاجم'
    ];

    return positions.map(pos => generatePlayer(country, pos, clubStrength));
}

// ============================================================
// الحصول على دولة الدوري
// ============================================================
function getCountryByLeagueId(leagueId) {
    const league = getLeagueById(leagueId);
    return league ? league.country : 'مصر';
}

