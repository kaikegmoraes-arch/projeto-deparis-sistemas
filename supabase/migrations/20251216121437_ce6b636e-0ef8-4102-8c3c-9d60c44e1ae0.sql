-- Create table for rate limiting by IP
CREATE TABLE public.rate_limits (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_address text NOT NULL,
    form_type text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create index for efficient lookup
CREATE INDEX idx_rate_limits_ip_form_time ON public.rate_limits (ip_address, form_type, created_at DESC);

-- Enable RLS
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Allow inserts from edge functions (service role)
-- No policies needed for public access since this will be managed by edge function with service role