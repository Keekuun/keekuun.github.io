## [Mysql练习](https://blog.csdn.net/original_recipe/article/details/91958663)

> [inner join 与 left join 之间的区别](https://www.cnblogs.com/assasion/p/7768931.html)

### 1.创建测试数据

```sql
show databases;
```

#### 1.学生表 Student

|          | SId         | Sname       | Sage     | Ssex        |
| -------- | ----------- | ----------- | -------- | ----------- |
| 说明     | 学生编号    | 学生姓名    | 出生年月 | 学生性别    |
| 数据类型 | varchar(10) | varchar(10) | datetime | varchar(10) |

```sql
# 创建表
create table Student(SId varchar(10), Sname varchar(10), Sname varchar(10), Sage datetime, Ssex varchar(10));

# 新增数据
insert into Student values('01' , '赵雷' , '1990-01-01' , '男');
insert into Student values('02' , '钱电' , '1990-12-21' , '男');
insert into Student values('03' , '孙风' , '1990-05-20' , '男');
insert into Student values('04' , '李云' , '1990-08-06' , '男');
insert into Student values('05' , '周梅' , '1991-12-01' , '女');
insert into Student values('06' , '吴兰' , '1992-03-01' , '女');
insert into Student values('07' , '郑竹' , '1989-07-01' , '女');
insert into Student values('09' , '张三' , '2017-12-20' , '女');
insert into Student values('10' , '李四' , '2017-12-25' , '女');
insert into Student values('11' , '李四' , '2017-12-30' , '女');
insert into Student values('12' , '赵六' , '2017-01-01' , '女');
insert into Student values('13' , '孙七' , '2018-01-01' , '女');

select * from Student;
+------+-------+---------------------+------+
| SId  | Sname | Sage                | Ssex |
+------+-------+---------------------+------+
| 01   | 赵雷  | 1990-01-01 00:00:00 | 男   |
| 02   | 钱电  | 1990-12-21 00:00:00 | 男   |
| 03   | 孙风  | 1990-05-20 00:00:00 | 男   |
| 04   | 李云  | 1990-08-06 00:00:00 | 男   |
| 05   | 周梅  | 1991-12-01 00:00:00 | 女   |
| 06   | 吴兰  | 1992-03-01 00:00:00 | 女   |
| 07   | 郑竹  | 1989-07-01 00:00:00 | 女   |
| 09   | 张三  | 2017-12-20 00:00:00 | 女   |
| 10   | 李四  | 2017-12-25 00:00:00 | 女   |
| 11   | 李四  | 2017-12-30 00:00:00 | 女   |
| 12   | 赵六  | 2017-01-01 00:00:00 | 女   |
| 13   | 孙七  | 2018-01-01 00:00:00 | 女   |
+------+-------+---------------------+------+
```



#### 2.课程Course

|          | CId         | Cname       | TId         |
| -------- | ----------- | ----------- | ----------- |
| 说明     | 课程编号    | 课程名称    | 教师编号    |
| 数据类型 | varchar(10) | varchar(10) | varchar(10) |

```sql
create table Course(CId varchar(10), Cname varchar(10), TId varchar(10));

insert into Course values('01' , '语文' , '02');
insert into Course values('02' , '数学' , '01');
insert into Course values('03' , '英语' , '03');

select * from Course;

+------+-------+------+
| CId  | Cname | TId  |
+------+-------+------+
| 01   | 语文  | 02   |
| 02   | 数学  | 01   |
| 03   | 英语  | 03   |
+------+-------+------+
```



#### 3.教师表Teacher

|          | TId         | Tname       |
| -------- | ----------- | ----------- |
| 说明     | 教师编号    | 教师姓名    |
| 数据类型 | varchar(10) | varchar(10) |

```sql
create table Teacher(TId varchar(10), Tname varchar(10));

insert into Teacher values('01' , '张三');
insert into Teacher values('02' , '李四');
insert into Teacher values('03' , '王五');

select * from Teacher;

+------+-------+
| TId  | Tname |
+------+-------+
| 01   | 张三  |
| 02   | 李四  |
| 03   | 王五  |
+------+-------+
```



#### 4.成绩表 Score

|          | SId         | CId         | Score       |
| -------- | ----------- | ----------- | ----------- |
| 说明     | 学生编号    | 课程编号    | 分数        |
| 数据类型 | varchar(10) | varchar(10) | varchar(10) |

```sql
create table Score(SId varchar(10), CId varchar(10), Score varchar(10));

insert into SC values('01' , '01' , 80);
insert into SC values('01' , '02' , 90);
insert into SC values('01' , '03' , 99);
insert into SC values('02' , '01' , 99);
insert into SC values('02' , '02' , 90);
insert into SC values('02' , '03' , 80);
insert into SC values('03' , '01' , 80);
insert into SC values('03' , '02' , 80);
insert into SC values('03' , '03' , 80);
insert into SC values('04' , '01' , 50);
insert into SC values('04' , '02' , 30);
insert into SC values('04' , '03' , 20);
insert into SC values('05' , '01' , 76);
insert into SC values('05' , '02' , 87);
insert into SC values('06' , '01' , 31);
insert into SC values('06' , '03' , 34);
insert into SC values('07' , '02' , 89);
insert into SC values('07' , '03' , 98);


select * from Score;
+------+------+-------+
| SId  | CId  | score |
+------+------+-------+
| 01   | 01   |  80.0 |
| 01   | 02   |  90.0 |
| 01   | 03   |  99.0 |
| 02   | 01   |  99.0 |
| 02   | 02   |  90.0 |
| 02   | 03   |  80.0 |
| 03   | 01   |  80.0 |
| 03   | 02   |  80.0 |
| 03   | 03   |  80.0 |
| 04   | 01   |  50.0 |
| 04   | 02   |  30.0 |
| 04   | 03   |  20.0 |
| 05   | 01   |  76.0 |
| 05   | 02   |  87.0 |
| 06   | 01   |  31.0 |
| 06   | 03   |  34.0 |
| 07   | 02   |  89.0 |
| 07   | 03   |  98.0 |
+------+------+-------+
```

### 2.练习

#### 1.查询" 01 "课程比" 02 "课程成绩高的学生的信息及课程分数

```sql
select * from
(select Score.SId, Score.score from Score where Score.CId = '01') as t1 inner join
(select Score.SId, Score.score from Score where Score.CId = '02') as t2 on t1.SId = t2.SId
where t1.score > t2.score

+------+-------+------+-------+
| SId  | score | SId  | score |
+------+-------+------+-------+
| 02   |  70.0 | 02   |  60.0 |
| 04   |  50.0 | 04   |  30.0 |
+------+-------+------+-------+
```

####  1.1 查询同时存在" 01 "课程和" 02 "课程的情况 

```sql
select * from 
(select Score.SId, Score.Score from Score where Score.CId = '01') as t1 inner join
(select Score.SId, Score.Score from Score where Score.CId = '02') as t2 on t1.SId = t2.SId;

+------+-------+------+-------+
| SId  | score | SId  | score |
+------+-------+------+-------+
| 01   |  80.0 | 01   |  90.0 |
| 02   |  70.0 | 02   |  60.0 |
| 03   |  80.0 | 03   |  80.0 |
| 04   |  50.0 | 04   |  30.0 |
| 05   |  76.0 | 05   |  87.0 |
+------+-------+------+-------+
```

#### 1.2 查询存在" 01 "课程但可能不存在" 02 "课程的情况(不存在时显示为 null ) 

```sql
select * from
(select Score.SId, Score.Score from Score where Score.CId = '01') as t1 left join
(select Score.SId, Score.Score from Score where Score.CId = '02') as t2 on t1.SId = t2.SId;

+------+-------+------+-------+
| SId  | score | SId  | score |
+------+-------+------+-------+
| 01   |  80.0 | 01   |  90.0 |
| 02   |  70.0 | 02   |  60.0 |
| 03   |  80.0 | 03   |  80.0 |
| 04   |  50.0 | 04   |  30.0 |
| 05   |  76.0 | 05   |  87.0 |
| 06   |  31.0 | NULL |  NULL |
+------+-------+------+-------+
```

#### 1.3 查询不存在" 01 "课程但存在" 02 "课程的情况

```sql
select * from Score
where SId not in (select SId from Score where CId = '01') and CId = '02';

+------+------+-------+
| SId  | CId  | score |
+------+------+-------+
| 07   | 02   |  89.0 |
+------+------+-------+
```

#### 2查询平均成绩大于等于 60 分的同学的学生编号和学生姓名和平均成绩

```sql
select t1.SId, t1.Sname, t2.AvgScore from Student as t1 inner join 
(select Score.SId, avg(Score.Score) as AvgScore from Score group by Score.SId having AvgScore >= 60) as t2
on t1.SId = t2.SId

+------+-------+----------+
| SId  | Sname | AvgScore |
+------+-------+----------+
| 01   | 赵雷  | 89.66667 |
| 02   | 钱电  | 70.00000 |
| 03   | 孙风  | 80.00000 |
| 05   | 周梅  | 81.50000 |
| 07   | 郑竹  | 93.50000 |
+------+-------+----------+
```

#### 3 查询在 Score表存在成绩的学生信息

```sql
select DISTINCT Student.* from Student, Score where Student.sid = Score.sid

+------+-------+---------------------+------+
| SId  | Sname | Sage                | Ssex |
+------+-------+---------------------+------+
| 01   | 赵雷  | 1990-01-01 00:00:00 | 男   |
| 02   | 钱电  | 1990-12-21 00:00:00 | 男   |
| 03   | 孙风  | 1990-05-20 00:00:00 | 男   |
| 04   | 李云  | 1990-08-06 00:00:00 | 男   |
| 05   | 周梅  | 1991-12-01 00:00:00 | 女   |
| 06   | 吴兰  | 1992-03-01 00:00:00 | 女   |
| 07   | 郑竹  | 1989-07-01 00:00:00 | 女   |
+------+-------+---------------------+------+
```

#### 4 查询所有同学的学生编号、学生姓名、选课总数、所有课程的总成绩(没成绩的显示为 null ) 

```sql
select  t1.SId,  t1.Sname, t2.CourseCount, t2.SumScore
from Student as t1 inner join 
(select Score.SId, count(Score.CId) as CourseCount, sum(Score.Score) as SumScore from Score group by Score.SId) as t2
on t1.SId = t2.SId;

+------+-------+-------------+----------+
| SId  | Sname | CourseCount | SumScore |
+------+-------+-------------+----------+
| 01   | 赵雷  |           3 |    269.0 |
| 02   | 钱电  |           3 |    210.0 |
| 03   | 孙风  |           3 |    240.0 |
| 04   | 李云  |           3 |    100.0 |
| 05   | 周梅  |           2 |    163.0 |
| 06   | 吴兰  |           2 |     65.0 |
| 07   | 郑竹  |           2 |    187.0 |
+------+-------+-------------+----------+
```

#### 4.1 查有成绩的学生信息

```sql
select Student.* from Student where Student.SId in (select DISTINCT Score.SId from Score);

+------+-------+---------------------+------+
| SId  | Sname | Sage                | Ssex |
+------+-------+---------------------+------+
| 01   | 赵雷  | 1990-01-01 00:00:00 | 男   |
| 02   | 钱电  | 1990-12-21 00:00:00 | 男   |
| 03   | 孙风  | 1990-05-20 00:00:00 | 男   |
| 04   | 李云  | 1990-08-06 00:00:00 | 男   |
| 05   | 周梅  | 1991-12-01 00:00:00 | 女   |
| 06   | 吴兰  | 1992-03-01 00:00:00 | 女   |
| 07   | 郑竹  | 1989-07-01 00:00:00 | 女   |
+------+-------+---------------------+------+
 
 # or
select * from Student where EXISTS(select * from Score where Student.SId=Score.SId);

+------+-------+---------------------+------+
| SId  | Sname | Sage                | Ssex |
+------+-------+---------------------+------+
| 01   | 赵雷  | 1990-01-01 00:00:00 | 男   |
| 02   | 钱电  | 1990-12-21 00:00:00 | 男   |
| 03   | 孙风  | 1990-05-20 00:00:00 | 男   |
| 04   | 李云  | 1990-08-06 00:00:00 | 男   |
| 05   | 周梅  | 1991-12-01 00:00:00 | 女   |
| 06   | 吴兰  | 1992-03-01 00:00:00 | 女   |
| 07   | 郑竹  | 1989-07-01 00:00:00 | 女   |
+------+-------+---------------------+------+
```

#### 5 查询「李」姓老师的数量

```sql
select count(*),  Teacher.Tname from Teacher where Teacher.Tname like '李%'

+----------+
| count(*) |
+----------+
|        1 |
+----------+
```

#### 6 查询学过「张三」老师授课的同学的信息

```sql
select Student.*
from Teacher, Course, Student, Score
where Teacher.Tname='张三'
and   Teacher.TId=Course.TId
and   Course.CId=Score.CId
and   Score.SId=Student.SId;

+------+-------+---------------------+------+
| SId  | Sname | Sage                | Ssex |
+------+-------+---------------------+------+
| 01   | 赵雷  | 1990-01-01 00:00:00 | 男   |
| 02   | 钱电  | 1990-12-21 00:00:00 | 男   |
| 03   | 孙风  | 1990-05-20 00:00:00 | 男   |
| 04   | 李云  | 1990-08-06 00:00:00 | 男   |
| 05   | 周梅  | 1991-12-01 00:00:00 | 女   |
| 07   | 郑竹  | 1989-07-01 00:00:00 | 女   |
+------+-------+---------------------+------+
```

#### 7 查询没有学全所有课程的同学的信息

```sql
select DISTINCT Student.* from 
(select Student.SId,Course.CId from Student, Course ) as t1 LEFT JOIN 
(SELECT Score.SId,Score.CId from Score) as t2 on t1.SId=t2.SId and t1.CId=t2.CId,
Student where t2.SId is null and t1.SId=Student.SId

select Student.* from Student
where Student.SId not in (
select Student.SId from Score, Student 
where Score.SId = Student.SId
group by SId 
having count(*) = (select count(*) from Course));

+------+-------+---------------------+------+
| SId  | Sname | Sage                | Ssex |
+------+-------+---------------------+------+
| 05   | 周梅  | 1991-12-01 00:00:00 | 女   |
| 06   | 吴兰  | 1992-03-01 00:00:00 | 女   |
| 07   | 郑竹  | 1989-07-01 00:00:00 | 女   |
| 09   | 张三  | 2017-12-20 00:00:00 | 女   |
| 10   | 李四  | 2017-12-25 00:00:00 | 女   |
| 11   | 李四  | 2017-12-30 00:00:00 | 女   |
| 12   | 赵六  | 2017-01-01 00:00:00 | 女   |
| 13   | 孙七  | 2018-01-01 00:00:00 | 女   |
+------+-------+---------------------+------+
```

#### 8 查询至少有一门课与学号为" 01 "的同学所学相同的同学的信息

```sql
select DISTINCT Student.* from Score, Student
where Score.CId in (select CId from Score where SId='01')
and Score.SId = Student.SId;

+------+-------+---------------------+------+
| SId  | Sname | Sage                | Ssex |
+------+-------+---------------------+------+
| 01   | 赵雷  | 1990-01-01 00:00:00 | 男   |
| 02   | 钱电  | 1990-12-21 00:00:00 | 男   |
| 03   | 孙风  | 1990-05-20 00:00:00 | 男   |
| 04   | 李云  | 1990-08-06 00:00:00 | 男   |
| 05   | 周梅  | 1991-12-01 00:00:00 | 女   |
| 06   | 吴兰  | 1992-03-01 00:00:00 | 女   |
| 07   | 郑竹  | 1989-07-01 00:00:00 | 女   |
+------+-------+---------------------+------+
```

#### 9 查询和" 01 "号的同学学习的课程 完全相同的其他同学的信息

```sql
select DISTINCT Student.*
from (select Student.SId, t.CId
from Student, (select Score.CId from Score where Score.SId='01') as t)
as t1 LEFT JOIN Score on t1.SId=Score.SId and t1.CId=Score.CId,Student
where Score.SId is not null and t1.SId=Student.SId and t1.SId <>'01';

+------+-------+---------------------+------+
| SId  | Sname | Sage                | Ssex |
+------+-------+---------------------+------+
| 02   | 钱电  | 1990-12-21 00:00:00 | 男   |
| 03   | 孙风  | 1990-05-20 00:00:00 | 男   |
| 04   | 李云  | 1990-08-06 00:00:00 | 男   |
| 05   | 周梅  | 1991-12-01 00:00:00 | 女   |
| 06   | 吴兰  | 1992-03-01 00:00:00 | 女   |
| 07   | 郑竹  | 1989-07-01 00:00:00 | 女   |
+------+-------+---------------------+------+
```

#### 10 查询没学过"张三"老师讲授的任一门课程的学生姓名

```sql
select * from Student where Student.SId not in (
    select Student.SId from (
        select Student.SID, t.CId from (
            select Course.CId from Course, Teacher where Course.TId = Teacher.TId and Teacher.Tname = '张三') as t
    , Student) as t1
    right join Score on t1.SId = Score.SId and t1.CId = Score.CId, Student where t1.SId = student.SId
);

+------+-------+---------------------+------+
| SId  | Sname | Sage                | Ssex |
+------+-------+---------------------+------+
| 06   | 吴兰  | 1992-03-01 00:00:00 | 女   |
| 09   | 张三  | 2017-12-20 00:00:00 | 女   |
| 10   | 李四  | 2017-12-25 00:00:00 | 女   |
| 11   | 李四  | 2017-12-30 00:00:00 | 女   |
| 12   | 赵六  | 2017-01-01 00:00:00 | 女   |
| 13   | 孙七  | 2018-01-01 00:00:00 | 女   |
+------+-------+---------------------+------+
```

#### 11 查询两门及其以上不及格课程的同学的学号，姓名及其平均成绩

```sql
select Student.SId, Student.Sname, t1.avgScore 
from Student, (select Score.SId, avg(Score.score) as avgScore from Score group by Score.SId) as t1 
where Student.SId = t1.SId 
and Student.SId in (
    select t2.SId from (Select * from Score where Score.Score < 60) as t2 
    group by t2.SId having count(*) >= 2
);

+------+-------+----------+
| SId  | Sname | avgScore |
+------+-------+----------+
| 04   | 李云  | 33.33333 |
| 06   | 吴兰  | 32.50000 |
+------+-------+----------+
```

#### 12 检索" 01 "课程分数小于 60，按分数降序排列的学生信息

```sql
select Student.*, t1.score from Student,
(select Score.* from Score where Score.score < 60 and Score.CId = '01') as t1 
where Student.SId = t1.SId
order by Score.score DESC;

+------+-------+---------------------+------+-------+
| SId  | Sname | Sage                | Ssex | score |
+------+-------+---------------------+------+-------+
| 04   | 李云  | 1990-08-06 00:00:00 | 男   |  50.0 |
| 06   | 吴兰  | 1992-03-01 00:00:00 | 女   |  31.0 |
+------+-------+---------------------+------+-------+
```

#### 13 按平均成绩从高到低显示所有学生的所有课程的成绩以及平均成绩

```sql
select Score.*, t1.avgScore from Score left join 
(select Score.SId, avg(Score.score) as avgScore from Score group by Score.SId) as t1
on Score.SId = t1.SId order by t1.avgScore DESC; # 升序ASC 降序DESC

+------+------+-------+----------+
| SId  | CId  | score | avgScore |
+------+------+-------+----------+
| 07   | 02   |  89.0 | 93.50000 |
| 07   | 03   |  98.0 | 93.50000 |
| 01   | 01   |  80.0 | 89.66667 |
| 01   | 02   |  90.0 | 89.66667 |
| 01   | 03   |  99.0 | 89.66667 |
| 05   | 01   |  76.0 | 81.50000 |
| 05   | 02   |  87.0 | 81.50000 |
| 03   | 01   |  80.0 | 80.00000 |
| 03   | 02   |  80.0 | 80.00000 |
| 03   | 03   |  80.0 | 80.00000 |
| 02   | 01   |  70.0 | 70.00000 |
| 02   | 02   |  60.0 | 70.00000 |
| 02   | 03   |  80.0 | 70.00000 |
| 04   | 01   |  50.0 | 33.33333 |
| 04   | 02   |  30.0 | 33.33333 |
| 04   | 03   |  20.0 | 33.33333 |
| 06   | 01   |  31.0 | 32.50000 |
| 06   | 03   |  34.0 | 32.50000 |
+------+------+-------+----------+
```

#### 14 查询各科成绩最高分、最低分和平均分： 以如下形式显示：课程 ID，课程 name，最高分，最低分，平均分，及格率，中等率，优良率，优秀率 及格为>=60，中等为：70-80，优良为：80-90，优秀为：>=90 要求输出课程号和选修人数，查询结果按人数降序排列，若人数相同，按课程号升序排列

```sql
select Score.CId as '课程ID', 
max(Score.score) as '最高分', 
min(Score.score) as '最低分', 
avg(Score.score) as '平均分',
count(*) as '选修人数', 
sum(case when Score.score >=60 then 1 else 0 end) / count(*) as '及格率',
sum(case when Score.score >= 70 and Score.score < 80 then 1 else 0 end) / count(*) as '中等率',
sum(case when Score.score >= 80 and Score.score < 90 then 1 else 0 end) / count(*) as '优良率',
sum(case when Score.score >= 90 then 1 else 0 end) / count(*) as '优秀率' 
from Score group by Score.CId order by count(*) DESC, Score.CId ASC;

+--------+--------+--------+----------+----------+--------+--------+--------+--------+
| 课程ID | 最高分 | 最低分 | 平均分   | 选修人数 | 及格率 | 中等率 | 优良率 | 优秀率 |
+--------+--------+--------+----------+----------+--------+--------+--------+--------+
| 01     |   80.0 |   31.0 | 64.50000 |        6 | 0.6667 | 0.3333 | 0.3333 | 0.0000 |
| 02     |   90.0 |   30.0 | 72.66667 |        6 | 0.8333 | 0.0000 | 0.5000 | 0.1667 |
| 03     |   99.0 |   20.0 | 68.50000 |        6 | 0.6667 | 0.0000 | 0.3333 | 0.3333 |
+--------+--------+--------+----------+----------+--------+--------+--------+--------+

# 或者使用IF
select Score.CId,
       max(Score.score)                                                 as '最高分',
       min(Score.score)                                                 as '最低分',
       avg(Score.score)                                                 as '平均分',
       count(*)                                                         as '选修人数',
       sum(IF(Score.score >= 60, 1, 0)) / count(*)                      as '及格率',
       sum(IF(Score.score >= 70 and Score.score < 80, 1, 0)) / count(*) as '中等率',
       sum(IF(Score.score >= 80 and Score.score < 90, 1, 0)) / count(*) as '优良率',
       sum(IF(Score.score >= 90, 1, 0)) / count(*) as '优秀率'
from Score group by Score.CId order by count(*) DESC, Score.CId ASC;
```

#### 15 按各科成绩进行排序，并显示排名， Score 重复时保留名次空缺

```sql
select *, RANK() over (PARTITION BY Score.CId ORDER BY Score.score DESC) as '排名' from Score;
+------+------+-------+------+
| SId  | CId  | score | 排名 |
+------+------+-------+------+
| 01   | 01   |  80.0 |    1 |
| 03   | 01   |  80.0 |    1 |
| 05   | 01   |  76.0 |    3 |
| 02   | 01   |  70.0 |    4 |
| 04   | 01   |  50.0 |    5 |
| 06   | 01   |  31.0 |    6 |
| 01   | 02   |  90.0 |    1 |
| 07   | 02   |  89.0 |    2 |
| 05   | 02   |  87.0 |    3 |
| 03   | 02   |  80.0 |    4 |
| 02   | 02   |  60.0 |    5 |
| 04   | 02   |  30.0 |    6 |
| 01   | 03   |  99.0 |    1 |
| 07   | 03   |  98.0 |    2 |
| 02   | 03   |  80.0 |    3 |
| 03   | 03   |  80.0 |    3 |
| 06   | 03   |  34.0 |    5 |
| 04   | 03   |  20.0 |    6 |
+------+------+-------+------+
```

####  15.1 按各科成绩进行排序，并显示排名， Score 重复时合并名次

```sql
select *, DENSE_RANK() over (PARTITION BY Score.CId ORDER BY Score.score DESC) as '排名' from Score;
+------+------+-------+------+
| SId  | CId  | score | 排名 |
+------+------+-------+------+
| 01   | 01   |  80.0 |    1 |
| 03   | 01   |  80.0 |    1 |
| 05   | 01   |  76.0 |    2 |
| 02   | 01   |  70.0 |    3 |
| 04   | 01   |  50.0 |    4 |
| 06   | 01   |  31.0 |    5 |
| 01   | 02   |  90.0 |    1 |
| 07   | 02   |  89.0 |    2 |
| 05   | 02   |  87.0 |    3 |
| 03   | 02   |  80.0 |    4 |
| 02   | 02   |  60.0 |    5 |
| 04   | 02   |  30.0 |    6 |
| 01   | 03   |  99.0 |    1 |
| 07   | 03   |  98.0 |    2 |
| 02   | 03   |  80.0 |    3 |
| 03   | 03   |  80.0 |    3 |
| 06   | 03   |  34.0 |    4 |
| 04   | 03   |  20.0 |    5 |
+------+------+-------+------+
```

> [row_number, rank(), dense_rank()的区别及具体用法示例](https://zhuanlan.zhihu.com/p/133469603)

#### 16 查询学生的总成绩，并进行排名，总分重复时保留名次空缺 

```sql
select student.*, s.sumScore, s.scoreRank
from student
         left join (select score.SId,
                           RANK() over (order by sum(score.score) DESC) as scoreRank, sum(score.score) as sumScore
                    from score
                    group by score.SId) as s on student.SId = s.SId
order by s.sumScore DESC;

+------+-------+---------------------+------+----------+-----------+
| SId  | Sname | Sage                | Ssex | sumScore | scoreRank |
+------+-------+---------------------+------+----------+-----------+
| 01   | 赵雷  | 1990-01-01 00:00:00 | 男   |    269.0 |         1 |
| 02   | 钱电  | 1990-12-21 00:00:00 | 男   |    269.0 |         1 |
| 03   | 孙风  | 1990-05-20 00:00:00 | 男   |    240.0 |         3 |
| 07   | 郑竹  | 1989-07-01 00:00:00 | 女   |    187.0 |         4 |
| 05   | 周梅  | 1991-12-01 00:00:00 | 女   |    163.0 |         5 |
| 04   | 李云  | 1990-08-06 00:00:00 | 男   |    100.0 |         6 |
| 06   | 吴兰  | 1992-03-01 00:00:00 | 女   |     65.0 |         7 |
| 09   | 张三  | 2017-12-20 00:00:00 | 女   |     NULL |      NULL |
| 10   | 李四  | 2017-12-25 00:00:00 | 女   |     NULL |      NULL |
| 11   | 李四  | 2017-12-30 00:00:00 | 女   |     NULL |      NULL |
| 12   | 赵六  | 2017-01-01 00:00:00 | 女   |     NULL |      NULL |
| 13   | 孙七  | 2018-01-01 00:00:00 | 女   |     NULL |      NULL |
+------+-------+---------------------+------+----------+-----------+
```

#### 16.1 查询学生的总成绩，并进行排名，总分重复时不保留名次空缺

```sql
select student.*, s.sumScore, s.scoreRank
from student
         left join (select score.SId,
                           DENSE_RANK() over (order by sum(score.score) DESC) as scoreRank, sum(score.score) as sumScore
                    from score
                    group by score.SId) as s on student.SId = s.SId
order by s.sumScore DESC;

+------+-------+---------------------+------+----------+-----------+
| SId  | Sname | Sage                | Ssex | sumScore | scoreRank |
+------+-------+---------------------+------+----------+-----------+
| 01   | 赵雷  | 1990-01-01 00:00:00 | 男   |    269.0 |         1 |
| 02   | 钱电  | 1990-12-21 00:00:00 | 男   |    269.0 |         1 |
| 03   | 孙风  | 1990-05-20 00:00:00 | 男   |    240.0 |         2 |
| 07   | 郑竹  | 1989-07-01 00:00:00 | 女   |    187.0 |         3 |
| 05   | 周梅  | 1991-12-01 00:00:00 | 女   |    163.0 |         4 |
| 04   | 李云  | 1990-08-06 00:00:00 | 男   |    100.0 |         5 |
| 06   | 吴兰  | 1992-03-01 00:00:00 | 女   |     65.0 |         6 |
| 09   | 张三  | 2017-12-20 00:00:00 | 女   |     NULL |      NULL |
| 10   | 李四  | 2017-12-25 00:00:00 | 女   |     NULL |      NULL |
| 11   | 李四  | 2017-12-30 00:00:00 | 女   |     NULL |      NULL |
| 12   | 赵六  | 2017-01-01 00:00:00 | 女   |     NULL |      NULL |
| 13   | 孙七  | 2018-01-01 00:00:00 | 女   |     NULL |      NULL |
+------+-------+---------------------+------+----------+-----------+
```

#### 17 统计各科成绩各分数段人数：课程编号，课程名称，[100-85]，[85-70]，[70-60]，[60-0] 及所占百分比

```sql
select score.SId,
       sum(IF(score.score >= 85, 1, 0))                      as score_100_85,
       sum(IF(score.score >= 70 and score.score < 85, 1, 0)) as score_85_70,
       sum(IF(score.score >= 60 and score.score < 70, 1, 0)) as score_70_60,
       sum(IF(score.score < 60, 1, 0))                       as score_70_60
from score
group by score.SId;

+------+--------------+-------------+-------------+-------------+
| SId  | score_100_85 | score_85_70 | score_70_60 | score_70_60 |
+------+--------------+-------------+-------------+-------------+
| 01   |            2 |           1 |           0 |           0 |
| 02   |            2 |           1 |           0 |           0 |
| 03   |            0 |           3 |           0 |           0 |
| 04   |            0 |           0 |           0 |           3 |
| 05   |            1 |           1 |           0 |           0 |
| 06   |            0 |           0 |           0 |           2 |
| 07   |            2 |           0 |           0 |           0 |
+------+--------------+-------------+-------------+-------------+
```

#### 18 查询各科成绩前三名的记录

````sql
select * from (select *, RANK() over (PARTITION BY score.CId order by score.score) as r from score) as A where A.r <= 3;

+------+------+-------+---+
| SId  | CId  | score | r |
+------+------+-------+---+
| 06   | 01   |  31.0 | 1 |
| 04   | 01   |  50.0 | 2 |
| 05   | 01   |  76.0 | 3 |
| 04   | 02   |  30.0 | 1 |
| 03   | 02   |  80.0 | 2 |
| 05   | 02   |  87.0 | 3 |
| 04   | 03   |  20.0 | 1 |
| 06   | 03   |  34.0 | 2 |
| 02   | 03   |  80.0 | 3 |
| 03   | 03   |  80.0 | 3 |
+------+------+-------+---+
````

#### 19 查询每门课程被选修的学生数

```sql
select score.CId, count(*) from score group by (score.CId);

+------+----------+
| CId  | count(*) |
+------+----------+
| 01   |        6 |
| 02   |        6 |
| 03   |        6 |
+------+----------+
```

#### 20 查询出只选修两门课程的学生学号和姓名

```sql
select DISTINCT student.SId, student.Sname
from student,
     (select score.SId, count(*) as a
      from score
      group by (score.SId)
     ) as A
where student.SId = A.SId
  and A.a = 2;
  
+------+-------+
| SId  | Sname |
+------+-------+
| 05   | 周梅  |
| 06   | 吴兰  |
| 07   | 郑竹  |
+------+-------+
```

#### 21 查询男生、女生人数
```sql
select Ssex, count(*) from student group by Ssex;

+------+----------+
| Ssex | count(*) |
+------+----------+
| 女   |        5 |
| 男   |        7 |
+------+----------+
```
#### 22 查询名字中含有「风」字的学生信息

```sql
select * from student where Sname like '%风%';

+------+-------+---------------------+------+----------+
| SId  | Sname | Sage                | Ssex | Sdept    |
+------+-------+---------------------+------+----------+
| 03   | 孙风  | 1990-05-20 00:00:00 | 男   | 计算机系 |
+------+-------+---------------------+------+----------+
```
#### 23 查询同名同性学生名单，并统计同名人数

```sql
select Sname, Ssex, count(*) from student group by Sname, Ssex having count(*) > 1;

+-------+------+----------+
| Sname | Ssex | count(*) |
+-------+------+----------+
| 李四  | 女   |        2 |
+-------+------+----------+
```

#### 24 查询 1990 年出生的学生名单

```sql
select * from student where year(Sage) = 1990;

+------+-------+---------------------+------+----------+
| SId  | Sname | Sage                | Ssex | Sdept    |
+------+-------+---------------------+------+----------+
| 01   | 赵雷  | 1990-01-01 00:00:00 | 男   | 计算机系 |
| 02   | 钱电  | 1990-12-21 00:00:00 | 男   | 计算机系 |
| 03   | 孙风  | 1990-05-20 00:00:00 | 男   | 计算机系 |
| 04   | 李云  | 1990-08-06 00:00:00 | 男   | 计算机系 |
+------+-------+---------------------+------+----------+
```

#### 25 查询每门课程的平均成绩，结果按平均成绩降序排列，平均成绩相同时，按课程编号升序排列
```sql
select Score.CId, avg(Score.score) as '平均成绩'
from Score
group by Score.CId
order by avg(Score.score) DESC, Score.CId ASC;
```


#### 26 查询平均成绩大于等于 85 的所有学生的学号、姓名和平均成绩

```sql
select student.SId, student.Sname, avg(score.score) as '平均成绩'
from student, score
where student.SId = score.SId
group by student.SId, student.Sname
having avg(score.score) >= 85;

| SId  | Sname | 平均成绩 |
|------|-------|----------|
| 01   | 赵雷  | 87.5000  |
| 02   | 钱电  | 87.1667  |
| 03   | 孙风  | 80.0000  |
| 07   | 郑竹  | 89.5000  |
| 05   | 周梅  | 86.5000  |

```

#### 27 查询课程名称为「数学」，且分数低于 60 的学生姓名和分数

```sql
select student.Sname, score.score
from student, score, course
where student.SId = score.SId
  and score.CId = course.CId
  and course.Cname = '数学'
  and score.score < 60;

+-------+-------+
| Sname | score |
+-------+-------+
| 李云  |  50.0 |
| 吴兰  |  31.0 |
| 赵雷  |  30.0 |
+-------+-------+
```
#### 28 查询所有学生的课程及分数情况（存在学生没成绩，没选课的情况）
```sql
select student.SId, student.Sname, course.CId, course.Cname, IFNULL(score.score, '暂无成绩') as '分数'
from student
         left join score on student.SId = score.SId
         left join course on score.CId = course.CId
order by student.SId, course.CId;

```

#### 29 查询任何一门课程成绩在 70 分以上的姓名、课程名称和分数

```sql
select student.Sname, course.Cname, score.score
from student, score, course
where student.SId = score.SId
  and score.score >= 70
  and score.CId = course.CId;
```

#### 30 查询不及格的课程
```sql
select student.Sname, course.Cname, score.score
from student, score, course
where student.SId = score.SId
  and score.score < 60
  and score.CId = course.CId;
```

#### 31 查询课程编号为 01 且课程成绩在 80 分以上的学生的学号和姓名

#### 32 求每门课程的学生人数

#### 33 成绩不重复，查询选修「张三」老师所授课程的学生中，成绩最高的学生信息及其成绩

#### 34 成绩有重复的情况下，查询选修「张三」老师所授课程的学生中，成绩最高的学生信息及其成绩

#### 35 查询不同课程成绩相同的学生的学生编号、课程编号、学生成绩

#### 36 查询每门功成绩最好的前两名

#### 37 统计每门课程的学生选修人数（超过 5 人的课程才统计）

#### 38 检索至少选修两门课程的学生学号

#### 39 查询选修了全部课程的学生信息

#### 40 查询各学生的年龄，只按年份来算

#### 41 按照出生日期来算，当前月日 < 出生年月的月日则，年龄减一

#### 42 查询本周过生日的学生

#### 43 查询下周过生日的学生

#### 44 查询本月过生日的学生

#### 45 查询下月过生日的学生 
