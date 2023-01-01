CREATE MIGRATION m12lsdie5vv4yepwp2iv7uywq6rlb73vueqeg25q6dyalqvbysv5eq
    ONTO m1pqhbsvnl27ibjkclibympri5msomtalp3hfej23q2fnp3qwzzfea
{
  ALTER TYPE default::Comic {
      ALTER LINK images {
          DROP CONSTRAINT std::exclusive;
      };
      ALTER LINK images {
          USING (.<comic[IS default::ComicImage]);
          RESET ON TARGET DELETE;
      };
  };
};
