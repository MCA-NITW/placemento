import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Core CSS
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Theme

const CompanyTable = ({ companies }) => {
	const [colDefs, setColDefs] = useState([
		{
			field: 'name',
			headerName: 'Name',
			width: 150,
			sortable: true,
			resizable: true,
			left: true,
			pinned: 'left',
		},
		{
			field: 'status',
			headerName: 'Status',
			width: 115,
			filter: true,
			sortable: false,
			resizable: true,
		},
		{
			field: 'typeOfOffer',
			headerName: 'Offer',
			width: 90,
			sortable: true,
			resizable: true,
		},
		{ field: 'profile', headerName: 'Profile', width: 170 },
		{
			field: 'interviewShortlist',
			headerName: 'Shortlists',
			width: 130,
			sortable: true,
			resizable: true,
		},
		{
			field: 'selectedStudents',
			headerName: 'Selects',
			width: 110,
			sortable: true,
			resizable: true,
		},
		{
			field: 'dateOfOffer',
			headerName: 'Offer Date',
			width: 140,
			sortable: true,
			resizable: true,
		},
		{
			field: 'locations',
			headerName: 'Locations',
			width: 140,
			sortable: true,
			resizable: true,
		},
		{
			headerName: 'Cutoffs',
			children: [
				{
					field: 'cutoff_pg',
					headerName: 'PG',
					width: 80,
					sortable: false,
					resizable: true,
				},
				{
					field: 'cutoff_ug',
					headerName: 'UG',
					width: 80,
					sortable: false,
					resizable: true,
				},
				{
					field: 'cutoff_12',
					headerName: '12',
					width: 80,
					sortable: false,
					resizable: true,
				},
				{
					field: 'cutoff_10',
					headerName: '10',
					width: 80,
					sortable: false,
					resizable: true,
				},
			],
		},
		{
			headerName: 'CTC (LPA)',
			children: [
				{
					field: 'ctc',
					headerName: 'CTC',
					width: 90,
					sortable: true,
					resizable: true,
				},
				{
					field: 'ctcBase',
					headerName: 'Base',
					width: 95,
					sortable: true,
					resizable: true,
				},
			],
		},
		{
			field: 'bond',
			headerName: 'Bond',
			width: 70,
			sortable: false,
			resizable: true,
		},
	]);

	const [rowData, setRowData] = useState(
		companies.map(company => ({
			id: company._id,
			name: company.name,
			status: company.status,
			interviewShortlist: company.interviewShortlist,
			selectedStudents:
				company.selectedStudentsRollNo.toString() === ''
					? 0
					: company.selectedStudentsRollNo.toString().split(',').length,
			dateOfOffer: new Date(company.dateOfOffer).toLocaleDateString('en-US', {
				day: 'numeric',
				month: 'short',
				year: 'numeric',
			}),
			locations: company.locations,
			cutoff_pg: company.cutoffs.pg.cgpa
				? `${company.cutoffs.pg.cgpa} CGPA`
				: `${company.cutoffs.pg.percentage}%`,
			cutoff_ug: company.cutoffs.ug.cgpa
				? `${company.cutoffs.ug.cgpa} CGPA`
				: `${company.cutoffs.ug.percentage}%`,
			cutoff_12: company.cutoffs.twelth.cgpa
				? `${company.cutoffs.twelth.cgpa} CGPA`
				: `${company.cutoffs.twelth.percentage}%`,
			cutoff_10: company.cutoffs.tenth.cgpa
				? `${company.cutoffs.tenth.cgpa} CGPA`
				: `${company.cutoffs.tenth.percentage}%`,
			typeOfOffer: company.typeOfOffer,
			profile: company.profile,
			ctc: company.ctc.toFixed(2),
			ctcBase: company.ctcBreakup.base.toFixed(2),
			bond: company.bond,
		})),
	);

	return (
		<AgGridReact
			rowData={rowData}
			columnDefs={colDefs}
			rowHeight={40}
			headerHeight={40}
			rowSelection="single"
		/>
	);
};

export default CompanyTable;
