-- Adminer 4.8.1 PostgreSQL 15.1 (Debian 15.1-1.pgdg110+1) dump

DROP TABLE IF EXISTS "portfolio";
DROP SEQUENCE IF EXISTS portfolio_user_id_seq;
CREATE SEQUENCE portfolio_user_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."portfolio" (
    "user_id" integer DEFAULT nextval('portfolio_user_id_seq') NOT NULL,
    "btc" double precision,
    "eth" double precision,
    "usdt" double precision,
    "bnb" double precision,
    "xrp" double precision,
    "doge" double precision,
    "ada" double precision,
    CONSTRAINT "portfolio_pkey" PRIMARY KEY ("user_id")
) WITH (oids = false);


-- 2022-12-17 13:31:18.793751+00
