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

export type Hype = {
  __typename?: 'Hype';
  dummy?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  subreddit?: Maybe<Subreddit>;
  subreddits: Array<Scalars['String']>;
};


export type QuerySubredditArgs = {
  nameOrUrl: Scalars['String'];
};

export type Subreddit = {
  __typename?: 'Subreddit';
  hype?: Maybe<Hype>;
  name: Scalars['String'];
};


export type SubredditHypeArgs = {
  from?: InputMaybe<Scalars['Date']>;
  keywords: Array<Scalars['String']>;
  to?: InputMaybe<Scalars['Date']>;
};

export type SubredditQueryVariables = Exact<{
  nameOrUrl: Scalars['String'];
}>;


export type SubredditQuery = { __typename?: 'Query', subreddit?: { __typename?: 'Subreddit', name: string } | null };


export const SubredditDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Subreddit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nameOrUrl"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subreddit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"nameOrUrl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nameOrUrl"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<SubredditQuery, SubredditQueryVariables>;

export const Subreddit = gql`
    query Subreddit($nameOrUrl: String!) {
  subreddit(nameOrUrl: $nameOrUrl) {
    name
  }
}
    `;