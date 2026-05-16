import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { Loader2, Search, X } from "lucide-react";

const schema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(100),
  description: z.string().max(500, "Max 500 characters").optional(),
});

const CreateProjectForm = ({ onSuccess, onCancel, allUsers = [] }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [memberSearch, setMemberSearch] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const payload = { ...formData, members: selectedMembers.map(m => m._id) };
      const { data } = await api.post("/projects", payload);
      toast.success("Project created successfully!");
      reset();
      onSuccess?.(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-text-primary mb-2">
          Project Title <span className="text-red-500">*</span>
        </label>
        <input
          id="project-title"
          type="text"
          {...register("title")}
          className={`w-full px-4 py-3 rounded-xl bg-white border text-text-primary placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition shadow-sm ${
            errors.title ? "border-red-300 focus:ring-red-500" : "border-gray-300"
          }`}
          placeholder="e.g. Website Redesign"
        />
        {errors.title && (
          <p className="mt-2 text-xs font-medium text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-text-primary mb-2">
          Description
        </label>
        <textarea
          id="project-description"
          rows={3}
          {...register("description")}
          className={`w-full px-4 py-3 rounded-xl bg-white border text-text-primary placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition resize-none shadow-sm ${
            errors.description ? "border-red-300 focus:ring-red-500" : "border-gray-300"
          }`}
          placeholder="What is this project about?"
        />
        {errors.description && (
          <p className="mt-2 text-xs font-medium text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Members Selection */}
      {allUsers && allUsers.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            Assign Members
          </label>
          
          {/* Selected Members Badges */}
          {selectedMembers.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedMembers.map((member) => (
                <div key={member._id} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-semibold">
                  <div className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center text-[9px] uppercase">
                    {member.name.charAt(0)}
                  </div>
                  {member.name}
                  <button
                    type="button"
                    onClick={() => setSelectedMembers(prev => prev.filter(m => m._id !== member._id))}
                    className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Search Input */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users to add..."
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-gray-300 text-text-primary placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm transition"
            />
          </div>

          {/* Search Results List */}
          <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-xl shadow-inner-soft divide-y divide-gray-100 mb-3 bg-gray-50">
            {allUsers
              .filter(u => !selectedMembers.some(sm => sm._id?.toString() === u._id?.toString()))
              .filter(u => 
                u.name.toLowerCase().includes(memberSearch.toLowerCase()) || 
                u.email.toLowerCase().includes(memberSearch.toLowerCase())
              )
              .map(user => (
                <div key={user._id} className="flex items-center justify-between p-3 hover:bg-white transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-text-primary truncate">{user.name}</p>
                    <p className="text-xs text-text-secondary truncate">{user.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMembers(prev => [...prev, user]);
                      setMemberSearch("");
                    }}
                    className="ml-3 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg text-xs font-bold transition-colors shrink-0"
                  >
                    Add
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

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
          id="create-project-btn"
          type="submit"
          disabled={isLoading}
          className="flex-1 py-3 px-4 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2 shadow-sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-4 w-4" />
              Creating...
            </>
          ) : "Create Project"}
        </button>
      </div>
    </form>
  );
};

export default CreateProjectForm;
