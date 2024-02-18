import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "src/env/server.mjs";
import { createClient } from "edgedb";
import axios from "axios";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";
import type { tokenResult } from "src/types/oauth-token";
import { createUserAccount } from "dbschema/queries";

const redirect_uri = "https://peril-comics.vercel.app/api/integrations/gumroad";

// a three-step process: get the users gumroad email, compare it to the gumroad subscribers list, match them up
async function patreonValidate(req: NextApiRequest, res: NextApiResponse) {
  const code = req.query["code"];
  if (typeof code === "string") {
    try {
      const postReq = `https://www.patreon.com/api/oauth2/token?client_id=${env.PATREON_CLIENT_ID}&client_secret=${env.PATREON_CLIENT_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=${redirect_uri}`;
      const result = await axios.post(postReq, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      if (result.status === 200) {
      const tokenData = await result.data as tokenResult;

      const session = await getServerAuthSession({ req, res });
      const id = session?.user?.id;
      if (!id) return; // throw an error?

      const userData = await axios.get("https://www.patreon.com/api/oauth2/v2/identity", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      const providerAccountId = userData.data?.data?.id;
      if (!providerAccountId) {
        console.log(`Could not get patreon user id for user ${id}`);
        res.redirect("/account"); // redirect with an error?
        return;
      }

      const { token_type, expires_in, access_token, refresh_token, scope } = tokenData;

      const edgedb = createClient();
      await createUserAccount(edgedb, {
        id,
        provider: "gumroad",
        token_type,
        expires_in,
        access_token,
        refresh_token,
        providerAccountId,
        scope,
      });
    }
  } catch (error) {
    console.log('error', error);
  }
}
res.redirect("/account");
}

export default patreonValidate;