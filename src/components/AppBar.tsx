import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import AdbIcon from "@mui/icons-material/Adb";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";

export const NavButton = ({ text, onclick }: { text: string; onclick: () => void }) => (
	<Button onClick={onclick} color="inherit" sx={{ position: "absolute", right: 0, marginRight: 2 }}>
		{text}
	</Button>
);

const CustomAppBar = ({ navBtns }: { navBtns: JSX.Element | JSX.Element[] }) => (
	<Box sx={{ flexGrow: 1 }}>
		<AppBar position="static">
			<Toolbar>
				<IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
					<AdbIcon />
				</IconButton>
				{navBtns}
			</Toolbar>
		</AppBar>
	</Box>
);

export default function HomeAppBar() {
	const navigate = useNavigate();
	return (
		<CustomAppBar
			navBtns={
				<NavButton
					text="Test Model"
					onclick={() => {
						navigate("/model");
					}}
				/>
			}
		/>
	);
}

export function BackAppBar() {
	const navigate = useNavigate();
	return (
		<CustomAppBar
			navBtns={
				<NavButton
					text="Back"
					onclick={() => {
						navigate("/");
					}}
				/>
			}
		/>
	);
}
