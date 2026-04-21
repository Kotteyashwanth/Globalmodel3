sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
], function (Controller, Filter, FilterOperator) {
  "use strict";

  return Controller.extend("project7.controller.View1", {

    onInit: function () {
      var oRouter = this.getOwnerComponent().getRouter();
      oRouter.getRoute("main").attachPatternMatched(this._onRouteMatched, this);
    },

    _onRouteMatched: function () {
      var oTable = this.byId("orderTable");
      if (oTable) {
        oTable.removeSelections(true);
      }
    },

    // =========================
    // SEARCH FIELD
    // =========================
    onSearch: function () {
      this.applyFilters();
    },

    onSearchPress: function () {
      this.applyFilters();
    },

    // =========================
    // COMBOBOX FILTERS
    // =========================
    onFilterChange: function () {
      this.applyFilters();
    },

    // =========================
    // FACET FILTER (NEW)
    // =========================
    onFacetFilterConfirm: function (oEvent) {
      this._facetFilters = [];

      var mFacetFilter = oEvent.getParameter("filterList");

      for (var key in mFacetFilter) {

        var aSelectedItems = mFacetFilter[key].getSelectedItems();
        var aFilters = [];

        aSelectedItems.forEach(function (oItem) {
          aFilters.push(new Filter(key, FilterOperator.EQ, oItem.getText()));
        });

        if (aFilters.length > 0) {
          this._facetFilters.push(
            new Filter({
              filters: aFilters,
              and: false
            })
          );
        }
      }

      this.applyFilters();
    },

    onFacetFilterReset: function () {
      this._facetFilters = [];
      this.applyFilters();
    },

    // =========================
    // RESET ALL
    // =========================
    onReset: function () {

      var oFilterModel = this.getOwnerComponent().getModel("filters");

      oFilterModel.setData({
        search: "",
        status: "",
        country: "",
        amount: ""
      });

      this._facetFilters = [];

      this.byId("facetFilter").getFilterItems().forEach(function (oItem) {
        oItem.getItems().forEach(function (oSubItem) {
          oSubItem.setSelected(false);
        });
      });

      this.byId("orderTable").getBinding("items").filter([]);
    },

    // =========================
    // MASTER FILTER ENGINE
    // =========================
    applyFilters: function () {

      var oTable = this.byId("orderTable");
      var oBinding = oTable.getBinding("items");

      var oData = this.getOwnerComponent().getModel("filters").getData();

      var aFilters = [];

      // -------------------------
      // SEARCH FILTER
      // -------------------------
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

      // -------------------------
      // STATUS
      // -------------------------
      if (oData.status) {
        aFilters.push(new Filter("Status", FilterOperator.EQ, oData.status));
      }

      // -------------------------
      // COUNTRY
      // -------------------------
      if (oData.country) {
        aFilters.push(new Filter("Country", FilterOperator.EQ, oData.country));
      }

      // -------------------------
      // AMOUNT RANGE
      // -------------------------
      if (oData.amount === "low") {
        aFilters.push(new Filter("Amount", FilterOperator.LT, 500));

      } else if (oData.amount === "mid") {
        aFilters.push(new Filter({
          filters: [
            new Filter("Amount", FilterOperator.GE, 500),
            new Filter("Amount", FilterOperator.LE, 1000)
          ],
          and: true
        }));

      } else if (oData.amount === "high") {
        aFilters.push(new Filter("Amount", FilterOperator.GT, 1000));
      }

      // -------------------------
      // FACET FILTERS (IMPORTANT)
      // -------------------------
      if (this._facetFilters && this._facetFilters.length > 0) {
        aFilters = aFilters.concat(this._facetFilters);
      }

      // APPLY FINAL FILTER
      oBinding.filter(aFilters);
    },
    onThemeToggle: function () {

            var sCurrent = sap.ui.getCore().getConfiguration().getTheme();
            var sNewTheme;

            if (sCurrent === "sap_fiori_3") {
                sNewTheme = "sap_fiori_3_dark";
            } else {
                sNewTheme = "sap_fiori_3";
            }

            sap.ui.getCore().applyTheme(sNewTheme);
            localStorage.setItem("appTheme", sNewTheme);
        },

    // =========================
    // TABLE SELECT NAVIGATION
    // =========================
    onSelect: function (oEvent) {

      var oItem = oEvent.getParameter("listItem");
      if (!oItem) return;

      var oData = oItem.getBindingContext().getObject();

      this.getOwnerComponent().getModel("selected").setData(oData);

      this.getOwnerComponent().getRouter().navTo("detail", {
        orderId: oData.OrderID
      });
    }

  });
});
