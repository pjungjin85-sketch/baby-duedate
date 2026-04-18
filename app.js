'use strict';

// ════════════════════════════════════════════════
// 1. 기본 상수
// ════════════════════════════════════════════════

const TG = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const TG_KR = ['갑','을','병','정','무','기','경','신','임','계'];
const TG_WX = [0,0,1,1,2,2,3,3,4,4];

const DZ = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const DZ_KR = ['자','축','인','묘','진','사','오','미','신','유','술','해'];
const DZ_WX = [4,2,0,0,2,1,1,2,3,3,2,4];

const WX = ['목','화','토','금','수'];
const WX_HANJA = ['木','火','土','金','水'];
const WX_CLS = ['wx-wood','wx-fire','wx-earth','wx-metal','wx-water'];
const WX_COLOR = ['var(--wood)','var(--fire)','var(--earth)','var(--metal)','var(--water)'];

const HOURS = [
  {name:'자시',time:'23:00~01:00'},{name:'축시',time:'01:00~03:00'},
  {name:'인시',time:'03:00~05:00'},{name:'묘시',time:'05:00~07:00'},
  {name:'진시',time:'07:00~09:00'},{name:'사시',time:'09:00~11:00'},
  {name:'오시',time:'11:00~13:00'},{name:'미시',time:'13:00~15:00'},
  {name:'신시',time:'15:00~17:00'},{name:'유시',time:'17:00~19:00'},
  {name:'술시',time:'19:00~21:00'},{name:'해시',time:'21:00~23:00'},
];

const IPCHUN = {2023:[2,4],2024:[2,4],2025:[2,3],2026:[2,4],2027:[2,4],2028:[2,4]};

// ── 절기 날짜 수식 계산 (하드코딩 범위 밖 연도용, ±1일 정확도) ──
// 20세기/21세기 각각 보정 상수 (출처: 중국 천문학 연구원 근사식)
const _ST_C21 = [5.4055,3.8971,5.6280,4.8827,5.5220,5.6700,7.1498,7.3941,7.6413,8.1024,7.3921,6.9999];
const _ST_C19 = [6.3811,4.8360,6.3780,5.8922,6.3780,6.4649,7.9218,8.2278,8.4399,9.2083,8.2079,7.7983];
// termIdx: 0=소한(Jan),1=입춘(Feb),2=경칩(Mar),3=청명(Apr),4=입하(May),5=망종(Jun),
//          6=소서(Jul),7=입추(Aug),8=백로(Sep),9=한로(Oct),10=입동(Nov),11=대설(Dec)
function getSolarTermDateCalc(year, termIdx){
  const C = year>=2000 ? _ST_C21 : _ST_C19;
  const Y = year>=2000 ? year-2000 : year-1900;
  return Math.floor(Y*0.2422 + C[termIdx]) - Math.floor((Y-1)/4);
}

const SOLAR_TERMS = {
  2024:[[1,6,1],[2,4,2],[3,5,3],[4,4,4],[5,5,5],[6,5,6],[7,6,7],[8,7,8],[9,7,9],[10,8,10],[11,7,11],[12,7,0]],
  2025:[[1,5,1],[2,3,2],[3,5,3],[4,4,4],[5,5,5],[6,5,6],[7,7,7],[8,7,8],[9,7,9],[10,8,10],[11,7,11],[12,7,0]],
  2026:[[1,5,1],[2,4,2],[3,6,3],[4,5,4],[5,5,5],[6,6,6],[7,7,7],[8,7,8],[9,8,9],[10,8,10],[11,7,11],[12,7,0]],
  2027:[[1,5,1],[2,4,2],[3,6,3],[4,5,4],[5,5,5],[6,6,6],[7,7,7],[8,7,8],[9,8,9],[10,8,10],[11,7,11],[12,7,0]],
};

const TIANYI = {0:[1,7],1:[0,8],2:[11,9],3:[11,9],4:[1,7],5:[0,8],6:[1,7],7:[2,6],8:[3,5],9:[3,5]};
const WENCHANG = {0:5,1:6,2:8,3:9,4:8,5:9,6:11,7:0,8:2,9:3};
const FUXING = {0:8,1:8,2:4,3:0,4:5,5:10,6:2,7:2,8:6,9:6,10:11,11:11};
const KONGMANG_MAP = [[0,9,10,11],[10,19,8,9],[20,29,6,7],[30,39,4,5],[40,49,2,3],[50,59,0,1]];
const LIUHE = [[0,1],[2,11],[3,10],[4,9],[5,8],[6,7]];
const SANHE = [[0,4,8],[1,5,9],[2,6,10],[3,7,11]];
const CHONG = [[0,6],[1,7],[2,8],[3,9],[4,10],[5,11]];
const WEEKDAYS = ['일','월','화','수','목','금','토'];

// ════════════════════════════════════════════════
// 2. 사주 풀이 데이터
// ════════════════════════════════════════════════

const DAYMASTER_INFO = [
  { hanja:'甲', kr:'갑목', wx:'木', icon:'🌲', title:'큰 나무 — 곧고 강한 개척자',
    core:'자기 주관이 뚜렷하고 추진력이 강한 리더형입니다.',
    detail:'갑목(甲木)은 소나무·참나무처럼 하늘을 향해 곧게 뻗는 큰 나무의 기운입니다. 한 번 방향을 정하면 굽히지 않는 강한 의지력과 앞장서서 이끄는 타고난 리더십이 특징입니다. "큰 나무는 한 번 뿌리를 내리면 폭풍에도 쓰러지지 않는다"는 말처럼, 어려운 환경에서도 꿋꿋이 자기 자리를 지킵니다.',
    talent:'강한 추진력과 도전 정신, 독립심이 남다릅니다. 새로운 분야를 처음 개척하는 역할에서 빛납니다.',
    caution:'지나친 고집으로 타협이 어려워 보일 수 있습니다. 주변 의견에 귀 기울이는 유연함을 기르면 더욱 큰 인물이 됩니다.',
    example:'처음으로 숲길을 개척하는 탐험가처럼, 남들이 가지 않은 길을 기꺼이 먼저 걷는 기질입니다.'
  },
  { hanja:'乙', kr:'을목', wx:'木', icon:'🌿', title:'넝쿨 — 유연하고 생명력 강한 적응자',
    core:'어느 환경에서도 잘 적응하며 사람과의 관계에서 빛납니다.',
    detail:'을목(乙木)은 담쟁이덩굴이나 풀처럼 어느 곳에서든 살아남는 유연한 생명력의 기운입니다. 겉으로는 부드러워 보이지만 내면에는 강한 생존 본능이 있습니다. "물이 돌을 뚫는다"는 말처럼 힘이 아닌 끈기와 유연함으로 결국 목표를 이룹니다.',
    talent:'뛰어난 적응력과 친화력, 섬세한 공감 능력이 장점입니다. 사람의 마음을 잘 읽고 분위기를 화목하게 만듭니다.',
    caution:'우유부단해 보이거나 자기 의견을 강하게 표현하기 어려울 때가 있습니다. 결정을 내려야 할 때 과감함을 발휘하면 좋습니다.',
    example:'조직 내 윤활유 역할을 잘 하며, 예술·문화·상담 분야에서 타고난 재능을 발휘합니다.'
  },
  { hanja:'丙', kr:'병화', wx:'火', icon:'☀', title:'태양 — 밝고 열정적인 빛의 존재',
    core:'긍정 에너지와 열정으로 주변을 환하게 밝히는 존재입니다.',
    detail:'병화(丙火)는 태양처럼 온 세상을 밝히는 뜨거운 빛의 기운입니다. 타고난 긍정 에너지와 활발한 사교성으로 어디서든 자연스럽게 사람들의 중심이 됩니다. "태양은 모두에게 평등하게 빛을 나눠준다"는 말처럼, 넓은 포용력으로 많은 사람에게 용기와 희망을 줍니다.',
    talent:'열정, 표현력, 사교성이 탁월합니다. 사람들 앞에 나서는 것을 두려워하지 않고 자신감 있게 자신을 표현합니다.',
    caution:'감정 기복이 생기거나 여러 곳에 에너지를 분산해 집중력이 흐트러질 수 있습니다. 한 가지에 깊이 파고드는 연습이 도움이 됩니다.',
    example:'연예인, 교육자, 영업인처럼 사람과 소통하며 빛을 발하는 분야에서 두각을 나타냅니다.'
  },
  { hanja:'丁', kr:'정화', wx:'火', icon:'🕯', title:'촛불 — 섬세하고 따뜻한 감성인',
    core:'세심한 감수성과 따뜻한 공감 능력으로 주변을 감동시킵니다.',
    detail:'정화(丁火)는 촛불이나 난롯불처럼 어둠 속에서도 따뜻하게 빛을 내는 기운입니다. 크지 않지만 주변을 따뜻하게 비추는 존재로, 섬세한 감수성과 예술적 재능이 뛰어납니다. "작은 촛불 하나가 방 전체를 밝힌다"는 말처럼, 조용하지만 깊은 영향력을 가집니다.',
    talent:'섬세한 공감 능력, 예술적 감각, 집중력이 뛰어납니다. 다른 사람의 감정을 잘 이해하고 위로하는 능력이 탁월합니다.',
    caution:'지나치게 감정에 이입하거나 예민해질 수 있습니다. 때로는 한 발 물러서 자신을 보호하는 여유도 필요합니다.',
    example:'예술가·상담사·교육자처럼 섬세함과 공감이 핵심인 분야에서 크게 빛납니다.'
  },
  { hanja:'戊', kr:'무토', wx:'土', icon:'🏔', title:'큰 산 — 든든하고 포용력 있는 기둥',
    core:'흔들리지 않는 안정감과 넓은 포용력으로 주변의 신뢰를 받습니다.',
    detail:'무토(戊土)는 태산처럼 묵직하게 자리를 지키는 대지의 기운입니다. 쉽게 흥분하지 않고 신중하게 판단하며, 오랜 시간에 걸쳐 믿음을 쌓아가는 성품입니다. "산은 움직이지 않아도 모든 것을 품는다"는 말처럼, 주변 사람들의 든든한 버팀목이 됩니다.',
    talent:'안정감, 신뢰성, 포용력, 인내심이 남다릅니다. 한 번 약속하면 끝까지 지키는 강한 책임감이 있습니다.',
    caution:'변화를 받아들이는 데 시간이 걸리고 지나치게 보수적으로 보일 수 있습니다. 새로운 환경에 적극적으로 열린 마음을 가지면 더욱 성장합니다.',
    example:'조직의 핵심 기둥 역할을 하며, 사람들이 힘들 때 가장 먼저 찾는 든든한 버팀목 유형입니다.'
  },
  { hanja:'己', kr:'기토', wx:'土', icon:'🌾', title:'비옥한 땅 — 실용적이고 헌신적인 돌보미',
    core:'성실하고 실용적으로 주변을 돌보는 따뜻한 마음의 소유자입니다.',
    detail:'기토(己土)는 씨앗을 품어 생명을 키우는 비옥한 논밭의 기운입니다. 꼼꼼하고 현실적이며, 자신보다 타인을 먼저 생각하는 헌신적인 마음을 가지고 있습니다. "좋은 땅은 뿌리는 씨앗마다 풍성한 열매를 맺게 한다"는 말처럼, 아이의 잠재력을 최대한 이끌어내는 능력이 있습니다.',
    talent:'성실함, 실용적 판단력, 세심한 돌봄 능력이 뛰어납니다. 복잡한 상황도 차근차근 현실적으로 해결해 나갑니다.',
    caution:'자신보다 남을 먼저 챙기다 정작 자신을 소홀히 할 수 있습니다. 자기 자신도 아껴야 더 오래 주변을 돌볼 수 있습니다.',
    example:'교육자·의료인·사회복지사처럼 남을 돌보고 키우는 분야에서 진정한 보람을 찾습니다.'
  },
  { hanja:'庚', kr:'경금', wx:'金', icon:'⚔', title:'강철 — 원칙과 의리의 결단자',
    core:'강한 원칙과 뚜렷한 의리, 흔들리지 않는 결단력의 소유자입니다.',
    detail:'경금(庚金)은 잘 벼린 강철처럼 날카롭고 강한 기운입니다. 옳고 그름이 분명하고 원칙과 의리를 중시하며, 어떤 어려운 상황에서도 자신의 신념을 굽히지 않습니다. "잘 벼린 칼은 쉽게 무뎌지지 않는다"는 말처럼, 반복된 단련을 통해 더욱 강해집니다.',
    talent:'강한 결단력, 의리, 추진력, 굳센 정신력이 특징입니다. 목표를 정하면 어떤 장애물도 돌파하는 힘이 있습니다.',
    caution:'강직함이 지나쳐 융통성이 부족해 보일 수 있습니다. 상황에 따라 부드럽게 소통하는 법을 배우면 더욱 큰 리더가 됩니다.',
    example:'군인·운동선수·기업인처럼 강한 의지와 결단이 필요한 분야에서 뛰어난 성과를 냅니다.'
  },
  { hanja:'辛', kr:'신금', wx:'金', icon:'💎', title:'보석 — 완벽을 추구하는 심미안',
    core:'날카로운 관찰력과 높은 심미안, 강한 자존감의 소유자입니다.',
    detail:'신금(辛金)은 원석에서 정제된 보석처럼 아름다움과 완벽함을 추구하는 기운입니다. 세밀한 부분까지 놓치지 않는 예리한 관찰력이 있고, 자신만의 품격과 기준을 중요시합니다. "보석은 빛을 받을 때 가장 아름답게 빛난다"는 말처럼, 올바른 환경과 인정을 받을 때 최고의 능력을 발휘합니다.',
    talent:'완벽주의, 심미안, 분석력, 높은 자존감이 강점입니다. 남들이 놓치는 섬세한 부분을 잘 포착합니다.',
    caution:'예민한 편이라 상처를 쉽게 받을 수 있고, 완벽을 추구하다 스트레스를 받기도 합니다. 때로는 "충분히 좋다"고 인정하는 여유가 필요합니다.',
    example:'디자이너·예술가·분석가처럼 세밀함과 미적 감각이 중요한 분야에서 탁월한 능력을 발휘합니다.'
  },
  { hanja:'壬', kr:'임수', wx:'水', icon:'🌊', title:'큰 강 — 지혜롭고 깊은 사색가',
    core:'넓은 포용력과 깊은 통찰력, 자유로운 영혼의 소유자입니다.',
    detail:'임수(壬水)는 깊고 넓은 강이나 바다처럼 모든 것을 담아내는 기운입니다. 다양한 정보를 빠르게 흡수하고 깊이 사유하는 능력이 뛰어납니다. "강물은 모든 개울을 받아들이며 더욱 넓어진다"는 말처럼, 다양한 경험을 통해 더욱 지혜로워지는 성품입니다.',
    talent:'지혜, 통찰력, 넓은 포용력, 빠른 학습 능력이 두드러집니다. 복잡한 상황에서도 큰 그림을 볼 줄 압니다.',
    caution:'너무 많은 것을 생각하다 결정이 늦어지거나, 넓게 퍼지다 깊이가 부족해질 수 있습니다. 핵심에 집중하는 연습이 도움이 됩니다.',
    example:'학자·전략가·외교관처럼 넓은 사고와 깊은 통찰이 필요한 분야에서 빛을 발합니다.'
  },
  { hanja:'癸', kr:'계수', wx:'水', icon:'🌧', title:'봄비 — 섬세하고 직관적인 감성인',
    core:'뛰어난 직관력과 감수성, 부드럽게 스며드는 영향력의 소유자입니다.',
    detail:'계수(癸水)는 봄비나 이슬처럼 부드럽게 스며드는 기운입니다. 직관력과 감수성이 남달리 뛰어나고, 보이지 않는 것을 느끼는 예민한 감각이 있습니다. "봄비는 소리 없이 대지를 적셔 만물을 소생시킨다"는 말처럼, 조용하지만 깊고 넓은 영향력을 가집니다.',
    talent:'뛰어난 직관력, 풍부한 감수성, 융통성과 공감 능력이 강점입니다. 말보다 행동으로 주변을 감동시킵니다.',
    caution:'감정 기복이 있고 주변 분위기에 지나치게 영향을 받을 수 있습니다. 자신만의 내면 중심을 단단히 세우는 것이 중요합니다.',
    example:'작가·예술가·심리상담사처럼 섬세한 감각과 공감 능력이 핵심인 분야에서 특별한 재능을 발휘합니다.'
  },
];

const WUXING_MISSING = [
  { name:'나무 기운(木)이 없어요', color:'var(--wood)',
    meaning:'나무 기운은 "앞으로 나아가는 힘"입니다. 이 기운이 없으면 무언가를 시작하거나 밀어붙일 때 잠깐 망설일 수 있어요.',
    easy:'하지만 오히려 충동적으로 움직이지 않고 신중하게 생각하는 장점이 있어요! 한 번 시작하면 끝까지 해내는 끈기도 강합니다.'
  },
  { name:'불 기운(火)이 없어요', color:'var(--fire)',
    meaning:'불 기운은 "열정과 표현하는 힘"입니다. 이 기운이 없으면 감정을 겉으로 드러내거나 흥분하는 일이 적어요.',
    easy:'차갑게 보일 수 있지만, 감정에 휩쓸리지 않고 냉정하게 판단하는 능력이 뛰어나요. 중요한 순간에 실수가 적은 스타일이에요.'
  },
  { name:'흙 기운(土)이 없어요', color:'var(--earth)',
    meaning:'흙 기운은 "안정되고 중심 잡는 힘"입니다. 이 기운이 없으면 한 곳에 오래 정착하기보다 계속 새로운 것을 찾으려 해요.',
    easy:'변화를 두려워하지 않고 새로운 환경에 빠르게 적응하는 것이 큰 장점이에요. 다양한 경험을 통해 성장하는 유형입니다.'
  },
  { name:'쇠 기운(金)이 없어요', color:'var(--metal)',
    meaning:'쇠 기운은 "딱 잘라 결정하는 힘"입니다. 이 기운이 없으면 엄격한 규칙을 세우거나 냉정하게 판단하는 것이 다소 어려울 수 있어요.',
    easy:'대신 사람과의 관계를 소중히 여기고, 상황에 따라 유연하게 대처하는 따뜻한 성격이 강해요. 규칙보다 마음을 먼저 보는 스타일이에요.'
  },
  { name:'물 기운(水)이 없어요', color:'var(--water)',
    meaning:'물 기운은 "지혜롭게 흘러가는 힘"입니다. 이 기운이 없으면 복잡하게 생각하기보다 직접 몸으로 부딪히려는 경향이 있어요.',
    easy:'"일단 해보자!"는 실행력과 용기가 넘쳐요. 너무 많이 생각하다 기회를 놓치는 일 없이, 빠르게 행동하는 추진력이 강점입니다.'
  },
];

// 오행 배경색: 양(진한색+흰글씨) / 음(연한색+진한글씨)
const WX_BG_YANG  = ['#388E3C','#C62828','#E65100','#455A64','#1565C0'];
const WX_BG_YIN   = ['#E8F5E9','#FFEBEE','#FFF8E1','#ECEFF1','#E3F2FD'];
const WX_TEXT_YIN = ['#2E7D32','#B71C1C','#BF360C','#37474F','#0D47A1'];

const WUXING_REMEDY = [
  { tip:'🌿 나무 기운 보완법',
    items:['초록·파란색 옷이나 소품을 활용해요','집에 화분·식물을 두면 좋아요','신맛 음식(레몬·식초·키위)이 도움돼요','봄에 야외 활동을 자주 해요','동쪽 방향이 길한 방향이에요'] },
  { tip:'🔥 불 기운 보완법',
    items:['빨간·주황색을 포인트로 활용해요','햇빛이 잘 드는 밝은 환경이 좋아요','쓴맛 음식(녹차·다크초콜릿)이 도움돼요','활동적인 운동이나 취미를 가져요','남쪽 방향이 길한 방향이에요'] },
  { tip:'🌍 흙 기운 보완법',
    items:['노란·갈색·베이지 컬러를 활용해요','규칙적인 생활 루틴을 만들어요','단맛 음식(고구마·단호박·꿀)이 도움돼요','자연·흙·산 가까운 환경이 좋아요','중앙·남서 방향이 길한 방향이에요'] },
  { tip:'⚙ 쇠 기운 보완법',
    items:['흰색·회색·금색·은색을 활용해요','정리정돈과 규칙적인 환경을 유지해요','매운맛 음식(무·도라지·마늘)이 도움돼요','명확한 목표와 계획 세우는 습관을 길러요','서쪽·서북 방향이 길한 방향이에요'] },
  { tip:'💧 물 기운 보완법',
    items:['검정·짙은 파란색을 활용해요','강·바다·수영장에서 시간을 보내요','짠맛 음식(된장·김·멸치)이 도움돼요','조용한 명상이나 독서 시간을 만들어요','북쪽 방향이 길한 방향이에요'] },
];

const MONTH_SEASON = [
  { branches:[2,3,4], season:'봄(春)', months:'2~4월경', icon:'🌸',
    meaning:'봄은 꽃이 피고 새싹이 돋아나는 계절이에요. 이 계절에 태어난 아이는 새로운 것을 좋아하고 도전 정신이 강해요.',
    detail:'봄 아이는 호기심이 많고 먼저 시작하기를 좋아해요. 마치 땅을 뚫고 나오는 새싹처럼 어떤 어려움도 뚫고 앞으로 나아가는 힘이 있답니다. 새로운 친구도 잘 사귀고 새로운 환경에 금방 적응해요.'
  },
  { branches:[5,6,7], season:'여름(夏)', months:'5~7월경', icon:'☀',
    meaning:'여름은 태양이 가장 뜨겁게 빛나는 계절이에요. 이 계절에 태어난 아이는 열정이 넘치고 활발하며 친구를 잘 사귀어요.',
    detail:'여름 아이는 에너지가 넘쳐요! 놀 때도 공부할 때도 최선을 다하는 스타일이에요. 웃음이 많고 분위기를 밝게 만드는 재주가 있어서 어디서든 인기를 끌어요. 다만 에너지를 많이 쓰는 만큼 충분한 휴식도 중요해요.'
  },
  { branches:[8,9,10], season:'가을(秋)', months:'8~10월경', icon:'🍂',
    meaning:'가을은 열매가 익고 수확하는 계절이에요. 이 계절에 태어난 아이는 집중력이 강하고 한 번 정한 목표는 꼭 이루는 스타일이에요.',
    detail:'가을 아이는 감정보다 이성을 앞세워요. 쉽게 흥분하지 않고 차분하게 생각한 뒤 행동해요. 공부나 운동에서 꾸준히 노력하는 스타일이라 나중에 큰 성과를 내는 경우가 많아요.'
  },
  { branches:[11,0,1], season:'겨울(冬)', months:'11월~1월경', icon:'❄',
    meaning:'겨울은 모든 것이 조용히 힘을 모으는 계절이에요. 이 계절에 태어난 아이는 생각이 깊고 지혜로워요.',
    detail:'겨울 아이는 조용해 보이지만 머릿속은 항상 바쁘게 돌아가고 있어요. 겉으로 드러내지 않아도 내면에 풍부한 생각과 감수성을 가지고 있어요. 혼자 있는 시간을 좋아하고, 그 시간에 큰 아이디어를 떠올리는 경우가 많답니다.'
  },
];

const STRENGTH_INFO = [
  { label:'신강(身强)', desc:'아이의 에너지가 강한 편이에요',
    meaning:'사주 전체에서 아이를 도와주는 기운이 많아요. 쉽게 말하면, 태어날 때부터 에너지가 넘치고 자기 주관이 강한 아이예요.',
    tip:'💡 양육 포인트: 에너지가 넘치는 아이인 만큼, 이 에너지를 좋은 방향으로 쏟을 수 있게 운동이나 다양한 활동을 많이 접하게 해주세요. 규칙과 방향을 잘 잡아주면 리더가 될 자질이 있어요!'
  },
  { label:'신중(身中)', desc:'아이의 에너지가 균형 잡혀 있어요 ✓',
    meaning:'사주 전체의 기운이 조화롭게 균형을 이루고 있어요. 이것이 가장 이상적인 상태예요! 어떤 상황에서도 흔들리지 않고 중심을 잡는 안정적인 아이예요.',
    tip:'💡 양육 포인트: 균형 잡힌 아이는 어떤 환경에서도 잘 적응해요. 다양한 경험을 많이 쌓게 해주면 잠재력이 폭발적으로 성장할 거예요!'
  },
  { label:'신약(身弱)', desc:'아이의 에너지가 다소 약한 편이에요',
    meaning:'주변의 기운이 아이보다 강해서 주변 환경의 영향을 많이 받는 타입이에요. 혼자보다 함께할 때 더 빛나고, 다른 사람의 감정을 잘 이해하는 공감 능력이 뛰어나요.',
    tip:'💡 양육 포인트: 좋은 환경과 든든한 지원이 큰 힘이 돼요. 자신감을 키워주는 따뜻한 격려와 칭찬이 정말 중요해요. 혼자 시키는 것보다 함께 해주는 것이 효과적이에요!'
  },
];

const GUIREN_DETAIL = {
  tianyi: {
    name:'천을귀인(天乙貴人)', icon:'☀',
    meaning:'사주에서 가장 귀한 행운의 별이에요! 쉽게 말하면 "살면서 힘든 일이 생길 때 꼭 도와주는 사람이 나타나는 운"을 타고났다는 뜻이에요.',
    example:'예를 들어볼게요. 중요한 시험 날 유독 컨디션이 좋거나, 취업 면접에서 예상치 못한 기회가 생기거나, 정말 힘든 시기에 딱 맞는 친구나 선생님이 나타나 도움을 주는 식이에요. "나는 왜 이렇게 운이 좋지?"라는 말을 자주 듣는 타입이에요 😊',
    benefit:'✅ 좋은 점: 위기에 강하고, 좋은 사람들이 주변에 모이며, 중요한 순간에 운이 따라줘요.'
  },
  wenchang: {
    name:'문창귀인(文昌貴人)', icon:'✏',
    meaning:'공부와 시험, 글쓰기와 관련된 행운의 별이에요! 타고나게 머리가 잘 돌아가고 공부에 흥미를 느끼는 기운을 가졌다는 뜻이에요.',
    example:'예를 들어, 교과서를 읽으면 머릿속에 잘 들어오고, 시험 볼 때 평소보다 잘 풀리는 경우가 많아요. 작문이나 발표에서도 남다른 재능을 보여줘요. "이 아이는 어쩜 이렇게 잘 이해하지?"라는 말을 자주 들어요 📚',
    benefit:'✅ 좋은 점: 공부·시험 운이 좋고, 글 쓰는 재주가 있으며, 전문직에서 두각을 나타낼 가능성이 높아요.'
  },
  fuxing: {
    name:'복성귀인(福星貴人)', icon:'★',
    meaning:'타고난 복을 가진 행운의 별이에요! 먹고 사는 데 큰 어려움이 없고, 좋은 사람들이 자연스럽게 주변에 모이는 복을 가지고 태어난다는 뜻이에요.',
    example:'예를 들어, 크게 노력하지 않아도 좋은 인연이 자연스럽게 생기거나, 어려운 상황에서도 생활에 큰 위협이 없이 지나가는 경우가 많아요. "저 아이는 참 복도 많다~"는 말을 자주 듣는 타입이에요 🍀',
    benefit:'✅ 좋은 점: 재물운이 안정적이고, 인복이 넘치며, 삶 전반에 걸쳐 따뜻한 지원이 함께해요.'
  },
};

const KONGMANG_DETAIL = {
  none: {
    label:'공망 없음 ✓', color:'var(--wood)',
    meaning:'공망(空亡)이란 "사주에서 에너지가 빠져나가는 구멍"이에요. 공망이 없다는 것은 정말 좋은 신호예요!',
    detail:'쉽게 말하면, 열심히 한 노력이 그대로 결과로 이어지는 사주예요. "밑 빠진 독에 물 붓기"가 아니라, 튼튼한 항아리에 물이 꽉 차는 것처럼 쌓은 노력이 낭비되지 않아요.',
    example:'💡 공부하면 성적이 오르고, 노력하면 인정받는 일이 많아요. 꾸준히 하면 반드시 결과가 나오는 좋은 사주예요!'
  },
  hour: {
    label:'시주에 공망이 있어요', color:'var(--earth)',
    meaning:'공망(空亡)이란 "에너지가 빠져나가는 구멍"인데, 태어난 시간(시주) 부분에 공망이 있어요.',
    detail:'4개 기둥(연월일시) 중에서 시주의 공망은 영향이 가장 적어요. 노력의 결과가 나타나는 데 조금 더 시간이 걸릴 수 있지만, 꾸준히 하면 충분히 극복할 수 있어요.',
    example:'💡 "인생은 긴 마라톤"이에요. 젊을 때보다 경험이 쌓인 중년 이후에 더 크게 빛나는 경우가 많아요!'
  },
  day: {
    label:'일주에 공망이 있어요 (주의)', color:'var(--fire)',
    meaning:'공망(空亡)이란 "에너지가 빠져나가는 구멍"인데, 아이의 핵심 기운(일주)에 공망이 있어요.',
    detail:'쉽게 말하면, 열심히 했는데 결과가 기대만큼 안 나오는 경험을 할 수 있어요. 그러나 이것을 미리 알고 준비하면 충분히 보완할 수 있어요! 결과보다 과정을 즐기고, 꾸준히 하는 습관을 기르는 것이 중요해요.',
    example:'💡 눈앞의 결과에 너무 집착하지 않고 "지금 이 순간 최선"을 다하는 자세를 길러주세요. 장기적으로 보면 분명히 빛나는 순간이 와요!'
  },
  both: {
    label:'일주·시주 모두 공망이에요 (주의)', color:'var(--fire)',
    meaning:'공망(空亡)이 두 곳에 겹쳐 있어요. 노력이 결과로 이어지기까지 더 많은 인내가 필요할 수 있어요.',
    detail:'하지만 공망이 많은 사주는 영적 감수성과 철학적 사고력이 뛰어난 경우가 많아요. 물질적 성공보다 깊은 의미와 가치를 추구하는 삶에서 진정한 행복을 찾는 스타일이에요.',
    example:'💡 "남들과 다른 길"을 걸을 수 있는 특별한 아이예요. 결과보다 과정의 가치를 알려주는 교육이 도움이 돼요!'
  },
};

// ════════════════════════════════════════════════
// 3. 사주 계산
// ════════════════════════════════════════════════

function julianDay(y,m,d){
  const a=Math.floor((14-m)/12),yy=y+4800-a,mm=m+12*a-3;
  return d+Math.floor((153*mm+2)/5)+365*yy+Math.floor(yy/4)-Math.floor(yy/100)+Math.floor(yy/400)-32045;
}
function getSajuYear(y,m,d){
  // 하드코딩 범위 밖이면 수식으로 입춘 날짜 계산
  const ip = IPCHUN[y] || [2, getSolarTermDateCalc(y, 1)];
  return (m<ip[0]||(m===ip[0]&&d<ip[1]))?y-1:y;
}
function getYearPillar(y,m,d){
  const sy=getSajuYear(y,m,d),idx=((sy-4)%60+60)%60;
  return {stem:idx%10,branch:idx%12,idx};
}
// 절기별 월지 (소한=丑1, 입춘=寅2, ... 대설=子0)
const _TERM_MONTH  = [1,2,3,4,5,6,7,8,9,10,11,12];
const _TERM_BRANCH = [1,2,3,4,5,6,7,8,9,10,11,0];
function getMonthBranch(y,m,d){
  if(SOLAR_TERMS[y]){
    let branch=1;
    for(const [tm,td,tb] of SOLAR_TERMS[y]) if(m>tm||(m===tm&&d>=td)) branch=tb;
    return branch;
  }
  // 하드코딩 범위 밖: 수식으로 각 절기 날짜 계산
  let branch=1;
  for(let i=0;i<12;i++){
    const td=getSolarTermDateCalc(y,i);
    if(m>_TERM_MONTH[i]||(m===_TERM_MONTH[i]&&d>=td)) branch=_TERM_BRANCH[i];
  }
  return branch;
}
function getMonthPillar(y,m,d){
  const yp=getYearPillar(y,m,d),mb=getMonthBranch(y,m,d);
  const BASE=[2,4,6,8,0,2,4,6,8,0];
  const ms=(BASE[yp.stem]+((mb-2+12)%12))%10;
  return {stem:ms,branch:mb};
}
function getDayPillar(y,m,d){
  const jdn=julianDay(y,m,d),idx=((jdn-2451545+54)%60+60)%60;
  return {stem:idx%10,branch:idx%12,idx};
}
function getHourPillar(ds,hb){
  const BASE=[0,2,4,6,8,0,2,4,6,8];
  return {stem:(BASE[ds]+hb)%10,branch:hb};
}
function calcSaju(y,m,d,hb){
  const yr=getYearPillar(y,m,d),mo=getMonthPillar(y,m,d),dy=getDayPillar(y,m,d);
  return {year:yr,month:mo,day:dy,hour:getHourPillar(dy.stem,hb)};
}
function parseDate(s){const[y,m,d]=s.split('-').map(Number);return{y,m,d};}

// ════════════════════════════════════════════════
// 4. 오행 유틸
// ════════════════════════════════════════════════

function wxGen(a,b){return(a+1)%5===b;}
function wxCtrl(a,b){return(a+2)%5===b;}

// 지장간(地藏干): 각 지지(地支) 안에 숨겨진 천간의 오행
// [주기(主氣×3), 중기(中氣×1.5), 여기(餘氣×0.5)] — 없으면 주기만
// WX 인덱스: 목0 화1 토2 금3 수4
const DZ_JZG = [
  [4],        // 子(자): 壬水
  [2,4,3],    // 丑(축): 己土·癸水·辛金
  [0,1,2],    // 寅(인): 甲木·丙火·戊土
  [0,0],      // 卯(묘): 乙木·甲木
  [2,0,4],    // 辰(진): 戊土·乙木·癸水
  [1,3,2],    // 巳(사): 丙火·庚金·戊土
  [1,2],      // 午(오): 丁火·己土
  [2,1,0],    // 未(미): 己土·丁火·乙木
  [3,4,2],    // 申(신): 庚金·壬水·戊土
  [3,3],      // 酉(유): 庚金·辛金
  [2,3,1],    // 戌(술): 戊土·辛金·丁火
  [4,0],      // 亥(해): 壬水·甲木
];
// 지장간 가중치: 주기=3, 중기=1.5, 여기=0.5 (10배 정수 처리 → 30,15,5)
const DZ_JZG_W = [30,15,5];

// 지장간 주기(主氣) 천간 인덱스 — 십신 계산용
// 子→壬(8) 丑→己(5) 寅→甲(0) 卯→乙(1) 辰→戊(4) 巳→丙(2)
// 午→丁(3) 未→己(5) 申→庚(6) 酉→辛(7) 戌→戊(4) 亥→壬(8)
const DZ_MAIN_STEM=[8,5,0,1,4,2,3,5,6,7,4,8];

function getElementDist(saju){
  // 천간(×10) + 지장간 가중치 합산 후 /10 반올림 → 소수점 1자리
  const dist=[0,0,0,0,0];
  for(const p of [saju.year,saju.month,saju.day,saju.hour]){
    dist[TG_WX[p.stem]]+=10; // 천간: 기본 1.0 (×10)
    const jzg=DZ_JZG[p.branch];
    for(let i=0;i<jzg.length;i++) dist[jzg[i]]+=DZ_JZG_W[i]||5;
  }
  return dist.map(v=>Math.round(v)/10);
}

// ════════════════════════════════════════════════
// 5. 점수 계산
// ════════════════════════════════════════════════

function scoreWuxingBalance(saju){
  const dist=getElementDist(saju);
  const present=dist.filter(v=>v>0).length;
  const presenceScore=present*2;
  const total=dist.reduce((a,b)=>a+b,0);
  const mean=total/5;
  const maxDev=Math.sqrt(dist.reduce((s,_,i)=>s+(i<present?mean**2:(total-0)**2),0)/5)||1;
  const variance=dist.reduce((s,v)=>s+(v-mean)**2,0)/5;
  const balanceScore=10*Math.max(0,1-Math.sqrt(variance)/Math.max(mean,1));
  return Math.min(20,Math.round(presenceScore+balanceScore));
}
// ── 신강/신약 공통 계산 (월령 가중치 + 일지 반영) ──
// 전통 사주: 월지(月支)가 최우선, 일지가 그 다음, 나머지는 기본 가중치
// weight: 연간1/연지1 / 월간1/월지3 / 일지2 / 시간1/시지1
function calcDayStrengthRatio(saju){
  const dayEl=TG_WX[saju.day.stem];
  let sup=0,opp=0;
  function add(el,w){
    if(el===dayEl)          sup+=2*w;
    else if(wxGen(el,dayEl)) sup+=1*w;   // 생(生): 나를 도움
    else if(wxCtrl(el,dayEl)) opp+=2*w;  // 극(剋): 나를 억제
    else if(wxGen(dayEl,el)) opp+=0.5*w; // 내가 생: 힘 소모
    else                     opp+=0.5*w;
  }
  add(TG_WX[saju.year.stem],  1);
  add(DZ_WX[saju.year.branch],1);
  add(TG_WX[saju.month.stem], 1);
  add(DZ_WX[saju.month.branch],3); // 월지: 3배 (월령 핵심)
  add(DZ_WX[saju.day.branch], 2);  // 일지: 2배
  add(TG_WX[saju.hour.stem],  1);
  add(DZ_WX[saju.hour.branch],1);
  const total=sup+opp;
  return total===0 ? 0.5 : sup/total;
}
function scoreDayStrength(saju){
  const r=calcDayStrengthRatio(saju);
  const d=Math.abs(r-0.5);
  if(d<=0.08) return 15; // 신중: 거의 완벽 균형
  if(d<=0.18) return 11;
  if(d<=0.30) return 7;
  return 4;
}
function getDayStrengthLabel(saju){
  const r=calcDayStrengthRatio(saju);
  if(r>=0.58) return 0; // 신강
  if(r>=0.42) return 1; // 신중
  return 2;              // 신약
}
function scoreGuiren(saju){
  const br=[saju.year.branch,saju.month.branch,saju.day.branch,saju.hour.branch];
  let score=0;
  const found={tianyi:false,wenchang:false,fuxing:false};
  const ty=TIANYI[saju.day.stem]||[];
  if(br.some(b=>ty.includes(b))){score+=5;found.tianyi=true;}
  if(br.includes(WENCHANG[saju.day.stem])){score+=5;found.wenchang=true;}
  if(br.includes(FUXING[saju.year.branch])){score+=5;found.fuxing=true;}
  return{score:Math.min(15,score),found};
}
function scoreKongmang(saju){
  const di=saju.day.idx;
  let v1=-1,v2=-1;
  for(const [s,e,a,b] of KONGMANG_MAP) if(di>=s&&di<=e){v1=a;v2=b;break;}
  const db=saju.day.branch,hb=saju.hour.branch;
  const dv=(db===v1||db===v2),hv=(hb===v1||hb===v2);
  if(!dv&&!hv) return{score:10,type:'none',voids:[]};
  if(dv&&hv) return{score:2,type:'both',voids:[v1,v2]};
  if(dv) return{score:4,type:'day',voids:[v1,v2]};
  return{score:7,type:'hour',voids:[v1,v2]};
}
// ── 십신(十神) ────────────────────────────────────────
// 일간(ds) 기준 상대 천간(os)의 관계 인덱스 반환
// 0비견 1겁재 2식신 3상관 4편재 5정재 6편관 7정관 8편인 9정인
function getSipsin(ds,os){
  const de=TG_WX[ds],oe=TG_WX[os],sp=(ds%2)===(os%2);
  if(oe===de)          return sp?0:1;
  if(wxGen(de,oe))     return sp?2:3;
  if(wxCtrl(de,oe))    return sp?4:5;
  if(wxCtrl(oe,de))    return sp?6:7;
  if(wxGen(oe,de))     return sp?8:9;
  return -1;
}
// 4주 7위치(일간 제외)의 십신 카운트
function getSipsinCounts(saju){
  const cnt=new Array(10).fill(0);
  for(const p of [saju.year,saju.month,saju.hour]){
    const a=getSipsin(saju.day.stem,p.stem);
    const b=getSipsin(saju.day.stem,DZ_MAIN_STEM[p.branch]);
    if(a>=0)cnt[a]++; if(b>=0)cnt[b]++;
  }
  const c=getSipsin(saju.day.stem,DZ_MAIN_STEM[saju.day.branch]);
  if(c>=0)cnt[c]++;
  return cnt; // [비견,겁재,식신,상관,편재,정재,편관,정관,편인,정인]
}
// 8개 운세 항목 점수 (0~100)
function scoreFortuneAspects(saju,score){
  const ss=getSipsinCounts(saju);
  const r=calcDayStrengthRatio(saju);
  const dist=getElementDist(saju);
  const g=score.baby.guirenFound,km=score.baby.kongmang,wb=score.baby.wuxingBalance;
  const isStr=r>=0.58,isMid=r>=0.42&&r<0.58,isWk=r<0.42;
  const C=v=>Math.min(100,Math.max(0,Math.round(v)));

  let wealth=38;
  wealth+=ss[5]*13+ss[4]*8;
  if(ss[2]>0&&(ss[4]+ss[5])>0) wealth+=15;
  if(isStr&&(ss[4]+ss[5])>0) wealth+=10;
  if(isWk&&(ss[4]+ss[5])>2) wealth-=12;

  let honor=38;
  honor+=ss[7]*15+ss[6]*8;
  if((ss[6]+ss[7])>0&&isStr) honor+=10;
  if((ss[8]+ss[9])>0) honor+=7;
  if((ss[6]+ss[7])>2&&isWk) honor-=12;

  let people=38;
  people+=ss[2]*10+ss[3]*6;
  if(g.tianyi) people+=15;
  people+=Math.round(wb*0.8);

  let health=45;
  health+=Math.round(wb*1.5);
  health+=ss[2]*7;
  if(km>=10) health+=8; else if(km<=4) health-=10;
  if(isMid) health+=5;

  let study=38;
  study+=ss[9]*15+ss[8]*10+ss[2]*6;
  if(g.wenchang) study+=15;

  let windfall=25;
  windfall+=ss[4]*15;
  if(g.fuxing) windfall+=20;
  if(g.tianyi) windfall+=10;
  windfall+=Math.round(wb*0.5);

  let lead=38;
  if(isStr) lead+=15; else if(isWk) lead-=8;
  lead+=ss[6]*10+ss[7]*8+(ss[0]+ss[1])*4;

  let creative=38;
  creative+=ss[3]*15+ss[2]*8;
  creative+=Math.round((dist[1]+dist[0])*2);

  return{wealth:C(wealth),honor:C(honor),people:C(people),health:C(health),
         study:C(study),windfall:C(windfall),lead:C(lead),creative:C(creative)};
}

function scoreBaby(saju){
  const wb=scoreWuxingBalance(saju),ds=scoreDayStrength(saju);
  const gr=scoreGuiren(saju),km=scoreKongmang(saju);
  return{wuxingBalance:wb,dayStrength:ds,guiren:gr.score,guirenFound:gr.found,kongmang:km.score,kongmangType:km.type,kongmangVoids:km.voids,total:wb+ds+gr.score+km.score};
}
function branchRel(a,b){
  for(const p of LIUHE) if(p.includes(a)&&p.includes(b)) return 1;
  for(const p of CHONG) if(p.includes(a)&&p.includes(b)) return -1;
  return 0;
}
function inSanhe(a,b){return SANHE.some(g=>g.includes(a)&&g.includes(b));}
function scoreCompat(babySaju,parSaju){
  if(!parSaju) return{score:10,detail:{elemScore:5,branchScore:3,sanheScore:2}};
  const bDE=TG_WX[babySaju.day.stem],pDE=TG_WX[parSaju.day.stem];
  const bYE=TG_WX[babySaju.year.stem],pYE=TG_WX[parSaju.year.stem];
  let elemScore=0;
  for(const [pEl,bEl] of [[pDE,bDE],[pYE,bYE]]){
    if(pEl===bEl) elemScore+=4;
    else if(wxGen(pEl,bEl)) elemScore+=5;
    else if(wxGen(bEl,pEl)) elemScore+=3;
    else if(wxCtrl(pEl,bEl)) elemScore+=1;
    else elemScore+=2;
  }
  elemScore=Math.min(10,elemScore);
  const bBr=[babySaju.year.branch,babySaju.month.branch,babySaju.day.branch,babySaju.hour.branch];
  const pBr=parSaju.hour?[parSaju.year.branch,parSaju.month.branch,parSaju.day.branch,parSaju.hour.branch]:[parSaju.year.branch,parSaju.month.branch,parSaju.day.branch];
  let branchRaw=3;
  for(const bb of bBr) for(const pb of pBr) branchRaw+=branchRel(bb,pb);
  const branchScore=Math.max(0,Math.min(6,branchRaw));
  const sanheScore=inSanhe(babySaju.year.branch,parSaju.year.branch)?4:0;
  return{score:Math.min(20,elemScore+branchScore+sanheScore),detail:{elemScore,branchScore,sanheScore}};
}
function calcScore(babySaju,fSaju,mSaju){
  const baby=scoreBaby(babySaju),father=scoreCompat(babySaju,fSaju),mother=scoreCompat(babySaju,mSaju);
  return{baby,father,mother,total:baby.total+father.score+mother.score};
}

// 상위 퍼센트 계산 (전체 168개 대비)
function calcPercentile(score, allScores){
  const better=allScores.filter(s=>s>score).length;
  return Math.round((better+1)/allScores.length*100);
}

// ════════════════════════════════════════════════
// 6. 날짜 유틸
// ════════════════════════════════════════════════

function addDays(y,m,d,n){const dt=new Date(y,m-1,d+n);return{y:dt.getFullYear(),m:dt.getMonth()+1,d:dt.getDate()};}
function fmt(y,m,d){return y+'년 '+m+'월 '+d+'일';}
function wday(y,m,d){return WEEKDAYS[new Date(y,m-1,d).getDay()];}
function isWE(y,m,d){const w=new Date(y,m-1,d).getDay();return w===0||w===6;}
function pillarTxt(p){return TG[p.stem]+DZ[p.branch];}
function sajuFull(s){return [s.year,s.month,s.day,s.hour].map(pillarTxt).join(' ');}

// ════════════════════════════════════════════════
// 7. 분석 실행
// ════════════════════════════════════════════════

let _allScores=[];
let _globalScores=[];

function runAnalysis(dueDateStr,fDobStr,fHour,mDobStr,mHour){
  const due=parseDate(dueDateStr),fd=parseDate(fDobStr),md=parseDate(mDobStr);
  const fh=fHour!==null?fHour:6,mh=mHour!==null?mHour:6;
  const fSaju=calcSaju(fd.y,fd.m,fd.d,fh),mSaju=calcSaju(md.y,md.m,md.d,mh);
  const results=[];
  for(let i=0;i<14;i++){
    const {y,m,d}=addDays(due.y,due.m,due.d,i-13);
    const hrs=[];
    for(let hb=0;hb<12;hb++){
      const saju=calcSaju(y,m,d,hb);
      hrs.push({hb,saju,score:calcScore(saju,fSaju,mSaju)});
    }
    hrs.sort((a,b)=>b.score.total-a.score.total);
    results.push({y,m,d,dayOffset:i,hourResults:hrs});
  }
  // 기간 내 168개 점수
  _allScores=results.flatMap(r=>r.hourResults.map(h=>h.score.total)).sort((a,b)=>a-b);

  // 연간 기준: 예정일 중심 ±182일 = 365일 × 12시간 = 4,380개
  const globalArr=[];
  for(let i=-182;i<183;i++){
    const {y,m,d}=addDays(due.y,due.m,due.d,i);
    for(let hb=0;hb<12;hb++){
      const saju=calcSaju(y,m,d,hb);
      globalArr.push(calcScore(saju,fSaju,mSaju).total);
    }
  }
  _globalScores=globalArr.sort((a,b)=>a-b);

  results.forEach(r=>r.bestScore=r.hourResults[0].score);
  results.sort((a,b)=>b.bestScore.total-a.bestScore.total);
  return{results,fSaju,mSaju};
}

// ════════════════════════════════════════════════
// 8. HTML 빌더
// ════════════════════════════════════════════════

function gradeClass(v,max){
  const r=v/max;
  if(r>=0.85) return 'grade-s';
  if(r>=0.70) return 'grade-a';
  if(r>=0.55) return 'grade-b';
  return 'grade-c';
}

function pctClass(pct){
  if(pct<=5)  return 'pct-top';
  if(pct<=15) return 'pct-high';
  if(pct<=35) return 'pct-mid';
  return 'pct-low';
}
function buildPercentileBadge(score){
  const lp=calcPercentile(score,_allScores);
  const gp=calcPercentile(score,_globalScores);
  return '<span class="pct-badge '+pctClass(lp)+'" title="조회 2주 기간 내 순위">2주 내 상위 '+lp+'%</span>'
        +'<span class="pct-badge '+pctClass(gp)+' pct-global" title="연간(±6개월) 전체 기준 순위">연간 상위 '+gp+'%</span>';
}

function buildPillarTable(saju){
  const labels=['연주','월주','일주','시주'];
  const pillars=[saju.year,saju.month,saju.day,saju.hour];
  // 양간(0,2,4,6,8)=짙은 배경+흰글씨 / 음간(1,3,5,7,9)=연한 배경+진한글씨
  function cellHtml(hanja,kr,wx,isYang){
    const bg=isYang?WX_BG_YANG[wx]:WX_BG_YIN[wx];
    const col=isYang?'#fff':WX_TEXT_YIN[wx];
    const tagBg=isYang?'rgba(255,255,255,.22)':'rgba(0,0,0,.07)';
    return '<div class="pt2-cell" style="background:'+bg+';color:'+col+'">'
      +'<div class="pt2-h">'+hanja+'</div>'
      +'<div class="pt2-k">'+kr+'</div>'
      +'<div class="pt2-tag" style="background:'+tagBg+';color:'+col+'">'+WX_HANJA[wx]+'·'+WX[wx]+'</div>'
      +'</div>';
  }
  let html='<div class="pillar-table2">';
  // 라벨 행
  html+='<div class="pt2-labels">';
  for(let i=0;i<4;i++) html+='<div>'+labels[i]+'</div>';
  html+='</div>';
  // 천간 행
  html+='<div class="pt2-row">';
  for(let i=0;i<4;i++){
    const p=pillars[i];
    html+=cellHtml(TG[p.stem],TG_KR[p.stem],TG_WX[p.stem],p.stem%2===0);
  }
  html+='</div>';
  // 지지 행
  html+='<div class="pt2-row">';
  for(let i=0;i<4;i++){
    const p=pillars[i];
    html+=cellHtml(DZ[p.branch],DZ_KR[p.branch],DZ_WX[p.branch],p.branch%2===0);
  }
  html+='</div>';
  return html+'</div>';
}

function buildWuxingBar(saju){
  const dist=getElementDist(saju); // 각 오행 개수 (최대 8)
  const WX_NAMES=['나무 기운','불 기운','흙 기운','쇠 기운','물 기운'];
  const WX_ICON=['🌿','🔥','🌍','⚙','💧'];

  // ① 오행 강도 바 (지장간 포함 최대값 동적 계산)
  const distMax=Math.max(...dist,1);
  let html='<div class="wx-section">';
  html+='<div class="wx-bars">';
  for(let i=0;i<5;i++){
    const pct=Math.round(dist[i]/distMax*100);
    const isEmpty=dist[i]===0;
    const dispVal=Number.isInteger(dist[i])?dist[i]:dist[i].toFixed(1);
    html+='<div class="wx-bar-item'+(isEmpty?' wx-empty':'')+'">'
      +'<div class="wx-bar-label" style="color:'+(isEmpty?'#bbb':WX_COLOR[i])+'">'+WX_HANJA[i]+'<span>'+WX[i]+'</span></div>'
      +'<div class="wx-bar-track">'
        +'<div class="wx-bar-fill" style="width:'+Math.max(pct,isEmpty?0:5)+'%;background:'+(isEmpty?'#e0e0e0':WX_BG_YANG[i])+'"></div>'
      +'</div>'
      +'<div class="wx-bar-count" style="color:'+(isEmpty?'#bbb':WX_COLOR[i])+'">'+dispVal+'</div>'
      +'</div>';
  }
  html+='</div>';

  // ② 부족한 기운 & 보완법
  const missing=[];
  const strong=[];
  for(let i=0;i<5;i++){
    if(dist[i]===0) missing.push(i);
    else if(dist[i]>=3) strong.push(i);
  }
  if(missing.length>0){
    html+='<div class="wx-advice">';
    html+='<div class="wx-advice-title">⚠ 부족한 기운 &amp; 보완 방법</div>';
    for(const idx of missing){
      const m=WUXING_MISSING[idx];
      const r=WUXING_REMEDY[idx];
      html+='<div class="wx-advice-item" style="border-left:4px solid '+WX_BG_YANG[idx]+'">'
        +'<div class="wx-advice-header" style="background:'+WX_BG_YIN[idx]+'">'
          +'<span style="color:'+WX_TEXT_YIN[idx]+';font-weight:700;font-size:.82rem">'+WX_ICON[idx]+' '+WX_HANJA[idx]+'('+WX[idx]+') '+WX_NAMES[idx]+'이 없어요</span>'
        +'</div>'
        +'<div class="wx-advice-body">'
          +'<p class="wx-meaning">'+m.meaning+'</p>'
          +'<div class="wx-remedy">'
            +'<div class="wx-remedy-title">'+r.tip+'</div>'
            +'<ul>'+r.items.map(t=>'<li>'+t+'</li>').join('')+'</ul>'
          +'</div>'
        +'</div>'
        +'</div>';
    }
    html+='</div>';
  }
  if(strong.length>0){
    html+='<div class="wx-strong-note">';
    html+='<span class="wx-strong-title">💪 강한 기운: </span>';
    html+=strong.map(i=>'<span style="color:'+WX_COLOR[i]+';font-weight:700">'+WX_ICON[i]+WX_HANJA[i]+'('+WX[i]+')</span>').join('  ')
      +'<span class="wx-strong-desc"> 이 기운이 강해요. 이 기운의 특성이 아이 성격과 재능에 두드러지게 나타날 수 있어요.</span>';
    html+='</div>';
  }
  return html+'</div>';
}

function buildFortuneGrid(saju,score){
  const f=scoreFortuneAspects(saju,score);
  const ITEMS=[
    {icon:'💰',name:'재물운',val:f.wealth,
     desc:f.wealth>=70?'재성 구조 우수 — 재물 축적력과 관리 능력이 뛰어나요'
         :f.wealth>=50?'안정적인 재물 흐름 — 꾸준한 수입을 기대할 수 있어요'
         :'가치·의미 지향 — 재물보다 보람 있는 일에서 빛나는 사주예요'},
    {icon:'🏆',name:'명예운',val:f.honor,
     desc:f.honor>=70?'관성 강함 — 사회적 인정과 명예를 자연스럽게 얻어요'
         :f.honor>=50?'노력이 인정받는 사주 — 꾸준히 하면 빛이 나요'
         :'명예보다 자유와 독립을 추구하는 개인주의 기질이에요'},
    {icon:'🤝',name:'인복',val:f.people,
     desc:f.people>=70?'귀인을 자주 만나고 사람들에게 사랑받는 사주예요'
         :f.people>=50?'평균 이상의 인복 — 중요한 순간 도움을 받아요'
         :'소수의 깊은 관계를 선호하는 내면 중심 스타일이에요'},
    {icon:'💪',name:'건강운',val:f.health,
     desc:f.health>=70?'오행 균형 우수 — 타고난 건강 체질이에요'
         :f.health>=50?'규칙적인 생활 습관으로 건강을 유지할 수 있어요'
         :'건강 관리에 신경 써야 하는 사주 — 예방이 중요해요'},
    {icon:'📚',name:'학습운',val:f.study,
     desc:f.study>=70?'인성 강함 — 타고난 학습 능력과 지혜가 뛰어나요'
         :f.study>=50?'꾸준히 배우면 실력을 발휘하는 사주예요'
         :'책보다 실전 경험으로 성장하는 현장형 스타일이에요'},
    {icon:'🍀',name:'당첨운',val:f.windfall,
     desc:f.windfall>=70?'편재·귀인 강함 — 뜻밖의 행운이 자주 따라와요'
         :f.windfall>=50?'이따금 행운이 찾아오는 평균적인 횡재운이에요'
         :'운보다 노력으로 얻는 것이 더 잘 맞는 사주예요'},
    {icon:'👑',name:'리더십',val:f.lead,
     desc:f.lead>=70?'신강+관성 구조 — 타고난 리더 기질이 뚜렷해요'
         :f.lead>=50?'상황에 따라 리더 역할을 잘 수행하는 사주예요'
         :'조력자·팀플레이어로서 뒤에서 빛나는 스타일이에요'},
    {icon:'🎨',name:'창의력',val:f.creative,
     desc:f.creative>=70?'상관·식신 강함 — 창의·예술적 재능이 뛰어나요'
         :f.creative>=50?'독창적인 아이디어를 잘 내는 사주예요'
         :'창의보다 분석·실용 능력이 강한 논리형 사주예요'},
  ];
  let html='<div class="fortune-section">';
  html+='<div class="fortune-title">🌟 운세 항목별 점수</div>';
  html+='<div class="fortune-grid">';
  for(const it of ITEMS){
    const lvl=it.val>=70?'hi':it.val>=50?'mid':'lo';
    html+='<div class="fortune-card fortune-'+lvl+'">'
      +'<div class="fc-head"><span class="fc-icon">'+it.icon+'</span>'
      +'<span class="fc-name">'+it.name+'</span>'
      +'<span class="fc-score fortune-score-'+lvl+'">'+it.val+'</span></div>'
      +'<div class="fc-bar-track"><div class="fc-bar-fill fortune-fill-'+lvl+'" style="width:'+it.val+'%"></div></div>'
      +'<div class="fc-desc">'+it.desc+'</div>'
      +'</div>';
  }
  return html+'</div></div>';
}

function buildBadges(found,voids){
  let html='<div class="guiren-badges">';
  if(found.tianyi)   html+='<span class="badge badge-tianyi">☀ 천을귀인</span>';
  if(found.wenchang) html+='<span class="badge badge-wenchang">✏ 문창귀인</span>';
  if(found.fuxing)   html+='<span class="badge badge-fuxing">★ 복성귀인</span>';
  if(voids.length>0) html+='<span class="badge badge-kongmang">空 공망주의</span>';
  if(!found.tianyi&&!found.wenchang&&!found.fuxing&&voids.length===0)
    html+='<span class="badge" style="background:rgba(76,175,114,.1);border:1px solid rgba(76,175,114,.3);color:var(--wood)">✓ 공망 없음</span>';
  return html+'</div>';
}

function buildScoreBreakdown(score){
  const {baby,father,mother}=score;
  const compatTotal=father.score+mother.score;
  const pct=(v,max)=>Math.round(v/max*100);
  return '<div class="score-breakdown">'
    +'<div class="score-section">'
    +'<div class="score-section-title">아기 사주 품질 ('+baby.total+'/60)</div>'
    +'<div class="score-row"><span class="score-row-label">오행 균형</span>'
    +'<div class="score-bar-wrap"><div class="score-bar-fill baby-bar" style="width:'+pct(baby.wuxingBalance,20)+'%"></div></div>'
    +'<span class="score-row-val">'+baby.wuxingBalance+'/20</span></div>'
    +'<div class="score-row"><span class="score-row-label">일간 강도</span>'
    +'<div class="score-bar-wrap"><div class="score-bar-fill baby-bar" style="width:'+pct(baby.dayStrength,15)+'%"></div></div>'
    +'<span class="score-row-val">'+baby.dayStrength+'/15</span></div>'
    +'<div class="score-row"><span class="score-row-label">귀인·길성</span>'
    +'<div class="score-bar-wrap"><div class="score-bar-fill baby-bar" style="width:'+pct(baby.guiren,15)+'%"></div></div>'
    +'<span class="score-row-val">'+baby.guiren+'/15</span></div>'
    +'<div class="score-row"><span class="score-row-label">공망 회피</span>'
    +'<div class="score-bar-wrap"><div class="score-bar-fill baby-bar" style="width:'+pct(baby.kongmang,10)+'%"></div></div>'
    +'<span class="score-row-val">'+baby.kongmang+'/10</span></div>'
    +'</div>'
    +'<div class="score-section">'
    +'<div class="score-section-title">부모 궁합 ('+compatTotal+'/40)</div>'
    +'<div class="score-row"><span class="score-row-label">아버지 궁합</span>'
    +'<div class="score-bar-wrap"><div class="score-bar-fill compat-bar" style="width:'+pct(father.score,20)+'%"></div></div>'
    +'<span class="score-row-val">'+father.score+'/20</span></div>'
    +'<div class="score-row"><span class="score-row-label">어머니 궁합</span>'
    +'<div class="score-bar-wrap"><div class="score-bar-fill compat-bar" style="width:'+pct(mother.score,20)+'%"></div></div>'
    +'<span class="score-row-val">'+mother.score+'/20</span></div>'
    +'<div class="score-row"><span class="score-row-label">오행 상생</span>'
    +'<div class="score-bar-wrap"><div class="score-bar-fill compat-bar" style="width:'+pct(father.detail.elemScore+mother.detail.elemScore,20)+'%"></div></div>'
    +'<span class="score-row-val">'+(father.detail.elemScore+mother.detail.elemScore)+'/20</span></div>'
    +'<div class="score-row"><span class="score-row-label">지지·삼합</span>'
    +'<div class="score-bar-wrap"><div class="score-bar-fill compat-bar" style="width:'+pct(father.detail.branchScore+father.detail.sanheScore+mother.detail.branchScore+mother.detail.sanheScore,20)+'%"></div></div>'
    +'<span class="score-row-val">'+(father.detail.branchScore+father.detail.sanheScore+mother.detail.branchScore+mother.detail.sanheScore)+'/20</span></div>'
    +'</div></div>';
}

// ─── 상세 사주 풀이 빌더 ───────────────────────

function buildInterpretation(saju, score){
  const dm = DAYMASTER_INFO[saju.day.stem];
  const dist = getElementDist(saju);
  const monthBranch = saju.month.branch;
  const strengthIdx = getDayStrengthLabel(saju);
  const si = STRENGTH_INFO[strengthIdx];
  const ki = KONGMANG_DETAIL[score.baby.kongmangType];

  // 계절 찾기
  const season = MONTH_SEASON.find(s=>s.branches.includes(monthBranch)) || MONTH_SEASON[0];

  // 부족한 오행
  const missingEls = dist.map((v,i)=>v===0?i:-1).filter(i=>i>=0);
  // 과다한 오행 (3개 이상)
  const excessEls = dist.map((v,i)=>v>=3?i:-1).filter(i=>i>=0);

  // 아버지·어머니 오행 관계 설명
  function compatDesc(parSaju, label){
    if(!parSaju) return '';
    const pEl = TG_WX[parSaju.day.stem];
    const bEl = TG_WX[saju.day.stem];
    let rel = '';
    if(pEl===bEl) rel = label+'와(과) 아기의 기운이 <b>같은 오행</b>입니다. 서로 잘 이해하고 공감하며 비슷한 성향을 공유합니다.';
    else if(wxGen(pEl,bEl)) rel = '<b>'+label+'의 기운('+WX[pEl]+')</b>이 아기의 기운('+WX[bEl]+')을 <b>생하고 키워줍니다.</b> 부모가 아이에게 자연스럽게 에너지를 주는 이상적인 관계입니다. 부모의 지원과 사랑이 아이를 크게 성장시킵니다.';
    else if(wxGen(bEl,pEl)) rel = '아기의 기운('+WX[bEl]+')이 '+label+'의 기운('+WX[pEl]+')을 생해줍니다. 아이가 부모에게 활력과 에너지를 주는 관계입니다. 서로 보완하며 함께 성장하는 구조입니다.';
    else if(wxCtrl(pEl,bEl)) rel = label+'의 기운('+WX[pEl]+')이 아기의 기운('+WX[bEl]+')을 <b>다소 억제</b>합니다. 갈등 가능성이 있지만, 동시에 아이에게 규율과 방향을 제시하는 관계이기도 합니다. 대화와 격려가 더욱 중요합니다.';
    else rel = '서로 다른 오행으로, <b>독립적인 에너지</b>를 가집니다. 각자의 개성을 존중하며 조화를 이루는 관계입니다.';
    return rel;
  }

  let html = '<div class="interp-wrap">';

  // ① 일간 기질
  html += '<div class="interp-section">'
    +'<div class="interp-head"><span class="interp-icon">'+dm.icon+'</span>'
    +'<span class="interp-title">아이의 타고난 성격 — '+dm.hanja+'('+dm.kr+') · '+dm.title+'</span></div>'
    +'<div class="interp-body">'
    +'<div class="easy-box">📌 <b>일간(日干)이란?</b> 태어난 날의 기운으로 아이의 타고난 핵심 성격을 나타내요.</div>'
    +'<div class="interp-core">'+dm.core+'</div>'
    +'<p>'+dm.detail+'</p>'
    +'<div class="interp-block">'
    +'<div class="interp-block-label" style="color:var(--wood)">💪 타고난 강점</div>'
    +'<p>'+dm.talent+'</p>'
    +'</div>'
    +'<div class="interp-block">'
    +'<div class="interp-block-label" style="color:var(--earth)">🌱 이런 부분은 키워주세요</div>'
    +'<p>'+dm.caution+'</p>'
    +'</div>'
    +'<div class="interp-example">💡 '+dm.example+'</div>'
    +'</div></div>';

  // ② 오행 분포
  html += '<div class="interp-section">'
    +'<div class="interp-head"><span class="interp-icon">⚖</span>'
    +'<span class="interp-title">오행(五行) 분포 분석</span>'
    +'</div>'
    +'<div class="interp-body">'
    +'<div class="easy-box">🌱 <b>오행이란?</b> 세상의 모든 에너지를 5가지로 나눈 거예요. 나무(木)·불(火)·흙(土)·쇠(金)·물(水)이 균형 있게 있을수록 좋은 사주예요!</div>';

  // 과다 오행
  const excessDesc = [
    '나무 기운(木)이 아주 강해요. 하고 싶은 것을 향한 추진력과 열정이 넘쳐요. 다만 너무 고집스러워지지 않도록 가끔 "다른 사람 말도 들어볼까?"를 연습해보세요.',
    '불 기운(火)이 아주 강해요. 열정이 넘치고 표현력이 뛰어나서 어디서든 눈에 띄어요. 에너지 소모가 크니 충분한 휴식도 중요해요.',
    '흙 기운(土)이 아주 강해요. 안정감이 넘치고 신중한 성격이에요. 변화를 두려워할 수 있으니 새로운 경험을 자주 해보게 하면 좋아요.',
    '쇠 기운(金)이 아주 강해요. 결단력과 원칙이 강해서 옳고 그름이 분명해요. 지나치게 엄격해지지 않도록 유연함도 함께 길러주세요.',
    '물 기운(水)이 아주 강해요. 생각이 깊고 지혜로워요. 너무 많이 생각하다 행동이 늦어질 수 있으니 "일단 해보자!" 마음도 키워주세요.',
  ];
  if(excessEls.length>0){
    excessEls.forEach(i=>{
      html += '<div class="interp-block">'
        +'<div class="interp-block-label" style="color:'+WX_COLOR[i]+'">⚡ '+WX_HANJA[i]+' ('+WX[i]+') 기운이 매우 강해요 ('+dist[i]+'개)</div>'
        +'<p>'+excessDesc[i]+'</p>'
        +'</div>';
    });
  }

  // 부족 오행
  if(missingEls.length>0){
    missingEls.forEach(i=>{
      const m=WUXING_MISSING[i];
      html += '<div class="interp-block">'
        +'<div class="interp-block-label" style="color:'+WX_COLOR[i]+'">⚠ '+m.name+'</div>'
        +'<p>'+m.meaning+'</p>'
        +'<div class="easy-box">💬 쉽게 말하면: '+m.easy+'</div>'
        +'</div>';
    });
  } else {
    html += '<div class="interp-ok">✓ 오행 5가지가 모두 골고루 있어요! 어느 한쪽에 치우치지 않는 균형 잡힌 사주예요.</div>';
  }
  html += '</div></div>';

  // ③ 계절 기운
  html += '<div class="interp-section">'
    +'<div class="interp-head"><span class="interp-icon">'+season.icon+'</span>'
    +'<span class="interp-title">태어난 계절 — '+season.season+' ('+season.months+')</span></div>'
    +'<div class="interp-body">'
    +'<div class="interp-core">'+season.meaning+'</div>'
    +'<p>'+season.detail+'</p>'
    +'</div></div>';

  // ④ 일간 강약
  html += '<div class="interp-section">'
    +'<div class="interp-head"><span class="interp-icon">⚡</span>'
    +'<span class="interp-title">아이의 에너지 강도 — '+si.label+' ('+si.desc+')</span></div>'
    +'<div class="interp-body">'
    +'<div class="easy-box">📌 <b>일간 강약이란?</b> 사주 전체에서 아이를 도와주는 기운이 많으면 강하고(신강), 적으면 약해요(신약). 균형 잡힌 게 가장 좋아요!</div>'
    +'<p>'+si.meaning+'</p>'
    +'<p>'+si.tip+'</p>'
    +'</div></div>';

  // ⑤ 귀인·길성
  const hasGuiren = score.baby.guirenFound.tianyi||score.baby.guirenFound.wenchang||score.baby.guirenFound.fuxing;
  if(hasGuiren){
    html += '<div class="interp-section">'
      +'<div class="interp-head"><span class="interp-icon">✨</span>'
      +'<span class="interp-title">행운의 별 — 귀인(貴人)·길성(吉星)</span></div>'
      +'<div class="interp-body">'
      +'<div class="easy-box">🌟 <b>귀인이란?</b> 태어날 때부터 사주에 행운의 별이 있다는 뜻이에요! 이 별이 있으면 살면서 좋은 일이 자주 생기거나, 힘들 때 도움이 찾아와요.</div>';
    for(const [key,found] of Object.entries(score.baby.guirenFound)){
      if(!found) continue;
      const g=GUIREN_DETAIL[key];
      html += '<div class="interp-guiren">'
        +'<div class="interp-guiren-title">'+g.icon+' '+g.name+'</div>'
        +'<p>'+g.meaning+'</p>'
        +'<p>'+g.example+'</p>'
        +'<p>'+g.benefit+'</p>'
        +'</div>';
    }
    html += '</div></div>';
  } else {
    html += '<div class="interp-section">'
      +'<div class="interp-head"><span class="interp-icon">⭐</span>'
      +'<span class="interp-title">행운의 별 (귀인·길성)</span></div>'
      +'<div class="interp-body">'
      +'<p style="color:var(--text2)">이 시간에는 천을귀인·문창귀인·복성귀인이 없어요. 귀인이 없어도 노력으로 충분히 좋은 인생을 만들 수 있어요! 다른 시간대를 비교해보세요.</p>'
      +'</div></div>';
  }

  // ⑥ 공망
  html += '<div class="interp-section">'
    +'<div class="interp-head"><span class="interp-icon">🔮</span>'
    +'<span class="interp-title">공망(空亡) 분석 — '+ki.label+'</span></div>'
    +'<div class="interp-body">'
    +'<div class="easy-box">📌 <b>공망이란?</b> 사주에서 "에너지가 새어 나가는 구멍"이에요. 없을수록 좋고, 있어도 극복할 수 있어요!</div>'
    +'<p style="color:'+ki.color+'"><b>'+ki.meaning+'</b></p>'
    +'<p>'+ki.detail+'</p>'
    +'<div class="interp-example">'+ki.example+'</div>'
    +'</div></div>';

  html += '</div>'; // interp-wrap
  return html;
}

// ════════════════════════════════════════════════
// 9. 렌더링
// ════════════════════════════════════════════════

let _results=[],_sortMode='total';

function getSortVal(r){
  if(_sortMode==='baby')   return r.hourResults[0].score.baby.total;
  if(_sortMode==='compat') return r.hourResults[0].score.father.score+r.hourResults[0].score.mother.score;
  return r.hourResults[0].score.total;
}
function sorted(){return[..._results].sort((a,b)=>getSortVal(b)-getSortVal(a));}

function renderTopList(list){
  const c=document.getElementById('top-list');
  c.innerHTML=list.slice(0,5).map((r,i)=>{
    const best=r.hourResults[0];
    const wdcls=isWE(r.y,r.m,r.d)?' day-weekend':'';
    const pct=buildPercentileBadge(best.score.total);
    return '<div class="top-card rank-'+(i+1)+'" data-day="'+r.dayOffset+'">'
      +'<div class="rank-badge">'+(i+1)+'</div>'
      +'<div class="top-card-date'+wdcls+'">'+r.m+'월 '+r.d+'일 ('+wday(r.y,r.m,r.d)+')</div>'
      +'<div class="top-card-time">'+HOURS[best.hb].name+' '+HOURS[best.hb].time+'</div>'
      +'<div class="top-card-saju">'+sajuFull(best.saju)+'</div>'
      +'<div class="top-card-score '+gradeClass(best.score.total,100)+'">'+best.score.total+'<span>/100</span></div>'
      +pct
      +'</div>';
  }).join('');
  c.querySelectorAll('.top-card').forEach(el=>el.addEventListener('click',()=>showDetail(Number(el.dataset.day))));
}

function renderFullList(list){
  const c=document.getElementById('full-list');
  c.innerHTML=list.map((r,rank)=>{
    const best=r.hourResults[0];
    const wdcls=isWE(r.y,r.m,r.d)?' day-weekend':'';
    const pct=buildPercentileBadge(best.score.total);
    return '<div class="day-row" id="dayrow-'+r.dayOffset+'">'
      +'<div class="day-row-header" data-day="'+r.dayOffset+'">'
      +'<div class="day-rank'+(rank<3?' top3':'')+'">'+((rank+1))+'</div>'
      +'<div class="day-info">'
      +'<div class="day-date-line">'+r.m+'월 '+r.d+'일 <span class="day-weekday'+wdcls+'">('+wday(r.y,r.m,r.d)+')</span></div>'
      +'<div class="day-best-time">추천: '+HOURS[best.hb].name+' '+HOURS[best.hb].time+'</div>'
      +'<div class="day-saju-text">'+sajuFull(best.saju)+'</div>'
      +'</div>'
      +'<div class="day-score-col">'
      +'<div class="score-total '+gradeClass(best.score.total,100)+'">'+best.score.total+'<span>/100</span></div>'
      +pct
      +'<div class="score-mini-bars">'
      +'<div class="mini-bar baby" style="width:'+best.score.baby.total*0.5+'px"></div>'
      +'<div class="mini-bar compat" style="width:'+(best.score.father.score+best.score.mother.score)*0.5+'px"></div>'
      +'</div></div></div>'
      +'<button class="day-expand-btn" data-day="'+r.dayOffset+'"><span class="arrow">▼</span> 시간대별 보기</button>'
      +'<div class="day-detail-panel" id="panel-'+r.dayOffset+'">'
      +buildWuxingBar(best.saju)
      +buildBadges(best.score.baby.guirenFound,best.score.baby.kongmangVoids)
      +buildScoreBreakdown(best.score)
      +'<div style="margin-top:.7rem;text-align:center">'
      +'<button class="btn-back" style="font-size:.8rem;" data-detail="'+r.dayOffset+'">→ 시간대 전체 분석 보기</button>'
      +'</div></div></div>';
  }).join('');

  c.querySelectorAll('.day-expand-btn').forEach(btn=>{
    btn.addEventListener('click',e=>{
      e.stopPropagation();
      const day=Number(btn.dataset.day);
      const panel=document.getElementById('panel-'+day);
      const open=panel.classList.contains('open');
      panel.classList.toggle('open',!open);
      btn.classList.toggle('open',!open);
    });
  });
  c.querySelectorAll('.day-row-header').forEach(h=>h.addEventListener('click',()=>showDetail(Number(h.dataset.day))));
  c.querySelectorAll('[data-detail]').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();showDetail(Number(btn.dataset.detail));}));
}

function showDetail(dayOffset){
  const r=_results.find(x=>x.dayOffset===dayOffset);
  if(!r) return;

  document.getElementById('detail-title').textContent=fmt(r.y,r.m,r.d)+' ('+wday(r.y,r.m,r.d)+') 상세 분석';

  const best=r.hourResults[0];
  document.getElementById('detail-saju-summary').innerHTML=
    '<div style="margin-bottom:.8rem;display:flex;align-items:center;gap:.6rem;flex-wrap:wrap;">'
    +'<span style="font-size:.82rem;color:var(--text2);">베스트 시간: </span>'
    +'<span style="color:var(--gold);font-weight:600;">'+HOURS[best.hb].name+' ('+HOURS[best.hb].time+')</span>'
    +'<span style="font-size:.82rem;color:var(--text3);">총점 '+best.score.total+'점</span>'
    +buildPercentileBadge(best.score.total)
    +'</div>'
    +buildPillarTable(best.saju)+buildWuxingBar(best.saju)+buildBadges(best.score.baby.guirenFound,best.score.baby.kongmangVoids);

  const hl=document.getElementById('detail-hour-list');
  hl.innerHTML=r.hourResults.map((h,i)=>{
    const isBest=i===0;
    const pct=buildPercentileBadge(h.score.total);
    const interpId='interp-'+dayOffset+'-'+h.hb;
    return '<div class="hour-row'+(isBest?' best-hour':'')+'" id="hrow-'+dayOffset+'-'+h.hb+'">'
      +'<div class="hour-row-header" data-day="'+dayOffset+'" data-hb="'+h.hb+'">'
      +'<div>'
      +'<div class="hour-name">'+HOURS[h.hb].name+(isBest?' ★':'')+'</div>'
      +'<div class="hour-time">'+HOURS[h.hb].time+'</div>'
      +'</div>'
      +'<div class="hour-score-bar">'
      +'<div class="h-bar-wrap"><div class="h-bar-fill" style="width:'+h.score.total+'%"></div></div>'
      +'</div>'
      +'<div style="display:flex;flex-direction:column;align-items:flex-end;gap:.2rem;">'
      +'<div class="hour-score-num '+gradeClass(h.score.total,100)+'">'+h.score.total+'<span>/100</span></div>'
      +pct
      +'</div>'
      +'</div>'
      +'<button class="hour-expand-btn" data-day="'+dayOffset+'" data-hb="'+h.hb+'">📊 사주 상세 & 풀이 보기 <span class="arrow">▼</span></button>'
      +'<div class="hour-detail-panel" id="hpanel-'+dayOffset+'-'+h.hb+'">'
      +buildPillarTable(h.saju)
      +buildWuxingBar(h.saju)
      +buildBadges(h.score.baby.guirenFound,h.score.baby.kongmangVoids)
      +buildScoreBreakdown(h.score)
      +buildFortuneGrid(h.saju,h.score)
      +'<button class="interp-toggle-btn" data-target="'+interpId+'">📖 상세 사주 풀이 보기 ▼</button>'
      +'<div class="interp-container" id="'+interpId+'" style="display:none;">'
      +buildInterpretation(h.saju,h.score)
      +'</div>'
      +'</div>'
      +'</div>';
  }).join('');

  hl.querySelectorAll('.hour-expand-btn').forEach(btn=>{
    btn.addEventListener('click',e=>{
      e.stopPropagation();
      const {day,hb}=btn.dataset;
      const panel=document.getElementById('hpanel-'+day+'-'+hb);
      const open=panel.classList.contains('open');
      panel.classList.toggle('open',!open);
      btn.classList.toggle('open',!open);
    });
  });

  hl.querySelectorAll('.interp-toggle-btn').forEach(btn=>{
    btn.addEventListener('click',e=>{
      e.stopPropagation();
      const target=document.getElementById(btn.dataset.target);
      const open=target.style.display!=='none';
      target.style.display=open?'none':'block';
      btn.textContent=open?'📖 상세 사주 풀이 보기 ▼':'📖 상세 사주 풀이 닫기 ▲';
    });
  });

  showStep('detail');
}

// ════════════════════════════════════════════════
// 10. 스텝 전환 & 초기화
// ════════════════════════════════════════════════

function showStep(name){
  document.querySelectorAll('.step').forEach(s=>s.classList.remove('active'));
  document.getElementById('step-'+name).classList.add('active');
  window.scrollTo(0,0);
}

document.addEventListener('DOMContentLoaded',()=>{
  const today=new Date(),later=new Date(today.getTime()+14*86400000);
  document.getElementById('dueDate').value=later.toISOString().slice(0,10);

  document.getElementById('saju-form').addEventListener('submit',e=>{
    e.preventDefault();
    const errEl=document.getElementById('form-error');
    errEl.style.display='none';
    const dueDate=document.getElementById('dueDate').value;
    const fDob=document.getElementById('fatherDob').value;
    const mDob=document.getElementById('motherDob').value;
    const fhv=document.getElementById('fatherHour').value;
    const mhv=document.getElementById('motherHour').value;
    if(!dueDate||!fDob||!mDob){
      errEl.textContent='출산예정일, 아버지/어머니 생년월일은 필수입력 항목입니다.';
      errEl.style.display='block';
      return;
    }
    const fHour=fhv!==''?Number(fhv):null;
    const mHour=mhv!==''?Number(mhv):null;
    showStep('loading');
    setTimeout(()=>{
      const {results}=runAnalysis(dueDate,fDob,fHour,mDob,mHour);
      _results=results;
      _sortMode='total';
      const due=parseDate(dueDate),start=addDays(due.y,due.m,due.d,-13);
      document.getElementById('analysisRange').textContent=fmt(start.y,start.m,start.d)+' ~ '+fmt(due.y,due.m,due.d);
      document.querySelectorAll('.sort-btn').forEach(b=>b.classList.toggle('active',b.dataset.sort==='total'));
      const s=sorted();
      renderTopList(s);
      renderFullList(s);
      showStep('result');
    },400);
  });

  document.addEventListener('click',e=>{
    if(e.target.classList.contains('sort-btn')){
      _sortMode=e.target.dataset.sort;
      document.querySelectorAll('.sort-btn').forEach(b=>b.classList.toggle('active',b.dataset.sort===_sortMode));
      const s=sorted();renderTopList(s);renderFullList(s);
    }
  });

  document.getElementById('back-to-input').addEventListener('click',()=>showStep('input'));
  document.getElementById('back-to-result').addEventListener('click',()=>showStep('result'));
});
