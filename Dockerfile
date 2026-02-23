FROM mcr.microsoft.com/playwright:v1.41.0-focal
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
ENTRYPOINT ["npx", "playwright", "test", "--reporter=html"]
