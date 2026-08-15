-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.pastas (
  id integer NOT NULL DEFAULT nextval('pastas_id_seq'::regclass),
  nome character varying NOT NULL,
  criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pastas_pkey PRIMARY KEY (id)
);
CREATE TABLE public.notas (
  id integer NOT NULL DEFAULT nextval('notas_id_seq'::regclass),
  titulo character varying NOT NULL DEFAULT 'Sem título'::character varying,
  conteudo text,
  pasta_id integer NOT NULL,
  criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  atualizado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT notas_pkey PRIMARY KEY (id),
  CONSTRAINT fk_pasta FOREIGN KEY (pasta_id) REFERENCES public.pastas(id)
);