import { useCallback, useMemo, useState } from 'react';
import { getStudents } from '../../api/studentAPI.jsx';
import AgGridTable from '../AgGridTable/AgGridTable.jsx';
import './StudentTable.css';

const StudentTable = () => {
	const [students, setStudents] = useState([]);

	const fetchData = useCallback(async () => {
		try {
			const response = await getStudents();
			setStudents(response.data.users);
		} catch (error) {
			console.error('Error fetching students:', error);
		}
	}, []);

	const generateColumn = (field, headerName, width, sortable = true, resizable = true) => ({
		field,
		headerName,
		width,
		sortable,
		resizable,
	});

	const generateNestedColumn = (headerName, children) => ({
		headerName,
		children,
	});

	const columnDefinitions = [
		{
			...generateColumn('role', 'Role', 100),
			pinned: 'left',
		},
		{
			...generateColumn('rollNo', 'Roll No', 100),
			pinned: 'left',
		},
		{
			...generateColumn('name', 'Name', 130),
			pinned: 'left',
		},
		generateColumn('email', 'Email', 250),
		generateColumn('isVerified', 'Verified?', 150),
		generateColumn('placed', 'Placed?', 80),
		generateNestedColumn('Grades', [
			generateNestedColumn('PG', [generateColumn('pg.cgpa', 'CGPA', 85), generateColumn('pg.percentage', '%', 85)]),
			generateNestedColumn('UG', [generateColumn('ug.cgpa', 'CGPA', 85), generateColumn('ug.percentage', '%', 85)]),
			generateNestedColumn('HSC', [generateColumn('hsc.cgpa', 'CGPA', 85), generateColumn('hsc.percentage', '%', 85)]),
			generateNestedColumn('SSC', [generateColumn('ssc.cgpa', 'CGPA', 85), generateColumn('ssc.percentage', '%', 85)]),
		]),
		generateColumn('totalGapInAcademics', 'Gap', 75),
		generateColumn('backlogs', 'Backlogs', 85),
	];

	const mapStudentData = (student) => {
		return {
			...student,
			id: student._id,
		};
	};

	const rowData = students.map(mapStudentData);

	const dataTypeDefinitions = useMemo(() => {
		return {
			object: {
				baseDataType: 'object',
				extendsDataType: 'object',
				valueParser: (params) => ({ name: params.newValue }),
				valueFormatter: (params) => (params.value == null ? '' : params.value.name),
			},
		};
	}, []);

	return (
		<>
			<AgGridTable
				rowData={rowData}
				columnDefinitions={columnDefinitions}
				dataTypeDefinitions={dataTypeDefinitions}
				fetchData={fetchData}
			/>
		</>
	);
};

export default StudentTable;
