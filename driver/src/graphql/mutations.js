/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createAbout = /* GraphQL */ `
  mutation CreateAbout(
    $input: CreateAboutInput!
    $condition: ModelAboutConditionInput
  ) {
    createAbout(input: $input, condition: $condition) {
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
export const updateAbout = /* GraphQL */ `
  mutation UpdateAbout(
    $input: UpdateAboutInput!
    $condition: ModelAboutConditionInput
  ) {
    updateAbout(input: $input, condition: $condition) {
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
export const deleteAbout = /* GraphQL */ `
  mutation DeleteAbout(
    $input: DeleteAboutInput!
    $condition: ModelAboutConditionInput
  ) {
    deleteAbout(input: $input, condition: $condition) {
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
