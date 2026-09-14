const reportDefinitions = {
  complaints: {
    title: "Complaint report",
    columns: ["Status", "Count"],
    rows: (data) => data.complaintStatus.map((item) => [item.status || item.name, item.count ?? item.value ?? 0]),
  },
  staff: {
    title: "Staff report",
    columns: ["Staff member", "Resolved complaints"],
    rows: (data) => data.staffPerformance.map((item) => [item.staffName || item.name, item.resolved ?? item.completed ?? item.count ?? 0]),
  },
  tasks: {
    title: "Task report",
    columns: ["Category", "Count"],
    rows: (data) => [["Assigned / total", data.taskStats.assignedTasks ?? 0], ["Completed", data.taskStats.completedTasks ?? 0], ["Pending", data.taskStats.pendingTasks ?? 0]],
  },
  zones: {
    title: "Zone report",
    columns: ["Zone", "Complaints"],
    rows: (data) => data.zones.map((item) => [item.zone || "Unknown", item.complaints ?? item.count ?? 0]),
  },
};

export const getReportDefinition = (key) => reportDefinitions[key];