CREATE MIGRATION m1acjmd56up4bscpvhxhsrndyo3yabsn5dmkac7be7n2iqpmrce5lq
    ONTO m13kbdycpxifi4unfypscmnjlkf2q2r6oauerzyqljo7scydxyxacq
{
  ALTER TYPE default::User {
      CREATE REQUIRED PROPERTY role -> std::str {
          SET default := 'user';
      };
  };
};
