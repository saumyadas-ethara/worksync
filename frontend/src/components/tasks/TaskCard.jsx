import { Link } from "react-router-dom";
import TaskStatusBadge from "./TaskStatusBadge";
import { TASK_PRIORITY } from "../../constants";
import { Calendar, AlertCircle } from "lucide-react";

const TaskCard = ({ task }) => {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case TASK_PRIORITY.HIGH:
        return "bg-red-50 text-red-700 border-red-200";
      case TASK_PRIORITY.MEDIUM:
        return "bg-amber-50 text-amber-700 border-amber-200";
      case TASK_PRIORITY.LOW:
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-gray-300 hover:shadow-md transition-all duration-200 shadow-soft group flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <Link to={`/tasks/${task._id}`}>
            <h3 className="text-text-primary font-bold text-base tracking-tight truncate group-hover:text-primary transition-colors">
              {task.title}
            </h3>
          </Link>
          {task.project && (
            <p className="text-text-secondary font-medium text-xs mt-1 truncate">
              {task.project.title}
            </p>
          )}
        </div>
        <TaskStatusBadge status={task.status} />
      </div>

      {/* Details - Inline Row Layout */}
      <div className="flex items-center gap-3 mt-1">
        <div className="flex items-center gap-1.5 text-text-secondary bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
          <Calendar className="w-3.5 h-3.5" />
          <span className="text-[11px] font-semibold uppercase tracking-wider">{formatDate(task.dueDate)}</span>
        </div>
        
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${getPriorityBadge(task.priority)}`}>
          <AlertCircle className="w-3.5 h-3.5" />
          <span className="text-[11px] font-bold uppercase tracking-wider">
            {task.priority}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-5 border-t border-gray-100 mt-auto">
        <div className="flex items-center gap-2">
          {task.assignedTo ? (
            <>
              <div
                title={task.assignedTo.name}
                className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-sm shrink-0"
              >
                {task.assignedTo.name.charAt(0)}
              </div>
              <span className="text-xs text-text-secondary truncate max-w-[150px]">
                <span className="font-semibold text-text-primary">{task.assignedTo.name}</span>
              </span>
            </>
          ) : (
            <span className="text-xs font-medium text-text-secondary italic">Unassigned</span>
          )}
        </div>
        <Link
          to={`/tasks/${task._id}`}
          className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors px-3 py-1.5 rounded-lg hover:bg-emerald-50"
        >
          View
        </Link>
      </div>
    </div>
  );
};

export default TaskCard;
