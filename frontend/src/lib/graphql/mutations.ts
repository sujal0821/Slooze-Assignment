import { gql } from '@apollo/client';

export const PLACE_ORDER = gql`
  mutation PlaceOrder($input: CreateOrderInput!) {
    placeOrder(input: $input) {
      id
      status
      total
      paymentMethod
    }
  }
`;

export const CANCEL_ORDER = gql`
  mutation CancelOrder($id: String!) {
    cancelOrder(id: $id) {
      id
      status
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      accessToken
      user {
        id
        email
        name
        role
        country
      }
    }
  }
`;
