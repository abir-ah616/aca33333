/*
  # Add view increment functions

  1. Functions
    - `increment_story_views` - Increment story view count
    - `increment_part_views` - Increment story part view count
*/

-- Function to increment story views
CREATE OR REPLACE FUNCTION increment_story_views(story_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE stories 
  SET views = views + 1 
  WHERE id = story_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment part views
CREATE OR REPLACE FUNCTION increment_part_views(part_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE story_parts 
  SET views = views + 1 
  WHERE id = part_id;
END;
$$ LANGUAGE plpgsql;