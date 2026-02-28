import { type ReactNode } from 'react';

// Academic field (pg, ug, hsc, ssc)
export interface AcademicField {
	cgpa: number;
	percentage: number;
}

// PlacedAt details
export interface PlacedAt {
	companyId: string;
	companyName: string;
	ctc: number;
	ctcBase: number;
	profile: string;
	profileType: string;
	offer: string;
	location: string;
}

// User roles
export type UserRole = 'student' | 'placementCoordinator' | 'admin';

// User
export interface User {
	_id: string;
	id: string;
	name: string;
	email: string;
	rollNo: string;
	role: UserRole;
	batch: number;
	pg: AcademicField;
	ug: AcademicField;
	hsc: AcademicField;
	ssc: AcademicField;
	placed: boolean;
	placedAt: PlacedAt;
	isVerified: boolean;
	totalGapInAcademics: number;
	backlogs: number;
	[key: string]: unknown;
}

// Cutoff
export interface Cutoff {
	cgpa: number;
	percentage: number;
}

// Cutoffs
export interface Cutoffs {
	pg: Cutoff;
	ug: Cutoff;
	twelth: Cutoff;
	tenth: Cutoff;
}

// CTC Breakup
export interface CtcBreakup {
	base: number;
	other: number;
}

// Company
export interface Company {
	_id: string;
	id: string;
	name: string;
	status: string;
	interviewShortlist: number;
	selectedStudentsRollNo: string[];
	selectedStudents: number;
	dateOfOffer: string;
	locations: string[];
	cutoffs: Cutoffs;
	typeOfOffer: string;
	profile: string;
	profileCategory: string;
	ctc: number;
	ctcBreakup: CtcBreakup;
	ctcBase: number;
	bond: number;
	selected: number;
	cutoff_pg: string;
	cutoff_ug: string;
	cutoff_12: string;
	cutoff_10: string;
}

// Student details in experience
export interface StudentDetails {
	rollNo: string;
	name: string;
	batch: number;
}

// Experience
export interface Experience {
	_id: string;
	companyName: string;
	studentDetails: StudentDetails;
	content: string;
	Comments: string[];
	tags: string[];
	createdAt: string;
	rating: number;
	interviewProcess: string;
	tips: string;
	difficulty: string;
	likes: number;
	likedBy: string[];
	isVerified: boolean;
	helpfulCount: number;
}

// Stats types
export interface CtcStats {
	highestCTCOffered: string;
	highestCTCPlaced: string;
	avgCTC: string;
	totalPlacedStudentsCTC: string;
	highestCTCOfferedCompany: string;
	highestCTCPlacedStudent: string;
	highestCTCPlacedCompany: string;
}

export interface LocationStat {
	location: string;
	count: number;
}

export interface CompanyStats {
	totalCompanies: number;
	totalOngoingCompanies: number;
	totalCompletedCompanies: number;
	totalPPOs: number;
	totalFTEs: number;
	totalInterns: number;
	total6MFTEs: number;
	totalSoftwareCompanies: number;
	totalAnalystCompanies: number;
	totalOthersCompanies: number;
	topLocations: LocationStat[];
}

export interface StudentStats {
	totalStudents: number;
	totalEligibleStudents: number;
	totalPlacedStudents: number;
	placementPercentage: string;
	totalVerifiedStudents: number;
	totalUnverifiedStudents: number;
	totalAdmins: number;
	totalPlacementCoordinators: number;
}

// Select option used across UI
export interface SelectOption<T = string | number> {
	label: string;
	value: T;
}

// Filter options map
export interface FilterOptions {
	[key: string]: SelectOption[];
}

// Component props
export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	message: string;
	buttonTitle: string;
	HasInput?: React.ComponentType | null;
	rootid?: string;
}

export interface StructureProps {
	LeftComponent: ReactNode;
	RightComponent: ReactNode;
	ContainerComponent: ReactNode;
}

export interface ToastContentProps {
	res: string;
	messages: string[];
}

export interface AgGridTableProps {
	rowData: unknown[];
	columnDefinitions: unknown[];
	fetchData: () => void;
	isExternalFilterPresent?: () => boolean;
	doesExternalFilterPass?: (node: unknown) => boolean | undefined;
}

export interface FilterProps {
	allOptions: FilterOptions;
	optionClickHandler: (head: string, value: string | number) => void;
}

export interface CompanyFormProps {
	actionFunc: (...args: unknown[]) => Promise<unknown>;
	handleFormClose: (fetch: boolean) => void;
	initialData: Company | null;
	isAdd: boolean;
}

export interface ExperienceFormProps {
	closeExperienceAddModal: (fetch: boolean) => void;
	initialData: Partial<Experience>;
	isAdd: boolean;
}

export interface ExperienceViewProps {
	closeExperienceViewModal: (fetch: boolean) => void;
	experienceViewModalData: Experience;
	user: User;
}

export interface StatsSectionItemProps {
	left: string;
	right: ReactNode;
	icon?: string;
}

export interface StatsCardProps {
	title: string;
	value: string | number;
	subtitle?: string;
	icon: string;
	trend?: number;
	color?: string;
}

export interface FormFooterProps {
	mode: string;
}

export interface CompanyFiltersProps {
	optionClickHandler: (head: string, value: string | number) => void;
}

export interface StudentFiltersProps {
	optionClickHandler: (head: string, value: string | number) => void;
	role: string;
}

// Axios error type helper
export interface ApiError {
	response?: {
		data: {
			errors?: string[];
			message?: string;
			messages?: string[];
		};
	};
}

// Tag type for experience feed
export interface TagCount {
	tag: string;
	count: number;
}
