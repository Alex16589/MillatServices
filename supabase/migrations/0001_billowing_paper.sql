/*
  # Service Requests Table Setup
  
  Creates the basic structure for managing service requests with proper security
*/

-- Create service requests table with basic structure
CREATE TABLE IF NOT EXISTS service_requests (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name text NOT NULL,
    mobile text NOT NULL,
    technician_name text NOT NULL,
    service_date date NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    status text DEFAULT 'pending' NOT NULL,
    notes text,
    CONSTRAINT valid_status CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    CONSTRAINT service_requests_mobile_check CHECK (length(mobile) >= 6)
);

-- Enable RLS
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- Basic policies for data access
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'service_requests' 
        AND policyname = 'Users can view their own service requests'
    ) THEN
        CREATE POLICY "Users can view their own service requests"
            ON service_requests FOR SELECT
            TO authenticated
            USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'service_requests' 
        AND policyname = 'Users can insert their own service requests'
    ) THEN
        CREATE POLICY "Users can insert their own service requests"
            ON service_requests FOR INSERT
            TO authenticated
            WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'service_requests' 
        AND policyname = 'Users can update their own service requests'
    ) THEN
        CREATE POLICY "Users can update their own service requests"
            ON service_requests FOR UPDATE
            TO authenticated
            USING (auth.uid() = user_id)
            WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;