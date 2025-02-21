import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./styles.module.css";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3001/api/project/${projectId}`);
        setProject(data.project);
        setTasks(data.tasks);
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  return (
    <div className={styles.project_details_container}>
      <button className={styles.back_button} onClick={() => navigate("/")}>← Back to Projects</button>
      
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

          <h2>Tasks</h2>
          {tasks.length === 0 ? <p>No tasks assigned yet.</p> : (
            <ul className={styles.task_list}>
              {tasks.map((task) => (
                <li key={task._id} className={styles.task_item}>
                  <h3>{task.name}</h3>
                  <p><strong>Assigned To:</strong> {task.assigned_member}</p>
                  <p><strong>Estimated Completion Time:</strong> {task.estimated_time} hours</p>
                  <p><strong>Status:</strong> {task.status}</p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectDetails;
