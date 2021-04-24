const { init } = require("../initdb");

class Game {
    constructor(data){
        this.id = data._id
    }

    static get all(){
        return new Promise (async (resolve, reject) => {
            try {
                const db = await init();
                const dbData = await db.collection('games').find({}).toArray()
                const games = dbData.map(g => new Game(g))
                if (!games.length) { throw new Error('No games found')}
                resolve(games);
            } catch (err) {
                reject(`Error retrieving games: ${err.message}`)
            }
        })
    }

    static create(){
        return new Promise (async (resolve, reject) => {
            try {
                const db = await init();
                const newGame = db.collection('games').insertOne({})
                resolve(newGame);
            } catch (err) {
                reject(`Error retrieving games: ${err.message}`)
            }
        })
    }
}

module.exports = Game;