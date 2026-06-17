const authService = require('./auth.service');

class AuthController {
  register = async (req, res) => {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  };

  login = async (req, res) => {
    const result = await authService.login(req.body);
    res.json(result);
  };

  updatePassword = async (req, res) => {
    const result = await authService.updatePassword(req.user.id, req.body);
    res.json(result);
  };

  getProfile = async (req, res) => {
    const result = await authService.getProfile(req.user.id);
    res.json(result);
  };
}

module.exports = new AuthController();
