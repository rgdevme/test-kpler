FROM node:24-alpine AS build

RUN corepack enable && corepack prepare pnpm@11.5.2 --activate

WORKDIR /workspace

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages/server/package.json packages/server/package.json
COPY packages/app/package.json packages/app/package.json
COPY packages/e2e/package.json packages/e2e/package.json
RUN pnpm install --frozen-lockfile

COPY turbo.json tsconfig.base.json eslint.config.js .prettierignore .prettierrc.json ./
COPY packages/server packages/server
COPY packages/app packages/app
RUN pnpm build

FROM node:24-alpine AS server-runtime

WORKDIR /workspace
ENV NODE_ENV=production

COPY --from=build /workspace/node_modules node_modules
COPY --from=build /workspace/packages/server/node_modules packages/server/node_modules
COPY --from=build /workspace/packages/server/package.json packages/server/package.json
COPY --from=build /workspace/packages/server/dist packages/server/dist

WORKDIR /workspace/packages/server
USER node

EXPOSE 3000
CMD ["node", "dist/main.js"]

FROM nginx:1.29-alpine AS app-runtime

COPY packages/app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/packages/app/dist /usr/share/nginx/html

EXPOSE 8080
