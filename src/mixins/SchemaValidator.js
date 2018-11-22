export default {
  data: function() {
    return {
      wordifiedSchema: ""
    };
  },
  created: function() {
    this.wordifiedSchema = this.wordifySchema(this.schema, this.appConfig);
  },
  methods: {
    checkType: function(data, type) {
      if (type === "integer") {
        return Number.isInteger(data);
      }
      if (type === "number") {
        return !isNaN(data);
      }
      if (type === "string") {
        return Object.prototype.toString.call(data) === "[object String]";
      }
      if (type === "array") {
        return Array.isArray(data);
      }
      if (type === "object") {
        return data === Object(data);
      }
      return false;
    },
    validateData: function(data, schema, config, key = "root") {
      let invalidKeys = [];
      if (!this.checkType(data, schema.type)) {
        invalidKeys.push(key);
      } else if (schema.type === "array") {
        data.forEach(item => {
          invalidKeys = invalidKeys.concat(this.validateData(item, schema.items, config, key));
        });
      } else if (schema.type === "object") {
        Object.keys(schema.properties).forEach(key => {
          let subSchema = schema.properties[key];
          let subData = data[config[key]];
          invalidKeys = invalidKeys.concat(this.validateData(subData, subSchema, config, key));
        });
      }
      return [...new Set(invalidKeys)];
    },
    formatData: function(data, schema, config) {
      if (schema.type === "array") {
        let formattedData = [];
        data.forEach(item => {
          formattedData.push(this.formatData(item, schema.items, config));
        });
        return formattedData;
      } else if (schema.type === "object") {
        let formattedData = { ...data };
        Object.keys(schema.properties).forEach(key => {
          let subSchema = schema.properties[key];
          let subData = data[config[key]];
          formattedData[subSchema.alias] = this.formatData(subData, subSchema, config);
        });
        return formattedData;
      } else {
        return data;
      }
    },
    wordifySchema: function(schema, config, pluralize = false) {
      var result = "";
      if (schema.type === "array") {
        let type = pluralize ? "arrays" : "array";
        result += `${type} of ${this.wordifySchema(schema.items, config, true)}`;
      } else if (schema.type === "object") {
        let type = pluralize ? "hashes" : "hash";
        result += `${type} with key(s): `;
        let subResults = [];
        Object.keys(schema.properties).forEach(key => {
          let subsubResult = this.wordifySchema(schema.properties[key], config);
          subResults.push(`<strong>${config[key]}</strong>${subsubResult ? " (" + subsubResult + ")" : ""}`);
        });
        result += subResults.join(", ");
      }
      return result;
    },
    formatDataToSchema: function(data) {
      let invalidKeys = this.validateData(data, this.schema, this.appConfig);
      if (invalidKeys.length > 0) {
        this.$emit("showError", invalidKeys);
        return;
      } else {
        return this.formatData(data, this.schema, this.appConfig);
      }
    }
  }
};
