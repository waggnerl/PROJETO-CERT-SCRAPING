const Sequelize= require("sequelize");
const  { Model } = require("sequelize");

module.exports = class Data extends Model {
  static init(sequelize) {
    super.init(
      { 
        common_name: {
          type: Sequelize.STRING,
          defaultValue: "",
        },
        alternatives_names: {
          type: Sequelize.STRING,
          defaultValue: "",
        },
        serial_number: {
          type: Sequelize.STRING,
          defaultValue: "",
        },
        ip: {
          type: Sequelize.STRING,
          defaultValue: "",
        },
        asn: {
          type: Sequelize.STRING,
          defaultValue: "",
        },        
      },
      {
        sequelize,
      }
    );
    return this;
  }

  
}
