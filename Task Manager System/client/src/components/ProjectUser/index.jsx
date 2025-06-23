import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css"; // Import the CSS Module

const Profile = () => {
  const [profiles, setProfiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState(null);
  const [permission, setPermission] = useState(null);
  // const [isEditing, setIsEditing] = useState(false);
  // const [editId, setEditId] = useState(""); // Store the ID of the profile being edited
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [profileToDelete, setProfileToDelete] = useState(null); // State to store profile to delete
  const [showPermissionsMenu, setShowPermissionsMenu] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null); // Currently editing profile
  const [permissions, setPermissions] = useState({}); // Current permissions for the selected profile
  
  const navigate = useNavigate();
  
  // Fetch profiles when the component loads
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data } = await axios.get("https://task-backend-1-vgtf.onrender.com/api/profile");
        setProfiles(data.data);
      } catch (error) {
        console.error("Error fetching profiles. Please try again.");
      }
    };

    fetchProfiles();
  }, []);

  const handleCreateProfile = async () => {
    try {
      const newProfile = { name, description, permission };
      const { data } = await axios.post("https://task-backend-1-vgtf.onrender.com/api/profile", newProfile);
      console.log(data, "==data");

      localStorage.setItem("profileData", JSON.stringify(data.data));

      setProfiles([...profiles, data.data]);
      setName("");
      setDescription(null);
      setPermission(null);
    } catch (error) {
      console.error("Error creating profile. Please try again.");
    }
  };


  // const handleUpdateProfile = async () => {
  //   try {
  //     const updatedProfile = { name, description, permission, id: editId };
  //     console.log(updatedProfile);
  //     const { data } = await axios.put(`https://task-backend-1-vgtf.onrender.com/api/profile`, updatedProfile);
  //     console.log("list", data.data);

  //     const updatedProfiles = profiles.map((profile) =>
  //       profile._id === editId ? data.data : profile
  //     );
  //     setProfiles(updatedProfiles);

  //     setIsEditing(false);
  //     setName("");
  //     setDescription("");
  //     setPermission(null);
  //     setEditId(null); 
  //   } catch (error) {
  //     console.error("Error updating profile. Please try again.");
  //   }
  // };

  const handleEditProfile = (profile) => {
    // setIsEditing(true);
    // setName(profile.name);
    // setDescription(profile?.description || null);
    // setPermission(profile?.permission || null);
    // setEditId(profile._id);
    setSelectedProfile(profile);
    setPermissions(profile.permission || {});
    setShowPermissionsMenu(true);
  };

  const handlePermissionChange = (permissionKey) => {
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [permissionKey]: !prevPermissions[permissionKey],
    }));
  };

  const handleSavePermissions = async () => {
    if (!selectedProfile) return;
  
    try {
      // API call to save permissions
      const response = await axios.put(
        `https://task-backend-1-vgtf.onrender.com/api/profile/${selectedProfile._id}`,
        { permission: permissions } // Send updated permissions
      );
  
      if (response.data.success) {
        // Update the local profiles state
        setProfiles((prevProfiles) =>
          prevProfiles.map((profile) =>
            profile._id === selectedProfile._id ? response.data.data : profile
          )
        );
  
        // Close the permissions menu
        setShowPermissionsMenu(false);
        setSelectedProfile(null);
      }
    } catch (error) {
      console.error("Error saving permissions:", error.message);
    }
  };
  

  // Close the permissions menu
  const handleCancel = () => {
    setShowPermissionsMenu(false);
    setSelectedProfile(null);
  };


  const handleDeleteProfile = async (id) => {
    try {
      await axios.delete(`https://task-backend-1-vgtf.onrender.com/api/profile/${profileToDelete}`);
      setProfiles(profiles.filter((profile) => profile._id !== profileToDelete));
      closeModal();
    } catch (error) {
      console.error("Error deleting profile. Please try again.");
    }
  };

    const confirmDeleteProfile = (id) => {
        console.log(id)
        setProfileToDelete(id); 
        setShowModal(true); 
      };

  const closeModal = () => {
    setShowModal(false);
    setProfileToDelete(null);
  };

  const handleBackToHome = () => {
    navigate("/"); // Navigate to the home page
  };

  return (
    <div className={styles.login_container}>
      <h1>Profiles</h1>

      <button onClick={handleBackToHome} className={styles.back_button}>
       ✖
      </button>

      {/* {isEditing ? (
        <div>
          <h2>Edit Profile</h2>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Permission"
            value={permission}
            onChange={(e) => setPermission(e?.target?.value)}
            className={styles.input}
          />
          <button
            onClick={handleUpdateProfile}
            className={styles.button}
          >
            Update Profile
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setName("");
              setDescription("");
              setPermission({});
            }}
            className={styles.button}
          >
            Cancel
          </button>
        </div>
      ) : ( */}
        <div>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.input}
          />
          <button
            onClick={handleCreateProfile}
            className={styles.button}
          >
            Create Profile
          </button>
        </div>
      {/* )} */}

      <h2>Profile List</h2>
      <ul className={styles.profile_list}>
        {profiles.length === 0 ? (
          <p>No profiles found.</p>
        ) : (
          profiles.map((profile) => (
            <li key={profile._id} className={styles.profile_item}>
              <h3>{profile.name}</h3>
              <p>{profile.description}</p>
              {profile?.permission && (
                <div>
                  <h4>Permissions:</h4>
                  <ul>
                    {Object.entries(profile.permission).map(([key, value]) => (
                      <li key={key}>
                        {key.replace(/_/g, " ").toUpperCase()}: {value ? "Allowed" : "Denied"}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                onClick={() => handleEditProfile(profile)}
                className={styles.edit_button}
              >
                Edit Permissions
              </button>
              <button
                onClick={() => confirmDeleteProfile(profile._id)}
                className={styles.delete_button}
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>

      {showPermissionsMenu && selectedProfile && (
        <div className={styles.modal}>
          <div className={styles.modal_content}>
            <h2>Edit Permissions for {selectedProfile.name}</h2>
            <ul>
              {["create_task", "edit_task", "delete_task","view_task"].map(
                (permissionKey) => (
                  <li key={permissionKey}>
                    <label>
                      <input
                        type="checkbox"
                        checked={permissions[permissionKey] || false}
                        onChange={() => handlePermissionChange(permissionKey)}
                      />
                      {permissionKey.replace(/_/g, " ").toUpperCase()}
                    </label>
                  </li>
                )
              )}
            </ul>
            <button onClick={handleSavePermissions} className={styles.save_button}>
              Save
            </button>
            <button onClick={handleCancel} className={styles.cancel_button}>
              Cancel
            </button>
          </div>
        </div>
      )}

       {showModal && (
        <div className={styles.modal}>
          <div className={styles.modal_content}>
            <h2>Are you sure you want to delete this profile?</h2>
            <button onClick={handleDeleteProfile} className={styles.button}>
              Yes, Delete
            </button>
            <button onClick={closeModal} className={styles.button}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
