const form = document.querySelector("#estimateForm");
const estimateRange = document.querySelector("#estimateRange");
const summaryList = document.querySelector("#summaryList");
const calculateButton = document.querySelector("#calculateButton");
const resetButton = document.querySelector("#resetButton");
const printButton = document.querySelector("#printButton");
const printTopButton = document.querySelector("#printTopButton");

const labels = {
  region: {
    seoul: "서울",
    gyeonggi: "경기/인천",
    other: "기타 지역",
  },
  floor: {
    low: "1~5층",
    mid: "6~15층",
    high: "16층 이상",
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
    partial: "부분 철거",
    standard: "기본 철거",
    full: "전체 철거",
    restore: "인테리어 원상복구",
  },
  waste: {
    low: "적음",
    normal: "보통",
    high: "많음",
  },
  schedule: {
    flexible: "일정 협의",
    week: "1주 이내",
    urgent: "긴급 작업",
  },
  items: {
    kitchen: "싱크대",
    bath: "욕실",
    builtIn: "붙박이장",
    molding: "몰딩/걸레받이",
    ceiling: "천장",
    wall: "가벽/벽체",
  },
};

const rates = {
  scopeBase: {
    partial: 180000,
    standard: 260000,
    full: 390000,
    restore: 340000,
  },
  flooring: {
    none: 0,
    vinyl: 25000,
    wood: 55000,
    tile: 85000,
    stone: 120000,
  },
  region: {
    seoul: 1,
    gyeonggi: 1.03,
    other: 1.08,
  },
  floor: {
    low: 1,
    mid: 1.03,
    high: 1.06,
  },
  waste: {
    low: 0.94,
    normal: 1,
    high: 1.14,
  },
  schedule: {
    flexible: 1,
    week: 1.04,
    urgent: 1.12,
  },
  itemAdd: {
    kitchen: 280000,
    bath: 360000,
    builtIn: 180000,
    molding: 120000,
    ceiling: 260000,
    wall: 300000,
  },
};

function money(value) {
  return `${Math.round(value / 10000).toLocaleString("ko-KR")}만원`;
}

function getValue(id) {
  return document.querySelector(`#${id}`).value;
}

function selectedItems() {
  return [...document.querySelectorAll('input[name="items"]:checked')].map((item) => item.value);
}

function calculateEstimate() {
  const area = Math.max(Number(getValue("area")) || 0, 1);
  const region = getValue("region");
  const floor = getValue("floor");
  const elevator = getValue("elevator");
  const flooring = getValue("flooring");
  const scope = getValue("scope");
  const waste = getValue("waste");
  const schedule = getValue("schedule");
  const items = selectedItems();

  const areaCost = area * (rates.scopeBase[scope] + rates.flooring[flooring]);
  const itemCost = items.reduce((sum, item) => sum + rates.itemAdd[item], 0);
  const elevatorRate = elevator === "no" ? 1.12 : 1;
  const total = (areaCost + itemCost) *
    rates.region[region] *
    rates.floor[floor] *
    rates.waste[waste] *
    rates.schedule[schedule] *
    elevatorRate;

  const low = Math.max(total * 0.88, 300000);
  const high = Math.max(total * 1.15, low + 100000);

  estimateRange.textContent = `${money(low)} ~ ${money(high)}`;
  renderSummary({
    area,
    region,
    floor,
    elevator,
    flooring,
    scope,
    waste,
    schedule,
    items,
  });
}

function renderSummary(data) {
  const itemText = data.items.length
    ? data.items.map((item) => labels.items[item]).join(", ")
    : "선택 없음";

  const rows = [
    ["면적", `${data.area}평`],
    ["현장 지역", labels.region[data.region]],
    ["층수", labels.floor[data.floor]],
    ["엘리베이터", labels.elevator[data.elevator]],
    ["바닥 종류", labels.flooring[data.flooring]],
    ["철거 범위", labels.scope[data.scope]],
    ["폐기물 양", labels.waste[data.waste]],
    ["희망 일정", labels.schedule[data.schedule]],
    ["세부 항목", itemText],
  ];

  summaryList.innerHTML = rows
    .map(([term, description]) => `<div><dt>${term}</dt><dd>${description}</dd></div>`)
    .join("");
}

function resetForm() {
  form.reset();
  document.querySelector("#area").value = 24;
  calculateEstimate();
}

form.addEventListener("input", calculateEstimate);
form.addEventListener("change", calculateEstimate);
calculateButton.addEventListener("click", calculateEstimate);
resetButton.addEventListener("click", resetForm);
printButton.addEventListener("click", () => window.print());
printTopButton.addEventListener("click", () => window.print());

calculateEstimate();
