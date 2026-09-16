/* ============================================================
   HANDBALL CAREER HUB — قاعدة البيانات الكاملة
   يشمل: الدوريات + الكؤوس + البطولات + الأندية + الجنسيات
   ============================================================ */

// ============================================================
// 1) الدوريات المحلية
// ============================================================
const LEAGUES_DB = {
    leagues: [
        { id: 'egy_premier', name: 'الدوري المصري الممتاز', country: 'مصر', flag: '🇪🇬', tier: 1 },
        { id: 'egy_second', name: 'الدوري المصري الدرجة الثانية', country: 'مصر', flag: '🇪🇬', tier: 2 },
        { id: 'ksa_premier', name: 'الدوري السعودي', country: 'السعودية', flag: '🇸🇦', tier: 1 },
        { id: 'kuw_premier', name: 'الدوري الكويتي', country: 'الكويت', flag: '🇰🇼', tier: 1 },
        { id: 'esp_premier', name: 'الدوري الإسباني', country: 'إسبانيا', flag: '🇪🇸', tier: 1 },
        { id: 'esp_second', name: 'الدوري الإسباني الدرجة الثانية', country: 'إسبانيا', flag: '🇪🇸', tier: 2 },
        { id: 'ger_premier', name: 'الدوري الألماني', country: 'ألمانيا', flag: '🇩🇪', tier: 1 },
        { id: 'fra_premier', name: 'الدوري الفرنسي', country: 'فرنسا', flag: '🇫🇷', tier: 1 },
        { id: 'den_premier', name: 'الدوري الدنماركي', country: 'الدنمارك', flag: '🇩🇰', tier: 1 },
        { id: 'hun_premier', name: 'الدوري المجري', country: 'المجر', flag: '🇭🇺', tier: 1 },
        { id: 'pol_premier', name: 'الدوري البولندي', country: 'بولندا', flag: '🇵🇱', tier: 1 },
        { id: 'cro_premier', name: 'الدوري الكرواتي', country: 'كرواتيا', flag: '🇭🇷', tier: 1 },
        { id: 'kor_premier', name: 'الدوري الكوري الجنوبي', country: 'كوريا الجنوبية', flag: '🇰🇷', tier: 1 }
    ],

    cups: [
        { id: 'egy_cup', name: 'الكأس المصري الممتاز', country: 'مصر', leagueId: 'egy_premier' },
        { id: 'egy_cup_second', name: 'الكأس المصري الدرجة الثانية', country: 'مصر', leagueId: 'egy_second' },
        { id: 'ksa_cup', name: 'الكأس السعودي', country: 'السعودية', leagueId: 'ksa_premier' },
        { id: 'kuw_cup', name: 'الكأس الكويتي', country: 'الكويت', leagueId: 'kuw_premier' },
        { id: 'esp_cup', name: 'الكأس الإسباني', country: 'إسبانيا', leagueId: 'esp_premier' },
        { id: 'esp_cup_second', name: 'الكأس الإسباني الدرجة الثانية', country: 'إسبانيا', leagueId: 'esp_second' },
        { id: 'ger_cup', name: 'الكأس الألماني', country: 'ألمانيا', leagueId: 'ger_premier' },
        { id: 'fra_cup', name: 'الكأس الفرنسي', country: 'فرنسا', leagueId: 'fra_premier' },
        { id: 'den_cup', name: 'الكأس الدنماركي', country: 'الدنمارك', leagueId: 'den_premier' },
        { id: 'hun_cup', name: 'الكأس المجري', country: 'المجر', leagueId: 'hun_premier' },
        { id: 'pol_cup', name: 'الكأس البولندي', country: 'بولندا', leagueId: 'pol_premier' },
        { id: 'cro_cup', name: 'الكأس الكرواتي', country: 'كرواتيا', leagueId: 'cro_premier' },
        { id: 'kor_cup', name: 'الكأس الكوري الجنوبي', country: 'كوريا الجنوبية', leagueId: 'kor_premier' }
    ],

    continental_clubs: [
        { id: 'caf_champions', name: 'دوري أبطال أفريقيا', continent: 'أفريقيا', teams: 16 },
        { id: 'ehf_champions', name: 'دوري أبطال أوروبا', continent: 'أوروبا', teams: 24 },
        { id: 'ehf_european', name: 'الدوري الأوروبي', continent: 'أوروبا', teams: 24 },
        { id: 'ehf_cup', name: 'كأس أوروبا', continent: 'أوروبا', teams: 32 },
        { id: 'asian_champions', name: 'البطولة الآسيوية للأندية أبطال الدوري', continent: 'آسيا', teams: 12 },
        { id: 'super_globe', name: 'كأس العالم للأندية سوبر غلوب', continent: 'عالمي', teams: 8 }
    ],

    national_teams: [
        { id: 'africa_nations', name: 'بطولة الأمم الأفريقية للرجال', continent: 'أفريقيا', cycle: 'كل سنتين' },
        { id: 'ehf_euro', name: 'بطولة أمم أوروبا للرجال', continent: 'أوروبا', cycle: 'كل سنتين' },
        { id: 'wc_qual_europe', name: 'تصفيات المونديال الأوروبية', continent: 'أوروبا', cycle: 'كل سنتين' },
        { id: 'asian_champ', name: 'بطولة آسيا للرجال للكبار', continent: 'آسيا', cycle: 'كل سنتين' },
        { id: 'world_championship', name: 'كأس العالم لكرة اليد', continent: 'عالمي', cycle: 'كل سنتين' }
    ]
};

// ============================================================
// 2) الأندية
// ============================================================
const CLUBS_DB = {

    egy_premier: [
        { name: 'الأهلي', city: 'القاهرة', strength: 88 },
        { name: 'الزمالك', city: 'الجيزة', strength: 86 },
        { name: 'سبورتنج', city: 'الإسكندرية', strength: 78 },
        { name: 'الجزيرة', city: 'القاهرة', strength: 76 },
        { name: 'سموحة', city: 'الإسكندرية', strength: 74 },
        { name: 'طلائع الجيش', city: 'القاهرة', strength: 73 },
        { name: 'البنك الأهلي', city: 'القاهرة', strength: 72 },
        { name: 'المصري', city: 'بورسعيد', strength: 71 },
        { name: 'الإسماعيلي', city: 'الإسماعيلية', strength: 70 },
        { name: 'إنبي', city: 'القاهرة', strength: 69 },
        { name: 'المقاولون العرب', city: 'القاهرة', strength: 68 },
        { name: 'بيراميدز', city: 'القاهرة', strength: 67 },
        { name: 'الاتحاد السكندري', city: 'الإسكندرية', strength: 66 },
        { name: 'حرس الحدود', city: 'الإسكندرية', strength: 65 },
        { name: 'الداخلية', city: 'القاهرة', strength: 64 },
        { name: 'أسوان', city: 'أسوان', strength: 62 },
        { name: 'الشرقية', city: 'الزقازيق', strength: 61 },
        { name: 'غزل المحلة', city: 'المحلة', strength: 60 }
    ],

    egy_second: [
        { name: 'الترسانة', city: 'الإسكندرية', strength: 58 },
        { name: 'بترول أسيوط', city: 'أسيوط', strength: 56 },
        { name: 'المنصورة', city: 'المنصورة', strength: 55 },
        { name: 'بلقاس', city: 'الدقهلية', strength: 54 },
        { name: 'منتخب السويس', city: 'السويس', strength: 53 },
        { name: 'بني سويف', city: 'بني سويف', strength: 52 },
        { name: 'كفر الشيخ', city: 'كفر الشيخ', strength: 51 },
        { name: 'الفيوم', city: 'الفيوم', strength: 50 },
        { name: 'قنا', city: 'قنا', strength: 49 },
        { name: 'ملوي', city: 'المنيا', strength: 48 },
        { name: 'دمنهور', city: 'دمنهور', strength: 47 },
        { name: 'المنيا', city: 'المنيا', strength: 46 },
        { name: 'طنطا', city: 'طنطا', strength: 45 },
        { name: 'المحلة', city: 'المحلة', strength: 44 },
        { name: 'دمياط', city: 'دمياط', strength: 43 },
        { name: 'أسوان ب', city: 'أسوان', strength: 42 }
    ],

    ksa_premier: [
        { name: 'الاتحاد', city: 'جدة', strength: 82 },
        { name: 'الأهلي السعودي', city: 'جدة', strength: 80 },
        { name: 'النور', city: 'القطيف', strength: 78 },
        { name: 'الخليج', city: 'سيهات', strength: 76 },
        { name: 'مضر', city: 'القديح', strength: 75 },
        { name: 'الصفا', city: 'صفوى', strength: 73 },
        { name: 'الهدى', city: 'العوامية', strength: 71 },
        { name: 'الابتسام', city: 'أم الحمام', strength: 70 },
        { name: 'الترجي', city: 'وادي الدواسر', strength: 68 },
        { name: 'العدالة', city: 'الأحساء', strength: 66 }
    ],

    kuw_premier: [
        { name: 'الكويت', city: 'مدينة الكويت', strength: 78 },
        { name: 'القادسية', city: 'حولي', strength: 76 },
        { name: 'السالمية', city: 'السالمية', strength: 74 },
        { name: 'العربي', city: 'مدينة الكويت', strength: 73 },
        { name: 'كاظمة', city: 'كاظمة', strength: 71 },
        { name: 'الجهراء', city: 'الجهراء', strength: 70 },
        { name: 'التضامن', city: 'الفروانية', strength: 68 },
        { name: 'برقان', city: 'الفروانية', strength: 66 },
        { name: 'الصليبخات', city: 'مدينة الكويت', strength: 64 },
        { name: 'الفحيحيل', city: 'الفحيحيل', strength: 62 }
    ],

    esp_premier: [
        { name: 'برشلونة', city: 'برشلونة', strength: 95 },
        { name: 'ريال مدريد', city: 'مدريد', strength: 88 },
        { name: 'أتلتيكو مدريد', city: 'مدريد', strength: 85 },
        { name: 'جرانوليرز', city: 'جرانوليرز', strength: 83 },
        { name: 'بيداسوا إرون', city: 'إرون', strength: 80 },
        { name: 'لوغرونيو', city: 'لوغرونيو', strength: 78 },
        { name: 'كوارت', city: 'كوارت دي بويت', strength: 76 },
        { name: 'بلنسية', city: 'بلنسية', strength: 75 },
        { name: 'بويبلو نويفو', city: 'إشبيلية', strength: 73 },
        { name: 'أنييتا', city: 'أنييتا', strength: 71 },
        { name: 'إشبيلية', city: 'إشبيلية', strength: 70 },
        { name: 'بينيفوليت', city: 'بينيفوليت', strength: 68 },
        { name: 'ثيوداد ريال', city: 'ثيوداد ريال', strength: 66 },
        { name: 'أوغستينوس', city: 'مدريد', strength: 64 },
        { name: 'غوايغو', city: 'لاس بالماس', strength: 62 },
        { name: 'ويسلا', city: 'سرقسطة', strength: 60 }
    ],

    esp_second: [
        { name: 'ألكوبينداس', city: 'ألكوبينداس', strength: 58 },
        { name: 'بورغوس', city: 'بورغوس', strength: 56 },
        { name: 'لوغو', city: 'لوغو', strength: 55 },
        { name: 'أوغستينوس ب', city: 'مدريد', strength: 54 },
        { name: 'إيبيزا', city: 'إيبيزا', strength: 53 },
        { name: 'ألكالا', city: 'ألكالا', strength: 52 },
        { name: 'سان أنطونيو', city: 'بلنسية', strength: 51 },
        { name: 'أليكانتي', city: 'أليكانتي', strength: 50 },
        { name: 'سرقسطة', city: 'سرقسطة', strength: 49 },
        { name: 'بينيدورم', city: 'بينيدورم', strength: 48 },
        { name: 'تراسا', city: 'تراسا', strength: 47 },
        { name: 'برشلونة ب', city: 'برشلونة', strength: 46 },
        { name: 'ريال مدريد ب', city: 'مدريد', strength: 45 },
        { name: 'خيريز', city: 'خيريز', strength: 44 },
        { name: 'ملقة', city: 'ملقة', strength: 43 },
        { name: 'قرطبة', city: 'قرطبة', strength: 42 }
    ],

    ger_premier: [
        { name: 'كيل', city: 'كيل', strength: 94 },
        { name: 'ماغديبورغ', city: 'ماغديبورغ', strength: 90 },
        { name: 'فيزلاو', city: 'فيزلاو', strength: 86 },
        { name: 'برلين', city: 'برلين', strength: 85 },
        { name: 'ميلزونغن', city: 'ميلزونغن', strength: 83 },
        { name: 'راين نيكار لوفن', city: 'مانهايم', strength: 82 },
        { name: 'هامبورغ', city: 'هامبورغ', strength: 80 },
        { name: 'شتوتغارت', city: 'شتوتغارت', strength: 78 },
        { name: 'إرلانغن', city: 'إرلانغن', strength: 76 },
        { name: 'ليبنغ', city: 'ليبنغ', strength: 74 },
        { name: 'إيسن', city: 'إيسن', strength: 73 },
        { name: 'غومرسباخ', city: 'غومرسباخ', strength: 72 },
        { name: 'فولفسبورغ', city: 'فولفسبورغ', strength: 70 },
        { name: 'هانوفر', city: 'هانوفر', strength: 68 },
        { name: 'لايبزيغ', city: 'لايبزيغ', strength: 66 },
        { name: 'شتاينسهايم', city: 'شتاينسهايم', strength: 64 },
        { name: 'إرلنغن الثاني', city: 'إرلنغن', strength: 62 },
        { name: 'نوردورن', city: 'نوردورن', strength: 60 }
    ],

    fra_premier: [
        { name: 'باريس سان جيرمان', city: 'باريس', strength: 96 },
        { name: 'مونبلييه', city: 'مونبلييه', strength: 90 },
        { name: 'نانت', city: 'نانت', strength: 86 },
        { name: 'شامبيري', city: 'شامبيري', strength: 83 },
        { name: 'إكس-أوفيرن', city: 'إكس إن بروفانس', strength: 81 },
        { name: 'تولوز', city: 'تولوز', strength: 79 },
        { name: 'سان رافائيل', city: 'سان رافائيل', strength: 77 },
        { name: 'إيفري', city: 'إيفري', strength: 75 },
        { name: 'سيليستات', city: 'سيليستات', strength: 73 },
        { name: 'كريتاي', city: 'كريتاي', strength: 71 },
        { name: 'ليموند', city: 'ليموند', strength: 70 },
        { name: 'نانسي', city: 'نانسي', strength: 68 },
        { name: 'أورليانز', city: 'أورليانز', strength: 66 },
        { name: 'بواتييه', city: 'بواتييه', strength: 64 },
        { name: 'إستر', city: 'إستر', strength: 62 },
        { name: 'سيركل نانت', city: 'نانت', strength: 60 }
    ],

    den_premier: [
        { name: 'غوغ', city: 'غوغ', strength: 88 },
        { name: 'ألبورغ', city: 'ألبورغ', strength: 85 },
        { name: 'سيلكيبورغ', city: 'سيلكيبورغ', strength: 84 },
        { name: 'ميديولاند', city: 'هيرنينغ', strength: 82 },
        { name: 'كوبنهاغن', city: 'كوبنهاغن', strength: 80 },
        { name: 'سكاندربورغ', city: 'سكاندربورغ', strength: 78 },
        { name: 'ريبن', city: 'ريبن', strength: 76 },
        { name: 'نوردسيالاند', city: 'هيليرود', strength: 75 },
        { name: 'سوندربورغ', city: 'سوندربورغ', strength: 73 },
        { name: 'أودنسه', city: 'أودنسه', strength: 71 },
        { name: 'آرهوس', city: 'آرهوس', strength: 70 },
        { name: 'فيبورغ', city: 'فيبورغ', strength: 68 },
        { name: 'مورس', city: 'مورس', strength: 66 },
        { name: 'فريديريسيا', city: 'فريديريسيا', strength: 64 },
        { name: 'هولستيبرو', city: 'هولستيبرو', strength: 62 },
        { name: 'غريمستيد', city: 'غريمستيد', strength: 60 }
    ],

    hun_premier: [
        { name: 'فيزبريم', city: 'فيزبريم', strength: 92 },
        { name: 'سولنوكي', city: 'سولنوك', strength: 82 },
        { name: 'غرانيت', city: 'ناغيكانيزا', strength: 80 },
        { name: 'بيكسكابابا', city: 'بيكسكابابا', strength: 78 },
        { name: 'سغيد', city: 'سغيد', strength: 76 },
        { name: 'تاتابانيا', city: 'تاتابانيا', strength: 74 },
        { name: 'بودابست', city: 'بودابست', strength: 73 },
        { name: 'بالاتونفوريد', city: 'بالاتونفوريد', strength: 71 },
        { name: 'دوناويفاروش', city: 'دوناويفاروش', strength: 70 },
        { name: 'كوملوي', city: 'كوملو', strength: 68 },
        { name: 'داباس', city: 'داباس', strength: 66 },
        { name: 'إيغير', city: 'إيغير', strength: 64 },
        { name: 'كيسكيميت', city: 'كيسكيميت', strength: 62 },
        { name: 'أوروشازا', city: 'أوروشازا', strength: 60 }
    ],

    pol_premier: [
        { name: 'كيلسي', city: 'كيلسي', strength: 91 },
        { name: 'بلاوكي', city: 'بلاوكي', strength: 82 },
        { name: 'زاموشتش', city: 'زاموشتش', strength: 78 },
        { name: 'بوزنان', city: 'بوزنان', strength: 76 },
        { name: 'غدانسك', city: 'غدانسك', strength: 74 },
        { name: 'كراكوف', city: 'كراكوف', strength: 73 },
        { name: 'لوبين', city: 'لوبين', strength: 71 },
        { name: 'تشيستوخوفا', city: 'تشيستوخوفا', strength: 70 },
        { name: 'كاليسز', city: 'كاليسز', strength: 68 },
        { name: 'بيدغوشتش', city: 'بيدغوشتش', strength: 66 },
        { name: 'غلينيغ', city: 'غلينيغ', strength: 64 },
        { name: 'ستارغارد', city: 'ستارغارد', strength: 62 },
        { name: 'بيتوم', city: 'بيتوم', strength: 60 },
        { name: 'لوبلين', city: 'لوبلين', strength: 58 }
    ],

    cro_premier: [
        { name: 'زغرب', city: 'زغرب', strength: 86 },
        { name: 'سبليت', city: 'سبليت', strength: 80 },
        { name: 'زادار', city: 'زادار', strength: 78 },
        { name: 'فاراجدين', city: 'فاراجدين', strength: 75 },
        { name: 'رييكا', city: 'رييكا', strength: 73 },
        { name: 'أوسييك', city: 'أوسييك', strength: 71 },
        { name: 'دوبروفنيك', city: 'دوبروفنيك', strength: 70 },
        { name: 'بوغو', city: 'بوغو', strength: 68 },
        { name: 'سيبنيك', city: 'سيبنيك', strength: 66 },
        { name: 'كارلوفاتش', city: 'كارلوفاتش', strength: 64 },
        { name: 'فينكوفتسي', city: 'فينكوفتسي', strength: 62 },
        { name: 'أوميش', city: 'أوميش', strength: 60 }
    ],

    kor_premier: [
        { name: 'دوسان', city: 'سول', strength: 80 },
        { name: 'كوريا يونيفرستي', city: 'سول', strength: 76 },
        { name: 'إنتشون', city: 'إنتشون', strength: 74 },
        { name: 'سامتشوك', city: 'سامتشوك', strength: 73 },
        { name: 'كيونغنام', city: 'كيونغنام', strength: 71 },
        { name: 'سول', city: 'سول', strength: 70 },
        { name: 'تشونغتشيونغ', city: 'تشونغتشيونغ', strength: 68 },
        { name: 'تشونان', city: 'تشونان', strength: 66 },
        { name: 'كيونغبو', city: 'كيونغبو', strength: 64 },
        { name: 'دائيغو', city: 'دائيغو', strength: 62 }
    ]
};

// ============================================================
// 3) الجنسيات المتاحة
// ============================================================
const NATIONALITIES_DB = [
    { name: 'مصر', flag: '🇪🇬' },
    { name: 'السعودية', flag: '🇸🇦' },
    { name: 'الكويت', flag: '🇰🇼' },
    { name: 'إسبانيا', flag: '🇪🇸' },
    { name: 'ألمانيا', flag: '🇩🇪' },
    { name: 'فرنسا', flag: '🇫🇷' },
    { name: 'الدنمارك', flag: '🇩🇰' },
    { name: 'المجر', flag: '🇭🇺' },
    { name: 'بولندا', flag: '🇵🇱' },
    { name: 'كرواتيا', flag: '🇭🇷' },
    { name: 'كوريا الجنوبية', flag: '🇰🇷' }
];

// ============================================================
// 4) دوال مساعدة لقاعدة البيانات
// ============================================================
function getLeagueById(id) {
    return LEAGUES_DB.leagues.find(l => l.id === id);
}

function getLeaguesByTier(tier) {
    return LEAGUES_DB.leagues.filter(l => l.tier === tier);
}

function getClubsByLeague(leagueId) {
    return CLUBS_DB[leagueId] || [];
}

function getClubByName(leagueId, clubName) {
    const clubs = getClubsByLeague(leagueId);
    return clubs.find(c => c.name === clubName);
}

function getNationalityFlag(nationalityName) {
    const n = NATIONALITIES_DB.find(x => x.name === nationalityName);
    return n ? n.flag : '🏳️';
}