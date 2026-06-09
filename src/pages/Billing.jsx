import { motion } from "framer-motion";
import useTheme from "../hooks/useTheme";

function Billing() {
  const { lang } = useTheme();
return (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="space-y-8"
  >
    <div>
      <h1 className="text-2xl font-bold tracking-tight">
        {lang === "ar"
          ? "الاشتراكات والفواتير"
          : "Billing & Subscription"}
      </h1>

      <p
        className="text-sm mt-1"
        style={{ color: "var(--text-muted)" }}
      >
        {lang === "ar"
          ? "إدارة اشتراكك الحالي وطرق الدفع وسجل الفواتير."
          : "Manage your subscription, payment methods and billing history."}
      </p>
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      {/* Current Plan */}
      <div
        className="p-6 rounded-3xl border backdrop-blur-xl"
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border)",
        }}
      >
        <h2 className="text-xl font-bold mb-6">
          Current Plan
        </h2>

        <div className="space-y-5">
          <div>
            <p className="text-sm text-slate-500">
              Plan
            </p>

            <h3 className="text-3xl font-black text-indigo-500">
              Pro Plan
            </h3>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Billing Cycle
            </p>

            <p className="font-semibold">
              Monthly
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Renewal Date
            </p>

            <p className="font-semibold">
              June 15, 2026
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Status
            </p>

            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-sm">
              Active
            </span>
          </div>

          <button className="w-full h-11 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition">
            Upgrade Plan
          </button>
        </div>
      </div>

      {/* Payment Method */}
      <div
        className="p-6 rounded-3xl border backdrop-blur-xl"
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border)",
        }}
      >
        <h2 className="text-xl font-bold mb-6">
          Payment Method
        </h2>

        <div
          className="p-5 rounded-2xl"
          style={{
            background: "var(--bg-main)",
          }}
        >
          <p className="text-sm text-slate-500">
            Primary Card
          </p>

          <h3 className="text-lg font-bold mt-2">
            Visa •••• 4242
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Expires 12/28
          </p>

          <button className="mt-5 text-indigo-500 font-medium">
            Change Card
          </button>
        </div>
      </div>
    </div>

    {/* Billing History */}
    <div
      className="p-6 rounded-3xl border backdrop-blur-xl"
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--border)",
      }}
    >
      <h2 className="text-xl font-bold mb-6">
        Billing History
      </h2>

      <div className="space-y-3">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="flex items-center justify-between p-4 rounded-2xl"
            style={{
              background: "var(--bg-main)",
            }}
          >
            <div>
              <p className="font-medium">
                May {item}, 2026
              </p>

              <p className="text-sm text-slate-500">
                Pro Subscription
              </p>
            </div>

            <div className="text-right">
              <p className="font-bold">$49</p>

              <span className="text-emerald-500 text-sm">
                Paid
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);
}

export default Billing;