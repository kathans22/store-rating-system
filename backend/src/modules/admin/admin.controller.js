const adminService = require('./admin.service');

class AdminController {
  getDashboardStats = async (_req, res) => {
    const stats = await adminService.getDashboardStats();
    res.json(stats);
  };

  createUser = async (req, res) => {
    const result = await adminService.createUser(req.body);
    res.status(201).json(result);
  };

  getUsers = async (req, res) => {
    const result = await adminService.getManagedUsers(req.query);
    res.json(result);
  };

  getAllUsers = async (req, res) => {
    const result = await adminService.getAllUsers(req.query);
    res.json(result);
  };

  getUserById = async (req, res) => {
    const result = await adminService.getUserById(Number(req.params.id));
    res.json(result);
  };

  createStore = async (req, res) => {
    const result = await adminService.createStore(req.body);
    res.status(201).json(result);
  };

  getStores = async (req, res) => {
    const result = await adminService.getStores(req.query);
    res.json(result);
  };

  getStoreOwners = async (_req, res) => {
    const result = await adminService.getStoreOwners();
    res.json(result);
  };
}

module.exports = new AdminController();
