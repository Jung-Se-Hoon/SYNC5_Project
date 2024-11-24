sap.ui.define([
    "sap/ui/core/mvc/Controller",         // 기본 컨트롤러
    "sap/ui/model/Filter",               // 필터 클래스
    "sap/ui/model/FilterOperator",       // 필터 연산자
    "sap/m/MessageToast",                // 메시지 토스트
    "sap/ui/model/json/JSONModel"        // JSON 모델 (필요한 경우)
],
function (Controller, Filter, FilterOperator, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("zc501sd.cds0001.priceincrease.controller.Price_Increase_View", {
        onInit: function () 
        {
            
            var sImagePath = sap.ui.require.toUrl("zc501sd/cds0001/priceincrease/img/MTD00000.png");
            this.getView().byId("headerImage").setSrc(sImagePath);

            var oModel = this.getView().getModel(); // 모델 가져오기
            oModel = null

    // 모델이 초기화되지 않았을 경우 로그 출력 및 반환
    if (!oModel) {
        console.error("모델이 초기화되지 않았습니다.");
        return;
    }

    // PriceIncreaseSet 경로의 데이터가 없는 경우 처리
    var aData = oModel.getProperty("/PriceIncreaseSet");
    if (!aData) {
        console.error("PriceIncreaseSet 경로에 데이터가 없습니다.");
        return;
    }

    // 데이터의 Category 추가
    aData.forEach(function (item) {
        if (item.Matnr.startsWith("MTD") || item.Matnr.startsWith("MTQ") || item.Matnr.startsWith("TPS")) {
            item.Category = "일반";
        } else {
            item.Category = "프리미엄";
        }
    });

    // 데이터 갱신
    oModel.setProperty("/PriceIncreaseSet", aData);

        },

        onTabSelect: function (oEvent) {
            var sKey = oEvent.getParameter("key"); // 선택된 탭의 key 가져오기
            this._applyFilter(sKey); // 필터 적용
        },

        _applyFilter: function (sKey) {
            var oList = this.getView().byId("gridList"); // GridList ID로 가져오기
        
            if (!oList) {
                console.error("GridList가 초기화되지 않았습니다.");
                return;
            }
        
            var oBinding = oList.getBinding("items");
        
            if (!oBinding) {
                console.error("GridList에 items 바인딩이 설정되지 않았습니다.");
                return;
            }
        
            // 필터 조건
            var aFilters = [];
            if (sKey === "PREMIUM") {
                aFilters.push(new Filter("Matnr", FilterOperator.StartsWith, "PM"));
            } else if (sKey === "STANDARD") {
                aFilters.push(new Filter({
                    filters: [
                        new Filter("Matnr", FilterOperator.StartsWith, "MT"),
                        new Filter("Matnr", FilterOperator.StartsWith, "TP")
                    ],
                    and: false // OR 조건
                }));
            }
        
            // 필터 적용
            oBinding.filter(aFilters);
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
            var sPath = oContext.getPath(); // 예: "/PriceIncreaseSet('MTD00000')"
        
            var sNewPrice = this.byId("priceDialog").getContent()[0].getItems()[2].getValue();
        
            if (!sNewPrice || isNaN(sNewPrice)) {
                sap.m.MessageToast.show("유효한 가격을 입력하세요.");
                return;
            }
        
            // 변경된 데이터 준비
            var oUpdatedData = {
                Kzwi1: sNewPrice
            };
        
            // OData 모델 업데이트 요청
            this.getView().getModel().update(sPath, oUpdatedData, {
                success: function () {
                    sap.m.MessageToast.show("가격이 성공적으로 저장되었습니다.");
                },
                error: function (oError) {
                    sap.m.MessageToast.show("가격 저장 중 오류가 발생했습니다.");
                    console.error(oError);
                }
            });
        
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
        },

        formatImagePath: function (sMatnr) {
            // Matnr 값을 기반으로 이미지 경로 반환
            if (!sMatnr) {
                return ""; // Matnr 값이 없으면 빈 문자열 반환
            }
            return sap.ui.require.toUrl("zc501sd/cds0001/priceincrease/img/" + sMatnr + ".png");
        }

    });
});
