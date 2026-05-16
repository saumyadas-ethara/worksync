import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import TaskStatusBadge from "../../components/tasks/TaskStatusBadge";
import UpdateTaskStatusForm from "../../components/forms/UpdateTaskStatusForm";
import { Loader2, Trash2 } from "lucide-react";

const TaskDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTask = async () => {
    try {
      const { data } = await api.get(`/tasks/${id}`);
      setTask(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Task not found");
      navigate("/tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      toast.success("Task deleted");
      navigate("/tasks");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!task) return null;

  const isAssignee = task.assignedTo?._id === user?._id;
  const canUpdateStatus = isAssignee;

  return (
    <div className="flex flex-col min-h-full">
      {/* Top Workspace Header */}
      <div className="bg-white border-b border-gray-200 px-6 md:px-8 py-6 shrink-0 flex flex-col gap-4 shadow-sm z-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-secondary font-medium">
          <Link to="/tasks" className="hover:text-primary transition-colors">Tasks</Link>
          <span>/</span>
          <span className="text-text-primary truncate max-w-[200px]">{task.title}</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">{task.title}</h1>
              {!canUpdateStatus && <TaskStatusBadge status={task.status} />}
            </div>
            {task.project && (
              <p className="text-text-secondary text-sm font-medium mt-1.5">
                Project:{" "}
                <Link to={`/projects/${task.project._id}`} className="text-primary hover:text-primary-hover transition-colors font-semibold">
                  {task.project.title}
                </Link>
              </p>
            )}
          </div>
          
          {/* Action Area */}
          <div className="flex flex-col sm:items-end gap-3 shrink-0">
            {canUpdateStatus && (
              <UpdateTaskStatusForm task={task} onUpdate={setTask} />
            )}
            {isAdmin && (
              <button
                onClick={handleDelete}
                className="text-sm font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 border border-transparent hover:border-red-100 shadow-sm"
              >
                <Trash2 className="h-4 w-4" />
                Delete Task
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Fluid Content Workspace */}
      <div className="flex-1 p-6 md:p-8 max-w-[1400px] mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            {/* Description Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-soft">
              <h2 className="text-lg font-bold text-text-primary mb-5 tracking-tight">Description</h2>
              {task.description ? (
                <div className="text-text-secondary text-sm whitespace-pre-wrap leading-relaxed">
                  {task.description}
                </div>
              ) : (
                <p className="text-text-secondary text-sm italic">No description provided.</p>
              )}
            </div>
          </div>

          {/* Properties Panel (Sidebar) */}
          <div className="w-full lg:w-80 shrink-0 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-soft">
              <h2 className="text-lg font-bold text-text-primary mb-6 tracking-tight">Properties</h2>
              
              <div className="space-y-6">
                {/* Assignee */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">Assigned To</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white uppercase shadow-sm shrink-0 border-2 border-white ring-2 ring-primary/10">
                      {task.assignedTo?.name.charAt(0) || "?"}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm text-text-primary font-bold truncate">
                        {task.assignedTo?.name ? task.assignedTo.name : "Unassigned"}
                      </span>
                      {task.assignedTo?.email && (
                        <span className="text-xs text-text-secondary truncate">
                          {task.assignedTo.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Due Date */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Due Date</p>
                  <p className="text-sm text-text-primary font-semibold">
                    {new Date(task.dueDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </p>
                </div>

                <hr className="border-gray-100" />

                {/* Priority */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Priority</p>
                  <p className={`text-sm font-bold uppercase tracking-wider mt-1 ${
                    task.priority === "HIGH" ? "text-red-600" :
                    task.priority === "MEDIUM" ? "text-amber-600" :
                    "text-emerald-600"
                  }`}>
                    {task.priority}
                  </p>
                </div>

                <hr className="border-gray-100" />

                {/* Created By */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Created By</p>
                  <p className="text-sm text-text-primary font-semibold truncate">
                    {task.createdBy?.name ? task.createdBy.name : "Unknown"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;
