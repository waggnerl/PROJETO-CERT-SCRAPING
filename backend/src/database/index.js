const { Sequelize } = require("sequelize");
const databaseConfig = require("../config/database");
const Data = require("../models/Data");

const models = [Data];
const connection = new Sequelize(databaseConfig);

models.forEach((model) => model.init(connection));
models.forEach(
  (model) => model.associate && model.associate(connection.models)
);
