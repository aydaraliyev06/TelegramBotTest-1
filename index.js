const TelegramApi = require('node-telegram-bot-api') 
const {gameOptions, againGame} = require('./options')
const botToken = '5957927582:AAFi0HWNNCQ6I9B32VVw2iZiBxKGP_IrTbw'

const bot = new TelegramApi( botToken, { polling: true })

bot.setMyCommands([
    {command: '/start', description: 'Начальное приветсвие'},
    {command: '/info', description: 'Получить информацию о боте'},
    {command: '/game', description: 'Начать игру'},
])

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю число от 1 до 9, попройбуй угадать!')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    console.log(chats[chatId])
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
    bot.on('message', async msg => {
        const text = msg.text;
        const  chatId = msg.chat.id;
    
        if(text === '/start') {
            await bot.sendSticker(chatId, 'https://tgram.ru/wiki/stickers/img/BongoCatb/gif/6.gif')
            return bot.sendMessage(chatId, 'Welcome to the telegram bot')
        }
    
        if(text === '/info') {
            return bot.sendMessage(chatId, `Your name ${msg.from.first_name}`)
        }

        if(text === '/game') {
            return startGame(chatId)
        }

        return bot.sendMessage(chatId, 'Такой комманды нет')
    })
    
    bot.on( 'callback_query', msg => {
        const data = msg.data;
        // console.log(chats[chatId])
        const chatId = msg.message.chat.id;
        if( data === '/again' ) {
            return startGame(chatId)
        }
        if( data === `${chats[chatId]}`) {
            return bot.sendMessage(chatId, 'Ты отгадал цифру', againGame)
        }else{
            return bot.sendMessage(chatId, `Ты не отгадал цифру ${chats[chatId]}`, againGame)
        }
    })

}

start()