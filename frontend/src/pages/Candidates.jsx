import { useEffect, useMemo, useState } from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Paper,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";

import { DataGrid } from "@mui/x-data-grid";

import api from "../api/api";

export default function Candidates() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const loadCandidates = async () => {
        try {
            setLoading(true);

            const response = await api.get("/candidates");

            setRows(response.data);
        } catch (err) {
            console.error(err);
            setError("Unable to load candidates.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCandidates();
    }, []);

    const filteredRows = useMemo(() => {
        const keyword = search.toLowerCase();

        return rows.filter((candidate) => {
            return (
                (candidate.full_name || "")
                    .toLowerCase()
                    .includes(keyword) ||

                (candidate.email || "")
                    .toLowerCase()
                    .includes(keyword) ||

                (candidate.current_position || "")
                    .toLowerCase()
                    .includes(keyword)
            );
        });
    }, [rows, search]);

    const columns = [
        {
            field: "full_name",
            headerName: "Name",
            flex: 1.5,
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1.6,
        },
        {
            field: "phone",
            headerName: "Phone",
            flex: 1,
        },
        {
            field: "current_position",
            headerName: "Position",
            flex: 1.5,
        },
        {
            field: "years_experience",
            headerName: "Experience",
            type: "number",
            width: 130,
        },
    ];

    return (
        <Box>

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Typography variant="h4">
                    Candidates
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<RefreshIcon />}
                    onClick={loadCandidates}
                >
                    Refresh
                </Button>
            </Stack>

            <TextField
                fullWidth
                label="Search Candidate"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mb: 2 }}
            />

            <Paper sx={{ height: 600 }}>

                {loading ? (

                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="100%"
                    >
                        <CircularProgress />
                    </Box>

                ) : (

                    <DataGrid
                        rows={filteredRows}
                        columns={columns}
                        pageSizeOptions={[10, 25, 50]}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 10,
                                },
                            },
                        }}
                        disableRowSelectionOnClick
                    />

                )}

            </Paper>

            <Snackbar
                open={error !== ""}
                autoHideDuration={4000}
                onClose={() => setError("")}
            >
                <Alert
                    severity="error"
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>
            </Snackbar>

        </Box>
    );
}