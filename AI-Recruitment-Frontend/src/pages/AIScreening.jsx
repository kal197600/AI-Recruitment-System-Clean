import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import {
  AutoAwesome,
  Badge,
  CheckCircle,
  Psychology,
  School,
  Build,
  Timeline,
  WorkHistory,
  WarningAmber,
  Cancel,
} from "@mui/icons-material";
import { useLocation } from "react-router-dom";

import PageHeader from "../components/common/PageHeader";
import { getApplications } from "../services/applicationService";
import { runScreening } from "../services/screeningService";

const scoreColor = (score) => {
  if (score >= 80) return "success";
  if (score >= 60) return "info";
  if (score >= 40) return "warning";
  return "error";
};

const recommendationColor = (recommendation = "") => {
  const value = recommendation.toLowerCase();

  if (value.includes("hire")) return "success";
  if (value.includes("interview")) return "info";
  if (value.includes("review")) return "warning";
  return "error";
};

const formatDate = (value) => {
  if (!value) return "-";

  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
};

const InfoCard = ({ title, value, icon }) => (
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Stack direction="row" spacing={2} alignItems="center">
        {icon}
        <Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h6">{value || "-"}</Typography>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

const TextCard = ({ title, text, icon }) => (
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Stack direction="row" spacing={1} alignItems="center" mb={2}>
        {icon}
        <Typography variant="h6">{title}</Typography>
      </Stack>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ whiteSpace: "pre-wrap" }}
      >
        {text || "-"}
      </Typography>
    </CardContent>
  </Card>
);

export default function AIScreening() {
  const location = useLocation();

  const applicationIdFromState = location.state?.applicationId ?? "";
  const autoLoad = Boolean(location.state?.autoLoad);

  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(
    applicationIdFromState || ""
  );

  const [result, setResult] = useState(null);

  const [loadingApplications, setLoadingApplications] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadApplications = async () => {
      try {
        setLoadingApplications(true);

        const response = await getApplications();

        // Supports:
        // []
        // { data: [...] }
        // { applications: [...] }
        // axios style { data: { data: [...] } } if ever returned
        let list = [];

        if (Array.isArray(response)) {
          list = response;
        } else if (Array.isArray(response?.data)) {
          list = response.data;
        } else if (Array.isArray(response?.applications)) {
          list = response.applications;
        } else if (Array.isArray(response?.data?.data)) {
          list = response.data.data;
        } else if (Array.isArray(response?.data?.applications)) {
          list = response.data.applications;
        }

        if (!mounted) return;

        setApplications(list);
      } catch (err) {
        if (!mounted) return;

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load applications."
        );
      } finally {
        if (mounted) setLoadingApplications(false);
      }
    };

    loadApplications();

    return () => {
      mounted = false;
    };
  }, []);

  const handleRun = useCallback(async () => {
    if (!selectedApplication) {
      setError("Please select an application.");
      return;
    }

    try {
      setError("");
      setRunning(true);

      const response = await runScreening(selectedApplication);

      setResult(response?.data?.data ?? response?.data ?? response ?? null);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "AI screening failed."
      );
    } finally {
      setRunning(false);
    }
  }, [selectedApplication]);

  useEffect(() => {
    if (
      autoLoad &&
      applicationIdFromState &&
      !loadingApplications &&
      applications.length > 0
    ) {
      setSelectedApplication(applicationIdFromState);
    }
  }, [
    autoLoad,
    applicationIdFromState,
    loadingApplications,
    applications.length,
  ]);

  useEffect(() => {
    if (
      autoLoad &&
      applicationIdFromState &&
      selectedApplication === applicationIdFromState &&
      !loadingApplications
    ) {
      handleRun();
    }
  }, [
    autoLoad,
    applicationIdFromState,
    selectedApplication,
    loadingApplications,
    handleRun,
  ]);

  const selected = useMemo(() => {
    return (
      applications.find(
        (a) =>
          String(a.id) === String(selectedApplication) ||
          String(a.application_id) === String(selectedApplication)
      ) || null
    );
  }, [applications, selectedApplication]);

  const candidateName =
    selected?.candidate_name ||
    selected?.candidate?.full_name ||
    selected?.candidate?.name ||
    "-";

  const jobTitle =
    selected?.job_title ||
    selected?.job?.title ||
    "-";

  return (
    <Container maxWidth={false} disableGutters sx={{ width: "100%" }}>
      <Stack spacing={3}>
        <PageHeader
          title="AI Screening"
          subtitle="AI-powered candidate screening and evaluation"
          actions={
            <Button
              variant="contained"
              startIcon={<AutoAwesome />}
              onClick={handleRun}
              disabled={
                running ||
                loadingApplications ||
                !selectedApplication
              }
            >
              Run AI Screening
            </Button>
          }
        />

        <Paper sx={{ p: 3 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", md: "center" }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems="center"
            >
              <FormControl sx={{ width: "100%", maxWidth: 420 }}>
                <InputLabel>Application</InputLabel>

                <Select
                  label="Application"
                  value={selectedApplication}
                  onChange={(e) => setSelectedApplication(e.target.value)}
                  disabled={loadingApplications || running}
                >
                  {applications.map((app) => {
                    const id = app.id ?? app.application_id;

                    const name =
                      app.candidate_name ||
                      app.candidate?.full_name ||
                      "Candidate";

                    const title =
                      app.job_title ||
                      app.job?.title ||
                      "Unknown Position";

                    return (
                      <MenuItem key={id} value={id}>
                        {name} — {title}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

            </Stack>
          </Stack>

          {(loadingApplications || running) && (
            <Box mt={3}>
              <LinearProgress />
            </Box>
          )}
        </Paper>

        {error && <Alert severity="error">{error}</Alert>}

        {running && (
          <Box textAlign="center" py={6}>
            <CircularProgress size={60} />
            <Typography mt={2}>Running AI screening...</Typography>
          </Box>
        )}

        {result && !running && (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <InfoCard
                title="Candidate Name"
                value={candidateName}
                icon={<Badge color="primary" />}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <InfoCard
                title="Job Title"
                value={jobTitle}
                icon={<WorkHistory color="primary" />}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography color="text.secondary">
                    Overall Score
                  </Typography>

                  <Typography
                    variant="h2"
                    fontWeight={700}
                    color={`${scoreColor(
                      Number(result.overall_score || 0)
                    )}.main`}
                  >
                    {result.overall_score ?? "-"}
                  </Typography>

                  <LinearProgress
                    sx={{ mt: 2 }}
                    variant="determinate"
                    value={Math.max(
                      0,
                      Math.min(100, Number(result.overall_score || 0))
                    )}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography color="text.secondary">
                    Recommendation
                  </Typography>

                  <Chip
                    sx={{ mt: 2 }}
                    color={recommendationColor(result.recommendation)}
                    label={result.recommendation || "-"}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography color="text.secondary">
                    AI Model
                  </Typography>

                  <Typography variant="h5" mt={2}>
                    {result.ai_model || "-"}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="body2" color="text.secondary">
                    Screening Date
                  </Typography>

                  <Typography>
                    {formatDate(result.created_at)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <InfoCard
                title="Technical Score"
                value={result.technical_score}
                icon={<Build color="primary" />}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <InfoCard
                title="Experience Score"
                value={result.experience_score}
                icon={<Timeline color="primary" />}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <InfoCard
                title="Education Score"
                value={result.education_score}
                icon={<School color="primary" />}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <InfoCard
                title="Skills Score"
                value={result.skills_score}
                icon={<Psychology color="primary" />}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextCard
                title="Strengths"
                text={result.strengths}
                icon={<CheckCircle color="success" />}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextCard
                title="Weaknesses"
                text={result.weaknesses}
                icon={<WarningAmber color="warning" />}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextCard
                title="Missing Skills"
                text={result.missing_skills}
                icon={<Cancel color="error" />}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextCard
                title="AI Reasoning"
                text={result.reasoning}
                icon={<AutoAwesome color="primary" />}
              />
            </Grid>
          </Grid>
        )}
      </Stack>
    </Container>
  );
}