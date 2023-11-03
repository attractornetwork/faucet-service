FROM node:16 as builder
WORKDIR /workbench
COPY package.json yarn.lock .
RUN yarn install
COPY . .
RUN yarn build
RUN yarn install --silent --prod --prefer-offline --frozen-lockfile --ignore-scripts

FROM node:16 as runtime
WORKDIR /app
COPY --from=builder /workbench/dist dist
COPY --from=builder /workbench/node_modules node_modules
ENV PORT 3000
EXPOSE $PORT
CMD ["node", "dist/main"]
