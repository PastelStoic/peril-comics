CREATE MIGRATION m1sd5aqaxlnkbaavvzimhou3ukdcvqyhxw4brw426degto7m2zn4va
    ONTO m1hip5ushmf6p37lg6bipcne2rb3ddwo22l7gtl3sepu7jprm3vwja
{
  ALTER TYPE default::Tag {
      CREATE REQUIRED PROPERTY creates_button -> std::bool {
          SET default := true;
      };
  };
};
