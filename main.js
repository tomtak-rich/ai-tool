const form = document.querySelector("#estimateForm");
const estimateRange = document.querySelector("#estimateRange");
const printEstimateRange = document.querySelector("#printEstimateRange");
const summaryList = document.querySelector("#summaryList");
const siteInfoList = document.querySelector("#siteInfoList");
const costInfoList = document.querySelector("#costInfoList");
const customerInfoList = document.querySelector("#customerInfoList");
const issuedDate = document.querySelector("#issuedDate");
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
  gyeonggi: [
    "수원시", "성남시", "고양시", "용인시", "부천시", "안산시", "안양시", "남양주시", "화성시",
    "평택시", "의정부시", "시흥시", "파주시", "김포시", "광명시", "광주시", "군포시", "하남시",
    "오산시", "이천시", "안성시", "구리시", "의왕시", "양주시", "포천시", "여주시", "동두천시",
    "과천시", "양평군", "가평군", "연천군",
  ],
  incheon: [
    "계양구", "남동구", "동구", "미추홀구", "부평구", "서구", "연수구", "중구", "강화군", "옹진군",
  ],
  other: ["기타 시/군/구"],
};

const labels = {
  province: {
    seoul: "서울특별시",
    gyeonggi: "경기도",
    incheon: "인천광역시",
    other: "기타 지역",
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
    gyeonggi: 1.03,
    incheon: 1.04,
    other: 1.08,
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

  const areaCost = area * (rates.scopeBase[scope] + rates.flooring[flooring]);
  const elevatorRate = elevator === "no" ? 1.12 : 1;
  const wasteRate = waste.label === "많음" ? 1.1 : waste.label === "보통" ? 1.03 : 1;
  const total = areaCost *
    rates.province[province] *
    rates.access[access] *
    rates.schedule[schedule] *
    elevatorRate *
    wasteRate;

  const low = Math.max(total * 0.9, 300000);
  const high = Math.max(total * 1.16, low + 100000);
  const range = `${money(low)} ~ ${money(high)}`;

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
    range,
  };

  estimateRange.textContent = range;
  printEstimateRange.textContent = range;
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
  issuedDate.textContent = `발행일: ${new Date().toLocaleDateString("ko-KR")}`;

  renderRows(siteInfoList, [
    ["현장 지역", `${labels.province[data.province]} ${data.district}`],
    ["아파트 면적", `${data.area}평`],
    ["엘리베이터", labels.elevator[data.elevator]],
    ["반출 조건", labels.access[data.access]],
  ]);

  renderRows(costInfoList, [
    ["철거 범위", labels.scope[data.scope]],
    ["바닥 종류", labels.flooring[data.flooring]],
    ["예상 폐기물", `${data.waste.label} (${data.waste.amount})`],
    ["작업 희망일", labels.schedule[data.schedule]],
  ]);

  renderRows(customerInfoList, [
    ["성함", data.customerName],
    ["연락처", data.customerPhone],
    ["메모", data.memo],
  ]);
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
