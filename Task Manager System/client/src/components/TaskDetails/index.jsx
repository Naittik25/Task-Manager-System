import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./styles.module.css";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [projects, setProject] = useState({});
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3001/api/task/${projectId}`);
        setProject(data.data);
        setTasks(data.tasks);
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [projectId]);

    // Log the project after it has been updated
    useEffect(() => {
      if (projects) {
        console.log("Updated project state:", projects);  // Log after the state is updated
      }
    }, [projects]);

  return (
    <div className={styles.project_details_container}>
      <button className={styles.back_button} onClick={() => navigate("/dashboard")}>← Back to Projects</button>
      
      {loading ? (
        <p>Loading project details...</p>
      ) :  ( 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {projects.map((project) => (
        <div key={project.id} className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-bold">{project.name}</h2>
          <p>
            <strong>Description:</strong> {project.description}
          </p>
          <p>
            <strong>Status:</strong> {project.status}
          </p>
          <p>
            <strong>Priority:</strong> {project.priority}
          </p>
          <p>
            <strong>Start Date:</strong> {project?.start_date?.split("T")[0]}
          </p>
          <p>
            <strong>End Date:</strong> {project?.end_date?.split("T")[0]}
          </p>

        </div>
      ))}
    </div>
  )

      }

    </div>
  );
};

export default ProjectDetails;
