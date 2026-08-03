import { Stack, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function CandidateToolbar({ search, onSearchChange }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
      <TextField
        fullWidth
        placeholder="Search by name, email or position..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
        sx={{ maxWidth: { xs: "100%", sm: 450 } }}
      />
    </Stack>
  );
}
