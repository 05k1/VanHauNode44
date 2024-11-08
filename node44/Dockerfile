# cai moi truong node
FROM node:20

# tao folder chua source code
WORKDIR /home/app

# copy file package.json va package-lock.json vao docker
COPY package*.json ./

#cai library trong file pkg.json
RUN npm install

# copy prisma tu local sang docker
# vua copy tu local vau tao folder moi co ten la prisma trong docker
COPY prisma ./prisma/

# tao prisma client
RUN npx prisma generate

# copy toan bo source code vao docker
COPY . .

# expose port
EXPOSE 8080

#chay source BE
CMD ["npm","run","start"]