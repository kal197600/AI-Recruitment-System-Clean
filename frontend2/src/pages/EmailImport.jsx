import { useState } from "react";
import { Alert, Box, Button, Card, CardContent, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import MarkEmailUnreadRoundedIcon from "@mui/icons-material/MarkEmailUnreadRounded";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import DocumentScannerRoundedIcon from "@mui/icons-material/DocumentScannerRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";

import PageHeader from "../components/common/PageHeader";
import emailImportService from "../services/emailImportService";

const steps = [
  { title: "Read inbox", text: "Find unread recruitment emails.", icon: <MarkEmailUnreadRoundedIcon /> },
  { title: "Download CVs", text: "Securely collect resume attachments.", icon: <AttachFileRoundedIcon /> },
  { title: "Extract content", text: "Convert resume files into searchable text.", icon: <DocumentScannerRoundedIcon /> },
  { title: "Parse with AI", text: "Identify skills, experience, and education.", icon: <PsychologyRoundedIcon /> },
  { title: "Update candidates", text: "Create or enrich candidate profiles.", icon: <PersonAddAltRoundedIcon /> },
  { title: "Save history", text: "Keep a record of every imported message.", icon: <HistoryRoundedIcon /> },
];

export default function EmailImport() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleImport() {
    try {
      setLoading(true);
      setSuccess("");
      setError("");
      const result = await emailImportService.importEmails();
      setSuccess(result.message || "Email import completed successfully.");
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || "Email import failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box>
      <PageHeader
        title="Email Import"
        subtitle="Turn incoming recruitment emails and CV attachments into structured candidate profiles."
        actions={
          <Button variant="contained" size="large" startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <DownloadRoundedIcon />} onClick={handleImport} disabled={loading}>
            {loading ? "Importing..." : "Import Emails"}
          </Button>
        }
      />

      <Card
        sx={{
          mb: 3,
          border: "1px solid",
          borderColor: "divider",
          background: "linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)",
          color: "#FFFFFF",
          overflow: "hidden",
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            width: 260,
            height: 260,
            borderRadius: "50%",
            right: -90,
            top: -130,
            background: "rgba(96, 165, 250, 0.18)",
          },
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, sm: 4 }, position: "relative", zIndex: 1 }}>
          <Typography variant="overline" sx={{ color: "#93C5FD" }}>Automated workflow</Typography>
          <Typography variant="h5" sx={{ color: "#FFFFFF", fontWeight: 800, mt: 0.5 }}>
            Import, parse, and organize candidates in one action
          </Typography>
          <Typography sx={{ color: "#CBD5E1", mt: 1, maxWidth: 680, lineHeight: 1.7 }}>
            The importer processes unread messages, extracts CV data, and keeps a traceable import history without interrupting your current pipeline.
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={{ xs: 1.5, sm: 2 }}>
        {steps.map((step, index) => (
          <Grid item xs={12} sm={6} lg={4} key={step.title} sx={{ display: "flex" }}>
            <Card sx={{ width: "100%", border: "1px solid", borderColor: "divider" }}>
              <CardContent sx={{ p: 2.25, display: "flex", gap: 1.75 }}>
                <Box sx={{ width: 42, height: 42, flexShrink: 0, display: "grid", placeItems: "center", borderRadius: 2.5, bgcolor: "#EFF6FF", color: "primary.main" }}>
                  {step.icon}
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 800 }}>{index + 1}. {step.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>{step.text}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Stack spacing={1.5} sx={{ mt: 3 }}>
        {success && <Alert severity="success">{success}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </Stack>
    </Box>
  );
}
