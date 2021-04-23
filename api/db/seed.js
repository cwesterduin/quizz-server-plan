const db = connect("mongodb://localhost:27017/dev_db");

db.games.drop();

db.games.insertMany([
    {greeting: 'hello'}
]);