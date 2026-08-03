import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Add,
  AutoAwesome,
  Delete,
  Edit,
  Refresh,
  Search,
} from "@mui/icons-material";
import {
  DataGrid,
  GridActionsCellItem,
} from "@mui/x-data-grid";

import PageHeader from "../components/common/PageHeader";

import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from "../services/applicationService";
import { getCandidates } from "../services/candidateService";
import { getJobs } from "../services/jobService";

const STATUS_OPTIONS = [
  "Applied",
  "Screening",
  "Interview",
  "Offered",
  "Hired",
  "Rejected",
];

const INITIAL_FORM = {
  candidate_id: null,
  job_id: null,
  status: "Applied",
  source: "Manual",
  notes: "",
};

function PageToolbar({ search, onSearch }) {
  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        justifyContent: "space-between",
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      <TextField
        size="small"
        placeholder="Search applications..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        sx={{ width: { xs: "100%", sm: 350 }, maxWidth: "100%" }}
      />
    </Box>
  );
}
       

export default function Applications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(INITIAL_FORM);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const showSnackbar = (severity, message) => {
    setSnackbar({
      open: true,
      severity,
      message,
    });
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const [apps, candidateList, jobList] = await Promise.all([
        getApplications(),
        getCandidates(),
        getJobs(),
      ]);

      setApplications(Array.isArray(apps) ? apps : []);
      setCandidates(Array.isArray(candidateList) ? candidateList : []);
      setJobs(Array.isArray(jobList) ? jobList : []);
    } catch (error) {
      console.error(error);
      showSnackbar("error", "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return applications;

    return applications.filter((row) =>
      [
        row.candidate_name,
        row.job_title,
        row.status,
        row.applied_date,
        row.ai_recommendation,
        row.recommendation,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [applications, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(INITIAL_FORM);
    setDialogOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);

    setForm({
      candidate_id: row.candidate_id ?? null,
      job_id: row.job_id ?? null,
      status: row.status ?? "Applied",
      source: row.source ?? "Manual",
      notes: row.notes ?? "",
    });

    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (saving) return;

    setDialogOpen(false);
    setEditing(null);
    setForm(INITIAL_FORM);
  };

  const saveApplication = async () => {
    if (!form.candidate_id || !form.job_id) {
      showSnackbar("error", "Candidate and Job are required.");
      return;
    }

    const payload = {
      candidate_id: form.candidate_id,
      job_id: form.job_id,
      status: form.status,
      source: form.source,
      notes: form.notes,
    };

    try {
      setSaving(true);

      if (editing) {
        await updateApplication(editing.id, payload);
        showSnackbar("success", "Application updated successfully.");
      } else {
        await createApplication(payload);
        showSnackbar("success", "Application created successfully.");
      }

      closeDialog();
      await loadData();
    } catch (error) {
      console.error(error);
      showSnackbar("error", "Unable to save application.");
    } finally {
      setSaving(false);
    }
  };

  const removeApplication = async (id) => {
    if (!window.confirm("Delete this application?")) return;

    try {
      await deleteApplication(id);
      showSnackbar("success", "Application deleted.");
      loadData();
    } catch (error) {
      console.error(error);
      showSnackbar("error", "Unable to delete application.");
    }
  };

  const columns = [
    {
      field: "candidate_name",
      headerName: "Candidate",
      flex: 1.3,
      minWidth: 180,
      valueGetter: (_, row) =>
        row.candidate_name ||
        candidates.find((c) => c.id === row.candidate_id)?.full_name ||
        "",
    },
    {
      field: "job_title",
      headerName: "Job",
      flex: 1.3,
      minWidth: 180,
      valueGetter: (_, row) =>
        row.job_title ||
        jobs.find((j) => j.id === row.job_id)?.title ||
        "",
    },
    {
      field: "status",
      headerName: "Status",
      width: 140,
      renderCell: ({ value }) => <Chip size="small" label={value} />,
    },
    {
      field: "applied_date",
      headerName: "Applied Date",
      width: 170,
    },
    {
      field: "ai_score",
      headerName: "AI Score",
      width: 120,
      valueGetter: (_, row) =>
        row.ai_score ??
        row.screening_score ??
        row.latest_screening?.score ??
        row.screening?.score ??
        "",
    },
    {
      field: "recommendation",
      headerName: "Recommendation",
      flex: 1,
      minWidth: 170,
      valueGetter: (_, row) =>
        row.recommendation ??
        row.ai_recommendation ??
        row.screening_result?.recommendation ??
        row.latest_screening?.recommendation ??
        row.screening?.recommendation ??
        "",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      getActions: ({ row }) => [
        <GridActionsCellItem
          key="ai"
          icon={<AutoAwesome />}
          label="Run AI Screening"
          onClick={() =>
            navigate("/ai-screening", {
              state: {
                applicationId: row.id,
                autoLoad: true,
              },
            })
          }
        />,
        <GridActionsCellItem
          key="edit"
          icon={<Edit />}
          label="Edit"
          onClick={() => openEdit(row)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<Delete />}
          label="Delete"
          onClick={() => removeApplication(row.id)}
          showInMenu
        />,
      ],
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Applications"
        subtitle="Manage hiring pipeline"
        actions={
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={loadData}
            >
              Refresh
            </Button>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={openCreate}
            >
              Add Application
            </Button>
          </Stack>
        }
      />

      <Paper elevation={2}>
        <PageToolbar search={search} onSearch={setSearch} />

        <Box sx={{ height: { xs: 560, md: 650 }, minWidth: 0 }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                  page: 0,
                },
              },
            }}
          />
        </Box>
      </Paper>

      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editing ? "Edit Application" : "New Application"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Autocomplete
              options={candidates}
              value={
                candidates.find((c) => c.id === form.candidate_id) || null
              }
              onChange={(_, value) =>
                setForm((prev) => ({
                  ...prev,
                  candidate_id: value?.id ?? null,
                }))
              }
              getOptionLabel={(option) => option.full_name ?? ""}
              renderInput={(params) => (
                <TextField {...params} label="Candidate" />
              )}
            />

            <Autocomplete
              options={jobs}
              value={jobs.find((j) => j.id === form.job_id) || null}
              onChange={(_, value) =>
                setForm((prev) => ({
                  ...prev,
                  job_id: value?.id ?? null,
                }))
              }
              getOptionLabel={(option) => option.title ?? ""}
              renderInput={(params) => (
                <TextField {...params} label="Job" />
              )}
            />

            <TextField
              select
              label="Status"
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  status: e.target.value,
                }))
              }
            >
              {STATUS_OPTIONS.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Source"
              value={form.source}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  source: e.target.value,
                }))
              }
            />

            <TextField
              label="Notes"
              multiline
              minRows={4}
              value={form.notes}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  notes: e.target.value,
                }))
              }
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>

          <Button
            variant="contained"
            onClick={saveApplication}
            disabled={saving}
          >
            {editing ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar((prev) => ({
              ...prev,
              open: false,
            }))
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}