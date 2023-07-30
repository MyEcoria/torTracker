FROM node:16

# Install WireGuard
RUN apt-get update && apt-get install -y wireguard

# Set the working directory and copy the necessary files
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Copy the WireGuard configuration file into the container
COPY wg0.conf /etc/wireguard/

# Expose the necessary ports (if needed)
EXPOSE 3001

# Uncomment the following lines if you need to set proxy environment variables
# RUN export http_proxy="http://host:port"
# RUN export https_proxy="http://host:port"

# Start WireGuard and your Node.js application
CMD ["sh", "-c", "wg-quick up wg0 && node index.mjs"]