FROM node:24-alpine AS build

RUN corepack enable && corepack prepare pnpm@11.5.2 --activate

WORKDIR /workspace

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY packages/server/package.json packages/server/package.json
COPY packages/app/package.json packages/app/package.json
COPY packages/e2e/package.json packages/e2e/package.json
RUN pnpm install --frozen-lockfile

COPY packages/server packages/server
RUN pnpm --filter @access/server generate:types
RUN pnpm --filter @access/server build

FROM node:24-alpine AS runtime

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
