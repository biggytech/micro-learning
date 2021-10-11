import React from 'react';
import PropTypes from 'prop-types';

function Header(props) {
	const { children } = props;

	return (
		<div className="header">
			<a href="/index.html" className="header__link">
				<img
					src="./images/logo_small.png"
					srcSet="./images/logo_small.png  85w, ./images/logo.png 129w"
					sizes="(max-width: 500px) 85px, 129px"
					alt="Micro Learning"
				/>
			</a>
			<div className="info-block">{children}</div>
		</div>
	);
}

Header.propTypes = {
	children: PropTypes.node.isRequired,
};

Header.defaultProps = {};

export default Header;
