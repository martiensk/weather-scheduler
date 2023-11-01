FROM node:lts
# Copy apps across
COPY ./ /usr/src/app/
WORKDIR /usr/src/app
# Install dependencies
RUN npm install
RUN npm run build:all
RUN npm i -g pm2
# Expose ports 3000 for the FE and 5000 for the BE
EXPOSE 3000
EXPOSE 5000
# Run the app
CMD ["pm2-runtime", "ecosystem.config.js"]