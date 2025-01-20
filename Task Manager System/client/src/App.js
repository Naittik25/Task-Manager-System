import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Singup";
import Main from "./components/Main";
import Profile from "./components/Profile";
import Project from "./components/Project";

function App() {
	const user = localStorage.getItem("token");

	return (
		<Routes>
			{<Route path="/login" exact element={<Login />} />}
			<Route path="/signup" exact element={<Signup />} />
			<Route path="/profile" exact element={<Profile />} />
			<Route path="/project" exact element={<Project />} />
			<Route path="/" exact element={<Main />} />
		</Routes>
	);
}

export default App;
