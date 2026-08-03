import { useMemo } from "react";
import {
  Box,
  Avatar,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import PeopleIcon from "@mui/icons-material/People";
import PsychologyIcon from "@mui/icons-material/Psychology";
import VerifiedIcon from "@mui/icons-material/Verified";
import DescriptionIcon from "@mui/icons-material/Description";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";

function getScreeningScore(row) {
  return (
    row.screening?.score ||
    row.latest_screening?.score ||
    row.screening_result?.score ||
    null
  );
}

function renderScoreChip(score) {
  if (score == null) {
    return (
      <Chip
        label="Not Screened"
        variant="outlined"
        size="small"
        sx={{
          fontWeight: 700,
          letterSpacing: "0.01em",
          color: "text.secondary",
          borderColor: "#CBD5E1",
          backgroundColor: "#F8FAFC",
        }}
      />
    );
  }

  if (score >= 90) {
    return (
      <Chip
        label="Highly Recommended"
        variant="outlined"
        size="small"
        sx={{
          fontWeight: 700,
          letterSpacing: "0.01em",
          borderColor: "#16A34A",
          color: "#166534",
          backgroundColor: "#DCFCE7",
        }}
      />
    );
  }

  if (score >= 80) {
    return (
      <Chip
        label="Recommended"
        variant="outlined"
        size="small"
        sx={{
          fontWeight: 700,
          letterSpacing: "0.01em",
          borderColor: "#2563EB",
          color: "#1D4ED8",
          backgroundColor: "#DBEAFE",
        }}
      />
    );
  }

  if (score >= 60) {
    return (
      <Chip
        label="Consider"
        variant="outlined"
        size="small"
        sx={{
          fontWeight: 700,
          letterSpacing: "0.01em",
          borderColor: "#F59E0B",
          color: "#92400E",
          backgroundColor: "#FEF3C7",
        }}
      />
    );
  }

  return (
    <Chip
      label="Reject"
      variant="outlined"
      size="small"
      sx={{
        fontWeight: 700,
        letterSpacing: "0.01em",
        borderColor: "#DC2626",
        color: "#B91C1C",
        backgroundColor: "#FEE2E2",
      }}
    />
  );
}

function getSourceChip(source) {
  const label = source || "Unknown";
  const mapping = {
    Manual: { bg: "#EFF6FF", text: "#1D4ED8" },
    Email: { bg: "#ECFDF5", text: "#166534" },
    LinkedIn: { bg: "#EFF6FF", text: "#2563EB" },
    Import: { bg: "#FFFBEB", text: "#B45309" },
    Referral: { bg: "#F5F3FF", text: "#7C3AED" },
    Unknown: { bg: "#F8FAFC", text: "#475569" },
  };
  const token = mapping[label] || mapping.Unknown;

  return (
    <Chip
      label={label}
      size="small"
      variant="outlined"
      sx={{
        borderColor: token.bg,
        color: token.text,
        backgroundColor: token.bg,
        fontWeight: 600,
      }}
    />
  );
}

function CustomToolbar() {
  return (
    <GridToolbarContainer
      sx={{
        gap: 1.25,
        flexWrap: "wrap",
        justifyContent: "space-between",
        py: 2.25,
        px: { xs: 2, sm: 3 },
        bgcolor: "#F8FAFC",
        borderBottom: "1px solid #E2E8F0",
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 220 }}>
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: "#E0E7FF",
            color: "#3730A3",
          }}
        >
          <PeopleIcon sx={{ fontSize: 20 }} />
        </Avatar>
        <Box>
          <Typography sx={{ fontSize: 13, color: "text.secondary", lineHeight: 1.1 }}>
            Candidate Directory
          </Typography>
          <Typography sx={{ fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>
            Search, filter, and export
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ display: "flex", flex: 1, minWidth: 240, maxWidth: 480 }}>
        <GridToolbarQuickFilter
          quickFilterParser={(input) => input.split(",").map((value) => value.trim())}
          placeholder="Search candidates..."
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            borderRadius: 999,
            px: 1.25,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
          }}
        />
      </Box>

      <Stack direction="row" spacing={1}>
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </Stack>
    </GridToolbarContainer>
  );
}

function EmptyStateOverlay() {
  return (
    <Box sx={{ py: 10, textAlign: "center", color: "text.secondary" }}>
      <Box
        sx={{
          width: 94,
          height: 94,
          borderRadius: 4,
          mx: "auto",
          mb: 3,
          display: "grid",
          placeItems: "center",
          backgroundColor: "#EEF2FF",
        }}
      >
        <DescriptionIcon sx={{ fontSize: 38, color: "#2563EB" }} />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        No candidates found
      </Typography>
      <Typography sx={{ maxWidth: 380, mx: "auto", color: "text.secondary" }}>
        Candidates will appear here once they are added.
      </Typography>
    </Box>
  );
}

export default function CandidateTable({ rows, onView, onEdit, onUpload, onDelete }) {
  const columns = useMemo(
    () => [
      {
        field: "candidate",
        headerName: "Candidate",
        flex: 1.8,
        minWidth: 260,
        sortable: false,
        renderCell: ({ row }) => {
          const initials = row.full_name
            ? row.full_name
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")
            : "NA";

          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 44,
                  height: 44,
                  fontWeight: 700,
                  boxShadow: "0 8px 18px rgba(37, 99, 235, 0.2)",
                }}
              >
                {initials}
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 700, letterSpacing: "0.01em" }}>{row.full_name || "—"}</Typography>
                <Typography sx={{ color: "text.secondary", fontSize: 13 }}>{row.email || "—"}</Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        field: "current_position",
        headerName: "Current Position",
        flex: 1.3,
        minWidth: 180,
        renderCell: ({ value }) => (
          <Typography sx={{ fontWeight: 600, color: value ? "text.primary" : "text.secondary" }}>
            {value || "—"}
          </Typography>
        ),
      },
      {
        field: "experience",
        headerName: "Experience",
        width: 140,
        renderCell: ({ value }) => {
          const years = Number(value ?? 0);
          return (
            <Chip
              size="small"
              variant="outlined"
              label={String(years) + " Years"}
              sx={{
                borderColor: "#DBEAFE",
                color: "#1D4ED8",
                backgroundColor: "#EFF6FF",
                fontWeight: 700,
                minWidth: 92,
              }}
            />
          );
        },
      },
      {
        field: "source",
        headerName: "Source",
        width: 140,
        renderCell: ({ row }) => getSourceChip(row.source),
      },
      {
        field: "screening",
        headerName: "AI Screening",
        flex: 1,
        minWidth: 180,
        sortable: false,
        renderCell: ({ row }) => renderScoreChip(getScreeningScore(row)),
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 200,
        sortable: false,
        renderCell: ({ row }) => (
          <Stack direction="row" spacing={1}>
            <Tooltip title="View">
              <IconButton
                size="small"
                onClick={() => onView(row)}
                sx={{
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": { bgcolor: "primary.light", color: "primary.main" },
                }}
              >
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={() => onEdit(row)}
                sx={{
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": { bgcolor: "primary.light", color: "primary.main" },
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Upload CV">
              <IconButton
                size="small"
                onClick={() => onUpload(row)}
                sx={{
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": { bgcolor: "primary.light", color: "primary.main" },
                }}
              >
                <UploadFileIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={() => onDelete(row)}
                sx={{
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": { bgcolor: "error.light", color: "error.main" },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [onDelete, onEdit, onUpload, onView]
  );

  return (
    <Box
      sx={{
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 18px 45px rgba(15, 23, 42, 0.06)",
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      <DataGrid
        rows={rows}
        getRowId={(row) => row.id ?? row.candidate_id ?? row.email ?? row.full_name}
        columns={columns}
        autoHeight
        rowHeight={72}
        headerHeight={64}
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        slots={{
          toolbar: CustomToolbar,
          noRowsOverlay: EmptyStateOverlay,
        }}
        sx={{
          border: 0,
          "& .MuiDataGrid-main": { minHeight: 360 },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#F8FAFC",
            borderBottom: "1px solid #E2E8F0",
            position: "sticky",
            top: 0,
            zIndex: 1,
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 700,
            letterSpacing: "0.01em",
          },
          "& .MuiDataGrid-row": {
            transition: "background-color 0.2s ease, transform 0.2s ease",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#F8FAFC",
            transform: "translateY(-1px)",
          },
          "& .MuiDataGrid-row:nth-of-type(odd)": {
            backgroundColor: "#FFFFFF",
          },
          "& .MuiDataGrid-row:nth-of-type(even)": {
            backgroundColor: "#FCFCFD",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid #EEF2F7",
            py: 1.5,
            alignItems: "center",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "1px solid #E2E8F0",
            backgroundColor: "#FFFFFF",
          },
          "& .MuiDataGrid-toolbarContainer": {
            px: { xs: 2, sm: 3 },
            py: 1,
          },
        }}
      />
    </Box>
  );
}
