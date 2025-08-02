// 1️⃣ Solicitudes por día en un mes específico
export function requestsbyDay(requests, selectedYear, selectedMonth) {
  const counts = {};

  requests.forEach((request) => {
    const date = new Date(request.date);
    const year = date.getFullYear();
    const month = date.getMonth();

    if (year === selectedYear && month === selectedMonth) {
      const day = date.getDate();
      counts[day] = (counts[day] || 0) + 1;
    }
  });

  return Object.entries(counts).map(([day, total]) => ({
    date: `${day}`,
    total,
  }));
}

// utilities/grouprequest.jsx

export function requestStatusGrafic(requests, selectedYear, selectedMonth) {
  const statusGroups = {
    approved: {},
    rejected: {},
    pending: {},
  };

  requests.forEach((request) => {
    const date = new Date(request.date);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const status = request.status;

    // Filtramos por mes y año, y agrupamos según estado
    if (year === selectedYear && month === selectedMonth && statusGroups[status]) {
      statusGroups[status][day] = (statusGroups[status][day] || 0) + 1;
    }
  });

  // Transformamos cada grupo en array compatible con la gráfica
  const buildChartData = (group) =>
    Object.entries(group).map(([day, total]) => ({
      date: `${day}`,
      total,
    }));

  return {
    approved: buildChartData(statusGroups.approved),
    rejected: buildChartData(statusGroups.rejected),
    pending: buildChartData(statusGroups.pending),
  };
}

