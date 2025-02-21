import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./styles.module.css";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState({});
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3001/api/project/${projectId}`);
        setProject(data.data);
        setTasks(data.tasks);
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

    // Log the project after it has been updated
    useEffect(() => {
      if (project) {
        console.log("Updated project state:", project);  // Log after the state is updated
      }
    }, [project]);

  return (
    <div className={styles.project_details_container}>
      <button className={styles.back_button} onClick={() => navigate("/dashboard")}>← Back to Projects</button>
      
      {loading ? (
        <p>Loading project details...</p>
      ) : (
        <>
          <h1>{project.name}</h1>
          <p><strong>Description:</strong> {project.description}</p>
          <p><strong>Status:</strong> {project.status}</p>
          <p><strong>Priority:</strong> {project.priority}</p>
          <p><strong>Start Date:</strong> {project.start_date.split("T")[0]}</p>
          <p><strong>End Date:</strong> {project.end_date.split("T")[0]}</p>
          <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Project User Role</h2>
            <p>
              {project?.users?.map((user) => (
                <p><strong>{user?.profile_name}:</strong>  {user?.name}</p>
              ))}
            </p>
          </div>
        </div>
        </>
      )}

<button className={styles.back_button} onClick={() => navigate(`/project/${project._id}/task`)}>Create Task </button>
    </div>
  );
};

export default ProjectDetails;
