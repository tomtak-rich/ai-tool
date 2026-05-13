const form = document.querySelector("#estimateForm");
const estimateRange = document.querySelector("#estimateRange");
const printEstimateRange = document.querySelector("#printEstimateRange");
const printEstimateBase = document.querySelector("#printEstimateBase");
const summaryList = document.querySelector("#summaryList");
const siteInfoList = document.querySelector("#siteInfoList");
const costInfoList = document.querySelector("#costInfoList");
const customerInfoList = document.querySelector("#customerInfoList");
const issuedDate = document.querySelector("#issuedDate");
const quoteNo = document.querySelector("#quoteNo");
const directCostBody = document.querySelector("#directCostBody");
const indirectCostBody = document.querySelector("#indirectCostBody");
const communicationNotes = document.querySelector("#communicationNotes");
const paymentNotes = document.querySelector("#paymentNotes");
const scopeNotes = document.querySelector("#scopeNotes");
const calculateButton = document.querySelector("#calculateButton");
const resetButton = document.querySelector("#resetButton");
const printButton = document.querySelector("#printButton");
const printTopButton = document.querySelector("#printTopButton");
const provinceSelect = document.querySelector("#province");
const districtSelect = document.querySelector("#district");

const districts = {
  seoul: [
    "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구",
    "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구",
    "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구",
  ],
  busan: [
    "강서구", "금정구", "기장군", "남구", "동구", "동래구", "부산진구", "북구", "사상구",
    "사하구", "서구", "수영구", "연제구", "영도구", "중구", "해운대구",
  ],
  daegu: [
    "군위군", "남구", "달서구", "달성군", "동구", "북구", "서구", "수성구", "중구",
  ],
  gyeonggi: [
    "수원시", "성남시", "고양시", "용인시", "부천시", "안산시", "안양시", "남양주시", "화성시",
    "평택시", "의정부시", "시흥시", "파주시", "김포시", "광명시", "광주시", "군포시", "하남시",
    "오산시", "이천시", "안성시", "구리시", "의왕시", "양주시", "포천시", "여주시", "동두천시",
    "과천시", "양평군", "가평군", "연천군",
  ],
  incheon: [
    "계양구", "남동구", "동구", "미추홀구", "부평구", "서구", "연수구", "중구", "강화군", "옹진군",
  ],
  gwangju: ["광산구", "남구", "동구", "북구", "서구"],
  daejeon: ["대덕구", "동구", "서구", "유성구", "중구"],
  ulsan: ["남구", "동구", "북구", "울주군", "중구"],
  sejong: ["세종시"],
  gangwon: [
    "강릉시", "동해시", "삼척시", "속초시", "원주시", "춘천시", "태백시", "고성군", "양구군",
    "양양군", "영월군", "인제군", "정선군", "철원군", "평창군", "홍천군", "화천군", "횡성군",
  ],
  chungbuk: [
    "청주시", "충주시", "제천시", "괴산군", "단양군", "보은군", "영동군", "옥천군",
    "음성군", "증평군", "진천군",
  ],
  chungnam: [
    "천안시", "공주시", "보령시", "아산시", "서산시", "논산시", "계룡시", "당진시",
    "금산군", "부여군", "서천군", "청양군", "홍성군", "예산군", "태안군",
  ],
  jeonbuk: [
    "전주시", "군산시", "익산시", "정읍시", "남원시", "김제시", "완주군", "진안군",
    "무주군", "장수군", "임실군", "순창군", "고창군", "부안군",
  ],
  jeonnam: [
    "목포시", "여수시", "순천시", "나주시", "광양시", "담양군", "곡성군", "구례군",
    "고흥군", "보성군", "화순군", "장흥군", "강진군", "해남군", "영암군", "무안군",
    "함평군", "영광군", "장성군", "완도군", "진도군", "신안군",
  ],
  gyeongbuk: [
    "포항시", "경주시", "김천시", "안동시", "구미시", "영주시", "영천시", "상주시",
    "문경시", "경산시", "의성군", "청송군", "영양군", "영덕군", "청도군", "고령군",
    "성주군", "칠곡군", "예천군", "봉화군", "울진군", "울릉군",
  ],
  gyeongnam: [
    "창원시", "진주시", "통영시", "사천시", "김해시", "밀양시", "거제시", "양산시",
    "의령군", "함안군", "창녕군", "고성군", "남해군", "하동군", "산청군", "함양군",
    "거창군", "합천군",
  ],
  jeju: ["제주시", "서귀포시"],
};

const labels = {
  province: {
    seoul: "서울특별시",
    busan: "부산광역시",
    daegu: "대구광역시",
    gyeonggi: "경기도",
    incheon: "인천광역시",
    gwangju: "광주광역시",
    daejeon: "대전광역시",
    ulsan: "울산광역시",
    sejong: "세종특별자치시",
    gangwon: "강원특별자치도",
    chungbuk: "충청북도",
    chungnam: "충청남도",
    jeonbuk: "전북특별자치도",
    jeonnam: "전라남도",
    gyeongbuk: "경상북도",
    gyeongnam: "경상남도",
    jeju: "제주특별자치도",
  },
  elevator: {
    yes: "있음",
    no: "없음",
  },
  flooring: {
    none: "바닥 철거 없음",
    vinyl: "장판",
    wood: "강마루/합판마루",
    tile: "타일/데코타일",
    stone: "대리석/석재",
  },
  scope: {
    floorOnly: "바닥 철거",
    kitchenBath: "주방/욕실 철거",
    partial: "부분 철거",
    standard: "기본 인테리어 철거",
    full: "전체 인테리어 철거",
    restore: "원상복구 철거",
  },
  access: {
    normal: "일반",
    limited: "주차/동선 제한",
    difficult: "반출 난이도 높음",
  },
  schedule: {
    flexible: "일정 협의",
    week: "1주 이내",
    urgent: "긴급 작업",
  },
};

const rates = {
  scopeBase: {
    floorOnly: 90000,
    kitchenBath: 150000,
    partial: 190000,
    standard: 280000,
    full: 420000,
    restore: 360000,
  },
  flooring: {
    none: 0,
    vinyl: 25000,
    wood: 55000,
    tile: 85000,
    stone: 120000,
  },
  province: {
    seoul: 1,
    busan: 1.07,
    daegu: 1.07,
    gyeonggi: 1.03,
    incheon: 1.04,
    gwangju: 1.09,
    daejeon: 1.08,
    ulsan: 1.09,
    sejong: 1.08,
    gangwon: 1.12,
    chungbuk: 1.1,
    chungnam: 1.1,
    jeonbuk: 1.11,
    jeonnam: 1.13,
    gyeongbuk: 1.12,
    gyeongnam: 1.12,
    jeju: 1.18,
  },
  access: {
    normal: 1,
    limited: 1.07,
    difficult: 1.16,
  },
  schedule: {
    flexible: 1,
    week: 1.04,
    urgent: 1.12,
  },
};

const wasteFactor = {
  scope: {
    floorOnly: 0.28,
    kitchenBath: 0.38,
    partial: 0.45,
    standard: 0.72,
    full: 1,
    restore: 0.86,
  },
  flooring: {
    none: 0,
    vinyl: 0.04,
    wood: 0.08,
    tile: 0.12,
    stone: 0.16,
  },
};

function money(value) {
  return `${Math.round(value / 10000).toLocaleString("ko-KR")}만원`;
}

function won(value) {
  return `₩${Math.round(value).toLocaleString("ko-KR")}`;
}

function roundTo(value, unit = 10000) {
  return Math.round(value / unit) * unit;
}

function getValue(id) {
  return document.querySelector(`#${id}`).value;
}

function inputValue(id, fallback = "-") {
  const value = document.querySelector(`#${id}`).value.trim();
  return value || fallback;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function updateDistricts() {
  const selectedProvince = provinceSelect.value;
  districtSelect.innerHTML = districts[selectedProvince]
    .map((district) => `<option value="${district}">${district}</option>`)
    .join("");
}

function estimateWaste(area, scope, flooring) {
  const tons = area * (wasteFactor.scope[scope] + wasteFactor.flooring[flooring]);
  if (tons < 8) {
    return { label: "적음", amount: `약 ${tons.toFixed(1)}톤 내외` };
  }
  if (tons < 18) {
    return { label: "보통", amount: `약 ${tons.toFixed(1)}톤 내외` };
  }
  return { label: "많음", amount: `약 ${tons.toFixed(1)}톤 내외` };
}

function scopeWeight(scope) {
  return {
    floorOnly: 0.45,
    kitchenBath: 0.65,
    partial: 0.75,
    standard: 1,
    full: 1.35,
    restore: 1.2,
  }[scope];
}

function buildQuoteItems(data) {
  const area = data.area;
  const weight = scopeWeight(data.scope);
  const regionRate = rates.province[data.province];
  const accessRate = rates.access[data.access];
  const scheduleRate = rates.schedule[data.schedule];
  const elevatorRate = data.elevator === "no" ? 1.12 : 1;
  const commonRate = regionRate * accessRate * scheduleRate * elevatorRate;
  const wasteTons = Number(data.waste.amount.replace(/[^0-9.]/g, "")) || 1;
  const workers = Math.max(2, Math.ceil(area / 12 * weight));
  const workDays = Math.max(1, Math.ceil(area / 35 * weight));
  const direct = [];

  const push = (target, item, description, unitPrice, quantity, unit) => {
    const amount = roundTo(unitPrice * quantity * commonRate);
    target.push({ item, description, unitPrice: roundTo(unitPrice), quantity, unit, amount });
  };

  push(direct, "철거인력", `${labels.scope[data.scope]} 인력 투입`, 250000, workers * workDays, "명");

  if (data.flooring !== "none") {
    push(direct, "바닥 철거", labels.flooring[data.flooring], rates.flooring[data.flooring], area, "평");
  }

  const structureUnit = {
    floorOnly: 35000,
    kitchenBath: 95000,
    partial: 115000,
    standard: 160000,
    full: 230000,
    restore: 205000,
  }[data.scope];
  push(direct, "내부 철거", `${labels.scope[data.scope]} 기본 공정`, structureUnit, area, "평");

  push(direct, "혼합폐기물", `${data.waste.label} ${data.waste.amount}`, 180000, Math.max(1, wasteTons), "톤");

  if (data.flooring === "tile" || data.flooring === "stone") {
    const concreteTons = Math.max(1, Math.ceil(area * 0.12));
    push(direct, "폐콘크리트", `${labels.flooring[data.flooring]} 철거 폐기물`, 140000, concreteTons, "톤");
  }

  if (data.elevator === "no" || data.access !== "normal") {
    const equipmentUnit = data.access === "difficult" ? 450000 : 300000;
    push(direct, "양중/반출 장비", labels.access[data.access], equipmentUnit, 1, "식");
  }

  push(direct, "보양 및 정리", "공용부 보양, 현장 정리, 반출 전 정돈", 180000, 1, "식");

  const directTotal = direct.reduce((sum, row) => sum + row.amount, 0);
  const indirect = [
    {
      item: "현장관리비",
      description: "일정 조율, 작업자 배치, 현장 소통",
      unitPrice: roundTo(directTotal * 0.05),
      quantity: 1,
      unit: "식",
      amount: roundTo(directTotal * 0.05),
    },
    {
      item: "공과잡비",
      description: "소모품, 안전관리, 반출 부대비",
      unitPrice: roundTo(Math.max(150000, directTotal * 0.035)),
      quantity: 1,
      unit: "식",
      amount: roundTo(Math.max(150000, directTotal * 0.035)),
    },
  ];
  const indirectTotal = indirect.reduce((sum, row) => sum + row.amount, 0);
  const supply = directTotal + indirectTotal;
  const vat = roundTo(supply * 0.1);
  const total = supply + vat;

  return { direct, indirect, directTotal, indirectTotal, supply, vat, total };
}

function calculateEstimate() {
  const area = Math.max(Number(getValue("area")) || 0, 1);
  const province = getValue("province");
  const district = getValue("district");
  const elevator = getValue("elevator");
  const flooring = getValue("flooring");
  const scope = getValue("scope");
  const access = getValue("access");
  const schedule = getValue("schedule");
  const customerName = inputValue("customerName");
  const customerPhone = inputValue("customerPhone");
  const memo = inputValue("memo");
  const waste = estimateWaste(area, scope, flooring);

  const data = {
    area,
    province,
    district,
    elevator,
    flooring,
    scope,
    access,
    schedule,
    customerName,
    customerPhone,
    memo,
    waste,
  };
  const quote = buildQuoteItems(data);
  const low = Math.max(quote.total * 0.92, 300000);
  const high = Math.max(quote.total * 1.14, low + 100000);
  data.quote = quote;
  data.total = quote.total;
  data.range = `${money(low)} ~ ${money(high)}`;

  estimateRange.textContent = data.range;
  printEstimateRange.textContent = data.range;
  printEstimateBase.textContent = won(data.total);
  renderSummary(data);
  renderDocument(data);
}

function renderRows(target, rows) {
  target.innerHTML = rows
    .map(([term, description]) => `<div><dt>${escapeHtml(term)}</dt><dd>${escapeHtml(description)}</dd></div>`)
    .join("");
}

function renderSummary(data) {
  renderRows(summaryList, [
    ["면적", `${data.area}평`],
    ["현장 지역", `${labels.province[data.province]} ${data.district}`],
    ["엘리베이터", labels.elevator[data.elevator]],
    ["바닥 종류", labels.flooring[data.flooring]],
    ["철거 범위", labels.scope[data.scope]],
    ["반출 조건", labels.access[data.access]],
    ["예상 폐기물", `${data.waste.label} (${data.waste.amount})`],
    ["희망 일정", labels.schedule[data.schedule]],
  ]);
}

function renderDocument(data) {
  const now = new Date();
  const date = now.toLocaleDateString("ko-KR");
  issuedDate.textContent = `발행일: ${date}`;
  quoteNo.textContent = `No. AI-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(Math.round(data.area * 10)).padStart(3, "0")}`;

  renderRows(siteInfoList, [
    ["수신자", data.customerName],
    ["연락처", data.customerPhone],
    ["현장 지역", `${labels.province[data.province]} ${data.district}`],
    ["아파트 면적", `${data.area}평`],
  ]);

  renderRows(costInfoList, [
    ["회사명", "철거의정석"],
    ["대표번호", "1555-6205"],
    ["이메일", "demolish_js@naver.com"],
    ["문서구분", "아파트 철거 AI 가견적서"],
  ]);

  renderRows(customerInfoList, [
    ["직접공사비", won(data.quote.directTotal)],
    ["간접공사비", won(data.quote.indirectTotal)],
    ["공급가액", won(data.quote.supply)],
    ["VAT(10%)", won(data.quote.vat)],
    ["최종 가견적", won(data.quote.total)],
  ]);

  renderCostRows(directCostBody, data.quote.direct);
  renderCostRows(indirectCostBody, data.quote.indirect);

  communicationNotes.textContent = "본 가견적에 포함된 현장 일정, 시공 범위, 추가 요청 사항은 담당자가 현장 확인 후 직접 조율합니다.";
  paymentNotes.textContent = "계약금, 중도금, 잔금 및 입금 계좌는 현장 견적 확정 후 별도 안내됩니다.";
  scopeNotes.textContent = [
    `${labels.scope[data.scope]}`,
    `${labels.flooring[data.flooring]}`,
    `예상 폐기물 ${data.waste.label}(${data.waste.amount})`,
    `엘리베이터 ${labels.elevator[data.elevator]}`,
    `반출 조건 ${labels.access[data.access]}`,
    data.memo !== "-" ? `고객 메모: ${data.memo}` : "",
  ].filter(Boolean).join(" · ");
}

function renderCostRows(target, rows) {
  target.innerHTML = rows.map((row) => `
    <tr>
      <td>${escapeHtml(row.item)}</td>
      <td>${escapeHtml(row.description)}</td>
      <td>${escapeHtml(won(row.unitPrice))}</td>
      <td>${escapeHtml(row.quantity)}</td>
      <td>${escapeHtml(row.unit)}</td>
      <td>${escapeHtml(won(row.amount))}</td>
    </tr>
  `).join("");
}

function resetForm() {
  form.reset();
  document.querySelector("#area").value = 24;
  updateDistricts();
  calculateEstimate();
}

provinceSelect.addEventListener("change", () => {
  updateDistricts();
  calculateEstimate();
});
form.addEventListener("input", calculateEstimate);
form.addEventListener("change", calculateEstimate);
calculateButton.addEventListener("click", calculateEstimate);
resetButton.addEventListener("click", resetForm);
printButton.addEventListener("click", () => window.print());
printTopButton.addEventListener("click", () => window.print());

updateDistricts();
calculateEstimate();
