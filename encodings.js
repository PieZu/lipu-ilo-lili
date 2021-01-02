// load data
const specialchar = /[-\/\\^$*+?.()[\]{}]/g
const byLength = (a,b)=>b.length-a.length // biggest go first so "kalamamusi" -> ["kalama", "musi"] instead of ["kala", "ma", "musi"]
class Encoding {
	constructor(arg) {
		if (!arg) arg={}
		this.mapping = arg.mapping||{}
		this.wordlist = arg.wordlist||Object.keys(this.mapping).sort(byLength)
		this.matchword = new RegExp(this.wordlist.map(x=>x.replace(specialchar, '\\$&')).join("|"), 'g')

		this.demap = arg.demap||Object.fromEntries(Object.entries(this.mapping).map(a => a.reverse())) // reversed keys&values of .mapping e.g. {"nena": "ᑎ"} -> {"ᑎ": "nena"} 
		this.codelist = arg.codelist||Object.keys(this.demap).sort(byLength)
		this.matchcode = new RegExp(this.codelist.map(x=>x.replace(specialchar, '\\$&')).join("|"), 'g')
		
		this.showTrans = !arg.hideTrans
		this.showList = !arg.hideList
		
		this.url = arg.url||"#"
		this.creator = arg.creator||arg.url||"unknown"
		this.name = arg.name||'sitelen pi '+this.creator		
		this.shortname = arg.shortname||(arg.mapping?this.encode(['toki', 'pona']):this.name)
		this.style = arg.style||""
		
		return this
	}
	
	qencode = text => text.replace(this.matchword, match=>this.mapping[match])
	encode = function(txtarray) {
		return txtarray.map(word => this.mapping[word] || word).join(settings.forceSpaces?'  ':'')
	}
	//decode = text => text.replace(this.matchcode, match=>this.demap[match])
	decode = function(text){
		let out = [],
		indx = 0,
		iter = text.matchAll(this.matchcode)
		for (let match=iter.next(); !match.done; match=iter.next()) {
			if (match.value.index > indx) {
				out.push(text.slice(indx, match.value.index))
				indx = match.value.index
			}
			out.push(this.demap[match.value[0]]) //wordlist.indexOf()
			indx += match.value[0].length
		}
		out.push(text.slice(indx))
		if (settings.stripWhitespace) out = out.filter(word=>/[^ \t]/.test(word))
		return out
	}
	likelyhood = function(text){return 1-(text.replace(this.matchcode, "").length/text.length)}
}

const data = [
	new Encoding({
		name: "Plaintext",	shortname: "Latin",
		hideTrans: false,
		hideList: true,
		mapping: Object.fromEntries(["a","akesi","ala","alasa","ale","ali","anpa","ante","anu","apeja","awen","e","en","epiku","esun","ete","ewe","ijo","ike","ilo","insa","itomi","jaki","jami","jan","jelo","jo","kala","kalama","kama","kamalawala","kan","kapesi","kasi","ke","ken","kepeken","kijetesantakalu","kili","kin","kipisi","kiwen","ko","kon","kule","kulupu","kuntu","kute","la","lanpan","lape","laso","lawa","leko","len","lete","li","lili","linja","linluwi","lipu","loje","lokon","lon","luka","lukin","lupa","ma","majuna","mama","mani","meli","melome","mi","mije","mijomi","misikeke","moku","moli","monsi","monsuta","mu","mulapisu","mun","musi","mute","namako","nanpa","nasa","nasin","nena","ni","nimi","noka","o","oke","okepuma","oko","olin","omen","ona","open","pa","pakala","pake","pali","palisa","pan","pana","pasila","pata","peta","peto","pi","pilin","pimeja","pini","pipi","pipo","po","poka","poki","polinpin","pomotolo","pona","powe","pu","sama","samu","seli","selo","seme","sewi","sijelo","sike","sikomo","sin","sina","sinpin","sitelen","soko","sona","soto","soweli","su","suli","suno","supa","suwi","tan","taso","tawa","te","telo","tenpo","toki","tomo","tonsi","tu","tuli","unpa","uta","utala","waleja","walo","wan","waso","wawa","wawajete","we","weka","wi","wile","yupekosi"," "].map(x=>[x,x]))
	}),
	new Encoding({
		name: "linja pona", shortname: "\uE629\uE654",
		creator: "jan Same",
		url: "http://musilili.net/linja-pona/",
		style: 'font-family: linja-pona',
		mapping: {akesi: "\uE601", alasa: "\uE603", anpa: "\uE605", ante: "\uE606", awen: "\uE608", ala: "\uE602", ali: "\uE604", ale: "\uE604", anu: "\uE607", a: "\uE600", esun: "\uE60B", en: "\uE60A", e: "\uE609", insa: "\uE60F", ijo: "\uE60C", ike: "\uE60D", ilo: "\uE60E", jaki: "\uE610", jelo: "\uE612", jan: "\uE611", jo: "\uE613", kalama: "\uE615", kulupu: "\uE61F", kiwen: "\uE61B", kala: "\uE614", kama: "\uE616", kasi: "\uE617", ken: "\uE618", kepeken: "\uE619", kili: "\uE61A", kule: "\uE61E", kute: "\uE620", kon: "\uE61D", ko: "\uE61C", linja: "\uE629", lukin: "\uE62E", lape: "\uE622", laso: "\uE623", lawa: "\uE624", lete: "\uE626", lili: "\uE628", lipu: "\uE62A", loje: "\uE62B", luka: "\uE62D", lupa: "\uE62F", len: "\uE625", lon: "\uE62C", la: "\uE621", li: "\uE627", monsi: "\uE638", mama: "\uE631", mani: "\uE632", meli: "\uE633", mije: "\uE635", moku: "\uE636", moli: "\uE637", musi: "\uE63B", mute: "\uE63C", mun: "\uE63A", ma: "\uE630", mi: "\uE634", mu: "\uE639", nanpa: "\uE63D", nasin: "\uE63F", nasa: "\uE63E", nena: "\uE640", nimi: "\uE642", noka: "\uE643", ni: "\uE641", o: " \uE644", olin: "\uE645", open: "\uE647", ona: "\uE646", pakala: "\uE648", palisa: "\uE64A", pimeja: "\uE64F", pilin: "\uE64E", pali: "\uE649", pana: "\uE64C", pini: "\uE650", pipi: "\uE651", poka: "\uE652", poki: "\uE653", pona: "\uE654", pan: "\uE64B", pi: "\uE64D", pu: "\uE655", sitelen: "\uE660", sijelo: "\uE65B", sinpin: "\uE65F", soweli: "\uE662", sama: "\uE656", seli: "\uE657", selo: "\uE658", seme: "\uE659", sewi: "\uE65A", sike: "\uE65C", sina: "\uE65E", sona: "\uE661", suli: "\uE663", suno: "\uE664", supa: "\uE665", suwi: "\uE666", sin: "\uE65D", tenpo: "\uE66B", taso: "\uE668", tawa: "\uE669", telo: "\uE66A", toki: "\uE66C", tomo: "\uE66D", tan: "\uE667", tu: "\uE66E", utala: "\uE671", unpa: "\uE66F", uta: "\uE670", walo: "\uE672", waso: "\uE674", wawa: "\uE675", weka: "\uE676", wile: "\uE677", wan: "\uE673", kin: "\uE690", kipisi: "\uE691", leko: "\uE692", monsuta: "\uE693", namako: "\uE694", oko: "\uE695", pake: "\uE696", " ": "\uE679", ",": "\uE680", ".": "\uE681", ":": "\uE682", "!": "\uE683", "?": "\uE685"}
	}),
	new Encoding({
		name: "sitelen pilin", //shortname: "😀1",
		creator: "https://sites.google.com/view/sitelenemoji",
		url: "https://raw.githubusercontent.com/devbali/desktop-sitelen-emoji/master/sitelenemoji.json",
		mapping: {"_": "🔣", ".": "➖", ":": "➗", "a": "❗", "akesi": "🦎", "ala": "❌", "alasa": "🏹", "ale": "♾️", "ali": "♾️", "anpa": "⬇️", "ante": "🔀", "anu": "☯️", "apeja": "😢", "awen": "⚓", "e": "⏩", "en": "➕", "esun": "🛒", "ijo": "🐚", "ike": "👎", "ilo": "⚙️", "insa": "⏺️", "jaki": "💩", "jan": "👤", "jelo": "💛", "jo": "👜", "kala": "🐟", "kalama": "🔈", "kama": "🚶", "kasi": "🌴", "ken": "💪", "kepeken": "🔧", "kijetesantakalu": "🦝", "kili": "🍎", "kin": "❕", "kipisi": "✂️", "kiwen": "💎", "ko": "🍦", "kon": "💨", "kule": "🌈", "kulupu": "👥", "kute": "👂", "la": "🔼", "lape": "😴", "laso": "🔵", "lawa": "😶", "leko": "🧱", "len": "👕", "lete": "❄️", "li": "▶️", "lili": "🐭", "linja": "〰️", "linluwi": "🌐", "lipu": "📄", "loje": "🔴", "lon": "📍", "luka": "✋", "lukin": "👀", "lupa": "🕳", "ma": "🏝", "majuna": "👵", "mama": "👪", "mani": "💰", "meli": "👧", "mi": "👈", "mije": "👨", "moku": "🍽", "moli": "💀", "monsi": "⬅️", "monsuta": "👹", "mu": "😹", "mulapisu": "🍕", "mun": "🌙", "musi": "😃", "mute": "👐", "namako": "🧂", "nanpa": "#️⃣", "nasa": "🌀", "nasin": "🛣", "nena": "🗻", "ni": "👇", "nimi": "💬", "noka": "🦵", "o": "👋", "oko": "👁️", "olin": "💕", "ona": "👆", "open": "🔓", "pakala": "💥", "pake": "🚧", "pali": "✊", "palisa": "📏", "pan": "🍞", "pana": "📤", "pi": "⏹️", "pilin": "❤️", "pimeja": "⚫", "pini": "🏁", "pipi": "🐞", "poka": "↔️", "poki": "📦", "pona": "👍", "powe": "🧞", "pu": "📖", "sama": "⚖️", "seli": "🔥", "selo": "🔲", "seme": "❓", "sewi": "⬆️", "sijelo": "🏋️", "sike": "⭕", "sin": "🎁", "sina": "👉", "sinpin": "➡️", "sitelen": "🖼", "sona": "🧠", "soweli": "🐒", "suli": "🐘", "suno": "☀️", "supa": "🛏", "suwi": "🍭", "tan": "↩️", "taso": "🤔", "tawa": "↪️", "telo": "💧", "tenpo": "⏰", "toki": "🗣", "tomo": "🏠", "tonsi": "♐", "tu": "✌️", "unpa": "🍆", "uta": "👄", "utala": "⚔️", "walo": "⚪", "wan": "☝️", "waso": "🦅", "wawa": "⚡", "weka": "🛫", "wile": "💭", "epiku": "😎", "ete": "🔃", "ewe": "🌋", "itomi": "😈", "jami": "🤤", "kamalawala": "💣", "kan": "🔗", "kapesi": "🟤", "kuntu": "🤣", "lanpan": "📥", "likujo": "🧺", "lokon": "🧿", "melome": "👩‍❤️‍👩", "mijomi": "👨‍❤️‍👨", "misikeke": "💊", "oke": "👌", "okepuma": "🦖", "omen": "🙄", "pa": "🤨", "pasila": "🧘", "pata": "👯‍♀️", "peta": "🟢", "peto": "😭", "pipo": "😒", "po": "🍀", "polinpin": "🎳", "pomotolo": "📈", "samu": "✍️", "sikomo": "🤩", "soko": "🍄", "soto": "🤛", "su": "❔", "te": "🤜", "tuli": "☘️", "waleja": "ℹ️", "wawajete": "🤡", "we": "🔒", "wi": "🙋", "yupekosi": "📉"}
	}),
	new Encoding({
		name: "sitelen pilin kepeken nimi Siko",
		hideTrans: true,
		hideList: true,
		mapping: {'_': ":symbols:", ".": ":heavy_minus_sign:", ":": ":heavy_division_sign:", a: ":exclamation:", akesi: ":lizard:", ala: ":x:", alasa: ":bow_and_arrow:", ale: ":infinity:", ali: ":infinity:", anpa: ":arrow_down:", ante: ":twisted_rightwards_arrows:", anu: ":yin_yang:", apeja: ":cry:", awen: ":anchor:", e: ":fast_forward:", en: ":heavy_plus_sign:", esun: ":shopping_cart:", ijo: ":shell:", ike: ":thumbsdown:", ilo: ":gear:", insa: ":record_button:", jaki: ":poop:", jan: ":bust_in_silhouette:", jelo: ":yellow_heart:", jo: ":handbag:", kala: ":fish:", kalama: ":speaker:", kama: ":person_walking:", kasi: ":palm_tree:", ken: ":muscle:", kepeken: ":wrench:", kijetesantakalu: ":raccoon:", kili: ":apple:", kin: ":grey_exclamation:", kipisi: ":scissors:", kiwen: ":gem:", ko: ":icecream:", kon: ":dash:", kule: ":rainbow:", kulupu: ":busts_in_silhouette:", kute: ":ear:", la: ":arrow_up_small:", lape: ":sleeping:", laso: ":blue_circle:", lawa: ":no_mouth:", leko: ":bricks:", len: ":shirt:", lete: ":snowflake:", li: ":arrow_forward:", lili: ":mouse:", linja: ":wavy_dash:", linluwi: ":globe_with_meridians:", lipu: ":page_facing_up:", loje: ":red_circle:", lon: ":round_pushpin:", luka: ":raised_hand:", lukin: ":eyes:", lupa: ":hole:", ma: ":island:", majuna: ":older_woman:", mama: ":family:", mani: ":moneybag:", meli: ":girl:", mi: ":point_left:", mije: ":man:", moku: ":fork_knife_plate:", moli: ":skull:", monsi: ":arrow_left:", monsuta: ":japanese_ogre:", mu: ":joy_cat:", mulapisu: ":pizza:", mun: ":crescent_moon:", musi: ":smiley:", mute: ":open_hands:", namako: ":salt:", nanpa: ":hash:", nasa: ":cyclone:", nasin: ":motorway:", nena: ":mount_fuji:", ni: ":point_down:", nimi: ":speech_balloon:", noka: ":leg:", o: ":wave:", oko: ":eye:", olin: ":two_hearts:", ona: ":point_up_2:", open: ":unlock:", pakala: ":boom:", pake: ":construction:", pali: ":fist:", palisa: ":straight_ruler:", pan: ":bread:", pana: ":outbox_tray:", pi: ":stop_button:", pilin: ":heart:", pimeja: ":black_circle:", pini: ":checkered_flag:", pipi: ":lady_beetle:", poka: ":left_right_arrow:", poki: ":package:", pona: ":thumbsup:", powe: ":genie:", pu: ":book:", sama: ":scales:", seli: ":fire:", selo: ":black_square_button:", seme: ":question:", sewi: ":arrow_up:", sijelo: ":person_lifting_weights:", sike: ":o:", sin: ":gift:", sina: ":point_right:", sinpin: ":arrow_right:", sitelen: ":frame_photo:", sona: ":brain:", soweli: ":monkey:", suli: ":elephant:", suno: ":sunny:", supa: ":bed:", suwi: ":lollipop:", tan: ":leftwards_arrow_with_hook:", taso: ":thinking:", tawa: ":arrow_right_hook:", telo: ":droplet:", tenpo: ":alarm_clock:", toki: ":speaking_head:", tomo: ":house:", tonsi: ":sagittarius:", tu: ":v:", unpa: ":eggplant:", uta: ":lips:", utala: ":crossed_swords:", walo: ":white_circle:", wan: ":point_up:", waso: ":eagle:", wawa: ":zap:", weka: ":airplane_departure:", wile: ":thought_balloon:", epiku: ":sunglasses:", ete: ":arrows_clockwise:", ewe: ":volcano:", itomi: ":smiling_imp:", jami: ":drooling_face:", kamalawala: ":bomb:", kan: ":link:", kapesi: ":brown_circle:", kuntu: ":rofl:", lanpan: ":inbox_tray:", likujo: ":basket:", lokon: ":nazar_amulet:", melome: ":couple_ww:", mijomi: ":couple_mm:", misikeke: ":pill:", oke: ":ok_hand:", okepuma: ":t_rex:", omen: ":rolling_eyes:", pa: ":face_with_raised_eyebrow:", pasila: ":person_in_lotus_position:", pata: ":women_with_bunny_ears_partying:", peta: ":green_circle:", peto: ":sob:", pipo: ":unamused:", po: ":four_leaf_clover:", polinpin: ":bowling:", pomotolo: ":chart_with_upwards_trend:", samu: ":writing_hand:", sikomo: ":star_struck:", soko: ":mushroom:", soto: ":left_facing_fist:", su: ":grey_question:", te: ":right_facing_fist:", tuli: ":shamrock:", waleja: ":information_source:", wawajete: ":clown:", we: ":lock:", wi: ":person_raising_hand:", yupekosi: ":chart_with_downwards_trend:"}
	}),
	new Encoding({
		name: "sitelen Emoji pi jan Onte", //shortname: "😀2",
		creator: "jan Onte",
		url: "https://m.facebook.com/notes/andr%C3%A9-rhine-davis/sitelen-emoji-pi-jan-onte-mi-tawa-toki-pona/10154576571211286/",
		mapping: {a: "❗", akesi: "🦎", ala: "🚫", alasa: "🏹", ali: "💯", anpa: "⬇️", ante: "🔀", anu: "➰", awen: "⚓", e: "▪", en: "♣️", esun : "💱", ijo: "⚛️", ike: "🙁", ilo: "💻", insa: "🔘", jaki: "🤢", jan: "👤", jelo: "🔶", jo: "👜", kala: "🐟", kalama: "🎵", kama: "⏩", kasi: "🌳", ken: "✔️", kepeken: "🔧", kili: "🍏", kin: "❕", kipisi: "✂️", kiwen: "💎", ko: "☁️", kon: "🌬️", kule: "🎨", kulupu: "👪", kute: "👂", la: "➗", lape: "😴", laso: "🔷", lawa: "👑", leko: "⏹️", len: "👕", lete: "❄️", li: "➖", lili: "👶", linja: "⛓️", lipu: "📄", loje : "♦️", lon: "🎯", luka: "🖐️", lukin: "👀", lupa: "🕳️", ma: "🏜️", mama: "🤰", mani: "💲", meli: "♀️", mi: "🔻", mije: "♂️", moku: "🍽️", moli: "☠️", monsi: "⬅️", monsuta: "👹", mu: "🐮", mun: "🌙", musi: "🎪", mute: "✖️", namako: "🎉", nanpa: "‌#️⃣", nasa: "😜", nasin: "🛣️", nena: "🗻", ni: "👆", nimi: "🔠", noka: "👠", o: "⚠️", oko: "👁️", olin: "💘", ona: "🔴", open: "⏫", pakala: "💣", pake: "🛑", pali: "⚒️", palisa: "📏", pan: "🍞", pana: "🎁", pi: "▫", pilin: "♥️", pimeja: "⬛", pini: "⏬", pipi: "🕷️", poka: "👫", poki: "📦", pona: "🙂", powe: "🧞", pu: "📕", sama: "⏸️", seli: "🔥", selo: "⭕", seme: "❓", sewi: "⬆️", sijelo: "🚶", sike: "⚽", sin: "➕", sina: "🔺", sinpin: "➡️", sitelen: "🖊️", sona: "💡", soweli: "🐕", suli: "👵", suno: "☀️", supa: "🛏️", suwi: "🍭", tan: "↗", taso: "⛔", tawa: "↘", telo: "💧", tenpo: "⏰", toki: "💬", tomo: "🏠", tu: "2️⃣", unpa: "♋", uta: "👄", utala: "⚔️", walo: "⬜", wan: "1️⃣", waso: "🐦", wawa: "⚡", weka: "🛫", wile: "❣️",	}
	}),
	new Encoding({
		name: "toki pona emoji",
		creator: "Joe Corneli",
		url: "https://github.com/holtzermann17/toki-pona-emoji/blob/master/word_list.md",
		mapping: {a: "😅", akesi: "🐊", ala: "🙅", alasa: "🎑", ale: "🌏", anpa: "🌰", ante: "💢", anu: "🎏", awen: "🌅", e: "🔸", en: "🍒", esun: "👛", ijo: "🐚", ike: "😱", ilo: "📎", insa: "🌀", jaki: "💩", jan: "👶", jelo: "🌱", jo: "🍯", kala: "🐟", kalama: "🎶", kama: "🐴", kasi: "🌳", ken: "📥", kepeken: "🌂", kili: "🍍", kin: "➰", kipisi: "✂️", kiwen: "💎", ko: "🍚", kon: "💨", kule: "🌈", kute: "👂", kulupu: "🎎", la: "🔹", lape: "💤", laso: "❇️", lawa: "👴", len: "👘", lete: "❄️", li: "🔺", lili: "🐜", linja: "〰️", lipu: "📁", loje: "🌹", lon: "🙇", luka: "👍", lukin: "👓", lupa: "⭕️", ma: "🌄", mama: "👪", mani: "💰", meli: "👧", mi: "👈", mije: "👨", moku: "🍲", moli: "💀", monsi: "👎", mu: "😻", mun: "🌜", musi: "💖", mute: "🌆", namako: "🍛", nanpa: "✌️", nasa: "😜", nasin: "🚞", nena: "🗻", ni: "🙌", nimi: "🎴", noka: "👞", o: "👋", oko: "👀", olin: "💑", ona: "👥", open: "🔦", pakala: "👹", pali: "🚴", palisa: "🎋", pan: "🍞", pana: "📤", pata: "👫", pi: "🎒", pilin: "💗", pimeja: "🌚", pini: "🌽", pipi: "🐞", poka: "👭", poki: "🍵", pona: "😄", sama: "👯", seli: "🔥", selo: "🍊", seme: "👐", sewi: "💫", sijelo: "👕", sike: "🔃", sin: "🌲", sina: "👉", sinpin: "👚", sitelen: "⛲️", sona: "🐲", soweli: "🐒", suli: "☝️", suno: "🌞", supa: "📐", suwi: "🍭", tan: "🚢", taso: "🗿", tawa: "🏃", telo: "🌊", tenpo: "⌛️", toki: "💬", tomo: "🏡", tu: "🍂", unpa: "🍆", uta: "👄", utala: "✊", walo: "🌝", wan: "🍁", waso: "🐦", wawa: "⚡️", weka: "🎐", wile: "🐺"}
	}),
	new Encoding({
		name: "wawa pona",
		creator: "jan Pitelo",
		url: "http://thaiyoo.com/tokipona/alfapona.htm",
		mapping: {a: "ղ", akesi: "Ꮝ", ala: "x", alasa: "Ꮅ", ali: "a", anpa: "Ꭷ", ante: "и", anu: "u", awen: "δ", e: "e", en: "ε", esun: "ე", ijo: "i", ike: "h", ilo: "ι", insa: "ქ", jaki: "կ", jan: "j", jelo: "ւ", jo: "y", kala: "չ", kalama: "ֆ", kama: "я", kasi: "ψ", ken: "k", kepeken: "q", kili: "ვ", kin: "ղ", kipisi: "э", kiwen: "ლ", ko: "უ", kon: "γ", kule: "ჰ", kulupu: "պ", kute: "б", la: "ჲ", lape: "ի", laso: "Ꮿ", lawa: "г", len: "ტ", lete: "ն", li: "l", lili: "դ", linja: "ს", lipu: "β", loje: "ზ", o: "ծ", lon: "o", luka: "რ", lukin: "φ", lupa: "Þ", ma: "թ", mama: "ա", mani: "ი", meli: "ω", mi: "m", mije: "բ", moku: "κ", moli: "մ", monsi: "Ꮧ", mu: "տ", mun: "ռ", musi: "μ", mute: "g", namako: "Ȣ", nanpa: "ê", nasa: "ξ", nasin: "д", nena: "ш", ni: "n", nimi: "շ", noka: "Ꭴ", oko: "Ꮹ", olin: "ճ", ona: "v", open: "წ", pakala: "დ", pali: "զ", palisa: "ბ", pan: "ю", pana: "ր", pi: "π", pilin: "f", pimeja: "ж", pini: "p", pipi: "ც", poka: "և", poki: "გ", pona: "b", pu: "ო", sama: "փ", seli: "ք", selo: "Ꭳ", seme: "z", sewi: "ը", sijelo: "ե", sike: "θ", sin: "σ", sina: "s", sinpin: "Ꭽ", sitelen: "з", sona: "ц", soweli: "ζ", suli: "Ꭿ", suno: "վ", supa: "ფ", suwi: "λ", tan: "d", taso: "c", tawa: "t", telo: "τ", tenpo: "ժ", toki: "ч", tomo: "ъ", tu: "л", unpa: "მ", uta: "ձ", utala: "ջ", walo: "н", wan: "η", waso: "ა", wawa: "α", weka: "й", wile: "w"}
	}),
	new Encoding({
		name: "old unicode script",
		creator: "Henrik Theiling",
		url: "http://www.theiling.de/schrift/tokipona.html",
		mapping: {"!": "!", "(": "(", ")": ")", ",": ",", "-": "-", ".": ".", ":": ":", ";": ";", "?": "?", "<<": "《", ">>": "》", a: "⍤", akesi: "⍡", ala: "∅", ale: "◉", ali: "◉", anpa: "↓", ante: "⎌", anu: "∨", awen: "⚓", e: "↱", en: "&", ijo: "⚛", ike: "☹", ilo: "✄", insa: "⎆", jaki: "☣", jan: "ⵅ", jelo: "▥", jo: "⧈", kala: "ᘙ", kalama: "♪", kama: "⧉", kasi: "⚘", ken: "✓", kepeken: "⚒", kili: "ᴥ", kin: "◅", kiwen: "●", ko: "◍", kon: "⚐", kule: "▧", kulupu: "፨", kute: "✆", la: "⊏", lape: "⌤", laso: "▦", lawa: "♕", len: "♟", lete: "☃", li: "↴", lili: "▵", linja: "☡", lipu: "‿", loje: "▤", lon: "⍾", luka: "⌈", lukin: "∢", lupa: "◘", ma: "⏚", mama: "☝", mani: "¤", meli: "♀", mi: "⇊", mije: "♂", moku: "☕", moli: "☠", monsi: "↫", mu: "⍣", mun: "☾", musi: "☊", mute: "⚃", nanpa: "⋕", nasa: "⦼", nasin: "ᔔ", nena: "♎", ni: "⇲", nimi: "⊟", noka: "⌊", o: "⚠", oko: "⚇", olin: "♡", ona: "⇆", open: "⍽", pakala: "☁", pali: "♠", palisa: "∕", pana: "✉", pi: "⟄", pilin: "❦", pimeja: "■", pini: "⟟", pipi: "⩷", poka: "⫖", poki: "⚱", pona: "☺", sama: "⊜", seli: "♨", selo: "⎋", seme: "⍰", sewi: "↑", sijelo: "♙", sike: "○", sin: "♲", sina: "⇈", sinpin: "⌸", sitelen: "✎", sona: "◬", soweli: "ዥ", suli: "▽", suno: "☼", supa: "–", suwi: "⍨", tan: "↤", taso: "◦", tawa: "⇥", telo: "☔", tenpo: "⌛", toki: "ᑈ", tomo: "⌂", tu: "⚁", unpa: "♋", uta: "⍥", utala: "⚔", walo: "☐", wan: "⚀", waso: "⍢", wawa: "↯", weka: "⤣", wile: "❣"}
	}),
	new Encoding({
		name: "unicode script",
		creator: "mi (jan Lile)",
		url: "sitelen Uniko.html",
		mapping: {o: "ᆝ", a: "よ", kin: "ꎰ", seme: "？", ni: "ↆ", nanpa: "ꖛ", ali: "ꝏ", ale: "ꝏ", en: "⼗", sama: "＝", telo: "≈", kon: "🅍", ala: "✕", anu: "Ｙ", kipisi: "⸓", lete: "Ӿ", e: "⨠", pan: "巛", li: "ᐳ", suli: "ᐯ", lili: "v", kute: "ꎌ", la: "ᑐ", nena: "ᑎ", lupa: "ᑌ", supa: "丌", pona: "◡", ike: "⌒", luka: "Ꮑ", kepeken: "ቋ", pali: "ዳ", moku: "ሸ", wan: "↿", tu: "꠱", mute: "Ⲽ", ijo: "੦", palisa: "꧰", sike: "⦾", oko: "⦓", lukin: "ⵙ", moli: "⚇", ma: "ⴲ", lawa: "ፁ", mani: "ȣ", jan: "ꆰ", meli: "⍝", mije: "♂", tonsi: "⚧", toki: "⛣", sona: "畄", mi: "ᑭ", sina: "ᑲ", ona: "ᓄ", lape: "⊸", pi: "ட", poki: "⨆", lon: "∸", anpa: "ꦉ", poka: "ᑘ", insa: "⨃", lipu: "⧠", leko: "⧈", pu: "⌻", open: "ㅂ", len: "吊", ilo: "ዋ", selo: "爪", nimi: "▭", monsi: "·[", sinpin: "]·", pipi: "半", akesi: "單", pilin: "ఇ", olin: "ଞ", waso: "ᔱ", soweli: "Ლ", wile: "Ꞷ", sewi: "ﷲ", pimeja: "⨻", kule: "Ꙙ", laso: "ꖏ", kasi: "ܤ", walo: "ꕖ", jaki: "༳", nasa: "ඉ", unpa: "Ⰲ", ken: "Ｋ", pini: "工", pake: "ㅜ", taso: "ㅓ", nasin: "⨙", tenpo: "◷", esun: "ℒ", kulupu: "ஃ", wawa: "࿂", mu: "ൠ", musi: "☋", kalama: "෪", monsuta: "෴", linja: "ᔓ", ante: "ᳲ", uta: "ᗜ", mun: "☽", mama: "ჹ", kala: "ꩳ", pakala: "↯", alasa: "➵", tan: "⤺", sin: "𝇘", namako: "⊹", weka: "⤫", suno: "༓", sitelen: "ꘖ", tomo: "⌂", kiwen: "⯂", tawa: "႔", kama: "𓂻", utala: "⤩", jo: "၉", noka: "𓃀", wawa: "𓁏"}
	}),
	new Encoding({
		name: "sitelen Unikote",
		creator: "u/firaro",
		url: "https://docs.google.com/document/d/13KBHz4Cyv9qCTNJgCc-gihJHz4Q8dStdfn68QTdCLRo",
		mapping: {a: "a̍̍̍̍̍̍̍̍̍", akesi: "ΞÖΞ", ala: "X", alasa: "🏹", ale: "∞", anpa: "└─̣┘", ante: " ̭̌",	anu: "Y", awen: "-^-", e: "»", en: "+", esun: "Ⴥ", ijo: "O", ike: "◠", ilo: "甲", insa: "└─̇┘", jaki: "薉", jan: "🜶", jelo: "ᐂ", jo: "𐒥", kala: "𑁛", kalama: " ̀U̅̍ ́", kama: "𓂻", kasi: "🌱", ken: "K", kepeken: " ̬n̍͆", kili: "🍎", kin: "ı͙", kiwen: "💎", ko: "🍦", kon: "∬", kule: "🜁", kulupu: "ஃ", kute: "👂", la: ")", lape: "⊸", laso: "Ϫ", lawa: "ፁ", len: "⼝", lete: "꘎", li: "›", lili: "ᵛ", linja: "∽", lipu: "▯",	loje: "ⵠ̆", lon: "∸", luka: " ̬n", lukin: "👁", lupa: "U", ma: "ⴲ", mama: "O̥", mani: "ᴕ", meli: "⍝", mi: "⍴", mije: "o̪", moku: " ̬n̆", moli: "(x x)", monsi: "·[", mu: "̊ ☉ ̊",	mun: "☽", musi: "☋", mute: "⦀", nanpa: "ⵌ", nasa: "๑", nasin: "⺖", nena: "∩",	ni: "↓", nimi: "⬭", noka: "Lᕊ", o: "ı̥", olin: "💕", ona: "ڡ", open: "ㅂ", pakala: "[ϟ]", pali: "nͦ", palisa: "꒩", pan: "v̬̌", pana: " ̇ ̬n̍ ̇", pi: "∟", pilin: "♡", pimeja: "⨻", pini: "ⵊ", pipi: "ΞÏΞ", poka: "⌴.", poki: "⊔", pona: "◡", pu: "[˙o̮̍˙]", sama: "=", seli: "\\Ɩ̣/", selo: "⺵", seme: "?", sewi: "‎ﺳ‎ı", sijelo: "𐊿", sike: "◎", sin: "_ I _",	sina: "ᑲ", sinpin: "]·", sitelen: "ꘖ", sona: " ̀[ ̄́] ́", soweli: "ıııᕈ", suli: "V", suno: "🝊", supa: "ㅠ", suwi: "^.^", tan: "⤺", taso: "˧", tawa: "𓂽", telo: "≈", tenpo: "🕒", toki: "˙Ȯ˙", tomo: "⌂", tu: "‖", unpa: "Ꮘ", uta: "𓂑", utala: "⤩", walo: "⟍△⟋", wan: "↿", waso: "ᔨ", wawa: "\\O/", weka: "⊹", wile: "ω"}
	}),
	new Encoding({
		name: "telegram unicode",
		creator: "pguimier",
		url: "https://gist.github.com/pguimier/649c7f3818024edc10e30b0399fcc7f2",
		mapping: {a: "a!", akesi: "𖠊", ala: "X", alasa: "⨮", ale: "⃛∞", ali: "∞", anpa: "̣⊔", ante: "≍", anu: "ϒ", awen: "⋏", e: "⨠", en: "+", esun: "ℒ", ijo: "◯", ike: "◠", ilo: "ዋ", insa: "⨃", jaki: "இ", jan: "ꆰ", jelo: "ᐂ", jo: "Ⳓ", kala: "𑁛", kalama: "𐃬⃛", kama: "𓂻", kasi: "𖧧", ken: "K", kepeken: "ꐬ", kili: "𐂴", kin: "͙Ι", kiwen: "⬠", ko: "ꕤ", kon: "⧛", kule: "⨺", kulupu: "ஃ", kute: "𑁘", la: "᯿", lape: "⟜", laso: "𖡆", lawa: "ੳ", len: "𐀷", lete: "⚹", li: ">", lili: "⌄", linja: "∿", lipu: "▢", loje: "𐃯", lon: "∸", luka: "ᕄ", lukin: "ʘ", lupa: "⋃", ma: "⨁", mama: "ଚ", mani: "𑀫", meli: "⍝", mi: "ᑭ", mije: "♂", moli: "⚇", monsi: "‧ⵎ", monsuta: "෴", mu: "𐃭", mun: "☽", musi: "☋", mute: "Ⅲ", namako: "⊹", nanpa: "#", nasa: "ᘐ", nasin: "⏃", nena: "⋂", ni: "ↆ", nimi: "▢", noka: "Ь", o: "Ι̥", oko: "⩹", olin: "❣", ona: "ᓄ", open: "𝈣", pakala: "↯", pali: "ጲ", palisa: "꧰", pan: "𖤤", pana: "ቢ⃛", pi: "ᒪ", pilin: "♡", pimeja: "⨻", pini: "⌶", pipi: "𐀳", poka: "⊔‧", poki: "⊔", pona: "◡", pu: "🀧", sama: "𑁓", seli: "∙⃛", selo: "𐀎", seme: "❔", sewi: "Ɯ", sijelo: "𖥭", sike: "⌾", sin: "⊥", sina: "ᑲ", sinpin: "ⵎ‧", sitelen: "⊟", sona: "▢⃛", soweli: "ଲ", suli: "⋎", suno: "⌖", supa: "ㅠ", suwi: "^‧^", tan: "⤺", taso: "⊣", tawa: "𓂽", telo: "𐅽", tenpo: "ⵚ", toki: "o⃛", tomo: "⌂", tu: "Ⅱ", unpa: "ꎊ", uta: "̣𐃬", utala: "𐋄", walo: "ꕖ", wan: "𐩡", waso: "ᔳ", wawa: "\\o/", weka: "⛌", wile: "ᱦ"}
	}),
	new Encoding({
		name: "unicode keyboard",
		creator: "jan Sala",
		url: "https://discord.com/channels/301377942062366741/375591429608570881/722372140527124570",
		mapping: {a: '!', akesi: 'Ӫ', ala: 'X', alasa: 'Ð', ale: '∞', ali: '∞', anpa: 'Џ', ante : 'N', anu: 'Y', awen: 'λ', e: '»', en: '+', esun: '§', ijo: 'O', ike: '∩', ilo: '中', insa: 'Ŀ', jaki: '&', jan: 'Q', jelo: 'Å', jo: '¿', kala: '∝', kalama: 'Ű', kama: '\\', kasi: 'Ï', ken: 'K', kepeken: '円', kili: 'Ó', kiwen: 'Ѫ', ko: 'ß', kon: '∫', kule: 'A', kulupu: '∴', kute: '€', la: ')', lape: '⟜', laso: 'Ä', lawa: 'θ', len: 'ロ', lete: '⚹', li: '›', lili: 'v', linja: '~', lipu: 'ㅁ', lon: '∸', loje: 'Ă', luka: 'n', lukin: '⊙', lupa: 'U', ma: '⊕', mama: 'Ç', mani: 'Ơ', meli: 'Ô', mi: 'p', mije: 'Ω', moli: 'Ø', monsi: 'ㅓ', mu: '木', mun: '☾', musi: '☋', mute: '3', nanpa: '#', nasa: '@', nasin: '∤', nena: '^', ni: '↓', nimi: '[ ]', noka: 'Б', o: '⫰', olin: 'ε', ona: 'σ', open: 'ㅂ', pakala: '∑', pali: 'ń', palisa: '|', pan: '⚶', pana: 'ñ', pi: 'L', pilin: '♡', pimeja: 'Ā', pini: 'エ', pipi: '¥', poka: 'Ҧ', poki: '∐', pona: '∪', pu: '⊡', sama: '=', seli: '⚟', selo: 'Ш', seme: '?', sewi: '√', sijelo: 'Π', sike: '⊙', sin: '±', sina: 'b', sinpin: 'ㅏ', sitelen: '…', sona: '点', soweli: '⪾', suli: 'V', suno: '¤', supa: 'ㅠ', suwi: 'ツ', tan: '↶', taso: '⊢', tawa: '/', telo: '≈', tenpo: '⚆', toki: 'Ő', tomo: '个', tu: '2', unpa: '⚭', uta: 'Ụ', utala: '⚔', walo: 'Ǎ', wan: '1', wawa: '⒪', weka: '⛶', wile: 'ω'}
	}),
	new Encoding({
		name: "sitelen pona ascii",
		creator: "Echo, jan Tepo, jan Sonja",
		url: "https://docs.google.com/document/d/16uRD4ag-reoUJLVuWT0CUXd4lHuRYHJ3Mn-JjFzFiRw/", // where there's multiple i just took the first one
		mapping: {a: "`a", akesi: "'e'", ala: "X", alasa: "-D>", ale: "oo", anpa: "L.|", ante: "><", anu: "Y", awen: "_A_", e: ">>", en: "+", esun: "$", ijo: "O", ike: "n", ilo: "[]-", insa: "L'|", jaki: "&", jan: ",O,", jelo: "-O-<|", jo: "OG", kala: ">o", kalama: "\"u'", kama: "_A", kasi: "cp", ken: "K", kepeken: "[]-C", kijetesantakalu: "cm\">", kili: "o'", kin: "`*", kiwen: "[>", ko: "(3", kokosila: "saluton", kon: "SS", kule: "/-\\", kulupu: "o8", kute: "')", la: ")", lape: "-o", laso: "8-<|", lawa: "O-", leko: "[[]]", len: "[,]", lete: "*", li: ">", lili: "v", linja: "~", lipu: "[]", loje: "D<|", lon: "'_", luka: ",A", lukin: "<->", lupa: "U", ma: "(+)", mama: "Oo", mani: "`O'", meli: "/o\\", mi: "P", mije: "rO,", moku: "DC", moli: "(XX)", monsi: "-[", mu: "O(.)O", mulapisu: "(>", mun: "))", musi: "OUO", mute: "|||", nanpa: "#", nasa: "@", nasin: "/|\\", nena: "A", ni: ",|,", nimi: "<_>", noka: "L5", o: "`o", olin: "<<3", ona: "\\o", open: "|=|", pakala: "[S]", pali: "oC", palisa: "0", pan: ">>>", pana: "\"n'", pi: "L", pilin: "<3", pimeja: "/x\\", pini: "I", pipi: "'E'", poka: "u.", poki: "L|", pona: "u", pu: "[\"(u)']", sama: "=", seli: "\\!/", selo: "|TT|", seme: "?", sewi: "wl", sijelo: "|T|", sike: "(O)", sin: "-'-", sina: "6", sinpin: "]-", sitelen: "[\"']", sona: "\"[]'", soweli: "m\")", suli: "V", suno: "-O-", supa: "TT", suwi: "^.^", tan: "L/\\", taso: "-|", tawa: "A_", telo: "~~", tenpo: "(L)", toki: "\"O'", tomo: "<]", tonsi: "`Q'", tu: "||", unpa: "(<)3", uta: "D", utala: ",X,", walo: "`/\\'", wan: "1", waso: "\"}", wawa: "\\o/", weka: "::", wile: "W", yupekosi: "y"}
	}),
	new Encoding({
		name: "sitelen Asia",		shortname: "言しな",
		creator: "jan Pitelo",
		url: "http://thaiyoo.com/tokipona/bjasian.htm",
		mapping: {a: "あ", akesi: "あけし", ala: "不", alasa: "あらさ", ali: "全", anpa: "下", ante: "あんて", anu: "あぬ", awen: "あうん", e: "え", en: "又", esun: "えすん", ijo: "いよ", ike: "いけ", ilo: "いろ", insa: "いんさ", jaki: "やき", jan: "人", jelo: "えろ", jo: "よ", kala: "から", kalama: "音", kama: "かま", kasi: "かし", ken: "けん", kepeken: "用", kili: "きり", kiwen: "石", ko: "こ", kon: "こん", kule: "くれ", kulupu: "くるふ", kute: "くて", la: "ら", lape: "らへ", laso: "らそ", lawa: "らわ", len: "れん", lete: "れて", li: "り", lili: "小", linja: "りにゃ", lipu: "りふ", loje: "红", lon: "ろん", luka: "るか", lukin: "るきん", lupa: "るは", ma: "ま", mama: "母", mani: "元", meli: "女", mi: "み", mije: "男", moku: "もく", moli: "もり", monsi: "もんし", mu: "む", mun: "月", musi: "むし", mute: "むて", nanpa: "なんは", nasa: "なさ", nasin: "なしん", nena: "山", ni: "に", nimi: "にみ", noka: "足", o: "お", olin: "おりん", ona: "おな", open: "开", pakala: "はから", pali: "工", palisa: "はりさ", pan: "米", pana: "はな", pi: "ひ", pilin: "ひりん", pimeja: "ひめや", pini: "ひに", pipi: "ひひ", poka: "ほか", poki: "ほき", pona: "好", pu: "ふ", sama: "さま", seli: "せり", selo: "せろ", seme: "せめ", sewi: "天", sijelo: "しろ", sike: "しけ", sin: "しん", sina: "しな", sinpin: "しんひん", sitelen: "画", sona: "そな", soweli: "そり", suli: "大", suno: "日", supa: "すは", suwi: "すい", tan: "たん", taso: "たそ", tawa: "たわ", telo: "水", tenpo: "てんほ", toki: "言", tomo: "とも", tu: "二", unpa: "うんは", uta: "うた", utala: "うたら", walo: "白", wan: "ー", waso: "わそ", wawa: "力", weka: "えか", wile: "いれ"}
	}),
	new Encoding({
		name: "sitelen ma Sunko",		shortname: "言尔",
		creator: "u/StuleBackery",
		url: "https://www.reddit.com/r/tokipona/comments/g4lbif/%E8%A8%80%E8%89%AF_toki_pona_with_hanzi/",
		mapping: {a: "阿", akesi: "兽", ala: "不", alasa: "觅", ale: "丰", ali: "全", anpa: "下", ante: "变", anu: "又", awen: "保", e: "向", en: "并", esun: "店", ijo: "事", ike: "歹", ilo: "具", insa: "中", jaki: "丑", jan: "人", jelo: "黄", jo: "有", kala: "鱼", kalama: "申", kama: "至", kasi: "艸", ken: "可", kepeken: "用", kili: "果", kin: "亦", kiwen: "石", ko: "尘", kon: "气", kule: "色", kulupu: "团", kute: "耳", la: "以", lape: "休", laso: "青", lawa: "主", len: "布", lete: "仌", li: "为", lili: "小", linja: "毛", lipu: "片", loje: "丹", lon: "在", luka: "手", lukin: "目", lupa: "孔", ma: "土", mama: "守", mani: "币", meli: "女", mi: "己", mije: "男", moku: "食", moli: "死", monsi: "后", mu: "声", mun: "月", musi: "乐", mute: "多", namako: "加", nanpa: "第", nasa: "异", nasin: "道", nena: "山", ni: "个", nimi: "字", noka: "足", o: "区", oko: "见", olin: "爱", ona: "其", open: "开", pakala: "改", pali: "作", palisa: "条", pan: "禾", pana: "发", pi: "之", pilin: "心", pimeja: "黑", pini: "了", pipi: "虫", poka: "边", poki: "包", pona: "良", pu: "书", sama: "同", seli: "火", selo: "外", seme: "什", sewi: "上", sijelo: "身", sike: "回", sin: "生", sina: "尔", sinpin: "前", sitelen: "画", sona: "知", soweli: "畜", suli: "大", suno: "日", supa: "面", suwi: "甘", tan: "因", taso: "但", tawa: "于", telo: "水", tenpo: "时", toki: "言", tomo: "居", tu: "二", unpa: "合", uta: "口", utala: "竞", walo: "白", wan: "一", waso: "鸟", wawa: "力", weka: "离", wile: "要"}
	}),
	new Encoding({
		name: "Kanjis",		shortname: "言你",
		creator: "jan Mato",
		url: "https://web.archive.org/web/20190624121347/https://albanocruz.numancer.com/conlangs/2017/11/07/kanjis.html",
		mapping: {a: "あ", akesi: "獣", ala: "無", alasa: "探", ali: "全", ali: "全", anpa: "下", ante: "变", anu: "ぬ", awen: "待", e: "把", en: "ん", ijo: "物", ike: "悪", ilo: "具", insa: "内", jaki: "汚", jan: "人", jelo: "黄", jo: "j", kala: "魚",	kalama: "音", kama: "来", kasi: "木", ken: "能", kepeken: "使", kili: "果",	kin: "又", kipisi: "切", kiwen: "石", ko: "膏", kon: "气", kule: "色", kute: "耳", kulupu: "组", la: "ら", lape: "眠", laso: "青", lawa: "首", len: "巾", lete: "冰", li: "り", lili: "小", linja: "糸", lipu: "葉", loje: "赤", lon: "在", luka: "手", lukin: "見", lupa: "穴", ma: "土", mama: "母", mani: "元", meli: "女", mi: "私", mije: "男", moku: "菜", moli: "死", monsi: "後", mu: "む", mun: "月", musi: "楽", mute: "大", namako: "冗", nanpa: "番", nasa: "怪", nasin: "道", nena: "山", ni: "此", nimi: "名", noka: "足", o: "令", oko: "目", olin: "爱", ona: "他", open: "開", pakala: "打", pali: "作", palisa: "棒", pan: "米", pana: "给", pata: "氏", pi: "ぴ", pilin: "想", pimeja: "黑", pini: "終", pipi: "虫", poka: "旁", poki: "箱", pona: "好", sama: "同", seli: "火", selo: "皮", seme: "什", sewi: "上", sijelo: "身", sike: "回", sin: "新", sina: "你", sinpin: "前", sitelen: "画", sona: "知", soweli: "马", suli: "高", suno: "日", supa: "张", suwi: "甜", tan: "从", taso: "只", tawa: "去", telo: "水", tenpo: "时", toki: "言", tomo: "家", tu: "二", unpa: "性", uta: "口", utala: "战", walo: "白", wan: "一", waso: "鸟", wawa: "力", weka: "遥"}
	}),
	new Encoding({
		name: "Hanzis",		shortname: "言君",
		creator: "jan Mato",
		url: "https://web.archive.org/web/20190624121347/https://albanocruz.numancer.com/conlangs/2017/11/07/kanjis.html",
		mapping: {a: "啊", akesi: "獣", ala: "不", ale: "全", ale: "全", anpa: "下", ante: "变", anu: "ぬ", awen: "待", e: "え", en: "ん", esun: "市", ijo: "事", ike: "歹", ilo: "匕", insa: "内", jaki: "污", jan: "人", jelo: "黄", jo: "有", kala: "鱼", kalama: "音", kama: "到", kasi: "木", ken: "能", kepeken: "使", kili: "果", kin: "也", kiwen: "石", ko: "粉", kon: "空", kule: "色", kute: "聞", kulupu: "群", la: "ら", lape: "眠", laso: "青", lawa: "首", len: "布", lete: "冷", li: "り", lili: "小", linja: "糸", lipu: "葉", loje: "赤", lon: "在", luka: "手", lukin: "見", lupa: "穴", ma: "土", mama: "母", mani: "貝", meli: "女", mi: "私", mije: "男", moku: "食", moli: "死", monsi: "後", mu: "む", mun: "月", musi: "楽", mute: "多", namako: "冗", nanpa: "番", nasa: "狂", nasin: "道", nena: "丘", ni: "此", nimi: "称", noka: "足", o: "お", oko: "目", olin: "愛", ona: "彼", open: "開", pakala: "打", pali: "作", palisa: "棒", pan: "米", pana: "授", pata: "氏", pi: "ぴ", pilin: "心", pimeja: "黒", pini: "終", pipi: "虫", poka: "側", poki: "箱", pona: "良", sama: "同", seli: "火", selo: "皮", seme: "何", sewi: "上", sijelo: "体", sike: "丸", sin: "新", sina: "君", sinpin: "前", sitelen: "画", sona: "知", soweli: "猫", suli: "大", suno: "日", supa: "面", suwi: "甜", tan: "因", taso: "許", tawa: "去", telo: "水", tenpo: "时", toki: "言", tomo: "家", tu: "二", unpa: "盛", uta: "口", utala: "戦", walo: "白", wan: "一", waso: "鳥", wawa: "力", weka: "遥"}
	}),
	new Encoding({
		name: "sitelen Lemon",		shortname: "言汝",
		creator: "u/aidungeon-neoncat",
		url: "https://www.reddit.com/r/tokipona/comments/j6nvxd/sitelen_lemon_an_aesthetically_consistent/",
		mapping: {a: "亞", akesi: "龟", ala: "不", alasa: "集", ale: "全", anpa: "下", ante: "差", anu: "或", awen: "停", e: "把", en: "又", esun: "市", ijo: "件", ike: "惡", ilo: "具", insa: "内", jaki: "汚", jan: "人", jelo: "黃", jo: "有", kala: "魚", kalama: "音", kama: "化", kasi: "艸", ken: "可", kepeken: "用", kili: "果", kin: "亦", kipisi: "切", kiwen: "石", ko: "膏", kon: "氣", kule: "色", kute: "聞", kulupu: "會", la: "於", lape: "休", laso: "靑", lawa: "首", len: "巾", lete: "冷", li: "是", lili: "小", linja: "糸", lipu: "葉", loje: "赤", lon: "在", luka: "手", lukin: "見", lupa: "孔", ma: "土", mama: "母", mani: "貝", meli: "女", mi: "我", mije: "男", moku: "食", moli: "死", monsi: "後", mu: "牟", mun: "月", mute: "多", namako: "加", nanpa: "番", nasa: "狂", nasin: "道", nena: "凸", ni: "此", nimi: "名", noka: "足", o: "喂", oko: "目", olin: "愛", ona: "其", open: "開", pakala: "破", pali: "行", palisa: "棒", pan: "穀", pana: "給", pata: "氏", pi: "之", pilin: "心", pimeja: "黑", pini: "末", pipi: "蟲", poka: "伴", poki: "器", pona: "好", sama: "同", seli: "火", seme: "何", sewi: "上", sijelo: "身", sike: "圓", sin: "新", sina: "汝", sinpin: "前", sitelen: "圖", sona: "知", soweli: "獸", suli: "大", suno: "日", supa: "面", suwi: "甜", tan: "因", taso: "只", telo: "水", tenpo: "時", toki: "言", tomo: "室", tu: "二", unpa: "性", uta: "口", utala: "爭", walo: "白", wan: "一", waso: "鳥", wawa: "力", weka: "無", wile: "要"} // hand transcribed
	}),
	new Encoding({
		name: "nimi tu",
		creator: "jan Ante",
		url: "http://forums.tokipona.org/viewtopic.php?f=7&t=1165&start=20&p=5841&view=show#p5841",
		mapping: {ala: "aa", kalama: "ka", lape: "la", ma: "ma", poka: "oa", pali: "pa", sina: "sa", tan: "ta", ken: "ke", len: "le", nena: "ne", selo: "se", kin: "ki", lipu: "li", mi: "mi", ni: "ni", poki: "oi", pini: "pi", sin: "si", wile: "wi", ijo: "ij", kili: "kj", linja: "lj", mije: "mj", pimeja: "pj", sijelo: "sj", akesi: "ak", ike: "ik", jaki: "jk", kepeken: "kk", luka: "lk", moku: "mk", namako: "nk", pakala: "pk", sike: "sk", toki: "tk", weka: "wk", ale: "al", ali: "al", jelo: "jl", kala: "kl", lili: "ll", meli: "ml", olin: "ol", pilin: "pl", seli: "sl", telo: "tl", utala: "ul", walo: "wl", seme: "em", kama: "km", mama: "mm", nimi: "nm", pan: "pm", sama: "sm", tomo: "tm", en: "en", jan: "jn", kon: "kn", lon: "ln", mani: "mn", nasin: "nn", ona: "on", pana: "pn", suno: "sn", tenpo: "tn", unpa: "un", wan: "wn", ilo: "io", jo: "jo", ko: "ko", loje: "lo", moli: "mo", noka: "no", oko: "oo", pona: "po", sona: "so", anpa: "ap", kipisi: "ip", kulupu: "kp", lupa: "lp", nanpa: "np", open: "op", pipi: "pp", sinpin: "sp", supa: "up", alasa: "as", esun: "es", insa: "is", kasi: "ks", laso: "ls", monsi: "ms", nasa: "ns", palisa: "ps", taso: "ts", musi: "us", waso: "ws", ante: "at", kute: "kt", lete: "lt", mute: "mt", sitelen: "st", uta: "ut", anu: "au", kule: "ku", lukin: "lu", mun: "mu", pu: "pu", suli: "su", tu: "tu", awen: "aw", kiwen: "kw", lawa: "lw", soweli: "ow", sewi: "sw", tawa: "tw", suwi: "uw", wawa: "ww", la: "^", li: "*", o: "!", e: "~", pi: "@"} 
	}),
	new Encoding({
		name: "toki lili",
		creator: "jan Pitelo",
		url: "http://thaiyoo.com/tokipona/tokilili.htm",
		mapping: {a: "aa", akesi: "ak", ala: "al", alasa: "as", ali: "ai", anpa: "ap", ante: "at", anu: "an", awen: "aw", e: "ee", en: "en", esun: "es", ijo: "ij", ike: "ik", ilo: "io", insa: "iz", jaki: "jk", jan: "ja", jelo: "jl", jo: "jo", kala: "qa", kalama: "lm", kama: "ka", kasi: "ks", ken: "kn", kepeken: "kp", kili: "kl", kin: "qn", kipisi: "qs", kiwen: "kw", ko: "ko", kon: "qu", kule: "ql", kulupu: "qp", kute: "kt", la: "la", lape: "lp", laso: "ls", lawa: "lw", len: "ln", lete: "lt", li: "li", lili: "il", linja: "rj", lipu: "lb", loje: "lj", lon: "lo", luka: "lk", lukin: "lu", lupa: "rp", ma: "ma", mama: "um", mani: "mn", meli: "ml", mi: "mi", mije: "mj", moku: "mk", moli: "mx", monsi: "mz", mu: "mu", mun: "mw", musi: "ms", mute: "mt", namako: "nq", nanpa: "np", nasa: "ns", nasin: "nz", nena: "ne", ni: "ni", nimi: "nm", noka: "nk", o: "oo", oko: "ok", olin: "ol", ona: "oa", open: "op", pakala: "pq", pali: "pl", palisa: "ps", pan: "pn", pana: "ba", pi: "pi", pilin: "bl", pimeja: "pm", pini: "bn", pipi: "ip", poka: "pk", poki: "px", pona: "po", pu: "pu", sama: "sa", seli: "sl", selo: "zl", seme: "se", sewi: "sw", sijelo: "sj", sike: "sk", sin: "xn", sina: "si", sinpin: "sp", sitelen: "st", sona: "so", soweli: "zo", suli: "su", suno: "zn", supa: "zp", suwi: "zi", tan: "tn", taso: "ts", tawa: "tw", telo: "tl", tenpo: "te", toki: "to", tomo: "tm", tu: "tu", unpa: "up", uta: "ut", utala: "ul", walo: "wl", wan: "wn", waso: "ws", wawa: "wa", weka: "wk", wile: "wi"}
	}),
	new Encoding({
		name: "ASCII syllabary",
		creator: "jan Misali",
		url: "https://www.seximal.net/tkpn",
		mapping: {a: "A", akesi: "AGs", ala: "A'", alasa: "A']", ale: "Ar", ali: "Al", anpa: "an6", ante: "anE", anu: "A/", awen: "Av", en: "&", esun: "e4", ijo: "iJ", ike: "iG", ilo: "i~", insa: "!]", jaki: "jk", jelo: "y~", jo: "J", kala: "}'", kalama: "}'`", kama: "}`", kasi: "}s", ken: "g", kepeken: "GBg", kili: "kl", kin: "Q", kipisi: "kPs", kiwen: "kv", ko: "H", kon: "h", kule: "qr", kulupu: "q5f", kute: "qE", la: "'", lape: "'B", laso: "'S", lawa: "'1", leko: "rH", len: "$", lete: "rE", li: "l", lili: "ll", linja: "Ij", lipu: "lf", loje: "~y", lon: "R", luka: "5}", lukin: "5Q", lupa: "56", ma: "`", mama: "``", mani: "`N", meli: "?l", mi: "m", mije: "my", moku: "Oq", moli: "Ol", monsi: "@s", monsuta: "@zX", mu: "u", mun: "3", musi: "us", mute: "uE", namako: "#`H", nanpa: "nan6", nasa: "#]", nasin: "#C", nena: "^#", ni: "N", nimi: "Nm", noka: "*}", oko: "oH", olin: "oI", ona: "o#", open: "oF", pakala: "6}'", pake: "6G", pali: "6l", palisa: "6l]", pana: "6#", pi: "P", pilin: "PI", pimeja: "P?j", pini: "PN", pipi: "PP", poka: "p}", poki: "pk", pona: "p#", powe: "pV", pu: "f", sama: "]`", seli: "Zl", selo: "Z~", seme: "Z?", sewi: "ZW", sijelo: "sy~", sike: "sG", sin: "C", sina: "s#", sinpin: "C%", sitelen: "sE$", sona: "S#", soweli: "SVl", suli: "zl", suno: "z*", supa: "z6", suwi: "zW", taso: "XS", tawa: "X1", telo: "E~", tenpo: "xp", toki: "tk", tomo: "tO", tonsi: "Ds", tu: "2", unpa: "U6", uta: "0X", utala: "0X'", walo: "1~", waso: "1S", wawa: "11", weka: "V}", wile: "Wr"}, 
		demap: {"i": "i", "0": "u", "e": "e", "o": "o", "A": "a", "!": "in", "U": "un", "&": "en", "7": "on", "m": "mi", "u": "mu", "?": "me", "O": "mo", "`": "ma", "8": "min", "3": "mun", "9": "men", "@": "mon", "N": "ni", "/": "nu", "^": "ne", "*": "no", "#": "na", "(": "nin", ")": "nun", "-": "nen", "_": "non", "P": "pi", "f": "pu", "B": "pe", "p": "po", "6": "pa", "%": "pin", "+": "pun", "F": "pen", "=": "pon", "2": "tu", "E": "te", "t": "to", "X": "ta", "d": "tun", "x": "ten", "D": "ton", "k": "ki", "q": "ku", "G": "ke", "H": "ko", "}": "ka", "Q": "kin", "{": "kun", "g": "ken", "h": "kon", "s": "si", "z": "su", "Z": "se", "S": "so", "]": "sa", "C": "sin", "4": "sun", "[": "sen", "\\": "son", "W": "wi", "V": "we", "1": "wa", "v": "wen", "l": "li", "5": "lu", "r": "le", "~": "lo", "\'": "la", "I": "lin", ";": "lun", "$": "len", "R": "lon", ",": "ju", "y": "je", "J": "jo", "j": "ja", "<": "jun", "\'": "jen", ">": "jon"}
		// the demapping is in the actual format of by syllable, with the exception of '|': 'win' because that caused many errors with regex 
	})
]
//data[0].encode = (text, seperator)=>`<span class="linjapona">${text.replace(this.matchword, match=>this.mapping[match]+(seperator||""))}</span>`
// {'i':'i','u':'0','e':'e','o':'o','a':'A','in':'!','un':'U','en':'&','on':'7','mi':'m','mu':'u','me':'?','mo':'O','ma':'`','min':'8','mun':'3','men':'9','mon':'@','ni':'N','nu':'/','ne':'^','no':'*','na':'#','nin':'(','nun':')','nen':'-','non':'_','pi':'P','pu':'f','pe':'B','po':'p','pa':'6','pin':'%','pun':'+','pen':'F','pon':'=','tu':'2','te':'E','to':'t','ta':'X','tun':'d','ten':'x','ton':'D','ki':'k','ku':'q','ke':'G','ko':'H','ka':'}','kin':'Q','kun':'{','ken':'g','kon':'h','si':'s','su':'z','se':'Z','so':'S','sa':']','sin':'C','sun':'4','sen':'[','son':'\\','wi':'W','we':'V','wa':'1','win':'|','wen':'v','li':'l','lu':'5','le':'r','lo':'~','la':'\'','lin':'I','lun':';','len':'$','lon':'R','ju':',','je':'y','jo':'J','ja':'j','jun':'<','jen':'\'','jon':'>'}


/*
function generateWordsFromSyllableMapping(mappings) {
	function extractSyllables(word) {
		word += ' '
		vowels = 'aeiou'.split('')
		syllables = []
		currentSyllable = lastLetter = ''
		for (letter of word) {
			if (lastLetter=='n' && !vowels.includes(letter)) {
				syllables[syllables.length-1] += 'n'
				currentSyllable = currentSyllable.slice(0,-1)
			} 
		
			if (currentSyllable.length==0 && vowels.includes(letter)) currentSyllable=' '
			currentSyllable += letter
			
			if (currentSyllable.length==2) {
				syllables.push(currentSyllable.replace(' ',''))
				currentSyllable = ''
			}
			lastLetter = letter
		}
		return syllables
	}
	extractedWordlist = [... document.getElementById('table').children[1].children ].map(row=>row.children[0].innerText)

	result = {}
	extractedWordlist.forEach(word => {
		encoded = extractSyllables(word).map(syllable=> 
																					mappings[syllable]
																						||syllable	// if no mapping definition exists for certain syllable, just leave it 
																				).join('')
		if (encoded!=word) result[word] = encoded // ignore ones where no change occured (e.g. '!'->'!')
	})
	return result
}
*/
wordList = [] // global variable


function generateTables(data) {

	// list all words in dataset
	wordList = []
	data.forEach(corpus=>{
		if (corpus.showList) {
			Object.keys(corpus.mapping).forEach(word=>{
				if (!wordList.includes(word)) {
					wordList.push(word)
				}
			})
		}
	})
	wordList.sort()
	//console.log(JSON.stringify(wordList))

	// generate 2d array from data
	var table = new Array(wordList.length)

	for (var i = 0; i < wordList.length; i++) {
		var word = wordList[i]
		table[i] = [word]
		
		var offset = 1
		for (let corpus = 0; corpus < data.length; corpus++) {
			if (data[corpus].showList) table[i][corpus+offset] = data[corpus].mapping[word] 
			else offset-=1
		}
	}

	// convert 2d array into html table
	function tableToElement(table, id, columndata) {
		console.log(columndata)
		var tableElement = document.getElementById(id)
		let output = ''
		if (columndata) {
			output+='<colgroup><col>'
			for (datum of columndata) {
				if (datum) output+='<col style="'+datum+'">'
				else output+='<col>'
			}
			output+='</colgroup>'
		}
		console.log(output)
		
		output+='<tbody>'

		output += '<tbody>'
		for (row = 0; row < table.length; row++) {
			output+='<tr>'
			for (column = 0; column < table[row].length; column++) {
				if (columndata && columndata[column-1]) { output += `<td style="${columndata[column-1]}">` }
				else { output += "<td>" }
				output+=`${table[row][column]||""}</td>`
			}
			output+='</tr>'
		}
		output+='</tbody>'
		
		tableElement.innerHTML = output
		return tableElement
	}
	table = tableToElement(table, "table", data.filter(n=>n.showList).map(x=>x.style))

	function onmove (e) {
		if (e.target.tagName=="TD") {
			[...table.children[0].children].forEach((colgroup,i)=>{
				if (i===e.target.cellIndex) {
					colgroup.style.backgroundColor = '#633'
					let mapping = data.filter(x=>x.showList)[i-1] || {name:'',shortname:'source'}
					table.rows[0].children[i].innerHTML = `<a href="#${mapping.name}">${mapping.shortname}</a>`
				} else {
					colgroup.style.backgroundColor = table.rows[0].children[i].innerHTML = ''
				}
			})
		}
	}
	table.onmouseover = table.onclick = onmove
	table.onmouseleave = ()=>[...table.children[0].children].forEach((colgroup,i)=>{colgroup.style.backgroundColor = table.rows[0].children[i].innerHTML = ''})

	//make lookupsheet of unicode->tokipona
	var lookup = {}
	for (corpus = 0; corpus < data.length; corpus++) {
		if (data[corpus].showList) {
			Object.keys(data[corpus].mapping).map(word=>{
				var code = data[corpus].mapping[word]
				if (!lookup[code]) { lookup[code] = [] }
					lookup[code][corpus] = word
			})
		}
	}

	// add any lookup codes with multiple decodings to array
	var dupeTable = new Array()
	for (code in lookup) {
		if (new Set(lookup[code]).add(undefined).size>2)
		{dupeTable.push([code, ...lookup[code]])}
	}

	// add column titles
	dupeTable.unshift(["", ...data.map(set=>`<a href="#${set.name}">${set.shortname}</a>`)])

	// delete column if all empty (will also delete titles)
	for (var corpus = data.length; corpus >= 0; corpus--) {
		if (dupeTable.slice(2).every(row=>row[corpus]===undefined))
		dupeTable.map(row=>row.splice(corpus, 1))
	}

	// put into table
	tableToElement(dupeTable, "dupes")
}
generateTables(data)

/*function newInput(e){
	text = e.target.value
	cleantext = text.replace(/[ \t.,:!?\n]/g, "")
	output = document.getElementById("output")
	threshold = 0.5
	
	possibleMappings = detectLanguage(cleantext).filter(x=>x[1]>threshold)

	output.innerHTML = ""
	for (match of possibleMappings) {
		output.innerHTML+= `<strong> ${match[0].shortname}->latin (${Math.floor(match[1]*100)}%) </strong> ${match[0].decode(text, " ")}<br>`
	}


}
document.getElementById("dynamicinput").onkeyup = newInput
*/

function detectLanguage(text) {
	if (text == "") { return [[data[0],1]]}	
	return data.map(mapping=>{return [mapping, mapping.likelyhood(text.replace(/[ \t.,!?\n]/g, ""))]}).sort((a,b)=>b[1]-a[1])
}

function allTranslations(e) {
	text = interpretInput(e)
	poa = "<table>"
	//poa+= "<tr><td>Latin</td><td>"+text+"</td></tr>"
	if (text.length>0) {
		for (dataset of data.filter(x=>x.showTrans)) {
			poa+="<tr>"
			poa+=`<td>${dataset.name}</td>`
			poa+=`<td style="${dataset.style}">${dataset.encode(text).replace('\n','<br />')}</td>`
			poa+="</tr>"
		}
	}
	poa+= "</table>"

	document.getElementById('output').innerHTML = poa
}

function interpretInput(e) {
	var plaintext = e.target.value
	var mostLikely = detectLanguage(plaintext).filter(([_, likelyhood])=>likelyhood>0.6)[0]
	if (mostLikely) mostLikely = mostLikely[0]

	if (settings.detectInputLanguage) {
		settings.inputLanguage = mostLikely
		document.getElementsByClassName('translationheader')[0].children[0].innerText = "Detected - "+(mostLikely?.shortname||'latin')
	}

	let hint = document.getElementById('suggestion')
	if (mostLikely == (settings.inputLanguage||undefined)) {
		hint.hidden = true
	} else {
		hint.hidden = false
		if (mostLikely) hint.innerHTML = `Did you mean to translate from <a onclick="changeLang(0, data[${data.findIndex(x=>x.name==mostLikely.name)}])" style="${mostLikely.style}">${mostLikely.shortname}</a>`
		//else	hint.innerHTML = `Did you mean to translate from <a onclick="changeLang(0, false)">Latin</a>`
	}

	return settings.inputLanguage.decode(plaintext)
}

function changeLang(isOutputTable, newLang) {
	if (isOutputTable) {
		settings.outputLanguage = newLang
		settings.showAllOutputs = false
	}
	else {
		settings.inputLanguage = newLang
		settings.detectInputLanguage = false
	}
	populateTranslateHTML()
}
function defaultify(isOutputTable) {
	if (isOutputTable) {
		settings.outputLanguage = false
		settings.showAllOutputs = true
	}
	else {
		settings.inputLanguage = false
		settings.detectInputLanguage = true
	}
	populateTranslateHTML()
}

function populateTranslateHTML() {
	console.log(settings)
	input = document.getElementById("dynamicinput")
	input.style = settings.inputLanguage.style
	output = document.getElementById('output')

	if (settings.showAllOutputs) {
		input.onkeyup = allTranslations
	} else if (settings.outputLanguage) {
		input.onkeyup = (e)=>{output.innerText = settings.outputLanguage.encode(interpretInput(e))}
	} else {
		input.onkeyup = (e)=>{output.innerText = interpretInput(e)}
	}

	[...document.getElementsByClassName('translationheader')].forEach((headerRow,i)=>{
		headerRow.innerHTML = [
			`<div onclick="defaultify(${i})" id="${i?'All">All':'Detect">Detect Script'}</div>`,
			//`<div onclick="changeLang(${i}, false)" id="${i}:latin">Latin</div>`,
			...data.map((x,index)=>x.showTrans?`<div id="${i}:${x.name}" onclick="changeLang(${i}, data[${index}])" style="${x.style}">${x.shortname}</div>`:'')
		].join('\n')
	})

	// tag elements as selected as specified in settings object
	if (settings.detectInputLanguage) document.getElementById('Detect')												 .classList.add('selected')
	else if (settings.inputLanguage)	document.getElementById("0:"+settings.inputLanguage.name) .classList.add('selected')
	else															document.getElementById('0:latin')												.classList.add('selected')
	
	if (settings.showAllOutputs)			document.getElementById('All')														.classList.add('selected')
	else if (settings.outputLanguage) document.getElementById("1:"+settings.outputLanguage.name).classList.add('selected')
	else															document.getElementById('1:latin')												.classList.add('selected')


	// scroll both selected ones into view. preserve vertical scroll so it doesnt jump around the place.
	let cachedVertScroll = document.scrollingElement.scrollTop;
	[...document.getElementsByClassName('selected')].forEach(element=>element.scrollIntoView());
	document.scrollingElement.scrollTop = cachedVertScroll

	// force the translation by faking an event
	input.onkeyup({target: input})
}

settings = { // for the translation
	inputLanguage: false,
	detectInputLanguage: true,	
	outputLanguage: false,
	showAllOutputs: true,
	forceSpaces: document.getElementById("force spaces").checked,
	stripWhitespace: document.getElementById("strip whitespace").checked
}
populateTranslateHTML()

// credits & settings
const EDITABLE_SETTINGS = [['show in table', 'showList'], ['show in translation box', 'showTrans']]
credits = document.getElementById('credits')
data.forEach(mapping=>{
	let elm = document.createElement('div')
	elm.id = mapping.name
	
	elm.append(`(${mapping.shortname}) `)

	txt = document.createElement('a')
	txt.href = mapping.url
	txt.append( mapping.name )
	elm.appendChild(txt)
	
	if (mapping.creator !== 'unknown') {
		elm.append(' made by ')

		txt = document.createElement('i')
		txt.append(mapping.creator)
		elm.appendChild(txt)
	}
	
	let settings = document.createElement('div');

	EDITABLE_SETTINGS.forEach(([caption, key],i)=>{
		let checkbox = document.createElement('input')
		checkbox.type = 'checkbox'
		checkbox.defaultChecked = mapping[key]
		checkbox.id = i+mapping.name
		checkbox.addEventListener('change', changeSettings)

		let label = document.createElement('label')
		label.appendChild(checkbox)
		label.append(caption)
		label.for = i+mapping.name

		settings.appendChild(label)
		settings.appendChild(document.createElement('br'))
	})
	elm.appendChild(settings)
	
	credits.appendChild(elm)
})

function changeSettings (e) { // when the user changes some settings down the bottom
	// extract what we changing
	var [type, target] = [e.target.id[0], e.target.id.slice(1)]
	// change it
	data.find(x=>x.name==target)[EDITABLE_SETTINGS[type][1]] = e.target.type=="checkbox"?e.target.checked:e.target.value
	// make the regenerate button visible
	document.getElementById('reload').hidden = false // todo: if u undo settings changes so that overall nothing has changed maybe hide the button?
}
function reload() {
	generateTables(data)
	settings = { // reset translation so u arent like on a thing thats now hidden
		inputLanguage: false,
		detectInputLanguage: true,	
		outputLanguage: false,
		showAllOutputs: true,
		forceSpaces: document.getElementById("force spaces").checked,
		stripWhitespace: document.getElementById("strip whitespace").checked
	}
	populateTranslateHTML()

	document.getElementById('reload').hidden = true
}