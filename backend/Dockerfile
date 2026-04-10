FROM node:20-slim AS base

RUN apt-get update && apt-get install -y \
    wget gnupg curl ca-certificates && \
    wget -O - https://packages.adoptium.net/artifactory/api/gpg/key/public | \
    gpg --dearmor -o /usr/share/keyrings/adoptium.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/adoptium.gpg] https://packages.adoptium.net/artifactory/deb $(. /etc/os-release && echo $VERSION_CODENAME) main" \
    > /etc/apt/sources.list.d/adoptium.list && \
    apt-get update && apt-get install -y temurin-21-jdk && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

RUN useradd -m -u 1001 sandbox && \
    mkdir -p /tmp/sandbox && \
    chown sandbox:sandbox /tmp/sandbox

ENV NODE_ENV=production
ENV JAVA_HOME=/usr/lib/jvm/temurin-21-jdk-amd64
ENV PATH=$JAVA_HOME/bin:$PATH

EXPOSE 3000

CMD ["node", "server.js"]
