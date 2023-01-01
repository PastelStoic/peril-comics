CREATE MIGRATION m1bfcl4zqr4jkqsm3l7nqesmd5a34alodgubk6i6n73gzudmdc5g7q
    ONTO m12lsdie5vv4yepwp2iv7uywq6rlb73vueqeg25q6dyalqvbysv5eq
{
  CREATE TYPE default::CloudflareImage {
      CREATE REQUIRED PROPERTY image_id -> std::str;
      CREATE REQUIRED PROPERTY image_name -> std::str;
  };
};
