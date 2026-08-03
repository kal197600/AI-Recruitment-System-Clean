import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  Grid,
  LinearProgress,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

function TabPanel({ children, value, index, ...other }) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`candidate-tabpanel-${index}`}
      aria-labelledby={`candidate-tab-${index}`}
      {...other}
      sx={{ width: "100%" }}
    >
      {value === index && <Box sx={{ mt: 2 }}>{children}</Box>}
    </Box>
  );
}

export default function CandidateDrawer({ open, onClose, candidate }) {
  const [tabIndex, setTabIndex] = useState(0);

  if (!candidate) {
    return null;
  }

  const {
    full_name,
    email,
    phone,
    years_experience,
    ai_summary,
    languages,
    education,
    strengths,
    missing_skills,
    recommendation,
    overall_score,
    technical_score,
    experience_score,
    education_score,
    skills_score,
    reasoning,
    resume_url,
    applied_at,
  } = candidate;

  const handleChange = (_, newIndex) => {
    setTabIndex(newIndex);
  };

  const tagColor = (value) => {
    if (!value) return "default";
    const normalized = value.toLowerCase();
    if (normalized.includes("highly")) return "success";
    if (normalized.includes("recommended")) return "primary";
    return "default";
  };

  const statusChip = (label) => (
    <Chip
      label={label}
      color={tagColor(label)}
      size="small"
      sx={{ textTransform: "capitalize" }}
    />
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 560 },
          borderRadius: 0,
          p: 0,
          overflow: "hidden",
        },
      }}
    >
      <Box sx={{ p: 3, pb: 0, bgcolor: "background.paper" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Candidate details
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Review application insights, AI matching, screening and resume.
            </Typography>
          </Box>

          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        </Box>

        <Tabs
          value={tabIndex}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mt: 3 }}
        >
          <Tab label="Profile" />
          <Tab label="AI Match" />
          <Tab label="AI Screening" />
          <Tab label="Resume" />
          <Tab label="Timeline" />
        </Tabs>
      </Box>

      <Box sx={{ px: 3, py: 2, overflowY: "auto", height: "100%" }}>
        <TabPanel value={tabIndex} index={0}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, mb: 3 }}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Avatar sx={{ width: 64, height: 64, bgcolor: "primary.main" }}>
                {full_name?.charAt(0) || "C"}
              </Avatar>

              <Box>
                <Typography variant="h6" fontWeight={700}>
                  {full_name || "Candidate Name"}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  {email || "no-email@example.com"}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  {phone || "No phone provided"}
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Experience
                </Typography>
                <Typography variant="body1">
                  {years_experience != null ? `${years_experience} years` : "—"}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Education
                </Typography>
                <Typography variant="body1">
                  {education || "Not available"}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Languages
                </Typography>
                <Typography variant="body1">
                  {languages || "Not listed"}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </TabPanel>

        <TabPanel value={tabIndex} index={1}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Overall Match
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
              {overall_score != null ? `${Math.round(overall_score)}%` : "—"}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={Math.min(Math.max(overall_score || 0, 0), 100)}
              sx={{ height: 10, borderRadius: 2 }}
            />

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: "grid", gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Strengths
                </Typography>
                <Typography variant="body2">
                  {strengths || "No strengths identified yet."}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Missing Skills
                </Typography>
                <Typography variant="body2">
                  {missing_skills || "No gap analysis available."}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Recommendation
                </Typography>
                {statusChip(recommendation || "Pending")}
              </Box>
            </Box>
          </Paper>
        </TabPanel>

        <TabPanel value={tabIndex} index={2}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Overall Score
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
              {overall_score != null ? `${Math.round(overall_score)}%` : "—"}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={Math.min(Math.max(overall_score || 0, 0), 100)}
              sx={{ height: 10, borderRadius: 2, mb: 3 }}
            />

            <Grid container spacing={2}>
              {[
                { label: "Technical", value: technical_score },
                { label: "Experience", value: experience_score },
                { label: "Education", value: education_score },
                { label: "Skills", value: skills_score },
              ].map((item) => (
                <Grid item xs={12} sm={6} key={item.label}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {item.label}
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {item.value != null ? `${Math.round(item.value)}%` : "—"}
                  </Typography>
                </Grid>
              ))}
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: "grid", gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Recommendation
                </Typography>
                {statusChip(recommendation || "Pending")}
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Reasoning
                </Typography>
                <Typography variant="body2">
                  {reasoning || "No reasoning details available."}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </TabPanel>

        <TabPanel value={tabIndex} index={3}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Resume Preview
            </Typography>
            <Box
              sx={{
                minHeight: 180,
                borderRadius: 2,
                bgcolor: "background.default",
                p: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                A clean preview of the candidate resume will appear here.
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="medium"
              sx={{ mt: 3 }}
              href={resume_url || "#"}
              disabled={!resume_url}
              target="_blank"
              rel="noreferrer"
            >
              Download Resume
            </Button>
          </Paper>
        </TabPanel>

        <TabPanel value={tabIndex} index={4}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Timeline
            </Typography>
            <Box sx={{ display: "grid", gap: 2 }}>
              <Box sx={{ p: 2, bgcolor: "background.default", borderRadius: 2 }}>
                <Typography variant="body2" fontWeight={700}>
                  Application received
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {applied_at ? new Date(applied_at).toLocaleDateString() : "Date pending"}
                </Typography>
              </Box>
              <Box sx={{ p: 2, bgcolor: "background.default", borderRadius: 2 }}>
                <Typography variant="body2" fontWeight={700}>
                  AI job match generated
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Review candidate fit and screening status.
                </Typography>
              </Box>
              <Box sx={{ p: 2, bgcolor: "background.default", borderRadius: 2 }}>
                <Typography variant="body2" fontWeight={700}>
                  Screening available
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  AI screening details are ready for review.
                </Typography>
              </Box>
            </Box>
          </Paper>
        </TabPanel>
      </Box>

      <Divider />

      <Box sx={{ p: 3, display: "flex", gap: 1.5, flexWrap: "wrap", bgcolor: "background.paper" }}>
        <Button variant="contained" color="primary" fullWidth>
          Move to Interview
        </Button>
        <Button variant="outlined" color="error" fullWidth>
          Reject
        </Button>
        <Button variant="contained" color="success" fullWidth>
          Hire
        </Button>
      </Box>
    </Drawer>
  );
}