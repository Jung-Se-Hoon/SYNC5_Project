sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/m/MessageToast',
    'sap/ui/Device',
    'sap/ui/model/json/JSONModel'
],
function (Controller, Filter, FilterOperator, MessageToast, Device, JSONModel) {
    "use strict";

    return Controller.extend("zc501sd.cds0001.priceincrease.controller.Price_Increase_View", {
        onInit: function () 
        {
            let oTable = this.getView().byId("priceList"),  // 현재 View에서 사용할 Table
                oBinding = oTable.getBinding("rows"),       // Binding으로 EntitySet 가져옴
                oFilter  = null;                            // 검색조건
                // aFilter  = []; (나는 검색조건이 1개라 이거 안해도됨)  
                
            oFilter = new Filter("Mtart", FilterOperator.EQ, "FERT" );
            
            // oBinding.filter(oFilter);

            // Image Test
            // Image Test

            // var bIsPhone = Device.system.phone,
			// svgLogo = sap.ui.require.toUrl("img"),
			// oImgModel;

			// this.getView().setModel(new JSONModel({
			// 	imageWidth: bIsPhone ? "5em" : "10em",
			// 	svgLogo: svgLogo
			// }));

			// // set explored app's demo model on this sample
			// oImgModel = new JSONModel(sap.ui.require.toUrl("sap/ui/demo/mock/img.json"));
			// this.getView().setModel(oImgModel, "img");

            // Image Test
            // Image Test
        },

        handleImage3Press: function(evt) {
			MessageToast.show("The image has been pressed");
		}
    });
});
