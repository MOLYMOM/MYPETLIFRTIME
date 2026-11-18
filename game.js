const $=s=>document.querySelector(s),R=a=>a[Math.floor(Math.random()*a.length)],C=v=>Math.max(0,Math.min(100,v));
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
const ST={hea:'건강',hap:'행복도',bond:'유대감',nut:'영양',str:'스트레스',env:'환경',act:'활동량'};
// 효과 템플릿 (동물군별 라벨만 다르고 수치는 공통)
const E={food:{nut:28,hap:2},water:{nut:8,hea:2},treat:{hap:8,nut:6,bond:3},play:{hap:10,act:22,bond:4,str:-5,nut:-5},clean:{env:32,str:-3},care:{hea:6,str:-2},bond:{bond:10,hap:5,str:-6},vet:{hea:16,str:4},envi:{env:20,hap:4},train:{bond:6,act:8,str:3,nut:-3}};
// 동물군별 관리 메뉴: 해당 동물에 맞는 항목만 노출
const G={
dog:[['사료 급여','food'],['물 제공','water'],['간식','treat'],['산책','play'],['공놀이','play'],['훈련','train'],['목욕','clean'],['발톱 관리','care'],['예방접종','vet'],['교감하기','bond']],
cat:[['사료·물 급여','food'],['화장실 청소','clean'],['캣타워 설치','envi'],['사냥 놀이','play'],['스크래처','envi'],['빗질','care'],['쓰다듬기','bond'],['건강검진','vet']],
small:[['전용 사료','food'],['채소·간식','treat'],['물 제공','water'],['쳇바퀴·운동','play'],['은신처 정리','envi'],['베딩 교체','clean'],['케이지 청소','clean'],['손에 올려 교감','bond'],['건강검진','vet']],
bird:[['종별 먹이','food'],['신선한 물','water'],['비행 시간','play'],['장난감','envi'],['교감·훈련','train'],['깃털 관리','care'],['환경 풍부화','envi'],['건강검진','vet']],
fish:[['먹이 주기','food'],['물갈이','clean'],['여과기 청소','clean'],['수온·수질 체크','care'],['수초·장식','envi'],['조명 조절','care'],['질병 점검','vet']],
rep:[['먹이 급여','food'],['온도·습도 관리','care'],['UVB 조명','care'],['은신처 배치','envi'],['사육장 청소','clean'],['탈피 관리','care'],['칼슘 영양제','water'],['건강검진','vet']],
bug:[['먹이 급여','food'],['수분·분무','water'],['바닥재 교체','clean'],['사육통 청소','clean'],['온도·습도 조절','care'],['나무·은신처 배치','envi'],['조심스레 관찰','bond']],
amph:[['먹이 급여','food'],['분무·습도 관리','care'],['물 갈이','clean'],['사육장 청소','clean'],['은신처 배치','envi'],['온도 체크','care'],['건강검진','vet'],['조심스레 관찰','bond']],
myth:[['황금 사과·무지개 건초','food'],['별빛 샘물','water'],['반짝이 간식','treat'],['질주·비행','play'],['갈기·꼬리 빗질','care'],['뿔·날개 광택 내기','care'],['마구간 청소','clean'],['마법 에너지 점검','vet'],['교감하기','bond']],
gun:[['외관 닦기','care'],['방청 처리(윤활)','food'],['보관함·잠금 점검','envi'],['습도 관리','clean'],['정기 점검 받기','vet'],['서류·허가 확인','bond']]};
// ===== 동물 데이터베이스 (확장 가능 구조) =====
// legal.cls: COMMON_PET | EXOTIC_PET | RESTRICTED_PET | COUNTRY_SPECIFIC_PET | NOT_ELIGIBLE
// legal.verified(검증일)와 legal.src(공식 출처)가 채워진 항목만 '특수 풀'에 들어갈 수 있음
const TX={dog:'포유강 식육목',cat:'포유강 식육목',small:'포유강',bird:'조류',fish:'어류',rep:'파충강',bug:'곤충·무척추동물',amph:'양서강',myth:'신화 속 생물(히든)',gun:'무기류(히든)'};
const GI={
dog:{food:'균형 잡힌 사료, 신선한 물, 가끔 간식 (초콜릿·양파류 금지)',env:'조용한 실내 쉼터, 규칙적인 산책',play:'산책, 공놀이, 훈련',hc:'예방접종, 구충, 발톱·치아 관리',end:'익숙한 냄새와 손길 속에서 평온히 눈을 감았다.'},
cat:{food:'고단백 사료와 깨끗한 물',env:'청결한 화장실, 높은 곳과 숨을 곳',play:'사냥 놀이, 캣타워, 스크래처',hc:'정기검진, 빗질, 신장·치아 관리',end:'햇살 드는 자리에서 조용히 잠들었다.'},
small:{food:'종별 전용 사료·건초·소량의 채소',env:'적정 온도의 케이지, 은신처, 깨끗한 베딩',play:'쳇바퀴, 터널, 갉을 거리',hc:'이빨·발톱 관리, 케이지 위생, 건강검진',end:'작은 몸으로 긴 생애를 마치고 포근한 둥지에서 잠들었다.'},
bird:{food:'종별 적합한 씨앗·펠렛·채소',env:'넓은 케이지, 비행 공간, 낮밤 주기',play:'비행, 장난감, 교감·훈련',hc:'깃털·발 관리, 스트레스 관리, 검진',end:'마지막까지 부드러운 지저귐을 남겼다.'},
fish:{food:'종별 전용 사료 소량 급여',env:'적정 수온·수질, 여과기, 수초와 은신처',play:'수초·장식 속 탐색',hc:'정기 환수, 수질 검사, 질병 점검',end:'맑은 물속에서 고요히 생을 마쳤다.'},
rep:{food:'종별 먹이(곤충·채소·사료)와 칼슘 보충',env:'온도 구배·습도, UVB 조명, 은신처',play:'은신처 탐색, 일광욕',hc:'탈피 관리, 칼슘 영양, 사육장 청소',end:'따뜻한 조명 아래에서 느리고 평온하게 눈을 감았다.'},
bug:{food:'종별 먹이(젤리·과일·채소·살아있는 먹이)',env:'적정 온도·습도, 바닥재, 은신처와 나무',play:'오르기, 파기, 탐색',hc:'바닥재 교체, 습도·온도 유지, 청결',end:'짧지만 힘차게 살아낸 생을 마쳤다.'},
amph:{food:'곤충(귀뚜라미 등)과 칼슘 보충',env:'습도·수온 관리, 은신처, 깨끗한 물',play:'은신처 탐색, 사냥 본능',hc:'습도·수질 관리, 피부 상태 점검, 청결',end:'촉촉한 이끼 곁에서 조용히 숨을 거두었다.'},
myth:{food:'황금 사과, 무지개 건초',env:'넓은 초원과 별빛 마구간',play:'질주와 비행, 구름 위 산책',hc:'뿔·날개 손질, 마법 에너지 점검',end:'무지갯빛 가루를 남기며 별빛 속으로 사라졌다.'},
gun:{food:'방청 처리(윤활)와 정기 점검',env:'건조하고 잠금장치가 있는 안전 보관',play:'없음 (관리 시뮬레이션)',hc:'정기 점검, 서류·허가 관리',end:'안전하게 보관된 채 조용히 역할을 마쳤다.'}};
const D=(ko,en,sci,emoji,grp,avg,max,gr,br,cls,o={})=>({ko,en,sci,emoji,grp,tax:TX[grp],avg,max,gr,breeds:br,food:GI[grp].food,env:GI[grp].env,play:GI[grp].play,hc:GI[grp].hc,end:o.end||GI[grp].end,
legal:{cls,recog:o.recog||['*'],allow:o.allow||['*'],ban:o.ban||[],permit:o.permit||'일반적으로 불필요 (지역 조례 확인)',cites:o.cites||'일반적으로 비해당 (확인 필요)',src:o.src||null,verified:o.v||null,note:o.note||''}});
// 형식: 한국어명,영문명,학명,이모지,군,평균수명,최대수명,성장기(개월),품종,법적분류,옵션
const DB=[
D('강아지','Dog','Canis lupus familiaris','🐶','dog',13,20,18,['말티즈','푸들','골든 리트리버','시바견','진돗개','웰시코기','비글'],'COMMON_PET'),
D('고양이','Cat','Felis catus','🐱','cat',15,25,12,['코리안 숏헤어','러시안 블루','페르시안','브리티시 숏헤어','샴'],'COMMON_PET'),
D('햄스터','Hamster','Mesocricetus auratus / Phodopus spp.','🐹','small',2.5,3.5,3,['골든','드워프','로보로브스키'],'COMMON_PET'),
D('기니피그','Guinea pig','Cavia porcellus','🐹','small',6,8,5,['아비시니안','페루비안'],'COMMON_PET'),
D('토끼','Rabbit','Oryctolagus cuniculus','🐰','small',9,12,8,['네덜란드 드워프','롭이어','라이언헤드'],'COMMON_PET'),
D('페럿','Ferret','Mustela putorius furo','🦡','small',7,10,8,['실버','샌드'],'COMMON_PET',{note:'지역별 규제 가능 (확인 필요)'}),
D('친칠라','Chinchilla','Chinchilla lanigera','🐭','small',12,20,8,['스탠다드','베이지'],'COMMON_PET'),
D('고슴도치','African pygmy hedgehog','Atelerix albiventris','🦔','small',5,8,6,['아프리카 피그미'],'COMMON_PET',{ban:['AU'],note:'호주 등 일부 국가 금지 (초안)'}),
D('앵무새','Parrot','Psittaciformes (다종)','🦜','bird',25,60,24,['코뉴어','왕관앵무','모란앵무'],'COMMON_PET',{cites:'품종별 상이 (확인 필요)'}),
D('카나리아','Canary','Serinus canaria domestica','🐤','bird',10,15,12,['옐로','레드팩터'],'COMMON_PET'),
D('문조','Java sparrow','Padda oryzivora','🐦','bird',8,12,12,['일반','백문조'],'RESTRICTED_PET',{cites:'부속서 II 가능성 (확인 필요)',note:'야생 개체는 멸종위기, 검증 전 제외'}),
D('금붕어','Goldfish','Carassius auratus','🐟','fish',10,25,12,['오란다','리유킨'],'COMMON_PET'),
D('베타','Siamese fighting fish','Betta splendens','🐠','fish',3,5,6,['하프문','크라운테일'],'COMMON_PET'),
D('열대어','Tropical fish','Poecilia reticulata 등','🐠','fish',4,8,6,['구피','네온테트라','엔젤피시'],'COMMON_PET'),
D('레오파드게코','Leopard gecko','Eublepharis macularius','🦎','rep',15,20,12,['하이옐로','탱저린'],'COMMON_PET'),
D('비어디드래곤','Bearded dragon','Pogona vitticeps','🦎','rep',10,15,12,['센트럴','레더백'],'COMMON_PET'),
D('육지거북','Tortoise','Testudo spp.','🐢','rep',50,80,96,['헤르만','러시안'],'RESTRICTED_PET',{cites:'Testudo속 부속서 II 가능성 (확인 필요)',permit:'국가별 증빙 필요 가능'}),
D('수생거북','Aquatic turtle','Pseudemys concinna / Sternotherus odoratus','🐢','rep',25,40,36,['리버쿠터','머스크터틀'],'COMMON_PET',{note:'붉은귀거북 등은 국가별 규제 → 미포함'}),
D('저빌','Gerbil','Meriones unguiculatus','🐭','small',4,5,3,['몽골리안 저빌'],'COMMON_PET',{ban:['AU','NZ'],note:'일부 국가 금지 (초안)'}),
D('팬시랫','Fancy rat','Rattus norvegicus domestica','🐀','small',2.5,4,4,['하이쿠라','더블허드'],'COMMON_PET'),
D('생쥐','Fancy mouse','Mus musculus domesticus','🐁','small',2,3,2,['팬시마우스'],'COMMON_PET'),
D('사랑앵무','Budgerigar','Melopsittacus undulatus','🦜','bird',8,15,8,['잉꼬','하르퀸'],'COMMON_PET'),
D('십자매','Society finch','Lonchura striata domestica','🐦','bird',7,10,8,['일반'],'COMMON_PET'),
D('금화조','Zebra finch','Taeniopygia guttata','🐦','bird',6,10,6,['노멀','화이트'],'COMMON_PET'),
D('러브버드','Lovebird','Agapornis spp.','🦜','bird',12,20,12,['복숭아얼굴','마스크'],'COMMON_PET',{cites:'종별 상이 (확인 필요)'}),
D('코이','Koi','Cyprinus rubrofuscus','🐟','fish',30,40,36,['고쇼쿠','쇼와'],'COMMON_PET'),
D('코리도라스','Corydoras','Corydoras spp.','🐠','fish',5,10,8,['판다','아이네우스'],'COMMON_PET'),
D('크레스티드게코','Crested gecko','Correlophus ciliatus','🦎','rep',15,20,18,['달마시안','릴리화이트'],'COMMON_PET'),
D('장수풍뎅이','Rhinoceros beetle','Trypoxylus dichotomus','🪲','bug',1,1.5,2,['국산','대형 사육종'],'COMMON_PET',{recog:['KR'],note:'한국 애완곤충 (공식 출처 확인 필요)'}),
D('사슴벌레','Stag beetle','Lucanidae','🪲','bug',3,5,12,['넓적사슴벌레','톱사슴벌레'],'COMMON_PET',{recog:['KR'],note:'한국 애완곤충 (공식 출처 확인 필요)'}),
// 아래는 특수 풀 예시: 법적 검증(src, v) 전에는 어떤 경우에도 랜덤 선정되지 않음
D('슈거글라이더','Sugar glider','Petaurus breviceps','🐿️','small',12,15,12,['클래식 그레이'],'EXOTIC_PET',{allow:['US'],note:'주·국가별 규제 상이, 검증 대기'}),
D('콘스네이크','Corn snake','Pantherophis guttatus','🐍','rep',15,23,24,['노멀','아멜'],'EXOTIC_PET',{allow:[],note:'국가별 규제 상이, 검증 대기'}),
D('캠벨햄스터','Campbell dwarf hamster','Phodopus campbelli','🐹','small',2,3,3,['노멀','오팔'],'COMMON_PET'),
D('로보로브스키햄스터','Roborovski hamster','Phodopus roborovskii','🐹','small',3,4,3,['노멀','허스키'],'COMMON_PET'),
D('차이니즈햄스터','Chinese hamster','Cricetulus griseus','🐹','small',2.5,3.5,3,['노멀'],'COMMON_PET'),
D('윈터화이트햄스터','Winter white hamster','Phodopus sungorus','🐹','small',2,3,3,['노멀','사파이어'],'COMMON_PET'),
D('데구','Degu','Octodon degus','🐭','small',7,10,6,['아구티','블루'],'COMMON_PET'),
D('가시쥐','Spiny mouse','Acomys cahirinus','🐭','small',5,7,4,['노멀'],'COMMON_PET'),
D('작은가시텐렉','Lesser hedgehog tenrec','Echinops telfairi','🦔','small',6,10,8,['노멀'],'COMMON_PET'),
D('짧은꼬리주머니쥐','Gray short-tailed opossum','Monodelphis domestica','🐭','small',3,5,6,['노멀'],'COMMON_PET'),
D('왕관앵무','Cockatiel','Nymphicus hollandicus','🦜','bird',15,25,12,['노멀 그레이','루티노','펄'],'COMMON_PET'),
D('비둘기','Pigeon','Columba livia domestica','🕊️','bird',15,25,6,['공작비둘기','전서구'],'COMMON_PET',{note:'지역별 조례 확인 필요'}),
D('오리','Domestic duck','Anas platyrhynchos domesticus','🦆','bird',8,15,6,['페킨','캐치덕'],'COMMON_PET',{note:'가금류: 방역·조례 확인 필요'}),
D('닭','Chicken','Gallus gallus domesticus','🐔','bird',8,15,6,['실키','밴텀'],'COMMON_PET',{note:'가금류: 방역·조례 확인 필요'}),
D('메추라기','Japanese quail','Coturnix japonica','🐦','bird',3,5,2,['일반','화이트'],'COMMON_PET'),
D('고울디안핀치','Gouldian finch','Chloebia gouldiae','🐦','bird',5,8,8,['레드헤드','블랙헤드'],'COMMON_PET'),
D('목도리비둘기','Ring dove','Streptopelia risoria','🕊️','bird',12,20,6,['화이트','페일'],'COMMON_PET'),
D('거위','Domestic goose','Anser anser domesticus','🪿','bird',15,25,8,['툴루즈','엠덴'],'COMMON_PET',{note:'가금류: 방역·조례 확인 필요'}),
D('보크앵무','Bourke parakeet','Neopsephotus bourkii','🦜','bird',12,15,8,['노멀','핑크'],'COMMON_PET'),
D('다이아몬드도브','Diamond dove','Geopelia cuneata','🕊️','bird',10,15,6,['노멀','실버'],'COMMON_PET'),
D('구피','Guppy','Poecilia reticulata','🐠','fish',2,3,3,['푸들','모자이크'],'COMMON_PET'),
D('네온테트라','Neon tetra','Paracheirodon innesi','🐟','fish',5,8,6,['노멀'],'COMMON_PET'),
D('엔젤피시','Angelfish','Pterophyllum scalare','🐠','fish',10,12,10,['마블','실버'],'COMMON_PET'),
D('디스커스','Discus','Symphysodon spp.','🐠','fish',10,15,12,['레드','터키석'],'COMMON_PET'),
D('플래티','Southern platyfish','Xiphophorus maculatus','🐠','fish',3,4,3,['레드','선셋'],'COMMON_PET'),
D('몰리','Molly','Poecilia sphenops','🐟','fish',3,5,4,['블랙몰리','달마시안'],'COMMON_PET'),
D('제브라다니오','Zebrafish','Danio rerio','🐟','fish',4,5,4,['노멀','레오파드'],'COMMON_PET'),
D('체리바브','Cherry barb','Puntigrus titteya','🐟','fish',5,6,4,['노멀'],'COMMON_PET'),
D('구라미','Gourami','Trichogaster spp.','🐠','fish',5,8,6,['허니','블루'],'COMMON_PET'),
D('클라운로치','Clown loach','Chromobotia macracanthus','🐟','fish',15,20,18,['노멀'],'COMMON_PET'),
D('체리새우','Cherry shrimp','Neocaridina davidi','🦐','fish',1.5,2,3,['레드','옐로'],'COMMON_PET'),
D('흰동가리','Clownfish','Amphiprion ocellaris','🐠','fish',10,20,12,['오셀라리스','퍼큘라'],'COMMON_PET'),
D('플레코','Common pleco','Hypostomus plecostomus','🐟','fish',15,20,18,['노멀'],'COMMON_PET'),
D('라스보라','Harlequin rasbora','Trigonostigma heteromorpha','🐟','fish',5,6,5,['노멀'],'COMMON_PET'),
D('글로우라이트테트라','Glowlight tetra','Hemigrammus erythrozonus','🐟','fish',4,5,4,['노멀'],'COMMON_PET'),
D('아피스토그라마','Apistogramma','Apistogramma cacatuoides','🐠','fish',3,5,5,['카카투오이데스'],'COMMON_PET'),
D('킬리피쉬','Killifish','Nothobranchius spp.','🐠','fish',1,2,2,['기아르디','라코비'],'COMMON_PET'),
D('블루텅스킨크','Blue-tongued skink','Tiliqua scincoides','🦎','rep',15,25,24,['노던','인도네시안'],'COMMON_PET'),
D('가고일게코','Gargoyle gecko','Rhacodactylus auriculatus','🦎','rep',15,20,18,['레드','스트라이프'],'COMMON_PET'),
D('팻테일게코','African fat-tailed gecko','Hemitheconyx caudicinctus','🦎','rep',15,20,18,['노멀','알비노'],'COMMON_PET'),
D('중국물도마뱀','Chinese water dragon','Physignathus cocincinus','🦎','rep',10,15,24,['그린'],'COMMON_PET'),
D('그린아놀리스','Green anole','Anolis carolinensis','🦎','rep',5,8,8,['그린'],'COMMON_PET'),
D('화이트트리프로그','White\'s tree frog','Ranoidea caerulea','🐸','amph',15,20,24,['노멀','블루'],'COMMON_PET'),
D('팩맨개구리','Ornate horned frog','Ceratophrys ornata','🐸','amph',10,15,18,['아르헨티나','알비노'],'COMMON_PET'),
D('무당개구리','Oriental fire-bellied toad','Bombina orientalis','🐸','amph',15,20,18,['노멀'],'COMMON_PET',{note:'야생 채집 금지, 사육 개체만 (확인 필요)'}),
D('중국불도마뱀','Chinese fire-belly newt','Cynops orientalis','🦎','amph',15,20,18,['노멀'],'COMMON_PET'),
D('난쟁이개구리','African dwarf frog','Hymenochirus boettgeri','🐸','amph',5,10,8,['노멀'],'COMMON_PET'),
D('사마귀','Praying mantis','Mantodea','🦗','bug',1,1.5,3,['왕사마귀','난초사마귀'],'COMMON_PET'),
D('대벌레','Stick insect','Phasmatodea','🐛','bug',1.5,2,4,['인도대벌레','가시대벌레'],'COMMON_PET'),
D('소라게','Hermit crab','Coenobita spp.','🦀','bug',10,30,18,['캐리비안','에콰도르'],'COMMON_PET',{note:'야생 채집 금지 지역 있음 (확인 필요)'}),
D('노래기','Giant millipede','Archispirostreptus gigas','🐛','bug',7,10,24,['자이언트'],'COMMON_PET'),
D('쥐며느리','Isopod','Porcellio spp.','🐛','bug',2,3,6,['던지니스','오렌지'],'COMMON_PET'),
D('점핑스파이더','Jumping spider','Phidippus regius','🕷️','bug',2,3,8,['레기우스'],'COMMON_PET'),
D('마다가스카르바퀴','Madagascar hissing cockroach','Gromphadorhina portentosa','🪳','bug',5,6,12,['노멀'],'COMMON_PET'),
// 히든 이벤트 펫: 일반 랜덤 풀에는 포함되지 않고 극히 낮은 확률로만 등장
D('유니콘','Unicorn','Equus monoceros (전설 속 생물)','🦄','myth',200,300,60,['순백','무지개','은빛'],'HIDDEN',{note:'히든 이벤트 전용 · 실존하지 않는 상상 속 생물'}),
D('페가수스','Pegasus','Equus pegasus (전설 속 생물)','🪽','myth',200,300,60,['순백','검은 날개','황금 날개'],'HIDDEN',{note:'히든 이벤트 전용 · 실존하지 않는 상상 속 생물'}),
D('총','Firearm (hidden event)','무생물 · 허가 소유자 한정','🔫','gun',40,80,6,['허가받은 소유물'],'HIDDEN',{permit:'각국 총포 소지 면허·허가 필수 (허가 없는 소지는 불법)',cites:'해당 없음 (무기 거래 규제 대상)',note:'게임 속 히든 이벤트 전용 · 안전 보관·정비·허가 준수 시뮬레이션'})];
// 이모지가 기기에서 안 보이면(두부 글자) 비슷한 이모지로 자동 대체
const EG={dog:'🐶',cat:'🐱',small:'🐹',bird:'🐦',fish:'🐟',rep:'🦎',bug:'🐛',amph:'🐸',myth:'🦄',gun:'🔫'};
const ALT={'🪲':['🐞','🐛'],'🦡':['🦦','🐹'],'🐿️':['🐭','🐹'],'🦔':['🐭'],'🐀':['🐭'],'🦎':['🐍','🐊'],'🐢':['🐊'],'🦜':['🐦'],'🐁':['🐭'],'🐠':['🐟'],'🐤':['🐦']};
Object.assign(ALT,{'🪿':['🦆','🐦'],'🪳':['🐛'],'🕷️':['🐛'],'🕊️':['🐦'],'🦆':['🐦'],'🦐':['🐟'],'🦀':['🐛'],'🦗':['🐛'],'🐸':['🦎'],'🐔':['🐦'],'🪽':['🐎','🐴']});
const hasE=e=>{try{const c=document.createElement('canvas');c.width=c.height=32;const x=c.getContext('2d');x.font='24px sans-serif';x.textBaseline='top';x.fillText(e,2,2);const p=x.getImageData(0,0,32,32).data;for(let k=0;k<p.length;k+=4)if(p[k+3]>40&&(Math.abs(p[k]-p[k+1])>25||Math.abs(p[k+1]-p[k+2])>25))return true;return false}catch{return true}};
DB.forEach(d=>{d.emoji=[d.emoji,...(ALT[d.emoji]||[]),EG[d.grp],'🐾'].find(hasE)||'🐾'});
const SP=DB.map(d=>[d.ko,d.emoji,d.grp,d.avg,d.breeds]);
function pool(){return DB.map((d,i)=>i).filter(i=>{const l=DB[i].legal;return l.cls==='COMMON_PET'||(l.cls!=='NOT_ELIGIBLE'&&l.verified&&l.src)})}
const NM=['콩이','보리','모모','두부','초코','별이','구름','밤이','쿠키','하루','솜이','나나'];

// ===== 다국어 (한국어 · English · 日本語 · 中文 · Français) =====
// 언어는 페이지를 불러올 때 한 번 정해지고(바꾸면 새로고침), 번역 사전(DICT)은 '한국어 원문 → [en, ja, zh, fr]' 형태.
const LGS=['ko','en','ja','zh','fr'],LNAME={ko:'한국어',en:'English',ja:'日本語',zh:'中文',fr:'Français'};
let LG=(()=>{const s=ld('pls_lang',null);if(LGS.includes(s))return s;const n=((navigator.language||'ko')+'').slice(0,2).toLowerCase();return LGS.includes(n)?n:'en'})();
const LI=LGS.indexOf(LG),HG=/[가-힣]/,MISS=new Set();
const DICT=window.PLS_DICT||{};
const T=s=>{if(!LI||typeof s!=='string')return s;const v=DICT[s];if(v&&v[LI-1])return v[LI-1];if(HG.test(s))MISS.add(s);return s};
const F=(s,...a)=>T(s).replace(/\{(\d+)\}/g,(m,i)=>a[+i]??'');
document.documentElement.lang=LG;
// 사건·선택지·문구 데이터를 통째로 번역 (식별용 필드는 건드리지 않는다)
const SKIPK=new Set(['ko','id','cat','g','xg','st','tr','or','wk','se','af','iq','k','man','en','sci','emoji','grp','tax','legal','src']);
function walkT(o,fn,seen){seen=seen||new Set();if(!o||typeof o!=='object'||seen.has(o))return;seen.add(o);
 for(const k of Array.isArray(o)?[...o.keys()]:Object.keys(o)){const v=o[k];if(SKIPK.has(k)&&!(k==='cat'&&v&&typeof v==='object'))continue;if(typeof v==='string'){if(HG.test(v))o[k]=fn(v)}else walkT(v,fn,seen)}}
const NMS={ko:['콩이','보리','모모','두부','초코','별이','구름','밤이','쿠키','하루','솜이','나나'],en:['Coco','Buddy','Luna','Milo','Daisy','Charlie','Bella','Max','Ruby','Oliver','Peanut','Teddy'],ja:['ココ','ハル','モモ','ソラ','マロン','ムギ','ユキ','ラム','ココア','ポチ','ミルク','タマ'],zh:['豆豆','球球','妞妞','糖糖','点点','小白','乐乐','毛毛','旺财','年糕','布丁','咪咪'],fr:['Biscuit','Nougat','Pomme','Plume','Câline','Noisette','Réglisse','Caramel','Pépita','Loulou','Mimosa','Praline']};
function i18nTargets(){return [ST,G,GI,TX,MS,MSG,EV,CP,EXTRA_Q,TR,OR,LV,SN,LB,WK,AB]}
function i18nInit(){NM.length=0;NM.push(...NMS[LG]);
 if(LI){const f=s=>T(s);i18nTargets().forEach(t=>walkT(t,f));
  DB.forEach((d,i)=>{['food','env','play','hc','end'].forEach(k=>d[k]=T(d[k]));d.breeds.forEach((b,j)=>d.breeds[j]=T(b));d.nm=(LG==='en'&&d.en)?d.en:T(d.ko);SP[i][0]=d.nm});
  document.title=T('한 생애의 반려 – 반려동물 생애 시뮬레이터')}
 else DB.forEach(d=>{d.nm=d.ko})}
// 번역 작업용: 데이터 속 한글 문자열을 전부 모은다
function i18nCollect(){const set=new Set(),f=s=>{set.add(s);return s};i18nTargets().forEach(t=>walkT(t,f));SEAS.forEach(f);walkT(HELP,f);
 DB.forEach(d=>{f(d.ko);['food','env','play','hc','end'].forEach(k=>f(d[k]));d.breeds.forEach(f)});return [...set]}
const setLang=l=>{sv('pls_lang',l);try{saveG()}catch{}location.reload()};

// ===== 선택지 · 이벤트 시스템 =====
// Q(라벨, 좋은결과효과, 문구, 나쁜결과효과, 문구, 좋은결과확률, 허용동물군)
// 확률 p<1 이면 같은 선택지도 결과가 갈린다. 선택지 순서는 매번 섞이므로 '1번이 정답'이 아니다.
const Q=(l,e,m,e2,m2,p=1,g)=>({l,g,o:[{p,e,m},{p:1-p,e:e2||{},m:m2||''}]});
const MAM=['dog','cat','small'];
// 사건 종류별 공용 선택지 풀 (사건마다 여기서 무작위로 섞어 5~6개를 만든다)
const CP={
health:[
Q('동물병원에 데려간다',{hea:18,str:5,bond:3},'정확한 진단을 받고 치료해 한결 나아졌다.',{hea:3,str:9},'검사가 힘들었고 큰 이상은 없다고 한다.',.75),
Q('집에서 안정시키며 지켜본다',{hea:7,str:-3},'푹 쉬었더니 상태가 좋아졌다.',{hea:-11,str:5},'지켜보는 사이 상태가 나빠졌다.',.5),
Q('인터넷에서 본 민간요법을 따라 한다',{hea:9,bond:2},'운 좋게 효과가 있었다.',{hea:-17,str:10},'오히려 상태가 크게 나빠졌다.',.25),
Q('수의사에게 먼저 전화로 상담한다',{hea:10,str:-2},'조언대로 하니 안정되었다.',{hea:-3},'일반적인 답변뿐이라 시간만 흘렀다.',.65),
Q('영양제를 먹여 본다',{hea:7,nut:6},'기력이 조금 돌아왔다.',{nut:-6,str:6,hea:-2},'먹기 싫어해 스트레스만 받았다.',.55),
Q('조용한 곳에 따로 격리한다',{str:-5,hea:5,env:3},'편안히 쉬며 회복했다.',{str:10,hap:-6,bond:-3},'혼자 있게 되어 불안해한다.',.5),
Q('사람 약을 임의로 먹인다',{hea:5},'다행히 탈이 나지 않았다.',{hea:-28,str:12},'위험한 부작용이 생겼다!',.1),
Q('별일 아니라며 넘어간다',{hea:3},'저절로 나았다.',{hea:-12,str:4},'방치한 사이 악화됐다.',.35),
Q('응급 병원으로 바로 달려간다',{hea:20,str:8,bond:4},'빠른 대응이 큰 도움이 되었다.',{hea:6,str:12},'과한 대응이었지만 안심은 되었다.',.7)],
behav:[
Q('칭찬과 간식으로 보상한다',{bond:7,hap:6,nut:3},'좋은 행동으로 이어졌다.',{nut:6,hap:2},'간식만 챙기고 모른 척했다.',.65),
Q('모른 척하며 지켜본다',{str:-2,hap:2},'스스로 마음을 가라앉혔다.',{str:7,hap:-3},'관심을 못 받아 더 심해졌다.',.45),
Q('단호하게 안 된다고 말한다',{str:2,bond:2},'뜻을 알아듣는 눈치다.',{str:9,bond:-4},'겁을 먹고 위축됐다.',.4),
Q('큰 소리로 혼낸다',{str:3},'순간 멈췄다.',{str:14,bond:-9,hap:-8},'겁먹고 숨어버렸다.',.15),
Q('좋아하는 놀이로 에너지를 풀어준다',{act:18,hap:8,bond:3,nut:-4},'신나게 놀고 만족했다.',{act:10,hap:2,str:5},'흥분이 가라앉지 않았다.',.7),
Q('환경을 바꿔 관심을 돌려준다',{env:8,hap:4,str:-3},'금세 다른 것에 흥미를 보였다.',{env:-5,str:6},'변화가 오히려 낯설었다.',.55),
Q('전문가에게 조언을 구한다',{bond:4,str:-5,hap:3},'원인을 알고 나니 한결 쉬워졌다.',{str:2},'뻔한 이야기만 들었다.',.7),
Q('일단 두고 며칠 관찰한다',{str:-1,hap:1},'저절로 잦아들었다.',{str:6,env:-4},'점점 심해져 버렸다.',.4)],
env:[
Q('환경을 꼼꼼히 점검해 정비한다',{env:22,str:-4},'한결 쾌적해졌다.',{env:8,str:4},'손이 많이 가고 아이도 예민해졌다.',.75),
Q('새 용품을 사서 바꿔 준다',{env:15,hap:6},'새 물건을 마음에 들어 한다.',{env:-4,str:8},'낯선 물건을 경계한다.',.55),
Q('임시로 대충 정리한다',{env:6},'일단은 괜찮아 보인다.',{env:-8,hea:-3},'땜질로는 부족했다.',.4),
Q('주변 사람에게 조언을 구한다',{env:12,str:-2},'경험담이 큰 도움이 됐다.',{env:-3,str:4},'엇갈리는 조언에 혼란스러웠다.',.55),
Q('온라인 후기를 믿고 그대로 따라 한다',{env:18,hap:3},'후기가 딱 맞았다.',{env:-12,str:9,hea:-3},'우리 아이에겐 맞지 않았다.',.4),
Q('적응할 때까지 시간을 준다',{str:-3,hap:2},'스스로 적응해 냈다.',{env:-9,str:7},'적응하지 못하고 지쳐 간다.',.45),
Q('익숙한 물건을 곁에 두어 안심시킨다',{str:-6,hap:4,bond:2},'익숙한 냄새에 마음이 놓였다.',{env:-2,str:2},'크게 달라지지 않았다.',.7),
Q('전문 업체에 점검을 맡긴다',{env:25,str:-3},'문제를 정확히 고쳤다.',{env:10,hap:-2},'비용에 비해 변화가 적었다.',.7)],
social:[
Q('천천히 거리를 좁히며 소개한다',{hap:6,str:-2,bond:2},'조금씩 마음을 열었다.',{str:10,hap:-3},'아직은 무서워한다.',.65),
Q('조용한 곳으로 피신시킨다',{str:-6},'안전하게 쉬었다.',{str:4,hap:-3,bond:-2},'혼자 두어 서운해한다.',.7),
Q('바로 마주하게 한다',{hap:8,bond:2},'의외로 금세 친해졌다.',{str:16,hap:-6},'너무 놀라 얼어붙었다.',.35),
Q('곁에서 안심시켜 준다',{bond:7,str:-5},'당신 곁에서 안정을 되찾았다.',{bond:1,str:-1},'크게 도움이 되지는 않았다.',.75),
Q('상황이 끝날 때까지 지켜본다',{str:-2,hap:2},'별일 없이 지나갔다.',{str:8,hap:-4},'불안한 시간이 길어졌다.',.5),
Q('외면하고 하던 일을 한다',{str:2},'무사히 지나갔다.',{str:11,bond:-5,hap:-4},'버려진 기분인지 위축됐다.',.2),
Q('안아서 달래 준다',{bond:6,str:-6},'품에서 안정을 찾았다.',{str:6,hap:-3},'안기는 걸 싫어해 버둥댔다.',.6,['dog','cat','small','bird']),
Q('간식으로 좋은 기억을 만들어 준다',{hap:7,nut:4,bond:3},'좋은 기억으로 남은 듯하다.',{nut:5,str:3},'간식에만 정신이 팔렸다.',.7)],
life:[
Q('지인에게 돌봄을 부탁한다',{env:8,nut:8,str:3},'지인이 잘 돌봐 주었다.',{str:10,hap:-6,nut:-8},'낯선 사람이라 불안해했다.',.6),
Q('전문 돌봄(호텔·시터)에 맡긴다',{nut:10,env:6,hap:2,str:4},'전문가가 꼼꼼히 챙겨 주었다.',{str:12,hap:-5,hea:-3},'낯선 환경에서 스트레스를 받았다.',.65),
Q('자동 급식기·온도 조절기를 설치해 둔다',{nut:12,env:10},'기계가 알아서 잘 챙겼다.',{nut:-8,env:-6,str:4},'기계가 고장 나서 곤란했다.',.6),
Q('일정을 미루고 곁에 있어 준다',{bond:9,hap:6,str:-5},'함께한 시간이 더없이 따뜻했다.',{bond:4,str:-2},'아이는 평소와 같은 하루였다.',.8),
Q('평소처럼 두고 다녀온다',{str:2},'큰 문제 없이 지나갔다.',{nut:-12,env:-10,hap:-6,str:8},'돌아와 보니 엉망이 되어 있었다.',.5),
Q('영상통화·CCTV로 지켜보며 말을 걸어 준다',{bond:5,str:-3,hap:3},'목소리를 듣고 안심했다.',{str:6,hap:-2},'목소리만 들리자 오히려 불안해했다.',.55),
Q('가족에게 번갈아 돌봐 달라고 한다',{nut:8,env:6,bond:3},'온 가족이 챙겨 주었다.',{nut:-10,str:6},'서로 미루다 한 끼를 놓쳤다.',.5),
Q('아이를 데리고 함께 다녀온다',{bond:7,hap:5,str:8},'새로운 경험이었다.',{str:15,hea:-4},'이동에 지쳐 앓아누웠다.',.5)],
fun:[
Q('좋아하는 장난감을 꺼내 함께 논다',{hap:10,bond:5,act:12,nut:-3},'신나게 놀았다.',{hap:3,act:6},'금세 흥미를 잃었다.',.75),
Q('새로운 놀이를 시도해 본다',{hap:12,bond:5,act:10},'새 놀이를 엄청 좋아한다!',{hap:-3,str:8},'낯선 놀이를 무서워했다.',.5),
Q('조용히 곁에 앉아 있어 준다',{bond:8,str:-6,hap:4},'평온한 시간이 흘렀다.',{bond:2},'큰 변화는 없었다.',.8),
Q('특별 간식을 준비한다',{hap:10,nut:7,bond:3},'눈빛이 반짝였다.',{nut:-3,hea:-4,hap:2},'너무 많이 먹어 배탈이 났다.',.65),
Q('사진과 영상을 남긴다',{bond:3,hap:2},'소중한 추억이 늘었다.',{str:6,hap:-4},'카메라 소리에 스트레스를 받았다.',.6),
Q('방해하지 않고 혼자 지내게 둔다',{hap:5,act:6},'혼자서도 잘 지냈다.',{hap:-4,bond:-2,str:3},'심심해하며 시무룩해졌다.',.55),
Q('색다른 장소로 데려가 본다',{hap:9,act:8,str:5},'색다른 풍경에 즐거워했다.',{str:14,hap:-4},'낯선 곳에서 겁먹었다.',.5),
Q('조심스레 쓰다듬으며 교감한다',{bond:9,hap:6,str:-5},'기분 좋게 눈을 감았다.',{bond:-1,str:4},'만지는 걸 싫어하는 날이었다.',.65,['dog','cat','small','bird','rep'])],
food:[
Q('기존 먹이로 돌아간다',{nut:14,hap:2},'안심하고 잘 먹었다.',{nut:6},'새 먹이에 대한 흥미만 사라졌다.',.8),
Q('조금씩 섞어 천천히 적응시킨다',{nut:8,hea:3,bond:2},'점차 새 먹이를 받아들였다.',{nut:-4,str:4},'골라내고 남겼다.',.6),
Q('배고플 때까지 기다린다',{nut:10,hea:1},'결국 잘 먹었다.',{nut:-12,str:9,hea:-3},'버티다 지쳐 버렸다.',.3),
Q('간식을 섞어 입맛을 돋운다',{nut:12,hap:5},'맛있게 먹었다.',{nut:3,hea:-5,hap:1},'간식만 먹으려 하고 본식은 거부한다.',.5),
Q('다른 제품이나 종류를 사다 준다',{nut:12,hap:3},'입에 딱 맞았다.',{nut:-3,hea:-4},'소화가 안 되는지 탈이 났다.',.55),
Q('수의사·전문가와 식단을 상의한다',{nut:10,hea:6},'맞춤 식단이 도움이 되었다.',{nut:4},'특별한 문제는 없다고 한다.',.75),
Q('억지로 먹인다',{nut:6},'일단 먹긴 했다.',{nut:-4,str:14,bond:-7,hap:-7},'크게 놀라 먹이를 더 싫어하게 되었다.',.15),
Q('먹는 양과 횟수를 줄여 본다',{nut:2,hea:4},'몸이 가벼워졌다.',{nut:-12,hap:-5},'배고파서 힘이 없다.',.45)]};
CP.gun=[
Q('전문 총포사에서 정비를 받는다',{hea:16,nut:8,env:2},'전문가의 정비로 상태가 좋아졌다.',{hea:4},'큰 이상은 없다는 말만 들었다.',.75),
Q('보관 환경(습도·잠금)을 점검한다',{env:20,str:-6},'안전하고 건조하게 보관되고 있다.',{env:8},'크게 달라진 건 없다.',.75),
Q('관련 서류와 허가 기한을 확인한다',{bond:8,str:-4},'모든 서류가 문제없이 유효하다.',{bond:3},'갱신 일정을 놓칠 뻔했다.',.7),
Q('귀찮아서 다음으로 미룬다',{str:2},'일단 별일 없이 지나갔다.',{hea:-12,str:14,env:-10},'그 사이 부식이 진행되었다.',.3),
Q('인터넷에서 본 방법으로 임의로 손본다',{hea:6},'운 좋게 문제는 없었다.',{hea:-20,str:12},'잘못 손봐 상태가 크게 나빠졌다.',.15),
Q('안전 교육을 다시 받는다',{bond:10,str:-5,hap:4},'책임감이 한층 높아졌다.',{bond:4},'아는 내용이라 새로울 건 없었다.',.8),
Q('안전 잠금장치를 더 튼튼한 것으로 교체한다',{env:15,bond:5},'더 안전해졌다.',{env:6},'기존 장치도 충분했다.',.8),
Q('보관 위치를 바꿔 본다',{env:10},'더 나은 위치를 찾았다.',{env:-8,str:6},'오히려 습기가 많은 곳이었다.',.45)];
const CAT_ICON={health:'🩺',behav:'🐾',env:'🏠',social:'👥',life:'📅',fun:'🎈',food:'🍽️',gun:'🔧'};

const ev=(id,cat,f,t,c)=>Object.assign({id,cat,t,c},f);
const ill=s=>(s.env<45||s.nut<45||s.str>65)?3.5:.7;   // 관리가 나쁠수록 질병 사건 확률 증가
const EV=[
// ── 공통 · 일상/환경/건강 ──
ev('guest','social',{},'낯선 손님이 집에 찾아왔다. 아이가 현관 쪽을 빤히 바라본다.',[Q('먼저 가까이 오게 두고 반응을 본다',{hap:5,str:7,bond:-1},'호기심 반, 긴장 반이다.',{hap:-3,str:15},'너무 놀라 숨어버렸다.',.55),Q('조용한 방에서 쉬게 한다',{str:-4,hap:1},'편안하게 쉬었다.',{hap:-3,bond:-2},'혼자 있게 되어 서운해한다.',.7)]),
ev('picky','food',{},'새로 산 먹이를 줬더니 코를 돌리고 먹지 않는다.',[Q('같은 브랜드의 다른 맛을 사 온다',{nut:12,hap:3},'새 맛은 마음에 든 모양이다.',{nut:-2},'그것도 시큰둥하다.',.5)]),
ev('heat','env',{},'계절이 바뀌며 날씨가 갑자기 변했다. 실내 온도가 들쭉날쭉하다.',[Q('온도와 습도를 세심하게 맞춰 준다',{env:20,str:-3},'쾌적하게 지냈다.',{env:8,str:3},'맞추느라 한참 걸렸다.',.8)]),
ev('move','social',{},'갑자기 이사를 하게 되었다. 낯선 집 냄새가 가득하다.',[Q('익숙한 물건부터 먼저 놓아 준다',{env:-3,str:2,bond:3},'금방 안정을 찾았다.',{env:-8,str:9},'그래도 한동안 구석에서 나오지 않는다.',.65),Q('새집에 맞춰 전부 새로 꾸민다',{env:12,hap:3,str:8},'새 공간이 마음에 든 모양이다.',{env:-5,str:14},'낯선 모든 것에 겁을 먹었다.',.4)]),
ev('ill','health',{w:ill},'평소와 달리 기운이 없고 식욕이 줄었다.',[Q('원인을 찾기 위해 검사를 받는다',{hea:16,str:6,bond:3},'초기에 발견해 치료했다.',{hea:2,str:10},'뚜렷한 원인은 못 찾았지만 안심은 했다.',.7)]),
ev('injury','health',{},'어딘가에 부딪혔는지 움직임이 어색하다.',[Q('상처를 살피고 소독해 준다',{hea:9,bond:3,str:3},'큰 상처는 아니었다.',{hea:-3,str:8},'건드리자 아파하며 피한다.',.6)]),
ev('bonding','fun',{},'조용한 오후, 아이가 곁에 다가와 가만히 쉬고 있다.',[Q('하던 일을 멈추고 곁에 있어 준다',{bond:10,hap:6,str:-5},'평온한 시간이었다.',{bond:3},'아이는 이미 잠들어 있었다.',.85),Q('바쁘다며 하던 일을 계속한다',{bond:-2,hap:-2},'혼자 조용히 쉬었다.',{bond:-4,hap:-4,str:3},'서운한 듯 멀어졌다.',.6)]),
ev('trip','life',{},'갑작스러운 출장이 잡혀 이틀간 집을 비워야 한다.',[
Q('평소처럼 먹이와 환경을 점검해 두고 다녀온다',{env:6,str:3},'준비해 둔 덕에 무탈했다.',{hea:-5,str:8,env:-6},'빈 사이 작은 문제가 생겼다.',.6),
Q('가족에게 하루 한 번 들여다봐 달라고 부탁한다',{env:6,nut:6,str:-2},'가족이 꼼꼼히 챙겨 주었다.',{nut:-6,str:4},'가족이 깜빡해서 한 끼를 놓쳤다.',.6),
Q('일정을 미루고 곁에 있어 준다',{bond:7,hap:4,str:-3},'함께 있어 마음이 놓였다.',{bond:2},'일정이 꼬여 마음이 분주했다.',.8),
Q('영상통화·CCTV로 지켜보며 말을 걸어 준다',{bond:4,str:-3},'목소리에 귀를 쫑긋했다.',{str:5,hap:-3},'목소리만 들리고 곁에 없어 더 불안해했다.',.5,['dog','cat','small','bird']),
Q('전문 돌봄(호텔·시터)에 맡긴다',{hap:3,env:4,nut:4},'전문가의 보살핌을 잘 받았다.',{str:12,hea:-3,hap:-4},'낯선 곳에서 잔뜩 긴장했다.',.55,['dog','cat','small','bird']),
Q('자동 급이기와 온도·조명 타이머를 설치해 두고 다녀온다',{nut:8,env:9,str:-2},'장치가 알아서 일정하게 관리해 주었다.',{nut:-5,env:-8,hea:-3},'장치가 오작동해 걱정되었다.',.6,['fish','rep','amph','bug']),
Q('아는 사람에게 사육 환경 관리를 부탁한다',{env:7,nut:6},'지인이 요령껏 잘 돌봐 주었다.',{env:-6,nut:-4,str:5},'지인이 요령을 몰라 환경이 흐트러졌다.',.5,['fish','rep','amph','bug'])]),
ev('noise','social',{},'윗집 공사 소리와 갑작스러운 큰 소음이 이어진다.',[Q('방음 매트나 두꺼운 천으로 소음을 줄여 준다',{str:-4,env:5},'소음이 줄어 한결 편안해졌다.',{str:5},'오히려 낯선 물건에 놀랐다.',.6)]),
ev('newpet','social',{},'이웃이 새로 데려온 동물이 집에 놀러 왔다.',[Q('서로 거리를 두고 냄새만 맡게 한다',{hap:5,str:-1},'서로 호기심을 보인다.',{str:8,hap:-3},'긴장해서 털(깃털)을 세운다.',.55)]),
ev('gift','fun',{},'친구가 신기한 장난감을 선물로 주었다.',[Q('안전한지 먼저 확인하고 준다',{hap:8,act:8,bond:3},'안전하고 마음에 쏙 든다!',{hap:1},'생각보다 시큰둥하다.',.65),Q('포장을 뜯자마자 그대로 준다',{hap:10,act:10},'신나게 가지고 논다.',{hea:-8,str:6},'작은 부품을 삼킬 뻔했다!',.6)]),
ev('sns','life',{},'귀여운 순간을 SNS에 올렸더니 반응이 폭발적이다. 사람들이 사진을 더 올려 달라고 한다.',[Q('아이가 편안해 보일 때만 가끔 찍는다',{hap:3,bond:3},'좋은 추억도 남기고 아이도 편안하다.',{hap:1},'아쉬운 반응이었다.',.8)]),
ev('money','life',{},'병원비와 사료값이 생각보다 많이 나왔다. 가계가 빠듯하다.',[Q('다른 지출을 줄이고 먹이 품질을 유지한다',{nut:8,hea:3},'아이는 변함없이 잘 지낸다.',{nut:3},'허리띠를 졸라맸지만 티는 나지 않았다.',.8),Q('저렴한 제품으로 바꾼다',{nut:2},'다행히 잘 먹는다.',{nut:-8,hea:-6,hap:-3},'영양 균형이 맞지 않는 것 같다.',.35)]),
ev('diet','food',{w:s=>s.nut>75?2.5:.6},'요즘 부쩍 살이 오른 것 같다. 몸이 둔해 보인다.',[Q('급여량을 조절하고 활동을 늘린다',{hea:6,act:12,nut:-6},'가벼워진 몸으로 더 활기차졌다.',{hap:-4,str:4},'먹을 걸 조르며 시위한다.',.6)]),
ev('sleepless','env',{},'밤마다 뒤척이며 잠을 못 이루는 것 같다.',[Q('조명과 소음을 줄여 수면 환경을 만든다',{str:-6,env:8,hap:3},'푹 잘 수 있게 되었다.',{env:2,str:2},'크게 달라지지 않았다.',.7)]),
ev('escape','behav',{g:['dog','cat','small','bird','rep','amph','bug']},'잠깐 문을 열어 둔 사이 아이가 탈출을 시도했다!',[Q('침착하게 간식으로 유인해 데려온다',{bond:4,str:-2},'무사히 돌아왔다.',{str:12,hea:-3},'놀란 채 한참 도망다녔다.',.6),Q('급히 쫓아가 붙잡는다',{bond:1},'다행히 붙잡았다.',{str:16,bond:-5,hea:-5},'놀라서 더 멀리 도망갔다가 겨우 잡았다.',.35)]),
ev('smell','env',{},'집에서 이상한 냄새가 난다. 아이 주변 환경이 의심스럽다.',[Q('원인을 찾아 철저히 청소한다',{env:25,str:-3},'원인을 찾아 해결했다.',{env:12,str:4},'청소는 했지만 냄새는 남았다.',.75)]),
ev('photo','fun',{},'친구가 아이 사진을 찍겠다며 조명과 소품을 잔뜩 가져왔다.',[]),
ev('holiday','life',{se:['겨울','가을']},'긴 연휴가 다가온다. 집을 비울 일정이 생겼다.',[]),
ev('neighbor','social',{g:['dog','bird','cat']},'이웃이 아이 소리가 시끄럽다며 찾아왔다.',[Q('정중히 사과하고 방음 대책을 세운다',{env:8,str:-2,bond:2},'이웃과도 사이가 풀렸다.',{env:2,str:3},'이웃은 여전히 불만이다.',.7),Q('우리 집 사정이라며 그냥 넘긴다',{str:2},'별일 없이 지나갔다.',{str:8,env:-8},'결국 신고가 들어갔다.',.35)]),
ev('vacc','health',{st:'adu'},'정기검진과 예방 관리를 할 시기가 되었다.',[Q('정해진 일정대로 꼼꼼히 받는다',{hea:14,str:5},'아무 이상 없이 건강하다는 결과를 받았다.',{hea:6,str:10},'병원에서 몹시 힘들어했다.',.8),Q('다음에 가자며 미룬다',{str:-2},'무탈하게 지나갔다.',{hea:-8},'작은 문제를 놓쳐 버렸다.',.5)]),
ev('rain','env',{se:['여름']},'장마철이라 연일 비가 오고 습하다.',[Q('제습기와 환기로 습도를 관리한다',{env:18,hea:3},'습기를 잘 잡았다.',{env:6,str:2},'습도가 잘 안 잡힌다.',.75)]),
ev('lonely','life',{w:s=>s.bond<35?2.5:.7},'며칠째 야근이 이어져 아이와 놀아 줄 시간이 거의 없다.',[Q('퇴근 후 10분이라도 꼭 시간을 낸다',{bond:8,hap:5,str:-3},'짧아도 의미 있는 시간이었다.',{bond:3},'피곤해서 제대로 놀아 주지 못했다.',.7)]),
ev('cuteSleep','fun',{},'잠꼬대를 하며 발을 움찔거린다. 뭔가 꿈을 꾸는 것 같다.',[Q('조용히 지켜보며 영상을 남긴다',{bond:4,hap:2},'소중한 순간을 담았다.',{str:4},'카메라 소리에 깨어 버렸다.',.7)]),
ev('broken','behav',{g:['dog','cat','small','bird','rep']},'아끼던 물건이 아이 때문에 망가져 있다.',[Q('화내지 않고 원인을 파악해 예방한다',{bond:3,env:8},'앞으로 같은 일이 줄어들 것 같다.',{bond:1},'원인을 파악하지 못했다.',.7)]),
ev('heatwave','env',{se:['여름']},'폭염이 이어져 실내가 후텁지근하다.',[Q('에어컨과 쿨링 용품으로 온도를 낮춘다',{env:20,hea:3,str:-3},'시원하게 잘 지낸다.',{env:8,str:2},'온도 조절에 애를 먹었다.',.75),Q('선풍기만 틀어 둔다',{env:6},'버텼다.',{env:-12,hea:-8,str:8},'열기에 지쳐 늘어졌다.',.35)]),
ev('coldwave','env',{se:['겨울']},'한파가 닥쳐 집 안 공기도 서늘하다.',[Q('보온 용품과 난방으로 따뜻하게 해 준다',{env:20,hea:3},'포근하게 잘 지낸다.',{env:8,str:3},'건조해져 컨디션이 떨어졌다.',.7),Q('이불 몇 장으로 버티게 한다',{env:5},'다행히 버텨 냈다.',{env:-12,hea:-8,str:6},'추위에 떨며 웅크렸다.',.35)]),
ev('spring','health',{se:['봄']},'봄이 와서 꽃가루와 환절기 감기가 걱정된다.',[]),
ev('autumn','env',{se:['가을']},'가을이 되며 일교차가 커졌다.',[]),
ev('power','env',{},'갑작스러운 정전! 집 안 모든 기기가 멈췄다.',[Q('보조 배터리·핫팩 등 비상 용품을 꺼낸다',{env:6,str:-2},'미리 준비해 둔 덕에 안전했다.',{env:-6,str:6},'준비가 부족해 허둥댔다.',.6)]),
// ── 성장기 ──
ev('curious','behav',{st:'gro'},'어린 시절의 호기심으로 집안 곳곳을 탐험하고 있다.',[Q('안전한 탐험 공간을 마련해 준다',{hap:8,act:10,bond:4},'새로운 것을 많이 배웠다.',{hap:3,act:6,str:3},'기대만큼 흥미를 끌지 못했다.',.7)]),
ev('growth','food',{st:'gro'},'쑥쑥 크느라 먹는 양이 부쩍 늘었다.',[Q('성장기용 영양을 신경 써서 챙겨 준다',{nut:14,hea:6},'튼튼하게 자라고 있다.',{nut:8},'특별한 변화는 없었다.',.8)]),
ev('sociali','social',{st:'gro',g:['dog','cat','small','bird']},'사회화 시기를 맞았다. 다양한 사람·소리·환경에 익숙해질 때다.',[Q('다양한 경험을 조금씩, 즐겁게 시켜 준다',{hap:6,bond:5,str:-3},'세상이 무섭지 않다는 걸 배웠다.',{str:8,hap:-2},'그래도 아직은 낯선 게 많다.',.7),Q('집 안에서만 안전하게 키운다',{str:-3,hap:1},'탈 없이 크고 있다.',{str:6,bond:-2},'겁이 많은 아이로 자랄지도 모른다.',.4)]),
ev('nameRes','fun',{st:'gro'},'이름을 부를 때마다 고개를 갸웃거리며 쳐다본다.',[Q('이름을 부르며 좋은 일을 연결해 준다',{bond:9,hap:5},'이름에 반응하기 시작했다!',{bond:4},'아직은 잘 모르는 듯하다.',.75)]),
// ── 성체기 ──
ev('prime','fun',{st:'adu'},'한창 에너지가 넘치는 시기라 하루 종일 활기차다.',[Q('충분히 놀아 주며 에너지를 발산시킨다',{hap:10,act:15,bond:4,nut:-4},'지칠 때까지 신나게 놀았다.',{hap:4,act:8,str:3},'아직도 에너지가 남아도는 듯하다.',.75)]),
ev('mating','behav',{st:'adu',g:['dog','cat','small','bird','rep']},'본능이 깨어나며 평소와 달리 예민하고 낯선 행동을 보인다.',[Q('원인을 파악하고 환경을 안정시킨다',{str:-6,bond:3},'차분히 지나갔다.',{str:5},'본능을 달래기가 쉽지 않다.',.6),Q('전문가와 중성화·번식 계획을 상담한다',{hea:6,str:-3},'아이에게 맞는 선택지를 찾았다.',{hea:-2,str:6},'결정이 쉽지 않아 마음고생을 했다.',.7)]),
ev('routine','life',{st:'adu'},'어느새 하루 일과가 자리 잡혔다. 정해진 시간마다 아이가 먼저 신호를 보낸다.',[Q('일과를 지키며 안정적으로 돌본다',{str:-4,bond:5,hap:3},'규칙적인 생활이 아이를 편안하게 한다.',{hap:-1},'너무 반복적인 일상이 지루해 보이기도 한다.',.75),Q('가끔 일과에 변화를 준다',{hap:6,act:6,str:4},'새로운 자극이 즐거웠다.',{str:8,hap:-3},'변화에 당황했다.',.55)]),
// ── 노년기 ──
ev('old','health',{st:'sen'},'나이가 들어 움직임이 눈에 띄게 둔해졌다.',[Q('편안한 환경으로 바꿔 준다',{env:15,hap:5,bond:5},'편안히 쉬었다.',{env:8,hap:2},'바뀐 환경이 조금 낯설다.',.8),Q('예전처럼 활동하도록 이끈다',{act:10,hea:3},'의외로 활기를 되찾았다.',{act:15,hea:-9,str:6},'무리했는지 지친 모습이다.',.3)]),
ev('senStairs','health',{st:'sen',g:['dog']},'관절이 약해져 계단과 소파를 오르기 힘들어한다.',[Q('경사로와 푹신한 잠자리를 마련한다',{env:15,hap:5,bond:4},'한결 편안해 보인다.',{env:8},'아직은 익숙하지 않은 듯하다.',.8)]),
ev('senKidney','health',{st:'sen',g:['cat']},'나이가 들어 물을 많이 마시고 식욕이 걱정된다.',[Q('정기검진과 식단 관리를 시작한다',{hea:11,str:3},'수치가 안정되었다.',{hea:4,str:6},'병원 방문이 힘들었지만 필요한 일이었다.',.75)]),
ev('senTeeth','food',{st:'sen',g:['small']},'이빨과 발톱이 길어지고 먹는 양이 줄었다.',[Q('부드러운 먹이로 바꾸고 이빨 상태를 점검한다',{nut:10,hea:5},'다시 잘 먹기 시작했다.',{nut:4},'조금 나아졌다.',.75)]),
ev('senFeather','health',{st:'sen',g:['bird']},'깃털이 푸석해지고 횃대에 오래 앉아 있다.',[Q('낮은 횃대와 영양을 보충해 준다',{env:12,hea:6},'편히 쉬었다.',{env:6},'조금 나아졌다.',.8)]),
ev('senFish','env',{st:'sen',g:['fish']},'움직임이 느려지고 색이 바랬다.',[Q('수온을 안정시키고 수류를 약하게 한다',{env:15,str:-4},'차분히 헤엄친다.',{env:8},'조금 나아졌다.',.8)]),
ev('senRep','food',{st:'sen',g:['rep','amph']},'식욕이 줄고 활동이 둔해졌다.',[Q('소량씩 자주 주고 온도를 유지한다',{nut:10,env:8},'조금씩 먹었다.',{nut:4},'조금 나아졌다.',.75)]),
ev('senBug','env',{st:'sen',g:['bug']},'노화가 시작되어 움직임이 눈에 띄게 느려졌다.',[Q('방해하지 않고 편안한 환경을 유지한다',{env:10,str:-3},'조용히 남은 시간을 보낸다.',{env:4},'조금 불안해 보인다.',.8)]),
ev('senMemory','fun',{st:'sen'},'오래된 앨범을 꺼내 보니 처음 만난 날의 사진이 나왔다.',[Q('아이를 바라보며 함께한 시간을 되새긴다',{bond:10,hap:6,str:-4},'함께한 세월이 따뜻하게 떠올랐다.',{bond:4,hap:2},'아이는 이미 졸고 있었다.',.8),Q('앞으로의 시간을 더 소중히 쓰기로 마음먹는다',{bond:7,hap:4},'남은 하루하루가 선물처럼 느껴졌다.',{bond:3},'마음이 먹먹해졌다.',.9)]),
ev('senMiracle','health',{st:'sen',w:s=>s.hea<40?.9:.12},'기운 없던 아이가 오늘따라 눈빛이 맑고 활기를 되찾았다.',[Q('이 시간을 놓치지 않고 가장 좋아하는 걸 해 준다',{hea:10,hap:12,bond:10},'마지막 선물 같은 하루를 보냈다.',{hea:5,hap:8,bond:6},'짧았지만 소중한 시간이었다.',.9)]),
// ── 지능 ──
ev('learn','behav',{iq:[4,5]},'영리한 아이라 새로운 것을 배우고 싶어 하는 눈빛이다.',[Q('새 재주를 가르쳐 본다',{bond:8,hap:5,act:6,str:3},'금세 익혀서 으쓱해한다!',{bond:3,str:7},'어려운지 금방 흥미를 잃었다.',.7)]),
ev('bored','behav',{iq:[4,5]},'머리가 좋은 만큼 심심해서 장난을 치고 있다.',[Q('퍼즐 장난감이나 먹이 찾기 놀이를 만들어 준다',{hap:8,act:8,bond:3},'집중해서 한참을 놀았다.',{hap:2,act:4},'금방 풀어 버리고 또 심심해한다.',.7)]),
ev('habit','life',{iq:[1,2]},'매일 같은 시간에 당신이 오는 걸 몸으로 기억하는 것 같다.',[Q('같은 시간에 꼬박꼬박 돌봐 준다',{str:-4,hap:3,bond:3},'안정된 리듬으로 지낸다.',{str:1},'리듬은 잡혔지만 변화가 없다.',.8),Q('일부러 시간을 바꿔 본다',{str:4,hap:1},'잠시 어리둥절해했다.',{str:9,nut:-4},'시간이 어긋나 불안해했다.',.4)]),
// ── 성격 ──
ev('thunder','social',{tr:'timid'},'멀리서 천둥이 치자 아이가 잔뜩 얼어붙어 숨어 버렸다.',[Q('곁에서 낮은 목소리로 달래 준다',{bond:8,str:-6},'당신 곁에서 서서히 진정되었다.',{bond:3,str:2},'떨림이 한동안 멈추지 않았다.',.7)]),
ev('steal','food',{tr:'greedy'},'식탁에서 간식을 훔쳐 먹은 흔적이 보인다!',[Q('접근하지 못하게 정리하고 훈련한다',{nut:2,bond:2,str:-2},'얌전해졌다.',{nut:4,hap:-2},'어차피 또 노린다.',.55)]),
ev('breakAll','behav',{tr:'playful'},'장난꾸러기답게 집안 구석구석을 뒤집어 놓았다.',[Q('같이 놀며 에너지를 풀게 한다',{hap:10,act:15,bond:4},'지쳐서 곯아떨어졌다.',{hap:3,act:8},'오히려 더 신이 났다.',.7)]),
ev('ignore','fun',{tr:'aloof'},'불러도 쳐다보지 않고 혼자 창밖만 보고 있다.',[Q('다가가지 않고 조용히 곁을 지킨다',{bond:7,str:-3},'아이가 슬쩍 곁으로 다가와 앉았다.',{bond:2},'여전히 거리를 두고 있다.',.6)]),
ev('separation','life',{tr:'cuddly'},'외출하려는 기척만 보여도 아이가 현관 앞을 막아선다.',[Q('나가기 전에 충분히 안심시킨다',{bond:6,str:-4},'조금 서운해하다 이내 진정했다.',{bond:2,str:5},'떠나는 뒷모습을 오래 바라본다.',.65)]),
ev('sensy','env',{tr:'sensitive'},'작은 환경 변화에도 아이가 쉽게 불안해한다.',[Q('최대한 일정하고 조용한 환경을 유지한다',{str:-6,env:6},'마음이 안정됐다.',{env:2},'큰 변화는 없었다.',.75)]),
ev('explore','behav',{tr:'curious'},'호기심 많은 아이가 낯선 상자 속으로 머리를 쑥 집어넣었다.',[Q('안전한지 확인하고 마음껏 탐험하게 한다',{hap:8,act:8},'세상 신기한 표정이다.',{hap:3,hea:-3},'작은 소동이 있었다.',.7)]),
ev('napCalm','fun',{tr:'calm'},'느긋하게 하루 종일 햇볕을 쬐며 늘어져 있다.',[Q('같이 낮잠 자듯 곁에 있어 준다',{bond:7,hap:6,str:-5},'세상 평온한 하루였다.',{bond:2},'하루가 그냥 지나갔다.',.85)]),
// ── 입양 경로 ──
ev('trauma','behav',{or:'rescue',w:s=>s.bond<45?3:1},'구조될 때의 기억 때문인지 특정 소리나 행동에 몹시 경계한다.',[Q('인내심을 갖고 천천히 신뢰를 쌓는다',{bond:8,str:-6},'조금씩 마음을 열고 있다.',{bond:3,str:2},'아직 갈 길이 멀다.',.65)]),
ev('grateful','fun',{or:'shelter',w:s=>s.bond>35?2:.8},'보호센터에서 온 아이가 오늘따라 당신 곁을 졸졸 따라다닌다.',[Q('따뜻하게 안아 주며 안심시킨다',{bond:10,hap:7,str:-5},'세상에서 가장 믿는 표정이다.',{bond:5,hap:3},'아직 다 믿지는 못하는 듯하다.',.75)]),
ev('breederVisit','social',{or:'breeder'},'브리더에게서 아이의 근황을 묻는 연락이 왔다.',[Q('성장 사진과 건강 기록을 보낸다',{bond:2,hap:2},'따뜻한 안부가 오갔다.',{},'답장이 없었다.',.7)]),
ev('friendTalk','social',{or:'friend'},'분양해 준 친구가 아이를 보러 놀러 왔다.',[Q('아이와 친구가 함께 놀도록 해 준다',{hap:8,bond:3},'오랜만에 만난 듯 즐거워한다.',{str:6},'낯선 사람이라 경계했다.',.7)]),
// ── 선천적 약점(숨김) ──
ev('wkJoint','health',{wk:'joint',w:s=>s.act<50?3:1},'관절이 약한 체질인지 걸음걸이가 조금 이상하다. 선천적으로 약한 부위였다.',[Q('관절 영양제와 정기 관리를 시작한다',{hea:9,act:-3,str:2},'체질에 맞게 관리하기로 했다.',{hea:3,str:5},'효과가 눈에 띄진 않는다.',.7)]),
ev('wkKidney','health',{wk:'kidney',w:s=>s.nut<55?3:1},'소변·음수량에 이상이 보인다. 선천적으로 신장이 약한 체질이다.',[Q('식단과 수분 관리를 수의사와 맞춘다',{hea:10,nut:4},'체질에 맞게 관리하기로 했다.',{hea:3,str:4},'정기 검진이 필요하다고 한다.',.7)]),
ev('wkHeart','health',{wk:'heart',w:s=>s.str>50?3:1},'조금만 흥분해도 숨이 가쁘다. 선천적으로 심장이 약한 체질이다.',[Q('스트레스를 최소화하고 정기 검진을 받는다',{hea:9,str:-4},'체질에 맞게 관리하기로 했다.',{hea:3,str:6},'검사가 힘들었지만 필요한 일이었다.',.7)]),
ev('wkSkin','health',{wk:'skin',w:s=>s.env<60?3:1},'피부와 털(깃털·비늘)이 자꾸 푸석해진다. 선천적으로 피부가 약한 체질이다.',[Q('환경 위생과 피부 관리법을 점검한다',{hea:8,env:8},'체질에 맞게 관리하기로 했다.',{hea:3},'꾸준한 관리가 필요하다고 한다.',.7)]),
ev('wkDigest','health',{wk:'digest',w:s=>s.nut<55?3:1},'배탈이 잦다. 선천적으로 소화기가 예민한 체질이다.',[Q('먹이 종류와 양을 철저히 조절한다',{hea:8,nut:5},'체질에 맞게 관리하기로 했다.',{hea:3,nut:-3},'아직 맞는 식단을 찾는 중이다.',.7)]),
ev('wkEyes','health',{wk:'eyes',w:s=>s.env<60?3:1},'눈이 자꾸 충혈되고 눈곱이 낀다. 선천적으로 눈이 약한 체질이다.',[Q('환경 먼지를 줄이고 안과 검진을 받는다',{hea:8,env:6,str:3},'체질에 맞게 관리하기로 했다.',{hea:3,str:6},'정기적인 관리가 필요하다고 한다.',.7)]),
// ── 강아지 ──
ev('dogmeet','social',{g:['dog']},'산책 중 다른 강아지를 만났다.',[Q('인사하게 한다',{hap:8,bond:2,str:5},'즐겁게 냄새를 맡았다.',{hap:-4,str:14},'으르렁거리며 긴장했다.',.6),Q('거리를 두고 계속 걷는다',{str:-3,bond:2},'차분히 산책을 이어갔다.',{hap:-3},'아쉬운 듯 자꾸 돌아본다.',.7)]),
ev('bark','behav',{g:['dog']},'택배 소리만 나도 한참을 짖어 대서 이웃 눈치가 보인다.',[Q('짖기 전에 앉아 있도록 훈련한다',{bond:4,str:-2},'조금씩 차분해지고 있다.',{str:4},'좀처럼 고쳐지지 않는다.',.55)]),
ev('chew','behav',{g:['dog']},'아끼는 신발을 물어뜯어 놓았다.',[Q('씹을 수 있는 안전한 장난감을 준비해 준다',{hap:6,env:5,bond:2},'장난감에 흥미를 붙였다.',{hap:1},'신발이 여전히 더 좋은 모양이다.',.65)]),
ev('rainwalk','fun',{g:['dog']},'비가 오는 날인데 산책 가자며 현관에서 낑낑댄다.',[Q('짧게 우비를 입고 다녀온다',{hap:9,act:12,bond:4},'물웅덩이를 밟으며 신나 한다.',{hap:5,act:6,hea:-5},'감기 기운이 올 것 같다.',.6),Q('실내에서 놀이로 대신한다',{hap:5,act:8,bond:3},'아쉬워도 즐겁게 놀았다.',{hap:-2,act:3},'산책이 못내 아쉬운 듯하다.',.6)]),
ev('fetch','fun',{g:['dog']},'공을 물고 와서 당신 발치에 내려놓는다. 빤히 쳐다본다.',[Q('시간이 될 때까지 공놀이를 해 준다',{hap:10,act:15,bond:6,nut:-4},'지칠 때까지 신나게 놀았다.',{hap:4,act:8},'공만 보면 흥분을 가라앉히지 못한다.',.75)]),
// ── 고양이 ──
ev('zoom','fun',{g:['cat']},'새벽 3시, 고양이가 우다다를 시작했다!',[Q('사냥 놀이로 에너지를 풀어 준다',{act:25,hap:8,bond:4},'실컷 뛰고 만족했다.',{act:12,hap:2},'놀자 신나서 더 흥분해 버렸다.',.7),Q('무시하고 계속 잔다',{str:2,act:6},'혼자 한참 뛰어다니다 잠들었다.',{str:6,env:-5},'물건을 떨어뜨리고 난장판이 되었다.',.4)]),
ev('scratch','behav',{g:['cat']},'소파가 스크래칭으로 너덜너덜해졌다.',[Q('스크래처 위치와 종류를 바꿔 본다',{env:8,hap:4},'새 스크래처를 마음에 들어 한다.',{env:-3},'여전히 소파가 더 좋은 모양이다.',.6)]),
ev('hairball','health',{g:['cat'],w:s=>s.hap<55?1.5:1},'헤어볼을 계속 토하는 모습이 보인다.',[Q('빗질을 늘리고 헤어볼 케어 제품을 급여한다',{hea:7,bond:2},'한결 나아졌다.',{hea:2},'크게 달라지지 않았다.',.7)]),
ev('box','fun',{g:['cat']},'비싼 장난감은 외면하고 택배 상자에 쏙 들어가 앉았다.',[Q('상자를 더 늘려 준다',{hap:9,env:3,bond:3},'기분 좋게 상자 속에서 낮잠을 잔다.',{hap:2},'생각만큼 흥미를 갖지 않는다.',.8)]),
ev('window','fun',{g:['cat','bird']},'창가에서 바깥을 오래도록 응시하고 있다.',[Q('창가에 편안한 자리를 만들어 준다',{hap:8,env:6},'바깥 구경이 최고의 오락이 되었다.',{hap:3,env:2},'몇 번 앉더니 관심이 식었다.',.8)]),
// ── 소동물 ──
ev('wheel','fun',{g:['small']},'한밤중 쳇바퀴 소리가 시끄럽다. 야행성이라 활발할 시간이다.',[Q('소음 방지 쳇바퀴로 바꿔 준다',{act:15,hap:6,env:5},'조용히 운동한다.',{act:5,hap:1,str:3},'낯선 쳇바퀴는 쓰지 않는다.',.7)]),
ev('cageChew','behav',{g:['small']},'케이지 철창을 계속 갉아대며 스트레스를 받는 것 같다.',[Q('더 넓은 케이지와 갉을 거리를 마련한다',{env:18,hap:6,str:-5},'한결 차분해졌다.',{env:8},'아직은 철창이 더 좋은 모양이다.',.75)]),
ev('hide','env',{g:['small']},'은신처에서 나오지 않고 구석에서만 지낸다.',[Q('방해하지 않고 조용히 지켜본다',{str:-5,hap:2},'스스로 나와 천천히 탐색했다.',{str:3,bond:-2},'여전히 나오지 않는다.',.55)]),
ev('nightActive','env',{g:['small']},'낮에는 자고 밤에만 돌아다니는 아이의 생활 리듬이 신경 쓰인다.',[Q('아이의 리듬에 맞춰 조명과 소음을 조절한다',{str:-5,env:6,hap:4},'편안히 생활한다.',{env:2},'큰 변화는 없었다.',.8)]),
// ── 조류 ──
ev('mirror','fun',{g:['bird']},'거울 속 자기 모습에 말을 걸고 있다.',[Q('함께 말을 걸어 준다',{bond:8,hap:6},'교감이 깊어졌다.',{bond:3},'거울에만 집착한다.',.75),Q('거울을 치운다',{str:-4,hap:-2},'조금 심심해했다.',{str:4,hap:-4},'갑자기 사라진 친구를 찾는다.',.5)]),
ev('loudAm','behav',{g:['bird']},'동틀 무렵부터 쩌렁쩌렁 우는 바람에 이웃이 힘들어한다.',[Q('커버로 어둡게 하고 기상 시간을 조절한다',{str:-3,env:6},'아침이 조금 조용해졌다.',{str:4},'아직 새벽잠을 설친다.',.65)]),
ev('molt','health',{g:['bird']},'깃털갈이 시기를 맞아 깃털이 빠지고 신경이 예민하다.',[Q('영양 보충과 안정을 우선한다',{hea:7,nut:6,str:-4},'무사히 털갈이를 마쳤다.',{hea:2},'털갈이가 길어진다.',.8)]),
ev('talk','fun',{g:['bird'],iq:[3,5]},'당신 목소리를 따라 새로운 소리를 내려고 애쓴다.',[Q('반복해서 말을 가르쳐 준다',{bond:9,hap:6},'신기한 소리를 따라 했다!',{bond:4},'아직은 알아듣기 어렵다.',.7)]),
ev('cageBite','behav',{g:['bird']},'가까이 가면 손을 물려고 한다. 낯가림이 심하다.',[Q('먹이로 신뢰를 쌓으며 천천히 다가간다',{bond:7,str:-4},'조금씩 손에 올라온다.',{bond:2,str:3},'아직은 경계심이 높다.',.65)]),
// ── 어류 ──
ev('water','env',{g:['fish']},'수조 물이 뿌옇게 흐려졌다.',[Q('부분 환수를 한다',{env:28,str:-4},'물이 다시 맑아졌다.',{env:12,str:5},'수질 변화에 물고기들이 놀랐다.',.75),Q('먹이를 줄이고 지켜본다',{env:10,nut:-8},'조금 나아졌지만 불안하다.',{env:-8,hea:-5},'오히려 더 탁해졌다.',.4)]),
ev('algae','env',{g:['fish']},'수조 유리와 수초에 이끼가 가득 끼었다.',[Q('이끼 청소와 조명 시간을 조정한다',{env:22,hea:2},'수조가 한결 깨끗해졌다.',{env:10},'이끼가 금방 다시 낀다.',.7)]),
ev('ich','health',{g:['fish'],w:ill},'몸에 하얀 점이 보인다. 백점병이 의심된다.',[Q('수온을 올리고 전용 약품을 쓴다',{hea:14,env:-3},'초기에 잡아 치료했다.',{hea:-4,str:8},'약이 독해서 힘들어한다.',.65)]),
ev('tankmate','social',{g:['fish']},'수조에 새 물고기를 넣어 볼까 한다.',[Q('충분히 격리 후 합사한다',{hap:7,env:-4},'새 친구와 어울린다.',{hea:-6,str:12},'텃세에 시달렸다.',.6)]),
ev('lightCycle','env',{g:['fish']},'조명 타이머가 고장 나 밤낮이 뒤죽박죽이다.',[Q('타이머를 새로 설치해 일정하게 맞춘다',{env:15,str:-4},'리듬을 되찾았다.',{env:5},'아직 적응 중이다.',.8)]),
// ── 파충류 ──
ev('shed','health',{g:['rep']},'탈피가 시작되어 몸이 하얗게 일어났다.',[Q('습도를 높이고 기다린다',{hea:6,env:10},'무사히 탈피했다.',{hea:-2,env:4},'탈피가 조금 지연된다.',.75),Q('손으로 벗겨 준다',{hea:2},'깔끔하게 정리되었다.',{hea:-9,str:10},'아파하며 움츠렸다.',.2)]),
ev('basking','env',{g:['rep','amph']},'조명 기구가 고장 나 온도가 떨어졌다.',[Q('즉시 새 조명을 구해 설치한다',{env:20,hea:3},'다시 따뜻해졌다.',{env:10,str:3},'설치가 늦어 아이가 추위를 탔다.',.7)]),
ev('noFood','food',{g:['rep']},'며칠째 먹이를 거들떠보지도 않는다. 거식인지 걱정이다.',[Q('온도·조명 상태부터 점검한다',{nut:10,env:10},'환경이 문제였다. 다시 먹기 시작했다.',{nut:3,env:5},'환경에는 이상이 없다.',.6)]),
ev('vivEscape','behav',{g:['rep','amph']},'사육장 뚜껑이 열린 사이 아이가 탈출했다!',[Q('집 안 구석구석을 침착하게 수색한다',{bond:3,str:-1},'가구 뒤에 숨어 있던 아이를 찾았다.',{str:10,hea:-4},'먼지투성이로 발견되었다.',.7)]),
ev('humid','env',{g:['rep','amph']},'환절기라 사육장 습도가 들쭉날쭉하다.',[Q('습도계를 설치하고 자동 분무를 활용한다',{env:20,hea:3},'습도가 안정되었다.',{env:8},'장비 세팅에 시간이 걸린다.',.75)]),
// ── 양서류 ──
ev('skin','health',{g:['amph']},'피부 색이 칙칙하고 건조해 보인다.',[Q('분무·수질을 점검하고 환경을 조정한다',{hea:9,env:10},'피부에 생기가 돌아왔다.',{hea:3,env:4},'변화가 느리다.',.7)]),
ev('calling','behav',{g:['amph']},'한밤중 울음소리가 집 안에 울려 퍼진다.',[Q('온도·습도 환경을 안정시켜 준다',{str:-4,hap:3},'울음이 잦아들었다.',{str:2},'여전히 밤마다 운다.',.55)]),
ev('feedAmph','food',{g:['amph']},'살아있는 먹이를 사냥하지 못하고 맴돌고 있다.',[Q('핀셋으로 먹이를 흔들어 사냥 본능을 깨워 준다',{nut:12,bond:4},'먹이를 낚아챘다.',{nut:3},'오늘은 식욕이 없는 듯하다.',.7)]),
// ── 곤충·무척추 ──
ev('moult','health',{g:['bug']},'탈피(허물벗기)를 준비하는지 움직임이 거의 없다.',[Q('절대 건드리지 않고 습도만 유지한다',{hea:8,env:6},'무사히 탈피를 마쳤다.',{hea:2},'탈피가 조금 오래 걸린다.',.8)]),
ev('burrow','env',{g:['bug']},'바닥재 깊이 파고들어 모습이 보이지 않는다.',[Q('방해하지 않고 환경만 유지한다',{str:-4,env:5},'안정적으로 지낸다.',{str:2},'걱정이 되지만 지켜볼 수밖에 없다.',.8)]),
ev('bugEscape','behav',{g:['bug']},'뚜껑 틈새로 빠져나와 벽을 기어오르고 있다!',[Q('컵으로 조심스레 잡아 사육통으로 되돌린다',{bond:2,str:2},'무사히 돌아왔다.',{str:9,hea:-3},'놀라서 몸을 웅크렸다.',.75)]),
ev('feedBug','food',{g:['bug']},'먹이를 먹지 않고 한구석에 웅크리고 있다.',[Q('먹이 종류와 신선도를 점검한다',{nut:12,env:6},'신선한 먹이로 바꾸니 먹는다.',{nut:4},'특별한 원인을 못 찾았다.',.65)]),
// ── 히든 펫: 신화 속 생물 ──
ev('mythCrowd','social',{g:['myth']},'소문을 들은 사람들이 아이를 보겠다며 몰려들고 있다!',[Q('조용한 마구간으로 숨겨 준다',{str:-5,bond:5},'둘만의 평화로운 시간이 이어졌다.',{str:3,hap:-3},'답답해하며 창밖을 바라본다.',.7),Q('멀리서만 볼 수 있게 허락한다',{hap:4,str:6,bond:2},'환호성에 아이가 으쓱했다.',{str:14,hap:-4},'큰 소리에 놀라 날뛰었다.',.45)]),
ev('mythRainbow','fun',{g:['myth']},'비가 갠 하늘에 커다란 무지개가 걸렸다. 아이가 고개를 들어 바라본다.',[Q('함께 무지개 아래로 걸어간다',{hap:12,bond:8,act:8},'아이의 갈기가 무지갯빛으로 반짝였다.',{hap:5,bond:3},'무지개는 금세 사라졌다.',.8)]),
ev('mythMagic','health',{g:['myth']},'아이의 몸에서 마법 에너지가 불안정하게 깜빡인다.',[Q('조용한 곳에서 에너지를 가라앉히도록 돕는다',{hea:10,str:-6},'반짝임이 부드럽게 안정되었다.',{hea:2,str:4},'조금 더 지켜봐야 한다.',.7)]),
ev('unicornHorn','health',{g:['myth'],ko:['유니콘']},'뿔 끝이 흐릿해지고 빛이 약해졌다.',[Q('은빛 수건으로 정성껏 닦고 별빛 아래 두어 충전한다',{hea:12,hap:6},'뿔이 다시 은은하게 빛났다.',{hea:3},'빛이 완전히 돌아오진 않았다.',.7)]),
ev('pegasusWing','health',{g:['myth'],ko:['페가수스']},'날개깃이 몇 개 빠지고 날갯짓이 어색하다.',[Q('날개를 살펴 주고 낮은 구름에서 천천히 비행 연습을 한다',{hea:10,act:10,bond:4},'다시 힘차게 날았다.',{hea:2,str:6},'아직 날갯짓이 불안하다.',.65)]),
// ── 히든 펫: 총 (허가·안전 보관·정비 중심의 관리 시뮬레이션) ──
ev('gunRust','gun',{g:['gun'],w:s=>s.nut<55?3:1},'보관함 안쪽에서 녹 얼룩이 발견되었다.',[Q('보관 상태를 점검하고 방청 관리를 한다',{hea:12,nut:12,env:8},'부식이 번지기 전에 잡았다.',{hea:4,nut:5},'얼룩이 완전히 지워지진 않았다.',.7)]),
ev('gunHumid','gun',{g:['gun'],se:['여름']},'장마철이라 보관함 안이 습하다.',[Q('제습제와 습도 관리를 강화한다',{env:20,str:-6},'건조하게 유지되고 있다.',{env:8},'습도가 잘 잡히지 않는다.',.75)]),
ev('gunLicense','gun',{g:['gun']},'허가 갱신 안내문이 도착했다. 기한이 얼마 남지 않았다.',[Q('서류를 챙겨 바로 갱신 절차를 밟는다',{bond:10,str:-6},'기한 내 갱신을 마쳤다.',{bond:4,str:3},'서류가 하나 부족해 한 번 더 방문해야 했다.',.75)]),
ev('gunLock','gun',{g:['gun']},'보관함 열쇠가 어디 있는지 순간 기억나지 않는다.',[Q('침착하게 찾고 보관 규칙을 다시 정한다',{bond:8,env:10,str:-5},'열쇠를 찾았고 관리 규칙이 더 엄격해졌다.',{bond:3,str:8},'한참을 헤맨 끝에 겨우 찾았다.',.7)]),
ev('gunInspect','gun',{g:['gun']},'정기 점검일이 다가왔다.',[Q('점검일에 맞춰 전문가에게 맡긴다',{hea:14,bond:6},'모든 부품이 정상이라는 결과를 받았다.',{hea:4,bond:2},'작은 교체 부품이 필요하다고 했다.',.75)]),
ev('gunDust','gun',{g:['gun'],w:s=>s.act<40?3:1},'오랫동안 점검하지 않아 보관함에 먼지가 쌓였다.',[Q('시간을 내어 전체를 점검하고 정리한다',{hea:10,env:14,act:25},'다시 깔끔한 상태가 되었다.',{hea:3,env:6,act:12},'정리는 했지만 하루가 다 갔다.',.7)]),
ev('gunMove','gun',{g:['gun']},'이사를 하게 되었다. 보관 장소와 관련 신고를 새로 정리해야 한다.',[Q('관할 기관에 먼저 문의해 절차대로 처리한다',{bond:10,env:10,str:-5},'모든 절차가 문제없이 끝났다.',{bond:4,str:4},'절차가 번거로웠지만 무사히 마쳤다.',.8)])
];


// ===== 맥락 맞춤 선택지 시스템 =====
// ① 사건 전용 선택지(e.c + EXTRA_Q) ② 내용이 맞는 사건만 종류별 풀(FP) 사용 ③ 나머지는 어떤 상황에도 말이 되는 '태도' 선택지(CP.any)로 채운다.
CP.any=[
Q('일단 아이의 반응을 차분히 살핀다',{str:-2,bond:2},'아이가 안심하는 듯하다.',{str:3},'별다른 변화가 없었다.',.7),
Q('주변 경험자에게 의견을 물어본다',{str:-2,hap:2},'도움이 되는 조언을 들었다.',{str:3},'의견이 엇갈려 더 헷갈렸다.',.55),
Q('가족과 의논해서 정한다',{bond:3,hap:3},'다 함께 정하니 마음이 편했다.',{str:3},'의견이 갈려 결정이 늦어졌다.',.6),
Q('지금은 넘기고 나중에 생각하기로 한다',{str:1},'일단은 무탈하게 지나갔다.',{hap:-3,bond:-2,str:5},'미룬 사이 상황이 조금 꼬였다.',.4),
Q('아이에게 맞춰 천천히, 조금씩 시도한다',{hap:5,bond:4,str:-2},'아이의 속도에 맞추니 순조로웠다.',{str:3},'너무 느려 흐지부지되었다.',.7),
Q('인터넷에서 찾은 비슷한 사례를 따라 해 본다',{hap:4,bond:2},'사례가 꽤 잘 맞았다.',{str:8,hea:-3,hap:-3},'우리 아이에게는 맞지 않았다.',.4),
Q('과감하게 바로 실행에 옮긴다',{hap:6,bond:3},'결단이 통했다.',{str:10,hap:-4},'서두르다 아이가 놀랐다.',.4),
Q('하던 일을 멈추고 아이에게 집중한다',{bond:7,hap:4,str:-3},'온전히 집중해 준 시간이 따뜻했다.',{bond:2},'아이는 평소와 별 차이를 못 느꼈다.',.8),
Q('한 걸음 물러서 아이가 스스로 해결하게 둔다',{str:-2,hap:3},'스스로 해결해 냈다.',{str:6,hap:-3,bond:-2},'도움이 필요했는지 시무룩해졌다.',.45),
Q('필요한 용품을 먼저 준비해 둔다',{env:8,str:-2},'미리 준비해 두니 든든했다.',{env:2},'준비만 하고 쓸 일이 없었다.',.65)];
// 이 사건들만 종류별 공용 풀을 쓴다 (선택지가 사건 내용과 어울리는 것만 선별)
const FP={};
for(const [pool,ids] of Object.entries({
 env:'heat move noise smell sleepless rain heatwave coldwave autumn power water algae lightCycle basking humid nightActive senFish burrow hide',
 health:'ill injury hairball ich skin wkJoint wkKidney wkHeart wkSkin wkDigest wkEyes mythMagic spring',
 social:'guest newpet dogmeet tankmate thunder sociali mythCrowd',
 life:'holiday lonely',
 food:'picky noFood feedBug',
 behav:'bark chew scratch cageChew loudAm broken bored calling cageBite',
 fun:'prime'})) ids.split(' ').forEach(id=>FP[id]=pool);
const Y=(...a)=>a;
const EXTRA_Q={
bonding:[Q('아이가 편히 쉬도록 불을 낮춰 준다',{str:-5,hap:5},'아이가 눈을 감고 푹 쉬었다.',{hap:1},'아이는 이미 자리를 떠난 뒤였다.',.8),Q('조용히 이름을 불러 준다',{bond:5,hap:3},'이름에 귀를 쫑긋하며 반응했다.',{bond:1},'못 들은 척 잠을 이어 갔다.',.7)],
gift:[Q('아이가 직접 다가와 고를 때까지 기다린다',{hap:7,bond:3},'스스로 고른 장난감이라 더 좋아한다.',{hap:2},'관심 없다는 듯 지나쳤다.',.6),Q('다른 장난감과 번갈아 가며 보여 준다',{hap:6,act:6},'새로움에 신이 났다.',{hap:2,str:3},'뭐가 뭔지 헷갈려 한다.',.6)],
sns:[Q('가끔만, 조심스럽게 올린다',{bond:2,hap:2},'소소하게 추억을 쌓았다.',{hap:1},'반응이 시들해졌다.',.8),Q('댓글에 달린 조언을 참고해 본다',{hap:3,env:4},'쓸 만한 팁을 얻었다.',{str:5,env:-3},'엇갈린 조언에 마음이 복잡해졌다.',.5),Q('SNS를 그만하고 아이에게만 집중한다',{bond:8,hap:4},'온전히 둘만의 시간이 늘었다.',{bond:3},'조금 허전했다.',.8),Q('인기를 위해 더 자주, 더 많이 찍는다',{hap:-3,str:9},'카메라 앞에서 지친 기색이다.',{bond:-2,str:12,hap:-5},'아이가 카메라를 피하기 시작했다.',.2)],
money:[Q('지출 내역을 정리하고 우선순위를 세운다',{nut:6,env:5,str:-2},'꼭 필요한 곳에 쓰게 되었다.',{str:3},'정리하다 한숨만 늘었다.',.7),Q('부업을 늘려 비용을 마련한다',{nut:8,env:6,bond:-4},'넉넉해졌지만 함께할 시간이 줄었다.',{nut:3,bond:-6,str:4},'지쳐서 아이를 챙길 여력이 없다.',.5),Q('가족에게 도움을 청한다',{nut:7,bond:2},'가족이 흔쾌히 보태 주었다.',{str:3},'눈치가 보여 마음이 무거웠다.',.6)],
diet:[Q('간식을 끊고 식단을 단순하게 바꾼다',{hea:7,nut:-4},'몸이 눈에 띄게 가벼워졌다.',{hap:-5,str:5},'간식을 조르며 서운해한다.',.6),Q('수의사와 적정 체중을 상의한다',{hea:9,nut:3},'맞춤 목표가 생겼다.',{hea:3},'큰 문제는 아니라고 한다.',.7),Q('운동량을 갑자기 크게 늘린다',{hea:4,act:15},'땀 흘리며 즐겁게 움직였다.',{hea:-8,str:8},'무리해서 몸이 상했다.',.3)],
photo:[Q('조명 없이 자연스러운 모습만 몇 장 찍는다',{hap:3,bond:3},'자연스러운 사진이 잘 나왔다.',{hap:1},'움직여서 흔들린 사진뿐이다.',.7),Q('소품을 하나씩 천천히 적응시킨 뒤 찍는다',{bond:4,hap:3,str:2},'소품을 신기해하며 포즈를 취했다.',{str:8,hap:-3},'소품을 낯설어 거부했다.',.55),Q('플래시와 조명을 켜고 본격적으로 찍는다',{hap:2},'사진이 멋지게 나왔다.',{str:14,hap:-5,hea:-2},'강한 빛에 놀라 한참 진정이 필요했다.',.3),Q('촬영을 정중히 거절한다',{str:-4,bond:2},'아이는 편안히 쉬었다.',{bond:-1},'친구가 조금 서운해했다.',.8),Q('간식으로 집중시키며 짧게 찍는다',{hap:5,nut:3},'간식 덕에 협조적이었다.',{nut:3,hap:1},'간식만 보고 카메라는 쳐다보지도 않았다.',.6)],
cuteSleep:[Q('방해하지 않고 곁에서 지켜본다',{bond:5,str:-3},'평화로운 숨소리가 귀엽다.',{bond:2},'어느새 조용해졌다.',.85),Q('살짝 쓰다듬어 준다',{bond:4,hap:3},'잠결에도 기분 좋아 보였다.',{str:6,hap:-3},'깜짝 놀라 깨어 버렸다.',.5)],
escape:[Q('방 문을 닫고 조용히 기다린다',{str:-3},'제 발로 돌아왔다.',{str:7,hea:-2},'구석에 숨어 한참 나오지 않았다.',.5),Q('좋아하는 소리나 먹이 냄새로 유인한다',{bond:3,str:-2},'냄새를 맡고 쪼르르 돌아왔다.',{str:6},'먹이만 낚아채고 다시 도망쳤다.',.55),Q('가족을 불러 함께 찾는다',{bond:2},'여럿이 찾아 금방 발견했다.',{str:9,hea:-3},'소란에 아이가 더 숨어 버렸다.',.5)],
vacc:[Q('아이가 안정되도록 간식과 담요를 챙겨 간다',{hea:15,str:2,bond:3},'덜 무서워하며 무사히 마쳤다.',{hea:8,str:8},'그래도 긴장해서 떨었다.',.75),Q('필요한 항목만 골라 간단히 받는다',{hea:9,str:3},'부담 없이 마무리했다.',{hea:2},'놓친 항목이 있었다.',.6),Q('예약을 잡아 두고 상태가 좋은 날 간다',{hea:12,str:-1},'컨디션이 좋은 날 편하게 받았다.',{hea:4,str:3},'계속 미루게 되었다.',.6)],
neighbor:[Q('이웃에게 작은 선물과 함께 사과한다',{env:6,str:-3,bond:2},'이웃도 이해해 주었다.',{env:2},'여전히 불편해하는 눈치다.',.65),Q('방음 매트와 커튼을 설치한다',{env:14,str:-4},'소음이 눈에 띄게 줄었다.',{env:6},'효과가 기대만큼은 아니었다.',.7),Q('낮에 충분히 놀아 주어 조용히 쉬게 한다',{act:12,hap:5,str:-3},'지쳐서 조용히 쉬었다.',{act:6,str:3},'에너지가 남아 더 소란스러웠다.',.55)],
curious:[Q('위험한 물건부터 먼저 치운다',{env:10,str:-3},'안전해져서 맘껏 탐험했다.',{env:4},'치우느라 한참 걸렸다.',.8),Q('함께 다니며 이것저것 보여 준다',{bond:7,hap:6},'함께 탐험하며 더 친해졌다.',{bond:3,str:4},'너무 많은 자극에 지쳐 했다.',.7)],
growth:[Q('먹이를 나눠서 자주 조금씩 준다',{nut:10,hea:5},'소화가 잘 되고 튼튼해졌다.',{nut:5},'식사 시간이 불규칙해졌다.',.7),Q('몸무게와 크기를 기록하며 지켜본다',{hea:5,bond:2},'성장 곡선이 안정적이다.',{hea:2},'기록만 쌓이고 변화는 없었다.',.8),Q('먹고 싶은 만큼 마음껏 먹게 둔다',{nut:12,hap:5},'신나게 먹고 쑥쑥 컸다.',{nut:6,hea:-6},'과식해서 배탈이 났다.',.45)],
nameRes:[Q('간식을 들고 이름을 부르며 거리를 점점 늘린다',{bond:8,hap:4},'멀리서도 이름을 알아듣는다!',{bond:3},'간식만 보고 이름에는 무반응이다.',.65),Q('매일 같은 억양으로 부드럽게 불러 준다',{bond:6,str:-2},'목소리를 기억하기 시작했다.',{bond:2},'아직은 낯설어한다.',.8)],
mating:[Q('조용하고 안정된 환경을 유지하며 지켜본다',{str:-4,hap:2},'큰 문제 없이 시기를 지났다.',{str:5},'한동안 예민한 상태가 이어졌다.',.7),Q('체력을 소모하도록 활동량을 늘린다',{act:15,str:-3},'지쳐서 차분해졌다.',{act:8,str:5},'오히려 더 흥분했다.',.5)],
routine:[Q('아이가 신호를 보낼 때마다 바로바로 응해 준다',{bond:6,hap:4},'믿음이 더 깊어졌다.',{bond:2,hap:-1},'너무 응석받이가 되는 것 같다.',.6),Q('일과표를 만들어 가족 모두가 지킨다',{str:-5,hap:3,env:4},'모두가 지키니 아이가 더 안정됐다.',{str:3},'가족 중 한 명이 자꾸 어긴다.',.65)],
old:[Q('수의사와 노령기 관리 계획을 세운다',{hea:10,env:6},'지금의 몸에 맞는 관리를 시작했다.',{hea:4},'당장 달라지는 건 없었다.',.8),Q('푹신한 잠자리와 쉬운 동선을 만들어 준다',{env:14,hap:5},'움직임이 한결 편해졌다.',{env:6},'낯선 변화에 조금 당황한 듯하다.',.75)],
senStairs:[Q('미끄럼 방지 매트를 깔아 준다',{env:14,hea:3},'넘어질 걱정이 줄었다.',{env:6},'매트가 낯설어 피해 다닌다.',.75),Q('무리하지 않는 짧은 산책으로 바꾼다',{hap:6,act:6,hea:2},'천천히 걷는 길을 즐겼다.',{hap:2,act:3},'산책이 짧다며 아쉬워한다.',.7)],
senKidney:[Q('신선한 물을 곳곳에 놓아 준다',{hea:6,env:5},'물을 자주 마시게 되었다.',{hea:2},'물그릇에는 별 관심이 없다.',.7),Q('저염·처방 식단으로 바꾼다',{hea:9,nut:-3},'수치가 점차 안정되었다.',{hea:3,nut:-6,hap:-3},'입맛에 안 맞아 잘 안 먹는다.',.6)],
senTeeth:[Q('이빨 상태를 점검하고 필요하면 다듬어 준다',{hea:8,nut:6},'먹기가 한결 수월해졌다.',{hea:2,str:6},'점검이 힘들었는지 한동안 예민했다.',.65),Q('먹이를 잘게 썰거나 불려서 준다',{nut:10,hap:3},'맛있게 잘 먹었다.',{nut:4},'식감이 달라졌다며 조금 남겼다.',.75)],
senFeather:[Q('따뜻하고 낮은 횃대로 바꿔 준다',{env:12,hea:5},'편안히 올라가 쉬었다.',{env:5},'새 횃대가 낯설어 올라가지 않았다.',.75),Q('영양제를 먹이에 섞어 준다',{hea:7,nut:6},'깃털에 윤기가 돌았다.',{hea:2},'맛이 이상한지 남겼다.',.6)],
senRep:[Q('먹이를 먹기 좋은 크기로 준비한다',{nut:10,hap:2},'조금씩 잘 먹었다.',{nut:4},'거들떠보지 않았다.',.65),Q('따뜻한 곳에서 편히 쉬도록 둔다',{env:10,str:-3},'몸을 데우며 편안해했다.',{env:4},'온도가 맞지 않아 뒤척였다.',.7)],
senBug:[Q('먹이를 가까이 놓아 움직이지 않아도 먹게 한다',{nut:10,hap:2},'힘들이지 않고 먹었다.',{nut:4},'먹이에 관심이 없다.',.7),Q('만지지 않고 조용히 지켜본다',{str:-4,bond:2},'고요한 시간을 보냈다.',{str:2},'움직임이 점점 줄어든다.',.85)],
senMemory:[Q('좋아하던 장소로 천천히 데려가 본다',{hap:9,bond:6,hea:-2},'오랜만에 눈빛이 반짝였다.',{hap:3,hea:-6,str:5},'이동이 힘들어 금세 지쳤다.',.65),Q('옛 사진을 정리해 앨범으로 만든다',{bond:5,hap:3},'함께한 세월이 한눈에 보인다.',{bond:2},'정리하다 마음이 울컥했다.',.9)],
senMiracle:[Q('조용히 곁에서 지켜보며 무리하지 않게 한다',{hea:6,bond:7,hap:6},'평온한 시간이 흘렀다.',{hea:2,bond:3},'기운은 금세 가라앉았다.',.8)],
learn:[Q('간식과 칭찬으로 한 번에 하나씩 가르친다',{bond:8,hap:6},'차근차근 익혀 갔다.',{bond:3},'집중이 오래가지 않았다.',.7),Q('너무 어려운 재주에 도전해 본다',{hap:4,str:7},'실패 끝에 성공해 뿌듯해한다.',{str:12,hap:-5},'좌절해서 의욕을 잃었다.',.4),Q('아이가 스스로 방법을 찾게 퍼즐을 준다',{hap:6,act:6},'혼자 풀어내고 으쓱해한다.',{hap:-1,str:5},'풀지 못해 던져 버렸다.',.5)],
habit:[Q('아이가 기다리는 시간에 맞춰 일찍 돌아온다',{bond:7,hap:4,str:-3},'기다리던 아이가 반겼다.',{bond:3},'서두르다 오히려 늦어졌다.',.6),Q('늦을 땐 미리 먹이를 챙겨 둔다',{nut:8,str:-2},'기다리는 동안 배고프지 않았다.',{nut:3},'먹이를 남긴 채 기다렸다.',.7)],
steal:[Q('식탁 위를 비우고 간식 보관함을 잠근다',{str:-2,hap:-2,nut:3},'더는 훔칠 수 없게 되었다.',{hap:-4,str:4},'먹을 걸 찾아 온 집안을 뒤진다.',.6),Q('훔치지 않고 기다리면 간식을 보상으로 준다',{bond:5,hap:4,nut:3},'기다리면 먹는다는 걸 배우고 있다.',{nut:5,hea:-3},'오히려 더 훔치게 되었다.',.5)],
breakAll:[Q('부서질 물건을 치우고 안전한 놀이터를 만든다',{env:10,hap:6},'안전하게 마음껏 놀았다.',{env:4},'어느새 다른 곳을 어지럽혔다.',.7),Q('놀이 시간을 정해 규칙적으로 놀아 준다',{hap:8,act:10,bond:5},'놀이 시간을 기다리는 아이가 되었다.',{hap:3,act:5},'시간이 끝나도 계속 놀자고 조른다.',.65)],
ignore:[Q('혼자 있고 싶어 하는 걸 존중한다',{str:-4,hap:3},'혼자만의 시간을 즐겼다.',{bond:-2},'조금 쓸쓸해 보이기도 했다.',.65),Q('작은 간식을 놓아 두고 자리를 피한다',{bond:4,nut:3},'슬쩍 다가와 간식을 가져갔다.',{nut:3},'간식은 그대로 남았다.',.6)],
separation:[Q('짧게 나갔다 돌아오는 연습을 반복한다',{bond:5,str:-6},'돌아온다는 걸 알게 되어 의연해졌다.',{str:5},'나갈 때마다 여전히 불안해한다.',.6),Q('내 냄새가 밴 물건을 남겨 둔다',{str:-5,bond:3},'물건을 끌어안고 기다렸다.',{str:3},'물건에는 별 관심이 없다.',.6),Q('나갈 때 인사를 크게 하며 안심시킨다',{bond:3,str:3},'기분 좋게 배웅했다.',{str:9,hap:-3},'인사가 오히려 더 불안하게 만들었다.',.35)],
sensy:[Q('조명과 소리를 줄이고 일정한 시간표를 지킨다',{str:-6,env:5},'예측 가능한 환경에서 안정을 찾았다.',{env:2},'조금 지루해하는 듯했다.',.75),Q('익숙한 냄새가 나는 은신처를 마련한다',{str:-5,env:6},'은신처에서 편안히 쉬었다.',{str:2},'은신처를 한 번도 쓰지 않았다.',.65)],
explore:[Q('위험하지 않은 곳만 열어 주고 지켜본다',{hap:7,act:7},'안전하게 탐험을 마쳤다.',{hap:3},'금방 흥미를 잃었다.',.8),Q('새로운 물건을 하나씩 두어 호기심을 채워 준다',{hap:8,env:4},'새 물건을 샅샅이 조사했다.',{hap:2,env:-3},'너무 많이 헤집어 놓았다.',.65)],
napCalm:[Q('햇볕 드는 자리에 푹신한 자리를 마련한다',{env:10,hap:6},'온종일 그 자리에서 낮잠을 잤다.',{env:4},'다른 자리가 더 좋았나 보다.',.75),Q('아이의 속도에 맞춰 일정을 비운다',{bond:6,str:-4},'느긋한 하루를 함께 보냈다.',{bond:2},'너무 한가해 시간이 길게 느껴졌다.',.7)],
trauma:[Q('아이가 편하게 느끼는 거리를 지키며 조금씩 다가간다',{bond:7,str:-5},'조금씩 경계를 풀고 있다.',{bond:2,str:2},'아직은 다가가면 움찔한다.',.65),Q('무서워하는 소리를 줄이고 안전한 곳을 마련한다',{str:-6,env:7},'안전한 곳에서 숨을 돌렸다.',{str:2},'은신처 밖으로는 나오지 않았다.',.7),Q('행동 전문가에게 상담한다',{bond:5,str:-5},'전문가의 조언이 큰 도움이 되었다.',{str:1},'시간이 더 필요하다는 말을 들었다.',.7)],
grateful:[Q('따라다니는 대로 두고 천천히 쓰다듬어 준다',{bond:8,hap:6},'가까워졌다는 신호처럼 느껴졌다.',{bond:3,hap:2},'놀랐는지 조금 물러났다.',.7),Q('이름을 불러 주며 간식을 준다',{bond:6,hap:6,nut:3},'기쁜 표정으로 간식을 받았다.',{nut:3,hap:2},'간식에만 관심이 있다.',.6)],
breederVisit:[Q('아이의 근황을 자세히 공유하고 조언을 구한다',{bond:3,hea:3},'유용한 관리 팁을 얻었다.',{hap:1},'뻔한 얘기만 들었다.',.65),Q('바빠서 나중에 답하겠다고 한다',{},'특별한 일은 없었다.',{hea:-2},'관리 팁을 놓쳤다.',.7)],
friendTalk:[Q('친구와 함께 아이를 쓰다듬으며 근황을 나눈다',{bond:4,hap:5},'아이도 친구를 기억하는 듯하다.',{str:4},'낯선 느낌에 경계했다.',.7),Q('친구가 가져온 간식을 줘 본다',{hap:6,nut:4},'새 간식을 무척 맛있어했다.',{hea:-5,nut:3},'간식이 맞지 않아 탈이 났다.',.55)],
rainwalk:[Q('비 그친 뒤 물웅덩이 없는 길을 골라 걷는다',{hap:8,act:10,bond:3},'깨끗한 길을 신나게 걸었다.',{hap:3,act:6},'축축한 길이라 금방 돌아왔다.',.75),Q('산책 대신 노즈워크 놀이를 해 준다',{hap:8,act:6,bond:4},'냄새 맡기 놀이에 푹 빠졌다.',{hap:3},'먹이를 금방 찾아 시큰둥하다.',.65)],
fetch:[Q('힘들어하면 중간에 쉬면서 물을 준다',{hap:7,act:12,hea:3},'적당히 쉬어 가며 더 오래 놀았다.',{hap:4,act:8},'쉬는 걸 아쉬워했다.',.8),Q('공 대신 새 장난감으로 바꿔 던져 본다',{hap:8,act:12},'새 장난감에 더 열광했다.',{hap:2},'공만 가져오라며 끙끙댄다.',.5)],
zoom:[Q('낮에 충분히 놀아 주어 새벽 에너지를 줄인다',{act:18,hap:7,bond:4},'밤에는 한결 조용해졌다.',{act:10,hap:3},'그래도 새벽에 우다다를 했다.',.65),Q('방해될 물건을 치우고 맘껏 뛰게 둔다',{act:15,hap:6,env:3},'안전하게 실컷 뛰고 잤다.',{act:8,env:-5},'결국 몇 개가 떨어져 깨졌다.',.6)],
box:[Q('상자에 구멍을 내 은신처로 꾸며 준다',{hap:8,env:6},'아지트로 삼아 하루 종일 들어가 있다.',{hap:3},'새 모양이 낯설어 들어가지 않는다.',.7),Q('상자를 건드리지 않고 그대로 둔다',{hap:5},'만족스럽게 상자를 차지했다.',{hap:2},'며칠 뒤 상자가 너덜너덜해졌다.',.8)],
window:[Q('창밖이 잘 보이도록 안전망을 설치한다',{env:12,hap:6},'안전하게 바깥을 구경한다.',{env:5},'설치가 번거로웠다.',.8),Q('같이 나란히 앉아 바깥을 구경한다',{bond:7,hap:5},'둘이 같은 풍경을 바라보았다.',{bond:3},'금세 흥미가 시들해졌다.',.75)],
wheel:[Q('쳇바퀴 소리는 신경 쓰지 말고 그대로 둔다',{act:15,hap:5},'밤새 신나게 달렸다.',{act:10,str:2},'시끄러워 잠을 설쳤다.',.6),Q('쳇바퀴에 기름칠을 해 준다',{act:12,env:6,hap:3},'소리가 줄고 더 잘 돈다.',{act:6},'별로 달라지지 않았다.',.7)],
mirror:[Q('거울 대신 다른 새 소리를 틀어 준다',{hap:6,str:-2},'새 소리에 귀 기울이며 지저귄다.',{str:5,hap:-3},'소리에 놀라 구석에 몰렸다.',.5),Q('거울을 짧은 시간만 보여 준다',{hap:5,bond:3},'적당히 즐기다 만족했다.',{str:4},'거울이 없어지자 서운해한다.',.6)],
molt:[Q('깃털갈이용 영양식을 챙겨 준다',{hea:8,nut:7},'깃털이 반질반질하게 났다.',{hea:3},'입맛에 안 맞아 남겼다.',.7),Q('깃털갈이 중에는 스킨십을 줄인다',{str:-5,hea:3},'가려운 곳을 건드리지 않아 편했다.',{bond:-2},'스킨십이 줄어 서운해한다.',.7)],
talk:[Q('아이가 소리를 낼 때마다 칭찬해 준다',{bond:8,hap:6},'칭찬을 받고 더 열심히 따라 했다.',{bond:3},'칭찬만 듣고 소리는 안 낸다.',.7),Q('좋아하는 노래를 반복해서 들려준다',{hap:7,bond:4},'노래를 흥얼거리듯 따라 했다.',{str:3},'너무 반복해서 질려 했다.',.55)],
shed:[Q('물그릇과 촉촉한 은신처를 마련해 준다',{hea:7,env:9},'피부가 부드러워져 쉽게 벗겨졌다.',{hea:2,env:3},'탈피가 평소보다 오래 걸렸다.',.8)],
vivEscape:[Q('사육장 뚜껑 잠금장치를 보강한다',{env:12,str:-3},'다시는 열리지 않게 단단히 닫았다.',{env:5},'설치 중 아이가 또 탈출할 뻔했다.',.75),Q('따뜻하고 어두운 구석부터 확인해 본다',{bond:2,str:-1},'온기를 찾아 간 곳에 있었다.',{str:3},'엉뚱한 곳에서 한참 헤맸다.',.65)],
feedAmph:[Q('먹이 크기와 종류를 바꿔 준다',{nut:10,hap:3},'새 먹이에 반응했다.',{nut:3},'여전히 먹이에 무관심하다.',.6),Q('조명을 어둡게 하고 조용히 기다린다',{nut:8,str:-3},'밤이 되자 슬며시 사냥했다.',{nut:2},'밤새 먹이만 맴돌았다.',.65)],
bugEscape:[Q('사육통 뚜껑의 틈새를 막는다',{env:10,str:-2},'더 이상 빠져나가지 못한다.',{env:4},'다른 틈으로 또 나오려 한다.',.75),Q('아이가 스스로 돌아오길 기다린다',{str:-2},'제자리로 돌아와 있었다.',{str:6,hea:-3},'어딘가에 끼어 버릴 뻔했다.',.4)],
moult:[Q('습도를 높이고 방해되지 않게 조용히 한다',{hea:9,env:8},'깨끗하게 허물을 벗었다.',{hea:2},'허물이 끝까지 벗겨지지 않았다.',.75),Q('먹이를 잠시 중단하고 기다린다',{hea:5},'허물을 벗은 뒤 다시 왕성하게 먹었다.',{nut:-6},'기다리는 동안 힘이 많이 빠졌다.',.55)],
mythRainbow:[Q('아이가 원하는 속도로 무지개를 바라본다',{hap:9,bond:6},'함께 한참을 바라보았다.',{hap:3},'구름이 흩어져 무지개가 사라졌다.',.8),Q('무지개를 향해 달리게(날게) 한다',{act:12,hap:9,str:-2},'신이 나서 하늘을 가르며 달렸다.',{act:6,hap:3,str:3},'무지개는 닿을 수 없어 아쉬워했다.',.6)],
unicornHorn:[Q('성스러운 샘물로 뿔을 적셔 준다',{hea:9,hap:5},'샘물이 닿자 뿔이 은은히 빛났다.',{hea:2},'물이 차가워 깜짝 놀랐다.',.7),Q('빛이 돌아올 때까지 조용히 기다려 준다',{hea:6,bond:4,str:-3},'기다림 끝에 뿔이 다시 반짝였다.',{hea:2},'시간이 꽤 오래 걸렸다.',.75)],
pegasusWing:[Q('깃털에 윤기 나는 기름을 발라 준다',{hea:8,hap:4},'날개가 다시 반짝거렸다.',{hea:2},'기름이 낯설어 털어 냈다.',.7),Q('낮은 언덕에서 바람을 타며 연습시킨다',{act:12,hea:5,bond:4},'바람을 타고 힘차게 날아올랐다.',{act:6,str:5},'균형을 잃고 주저앉았다.',.6)]
};
// 사건별 동물군 제한(내용이 맞는 동물에게만 등장) · 동물군별 문구 교체
const PATCH={
guest:{xg:Y('fish','bug','amph')},bonding:{g:Y('dog','cat','small','bird')},gift:{g:Y('dog','cat','small','bird','rep')},cuteSleep:{g:Y('dog','cat','small')},injury:{xg:Y('fish')},
nameRes:{g:Y('dog','cat','small','bird')},curious:{g:Y('dog','cat','small','bird','rep')},steal:{g:Y('dog','cat','small','bird')},breakAll:{g:Y('dog','cat','small','bird')},
ignore:{g:Y('dog','cat','small','bird')},separation:{g:Y('dog','cat','small','bird')},explore:{g:Y('dog','cat','small','bird','rep')},napCalm:{g:Y('dog','cat','small','bird','rep')},
grateful:{g:Y('dog','cat','small','bird')},newpet:{g:Y('dog','cat','small','bird')},
wkSkin:{t:s=>({dog:T('피부와 털이 자꾸 푸석해지고 가려워한다.'),cat:T('피부와 털이 자꾸 푸석해지고 비듬이 생긴다.'),small:T('털이 푸석해지고 피부가 자꾸 건조해진다.'),bird:T('깃털이 푸석하고 자꾸 빠진다.'),fish:T('비늘과 지느러미 색이 바래고 쉽게 상처가 난다.'),rep:T('피부가 푸석하고 허물이 깔끔하게 벗겨지지 않는다.'),amph:T('피부가 칙칙하고 쉽게 건조해진다.'),bug:T('겉껍질의 광택이 흐려지고 쉽게 긁힌다.'),myth:T('갈기와 몸의 윤기가 흐려졌다.')}[SP[s.sp][2]]||T('피부 상태가 나빠졌다.'))+' '+T('선천적으로 약한 체질이다.')},
wkKidney:{t:T('배설과 수분 섭취에 이상이 보인다. 선천적으로 신장이 약한 체질이다.')},
wkDigest:{t:T('소화가 잘 안 되는지 먹이를 자주 남기고 배설물이 이상하다. 선천적으로 소화기가 예민한 체질이다.')},
wkEyes:{t:T('눈이 자꾸 흐려지고 충혈된다. 선천적으로 눈이 약한 체질이다.')}};
EV.forEach(e=>Object.assign(e,PATCH[e.id]||{}));
// 선천적 약점은 그 동물에게 해당되는 것만 배정
const WKG={dog:'joint kidney heart skin digest eyes',cat:'joint kidney heart skin digest eyes',small:'joint kidney heart skin digest eyes',myth:'joint kidney heart skin digest eyes',bird:'kidney heart skin digest eyes',fish:'skin digest',rep:'kidney skin digest eyes',amph:'skin digest eyes',bug:'skin digest',gun:''};

// ===== 지능(IQ 1~5)과 종별 유대 이벤트 =====
const IQD={dog:4,cat:4,small:3,bird:3,fish:2,rep:2,bug:1},IQO={'앵무새':5,'팬시랫':5,'사랑앵무':4,'러브버드':4,'햄스터':2,'고슴도치':2,'베타':3,'페럿':4,'비어디드래곤':3,'육지거북':3,'수생거북':3};
IQD.amph=2;IQD.myth=5;IQD.gun=0;Object.assign(IQO,{'비둘기':4,'데구':4,'점핑스파이더':3,'소라게':2});
const IQ=i=>IQO[DB[i].ko]??IQD[DB[i].grp];
// 유대감 40 / 70 / 90 달성 시 종별 특별 이벤트 (빈 문자열 = 해당 지능에선 발생하지 않음)
const MSG={small:['당신의 손길에 조금씩 익숙해져요.','당신의 발소리를 알아보고 다가와요.','당신 곁에서 가장 편안해하며 잠들어요.'],bird:['당신이 다가오면 지저귀며 반겨요.','당신의 목소리를 알아듣고 반응해요.','당신 어깨에 앉아 떨어지려 하지 않아요.'],fish:['당신이 다가오면 수면 가까이 올라와요.','당신의 손가락을 따라 헤엄쳐요.',''],rep:['당신의 존재에 놀라지 않아요.','당신 손 위로 스스로 올라와요.','당신 곁에서 편안히 쉬어요.'],bug:['당신의 손길에 놀라지 않아요.','당신 손 위에서 천천히 걸어 다녀요.',''],dog:['당신의 발소리를 알아듣고 달려 나와요.','당신의 목소리를 듣고 따라다녀요.','당신 곁에서 떨어지지 않으려 해요.'],cat:['당신 곁을 슬쩍 지나가요.','당신 무릎 위에 올라와요.','당신을 보며 천천히 눈을 깜빡여요.']};
const MS={'강아지':['당신의 발소리를 알아듣고 현관으로 달려 나와요.','당신의 목소리를 듣고 졸졸 따라다녀요.','당신이 슬퍼 보이면 말없이 곁에 와 기대어 앉아요.'],
'고양이':['이름을 불러도 모른 척하지만 꼬리 끝은 반응하고 있어요.','당신 무릎 위에 올라와 골골송을 불러요.','당신을 바라보며 천천히 눈을 깜빡여요. 고양이식 사랑 고백이에요.'],
'앵무새':['당신의 목소리를 흉내 내기 시작했어요.','당신의 이름을 기억하고 불렀어요!','당신의 목소리로 “사랑해”라고 속삭여요.'],
'사랑앵무':['당신의 말소리를 따라 짹짹거려요.','당신의 이름을 비슷하게 흉내 내요.','당신 어깨 위가 가장 좋아하는 자리가 되었어요.'],
'러브버드':['당신 곁에 바짝 붙어 앉아요.','당신이 보이지 않으면 소리 내어 찾아요.','당신을 짝꿍처럼 졸졸 따라다녀요.'],
'햄스터':['당신 손을 보고도 도망가지 않아요.','당신 손바닥 위에서 해바라기씨를 먹어요.','당신 손 안에서 편히 잠들었어요.'],
'토끼':['당신이 가까이 오면 귀를 쫑긋 세워요.','기분이 좋아서 공중으로 폴짝 뛰어올라요.','당신 곁에서 배를 깔고 편안히 누워요.'],
'기니피그':['당신의 발소리가 들리면 삑삑 소리로 인사해요.','당신 무릎 위에서 얌전히 쉬어요.','당신이 보이면 신나서 팝콘처럼 튀어 올라요.'],
'페럿':['당신 주위를 춤추듯 뛰어다니며 놀자고 해요.','당신 소매 속으로 쏙 들어가 장난을 쳐요.','당신 품에 안겨 곤히 잠들어요.'],
'팬시랫':['이름을 부르면 쪼르르 달려와요.','당신 어깨 위에 올라타 함께 다녀요.','당신의 손을 핥으며 애정을 표현해요.'],
'고슴도치':['당신이 다가가도 가시를 세우지 않아요.','당신의 냄새를 알아보고 손 위에서 몸을 펴요.',''],
'카나리아':['당신이 다가오면 맑은 목소리로 노래해요.','당신 목소리에 맞춰 지저귀어요.',''],
'코이':['당신이 다가오면 연못 가까이 모여들어요.','당신 손에서 직접 먹이를 먹어요.',''],
'베타':['당신의 손가락을 따라 지느러미를 활짝 펴요.','당신이 다가오면 수조 앞으로 와서 인사해요.',''],
'레오파드게코':['당신의 손길에 도망치지 않아요.','당신 손 위로 스스로 올라와요.',''],'크레스티드게코':['당신의 손길에 도망치지 않아요.','당신 손 위로 폴짝 올라와요.',''],
'비어디드래곤':['당신을 보면 눈을 맞추고 가만히 있어요.','당신 어깨 위에서 일광욕을 즐겨요.','당신을 향해 팔을 흔들어 인사해요.'],
'육지거북':['당신을 보면 느릿느릿 다가와요.','당신이 주는 먹이를 손에서 받아먹어요.',''],'수생거북':['당신이 오면 물가로 헤엄쳐 와요.','당신 손에서 직접 먹이를 먹어요.',''],
'콘스네이크':['당신의 손에서 불안해하지 않아요.','당신을 더 이상 물지 않아요.','당신 팔을 천천히 감고 편안히 쉬어요.'],
'슈거글라이더':['당신의 목소리를 듣고 짹짹거려요.','당신 주머니 속에서 편안히 잠들어요.','당신 어깨 위로 활공해 날아와요.']};
MSG.amph=['당신의 존재에 놀라지 않아요.','당신이 다가오면 물가로 다가와요.',''];MSG.myth=['당신 곁에서 경계를 풀고 반짝이는 숨을 내쉬어요.','당신의 목소리에 맑은 울음소리로 답해요.','당신 이마에 조용히 코끝을 맞대요.'];MSG.gun=['','',''];
Object.assign(MS,{'왕관앵무':['당신의 휘파람을 따라 불러요.','당신이 부르면 볏을 세우고 대답해요.','당신 어깨 위에서 노래해요.'],'오리':['당신을 졸졸 따라다녀요.','당신 목소리에 꽥 하고 대답해요.',''],'닭':['당신의 발소리에 꼬꼬댁 달려와요.','당신 무릎 위에서 알을 품듯 앉아요.',''],'거위':['당신을 믿고 곁에서 경계를 풀어요.','당신을 지키듯 곁을 맴돌아요.',''],'비둘기':['당신의 손바닥에 날아와 앉아요.','당신이 부르면 먼 곳에서도 돌아와요.',''],'데구':['당신의 목소리에 반응해 찍찍 대답해요.','당신 어깨 위에서 간식을 먹어요.','당신의 손을 꼭 붙잡고 놀아요.'],'소라게':['당신의 기척에 껍데기 밖으로 나와요.','당신 손 위에서 느긋이 돌아다녀요.',''],'점핑스파이더':['당신의 손가락을 호기심 어린 눈으로 바라봐요.','당신 손 위에서 펄쩍 뛰며 탐색해요.',''],'팩맨개구리':['당신이 다가오면 입을 쩍 벌리며 먹이를 기대해요.','당신이 내민 먹이를 정확히 받아먹어요.','']});
Object.assign(MS,{'유니콘':['당신이 다가오자 뿔 끝이 은은하게 빛나요.','당신 어깨에 무지갯빛 갈기를 기대요.','당신 앞에서만 뿔의 빛을 활짝 펼쳐 보여요.'],'페가수스':['당신이 다가오자 날개를 살며시 펴 보여요.','당신을 태우고 낮은 구름 위를 한 바퀴 돌아요.','당신이 부르면 어디서든 하늘을 가르며 돌아와요.']});
const msl=(i,t)=>(MS[DB[i].ko]||[])[t]??MSG[DB[i].grp][t]??'';
// ===== 게임 엔진 =====
// 주의: 인라인 onclick 안에서는 'title','open','name' 같은 이름이 document/button 속성으로 가려진다 → 함수 이름은 항상 고유하게 짓는다.
let S=null,spd=1,paused=true,modal=null,tm=null,rs=0;
let adm=false,AD=Object.assign({dk:1,ev:1,ab:7,ts:1},ld('pls_adm',{}));
const h53=(str,seed=0)=>{let h1=0xdeadbeef^seed,h2=0x41c6ce57^seed;for(let i=0,ch;i<str.length;i++){ch=str.charCodeAt(i);h1=Math.imul(h1^ch,2654435761);h2=Math.imul(h2^ch,1597334677)}h1=Math.imul(h1^(h1>>>16),2246822507)^Math.imul(h2^(h2>>>13),3266489909);h2=Math.imul(h2^(h2>>>16),2246822507)^Math.imul(h1^(h1>>>13),3266489909);return 4294967296*(2097151&h2)+(h1>>>0)};
const ADMH=4809485095841519; // 관리자 번호의 해시값 (평문 아님)
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const eun=n=>{const c=[...n].pop().charCodeAt(0);return c>=44032&&c<=55203?((c-44032)%28?'은':'는'):'은(는)'};
const wa=n=>{const c=[...n].pop().charCodeAt(0);return c>=44032&&c<=55203?((c-44032)%28?'과':'와'):'와(과)'};
const ee=n=>{const c=[...n].pop().charCodeAt(0);return c>=44032&&c<=55203?((c-44032)%28?'이':'가'):'이(가)'};
const stage=s=>{const p=s.age/s.base,g=DB[s.sp].gr/(DB[s.sp].avg*12);return p<g?'gro':p<.7?'adu':'sen'};
const SN={gro:'성장기',adu:'성체기',sen:'노년기'};
const SEAS=['겨울','겨울','봄','봄','봄','여름','여름','여름','가을','가을','가을','겨울'];
const monthOf=s=>Math.floor(((s.m0*30.4+s.age)%365)/30.4)%12+1;
const seasonOf=s=>SEAS[monthOf(s)-1];
function ageStr(a){const y=Math.floor(a/365),m=Math.floor(a%365/30.4),d=Math.floor(a%30.4);return y?F('{0}살 {1}개월',y,m):m?F('{0}개월 {1}일',m,d):F('{0}일',d)}
function dateStr(s){return F('{0}년차 {1}월 · {2}',Math.floor(s.age/365)+1,monthOf(s),T(seasonOf(s)))}
const show=h=>$('#app').innerHTML=h;
function popup(h){closeP();const o=document.createElement('div');o.className='ov';o.id='ov';o.innerHTML=`<div class="md">${h}</div>`;document.body.appendChild(o)}
const closeP=()=>{document.querySelectorAll('#ov').forEach(o=>o.remove())};
const INP='width:100%;font:inherit;padding:9px;border-radius:10px;border:1px solid var(--line);background:var(--bg);color:var(--ink)';

// ---------- 동물별 특성 테이블 ----------
// 동물군별 수치 소모 배율 (먹이 · 환경 · 활동 · 유대)
const GD={dog:{act:1.2},cat:{env:1.15},small:{nut:1.1,env:1.2},bird:{act:1.1,bond:1.2},fish:{env:1.3,act:.4,bond:.5},rep:{nut:.6,act:.5,bond:.5},amph:{env:1.25,act:.5,bond:.4},bug:{nut:.8,env:1.1,act:.5,bond:.3},gun:{nut:.8,act:.6,bond:.4}};
// 성격: m=수치 소모/증가 배율, bg=유대감 상승 배율
const TR={timid:{n:'겁쟁이',d:'낯선 일에 쉽게 놀라요',m:{str:1.35}},greedy:{n:'먹보',d:'늘 배고파해요',m:{nut:1.3}},playful:{n:'장난꾸러기',d:'가만히 있질 못해요',m:{act:1.3}},aloof:{n:'독립적',d:'거리를 두는 편이에요',bg:.7},cuddly:{n:'애교쟁이',d:'관심이 늘 고파요',bg:1.3,m:{bond:1.5}},sensitive:{n:'예민함',d:'환경 변화에 민감해요',m:{env:1.3,str:1.2}},curious:{n:'호기심쟁이',d:'뭐든 궁금해해요'},calm:{n:'느긋함',d:'웬만해선 동요하지 않아요',m:{str:.7}}};
const WK={joint:'관절',kidney:'신장',heart:'심장',skin:'피부',digest:'소화기',eyes:'눈'}; // 선천적 약점(사건으로 드러남)
const OR={shop:{n:'분양샵에서 입양'},breeder:{n:'전문 브리더에게 입양',hea:5},friend:{n:'지인에게 분양받음',bond:8},gift:{n:'선물로 받음',hap:3},rescue:{n:'길에서 구조됨',hea:-15,str:15,bond:-8,hap:-10},shelter:{n:'보호센터 출신',str:8,bond:-4,hap:-4}};
// 이별 방식과 입양 심사 평판 감점
const LB={gun:{hea:'기계 상태',hap:'관리 만족',bond:'책임감',nut:'윤활',str:'부식 위험',env:'보관 환경',act:'점검 주기'}};
const lbl=k=>((S&&LB[SP[S.sp][2]])||{})[k]||ST[k];
const LV={police:{n:'관할 경찰서에 자진 반납한다',pen:0,ic:'🏠'},friend:{n:'믿을 만한 지인에게 맡긴다',pen:1,ic:'🏠'},online:{n:'온라인에 분양 글을 올린다',pen:1.5,ic:'🏠'},shelter:{n:'동물보호센터에 인계한다',pen:2,ic:'🏠'},abandon:{n:'낯선 곳에 두고 온다 (유기)',pen:4,ic:'🥀'},release:{n:'자연에 풀어준다 (방생)',pen:5,ic:'🥀'}};
// ---------- 입양 심사 평판 (다음 생애에 영향) ----------
// 히든 펫 확률: 기본 0.025%. 행복한 생애를 보낼 때마다 +0.3%p(최대 5%), 히든 펫을 만나면 0으로 초기화
const hidChance=l=>Math.min(.05,.00025+(l||0)*.003);
const kar=()=>Object.assign({pen:0,ab:0,rh:0,nat:0,luck:0},ld('pls_kar',{}));
const penLabel=p=>T(p<.5?'신뢰 가득 😊':p<2?'조금 주의 🙂':p<4?'낮음 😟':p<7?'위험 😰':'최악 💔');
const penNote=p=>p<.5?'':F('📉 이전 이별 기록 때문에 입양 심사가 까다로워졌어요. 좋은 조건의 아이를 소개받기 어렵고, 낯을 가리거나 상처가 있는 아이가 올 확률이 높아요. 시작 상태와 수명도 불리해요. (평판 {0})',p.toFixed(1));

// ---------- 타이틀 ----------
function okSave(){const v=ld('pls_save',null);return v&&v.v===2&&!v.over&&DB.some(d=>d.ko===v.spn)}
function goTitle(){stopT();closeP();modal=null;rs=0;const sv_=okSave(),K=kar();
show(`<div class="title"><div class="big">🐾</div><h1>${T('한 생애의 반려')}</h1><div class="sub">${T('랜덤 반려동물과 함께하는 단 한 번의 일생')}</div></div>
<div class="menu"><button class="p" onclick="newLife()">${T('입양받으러 가기')}</button>${sv_?`<button onclick="contLife()">${T('이어하기')}</button>`:''}
<button onclick="showHelp()">${T('📖 게임 소개 · 방법')}</button><button onclick="showUrn()">${T('🏺 유골함')}</button><button onclick="showDonate()">${T('후원하기')}</button><button onclick="showSett()">${T('설정')}</button></div>
<div class="langs">${LGS.map(l=>`<button class="${l===LG?'on':''}" onclick="setLang('${l}')">${LNAME[l]}</button>`).join('')}</div>
${K.pen>=.5?`<p class="sub" style="text-align:center">${F('입양 심사 평판: {0}',penLabel(K.pen))}</p>`:''}
<p class="sub" style="text-align:center;margin-top:28px">${T('제작자: 몰리맘과클로드')}</p>`)}
const HELP=[['🌍 배경 이야기','전 세계 어딘가, 당신을 기다리는 단 하나의 반려동물이 있어요. 어떤 아이가 올지는 아무도 몰라요. 강아지일 수도, 햄스터일 수도, 느릿한 거북이나 반짝이는 열대어일 수도 있죠.<br>이 아이와 함께하는 시간은 단 한 번뿐이에요. 어린 시절의 호기심, 한창때의 에너지, 노년의 느린 오후까지. 당신의 선택이 이 아이의 한 생애를 만들어요.',1.6],
['🎯 목표','랜덤으로 만난 동물을 입양해 자연스러운 수명이 다할 때까지 함께하세요. 정답은 없어요. 잘 돌볼수록 행복하고 오래 살지만, 같은 선택도 결과가 달라질 수 있어요.',1.6],
['🎮 기본 방법','① <b>입양받으러 가기</b>를 누르면 룰렛이 돌며 동물이 정해져요.<br>② 이름을 지어 주세요. 어떤 언어든 괜찮아요.<br>③ <b>배속 버튼</b>(⏸ ×1 ×2 ×4 ×6 ×8 ×16)으로 시간을 흘려보내요. 처음엔 멈춰 있어요.<br>④ 동물마다 다른 <b>돌봄 버튼</b>으로 먹이, 환경, 놀이, 건강을 챙겨요.<br>⑤ 시간이 흐르면 <b>사건</b>이 생기고 5~6개의 선택지가 나와요. 선택 순서는 매번 섞이고 결과는 확률로 갈려요.<br>⑥ 건강이 위험해지면 높은 배속에서도 자동으로 멈춰요.',1.7],
['📊 수치 읽는 법','건강, 행복도, 유대감, 영양, 스트레스, 환경, 활동량이 있어요. 스트레스는 낮을수록 좋고 나머지는 높을수록 좋아요.<br>이미 충분한데 과하게 돌보거나 같은 돌봄만 반복하면 오히려 힘들어해요. 여러 가지를 골고루 해 주세요.<br>성격, 입양 경로, 숨은 체질에 따라 아이마다 필요한 게 달라요.',1.7],
['💔 이별과 책임',"끝까지 함께하지 못하고 분양하거나 유기하면 '이별 기록'이 남고 다음 입양 때 불이익이 생겨요. 학대는 수명을 크게 줄이고 깊은 상처를 남겨요.<br>이 게임은 생명의 무게를 생각해 보기 위한 이야기예요. 현실에서 동물 학대와 유기는 범죄예요.",1.7],
['💾 저장과 유골함','진행 상황은 이 브라우저에 자동 저장돼요. 타이틀에서 <b>이어하기</b>로 돌아올 수 있어요. 생애를 마친 아이는 <b>🏺 유골함</b>에 안치돼요. 같은 브라우저와 주소에서만 유지돼요.',1.7],
['✨ 그리고…','아주 아주 낮은 확률로 평범하지 않은 만남이 있다는 소문이 있어요. 직접 확인해 보세요.',1.7]];
function showHelp(){popup(`<h3>${T('📖 게임 소개')}</h3>${HELP.map((h,i)=>`<details${i?'':' open'}><summary><b>${T(h[0])}</b></summary><p class="sub" style="line-height:${h[2]}">${T(h[1])}</p></details>`).join('')}<button onclick="closeP()">${T('닫기')}</button>`)}
function showDonate(){popup(`<h3>${T('후원하기 ☕')}</h3><p class="sub">${T('후원은 전적으로 자율이며 게임 플레이에는 어떤 영향도 없습니다.')}</p><a href="https://buymeacoffee.com/molymom" target="_blank" rel="noopener noreferrer" style="text-decoration:none"><button type="button">☕ Buy Me a Coffee</button></a><button onclick="closeP()">${T('닫기')}</button>`)}
function showSett(){const K=kar();popup(`<h3>${T('설정')}</h3><p class="sub">${T('제작자: 몰리맘과클로드')}</p><p class="sub">${F('동물은 전 세계 반려동물 중에서 무작위로 선정됩니다. (현재 {0}종)',pool().length)}</p><p class="sub">${T('✨ 특별한 인연의 기운:')} ${'●'.repeat(Math.min(5,K.luck))}${'○'.repeat(5-Math.min(5,K.luck))}</p><p class="sub">${F('입양 심사 평판: {0} · 분양/보호소 {1}건 · 유기/방생 {2}건',penLabel(K.pen),K.rh,K.ab)}</p><div class="langs">${LGS.map(l=>`<button class="${l===LG?'on':''}" onclick="setLang('${l}')">${LNAME[l]}</button>`).join('')}</div>${adm?`<button onclick="closeP();admin()">${T('🛠 관리자 패널')}</button>`:`<button onclick="admLogin()">${T('🔑 관리자 로그인')}</button>`}<button onclick="if(confirm(T('저장된 생애와 유골함, 평판을 모두 삭제할까요?'))){['pls_save','pls_rec','pls_kar'].forEach(k=>localStorage.removeItem(k));goTitle()}">${T('저장 데이터 모두 삭제')}</button><button onclick="closeP()">${T('닫기')}</button>`)}

// ---------- 입양 ----------
function rollHidden(){if(Math.random()>=hidChance(kar().luck))return -1;const f=n=>DB.findIndex(d=>d.ko===n),r=Math.random();return r<.2?f('총'):r<.6?f('유니콘'):f('페가수스')} // 총 20% · 유니콘 40% · 페가수스 40%
function newLife(x){if(okSave()&&typeof x!=='number'&&!confirm(T('진행 중인 생애가 있어요. 새로 입양하면 이어하기가 사라집니다. 계속할까요?')))return;
const P=pool();if(!P.length)return alert(T('선택 가능한 동물이 없어요.'));const hid=(typeof x==='number')?-1:rollHidden(),i=(typeof x==='number')?x:(hid>=0?hid:R(P)),b=R(SP[i][4]);if(hid>=0){const K=kar();K.luck=0;sv('pls_kar',K)} // 히든 펫을 만나면 기운 초기화
spin(P,i,b,()=>{closeP();startLife(i,b)})}
// 룰렛 연출: 동물 → 품종 순서로 점점 느려지며 결정
function spin(P,i,b,done){const sp=SP[i];popup(`<div style="text-align:center"><div class="sub">${T('당신의 반려동물은…')}</div><div id="spE" style="font-size:4.5rem;transition:transform .3s">❔</div><h2 id="spN" style="margin:.2em 0">&nbsp;</h2><div id="spB" class="sub">&nbsp;</div></div>`);
const ok=()=>$('#spE');let n=0,TT=24;
const st=()=>{if(!ok())return;if(n<TT){const d=SP[R(P)];$('#spE').textContent=d[1];$('#spN').textContent=d[0];n++;return setTimeout(st,45+n*n*.45)}
$('#spE').textContent=sp[1];$('#spN').textContent=sp[0]+(DB[i].legal.cls==='HIDDEN'?T(' ✨히든 펫!'):'');$('#spE').style.transform='scale(1.25)';let m=0;const bs=sp[4],M=bs.length>1?9:0;
const sb=()=>{if(!ok())return;if(m<M){$('#spB').textContent=R(bs);m++;return setTimeout(sb,60+m*m*5)}$('#spB').textContent=b;$('#spB').style.fontWeight='700';setTimeout(()=>{if(ok())done()},1000)};setTimeout(sb,500)};
st()}
function startLife(i,b){const sp=SP[i],base=sp[3]*365,K=kar(),pen=Math.min(10,K.pen);
// 평판이 낮을수록 상처 있는 아이(구조·보호센터 출신)가 배정될 확률이 올라간다
const tro=Math.random()<Math.min(.85,.12+pen*.08),or=tro?R(['rescue','shelter']):R(['shop','shop','breeder','friend','gift']),O=OR[or];
const tr=R(Object.keys(TR)),wk=(Math.random()<.65&&WKG[sp[2]])?R(WKG[sp[2]].split(' ')):'';
S={v:2,spn:DB[i].ko,sp:i,b,n:R(NM),tr,or,wk,pen,base,L:base*(.85+Math.random()*.3)*(1-Math.min(.2,pen*.02)),age:0,turn:0,m0:Math.floor(Math.random()*12),
hea:C(80-pen*1.2+(O.hea||0)),hap:C(60-pen*2+(O.hap||0)),bond:C(20-pen*2.5+(O.bond||0)),nut:70,str:C(20+pen*3+(O.str||0)),env:80,act:60,bg:Math.max(.5,(1-pen*.04)*(TR[tr].bg||1)),
gh:K.gh||null,next:4,log:[],ev:[],ch:[],last:[],seen:{},al:{},z:0,hs:0,hps:0,bds:0,over:0,ab:0,ms:[],rec:[],mil:[]};
if(K.gh){delete K.gh;sv('pls_kar',K)}
lg(F('{0} {1}({2}·{3})를 입양했습니다. ({4})',sp[1],S.n,sp[0],S.b,O.n));game();
popup(`<h3>${F('{0} 새 가족!',sp[1])}</h3><p>${sp[0]} · ${S.b}<br><span class="sub">${F('평균 수명 약 {0}년 · {1}',sp[3],O.n)}</span></p><p><span class="tag">${F('성격: {0}',TR[tr].n)}</span> <span class="sub">${TR[tr].d}</span></p>${penNote(pen)?`<p class="sub" style="color:var(--bad)">${penNote(pen)}</p>`:''}<p>${T('이름을 지어주세요 (어떤 언어든 자유롭게)')}<br><input id="nmIn" maxlength="40" value="${S.n}" style="${INP};margin-top:6px" onkeydown="if(event.key==='Enter')setName()"></p><button onclick="setName()">${T('시작하기')}</button>`);setTimeout(()=>{const e=$('#nmIn');e&&e.select()},50)}
function setName(){const v=[...($('#nmIn').value||'').trim()].slice(0,20).join('');if(v)S.n=esc(v);const sp=SP[S.sp];S.log=[];lg(F('{0} {1}({2}·{3})를 입양했습니다. ({4})',sp[1],S.n,sp[0],S.b,OR[S.or].n));saveG();closeP();draw();ghostDream()}
function ghostDream(){if(!S||!S.gh)return;const g=S.gh;S.gh=null;const d=ap({str:50}),b0=Math.round(S.bond);S.bond=0;S.ev.push(`${ageStr(S.age)} – `+F('🌙 학대로 떠난 {0}{1} 꿈에 찾아왔다',g.n,ee(g.n)));lg(F('🌙 죽은 {0}{1} {2}의 꿈에 찾아갔어요',g.n,ee(g.n),S.n));saveG();draw();openM(`<h3>${T('🌙 히든 이벤트')}</h3><p>${F('죽은 펫 <b>{0}</b>({1}){2} 내 펫 <b>{3}</b>의 꿈에 찾아갔어요.',g.n,g.sp,ee(g.n),S.n)}</p><p class="sub">${T('아이는 밤새 뒤척이며 불안해해요. 학대의 기억은 이렇게 다음 아이에게까지 그림자를 드리워요.')}</p><p>${chips({str:d.str,bond:-b0})}</p>`,[['…',()=>{}]])}
function contLife(){const v=ld('pls_save',null);if(!v||v.v!==2){localStorage.removeItem('pls_save');return goTitle()}const i=DB.findIndex(d=>d.ko===v.spn);if(i<0){localStorage.removeItem('pls_save');return goTitle()}S=v;S.sp=i;game()}
const lg=t=>{S.log.unshift(t);S.log.length=Math.min(S.log.length,30)};
function saveG(){if(S&&!S.over)sv('pls_save',S)}
window.addEventListener('pagehide',saveG);

// ---------- 유골함 ----------
function showUrn(){const r=ld('pls_rec',[]);const row=(x,i)=>`<div class="card" style="cursor:pointer" onclick="closeP();urnDetail(${i})">${x.k&&x.k!=='nat'?LV[x.k].ic:'🏺'} ${x.e} <b>${x.n}</b><br><span class="sub">${x.sp}${x.b?' · '+x.b:''} · ${x.age}${x.k&&x.k!=='nat'?' · '+LV[x.k].n.replace(/ \(.*\)/,''):''}${x.d?' · '+x.d:''}</span></div>`;
const nat=r.map((x,i)=>[x,i]).filter(([x])=>!x.k||x.k==='nat'),lv=r.map((x,i)=>[x,i]).filter(([x])=>x.k&&x.k!=='nat');
popup(`<h3>${F('🏺 유골함 ({0})',nat.length)}</h3>${nat.length?nat.reverse().map(([x,i])=>row(x,i)).join(''):`<p class="sub">${T('아직 함께 떠나보낸 아이가 없어요.')}</p>`}${lv.length?`<h3 style="margin-top:16px">${F('💔 이별 기록 ({0})',lv.length)}</h3><p class="sub">${T('끝까지 함께하지 못한 아이들이에요.')}</p>${lv.reverse().map(([x,i])=>row(x,i)).join('')}`:''}<button onclick="closeP()">${T('닫기')}</button>`)}
function urnDetail(i){const x=ld('pls_rec',[])[i];if(!x)return;const lvx=x.k&&x.k!=='nat';popup(`<h3>${lvx?LV[x.k].ic:'🏺'} ${x.e} ${x.n}</h3><p class="sub">${x.sp}${x.b?' · '+x.b:''}${x.d?'<br>'+x.d+(lvx?T(' 이별'):T(' 안치')):''}</p><p>${F('함께한 시간 {0}<br>평균 건강 {1} · 행복도 {2} · 유대감 {3}',x.age,x.h,x.hp,x.bd)}</p>${x.tl&&x.tl.length?`<p>${x.tl.map(t=>`<span class="tag">${t}</span>`).join('')}</p>`:''}${x.ev&&x.ev.length?`<p><b>${T('기억에 남는 순간')}</b><br>${x.ev.map(t=>'· '+t).join('<br>')}</p>`:''}${x.top?`<p><b>${T('자주 한 선택')}</b><br>${x.top}</p>`:''}${x.msg?`<p>💌 ${x.msg}</p>`:''}<button onclick="closeP();showUrn()">${T('유골함으로')}</button>${lvx?`<p class="sub">${T('이별 기록은 지울 수 없어요.')}</p>`:`<button onclick="delUrn(${i})">${T('유골함에서 비우기')}</button>`}`)}
function delUrn(i){if(!confirm(T('이 기록을 영구히 삭제할까요?')))return;const r=ld('pls_rec',[]);r.splice(i,1);sv('pls_rec',r);closeP();showUrn()}

// ---------- 관리자 ----------
function admLogin(){closeP();popup(`<h3>${T('🔑 관리자 로그인')}</h3><input id="admPw" type="password" placeholder="${T('관리자 번호')}" style="${INP}" onkeydown="if(event.key==='Enter')admGo()"><button onclick="admGo()">${T('로그인')}</button><button onclick="closeP();showSett()">${T('취소')}</button>`);setTimeout(()=>{const e=$('#admPw');e&&e.focus()},50)}
function admGo(){if(h53($('#admPw').value)===ADMH){adm=true;closeP();admin()}else alert(T('번호가 올바르지 않습니다.'))}
const admSet=(k,v)=>{AD[k]=v;sv('pls_adm',AD)};
function admReset(){AD={dk:1,ev:1,ab:7,ts:1};sv('pls_adm',AD);closeP();admin()}
function admin(){const sl=(k,l,mn,mx,st)=>`<label class="sub" style="display:block;margin-top:8px">${l} <b>${AD[k]}</b><input type="range" min="${mn}" max="${mx}" step="${st}" value="${AD[k]}" style="width:100%" oninput="admSet('${k}',+this.value);this.previousElementSibling.textContent=this.value"></label>`;
const live=S&&!S.over&&$('#nm'),K=kar();
popup(`<h3>🛠 관리자 패널</h3><p class="sub">이 기기 브라우저에만 적용되는 조율 도구입니다.</p>${sl('dk','수치 소모 속도 ×',.3,2,.1)}${sl('ev','사건 발생 간격 ×',.5,2,.1)}${sl('ab','학대 1회당 수명 감소 %',0,15,1)}${sl('ts','시간 진행 속도 ×',.5,2,.1)}
<button onclick="admReset()">조율값 초기화</button>
<p><b>동물 지정 입양 (테스트)</b></p><select id="admSp" style="${INP}">${DB.map((d,i)=>`<option value="${i}">${d.emoji} ${d.ko} (${d.legal.cls})</option>`).join('')}</select><button onclick="admSpawn()">선택한 동물로 새 생애</button>
${live?`<p><b>현재 생애 도구</b></p><button onclick="admTool(0)">수치 모두 회복</button><button onclick="admTool(1)">사건 즉시 발생</button><button onclick="admTool(2)">나이 +10% 건너뛰기</button><button onclick="admTool(3)">학대 기록 초기화</button>`:''}
<p><b>입양 심사 평판</b> <span class="sub">현재 ${K.pen.toFixed(1)}</span></p><button onclick="sv('pls_kar',Object.assign(kar(),{pen:0,ab:0,rh:0,nat:0}));closeP();admin()">평판 초기화</button><p class="sub">히든 펫 확률 ${(hidChance(K.luck)*100).toFixed(3)}% (행복한 생애 누적 ${K.luck}회)</p><button onclick="sv('pls_kar',Object.assign(kar(),{luck:kar().luck+1}));closeP();admin()">행운 +1 (테스트)</button><button onclick="sv('pls_kar',Object.assign(kar(),{luck:0}));closeP();admin()">행운 초기화</button>
<p><b>데이터 백업</b></p><textarea id="admIO" rows="3" style="${INP}"></textarea><button onclick="admIO(0)">내보내기</button><button onclick="admIO(1)">가져오기</button>
<button onclick="adm=false;closeP()">로그아웃</button><button onclick="closeP()">닫기</button>`)}
function admSpawn(){const v=+$('#admSp').value;closeP();newLife(v)} // 값을 먼저 읽은 뒤 팝업을 닫는다 (닫으면 select가 사라짐)
function admTool(i){closeP();if(!S||S.over)return;if(i===0){['hea','hap','bond','nut','env','act'].forEach(k=>S[k]=100);S.str=0;S.z=0;S.al={}}else if(i===1){if(!modal)event()}else if(i===2)S.age+=S.base*.1;else S.ab=0;draw()}
function admIO(m){const t=$('#admIO');if(!m){t.value=JSON.stringify({save:ld('pls_save',null),rec:ld('pls_rec',[]),kar:kar(),adm:AD});return}try{const o=JSON.parse(t.value);if(o.rec)sv('pls_rec',o.rec);if(o.save)sv('pls_save',o.save);if(o.kar)sv('pls_kar',o.kar);if(o.adm){AD=Object.assign(AD,o.adm);sv('pls_adm',AD)}alert('가져왔습니다.')}catch{alert('형식이 올바르지 않습니다.')}}

// ---------- 육성 화면 ----------
function game(){paused=true;spd=0;rs=0;const sp=SP[S.sp];
show(`<div class="card"><div class="row"><b id="nm"></b><span class="sub" id="ag"></span></div><div class="sub" id="dt"></div>
<div class="pet" id="pet">${sp[1]}</div><div style="text-align:center" id="meta"></div><div class="bars">${Object.keys(ST).map(k=>`<div class="bar">${lbl(k)} <span id="v${k}"></span><i><b id="b${k}"></b></i></div>`).join('')}</div></div>
<div class="card row"><span>${T('⏱ 배속')}</span><span id="sp">${[0,1,2,4,6,8,16].map(x=>`<button data-x="${x}" onclick="setSpd(${x})">${x?'×'+x:T('잠시 멈추기')}</button>`).join('')}</span></div>
<div class="card"><div class="acts">${G[sp[2]].map((a,i)=>`<button onclick="doAct(${i})"><span class="ex"></span>${a[0]}</button>`).join('')}</div><div class="sub" style="margin-top:8px">${T('같은 돌봄을 반복하거나, 이미 충분한 상태에서 과하게 하면 오히려 해로워요.')}</div></div>
${sp[2]==='gun'?'':`<div class="card"><details><summary style="color:var(--bad);cursor:pointer">${T('⚠ 학대 (절대 권장하지 않아요)')}</summary><p class="sub">${T('학대는 돌이킬 수 없는 상처를 남기고 수명을 크게 줄입니다.')}</p><div class="acts">${AB.map((a,i)=>`<button style="border-color:var(--bad)" onclick="doAbuse(${i})">${a[0]}</button>`).join('')}</div></details></div>`}
<div class="card"><details><summary style="cursor:pointer">${T('💔 이별하기 (분양 · 유기)')}</summary><p class="sub">${T("끝까지 함께하지 못하면 이 아이와의 기록은 '이별 기록'으로 남고, 다음 입양 때 불이익이 생겨요.")}</p><button onclick="leaveMenu()">${T('이별 방법 고르기')}</button></details></div>
<div class="card log" id="log"></div><div class="row"><button onclick="saveG();goTitle()">${T('저장 후 타이틀로')}</button></div>`);
applySpd(0);draw();stopT();tm=setInterval(loop,100)}
function stopT(){clearInterval(tm);tm=null}
function applySpd(x){spd=x;paused=!x;document.querySelectorAll('#sp button').forEach(b=>b.classList.toggle('on',+b.dataset.x===x))}
function setSpd(x){if(modal||!S||S.over)return;rs=0;applySpd(x)}
function ap(e){const d={};for(const k in e){const b=S[k];S[k]=C(b+e[k]);d[k]=Math.round(S[k]-b)}return d}
const chips=d=>Object.keys(d).filter(k=>d[k]).map(k=>{const good=k==='str'?d[k]<0:d[k]>0;return `<span class="chip ${good?'up':'dn'}">${lbl(k)} ${d[k]>0?'+':''}${d[k]}</span>`}).join('')||`<span class="sub">${T('큰 변화는 없었다')}</span>`;
const sumD=d=>Object.keys(d).filter(k=>d[k]).map(k=>`${lbl(k)}${d[k]>0?'+':''}${d[k]}`).join(' ');
// 돌봄: 쿨타임은 없지만 '과한 돌봄'과 '같은 행동 반복'은 오히려 해롭다
// 긴급 돌봄: 정말 필요할 때(수치 {nut,env,hea}<30) ❗가 뜨고, 빨리 누를수록 효과가 크고 늦을수록 줄어든다
const URG={nut:30,env:30,hea:30};
function urgOf(i){const a=G[SP[S.sp][2]][i],m=Object.keys(E[a[1]])[0];return URG[m]!==undefined&&S[m]<URG[m]}
function urgSync(){if(!S)return;S.nd=S.nd||{};G[SP[S.sp][2]].forEach((a,i)=>{if(urgOf(i)){if(S.nd[i]==null)S.nd[i]=S.turn}else delete S.nd[i]})}
const urgMul=i=>S.nd&&S.nd[i]!=null?Math.max(.4,1.6-(S.turn-S.nd[i])*.2):1;
function fx(d){const p=$('#pet');if(!p)return;const r=p.getBoundingClientRect(),el=document.createElement('div');el.innerHTML=chips(d);el.style.cssText=`position:fixed;left:${r.left+r.width/2}px;top:${r.top+r.height}px;transform:translateX(-50%);z-index:50;pointer-events:none;transition:all 1.2s ease-out;opacity:1;white-space:nowrap;font-size:1.05rem`;document.body.appendChild(el);requestAnimationFrame(()=>{el.style.top=(r.top-30)+'px';el.style.opacity='0'});setTimeout(()=>el.remove(),1400)}
function doAct(i){if(modal||S.over)return;const a=G[SP[S.sp][2]][i],key=a[1],base=E[key],main=Object.keys(base)[0];
S.rec=(S.rec||[]).filter(r=>S.turn-r.t<=6);const same=S.rec.filter(r=>r.k===a[0]).length,kinds=new Set(S.rec.map(r=>r.k)).size,seen=S.rec.some(r=>r.k===a[0]);
let e={};for(const k in base){e[k]=Math.round(base[k]*(.8+Math.random()*.4));if(k==='bond'&&e[k]>0)e[k]=Math.round(e[k]*S.bg)}
const ag=Math.max(0,Math.min(1,(S.age/S.L-.5)/.5));if(e.act>0)e.act=Math.round(e.act*(1-.4*ag)); // 수명 50% 이후부터 나이가 들수록 활동량이 덜 오른다(최대 -40%)
let note='';const th=key==='bond'?96:88;const um=urgMul(i),wasU=S.nd&&S.nd[i]!=null;
// 이 돌봄이 채워 주는 수치들(효과 5 이상, 스트레스는 -5 이하) 중 하나라도 부족하면 '필요한 돌봄'으로 본다
const tgt=Object.keys(base).filter(k=>k==='str'?base[k]<=-5:base[k]>=5),full=k=>k==='str'?S.str<=15:S[k]>=(k==='bond'?96:88),comfy=k=>k==='str'?S.str<=35:S[k]>=70;
if(!wasU&&tgt.every(full)){e={hea:-3,str:5,hap:-2};note=T(' — 이미 충분한데 과하게 해서 힘들어해요.')}
else if(!wasU&&same>=2&&tgt.every(comfy)){for(const k in e)e[k]=Math.round(e[k]*.55);e.str=(e.str||0)+2;e.hap=(e.hap||0)-2;note=T(' — 같은 것만 반복해서 지루해해요.')}
else if(!seen&&kinds>=2){e.hap=(e.hap||0)+3;note=T(' — 다양한 돌봄에 즐거워해요.')}
if(wasU){for(const k in e)e[k]=Math.round(e[k]*um);note+=um>=1.3?T(' ⚡ 제때 챙겨 효과가 커요!'):um>=.8?T(' — 조금 늦었지만 도움이 됐어요.'):T(' — 너무 늦어 효과가 적어요.');delete S.nd[i]}
const d=ap(e);fx(d);S.rec.push({k:a[0],t:S.turn});S.ch.push(a[0]);lg(`${a[0]} (${sumD(d)||T('변화 없음')})${note}`);draw()}
const AB=[['큰 소리로 윽박지른다',{str:25,hap:-15,bond:-12,hea:-4},'움츠러들며 눈치를 본다.'],['거칠게 다룬다',{str:30,hap:-20,bond:-18,hea:-12},'겁에 질려 당신을 피한다.'],['먹이를 주지 않는다',{nut:-35,hap:-15,str:15,hea:-8},'빈 그릇 앞에서 기운 없이 당신을 바라본다.'],['좁은 곳에 가둔다',{env:-30,act:-25,str:25,hap:-15},'웅크린 채 떨고 있다.']];
function doAbuse(i){if(modal||S.over)return;const a=AB[i];ap(a[1]);S.ab=(S.ab||0)+1;S.ch.push(a[0]);S.ev.push(`${ageStr(S.age)} – `+F('학대: {0}',a[0]));lg(`⚠ ${a[0]} → ${S.n} ${a[2]}`);draw()}
function draw(){if(!$('#nm')||!S)return;const sp=SP[S.sp];$('#nm').innerHTML=`${sp[1]} ${S.n} (${sp[0]}·${S.b})`;$('#ag').textContent=`${ageStr(S.age)} · ${SN[stage(S)]}`;$('#dt').textContent=dateStr(S);
$('#meta').innerHTML=`<span class="tag">${F('성격: {0}',TR[S.tr].n)}</span><span class="tag">${OR[S.or].n}</span>${S.pen>=.5?`<span class="tag">${F('평판 {0}',penLabel(S.pen))}</span>`:''}`;
for(const k in ST){const v=Math.round(S[k]);$('#v'+k).textContent=v;const b=$('#b'+k);b.style.width=v+'%';const bad=k==='str'?v>70:v<30;b.style.background=bad?'var(--bad)':'var(--ok)'}
$('#pet').style.filter=S.hea<30?'grayscale(.7)':'';urgSync();document.querySelectorAll('.acts button').forEach((b,i)=>{const u=S.nd&&S.nd[i]!=null,x=b.firstChild;if(x&&x.className==='ex'){x.textContent=u?'❗':'';b.classList.toggle('urg',!!u);if(u)x.title=Math.round(urgMul(i)*100)+'%'}})
$('#log').innerHTML=S.log.slice(0,8).map(t=>`<div>${t}</div>`).join('')}

// ---------- 시간 진행 ----------
function loop(){if(!S||paused||modal||S.over)return;const sp=SP[S.sp],tg=Math.min(1100,300+80*Math.sqrt(sp[3])); // 종별 수명 기반 개별 시간 배율(1배속 약 7~18분)
S.age+=S.base*.1*spd*AD.ts/tg;const tl=S.base/240;let g=0;while(!modal&&!S.over&&S.age>=(S.turn+1)*tl&&g++<8)tick();draw()}
function tick(){const s=S,t=TR[s.tr],m=t.m||{},gd=GD[SP[s.sp][2]]||{},dk=AD.dk;s.turn++;
s.nut-=1.5*dk*(m.nut||1)*(gd.nut||1);s.env-=1.1*dk*(m.env||1)*(gd.env||1);s.act-=1.2*dk*(m.act||1)*(gd.act||1)*(1-.3*Math.max(0,Math.min(1,(s.age/s.L-.5)/.5)));s.bond-=.15*dk*(m.bond||1)*(gd.bond||1);
const bad=(s.nut<25)+(s.env<25)+(s.str>75)+(s.act<15);
s.hea+=bad?-.9*bad:(s.nut>50&&s.env>50?.25:0);if(stage(s)==='sen')s.hea-=.15;if(s.wk&&bad)s.hea-=.2;
s.hap+=(s.nut<35||s.env<35||s.act<25)?-1.3:(s.hap<70?.4:0);s.str+=(s.nut<35||s.env<35)?1.2*(m.str||1):(s.str>20?-.8:0);
for(const k in ST)s[k]=C(s[k]);s.hs+=s.hea;s.hps+=s.hap;s.bds+=s.bond;s.z=s.hea<=0?s.z+1:0;
if(s.turn%5===0)saveG();
const hv=s.hs/s.turn/100,eff=s.L*(SP[s.sp][2]==='gun'?.6+.8*hv:.92+.16*hv)*(1-Math.min(.75,(s.ab||0)*AD.ab/100));
if(s.age>=eff||s.z>=10)return finish('nat');
// 자동 정지: 건강 이상은 높은 배속에서도 놓치지 않음
for(const [k,th,mm] of [['nut',15,T('영양이 매우 부족해요')],['env',15,T('환경이 엉망이에요')],['hea',25,T('건강이 위험해요')],['str',85,T('스트레스가 너무 높아요')]]){const lo=k==='str'?s[k]>th:s[k]<th;if(lo&&!s.al[k]){s.al[k]=1;return alertM(SP[s.sp][2]==='gun'?F('{0} 수치가 위험해요',lbl(k)):mm)}if(!lo)s.al[k]=0}
// 생애 25% / 50% / 75% 지점의 기념 사건
for(const [n,fr] of [[1,.25],[2,.5],[3,.75]]){if(s.age>=s.L*fr&&!s.mil.includes(n)){s.mil.push(n);return milestone(n)}}
for(const [i,th] of [[0,40],[1,70],[2,90]]){if(s.bond>=th&&!s.ms.includes(i)){s.ms.push(i);const ln=msl(s.sp,i);if(!ln)continue;lg(F('💞 {0}{1} {2}',s.n,eun(s.n),ln));s.ev.push(`${ageStr(s.age)} – `+F('💞 {0}{1} {2}',s.n,eun(s.n),ln));return openM(`<h3>${T('💞 특별한 순간')}</h3><p>${F('{0}{1} {2}',s.n,eun(s.n),ln)}</p>`,[[T('소중히 마음에 새긴다'),()=>{ap({hap:5,str:-4,bond:2});draw()}]])}}
if(--s.next<=0){s.next=Math.max(2,Math.round((5+Math.floor(Math.random()*5))*AD.ev));event()}}
function alertM(m){lg('⚠ '+m);openM(`<h3>${T('⚠ 주의')}</h3><p>${F('{0}: {1}. 돌봐주세요.',S.n,m)}</p>`,[[T('확인'),()=>{}]])}

// ---------- 모달 / 이벤트 ----------
function openM(h,ch){if(spd>0)rs=spd;modal=1;applySpd(0);popup(h+ch.map((c,i)=>`<button onclick="pickCh(${i})">${c[0]}</button>`).join(''));window._ch=ch}
function pickCh(i){const f=window._ch[i][1];closeP();modal=null;f&&f();if(!modal&&rs>0&&S&&!S.over){applySpd(rs);rs=0}}
function pickEvent(){const s=S,g=SP[s.sp][2],st=stage(s),se=seasonOf(s),fr=s.age/s.L;
const ok=e=>!e.man&&(!e.g||e.g.includes(g))&&(!e.st||e.st===st)&&(!e.iq||(IQ(s.sp)>=e.iq[0]&&IQ(s.sp)<=e.iq[1]))&&(!e.tr||e.tr===s.tr)&&(!e.or||e.or===s.or)&&(!e.wk||e.wk===s.wk)&&(!e.se||e.se.includes(se))&&(!e.af||fr>=e.af)&&(!e.ko||e.ko.includes(DB[s.sp].ko))&&!(e.xg&&e.xg.includes(g))&&!(g==='gun'&&!(e.g&&e.g.includes('gun')));
let P=EV.filter(e=>ok(e)&&!s.last.includes(e.id));if(!P.length)P=EV.filter(ok);if(!P.length)return null;
// 많이 나온 사건일수록 확률이 줄어 매번 다른 흐름이 된다
const W=P.map(e=>Math.max(.02,(typeof e.w==='function'?e.w(s):1)*(e.g?1.6:1)*((e.tr||e.or||e.wk)?2.2:1)/(1+(s.seen[e.id]||0)*1.3)));
let r=Math.random()*W.reduce((a,b)=>a+b,0),e=P[0];for(let i=0;i<P.length;i++){r-=W[i];if(r<=0){e=P[i];break}}return e}
function buildChoices(e){const g=SP[S.sp][2],ok=q=>!q.g||q.g.includes(g);
let c=e.c.concat(EXTRA_Q[e.id]||[]).filter(ok);const used=new Set(c.map(q=>q.l)),need=5+(Math.random()<.45?1:0);
// 1) 내용이 맞는 사건만 종류별 풀에서, 2) 그래도 모자라면 어떤 상황에도 말이 되는 '태도' 선택지로 채운다 (총은 전용 풀만)
const src=g==='gun'?[...shuf(CP.gun)]:[...shuf(FP[e.id]?CP[FP[e.id]]:[]),...shuf(CP.any)];
for(const q of src){if(c.length>=need)break;if(ok(q)&&!used.has(q.l)){c.push(q);used.add(q.l)}}
return shuf(c.slice(0,6))}
function resolveQ(q){const os=q.o.filter(o=>o.p>0);let pk=os[0],r=Math.random();for(const o of os){r-=o.p;if(r<=0){pk=o;break}}
if(os.length>1&&Math.random()<.08)pk=os.find(o=>o!==pk); // 8% 확률로 예상 밖의 결과
const e={};for(const k in pk.e){let v=Math.round(pk.e[k]*(.75+Math.random()*.5));if(k==='bond'&&v>0)v=Math.round(v*S.bg);e[k]=v}return {e,m:pk.m}}
const tx=e=>typeof e.t==='function'?e.t(S):e.t;
function event(e){const s=S,sp=SP[s.sp];e=e||pickEvent();if(!e)return;s.last.push(e.id);if(s.last.length>10)s.last.shift();s.seen[e.id]=(s.seen[e.id]||0)+1;
const cs=buildChoices(e);openM(`<h3>${CAT_ICON[e.cat]||'🐾'} ${sp[1]} ${T('사건')}</h3><p>${tx(e)}</p>`,cs.map(q=>[q.l,()=>{const r=resolveQ(q),d=ap(r.e);s.ch.push(q.l);s.ev.push(`${ageStr(s.age)} – ${tx(e)}`);lg(`${q.l} → ${r.m}`);saveG();draw();openM(`<p>${r.m}</p><p>${chips(d)}</p>`,[[T('계속'),()=>{}]])}]))}
function milestone(n){const s=S,sp=SP[s.sp],tx=[T('벌써 생애의 4분의 1을 함께했어요.'),T('어느덧 생애의 절반을 함께 지나왔어요.'),T('이제 생애의 4분의 3을 지나, 노년의 문턱에 서 있어요.')][n-1];
const gn=sp[2]==='gun';event({id:'mil'+n,cat:gn?'gun':'funT(',man:1,t:F('{0} ({1}) 이 시간을 어떻게 보낼까요?',tx,ageStr(s.age)),c:gn?[Q(')전문가에게 정밀 점검을 받는다',{hea:14,bond:5},T('모든 부품이 양호하다는 결과를 받았다.'),{hea:4},T('소모품 교체가 필요하다고 한다.'),.8),Q(T('부품 상태를 기록하고 꼼꼼히 정비한다'),{hea:10,nut:12,env:6},T('정비 기록이 한 장 더 쌓였다.'),{hea:4,nut:5},T('기록은 남겼지만 큰 변화는 없었다.'),.8),Q(T('보관함과 서류를 재점검한다'),{env:12,bond:8},T('모든 것이 안전하게 갖춰져 있다.'),{env:5,bond:3},T('갱신할 서류가 하나 있었다.'),.8)]:[Q(T('가장 좋아하는 것으로 하루를 가득 채워 준다'),{hap:14,bond:8,act:8},T('평생 기억에 남을 하루가 되었다.'),{hap:6,bond:3},T('아이는 평소처럼 지냈다.'),.85),Q(T('건강검진을 꼼꼼히 받는다'),{hea:12,str:5},T('지금까지의 몸 상태를 확인했다.'),{hea:4,str:9},T('병원이 힘들었지만 안심이 되었다.'),.8),Q(T('사진과 영상으로 오늘을 기록한다'),{bond:5,hap:3},T('소중한 기록이 쌓였다.'),{bond:2,str:3},T('카메라가 부담스러웠다.'),.8),Q(T('특별한 일 없이 조용히 곁에서 시간을 보낸다'),{bond:7,str:-5,hap:3},T('평범한 하루가 가장 큰 선물이었다.'),{bond:2},T('아이는 평소와 같은 하루였다.'),.85),Q(T('가까운 사람들과 함께 작은 축하를 한다'),{hap:8,bond:4,str:5},T('모두가 아이를 축하해 주었다.'),{str:12,hap:-3},T('북적임에 아이가 지쳐 버렸다.'),.5)]})}

// ---------- 이별 (분양 · 유기) ----------
function leaveMenu(){if(modal||S.over)return;popup(`<h3>${T('💔 이별 방법')}</h3><p class="sub">${T('정말 이별해야 한다면, 어떻게 보낼지 선택하세요. 선택에 따라 다음 입양에 영향이 있어요.')}</p>${(SP[S.sp][2]==='gun'?['police']:Object.keys(LV).filter(k=>k!=='police')).map(k=>`<button onclick="leaveConfirm('${k}')">${LV[k].n}</button>`).join('')}<button onclick="closeP()">${T('마음을 고쳐먹는다')}</button>`)}
function leaveConfirm(k){const L=LV[k],b=Math.round(S.bond);const real=k==='abandon'?T('현실에서 반려동물을 유기하는 것은 동물보호법상 처벌 대상이에요.'):k==='release'?T('방생은 아이에게도, 그 지역의 생태계에도 치명적일 수 있어요.'):'';
popup(`<h3>${F('정말 {0}{1} 이별할까요?',S.n,wa(S.n))}</h3><p>${F('{0}{1} 당신에게 쌓은 유대감은 <b>{2}</b>입니다.',S.n,ee(S.n),b)}</p><p class="sub">${L.n}<br>${F('다음 입양의 평판이 <b>-{0}</b> 만큼 떨어져요.',L.pen)}${real?'<br>'+real:''}</p><button onclick="doLeave('${k}')">${T('그래도 보낸다')}</button><button onclick="closeP()">${T('다시 생각해 볼래')}</button>`)}
function doLeave(k){closeP();finish(k)}

// ---------- 생애 종료 (자연사 · 이별) ----------
function titlesOf(s,h,hp,bd){const t=[];if(s.age>=s.L*1.02)t.push(T('장수한 아이'));if(!s.ab&&bd>=70)t.push(T('평생의 단짝'));if(hp>=75)t.push(T('행복한 한 생애'));if(s.ev.length>=25)t.push(T('파란만장한 삶'));if(s.ms&&s.ms.length>=3)t.push(T('마음을 활짝 연 아이'));if(s.or==='rescue'&&bd>=55)t.push(T('새 삶을 찾은 아이'));if(s.ab>0)t.push(T('상처 입은 아이'));if(h<45)t.push(T('아픈 날이 많았던 아이'));return t.slice(0,3)}
function finish(kind){const s=S,sp=SP[s.sp],nat=kind==='nat';s.over=1;paused=true;stopT();modal=null;rs=0;closeP();
const n=Math.max(1,s.turn),h=Math.round(s.hs/n),hp=Math.round(s.hps/n),bd=Math.round(s.bds/n),K=kar();
const cnt={};s.ch.forEach(c=>cnt[c]=(cnt[c]||0)+1);const top=Object.entries(cnt).sort((a,b)=>b[1]-a[1]).slice(0,4).map(x=>F('{0}({1}회)',x[0],x[1])).join(', ');
const early=(s.ab||0)>0&&s.age<s.L*.9,loved=!(s.ab>0)&&bd>=55&&hp>=60,tl=titlesOf(s,h,hp,bd);
let hd,body,penTxt='';
if(nat){
 const lost=Math.max(0,(s.L-s.age)/365);
 const gl=early?F('{0}{1} {2}밖에 살지 못했습니다. 건강히 돌봤다면 약 {3}년을 더 함께할 수 있었을 거예요. 당신이 {4}번 가한 학대가 이 아이의 시간을 앗아갔습니다. {0}{5} 당신을 원망했을까요? 어쩌면 끝내 이유도 모른 채, 그저 당신의 발소리를 기다렸을지도 모릅니다. 이제는 미안하다는 말도 닿지 않습니다. 현실의 생명은 되돌릴 수 없고, 동물 학대는 범죄입니다.',s.n,eun(s.n),ageStr(s.age),lost.toFixed(1),s.ab,ee(s.n)):'';
 const lm=F('{0}{1} 당신과 보낸 시간을 오래도록 기억할 거예요. 사랑을 가득 받고 자란 아이는 무지개다리 너머에서도 당신을 기다리고 있을 거예요.',s.n,eun(s.n));
 const msg=T(hp>=65&&bd>=50?'가장 따뜻한 시간을 보냈습니다. 마지막 순간까지 곁에는 당신이 있었어요.':hp>=45?'평범하지만 소중한 한 생애였습니다. 함께한 하루하루가 추억이 되었어요.':'아쉬움이 남는 생애였지만, 이제 편히 쉬기를 바랍니다.');
 hd=early?F('{0}{1} 끝내 당신 곁을 떠났어요 🥀',s.n,eun(s.n)):loved?F('{0}{1} 무지개다리 너머에서<br>당신을 기다리고 있어요 🌈',s.n,eun(s.n)):F('{0}{1} 내 곁을 떠나<br>무지개다리를 건넜어요 🌈',s.n,eun(s.n));
 body=gl?`<p style="color:var(--bad)"><b>💔 ${gl}</b></p>`:`<p>💌 ${loved?lm:msg}<br><span class="sub">${DB[s.sp].end}</span></p>`;
 K.nat++;K.pen=Math.max(0,K.pen+(early?2:loved?-1.5:-.5));if(loved)K.luck=(K.luck||0)+1;
 var recMsg=gl||(loved?lm:msg)+' '+DB[s.sp].end;
 if(early&&s.ab>=3)K.gh={n:s.n,sp:sp[0]}; // 잦은 학대로 떠난 아이는 다음 아이의 꿈에 찾아간다
 penTxt=early?T('📉 학대로 일찍 떠나보낸 기록이 입양 심사 평판을 깎았어요.'):loved?T('📈 사랑받은 생애 덕분에 입양 심사 평판이 올랐어요. ✨ 특별한 인연의 기운도 커졌어요.'):'';
 if(sp[2]==='gun'){const good=hp>=55&&bd>=50;hd=F('{0}의 수명이 다했어요 🔧',s.n);body=good?`<p>💌 ${T('끝까지 안전하게 보관·관리된, 책임감 있는 소유자의 기록으로 남았어요.')}<br><span class="sub">${DB[s.sp].end}</span></p>`:`<p style="color:var(--bad)">${T('관리가 소홀해 일찍 녹슬고 낡아 버렸어요. 방치된 총기는 큰 사고로 이어질 수 있어요. 현실에서는 허가와 안전 보관이 필수예요.')}</p>`;recMsg=good?T('안전하게 관리된 채 수명을 다했다.'):T('관리 소홀로 일찍 낡아 버렸다.');penTxt=''}
}else{
 const L=LV[kind],b=bd,lostC=Math.random()>=.6;const TT={police:[T('총은 관할 경찰서에 정식 절차로 반납되었어요. 끝까지 책임 있는 마무리였어요.')],friend:[F('지인은 {0}{1} 끔찍이 아껴 주고 있어요. 하지만 {0}{2} 가끔 당신의 발소리를 기다리곤 해요.',s.n,eul(s.n),eun(s.n)),T('새 집에서 잘 적응했다는 소식을 들었어요. 그래도 당신의 빈자리는 남아 있겠죠.')],
 online:!lostC?[F('분양받은 가족이 사진을 보내왔어요. {0}{1} 사랑받고 있는 모습이에요.',s.n,eun(s.n))]:[F('연락이 끊겼어요. {0}{1} 어떤 삶을 살았는지 이제 알 방법이 없어요.',s.n,ee(s.n))],
 shelter:Math.random()<.5?[F('센터 직원이 {0}{1} 따뜻하게 맞아 주었어요. 새 가족을 기다리고 있어요.',s.n,eul(s.n))]:[F('센터에서 새 가족을 기다리는 시간은 길어요. {0}{1} 당신이 떠난 문만 바라보고 있어요.',s.n,eun(s.n))],
 abandon:[F('{0}{1} 낯선 곳에 홀로 남겨졌어요. 한참 동안 당신이 떠난 방향만 바라보았어요. 길 위의 삶은 길지 않았어요.',s.n,eun(s.n))],
 release:[F('낯선 땅에서 {0}{1} 살아남는 법을 몰랐어요. 방생은 아이에게도, 그 땅의 생태계에도 해로운 일이에요.',s.n,eun(s.n))]};
 const t=R(TT[kind]);hd=kind==='police'?F('{0}{1} 정식 절차로 반납되었어요 🏛️',s.n,eun(s.n)):kind==='abandon'||kind==='release'?F('{0}{1}<br>끝까지 지키지 못했어요 🥀',s.n,eul(s.n)):F('{0}{1} 이별했어요 💔',s.n,wa(s.n));
 const guilt=b>=60?`<br><span class="sub">${F('유대감이 {0}나 쌓인 아이였어요. {1}{2} 마지막까지 당신을 믿었을지도 몰라요.',b,s.n,eun(s.n))}</span>`:'';
 const real=kind==='abandon'?`<p class="sub">${T('현실에서 반려동물을 유기하는 것은 동물보호법상 처벌 대상이에요. 어쩔 수 없다면 꼭 책임 있는 방법으로 새 가족을 찾아 주세요.')}</p>`:kind==='release'?`<p class="sub">${T('현실에서 키우던 동물을 자연에 풀어주는 것은 절대 해서는 안 돼요.')}</p>`:'';
 body=`<p style="color:var(--bad)">${t}${guilt}</p>${real}`;
 const add=L.pen+(b>=60?.5:0)+(kind==='online'&&lostC?1:0);if(kind==='police')K.pen=Math.max(0,K.pen-.5);else{K.pen=Math.min(15,K.pen+add);if(kind==='abandon'||kind==='release')K.ab++;else K.rh++}
 var recMsg=t;penTxt=kind==='police'?'':F('📉 입양 심사 평판 -{0}. 다음 입양에 불이익이 있어요.',add);
}
sv('pls_kar',K);localStorage.removeItem('pls_save');
const r=ld('pls_rec',[]);r.push({k:kind,e:sp[1],n:s.n,sp:sp[0],b:s.b,age:ageStr(s.age),h,hp,bd,top,tl,ev:s.ev.slice(-6),msg:recMsg,d:new Date().toISOString().slice(0,10)});if(r.length>300)r.shift();sv('pls_rec',r);
show(`<div class="title"><div class="big">${sp[1]}</div><h1 style="font-size:1.6rem;line-height:1.4">${hd}</h1><div class="sub">${F('{0} · {1} · 성격 {2} · {3}',sp[0],s.b,TR[s.tr].n,OR[s.or].n)}</div></div>
<div class="card"><p><b>${F('함께한 시간 {0}',ageStr(s.age))}</b> ${F('({0}년차까지)',Math.floor(s.age/365)+1)}<br>${F('평균 건강 {0} · 행복도 {1} · 유대감 {2}',h,hp,bd)}</p>${tl.length?`<p>${tl.map(x=>`<span class="tag">🏅 ${x}</span>`).join('')}</p>`:''}
<p><b>${T('주요 사건')}</b><br>${s.ev.slice(-6).map(x=>'· '+x).join('<br>')||'· '+T('조용한 삶이었어요.')}</p><p><b>${T('자주 한 선택')}</b><br>${top||'-'}</p>
<p><b>${T('요약')}</b> ${F('{0} {1}{2} {3}를 살았다.',sp[0],s.n,eun(s.n),ageStr(s.age))}</p>${body}${penTxt?`<p class="sub">${F('{0} (현재 {1})',penTxt,penLabel(K.pen))}</p>`:''}</div>
<div class="menu"><div class="sub" style="text-align:center">${nat?F('🏺 {0}의 유골함이 안치되었습니다.',s.n):T('💔 이별 기록으로 남았습니다.')}</div><button onclick="showUrn()">${T('🏺 유골함 보기')}</button><button class="p" onclick="newLife()">${T('새 동물 입양하기')}</button><button onclick="goTitle()">${T('타이틀로')}</button></div>`)}
const eul=n=>{const c=[...n].pop().charCodeAt(0);return c>=44032&&c<=55203?((c-44032)%28?'을':'를'):'을(를)'};
window.addEventListener('error',e=>{console.error('게임 오류:',e.message)});

i18nInit();goTitle();
