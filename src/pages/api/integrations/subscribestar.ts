import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "src/env/server.mjs";
import { createClient } from "edgedb";
import axios from "axios";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";
import type { tokenResult } from "src/types/oauth-token";
import { createUserAccount } from "dbschema/queries";

const redirect_uri = "https://peril-comics-test.vercel.app/api/integrations/subscribestar";

async function substarValidate(req: NextApiRequest, res: NextApiResponse) {
  const code = req.query["code"];
  if (typeof code === "string") {
    try {
      const postReq = `https://subscribestar.adult/oauth2/token?client_id=${env.SUBSCRIBESTAR_CLIENT_ID}&client_secret=${env.SUBSCRIBESTAR_CLIENT_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=${redirect_uri}`;
      const result = await axios.post(postReq);
      if (result.status === 200) {
        const tokenData = await result.data as tokenResult;
  
        const session = await getServerAuthSession({ req, res });
        const id = session?.user?.id;
        if (!id) return; // throw an error?

        const userData = await axios.post("https://subscribestar.adult/api/graphql/v1?query={user{id}}", {},
        {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            "Content-Type": "application/json",
          },
        });
        const providerAccountId = userData.data?.data?.user?.id;
        if (!providerAccountId) {
          console.log(`Could not get subscribestar user id for user with token ${tokenData.access_token}`);
          res.redirect("/account"); // redirect with an error?
          return;
        }
  
        const edgedb = createClient();
        await createUserAccount(edgedb, {
          id,
          provider: "subscribestar",
          providerAccountId,
          ...tokenData,
        });
      }
    } catch (error) {
      console.log('error', error);
    }
  }
  res.redirect("/account");
}

export default substarValidate;