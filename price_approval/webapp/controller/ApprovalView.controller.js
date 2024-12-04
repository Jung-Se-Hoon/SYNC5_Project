sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("zc501sd.gw0004.priceapproval.controller.ApprovalView", {
        onInit: function () {
            // 초기화 로직 추가 가능
        },

        // 새로고침 버튼 로직
        onRefreshPress: function () {
            var oModel = this.getView().getModel();
            oModel.refresh(true); // 데이터 새로고침
            MessageToast.show("데이터가 새로고침되었습니다.");
        },

        // 승인 버튼 로직
        onApprovePress: function (oEvent) {
            var oSource = oEvent.getSource();
            var oContext = oSource.getBindingContext();
            var oModel = this.getView().getModel();
            var oData = oContext.getObject();
        
            var sMatnr = oData.Matnr;
            var sSeq = oData.Seq;
        
            if (!sMatnr || !sSeq) {
                sap.m.MessageToast.show("유효한 키 값이 없습니다.");
                return;
            }
        
            var sPath = "/PriceIncreaseAp2Set(Matnr='" + encodeURIComponent(sMatnr) + "',Seq=" + sSeq + ")";
            var oUpdate = { KFlag: "Y" };
        
            // 승인 버튼 비활성화
            var oHBox = oSource.getParent();
            oHBox.getItems().forEach(function (oButton) {
                oButton.setEnabled(false);
            });
        
            oModel.update(sPath, oUpdate, {
                success: function () {
                    sap.m.MessageToast.show("승인되었습니다.");
                    oContext.getModel().setProperty(oContext.getPath() + "/KFlag", "Y"); // 모델 상태 업데이트
                },
                error: function () {
                    sap.m.MessageToast.show("업데이트에 실패했습니다.");
                }
            });
        },
        
        onRejectPress: function (oEvent) {
            var oSource = oEvent.getSource();
            var oContext = oSource.getBindingContext();
            var oModel = this.getView().getModel();
            var oData = oContext.getObject();
        
            var sMatnr = oData.Matnr;
            var sSeq = oData.Seq;
        
            if (!sMatnr || !sSeq) {
                sap.m.MessageToast.show("유효한 키 값이 없습니다.");
                return;
            }
        
            var sPath = "/PriceIncreaseAp2Set(Matnr='" + encodeURIComponent(sMatnr) + "',Seq=" + sSeq + ")";
            var oUpdate = { KFlag: "N" };
        
            // 반려 버튼 비활성화
            var oHBox = oSource.getParent();
            oHBox.getItems().forEach(function (oButton) {
                oButton.setEnabled(false);
            });
        
            oModel.update(sPath, oUpdate, {
                success: function () {
                    sap.m.MessageToast.show("반려되었습니다.");
                    oContext.getModel().setProperty(oContext.getPath() + "/KFlag", "N"); // 모델 상태 업데이트
                },
                error: function () {
                    sap.m.MessageToast.show("업데이트에 실패했습니다.");
                }
            });
        }
        
        
        
        
        
    });
});
