# Bilico
A Social Media For Professionals
https://bilico.vercel.app/

## How to run locally

Clone the repo and install dependencies by
```console
git clone https://github.com/raozaeemshahid/bilico 
cd bilico
npm i
```

Create a `.env` as given in `.env_example` and add the 
Mysql database connection url: Database can be empty. Prisma will generate tables. A Redis database url for catching. Google Client Key and secret, nextauth key which you can generate any random key, and a nextauth url which will be `http://localhost:3000` if you use the default. then run the following

```console
npx prisma db push
```
This command will generate all the required tables in your database, and you're ready to go. Simply run

```console
yarn run dev
```

You'll get your app up and running at local server

