import {
  Download,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import { getReportDefinition } from "./reportDefinitions";

function escapeCsv(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function ExportTools({ activeReport, data }) {
  const exportData = () =>
    getReportDefinition(activeReport).rows(data);

  const download = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();

    URL.revokeObjectURL(url);
  };

  const exportCsv = () => {
    const csv = exportData()
      .map((row) => row.map(escapeCsv).join(","))
      .join("\n");

    download(
      csv,
      `${activeReport}-report.csv`,
      "text/csv;charset=utf-8"
    );
  };

  const exportExcel = () => {
    const rows = exportData();

    const html = `
      <table>
        <tbody>
          ${rows
            .map(
              (row) => `
                <tr>
                  ${row
                    .map(
                      (cell) =>
                        `<td>${String(cell ?? "").replaceAll(
                          "<",
                          "&lt;"
                        )}</td>`
                    )
                    .join("")}
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    `;

    download(
      html,
      `${activeReport}-report.xls`,
      "application/vnd.ms-excel"
    );
  };

  const exportPdf = () => {
    const rows = exportData();

    const reportWindow = window.open(
      "",
      "_blank",
      "noopener,noreferrer"
    );

    if (!reportWindow) return;

    reportWindow.document.write(`
      <html>
        <head>
          <title>${activeReport} report</title>

          <style>
            body {
              font: 14px Arial;
              color: #12302f;
              padding: 32px;
            }

            table {
              border-collapse: collapse;
              width: 100%;
            }

            td {
              border: 1px solid #cbdedc;
              padding: 10px;
            }

            h1 {
              font-size: 22px;
            }
          </style>
        </head>

        <body>
          <h1>${activeReport} report</h1>

          <table>
            ${rows
              .map(
                (row) => `
                  <tr>
                    ${row
                      .map(
                        (cell) =>
                          `<td>${cell ?? ""}</td>`
                      )
                      .join("")}
                  </tr>
                `
              )
              .join("")}
          </table>

          <script>
            window.onload = () => window.print();
          </script>
        </body>
      </html>
    `);

    reportWindow.document.close();
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
      {/* Label */}
      <span className="px-2 text-sm font-semibold text-slate-600">
        Export
      </span>

      {/* PDF */}
      <button
        type="button"
        onClick={exportPdf}
        title="Print or save as PDF"
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-200"
      >
        <FileText size={16} strokeWidth={2} />
        <span>PDF</span>
      </button>

      {/* Excel */}
      <button
        type="button"
        onClick={exportExcel}
        title="Export Excel file"
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-green-200 hover:bg-green-50 hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-200"
      >
        <FileSpreadsheet size={16} strokeWidth={2} />
        <span>Excel</span>
      </button>

      {/* CSV */}
      <button
        type="button"
        onClick={exportCsv}
        title="Export CSV file"
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
      >
        <Download size={16} strokeWidth={2} />
        <span>CSV</span>
      </button>
    </div>
  );
}

export default ExportTools;
