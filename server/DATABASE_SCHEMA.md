# xuezhidao 数据库说明

本文档说明当前数据库包含的表、用途、字段信息及表关系。

## 表关系总览

1. classes.teacher_id -> users.id
2. class_members.class_id -> classes.id
3. class_members.user_id -> users.id
4. assignments.class_id -> classes.id
5. submissions.assignment_id -> assignments.id
6. submissions.student_id -> users.id
7. question_banks.created_by -> users.id
8. questions.bank_id -> question_banks.id
9. messages.sender_id -> users.id
10. messages.receiver_id -> users.id
11. notifications.user_id -> users.id
12. error_book.user_id -> users.id
13. error_book.question_id -> questions.id

---

## users

用途：用户基础信息与学习画像。

| 字段名             | 类型                     | 主键 | 非空 | 默认值 | 说明                           |
| ------------------ | ------------------------ | ---- | ---- | ------ | ------------------------------ |
| id                 | UUID                     | 是   | 是   | -      | 用户唯一标识                   |
| role               | TEXT                     | 否   | 是   | -      | 用户角色（student/teacher）    |
| name               | TEXT                     | 否   | 是   | -      | 姓名                           |
| email              | TEXT                     | 否   | 是   | -      | 邮箱（唯一）                   |
| phone              | TEXT                     | 否   | 否   | -      | 手机号（唯一，可为空）         |
| password_hash      | TEXT                     | 否   | 是   | -      | 密码哈希                       |
| avatar_url         | TEXT                     | 否   | 否   | -      | 头像地址（本地上传或外链）     |
| grade              | TEXT                     | 否   | 否   | -      | 年级                           |
| class_name         | TEXT                     | 否   | 否   | -      | 班级                           |
| school             | TEXT                     | 否   | 否   | -      | 学校                           |
| signature          | TEXT                     | 否   | 否   | -      | 个性签名                       |
| level              | INT                      | 否   | 否   | 1      | 等级                           |
| streak_days        | INT                      | 否   | 否   | 0      | 连续打卡天数                   |
| weekly_study_hours | NUMERIC(5,1)             | 否   | 否   | 0      | 本周学习时长（小时，1 位小数） |
| homework_done      | INT                      | 否   | 否   | 0      | 已完成作业数量                 |
| accuracy           | NUMERIC(5,2)             | 否   | 否   | 0      | 正确率（百分比，2 位小数）     |
| created_at         | TIMESTAMP WITH TIME ZONE | 否   | 否   | NOW()  | 创建时间                       |
| updated_at         | TIMESTAMP WITH TIME ZONE | 否   | 否   | NOW()  | 更新时间                       |

---

## classes

用途：班级信息。

| 字段名     | 类型                     | 主键 | 非空 | 默认值 | 说明                         |
| ---------- | ------------------------ | ---- | ---- | ------ | ---------------------------- |
| id         | UUID                     | 是   | 是   | -      | 班级唯一标识                 |
| name       | TEXT                     | 否   | 是   | -      | 班级名称                     |
| teacher_id | UUID                     | 否   | 否   | -      | 任课教师 ID（关联 users.id） |
| created_at | TIMESTAMP WITH TIME ZONE | 否   | 否   | NOW()  | 创建时间                     |

---

## class_members

用途：班级成员关系表。

| 字段名    | 类型                     | 主键 | 非空 | 默认值  | 说明                       |
| --------- | ------------------------ | ---- | ---- | ------- | -------------------------- |
| id        | UUID                     | 是   | 是   | -       | 记录唯一标识               |
| class_id  | UUID                     | 否   | 否   | -       | 班级 ID（关联 classes.id） |
| user_id   | UUID                     | 否   | 否   | -       | 用户 ID（关联 users.id）   |
| role      | TEXT                     | 否   | 否   | student | 成员角色（默认 student）   |
| joined_at | TIMESTAMP WITH TIME ZONE | 否   | 否   | NOW()   | 加入时间                   |

---

## assignments

用途：作业信息。

| 字段名      | 类型                     | 主键 | 非空 | 默认值 | 说明                       |
| ----------- | ------------------------ | ---- | ---- | ------ | -------------------------- |
| id          | UUID                     | 是   | 是   | -      | 作业唯一标识               |
| class_id    | UUID                     | 否   | 否   | -      | 班级 ID（关联 classes.id） |
| title       | TEXT                     | 否   | 是   | -      | 作业标题                   |
| description | TEXT                     | 否   | 否   | -      | 作业描述                   |
| due_at      | TIMESTAMP WITH TIME ZONE | 否   | 否   | -      | 截止时间                   |
| created_at  | TIMESTAMP WITH TIME ZONE | 否   | 否   | NOW()  | 创建时间                   |

---

## submissions

用途：作业提交与批改记录。

| 字段名        | 类型                     | 主键 | 非空 | 默认值    | 说明                           |
| ------------- | ------------------------ | ---- | ---- | --------- | ------------------------------ |
| id            | UUID                     | 是   | 是   | -         | 提交记录唯一标识               |
| assignment_id | UUID                     | 否   | 否   | -         | 作业 ID（关联 assignments.id） |
| student_id    | UUID                     | 否   | 否   | -         | 学生 ID（关联 users.id）       |
| content       | TEXT                     | 否   | 否   | -         | 提交内容                       |
| score         | NUMERIC(5,2)             | 否   | 否   | -         | 成绩（数值）                   |
| status        | TEXT                     | 否   | 否   | submitted | 提交状态                       |
| submitted_at  | TIMESTAMP WITH TIME ZONE | 否   | 否   | NOW()     | 提交时间                       |
| graded_at     | TIMESTAMP WITH TIME ZONE | 否   | 否   | -         | 批改时间                       |

---

## question_banks

用途：题库分组。

| 字段名      | 类型                     | 主键 | 非空 | 默认值 | 说明                       |
| ----------- | ------------------------ | ---- | ---- | ------ | -------------------------- |
| id          | UUID                     | 是   | 是   | -      | 题库唯一标识               |
| name        | TEXT                     | 否   | 是   | -      | 题库名称                   |
| description | TEXT                     | 否   | 否   | -      | 题库描述                   |
| subject     | TEXT                     | 否   | 否   | -      | 学科                       |
| created_by  | UUID                     | 否   | 否   | -      | 创建者 ID（关联 users.id） |
| created_at  | TIMESTAMP WITH TIME ZONE | 否   | 否   | NOW()  | 创建时间                   |

---

## questions

用途：题库中的题目。

| 字段名         | 类型                     | 主键 | 非空 | 默认值 | 说明                                  |
| -------------- | ------------------------ | ---- | ---- | ------ | ------------------------------------- |
| id             | UUID                     | 是   | 是   | -      | 题目唯一标识                          |
| bank_id        | UUID                     | 否   | 否   | -      | 所属题库 ID（关联 question_banks.id） |
| content        | TEXT                     | 否   | 是   | -      | 题目内容                              |
| stem_image_url | TEXT                     | 否   | 否   | -      | 题干图片地址                          |
| option_images  | TEXT                     | 否   | 否   | -      | 选项图片（可存 JSON 字符串）          |
| subject        | TEXT                     | 否   | 否   | -      | 学科                                  |
| grade          | TEXT                     | 否   | 否   | -      | 年级                                  |
| difficulty     | TEXT                     | 否   | 否   | -      | 难度                                  |
| question_type  | TEXT                     | 否   | 否   | -      | 题目类型（如单选、多选、填空、问答）  |
| answer         | TEXT                     | 否   | 否   | -      | 标准答案（可用文本/JSON 字符串保存）  |
| explanation    | TEXT                     | 否   | 否   | -      | 题目解析                              |
| created_at     | TIMESTAMP WITH TIME ZONE | 否   | 否   | NOW()  | 创建时间                              |

---

## messages

用途：站内私信。

| 字段名      | 类型                     | 主键 | 非空 | 默认值 | 说明                       |
| ----------- | ------------------------ | ---- | ---- | ------ | -------------------------- |
| id          | UUID                     | 是   | 是   | -      | 消息唯一标识               |
| sender_id   | UUID                     | 否   | 否   | -      | 发送者 ID（关联 users.id） |
| receiver_id | UUID                     | 否   | 否   | -      | 接收者 ID（关联 users.id） |
| content     | TEXT                     | 否   | 是   | -      | 消息内容                   |
| created_at  | TIMESTAMP WITH TIME ZONE | 否   | 否   | NOW()  | 创建时间                   |

---

## notifications

用途：通知提醒。

| 字段名     | 类型                     | 主键 | 非空 | 默认值 | 说明                     |
| ---------- | ------------------------ | ---- | ---- | ------ | ------------------------ |
| id         | UUID                     | 是   | 是   | -      | 通知唯一标识             |
| user_id    | UUID                     | 否   | 否   | -      | 用户 ID（关联 users.id） |
| title      | TEXT                     | 否   | 是   | -      | 通知标题                 |
| body       | TEXT                     | 否   | 否   | -      | 通知内容                 |
| read_at    | TIMESTAMP WITH TIME ZONE | 否   | 否   | -      | 已读时间（未读为空）     |
| created_at | TIMESTAMP WITH TIME ZONE | 否   | 否   | NOW()  | 创建时间                 |

---

## error_book

用途：错题本。

| 字段名      | 类型                     | 主键 | 非空 | 默认值 | 说明                         |
| ----------- | ------------------------ | ---- | ---- | ------ | ---------------------------- |
| id          | UUID                     | 是   | 是   | -      | 记录唯一标识                 |
| user_id     | UUID                     | 否   | 否   | -      | 用户 ID（关联 users.id）     |
| question_id | UUID                     | 否   | 否   | -      | 题目 ID（关联 questions.id） |
| note        | TEXT                     | 否   | 否   | -      | 错题备注                     |
| created_at  | TIMESTAMP WITH TIME ZONE | 否   | 否   | NOW()  | 创建时间                     |
