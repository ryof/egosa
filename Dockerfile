FROM node:5.11
MAINTAINER ryof
WORKDIR /root
RUN npm install config ntwitter pushover-notifications colors
RUN npm install -g forever
RUN mkdir config
ADD default.json /root/config/
ADD egosa.js /root/
CMD ["forever", "egosa.js"]
