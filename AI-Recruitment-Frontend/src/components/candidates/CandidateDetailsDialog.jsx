import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

const SECTION_KEYS = [
  "personal",
  "contact",
  "resume",
  "screening",
  "skills",
  "experience",
  "education",
  "matches",
];

function toArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    const text = value.trim();
    if (!text) return [];

    if (text.startsWith("[") && text.endsWith("]")) {
      try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return text
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }

    return text
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function asNumber(value) {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return null;
  return Math.max(0, Math.min(100, parsed));
}

function display(value) {
  if (value === null || value === undefined || value === "") return "-";
  return value;
}

function statusColor(value) {
  const score = asNumber(value);

  if (score === null) return "inherit";
  if (score >= 80) return "success.main";
  if (score >= 60) return "info.main";
  if (score >= 40) return "warning.main";
  return "error.main";
}

function ScoreProgress({ label, value }) {
  const score = asNumber(value);

  return (
    <Stack spacing={0.75}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 700, color: statusColor(score) }}>
          {score == null ? "-" : `${score}%`}
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={score ?? 0}
        color={
          score == null
            ? "inherit"
            : score >= 80
            ? "success"
            : score >= 60
            ? "info"
            : score >= 40
            ? "warning"
            : "error"
        }
        sx={{ height: 8, borderRadius: 999 }}
      />
    </Stack>
  );
}

function SectionCard({ title, children }) {
  return (
    <Box
      sx={{
        p: 2.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

export default function CandidateDetailsDialog({
  open,
  candidate,
  initialSection = "personal",
  onClose,
}) {
  const [activeSection, setActiveSection] = useState(initialSection);

  useEffect(() => {
    if (open) {
      setActiveSection(initialSection);
    }
  }, [open, initialSection]);

  const skills = useMemo(() => {
    const raw = candidate?.skills;
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((item) => (typeof item === "string" ? item : item?.name || item?.skill || "")).filter(Boolean);
    }
    return toArray(candidate?.required_skills || candidate?.skillset);
  }, [candidate]);

  const experiences = useMemo(() => {
    const raw = candidate?.experiences;
    if (Array.isArray(raw) && raw.length > 0) {
      return raw;
    }

    if (candidate?.current_position || candidate?.current_company || candidate?.years_experience != null) {
      return [
        {
          title: candidate?.current_position || "Current Position",
          company: candidate?.current_company || "-",
          years: candidate?.years_experience ?? "-",
        },
      ];
    }

    return [];
  }, [candidate]);

  const educations = useMemo(() => {
    const raw = candidate?.educations || candidate?.education;
    if (Array.isArray(raw)) return raw;
    if (typeof raw === "string" && raw.trim()) return [raw.trim()];
    return [];
  }, [candidate]);

  const matches = useMemo(() => {
    const raw = candidate?.job_matches || candidate?.matches;
    if (Array.isArray(raw)) return raw;
    return [];
  }, [candidate]);

  const resumeUrl =
    candidate?.resume_url ||
    candidate?.cv_url ||
    candidate?.file_url ||
    candidate?.filepath ||
    null;

  const screeningData = {
    overall: candidate?.overall_score,
    technical: candidate?.technical_score,
    experience: candidate?.experience_score,
    education: candidate?.education_score,
    skills: candidate?.skills_score,
    recommendation: candidate?.recommendation,
    status: candidate?.screening_status,
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      scroll="paper"
      PaperProps={{ sx: { borderRadius: 4 } }}
    >
      <DialogTitle>
        <Stack spacing={0.5}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Candidate Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {display(candidate?.full_name)}
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Tabs
          value={SECTION_KEYS.indexOf(activeSection)}
          onChange={(_, index) => setActiveSection(SECTION_KEYS[index])}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 2.5 }}
        >
          <Tab label="Personal" />
          <Tab label="Contact" />
          <Tab label="Resume" />
          <Tab label="AI Screening" />
          <Tab label="Skills" />
          <Tab label="Experience" />
          <Tab label="Education" />
          <Tab label="Job Matches" />
        </Tabs>

        <Stack spacing={2}>
          {activeSection === "personal" && (
            <SectionCard title="Personal Information">
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="caption" color="text.secondary">Full Name</Typography>
                  <Typography sx={{ fontWeight: 600 }}>{display(candidate?.full_name)}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="caption" color="text.secondary">Current Position</Typography>
                  <Typography sx={{ fontWeight: 600 }}>{display(candidate?.current_position)}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="caption" color="text.secondary">Current Company</Typography>
                  <Typography sx={{ fontWeight: 600 }}>{display(candidate?.current_company)}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="caption" color="text.secondary">Years of Experience</Typography>
                  <Typography sx={{ fontWeight: 600 }}>{display(candidate?.years_experience)}</Typography>
                </Grid>
              </Grid>
            </SectionCard>
          )}

          {activeSection === "contact" && (
            <SectionCard title="Contact Information">
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography sx={{ fontWeight: 600 }}>{display(candidate?.email)}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="caption" color="text.secondary">Phone</Typography>
                  <Typography sx={{ fontWeight: 600 }}>{display(candidate?.phone)}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="caption" color="text.secondary">Location</Typography>
                  <Typography sx={{ fontWeight: 600 }}>{display(candidate?.location)}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="caption" color="text.secondary">LinkedIn</Typography>
                  <Typography sx={{ fontWeight: 600 }}>{display(candidate?.linkedin)}</Typography>
                </Grid>
              </Grid>
            </SectionCard>
          )}

          {activeSection === "resume" && (
            <SectionCard title="Resume Information">
              <Stack spacing={2}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="caption" color="text.secondary">Resume Source</Typography>
                    <Typography sx={{ fontWeight: 600 }}>{display(candidate?.source)}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="caption" color="text.secondary">Resume URL / File Path</Typography>
                    <Typography sx={{ fontWeight: 600, wordBreak: "break-all" }}>{display(resumeUrl)}</Typography>
                  </Grid>
                </Grid>

                <Divider />

                <Box>
                  <Typography variant="caption" color="text.secondary">Original Summary</Typography>
                  <Typography sx={{ whiteSpace: "pre-wrap", mt: 0.5 }}>{display(candidate?.original_summary)}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">AI Summary</Typography>
                  <Typography sx={{ whiteSpace: "pre-wrap", mt: 0.5 }}>{display(candidate?.ai_summary)}</Typography>
                </Box>

                {!resumeUrl && (
                  <Alert severity="info">No resume preview URL is available for this candidate yet.</Alert>
                )}
              </Stack>
            </SectionCard>
          )}

          {activeSection === "screening" && (
            <SectionCard title="AI Screening">
              <Stack spacing={2}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="caption" color="text.secondary">Screening Status</Typography>
                    <Typography sx={{ fontWeight: 700 }}>{display(screeningData.status)}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="caption" color="text.secondary">Recommendation</Typography>
                    <Typography sx={{ fontWeight: 700 }}>{display(screeningData.recommendation)}</Typography>
                  </Grid>
                </Grid>

                <Divider />

                <ScoreProgress label="Overall Score" value={screeningData.overall} />
                <ScoreProgress label="Technical Score" value={screeningData.technical} />
                <ScoreProgress label="Experience Score" value={screeningData.experience} />
                <ScoreProgress label="Education Score" value={screeningData.education} />
                <ScoreProgress label="Skills Score" value={screeningData.skills} />
              </Stack>
            </SectionCard>
          )}

          {activeSection === "skills" && (
            <SectionCard title="Skills">
              {skills.length > 0 ? (
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {skills.map((skill, index) => (
                    <Chip key={`${skill}-${index}`} label={skill} color="primary" variant="outlined" />
                  ))}
                </Stack>
              ) : (
                <Typography color="text.secondary">No skills available.</Typography>
              )}
            </SectionCard>
          )}

          {activeSection === "experience" && (
            <SectionCard title="Experience">
              {experiences.length > 0 ? (
                <Stack spacing={1.25}>
                  {experiences.map((item, index) => (
                    <Box
                      key={`exp-${index}`}
                      sx={{
                        p: 1.5,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                      }}
                    >
                      <Typography sx={{ fontWeight: 700 }}>
                        {display(item?.title || item?.position || item?.role || item)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {display(item?.company)}
                      </Typography>
                      {item?.years != null && (
                        <Typography variant="body2" color="text.secondary">
                          {display(item.years)} Years
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography color="text.secondary">No experience history available.</Typography>
              )}
            </SectionCard>
          )}

          {activeSection === "education" && (
            <SectionCard title="Education">
              {educations.length > 0 ? (
                <Stack spacing={1.25}>
                  {educations.map((item, index) => (
                    <Box
                      key={`edu-${index}`}
                      sx={{
                        p: 1.5,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                      }}
                    >
                      <Typography sx={{ fontWeight: 700 }}>
                        {display(item?.degree || item?.title || item)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {display(item?.institution || item?.school || "-")}
                      </Typography>
                      {item?.year && (
                        <Typography variant="body2" color="text.secondary">
                          {display(item.year)}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography color="text.secondary">No education records available.</Typography>
              )}
            </SectionCard>
          )}

          {activeSection === "matches" && (
            <SectionCard title="Job Matches">
              {matches.length > 0 ? (
                <Stack spacing={1.25}>
                  {matches.map((match, index) => {
                    const score = asNumber(match?.overall_score);
                    return (
                      <Box
                        key={`match-${match?.job_id ?? index}`}
                        sx={{
                          p: 1.5,
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 2,
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                          <Typography sx={{ fontWeight: 700 }}>
                            {display(match?.job_title || match?.title || `Job #${match?.job_id ?? "-"}`)}
                          </Typography>
                          <Chip label={score == null ? "-" : `${score}%`} size="small" color={score != null && score >= 75 ? "success" : "default"} />
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          Recommendation: {display(match?.recommendation)}
                        </Typography>
                      </Box>
                    );
                  })}
                </Stack>
              ) : (
                <Typography color="text.secondary">No job matching results available.</Typography>
              )}
            </SectionCard>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">Close</Button>
      </DialogActions>
    </Dialog>
  );
}
