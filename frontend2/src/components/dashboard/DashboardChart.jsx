import {
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function DashboardChart({
  monthlyApplications,
}) {
  const labels =
    monthlyApplications?.map((x) => x.month) ?? [];

  const values =
    monthlyApplications?.map((x) => x.count) ?? [];

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: "#2563EB",
        borderRadius: 8,
        maxBarThickness: 45,
      },
    ],
  };

  const options = {
    responsive: true,

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        backgroundColor: "#0F172A",
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },
      },

      y: {
        beginAtZero: true,

        grid: {
          color: "#E2E8F0",
        },

        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <Card elevation={0}>
      <CardContent>

        <Box mb={3}>

          <Typography
            variant="h6"
            fontWeight={700}
          >
            Applications Analytics
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Monthly recruitment activity
          </Typography>

        </Box>

        <Bar
          data={data}
          options={options}
        />

      </CardContent>
    </Card>
  );
}