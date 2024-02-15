import './Structure.css';

const Structure = ({ LeftCompnonet, RightComponent, ContainerComponent }) => {
	return (
		<div className="structure-container">
			{ContainerComponent}
			<div className="structure-left">{LeftCompnonet}</div>
			<div className="structure-right">{RightComponent}</div>
		</div>
	);
};

export default Structure;
