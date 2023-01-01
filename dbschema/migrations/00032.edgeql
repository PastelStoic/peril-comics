CREATE MIGRATION m1hstbuu6lqw6sbqhu7miz4jfortmrr5h3firts5iqe6hzjrdgpwcq
    ONTO m1gobepquh46jid5nniotrxoew3fidfpe7kugdgz4jmesdhon5ihta
{
    ALTER TYPE default::Session {
    ALTER PROPERTY userId {
        RESET EXPRESSION;
        RESET CARDINALITY;
        RESET OPTIONALITY;
        SET TYPE std::str;
    };
    };
};
