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
            // OData 모델 및 컨텍스트 설정
            var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZC501SDGW0004_SRV_01"), // 서비스 URL을 기존과 다르게 설정
                oSource = oEvent.getSource(),
                oContext = oSource.getBindingContext(),
                oData = oContext.getObject();
        
            // 자재 코드 가져오기
            var sMatnr = oData.Matnr; // 자재 코드
            if (!sMatnr) {
                sap.m.MessageToast.show("유효한 자재 코드가 없습니다.");
                return;
            }
        
            // KFlag 업데이트 데이터 생성
            var oUpdate = {
                Matnr: sMatnr,
                KFlag: "Y" // 승인 상태로 업데이트
            };
        
            console.log("업데이트 데이터:", oUpdate);
        
            // OData 요청 경로
            var sPath = "/PriceIncreaseAp2Set('" + sMatnr + "')"; // 단순 경로 사용
            console.log("OData 요청 경로:", sPath);
        
            // OData 업데이트 호출
            oModel.update(sPath, oUpdate, {
                success: function () {
                    sap.m.MessageToast.show("승인되었습니다.");
                    // UI 업데이트
                    oContext.getModel().setProperty(oContext.getPath() + "/KFlag", "Y");
                }.bind(this),
                error: function (oError) {
                    console.log(sPath, oUpdate);
                    console.error("업데이트 실패:", oError.responseText);
                    sap.m.MessageToast.show("업데이트에 실패했습니다.");
                }
            });
        },
        

        // 반려 버튼 로직
        onRejectPress: function (oEvent) {
            var oModel = this.getView().getModel(),
                oSource = oEvent.getSource(),
                oContext = oSource.getBindingContext(),
                oData = oContext.getObject();
        
            var sMatnr = oData.Matnr, // 자재 코드
                sCurrentPrice = parseFloat(oData.Kzwi1).toFixed(3); // 요청 단가
        
            // 데이터 검증
            if (!sMatnr) {
                sap.m.MessageToast.show("유효한 자재 코드가 없습니다.");
                return;
            }
            if (!sCurrentPrice || isNaN(sCurrentPrice)) {
                sap.m.MessageToast.show("유효한 단가가 없습니다.");
                return;
            }
        
            // 복합키 경로 구성
            var sPath = "/PriceIncreaseAp2Set(Matnr='" + encodeURIComponent(sMatnr) + "',Kzwi1=" + sCurrentPrice + ")";
        
            // 반려 상태 업데이트
            var oUpdate = { KFlag: "N" };
        
            oModel.update(sPath, oUpdate, {
                success: function () {
                    sap.m.MessageToast.show("반려되었습니다.");
                },
                error: function (oError) {
                    console.error("KFlag 업데이트 실패:", oError.responseText);
                    sap.m.MessageToast.show("업데이트에 실패했습니다.");
                }
            });
        }
    });
});
