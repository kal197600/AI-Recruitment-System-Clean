import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  CircularProgress,
  ClickAwayListener,
  Divider,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Popper,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

import { getCandidates } from "../../services/candidateService";
import { getJobs } from "../../services/jobService";
import { getApplications } from "../../services/applicationService";

const SEARCH_PLACEHOLDER = "Search candidates, jobs, applications...";

function normalizeText(value) {
  return String(value ?? "").toLowerCase();
}

export default function GlobalSearch({ onSelect }) {
  const anchorRef = useRef(null);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    let active = true;

    async function loadData() {
      if (!debouncedQuery) {
        if (!active) return;
        setCandidates([]);
        setJobs([]);
        setApplications([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const [candidateData, jobData, applicationData] = await Promise.all([
          getCandidates(),
          getJobs(),
          getApplications(),
        ]);

        if (!active) return;

        setCandidates(Array.isArray(candidateData) ? candidateData : []);
        setJobs(Array.isArray(jobData) ? jobData : []);
        setApplications(Array.isArray(applicationData) ? applicationData : []);
      } catch (error) {
        if (!active) return;
        setCandidates([]);
        setJobs([]);
        setApplications([]);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  const filteredCandidates = useMemo(() => {
    if (!debouncedQuery) return [];

    return candidates
      .filter((candidate) => {
        const haystack = [
          candidate.full_name,
          candidate.email,
          candidate.current_position,
          candidate.location,
        ]
          .map(normalizeText)
          .join(" ");

        return haystack.includes(normalizeText(debouncedQuery));
      })
      .slice(0, 8)
      .map((candidate) => ({
        type: "candidate",
        id: candidate.id,
        title: candidate.full_name || "Unnamed Candidate",
        subtitle: candidate.email || candidate.current_position || "",
        raw: candidate,
      }));
  }, [candidates, debouncedQuery]);

  const filteredJobs = useMemo(() => {
    if (!debouncedQuery) return [];

    return jobs
      .filter((job) => {
        const haystack = [
          job.title,
          job.department,
          job.location,
          job.status,
        ]
          .map(normalizeText)
          .join(" ");

        return haystack.includes(normalizeText(debouncedQuery));
      })
      .slice(0, 8)
      .map((job) => ({
        type: "job",
        id: job.id,
        title: job.title || "Untitled Job",
        subtitle: [job.department, job.location].filter(Boolean).join(" | "),
        raw: job,
      }));
  }, [jobs, debouncedQuery]);

  const filteredApplications = useMemo(() => {
    if (!debouncedQuery) return [];

    return applications
      .filter((application) => {
        const haystack = [
          application.candidate_name,
          application.job_title,
          application.status,
          application.source,
        ]
          .map(normalizeText)
          .join(" ");

        return haystack.includes(normalizeText(debouncedQuery));
      })
      .slice(0, 8)
      .map((application) => ({
        type: "application",
        id: application.id,
        title: `${application.candidate_name || "Unknown Candidate"} -> ${application.job_title || "Unknown Job"}`,
        subtitle: application.status || "",
        raw: application,
      }));
  }, [applications, debouncedQuery]);

  const hasResults =
    filteredCandidates.length > 0 ||
    filteredJobs.length > 0 ||
    filteredApplications.length > 0;

  const showPopper = open && !!query.trim();

  function handleSelect(result) {
    if (typeof onSelect === "function") {
      onSelect(result);
    }
    setOpen(false);
  }

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box ref={anchorRef} sx={{ position: "relative", width: "100%" }}>
        <TextField
          fullWidth
          placeholder={SEARCH_PLACEHOLDER}
          variant="outlined"
          size="small"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          sx={{
            width: "100%",
            maxWidth: "100%",
            borderRadius: 4,
            "& .MuiOutlinedInput-root": {
              borderRadius: 4,
              backgroundColor: "background.paper",
              "& fieldset": {
                borderColor: "#E2E8F0",
              },
              "&:hover fieldset": {
                borderColor: "#CBD5E1",
              },
              "&.Mui-focused fieldset": {
                borderColor: "primary.main",
                boxShadow: "0 0 0 4px rgba(59, 130, 246, 0.08)",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
        />

        <Popper
          open={showPopper}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          style={{ width: anchorRef.current?.clientWidth, zIndex: 1300 }}
        >
          <Paper
            elevation={6}
            sx={{
              mt: 1,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
            }}
          >
            {loading ? (
              <Box
                sx={{
                  py: 3,
                  px: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1.5,
                }}
              >
                <CircularProgress size={20} />
                <Typography variant="body2" color="text.secondary">
                  Searching...
                </Typography>
              </Box>
            ) : (
              <Box>
                <List dense disablePadding>
                  <Box
                    sx={{
                      px: 2,
                      py: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PersonOutlineIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Candidates
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
                      {filteredCandidates.length}
                    </Typography>
                  </Box>
                  {filteredCandidates.length > 0 ? (
                    filteredCandidates.map((item) => (
                      <ListItemButton
                        key={`candidate-${item.id}`}
                        onClick={() => handleSelect(item)}
                        sx={{
                          cursor: "pointer",
                          transition: "background-color 160ms ease, transform 160ms ease",
                          "&:hover": {
                            backgroundColor: "#F8FAFC",
                            transform: "translateX(2px)",
                          },
                        }}
                      >
                        <ListItemText
                          primary={item.title}
                          secondary={item.subtitle}
                          primaryTypographyProps={{ fontWeight: 700, fontSize: 14 }}
                          secondaryTypographyProps={{ color: "text.secondary", fontSize: 12.5 }}
                        />
                      </ListItemButton>
                    ))
                  ) : (
                    <Box sx={{ px: 2, pb: 1.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        No matching candidates
                      </Typography>
                    </Box>
                  )}

                  <Divider />

                  <Box
                    sx={{
                      px: 2,
                      py: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <WorkOutlineIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Jobs
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
                      {filteredJobs.length}
                    </Typography>
                  </Box>
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((item) => (
                      <ListItemButton
                        key={`job-${item.id}`}
                        onClick={() => handleSelect(item)}
                        sx={{
                          cursor: "pointer",
                          transition: "background-color 160ms ease, transform 160ms ease",
                          "&:hover": {
                            backgroundColor: "#F8FAFC",
                            transform: "translateX(2px)",
                          },
                        }}
                      >
                        <ListItemText
                          primary={item.title}
                          secondary={item.subtitle}
                          primaryTypographyProps={{ fontWeight: 700, fontSize: 14 }}
                          secondaryTypographyProps={{ color: "text.secondary", fontSize: 12.5 }}
                        />
                      </ListItemButton>
                    ))
                  ) : (
                    <Box sx={{ px: 2, pb: 1.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        No matching jobs
                      </Typography>
                    </Box>
                  )}

                  <Divider />

                  <Box
                    sx={{
                      px: 2,
                      py: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <DescriptionOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Applications
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
                      {filteredApplications.length}
                    </Typography>
                  </Box>
                  {filteredApplications.length > 0 ? (
                    filteredApplications.map((item) => (
                      <ListItemButton
                        key={`application-${item.id}`}
                        onClick={() => handleSelect(item)}
                        sx={{
                          cursor: "pointer",
                          transition: "background-color 160ms ease, transform 160ms ease",
                          "&:hover": {
                            backgroundColor: "#F8FAFC",
                            transform: "translateX(2px)",
                          },
                        }}
                      >
                        <ListItemText
                          primary={item.title}
                          secondary={item.subtitle}
                          primaryTypographyProps={{ fontWeight: 700, fontSize: 14 }}
                          secondaryTypographyProps={{ color: "text.secondary", fontSize: 12.5 }}
                        />
                      </ListItemButton>
                    ))
                  ) : (
                    <Box sx={{ px: 2, pb: 1.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        No matching applications
                      </Typography>
                    </Box>
                  )}
                </List>

                {!hasResults && (
                  <Box sx={{ px: 2, py: 1.5, borderTop: "1px solid", borderColor: "divider" }}>
                    <Typography variant="body2" color="text.secondary">
                      No results found
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}
