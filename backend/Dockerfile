FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
# RUN export http_proxy="http://host:port"
# RUN export https_proxy="http://host:port"
CMD ["node", "index.mjs"]