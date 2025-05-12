FROM node:22-alpine

WORKDIR /app

# Copiar apenas package.json e package-lock.json primeiro para aproveitar o cache do Docker
COPY package*.json ./

# Copiar a pasta prisma antes de instalar as dependências
COPY prisma/ ./prisma/

# Instalar dependências
RUN npm install

# Copiar o resto dos arquivos do projeto
COPY . .

# Executar o build da aplicação apenas em produção
RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi

EXPOSE 3000

# Usar npm run dev em desenvolvimento, npm start em produção
CMD ["npm", "run", "dev"]
