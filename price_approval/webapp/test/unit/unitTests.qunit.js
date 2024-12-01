/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"zc501sdgw0004/price_approval/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
