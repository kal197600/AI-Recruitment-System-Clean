import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";

import { getCandidates } from "../../services/candidateService";
import { getJobs } from "../../services/jobService";

const emptyApplication = {
  candidate_id: "",
  job_id: "",
  status: "Applied",
  source: "Manual",
  notes: "",
};

export default function ApplicationDialog({
  open,
  mode,
  application,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(emptyApplication);

  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    if (application) {
      setForm({
        ...emptyApplication,
        ...application,
      });
    } else {
      setForm(emptyApplication);
    }
  }, [application]);

  async function loadData() {
    console.log("========== loadData START ==========");

    try {
        const candidateData = await getCandidates();

        console.log("Candidates:");
        console.log(candidateData);
        console.log("Is Array:", Array.isArray(candidateData));

        const jobData = await getJobs();

        console.log("Jobs:");
        console.log(jobData);
        console.log("Is Array:", Array.isArray(jobData));

        setCandidates(candidateData);
        setJobs(jobData);

        console.log("Candidates Count:", candidateData?.length);
        console.log("Jobs Count:", jobData?.length);
    } catch (error) {
        console.error("LOAD ERROR");
        console.error(error);

        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        }
    }

    console.log("========== loadData END ==========");
}

  useEffect(() => {
    if (open) {
      console.log("Dialog opened");
      loadData();
    }
  }, [open]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit() {
    if (!form.candidate_id) {
      alert("Please select a candidate.");
      return;
    }

    if (!form.job_id) {
      alert("Please select a job.");
      return;
    }

    onSave(form);
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === "edit" ? "Edit Application" : "Add Application"}
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              fullWidth
              label="Candidate"
              name="candidate_id"
              value={form.candidate_id}
              onChange={handleChange}
            >
              {candidates.map((candidate) => (
                <MenuItem key={candidate.id} value={candidate.id}>
                  {candidate.full_name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              fullWidth
              label="Job"
              name="job_id"
              value={form.job_id}
              onChange={handleChange}
            >
              {jobs.map((job) => (
                <MenuItem key={job.id} value={job.id}>
                  {job.title}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              fullWidth
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <MenuItem value="Applied">Applied</MenuItem>
              <MenuItem value="Screening">Screening</MenuItem>
              <MenuItem value="Interview">Interview</MenuItem>
              <MenuItem value="Offer">Offer</MenuItem>
              <MenuItem value="Hired">Hired</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}