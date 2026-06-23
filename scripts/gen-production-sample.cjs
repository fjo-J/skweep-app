/* eslint-disable */
// 生産管理サンプル Excel を生成するワンショットスクリプト
// 使い方: node scripts/gen-production-sample.cjs
const XLSX = require("xlsx");
const path = require("path");
const os = require("os");

const processes = ["投入", "成形", "切削", "塗装", "組立", "検査", "梱包"];
const operators = ["田中", "佐藤", "鈴木", "高橋", "伊藤", "渡辺", "山本"];

function fmtDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function jitter(base, range) {
  return base + Math.floor((Math.random() - 0.5) * range);
}

const rows = [];
const start = new Date("2026-05-01");
let lotSeq = 1;

for (let day = 0; day < 31; day++) {
  const date = new Date(start);
  date.setDate(start.getDate() + day);

  // 同日に複数ロットを生産
  const lotsPerDay = 2 + Math.floor(Math.random() * 2); // 2〜3 ロット
  for (let l = 0; l < lotsPerDay; l++) {
    const lotNo = `L-2026-${String(lotSeq++).padStart(4, "0")}`;
    let carryQty = jitter(1200, 100); // ロット初期投入数

    for (const proc of processes) {
      // 工程ごとに想定良品率
      const targetYield =
        {
          投入: 99.4,
          成形: 96.8,
          切削: 95.2,
          塗装: 92.1,
          組立: 96.4,
          検査: 97.5,
          梱包: 99.1,
        }[proc] ?? 95;

      const planQty = carryQty;
      const yieldPct = +(targetYield + (Math.random() - 0.5) * 2).toFixed(1);
      const actualQty = Math.round(planQty * (yieldPct / 100));
      const defectQty = planQty - actualQty;
      const leadTimeH = +(2 + Math.random() * 5).toFixed(1);
      const operator = operators[Math.floor(Math.random() * operators.length)];

      rows.push({
        作業日: fmtDate(date),
        ロット番号: lotNo,
        工程: proc,
        予定数: planQty,
        実績数: actualQty,
        不良数: defectQty,
        歩留り: yieldPct, // %
        リードタイム: leadTimeH, // h
        担当者: operator,
        備考: defectQty > planQty * 0.05 ? "要原因分析" : "",
      });

      // 次工程への持ち込み数
      carryQty = actualQty;
    }
  }
}

const ws = XLSX.utils.json_to_sheet(rows, {
  header: [
    "作業日",
    "ロット番号",
    "工程",
    "予定数",
    "実績数",
    "不良数",
    "歩留り",
    "リードタイム",
    "担当者",
    "備考",
  ],
});

// 列幅を読みやすく
ws["!cols"] = [
  { wch: 12 }, // 作業日
  { wch: 14 }, // ロット番号
  { wch: 8 }, // 工程
  { wch: 8 }, // 予定数
  { wch: 8 }, // 実績数
  { wch: 8 }, // 不良数
  { wch: 8 }, // 歩留り
  { wch: 12 }, // リードタイム
  { wch: 10 }, // 担当者
  { wch: 16 }, // 備考
];

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "生産実績");

const outPath = path.join(os.homedir(), "Desktop", "生産管理テスト.xlsx");
XLSX.writeFile(wb, outPath);

console.log(`✅ Created: ${outPath}`);
console.log(`   Rows: ${rows.length}`);
console.log(
  `   Columns: ${Object.keys(rows[0]).join(", ")}`
);
