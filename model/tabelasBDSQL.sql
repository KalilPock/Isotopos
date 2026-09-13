-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.pastas (
  id integer NOT NULL DEFAULT nextval('pastas_id_seq'::regclass),
  nome character varying NOT NULL,
  usuario_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pai_id integer,
  criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pastas_pkey PRIMARY KEY (id),
  CONSTRAINT fk_pasta_pai FOREIGN KEY (pai_id) REFERENCES public.pastas(id) ON DELETE CASCADE
);
CREATE TABLE public.notas (
  id integer NOT NULL DEFAULT nextval('notas_id_seq'::regclass),
  titulo character varying NOT NULL DEFAULT 'Sem título'::character varying,
  conteudo text,
  pasta_id integer NOT NULL,
  criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  atualizado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT notas_pkey PRIMARY KEY (id),
  CONSTRAINT fk_pasta FOREIGN KEY (pasta_id) REFERENCES public.pastas(id) ON DELETE CASCADE
);

-- Execute em uma base que ja possui a tabela pastas.
ALTER TABLE public.pastas ADD COLUMN IF NOT EXISTS pai_id integer;
ALTER TABLE public.pastas ADD COLUMN IF NOT EXISTS usuario_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.pastas DROP CONSTRAINT IF EXISTS fk_pasta_pai;
ALTER TABLE public.pastas ADD CONSTRAINT fk_pasta_pai
  FOREIGN KEY (pai_id) REFERENCES public.pastas(id) ON DELETE CASCADE;
ALTER TABLE public.notas DROP CONSTRAINT IF EXISTS fk_pasta;
ALTER TABLE public.notas ADD CONSTRAINT fk_pasta
  FOREIGN KEY (pasta_id) REFERENCES public.pastas(id) ON DELETE CASCADE;

-- Atribua manualmente as pastas antigas antes de tornar usuario_id obrigatorio:
-- UPDATE public.pastas SET usuario_id = 'UUID_DO_USUARIO' WHERE usuario_id IS NULL;
-- ALTER TABLE public.pastas ALTER COLUMN usuario_id SET NOT NULL;