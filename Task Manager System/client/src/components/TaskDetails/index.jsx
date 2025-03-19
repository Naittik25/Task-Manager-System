import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./styles.module.css";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const location = useLocation(); // Use useLocation to access the query parameters
  const navigate = useNavigate();
  const [projects, setProject] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);  // Stores task being edited
  const [editValues, setEditValues] = useState({});  // Form state for edits

  // Extract query parameter `id` from URL
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('id');

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3001/api/task/${projectId}?user_id=${userId}`);
        setProject(data.data);
      } catch (error) {
        console.error("Error fetching tasks details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [projectId]);

    // Handle Delete Task
    const handleDeleteTask = async (taskId) => {
      try {
        await axios.delete(`http://localhost:3001/api/task/${taskId}`); // Call API
        setProject(projects.filter((project) => project._id !== taskId)); // Remove from state
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }

    const handleEditTask = (task) => {
      setEditingTask(task._id);
    
      // Ensure estimate_hour and task_log_hour have default values before splitting
      const estimateHour = task.estimate_hour || "0 hour : 0 minute";
      const taskLogHour = task.task_log_hour || "0 hour : 0 minute";
    
      setEditValues({
        name: task.name || "",
        description: task.description || "",
        status: task.status || "",
        priority: task.priority || "",
        task_type: task.task_type || "",
        start_date: task.start_date || "",
        end_date: task.end_date || "",
        due_date: task.due_date || "",
        estimate_hour: estimateHour.split(" : ")[0].split(" ")[0], // Extract hours
        estimate_minute: estimateHour.split(" : ")[1].split(" ")[0], // Extract minutes
        task_log_hour: taskLogHour.split(" : ")[0].split(" ")[0], // Extract hours
        task_log_minute: taskLogHour.split(" : ")[1].split(" ")[0], // Extract minutes
      });
    };
    

  // Handle Edit Form Input Changes
  const handleEditChange = (e) => {

    setEditValues({ ...editValues, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async (taskId) => {
    try {
      const formattedEditValues = {
        ...editValues,
        id: taskId,
        project_id: projectId,
        estimate_hour: `${editValues.estimate_hour} hour : ${editValues.estimate_minute} minute`,
        task_log_hour: `${editValues.task_log_hour} hour : ${editValues.task_log_minute} minute`,
      };
      delete formattedEditValues.estimate_minute;
      delete formattedEditValues.task_log_minute;
  
      await axios.put(`http://localhost:3001/api/task`, formattedEditValues);
  
      setProject(projects.map((task) => (task._id === taskId ? { ...task, ...formattedEditValues } : task))); // Update UI
      setEditingTask(null); // Close edit form
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };


    const handleBackToHome = () => {
      navigate("/dashboard"); // Navigate to the home page
    };

return (
    <div className={styles.project_details_container}>
      <button className={styles.back_button} onClick={() => navigate("/dashboard")}>
        ← Back to Projects
      </button>

      {loading ? (
        <p>Loading task details...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          <div className={styles.taskSection}>
            <h2 className={styles.taskTitle}>Tasks</h2>
            {projects?.length === 0 ? (
              <p>No tasks available.</p>
            ) : (
              <ul className={styles.taskList}>
                {projects?.map((task) => (
                  <li key={task._id} className={styles.taskItem}>
                    {editingTask === task._id ? (
                      // EDIT MODE
                      <div className={styles.editForm}>
                        <h3>Name:</h3>
                        <input type="text" name="name" value={editValues.name} onChange={handleEditChange} className={styles.inputField} />

                        <h3>Description:</h3>
                        <input type="text" name="description" value={editValues?.description} onChange={handleEditChange} className={styles.inputField} />

                        <h3>Start Date:</h3>
                        <input type="date" name="start_date" value={editValues?.start_date?.split("T")[0]} onChange={handleEditChange} className={styles.inputField} />

                        <h3>End Date:</h3>
                        <input type="date" name="end_date" value={editValues?.end_date?.split("T")[0]} onChange={handleEditChange} className={styles.inputField} />

                        <h3>Due Date:</h3>
                        <input type="date" name="due_date" value={editValues?.due_date?.split("T")[0]} onChange={handleEditChange} className={styles.inputField} />

                        <h3>Task Type:</h3>
                        <select name="task_type" value={editValues?.task_type} onChange={handleEditChange} className={styles.inputField}>
                          <option value="New Implementation">New Implementation</option>
                          <option value="Enhancement">Enhancement</option>
                          <option value="Bug">Bug</option>
                          <option value="Customization">Customization</option>
                          <option value="Optimization">Optimization</option>
                        </select>

                        <h3>Status:</h3>
                        <select name="status" value={editValues?.status} onChange={handleEditChange} className={styles.inputField}>
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Complete">Complete</option>
                          <option value="Hold">Hold</option>
                          <option value="In Testing">In Testing</option>
                          <option value="Ready For Deploy">Ready For Deploy</option>
                        </select>

                        <h3>Reporter:</h3>
                        <select name="reporter" value={editValues?.reporter} onChange={handleEditChange} className={styles.inputField} disabled>
                          {(task?.reporter) ? (
                            // projects.users.map((user) => (
                              <option key={task?.reporter._id} value={task?.reporter._id}>{task?.reporter?.name} ({task?.reporter?.profile_name})</option>
                            // ))
                          ) : (
                            <option value="">No Reporters Available</option> // Fallback if no data
                          )}
                        </select>

                        <h3>Assignee:</h3>
                        <select name="assignee" value={editValues?.assignee} onChange={handleEditChange} className={styles.inputField} disabled>
                          {(task?.assignee) ? (
                            // projects.users.map((user) => (
                              <option key={task?.assignee._id} value={task?.assignee._id}>{task?.assignee?.name} ({task?.assignee?.profile_name})</option>
                            // ))
                          ) : (
                            <option value="">No Assignees Available</option> // Fallback if no data
                          )}
                        </select>


                        <h3>Estimate Hours:</h3>
                        <select name="estimate_hour" value={editValues?.estimate_hour} onChange={handleEditChange} className={styles.timeInput}>
                          {[...Array(24).keys()].map((hour) => (<option key={hour} value={hour}>{hour}</option>))}
                        </select>
                        <select name="estimate_minute" value={editValues?.estimate_minute} onChange={handleEditChange} className={styles.timeInput}>
                          {[...Array(60).keys()].map((minute) => (<option key={minute} value={minute}>{minute}</option>))}
                        </select>

                        <h3>Task Log Hours:</h3>
                        <select name="task_log_hour" value={editValues?.task_log_hour} onChange={handleEditChange} className={styles.timeInput}>
                          {[...Array(24).keys()].map((hour) => (<option key={hour} value={hour}>{hour}</option>))}
                        </select>
                        <select name="task_log_minute" value={editValues?.task_log_minute} onChange={handleEditChange} className={styles.timeInput}>
                          {[...Array(60).keys()].map((minute) => (<option key={minute} value={minute}>{minute}</option>))}
                        </select>

                        <button onClick={() => handleSaveEdit(task._id)} className={styles.save_button}>Save</button>
                        <button onClick={() => setEditingTask(null)} className={styles.cancel_button}>Cancel</button>
                      </div>
                    ) : (
                      // VIEW MODE
                      <>
                        <h3>{task.name}</h3>
                        <p><strong>Description:</strong> {task.description || "None"}</p>
                      <p>
                        <strong>Status:</strong> {task.status}
                      </p>
                      <p>
                        <strong>Task Type:</strong> {task?.task_type ? task.task_type : "None"}
                      </p>
                      <p>
                        <strong>Priority:</strong> {task.priority}
                      </p>
                      <p>
                        <strong>Start Date:</strong> {task?.start_date?.split("T")[0] ? task?.start_date?.split("T")[0] : "None"}
                      </p>
                      <p>
                        <strong>End Date:</strong> {task?.end_date?.split("T")[0] ? task?.end_date?.split("T")[0] : "None"}
                      </p>
                      <p>
                        <strong>Due Date:</strong> {task?.due_date?.split("T")[0] ? task?.due_date?.split("T")[0] : "None"}
                      </p>
                      <p>
                        <strong>Estimate Hours:</strong> {task?.estimate_hour ? task?.estimate_hour : "None"}
                      </p>
                      <p>
                        <strong>Task Log Hours:</strong> {task?.task_log_hour ? task?.task_log_hour : "None"}
                      </p>
                      {
                        task?.permission?.edit_task && 
                        <button onClick={() => handleEditTask(task)} className={styles.edit_button}>Edit</button>
                      }
                      {
                        task?.permission?.delete_task &&
                        <button onClick={() => handleDeleteTask(task._id)} className={styles.delete_button}>Delete</button> 
                      }
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
