import { useFormik } from "formik";
import { Box, Button, CircularProgress, SxProps, TextField, Typography } from "@mui/material";
import { Theme } from "@emotion/react";
import { FlexBox } from "../pages/Home";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import { CenteredBox, PredicResult, useModelcontext } from "../pages/Model";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
export type FormikType<T extends object> = ReturnType<typeof useFormik<T>>;

export function FormikTextField<T extends object>({
	formik,
	name,
	placeholder,
	style = {},
	lineBreak,
	isMain,
	result,
	isLoading,
}: {
	formik: FormikType<T>;
	name: keyof T;
	placeholder: string;
	style?: SxProps<Theme> & { multiline?: boolean; maxRows?: number; minRows?: number };
	lineBreak?: boolean;
	isMain?: boolean;
	result?: { result: "Ham" | "Spam"; percentile: number };
	isLoading: boolean | null;
}) {
	const { multiline = false, maxRows = 1, minRows = 1, ...others } = style;
	return (
		<Box sx={{ ...(isMain ? {} : { display: "inline-flex" }) }}>
			<TextField
				multiline={multiline}
				minRows={minRows}
				maxRows={maxRows}
				sx={{
					...others,
					marginBottom: "10px",
					...(isMain ? { width: "70%" } : { display: "400px" }),
				}}
				id={name as any}
				name={name as any}
				label={name as any}
				placeholder={placeholder}
				value={formik.values[name]}
				onChange={formik.handleChange}
				onBlur={formik.handleBlur}
				error={formik.touched[name] && Boolean(formik.errors[name])}
				helperText={(formik.touched[name] as any) && formik.errors[name]}
			/>
			{lineBreak === true && <br />}
			{isMain === true && (
				<CenteredBox st={{ display: "inline-flex", width: "30%", marginTop: "0px" }}>
					<PredicResult isLoading={isLoading!} result={result} />
				</CenteredBox>
			)}
		</Box>
	);
}

export const LoadingBtn = () => <CircularProgress sx={{ display: "flex", fontSize: "small" }} />;

export const FormikSubmit = ({
	disp,
	style = {},
	isLoading,
	isMain,
	Statistics,
}: {
	disp?: string | JSX.Element;
	style?: SxProps<Theme>;
	isLoading: null | boolean;
	isMain?: boolean;
	Statistics?: JSX.Element;
}) => {
	const { serverUrl } = useModelcontext();

	return (
		<>
			<Button color="primary" variant="contained" type="submit" sx={{ ...style }}>
				{isLoading === true ? (
					<PendingOutlinedIcon></PendingOutlinedIcon>
				) : serverUrl && serverUrl != "" && !isMain ? (
					<CheckCircleOutlineOutlinedIcon></CheckCircleOutlineOutlinedIcon>
				) : (
					disp || "Submit"
				)}
			</Button>
			{isMain && !!Statistics && Statistics}
		</>
	);
};

export function FormikForm<T extends object>({
	formik,
	keys,
	holders,
	submitDisp,
	submitSt,
	inputSt,
	isLoading,
	noSubmitBtn,
	lineBreak,
	isMain,
	response,
	Statistics,
}: {
	formik: FormikType<T>;
	keys: (keyof T)[];
	holders?: Record<keyof T, string>;
	submitDisp?: string | JSX.Element;
	submitSt?: SxProps<Theme>;
	inputSt?: SxProps<Theme> & { multiline?: boolean; maxRows?: number; minRows?: number };
	isLoading: null | boolean;
	noSubmitBtn?: boolean;
	lineBreak?: boolean;
	isMain?: boolean;
	response?: Record<string, { result: "Ham" | "Spam"; percentile: number }> | null;
	Statistics?: JSX.Element;
}) {
	return (
		<form onSubmit={formik.handleSubmit} style={isMain ? { width: "100%" } : {}}>
			{(keys || []).map((key) => (
				<FormikTextField
					formik={formik}
					name={key as any}
					placeholder={holders ? holders[key] || "" : ""}
					style={inputSt || {}}
					isLoading={isLoading}
					lineBreak={lineBreak}
					result={response ? response[key as any] : undefined}
					isMain={isMain}
				/>
			))}
			{noSubmitBtn !== true && (
				<FormikSubmit
					isLoading={isLoading}
					disp={submitDisp}
					style={submitSt}
					isMain={isMain}
					Statistics={Statistics}
				/>
			)}
		</form>
	);
}
