const { Parser } = require("json2csv");
const XLSX = require("xlsx");

// ===============================
// JSON → CSV
// ===============================

const jsonToCsv = (data) => {
  const parser = new Parser();
  return parser.parse(data);
};

// ===============================
// JSON → EXCEL
// ===============================

const jsonToExcel = (data, sheetName = "Sheet1") => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  return XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });
};

// ===============================
// CSV/EXCEL BUFFER → JSON
// ===============================

const excelToJson = (buffer) => {
  const workbook = XLSX.read(buffer, {
    type: "buffer",
  });

  const sheetName = workbook.SheetNames[0];

  const worksheet = workbook.Sheets[sheetName];

  return XLSX.utils.sheet_to_json(worksheet);
};

module.exports = {
  jsonToCsv,
  jsonToExcel,
  excelToJson,
};