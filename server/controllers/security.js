const jwt = require("jsonwebtoken");

module.exports = function SecurityController(User) {
  return {
    login: async (req, res, next) => {
      try {
        const { login, password } = req.body;

        if (!login || !password) {
          return res.status(400).json({ error: "Le login et le mot de passe sont des champs obligatoires." });
        }
        
        const user = await User.findOne({ where: { login } });
        // const token = jwt.sign(
        //   { id: user.id, login: user.login, role_libelle: user.role },
        //   process.env.JWT_SECRET,
        //   {
        //     expiresIn: "3h",
        //   }
        // );
        res.json({ user });
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