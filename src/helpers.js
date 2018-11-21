function checkType(data, type) {
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
}

function validateData(data, schema, config, key = "root") {
  let invalidKeys = [];
  if (!checkType(data, schema.type)) {
    invalidKeys.push(key);
  } else if (schema.type === "array") {
    data.forEach(item => {
      invalidKeys = invalidKeys.concat(
        validateData(item, schema.items, config, key)
      );
    });
  } else if (schema.type === "object") {
    Object.keys(schema.properties).forEach(key => {
      let subSchema = schema.properties[key];
      let subData = data[config[key]];
      invalidKeys = invalidKeys.concat(
        validateData(subData, subSchema, config, key)
      );
    });
  }
  return [...new Set(invalidKeys)];
}

function formatData(data, schema, config) {
  if (schema.type === "array") {
    let formattedData = [];
    data.forEach(item => {
      formattedData.push(formatData(item, schema.items, config));
    });
    return formattedData;
  } else if (schema.type === "object") {
    let formattedData = { ...data };
    Object.keys(schema.properties).forEach(key => {
      let subSchema = schema.properties[key];
      let subData = data[config[key]];
      formattedData[subSchema.alias] = formatData(subData, subSchema, config);
    });
    return formattedData;
  } else {
    return data;
  }
}

function wordifySchema(schema, config, pluralize = false) {
  var result = "";
  if (schema.type === "array") {
    let type = pluralize ? "arrays" : "array";
    result += `${type} of ${wordifySchema(schema.items, config, true)}`;
  } else if (schema.type === "object") {
    let type = pluralize ? "hashes" : "hash";
    result += `${type} with key(s): `;
    let subResults = [];
    Object.keys(schema.properties).forEach(key => {
      let subsubResult = wordifySchema(schema.properties[key], config);
      subResults.push(
        `<strong>${config[key]}</strong>${
          subsubResult ? " (" + subsubResult + ")" : ""
        }`
      );
    });
    result += subResults.join(", ");
  }
  return result;
}

export function validateAndFormatData(data, schema, config) {
  let invalidKeys = validateData(data, schema, config);
  if (invalidKeys.length > 0) {
    return { invalidKeys };
  }
  let formattedData = formatData(data, schema, config);
  let wordifiedSchema = wordifySchema(schema, config);
  return { invalidKeys, formattedData, wordifiedSchema };
}
