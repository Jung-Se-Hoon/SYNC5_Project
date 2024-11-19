/*global QUnit*/

sap.ui.define([
	"zc501sdcds0001/price_increase/controller/Price_Increase_View.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Price_Increase_View Controller");

	QUnit.test("I should test the Price_Increase_View controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
