FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy application code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 5000

# Start script
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]