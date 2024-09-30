import React, { useEffect, useState, useCallback } from "react";
import { Container, Typography, Box, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import JobList from "./components/JobList";
import CreateJob from "./components/CreateJob";
import "./App.css";

function App() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);

  const fetchJobs = useCallback(async () => {
    try {
      const response = await axios.get("/jobs");
      setJobs(response.data);
    } catch (err) {
      setError("Failed to fetch jobs.");
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <>
      <Container maxWidth="md">
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Job Dashboard
          </Typography>
          <div className="create-job-container">
            <CreateJob fetchJobs={fetchJobs} setError={setError} />
          </div>
          <JobList jobs={jobs} setJobs={setJobs} setError={setError} />
        </Box>
      </Container>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}

export default App;
