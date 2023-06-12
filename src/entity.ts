import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
export class Message {
  @Field()
  content?: string;

  @Field()
  contentType: string;

  // @Field({ defaultValue: 'text', nullable: true })
  // type: string;
}
@ObjectType()
export class FileType {
  @Field({ defaultValue: 'none', nullable: true })
  type?: string;
}

@ObjectType()
export class DialogAction {
  @Field()
  type: string;

  @Field({ nullable: true })
  slotToElicit?: string;
}

@ObjectType()
export class Intent {
  @Field()
  name: string;

  @Field(() => GraphQLJSONObject) // Update this to the appropriate type for slots
  slots?: object;

  @Field()
  state?: string;

  @Field()
  confirmationState?: string;
}

@ObjectType()
export class SessionState {
  @Field(() => DialogAction)
  dialogAction?: DialogAction;

  @Field(() => Intent)
  intent?: Intent;

  @Field(() => GraphQLJSONObject) // Update this to the appropriate type for sessionAttributes
  sessionAttributes?: object;

  @Field()
  originatingRequestId?: string;
}

@ObjectType()
export class Interpretation {
  @Field(() => GraphQLJSONObject) // Update this to the appropriate type for nluConfidence
  nluConfidence?: object;

  @Field(() => Intent)
  intent?: Intent;
}

@ObjectType()
export class BotConversation {
  @Field(() => [Message], { nullable: true })
  messages?: Message[];

  @Field(() => SessionState, { nullable: true })
  sessionState?: SessionState;

  @Field(() => [Interpretation], { nullable: true })
  interpretations?: Interpretation[];

  @Field(() => GraphQLJSONObject, { nullable: true }) // Update this to the appropriate type for requestAttributes
  requestAttributes?: object;

  @Field({ nullable: true })
  sessionId?: string;
}
