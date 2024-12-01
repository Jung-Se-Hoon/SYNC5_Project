sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast" 
],
function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("zc501sd.gw0004.priceapproval.controller.ApprovalView", {
        onInit: function () 
        {
            

        },

        // 새로고침 버튼 로직
        onRefreshPress: function () {
            var oModel = this.getView().getModel();
            oModel.refresh(true); // 데이터 새로고침
            MessageToast.show("데이터가 새로고침되었습니다.");
        },

        // 승인 버튼 로직
        onApprovePress: function (oEvent) {
            this._updateKFlag(oEvent, "APPROVED"); // 승인 상태
        },

        // 반려 버튼 로직
        onRejectPress: function (oEvent) {
            this._updateKFlag(oEvent, "REJECTED"); // 반려 상태
        },

        // KFlag 업데이트 공통 로직
        _updateKFlag: function (oEvent, sStatus) {
            var oModel = this.getView().getModel(),
                oSource = oEvent.getSource(),
                oContext = oSource.getBindingContext(),
                oData = oContext.getObject();
        
            var sMatnr = oData.Matnr,
                sCurrentPrice = oData.Kzwi1;
        
            // 데이터 검증
            if (!sCurrentPrice || isNaN(sCurrentPrice)) {
                sap.m.MessageToast.show("유효한 가격을 입력하세요.");
                return;
            }
        
            // 기본값 추가
            var oUpdate = {
                Matnr: sMatnr,
                Kzwi1: parseFloat(sCurrentPrice).toFixed(3), // 소수점 변환
                KFlag: sStatus === "APPROVED" ? "A" : "R" // 승인/반려 상태
            };
        
            var sPath = "/PriceIncreaseAp2Set(Matnr='" + sMatnr + "',Kzwi1=" + parseFloat(sCurrentPrice).toFixed(3) + ")";
        
            oModel.update(sPath, oUpdate, {
                success: function () {
                    sap.m.MessageToast.show(sStatus === "APPROVED" ? "승인되었습니다." : "반려되었습니다.");
                },
                error: function (oError) {
                    console.error("KFlag 업데이트 실패:", oError.responseText);
                    sap.m.MessageToast.show("업데이트에 실패했습니다.");
                }
            });
        }
        
        
        
        
        

    });
});
