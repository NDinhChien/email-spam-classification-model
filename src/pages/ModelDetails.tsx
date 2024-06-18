import { Button, IconButton, TextField, Typography } from "@mui/material";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import SettingsIcon from "@mui/icons-material/Settings";
import { useModelcontext } from "./Model";
import { useState } from "react";
import { FlexBox } from "./Home";

export const Counter = ({
	min,
	max,
	holder,
	title,
}: {
	min: number;
	max: number;
	holder?: string;
	title?: string;
}) => {
	const { numberOfSamples, setNumberOfSamples, setStartCreateForm } = useModelcontext();

	const [disableBtn, setDisableBtn] = useState<boolean>(false);

	return (
		<TextField
			sx={{ maxWidth: "80px", display: "inline-block", float: "right" }}
			type="number"
			onChange={(value) => {
				setNumberOfSamples(Number(value.currentTarget.value));
				setStartCreateForm(false);
			}}
			InputProps={{
				inputProps: {
					max: { max },
					min: { min },
					style: {
						padding: 5,
						paddingRight: 0,
						marginRight: 0,
					},
					defaultValue: 1,
				},
				endAdornment: (
					<SettingsIcon
						onClick={() => {
							if (numberOfSamples > 0) {
								setStartCreateForm(true);
								setDisableBtn(true);
								setTimeout(() => {
									setDisableBtn(false);
								}, 1000);
							}
						}}
						titleAccess={disableBtn ? "Set!" : "Set"}
						fontSize="medium"
						color="primary"
						sx={{ ":hover": { opacity: 0.9 }, ...(disableBtn && { opacity: 0.4 }) }}
					/>
				),
			}}
			placeholder={holder}
		/>
	);
};

export default function () {
	return (
		<FlexBox>
			<Typography>{"Developing..."}</Typography>
		</FlexBox>
	);
}
