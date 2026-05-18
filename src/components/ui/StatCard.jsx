import { TrendingUp } from "lucide-react";

function StatCard({
  title,
  value,
  growth,
  icon: Icon,
}) {
  return (
    // 1. الألوان الأساسية بقت للوضع الفاتح (bg-white)، وضفنا dark: عشان الوضع الغامق
    // 2. ضفنا transition-all duration-300 عشان الألوان تقلب بنعومة وسلاسة احترافية
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-none transition-all duration-300">
      
      <div className="flex items-center justify-between mb-5">
        <div>
          {/* تغيير لون النص الافتراضي والـ dark */}
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-2 font-medium">
            {title}
          </p>

          {/* تغيير لون الرقم الأساسي */}
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">
            {value}
          </h3>
        </div>

        {/* أيقونة الكارت مع تأثير زجاجي خفيف يتناسب مع الـ Light والـ Dark */}
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center transition-colors">
          <Icon className="text-indigo-600 dark:text-indigo-400" size={24} />
        </div>
      </div>

      {/* نسبة النمو الأخضر */}
      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
        <TrendingUp size={16} />
        <span>{growth}</span>
      </div>
    </div>
  );
}

export default StatCard;