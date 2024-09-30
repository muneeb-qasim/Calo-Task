import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";

const CreateJob = ({ fetchJobs = () => {}, setError = () => {} }) => {
  const [loading, setLoading] = useState(false);

  const createJob = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post("/jobs");
      fetchJobs();
    } catch (err) {
      setError("Failed to create job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={createJob}
      disabled={loading}
    >
      {loading ? <CircularProgress size={24} /> : "Create New Job"}
    </Button>
  );
};

export default CreateJob;
