const { Telegraf, Markup } = require('telegraf');
const { text } = require('telegraf/typings/button');
const bot= new Telegraf("6652023320:AAFb_N4BEWN5rWGf_7DlOm6m7tZI6NopVgU");


bot.start((ctx) => {
    ctx.reply('Welcome! Please agree to the terms and conditions by pressing the agree button:',{
        reply_markup: {

            inline_keyboard: [
                [{ text: 'Agree', callback_data: 'agree' }],
                [{ text: 'Disagree', callback_data: 'disagree' }]
            ],
        },
    });
});
bot.action('agree', (ctx) => {
    askForContact(ctx);
});
bot.action('disagree', (ctx) => {
    ctx.reply('Sorry, you must agree to the terms and conditions to proceed. If you change your mind, please press the agree button.');
});

function askForContact(ctx) {
    ctx.reply('Please share your contact information with us:', {
        reply_markup: {
            keyboard: [
                [{ text: 'Share Contact', request_contact: true }],
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
        },
    });
}
bot.on('contact', (ctx) => {
    askForFullName(ctx);
});

function askForFullName(ctx) {
    ctx.reply('Please enter your Full Name:');
}
bot.on('text', (ctx) => {   
    askForGender(ctx);
});

function askForGender(ctx) {
    ctx.reply('Please select select your geneder:', {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Male' , callback_data: 'gender_male'}],
                [{text: 'Female', callback_data:'gender_female'}]
        ],},
    });
}
bot.action
try {
    bot.launch();
    console.log('Bot started successfully');
} catch (error) {
    console.error('Error starting bot:', error);
}
