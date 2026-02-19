import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#2563eb", "#f59e0b", "#10b981", "#a855f7", "#ef4444"];
const REMAINING_COLOR = "#e5e7eb"; 

function formatEUR(n) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(n);
}

export default function BudgetRing({ summary }) {
  const spentTotal = summary.categories.reduce((acc, cat) => acc + cat.value, 0);
  const remainingForRing = Math.max(0, summary.variableBudget - spentTotal);

  const ringData =
    remainingForRing > 0
      ? [...summary.categories, { name: "Restant", value: remainingForRing, _remaining: true }]
      : summary.categories;

  return (
    <div>
      <div className="relative h-[300px] w-full">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={ringData}
              dataKey="value"
              innerRadius="70%"
              outerRadius="90%"
              paddingAngle={3}
              stroke="none"
              startAngle={90}
              endAngle={-270}
            >
              {ringData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={entry._remaining ? REMAINING_COLOR : COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm text-gray-500">Budget restant</span>
          <span className="text-3xl font-semibold">{formatEUR(summary.remaining)}</span>
          <span className="text-xs text-gray-400">
            sur {formatEUR(summary.variableBudget)}
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {summary.categories.map((cat, index) => {
          const percent =
            summary.variableBudget > 0
              ? Math.round((cat.value / summary.variableBudget) * 100)
              : 0;

          return (
            <div key={cat.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-gray-700">{cat.name}</span>
              </div>

              <div className="text-right">
                <div className="font-medium">{formatEUR(cat.value)}</div>
                <div className="text-xs text-gray-400">{percent}%</div>
              </div>
            </div>
          );
        })}

        <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: REMAINING_COLOR }} />
            <span className="text-gray-700">Restant</span>
          </div>
          <div className="text-right">
            <div className="font-medium">{formatEUR(remainingForRing)}</div>
            <div className="text-xs text-gray-400">
              {summary.variableBudget > 0
                ? Math.round((remainingForRing / summary.variableBudget) * 100)
                : 0}
              %
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
