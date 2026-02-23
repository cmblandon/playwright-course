FROM mcr.microsoft.com/playwright:v1.41.0-focal
WORKDIR /app
COPY . .
RUN npm ci
ENTRYPOINT ["npx", "playwright", "test", "--reporter=html"]
