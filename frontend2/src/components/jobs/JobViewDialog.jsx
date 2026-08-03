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
  Stack,
  Typography,
} from "@mui/material";

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

function statusColor(status) {
  const normalized = (status || "Draft").toLowerCase();
  if (normalized === "open") return "success";
  if (normalized === "closed") return "default";
  if (normalized === "paused") return "info";
  return "warning";
}

function displayValue(value) {
  if (value === null || value === undefined || value === "") return "-";
  return value;
}

export default function JobViewDialog({
  open,
  job,
  onClose,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Job Details</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {displayValue(job?.title)}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap", rowGap: 1 }}>
              <Chip label={displayValue(job?.status ?? "Draft")} color={statusColor(job?.status)} size="small" variant="outlined" />
              <Chip label={displayValue(job?.employment_type)} size="small" variant="outlined" />
              <Chip label={displayValue(job?.department)} size="small" variant="outlined" />
            </Stack>
          </Box>

          <Divider />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                Department
              </Typography>
              <Typography variant="body1">{displayValue(job?.department)}</Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                Location
              </Typography>
              <Typography variant="body1">{displayValue(job?.location)}</Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                Employment Type
              </Typography>
              <Typography variant="body1">{displayValue(job?.employment_type)}</Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                Minimum Experience
              </Typography>
              <Typography variant="body1">{displayValue(job?.minimum_experience)} Years</Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                Description
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                {displayValue(job?.description)}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                Required Skills
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                {displayValue(job?.required_skills)}
              </Typography>
            </Grid>
          </Grid>

          <Divider />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                Created At
              </Typography>
              <Typography variant="body2">{formatDate(job?.created_at)}</Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                Updated At
              </Typography>
              <Typography variant="body2">{formatDate(job?.updated_at)}</Typography>
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
