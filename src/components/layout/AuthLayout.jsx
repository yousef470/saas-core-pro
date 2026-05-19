import useTheme from "../../hooks/useTheme";

function AuthLayout({
  title,
  subtitle,
  children,
}) {
  const { rtl } = useTheme();

  return (
    <div
      className="min-h-screen grid lg:grid-cols-2"
      style={{
        background: "var(--bg-main)",
        color: "var(--text-main)",
      }}
    >
      {/* Left Side */}

      <div className="hidden lg:flex items-center justify-center p-12 bg-indigo-600 text-white">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold mb-6">
            SaaS Core Pro
          </h1>

          <p className="text-lg text-indigo-100 leading-relaxed">
            {rtl
              ? "لوحة تحكم احترافية مبنية باستخدام React و Vite."
              : "Professional SaaS dashboard built with React & Vite."}
          </p>
        </div>
      </div>

      {/* Right Side */}

      <div className="flex items-center justify-center p-6 lg:p-12">
        <div
          className="w-full max-w-md p-8 rounded-3xl border"
          style={{
            background: "var(--bg-card)",
            borderColor: "var(--border)",
          }}
        >
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-3">
              {title}
            </h2>

            <p
              style={{
                color: "var(--text-muted)",
              }}
            >
              {subtitle}
            </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;