import { gql } from '@apollo/client';

export const GET_RESTAURANTS = gql`
  query GetRestaurants {
    restaurants {
      id
      name
      country
      menuItems {
        id
        name
        price
      }
    }
  }
`;

export const GET_ORDERS = gql`
  query GetOrders {
    orders {
      id
      status
      total
      restaurant {
        id
        name
        country
      }
      items {
        id
        quantity
        menuItem {
          name
          price
        }
      }
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      name
      role
      country
    }
  }
`;
