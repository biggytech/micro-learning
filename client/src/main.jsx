import React from 'react';
import ReactDOM from 'react-dom';

import Controller from './Controller.jsx';

window.addEventListener('load', onLoad);

function onLoad() {
	ReactDOM.render(<Controller />, document.getElementById('app'));
}
