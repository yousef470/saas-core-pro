import { motion } from "framer-motion";
import {
  Plus,
  Trash2,
 
  Search,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Loader2,
} from "lucide-react";

function Components() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-10"
    >
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 dark:border-white/10 p-8 bg-white dark:bg-slate-900">
        <h1 className="text-4xl font-black">
          Components Library
        </h1>

        <p className="text-slate-500 mt-2">
          Reusable UI components used across SaaS Core Pro.
        </p>
      </div>

      {/* Buttons */}
      <section className="rounded-3xl border border-slate-200 dark:border-white/10 p-6 bg-white dark:bg-slate-900">
        <h2 className="text-2xl font-bold mb-6">
          Buttons
        </h2>

        <div className="flex flex-wrap gap-4">
          <button className="px-5 py-3 rounded-xl bg-indigo-600 text-white">
            Primary
          </button>

          <button className="px-5 py-3 rounded-xl border border-slate-300 dark:border-white/10">
            Secondary
          </button>

          <button className="px-5 py-3 rounded-xl bg-red-600 text-white">
            Danger
          </button>

          <button className="px-5 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5">
            Ghost
          </button>

          <button className="p-3 rounded-xl bg-indigo-600 text-white">
            <Plus size={18} />
          </button>
        </div>
      </section>

      {/* Inputs */}
      <section className="rounded-3xl border border-slate-200 dark:border-white/10 p-6 bg-white dark:bg-slate-900">
        <h2 className="text-2xl font-bold mb-6">
          Inputs
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            placeholder="Text Input"
            className="h-11 px-4 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-800"
          />

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2"
            />

            <input
              placeholder="Search Input"
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-800"
            />
          </div>

          <textarea
            rows={4}
            placeholder="Textarea"
            className="md:col-span-2 p-4 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-800"
          />
        </div>
      </section>

      {/* Badges */}
      <section className="rounded-3xl border border-slate-200 dark:border-white/10 p-6 bg-white dark:bg-slate-900">
        <h2 className="text-2xl font-bold mb-6">
          Badges
        </h2>

        <div className="flex gap-3 flex-wrap">
          <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-sm">
            Active
          </span>

          <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-sm">
            Pending
          </span>

          <span className="px-3 py-1 rounded-full bg-indigo-500 text-white text-sm">
            Premium
          </span>

          <span className="px-3 py-1 rounded-full bg-red-500 text-white text-sm">
            Rejected
          </span>
        </div>
      </section>

      {/* Alerts */}
      <section className="rounded-3xl border border-slate-200 dark:border-white/10 p-6 bg-white dark:bg-slate-900">
        <h2 className="text-2xl font-bold mb-6">
          Alerts
        </h2>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle size={18} />
            Success Alert
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <AlertTriangle size={18} />
            Warning Alert
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <XCircle size={18} />
            Error Alert
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="rounded-3xl border border-slate-200 dark:border-white/10 p-6 bg-white dark:bg-slate-900">
        <h2 className="text-2xl font-bold mb-6">
          Cards
        </h2>

        <div className="grid md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((card) => (
            <div
              key={card}
              className="rounded-2xl border border-slate-200 dark:border-white/10 p-5"
            >
              <p className="text-sm text-slate-500">
                Revenue
              </p>

              <h3 className="text-3xl font-black mt-2">
                $12,450
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Loaders */}
      <section className="rounded-3xl border border-slate-200 dark:border-white/10 p-6 bg-white dark:bg-slate-900">
        <h2 className="text-2xl font-bold mb-6">
          Loaders
        </h2>

        <Loader2
          size={40}
          className="animate-spin text-indigo-600"
        />
      </section>

      {/* Empty State */}
      <section className="rounded-3xl border border-slate-200 dark:border-white/10 p-6 bg-white dark:bg-slate-900">
        <h2 className="text-2xl font-bold mb-6">
          Empty States
        </h2>

        <div className="text-center py-12">
          <Trash2
            size={48}
            className="mx-auto mb-4 text-slate-400"
          />

          <h3 className="font-bold text-lg">
            No Data Found
          </h3>

          <p className="text-slate-500 mt-2">
            Nothing to display yet.
          </p>
        </div>
      </section>
    </motion.div>
  );
}

export default Components;