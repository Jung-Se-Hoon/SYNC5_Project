/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"zc501sdcds0001/price_increase/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
