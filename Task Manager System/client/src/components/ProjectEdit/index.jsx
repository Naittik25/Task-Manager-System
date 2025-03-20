import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import styles from "./styles.module.css";

const EditProject = () => {
  const { projectId } = useParams(); // Getting the project ID from the URL
  const navigate = useNavigate();
  
  // State for the project data
  const [project, setProject] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "",
    priority: "",
    users: [], // Users already in the project
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]); // All users
  const [selectedUser, setSelectedUser] = useState(""); // Store selected user ID
  const [showUserModal, setShowUserModal] = useState(false); // To control modal visibility
  const [selectedRole, setSelectedRole] = useState("");
  const [roles, setRoles] = useState([]); // Store fetched roles
  
  // Fetch project data and the users list
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/project/${projectId}`);
        setProject(response.data.data); // Populate the project with its current details
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch project data");
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("http://localhost:3001/api/users");
        setUsers(data.data); // All available users
      } catch (err) {
        setError("Failed to fetch users");
      }
    };

    const fetchRoles = async () => {
      try {
        const { data } = await axios.get("http://localhost:3001/api/profile"); // Fetch roles from API
        setRoles(data.data);
      } catch (err) {
        setError("Failed to fetch roles");
      }
    };

    fetchProject();
    fetchUsers();
    fetchRoles();
  }, [projectId]);

  // Handle form submission to update the project
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const updatedProject = { ...project };
      updatedProject.id = project._id;
  
      // Do NOT delete end_date
      delete updatedProject._id;
      delete updatedProject.__v;
      delete updatedProject.users;
      delete updatedProject.tasks;
      console.log(updatedProject, "updatedProjectgyhjbj")
      const response = await axios.put("http://localhost:3001/api/project", updatedProject);
      
      if (response.status === 200) {
        navigate('/dashboard'); // Refresh page after update
      }
    } catch (err) {
      setError("Failed to update project");
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    navigate("/dashboard"); // Navigate back to the main page
  };

  // Handle adding selected user to the project
  const handleAddUser = async (event) => {
    event.preventDefault();
    if (!selectedUser || !selectedRole) {
      setError("Please select a user and role.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/api/project_user", {
        project_id: projectId,
        user_id: selectedUser,
        profile_id: selectedRole,
      });
      if (response.status === 201) {
        setShowUserModal(false); // Close the modal after adding the user
        setSelectedUser(""); // Reset the selected user
        setSelectedRole("");
        // Re-fetch the project to update the list of users
        const updatedProjectResponse = await axios.get(`http://localhost:3001/api/project/${projectId}`);
        setProject(updatedProjectResponse.data.data);
      }
    } catch (err) {
      setError("Failed to add user to project.");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await axios.delete(`http://localhost:3001/api/project_user/${userId}`);
  
      if (response.status == 200) {
        setProject({
          ...project,
          users: project.users.filter((user) => user._id !== userId),
        });
      }                           
    } catch (err) { 
      setError("Failed to remove user from project.");
    }
  };

  const availableUsers = users.filter((user) => {
    if (project?.users) return !project.users.some((projectUser) => projectUser.user_id === user._id); 
    return user;
  });
  

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
            onChange={(e) => setProject({ ...project, name: e.target.value })}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea
            name="description"
            value={project.description}
            onChange={(e) => setProject({ ...project, description: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Start Date</label>
          <input
            type="date"
            name="start_date"
            value={project.start_date ? project.start_date.split("T")[0] : ""}
            onChange={(e) => setProject({ ...project, start_date: e.target.value })}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>End Date</label>
          <input
            type="date"
            name="end_date"
            value={project.end_date ? project.end_date.split("T")[0] : ""}
            onChange={(e) => setProject({ ...project, end_date: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Status</label>
          <select
            name="status"
            value={project.status}
            onChange={(e) => setProject({ ...project, status: e.target.value })}
            required
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Hold">Hold</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Priority</label>
          <select
            name="priority"
            value={project.priority}
            onChange={(e) => setProject({ ...project, priority: e.target.value })}
            required
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Users</label>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => setShowUserModal(true)} // Open the modal
          >
            Add User
          </button>
          <ul className={styles.userList}>
            {project.users &&
              project.users.map((user) => (
                <li key={user.user_id} className={styles.userItem}>
                  <span className={styles.userName}>{user.name}</span>
                  <span className={styles.userRole}>{user.profile_name}</span>
                  <button
                    className={styles.deleteBtn}
                    type="button"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
          </ul>
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

      {/* Modal for selecting user */}
      {showUserModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Select User and Role</h3>
            <select name="user" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
              <option value="">Select a user</option>
              {availableUsers.map((user) => (
                <option key={user._id} value={user._id}>{user.fullName}</option>
              ))}
            </select>
            <select name="role" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>{role.name}</option>
              ))}
            </select>
            <button type="button" onClick={handleAddUser}>Add User</button>
            <button type="button" onClick={() => setShowUserModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProject;
