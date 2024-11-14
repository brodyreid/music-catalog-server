-- Insert seed data into contributors table
INSERT INTO public.contributors (id, "name") VALUES (1, 'Banana Boy'), (2, 'Mookymakesmusic'), (3, 'Marbl'), (4, 'Bally'), (5, 'Trev'), (6, 'Claudia'), (7, 'Rick'), (8, 'Waryaa'), (9, 'Remi');

-- Insert seed data into projects table
-- dates are yyyy-mm-dd
INSERT INTO public.projects (id, title, folder_path, notes, date_created) VALUES
(1, 'A Good Winter', '/Users/brodyreid/Documents/Music/Ableton/Projects/BB Productions/2024/8. August/699 [bon iver] Project', '', '2024-08-03'),
(2, 'Give Up the Money', '/Users/brodyreid/Documents/Music/Ableton/Projects/BB Productions/2024/7. July/697 [video game ost] Project', 'mooky and i turned this into a BANGER', '2024-07-24'),
(3, 'brb', '/Users/brodyreid/Documents/Music/Ableton/Projects/BB Productions/2023/7. July/634 [b r b] Project', '', '2023-07-24'),
(4, 'It Sounded Like a River; It Was Just the Trees', '/Users/brodyreid/Documents/Music/Ableton/Projects/BB Productions/2023/11. November/659 [shit talk] Project', 'not doing vocals on this anymore. the instrumental is good enough', '2023-11-06'),
(5, 'Blockbuster Video', '/Users/brodyreid/Documents/Music/Ableton/Projects/Mooky/Blockbuster Video Project', '', '2024-08-07'),
(6, 'Do You', '/Users/brodyreid/Documents/Music/Ableton/Projects/Mooky/forza Project', '', '2023-05-01'),
(7, 'Maybe Later', '/Users/brodyreid/Documents/Music/Ableton/Projects/Marbl/Maybe Later Project', 'marie on the hook but make it trevs song', '2024-06-23');

-- Insert seed data into project_contributors table
INSERT INTO public.project_contributors (project_id, contributor_id) VALUES (1, 1), (2, 1), (2, 2), (3, 1), (3, 9), (4, 1), (5, 1), (5, 2), (6, 1), (6, 2), (7, 1), (7, 3), (7, 5);

-- Insert seed data into versions table
INSERT INTO public.versions (id, project_id, "name", date_created) VALUES
(1, 2, 'v2', '2024-11-07'),
(2, 2, 'v3', '2024-11-07'),
(3, 3, 'v2', '2024-05-20'),
(4, 3, 'v3', '2024-07-11'),
(5, 4, 'v2', '2024-11-10'),
(6, 6, 'v2', '2023-11-15'),
(7, 6, 'v2 STEMS', '2023-10-20'),
(8, 6, 'v3', '2023-09-12'),
(9, 6, 'v4', '2023-09-22');