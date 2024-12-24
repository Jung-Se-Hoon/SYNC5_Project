sap.ui.define([
    "sap/ui/core/mvc/Controller",         // 기본 컨트롤러
    "sap/ui/model/Filter",               // 필터 클래스
    "sap/ui/model/FilterOperator",       // 필터 연산자
    "sap/m/MessageToast",                // 메시지 토스트
    "sap/ui/model/json/JSONModel"        // JSON 모델 (필요한 경우)
], function (Controller, Filter, FilterOperator, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("zc501sd.cds0001.priceincrease.controller.Price_Increase_View", {

        onInit: function () {
            var sImagePath = sap.ui.require.toUrl("zc501sd/cds0001/priceincrease/img/ZDH.png");
            this.getView().byId("headerImage").setSrc(sImagePath);

            var oModel = this.getView().getModel();

            // 모델이 초기화되지 않은 경우 수동 설정
            if (!oModel) {
                console.error("모델이 초기화되지 않았습니다. 수동으로 설정합니다.");
                oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZC501SDGW0001_SRV/");
                this.getView().setModel(oModel);
            }

            // PriceIncreaseSet 데이터 로드
            oModel.read("/PriceIncreaseSet", {
                success: function (oData) {
                    console.log("PriceIncreaseSet 데이터 로드 성공:", oData.results);

                    // 데이터의 Category 추가
                    var aData = oData.results.map(function (item) {
                        item.Category = (item.Matnr.startsWith("MTD") || item.Matnr.startsWith("MTQ") || item.Matnr.startsWith("TPS"))
                            ? "일반" : "프리미엄";
                        return item;
                    });

                    // 모델에 데이터 갱신
                    oModel.setProperty("/PriceIncreaseSet", aData);
                },
                error: function (oError) {
                    console.error("PriceIncreaseSet 데이터 로드 실패:", oError);
                }
            });
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
            // 다이얼로그와 데이터 모델 참조
            var oDialog = this.byId("priceDialog"),
                oModel = this.getView().getModel(),
                oContext = oDialog.getBindingContext(),
                oData = oContext.getObject(); // 현재 바인딩된 데이터
        
            // 자재 코드와 기존 가격, 입력된 가격 가져오기
            var sMatnr = oData.Matnr,         // 자재 코드
                sNkzwi1 = oData.Kzwi1,        // 기존 가격 (새 입력 전에)
                sNewPrice = this.byId("kzwi1").getValue(); // 입력된 가격
        
            console.log("기존 가격(Nkzwi1):", sNkzwi1);
            console.log("새 가격(Kzwi1):", sNewPrice);
        
            // 유효성 검사
            if (!sNewPrice || isNaN(sNewPrice)) {
                sap.m.MessageToast.show("유효한 가격을 입력하세요.");
                return;
            }
        
            // 생성할 데이터 준비
            var oCreateData = {
                Matnr: sMatnr,               // 자재 코드
                Nkzwi1: parseFloat(sNkzwi1).toFixed(3), // 기존 가격 (새 데이터 생성 전)
                Kzwi1: parseFloat(sNewPrice).toFixed(3), // 입력된 새 가격
                Waers: oData.Waers          // 통화 코드
            };
        
            console.log("생성 데이터:", oCreateData);
        
            // OData 모델 CREATE 호출
            oModel.create("/PriceIncreaseSet", oCreateData, {
                success: function () {
                    sap.m.MessageToast.show("판매단가 수정 요청을 성공했습니다.");
                }.bind(this),
                error: function (oError) {
                    console.error("생성 실패:", oError);
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
