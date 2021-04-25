const { init } = require("../initdb");
const { ObjectId } = require('mongodb'); 
const axios = require('axios')

class Game {
    constructor(data){
        this.id = data._id
        this.quizz = data.quizz
    }

    static get all(){
        return new Promise (async (resolve, reject) => {
            try {
                const db = await init();
                const dbData = await db.collection('games').find({}).toArray()
                const games = dbData.map(g => ({id: g._id}))
                if (!games.length) { throw new Error('No games found')}
                resolve(games);
            } catch (err) {
                reject(`Error retrieving games: ${err.message}`)
            }
        })
    }

    static findById(id){
        return new Promise (async (resolve, reject) => {
            try {
                const db = await init();
                const collection = await db.collection('games')
                const game = await collection.findOne({ _id: ObjectId(id) })
                console.log(game)
                resolve(game);
            } catch (err) {
                reject(`Error retrieving game: ${err.message}`)
            }
        })
    }

    static create(){
        return new Promise (async (resolve, reject) => {
            try {
                const db = await init();
                let { data } = await axios.get('https://opentdb.com/api.php?amount=10&category=23&difficulty=medium&type=boolean')
                const newGame = db.collection('games').insertOne({quizz: data})
                resolve(newGame);
            } catch (err) {
                reject(`Error retrieving games: ${err.message}`)
            }
        })
    }
}

module.exports = Game;