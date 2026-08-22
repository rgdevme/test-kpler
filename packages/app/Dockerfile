FROM node:24-alpine AS build

RUN corepack enable && corepack prepare pnpm@11.5.2 --activate

WORKDIR /workspace

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY packages/server/package.json packages/server/package.json
COPY packages/app/package.json packages/app/package.json
COPY packages/e2e/package.json packages/e2e/package.json
RUN pnpm install --frozen-lockfile

COPY packages/server packages/server
COPY packages/app packages/app
RUN pnpm --filter @access/server generate:types
RUN pnpm --filter @access/app build

FROM nginx:1.29-alpine AS runtime

COPY packages/app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/packages/app/dist /usr/share/nginx/html

EXPOSE 8080
