---
title: "SQL & 数据库"
description: "南方科技大学数据库（H）课程 SQL 与数据库基础笔记。"
date: "2026-01-16"
draft: false
tags:
  - SQL
  - 数据库
  - 笔记
column: "学习笔记"
---
本笔记主要为南方科技大学数据库（H）课程所记录。本课程旨在全面介绍SQL语言，以及简介数据库性能、设计内容。

* * *

## 一、关系数据库系统

### 关系与操作

随着数据量的增大和数据管理日趋复杂，研究人员开发出了关系数据库和SQL语言以方便操作和管理数据。在关系数据库中，数据被保存在表中，其相关的数据通过关系表与其它表相连。我们可以使用E-R图来表示。

关系上的操作一般分为：

-   select：筛选出行，筛选出的行被称为记录或者元组。
-   project：筛选出列，筛选出的列被称为属性。
-   join：根据关系合并表。

### 键值

数据库中不应该出现完全相同的两行，因此，我们需要键值来区分到底什么是相同的，什么是不同的。不论如何，我们应该有一个Primary Key来保证数据的独特性。

### 正则化（Normalization）

为了提高效率，任何数据列中都应该保存有用且不重复的信息。正则化是数据库应用开发中的重点，我们既要提高储存效率，又不能丢失信息。我们有三条范式：

1.  属性简单（Simple Attributes）
2.  属性依赖全键（Attributes depend on the full key）
3.  非键属性不相依赖（Non-key Attributes not depend on each other）

我们要保证每一个属性都是几乎原子的，且一条记录中，所有的属性都要描述主键，并且非主键的属性不应当相互描述（这应该放在另外的表）。

### 基数

基数描述的是列的唯一键数，（m,n）-基数表示的是表格之间的对应。在高基数列上建立索引查询效率较高。

### NULL

null在数据库中并不是0之类的数值，它只是一个标记（表示“空”）。通常来说，任何与null的运算、逻辑判断结果都是null。因此不能够使用a = null之类的判断语句，因为其输出必然是null，应该使用a is null的语句。但是，由于短路求值性质，我们有如下的特殊规则：

    null AND false = false
    null and true = null
    null OR true = true
    null OR false = null

实际上，这样的特殊情况在其它编程语言中也存在，但是由于null在数据库中的特殊性质，这一点体现的尤为明显。

## 二、SQL

SQL分为DDL（Data Definition Language）和DML（Data Manipulation Language）。SQL不具有很强的类型属性，因此操作时要小心，SQL引擎不会给出提示。

### DDL

CREATE TABLE

    create table table_name (
        col_name type [unique, not null, primary key【只能有一个】, default 默认值],
        check(要检查的布尔表达式),
        ...
        unique(...) -- 设置键值或者键值的组合（使用括号括起来）唯一，
        foreign key (表中列【或者多个列】) references 另外的表（另外表的列【或者多个列】）【外键约束】,
        constraint 限制名 check (布尔表达式)
    );
    -- Text type: char(长度)【不加说明默认为1】, varchar(最大长度), clob
    -- Number type: int, float, numeric(数字总数, 小数位)
    -- Date type: date, datetime【带时间】,timestamp【高精度时间戳】
    -- Binary type: raw(最大长度), varbinary(最大长度), blob, bytea...
    -- primary key默认unique且not null
    -- SQL中字符串是大小敏感的，其余不敏感
    -- unique not null和primary key在限制上相同，但是不同的是unique not null可以有多个，primary key不能主动改变
    -- 日期算术：PostgreSQL支持日期-'1 month/day/year'之类的日期直接计算，支持between '2019-10-13' and '2019-11-01'这样的语法

一些其它的DDL语句

    drop table 表名; --删除表
    truncate table 表名; --清空表
    alter table 表名 操作语句【add column 列名 type】 --改变表元数据
    create index/trigger/function/... -- 创建索引/触发器/函数

### DML

INSERT

    insert into table_name (
        colname1, colname2, ...
    ) 
    values
    (val1, val2, ...),
    (val1, val2, ...),
    ...
    ;
    
    -- 我们可以使用自增序列方便插入
    create sequence movie_seq;
    insert into movies (movieid, ...) values (nextval('movie_seq')/currval('movie_seq'), ...)
    
    -- 我们也可以在创建表的时候使用自动标号（serial for PostgreSQL）
    create table movies (
      movieid serial primary key, 
      ...
    )
    -- 插入的时候，忽略插入id即可
    
    -- 我们也可以自动使用同一会话上一次生成的值插入
    insert into credits (movieid, ...) values (lastval(), ...)

可以使用to\_XXX进行类型转换。例如to\_date('07/20/1969', 'MM/DD/YYYY')。

SELECT

    select col1, 
           col2, 
           coalesce(col3, 1), -- 如果为null, 替换为1
           rank(col4) over (partition by col1 order by col2 [desc]...) --Window Function
           -- partition by等同于 group by，此处为分类排序
    from tabl1 
    [join tab2或子查询 on ...]
    [有聚合函数,group by ... having ...]
    [order by asc/desc]
    where col1 = value (col1 is null) 【尽可能不要在列筛选等号左侧使用函数，一般的索引会失效】
    [and 筛选条件, 如 value in tab1或(select ...)或('A', 'B', ...)之类的元组]
    --【此时，将临时表视为集合；如果只有单行，可以使用等号】
    [string like '%a%']
    [limit 1/10/100...，限制到多少行]
    [union/intersect/except next select]
    -- 转换函数如upper(), lower()
    -- 聚合函数如count(), sum(), avg()等
    -- 聚合函数不得使用在where中，应该使用having
    -- 如果select的列中，存在不包含被统计的列，应当出现在group by语句中，否则违规
    -- 窗口函数例如rank(), dense_rank(), row_number()等。其中，rank()为非紧凑排序，也就是说排名并不是
    -- 根据1，2，3递增，而是根据同名次相同，下一个数字按照总的人数确定，例如两个人并列第一，那么不会有
    -- 第二名，而是直接从第三名；dense_rank则是按照1，2，3紧凑排序
    -- lag()函数和lead()函数可以计算前后某一行和当前行的差距，语法为lag(col, offset, default)
    -- 通常我们会加上排序 lag(...) over (order by col desc...)

where是对于整体表进行筛选，然后进入聚合统计，having在where之后作用于数据。

在实际查询中，我们有一些很有意思的解法：

![](/assets/blog/sql-and-database/img-0.jpg)

一个非常巧妙的解法是（来自力扣用户宇航员）：

    with t1 as(
        select *,id - row_number() over(order by id) as rk
        from stadium
        where people >= 100
    )
    -- 按照id排序，附加一个当前id-行号的信息（过滤掉所有少于100的行），所有rk相同的记录位移相同，统计即可
    
    select id,visit_date,people
    from t1
    where rk in(
        select rk
        from t1
        group by rk
        having count(rk) >= 3
    )

其核心思想在于，对于任何一个存在两天连续100的日子，不论其处于哪一行，它们的id-行号保持不变。因此，我们的where过滤并不影响这个不变量，我们将这个数字记为rk。因此，只要拥有相同的rk，它们必然是大于100且连续的日子，我们使用一个count来统计即可。

join算子分为outer join和inner join，outer join有left join、right join、...。实际开发中，应该多使用join而不是其它集合算子，因为数据库对join的优化相当多。对于那些需要统计所有的用户，但是用户可能没有在记录表中留下任何记录的情况，我们可以使用left join来保留所有的用户，并且通过coalesce来为null行设置值。

窗口函数和聚合函数的区别是，聚合函数在输出的临时表中将其它无关数据压缩，最终只包含聚类指标+聚类结果；窗口函数不同，它将会完整保存所有选中的列（即使不是聚类指标，因此不需要再partition by中加上所有的非被统计选中列），简单来说，它会在每一行后面加上统计结果，不会破坏原始数据。

UPDATE

    update table_name
    set col1 = value, 
        col2 = case var
                 when value then ...
                 when value then ...
                 else ...
               end as name, 
        col3 = func(), 
        ...
    where ...

DELETE

    delete from table_name
    where ...

### 特殊的CREATE语句

FUNCTION

    create [or replace] function func(col1, col2, ...)
    returns type --（如integer, varchar, numeric【可指定精度】，）
    as $$
    declare 
      var_name varchar [:= value];
      var_name2 type ...;
      ...;
    begin
      --赋值需要使用:=表示，例如varname := firstname || ' ' || secondname;
      [return，如果不是return void，那么需要return，如果是纯procedure，就不用] 
      ...[此处，我们只能够返回type对应的内容，如果返回多行，将会出错]
    end
    $$ language plpgsql
    
    -- 在sql中也可以使用...as 'select x+y' language sql;之类的语法，可以用单引号把语句括起来
    -- 但是在plpgsql中不可以，需要用$$...$$表示

在FUNCTION中我们可以使用IF ELSE语句

    begin
    if condition1
    then
    ...
    elseif condition2
    then
    ...
    else
    ...
    end if;
    end;

也可以使用循环：

    for variable_value in start_value..end_value loop
    statements;
    end loop;
    
    while condition loop
    statements;
    end loop;

如果需要返回table，那么应该这么写：

    create function fun_name(arg1 type1, ......)
    returns
    table
    (
    col_name1 col_type,
    col_name2 col_type, ..
    ..
    ..
    ) --此处声明表的结构
    as
    $$
    begin
    return query select col1, col2 from......; --返回名为query的表，列要对应
    end;
    $$
    language plpgsql;

由于函数可能关联很多其它部分，所以尽可能使用Alter和Replace来更新函数，不要先drop后create。

创建函数需要schema的create权限，调用需要schema的usage权限。

有以下四种函数：

-   SQL function
-   Procedure language function（python等）
-   Internal function
-   C language function

如果没有在函数内声明参数名称，可以使用

    $1 $2

来对应参数表中的输入。$1表示参数表中的第一个参数，以此类推。

TRIGGER

trigger按照触发时机分为before/after/instead of trigger（特殊触发器，只在视图上，只按行触发，替代直接的视图操作）。

按照位置分为 tables/views/foreign table trigger。

按照影响的对象分为row/statement trigger。

![](/assets/blog/sql-and-database/img-1.jpg)

    create trigger trigger_name 
    before/after (+操作名, 如insert [or update[of col1[,col2,...【特定某一列更新】]] or delete ...]) on table_name
    -- 或者on [event名字]，例如ddl_command_start事件
    for each row/for each statement
    as 
    execute procedure/function people_audit_fn(); -- procedure和function实际上都可以用，在PostgreSQL 11之后可用function

在PostgreSQL中，我们在使用trigger的时候需要使用一个特定的函数返回trigger。

    create or replace function people_audit_fn()
    returns trigger
    as $$
    begin
        if tg_op = 'UPDATE'
        then 
            insert into people_audit(...);
            select ...
        end if;
    
        return new; --如果在before trigger中返回null，将会直接取消当前操作；在after中则不会
    end;
    $$ language plpgsql;

INDEX

    create [unique] index index_name 
    on tab1 (col1, col2, func(col3));
    [where ...]

一般而言，基数越大的指标，索引的效率越高（区分度越高）。如果你要在函数上使用index，注意要在函数上面建立index，否则数据库不会使用index查找。

VIEW

    create view view_name(col1, col2, ...) as 
    [查询语句]
    [with check option] 
    --此时更新不得违反视图中的约束，例如不能将一个存在于视图中的对象更新到不符合视图的部分

通过视图，我们可能可以修改被引用表中的内容，但是需要满足一定的检查条件。包含聚合函数的视图不可以更新。

我们在view上面有一个特殊的trigger——instead of trigger（只能用于视图）：

    create trigger tri_name 
    instead of 操作 on 视图名
    for each row/statement
    as 
    execute procedure/function handle_view();

视图相当于保存了一段比较复杂的查询（或者说，一张虚拟表），呈现给特定的用户，避免他们看到不应该看到的数据。但是，开发者不应该在复杂的视图上继续添加视图，否则会导致很高的复杂度，从而降低数据库开发应用的性能。

如果需要通过视图修改原始表，需要同时具有view的create和drop权限（简单视图，不包含join之类的操作）。如果包含复杂操作，例如join等多表查询、含有表达式等等（此时，含有聚合函数的视图仍然不可更新），应该使用instead of触发器进行更新。在通过视图更新的时候，Trigger通过自动捕获sql中的更新内容进行更新，并且返回NEW或者OLD。

View在数据库中永久存在直到被显式（Explicitly）删除，它不会随着基表的删除而自动删除（在某些数据库中，例如PostgreSQL中支持递归删除，但是需要指定；SQLserver中可以存在临时视图，会被自动删除，但这些并不在我们讨论范围内）。

EXPLAIN

如果需要查看statement的查询计划，可以在语句前加上EXPLAIN。就可以查看查询计划。更详细的可以使用相关参数来调用需要的指标。

    explain <statement>

里面包含很多的内容，例如扫表方法（Seq Scan，Index Scan，Bitmap，Nested Loop等等），内存命中，脏页数量等等。这些是我们评估数据库性能的重要指标。

### 一些基本语法

我们通过双竖线表示字符串拼接

    'Harry' || 'Potter'

不等号如下（推荐的写法）

    a <> b

大于（小于）等于号

    a >= b / a <= b

## 三、Transactions

### ACID性质

-   Atomicity：原子性，全或无机制，要么完全提交，要么完全回滚
-   Consistency：一致性，数据更新保持一致，出现矛盾立刻回滚
-   Isolation：隔离性，（在通常的机制下）不同事务根据快照读取，不相干扰
-   Durability：持久性，一旦提交，数据立刻永久生效

### 读取现象

-   脏读：读取未提交的数据
-   不可重复读：事务内两次读取的数据不同，因为可能被其它会话修改
-   幻读：事务内读取到了新的数据，第一次和第二次读取的数据行数不同（可重复读等级下，读取基于快照，写入需要通过检测，如果与其它事务发生冲突，优先者提交，后来者完全回滚）
-   序列异常：并发执行的事务不可被序列化为等价的序列（相应隔离等级下，如果新的提交不能够被序列化，那么数据库会拒绝此提交）

### 隔离等级

-   未提交可读（Read Uncommitted）：可以脏读，但是在PG中不允许
-   提交可读（Read Committed）：不可脏读，其余可以。这是psql默认的隔离等级。
-   可重复读（Repeatable Read）：可能出现幻读，但是在PG中不允许
-   序列化（Serializable）：最严格，不可脏读、重复读、幻读，不允许序列异常

### 事务语法

    begin transaction; --开始事务
    commit; -- 提交
    rollback; -- 回滚
    set default_transaction_isolation = '隔离等级名称';

## 四、Privilege and Information Schema

### Previleges

超级用户可以给予其它用户各类权限，例如创建、修改、删除、查询表，以及授予其它用户权限的权限。语法如下：

    grant 权限 [on table_name] to 账户
    revoke 权限 from 账户

数据库中存在ROLE和USER两种角色。本质上它们是同一种，但是ROLE无法使用密码登录，USER可以。USER本质上是特殊的ROLE。ROLE（用户组）一般用于授予权限，例如，我对于一个ROLE授予了若干权限，此时我只需要使用

    grant role_name to usr; 

就可以一次性完成给用户usr所有role\_name用户组所有的权限的授予。

如果需要授予架构之下的所有权限，可以使用

    grant all privileges on table_name in schema_name to user_name;

更换架构的所有权可以使用（仅postgresql）：

    alter schema schema_name owner to user_name

### Information Schema与pg\_catalog

Information Schema（信息架构）储存了数据库中各类元数据（并非数据本身），例如表的名字、视图名字、约束、triggers、functions、grants、......。其可见性对于所有用户可用，不可修改。

而pg\_catalog事实上是与Information Schema同步的，它们没有本质区别，但是pg\_catalog包含了postgreSQL自身定制的一些信息以及更加详细的细节，其中一些表需要超级用户权限访问。如果需要移植到别的数据库中，不建议使用pg\_catalog，而应该使用Information Schema。

注意，pg\_catalog不会在用户表update的时候被改变，只有在表的元数据被修改的时候才会改变（也就是说，一般DDL语法才会改变catalog）。

### Information Schema中的五个元数据类型

-   cardinal\_number 非负整数，标识数量信息，如行列数等
-   character\_data 普通文本字符串
-   sql\_identifier sql标识符，例如表名
-   time\_stamp 时间信息
-   yes\_or\_not 可兼容性布尔值

## 五、数据库性能的评估

数据库性能的评估的核心指标包含例如缓存命中率、查询命令优化能力等等。为什么要提高缓存命中率？这是因为，我们在频繁查询一个数据的时候，往往需要与硬盘频繁通信，而机械硬盘的速度通常是很慢的。因此数据库系统会将频繁查询的数据放入缓存来提高查询效率。

### 存储

通常的存储类型有两种：

-   易失性存储（Volatile Storage）
-   非易失性存储（Non-volatile Storage）

影响数据读取的因素包含：

-   数据读取通道的速度
-   读取单个数据的代价
-   读取数据的可靠性（否则我们纠错也需要时间）

### 储存层级

从上到下为（从cache开始算）：

1.  cache，main memory（易失）
2.  flash memory（以下为非易失的，如SSD）
3.  magnetic disk
4.  optical disk
5.  magnetic tapes

### 储存接口

储存系统提供了如下的存储接口：

-   SATA
-   SAS
-   NVMe
-   NAS & SAN

### 如何评估硬盘的性能

我们可以通过三个主要的时延来评价：

-   查询时间（Seek Time）：读写臂找到正确的轨道的时间
-   旋转时延（Rotational Latency）：分区能够被读写臂访问的旋转时延
-   传输率（Data-transfer rate）：数据从硬盘上传输到外部的时间

一些重要的指标包含：

-   Disk block（硬盘块，包含许多数据以及可能有一些空缺，分配和查询的基本逻辑单元）
-   Sequential access pattern（顺序读写模式，也就是顺序访问硬盘块的速度）
-   Random access pattern（随意读写模式，访问任意硬盘块的速度）
-   I/O operations per second（输入输出操作速率）
-   MTTF（Mean Time to Failure）：硬盘持续运行不出错的连续时间区间
-   ...

### 数据库中数据的组织

以下是一些典型的组织方式：

-   堆
-   序列
-   多表聚合
-   B+树
-   哈希映射

例如索引，我们输入explain就可以看到数据库的查询计划。主要包含六种计划：sequential scan、index scan、bitmap scan、nested loop join、hash join、merge join。它们分别有不同的性能特点，例如，nested loop join适用于小规模数据集，hash join适合大规模的数据集。数据库在执行查询之前会首先估计不同查询方式的性能差别，然后择优查询。

* * *

数据库目前已经发展成了非常复杂的系统，目前许多国内厂商也在开发类似于postgresql的开源数据库，但是距离psql还是有很大的距离。
