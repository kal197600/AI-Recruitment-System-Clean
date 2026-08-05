import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Chip,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";

import CandidateToolbar from "../components/candidates/CandidateToolbar";
import CandidateDialog from "../components/candidates/CandidateDialog";
import CandidateDetailsDialog from "../components/candidates/CandidateDetailsDialog";
import ConfirmActionDialog from "../components/jobs/ConfirmActionDialog";
import PageHeader from "../components/common/PageHeader";
import PrimaryButton from "../components/common/PrimaryButton";

import {
  getCandidates,
  getCandidate,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  runCandidateJobMatching,
} from "../services/candidateService";

import PeopleIcon from "@mui/icons-material/People";
import PsychologyIcon from "@mui/icons-material/Psychology";
import VerifiedIcon from "@mui/icons-material/Verified";
import DescriptionIcon from "@mui/icons-material/Description";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import PreviewRoundedIcon from "@mui/icons-material/PreviewRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import WorkHistoryRoundedIcon from "@mui/icons-material/WorkHistoryRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

function CustomToolbar() {
  return (
    <GridToolbarContainer
      sx={{
        gap: 1.25,
        flexWrap: "wrap",
        justifyContent: "space-between",
        py: 2.25,
        px: { xs: 2, sm: 3 },
        bgcolor: "#F8FAFC",
        borderBottom: "1px solid #E2E8F0",
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: { xs: "100%", sm: 220 } }}>
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: "#E0E7FF",
            color: "#3730A3",
          }}
        >
          <PeopleIcon sx={{ fontSize: 20 }} />
        </Avatar>
        <Box>
          <Typography sx={{ fontSize: 13, color: "text.secondary", lineHeight: 1.1 }}>
            Candidate Directory
          </Typography>
          <Typography sx={{ fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>
            Search, filter, and export
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ display: "flex", flex: 1, minWidth: { xs: "100%", sm: 240 }, maxWidth: 480 }}>
        <GridToolbarQuickFilter
          quickFilterParser={(input) => input.split(",").map((value) => value.trim())}
          placeholder="Search candidates..."
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            borderRadius: 999,
            px: 1.25,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
          }}
        />
      </Box>

      <Stack direction="row" spacing={1} sx={{ width: { xs: "100%", sm: "auto" }, flexWrap: "wrap" }}>
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </Stack>
    </GridToolbarContainer>
  );
}

function EmptyStateOverlay() {
  return (
    <Box sx={{ py: 10, textAlign: "center", color: "text.secondary" }}>
      <Box
        sx={{
          width: 94,
          height: 94,
          borderRadius: 4,
          mx: "auto",
          mb: 3,
          display: "grid",
          placeItems: "center",
          backgroundColor: "#EEF2FF",
        }}
      >
        <DescriptionIcon sx={{ fontSize: 38, color: "#2563EB" }} />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        No candidates found
      </Typography>
      <Typography sx={{ maxWidth: 380, mx: "auto", color: "text.secondary" }}>
        Candidates will appear here once they are added.
      </Typography>
    </Box>
  );
}

function getScreeningScore(row) {
  const score = row.overall_score;
  return score == null ? null : Number(score);
}

function renderScoreChip(score) {
  if (score == null) {
    return (
      <Chip
        label="Not Screened"
        variant="outlined"
        size="small"
        sx={{
          fontWeight: 700,
          letterSpacing: "0.01em",
          color: "text.secondary",
          borderColor: "#CBD5E1",
          backgroundColor: "#F8FAFC",
        }}
      />
    );
  }

  if (score >= 90) {
    return (
      <Chip
        label="Highly Recommended"
        variant="outlined"
        size="small"
        sx={{
          fontWeight: 700,
          letterSpacing: "0.01em",
          borderColor: "#16A34A",
          color: "#166534",
          backgroundColor: "#DCFCE7",
        }}
      />
    );
  }

  if (score >= 80) {
    return (
      <Chip
        label="Recommended"
        variant="outlined"
        size="small"
        sx={{
          fontWeight: 700,
          letterSpacing: "0.01em",
          borderColor: "#2563EB",
          color: "#1D4ED8",
          backgroundColor: "#DBEAFE",
        }}
      />
    );
  }

  if (score >= 60) {
    return (
      <Chip
        label="Consider"
        variant="outlined"
        size="small"
        sx={{
          fontWeight: 700,
          letterSpacing: "0.01em",
          borderColor: "#F59E0B",
          color: "#92400E",
          backgroundColor: "#FEF3C7",
        }}
      />
    );
  }

  return (
    <Chip
      label="Reject"
      variant="outlined"
      size="small"
      sx={{
        fontWeight: 700,
        letterSpacing: "0.01em",
        borderColor: "#DC2626",
        color: "#B91C1C",
        backgroundColor: "#FEE2E2",
      }}
    />
  );
}

function getSourceChip(source) {
  const label = source || "Unknown";
  const mapping = {
    Manual: { bg: "#EFF6FF", text: "#1D4ED8" },
    Email: { bg: "#ECFDF5", text: "#166534" },
    LinkedIn: { bg: "#EFF6FF", text: "#2563EB" },
    Import: { bg: "#FFFBEB", text: "#B45309" },
    Referral: { bg: "#F5F3FF", text: "#7C3AED" },
    Unknown: { bg: "#F8FAFC", text: "#475569" },
  };
  const token = mapping[label] || mapping.Unknown;

  return (
    <Chip
      label={label}
      size="small"
      variant="outlined"
      sx={{
        borderColor: token.bg,
        color: token.text,
        backgroundColor: token.bg,
        fontWeight: 600,
      }}
    />
  );
}

function getScreeningStatusChip(status) {
  const screened = status === "Screened";

  return (
    <Chip
      label={screened ? "Screened" : "Not Screened"}
      color={screened ? "success" : "default"}
      size="small"
      sx={{ fontWeight: 700 }}
    />
  );
}

function formatScore(value) {
  if (value == null) {
    return "-";
  }

  return value;
}

function formatRecommendation(value) {
  if (value == null || value === "") {
    return "-";
  }

  return value;
}

export default function Candidates() {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [detailsCandidate, setDetailsCandidate] = useState(null);
  const [detailsInitialSection, setDetailsInitialSection] = useState("personal");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, severity: "success", message: "" });

  useEffect(() => {
    loadCandidates();
  }, []);

  async function loadCandidates() {
    try {
      const data = await getCandidates();
      setRows(data);
    } catch (error) {
      console.error("Failed to load candidates:", error);
    }
  }

  const filteredRows = useMemo(() => {
    const text = search.toLowerCase();

    return rows.filter((candidate) => {
      return (
        candidate.full_name?.toLowerCase().includes(text) ||
        candidate.email?.toLowerCase().includes(text) ||
        candidate.current_position?.toLowerCase().includes(text)
      );
    });
  }, [rows, search]);

  const stats = useMemo(
    () => [
      {
        title: "Total Candidates",
        value: rows.length,
        icon: <PeopleIcon sx={{ color: "#2563EB" }} />,
        color: "#2563EB",
      },
      {
        title: "AI Screened",
        value: rows.filter((row) => row.screening_status === "Screened").length,
        icon: <PsychologyIcon sx={{ color: "#10B981" }} />,
        color: "#10B981",
      },
      {
        title: "Recommended",
        value: rows.filter((row) => {
          const score = Number(row.overall_score ?? 0);
          return score >= 80;
        }).length,
        icon: <VerifiedIcon sx={{ color: "#F59E0B" }} />,
        color: "#F59E0B",
      },
      {
        title: "CV Uploaded",
        value: rows.filter((row) => row.has_cv).length,
        icon: <DescriptionIcon sx={{ color: "#0EA5E9" }} />,
        color: "#0EA5E9",
      },
    ],
    [rows]
  );

  function handleAdd() {
    setSelectedCandidate(null);
    setDialogMode("add");
    setDialogOpen(true);
  }

  function handleView(candidate) {
    openDetailsDialog(candidate, "personal");
  }

  function handleEdit(candidate) {
    setSelectedCandidate(candidate);
    setDialogMode("edit");
    setDialogOpen(true);
  }

  async function openDetailsDialog(candidate, initialSection) {
    setDetailsInitialSection(initialSection);
    setDetailsCandidate(candidate);
    setDetailsDialogOpen(true);

    if (!candidate?.id) return;

    try {
      const detailed = await getCandidate(candidate.id);
      setDetailsCandidate((prev) => ({
        ...prev,
        ...detailed,
      }));
    } catch (error) {
      console.error("Failed to load candidate details:", error);
    }
  }

  async function handleDelete(candidate) {
    setCandidateToDelete(candidate);
    setDeleteDialogOpen(true);
  }

  async function handleDeleteConfirm() {
    if (!candidateToDelete?.id) return;

    try {
      await deleteCandidate(candidateToDelete.id);
      setDeleteDialogOpen(false);
      setCandidateToDelete(null);
      await loadCandidates();
      setSnackbar({
        open: true,
        severity: "success",
        message: "Candidate deleted successfully.",
      });
    } catch (error) {
      console.error("Delete failed:", error);
      setSnackbar({
        open: true,
        severity: "error",
        message: "Failed to delete candidate.",
      });
    }
  }

  function handleDeleteCancel() {
    setDeleteDialogOpen(false);
    setCandidateToDelete(null);
  }

  function handleResumePreview(candidate) {
    openDetailsDialog(candidate, "resume");
  }

  function getResumeUrl(candidate) {
    const path =
      candidate?.resume_url ||
      candidate?.cv_url ||
      candidate?.file_url ||
      candidate?.filepath;

    if (!path) return "";

    if (path.startsWith("http")) return path;

    return `https://ai-recruitment-backend-uouq.onrender.com/${path}`;
  }

  function handleDownloadResume(candidate) {
    const resumeUrl = getResumeUrl(candidate);

    if (!resumeUrl) {
      setSnackbar({
        open: true,
        severity: "info",
        message: "No resume file available for download.",
      });
      return;
    }

    window.open(resumeUrl, "_blank", "noopener,noreferrer");
  }

  function handleSendEmail(candidate) {
    if (!candidate?.email) {
      setSnackbar({
        open: true,
        severity: "warning",
        message: "Candidate email is not available.",
      });
      return;
    }

    const subject = encodeURIComponent(`Regarding your application - ${candidate.full_name || "Candidate"}`);
    window.location.href = `mailto:${candidate.email}?subject=${subject}`;
  }

  function handleRunScreening(candidate) {
    const applicationId =
      candidate?.latest_application_id ||
      candidate?.application_id ||
      candidate?.last_application_id ||
      "";

    if (applicationId) {
      navigate("/ai-screening", {
        state: {
          applicationId,
          autoLoad: true,
        },
      });
      return;
    }

    setSnackbar({
      open: true,
      severity: "info",
      message: "No linked application found for this candidate. Select one in AI Screening.",
    });

    navigate("/ai-screening");
  }

  async function handleMatchJobs(candidate) {
    if (!candidate?.id) return;

    try {
      const response = await runCandidateJobMatching(candidate.id);
      await loadCandidates();

      setSnackbar({
        open: true,
        severity: "success",
        message: response?.message || "Job matching completed successfully.",
      });
    } catch (error) {
      console.error("Job matching failed:", error);
      setSnackbar({
        open: true,
        severity: "error",
        message: error?.response?.data?.detail || "Failed to run job matching.",
      });
    }
  }

  function handleCloseDialog() {
    setDialogOpen(false);
    setSelectedCandidate(null);
  }

  async function handleSave(candidate) {
    try {
      console.group("Candidate Save");
      console.log("Dialog Mode:", dialogMode);
      console.log("Candidate Object:", candidate);
      console.log("Candidate JSON:", JSON.stringify(candidate, null, 2));
      console.groupEnd();

      if (dialogMode === "add") {
        await createCandidate(candidate);
      } else if (dialogMode === "edit") {
        await updateCandidate(selectedCandidate.id, candidate);
      }

      setDialogOpen(false);
      setSelectedCandidate(null);

      await loadCandidates();
      setSnackbar({
        open: true,
        severity: "success",
        message: dialogMode === "add" ? "Candidate created successfully." : "Candidate updated successfully.",
      });
    } catch (error) {
      console.error("Save failed:", error);
      setSnackbar({
        open: true,
        severity: "error",
        message: "Failed to save candidate.",
      });
    }
  }

  function handleCloseDetailsDialog() {
    setDetailsDialogOpen(false);
    setDetailsCandidate(null);
    setDetailsInitialSection("personal");
  }

  function handleSnackbarClose(_, reason) {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  }

  const columns = useMemo(
    () => [
      {
        field: "candidate",
        headerName: "Candidate",
        flex: 1.8,
        minWidth: 260,
        sortable: false,
        renderCell: ({ row }) => {
          const initials = row.full_name
            ? row.full_name
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")
            : "NA";

          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 44,
                  height: 44,
                  fontWeight: 700,
                  boxShadow: "0 8px 18px rgba(37, 99, 235, 0.2)",
                }}
              >
                {initials}
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 700, letterSpacing: "0.01em" }}>{row.full_name || "—"}</Typography>
                <Typography sx={{ color: "text.secondary", fontSize: 13 }}>{row.email || "—"}</Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        field: "current_position",
        headerName: "Current Position",
        flex: 1.3,
        minWidth: 180,
        renderCell: ({ value }) => (
          <Typography sx={{ fontWeight: 600, color: value ? "text.primary" : "text.secondary" }}>
            {value || "—"}
          </Typography>
        ),
      },
      {
        field: "experience",
        headerName: "Experience",
        width: 140,
        renderCell: ({ value, row }) => {
          const years = Number(value ?? row.years_experience ?? 0);
          return (
            <Chip
              size="small"
              variant="outlined"
              label={String(years) + " Years"}
              sx={{
                borderColor: "#DBEAFE",
                color: "#1D4ED8",
                backgroundColor: "#EFF6FF",
                fontWeight: 700,
                minWidth: 92,
              }}
            />
          );
        },
      },
      {
        field: "source",
        headerName: "Source",
        width: 140,
        renderCell: ({ row }) => getSourceChip(row.source),
      },
      {
        field: "screening",
        headerName: "AI Screening",
        width: 170,
        sortable: false,
        renderCell: ({ row }) => renderScoreChip(getScreeningScore(row)),
      },
      {
        field: "screening_status",
        headerName: "Screening Status",
        width: 170,
        sortable: false,
        renderCell: ({ row }) => getScreeningStatusChip(row.screening_status),
      },
      {
        field: "overall_score",
        headerName: "Overall Score",
        width: 140,
        renderCell: ({ row }) => (
          <Typography sx={{ fontWeight: 700 }}>
            {formatScore(row.overall_score)}
          </Typography>
        ),
      },
      {
        field: "recommendation",
        headerName: "Recommendation",
        flex: 1.1,
        minWidth: 160,
        renderCell: ({ row }) => (
          <Typography sx={{ fontWeight: 600, color: row.recommendation ? "text.primary" : "text.secondary" }}>
            {formatRecommendation(row.recommendation)}
          </Typography>
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 420,
        sortable: false,
        renderCell: ({ row }) => (
          <Stack direction="row" spacing={0.75} sx={{ py: 0.5 }}>
            <Tooltip title="View">
              <IconButton
                size="small"
                onClick={() => handleView(row)}
                sx={{
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": { bgcolor: "primary.light", color: "primary.main" },
                }}
              >
                <VisibilityRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={() => handleEdit(row)}
                sx={{
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": { bgcolor: "primary.light", color: "primary.main" },
                }}
              >
                <EditRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Resume Preview">
              <IconButton
                size="small"
                onClick={() => handleResumePreview(row)}
                sx={{
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": { bgcolor: "primary.light", color: "primary.main" },
                }}
              >
                <PreviewRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Download Resume">
              <IconButton
                size="small"
                onClick={() => handleDownloadResume(row)}
                sx={{
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": { bgcolor: "primary.light", color: "primary.main" },
                }}
              >
                <DownloadRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Send Email">
              <IconButton
                size="small"
                onClick={() => handleSendEmail(row)}
                sx={{
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": { bgcolor: "primary.light", color: "primary.main" },
                }}
              >
                <EmailRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Run AI Screening">
              <IconButton
                size="small"
                onClick={() => handleRunScreening(row)}
                sx={{
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": { bgcolor: "primary.light", color: "primary.main" },
                }}
              >
                <PsychologyRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Match Jobs">
              <IconButton
                size="small"
                onClick={() => handleMatchJobs(row)}
                sx={{
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": { bgcolor: "primary.light", color: "primary.main" },
                }}
              >
                <WorkHistoryRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={() => handleDelete(row)}
                sx={{
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": { bgcolor: "error.light", color: "error.main" },
                }}
              >
                <DeleteRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [navigate]
  );

  return (
    <Box sx={{ width: "100%" }}>
      <PageHeader
        title="Candidates"
        subtitle="Manage candidates"
        actions={<PrimaryButton onClick={handleAdd}>Add Candidate</PrimaryButton>}
      />

      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 3 }}>
        {stats.map((stat) => (
          <Grid key={stat.title} item xs={12} sm={6} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                height: "100%",
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    display: "grid",
                    placeItems: "center",
                    backgroundColor: `${stat.color}1A`,
                  }}
                >
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: "text.secondary", fontWeight: 700 }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
                    {stat.value}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mb: 3, width: "100%" }}>
        <CandidateToolbar search={search} onSearchChange={setSearch} />
      </Box>

      <Box
        sx={{
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 18px 45px rgba(15, 23, 42, 0.06)",
          overflow: "hidden",
          bgcolor: "background.paper",
          width: "100%",
        }}
      >
        <DataGrid
          rows={filteredRows}
          getRowId={(row) => row.id ?? row.candidate_id ?? row.email ?? row.full_name}
          columns={columns}
          autoHeight
          rowHeight={72}
          headerHeight={64}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          slots={{
            toolbar: CustomToolbar,
            noRowsOverlay: EmptyStateOverlay,
          }}
          sx={{
            border: 0,
            "& .MuiDataGrid-main": { minHeight: 360 },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#F8FAFC",
              borderBottom: "1px solid #E2E8F0",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #EEF2F7",
              alignItems: "center",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#F8FBFF",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid #E2E8F0",
            },
          }}
        />
      </Box>

      <CandidateDialog
        open={dialogOpen}
        mode={dialogMode}
        candidate={selectedCandidate}
        onClose={handleCloseDialog}
        onSave={handleSave}
      />

      <CandidateDetailsDialog
        open={detailsDialogOpen}
        candidate={detailsCandidate}
        initialSection={detailsInitialSection}
        onClose={handleCloseDetailsDialog}
      />

      <ConfirmActionDialog
        open={deleteDialogOpen}
        title="Delete Candidate"
        message={
          candidateToDelete
            ? `Are you sure you want to delete ${candidateToDelete.full_name}? This action cannot be undone.`
            : "Are you sure you want to delete this candidate?"
        }
        confirmText="Delete"
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
