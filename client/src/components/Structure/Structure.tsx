import type { StructureProps } from '../../types';
import './Structure.css';

const Structure = ({ LeftComponent, RightComponent, ContainerComponent }: StructureProps) => {
	return (
		<div className="structure-container">
			{ContainerComponent}
			<div className="structure-left">{LeftComponent}</div>
			<div className="structure-right">{RightComponent}</div>
		</div>
	);
};

export default Structure;
