const ownerService = require('./owner.service');

class OwnerController {
  getDashboard = async (req, res) => {
    const result = await ownerService.getDashboard(req.user.id, req.query);
    res.json(result);
  };
}

module.exports = new OwnerController();
