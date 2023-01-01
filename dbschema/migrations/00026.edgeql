CREATE MIGRATION m1rakw6x4kwnyfnzamns7t6npfkbzlsg6ytsxvd7tydyaawhhwuvbq
    ONTO m1dpk6ya2kc6jmmgywclnj24ykwp4t6m26aqyeekn77gqpz4e7w5pq
{
  ALTER TYPE default::Comic {
      ALTER PROPERTY pages {
          USING ((std::max(.images.endPage) ?? 0));
          SET REQUIRED USING (0);
      };
  };
};
