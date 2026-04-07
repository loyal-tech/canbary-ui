# Stage 1: Build the application
FROM node:18-alpine AS build  
WORKDIR /usr/src/app

# Ensure overrides are present before install
COPY package*.json ./

# This will now respect "overrides"
RUN npm install --force

COPY . .

RUN mkdir -p /etc/certi
RUN NODE_OPTIONS=--openssl-legacy-provider npm run build

# Stage 2: Create the final image
FROM nginx:1.17.1-alpine

COPY domain.crt /etc/certi/domain.crt
COPY domain.key /etc/certi/domain.key

COPY --from=build /usr/src/app/dist/AdoptGui /usr/share/nginx/html
COPY nginx-http.conf /etc/nginx/conf.d/default.conf
COPY nginx-https.conf /etc/nginx/conf.d/https.conf

EXPOSE 80
EXPOSE 443

CMD ["/bin/sh", "-c", "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
