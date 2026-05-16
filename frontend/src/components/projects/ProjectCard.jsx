import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProjectCard = ({ project, onDelete }) => {
  const { isAdmin } = useAuth();

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-gray-300 hover:shadow-md transition-all duration-200 shadow-soft group flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-text-primary font-bold text-base tracking-tight truncate group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-text-secondary text-sm mt-1.5 line-clamp-2 leading-relaxed">
            {project.description || "No description provided."}
          </p>
        </div>
        <span className="shrink-0 font-bold text-[11px] uppercase tracking-wider text-text-secondary bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
          {formatDate(project.createdAt)}
        </span>
      </div>

      {/* Members */}
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
          {project.members.slice(0, 4).map((member) => (
            <div
              key={member._id}
              title={member.name}
              className="w-8 h-8 rounded-full bg-primary border-2 border-white flex items-center justify-center text-xs font-bold text-white uppercase shadow-sm shrink-0"
            >
              {member.name.charAt(0)}
            </div>
          ))}
          {project.members.length > 4 && (
            <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-text-secondary shadow-sm shrink-0">
              +{project.members.length - 4}
            </div>
          )}
        </div>
        <span className="text-xs font-semibold text-text-secondary">
          {project.members.length} member{project.members.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-5 border-t border-gray-100 mt-auto">
        <span className="text-xs text-text-secondary">
          By{" "}
          <span className="text-text-primary font-semibold">
            {project.createdBy?.name || "Unknown"}
          </span>
        </span>
        <Link
          to={`/projects/${project._id}`}
          className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors px-3 py-1.5 rounded-lg hover:bg-emerald-50"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
