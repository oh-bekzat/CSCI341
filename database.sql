CREATE TYPE gender AS ENUM ('male', 'female')
CREATE TYPE caregiving_type AS ENUM ('babysitter', 'caregiver for elderly', 'playmate for children')
CREATE TYPE appointment_status AS ENUM ('confirmed', 'declined', 'pending')

CREATE TABLE "user" (
  	user_id serial PRIMARY KEY,
  	email varchar(255) UNIQUE NOT NULL,
  	given_name varchar(255) NOT NULL,
  	surname varchar(255) NOT NULL,
  	city varchar(255),
  	phone_number varchar(12) CHECK (phone_number ~ '^\+?[0-9]{11}$') NOT NULL,
  	profile_description text not NULL,
  	"password" text NOT NULL
)

CREATE TABLE caregiver (
  	caregiver_user_id int PRIMARY KEY REFERENCES "user"(user_id) ON UPDATE CASCADE ON DELETE CASCADE,
  	photo_data bytea NOT NULL,
  	gender gender NOT NULL,
  	caregiving_type caregiving_type NOT NULL,
  	hourly_rate numeric(12, 2) NOT NULL
)

CREATE TABLE "member" (
	member_user_id int PRIMARY KEY REFERENCES "user"(user_id) ON UPDATE CASCADE ON DELETE CASCADE,
  	house_rules text NOT NULL
)

create TABLE address (
	member_user_id int PRIMARY KEY REFERENCES "user"(user_id) ON UPDATE CASCADE ON DELETE CASCADE,
  	house_number varchar(255) NOT NULL,
  	street varchar(255) NOT NULL,
  	town varchar(255) NOT NULL
)

CREATE TABLE job (
	job_id serial PRIMARY KEY,
  	member_user_id int REFERENCES "member"(member_user_id) ON UPDATE CASCADE ON DELETE CASCADE,
  	required_caregiving_type caregiving_type NOT NULL,
  	other_requirements text,
  	date_posted timestamp NOT NULL
)

CREATE TABLE job_application (
	caregiver_user_id int REFERENCES "caregiver"(caregiver_user_id) ON UPDATE CASCADE ON DELETE CASCADE,
  	job_id int REFERENCES job(job_id) ON UPDATE CASCADE ON DELETE CASCADE,
  	date_applied timestamp NOT NULL,
  	PRIMARY KEY (caregiver_user_id, job_id)
)

CREATE TABLE appointment (
	appointment_id serial PRIMARY KEY,
  	caregiver_user_id int REFERENCES "caregiver"(caregiver_user_id) ON UPDATE CASCADE ON DELETE CASCADE,
  	member_user_id int REFERENCES "member"(member_user_id) ON UPDATE CASCADE ON DELETE CASCADE,
  	appointment_date date NOT NULL,
  	appointment_time time NOT NULL,
  	work_hours int NOT NULL,
  	"status" appointment_status NOT NULL
)

SELECT work_hours FROM appointment WHERE caregiver_user_id IN (
	SELECT caregiver_user_id FROM caregiver WHERE caregiving_type = 'babysitter'
)

INSERT INTO "user" (email, given_name, surname, city, phone_number, profile_description, "password")
VALUES
	('oh.bekzat@gmail.com', 'Bekzat', 'Ongdassynov', 'Astana', '+77784717378', 'Used to take care of my grandfather. Great at doing chores and keeping things clean', 'hashed_password_oh.bekzat'),
    ('a.sabyrbek@gmail.com', 'Aruzhan', 'Sabyrbek', 'Astana', '+77075210402', 'My grandmother is unable to cook due to her health, she is 82 years old, lives alone.', 'hashed_password_a.sabyrbek'),
    ('zh.sansyzbay@gmail.com', 'Zhalgas', 'Sansyzbay', 'Almaty', '+77786829938', 'Bachelor in computer science, have taught English to kids.', 'hashed_password_zh.sansyzbay'),
    ('k.kabylet@gmail.com', 'Kazbek', 'Kabylet', 'Kokshetau', '+77054779273', 'Electrical engineer, grew up helping my parents taking care of my siblings.', 'hashed_password_k.kabylet'),
    ('a.askarov@gmail.com', 'Askar', 'Askarov', 'Pavlodar', '+77024839304', 'My son is 6 years old, a good kid, we just need someone to look after him when we are at work.', 'hashed_password_a.askarov'),
    ('g.bolatbekov@gmail.com', 'Gani', 'Bolatbekov', 'Taldykorgan', '+77478289283', 'My daughter is 2 years old, eats well and sleeps well, too. Feels safe with most adults.', 'hashed_password_g.bolatbekov'),
    ('a.batyrkhan@gmail.com', 'Alima', 'Batyrkhan', 'Shymkent', '+77783324252', 'I am a mother of 2 bright kids. Can apply different approaches that are research-backed and have skills necessary for a babysitter.', 'hashed_password_a.batyrkhan'),
    ('m.zhumabayev@gmail.com', 'Magzhan', 'Zhumabayev', 'Almaty', '+77088099880', 'No prior experience with kids, but parents tell me I would be a great parent myself one day.', 'hashed_password_m.zhumabayev'),
    ('k.elubayeva@gmail.com', 'Kerbez', 'Elubayeva', 'Pavlodar', '+77051324872', 'My grandfather has dementia of early stages, not aggressive but unable to do most of the basic stuff. Needs constant assistance.', 'hashed_password_k.elubayeva'),
    ('zh.zhapparova@gmail.com', 'Zhanna', 'Zhapparova', 'Aktau', '+77779677685', 'I have been a babysitter my whole life, can adjust to any child. Also, I am a mother of 6 children.', 'hashed_password_zh.zhapparova'),
	('a.abdulova@gmail.com', 'Ainur', 'Abdulova', 'Almaty', '+77051234567', 'Experienced babysitter with a background in early childhood development.', 'hashed_password_ainura.abdulova'),
    ('n.tolegenov@gmail.com', 'Nursultan', 'Tolegenov', 'Astana', '+77471234568', 'Passionate about providing companionship and care for the elderly.', 'hashed_password_n.tolegenov'),
    ('a.sarsenova@gmail.com', 'Aigerim', 'Sarsenova', 'Shymkent', '+77011234569', 'Seeking a caring individual for my 6-year-old child who enjoys creative activities.', 'hashed_password_a.sarsenova'),
    ('z.mukhametova@gmail.com', 'Zhanna', 'Mukhametova', 'Astana', '+77781234570', 'Enjoys creating a positive and educational environment for my 3-year-old daughter.', 'hashed_password_zh.mukhametova'),
    ('b.suleimenova@gmail.com', 'Bakyt', 'Suleimenova', 'Pavlodar', '+77011234571', 'Experienced caregiver with a background in healthcare and first aid.', 'hashed_password_b.suleimenova'),
    ('b.bolatov@gmail.com', 'Bolat', 'Bolatov', 'Almaty', '+77781234572', 'Seeking compassionate care for my elderly father with a focus on maintaining a comfortable environment.', 'hashed_password_b.bolatov'),
    ('m.azimova@gmail.com', 'Madina', 'Azimova', 'Aktobe', '+77471234573', 'Passionate about providing care for my 4-year-old son and supporting his educational needs.', 'hashed_password_m.azimova'),
    ('a.zhumagulov@gmail.com', 'Aslan', 'Zhumagulov', 'Taraz', '+77021234574', 'Seeking a caring individual to assist with elderly care and maintaining a comfortable environment for my mother.', 'hashed_password_a.zhumagulov'),
    ('a.kudaibergenova@gmail.com', 'Aizhan', 'Kudaibergenova', 'Shymkent', '+77781234575', 'Looking for a responsible individual to engage my 8-year-old daughter in outdoor activities and educational games.', 'hashed_password_a.kudaibergenova'),
    ('s.tasbolatov@gmail.com', 'Salamat', 'Tasbolatov', 'Karaganda', '+77771234576', 'Have prior experience in taking care of elderly with memory issues.', 'hashed_password_s.tasbolatov'),
    ('g.bekmukhambetova@gmail.com', 'Gulnara', 'Bekmukhambetova', 'Almaty', '+77771234577', 'Seeking compassionate care for my elderly mother with a patient and understanding approach.', 'hashed_password_g.bekmukhambetova'),
    ('n.mukanov@gmail.com', 'Nurlan', 'Mukanov', 'Atyrau', '+77021234578', 'Looking for someone to create a safe and enjoyable environment for my two children.', 'hashed_password_n.mukanov'),
    ('d.kenzhebayeva@gmail.com', 'Dina', 'Kenzhebayeva', 'Astana', '+77471234579', 'Experienced caregiver with a background in child psychology and early childhood development.', 'hashed_password_d.kenzhebayeva'),
    ('a.kadyrbekov@gmail.com', 'Azamat', 'Kadyrbekov', 'Kostanay', '+77781234580', 'Seeking compassionate care for my elderly grandfather with a focus on companionship and mental stimulation.', 'hashed_password_a.kadyrbekov'),
    ('a.sadykova@gmail.com', 'Aydana', 'Sadykova', 'Aktau', '+77721234581', 'Looking for someone creative to engage my three children in artistic and creative activities for their development.', 'hashed_password_a.sadykova')

INSERT INTO caregiver (caregiver_user_id, photo_data, gender, caregiving_type, hourly_rate)
VALUES
    (1, E'\\x0123456789ABCDEF', 'male', 'caregiver for elderly', 8.40),
    (3, E'\\x1123456789ABCDEF', 'male', 'playmate for children', 12.00),
	(4, E'\\x2123456789ABCDEF', 'male', 'playmate for children', 15.20),
	(7, E'\\x3123456789ABCDEF', 'female', 'babysitter', 18.50),
	(8, E'\\x4123456789ABCDEF', 'male', 'playmate for children', 13.70),
	(10, E'\\x5123456789ABCDEF', 'female', 'babysitter', 5.60),
	(11, E'\\x6123456789ABCDEF', 'female', 'babysitter', 19.50),
	(12, E'\\x7123456789ABCDEF', 'male', 'caregiver for elderly', 7.50),
	(15, E'\\x8123456789ABCDEF', 'female', 'caregiver for elderly', 7.20),
	(20, E'\\x9123456789ABCDEF', 'male', 'caregiver for elderly', 9.80),
	(23, E'\\xA123456789ABCDEF', 'female', 'playmate for children', 24.00)

INSERT INTO "member" (member_user_id, house_rules)
VALUES
    (2, 'Quiet hours are from 9 PM to 7 AM. No pets. Please ensure minimal noise during these hours to provide a peaceful environment for our family members.'),
    (5, 'Kindly remove outdoor shoes before entering the house to maintain cleanliness. Please use the designated shoe rack by the entrance.'),
    (6, 'Remember to water the plants every other day. Each plant has specific watering instructions; refer to the provided care guide.'),
    (9, 'Smoking is only allowed in the backyard. No pets. Please use the designated smoking area and dispose of cigarette butts responsibly.'),
    (13, 'Be diligent about recycling. No pets. Separate bins are provided for paper, plastic, glass, and organic waste. Follow the recycling guidelines posted in the kitchen.'),
    (14, 'Participate in family game night every Friday. Join in for some fun and friendly competition! Board games and cards are available in the living room.'),
    (16, 'Maintain a quiet environment in the study room from 2 PM to 5 PM. Use headphones when listening to music or engaging in activities during this time.'),
    (17, 'Ensure that pets are kept out of the living room to maintain a clean and allergen-free common area. Designate specific pet-friendly zones within your assigned areas.'),
    (18, 'Adhere to the weekly cleaning rotation for common areas. Check the cleaning schedule posted on the fridge and ensure all tasks are completed on time.'),
    (19, 'Engage in movie nights in the home theater every Saturday. Feel free to suggest movie choices, and snacks will be provided.'),
    (21, 'Respect the vegetarian kitchen policy. No pets. No meat is allowed; please prepare and store meals accordingly.'),
    (22, 'Inform other house members about any planned guests and maintain a welcoming environment during their visits.'),
    (24, 'Use coasters for all drinks on the coffee table to prevent stains. No pets. Coasters are available in the living room; feel free to ask if you cannot find them.'),
    (25, 'Participate in monthly house meetings to discuss caregiving concerns, plans, and any necessary adjustments to the caregiving routine. Your input is valuable; please actively engage in discussions.')

INSERT INTO address (member_user_id, house_number, street, town)
VALUES
    (2, '123a', 'Turan', 'Astana'),
    (5, '46', 'Ryskulov', 'Uzynagash'),
    (6, '79b', 'Auezov', 'Astana'),
    (9, '10', 'Abylai Khan', 'Astana'),
    (13, '234', 'Lomonosov', 'Ekibastuz'),
    (14, '567', 'Auezov', 'Astana'),
    (16, '890c', 'Keruen', 'Temirtau'),
    (17, '12', 'Aktaban', 'Astana'),
    (18, '345', 'Turan', 'Astana'),
    (19, '60a', 'Atyrau', 'Astana'),
    (21, '910', 'Keruen', 'Arys'),
    (22, '12', 'Turan', 'Astana'),
    (24, '45f', 'Ayan', 'Kapchagay'),
    (25, '89', 'Abylai Khan', 'Astana')

INSERT INTO job (member_user_id, required_caregiving_type, other_requirements, date_posted)
VALUES
    (2, 'caregiver for elderly', 'Experience in preparing nutritious meals for elderly individuals. Familiarity with dementia care is a plus.', '2023-11-18'),
    (5, 'babysitter', 'Experience in supervising and engaging with newborn children. A person must be super gentle. Basic first aid knowledge is appreciated.', '2023-08-29'),
    (6, 'playmate for children', 'Creativity in organizing age-appropriate play and stimulating activities for 2-year-old children.', '2023-04-20'),
    (9, 'caregiver for elderly', 'Patience and compassion in providing constant assistance to individuals in the early stages of dementia.', '2023-06-27'),
    (13, 'playmate for children', 'Enthusiasm for engaging in creative and age-appropriate activities with a 6-year-old child.', '2023-11-10'),
    (14, 'caregiver for elderly', 'Compassion and understanding in providing care for an elderly individual. Ability to maintain a comfortable environment.', '2023-11-18'),
    (16, 'babysitter', 'Experience in creating a positive and educational environment for a 3-year-old, with a focus on safety.', '2023-07-08'),
    (17, 'babysitter', 'Passion for supporting the educational needs of a 4-year-old child through engaging activities.', '2023-11-18'),
    (18, 'caregiver for elderly', 'Understanding of dementia care and the ability to provide companionship and mental stimulation in a gentle manner.', '2023-11-01'),
    (19, 'playmate for children', 'Creativity in organizing artistic and creative activities for the development of three children.', '2023-09-11'),
    (21, 'playmate for children', 'Research-backed approaches and skills necessary for engaging with bright kids in creative activities.', '2023-10-20'),
    (22, 'caregiver for elderly', 'Compassionate care and experience in administering medication for elderly individuals.', '2023-11-18'),
    (24, 'caregiver for elderly', 'Patient, gentle and understanding approach in providing compassionate care for an elderly mother.', '2023-10-15'),
    (25, 'babysitter', 'Experience in child psychology and early childhood development, with familiarity in age-appropriate learning activities.', '2023-11-18'),
	(16, 'playmate for children', 'Playing tennis with my 7-year-old son.', '2023-07-08')

INSERT INTO job_application (caregiver_user_id, job_id, date_applied)
VALUES
    (3, 3, '2023-11-20'),
    (4, 5, '2023-11-21'),
    (23, 10, '2023-11-22'),
    (3, 5, '2023-11-23'),
    (23, 3, '2023-11-24'),
    (1, 1, '2023-11-25'),
    (12, 4, '2023-11-26'),
    (20, 6, '2023-11-27'),
    (20, 1, '2023-11-28'),
    (12, 6, '2023-11-29'),
    (20, 4, '2023-11-30'),
    (1, 4, '2023-12-01'),
    (1, 12, '2023-12-02'),
    (4, 3, '2023-12-04'),
    (7, 5, '2023-12-05'),
    (10, 7, '2023-12-06'),
    (11, 8, '2023-12-07'),
    (7, 14, '2023-12-08'),
    (11, 5, '2023-12-09')

INSERT INTO appointment (caregiver_user_id, member_user_id, appointment_date, appointment_time, work_hours, "status")
VALUES
    (3, 6, '2023-12-15', '09:00', 120, 'pending'),
    (23, 6, '2023-12-16', '10:30', 180, 'declined'),
    (12, 14, '2023-12-17', '14:00', 120, 'pending'),
    (20, 2, '2023-12-18', '11:00', 300, 'confirmed'),
    (1, 9, '2023-12-19', '15:30', 180, 'declined'),
    (4, 6, '2023-12-20', '08:00', 360, 'confirmed'),
    (7, 13, '2023-12-21', '13:30', 240, 'confirmed'),
    (10, 16, '2023-12-22', '09:45', 180, 'confirmed'),
    (11, 17, '2023-12-23', '12:00', 300, 'declined'),
    (23, 19, '2023-12-24', '14:15', 120, 'confirmed'),
    (20, 9, '2023-12-25', '11:30', 240, 'pending'),
    (1, 22, '2023-12-26', '16:00', 180, 'pending')

UPDATE "user" SET phone_number = '+77771010001' WHERE given_name = 'Askar' AND surname = 'Askarov'

UPDATE caregiver SET hourly_rate = hourly_rate + 
	CASE
		WHEN hourly_rate < 9 THEN 0.5
    	ELSE hourly_rate * 0.1
  	END

SELECT * FROM job WHERE member_user_id IN (SELECT member_user_id FROM "member" WHERE member_user_id IN (SELECT user_id FROM "user" WHERE given_name = 'Bolat' AND surname = 'Bolatov'))

DELETE FROM job WHERE member_user_id IN (SELECT member_user_id FROM "member" WHERE member_user_id IN (SELECT user_id FROM "user" WHERE given_name = 'Bolat' AND surname = 'Bolatov'))

DELETE FROM job
WHERE member_user_id IN (
    SELECT member_user_id
    FROM "member" m
    JOIN "user" u ON m.member_user_id = u.user_id
    WHERE u.given_name = 'Bolat' AND u.surname = 'Bolatov'
)

SELECT * FROM "member" WHERE member_user_id IN (SELECT member_user_id FROM address WHERE street = 'Turan')

DELETE FROM "member" WHERE member_user_id IN (SELECT member_user_id FROM address WHERE street = 'Turan')

SELECT 
    u.given_name AS caregiver_given_name,
    u.surname AS caregiver_surname,
    m.given_name AS member_given_name,
    m.surname AS member_surname
FROM 
    appointment a
JOIN 
    "user" u ON a.caregiver_user_id = u.user_id
JOIN 
    "user" m ON a.member_user_id = m.user_id
WHERE 
    a.status = 'confirmed'