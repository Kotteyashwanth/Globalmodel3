sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/model/json/JSONModel",
  "sap/ui/core/Core"
], function (Controller, Filter, FilterOperator, JSONModel, Core) {
  "use strict";

  return Controller.extend("project7.controller.View1", {


    onInit: function () {
      var oFilterModel = new JSONModel({
        search: "",
        status: "",
        country: "",
        amount: ""
      });

      this.getOwnerComponent().setModel(oFilterModel, "filters");
    },

    onUpdateFinished: function (oEvent) {
      var iCount = oEvent.getParameter("total");
      this.getView().getModel().setProperty("/orderCount", iCount);
    },

  
    _applyAllFilters: function () {

      var oTable = this.byId("orderTable");
      var oBinding = oTable.getBinding("items");
      if (!oBinding) return;

      var aFilters = [];

      var oData = this.getOwnerComponent().getModel("filters").getData();

  
      if (oData.search) {
        aFilters.push(new Filter({
          filters: [
            new Filter("OrderID", FilterOperator.Contains, oData.search),
            new Filter("Customer", FilterOperator.Contains, oData.search),
            new Filter("Country", FilterOperator.Contains, oData.search)
          ],
          and: false
        }));
      }

      
      if (oData.status) {
        aFilters.push(new Filter("Status", FilterOperator.EQ, oData.status));
      }

      
      if (oData.country) {
        aFilters.push(new Filter("Country", FilterOperator.EQ, oData.country));
      }

      if (oData.amount === "low") {
        aFilters.push(new Filter("Amount", FilterOperator.LT, 500));
      } else if (oData.amount === "mid") {
        aFilters.push(new Filter("Amount", FilterOperator.BT, 500, 1000));
      } else if (oData.amount === "high") {
        aFilters.push(new Filter("Amount", FilterOperator.GT, 1000));
      }

      var oFacet = this.byId("facetFilter");

      if (oFacet) {
        oFacet.getLists().forEach(function (oList) {

          var aSelected = oList.getSelectedItems();

          if (aSelected.length > 0) {

            var aSubFilters = [];

            aSelected.forEach(function (oItem) {
              aSubFilters.push(
                new Filter(oList.getKey(), FilterOperator.EQ, oItem.getKey())
              );
            });

         
            aFilters.push(new Filter({
              filters: aSubFilters,
              and: false
            }));
          }
        });
      }

      oBinding.filter(aFilters);
    },

   
    onSearch: function (oEvent) {
      var sValue = oEvent.getParameter("newValue");
      this.getOwnerComponent().getModel("filters").setProperty("/search", sValue);
      this._applyAllFilters();
    },

    onFilterChange: function () {
      this._applyAllFilters();
    },

    onSearchPress: function () {
      this._applyAllFilters();
    },

    onFacetConfirm: function () {
      this._applyAllFilters();
    },

  
    onReset: function () {

      
      this.getOwnerComponent().getModel("filters").setData({
        search: "",
        status: "",
        country: "",
        amount: ""
      });

     
      this.byId("searchField").setValue("");
      this.byId("statusFilter").setSelectedKey("");
      this.byId("countryFilter").setSelectedKey("");
      this.byId("amountFilter").setSelectedKey("");

     
      var oFacet = this.byId("facetFilter");
      if (oFacet) {
        oFacet.getLists().forEach(function (oList) {
          oList.removeSelections(true);
        });
      }

      // Clear table filters
      var oBinding = this.byId("orderTable").getBinding("items");
      if (oBinding) {
        oBinding.filter([]);
      }
    },

   
    onSelect: function (oEvent) {
      var oItem = oEvent.getSource().getSelectedItem();
      if (!oItem) return;

      var oData = oItem.getBindingContext().getObject();

      this.getOwnerComponent().getModel("selected").setData(oData);

      this.getOwnerComponent().getRouter().navTo("detail", {
        orderId: oData.OrderID
      });
    },

   
    onThemeToggle: function () {
      var sTheme = Core.getConfiguration().getTheme();
      Core.applyTheme(
        sTheme === "sap_fiori_3" ? "sap_fiori_3_dark" : "sap_fiori_3"
      );
    }

  });
});