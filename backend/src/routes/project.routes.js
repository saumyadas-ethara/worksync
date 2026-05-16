const express = require("express");
const {
  createProjectHandler,
  getProjectsHandler,
  getProjectByIdHandler,
  updateProjectHandler,
  addMemberHandler,
  removeMemberHandler,
  getAllUsersHandler,
} = require("../controllers/project.controller");
const {
  createProjectValidator,
  updateProjectValidator,
  memberValidator,
} = require("../validators/project.validator");
const validate = require("../middlewares/validate.middleware");
const { protect } = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");
const ROLES = require("../constants/roles");

const router = express.Router();

// All project routes require authentication
router.use(protect);

// GET /api/projects — list all (admin) or assigned (member)
router.get("/", getProjectsHandler);

// GET /api/projects/users — all users list for member picker (admin only)
router.get("/users", requireRole(ROLES.ADMIN), getAllUsersHandler);

// POST /api/projects — create project (admin only)
router.post(
  "/",
  requireRole(ROLES.ADMIN),
  createProjectValidator,
  validate,
  createProjectHandler
);

// GET /api/projects/:id — project detail
router.get("/:id", getProjectByIdHandler);

// PATCH /api/projects/:id — update project (admin only)
router.patch(
  "/:id",
  requireRole(ROLES.ADMIN),
  updateProjectValidator,
  validate,
  updateProjectHandler
);

// POST /api/projects/:id/members — add member (admin only)
router.post(
  "/:id/members",
  requireRole(ROLES.ADMIN),
  memberValidator,
  validate,
  addMemberHandler
);

// DELETE /api/projects/:id/members/:userId — remove member (admin only)
router.delete(
  "/:id/members/:userId",
  requireRole(ROLES.ADMIN),
  removeMemberHandler
);

module.exports = router;
