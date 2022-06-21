import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Date (custom scalar type) */
  Date: any;
};

export type Comment = {
  articleId?: InputMaybe<Scalars['String']>;
  commentId: Scalars['String'];
  downvotes?: InputMaybe<Scalars['Int']>;
  subredditName: Scalars['String'];
  text: Scalars['String'];
  timestamp: Scalars['Date'];
  upvotes?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addComment: Scalars['Boolean'];
};


export type MutationAddCommentArgs = {
  comment: Comment;
};

export type Query = {
  __typename?: 'Query';
  health: Array<ServiceHealth>;
  jobs: Array<Scalars['String']>;
  subreddit?: Maybe<Subreddit>;
  subreddits: Array<Scalars['String']>;
};


export type QuerySubredditArgs = {
  nameOrUrl: Scalars['String'];
};

export type Sentiment = {
  __typename?: 'Sentiment';
  negative: Scalars['Int'];
  neutral: Scalars['Int'];
  positive: Scalars['Int'];
  sum: Scalars['Int'];
  time: Scalars['Date'];
};

export type ServiceHealth = {
  __typename?: 'ServiceHealth';
  lastConnect?: Maybe<Scalars['Date']>;
  name: Scalars['String'];
  status: ServiceStatus;
};

export enum ServiceStatus {
  Down = 'DOWN',
  Up = 'UP'
}

export type Subreddit = {
  __typename?: 'Subreddit';
  name: Scalars['String'];
  sentiment: Array<Sentiment>;
};


export type SubredditSentimentArgs = {
  from?: InputMaybe<Scalars['Date']>;
  keywords: Array<Scalars['String']>;
  to?: InputMaybe<Scalars['Date']>;
};

export type HealthQueryVariables = Exact<{ [key: string]: never; }>;


export type HealthQuery = { __typename?: 'Query', health: Array<{ __typename?: 'ServiceHealth', name: string, lastConnect?: any | null, status: ServiceStatus }> };

export type SubredditQueryVariables = Exact<{
  nameOrUrl: Scalars['String'];
  keywords: Array<Scalars['String']> | Scalars['String'];
  from?: InputMaybe<Scalars['Date']>;
  to?: InputMaybe<Scalars['Date']>;
}>;


export type SubredditQuery = { __typename?: 'Query', subreddit?: { __typename?: 'Subreddit', name: string, sentiment: Array<{ __typename?: 'Sentiment', time: any, positive: number, negative: number, neutral: number, sum: number }> } | null };


export const HealthDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Health"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"health"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"lastConnect"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<HealthQuery, HealthQueryVariables>;
export const SubredditDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Subreddit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nameOrUrl"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"keywords"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subreddit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"nameOrUrl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nameOrUrl"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"sentiment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"keywords"},"value":{"kind":"Variable","name":{"kind":"Name","value":"keywords"}}},{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"positive"}},{"kind":"Field","name":{"kind":"Name","value":"negative"}},{"kind":"Field","name":{"kind":"Name","value":"neutral"}},{"kind":"Field","name":{"kind":"Name","value":"sum"}}]}}]}}]}}]} as unknown as DocumentNode<SubredditQuery, SubredditQueryVariables>;

export const Health = gql`
    query Health {
  health {
    name
    lastConnect
    status
  }
}
    `;
export const Subreddit = gql`
    query Subreddit($nameOrUrl: String!, $keywords: [String!]!, $from: Date, $to: Date) {
  subreddit(nameOrUrl: $nameOrUrl) {
    name
    sentiment(keywords: $keywords, from: $from, to: $to) {
      time
      positive
      negative
      neutral
      sum
    }
  }
}
    `;