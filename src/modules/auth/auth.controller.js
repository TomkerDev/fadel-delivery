const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.register = async (req, res) => {
  const { email, password, name, role } = req.body; // role: 'ADMIN', 'CLIENT', 'LIVREUR', 'PROPRIETAIRE'
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, role }
    });
    res.status(201).json({ message: "Compte créé avec succès", userId: user.id });
  } catch (error) {
    res.status(400).json({ error: "Cet email est déjà utilisé." });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({ 
      token, 
      user: { id: user.id, name: user.name, role: user.role } 
    });
  } else {
    res.status(401).json({ error: "Email ou mot de passe incorrect." });
  }
};