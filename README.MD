# Pinecone Task

## Backend functionality

REST API which consists of HTTP endpoints to maintain the tree data structure.

The tree has a root node which is always present in the database.

Consists of Get, Post, Put and Delete methods.

**Disclaimer: function changeNodeOrder() doesn't work.**

#### Build and run

To run the backend, navigate to `/pinecone-server` and run:

```
npm i
npm run start
```

## Frontend functionality

Able to retrieve and create new nodes through the UI.

Inside `pinecone-client/src/utils/api.ts` I defined functions designed to send API calls to the backend portion. The functions were then implemented into constraints that are planned to be used in components that will be displayed on the UI.

#### Build and run

To run the frontend, navigate to `/pinecone-client`. Then you must create a `.env` file where you must specify the server and port of your backend:

```
VITE_BASE_URL=http://localhost:port
```

Afterwards, run:

```
npm i
npm run dev
```

### Technology

**Backend:** Node.js, Express.js, Cors and Postgres.

**Frontend:** React.js, Axios and Semantic UI React.

For the drag and drop feature in the frontend portion, I utilized the [dnd kit](https://docs.dndkit.com/).
