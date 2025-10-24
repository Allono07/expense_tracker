export interface Transaction {
  item: string;
  cost: number;
  date: string;
}

export const calculateMetrics = (transactions: Transaction[]) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Start of today

  const currentMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
  });

  const todayTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    const tStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return tStart.getTime() === today.getTime();
  });

  const previousMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonthYear = previousMonthDate.getFullYear();
  const previousMonth = previousMonthDate.getMonth();

  const previousMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getFullYear() === previousMonthYear && date.getMonth() === previousMonth;
  });

  const calculateMonthMetrics = (monthTransactions: Transaction[]) => {
    if (monthTransactions.length === 0) {
      return { total: 0, maxItem: 'N/A', maxDate: 'N/A', maxItemCost: 0 };
    }

    const total = monthTransactions.reduce((sum, t) => sum + t.cost, 0);

    const maxSpendItem = monthTransactions.reduce((max, t) => t.cost > max.cost ? t : max, monthTransactions[0]);

    const spendingByDate: { [date: string]: number } = {};
    monthTransactions.forEach(t => {
      if (spendingByDate[t.date]) {
        spendingByDate[t.date] += t.cost;
      } else {
        spendingByDate[t.date] = t.cost;
      }
    });

    let maxDate = 'N/A';
    let maxDateSpending = 0;
    for (const date in spendingByDate) {
      if (spendingByDate[date] > maxDateSpending) {
        maxDateSpending = spendingByDate[date];
        maxDate = date;
      }
    }

    return {
      total,
      maxItem: maxSpendItem.item,
      maxDate,
      maxItemCost: maxSpendItem.cost,
    };
  };

  const todayTotal = todayTransactions.reduce((sum, t) => sum + t.cost, 0);

  return {
    currentMonth: calculateMonthMetrics(currentMonthTransactions),
    previousMonth: calculateMonthMetrics(previousMonthTransactions),
    today: todayTotal,
  };
};
