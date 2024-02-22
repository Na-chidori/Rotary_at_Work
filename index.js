const { Telegraf, Markup } = require('telegraf');
const bot= new Telegraf("6652023320:AAFb_N4BEWN5rWGf_7DlOm6m7tZI6NopVgU");
// const dotenv = require('dotenv');
// require('dotenv').config();
// const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply('Welcome! Please read and agree to the terms and conditions below:', Markup.inlineKeyboard([
        Markup.callbackButton('I Agree', 'agree'),
    ]).extra());
});

bot.command('agree', (ctx) => {
    ctx.reply('Thank you for agreeing to the terms and conditions.');
    askForContact(ctx);
});

function askForContact(ctx) {
    ctx.reply('Please share your contact information:', {
        reply_markup: {
            keyboard: [[{ text: 'Share My Contact', request_contact: true }]],
            resize_keyboard: true,
        },
    });
}

bot.on('contact', (ctx) => {
    const contact = ctx.message.contact;
    ctx.session.phoneNumber = contact.phone_number;
    ctx.session.username = contact.username;
    askForFullName(ctx);
});

function askForFullName(ctx) {
    ctx.reply('Please enter your Full Name:');
}

bot.on('text', (ctx) => {
    const text = ctx.message.text;
    if (!ctx.session.fullName) {
        ctx.session.fullName = text;
        askForGender(ctx);
    } else if (!ctx.session.email) {
        ctx.session.email = text;
        askForCountry(ctx);
    } else if (!ctx.session.city) {
        ctx.session.city = text;
        askForAge(ctx);
    } else if (!ctx.session.clubStatus) {
        ctx.session.clubStatus = text;
        if (ctx.session.clubStatus !== 'None') {
            askForClubName(ctx);
        } else {
            generateSummary(ctx);
        }
    }
});

function askForGender(ctx) {
    ctx.reply('Please select your Gender:', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Male', callback_data: 'gender_male' }],
                [{ text: 'Female', callback_data: 'gender_female' }],
            ],
        },
    });
}

bot.action('gender_male', (ctx) => {
    ctx.session.gender = 'Male';
    askForEmail(ctx);
});

bot.action('gender_female', (ctx) => {
    ctx.session.gender = 'Female';
    askForEmail(ctx);
});

function askForEmail(ctx) {
    ctx.reply('Please enter your email:');
}

function askForCountry(ctx) {
    ctx.reply('Please select your Country:', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Ethiopia', callback_data: 'country_ethiopia' }],
                [{ text: 'Kenya', callback_data: 'country_kenya' }],
                [{ text: 'Eritrea', callback_data: 'country_eritrea' }], // Fixed typo here
                [{ text: 'Somalia', callback_data: 'country_somalia' }],
                [{ text: 'Sudan', callback_data: 'country_sudan' }],
            ],
        },
    });
}

bot.action(/^country_/, (ctx) => {
    const country = ctx.match.input.split('_')[1];
    ctx.session.country = country;
    askForCity(ctx);
});


function askForAge(ctx) {
    ctx.reply('Please enter your Age:');
}

function askForClubName(ctx) {
    ctx.reply('Please enter your Club Name:');
}

bot.on('callback_query', (ctx) => {
    // country and city selection using callback_query
});

function generateSummary(ctx) {
    const summary = `Summary:
Full Name: ${ctx.session.fullName}
Gender: ${ctx.session.gender}
Email: ${ctx.session.email}
Country: ${ctx.session.country}
City: ${ctx.session.city}
Age: ${ctx.session.age}
Club Status: ${ctx.session.clubStatus}`;
    
    ctx.reply(summary, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Edit', callback_data: 'edit' }],
                [{ text: 'Confirm', callback_data: 'confirm' }],
            ],
        },
    });
}

bot.action('edit', (ctx) => {
    ctx.reply('What would you like to edit?', {
        reply_markup: {
            inline_keyboard: [
                // List of options to edit
            ],
        },
    });
    // Handle editing options
});

bot.action('confirm', (ctx) => {
    ctx.reply('Thank you for confirming your information!');
    // Further processing or saving of user data
});

bot.launch();
