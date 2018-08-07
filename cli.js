#!/usr/bin/env node

'use strict';
const meow = require('meow');
const chalk = require('chalk');
const axios = require('axios');

const cli = meow(`
${chalk.yellowBright(`----------------
┏━┓┈┈╭━━━━╮┏━┓┈┈
┃╱┃┈┈┃╱╭╮╱┃┃╱┃┈┈
┃╱┗━┓┃╱┃┃╱┃┃╱┗━┓
┃╱╱╱┃┃╱╰╯╱┃┃╱╱╱┃
┗━━━┛╰━━━━╯┗━━━┛
----------------`)}
${chalk.whiteBright(`
    Usage
	  $ lol

    Options
      --best, -b  Tell one of the most popular jokes!
	  --joke, -j  Tell a random joke from /r/jokes
      --dad, -d  Tell a random dad joke from /r/dadjokes
      --anti, -a  Tell a random anti-joke from /r/antijokes
      --clean, -c  Tell a random clean joke from /r/cleanjokes
	  --programmer, -p  Tell a random joke from /r/programmerhumor (EXPERIMENTAL)

    Examples
      $ lol --dad

      I'll never date another apostrophe.
      The last one was too possessive.`)}
`, {
    flags: {
        joke: {
            type: 'boolean',
            alias: 'j'
        },
        dad: {
            type: 'boolean',
            alias: 'd'
        },
        anti: {
            type: 'boolean',
            alias: 'a'
        },
        clean: {
            type: 'boolean',
            alias: 'c'
        },
        programmer: {
            type: 'boolean',
            alias: 'p'
        }
    }
});

const redditUrl = "https://www.reddit.com"
const rJokes = "/r/jokes"
const rDadJokes = "/r/dadjokes"
const rProgrammerHumor = "/r/programmerhumor"
const topRequest = `top.json?limit=`
const randomRequest = "random.json"

function runner(flags) {
    switch (true) {
        case flags.best:
            request(rJokes, 25)
            break;
        case flags.joke:
            request(rJokes)
            break;
        case flags.dad:
            request(rDadJokes)
            break;
        case flags.clean:
            request(rCleanJokes)
            break;
        case flags.anti:
            request(rAntiJokes)
            break;
        case flags.programmer:
            request(rProgrammerHumor)
            break;
        default:
            request(rJokes)
    }
}

function request(subreddit, requestLimit) {
    if (requestLimit) randomNum = Math.floor(Math.random() * requestLimit + 1);

    const requestUrl = requestLimit ? `${redditUrl}${subreddit}/${topRequest}${requestLimit}`:
    `${redditUrl}${subreddit}/${randomRequest}`;
                                      

    axios.get(requestUrl)
        .then(function (response) {
            const post = requestLimit ? response.data[randomNum].data.children[randomNum].data : response.data[0].data.children[0].data
            const frame = post.title
            const punchline = post.selftext.trim()
            tellJoke(frame, punchline)
        })
        .catch(function (error) {
            console.log("Connection Error: We cannot find any jokes :(\n");
        })
}

function tellJoke(frame, punchline){
    if (punchline !== "") {
        console.log(chalk.bold.yellowBright(`\n${frame}`))
        setTimeout(() => {
            console.log(`\n${chalk.whiteBright(punchline)}\n`)
        }, 1000);
    } else {
        request(subreddit)
    }
}

runner(cli.flags);