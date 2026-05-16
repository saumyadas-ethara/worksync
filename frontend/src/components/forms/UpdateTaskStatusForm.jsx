import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { TASK_STATUS } from "../../constants";
import { Loader2 } from "lucide-react";

const UpdateTaskStatusForm = ({ task, onUpdate }) => {
  const [status, setStatus] = useState(task.status);
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setIsLoading(true);

    try {
      const { data } = await api.patch(`/tasks/${task._id}`, {
        status: newStatus,
      });
      toast.success("Status updated");
      onUpdate?.(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
      // Revert status on error
      setStatus(task.status);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={handleStatusChange}
        disabled={isLoading}
        className="px-3.5 py-2 rounded-xl bg-white border border-gray-300 text-text-primary text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all duration-200 disabled:opacity-50 cursor-pointer hover:border-gray-400"
      >
        <option value={TASK_STATUS.TODO}>To Do</option>
        <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
        <option value={TASK_STATUS.DONE}>Done</option>
      </select>
      {isLoading && (
        <Loader2 className="animate-spin h-5 w-5 text-primary" />
      )}
    </div>
  );
};

export default UpdateTaskStatusForm;
