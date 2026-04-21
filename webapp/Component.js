sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "project7/model/models"
], function (UIComponent, Device, JSONModel, models) {
    "use strict";

    return UIComponent.extend("project7.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init: function () {
      
            UIComponent.prototype.init.apply(this, arguments);

       
            this.setModel(models.createDeviceModel(), "device");

            var oSelectedModel = new JSONModel();
            this.setModel(oSelectedModel, "selected");

            var oFilterModel = new JSONModel({
                search: "",
                status: "",
                country: "",
                amount: ""
            });
            this.setModel(oFilterModel, "filters");

            // 🔹 Initialize Router
            this.getRouter().initialize();
        }
    });
});