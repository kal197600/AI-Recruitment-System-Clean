import { useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function Layout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
        backgroundImage:
          "radial-gradient(circle at 85% 0%, rgba(37, 99, 235, 0.09), transparent 30%), radial-gradient(circle at 15% 100%, rgba(124, 58, 237, 0.06), transparent 28%)",
      }}
    >
      <Sidebar
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          width: { xs: "100%", md: "calc(100% - 280px)" },
        }}
      >
        <TopBar onMenuClick={() => setMobileNavOpen(true)} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: "100%",
            minWidth: 0,
            px: { xs: 2, sm: 3, lg: 4 },
            py: { xs: 2.5, sm: 3, lg: 4 },
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 1680, mx: "auto" }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
