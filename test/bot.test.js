import { expect as _expect } from 'chai';
import { stub, restore } from 'sinon';
const expect = _expect;
import { Client } from 'discord.js';
import { handleView } from '../src/commands/handleView';

describe('handleView Command', function() {
  let client;
  let redisClient;
  let interaction;

  beforeEach(() => {
    client = new Client();
    redisClient = { sMembers: stub() };
    interaction = {
      reply: stub().resolves(),
      followUp: stub().resolves(),
      options: { getString: stub().returns('test-survey') }
    };

    // Mocking makeSurveyPost function which is called within handleView
    stub(require('@lib/index'), 'makeSurveyPost').resolves([
      { content: 'Initial Survey Message', ephemeral: true },
      { content: 'Follow-up Survey Message', ephemeral: true }
    ]);
  });

  it('should send an initial reply and follow up messages', async function() {
    await handleView(interaction, 'test-survey', redisClient);

    // Check that the reply method is called correctly
    expect(interaction.reply.calledOnceWith({
      content: 'Initial Survey Message',
      ephemeral: true
    })).to.be.true;

    // Check that the followUp method is called correctly
    expect(interaction.followUp.calledOnceWith({
      content: 'Follow-up Survey Message',
      ephemeral: true
    })).to.be.true;
  });

  afterEach(() => {
    restore();
  });
});
