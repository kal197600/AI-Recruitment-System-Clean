import { Stack, TextField, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function JobToolbar({ search, setSearch, onAdd, onRefresh }) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1.5}
      justifyContent="space-between"
      alignItems={{ xs: "stretch", sm: "center" }}
      sx={{ mb: 2 }}
    >
      <TextField
        label="Search Jobs"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ width: { xs: "100%", sm: 350 }, maxWidth: "100%" }}
      />

      <Stack direction="row" spacing={1} sx={{ "& .MuiButton-root": { flex: { xs: 1, sm: "initial" } } }}>
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={onRefresh}>
          Refresh
        </Button>
        <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd}>
          Add Job
        </Button>
      </Stack>
    </Stack>
  );
}
