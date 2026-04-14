-- Create storage bucket for event images
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-images', 'event-images', true);

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload event images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'event-images');

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update event images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'event-images');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete event images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'event-images');

-- Allow public read access
CREATE POLICY "Anyone can view event images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'event-images');