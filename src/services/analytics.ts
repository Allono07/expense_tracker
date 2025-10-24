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

  // Helper function to parse date string (YYYY-MM-DD) as local date
  const parseLocalDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Calculate past 7 days (today and previous 6 days)
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const currentMonthTransactions = transactions.filter(t => {
    const date = parseLocalDate(t.date);
    return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
  });

  const todayTransactions = transactions.filter(t => {
    const date = parseLocalDate(t.date);
    const tStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return tStart.getTime() === today.getTime();
  });

  const last7DaysTransactions = transactions.filter(t => {
    const date = parseLocalDate(t.date);
    const tStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return tStart.getTime() >= sevenDaysAgo.getTime() && tStart.getTime() <= today.getTime();
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

  const last7DaysTotal = last7DaysTransactions.reduce((sum, t) => sum + t.cost, 0);

  // Calculate daily breakdown for past 7 days
  const dailyBreakdown: { date: string; total: number; label: string }[] = [];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; // YYYY-MM-DD format
    
    const dayTransactions = transactions.filter(t => t.date === dateStr);

    const dayTotal = dayTransactions.reduce((sum, t) => sum + t.cost, 0);

    // Create label (e.g., "Today", "Yesterday", "Wednesday", etc.)
    let label = '';
    if (i === 0) {
      label = 'Today';
    } else if (i === 1) {
      label = 'Yesterday';
    } else {
      const dayName = dayNames[date.getDay()];
      label = dayName;
    }

    dailyBreakdown.push({ date: dateStr, total: dayTotal, label });
  }

  return {
    currentMonth: calculateMonthMetrics(currentMonthTransactions),
    previousMonth: calculateMonthMetrics(previousMonthTransactions),
    today: todayTotal,
    last7Days: last7DaysTotal,
    dailyBreakdown,
  };
};
