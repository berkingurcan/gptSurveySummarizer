# gptSurveySummarizer

A discord bot for natural language surveys, inspired by and in the style of [talk to the city](https://github.com/AIObjectives/talk-to-the-city-reports).

## Usage

1. Create a .env file with the following variables: 

```shell
DISCORD_TOKEN=
OPENAI_API_KEY=
REDIS_URL=
CLIENT_ID=
GUILD_ID=
SUMMARIZE_FREQUENCY_SECONDS=3600
```

1. Run `npm install`
2. Start redis with `redis-server`
3. Start the main bot script with `node bot.js`
4. Start the gpt summarization script with `node summarizer.js`
5. Start both with `npm start`

## Docker image

### Build it

```
docker build -t <your-image-name>:<your-image-tag> .
```

### Run it

```
docker run -it -d --env-file ./.env <your-image-name>:<your-image-tag>
```

The `--env-file` flag takes a filename as an argument and expects each line to be in the VAR=VAL format, mimicking the argument passed to `--env`. Comment lines need only be prefixed with #

The container runs the command `npm start` so whatever is configured in `package.json` will be executed by the container.

## Example Survey

TODO

## Contributions

To make a contribution do the following steps:

1. Make an issue that includes a user story for what the user should be able to do (eg user should be able to view the survey summary in their local language).
2. Get that issue approved by the product owners (for now just me / Evan / es92).
3. Write a PR and get that approved by the code owners (for now also just me / Evan / es92). Each PR must correspond to an approved issue.
