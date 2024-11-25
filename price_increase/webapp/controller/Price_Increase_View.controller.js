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

        onSavePress: function () 
        {
            var oDialog = this.byId("priceDialog"),
                oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZC501SDGW0001_SRV"),
                oContext = oDialog.getBindingContext(),
                oData = oContext.getObject();
                oUpdate  = {};
        
            // 자재 코드와 입력된 가격 가져오기
            var sMatnr = oData.Matnr,
                sNewPrice = this.byId("priceDialog").getContent()[0].getItems()[2].getValue();
                // sNewPrice = sap.ui.getCore().byId("kzwi1").getValue();

                // alert(sNewPrice);
        
            // 유효성 검사
            if (!sNewPrice || isNaN(sNewPrice)) {
                sap.m.MessageToast.show("유효한 가격을 입력하세요.");
                return;
            }
        
            // 업데이트 데이터 생성
            var oUpdate = {
                Matnr: sMatnr, // 자재 코드
                Kzwi1: parseFloat(sNewPrice).toFixed(3), // 소수점 3자리 형식으로 변환
                Waers: oData.Waers // 통화 코드
            };
        
            console.log("업데이트 데이터:", oUpdate);
        
            // 경로 생성
            var sPath = "/PriceIncreaseSet('" + sMatnr + "')";
            console.log("OData 요청 경로:", sPath);
        
            // OData 모델 업데이트 호출
            oModel.update(sPath, oUpdate, {
                success: function () {
                    sap.m.MessageToast.show("가격이 성공적으로 저장되었습니다.");
                    oModel.refresh();
                }.bind(this),
                error: function (oError) {
                    console.log(sPath, oUpdate)
                    console.error("업데이트 실패:", oError);
                    sap.m.MessageToast.show("가격 저장에 실패했습니다.");
                }
            });
        
            // 다이얼로그 닫기
            oDialog.close();
        },
        
        formatImagePath: function (Matnr) {
            // Matnr 값을 기반으로 이미지 경로 반환
            if (!Matnr) {
                return ""; // Matnr 값이 없으면 빈 문자열 반환
            }
            return sap.ui.require.toUrl("zc501sd/cds0001/priceincrease/img/" + Matnr + ".png");
        }

    });
});
