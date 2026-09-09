FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

ARG BACKEND_URL
ENV BACKEND_URL=$BACKEND_URL

RUN pnpm build

EXPOSE 8080

CMD ["sh", "-c", "pnpm start --hostname 0.0.0.0 --port ${PORT:-8080}"]