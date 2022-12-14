-- Adminer 4.8.1 PostgreSQL 15.1 (Debian 15.1-1.pgdg110+1) dump

DROP TABLE IF EXISTS "users";
CREATE TABLE "public"."users" (
    "username" character varying(20) NOT NULL,
    "first_name" character varying(20) NOT NULL,
    "last_name" character varying(20) NOT NULL,
    "adress" character varying(50) NOT NULL,
    "city" character varying(20) NOT NULL,
    "state" character varying(20) NOT NULL,
    "phone_number" character varying(20) NOT NULL,
    "email" character varying(50) NOT NULL,
    "password" character varying(20) NOT NULL,
    CONSTRAINT "radnik_pk" PRIMARY KEY ("username")
) WITH (oids = false);


-- 2022-12-14 16:53:52.384973+00
