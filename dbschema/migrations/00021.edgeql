CREATE MIGRATION m1pqhbsvnl27ibjkclibympri5msomtalp3hfej23q2fnp3qwzzfea
    ONTO m1vvfxiiea4sbshzlnfnajvfh42r5yxw3h5w5ncptfuebbyxkpytra
{
  ALTER TYPE default::ComicImage {
      ALTER LINK comic {
          RESET EXPRESSION;
          RESET EXPRESSION;
          RESET CARDINALITY;
          RESET OPTIONALITY;
          SET TYPE default::Comic;
      };
  };
};
