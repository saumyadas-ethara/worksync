const StatCard = ({ title, value, icon, colorClass = "text-primary", bgClass = "bg-primary/10" }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-soft hover:shadow-md hover:border-gray-300 transition-all duration-200 flex flex-col gap-5">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bgClass} ${colorClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">{title}</p>
        <p className="text-4xl font-bold text-text-primary tracking-tight">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
