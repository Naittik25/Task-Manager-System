import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./styles.module.css";
import { FaTasks, FaStopCircle } from "react-icons/fa";
import { FcList, FcAlarmClock, FcOvertime, FcApproval } from "react-icons/fc";

const ProjectDetails = () => {
  const { projectId } = useParams();
  // const [userId, setUserId ] = useParams();
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

    // const permission = project?.users?.find(e=>e._id === userId);

  return (
    <div className={styles.dashboard_container}>
      <div className={styles.dashboard_header}>
      <button className={styles.back_button} onClick={() => navigate("/dashboard")}>← Back to Projects</button>
      <button className={styles.add_button} onClick={() => navigate(`/project/${project._id}/task`)}>Create Task </button>
      <button className={styles.task_button} onClick={() => navigate(`/project/${project._id}/tasks`)}>Task Details</button>
      </div>
            {/* Dashboard Cards */}
            <div className={styles.dashboard_cards}>
        {[
          { label: "Total Tasks", value: 10, icon: <FcList/> },
          { label: "Completed Tasks", value: 2, icon: <FcApproval/> },
          { label: "Pending Tasks", value: 3, icon: <FaTasks/> },
          { label: "In Progress Tasks", value: 1, icon: <FcAlarmClock/> },
          { label: "On Hold Tasks", value: 2, icon: <FaStopCircle/> },
          { label: "Overdue Tasks", value: 2, icon: <FcOvertime/> },
        ].map((item, index) => (
          <div key={index} className={styles.dashboard_card}>
            <div className={styles.icon}>{item.icon}</div>
            <p className={styles.card_value}>{item.value}</p>
            <p className={styles.card_label}>{item.label}</p>
          </div>
        ))}
      </div>
      {/* Progress Bar */}
      {/* {1 && (  // Only show progress bar on Completed Tasks
        <div className={styles.progress_bar_container}>
          <div className={styles.progress_bar} style={{ width: `50%` }}></div>
        </div>
      )} */}
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
            {/* <h2>Project User Role</h2> */}
              {project?.users?.map((user) => (
                <p><strong>{user?.profile_name}:</strong>  {user?.name}</p>
              ))}
          </div>
        </div>
        </>
      )}
    </div>
  );
};

export default ProjectDetails;
