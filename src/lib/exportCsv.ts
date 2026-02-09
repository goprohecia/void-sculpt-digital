/**
 * Generic CSV export utility with UTF-8 BOM for Excel compatibility.
 */
export function exportCsv(filename: string, headers: string[], rows: string[][]) {
  const BOM = "\uFEFF";
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const csv =
    BOM +
    [headers.map(escape).join(";"), ...rows.map((r) => r.map(escape).join(";"))].join("\r\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
