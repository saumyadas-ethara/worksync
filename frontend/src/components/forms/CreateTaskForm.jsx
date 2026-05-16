import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { TASK_PRIORITY } from "../../constants";
import { Loader2 } from "lucide-react";

const schema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(1000).optional(),
  project: z.string().min(1, "Project is required"),
  assignedTo: z.string().min(1, "Assignee is required"),
  dueDate: z.string().min(1, "Due date is required"),
  priority: z.nativeEnum(TASK_PRIORITY).default(TASK_PRIORITY.MEDIUM),
});

const CreateTaskForm = ({ onSuccess, onCancel, prefilledProject = null, prefilledProjectTitle = "" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      project: prefilledProject || "",
    },
  });

  const selectedProject = watch("project");

  // Ensure prefilled project is explicitly set
  useEffect(() => {
    if (prefilledProject) {
      setValue("project", prefilledProject, { shouldValidate: true });
    }
  }, [prefilledProject, setValue]);

  // Fetch projects for the dropdown
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get("/projects");
        setProjects(data.data);
      } catch (err) {
        toast.error("Failed to load projects");
      }
    };
    fetchProjects();
  }, []);

  // Fetch project members when project changes
  useEffect(() => {
    const fetchMembers = async () => {
      if (!selectedProject) {
        setProjectMembers([]);
        return;
      }
      try {
        const { data } = await api.get(`/projects/${selectedProject}`);
        setProjectMembers(data.data.members);
      } catch (err) {
        // silently fail or reset members
        setProjectMembers([]);
      }
    };
    fetchMembers();
  }, [selectedProject]);

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const { data } = await api.post("/tasks", formData);
      toast.success("Task created successfully!");
      reset();
      onSuccess?.(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-text-primary mb-2">
          Task Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("title")}
          className={`w-full px-4 py-3 rounded-xl bg-white border text-text-primary placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition shadow-sm ${
            errors.title ? "border-red-300 focus:ring-red-500" : "border-gray-300"
          }`}
          placeholder="e.g. Design Landing Page"
        />
        {errors.title && <p className="mt-1.5 text-xs text-red-500">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-text-primary mb-2">Description</label>
        <textarea
          rows={3}
          {...register("description")}
          className={`w-full px-4 py-3 rounded-xl bg-white border text-text-primary placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition resize-none shadow-sm ${
            errors.description ? "border-red-300 focus:ring-red-500" : "border-gray-300"
          }`}
          placeholder="Detailed task description..."
        />
        {errors.description && <p className="mt-1.5 text-xs text-red-500">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Project */}
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            Project <span className="text-red-500">*</span>
          </label>
          <select
            {...register("project")}
            disabled={!!prefilledProject}
            className={`w-full px-4 py-3 rounded-xl bg-white border text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition shadow-sm ${
              errors.project ? "border-red-300 focus:ring-red-500" : "border-gray-300"
            } ${prefilledProject ? "bg-gray-50 opacity-75 cursor-not-allowed" : ""}`}
          >
            {prefilledProject ? (
              <option value={prefilledProject}>{prefilledProjectTitle || "Current Project"}</option>
            ) : (
              <>
                <option value="">Select project...</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
              </>
            )}
          </select>
          {errors.project && <p className="mt-1.5 text-xs text-red-500">{errors.project.message}</p>}
        </div>

        {/* Assignee */}
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            Assign To <span className="text-red-500">*</span>
          </label>
          <select
            {...register("assignedTo")}
            disabled={!selectedProject}
            className={`w-full px-4 py-3 rounded-xl bg-white border text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition shadow-sm ${
              errors.assignedTo ? "border-red-300 focus:ring-red-500" : "border-gray-300"
            } ${!selectedProject ? "bg-gray-50 opacity-50 cursor-not-allowed" : ""}`}
          >
            <option value="">Select member...</option>
            {projectMembers.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name} ({m.email})
              </option>
            ))}
          </select>
          {errors.assignedTo && <p className="mt-1.5 text-xs text-red-500">{errors.assignedTo.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Due Date */}
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            Due Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register("dueDate")}
            className={`w-full px-4 py-3 rounded-xl bg-white border text-text-primary placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition shadow-sm ${
              errors.dueDate ? "border-red-300 focus:ring-red-500" : "border-gray-300"
            }`}
          />
          {errors.dueDate && <p className="mt-1.5 text-xs text-red-500">{errors.dueDate.message}</p>}
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">Priority</label>
          <select
            {...register("priority")}
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition shadow-sm"
          >
            <option value={TASK_PRIORITY.LOW}>Low</option>
            <option value={TASK_PRIORITY.MEDIUM}>Medium</option>
            <option value={TASK_PRIORITY.HIGH}>High</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 px-4 border border-gray-300 text-text-secondary hover:text-text-primary hover:bg-gray-50 font-semibold rounded-xl transition-colors text-sm shadow-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-3 px-4 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2 shadow-sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-4 w-4" />
              Creating...
            </>
          ) : "Create Task"}
        </button>
      </div>
    </form>
  );
};

export default CreateTaskForm;
