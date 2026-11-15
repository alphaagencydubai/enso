// ENSO's facts and card. Everything named here is theirs (from @ensocafebakery):
// the name, the line "Circle of togetherness", the address, the phone, the
// Snappfood shop, and every pastry with a photograph. Prices, hours, the coffee
// list and the gathering sets are Alpha's placeholders until ENSO confirms them.

export const ENSO = {
  name: { en: "ENSO Cafe & Bakery", fa: "کافه بیکری اِن سو" },
  line: { en: "Circle of togetherness", fa: "دایره‌ی با هم بودن" },
  phone: "09331149599",
  phoneShow: "0933 114 9599",
  instagram: "ensocafebakery",
  snappfood: "https://m.snappfood.ir/",
  address: {
    en: "Valiasr, Mokhaberat roundabout, Shariati Blvd — opposite Ailar Alley, Tabriz",
    fa: "تبریز، ولیعصر، فلکه مخابرات، بلوار شریعتی، روبروی کوچه آیلار",
  },
  map: "https://www.google.com/maps/search/?api=1&query=Enso+Cafe+Bakery+Valiasr+Tabriz",
  open: 8, close: 23, // placeholder hours
  ovenAt: 8,
};

const P = (src, pos = "50% 50%", zoom = 1) => ({ src, pos, zoom });

export const CATS = [
  { id: "oven", en: "From the oven", fa: "از تنور" },
  { id: "rolls", en: "New York rolls", fa: "رول نیویورکی" },
  { id: "cakes", en: "Cakes", fa: "کیک و دسر" },
  { id: "breakfast", en: "Breakfast", fa: "صبحانه" },
  { id: "bread", en: "Bread", fa: "نان" },
  { id: "coffee", en: "Coffee", fa: "قهوه" },
  { id: "cold", en: "Cold drinks", fa: "نوشیدنی سرد" },
];

// opts: a list of choice groups. Each choice may carry a price delta.
const MILK = { id: "milk", en: "Milk", fa: "شیر", choices: [
  { id: "whole", en: "Whole", fa: "معمولی" },
  { id: "oat", en: "Oat", fa: "جو دوسر", add: 35000 },
  { id: "almond", en: "Almond", fa: "بادام", add: 40000 },
] };
const SIZE = { id: "size", en: "Cup", fa: "لیوان", choices: [
  { id: "r", en: "Regular", fa: "معمولی" },
  { id: "l", en: "Large", fa: "بزرگ", add: 30000 },
] };
const WARM = { id: "warm", en: "Serve", fa: "سرو", choices: [
  { id: "warm", en: "Warmed", fa: "گرم" },
  { id: "room", en: "As it is", fa: "همان‌طور" },
] };

export const MENU = [
  // from the oven
  { id: "croissant", cat: "oven", price: 165000, img: P("layers", "50% 80%", 1.6), tag: "daily",
    en: "Butter croissant", fa: "کروسان کره‌ای",
    den: "The art of layers — laminated by hand, baked fresh every morning.",
    dfa: "هنر لایه‌ها؛ با دست لایه‌لایه می‌شود و هر صبح تازه پخته می‌شود.", opts: [WARM] },
  { id: "swirl", cat: "oven", price: 210000, img: P("comfort", "30% 60%", 1.25),
    en: "Swirl croissant", fa: "کروسان پیچ",
    den: "A taste of comfort: the croissant dough wound up high and baked golden.",
    dfa: "طعم آرامش؛ خمیر کروسان که بلند پیچیده و طلایی پخته می‌شود.", opts: [WARM] },
  { id: "twist", cat: "oven", price: 195000, img: P("twist", "50% 32%", 1.35), tag: "loved",
    en: "Chocolate twist", fa: "تویست شکلاتی",
    den: "Baked to perfection, golden and flaky, with dark chocolate twisted through.",
    dfa: "طلایی و پوسته‌پوسته، با شکلات تلخ که لابه‌لایش پیچیده شده.", opts: [WARM] },
  { id: "cinnamon", cat: "oven", price: 185000, img: P("rack", "86% 22%", 2.4),
    en: "Cinnamon roll", fa: "رول دارچینی",
    den: "Laminated dough rolled with cinnamon sugar, glazed while warm.",
    dfa: "خمیر لایه‌ای با شکر دارچینی، که گرم‌گرم لعاب می‌خورد.", opts: [WARM] },
  { id: "bow", cat: "oven", price: 215000, img: P("rack", "38% 48%", 2.3),
    en: "Chocolate bow", fa: "پاپیون شکلاتی",
    den: "Two-tone chocolate laminated dough, tied in the middle like a bow.",
    dfa: "خمیر لایه‌ای دو رنگ شکلاتی، که از وسط مثل پاپیون بسته شده.", opts: [WARM] },
  { id: "cube", cat: "oven", price: 245000, img: P("box", "52% 48%", 1.8), tag: "new",
    en: "Strawberry cube", fa: "کروسان مکعبی توت‌فرنگی",
    den: "A cube of croissant, strawberry glaze, freeze-dried strawberry and one candied slice.",
    dfa: "کروسان مکعبی با گلیز توت‌فرنگی، پودر توت‌فرنگی خشک و یک برش توت‌فرنگی.", opts: [] },

  // new york rolls
  { id: "ny-pistachio", cat: "rolls", price: 340000, img: P("pistachio", "50% 4%", 2), tag: "signature",
    en: "Pistachio New York roll", fa: "رول نیویورکی پسته",
    den: "Handmade pistachio filling, white chocolate coating, crushed pistachio rim.",
    dfa: "مغز پسته‌ی دست‌ساز، روکش شکلات سفید و لبه‌ی پسته‌ی خردشده." },
  { id: "ny-nutella", cat: "rolls", price: 320000, img: P("nutella", "50% 4%", 2),
    en: "Nutella New York roll", fa: "رول نیویورکی نوتلا",
    den: "Nutella filling, Nutella and roasted hazelnut coating.",
    dfa: "مغز نوتلا، روکش نوتلا و فندق برشته." },
  { id: "ny-lotus", cat: "rolls", price: 320000, img: P("lotus", "50% 4%", 2),
    en: "Lotus Biscoff New York roll", fa: "رول نیویورکی لوتوس",
    den: "Biscoff butter filling, Biscoff coating, and a Lotus biscuit on top.",
    dfa: "مغز کره‌ی لوتوس، روکش لوتوس و یک بیسکویت لوتوس روی آن." },

  // cakes
  { id: "tart", cat: "cakes", price: 260000, img: P("trio", "62% 12%", 2.0),
    en: "Strawberry tart", fa: "تارت توت‌فرنگی",
    den: "Butter crust, vanilla cream, fresh strawberries and pineapple.",
    dfa: "پوسته‌ی کره‌ای، کرم وانیل، توت‌فرنگی تازه و آناناس." },
  { id: "pina", cat: "cakes", price: 285000, img: P("trio", "50% 48%", 2.2), tag: "loved",
    en: "Piña colada", fa: "پینا کولادا",
    den: "Dark chocolate dome, coconut mousse, caramelised pineapple crown.",
    dfa: "گنبد شکلات تلخ، موس نارگیل و تاجی از آناناس کاراملی." },
  { id: "sansebastian", cat: "cakes", price: 295000, img: P("trio", "30% 82%", 2.0),
    en: "San Sebastián cheesecake", fa: "چیزکیک سن سباستین",
    den: "Burnt Basque cheesecake, chocolate and pistachio on top.",
    dfa: "چیزکیک باسکی سوخته، با شکلات و پسته روی آن." },

  // breakfast
  { id: "nest-egg", cat: "breakfast", price: 365000, img: P("egg", "60% 50%", 1.25), tag: "new",
    en: "Egg & salami nest", fa: "نِست تخم‌مرغ و سالامی",
    den: "A croissant cup, a soft-fried egg, salami, red lettuce and black sesame.",
    dfa: "کاپ کروسان، تخم‌مرغ عسلی، سالامی، کاهوی قرمز و کنجد سیاه.",
    opts: [{ id: "egg", en: "Egg", fa: "تخم‌مرغ", choices: [
      { id: "soft", en: "Soft", fa: "عسلی" }, { id: "firm", en: "Firm", fa: "سفت" }] }] },
  { id: "nest-cheese", cat: "breakfast", price: 310000, img: P("egg", "8% 22%", 2.2),
    en: "Cream cheese & tomato nest", fa: "نِست پنیر خامه‌ای و گوجه",
    den: "Whipped cream cheese, roasted cherry tomatoes, rosemary.",
    dfa: "پنیر خامه‌ای زده‌شده، گوجه‌گیلاسی کبابی و رزماری." },
  { id: "nest-honey", cat: "breakfast", price: 290000, img: P("egg", "4% 78%", 2.2),
    en: "Honey & walnut nest", fa: "نِست عسل و گردو",
    den: "Croissant cup, butter, honey and toasted walnuts.",
    dfa: "کاپ کروسان، کره، عسل و گردوی برشته." },

  // bread
  { id: "sesame", cat: "bread", price: 145000, img: P("bread", "50% 70%", 1.1),
    en: "Sesame country loaf", fa: "نان روستایی کنجدی",
    den: "A round loaf with a crackling sesame crust. Out of the oven at eight.",
    dfa: "نان گرد با پوسته‌ی تُرد کنجدی. ساعت هشت از تنور بیرون می‌آید." },
  { id: "parsley", cat: "bread", price: 175000, img: P("parsley", "50% 72%", 1.3),
    en: "Fresh bread with cheese & parsley", fa: "نان تازه با پنیر و جعفری",
    den: "Freshness in every bite: warm bread, white cheese, a field of parsley.",
    dfa: "تازگی در هر لقمه؛ نان گرم، پنیر سفید و جعفری فراوان." },

  // coffee
  { id: "espresso", cat: "coffee", price: 110000, img: P("cups", "70% 40%", 1.6),
    en: "Espresso", fa: "اسپرسو", den: "A double shot.", dfa: "دبل شات." },
  { id: "americano", cat: "coffee", price: 125000, img: P("cups", "70% 40%", 1.6),
    en: "Americano", fa: "آمریکانو", den: "Double shot over hot water.", dfa: "دبل شات روی آب داغ.", opts: [SIZE] },
  { id: "cappuccino", cat: "coffee", price: 165000, img: P("cups", "28% 62%", 1.7),
    en: "Cappuccino", fa: "کاپوچینو", den: "Equal milk and foam.", dfa: "شیر و فوم به یک اندازه.", opts: [MILK, SIZE] },
  { id: "latte", cat: "coffee", price: 175000, img: P("cups", "28% 62%", 1.7),
    en: "Latte", fa: "لاته", den: "Silky milk, double shot.", dfa: "شیر مخملی، دبل شات.", opts: [MILK, SIZE] },
  { id: "spanish", cat: "coffee", price: 195000, img: P("bag", "50% 30%", 1.3), tag: "loved",
    en: "Spanish latte", fa: "اسپنیش لاته", den: "Condensed milk, double shot, a little cinnamon.",
    dfa: "شیر عسلی، دبل شات و کمی دارچین.", opts: [MILK, SIZE] },
  { id: "pistachio-latte", cat: "coffee", price: 215000, img: P("cups", "70% 40%", 1.6),
    en: "Pistachio latte", fa: "لاته پسته", den: "Our pistachio paste, steamed milk, double shot.",
    dfa: "خمیر پسته‌ی خودمان، شیر و دبل شات.", opts: [MILK, SIZE] },

  // cold
  { id: "coldbrew", cat: "cold", price: 260000, img: P("coldbrew", "50% 55%", 1.1), tag: "signature",
    en: "Cold brew · bottle", fa: "قهوه سرد دم · بطری",
    den: "Steeped for eighteen hours. 250 ml. Please take a second — it's all about the moment.",
    dfa: "هجده ساعت دم می‌کشد. ۲۵۰ میلی‌لیتر. یک لحظه مکث کنید؛ همه‌چیز همین لحظه است." },
  { id: "iced-latte", cat: "cold", price: 185000, img: P("pour", "50% 40%", 1.2),
    en: "Iced latte", fa: "آیس لاته", den: "Double shot, cold milk, ice.", dfa: "دبل شات، شیر سرد و یخ.", opts: [MILK] },
  { id: "iced-americano", cat: "cold", price: 140000, img: P("room", "50% 60%", 1.4),
    en: "Iced Americano", fa: "آیس آمریکانو", den: "Double shot over ice and cold water.", dfa: "دبل شات روی یخ و آب سرد." },
  { id: "blueberry", cat: "cold", price: 170000, img: null, tag: "new",
    en: "Blueberry iced tea", fa: "چای سرد بلوبری", den: "Black tea, blueberry, a squeeze of lime.", dfa: "چای سیاه، بلوبری و کمی لیمو." },
];

export const byId = (id) => MENU.find((m) => m.id === id);

// ---- Gatherings: pieces sold by the dozen, and sets that scale with guests ----
export const PIECES = [
  { id: "g-croissant", en: "Mini butter croissant", fa: "مینی کروسان کره‌ای", price: 75000, unit: 12, img: P("layers", "50% 62%", 1.15) },
  { id: "g-ny", en: "Mini New York rolls · mixed", fa: "مینی رول نیویورکی · میکس", price: 125000, unit: 12, img: P("pistachio", "50% 22%", 1.5) },
  { id: "g-cinnamon", en: "Mini cinnamon roll", fa: "مینی رول دارچینی", price: 85000, unit: 12, img: P("rack", "86% 22%", 2.4) },
  { id: "g-twist", en: "Chocolate twist", fa: "تویست شکلاتی", price: 185000, unit: 6, img: P("twist", "50% 32%", 1.35) },
  { id: "g-tart", en: "Mini strawberry tart", fa: "مینی تارت توت‌فرنگی", price: 110000, unit: 12, img: P("trio", "62% 12%", 2.0) },
  { id: "g-pina", en: "Mini piña colada", fa: "مینی پینا کولادا", price: 120000, unit: 12, img: P("trio", "50% 48%", 2.2) },
  { id: "g-sansebastian", en: "San Sebastián · whole, 12 slices", fa: "سن سباستین · کامل، ۱۲ برش", price: 2650000, unit: 1, img: P("trio", "30% 82%", 2.0) },
  { id: "g-bites", en: "Cream cheese & tomato bites", fa: "لقمه‌ی پنیر خامه‌ای و گوجه", price: 95000, unit: 12, img: P("egg", "8% 22%", 2.2) },
  { id: "g-coldbrew", en: "Cold brew bottle", fa: "بطری قهوه سرد دم", price: 245000, unit: 6, img: P("coldbrew", "50% 55%", 1.1) },
  { id: "g-coffeebox", en: "Coffee box · 10 cups", fa: "باکس قهوه · ۱۰ لیوان", price: 1450000, unit: 1, img: P("cups", "50% 50%", 1.2) },
  { id: "g-bread", en: "Sesame country loaf", fa: "نان روستایی کنجدی", price: 145000, unit: 4, img: P("bread", "50% 70%", 1.1) },
];

// per guest: [pieceId, how many per guest]
export const SETS = [
  { id: "morning", en: "Morning circle", fa: "دایره‌ی صبح", den: "Croissants, rolls and coffee for a morning together.",
    dfa: "کروسان، رول و قهوه برای یک صبح دورهمی.", img: P("rack", "50% 50%", 1),
    per: [["g-croissant", 1], ["g-ny", 1], ["g-coffeebox", 0.1]] },
  { id: "sweet", en: "Sweet circle", fa: "دایره‌ی شیرین", den: "Tarts, piña coladas and cheesecake — two pieces a guest.",
    dfa: "تارت، پینا کولادا و چیزکیک؛ برای هر مهمان دو تکه.", img: P("trio", "50% 50%", 1),
    per: [["g-tart", 0.75], ["g-pina", 0.75], ["g-sansebastian", 1 / 24]] },
  { id: "office", en: "Office circle", fa: "دایره‌ی اداری", den: "Twists, bites and cold brew for a meeting that runs long.",
    dfa: "تویست، لقمه و قهوه سرد برای جلسه‌ای که طول می‌کشد.", img: P("cups", "50% 50%", 1),
    per: [["g-twist", 0.5], ["g-bites", 1], ["g-coldbrew", 0.5]] },
  { id: "quiet", en: "Quiet table", fa: "میز آرام", den: "For a memorial: cinnamon rolls, bread and coffee, served simply.",
    dfa: "برای مراسم یادبود: رول دارچینی، نان و قهوه، ساده و آرام.", img: P("bread", "50% 70%", 1.1),
    per: [["g-cinnamon", 1], ["g-bread", 0.125], ["g-coffeebox", 0.1]] },
];

export const OCCASIONS = [
  { id: "birthday", en: "Birthday", fa: "تولد" },
  { id: "wedding", en: "Engagement & wedding", fa: "عقد و عروسی" },
  { id: "office", en: "Office & corporate", fa: "اداری و شرکتی" },
  { id: "memorial", en: "Memorial", fa: "مراسم یادبود" },
  { id: "graduation", en: "Graduation", fa: "جشن فارغ‌التحصیلی" },
  { id: "other", en: "Something else", fa: "مناسبت دیگر" },
];

export const TIERS = [ // pieces → discount
  { min: 300, off: 0.15 }, { min: 150, off: 0.10 }, { min: 60, off: 0.05 },
];
export const BOX = { price: 120000, holds: 12 }; // ENSO gift box with the circle
export const DELIVERY = 450000;
export const DEPOSIT = 0.3;
