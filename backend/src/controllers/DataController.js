const Data = require("../models/Data")

class DataController {
  async store(req, res) {
    try {
      const newData = await Data.create(req.body);
      const { id, common_name, alternatives_names, serial_number, ip, asn} = newData;
      return res.json({ id, common_name, alternatives_names, serial_number, ip, asn });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  // Index
  async index(req, res) {
    try {
      const dados = await Data.findAll({ attributes: ["id", "common_name", "alternatives_names","serial_number","ip","asn"] });
      return res.json(dados);
    } catch (e) {
      return res.json(null);
    }
  }
}

module.exports = new DataController();
