from sqlalchemy import create_engine, text

user = 'postgres'
password = 'postgres'
host = 'localhost'
port = '5432'
db = 'caregiving'

engine = create_engine(f'postgresql://{user}:{password}@{host}:{port}/{db}')

# 3.1
print("3.1")
askar_phone_number = text("""
    SELECT phone_number
    FROM \"user\"
    WHERE given_name = 'Askar' AND surname = 'Askarov'
""")

askar_update = text("""
    UPDATE \"user\"
    SET phone_number = '+77771010001'
    WHERE given_name = 'Askar' AND surname = 'Askarov'
""")

with engine.connect() as connection:
    res_old = connection.execute(askar_phone_number)
    askar_number_old = res_old.scalar()
    print(f'Askar Askarov\'s phone number before the update: {askar_number_old}')
    connection.execute(askar_update)
    res_new = connection.execute(askar_phone_number)
    askar_number_new  = res_new.scalar()
    print(f'Askar Askarov\'s phone number after the update: {askar_number_new}')
    #connection.commit()

#3.2
print("\n3.2")
hourly_rates = text("SELECT hourly_rate FROM caregiver")
add_commission = text("""
    UPDATE caregiver SET hourly_rate = hourly_rate + 
	    CASE
		    WHEN hourly_rate < 9 THEN 0.5
    	    ELSE hourly_rate * 0.1
  	    END
""")

with engine.connect() as connection:
    res_old = connection.execute(hourly_rates)
    hourly_rates_old = res_old.fetchall()
    print("Hourly rates before update:",", ".join(str(rate[0]) for rate in hourly_rates_old))
    connection.execute(add_commission)
    res_new = connection.execute(hourly_rates)
    hourly_rates_new = res_new.fetchall()
    print("Hourly rates after update:",", ".join(str(rate[0]) for rate in hourly_rates_new))
    #connection.commit()

#4.1
print("\n4.1")
jobs_bolatov = text("""
    SELECT COUNT(*) FROM job
    WHERE member_user_id IN (
        SELECT member_user_id 
        FROM "member" m 
        JOIN "user" u ON m.member_user_id = u.user_id 
        WHERE u.given_name = 'Bolat' AND u.surname = 'Bolatov'
    )
""")

delete_jobs = text("""
    DELETE FROM job 
    WHERE member_user_id IN (
        SELECT member_user_id 
        FROM "member" m 
        JOIN "user" u ON m.member_user_id = u.user_id
        WHERE u.given_name = 'Bolat' AND u.surname = 'Bolatov'
    )
""")

with engine.connect() as connection:
    res_old = connection.execute(jobs_bolatov)
    jobs_old = res_old.scalar()
    print(f"Bolat Bolatov's number of jobs before deletion: {jobs_old}")
    connection.execute(delete_jobs)
    res_new = connection.execute(jobs_bolatov)
    jobs_new = res_new.scalar()
    print(f"Bolat Bolatov's number of jobs after deletion: {jobs_new}")
    #connection.commit()

#4.2
print("\n4.2")

dwellers_of_turan = text("""
    SELECT COUNT(*) FROM "member"
        WHERE member_user_id IN (
            SELECT member_user_id
            FROM address
            WHERE street = 'Turan')
""")

delete_turan = text("""
    DELETE FROM "member"
        WHERE member_user_id IN (
            SELECT member_user_id
            FROM address
            WHERE street = 'Turan')
""")

with engine.connect() as connection:
    res_old = connection.execute(dwellers_of_turan)
    turan_old = res_old.scalar()
    print(f"Members from Turan before deletion: {turan_old}")
    connection.execute(delete_turan)
    res_new = connection.execute(dwellers_of_turan)
    turan_new = res_new.scalar()
    print(f"Members from Turan after deletion: {turan_new}")
    #connection.commit()

#5.1
print("\n5.1")

confirmed_appointments = text("""
SELECT 
    u.given_name AS caregiver_given_name,
    u.surname AS caregiver_surname,
    m.given_name AS member_given_name,
    m.surname AS member_surname
FROM appointment a
JOIN "user" u ON a.caregiver_user_id = u.user_id
JOIN "user" m ON a.member_user_id = m.user_id
WHERE a.status = 'confirmed'
""")

with engine.connect() as connection:
    res = connection.execute(confirmed_appointments)
    appointments = res.fetchall()
    print("Caregiver - Member")
    for appointment in appointments:
        print(f"{appointment[0]} {appointment[1]} - {appointment[2]} {appointment[3]}")
    #connection.commit()

#5.2
print("\n5.2")

gentle_jobs = text("""
SELECT job_id
FROM job
WHERE LOWER(other_requirements) LIKE '%gentle%'
""")

with engine.connect() as connection:
    res = connection.execute(gentle_jobs)
    job_ids = res.fetchall()
    print("Job id's that have the word'gentle' in them:",", ".join(str(job_id[0]) for job_id in job_ids))
    #connection.commit()

#5.3
print("\n5.3")

babysitter_work_hours = text("""
SELECT ROUND(work_hours / 60.0, 1) AS work_hours_in_hours
FROM appointment
WHERE caregiver_user_id IN (
	SELECT caregiver_user_id
    FROM caregiver
    WHERE caregiving_type = 'babysitter'
)
""")

with engine.connect() as connection:
    res = connection.execute(babysitter_work_hours)
    work_hours = res.fetchall()
    print("Job hours of babysitter positions:",", ".join(str(work_hour[0]) for work_hour in work_hours))
    #connection.commit()

#5.4
print("\n5.4")

members_elderly = text("""
SELECT given_name, surname
FROM "user"
WHERE user_id IN (
    SELECT DISTINCT m.member_user_id
    FROM "member" m
    JOIN address a ON m.member_user_id = a.member_user_id
    JOIN job j ON m.member_user_id = j.member_user_id
    WHERE a.town = 'Astana' 
        AND j.required_caregiving_type = 'caregiver for elderly'
        AND LOWER(m.house_rules) LIKE '%no pets%')
""")

with engine.connect() as connection:
    res = connection.execute(members_elderly)
    members = res.fetchall()
    print("Members with a rule 'No pets' looking for caretakers for elderly from Astana:", ", ".join(f"{member[0]} {member[1]}" for member in members))
    #connection.commit()

#6.1
print("\n6.1")

applicants_per_job = text("""
SELECT j.job_id, j.member_user_id, u.given_name, u.surname,
    COUNT(ja.caregiver_user_id) AS number_of_applicants
FROM job j
LEFT JOIN job_application ja ON j.job_id = ja.job_id
LEFT JOIN "user" u ON j.member_user_id = u.user_id
GROUP BY j.job_id, j.member_user_id, u.given_name, u.surname
""")

with engine.connect() as connection:
    res = connection.execute(applicants_per_job)
    applicants = res.fetchall()
    print("job id - member - number of applicants")
    for applicant in applicants:
        print(f"{applicant[0]} - {applicant[2]} {applicant[3]} - {applicant[4]}")
    #connection.commit()

#6.2
print("\n6.2")

total_hours_spent = text("""
SELECT c.caregiver_user_id, u.given_name, u.surname,
    SUM(a.work_hours) AS total_hours_spent
FROM caregiver c
JOIN appointment a ON c.caregiver_user_id = a.caregiver_user_id
JOIN "user" u ON c.caregiver_user_id = u.user_id
WHERE a.status = 'confirmed'
GROUP BY c.caregiver_user_id, u.given_name, u.surname
""")

with engine.connect() as connection:
    res = connection.execute(total_hours_spent)
    hours = res.fetchall()
    print("caregiver name - total hours spent")
    for hour in hours:
        print(f"{hour[1]} {hour[2]} - {hour[3]}")
    #connection.commit()

#6.3
print("\n6.3")

average_pay = text("""
SELECT ROUND(AVG(c.hourly_rate), 2) AS average_hourly_rate
FROM caregiver c
JOIN appointment a ON c.caregiver_user_id = a.caregiver_user_id
WHERE a.status = 'confirmed'              
""")

average_pay_grouped = text("""
SELECT u.given_name, u.surname,
    ROUND(AVG(c.hourly_rate), 2) AS average_hourly_rate
FROM caregiver c
JOIN appointment a ON c.caregiver_user_id = a.caregiver_user_id
JOIN "user" u ON c.caregiver_user_id = u.user_id
WHERE a.status = 'confirmed'
GROUP BY c.caregiver_user_id, u.given_name, u.surname
""")

with engine.connect() as connection:
    res = connection.execute(average_pay)
    pay = res.scalar()
    print(f"Average pay overall - ${pay}\n")
    #connection.commit()

with engine.connect() as connection:
    res = connection.execute(average_pay_grouped)
    caretakers_pay = res.fetchall()
    print("Average pay for each caregiver:", ", ".join(f"\n{pay[0]} {pay[1]} - ${pay[2]}" for pay in caretakers_pay))
    #connection.commit()

#6.4
print("\n6.4")
#decided to also display total earnings, similar calculation as in 7
average_pay = text("""
WITH caregiver_earnings AS (
    SELECT c.caregiver_user_id, u.given_name, u.surname,
        SUM(a.work_hours) * c.hourly_rate AS total_earnings
    FROM caregiver c
    JOIN appointment a ON c.caregiver_user_id = a.caregiver_user_id
    JOIN "user" u ON c.caregiver_user_id = u.user_id
    WHERE a.status = 'confirmed'
    GROUP BY c.caregiver_user_id, u.given_name, u.surname, c.hourly_rate
)
SELECT * FROM caregiver_earnings
WHERE total_earnings > (SELECT AVG(total_earnings) FROM caregiver_earnings)
""")

with engine.connect() as connection:
    res = connection.execute(average_pay)
    earnings = res.fetchall()
    print("caregiver name - total earnings")
    for earning in earnings:
        print(f"{earning[1]} {earning[2]} - {earning[3]}")
    #connection.commit()

#7
print("\n7")

total_earnings = text("""
WITH caregiver_earnings AS (
    SELECT a.caregiver_user_id, u.given_name, u.surname,
        SUM(a.work_hours * c.hourly_rate) AS total_earnings
    FROM appointment a
    JOIN caregiver c ON a.caregiver_user_id = c.caregiver_user_id
    JOIN "user" u ON c.caregiver_user_id = u.user_id
    WHERE a.status = 'confirmed'
    GROUP BY a.caregiver_user_id, u.given_name, u.surname
)
SELECT * FROM caregiver_earnings
""")

with engine.connect() as connection:
    res = connection.execute(total_earnings)
    earnings = res.fetchall()
    print("caregiver name - total earnings")
    for earning in earnings:
        print(f"{earning[1]} {earning[2]} - {earning[3]}")
    #connection.commit()

#8
print("\n8")

all_applications = text("""
SELECT ja.job_id, 
    j.member_user_id, u_m.given_name AS member_name, u_m.surname AS member_surname,
    u_app.user_id AS applicant_id, u_app.given_name AS applicant_name, u_app.surname AS applicant_surname,
    u_app.email AS applicant_email, u_app.phone_number AS applicant_phone_number, ja.date_applied
FROM job_application ja
    JOIN caregiver c ON ja.caregiver_user_id = c.caregiver_user_id
    JOIN "user" u_app ON c.caregiver_user_id = u_app.user_id
    JOIN job j ON ja.job_id = j.job_id
    JOIN "user" u_m ON j.member_user_id = u_m.user_id
""")

with engine.connect() as connection:
    res = connection.execute(all_applications)
    applications = res.fetchall()
    print("job id - member id - member - applicant id - applicant - applicant email - applicant phone number - date applied")
    for application in applications:
        print(f"{application[0]} - {application[1]} - {application[2]} {application[3]} - {application[4]} - {application[5]} {application[6]} - {application[7]} - {application[8]}")
    #connection.commit()