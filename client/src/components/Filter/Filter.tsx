import type { FilterProps, SelectOption } from '../../types';
import './Filter.css';

const Filter = ({ allOptions, optionClickHandler }: FilterProps) => {
	const optionsRenderer = (head: string, options: SelectOption[]) => {
		return (
			<div className="filter__item">
				<div className="filter__item__label">{head}</div>
				<div className="filter__item__values">
					{options.map((option) => (
						<button
							key={option.value}
							id={`${head.toLowerCase()}-${option.value}`}
							className="filter__item__value"
							onClick={() => optionClickHandler(head, option.value)}
						>
							{option.label}
						</button>
					))}
				</div>
			</div>
		);
	};
	return (
		<div className="filter">
			<h3>Filters</h3>
			{Object.keys(allOptions).map((key) => optionsRenderer(key, allOptions[key]))}
		</div>
	);
};

export default Filter;
