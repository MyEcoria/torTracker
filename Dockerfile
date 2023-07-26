FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
RUN export http_proxy="http://arnhfanj-rotate:s63wes3krp6g@p.webshare.io:80/"
RUN export https_proxy="http://arnhfanj-rotate:s63wes3krp6g@p.webshare.io:80/"
CMD ["node", "index.mjs"]