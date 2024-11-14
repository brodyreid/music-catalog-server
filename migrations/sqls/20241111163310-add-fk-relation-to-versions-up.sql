ALTER TABLE versions
ADD project_id integer;

ALTER TABLE versions
ADD FOREIGN KEY (project_id)
REFERENCES projects(id)
ON DELETE CASCADE;