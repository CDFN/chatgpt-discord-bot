import type { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { ChatGPTAPI } from 'chatgpt'
@Discord()
export class ChatCommand {
  private chatId: string | null = null;

  @Slash({ description: "Chat with ChatGPT" })
  async chat(
    @SlashOption({
      description: "What are you willing to ask?",
      name: "question",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    question: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const api = new ChatGPTAPI({ sessionToken: process.env.OPENAI_SESSION_TOKEN as string })
    await api.ensureAuth();
    interaction.deferReply();
    try{
      if(this.chatId == null) {
        this.chatId = api.getConversation().conversationId
      }
      const reply = await api.sendMessage(question);
      interaction.editReply(reply)
    }catch(exception: any) {
      interaction.editReply(`The OpenAI servers appear to be unavailable at the moment. Please try again later.\n||${exception}||`)
    }

  }
}
