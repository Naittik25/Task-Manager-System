//src/pages/EditProject.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./styles.module.css";

const EditProject = () => {
  const { projectId } = useParams(); // Getting the project ID from the URL
  const navigate = useNavigate();
  
  // State for the project data
  const [project, setProject] = useState({
    name: "",
    description: "",
    start_date: "",
    status: "",
    priority: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the project data when the page loads
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/project/${projectId}`);
        setProject(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch project data");
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  // Handle form submission to update the project
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        project.id = project._id;
        delete project._id;
        delete project.startDate;
        delete project.__v;
        const response = await axios.put(`http://localhost:3001/api/project`, project);
        if (response.status === 200) {
            navigate(`/`); // Navigate back to the main page after updating
        }
    } catch (err) {
      setError("Failed to update project");
    }
  };

  // Handle input field changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setProject({
      ...project,
      [name]: value,
    });
  };

  // Handle cancel button click
  const handleCancel = () => {
    navigate("/"); // Navigate back to the main page (or previous page)
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      <h2>Edit Project</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Project Name</label>
          <input
            type="text"
            name="name"
            value={project.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea
            name="description"
            value={project.description}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Start Date</label>
          <input
            type="date"
            name="start_date"
            value={project.start_date.split("T")[0]} // format to YYYY-MM-DD
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>End Date</label>
          <input
            type="date"
            name="end_date"
            value={project?.end_date?.split("T")[0]} // format to YYYY-MM-DD
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Due Date</label>
          <input
            type="date"
            name="due_date"
            value={project?.due_date?.split("T")[0]} // format to YYYY-MM-DD
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Status</label>
          <select
            name="status"
            value={project.status}
            onChange={handleChange}
            required
          >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Complete">Complete</option>
          <option value="Hold">Hold</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Priority</label>
          <select
            name="priority"
            value={project.priority}
            onChange={handleChange}
            required
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label></label>
          
        </div>

        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.submitBtn}>
            Save Changes
          </button>
          <button type="button" className={styles.cancelBtn} onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProject;
