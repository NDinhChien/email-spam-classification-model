import { Button, IconButton, TextField, Typography } from "@mui/material";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import SettingsIcon from "@mui/icons-material/Settings";
import { useModelcontext } from "./Model";
import { useState } from "react";

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

import * as React from "react";
import Stack from "@mui/material/Stack";

export default function () {
	return (
		<Stack direction="row" spacing={2}>
			<Button color="secondary">Secondary</Button>
			<Button variant="contained" color="success">
				100% Success
			</Button>
			<Button variant="outlined" color="error">
				Error
			</Button>
		</Stack>
	);
}
