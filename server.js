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
    res.json(moderators[Math.floor(Math.random() * moderators.length)]);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.listen(port);
