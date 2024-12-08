/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"zc501sdgw0006/check_sd/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
