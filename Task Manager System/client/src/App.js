import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Singup";
import Main from "./components/Main";
import Profile from "./components/Profile";
import Project from "./components/Project";
import ProjectEdit from "./components/ProjectEdit";
import ProjectDetails from "./components/ProjectDetails";
import ProjectTask from "./components/Task";

function App() {
	const user = localStorage.getItem("token");

	return (
		<Routes>
			{<Route path="/" element={<Navigate to="/login" />} />}
			<Route path="/login" exact element={<Login />} />
			<Route path="/signup" exact element={<Signup />} />
			<Route path="/profile" exact element={<Profile />} />
			<Route path="/project" exact element={<Project />} />
			<Route path="/project/edit/:projectId" exact element={<ProjectEdit />}/>
			<Route path="/project/:projectId" exact element={<ProjectDetails />} />
			<Route path="/dashboard" exact element={<Main />} />
			<Route path="/project/:projectId/task" exact element={<ProjectTask />} />
		</Routes>
	);
}

export default App;
