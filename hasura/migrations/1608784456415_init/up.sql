CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;
CREATE TABLE public.membership (
    role text NOT NULL,
    user_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    active boolean DEFAULT false
);
CREATE TABLE public.organization (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL
);
CREATE TABLE public.refresh_tokens (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    refresh_token uuid NOT NULL
);
CREATE TABLE public."user" (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    email character varying NOT NULL,
    name character varying,
    password text,
    provider character varying,
    sub text,
    picture text,
    last_seen timestamp with time zone DEFAULT now(),
    first_time_login boolean DEFAULT true NOT NULL
);
INSERT INTO public.user_roles (role) VALUES ('user');
INSERT INTO public.user_roles (role) VALUES ('admin');
INSERT INTO public.user_roles (role) VALUES ('orgAdmin');

CREATE TABLE public.user_roles (
    role text NOT NULL
);
ALTER TABLE ONLY public.membership
    ADD CONSTRAINT membership_pkey PRIMARY KEY (id, user_id);
ALTER TABLE ONLY public.organization
    ADD CONSTRAINT organization_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (role);
CREATE TRIGGER set_public_organization_updated_at BEFORE UPDATE ON public.organization FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_organization_updated_at ON public.organization IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_user_updated_at BEFORE UPDATE ON public."user" FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_user_updated_at ON public."user" IS 'trigger to set value of column "updated_at" to current timestamp on row update';
ALTER TABLE ONLY public.membership
    ADD CONSTRAINT membership_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organization(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.membership
    ADD CONSTRAINT membership_role_fkey FOREIGN KEY (role) REFERENCES public.user_roles(role) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.membership
    ADD CONSTRAINT membership_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;
