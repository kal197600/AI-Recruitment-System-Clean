import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Candidates from "../pages/Candidates";
import Jobs from "../pages/Jobs";
import Applications from "../pages/Applications";
import EmailImport from "../pages/EmailImport";
import AIScreening from "../pages/AIScreening";

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/email-import" element={<EmailImport />} />
            <Route path="/ai-screening" element={<AIScreening />} />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}