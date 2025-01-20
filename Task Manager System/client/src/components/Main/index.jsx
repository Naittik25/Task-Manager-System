import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { FaFlag } from 'react-icons/fa';
// import { Tooltip, TooltipProvider } from 'react-tooltip'; // Correct imports

const Main = () => {
  const navigate = useNavigate();

  // Custom function to decode JWT
  const decodeToken = (token) => {
    try {
      const base64Payload = token.split(".")[1];
      const payload = atob(base64Payload); // Decode the payload
      return JSON.parse(payload); // Parse the JSON
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  // Decode the token to check if the user is an admin
  const token = localStorage.getItem("token");
  let isAdmin = false;

  if (token) {
    const decodedToken = decodeToken(token);
    isAdmin = decodedToken?.isAdmin || false; // Extract isAdmin from the decoded token
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  // State for storing projects
  // const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects from the API
  // const fetchProjectList = async () => {
  //   try {
  //     const { data } = await axios.get("http://localhost:3001/api/project");
  //     setProjects(data.data);
  //     setLoading(false); // Stop the loading state once data is fetched
  //   } catch (error) {
  //     console.error("Error fetching projects. Please try again.");
  //     setLoading(false); // Stop loading even on error
  //   }
  // };

  // Call fetchProjectList when the component mounts
  // useEffect(() => {
  //   fetchProjectList();
  // }, []);

  // Handle adding a new project
  const handleProject = () => {
    navigate("/project"); // Navigate to the page where users can add a project
  };

  return (
    // Wrap your component with TooltipProvider
//     <TooltipProvider>
      <div className={styles.main_container}>
        <nav className={styles.navbar}>
          <h1>Welcome To Task Manager System</h1>
          {/* Show the Profile button only if the user is an admin */}
          {isAdmin && (
            <button className={styles.white_profile_btn} onClick={handleProfile}>
              Profile
            </button>
          )}
          <button className={styles.white_btn} onClick={handleLogout}>
            Logout
          </button>
        </nav>

         {/* Project List Container */}
         <div className={styles.project_list_container}>
           <h2>Project List
             <button className={styles.white_project_btn} onClick={handleProject}>
               +
             </button>
           </h2>


            {/* {loading ? (
             <p>Loading projects...</p>
           ) : (
             <ul className={styles.project_list}>
               {projects.map((project) => (
                 <li key={project.id} className={styles.project_item}>
                   <div className={styles.project_name}>{project.name}</div>
                   <br />
                   <div className={styles.start_date}>{(project.start_date).split("T")[0]}</div>
                   <br />
                   <div className={styles.project_description}>({project.description?.toLowerCase()})</div>
                   <div className={styles.project_status}>{project.status}</div> 
                   <div className={styles.project_priority}>
                     {project.priority === 'High' && (
                       <FaFlag style={{ color: 'red' }} data-tooltip="High priority" />
                     )}
                     {project.priority === 'Low' && (
                       <FaFlag style={{ color: '#E1AD01' }} data-tooltip="Low priority" />
                     )}
                     {project.priority === 'Medium' && (
                       <FaFlag style={{ color: 'green' }} data-tooltip="Medium priority" />
                     )}
                   </div>
                 </li>
               ))}
             </ul>
           )} */}
         </div>
       </div>
//     </TooltipProvider> // Closing TooltipProvider
  );
};

export default Main;
