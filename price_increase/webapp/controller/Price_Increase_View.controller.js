sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("zc501sd.cds0001.priceincrease.controller.Price_Increase_View", {
        onInit: function () 
        {
            var sImagePath = sap.ui.require.toUrl("zc501sd/cds0001/priceincrease/img/MTD00000.png");
            this.getView().byId("headerImage").setSrc(sImagePath);

            // var sImagePath2 = sap.ui.require.toUrl("zc501sd/cds0001/priceincrease/img/{Matnr}.png");
            // this.getView().byId("itemImage").setSrc(sImagePath2);
        },

        onImagePress: function (oEvent) {
            // 선택된 데이터 바인딩
            var oSource = oEvent.getSource();
            var oContext = oSource.getBindingContext();
            
            // 다이얼로그 가져오기
            var oDialog = this.byId("priceDialog");
            oDialog.setBindingContext(oContext);
            oDialog.open();
        },
        
        onEditPress: function () {
            // 수정 버튼 클릭 시 로직
            sap.m.MessageToast.show("수정 버튼이 클릭되었습니다.");
        },
        
        onCancelPress: function () {
            // 다이얼로그 닫기
            this.byId("priceDialog").close();
        },

        onPriceChange: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            // 입력 값 검증 로직 (예: 음수 값 방지)
            if (sValue < 0) {
                sap.m.MessageToast.show("가격은 음수일 수 없습니다.");
                oEvent.getSource().setValue(0);
            }
        },

        onSavePress: function () {
            var oDialog = this.byId("priceDialog");
            var oContext = oDialog.getBindingContext();
            
            // 수정된 Kzwi1 값을 가져오기
            var sNewPrice = oDialog.getContent()[0].getItems()[2].getValue(); // Input 필드의 값
            
            // 데이터 모델에 값 업데이트
            oContext.getModel().setProperty(oContext.getPath() + "/Kzwi1", sNewPrice);
            
            // 서버로 업데이트 요청 전송 (필요시)
            this._updatePriceOnServer(oContext.getPath(), sNewPrice);
        
            sap.m.MessageToast.show("가격이 저장되었습니다.");
            oDialog.close();
        },
        
        _updatePriceOnServer: function (sPath, sNewPrice) {
            // ODataModel 또는 백엔드와의 통신 로직 구현
            var oModel = this.getView().getModel();
            oModel.update(sPath, { Kzwi1: sNewPrice }, {
                success: function () {
                    sap.m.MessageToast.show("서버에 성공적으로 저장되었습니다.");
                },
                error: function () {
                    sap.m.MessageToast.show("서버 업데이트 중 오류가 발생했습니다.");
                }
            });
        }

    });
});
