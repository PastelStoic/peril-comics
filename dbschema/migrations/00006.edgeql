CREATE MIGRATION m1unbhck5gwmrp5e2anprpwmjf4vqc6nbxq7vj3vvfscbjxjrdbskq
    ONTO m1xvcsfpjk2g5nwaobs3fnbtvumdyp5jrovmysvun6zokfo5xtnhea
{
  ALTER TYPE default::Comic {
      CREATE PROPERTY thumbnail_url -> std::str;
  };
};
