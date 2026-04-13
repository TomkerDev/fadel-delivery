FROM node:18-alpine

# Installation des dépendances système nécessaires pour Prisma sur Alpine
RUN apk add --no-cache openssl

WORKDIR /app

# On copie les fichiers de dépendances en premier pour optimiser le cache Docker
COPY package*.json ./

# Installation des dépendances
RUN npm install

# On copie le reste des fichiers (incluant le dossier prisma/)
COPY . .

# Génération du client Prisma avec le CLI local installé par npm
RUN ./node_modules/.bin/prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]