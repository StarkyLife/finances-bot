docker build -t finances-bot .
docker run --name fin-bot -d -p 8080:8080 finances-bot
