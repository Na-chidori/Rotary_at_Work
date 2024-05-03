const Telegraf = require('telegraf');

const Markup = require('telegraf/markup');
const axios = require('axios');
const { text } = require('telegraf/typings/button');
const bot= new Telegraf("6652023320:AAFb_N4BEWN5rWGf_7DlOm6m7tZI6NopVgU");

// Start command
bot.start((ctx) => {
    ctx.reply('Welcome! Please read and agree to the terms and conditions below:', Markup.inlineKeyboard([
        Markup.callbackButton('I Agree', 'agree'),
    ]).extra());
});

// Agree command
bot.action('agree', async (ctx) => {
    const contacts = await ctx.telegram.getChat(ctx.from.id);
    ctx.reply('Please enter your full name:');
    ctx.session.contacts = contacts;
    ctx.session.step = 'full_name';
});

// Handle full name
bot.on('text', (ctx) => {
    const step = ctx.session.step;
    if (step === 'full_name') {
        ctx.session.full_name = ctx.message.text;

        // Gender
        ctx.reply('Please select your gender:', Markup.inlineKeyboard([
            Markup.callbackButton('Male', 'gender_male'),
            Markup.callbackButton('Female', 'gender_female'),
        ]).extra());
        ctx.session.step = 'gender';
    } else if (step === 'gender') {
        ctx.session.gender = ctx.message.text;

        // Email
        ctx.reply('Please enter your email:');
        ctx.session.step = 'email';
    } else if (step === 'email') {
        ctx.session.email = ctx.message.text;

        // Country
        ctx.reply('Please select your country:', Markup.inlineKeyboard([
            //list of countries
            Markup.callbackButton('USA', 'country_usa'),
            Markup.callbackButton('Canada', 'country_canada'),
        ]).extra());
        ctx.session.step = 'country';
    } else if (step === 'country') {
        ctx.session.country = ctx.message.text;

        // City
        ctx.reply('Please select your city:', Markup.inlineKeyboard([           
            Markup.callbackButton('New York', 'city_ny'),
            Markup.callbackButton('Los Angeles', 'city_la'),
        ]).extra());
        ctx.session.step = 'city';
    } else if (step === 'city') {
        ctx.session.city = ctx.message.text;

        // Age
        ctx.reply('Please enter your age:');
        ctx.session.step = 'age';
    } else if (step === 'age') {
        ctx.session.age = parseInt(ctx.message.text);

        //Role
        ctx.reply('Please select your role:', Markup.inlineKeyboard([
            Markup.callbackButton('Rotarian', 'role_rotarian'),
            Markup.callbackButton('Rotractor', 'role_rotractor'),
            Markup.callbackButton('Interactor', 'role_interactor'),
            Markup.callbackButton('None', 'role_none'),
        ]).extra());
        ctx.session.step = 'role';
    } else if (step === 'role') {
        ctx.session.role = ctx.message.text;

        // If role is selected,club name if applicable
        if (ctx.session.role !== 'None') {
            ctx.reply('Please enter your club name:');
            ctx.session.step = 'club_name';
        } else {
            // Skip club name if the role is None
            saveUserData(ctx);
        }
    } else if (step === 'club_name') {
        ctx.session.clubName = ctx.message.text;
        saveUserData(ctx);
    }
});

//gender callback
bot.action(/gender_(.+)/, (ctx) => {
    ctx.session.gender = ctx.match[1];

    // Ask for Email
    ctx.reply('Please enter your email:');
    ctx.session.step = 'email';
});

// country callback
bot.action(/country_(.+)/, (ctx) => {
    ctx.session.country = ctx.match[1];

    // Ask for City
    ctx.reply('Please select your city:', Markup.inlineKeyboard([
        // Add your list of cities based on the selected country
        Markup.callbackButton('City 1', 'city_1'),
        Markup.callbackButton('City 2', 'city_2'),
        // Add more cities as needed
    ]).extra());
    ctx.session.step = 'city';
});

// Handle role callback
bot.action(/role_(.+)/, (ctx) => {
    ctx.session.role = ctx.match[1];

    // If role is selected, ask for club name if applicable
    if (ctx.session.role !== 'None') {
        ctx.reply('Please enter your club name:');
        ctx.session.step = 'club_name';
    } else {
        // Skip club name if the role is None
        saveUserData(ctx);
    }
});

// Save user data to database
function saveUserData(ctx) {
    const { fullName, gender, email, country, city, age, role, clubName } = ctx.session;
    const user = new User({ fullName, gender, email, country, city, age, role, clubName });
    user.save().then(() => {
        ctx.reply('Your data has been saved successfully!');
    }).catch((err) => {
        ctx.reply('An error occurred while saving your data. Please try again later.');
        console.error(err);
    });
}

// Start polling

bot.launch();
