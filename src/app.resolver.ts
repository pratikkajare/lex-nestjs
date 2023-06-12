/* eslint-disable @typescript-eslint/dot-notation */
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { LexService } from './app.service';
import { RecognizeTextResponse } from 'aws-sdk/clients/lexruntimev2';
import { BotConversation, Message } from './entity';
import { json } from 'express';
import GraphQLJSON from 'graphql-type-json';

@Resolver(() => BotConversation)
export class LexResolver {
  constructor(private readonly lexService: LexService) {}

  @Query(() => BotConversation, {
    name: 'botConversation',
  })
  async senMessage(
    @Args('SessionId', { nullable: true }) SessionId: string,
    @Args('text', { nullable: true }) text: string,
    // @Context() context: { req: Request },
  ): Promise<BotConversation> {
    // (await this.lexService.postText(SessionId, text)).messages;
    return await this.lexService.postText(SessionId, text);
  }
}
