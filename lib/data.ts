// ── Prayers ──────────────────────────────────────────────
export const PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
export const SUNNAH = ['Fajr S.', 'Duha', 'Tahajjud', 'Witr']

// ── Moods ─────────────────────────────────────────────────
export const MOODS = ['😔', '😐', '🙂', '😊', '🌟']
export const MOOD_NAMES = ['Difficult', 'Okay', 'Good', 'Great', 'Amazing']

// ── Baby blues feelings ────────────────────────────────────
export const BB_FEELINGS = [
  '😊 Happy', '😢 Tearful', '😰 Anxious', '😔 Low', '😤 Frustrated',
  '🥰 Grateful', '😌 Calm', '😵 Overwhelmed', '💪 Strong', '🌫️ Foggy',
]

// ── Reward ideas ───────────────────────────────────────────
export const REWARD_IDEAS = [
  'Luxurious bath 🛁', 'New skincare product 🧴', 'Favourite restaurant 🍽️',
  'New book 📚', 'Scented candle 🕯️', 'Nature walk 🌿', 'Cinema outing 🎬',
  'New clothing item 👗', 'Museum or exhibition 🖼️', 'Full day of rest 😴',
  'Spa treatment 💆', 'New journal 📓',
]

// ── Weight milestones ──────────────────────────────────────
export const WT_DAYS = [1, 22, 43, 64, 90]
export const MEAS_LABELS = ['Waist', 'Hips', 'Chest', 'Right Arm', 'Left Arm', 'Right Thigh']

// ── Self-care items ────────────────────────────────────────
export const SCM = ['Cleanser', 'Toner / Essence', 'Serum', 'Moisturiser', 'SPF (daytime)']
export const SCE = ['Makeup Removal', 'Cleanser', 'Toner / Mist', 'Serum / Retinol', 'Night Cream']
export const SCH = ['Hair wash', 'Hair mask / oil', 'Scalp massage', 'Brush & detangle']
export const SCB = ['Body scrub / exfoliate', 'Body lotion', 'Nails — check & file', 'Lip scrub & balm']
export const SCT = ['Brush teeth (morning)', 'Brush teeth (evening)', 'Floss 🦷', 'Mouthwash']
export const SCBF = [
  'Nipple cream / lanolin 🧴', 'Breast pads changed 🤍',
  'Breast massage / warm compress', 'Checked for engorgement / blocked ducts',
  'Took lactation supplement / herb',
]

// ── Default habits ─────────────────────────────────────────
export type HabitGroup = {
  id: number; name: string; emoji: string
  subs: string[]; pick: boolean; op: boolean
}

export const DEFAULT_HABITS: HabitGroup[] = [
  { id: 1, name: 'Adhkar', emoji: '🌅', subs: ['Adhkar al-Sabah', 'Adhkar al-Masa', 'Istighfar (100x) 🤲'], pick: true, op: false },
  { id: 2, name: 'Quran', emoji: '📖', subs: ['Daily Wird', 'Tafsir / Reflection', 'Islamic reading', 'Listen to Quran'], pick: true, op: false },
  { id: 3, name: 'Mind 🧠', emoji: '🧠', subs: ['Read a Book', 'Listen to Audiobook', 'Listen to Podcast'], pick: true, op: true },
  { id: 4, name: 'Nourishment', emoji: '🥗', subs: ['Lactation-friendly meal 🤱', 'Postnatal vitamins 💊', 'No junk food', 'Eat breakfast', 'Meal prep / planning'], pick: true, op: false },
]

// ── Rules ──────────────────────────────────────────────────
export type Rule = { n: number; ico: string; t: string; cl: string }

export const RULES: Rule[] = [
  { n: 1, ico: '🕌', t: 'Never miss a prayer — even praying sitting down counts. Allah sees your effort.', cl: 'Spiritual' },
  { n: 2, ico: '🕐', t: 'Pray all 5 prayers — even if late, even if short. Show up for Allah first.', cl: 'Spiritual' },
  { n: 3, ico: '📖', t: 'Read or listen to Quran daily — even one verse while nursing counts.', cl: 'Spiritual' },
  { n: 4, ico: '🤲', t: 'Say your morning & evening adhkar and istighfar — protect your heart.', cl: 'Spiritual' },
  { n: 5, ico: '💧', t: 'Drink at least 10–12 glasses of water daily — breastfeeding increases your needs significantly.', cl: 'Physical' },
  { n: 6, ico: '🚶', t: 'Move gently — a short walk, stretching, or pelvic floor exercises all count.', cl: 'Physical' },
  { n: 7, ico: '🥗', t: 'Eat clean, nourishing food — your body is recovering. Fuel it with love.', cl: 'Physical' },
  { n: 8, ico: '💊', t: 'Take your postnatal vitamins without skipping. Non-negotiable.', cl: 'Physical' },
  { n: 9, ico: '🌙', t: 'Rest whenever you can — napping with baby IS productive. You\'re healing.', cl: 'Physical' },
  { n: 10, ico: '💛', t: 'Accept help. Ask for help. Receiving support is strength, not weakness.', cl: 'Physical' },
  { n: 11, ico: '🧠', t: 'Feed your mind gently — even 10 minutes of reading or a podcast.', cl: 'Mind' },
  { n: 12, ico: '📝', t: 'Write in your journal — even one line. This season is worth remembering.', cl: 'Mind' },
  { n: 13, ico: '✨', t: 'Do your skincare — even just moisturiser. It\'s 5 minutes of self-love.', cl: 'Self-Care' },
  { n: 14, ico: '🦷', t: 'Brush and floss every evening — take care of the mama.', cl: 'Self-Care' },
  { n: 15, ico: '💆', t: 'Weekly hair & body care when you can — no pressure, just love.', cl: 'Self-Care' },
  { n: 16, ico: '⚖️', t: 'Track your weight when you feel ready — no rush, no pressure.', cl: 'Physical' },
  { n: 17, ico: '🌸', t: 'Start every day with gratitude — write 3 things. Even tiny ones.', cl: 'Mind' },
  { n: 18, ico: '💡', t: 'End every day reflecting — what did you learn today?', cl: 'Mind' },
  { n: 19, ico: '💛', t: 'Be gentle with yourself — you just grew a human. Progress over perfection.', cl: 'Mind' },
  { n: 20, ico: '💪', t: 'Show up even on the hardest days. Even 1% counts. You are enough.', cl: 'Physical' },
  { n: 21, ico: '⭐', t: 'Set small, realistic priorities each day — 1 or 2 is enough.', cl: 'Mind' },
  { n: 22, ico: '🎁', t: 'Reward yourself every 7 days you show up. You deserve it more than anyone.', cl: 'Mind' },
  { n: 23, ico: '🤱', t: 'Honour this postpartum season — it\'s temporary, precious, and powerful.', cl: 'Mind' },
  { n: 24, ico: '🌿', t: 'You are not behind. You are not failing. You are doing something extraordinary.', cl: 'Mind' },
  { n: 25, ico: '🎉', t: 'Celebrate every single small win — you are healing, growing and thriving.', cl: 'Mind' },
]

// ── Quotes ────────────────────────────────────────────────
export type Quote = { ar: string; en: string; src: string }

export const QUOTES: Quote[] = [
  { ar: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ', en: 'And whoever relies upon Allah — then He is sufficient for him.', src: 'Quran 65:3' },
  { ar: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', en: 'Indeed, with hardship comes ease.', src: 'Quran 94:6' },
  { ar: 'وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ', en: 'Do not weaken and do not grieve, for you will be superior.', src: 'Quran 3:139' },
  { ar: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', en: 'For indeed, with hardship will be ease.', src: 'Quran 94:5' },
  { ar: 'وَاصْبِرْ وَمَا صَبْرُكَ إِلَّا بِاللَّهِ', en: 'Be patient, and your patience is only through Allah.', src: 'Quran 16:127' },
  { ar: 'وَأَن لَّيْسَ لِلْإِنسَانِ إِلَّا مَا سَعَىٰ', en: 'That there is not for man except what he strives for.', src: 'Quran 53:39' },
  { ar: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ', en: 'O believers! Seek help through patience and prayer.', src: 'Quran 2:153' },
  { ar: 'وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ', en: 'And He is with you wherever you are.', src: 'Quran 57:4' },
  { ar: 'رَبِّ زِدْنِي عِلْمًا', en: 'My Lord, increase me in knowledge.', src: 'Quran 20:114' },
  { ar: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', en: 'Allah is sufficient for us, and He is the best Disposer of affairs.', src: 'Quran 3:173' },
  { ar: 'أَحَبُّ الأَعمالِ إلى اللهِ أَدوَمُها وإن قَلَّ', en: 'The most beloved deeds to Allah are the most consistent, even if small.', src: 'Prophet Muhammad ﷺ — Bukhari' },
  { ar: 'طَلَبُ العِلمِ فَريضَةٌ عَلَى كُلِّ مُسلِمٍ', en: 'Seeking knowledge is an obligation upon every Muslim.', src: 'Prophet Muhammad ﷺ — Ibn Majah' },
  { ar: 'إذا أَردتَ أن تَعرِفَ قَدرَكَ عِندَ اللهِ، فانظُر فِيمَ يَستَعمِلُكَ', en: 'If you want to know your worth to Allah, see what He employs you in.', src: "Ibn Ata'illah al-Sakandari" },
  { ar: 'مَن عَرَفَ نَفسَهُ فَقَد عَرَفَ رَبَّهُ', en: 'Whoever knows himself, knows his Lord.', src: 'Attributed — Islamic wisdom' },
  { ar: 'الدُّنيا مَزرَعَةُ الآخِرَة', en: 'This world is the farm of the Hereafter.', src: 'Ali ibn Abi Talib رضي الله عنه' },
  { ar: 'كُن في الدُّنيا كَأَنَّكَ غَريبٌ أو عابِرُ سَبيل', en: 'Be in this world as if you were a stranger or a traveler.', src: 'Prophet Muhammad ﷺ — Bukhari' },
  { ar: 'الصِّحَّةُ والفَراغُ نِعمَتانِ مَغبُونٌ فِيهِما كَثيرٌ مِنَ النَّاس', en: 'Health and free time are two blessings many people are cheated of.', src: 'Prophet Muhammad ﷺ — Bukhari' },
  { ar: 'مَن لَم يَشكُرِ النَّاسَ لَم يَشكُرِ اللَّهَ', en: 'Whoever does not thank people has not thanked Allah.', src: 'Prophet Muhammad ﷺ — Abu Dawud' },
  { ar: 'إنَّ اللهَ لا يُغَيِّرُ مَا بِقَومٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِم', en: 'Indeed, Allah will not change the condition of a people until they change what is in themselves.', src: 'Quran 13:11' },
  { ar: 'خَيرُكُم مَن تَعَلَّمَ القُرآنَ وعَلَّمَهُ', en: 'The best of you are those who learn the Quran and teach it.', src: 'Prophet Muhammad ﷺ — Bukhari' },
  { ar: 'اغتَنِم خَمساً قَبلَ خَمس: شَبابَكَ قَبلَ هَرَمِك', en: 'Take advantage of five before five: your youth before old age.', src: 'Prophet Muhammad ﷺ — Al-Hakim' },
  { ar: 'أَقرَبُ ما يَكُونُ العَبدُ مِن رَبِّهِ وهو ساجِد', en: 'The closest a servant is to his Lord is when he is in prostration.', src: 'Prophet Muhammad ﷺ — Muslim' },
  { ar: 'لا تَغضَب', en: 'Do not be angry.', src: 'Prophet Muhammad ﷺ — Bukhari' },
  { ar: 'المُؤمِنُ القَوِيُّ خَيرٌ وأَحَبُّ إلى اللهِ مِنَ المُؤمِنِ الضَّعيف', en: 'The strong believer is better and more beloved to Allah than the weak believer.', src: 'Prophet Muhammad ﷺ — Muslim' },
  { ar: 'تَبَسُّمُكَ في وَجهِ أَخِيكَ صَدَقَة', en: 'Your smile in the face of your brother is charity.', src: 'Prophet Muhammad ﷺ — Tirmidhi' },
  { ar: 'خَيرُ النَّاسِ أَنفَعُهُم لِلنَّاس', en: 'The best of people are those most beneficial to people.', src: 'Prophet Muhammad ﷺ — Al-Tabarani' },
  { ar: 'اعمَل لِدُنياكَ كَأَنَّكَ تَعِيشُ أَبَداً، واعمَل لِآخِرَتِكَ كَأَنَّكَ تَمُوتُ غَداً', en: 'Work for your world as if you live forever, and work for your Hereafter as if you die tomorrow.', src: 'Ali ibn Abi Talib رضي الله عنه' },
  { ar: 'النِّيَّةُ الصَّالِحَةُ تَبلُغُ بِصاحِبِها مَا لَا تَبلُغُهُ الأَعمال', en: 'A sincere intention takes its owner where deeds alone cannot.', src: 'Ibn al-Qayyim رحمه الله' },
  { ar: 'كُلَّما ازدَدتَ عِلماً، ازدَدتَ مَعرِفَةً بِجَهلِك', en: 'The more knowledge you gain, the more you realize your ignorance.', src: "Imam al-Shafi'i رحمه الله" },
  { ar: 'رِضا اللهِ غايَتِي', en: 'The pleasure of Allah is my goal.', src: 'Islamic supplication' },
  { ar: 'وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ', en: 'Perhaps you dislike something that is good for you.', src: 'Quran 2:216' },
  { ar: 'سَلامَةُ الإِنسانِ في حِفظِ اللِّسان', en: 'The safety of a person lies in guarding their tongue.', src: "Imam al-Shafi'i رحمه الله" },
  { ar: 'إن أَردتَ أن تَعِيشَ سَعيداً، فَعِش زاهِداً', en: 'If you wish to live happily, live with contentment.', src: 'Ali ibn Abi Talib رضي الله عنه' },
  { ar: 'مَن صَبَرَ ظَفِر', en: 'Whoever is patient will succeed.', src: 'Arabic proverb / Islamic wisdom' },
  { ar: 'قَيِّد العِلمَ بالكِتابَة', en: 'Preserve knowledge by writing it down.', src: 'Ali ibn Abi Talib رضي الله عنه' },
  { ar: 'خَيرُ الكَلامِ ما قَلَّ ودَلَّ', en: 'The best speech is that which is brief and meaningful.', src: 'Islamic wisdom' },
  { ar: 'مَن أَحَبَّ أن يَعلَمَ ما لَهُ عِندَ اللهِ، فَليَنظُر ما للهِ عِندَهُ', en: "Whoever wants to know his standing with Allah should look at Allah's standing in his heart.", src: "Ibn Ata'illah al-Sakandari" },
  { ar: 'وَمَا أُوتِيتُم مِّنَ الْعِلْمِ إِلَّا قَلِيلًا', en: 'And you have been given of knowledge only a little.', src: 'Quran 17:85' },
  { ar: 'جاهِد نَفسَكَ على الطَّاعَة قَبلَ أن تَنشَغِلَ بِمُجاهَدَةِ غَيرِك', en: 'Strive against your own soul in obedience before you busy yourself with others.', src: 'Ibn al-Qayyim رحمه الله' },
  { ar: 'البَركَةُ في البُكُور', en: 'Blessing is in the early morning.', src: 'Prophet Muhammad ﷺ — Abu Dawud' },
  { ar: 'مَن قَرَأَ القُرآنَ وعَمِلَ بِما فِيهِ أُلبِسَ والِداهُ تاجاً', en: 'Whoever reads the Quran and acts by it, his parents will be crowned on the Day of Judgement.', src: 'Prophet Muhammad ﷺ — Abu Dawud' },
  { ar: 'إنَّ اللهَ يُحِبُّ إذا عَمِلَ أحَدُكُم عَمَلاً أن يُتقِنَهُ', en: 'Allah loves that when one of you does a job, he does it with excellence.', src: 'Prophet Muhammad ﷺ — Al-Bayhaqi' },
  { ar: 'التَّفكِيرُ في نِعمَةِ اللهِ عِبادَة', en: 'Reflecting on the blessings of Allah is an act of worship.', src: 'Hasan al-Basri رحمه الله' },
  { ar: 'اليَقِينُ لا يُعطى بالأمانِي، ولكِن بِالعَمَل', en: 'Certainty is not given through wishes, but through action.', src: 'Hasan al-Basri رحمه الله' },
  { ar: 'مَن عَرَفَ قَدرَ نَفسِهِ لَم يُهِنها', en: 'Whoever knows their own worth will not degrade themselves.', src: 'Imam al-Ghazali رحمه الله' },
  { ar: 'الدُّعاءُ سِلاحُ المُؤمِن', en: 'Supplication is the weapon of the believer.', src: 'Ali ibn Abi Talib رضي الله عنه' },
  { ar: 'أَعظَمُ الناسِ قِيمَةً أَكثَرُهُم خِدمَةً للنَّاس', en: 'The greatest of people in value are those who serve others most.', src: 'Islamic wisdom' },
  { ar: 'تُعرَفُ المَرأَةُ بِأَخلاقِها لا بِزِينَتِها', en: 'A woman is known by her character, not her adornment.', src: 'Islamic wisdom' },
  { ar: 'لا تَيأَس مِن رَوحِ اللهِ', en: 'Do not despair of the mercy of Allah.', src: 'Quran 12:87' },
  { ar: 'اللهُ وَليُّ الَّذِينَ آمَنُوا يُخرِجُهُم مِنَ الظُّلُماتِ إلى النُّور', en: 'Allah is the ally of those who believe. He brings them out from darkness into light.', src: 'Quran 2:257' },
  { ar: 'مَن تَواضَعَ للهِ رَفَعَهُ اللهُ', en: 'Whoever humbles themselves for Allah, Allah raises them.', src: 'Prophet Muhammad ﷺ — Muslim' },
  { ar: 'مَن جَدَّ وَجَد', en: 'Whoever strives will find.', src: 'Arabic proverb' },
  { ar: 'كُن مَع اللهِ وَلا تُبالِ بِشَيء', en: 'Be with Allah and worry about nothing.', src: "Ibn Ata'illah al-Sakandari" },
  { ar: 'الجَنَّةُ حُفَّت بِالمَكارِه والنَّارُ حُفَّت بِالشَّهَوات', en: 'Paradise is surrounded by hardships and Hell is surrounded by desires.', src: 'Prophet Muhammad ﷺ — Bukhari' },
  { ar: 'إنَّ البَدَنَ إذا أُترِفَ تَعِبَ', en: 'When the body is pampered, it grows weary.', src: "Imam al-Shafi'i رحمه الله" },
  { ar: 'أَجمِل الظَّنَّ بِاللهِ', en: 'Have the best opinion of Allah.', src: 'Ibn al-Qayyim رحمه الله' },
  { ar: 'الصَّلاةُ عِمادُ الدِّين', en: 'Prayer is the pillar of the religion.', src: 'Prophet Muhammad ﷺ — Al-Bayhaqi' },
  { ar: 'كُن صادِقاً مَع نَفسِكَ أَوَّلاً', en: 'Be honest with yourself first.', src: 'Islamic wisdom' },
  { ar: 'الوَقتُ كالسَّيف إن لَم تَقطَعهُ قَطَعَك', en: 'Time is like a sword — if you do not cut it, it will cut you.', src: "Imam al-Shafi'i رحمه الله" },
  { ar: 'مَن لَم يُحاسِب نَفسَهُ لَم يَتَقَدَّم', en: 'Whoever does not hold themselves accountable will not progress.', src: 'Omar ibn al-Khattab رضي الله عنه' },
  { ar: 'حاسِبُوا أَنفُسَكُم قَبلَ أن تُحاسَبُوا', en: 'Hold yourselves accountable before you are held accountable.', src: 'Omar ibn al-Khattab رضي الله عنه' },
  { ar: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ', en: 'Indeed, Allah is with the patient.', src: 'Quran 2:153' },
  { ar: 'وَقُل رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا', en: 'Say: My Lord, have mercy on them as they raised me when I was small.', src: 'Quran 17:24' },
  { ar: 'قُلْ إِن كُنتُمْ تُحِبُّونَ اللَّهَ فَاتَّبِعُونِي', en: 'Say: If you love Allah, then follow me.', src: 'Quran 3:31' },
  { ar: 'إِنَّ اللَّهَ جَمِيلٌ يُحِبُّ الْجَمَالَ', en: 'Verily, Allah is beautiful and loves beauty.', src: 'Prophet Muhammad ﷺ — Muslim' },
  { ar: 'الطَّهُورُ شَطرُ الإِيمَان', en: 'Cleanliness is half of faith.', src: 'Prophet Muhammad ﷺ — Muslim' },
  { ar: 'مَن سَلَكَ طَرِيقاً يَلتَمِسُ فِيهِ عِلماً سَهَّلَ اللهُ لَهُ طَرِيقاً إلى الجَنَّة', en: 'Whoever travels a path seeking knowledge, Allah eases for them a path to Paradise.', src: 'Prophet Muhammad ﷺ — Muslim' },
  { ar: 'العِلمُ نُورٌ يَقذِفُهُ اللهُ في قَلبِ مَن يَشَاء', en: 'Knowledge is a light Allah casts into the heart of whomever He wills.', src: 'Imam Malik رحمه الله' },
  { ar: 'خَيرُ العُمُرِ ما انقَضَى في طاعَةِ الله', en: 'The best of life is that which is spent in obedience to Allah.', src: 'Hasan al-Basri رحمه الله' },
  { ar: 'أَعقِل وتَوَكَّل', en: 'Take precautions and then trust in Allah.', src: 'Prophet Muhammad ﷺ — Tirmidhi' },
  { ar: 'النَّفسُ إن لَم تَشغَلها بِالحَقِّ شَغَلَتكَ بِالباطِل', en: 'If you do not engage your soul in truth, it will engage you in falsehood.', src: 'Ibn al-Qayyim رحمه الله' },
  { ar: 'الإيمانُ ما وَقَرَ في القَلبِ وصَدَّقَهُ العَمَل', en: 'Faith is what settles in the heart and is confirmed by action.', src: 'Prophet Muhammad ﷺ — Tirmidhi' },
  { ar: 'تَخَلَّق بِأَخلاقِ اللهِ', en: 'Take on the character traits of Allah.', src: 'Hadith — Al-Bayhaqi' },
  { ar: 'لا يَزالُ لِسانُكَ رَطباً بِذِكرِ الله', en: 'Let your tongue always be moist with the remembrance of Allah.', src: 'Prophet Muhammad ﷺ — Tirmidhi' },
  { ar: 'مَن أَحَبَّ أن يَكُونَ أَكرَمَ النَّاسِ فَليَتَّقِ الله', en: 'Whoever wishes to be the most noble of people, let them fear Allah.', src: 'Prophet Muhammad ﷺ' },
  { ar: 'الجُودُ لا يُفقِر والاستِغفارُ لا يُذِل', en: 'Generosity does not cause poverty, and seeking forgiveness does not bring humiliation.', src: 'Ali ibn Abi Talib رضي الله عنه' },
  { ar: 'تَعَلَّم ثُمَّ عَلِّم', en: 'Learn, then teach.', src: 'Islamic principle' },
  { ar: 'رُبَّ كَلِمَةٍ خَيرٌ مِن أَلفِ كَلِمَة', en: 'One word of wisdom is worth more than a thousand words.', src: 'Islamic wisdom' },
  { ar: 'قِيمَةُ كُلِّ امرِئٍ ما يُحسِنُه', en: 'The value of every person is in what they do well.', src: 'Ali ibn Abi Talib رضي الله عنه' },
  { ar: 'اللَّهُمَّ إنِّي أَسأَلُكَ الثَّباتَ في الأَمر', en: 'O Allah, I ask You for steadfastness in all matters.', src: "Prophet Muhammad ﷺ — Al-Nasa'i" },
  { ar: 'أَحسِن إلى النَّاسِ تَستَعبِد قُلُوبَهُم', en: 'Be good to people and you will win their hearts.', src: 'Ali ibn Abi Talib رضي الله عنه' },
  { ar: 'التَّوبَةُ تَجُبُّ ما قَبلَها', en: 'Repentance wipes away what came before it.', src: 'Prophet Muhammad ﷺ — Tirmidhi' },
  { ar: 'ابدَأ بِنَفسِك', en: 'Begin with yourself.', src: 'Prophet Muhammad ﷺ — Muslim' },
  { ar: 'الحَياءُ لا يَأتِي إلا بِخَير', en: 'Modesty brings nothing but good.', src: 'Prophet Muhammad ﷺ — Bukhari' },
  { ar: 'أَعمَلُ النَّاسِ أَكمَلُهُم عَقلاً', en: 'The most hard-working of people are the most complete in reason.', src: 'Islamic wisdom' },
  { ar: 'إذا أَنعَمَ اللهُ عَلَيكَ بِنِعمَة فأَظهِرها', en: 'When Allah blesses you with a blessing, show it (as gratitude).', src: 'Prophet Muhammad ﷺ — Abu Dawud' },
  { ar: 'حُسنُ الخُلُقِ نِصفُ الدِّين', en: 'Good character is half of the religion.', src: 'Imam al-Ghazali رحمه الله' },
  { ar: 'وَاللَّهُ يُحِبُّ الصَّابِرِينَ', en: 'And Allah loves the patient.', src: 'Quran 3:146' },
  { ar: 'يا أَيُّها الإِنسانُ إِنَّكَ كادِحٌ إِلى رَبِّكَ كَدحاً فَمُلاقِيه', en: 'O mankind, indeed you are working toward your Lord with exertion and will meet Him.', src: 'Quran 84:6' },
]
