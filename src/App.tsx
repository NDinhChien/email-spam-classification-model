import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Model from "./pages/Model";
import ModelDetails from "./pages/ModelDetails";
export function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/model" element={<Model />} />
				<Route path="/technical-detail" element={<ModelDetails />} />
			</Routes>
		</BrowserRouter>
	);
}
