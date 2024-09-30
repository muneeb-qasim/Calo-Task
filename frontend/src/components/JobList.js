import React, { useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Typography,
} from "@mui/material";
import axios from "axios";
import useWebSocket from "react-use-websocket";

const socketUrl = "ws://localhost:5000";

const JobList = ({ jobs = [], setJobs = () => {}, setError = () => {} }) => {
  const { lastMessage } = useWebSocket(socketUrl, {
    onOpen: () => console.log("WebSocket connection opened"),
    onClose: () => console.log("WebSocket connection closed"),
    shouldReconnect: (closeEvent) => true,
    onError: (event) => setError("WebSocket error."),
  });

  const fetchJobById = async (jobId) => {
    try {
      const response = await axios.get(`/jobs/${jobId}`);
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === jobId ? { ...job, ...response.data } : job
        )
      );
    } catch (err) {
      setError("Failed to update job.");
    }
  };

  useEffect(() => {
    if (lastMessage !== null) {
      console.log("🚀 ~ useEffect ~ lastMessage:", lastMessage);
      const data = JSON.parse(lastMessage.data);
      const jobId = data.jobId;
      fetchJobById(jobId);
    }
  }, [lastMessage]);

  return (
    <>
      <Typography variant="h6" component="h2" gutterBottom>
        Job List
      </Typography>
      <List>
        {jobs.map((job) => (
          <ListItem key={job.id} divider>
            <ListItemText
              primary={`Job ID: ${job.id}`}
              secondary={
                job.status === "resolved" ? (
                  <a
                    href={job.result}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Image
                  </a>
                ) : job.status === "failed" ? (
                  "Failed to fetch image."
                ) : (
                  <>
                    <CircularProgress size={14} /> {job.status}
                  </>
                )
              }
            />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default JobList;
