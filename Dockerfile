FROM node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g gulp

COPY . .

RUN gulp build

# Create dev cert
RUN openssl req \
    -new \
    -newkey rsa:4096 \
    -days 365 \
    -nodes \
    -x509 \
    -subj "/C=US/ST=Denial/L=Springfield/O=Dis/CN=www.example.com" \
    -keyout keytmp.pem \
    -out cert.pem
RUN openssl rsa -in keytmp.pem -out key.pem

EXPOSE 8080
CMD ["npm", "start"]
