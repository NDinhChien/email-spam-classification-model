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
import { Counter } from "./ModelDetails";
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

	const keys = Object.keys(serverUrlSchema.fields).reverse();

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

const emptyArray = (n: number, defaultValue: object) => {
	let arr = [];
	for (let i = 0; i < n; i++) arr.push({ ...defaultValue });
	return arr;
};
const CenteredBox = ({ children, last }: { last: boolean; children: JSX.Element }) => {
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
			}}
		>
			{children}
		</Box>
	);
};

const Category = ({
	isLoading,
	response,
	request,
}: {
	isLoading: boolean | null;
	response?: Record<string, { result: "Ham" | "Spam"; percentile: number }> | null;
	request: Record<string, string> | null;
}) => {
	const { numberOfSamples } = useModelcontext();
	const PredicResult = ({
		isLoading,
		result,
		percentile,
	}: {
		isLoading: boolean | null;
		result?: "Ham" | "Spam";
		percentile: number;
	}) => {
		if (isLoading === false && result) {
			return result === "Ham" ? <Ham preText={percentile} /> : <Spam preText={percentile} />;
		}
		if (isLoading === true) return <LoadingBtn />;

		return <Typography></Typography>;
	};

	const [results, setResults] = useState<{ result?: "Ham" | "Spam"; percentile?: number }[]>([]);

	useEffect(() => {
		if (isLoading !== false || !response) {
			setResults(emptyArray(numberOfSamples, {}));
		} else {
			setResults(Object.values(response));
		}
	}, [isLoading, response]);

	return (
		results && (
			<>
				{results.map(({ result, percentile }, index) => (
					<CenteredBox last={!!(index == results.length - 1)}>
						<PredicResult isLoading={isLoading} result={result!} percentile={percentile!} />
					</CenteredBox>
				))}
			</>
		)
	);
};

const Statistics = ({ data }: { data: any }) => {
	if (!data) return <></>;

	const { nHam, nSpam, n, duration } = data;
	return (
		<FlexBox direction="column">
			<Box>
				<Typography>SUMARY</Typography>
			</Box>
			<Box>
				<Typography sx={{ marginTop: "-10px" }}>
					<Spam preText={`${nSpam}/${n}`} /> <Ham preText={`${nHam}/${n}`} />
					<BoldTypo>{`IN ${duration} ms`}</BoldTypo>
				</Typography>
			</Box>
		</FlexBox>
	);
};

const PredictInOut = () => {
	const getEmailSchema = (n: number) => {
		let schema: any = {};
		for (let i = 0; i < n; i++) {
			schema[`email${i == 0 ? "" : i}`] = yup.string().required("Email sample is required");
		}
		return yup.object().shape(schema);
	};

	const getHolders = (n: number) => {
		let holders: any = {};
		for (let i = 0; i < n; i++) {
			holders[`email${i == 0 ? "" : i}`] = "Email sample...";
		}
		return holders;
	};

	const [input, setInput] = useState<any>(getEmailSchema(1));
	const [values, setValues] = useState<Record<string, string> | null>(null);
	const [statistics, setStatistics] = useState<{
		nHam: number;
		nSpam: number;
		n: number;
		duration: number;
	} | null>(null);

	const [holders, setHolders] = useState<any>(getHolders(1));
	const [isLoading, setIsLoading] = useState<boolean | null>(null);

	const [response, setResponse] = useState<Record<
		string,
		{ result: "Ham" | "Spam"; percentile: number }
	> | null>(null);

	const extractStatistics = (
		results: { result: "Ham" | "Spam"; percentile: number }[],
		duration: number,
	) => {
		let nHam = 0;
		let nSpam = 0;
		let n = 0;
		console.log("?", results);
		results.forEach(({ result, percentile }) => {
			if (result === "Ham") nHam += 1;
			else nSpam += 1;
			n++;
		});

		setStatistics({ nHam, nSpam, n, duration });
	};

	const { startCreateForm, numberOfSamples, serverUrl } = useModelcontext();

	useEffect(() => {
		if (startCreateForm === true && numberOfSamples >= 1) {
			setInput(getEmailSchema(numberOfSamples));
			setHolders(getHolders(numberOfSamples));
			console.log("oke", numberOfSamples);
		}
	}, [startCreateForm, numberOfSamples]);

	const formik = useFormik({
		initialValues: {},
		validationSchema: input,
		onSubmit: (values: Record<string, string>, actions) => {
			if (serverUrl === "") {
				return window.alert("Please Set Server URL first!");
			}
			setIsLoading(true);
			setValues(values);

			axios
				.post(serverUrl + "/predict", values)
				.then((response) => {
					console.log(values);
					console.log(response.data);
					setResponse(response.data);
					extractStatistics(Object.values(response.data), response.headers["request-duration"]);
					setIsLoading(false);
				})
				.catch((error) => {
					actions.setErrors({ message: "Something wrong happened, Please try again!" });
					setIsLoading(false);
				});
		},
	});

	const keys = Object.keys(input.fields);
	return (
		<FlexBox childSt={{ textAlign: "center" }}>
			<Box sx={{ width: "70%" }}>
				<FormikForm
					formik={formik}
					inputSt={{ multiline: true, maxRows: 5, minRows: 5 }}
					isLoading={isLoading}
					submitDisp={"Predict"}
					holders={holders}
					keys={keys as any}
					isMain={true}
				/>
			</Box>
			<Box sx={{ width: "30%" }}>
				<Category isLoading={isLoading} response={response} request={values} />
				<Statistics data={statistics} />
			</Box>
		</FlexBox>
	);
};

const Column = () => {
	return (
		<FlexBox childSt={{ textAlign: "center" }}>
			<Box sx={{ width: "70%" }}>
				EMAILS <Counter min={1} max={10} title="Set" />
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
}
export const ModelContext = React.createContext<ModelContextInfo>({
	serverUrl: "",
	setServerUrl: (s: string) => {},
	numberOfSamples: 1,
	setNumberOfSamples: (n: number) => {},
	startCreateForm: false,
	setStartCreateForm: (b: boolean) => {},
});

export const ModelProvider = ({ children }: { children: React.ReactNode }) => {
	const [numberOfSamples, setNumberOfSamples] = useState<number>(1);
	const [startCreateForm, setStartCreateForm] = useState<boolean>(false);
	const [serverUrl, setServerUrl] = useState<string>("");

	return (
		<ModelContext.Provider
			value={{
				numberOfSamples,
				setNumberOfSamples,
				startCreateForm,
				setStartCreateForm,
				serverUrl,
				setServerUrl,
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