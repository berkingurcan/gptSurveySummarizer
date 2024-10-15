import log from "../logger.js";
import OpenAI from "openai";

const gpt = async (apikey, system, user, maxTries = 5) => {
  const openai = new OpenAI({ apikey });

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],

    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
  });
  const { finish_reason, message } = completion.choices[0];
  let result;
  try {
    result = JSON.parse(message.content);
  } catch (e) {
    log.error("error while processing gpt response:", e);
    log.error("gpt response:", message.content);
    if (maxTries == 1) {
      throw e;
    } else {
      log.warn("trying again; tries remaining", maxTries - 1);
      return await gpt(apikey, system, user, maxTries - 1);
    }
  }
  return result;
};

export { gpt };
