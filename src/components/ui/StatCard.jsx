import { TrendingUp } from "lucide-react";

function StatCard({
  title,
  value,
  growth,
  icon: Icon,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-slate-400 text-sm mb-2">
            {title}
          </p>

          <h3 className="text-3xl font-bold">
            {value}
          </h3>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
          <Icon className="text-indigo-400" />
        </div>
      </div>

      <div className="flex items-center gap-2 text-emerald-400 text-sm">
        <TrendingUp size={16} />
        <span>{growth}</span>
      </div>
    </div>
  );
}

export default StatCard;