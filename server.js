const express = require('express');
const fetch = require('node-fetch');

const app = express();

const port = 3000;

app.get('/chat-commands/v1/random-mod', async (req, res) => {
  const { channel } = req.query;
  if (!channel) {
    res.status(400).json({
      message: 'Must specify a channel'
    });
    return;
  }
  try {
    const response = await fetch(`http://tmi.twitch.tv/group/user/${channel}/chatters`);
    const json = await response.json();
    const moderators = json && json.chatters && json.chatters.moderators;
    if (!moderators) {
      res.status(404).json({
        message: `Channel ${channel} could not be found`
      });
      return;
    }
    res.send(moderators[Math.floor(Math.random() * moderators.length)]);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get('/chat-commands/v1/hype', (req, res) => {
  const { amount, emote } = req.query;
  if (!amount || !emote) {
    res.status(400).json({
      message: 'Must specify an amount and emote'
    });
    return;
  }
  const number = parseInt(amount);
  if(isNaN(number) || number < 0) {
    res.send('Give me a number between 1 and 99, bro');
    return;
  }
  if(number > 99) {
    res.send('Woah man, that is too much hype for me');
    return;
  }
  const result = Array.from({length: number}).reduce(string => {
    return string = string + emote + ' ';
  }, '');
  res.send(result);
});

app.listen(port);
