const { Task } = require("../models/Task.model");
const Project = require("../models/Project.model");
const User = require("../models/User.model");
const ApiError = require("../utils/ApiError");
const ROLES = require("../constants/roles");

const createTask = async (taskData, adminId) => {
  const { project: projectId, assignedTo: userId } = taskData;

  // Validate project exists
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Validate assignee exists
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "Assignee not found");
  }

  // Validate assignee is part of the project
  if (!project.members.includes(userId)) {
    throw new ApiError(400, "Assignee must be a member of the project");
  }

  const task = await Task.create({
    ...taskData,
    createdBy: adminId,
  });

  return task.populate([
    { path: "project", select: "title" },
    { path: "assignedTo", select: "name email role" },
    { path: "createdBy", select: "name email role" },
  ]);
};

const getTasks = async (user, queryParams = {}) => {
  const query = {};

  // Filtering
  if (queryParams.project) query.project = queryParams.project;
  if (queryParams.status) query.status = queryParams.status;
  if (queryParams.assignedTo) query.assignedTo = queryParams.assignedTo;

  // Access Control
  if (user.role !== ROLES.ADMIN) {
    query.assignedTo = user._id;
  }

  return Task.find(query)
    .populate("project", "title")
    .populate("assignedTo", "name email role")
    .populate("createdBy", "name email role")
    .sort({ dueDate: 1, createdAt: -1 });
};

const getTaskById = async (taskId, user) => {
  const task = await Task.findById(taskId)
    .populate("project", "title")
    .populate("assignedTo", "name email role")
    .populate("createdBy", "name email role");

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // Members can only view assigned tasks
  if (user.role !== ROLES.ADMIN && task.assignedTo._id.toString() !== user._id.toString()) {
    // Alternatively, allow viewing if they are in the project, but requirements say "View assigned tasks"
    throw new ApiError(403, "Access denied. Task is not assigned to you.");
  }

  return task;
};

const updateTask = async (taskId, updateData, user) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }


  if (user.role !== ROLES.ADMIN) {
    // Members can only update their own task's status
    if (task.assignedTo.toString() !== user._id.toString()) {
      throw new ApiError(403, "Access denied. Task is not assigned to you.");
    }
    
    // Member may only change status
    if (!updateData.status) {
      throw new ApiError(400, "Members can only update task status");
    }
    task.status = updateData.status;
    await task.save();
    return task.populate([
      { path: "project", select: "title" },
      { path: "assignedTo", select: "name email role" },
      { path: "createdBy", select: "name email role" },
    ]);
  }

  // Admin updating task
  if (updateData.assignedTo && updateData.assignedTo !== task.assignedTo.toString()) {
      // If changing assignee, verify new assignee is in the project
      const project = await Project.findById(updateData.project || task.project);
      if (!project || !project.members.includes(updateData.assignedTo)) {
          throw new ApiError(400, "New assignee must be a member of the project");
      }
  }

  const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, {
    new: true,
    runValidators: true,
  }).populate([
    { path: "project", select: "title" },
    { path: "assignedTo", select: "name email role" },
    { path: "createdBy", select: "name email role" },
  ]);

  return updatedTask;
};

const deleteTask = async (taskId) => {
  const task = await Task.findByIdAndDelete(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  return task;
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
