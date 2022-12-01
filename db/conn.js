const moongose = require('mongoose')

async function main(){
    await moongose.connect(process.env.MONGO_CONNECTION)
    console.log('connect')
}
main().catch((err)=>{
    console.log(err)
})

module.exports = moongose