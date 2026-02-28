import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiSearch } from 'react-icons/fi';

export interface Column<T> {
	key: string;
	label: string;
	width?: number;
	render?: (row: T) => React.ReactNode;
	sortable?: boolean;
}

interface Props<T> {
	data: T[];
	columns: Column<T>[];
	onRowClick?: (row: T) => void;
	searchKeys?: string[];
}

const th: React.CSSProperties = {
	padding: '.6rem .75rem',
	textAlign: 'left',
	fontSize: '.75rem',
	fontWeight: 600,
	textTransform: 'uppercase',
	letterSpacing: '.5px',
	color: 'var(--primary)',
	borderBottom: '1px solid rgba(139,92,246,.15)',
	cursor: 'pointer',
	userSelect: 'none',
	whiteSpace: 'nowrap',
	position: 'sticky',
	top: 0,
	background: 'var(--bg1)',
	zIndex: 1
};
const td: React.CSSProperties = {
	padding: '.55rem .75rem',
	fontSize: '.85rem',
	borderBottom: '1px solid var(--border)',
	color: 'var(--text)',
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	maxWidth: 220
};
const input: React.CSSProperties = {
	padding: '.45rem .75rem .45rem 2rem',
	background: 'var(--bg1)',
	border: '1px solid var(--border)',
	borderRadius: 'var(--r1)',
	color: 'var(--text)',
	fontSize: '.85rem',
	outline: 'none',
	width: '100%',
	maxWidth: 280,
	transition: 'border .2s'
};

function getNestedValue(obj: any, path: string): any {
	return path.split('.').reduce((o, k) => o?.[k], obj);
}

function DataTable<T extends Record<string, any>>({ data, columns, onRowClick, searchKeys }: Props<T>) {
	const [search, setSearch] = useState('');
	const [sortKey, setSortKey] = useState('');
	const [sortAsc, setSortAsc] = useState(true);

	const filtered =
		search && searchKeys
			? data.filter((row) =>
					searchKeys.some((k) =>
						String(getNestedValue(row, k) ?? '')
							.toLowerCase()
							.includes(search.toLowerCase())
					)
				)
			: data;

	const sorted = sortKey
		? [...filtered].sort((a, b) => {
				const av = getNestedValue(a, sortKey),
					bv = getNestedValue(b, sortKey);
				const cmp = av < bv ? -1 : av > bv ? 1 : 0;
				return sortAsc ? cmp : -cmp;
			})
		: filtered;

	const toggleSort = (key: string) => {
		if (sortKey === key) setSortAsc(!sortAsc);
		else {
			setSortKey(key);
			setSortAsc(true);
		}
	};

	return (
		<div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '.5rem' }}>
			{searchKeys && (
				<div style={{ position: 'relative', flexShrink: 0 }}>
					<FiSearch style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--dim)', fontSize: '.9rem' }} />
					<input
						style={input}
						placeholder="Search..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
						onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
					/>
				</div>
			)}
			<div style={{ flex: 1, overflow: 'auto', borderRadius: 'var(--r2)', border: '1px solid var(--border)', background: 'rgba(12,12,22,.4)' }}>
				<table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
					<thead>
						<tr>
							{columns.map((col) => (
								<th key={col.key} style={{ ...th, width: col.width }} onClick={() => col.sortable !== false && toggleSort(col.key)}>
									<span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
										{col.label}
										{sortKey === col.key && (sortAsc ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />)}
									</span>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{sorted.length === 0 ? (
							<tr>
								<td colSpan={columns.length} style={{ ...td, textAlign: 'center', color: 'var(--dim)', padding: '2rem' }}>
									No data
								</td>
							</tr>
						) : (
							sorted.map((row, i) => (
								<tr
									key={(row as any)._id || i}
									onClick={() => onRowClick?.(row)}
									style={{ cursor: onRowClick ? 'pointer' : 'default', transition: 'background .15s' }}
									onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(139,92,246,.06)')}
									onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
								>
									{columns.map((col) => (
										<td key={col.key} style={td}>
											{col.render ? col.render(row) : String(getNestedValue(row, col.key) ?? '—')}
										</td>
									))}
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
			<div style={{ fontSize: '.8rem', color: 'var(--dim)', textAlign: 'right', flexShrink: 0 }}>
				{sorted.length} of {data.length} records
			</div>
		</div>
	);
}

export default DataTable;
