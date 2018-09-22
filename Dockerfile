FROM node:10.9.0-alpine as lep

WORKDIR /srv

# Generate keypair. TODO sync across multiple instances
RUN apk update && apk add openssl
RUN openssl genrsa -out private.key 2048
RUN openssl rsa -pubout -in private.key -out public_key.pem

COPY --from=build_api /api /srv
COPY --from=build_spa /spa/dist /srv/spa 
CMD ["node", "app.js"]
