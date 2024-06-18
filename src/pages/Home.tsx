import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { Box, Link, Stack, SxProps, Typography } from "@mui/material";
import AppBar from "../components/AppBar";
import { Theme } from "@emotion/react";

const cellStype = {
	width: 150,
	maxWidth: 150,
	overflow: "hidden",
	textOverflow: "ellipsis",
	borderStyle: "border-box",
};

const CustomLink = ({ href, text }: { href?: string; text?: string }) => {
	return (
		<Link href={href || ""} underline="hover">
			{text || ""}
		</Link>
	);
};

export const FlexBox = ({
	children,
	direction,
	justifyContent,
	childSt = {},
}: {
	children: JSX.Element | JSX.Element[];
	direction?: "row" | "column";
	justifyContent?: "center" | "flex-end";
	childSt?: SxProps<Theme>;
}) => (
	<Box
		sx={{ width: "100%", "> div": { ...(childSt as any) } }}
		display="flex"
		flexDirection={direction || "row"}
		justifyContent={justifyContent || "center"}
		alignItems={"center"}
	>
		{children}
	</Box>
);

const boldStyle = {
	fontWeight: "bold",
	marginBottom: 1,
};
export type Props = Record<string, any>;

export const BoldTypo = ({
	children,
	tail,
	...props
}: { children?: string | JSX.Element } & Props) => (
	<Typography variant={props.variant} sx={{ ...boldStyle, ...props }}>
		{children || ""} {tail || ""}
	</Typography>
);

const Intro = () => {
	return (
		<FlexBox direction="column">
			<BoldTypo variant="h5" marginBottom={1}>
				Final Semester Project
			</BoldTypo>

			<BoldTypo variant="h5" marginBottom={"4px"}>
				Build a simple NLP Model applied Transformer architecture
			</BoldTypo>
			<BoldTypo variant="h5">Email Spam Classification</BoldTypo>
		</FlexBox>
	);
};

type RowData = { col1: string | JSX.Element; col2: string | JSX.Element };
type CustomRowData = { index: number } & RowData;

const CustomRow = ({ index, col1, col2 }: CustomRowData) => {
	return (
		<>
			<TableRow key={index}>
				<TableCell component="th" scope="row" sx={{ ...cellStype }}>
					{typeof col1 == "string" ? <Typography fontWeight={"bold"}>{col1}</Typography> : col1}
				</TableCell>
				<TableCell>{typeof col2 == "string" ? <Typography>{col2}</Typography> : col2}</TableCell>
			</TableRow>
		</>
	);
};
type TableData = {
	rows: RowData[];
};

const CustomTable = ({ rows }: TableData) => (
	<Table sx={{ minWidth: 350, maxWidth: 500 }}>
		<TableBody>
			{rows.map(({ col1, col2 }, index) => (
				<CustomRow index={index} col1={col1} col2={col2} />
			))}
		</TableBody>
	</Table>
);

const createRowData = (col1: string | JSX.Element, col2: string | JSX.Element): RowData => {
	return { col1, col2 };
};

const CourseInfo = () => {
	const rows: RowData[] = [
		createRowData("Class", "Học Thống Kê - CQ2021/22"),
		createRowData("Instructors", "Ts. Ngô Minh Nhựt"),
		createRowData("", "Ths. Lê Long Quốc"),
	];
	return <CustomTable rows={rows} />;
};

const GroupInfo = () => {
	const rows: RowData[] = [
		createRowData(
			<>
				<Typography fontWeight={"bold"}>
					{"Group Members"}
					<CustomLink href="#group-info" />
				</Typography>
			</>,
			"",
		),
		createRowData("", "1. Nguyễn Đình Chiến - 20120441"),
		createRowData("", "2. Nguyễn Hoàng Việt - 20120402"),
		createRowData("", "3. Lê Trung Sơn - 20120365 "),
		createRowData("", "4. Huỳnh Quốc Huy - 21120253"),
	];
	return <CustomTable rows={rows} />;
};
const MoreInfo = () => {
	const rows: RowData[] = [
		createRowData("Deploy the project locally?", ""),
		createRowData(
			"",
			<>
				<Typography>
					{"1. Clone the project "}
					<CustomLink
						href="https://github.com/NDinhChien/email-spam-classification-model"
						text="email-spam-classification"
					/>
				</Typography>
			</>,
		),
		createRowData(
			"",
			<>
				<Typography>
					{"2. Run email-spam-classification.ipynnb on "}
					<CustomLink href="https://colab.research.google.com/" text="Google Colab" />
				</Typography>
			</>,
		),
		createRowData("", "3. Run the web server: npm run start"),
	];
	return <CustomTable rows={rows} />;
};

export default () => (
	<>
		<AppBar />
		<br />
		<Intro />
		<br />
		<FlexBox direction="column">
			<CourseInfo />
			<br />
			<GroupInfo />
			<br />
			<MoreInfo />
		</FlexBox>
	</>
);
