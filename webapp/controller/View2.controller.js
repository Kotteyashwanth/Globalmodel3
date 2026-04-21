sap.ui.define([
  "sap/ui/core/mvc/Controller"
], function (Controller) {
  "use strict";

  return Controller.extend("project7.controller.View2", {

    onInit: function () {
  
      this.getOwnerComponent()
        .getRouter()
        .getRoute("detail")
        .attachPatternMatched(this._onObjectMatched, this);
    },

    _onObjectMatched: function (oEvent) {
      var sOrderId = oEvent.getParameter("arguments").orderId;


      var oModel = this.getOwnerComponent().getModel();
      var aOrders = oModel.getProperty("/Orders");


      var oSelected = aOrders.find(function (o) {
        return o.OrderID === sOrderId;
      });


      var oSelectedModel = this.getOwnerComponent().getModel("selected");
      oSelectedModel.setData(oSelected);
    },

    onBack: function () {
      this.getOwnerComponent().getRouter().navTo("main");
    }

  });
});
