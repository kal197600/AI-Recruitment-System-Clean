import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import HubRoundedIcon from "@mui/icons-material/HubRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";

export default function ViewAllMenu() {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const go = (route) => {
    handleClose();
    navigate(route);
  };

  return (
    <>
      <Button
        variant="outlined"
        endIcon={<KeyboardArrowDownRoundedIcon />}
        onClick={handleOpen}
      >
        View All
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => go("/")}>
          <ListItemIcon>
            <DashboardRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Dashboard</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={() => go("/candidates")}>
          <ListItemIcon>
            <PeopleRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Candidates</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => go("/jobs")}>
          <ListItemIcon>
            <WorkRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Jobs</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => go("/applications")}>
          <ListItemIcon>
            <AssignmentRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Applications</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => go("/ai-screening")}>
          <ListItemIcon>
            <SmartToyRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>AI Screening</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => go("/job-matching")}>
          <ListItemIcon>
            <HubRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Job Matching</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => go("/resume-parser")}>
          <ListItemIcon>
            <DescriptionRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Resume Parser</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => go("/email-import")}>
          <ListItemIcon>
            <EmailRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Email Import</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}