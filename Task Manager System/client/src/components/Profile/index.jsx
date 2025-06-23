import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css"; // Import the CSS Module

const Profile = () => {
  const [profiles, setProfiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState(null);
  const [showPermissionsMenu, setShowPermissionsMenu] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const navigate = useNavigate();

  // Fetch profiles
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
      const newProfile = { name };
      if (permissions) newProfile.permission = permissions;
      if (description) newProfile.description = description;
      const { data } = await axios.post("https://task-backend-1-vgtf.onrender.com/api/profile", newProfile);
      console.log(data, "==data");
      localStorage.setItem("profileData", JSON.stringify(data.data));
      setProfiles([...profiles, data.data]);
      setName("");
      setDescription(null);
      setPermissions({});
    } catch (error) {
      console.error("Error creating profile. Please try again.");
    }
  };

  const handleEditProfile = (profile) => {
    setSelectedProfile(profile);
    setPermissions(profile.permission || {});
    setShowPermissionsMenu(true);
  };

  const handleSavePermissions = async () => {
    if (!selectedProfile) return;

    try {
      const updatedProfile = {
        ...selectedProfile,
        permission: permissions
      };
      const response = await axios.put(
        `https://task-backend-1-vgtf.onrender.com/api/profile/${selectedProfile._id}`,
        updatedProfile
      );

      if (response.data.success) {
        setProfiles((prevProfiles) =>
          prevProfiles.map((profile) =>
            profile._id === selectedProfile._id ? response.data.data : profile
          )
        );
        setShowPermissionsMenu(false);
        setSelectedProfile(null);
      }
    } catch (error) {
      console.error("Error saving permissions:", error.message);
    }
  };

  const handlePermissionChange = (key) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleDeleteProfile = async () => {
  if (!profileToDelete) return; // Ensure a profile is selected

  try {
    await axios.delete(`https://task-backend-1-vgtf.onrender.com/api/profile/${profileToDelete}`);
    setProfiles(profiles.filter((profile) => profile._id !== profileToDelete));
    setShowModal(false);
    setProfileToDelete(null); // Reset after deletion
  } catch (error) {
    console.error("Error deleting profile. Please try again.");
  }
};


  const handleBackToHome = () => {
    navigate("/dashboard"); // Navigate to the home page
  };

  return (
    <div className={styles.container}>
      <h1>Profiles</h1>

      <button onClick={handleBackToHome} className={styles.back_button}>
        ✖
      </button>

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
        <button onClick={handleCreateProfile} className={styles.button}>
          Create Profile
        </button>
      </div>

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
                    {Object.entries(profile.permission || {})
                      .filter(([key, value]) => value)
                      .map(([key]) => (
                        <li key={key}>{key.replace(/_/g, " ").toUpperCase()}</li>
                      ))}
                  </ul>
                </div>
              )}
              <button onClick={() => handleEditProfile(profile)} className={styles.edit_button}>
                Edit Permissions
              </button>
              <button onClick={() => setProfileToDelete(profile._id) || setShowModal(true)} className={styles.delete_button}>
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
              {["create_task", "edit_task", "delete_task", "view_task"].map(
                (key) => (
                  <li key={key}>
                    <label>
                      <input
                        type="checkbox"
                        checked={permissions[key] || false}
                        onChange={() => handlePermissionChange(key)}
                      />
                      {key.replace(/_/g, " ").toUpperCase()}
                    </label>
                  </li>
                )
              )}
            </ul>
            <button onClick={handleSavePermissions} className={styles.save_button}>
              Save
            </button>
            <button onClick={() => setShowPermissionsMenu(false)} className={styles.cancel_button}>
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
            <button onClick={() => setShowModal(false)} className={styles.button}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
