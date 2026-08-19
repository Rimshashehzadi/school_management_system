# ERD (Relationships)

> Status: **Implemented 2026-08-19** in `back-end/prisma/schema.prisma` (migration `20260819133018_init`). See [[03 Database/Data Model]] for field shapes and the resolved decisions.

```text
User 1──* (login) 
Role 1──* User            (role enum or RBAC tables — decision pending)

Class 1──* Section
Class 1──* Student
Section 1──* Student

Teacher 1──* TeacherClassSubject *──1 Class
TeacherClassSubject *──1 Subject

Student 1──* Attendance
Student 1──* FeeRecord
Student 1──* FeePayment
Student 1──* Mark

FeeStructure 1──* FeeRecord     (fee type/amount per class)
FeeRecord 1──* FeePayment       (installments)

Exam 1──* ExamSubject
ExamSubject 1──* Mark
Student *──* Exam  (through Mark)

Student 1──* StudentParent  *──1 Parent    (many-to-many guardians)

Class 1──* Timetable
Subject 1──* Timetable
Teacher 1──* Timetable

User 1──* Notice
Role 1──* NoticeTarget

Transaction *──1 FeePayment     (optional link for accounting)
```

## Cardinality summary

| Relationship | Type |
|---|---|
| Class → Section | 1:N |
| Class → Student | 1:N |
| Teacher ↔ Class ↔ Subject | M:N (join: TeacherClassSubject) |
| Student → Attendance | 1:N |
| Student → FeeRecord | 1:N |
| Student ↔ Parent | M:N (join: StudentParent) |
| Exam → ExamSubject | 1:N |
| ExamSubject → Mark | 1:N |
| Student → Mark | 1:N |
| Class → Timetable | 1:N |
| User → Notice | 1:N |

## Integrity rules to enforce

- `Attendance(student_id, date)` must be unique — one record per student per day.
- `Mark(student_id, exam_subject_id)` must be unique.
- Obtained marks must be `<= totalMarks`.
- A Student's class/section should reference real Class/Section rows (frontend currently uses free-text like `10-A`).
- Deleting a Class should be restricted if students exist (cascade decision pending — default: restrict).
- `FeePayment.receiptNo` should be unique and auto-generated server-side.

## Questions pending
1. Use a `role` enum on User, or full Role/Permission RBAC tables? (Recommendation: start with enum + backend guard helpers; add RBAC only if required.)
2. Should Class and Section be split, or combined as one `class` string to match frontend? (Recommendation: split — it is the correct model; frontend can join them for display.)
3. Cascade behavior for Student deletion (delete attendance/fees/marks vs. soft-delete). (Recommendation: soft-delete/status flag — fee history must be preserved.)