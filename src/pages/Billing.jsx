import { motion } from "framer-motion";
import useTheme from "../hooks/useTheme";
import { Check } from "lucide-react";

function Billing() {
  const { lang } = useTheme();

  const plans = [
    { name: "Starter", price: "$19", desc: "Best for small business", features: ["3 Projects", "Basic Analytics", "24/7 Support"] },
    { name: "Pro", price: "$49", desc: "Best for growing companies", features: ["Unlimited Projects", "Advanced Analytics", "Custom Domain", "Priority Support"], popular: true }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {lang === "ar" ? "الاشتراكات والفواتير" : "Billing & Subscription"}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {lang === "ar" ? "متابعة خطة اشتراكك الحالي وتاريخ معاملاتك المالية." : "Monitor your active subscription plan and track payment history."}
        </p>
      </div>

      {/* شبكة الخطط: متجاوبة من كرت واحد في الموبايل لكرتين في الشاشات الكبيرة */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {plans.map((plan, idx) => (
          <div 
            key={idx} 
            className={`p-6 rounded-2xl border bg-white dark:bg-slate-900 transition-all flex flex-col relative overflow-hidden ${
              plan.popular ? "border-indigo-600 dark:border-indigo-500 shadow-md ring-1 ring-indigo-600/20" : "border-slate-200 dark:border-slate-800"
            }`}
          >
            {plan.popular && (
              <span className="absolute top-4 right-4 bg-indigo-600 text-white font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                Popular
              </span>
            )}
            <h3 className="font-bold text-lg dark:text-white">{plan.name}</h3>
            <p className="text-xs text-slate-400 mt-1">{plan.desc}</p>
            
            <div className="my-5 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{plan.price}</span>
              <span className="text-xs text-slate-400">/{lang === "ar" ? "شهرياً" : "mo"}</span>
            </div>

            <ul className="space-y-2.5 flex-1 mb-6">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <Check size={14} className="text-emerald-500 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <button className={`w-full h-11 rounded-xl text-xs font-semibold transition-all flex items-center justify-center ${
              plan.popular ? "bg-indigo-600 text-white hover:bg-indigo-700" : "border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-white"
            }`}>
              {lang === "ar" ? "ترقية الاشتراك" : "Upgrade Plan"}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default Billing;