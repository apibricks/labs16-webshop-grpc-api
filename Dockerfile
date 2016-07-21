FROM mhart/alpine-node:6.2

VOLUME /api

EXPOSE 50051

RUN apk add --no-cache libc6-compat && rm -rf /var/cache/apk/* /root/.cache

RUN adduser -D runner

# Copy required files
COPY server.js package.json webshop.proto products.json /home/runner/

# copy the protofile to the apibricks location /api/main.proto
COPY webshop.proto /api/main.proto

RUN chown -R runner /home/runner


USER runner
WORKDIR /home/runner
RUN npm install

CMD ["node", "server.js"]
