"use strict";Object.defineProperty(exports, "__esModule", {value: true}); const lowerAndSpaces = (string) => {
    return string.toLowerCase().replace(/\s/g, '')
}; exports.lowerAndSpaces = lowerAndSpaces

 const stringToBoolean = (string) => {
    switch(string.toLowerCase().trim()){
        case "true": 
        case "yes": 
        case "1": 
          return true;

        case "false": 
        case "no": 
        case "0": 
        case null: 
          return false;

        default: 
          return Boolean(string);
    }
}; exports.stringToBoolean = stringToBoolean