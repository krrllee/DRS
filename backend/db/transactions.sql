-- Adminer 4.8.1 PostgreSQL 15.1 (Debian 15.1-1.pgdg110+1) dump

DROP TABLE IF EXISTS "transactions";
DROP SEQUENCE IF EXISTS transactions_id_seq;
CREATE SEQUENCE transactions_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."transactions" (
    "id" integer DEFAULT nextval('transactions_id_seq') NOT NULL,
    "user_id" integer NOT NULL,
    "coin_name" character varying(100) NOT NULL,
    "coin_symbol" character varying(5) NOT NULL,
    "transaction_type" smallint NOT NULL,
    "amount" integer NOT NULL,
    "time_transacted" timestamp NOT NULL,
    "time_created" timestamp NOT NULL,
    "price_purchase_at" numeric NOT NULL,
    "no_of_coins" numeric,
    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


-- 2022-12-17 13:12:11.447946+00
