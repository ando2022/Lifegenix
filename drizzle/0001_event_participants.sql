-- Create event_participants table
CREATE TABLE IF NOT EXISTS event_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  event_slug TEXT NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone_number TEXT,
  questionnaire JSONB,
  completed_at TIMESTAMP,
  claimed BOOLEAN DEFAULT false,
  claimed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_event_participants_event_slug ON event_participants(event_slug);
CREATE INDEX idx_event_participants_email ON event_participants(email);
CREATE INDEX idx_event_participants_user_id ON event_participants(user_id);
CREATE INDEX idx_event_participants_completed_at ON event_participants(completed_at);