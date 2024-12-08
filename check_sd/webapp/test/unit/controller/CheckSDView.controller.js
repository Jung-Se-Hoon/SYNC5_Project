/*global QUnit*/

sap.ui.define([
	"zc501sdgw0006/check_sd/controller/CheckSDView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("CheckSDView Controller");

	QUnit.test("I should test the CheckSDView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
