import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Alert,
  Button,
  Card,
  CircularProgress,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PsychologyIcon from "@mui/icons-material/Psychology";

import dashboardService from "../services/dashboardService";
import PageHeader from "../components/common/PageHeader";
import DashboardChart from "../components/dashboard/DashboardChart";

export default function Dashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        setLoading(true);

        const data = await dashboardService.getSummary();

        if (!mounted) return;

        setDashboard(data);
      } catch (err) {
        setError(
          err?.response?.data?.detail ||
            err?.message ||
            "Failed to load dashboard data."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const stats = dashboard?.statistics ?? {};
  const recentCandidates = dashboard?.recent_candidates ?? [];
  const recentJobs = dashboard?.recent_jobs ?? [];
  const recommendationDistribution = dashboard?.recommendation_distribution ?? {};

  const kpiCards = [
    {
      title: "Total Candidates",
      value: stats.total_candidates ?? 0,
      subtitle: "Profiles in pipeline",
      icon: <PeopleIcon fontSize="small" />,
      iconBg: "#DBEAFE",
      iconColor: "#1D4ED8",
    },
    {
      title: "Open Jobs",
      value: stats.total_jobs ?? 0,
      subtitle: "Active opportunities",
      icon: <WorkIcon fontSize="small" />,
      iconBg: "#DCFCE7",
      iconColor: "#166534",
    },
    {
      title: "Applications",
      value: stats.total_applications ?? 0,
      subtitle: "Submissions received",
      icon: <AssignmentIcon fontSize="small" />,
      iconBg: "#FFE4D6",
      iconColor: "#C2410C",
    },
    {
      title: "Average AI Score",
      value: `${stats.average_ai_score ?? 0}%`,
      subtitle: "Candidate quality signal",
      icon: <PsychologyIcon fontSize="small" />,
      iconBg: "#EDE9FE",
      iconColor: "#6D28D9",
    },
  ];

  function statusColor(value) {
    const normalized = String(value ?? "").toLowerCase();
    if (normalized.includes("hire") || normalized.includes("open") || normalized.includes("active")) {
      return "success";
    }
    if (normalized.includes("review") || normalized.includes("interview") || normalized.includes("shortlist")) {
      return "info";
    }
    if (normalized.includes("reject") || normalized.includes("closed")) {
      return "default";
    }
    return "warning";
  }

  const aiSummaryItems = [
    {
      label: "Average AI Score",
      value: `${stats.average_ai_score ?? 0}%`,
    },
    {
      label: "Total Screenings",
      value: stats.total_screenings ?? dashboard?.total_screenings ?? 0,
    },
    {
      label: "Recommended",
      value:
        recommendationDistribution.recommended ??
        recommendationDistribution.Recommended ??
        stats.recommended_candidates ??
        0,
    },
  ];

  return (
    <Grid container spacing={{ xs: 2, md: 3 }} sx={{ width: "100%" }} alignItems="stretch">
      <Grid item xs={12}>
        <PageHeader
          title="Dashboard"
          subtitle="Recruitment Overview"
        />
      </Grid>

      {error && (
        <Grid item xs={12}>
          <Alert severity="error">{error}</Alert>
        </Grid>
      )}

      {loading ? (
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        </Grid>
      ) : (
        <>
          {kpiCards.map((kpi) => (
            <Grid key={kpi.title} item xs={12} sm={6} lg={3} sx={{ display: "flex" }}>
              <Card
                sx={{
                  height: "100%",
                  p: { xs: 2.25, sm: 3 },
                  width: "100%",
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  background: "linear-gradient(180deg, #FFFFFF 0%, #FAFCFF 100%)",
                }}
              >
                <Stack spacing={2}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      display: "grid",
                      placeItems: "center",
                      bgcolor: kpi.iconBg,
                      color: kpi.iconColor,
                    }}
                  >
                    {kpi.icon}
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                      {kpi.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.15, mt: 0.5 }}>
                      {kpi.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                      {kpi.subtitle}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          ))}

          <Grid item xs={12} sx={{ display: "flex" }}>
            <Card
              sx={{
                height: "100%",
                width: "100%",
                p: 0,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                overflow: "hidden",
                "& .MuiCard-root": {
                  borderRadius: 0,
                  border: "none",
                },
                "& canvas": {
                  height: { xs: "240px !important", sm: "300px !important" },
                  maxHeight: { xs: "240px !important", sm: "300px !important" },
                },
              }}
            >
              <DashboardChart
                monthlyApplications={
                  dashboard?.monthly_applications ?? []
                }
              />
            </Card>
          </Grid>

          <Grid item xs={12} lg={6} sx={{ display: "flex" }}>
            <Card
              sx={{
                height: "100%",
                p: { xs: 2.25, sm: 3 },
                width: "100%",
                minHeight: 420,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Recent Candidates
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                Latest profiles entering the hiring pipeline.
              </Typography>

              <Stack divider={<Divider flexItem />} sx={{ flexGrow: 1 }}>
                {recentCandidates.slice(0, 5).map((candidate, index) => (
                  <Stack
                    key={`${candidate.name ?? "candidate"}-${index}`}
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "stretch", sm: "center" }}
                    spacing={{ xs: 1, sm: 0 }}
                    sx={{ minHeight: 68, py: 1.25 }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0, pr: 1.5 }}>
                      <Typography sx={{ fontWeight: 700 }} noWrap>
                        {candidate.name ?? "Unknown Candidate"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {candidate.position ?? "Position not specified"}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: { sm: 208 }, justifyContent: { xs: "flex-start", sm: "flex-end" }, flexWrap: "wrap" }}>
                      <Chip
                        size="small"
                        label={candidate.score != null ? `${candidate.score}` : "-"}
                        variant="outlined"
                        sx={{ minWidth: 72, justifyContent: "center" }}
                      />
                      <Chip
                        size="small"
                        label={candidate.status ?? "Pending"}
                        color={statusColor(candidate.status)}
                        sx={{ minWidth: { xs: 100, sm: 120 }, justifyContent: "center" }}
                      />
                    </Stack>
                  </Stack>
                ))}

                {recentCandidates.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                    No recent candidates available.
                  </Typography>
                )}
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} lg={6} sx={{ display: "flex" }}>
            <Card
              sx={{
                height: "100%",
                p: { xs: 2.25, sm: 3 },
                width: "100%",
                minHeight: 420,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Recent Jobs
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                Most recently opened and updated positions.
              </Typography>

              <Stack divider={<Divider flexItem />} sx={{ flexGrow: 1 }}>
                {recentJobs.slice(0, 5).map((job, index) => (
                  <Stack
                    key={`${job.title ?? "job"}-${index}`}
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "stretch", sm: "center" }}
                    spacing={{ xs: 1, sm: 0 }}
                    sx={{ minHeight: 68, py: 1.25 }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0, pr: 1.5 }}>
                      <Typography sx={{ fontWeight: 700 }} noWrap>
                        {job.title ?? "Untitled Job"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {job.department ?? "Department not specified"}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: { sm: 208 }, justifyContent: { xs: "flex-start", sm: "flex-end" }, flexWrap: "wrap" }}>
                      <Chip
                        size="small"
                        label={`${job.applicants ?? 0} applicants`}
                        variant="outlined"
                        sx={{ minWidth: 72, justifyContent: "center" }}
                      />
                      <Chip
                        size="small"
                        label={job.status ?? "Draft"}
                        color={statusColor(job.status)}
                        sx={{ minWidth: { xs: 100, sm: 120 }, justifyContent: "center" }}
                      />
                    </Stack>
                  </Stack>
                ))}

                {recentJobs.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                    No recent jobs available.
                  </Typography>
                )}
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} lg={6} sx={{ display: "flex" }}>
            <Card
              sx={{
                height: "100%",
                p: { xs: 2.25, sm: 3 },
                width: "100%",
                minHeight: 240,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                AI Screening Summary
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                Snapshot of screening performance and recommendation output.
              </Typography>

              <Stack spacing={1.5} divider={<Divider flexItem />}>
                {aiSummaryItems.map((item) => (
                  <Stack
                    key={item.label}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ py: 0.5 }}
                  >
                    <Typography color="text.secondary">{item.label}</Typography>
                    <Typography sx={{ fontWeight: 800 }}>{item.value}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} lg={6} sx={{ display: "flex" }}>
            <Card
              sx={{
                height: "100%",
                p: { xs: 2.25, sm: 3 },
                width: "100%",
                minHeight: 240,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Quick Actions
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                Jump directly to high-impact recruitment workflows.
              </Typography>

              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={6}>
                  <Button fullWidth variant="contained" onClick={() => navigate("/candidates")}>View Candidates</Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button fullWidth variant="outlined" onClick={() => navigate("/jobs")}>Manage Jobs</Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button fullWidth variant="outlined" onClick={() => navigate("/applications")}>Open Applications</Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button fullWidth variant="outlined" onClick={() => navigate("/ai-screening")}>Run Screening</Button>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </>
      )}
    </Grid>
  );
}