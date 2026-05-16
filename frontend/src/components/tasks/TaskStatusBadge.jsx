import { TASK_STATUS } from "../../constants";

const TaskStatusBadge = ({ status }) => {
  let config = {
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    label: "Unknown",
  };

  switch (status) {
    case TASK_STATUS.TODO:
      config = {
        bg: "bg-slate-100",
        text: "text-slate-700",
        border: "border-slate-200",
        label: "To Do",
      };
      break;
    case TASK_STATUS.IN_PROGRESS:
      config = {
        bg: "bg-amber-100",
        text: "text-amber-700",
        border: "border-amber-200",
        label: "In Progress",
      };
      break;
    case TASK_STATUS.DONE:
      config = {
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        border: "border-emerald-200",
        label: "Done",
      };
      break;
    default:
      break;
  }

  return (
    <span
      className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md border shadow-sm ${config.bg} ${config.text} ${config.border}`}
    >
      {config.label}
    </span>
  );
};

export default TaskStatusBadge;
