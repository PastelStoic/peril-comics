CREATE MIGRATION m1qtj42bo7hb2tbx7wfnoyj6wezf476sq66acq5qxlkhz3kxaueqpa
    ONTO m1acjmd56up4bscpvhxhsrndyo3yabsn5dmkac7be7n2iqpmrce5lq
{
  ALTER TYPE default::Comic {
      CREATE REQUIRED PROPERTY is_private -> std::bool {
          SET default := true;
      };
  };
};
