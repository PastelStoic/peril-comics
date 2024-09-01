import { getUserAccount } from 'dbschema/queries';
import axios, { AxiosError } from 'axios';
import type { Client } from "edgedb";
import { env } from 'src/env/server.mjs';
import { array } from 'zod';

// need to add token refresh to both 

/*
Error states:
1. The user does not have an account connected
2. The edgedb query fails
3. The POST request fails
  3a. The user access token is invalid
*/


/**
 * Checks whether the user with a given id is linked, and the support amount in cents. If no user is found, or if the check fails, returns false/0.
 */
export async function checkPatreonStatus(userId: string, client: Client) {
  let error: string | undefined;
  let isLinked = false;
  let supportAmount = 0;
  try {
      const patreonAccount = await getUserAccount(client, { userId, provider: "patreon"});

      isLinked = patreonAccount !== null;

      if (patreonAccount?.access_token) {
        const response = await axios.get("https://www.patreon.com/api/oauth2/v2/identity?include=memberships&fields%5Bmember%5D=currently_entitled_amount_cents", {
          headers: {
            Authorization: `Bearer ${patreonAccount.access_token}`,
            "Content-Type": "application/json",
          }
        });

        if (response.status === 200) {
          supportAmount = response.data.included[0].attributes.currently_entitled_amount_cents;
        }
        else if (response.status === 401) {
          error = "Failed to access account information.";
        }
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log('error', `HTTP to Patreon failed: ${error.message}`);
    } else {
      console.log("error", error);
    }
  }

  return {
    error,
    isLinked,
    supportAmount,
  };
}

/**
 * Checks whether the user with a given id is linked, and the support amount in cents. If no user is found, or if the check fails, returns false/0.
 */
export async function checkSubscribestarStatus(userId: string, client: Client) {
  let error: string | undefined;
  let isLinked = false;
  let supportAmount: number | null = 0;
  try {
    const subscribestarAccount = await getUserAccount(client, { userId, provider: "subscribestar"});

      isLinked = subscribestarAccount !== null;

      if (subscribestarAccount?.access_token) {
        const response = await axios.post("https://subscribestar.adult/api/graphql/v1?query={subscriber{subscription{price}}}", {}, {
          headers: {
            Authorization: `Bearer ${subscribestarAccount.access_token}`,
            "Content-Type": "application/json",
          }
        });

        if (response.status === 200) {
          supportAmount = response.data?.data?.subscriber?.subscription?.price ?? null;
        } else if (response.status === 401) {
          error = "Failed to access account information.";
        }
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log('error', `HTTP to Subscribestar failed: ${error.message}`);
    } else {
      console.log("error", error);
    }
  }

  return {
    error,
    isLinked,
    supportAmount,
  };
}

/**
 * Checks whether the user with a given id is linked, and the support amount in cents. If no user is found, or if the check fails, returns false/0.
 */
export async function checkGumroadStatus(userId: string, client: Client) {
  let error: string | undefined;
  let isLinked = false;
  let supportAmount = 0;
  try {
    const productId = "wfuE1xxfZopaYT-oLXN3ag==";
    const gumroadAccount = await getUserAccount(client, { userId, provider: "gumroad"});

      isLinked = gumroadAccount !== null;

      if (gumroadAccount?.providerAccountId) {
        isLinked = true;
        const productSubscribers = await axios.get(`https://api.gumroad.com/v2/products/${productId}/subscribers?access_token=${env.GUMROAD_ACCESS_TOKEN}`);
        // check if user in subscribers
        if ((productSubscribers.data.subscribers as {user_id: string}[]).find(s => s.user_id === gumroadAccount.providerAccountId)) {
          supportAmount = 300; // automatically configure this somehow?
        }
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log('error', `HTTP to Gumroad failed: ${error.message}`);
    } else {
      console.log("error", error);
    }
  }

  return {
    error,
    isLinked,
    supportAmount,
  };
}