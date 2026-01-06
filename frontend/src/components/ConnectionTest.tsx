"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

const HELLO_QUERY = gql`
  query {
    __typename
  }
`;

export default function ConnectionTest() {
    const { loading, error, data } = useQuery<{ __typename: string }>(HELLO_QUERY);

    if (loading) return <p className="text-blue-500">Loading...</p>;
    if (error) return <p className="text-red-500">Error: {error.message}</p>;

    return (
        <div className="p-4 border rounded shadow bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700">
            <h2 className="text-xl font-bold mb-2 text-green-800 dark:text-green-100">
                Backend Connection Status
            </h2>
            <p className="text-green-700 dark:text-green-200">
                Connected! Typename: {data?.__typename}
            </p>
        </div>
    );
}
