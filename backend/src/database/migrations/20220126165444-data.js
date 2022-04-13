module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("data", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },      
      common_name: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      alternatives_names: {
        type: Sequelize.STRING(400),
        allowNull: true,
      },
      serial_number: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      ip: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      asn: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    }),

  down: (queryInterface) => queryInterface.dropTable("data"),
};
