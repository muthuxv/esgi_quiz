const jwt = require("jsonwebtoken");

module.exports = function SecurityController(UserService) {
  return {
    login: async (req, res, next) => {
      try {
        const { login, password } = req.body;

        if (!login || !password) {
          return res.status(400).json({ error: "Le login et le mot de passe sont des champs obligatoires." });
        }

        const user = await UserService.login(login, password);

        if (!user) {
          return res.status(401).json({ error: "Identifiants invalides." });
        }

        const token = jwt.sign({ id: user.id, login: user.login, role: user.role }, process.env.JWT_SECRET, {
          expiresIn: "24h",
        });

        res.status(200).json({ token });
      } catch (err) {
        next(err);
      }
    },
    logout: async (req, res, next) => {
      try {
        res.status(200).json({ message: 'Vous êtes déconnecté.' });
      } catch (err) {
        next(err);
      }
    },
  };
}