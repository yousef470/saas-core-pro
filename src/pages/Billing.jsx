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
  $49 / Month
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

          <div className="pt-2">
  <p className="text-sm text-slate-500 mb-3">
    Included Features
  </p>

  <div className="space-y-2 text-sm">
    <div>✔ Unlimited Projects</div>
    <div>✔ Unlimited Tasks</div>
    <div>✔ Team Collaboration</div>
    <div>✔ Priority Support</div>
  </div>
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

    <div
  className="p-6 rounded-3xl border backdrop-blur-xl"
  style={{
    background: "var(--bg-card)",
    borderColor: "var(--border)",
  }}
>
  <h2 className="text-xl font-bold mb-6">
    Next Payment
  </h2>

  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-slate-500">
        Upcoming Charge
      </p>

      <h3 className="text-3xl font-black text-indigo-500 mt-2">
        $49
      </h3>

      <p className="text-sm text-slate-500 mt-2">
        June 15, 2026
      </p>
    </div>

    <div>
      <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-sm">
        Scheduled
      </span>
    </div>
  </div>
</div>


<div className="grid md:grid-cols-3 gap-4">
  <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/10">
    <p className="text-sm text-slate-500">
      Total Paid
    </p>

    <h3 className="text-3xl font-black mt-2">
      $196
    </h3>
  </div>

  <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/10">
    <p className="text-sm text-slate-500">
      Invoices
    </p>

    <h3 className="text-3xl font-black mt-2">
      4
    </h3>
  </div>

  <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/10">
    <p className="text-sm text-slate-500">
      Current Plan
    </p>

    <h3 className="text-3xl font-black mt-2">
      Pro
    </h3>
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

<div className="overflow-x-auto">
  <table className="w-full">
    <thead>
      <tr className="border-b border-slate-200 dark:border-white/10">
        <th className="text-left py-3">
          Date
        </th>

        <th className="text-left py-3">
          Invoice
        </th>

        <th className="text-left py-3">
          Amount
        </th>

        <th className="text-left py-3">
          Status
        </th>

        <th className="text-left py-3">
  Action
</th>
      </tr>
    </thead>

    <tbody>
      {[1, 2, 3, 4].map((item) => (
        <tr
          key={item}
          className="border-b border-slate-200/50 dark:border-white/5"
        >
          <td className="py-4">
            May {item}, 2026
          </td>

          <td className="py-4">
            INV-00{item}
          </td>

          <td className="py-4 font-bold">
            $49
          </td>

          <td className="py-4">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-sm">
              Paid
            </span>
          </td>

          
          <td className="py-4">
  <button className="text-indigo-500">
    View
  </button>
</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
    </div>
  </motion.div>
);
}

export default Billing;