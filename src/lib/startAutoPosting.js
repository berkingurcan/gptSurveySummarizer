import log from "../logger.js";

import { summarizeFrequency } from "../config.js";
import { makeSurveyPost } from "./makeSurveyPost.js";

export const startAutoPosting = async (client, redisClient) => {
  while (true) {
    const timeSinceLastUpdate = Date.now() % (summarizeFrequency * 1000);
    const timeOfLastUpdate = Date.now() - timeSinceLastUpdate;
    const timeOfNextUpdate = timeOfLastUpdate + summarizeFrequency * 1000;
    const fiveMinutes = 5 * 60 * 1000;
    const timeOfNextAutoPosting = timeOfNextUpdate + fiveMinutes;
    const timeTilNextAutoPosting = timeOfNextAutoPosting - Date.now();

    log.info(
      `${timeTilNextAutoPosting / 1000 / 60} minutes until the next auto-posting`,
    );
    await new Promise((r) => setTimeout(r, timeTilNextAutoPosting));

    log.info("Starting auto posting");

    const autoPostSurveys = await redisClient.sMembers("auto-post-surveys");

    for (const autoPostSurvey of autoPostSurveys) {
      const parts = autoPostSurvey.split(":");
      const channelIdWithBrackets = parts[0];
      const channelId = channelIdWithBrackets.slice(2, -1);
      const surveyName = parts.slice(1).join(":");

      log.info("Posting", surveyName, "to", channelId);

      const messagesToSend = await makeSurveyPost(
        redisClient,
        surveyName,
        true,
      );

      let channel;

      try {
        channel = await client.channels.fetch(channelId);
      } catch (error) {
        log.error(`Channel ${channelId} cannot found`);
        continue;
      }

      try {
        if (channel.isThread()) {
          const messages = await channel.messages.fetch();

          const surveyMessage = messages.find(
            (msg) =>
              msg.content.startsWith("# :ballot_box:") ||
              msg.content.startsWith("## :new:"),
          );
          if (surveyMessage) {
            await surveyMessage.delete();
            log.debug(`Deleted survey message: ${surveyMessage.id}`);
          } else {
            log.debug(`No message starting with :ballot_box: found.`);
          }
        }
      } catch (error) {
        log.error(`Error removing survey message: ${error.message}`);
        continue;
      }

      for (const [i, toSend] of Object.entries(messagesToSend)) {
        if (i == 0) {
          await channel.send(toSend);
        } else {
          await channel.send(toSend);
        }
      }
    }
  }
};
