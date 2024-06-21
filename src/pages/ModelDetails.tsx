import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
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
	const { numberOfSamples, setNumberOfSamples, setStartCreateForm, setResponse } =
		useModelcontext();

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
								setResponse(null);
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

import * as d3 from "d3";

import AttachFileIcon from "@mui/icons-material/AttachFile";
export function RandomData() {
	const { data, setData, setDefaultValues, numberOfSamples, setResponse } = useModelcontext();

	function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
		var file = e.target!.files!.item(0);
		const reader = new FileReader();
		reader.onload = function (this, ev) {
			// Here's where you would parse the first few lines of the CSV file
			const str = ev?.target?.result as string;
			const result = d3.csvParse<string>(str);
			setData(result as any);
		};

		reader.readAsText(file!);
	}
	return (
		<Box sx={{ display: "inline-flex", float: "right" }}>
			<div>
				<IconButton aria-label="upload" component="label">
					<input accept=".csv" hidden id="choose-file" type="file" onChange={handleFile} />
					<AttachFileIcon />
				</IconButton>
			</div>
			<Button
				disabled={data.length == 0}
				sx={{ fontSize: "10px", variant: "primary" }}
				onClick={() => {
					if (data) {
						let values: any = {};
						for (let i = 0; i < numberOfSamples; i++) {
							const value = data[Math.floor(Math.random() * data.length)].v2;
							if (i == 0) values["email"] = value;
							else values[`email${i}`] = value;
						}

						setDefaultValues(values);
						setResponse(null);
					}
				}}
			>
				{"Random"}
			</Button>
		</Box>
	);
}

export default function developing() {
	return <></>;
}
