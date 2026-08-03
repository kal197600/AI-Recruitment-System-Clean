import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const emptyCandidate = {
  full_name: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  current_position: "",
  current_company: "",
  years_experience: 0,
  original_summary: "",
  ai_summary: "",
  source: "Manual",
  ai_model: "",
};

function CandidateDialog({
  open,
  mode = "view",
  candidate,
  onClose,
  onSave,
}) {
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const [form, setForm] = useState(emptyCandidate);

  useEffect(() => {
    if (open) {
      setForm({
        ...emptyCandidate,
        ...(candidate || {}),
      });
    }
  }, [candidate, open]);

  const screening = useMemo(
    () =>
      candidate?.screening ||
      candidate?.latest_screening ||
      candidate?.screening_result ||
      null,
    [candidate]
  );

  const handleChange = (field) => (event) => {
    const value =
      field === "years_experience"
        ? Number(event.target.value)
        : event.target.value;

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(form);
    }
  };

  const renderArray = (value) => {
    if (!value) return [];

    if (Array.isArray(value)) return value;

    if (typeof value === "string") {
      return value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    }

    return [];
  };

  const getValue = (...keys) => {
    for (const key of keys) {
      if (
        screening &&
        screening[key] !== undefined &&
        screening[key] !== null &&
        screening[key] !== ""
      ) {
        return screening[key];
      }
    }
    return "-";
  };

  const scoreColor = (score) => {
    const value = Number(score);

    if (Number.isNaN(value)) return "default";
    if (value >= 85) return "success";
    if (value >= 70) return "primary";
    if (value >= 50) return "warning";
    return "error";
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: 4,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" fontWeight={700}>
          {isAdd
            ? "Add Candidate"
            : isEdit
            ? "Edit Candidate"
            : "Candidate Details"}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={4}>
          {/* Personal Information */}
          <Box>
            <Typography variant="h6" fontWeight={700} mb={2}>
              Personal Information
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  label="Full Name"
                  value={form.full_name}
                  onChange={handleChange("full_name")}
                  disabled={isView}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  label="Email"
                  value={form.email}
                  onChange={handleChange("email")}
                  disabled={isView}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  label="Phone"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  disabled={isView}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  label="Location"
                  value={form.location}
                  onChange={handleChange("location")}
                  disabled={isView}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  label="LinkedIn"
                  value={form.linkedin}
                  onChange={handleChange("linkedin")}
                  disabled={isView}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* Professional Information */}
          <Box>
            <Typography variant="h6" fontWeight={700} mb={2}>
              Professional Information
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  label="Current Position"
                  value={form.current_position}
                  onChange={handleChange("current_position")}
                  disabled={isView}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  label="Current Company"
                  value={form.current_company}
                  onChange={handleChange("current_company")}
                  disabled={isView}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  type="number"
                  size="small"
                  variant="outlined"
                  label="Years of Experience"
                  value={form.years_experience}
                  onChange={handleChange("years_experience")}
                  disabled={isView}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  label="Source"
                  value={form.source}
                  onChange={handleChange("source")}
                  disabled={isView}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  label="AI Model"
                  value={form.ai_model}
                  onChange={handleChange("ai_model")}
                  disabled={isView}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* Resume Summary */}
          <Box>
            <Typography variant="h6" fontWeight={700} mb={2}>
              Resume Summary
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  minRows={5}
                  size="small"
                  variant="outlined"
                  label="Original Summary"
                  value={form.original_summary}
                  onChange={handleChange("original_summary")}
                  disabled={isView}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  minRows={5}
                  size="small"
                  variant="outlined"
                  label="AI Summary"
                  value={form.ai_summary}
                  onChange={handleChange("ai_summary")}
                  disabled={isView}
                />
              </Grid>
            </Grid>
          </Box>

          {/* AI Screening */}
          <Divider />

          <Box>
            <Typography variant="h6" fontWeight={700} mb={2}>
              AI Screening Results
            </Typography>

            {screening ? (
              <Stack spacing={3}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Paper sx={{ p: 2, borderRadius: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        Overall Score
                      </Typography>
                      <Chip
                        color={scoreColor(
                          getValue("overall_score", "score")
                        )}
                        label={getValue("overall_score", "score")}
                        sx={{ mt: 1 }}
                      />
                    </Paper>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Paper sx={{ p: 2, borderRadius: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        Recommendation
                      </Typography>
                      <Typography mt={1} fontWeight={700}>
                        {getValue("recommendation")}
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Paper sx={{ p: 2, borderRadius: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        Technical Score
                      </Typography>
                      <Typography mt={1} fontWeight={700}>
                        {getValue("technical_score")}
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Paper sx={{ p: 2, borderRadius: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        Experience Score
                      </Typography>
                      <Typography mt={1} fontWeight={700}>
                        {getValue("experience_score")}
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Paper sx={{ p: 2, borderRadius: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        Education Score
                      </Typography>
                      <Typography mt={1} fontWeight={700}>
                        {getValue("education_score")}
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Paper sx={{ p: 2, borderRadius: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        Skills Score
                      </Typography>
                      <Typography mt={1} fontWeight={700}>
                        {getValue("skills_score")}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2, borderRadius: 3 }}>
                      <Typography variant="subtitle1" fontWeight={700} mb={2}>
                        Strengths
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={1}
                        useFlexGap
                        flexWrap="wrap"
                      >
                        {renderArray(
                          getValue("strengths")
                        ).length > 0 ? (
                          renderArray(getValue("strengths")).map((item) => (
                            <Chip
                              key={item}
                              label={item}
                              color="success"
                              variant="outlined"
                            />
                          ))
                        ) : (
                          <Typography color="text.secondary">
                            -
                          </Typography>
                        )}
                      </Stack>
                    </Paper>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2, borderRadius: 3 }}>
                      <Typography variant="subtitle1" fontWeight={700} mb={2}>
                        Weaknesses
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={1}
                        useFlexGap
                        flexWrap="wrap"
                      >
                        {renderArray(
                          getValue("weaknesses")
                        ).length > 0 ? (
                          renderArray(getValue("weaknesses")).map((item) => (
                            <Chip
                              key={item}
                              label={item}
                              color="warning"
                              variant="outlined"
                            />
                          ))
                        ) : (
                          <Typography color="text.secondary">
                            -
                          </Typography>
                        )}
                      </Stack>
                    </Paper>
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Paper sx={{ p: 2, borderRadius: 3 }}>
                      <Typography variant="subtitle1" fontWeight={700} mb={2}>
                        Missing Skills
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={1}
                        useFlexGap
                        flexWrap="wrap"
                      >
                        {renderArray(
                          getValue("missing_skills")
                        ).length > 0 ? (
                          renderArray(getValue("missing_skills")).map(
                            (item) => (
                              <Chip
                                key={item}
                                label={item}
                                color="error"
                                variant="outlined"
                              />
                            )
                          )
                        ) : (
                          <Typography color="text.secondary">
                            -
                          </Typography>
                        )}
                      </Stack>
                    </Paper>
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Paper sx={{ p: 2, borderRadius: 3 }}>
                      <Typography variant="subtitle1" fontWeight={700} mb={2}>
                        AI Reasoning
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{ whiteSpace: "pre-wrap" }}
                      >
                        {getValue("reasoning", "ai_reasoning")}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Stack>
            ) : (
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 3,
                  textAlign: "center",
                }}
              >
                <Typography color="text.secondary">
                  No AI screening results available.
                </Typography>
              </Paper>
            )}
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={onClose}
        >
          Close
        </Button>

        {!isView && (
          <Button
            variant="contained"
            size="large"
            onClick={handleSave}
          >
            Save
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default CandidateDialog;