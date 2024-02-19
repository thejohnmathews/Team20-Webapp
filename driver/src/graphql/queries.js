/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getAbout = /* GraphQL */ `
  query GetAbout($id: ID!) {
    getAbout(id: $id) {
      id
      teamName
      teamNumber
      versionNumber
      productName
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listAbouts = /* GraphQL */ `
  query ListAbouts(
    $filter: ModelAboutFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAbouts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        teamName
        teamNumber
        versionNumber
        productName
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
