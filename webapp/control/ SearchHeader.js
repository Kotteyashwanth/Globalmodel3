sap.ui.define([
  "sap/m/SearchField"
], function (SearchField) {
  "use strict";

  return SearchField.extend("project7.control.CustomSearch", {
    metadata: {
      properties: {
        placeholder: { type: "string", defaultValue: "Search..." }
      }
    },

    renderer: {}
  });
});