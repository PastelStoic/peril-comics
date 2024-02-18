import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "src/env/server.mjs";
import { createClient } from "edgedb";
import axios from "axios";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";
import type { tokenResult } from "src/types/oauth-token";
import { createUserAccount } from "dbschema/queries";

const redirect_uri = "https://peril-comics.vercel.app/api/integrations/gumroad";

// a three-step process: get the users gumroad email, compare it to the gumroad subscribers list, match them up
async function gumroadValidate(req: NextApiRequest, res: NextApiResponse) {
  const code = req.query["code"];
  if (typeof code === "string") {
    try {
      const postReq = `https://api.gumroad.com/oauth/token?client_id=${env.GUMROAD_CLIENT_ID}&client_secret=${env.GUMROAD_CLIENT_SECRET}&code=${code}&redirect_uri=${redirect_uri}`;
      const result = await axios.post(postReq, {
      });
      if (result.status === 200) {
      const tokenData = await result.data as tokenResult;

      const session = await getServerAuthSession({ req, res });
      const id = session?.user?.id;
      if (!id) return; // throw an error?

      
      const { token_type, access_token, refresh_token, scope } = tokenData;

      const userData = await axios.get(`https://api.gumroad.com/v2/user?access_token=${access_token}`);

      const providerAccountId = userData.data?.user?.id;
      if (!providerAccountId) {
        console.log(`Could not get gumroad user id for user ${id}`);
        res.redirect("/account"); // redirect with an error?
        return;
      }


      const edgedb = createClient();
      await createUserAccount(edgedb, {
        id,
        provider: "gumroad",
        token_type,
        expires_in: 1609038258,
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

export default gumroadValidate;