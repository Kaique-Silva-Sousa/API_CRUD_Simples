const moongose = require('mongoose')

async function main(){
    await moongose.connect('mongodb://localhost:27017/ApiTest')
    console.log('connect')
}
main().catch((err)=>{
    console.log(err)
})

module.exports = moongose