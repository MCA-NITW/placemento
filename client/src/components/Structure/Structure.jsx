import PropTypes from 'prop-types';
import './Structure.css';

const Structure = ({ LeftComponent, RightComponent, ContainerComponent }) => {
	return (
		<div className="structure-container">
			{ContainerComponent}
			<div className="structure-left">{LeftComponent}</div>
			<div className="structure-right">{RightComponent}</div>
		</div>
	);
};

Structure.propTypes = {
	LeftComponent: PropTypes.element.isRequired,
	RightComponent: PropTypes.element.isRequired,
	ContainerComponent: PropTypes.element.isRequired
};

export default Structure;
