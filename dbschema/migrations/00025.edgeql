CREATE MIGRATION m1dpk6ya2kc6jmmgywclnj24ykwp4t6m26aqyeekn77gqpz4e7w5pq
    ONTO m1ww6vr5qddvc54wudeteq6g3d5e6qbdub2rqe3xbv5wxcgka5syza
{
  ALTER TYPE default::ComicImage {
      DROP PROPERTY bucket_key;
  };
};
