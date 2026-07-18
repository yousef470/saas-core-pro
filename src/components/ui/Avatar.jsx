function Avatar({
  src,
  name = "User",
  size = 48,
  className = "",
}) {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <>
      {src ? (
        <img
          src={src}
          alt={name}
          width={size}
          height={size}
          className={`rounded-full object-cover border border-slate-200 dark:border-slate-700 ${className}`}
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
      ) : null}

      <div
        style={{
          width: size,
          height: size,
          display: src ? "none" : "flex",
        }}
        className={`rounded-full bg-indigo-600 text-white font-bold items-center justify-center select-none border border-slate-200 dark:border-slate-700 ${className}`}
      >
        {initials}
      </div>
    </>
  );
}

export default Avatar;