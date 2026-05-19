import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from "recharts";

import useTheme from "../../hooks/useTheme";

const data = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 4780 },
  { name: "May", sales: 5890 },
  { name: "Jun", sales: 6390 },
];

function SalesChart() {
  const { darkMode, rtl } = useTheme();

  return (
    <div
      className="rounded-2xl border p-6 h-[300px] lg:h-[400px] transition-all duration-300"
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--border)",
      }}
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold">
          {rtl
            ? "تحليلات المبيعات"
            : "Sales Analytics"}
        </h3>

        <p
          className="text-sm"
          style={{
            color: "var(--text-muted)",
          }}
        >
          {rtl
            ? "نظرة عامة على الإيرادات الشهرية"
            : "Monthly revenue overview"}
        </p>
      </div>

      <ResponsiveContainer
        width="100%"
        height="85%"
      >
        <AreaChart data={data}>
          <XAxis
            dataKey="name"
            stroke={
              darkMode
                ? "#94a3b8"
                : "#64748b"
            }
          />

          <Tooltip
            contentStyle={{
              background: darkMode
                ? "#0f172a"
                : "#ffffff",

              border: darkMode
                ? "1px solid #1e293b"
                : "1px solid #e2e8f0",

              borderRadius: "12px",

              color: darkMode
                ? "#ffffff"
                : "#0f172a",
            }}
          />

          <Area
            type="monotone"
            dataKey="sales"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SalesChart;