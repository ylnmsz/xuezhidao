# xuezhidao 数据库说明

本文档说明当前数据库包含的表、用途，以及各字段含义。

## users

用途：用户基础信息与学习画像。

字段：

- id：用户唯一标识（UUID）。
- role：用户角色（student/teacher）。
- name：姓名。
- email：邮箱（唯一）。
- phone：手机号（唯一，可为空）。
- password_hash：密码哈希。
- avatar_url：头像地址（本地上传或外链）。
- grade：年级。
- class_name：班级。
- school：学校。
- signature：个性签名。
- level：等级（默认 1）。
- streak_days：连续打卡天数（默认 0）。
- weekly_study_hours：本周学习时长（小时，1 位小数，默认 0）。
- homework_done：已完成作业数量（默认 0）。
- accuracy：正确率（百分比，2 位小数，默认 0）。
- created_at：创建时间。
- updated_at：更新时间。

## classes

用途：班级信息。

字段：

- id：班级唯一标识（UUID）。
- name：班级名称。
- teacher_id：任课教师 ID（关联 users.id）。
- created_at：创建时间。

## class_members

用途：班级成员关系表。

字段：

- id：记录唯一标识（UUID）。
- class_id：班级 ID（关联 classes.id）。
- user_id：用户 ID（关联 users.id）。
- role：成员角色（默认 student）。
- joined_at：加入时间。

## assignments

用途：作业信息。

字段：

- id：作业唯一标识（UUID）。
- class_id：班级 ID（关联 classes.id）。
- title：作业标题。
- description：作业描述。
- due_at：截止时间。
- created_at：创建时间。

## submissions

用途：作业提交与批改记录。

字段：

- id：提交记录唯一标识（UUID）。
- assignment_id：作业 ID（关联 assignments.id）。
- student_id：学生 ID（关联 users.id）。
- content：提交内容。
- score：成绩（数值）。
- status：提交状态（默认 submitted）。
- submitted_at：提交时间。
- graded_at：批改时间。

## question_banks

用途：题库分组。

字段：

- id：题库唯一标识（UUID）。
- name：题库名称。
- description：题库描述。
- subject：学科。
- created_by：创建者 ID（关联 users.id）。
- created_at：创建时间。

## questions

用途：题库中的题目。

字段：

- id：题目唯一标识（UUID）。
- bank_id：所属题库 ID（关联 question_banks.id）。
- content：题目内容。
- subject：学科。
- difficulty：难度。
- question_type：题目类型（如单选、多选、填空、问答）。
- answer：标准答案（可用文本/JSON 字符串保存）。
- explanation：题目解析。
- created_at：创建时间。

## messages

用途：站内私信。

字段：

- id：消息唯一标识（UUID）。
- sender_id：发送者 ID（关联 users.id）。
- receiver_id：接收者 ID（关联 users.id）。
- content：消息内容。
- created_at：创建时间。

## notifications

用途：通知提醒。

字段：

- id：通知唯一标识（UUID）。
- user_id：用户 ID（关联 users.id）。
- title：通知标题。
- body：通知内容。
- read_at：已读时间（未读为空）。
- created_at：创建时间。

## error_book

用途：错题本。

字段：

- id：记录唯一标识（UUID）。
- user_id：用户 ID（关联 users.id）。
- question_id：题目 ID（关联 questions.id）。
- note：错题备注。
- created_at：创建时间。
