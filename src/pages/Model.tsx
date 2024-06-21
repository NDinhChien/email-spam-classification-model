import HandymanRoundedIcon from "@mui/icons-material/HandymanRounded";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import { Typography, Link as MuiLink, Button, SxProps, Box } from "@mui/material";
import { BackAppBar } from "../components/AppBar";
import { BoldTypo, FlexBox } from "./Home";
import { Link } from "react-router-dom";
import * as yup from "yup";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import { useFormik } from "formik";
import { Theme } from "@emotion/react";
import { FormikForm, FormikType, LoadingBtn } from "../components/FormikForm";
import axi from "axios";
import React, { useEffect, useState } from "react";
import { Counter, RandomData } from "./ModelDetails";
const axios = axi.create();

axios.interceptors.request.use((config) => {
	config.headers["request-startTime"] = new Date().getTime();
	return config;
});

axios.interceptors.response.use((response) => {
	const currentTime = new Date().getTime();
	const startTime = response.config.headers["request-startTime"];
	response.headers["request-duration"] = currentTime - startTime;
	return response;
});

let duration: number;

const OurModel = () => {
	return (
		<FlexBox direction="column">
			<BoldTypo variant="h5" marginBottom={1}>
				Email Spam Classification Model
			</BoldTypo>

			<BoldTypo variant="h5" marginBottom={"4px"}>
				Powered by Transformer Architecture
			</BoldTypo>
			<BoldTypo
				variant="h5"
				tail={
					<MuiLink component={Link} to="/technical-detail">
						here
					</MuiLink>
				}
			>
				More details
			</BoldTypo>
		</FlexBox>
	);
};

const alignStyle: SxProps<Theme> = {
	display: "inline-block",
	fontSize: "20px",
	borderRadius: 2,
	border: "1px solid transparent",
};
const serverUrlSchema = yup.object({
	serverUrl: yup.string().required("Server Url is required"),
});

const Setup = () => {
	const { serverUrl, setServerUrl } = useModelcontext();
	const [isCheckingServer, setIsCheckingServer] = useState<boolean | null>(null);

	const holders = {
		serverUrl: "Server Url...",
	};

	const formik = useFormik({
		initialValues: {
			serverUrl: "http://localhost:8080",
		},
		validationSchema: serverUrlSchema,

		onSubmit: ({ serverUrl }, actions) => {
			setIsCheckingServer(true);
			axios
				.get(serverUrl)
				.then(() => {
					setIsCheckingServer(false);
					setServerUrl(serverUrl);
					actions.setStatus("Server is reachable");
				})
				.catch(() => {
					setIsCheckingServer(false);
					setServerUrl("");
					actions.setErrors({ serverUrl: "Server is unreachable" });
				});
		},
	});

	const keys = Object.keys(serverUrlSchema.fields);

	return (
		<>
			<FlexBox justifyContent="flex-end">
				<FormikForm
					formik={formik}
					inputSt={{ ...alignStyle, width: "400px" }}
					isLoading={isCheckingServer}
					submitDisp={<ConstructionRoundedIcon></ConstructionRoundedIcon>}
					submitSt={{ ...alignStyle, width: "40px", marginLeft: "5px" }}
					holders={holders}
					keys={keys as any}
				/>
			</FlexBox>
		</>
	);
};

const getSpamHamTxt = (preText?: number | string) => {
	return preText ? (typeof preText == "string" ? preText : `${Math.round(preText)}%`) : "";
};
const Spam = ({ preText }: { preText?: number | string }) => {
	return (
		<Button variant="outlined" color="error">
			{`${getSpamHamTxt(preText)} Spam`}
		</Button>
	);
};

const Ham = ({ preText }: { preText?: number | string }) => {
	return (
		<Button variant="contained" color="success">
			{`${getSpamHamTxt(preText)} Ham`}
		</Button>
	);
};

export const CenteredBox = ({
	children,
	last,
	st,
}: {
	last?: boolean;
	children: JSX.Element;
	st?: SxProps<Theme>;
}) => {
	return (
		<Box
			sx={{
				display: "flex",
				direction: "column",
				alignItems: "center",
				justifyContent: "center",
				height: "103px",
				marginTop: "12px",
				marginBottom: last ? "45px" : "0px",
				...((st as any) || {}),
			}}
		>
			{children}
		</Box>
	);
};

export const PredicResult = ({
	isLoading,
	result,
}: {
	isLoading: boolean | null;
	result?: { result: "Ham" | "Spam"; percentile: number };
}) => {
	if (isLoading === false && result) {
		return result.result === "Ham" ? (
			<Ham preText={result.percentile} />
		) : (
			<Spam preText={result.percentile} />
		);
	}
	if (isLoading === true) return <LoadingBtn />;

	return <Typography sx={{ color: "#787878" }}>Unknown</Typography>;
};

const extractStatistics = (
	response: Record<string, { result: "Ham" | "Spam"; percentile: number }> | null,
): any => {
	if (!response) return {};
	const results = Object.values(response);

	if (!results || !results[0] || !results[0].result) return {};
	let nHam = 0;
	let nSpam = 0;
	let n = 0;
	results.forEach(({ result, percentile }) => {
		if (result === "Ham") nHam += 1;
		else nSpam += 1;
		n++;
	});

	return { nHam, nSpam, n, duration };
};

const getEmailSchema = (n: number) => {
	let schema: any = {};
	for (let i = 0; i < n; i++) {
		schema[`email${i == 0 ? "" : i}`] = yup.string().required("Email sample is required");
	}
	return yup.object(schema);
};

const getHolders = (n: number) => {
	let holders: any = {};
	for (let i = 0; i < n; i++) {
		holders[`email${i == 0 ? "" : i}`] = "Email sample...";
	}
	return holders;
};

const getValues = (values: Record<string, string>, n: number) => {
	const rs: any = {};
	if (n == 0) return rs;
	rs["email"] = values["email"];
	for (let i = 1; i <= n - 1; i++) {
		rs[`email${i}`] = values[`email${i}`];
	}
	return rs;
};
const PredictInOut = () => {
	const [input, setInput] = useState<any>(getEmailSchema(1));

	const [holders, setHolders] = useState<any>(getHolders(1));
	const [isLoading, setIsLoading] = useState<boolean | null>(null);

	const { startCreateForm, numberOfSamples, serverUrl, defaultValues, response, setResponse } =
		useModelcontext();

	const formik = useFormik({
		initialValues: {},
		validationSchema: input,
		onSubmit: (values: Record<string, string>, actions) => {
			values = getValues(values, numberOfSamples);

			console.log(numberOfSamples, values);
			if (serverUrl === "") {
				return window.alert("Please Set Server URL first!");
			}
			setIsLoading(true);

			axios
				.post(serverUrl + "/predict", values)
				.then((response) => {
					console.log(values);
					console.log(response.data);
					setResponse(response.data);
					duration = response.headers["request-duration"];
					setIsLoading(false);
				})
				.catch((error) => {
					actions.setErrors({ message: "Something wrong happened, Please try again!" });
					setIsLoading(false);
				});
		},
	});

	useEffect(() => {
		if (formik) {
			formik.setValues(defaultValues!);
			// console.log()
		}
	}, [defaultValues]);
	useEffect(() => {
		if (startCreateForm === true && numberOfSamples >= 1) {
			setInput(getEmailSchema(numberOfSamples));
			setHolders(getHolders(numberOfSamples));
			console.log("oke", numberOfSamples);
		}
	}, [startCreateForm, numberOfSamples]);

	const keys = Object.keys(input.fields);

	const Statistics = () => {
		if (!response) return <></>;

		const { nHam, nSpam, n, duration } = extractStatistics(response);

		return (
			<FlexBox direction="row" st={{ "> button": { marginRight: "5px" } }}>
				<Button variant="outlined" sx={{ border: "none" }}>
					<BoldTypo border={"none"} marginBottom="0px">
						{"SUMMARY"}
					</BoldTypo>
				</Button>
				<Spam preText={`${nSpam}/${n}`} />
				<Ham preText={`${nHam}/${n}`} />
				<Button variant="outlined">{`IN ${duration} ms`}</Button>
			</FlexBox>
		);
	};

	return (
		<FlexBox childSt={{ textAlign: "center" }}>
			<FormikForm
				formik={formik}
				inputSt={{ multiline: true, maxRows: 5, minRows: 5 }}
				isLoading={isLoading}
				submitDisp={"Predict"}
				holders={holders}
				keys={keys as any}
				isMain={true}
				response={response}
				Statistics={<Statistics />}
			/>
		</FlexBox>
	);
};

const Column = () => {
	return (
		<FlexBox childSt={{ textAlign: "center" }}>
			<Box sx={{ width: "70%" }}>
				EMAILS
				<RandomData />
				<Counter min={1} max={10} title="Set" />
			</Box>
			<Box sx={{ width: "30%" }}>PREDICTS</Box>
		</FlexBox>
	);
};

export interface ModelContextInfo {
	serverUrl: string;
	setServerUrl: (s: string) => void;
	numberOfSamples: number;
	setNumberOfSamples: (n: number) => void;
	startCreateForm: boolean;
	setStartCreateForm: (b: boolean) => void;
	data: { v2: string }[];
	setData: (data: DataType) => void;
	defaultValues: Record<string, string> | null;
	setDefaultValues: (values: Record<string, string>) => void;
	response: ResponseType;
	setResponse: (response: ResponseType) => void;
}
type DataType = { v2: string }[];
export type ResponseType = Record<string, { result: "Ham" | "Spam"; percentile: number }> | null;

export const ModelContext = React.createContext<ModelContextInfo>({
	serverUrl: "",
	setServerUrl: (s: string) => {},
	numberOfSamples: 1,
	setNumberOfSamples: (n: number) => {},
	startCreateForm: false,
	setStartCreateForm: (b: boolean) => {},
	data: [],
	setData: (data: DataType) => {},
	defaultValues: null,
	setDefaultValues: (values: Record<string, string>) => {},
	response: null,
	setResponse: (response: ResponseType) => {},
});

export const ModelProvider = ({ children }: { children: React.ReactNode }) => {
	const [numberOfSamples, setNumberOfSamples] = useState<number>(1);
	const [startCreateForm, setStartCreateForm] = useState<boolean>(false);
	const [serverUrl, setServerUrl] = useState<string>("");
	const [data, setData] = useState<DataType>([]);
	const [defaultValues, setDefaultValues] = useState<Record<string, string> | null>(null);
	const [response, setResponse] = useState<ResponseType>(null);
	return (
		<ModelContext.Provider
			value={{
				numberOfSamples,
				setNumberOfSamples,
				startCreateForm,
				setStartCreateForm,
				serverUrl,
				setServerUrl,
				data,
				setData,
				defaultValues,
				setDefaultValues,
				response,
				setResponse,
			}}
		>
			{children}
		</ModelContext.Provider>
	);
};

export const useModelcontext = () => React.useContext(ModelContext);

export default function Model() {
	return (
		<ModelProvider>
			<BackAppBar />
			<br />
			<OurModel />
			<br />
			<Setup />
			<br />
			<Column />
			<br />
			<PredictInOut />
		</ModelProvider>
	);
}
