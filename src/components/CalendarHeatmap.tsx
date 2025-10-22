import React from 'react';
import ReactCalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

interface Props {
  transactions: { date: string; cost: number }[];
}

const CalendarHeatmap: React.FC<Props> = ({ transactions }) => {
  // aggregate by date
  const map: Record<string, number> = {};
  transactions.forEach(t => {
    map[t.date] = (map[t.date] || 0) + t.cost;
  });

  const values = Object.keys(map).map(date => ({ date, count: Math.round(map[date]) }));

  return (
    <div className="p-3">
      <h3>Spending Heatmap</h3>
      <ReactCalendarHeatmap
        startDate={new Date(new Date().getFullYear(), 0, 1)}
        endDate={new Date()}
        values={values}
        classForValue={(value: { date: string; count: number } | null) => {
          if (!value) return 'color-empty';
          if (value.count >= 100) return 'color-scale-4';
          if (value.count >= 50) return 'color-scale-3';
          if (value.count >= 20) return 'color-scale-2';
          return 'color-scale-1';
        }}
        showWeekdayLabels={true}
      />
      <div className="mt-2">
        <small>Color intensity corresponds to total spend on that day.</small>
      </div>
    </div>
  );
};

export default CalendarHeatmap;
