const storeService = require('./store.service');

class StoreController {
  browseStores = async (req, res) => {
    const result = await storeService.browseStores(req.user.id, req.query);
    res.json(result);
  };

  submitRating = async (req, res) => {
    const result = await storeService.submitRating(
      req.user.id,
      Number(req.params.storeId),
      req.body
    );
    res.status(201).json(result);
  };
}

module.exports = new StoreController();
