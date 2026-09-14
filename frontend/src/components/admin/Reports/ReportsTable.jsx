import { getReportDefinition } from "./reportDefinitions";

function ReportsTable({ activeReport, data }) {
  const definition = getReportDefinition(activeReport);
  const rows = definition.rows(data);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">
            Data extract
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-900">
            {definition.title}
          </h2>
        </div>

        <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {rows.length} rows
        </span>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {definition.columns.map((column) => (
                <th
                  key={column}
                  className="whitespace-nowrap px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.length ? (
              rows.map((row, index) => (
                <tr
                  key={`${row[0]}-${index}`}
                  className="transition-colors hover:bg-slate-50"
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`${cell}-${cellIndex}`}
                      className="whitespace-nowrap px-5 py-4 text-sm text-slate-700 sm:px-6"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={definition.columns.length}
                  className="px-6 py-12 text-center text-sm font-medium text-slate-500"
                >
                  No report data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ReportsTable;
