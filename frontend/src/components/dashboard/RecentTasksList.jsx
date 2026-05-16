import { Link } from "react-router-dom";
import TaskStatusBadge from "../tasks/TaskStatusBadge";
import { ClipboardList } from "lucide-react";

const RecentTasksList = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-10 h-full flex flex-col items-center justify-center text-center shadow-soft">
        <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-5 shadow-sm">
          <ClipboardList className="h-7 w-7 text-gray-400" />
        </div>
        <h2 className="text-lg font-bold text-text-primary tracking-tight">No Recent Tasks</h2>
        <p className="text-text-secondary text-sm mt-1.5 font-medium">There are no tasks assigned yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-7 h-full shadow-soft">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-text-primary tracking-tight">Recent Tasks</h2>
        <Link to="/tasks" className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors px-3 py-1.5 rounded-lg hover:bg-emerald-50">
          View all
        </Link>
      </div>
      
      <div className="space-y-3">
        {tasks.map((task) => (
          <Link
            key={task._id}
            to={`/tasks/${task._id}`}
            className="block p-5 rounded-xl bg-gray-50/50 border border-gray-200 hover:border-primary/40 hover:bg-white hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-text-primary truncate group-hover:text-primary transition-colors">
                  {task.title}
                </h3>
                {task.project && (
                  <p className="text-xs font-medium text-text-secondary mt-1 truncate">
                    {task.project.title}
                  </p>
                )}
              </div>
              <div className="shrink-0 mt-2 sm:mt-0">
                <TaskStatusBadge status={task.status} />
              </div>
            </div>
            
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/60 text-xs">
              <span className="text-text-secondary">
                Due: <span className="font-semibold text-text-primary">{new Date(task.dueDate).toLocaleDateString()}</span>
              </span>
              {task.assignedTo && (
                <span className="text-text-secondary truncate max-w-[150px] sm:max-w-[200px]">
                  To: <span className="font-semibold text-text-primary">{task.assignedTo.name}</span>
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentTasksList;
