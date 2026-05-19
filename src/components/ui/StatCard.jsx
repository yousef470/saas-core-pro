import { motion } from "framer-motion";

function StatCard({
  title,
  value,
  growth,
  icon: Icon,
}) {
  return (
   <motion.div
      className="p-6 rounded-2xl border transition-all duration-300"
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--border)",
      }}
      whileHover={{
  y: -5,
}}

transition={{
  duration: 0.2,
}}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <p
            className="text-sm mb-2"
            style={{
              color: "var(--text-muted)",
            }}
          >
            {title}
          </p>

          <h3 className="text-3xl font-bold">
            {value}
          </h3>
        </div>

        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{
            background: "var(--bg-main)",
          }}
        >
          <Icon size={26} />
        </div>
      </div>

      <span className="text-green-500 font-medium">
        {growth}
      </span>
   </motion.div>
  );
}

export default StatCard;