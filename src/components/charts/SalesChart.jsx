import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from "recharts";

const data = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 4780 },
  { name: "May", sales: 5890 },
  { name: "Jun", sales: 6390 },
];

function SalesChart() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-[300px] lg:h-[400px]">
      <div className="mb-6">
        <h3 className="text-xl font-bold">
          Sales Analytics
        </h3>

        <p className="text-slate-400 text-sm">
          Monthly revenue overview
        </p>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data}>
          <XAxis
            dataKey="name"
            stroke="#94a3b8"
          />

          <Tooltip />

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