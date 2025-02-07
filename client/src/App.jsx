import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/home";
import StaffPage from "./pages/staff";
import IncidentDetails from "./pages/details";

//https://www.npmjs.com/package/leaflet-drift-marker

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} exact />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/incident-details/:id" element={<IncidentDetails />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
