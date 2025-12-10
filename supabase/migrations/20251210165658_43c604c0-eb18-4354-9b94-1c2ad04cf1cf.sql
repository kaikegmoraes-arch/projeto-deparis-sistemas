-- Create enum for request types
CREATE TYPE public.request_type AS ENUM ('contact', 'support', 'quote');

-- Create enum for request status
CREATE TYPE public.request_status AS ENUM ('novo', 'em_andamento', 'finalizado');

-- Create table for all form submissions
CREATE TABLE public.requests (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    type request_type NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    message TEXT,
    problem_description TEXT,
    service_type TEXT,
    equipment_quantity INTEGER,
    company_type TEXT,
    urgency TEXT,
    status request_status NOT NULL DEFAULT 'novo',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- Create policy for public insert
CREATE POLICY "Anyone can submit requests" 
ON public.requests 
FOR INSERT 
WITH CHECK (true);

-- Create policy for public read
CREATE POLICY "Anyone can view requests" 
ON public.requests 
FOR SELECT 
USING (true);

-- Create policy for updates
CREATE POLICY "Anyone can update requests" 
ON public.requests 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_requests_updated_at
BEFORE UPDATE ON public.requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();