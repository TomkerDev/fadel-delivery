FROM node:18-alpine

# Installation des dépendances système nécessaires pour Prisma sur Alpine
RUN apk add --no-cache openssl

WORKDIR /app

# On copie les fichiers de dépendances en premier pour optimiser le cache Docker
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Installation de Prisma de manière globale pour garantir l'accès à la CLI
RUN npm install -g prisma

# On copie le reste des fichiers (incluant le dossier prisma/)
COPY . .

# Génération du client Prisma
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]