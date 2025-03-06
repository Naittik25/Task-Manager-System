import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./styles.module.css"; // Import the CSS Module

const Task = () => {
  const { projectId } = useParams();
  const [profiles, setTasks] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState(null);
  const [status, setStatus] = useState("Pending");
  const [reporter, setReporter] = useState(null);
  const [assignee, setAssignee] = useState(null);
  const [priority, setPriority] = useState("");
  const [start_date, setstartDate] = useState(null);
  const [end_date, setEndDate] = useState(null);
  const [due_date, setDueDate] = useState(null);
  const [due_hour, setDueHour] = useState(null);
  const [due_minute, setDueMinute] = useState(null);
  const [users, setUsers] = useState([]); // All users
  const [error, setError] = useState(null);
  

  const navigate = useNavigate();

  const handleCreateProfile = async () => {
    try {
      const newTask = { project_id: projectId, name, description, priority, status, start_date, end_date, due_date }; // Include status in the new task
      const { data } = await axios.post("http://localhost:3001/api/task", newTask);
      console.log(data, "==data");

      localStorage.setItem("taskData", JSON.stringify(data.data));

      setTasks([...profiles, data.data]);
      setName("");
      setDescription(null);
      setStatus("Pending"); // Reset status after creating task
      setPriority("");
      setDueDate(null);
      setEndDate(null);
      setstartDate(null);

      navigate("/dashboard");

    } catch (error) {
      console.error("Error creating task. Please try again.");
    }
  };

  useEffect(() => {

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/api/project_user");
      setUsers(data.data); // All available users
    } catch (err) {
      setError("Failed to fetch users");
    }
  };

  fetchUsers();
}, []);


  const handleBackToHome = () => {
    navigate("/dashboard"); // Navigate to the home page
  };

  return (
    <div className={styles.login_container}>
      <h1>Create New Task</h1>

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
      
      <h3>Estimate Hours:
      {/* Due Time Picker */}
        <select
          value={due_hour}
          onChange={(e) => setDueHour(e.target.value)}
          className={styles.timeInput}
        >
          {/* Hour options */}
          {[...Array(24).keys()].map((hour) => (
            <option key={hour} value={hour}>
              {hour < 10 ? `0${hour}` : hour}
            </option>
          ))}
        </select>
        <span>Hours</span>
        <select
          value={due_minute}
          onChange={(e) => setDueMinute(e.target.value)}
          className={styles.timeInput}
        >
          {/* Minute options */}
          {[...Array(60).keys()].map((minute) => (
            <option key={minute} value={minute}>
              {minute < 10 ? `0${minute}` : minute}
            </option>
          ))}
        </select>
        <span>Minutes</span>
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
          <option value="Complete">Complete</option>
          <option value="Hold">Hold</option>
        </select>
        </h3>

        {/* Dropdown for Status */}
        <h3> Reporter:
        <select
          value={reporter}
          onChange={(e) => setReporter(e.target.value)}
          className={styles.input}
          required
        >
          {/* Use fetched users to populate the dropdown */}
          {users.map((user) => (
            <option key={user._id} value={user._id}>{user?.user_id?.fullName} ({user?.profile_id?.name})</option>
          ))}
        </select>
        </h3>

        {/* Dropdown for Status */}
        <h3> Assignee:
        <select
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          className={styles.input}
          required
        >
          {/* Use fetched users to populate the dropdown */}
          {users.map((user) => (
            <option key={user._id} value={user._id}>{user?.user_id?.fullName} ({user?.profile_id?.name})</option>
          ))}
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
          Create Task
        </button>
      </div>
    </div>
  );
};

export default Task;
