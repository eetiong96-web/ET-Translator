const MAX_TEXT_LENGTH = 5000;

const DIRECTIONS = new Set(["auto", "en-zh", "zh-en"]);
const TONES = new Set(["business", "plain", "polished"]);
const PROVIDERS = new Set(["deepseek", "gemini"]);

const BUSINESS_TERMS = [
  ["alignment", "对齐", "duìqí", "Make sure people agree on the same goal or decision."],
  ["scope", "范围", "fànwéi", "The agreed boundary of what work is included."],
  ["deliverable", "交付物", "jiāofùwù", "A concrete output that must be delivered."],
  ["roadmap", "路线图", "lùxiàntú", "The planned sequence of product or project work."],
  ["priority", "优先级", "yōuxiānjí", "Relative importance or order of work."],
  ["stakeholder", "相关方", "xiāngguān fāng", "People or teams affected by a decision or project."],
  ["requirement", "需求", "xūqiú", "What the product, system, or business needs."],
  ["blocker", "阻塞点", "zǔsè diǎn", "Something preventing progress."],
  ["trade-off", "取舍", "qǔshě", "A decision where gaining one thing means giving up another."],
  ["rollout", "上线/灰度发布", "shàngxiàn / huīdù fābù", "Launch broadly, or launch gradually to a limited group first."],
  ["follow up", "跟进", "gēnjìn", "Continue checking or driving the next action."],
  ["deadline", "截止时间", "jiézhǐ shíjiān", "The final due time."],
  ["risk", "风险", "fēngxiǎn", "Something that could cause failure, delay, or loss."],
  ["decision", "决策", "juécè", "A formal choice or conclusion."],
  ["dependency", "依赖项", "yīlài xiàng", "Work or approval needed before another task can proceed."]
];

const TRADITIONAL_TO_SIMPLIFIED = {
  "與": "与",
  "專": "专",
  "業": "业",
  "東": "东",
  "絲": "丝",
  "丟": "丢",
  "兩": "两",
  "嚴": "严",
  "喪": "丧",
  "個": "个",
  "臨": "临",
  "為": "为",
  "麗": "丽",
  "舉": "举",
  "義": "义",
  "烏": "乌",
  "樂": "乐",
  "喬": "乔",
  "習": "习",
  "鄉": "乡",
  "書": "书",
  "買": "买",
  "亂": "乱",
  "爭": "争",
  "於": "于",
  "虧": "亏",
  "雲": "云",
  "亞": "亚",
  "產": "产",
  "畝": "亩",
  "親": "亲",
  "褻": "亵",
  "億": "亿",
  "僅": "仅",
  "從": "从",
  "倉": "仓",
  "儀": "仪",
  "們": "们",
  "價": "价",
  "眾": "众",
  "優": "优",
  "會": "会",
  "傘": "伞",
  "偉": "伟",
  "傳": "传",
  "傷": "伤",
  "倫": "伦",
  "偽": "伪",
  "體": "体",
  "餘": "余",
  "傭": "佣",
  "債": "债",
  "傾": "倾",
  "償": "偿",
  "儲": "储",
  "兒": "儿",
  "兌": "兑",
  "黨": "党",
  "蘭": "兰",
  "關": "关",
  "興": "兴",
  "養": "养",
  "內": "内",
  "冊": "册",
  "寫": "写",
  "軍": "军",
  "農": "农",
  "決": "决",
  "況": "况",
  "凍": "冻",
  "淨": "净",
  "準": "准",
  "幾": "几",
  "劃": "划",
  "創": "创",
  "刪": "删",
  "別": "别",
  "劑": "剂",
  "則": "则",
  "剛": "刚",
  "剝": "剥",
  "劇": "剧",
  "剩": "剩",
  "勞": "劳",
  "勢": "势",
  "勳": "勋",
  "動": "动",
  "務": "务",
  "勝": "胜",
  "區": "区",
  "協": "协",
  "單": "单",
  "賣": "卖",
  "盧": "卢",
  "衛": "卫",
  "卻": "却",
  "廠": "厂",
  "曆": "历",
  "歷": "历",
  "壓": "压",
  "縣": "县",
  "參": "参",
  "雙": "双",
  "發": "发",
  "變": "变",
  "敘": "叙",
  "號": "号",
  "嘆": "叹",
  "聽": "听",
  "啟": "启",
  "吳": "吴",
  "員": "员",
  "週": "周",
  "諮": "咨",
  "響": "响",
  "問": "问",
  "啞": "哑",
  "喚": "唤",
  "喬": "乔",
  "單": "单",
  "喲": "哟",
  "嗆": "呛",
  "嗇": "啬",
  "嗎": "吗",
  "噸": "吨",
  "聖": "圣",
  "園": "园",
  "圓": "圆",
  "圖": "图",
  "團": "团",
  "國": "国",
  "圍": "围",
  "壞": "坏",
  "塊": "块",
  "堅": "坚",
  "壇": "坛",
  "壩": "坝",
  "墜": "坠",
  "墮": "堕",
  "壯": "壮",
  "聲": "声",
  "壹": "壹",
  "處": "处",
  "備": "备",
  "複": "复",
  "夠": "够",
  "頭": "头",
  "夾": "夹",
  "奪": "夺",
  "奮": "奋",
  "獎": "奖",
  "奧": "奥",
  "妝": "妆",
  "婦": "妇",
  "媽": "妈",
  "嫻": "娴",
  "嬰": "婴",
  "學": "学",
  "寧": "宁",
  "寶": "宝",
  "實": "实",
  "審": "审",
  "寫": "写",
  "寬": "宽",
  "對": "对",
  "尋": "寻",
  "導": "导",
  "將": "将",
  "專": "专",
  "層": "层",
  "屬": "属",
  "岡": "冈",
  "島": "岛",
  "嶺": "岭",
  "峽": "峡",
  "崗": "岗",
  "幣": "币",
  "帥": "帅",
  "師": "师",
  "帳": "帐",
  "帶": "带",
  "幀": "帧",
  "幫": "帮",
  "幹": "干",
  "庫": "库",
  "廁": "厕",
  "廂": "厢",
  "廈": "厦",
  "廚": "厨",
  "廟": "庙",
  "廣": "广",
  "廢": "废",
  "開": "开",
  "異": "异",
  "棄": "弃",
  "張": "张",
  "彌": "弥",
  "彎": "弯",
  "彙": "汇",
  "彈": "弹",
  "強": "强",
  "歸": "归",
  "錄": "录",
  "徹": "彻",
  "徑": "径",
  "後": "后",
  "從": "从",
  "復": "复",
  "微": "微",
  "徵": "征",
  "憶": "忆",
  "懷": "怀",
  "態": "态",
  "總": "总",
  "恆": "恒",
  "戀": "恋",
  "懇": "恳",
  "惡": "恶",
  "惱": "恼",
  "悅": "悦",
  "懸": "悬",
  "慘": "惨",
  "懲": "惩",
  "愛": "爱",
  "愜": "惬",
  "慣": "惯",
  "慶": "庆",
  "憂": "忧",
  "憑": "凭",
  "憐": "怜",
  "憤": "愤",
  "願": "愿",
  "戲": "戏",
  "戰": "战",
  "戶": "户",
  "撲": "扑",
  "執": "执",
  "擴": "扩",
  "掃": "扫",
  "揚": "扬",
  "擾": "扰",
  "撫": "抚",
  "拋": "抛",
  "摳": "抠",
  "搶": "抢",
  "護": "护",
  "報": "报",
  "擔": "担",
  "擬": "拟",
  "攏": "拢",
  "揀": "拣",
  "擁": "拥",
  "撥": "拨",
  "擇": "择",
  "掛": "挂",
  "摯": "挚",
  "摑": "掴",
  "撓": "挠",
  "擋": "挡",
  "掙": "挣",
  "擠": "挤",
  "揮": "挥",
  "挾": "挟",
  "捨": "舍",
  "撈": "捞",
  "損": "损",
  "撿": "捡",
  "換": "换",
  "據": "据",
  "捲": "卷",
  "掃": "扫",
  " 掃": "扫",
  "掄": "抡",
  "揚": "扬",
  "換": "换",
  "揮": "挥",
  "搖": "摇",
  "搗": "捣",
  "搜": "搜",
  "撚": "捻",
  "撝": "㧑",
  "擺": "摆",
  "攤": "摊",
  "攪": "搅",
  "攜": "携",
  "攝": "摄",
  "支": "支",
  "敗": "败",
  "敘": "叙",
  "數": "数",
  "斂": "敛",
  "斃": "毙",
  "斬": "斩",
  "斷": "断",
  "無": "无",
  "舊": "旧",
  "時": "时",
  "曠": "旷",
  "暢": "畅",
  "暫": "暂",
  "曆": "历",
  "會": "会",
  "術": "术",
  "機": "机",
  "殺": "杀",
  "雜": "杂",
  "權": "权",
  "條": "条",
  "來": "来",
  "楊": "杨",
  "傑": "杰",
  "極": "极",
  "構": "构",
  "標": "标",
  "棧": "栈",
  "欄": "栏",
  "樹": "树",
  "樣": "样",
  "檢": "检",
  "樓": "楼",
  "槳": "桨",
  "樂": "乐",
  "樞": "枢",
  "槍": "枪",
  "橋": "桥",
  "機": "机",
  "橫": "横",
  "檔": "档",
  "檢": "检",
  "櫃": "柜",
  "檯": "台",
  "櫻": "樱",
  "歡": "欢",
  "歲": "岁",
  "歷": "历",
  "歸": "归",
  "殘": "残",
  "毀": "毁",
  "氣": "气",
  "決": "决",
  "沒": "没",
  "沖": "冲",
  "況": "况",
  "洶": "汹",
  "浹": "浃",
  "涼": "凉",
  "淚": "泪",
  "淵": "渊",
  "淨": "净",
  "淺": "浅",
  "渦": "涡",
  "測": "测",
  "濟": "济",
  "渾": "浑",
  "湯": "汤",
  "準": "准",
  "溝": "沟",
  "溫": "温",
  "滄": "沧",
  "滅": "灭",
  "滌": "涤",
  "滾": "滚",
  "滿": "满",
  "濾": "滤",
  "濫": "滥",
  "濱": "滨",
  "灘": "滩",
  "灣": "湾",
  "濕": "湿",
  "燈": "灯",
  "靈": "灵",
  "災": "灾",
  "爐": "炉",
  "點": "点",
  "煉": "炼",
  "熱": "热",
  "獎": "奖",
  "獨": "独",
  "獸": "兽",
  "獲": "获",
  "環": "环",
  "現": "现",
  "琺": "珐",
  "瑪": "玛",
  "產": "产",
  "畢": "毕",
  "畫": "画",
  "異": "异",
  "疇": "畴",
  "瘋": "疯",
  "療": "疗",
  "瘡": "疮",
  "監": "监",
  "盤": "盘",
  "盜": "盗",
  "眾": "众",
  "著": "着",
  "睜": "睁",
  "瞭": "了",
  "矚": "瞩",
  "礎": "础",
  "確": "确",
  "碼": "码",
  "禮": "礼",
  "禍": "祸",
  "種": "种",
  "稱": "称",
  "穩": "稳",
  "穫": "获",
  "積": "积",
  "窩": "窝",
  "窮": "穷",
  "竄": "窜",
  "竅": "窍",
  "競": "竞",
  "筆": "笔",
  "筍": "笋",
  "箋": "笺",
  "箏": "筝",
  "節": "节",
  "範": "范",
  "築": "筑",
  "簡": "简",
  "簽": "签",
  "籌": "筹",
  "籃": "篮",
  "類": "类",
  "糾": "纠",
  "紀": "纪",
  "級": "级",
  "約": "约",
  "紅": "红",
  "紋": "纹",
  "納": "纳",
  "紙": "纸",
  "紛": "纷",
  "紡": "纺",
  "紐": "纽",
  "線": "线",
  "練": "练",
  "組": "组",
  "紳": "绅",
  "細": "细",
  "織": "织",
  "終": "终",
  "紹": "绍",
  "經": "经",
  "綁": "绑",
  "結": "结",
  "給": "给",
  "絡": "络",
  "絕": "绝",
  "統": "统",
  "綠": "绿",
  "維": "维",
  "綱": "纲",
  "網": "网",
  "綴": "缀",
  "綵": "彩",
  "綜": "综",
  "緊": "紧",
  "緒": "绪",
  "線": "线",
  "編": "编",
  "緩": "缓",
  "緯": "纬",
  "緻": "致",
  "縱": "纵",
  "縫": "缝",
  "縮": "缩",
  "績": "绩",
  "繆": "缪",
  "總": "总",
  "繼": "继",
  "續": "续",
  "纖": "纤",
  "纏": "缠",
  "罰": "罚",
  "罷": "罢",
  "羅": "罗",
  "羆": "罴",
  "義": "义",
  "習": "习",
  "翹": "翘",
  "耬": "耧",
  "職": "职",
  "聯": "联",
  "聰": "聪",
  "聽": "听",
  "肅": "肃",
  "脅": "胁",
  "脈": "脉",
  "腦": "脑",
  "腳": "脚",
  "脫": "脱",
  "臉": "脸",
  "臨": "临",
  "與": "与",
  "舊": "旧",
  "艦": "舰",
  "艙": "舱",
  "藝": "艺",
  "節": "节",
  "莊": "庄",
  "華": "华",
  "萬": "万",
  "葉": "叶",
  "著": "着",
  "蒼": "苍",
  "蓋": "盖",
  "藍": "蓝",
  "號": "号",
  "處": "处",
  "虛": "虚",
  "蟲": "虫",
  "蠟": "蜡",
  "衛": "卫",
  "衝": "冲",
  "補": "补",
  "裝": "装",
  "複": "复",
  "製": "制",
  "見": "见",
  "規": "规",
  "視": "视",
  "覺": "觉",
  "覽": "览",
  "觀": "观",
  "觸": "触",
  "訂": "订",
  "計": "计",
  "訊": "讯",
  "討": "讨",
  "訓": "训",
  "議": "议",
  "記": "记",
  "講": "讲",
  "謝": "谢",
  "謠": "谣",
  "謀": "谋",
  "謊": "谎",
  "謂": "谓",
  "證": "证",
  "評": "评",
  "識": "识",
  "詐": "诈",
  "訴": "诉",
  "診": "诊",
  "詞": "词",
  "詠": "咏",
  "詢": "询",
  "詣": "诣",
  "試": "试",
  "詩": "诗",
  "詫": "诧",
  "誠": "诚",
  "話": "话",
  "誕": "诞",
  "該": "该",
  "詳": "详",
  "誇": "夸",
  "譽": "誉",
  "誌": "志",
  "認": "认",
  "誤": "误",
  "說": "说",
  "誰": "谁",
  "課": "课",
  "誼": "谊",
  "調": "调",
  "諒": "谅",
  "談": "谈",
  "請": "请",
  "諸": "诸",
  "諾": "诺",
  "讀": "读",
  "諮": "咨",
  "諧": "谐",
  "謁": "谒",
  "謂": "谓",
  "諷": "讽",
  "諭": "谕",
  "謎": "谜",
  "謹": "谨",
  "謾": "谩",
  "譜": "谱",
  "識": "识",
  "譯": "译",
  "議": "议",
  "護": "护",
  "譽": "誉",
  "變": "变",
  "讓": "让",
  "讚": "赞",
  "豐": "丰",
  "貝": "贝",
  "負": "负",
  "財": "财",
  "貢": "贡",
  "貧": "贫",
  "貨": "货",
  "販": "贩",
  "貪": "贪",
  "責": "责",
  "貫": "贯",
  "貴": "贵",
  "貸": "贷",
  "費": "费",
  "貼": "贴",
  "貿": "贸",
  "賀": "贺",
  "賃": "赁",
  "賄": "贿",
  "資": "资",
  "賊": "贼",
  "賓": "宾",
  "賬": "账",
  "賭": "赌",
  "賞": "赏",
  "賠": "赔",
  "賢": "贤",
  "賣": "卖",
  "賦": "赋",
  "質": "质",
  "賴": "赖",
  "賺": "赚",
  "購": "购",
  "贈": "赠",
  "贊": "赞",
  "趕": "赶",
  "趨": "趋",
  "趙": "赵",
  "跡": "迹",
  "踐": "践",
  "踴": "踊",
  "車": "车",
  "軌": "轨",
  "軍": "军",
  "軟": "软",
  "軸": "轴",
  "較": "较",
  "載": "载",
  "輔": "辅",
  "輕": "轻",
  "輛": "辆",
  "輝": "辉",
  "輩": "辈",
  "輪": "轮",
  "輯": "辑",
  "輸": "输",
  "轄": "辖",
  "轉": "转",
  "辦": "办",
  "辭": "辞",
  "邊": "边",
  "遼": "辽",
  "達": "达",
  "遷": "迁",
  "過": "过",
  "運": "运",
  "還": "还",
  "這": "这",
  "進": "进",
  "遠": "远",
  "違": "违",
  "連": "连",
  "遲": "迟",
  "適": "适",
  "選": "选",
  "遺": "遗",
  "郵": "邮",
  "鄧": "邓",
  "鄭": "郑",
  "鄰": "邻",
  "醫": "医",
  "釋": "释",
  "針": "针",
  "釘": "钉",
  "鋼": "钢",
  "錄": "录",
  "錢": "钱",
  "錯": "错",
  "錫": "锡",
  "鍋": "锅",
  "鍵": "键",
  "鍊": "链",
  "鎖": "锁",
  "鎮": "镇",
  "鏡": "镜",
  "長": "长",
  "門": "门",
  "閃": "闪",
  "閉": "闭",
  "問": "问",
  "間": "间",
  "閑": "闲",
  "開": "开",
  "閒": "闲",
  "閣": "阁",
  "隊": "队",
  "階": "阶",
  "陽": "阳",
  "際": "际",
  "陸": "陆",
  "險": "险",
  "隨": "随",
  "隱": "隐",
  "隸": "隶",
  "難": "难",
  "雖": "虽",
  "雙": "双",
  "雞": "鸡",
  "離": "离",
  "雜": "杂",
  "電": "电",
  "霧": "雾",
  "靜": "静",
  "頁": "页",
  "頂": "顶",
  "項": "项",
  "順": "顺",
  "須": "须",
  "頑": "顽",
  "頒": "颁",
  "預": "预",
  "領": "领",
  "頗": "颇",
  "頭": "头",
  "頻": "频",
  "題": "题",
  "額": "额",
  "顏": "颜",
  "願": "愿",
  "類": "类",
  "風": "风",
  "飛": "飞",
  "飄": "飘",
  "飆": "飙",
  "餘": "余",
  "飯": "饭",
  "飲": "饮",
  "飾": "饰",
  "餓": "饿",
  "館": "馆",
  "馬": "马",
  "駐": "驻",
  "駛": "驶",
  "駕": "驾",
  "驗": "验",
  "騙": "骗",
  "騷": "骚",
  "驅": "驱",
  "驚": "惊",
  "魚": "鱼",
  "鮮": "鲜",
  "鳥": "鸟",
  "鹽": "盐",
  "麗": "丽",
  "齊": "齐",
  "齒": "齿",
  "龍": "龙"
};

export function validateTranslateRequest(input = {}) {
  const text = typeof input.text === "string" ? input.text.trim() : "";
  const direction = typeof input.direction === "string" ? input.direction : "auto";
  const tone = typeof input.tone === "string" ? input.tone : "business";
  const provider = typeof input.provider === "string" ? input.provider : "deepseek";
  const context = typeof input.context === "string" ? input.context.trim().slice(0, 1000) : "";

  if (!text) {
    throw new Error("Enter something to translate.");
  }

  if (text.length > MAX_TEXT_LENGTH) {
    throw new Error("Keep it under 5000 characters.");
  }

  if (!DIRECTIONS.has(direction)) {
    throw new Error("Choose a valid translation direction.");
  }

  if (!TONES.has(tone)) {
    throw new Error("Choose a valid tone.");
  }

  if (!PROVIDERS.has(provider)) {
    throw new Error("Choose a valid AI provider.");
  }

  return { text, direction, tone, provider, context };
}

export function buildSystemPrompt() {
  const glossaryLines = BUSINESS_TERMS.map(
    ([english, chinese, pinyin, meaning]) => `- ${english}: ${chinese} (${pinyin}) means ${meaning}`
  ).join("\n");

  return `You are a fast English-Chinese business translator for a product manager working in a Mainland Chinese company.

Translate between English and Simplified Chinese only. Prefer Mainland Chinese business wording over casual, literal, or Taiwan/Hong Kong phrasing unless the source clearly requires otherwise.

Rules:
- Detect source language when direction is auto.
- For English to Chinese, produce natural corporate Chinese that colleagues would actually use in meetings, chat, specs, and project updates.
- Translate every normal-language sentence into the target language. Do not leave English or Chinese prose untranslated unless it is an exact preserved token.
- For mixed code review, PRD, ticket, or bug-report text, translate surrounding English prose into Simplified Chinese and preserve only code identifiers, method names, field names, class names, API names, file paths, URLs, acronyms, numbers, and exact error names.
- Preserve technical tokens only when they are exact identifiers or labels. Translate the explanation around them.
- Do not copy English sentences into the Chinese translation just because they contain code identifiers. Example: translate the explanation around orderPaymentComplianceEnable and getId(), but keep those identifiers unchanged.
- Do not use Traditional Chinese. Convert all Chinese output to Simplified Chinese before returning JSON, including translation, terms, and alternatives.
- For Chinese to English, translate the business meaning clearly rather than word-for-word.
- Preserve names, product names, acronyms, numbers, dates, times, links, bullet structure, and code-like tokens.
- Always include Hanyu Pinyin with tone marks for the Chinese translation or Chinese source phrase.
- Explain the plain meaning of the full sentence or paragraph in one short sentence.
- Extract only the most important business words or phrases. Return at most 3 terms.
- Return at most 1 alternative phrasing.
- If a term has multiple business meanings, briefly explain which meaning you chose.
- Use Simplified Chinese characters.
- Do not wrap the JSON in markdown.

Tone modes:
- business: professional, concise, WeChat/work-chat friendly.
- plain: direct and easy to understand.
- polished: more formal and executive-ready.

Common business glossary to prefer where appropriate:
${glossaryLines}`;
}

export const translationSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "sourceLanguage",
    "targetLanguage",
    "translation",
    "pinyin",
    "meaning",
    "terms",
    "alternatives",
    "usageNotes",
    "confidence"
  ],
  properties: {
    sourceLanguage: {
      type: "string",
      description: "Detected source language, such as English, Chinese, or Mixed."
    },
    targetLanguage: {
      type: "string",
      description: "Target language, either English or Chinese."
    },
    translation: {
      type: "string",
      description: "The best translation."
    },
    pinyin: {
      type: "string",
      description: "Hanyu Pinyin with tone marks for the Chinese text involved. Use an empty string if no Chinese text is relevant."
    },
    meaning: {
      type: "string",
      description: "Plain English explanation of what the full text means."
    },
    terms: {
      type: "array",
      description: "Important business terms and word meanings.",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["source", "translation", "pinyin", "meaning", "note"],
        properties: {
          source: { type: "string" },
          translation: { type: "string" },
          pinyin: { type: "string" },
          meaning: { type: "string" },
          note: { type: "string" }
        }
      }
    },
    alternatives: {
      type: "array",
      description: "Optional alternate phrasings for different business situations.",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "text", "pinyin", "whenToUse"],
        properties: {
          label: { type: "string" },
          text: { type: "string" },
          pinyin: { type: "string" },
          whenToUse: { type: "string" }
        }
      }
    },
    usageNotes: {
      type: "array",
      items: { type: "string" }
    },
    confidence: {
      type: "string",
      enum: ["high", "medium", "low"]
    }
  }
};

export function buildOpenAIRequest(request, model = "gpt-5.4-mini") {
  return {
    model,
    input: [
      {
        role: "developer",
        content: [
          {
            type: "input_text",
            text: buildSystemPrompt()
          }
        ]
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: JSON.stringify({
              text: request.text,
              direction: request.direction,
              tone: request.tone,
              context: request.context
            })
          }
        ]
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "business_translation_result",
        strict: true,
        schema: translationSchema
      }
    },
    reasoning: {
      effort: "low"
    },
    max_output_tokens: 1800
  };
}

export function parseOpenAIResponse(payload) {
  const outputText = extractOutputText(payload);

  if (!outputText) {
    throw new Error("The translation service returned no text.");
  }

  const parsed = parseJsonText(outputText);

  if (!parsed || typeof parsed !== "object" || typeof parsed.translation !== "string") {
    throw new Error("The translation service returned an unexpected format.");
  }

  return {
    sourceLanguage: stringOrEmpty(parsed.sourceLanguage),
    targetLanguage: stringOrEmpty(parsed.targetLanguage),
    translation: stringOrEmpty(parsed.translation),
    pinyin: stringOrEmpty(parsed.pinyin),
    meaning: stringOrEmpty(parsed.meaning),
    terms: Array.isArray(parsed.terms) ? parsed.terms.map(normalizeTerm) : [],
    alternatives: Array.isArray(parsed.alternatives) ? parsed.alternatives.map(normalizeAlternative) : [],
    usageNotes: Array.isArray(parsed.usageNotes) ? parsed.usageNotes.map(String).filter(Boolean) : [],
    confidence: ["high", "medium", "low"].includes(parsed.confidence) ? parsed.confidence : "medium"
  };
}

export function jsonResponse(data, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("cache-control", "no-store");

  return new Response(JSON.stringify(data), {
    ...init,
    headers
  });
}

function extractOutputText(payload) {
  if (payload && typeof payload.output_text === "string") {
    return payload.output_text;
  }

  for (const item of payload?.output || []) {
    for (const content of item?.content || []) {
      if (typeof content?.text === "string") {
        return content.text;
      }
    }
  }

  return "";
}

function parseJsonText(text) {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");

  return JSON.parse(cleaned);
}

function normalizeTerm(term) {
  return {
    source: stringOrEmpty(term?.source),
    translation: stringOrEmpty(term?.translation),
    pinyin: stringOrEmpty(term?.pinyin),
    meaning: stringOrEmpty(term?.meaning),
    note: stringOrEmpty(term?.note)
  };
}

function normalizeAlternative(alternative) {
  return {
    label: stringOrEmpty(alternative?.label),
    text: stringOrEmpty(alternative?.text),
    pinyin: stringOrEmpty(alternative?.pinyin),
    whenToUse: stringOrEmpty(alternative?.whenToUse)
  };
}

function stringOrEmpty(value) {
  return typeof value === "string" ? toSimplifiedChinese(value) : "";
}

function toSimplifiedChinese(value) {
  let output = "";

  for (const character of value) {
    output += TRADITIONAL_TO_SIMPLIFIED[character] || character;
  }

  return output;
}
