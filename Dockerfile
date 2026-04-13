FROM node:18-alpine

# 1. INDISPENSABLE : Installer openssl et libc6-compat pour Prisma sur Alpine
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# 2. On copie les fichiers de config et on installe
COPY package*.json ./
RUN npm install

# 3. On copie le reste (le dossier prisma doit être copié ICI)
COPY . .

# 4. Utiliser npx (qui gère mieux les chemins que le chemin relatif)
RUN npx prisma generate

EXPOSE 3000
CMD ["npm", "run", "dev"]