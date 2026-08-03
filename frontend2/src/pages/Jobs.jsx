import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
  Paper,
  MenuItem,
  Snackbar,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";

import JobDialog from "../components/jobs/JobDialog";
import JobViewDialog from "../components/jobs/JobViewDialog";
import ConfirmActionDialog from "../components/jobs/ConfirmActionDialog";
import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/common/StatCard";



import {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
} from "../services/jobService";

export default function Jobs() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [status, setStatus] = useState("all");
  const [location, setLocation] = useState("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [jobToView, setJobToView] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      setLoading(true);

      const data = await getJobs();

      setRows(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredRows = useMemo(() => {
    const text = search.toLowerCase();

    return rows.filter((job) => {
      const searchable = [
        job.title,
        job.department,
        job.location,
        job.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(text);

      if (!searchable) return false;
      if (department !== "all" && (job.department || "Unknown") !== department) return false;
      if (status !== "all" && (job.status || "Draft") !== status) return false;
      if (location !== "all" && (job.location || "Unknown") !== location) return false;

      return true;
    });
  }, [rows, search, department, status, location]);

  const departmentOptions = useMemo(() => {
    const options = rows
      .map((job) => job.department)
      .filter(Boolean);
    return ["all", ...Array.from(new Set(options))];
  }, [rows]);

  const locationOptions = useMemo(() => {
    const options = rows
      .map((job) => job.location)
      .filter(Boolean);
    return ["all", ...Array.from(new Set(options))];
  }, [rows]);

  const statusOptions = ["all", "Open", "Closed", "Draft", "Paused"];

  const stats = useMemo(() => {
    const openJobs = rows.filter((job) => (job.status || "").toLowerCase() === "open").length;
    const closedJobs = rows.filter((job) => (job.status || "").toLowerCase() === "closed").length;
    const applications = rows.reduce((sum, job) => {
      return (
        sum +
        Number(
          job.applications_count ??
            job.application_count ??
            job.total_applications ??
            (Array.isArray(job.applications) ? job.applications.length : 0)
        )
      );
    }, 0);

    return [
      {
        title: "Total Jobs",
        value: rows.length,
        subtitle: "All positions",
        icon: <WorkOutlineRoundedIcon />,
        color: "primary",
      },
      {
        title: "Open Jobs",
        value: openJobs,
        subtitle: "Actively hiring",
        icon: <TaskAltRoundedIcon />,
        color: "success",
      },
      {
        title: "Closed Jobs",
        value: closedJobs,
        subtitle: "Completed roles",
        icon: <ArchiveRoundedIcon />,
        color: "warning",
      },
      {
        title: "Applications Received",
        value: applications,
        subtitle: "Across all jobs",
        icon: <DescriptionRoundedIcon />,
        color: "info",
      },
    ];
  }, [rows]);

  function statusChip(value) {
    const normalized = (value || "Draft").toLowerCase();
    const map = {
      open: { label: "Open", color: "success" },
      closed: { label: "Closed", color: "default" },
      draft: { label: "Draft", color: "warning" },
      paused: { label: "Paused", color: "info" },
    };
    const meta = map[normalized] || map.draft;

    return <Chip size="small" label={meta.label} color={meta.color} variant="outlined" />;
  }

  function formatDate(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString();
  }

  function applicationsCount(job) {
    return Number(
      job.applications_count ??
        job.application_count ??
        job.total_applications ??
        (Array.isArray(job.applications) ? job.applications.length : 0)
    );
  }

  function handleView(job) {
    setJobToView(job);
    setViewDialogOpen(true);
  }

  function handleAdd() {
    setSelectedJob(null);
    setDialogMode("add");
    setDialogOpen(true);
  }

  function handleEdit(job) {
    setSelectedJob(job);
    setDialogMode("edit");
    setDialogOpen(true);
  }

  async function handleDelete(job) {
    setJobToDelete(job);
    setDeleteDialogOpen(true);
  }

  function buildJobPayload(job, titleOverride) {
    return {
      title: titleOverride ?? (job.title ?? ""),
      department: job.department ?? "",
      location: job.location ?? "",
      description: job.description ?? "",
      required_skills: job.required_skills ?? "",
      minimum_experience: Number(job.minimum_experience ?? 0),
      employment_type: job.employment_type ?? "Full-Time",
      status: job.status ?? "Open",
    };
  }

  async function handleDuplicate(job) {
    try {
      const duplicateTitle = `${job.title ?? "Untitled Job"} (Copy)`;

      await createJob(
        buildJobPayload(job, duplicateTitle)
      );

      await loadJobs();
      setSuccessMessage("Job duplicated successfully.");
    } catch (err) {
      console.error(err);
    }
  }

  async function handleConfirmDelete() {
    if (!jobToDelete) return;

    try {
      await deleteJob(jobToDelete.id);

      setDeleteDialogOpen(false);
      setJobToDelete(null);
      await loadJobs();
      setSuccessMessage("Job deleted successfully.");
    } catch (err) {
      console.error(err);
    }
  }

  function handleDeleteDialogClose() {
    setDeleteDialogOpen(false);
    setJobToDelete(null);
  }

  function handleViewDialogClose() {
    setViewDialogOpen(false);
    setJobToView(null);
  }

  function handleClose() {
    setDialogOpen(false);
    setSelectedJob(null);
  }

  async function handleSave(job) {
    try {
      if (dialogMode === "add") {
        await createJob(job);
      } else {
        await updateJob(
          selectedJob.id,
          job
        );
        setSuccessMessage("Job updated successfully.");
      }

      handleClose();

      await loadJobs();
    } catch (err) {
      console.error(err);
    }
  }

  function handleResetFilters() {
    setSearch("");
    setDepartment("all");
    setStatus("all");
    setLocation("all");
  }

  function handleSnackbarClose(_, reason) {
    if (reason === "clickaway") return;
    setSuccessMessage("");
  }

  function handleExportCsv() {
    const headers = [
      "Job Title",
      "Department",
      "Location",
      "Employment Type",
      "Experience",
      "Applications",
      "Status",
      "Created Date",
    ];

    const csvRows = filteredRows.map((job) => [
      job.title ?? "",
      job.department ?? "",
      job.location ?? "",
      job.employment_type ?? "",
      `${job.minimum_experience ?? 0} Years`,
      applicationsCount(job),
      job.status ?? "Draft",
      formatDate(job.created_at),
    ]);

    const csvContent = [headers, ...csvRows]
      .map((line) =>
        line
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "jobs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const columns = useMemo(
    () => [
      {
        field: "title",
        headerName: "Job Title",
        minWidth: 220,
        flex: 1.4,
      },
      {
        field: "department",
        headerName: "Department",
        minWidth: 150,
        flex: 1,
      },
      {
        field: "location",
        headerName: "Location",
        minWidth: 150,
        flex: 1,
      },
      {
        field: "employment_type",
        headerName: "Employment Type",
        minWidth: 150,
        flex: 1,
      },
      {
        field: "minimum_experience",
        headerName: "Experience",
        minWidth: 120,
        renderCell: (params) => `${params.row.minimum_experience ?? 0} Years`,
      },
      {
        field: "applications",
        headerName: "Applications",
        minWidth: 130,
        valueGetter: (_, row) => applicationsCount(row),
      },
      {
        field: "status",
        headerName: "Status",
        minWidth: 120,
        renderCell: (params) => statusChip(params.row.status),
      },
      {
        field: "created_at",
        headerName: "Created Date",
        minWidth: 130,
        valueGetter: (_, row) => formatDate(row.created_at),
      },
      {
        field: "actions",
        headerName: "Actions",
        minWidth: 180,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Stack direction="row" spacing={0.75}>
            <Tooltip title="View">
              <IconButton size="small" onClick={() => handleView(params.row)}>
                <VisibilityRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Edit">
              <IconButton size="small" color="primary" onClick={() => handleEdit(params.row)}>
                <EditRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Duplicate">
              <IconButton
                size="small"
                color="info"
                onClick={() => handleDuplicate(params.row)}
              >
                <ContentCopyRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton size="small" color="error" onClick={() => handleDelete(params.row)}>
                <DeleteRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [rows]
  );

  return (
    <Box sx={{ width: "100%", py: 1 }}>
      <Stack spacing={3}>
        <PageHeader
          title="Jobs"
          subtitle="Manage job openings"
          actions={
            <Stack direction="row" spacing={1}>
              <Tooltip title="Refresh">
                <IconButton onClick={loadJobs} aria-label="Refresh jobs">
                  <RefreshRoundedIcon />
                </IconButton>
              </Tooltip>
              <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={handleAdd}
              >
                Create Job
              </Button>
            </Stack>
          }
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
            gap: 2,
          }}
        >
          {stats.map((item) => (
            <StatCard
              key={item.title}
              title={item.title}
              value={item.value}
              subtitle={item.subtitle}
              icon={item.icon}
              color={item.color}
              loading={loading}
            />
          ))}
        </Box>


        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
          }}
        >
          {loading ? (
            <Stack spacing={1.25}>
              <Skeleton variant="rounded" height={56} />
              <Skeleton variant="rounded" height={58} />
              <Skeleton variant="rounded" height={58} />
              <Skeleton variant="rounded" height={58} />
              <Skeleton variant="rounded" height={58} />
            </Stack>
          ) : filteredRows.length === 0 ? (
            <Box sx={{ py: 8, textAlign: "center" }}>
  <Typography variant="h6" gutterBottom>
    No jobs found
  </Typography>

  <Typography color="text.secondary">
    Create a new job to start tracking your recruitment pipeline.
  </Typography>

  <Button
    sx={{ mt: 3 }}
    variant="contained"
    startIcon={<AddRoundedIcon />}
    onClick={handleAdd}
  >
    Create Job
  </Button>
</Box>
          ) : (
            <Box sx={{ width: "100%", overflowX: "auto" }}>
              <DataGrid
                rows={filteredRows}
                columns={columns}
                disableRowSelectionOnClick
                autoHeight
                pageSizeOptions={[10, 25, 50]}
                initialState={{
                  pagination: {
                    paginationModel: {
                      page: 0,
                      pageSize: 10,
                    },
                  },
                }}
                sx={{
                  border: 0,
                  minWidth: 960,
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#F8FAFC",
                    borderBottom: "1px solid #E2E8F0",
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: 700,
                  },
                  "& .MuiDataGrid-row": {
                    transition: "background-color .2s",
                  },
                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: "#F8FAFC",
                  },
                  "& .MuiDataGrid-cell": {
                    borderBottom: "1px solid #EEF2F7",
                  },
                  "& .MuiDataGrid-footerContainer": {
                    borderTop: "1px solid #EEF2F7",
                  },
                }}
              />
            </Box>
          )}
        </Paper>
      </Stack>

      <JobDialog
        open={dialogOpen}
        mode={dialogMode}
        job={selectedJob}
        onClose={handleClose}
        onSave={handleSave}
      />

      <JobViewDialog
        open={viewDialogOpen}
        job={jobToView}
        onClose={handleViewDialogClose}
      />

      <ConfirmActionDialog
        open={deleteDialogOpen}
        title="Delete Job"
        message={
          jobToDelete
            ? `Are you sure you want to delete "${jobToDelete.title}"? This action cannot be undone.`
            : "Are you sure you want to delete this job?"
        }
        confirmText="Delete"
        onCancel={handleDeleteDialogClose}
        onConfirm={handleConfirmDelete}
      />

      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" variant="filled">
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}