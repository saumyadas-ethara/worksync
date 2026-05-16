import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const OverdueAlert = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-10 h-full flex flex-col items-center justify-center text-center shadow-soft">
        <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-5 shadow-sm">
          <AlertCircle className="h-7 w-7 text-gray-400" />
        </div>
        <h2 className="text-lg font-bold text-text-primary tracking-tight">No Overdue Tasks</h2>
        <p className="text-text-secondary text-sm mt-1.5 font-medium">You're all caught up!</p>
      </div>
    );
  }

  return (
    <div className="bg-red-50/50 border border-red-200 rounded-2xl p-7 shadow-soft">
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-red-100">
        <div className="w-12 h-12 rounded-xl bg-red-100/80 flex items-center justify-center shrink-0 shadow-sm border border-red-200">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-red-900 tracking-tight">Overdue Tasks</h2>
          <p className="text-sm font-medium text-red-700 mt-1">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""} require{tasks.length === 1 ? "s" : ""} immediate attention
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => {
          const daysOverdue = Math.floor((new Date() - new Date(task.dueDate)) / (1000 * 60 * 60 * 24));
          
          return (
            <Link
              key={task._id}
              to={`/tasks/${task._id}`}
              className="flex items-center justify-between gap-4 p-5 rounded-xl bg-white border border-red-200 hover:border-red-400 hover:shadow-md transition-all duration-200 group shadow-sm"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-red-900 truncate group-hover:text-red-700 transition-colors">
                  {task.title}
                </p>
                {task.project && (
                  <p className="text-xs font-medium text-red-600/70 mt-1 truncate">
                    {task.project.title}
                  </p>
                )}
              </div>
              <div className="shrink-0 text-right">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-red-100 text-red-700 uppercase tracking-wider shadow-sm">
                  {daysOverdue} day{daysOverdue !== 1 ? "s" : ""} late
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default OverdueAlert;
