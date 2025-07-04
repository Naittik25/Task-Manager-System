import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css"; // Import the CSS Module

const Project = () => {
  const [profiles, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState(null);
  const [status, setStatus] = useState("Pending");
  const [priority, setPriority] = useState("Low");
  const [start_date, setstartDate] = useState(null);
  const [end_date, setEndDate] = useState(null);
  const [due_date, setDueDate] = useState(null);

  const navigate = useNavigate();

  const handleCreateProfile = async () => {
    if (!start_date) {
      alert("Start date is required.");
      return;
    }
  
    if (end_date && new Date(end_date) < new Date(start_date)) {
      alert("End date cannot be before start date.");
      return;
    }
  
    if (due_date && new Date(due_date) < new Date(start_date)) {
      alert("Due date cannot be before start date.");
      return;
    }
    try {
      const newProject = { name, description, priority, status, start_date, end_date, due_date }; // Include status in the new project
      const { data } = await axios.post("https://task-backend-1-vgtf.onrender.com/api/project", newProject);
      console.log(data, "==data");

      localStorage.setItem("projectData", JSON.stringify(data.data));

      setProjects([...profiles, data.data]);
      setName("");
      setDescription(null);
      setStatus("Pending"); // Reset status after creating project
      setPriority("");
      setDueDate(null);
      setEndDate(null);
      setstartDate(null);

      navigate("/dashboard");

    } catch (error) {
      console.error("Error creating project. Please try again.");
    }
  };

  const handleBackToHome = () => {
    navigate("/dashboard"); // Navigate to the home page
  };

  return (
    <div className={styles.login_container}>
      <h1>Create New Project</h1>

      <button onClick={handleBackToHome} className={styles.back_button}>
        ✖
      </button>

      <div>
        <h3> Name:
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
          required
        />
        </h3>
        <h3> Description:  
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.input}
        />
        </h3>
        <h3> Start Date:    
        <input
          type="date"
          placeholder="Start Date"
          value={start_date}
          onChange={(e) => setstartDate(e.target.value)}
          className={styles.input}
          required
        />
        </h3>
        <h3> End Date:
        <input
          type="date"
          placeholder="End Date"
          value={end_date}
          onChange={(e) => setEndDate(e.target.value)}
          className={styles.input}
        />
        </h3>
        <h3> Due Date:
        <input
          type="date"
          placeholder="Due Date"
          value={due_date}
          onChange={(e) => setDueDate(e.target.value)}
          className={styles.input}
        />
        </h3>

        {/* Dropdown for Status */}
        <h3> Status:
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={styles.input}
          required
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Hold">Hold</option>
        </select>
        </h3>

        {/* Radio buttons for Priority */}
        <div className={styles.priorityContainer}>
          <h3> Priority:  </h3>
          <label className={priority === "Low" ? styles.lowChecked : styles.low}>
            <input
              type="radio"
              name="priority"
              value="Low"
              checked={priority === "Low"}
              onChange={(e) => setPriority(e.target.value)}
              className={styles.radio}
              required
            />
            Low
          </label>
          <label className={priority === "Medium" ? styles.mediumChecked : styles.medium}>
            <input
              type="radio"
              name="priority"
              value="Medium"
              checked={priority === "Medium"}
              onChange={(e) => setPriority(e.target.value)}
              className={styles.radio}
              required
            />
            Medium
          </label>
          <label className={priority === "High" ? styles.highChecked : styles.high}>
            <input
              type="radio"
              name="priority"
              value="High"
              checked={priority === "High"}
              onChange={(e) => setPriority(e.target.value)}
              className={styles.radio}
              required
            />
            High
          </label>
        </div>

        <button onClick={handleCreateProfile} className={styles.button}>
          Create Project
        </button>
      </div>
    </div>
  );
};

export default Project;
