CREATE MIGRATION m1ndjwhmd6v2s4elhguufj3c274g3q4mlnfurrhtbkcowrhiald4da
    ONTO m1q6bpmblsuw642bl3ybxxe4iy2uejc7qpwfuzyqefhxndgvyj366a
{
  ALTER TYPE default::Account {
      CREATE CONSTRAINT std::exclusive ON ((.user, .provider));
  };
};
