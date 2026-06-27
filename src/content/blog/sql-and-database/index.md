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

<p>本笔记主要为南方科技大学数据库（H）课程所记录。本课程旨在全面介绍SQL语言，以及简介数据库性能、设计内容。</p><hr><h2>一、<span>关系数据库</span>系统</h2><h3>关系与操作</h3><p>随着数据量的增大和数据管理日趋复杂，研究人员开发出了关系数据库和SQL语言以方便操作和管理数据。在关系数据库中，数据被保存在表中，其相关的数据通过关系表与其它表相连。我们可以使用<span>E-R图</span>来表示。</p><p>关系上的操作一般分为：</p><ul><li>select：筛选出行，筛选出的行被称为记录或者元组。</li><li>project：筛选出列，筛选出的列被称为属性。</li><li>join：根据关系合并表。</li></ul><h3>键值</h3><p>数据库中不应该出现完全相同的两行，因此，我们需要键值来区分到底什么是相同的，什么是不同的。不论如何，我们应该有一个Primary Key来保证数据的独特性。</p><h3><span>正则化</span>（Normalization）</h3><p>为了提高效率，任何数据列中都应该保存有用且不重复的信息。正则化是数据库应用开发中的重点，我们既要提高储存效率，又不能丢失信息。我们有三条范式：</p><ol><li>属性简单（Simple Attributes）</li><li>属性依赖全键（Attributes depend on the full key）</li><li>非键属性不相依赖（Non-key Attributes not depend on each other）</li></ol><p>我们要保证每一个属性都是几乎原子的，且一条记录中，所有的属性都要描述主键，并且非主键的属性不应当相互描述（这应该放在另外的表）。</p><h3><span>基数</span></h3><p>基数描述的是列的唯一键数，（m,n）-基数表示的是表格之间的对应。在高基数列上建立索引查询效率较高。</p><h3><span>NULL</span></h3><p>null在数据库中并不是0之类的数值，它只是一个标记（表示“空”）。通常来说，任何与null的运算、逻辑判断结果都是null。因此不能够使用a = null之类的判断语句，因为其输出必然是null，应该使用a is null的语句。但是，由于短路求值性质，我们有如下的特殊规则：</p><div><pre><code><span class="k">null</span> <span class="k">AND</span> <span class="k">false</span> <span class="o">=</span> <span class="k">false</span>
<span class="k">null</span> <span class="k">and</span> <span class="k">true</span> <span class="o">=</span> <span class="k">null</span>
<span class="k">null</span> <span class="k">OR</span> <span class="k">true</span> <span class="o">=</span> <span class="k">true</span>
<span class="k">null</span> <span class="k">OR</span> <span class="k">false</span> <span class="o">=</span> <span class="k">null</span></code></pre></div><p>实际上，这样的特殊情况在其它编程语言中也存在，但是由于null在数据库中的特殊性质，这一点体现的尤为明显。</p><h2>二、SQL</h2><p>SQL分为<span>DDL</span>（Data Definition Language）和<span>DML</span>（Data Manipulation Language）。SQL不具有很强的类型属性，因此操作时要小心，SQL引擎不会给出提示。</p><h3>DDL</h3><p>CREATE TABLE</p><div><pre><code><span class="k">create</span> <span class="k">table</span> <span class="k">table_name</span> <span class="p">(</span>
    <span class="n">col_name</span> <span class="k">type</span> <span class="p">[</span><span class="k">unique</span><span class="p">,</span> <span class="k">not</span> <span class="k">null</span><span class="p">,</span> <span class="k">primary</span> <span class="k">key</span><span class="err">【只能有一个】</span><span class="p">,</span> <span class="k">default</span> <span class="err">默认值</span><span class="p">],</span>
    <span class="k">check</span><span class="p">(</span><span class="err">要检查的布尔表达式</span><span class="p">),</span>
    <span class="p">...</span>
    <span class="k">unique</span><span class="p">(...)</span> <span class="c1">-- 设置键值或者键值的组合（使用括号括起来）唯一，
</span>    <span class="k">foreign</span> <span class="k">key</span> <span class="p">(</span><span class="err">表中列【或者多个列】</span><span class="p">)</span> <span class="k">references</span> <span class="err">另外的表（另外表的列【或者多个列】）【外键约束】</span><span class="p">,</span>
    <span class="k">constraint</span> <span class="err">限制名</span> <span class="k">check</span> <span class="p">(</span><span class="err">布尔表达式</span><span class="p">)</span>
<span class="p">);</span>
<span class="c1">-- Text type: char(长度)【不加说明默认为1】, varchar(最大长度), clob
</span><span class="c1">-- Number type: int, float, numeric(数字总数, 小数位)
</span><span class="c1">-- Date type: date, datetime【带时间】,timestamp【高精度时间戳】
</span><span class="c1">-- Binary type: raw(最大长度), varbinary(最大长度), blob, bytea...
</span><span class="c1">-- primary key默认unique且not null
</span><span class="c1">-- SQL中字符串是大小敏感的，其余不敏感
</span><span class="c1">-- unique not null和primary key在限制上相同，但是不同的是unique not null可以有多个，primary key不能主动改变
</span><span class="c1">-- 日期算术：PostgreSQL支持日期-'1 month/day/year'之类的日期直接计算，支持between '2019-10-13' and '2019-11-01'这样的语法</span></code></pre></div><p>一些其它的DDL语句</p><div><pre><code><span class="k">drop</span> <span class="k">table</span> <span class="err">表名</span><span class="p">;</span> <span class="c1">--删除表
</span><span class="k">truncate</span> <span class="k">table</span> <span class="err">表名</span><span class="p">;</span> <span class="c1">--清空表
</span><span class="k">alter</span> <span class="k">table</span> <span class="err">表名</span> <span class="err">操作语句【</span><span class="k">add</span> <span class="k">column</span> <span class="err">列名</span> <span class="k">type</span><span class="err">】</span> <span class="c1">--改变表元数据
</span><span class="k">create</span> <span class="k">index</span><span class="o">/</span><span class="k">trigger</span><span class="o">/</span><span class="k">function</span><span class="o">/</span><span class="p">...</span> <span class="c1">-- 创建索引/触发器/函数</span></code></pre></div><h3>DML</h3><p>INSERT</p><div><pre><code><span class="k">insert</span> <span class="k">into</span> <span class="k">table_name</span> <span class="p">(</span>
    <span class="n">colname1</span><span class="p">,</span> <span class="n">colname2</span><span class="p">,</span> <span class="p">...</span>
<span class="p">)</span> 
<span class="k">values</span>
<span class="p">(</span><span class="n">val1</span><span class="p">,</span> <span class="n">val2</span><span class="p">,</span> <span class="p">...),</span>
<span class="p">(</span><span class="n">val1</span><span class="p">,</span> <span class="n">val2</span><span class="p">,</span> <span class="p">...),</span>
<span class="p">...</span>
<span class="p">;</span>

<span class="c1">-- 我们可以使用自增序列方便插入
</span><span class="k">create</span> <span class="n">sequence</span> <span class="n">movie_seq</span><span class="p">;</span>
<span class="k">insert</span> <span class="k">into</span> <span class="n">movies</span> <span class="p">(</span><span class="n">movieid</span><span class="p">,</span> <span class="p">...)</span> <span class="k">values</span> <span class="p">(</span><span class="n">nextval</span><span class="p">(</span><span class="s1">'movie_seq'</span><span class="p">)</span><span class="o">/</span><span class="n">currval</span><span class="p">(</span><span class="s1">'movie_seq'</span><span class="p">),</span> <span class="p">...)</span>

<span class="c1">-- 我们也可以在创建表的时候使用自动标号（serial for PostgreSQL）
</span><span class="k">create</span> <span class="k">table</span> <span class="n">movies</span> <span class="p">(</span>
  <span class="n">movieid</span> <span class="nb">serial</span> <span class="k">primary</span> <span class="k">key</span><span class="p">,</span> 
  <span class="p">...</span>
<span class="p">)</span>
<span class="c1">-- 插入的时候，忽略插入id即可
</span>
<span class="c1">-- 我们也可以自动使用同一会话上一次生成的值插入
</span><span class="k">insert</span> <span class="k">into</span> <span class="n">credits</span> <span class="p">(</span><span class="n">movieid</span><span class="p">,</span> <span class="p">...)</span> <span class="k">values</span> <span class="p">(</span><span class="n">lastval</span><span class="p">(),</span> <span class="p">...)</span></code></pre></div><p>可以使用to_XXX进行类型转换。例如to_date('07/20/1969', 'MM/DD/YYYY')。</p><p>SELECT</p><div><pre><code><span class="k">select</span> <span class="n">col1</span><span class="p">,</span> 
       <span class="n">col2</span><span class="p">,</span> 
       <span class="n">coalesce</span><span class="p">(</span><span class="n">col3</span><span class="p">,</span> <span class="mi">1</span><span class="p">),</span> <span class="c1">-- 如果为null, 替换为1
</span>       <span class="n">rank</span><span class="p">(</span><span class="n">col4</span><span class="p">)</span> <span class="n">over</span> <span class="p">(</span><span class="n">partition</span> <span class="k">by</span> <span class="n">col1</span> <span class="k">order</span> <span class="k">by</span> <span class="n">col2</span> <span class="p">[</span><span class="k">desc</span><span class="p">]...)</span> <span class="c1">--Window Function
</span>       <span class="c1">-- partition by等同于 group by，此处为分类排序
</span><span class="k">from</span> <span class="n">tabl1</span> 
<span class="p">[</span><span class="k">join</span> <span class="n">tab2或子查询</span> <span class="k">on</span> <span class="p">...]</span>
<span class="p">[</span><span class="err">有聚合函数</span><span class="p">,</span><span class="k">group</span> <span class="k">by</span> <span class="p">...</span> <span class="k">having</span> <span class="p">...]</span>
<span class="p">[</span><span class="k">order</span> <span class="k">by</span> <span class="k">asc</span><span class="o">/</span><span class="k">desc</span><span class="p">]</span>
<span class="k">where</span> <span class="n">col1</span> <span class="o">=</span> <span class="n">value</span> <span class="p">(</span><span class="n">col1</span> <span class="k">is</span> <span class="k">null</span><span class="p">)</span> <span class="err">【尽可能不要在列筛选等号左侧使用函数，一般的索引会失效】</span>
<span class="p">[</span><span class="k">and</span> <span class="err">筛选条件</span><span class="p">,</span> <span class="err">如</span> <span class="n">value</span> <span class="k">in</span> <span class="n">tab1或</span><span class="p">(</span><span class="k">select</span> <span class="p">...)</span><span class="err">或</span><span class="p">(</span><span class="s1">'A'</span><span class="p">,</span> <span class="s1">'B'</span><span class="p">,</span> <span class="p">...)</span><span class="err">之类的元组</span><span class="p">]</span>
<span class="c1">--【此时，将临时表视为集合；如果只有单行，可以使用等号】
</span><span class="p">[</span><span class="n">string</span> <span class="k">like</span> <span class="s1">'%a%'</span><span class="p">]</span>
<span class="p">[</span><span class="k">limit</span> <span class="mi">1</span><span class="o">/</span><span class="mi">10</span><span class="o">/</span><span class="mi">100</span><span class="p">...</span><span class="err">，限制到多少行</span><span class="p">]</span>
<span class="p">[</span><span class="k">union</span><span class="o">/</span><span class="k">intersect</span><span class="o">/</span><span class="k">except</span> <span class="k">next</span> <span class="k">select</span><span class="p">]</span>
<span class="c1">-- 转换函数如upper(), lower()
</span><span class="c1">-- 聚合函数如count(), sum(), avg()等
</span><span class="c1">-- 聚合函数不得使用在where中，应该使用having
</span><span class="c1">-- 如果select的列中，存在不包含被统计的列，应当出现在group by语句中，否则违规
</span><span class="c1">-- <span>窗口函数</span>例如rank(), dense_rank(), row_number()等。其中，rank()为非紧凑排序，也就是说排名并不是
</span><span class="c1">-- 根据1，2，3递增，而是根据同名次相同，下一个数字按照总的人数确定，例如两个人并列第一，那么不会有
</span><span class="c1">-- 第二名，而是直接从第三名；dense_rank则是按照1，2，3紧凑排序
</span><span class="c1">-- lag()函数和lead()函数可以计算前后某一行和当前行的差距，语法为lag(col, offset, default)
</span><span class="c1">-- 通常我们会加上排序 lag(...) over (order by col desc...)</span></code></pre></div><p>where是对于整体表进行筛选，然后进入聚合统计，having在where之后作用于数据。</p><p>在实际查询中，我们有一些很有意思的解法：</p><figure><div><img alt="" loading="lazy" decoding="async" src="/assets/blog/sql-and-database/img-0.jpg"></div></figure><p>一个非常巧妙的解法是（来自力扣用户宇航员）：</p><div><pre><code><span class="k">with</span> <span class="n">t1</span> <span class="k">as</span><span class="p">(</span>
    <span class="k">select</span> <span class="o">*</span><span class="p">,</span><span class="n">id</span> <span class="o">-</span> <span class="n">row_number</span><span class="p">()</span> <span class="n">over</span><span class="p">(</span><span class="k">order</span> <span class="k">by</span> <span class="n">id</span><span class="p">)</span> <span class="k">as</span> <span class="n">rk</span>
    <span class="k">from</span> <span class="n">stadium</span>
    <span class="k">where</span> <span class="n">people</span> <span class="o">&gt;=</span> <span class="mi">100</span>
<span class="p">)</span>
<span class="c1">-- 按照id排序，附加一个当前id-行号的信息（过滤掉所有少于100的行），所有rk相同的记录位移相同，统计即可
</span>
<span class="k">select</span> <span class="n">id</span><span class="p">,</span><span class="n">visit_date</span><span class="p">,</span><span class="n">people</span>
<span class="k">from</span> <span class="n">t1</span>
<span class="k">where</span> <span class="n">rk</span> <span class="k">in</span><span class="p">(</span>
    <span class="k">select</span> <span class="n">rk</span>
    <span class="k">from</span> <span class="n">t1</span>
    <span class="k">group</span> <span class="k">by</span> <span class="n">rk</span>
    <span class="k">having</span> <span class="k">count</span><span class="p">(</span><span class="n">rk</span><span class="p">)</span> <span class="o">&gt;=</span> <span class="mi">3</span>
<span class="p">)</span></code></pre></div><p>其核心思想在于，对于任何一个存在两天连续100的日子，不论其处于哪一行，它们的id-行号保持不变。因此，我们的where过滤并不影响这个不变量，我们将这个数字记为rk。因此，只要拥有相同的rk，它们必然是大于100且连续的日子，我们使用一个count来统计即可。</p><p>join算子分为outer join和inner join，outer join有left join、right join、...。实际开发中，应该多使用join而不是其它集合算子，因为数据库对join的优化相当多。对于那些需要统计所有的用户，但是用户可能没有在记录表中留下任何记录的情况，我们可以使用left join来保留所有的用户，并且通过coalesce来为null行设置值。</p><p>窗口函数和聚合函数的区别是，聚合函数在输出的临时表中将其它无关数据压缩，最终只包含聚类指标+聚类结果；窗口函数不同，它将会完整保存所有选中的列（即使不是聚类指标，因此不需要再partition by中加上所有的非被统计选中列），简单来说，它会在每一行后面加上统计结果，不会破坏原始数据。</p><p>UPDATE</p><div><pre><code><span class="k">update</span> <span class="k">table_name</span>
<span class="k">set</span> <span class="n">col1</span> <span class="o">=</span> <span class="n">value</span><span class="p">,</span> 
    <span class="n">col2</span> <span class="o">=</span> <span class="k">case</span> <span class="n">var</span>
             <span class="k">when</span> <span class="n">value</span> <span class="k">then</span> <span class="p">...</span>
             <span class="k">when</span> <span class="n">value</span> <span class="k">then</span> <span class="p">...</span>
             <span class="k">else</span> <span class="p">...</span>
           <span class="k">end</span> <span class="k">as</span> <span class="n">name</span><span class="p">,</span> 
    <span class="n">col3</span> <span class="o">=</span> <span class="n">func</span><span class="p">(),</span> 
    <span class="p">...</span>
<span class="k">where</span> <span class="p">...</span></code></pre></div><p>DELETE</p><div><pre><code><span class="k">delete</span> <span class="k">from</span> <span class="k">table_name</span>
<span class="k">where</span> <span class="p">...</span></code></pre></div><h3>特殊的CREATE语句</h3><p>FUNCTION </p><div><pre><code><span class="k">create</span> <span class="p">[</span><span class="k">or</span> <span class="k">replace</span><span class="p">]</span> <span class="k">function</span> <span class="n">func</span><span class="p">(</span><span class="n">col1</span><span class="p">,</span> <span class="n">col2</span><span class="p">,</span> <span class="p">...)</span>
<span class="k">returns</span> <span class="k">type</span> <span class="c1">--（如integer, varchar, numeric【可指定精度】，）
</span><span class="k">as</span> <span class="err">$$</span>
<span class="k">declare</span> 
  <span class="n">var_name</span> <span class="nb">varchar</span> <span class="p">[:</span><span class="o">=</span> <span class="n">value</span><span class="p">];</span>
  <span class="n">var_name2</span> <span class="k">type</span> <span class="p">...;</span>
  <span class="p">...;</span>
<span class="k">begin</span>
  <span class="c1">--赋值需要使用:=表示，例如varname := firstname || ' ' || secondname;
</span>  <span class="p">[</span><span class="k">return</span><span class="err">，如果不是</span><span class="k">return</span> <span class="n">void</span><span class="err">，那么需要</span><span class="k">return</span><span class="err">，如果是纯</span><span class="k">procedure</span><span class="err">，就不用</span><span class="p">]</span> 
  <span class="p">...[</span><span class="err">此处，我们只能够返回</span><span class="n">type对应的内容</span><span class="err">，如果返回多行，将会出错</span><span class="p">]</span>
<span class="k">end</span>
<span class="err">$$</span> <span class="k">language</span> <span class="n">plpgsql</span>

<span class="c1">-- 在sql中也可以使用...as 'select x+y' language sql;之类的语法，可以用单引号把语句括起来
</span><span class="c1">-- 但是在plpgsql中不可以，需要用$$...$$表示</span></code></pre></div><p>在FUNCTION中我们可以使用IF ELSE语句</p><div><pre><code><span class="k">begin</span>
<span class="k">if</span> <span class="n">condition1</span>
<span class="k">then</span>
<span class="p">...</span>
<span class="n">elseif</span> <span class="n">condition2</span>
<span class="k">then</span>
<span class="p">...</span>
<span class="k">else</span>
<span class="p">...</span>
<span class="k">end</span> <span class="k">if</span><span class="p">;</span>
<span class="k">end</span><span class="p">;</span></code></pre></div><p>也可以使用循环：</p><div><pre><code><span class="k">for</span> <span class="n">variable_value</span> <span class="k">in</span> <span class="n">start_value</span><span class="p">..</span><span class="n">end_value</span> <span class="n">loop</span>
<span class="n">statements</span><span class="p">;</span>
<span class="k">end</span> <span class="n">loop</span><span class="p">;</span>

<span class="n">while</span> <span class="n">condition</span> <span class="n">loop</span>
<span class="n">statements</span><span class="p">;</span>
<span class="k">end</span> <span class="n">loop</span><span class="p">;</span></code></pre></div><p>如果需要返回table，那么应该这么写：</p><div><pre><code><span class="k">create</span> <span class="k">function</span> <span class="n">fun_name</span><span class="p">(</span><span class="n">arg1</span> <span class="n">type1</span><span class="p">,</span> <span class="p">......)</span>
<span class="k">returns</span>
<span class="k">table</span>
<span class="p">(</span>
<span class="n">col_name1</span> <span class="n">col_type</span><span class="p">,</span>
<span class="n">col_name2</span> <span class="n">col_type</span><span class="p">,</span> <span class="p">..</span>
<span class="p">..</span>
<span class="p">..</span>
<span class="p">)</span> <span class="c1">--此处声明表的结构
</span><span class="k">as</span>
<span class="err">$$</span>
<span class="k">begin</span>
<span class="k">return</span> <span class="n">query</span> <span class="k">select</span> <span class="n">col1</span><span class="p">,</span> <span class="n">col2</span> <span class="k">from</span><span class="p">......;</span> <span class="c1">--返回名为query的表，列要对应
</span><span class="k">end</span><span class="p">;</span>
<span class="err">$$</span>
<span class="k">language</span> <span class="n">plpgsql</span><span class="p">;</span></code></pre></div><p>由于函数可能关联很多其它部分，所以尽可能使用Alter和Replace来更新函数，不要先drop后create。</p><p>创建函数需要schema的create权限，调用需要schema的usage权限。</p><p>有以下四种函数：</p><ul><li>SQL function</li><li>Procedure language function（python等）</li><li>Internal function</li><li>C language function</li></ul><p>如果没有在函数内声明参数名称，可以使用</p><div><pre><code>$1 $2</code></pre></div><p>来对应参数表中的输入。$1表示参数表中的第一个参数，以此类推。</p><p>TRIGGER</p><p>trigger按照触发时机分为before/after/instead of trigger（特殊触发器，只在视图上，只按行触发，替代直接的视图操作）。</p><p>按照位置分为 tables/views/foreign table trigger。</p><p>按照影响的对象分为row/statement trigger。</p><figure><div><img alt="" loading="lazy" decoding="async" src="/assets/blog/sql-and-database/img-1.jpg"></div><figcaption>总结（清空操作没有按行触发类型，instead of只有按行触发）</figcaption></figure><div><pre><code><span class="k">create</span> <span class="k">trigger</span> <span class="k">trigger_name</span> 
<span class="k">before</span><span class="o">/</span><span class="k">after</span> <span class="p">(</span><span class="o">+</span><span class="err">操作名</span><span class="p">,</span> <span class="err">如</span><span class="k">insert</span> <span class="p">[</span><span class="k">or</span> <span class="k">update</span><span class="p">[</span><span class="k">of</span> <span class="n">col1</span><span class="p">[,</span><span class="n">col2</span><span class="p">,...</span><span class="err">【特定某一列更新】</span><span class="p">]]</span> <span class="k">or</span> <span class="k">delete</span> <span class="p">...])</span> <span class="k">on</span> <span class="k">table_name</span>
<span class="c1">-- 或者on [event名字]，例如ddl_command_start事件
</span><span class="k">for</span> <span class="k">each</span> <span class="k">row</span><span class="o">/</span><span class="k">for</span> <span class="k">each</span> <span class="k">statement</span>
<span class="k">as</span> 
<span class="k">execute</span> <span class="k">procedure</span><span class="o">/</span><span class="k">function</span> <span class="n">people_audit_fn</span><span class="p">();</span> <span class="c1">-- procedure和function实际上都可以用，在PostgreSQL 11之后可用function</span></code></pre></div><p>在PostgreSQL中，我们在使用trigger的时候需要使用一个特定的函数返回trigger。</p><div><pre><code><span class="k">create</span> <span class="k">or</span> <span class="k">replace</span> <span class="k">function</span> <span class="n">people_audit_fn</span><span class="p">()</span>
<span class="k">returns</span> <span class="k">trigger</span>
<span class="k">as</span> <span class="err">$$</span>
<span class="k">begin</span>
    <span class="k">if</span> <span class="n">tg_op</span> <span class="o">=</span> <span class="s1">'UPDATE'</span>
    <span class="k">then</span> 
        <span class="k">insert</span> <span class="k">into</span> <span class="n">people_audit</span><span class="p">(...);</span>
        <span class="k">select</span> <span class="p">...</span>
    <span class="k">end</span> <span class="k">if</span><span class="p">;</span>

    <span class="k">return</span> <span class="k">new</span><span class="p">;</span> <span class="c1">--如果在before trigger中返回null，将会直接取消当前操作；在after中则不会
</span><span class="k">end</span><span class="p">;</span>
<span class="err">$$</span> <span class="k">language</span> <span class="n">plpgsql</span><span class="p">;</span></code></pre></div><p>INDEX</p><div><pre><code><span class="k">create</span> <span class="p">[</span><span class="k">unique</span><span class="p">]</span> <span class="k">index</span> <span class="n">index_name</span> 
<span class="k">on</span> <span class="n">tab1</span> <span class="p">(</span><span class="n">col1</span><span class="p">,</span> <span class="n">col2</span><span class="p">,</span> <span class="n">func</span><span class="p">(</span><span class="n">col3</span><span class="p">));</span>
<span class="p">[</span><span class="k">where</span> <span class="p">...]</span></code></pre></div><p>一般而言，基数越大的指标，索引的效率越高（区分度越高）。如果你要在函数上使用index，注意要在函数上面建立index，否则数据库不会使用index查找。</p><p>VIEW</p><div><pre><code><span class="k">create</span> <span class="k">view</span> <span class="n">view_name</span><span class="p">(</span><span class="n">col1</span><span class="p">,</span> <span class="n">col2</span><span class="p">,</span> <span class="p">...)</span> <span class="k">as</span> 
<span class="p">[</span><span class="err">查询语句</span><span class="p">]</span>
<span class="p">[</span><span class="k">with</span> <span class="k">check</span> <span class="k">option</span><span class="p">]</span> 
<span class="c1">--此时更新不得违反视图中的约束，例如不能将一个存在于视图中的对象更新到不符合视图的部分</span></code></pre></div><p>通过视图，我们可能可以修改被引用表中的内容，但是需要满足一定的检查条件。包含聚合函数的视图不可以更新。</p><p>我们在view上面有一个特殊的trigger——instead of trigger（只能用于视图）：</p><div><pre><code><span class="k">create</span> <span class="k">trigger</span> <span class="n">tri_name</span> 
<span class="k">instead</span> <span class="k">of</span> <span class="err">操作</span> <span class="k">on</span> <span class="err">视图名</span>
<span class="k">for</span> <span class="k">each</span> <span class="k">row</span><span class="o">/</span><span class="k">statement</span>
<span class="k">as</span> 
<span class="k">execute</span> <span class="k">procedure</span><span class="o">/</span><span class="k">function</span> <span class="n">handle_view</span><span class="p">();</span></code></pre></div><p>视图相当于保存了一段比较复杂的查询（或者说，一张虚拟表），呈现给特定的用户，避免他们看到不应该看到的数据。但是，开发者不应该在复杂的视图上继续添加视图，否则会导致很高的复杂度，从而降低数据库开发应用的性能。</p><p>如果需要通过视图修改原始表，需要同时具有view的create和drop权限（简单视图，不包含join之类的操作）。如果包含复杂操作，例如join等多表查询、含有表达式等等（此时，含有聚合函数的视图仍然不可更新），应该使用instead of触发器进行更新。在通过视图更新的时候，Trigger通过自动捕获sql中的更新内容进行更新，并且返回NEW或者OLD。</p><p>View在数据库中永久存在直到被显式（Explicitly）删除，它不会随着基表的删除而自动删除（在某些数据库中，例如PostgreSQL中支持递归删除，但是需要指定；SQLserver中可以存在临时视图，会被自动删除，但这些并不在我们讨论范围内）。</p><p>EXPLAIN</p><p>如果需要查看statement的查询计划，可以在语句前加上EXPLAIN。就可以查看查询计划。更详细的可以使用相关参数来调用需要的指标。</p><div><pre><code>explain &lt;statement&gt;</code></pre></div><p>里面包含很多的内容，例如扫表方法（Seq Scan，Index Scan，Bitmap，Nested Loop等等），内存命中，脏页数量等等。这些是我们评估数据库性能的重要指标。</p><h3>一些基本语法</h3><p>我们通过双竖线表示字符串拼接</p><div><pre><code>'Harry' || 'Potter'</code></pre></div><p>不等号如下（推荐的写法）</p><div><pre><code>a &lt;&gt; b</code></pre></div><p>大于（小于）等于号</p><div><pre><code>a &gt;= b / a &lt;= b</code></pre></div><h2>三、Transactions</h2><h3>ACID性质</h3><ul><li>Atomicity：原子性，全或无机制，要么完全提交，要么完全回滚</li><li>Consistency：一致性，数据更新保持一致，出现矛盾立刻回滚</li><li>Isolation：隔离性，（在通常的机制下）不同事务根据快照读取，不相干扰</li><li>Durability：持久性，一旦提交，数据立刻永久生效</li></ul><h3>读取现象</h3><ul><li>脏读：读取未提交的数据</li><li>不可重复读：事务内两次读取的数据不同，因为可能被其它会话修改</li><li>幻读：事务内读取到了新的数据，第一次和第二次读取的数据行数不同（可重复读等级下，读取基于快照，写入需要通过检测，如果与其它事务发生冲突，优先者提交，后来者完全回滚）</li><li>序列异常：并发执行的事务不可被序列化为等价的序列（相应隔离等级下，如果新的提交不能够被序列化，那么数据库会拒绝此提交）</li></ul><h3>隔离等级</h3><ul><li>未提交可读（Read Uncommitted）：可以脏读，但是在PG中不允许</li><li>提交可读（Read Committed）：不可脏读，其余可以。这是psql默认的隔离等级。</li><li>可重复读（Repeatable Read）：可能出现幻读，但是在PG中不允许</li><li>序列化（Serializable）：最严格，不可脏读、重复读、幻读，不允许序列异常</li></ul><h3><span>事务语法</span></h3><div><pre><code><span class="k">begin</span> <span class="k">transaction</span><span class="p">;</span> <span class="c1">--开始事务
</span><span class="k">commit</span><span class="p">;</span> <span class="c1">-- 提交
</span><span class="k">rollback</span><span class="p">;</span> <span class="c1">-- 回滚
</span><span class="k">set</span> <span class="n">default_transaction_isolation</span> <span class="o">=</span> <span class="s1">'隔离等级名称'</span><span class="p">;</span></code></pre></div><h2>四、Privilege and <span>Information Schema</span></h2><h3>Previleges</h3><p>超级用户可以给予其它用户各类权限，例如创建、修改、删除、查询表，以及授予其它用户权限的权限。语法如下：</p><div><pre><code>grant 权限 [on table_name] to 账户
revoke 权限 from 账户</code></pre></div><p>数据库中存在ROLE和USER两种角色。本质上它们是同一种，但是ROLE无法使用密码登录，USER可以。USER本质上是特殊的ROLE。ROLE（用户组）一般用于授予权限，例如，我对于一个ROLE授予了若干权限，此时我只需要使用</p><div><pre><code><span class="k">grant</span> <span class="n">role_name</span> <span class="k">to</span> <span class="n">usr</span><span class="p">;</span> </code></pre></div><p>就可以一次性完成给用户usr所有role_name用户组所有的权限的授予。</p><p>如果需要授予架构之下的所有权限，可以使用</p><div><pre><code><span class="k">grant</span> <span class="k">all</span> <span class="k">privileges</span> <span class="k">on</span> <span class="k">table_name</span> <span class="k">in</span> <span class="k">schema_name</span> <span class="k">to</span> <span class="n">user_name</span><span class="p">;</span></code></pre></div><p>更换架构的所有权可以使用（仅postgresql）：</p><div><pre><code><span class="k">alter</span> <span class="k">schema</span> <span class="k">schema_name</span> <span class="k">owner</span> <span class="k">to</span> <span class="n">user_name</span></code></pre></div><h3>Information Schema与pg_catalog</h3><p>Information Schema（信息架构）储存了数据库中各类元数据（并非数据本身），例如表的名字、视图名字、约束、triggers、functions、grants、......。其可见性对于所有用户可用，不可修改。</p><p>而pg_catalog事实上是与Information Schema同步的，它们没有本质区别，但是pg_catalog包含了postgreSQL自身定制的一些信息以及更加详细的细节，其中一些表需要超级用户权限访问。如果需要移植到别的数据库中，不建议使用pg_catalog，而应该使用Information Schema。</p><p>注意，pg_catalog不会在用户表update的时候被改变，只有在表的元数据被修改的时候才会改变（也就是说，一般DDL语法才会改变catalog）。</p><h3>Information Schema中的五个元数据类型</h3><ul><li>cardinal_number 非负整数，标识数量信息，如行列数等</li><li>character_data 普通文本字符串</li><li>sql_identifier sql标识符，例如表名</li><li>time_stamp 时间信息</li><li>yes_or_not 可兼容性布尔值</li></ul><h2>五、数据库性能的评估</h2><p>数据库性能的评估的核心指标包含例如缓存命中率、查询命令优化能力等等。为什么要提高缓存命中率？这是因为，我们在频繁查询一个数据的时候，往往需要与硬盘频繁通信，而机械硬盘的速度通常是很慢的。因此数据库系统会将频繁查询的数据放入缓存来提高查询效率。</p><h3>存储</h3><p>通常的存储类型有两种：</p><ul><li>易失性存储（Volatile Storage）</li><li>非易失性存储（Non-volatile Storage）</li></ul><p>影响数据读取的因素包含：</p><ul><li>数据读取通道的速度</li><li>读取单个数据的代价</li><li>读取数据的可靠性（否则我们纠错也需要时间）</li></ul><h3>储存层级</h3><p>从上到下为（从cache开始算）：</p><ol><li>cache，main memory（易失）</li><li>flash memory（以下为非易失的，如SSD）</li><li>magnetic disk</li><li>optical disk</li><li>magnetic tapes</li></ol><h3>储存接口</h3><p>储存系统提供了如下的存储接口：</p><ul><li>SATA</li><li>SAS</li><li>NVMe</li><li>NAS &amp; SAN</li></ul><h3>如何评估硬盘的性能</h3><p>我们可以通过三个主要的时延来评价：</p><ul><li>查询时间（Seek Time）：读写臂找到正确的轨道的时间</li><li>旋转时延（Rotational Latency）：分区能够被读写臂访问的旋转时延</li><li>传输率（Data-transfer rate）：数据从硬盘上传输到外部的时间</li></ul><p>一些重要的指标包含：</p><ul><li>Disk block（硬盘块，包含许多数据以及可能有一些空缺，分配和查询的基本逻辑单元）</li><li>Sequential access pattern（顺序读写模式，也就是顺序访问硬盘块的速度）</li><li>Random access pattern（随意读写模式，访问任意硬盘块的速度）</li><li>I/O operations per second（输入输出操作速率）</li><li>MTTF（Mean Time to Failure）：硬盘持续运行不出错的连续时间区间</li><li>...</li></ul><h3>数据库中数据的组织</h3><p>以下是一些典型的组织方式：</p><ul><li>堆</li><li>序列</li><li>多表聚合</li><li>B+树</li><li>哈希映射</li></ul><p>例如索引，我们输入explain就可以看到数据库的查询计划。主要包含六种计划：sequential scan、index scan、bitmap scan、nested loop join、hash join、merge join。它们分别有不同的性能特点，例如，nested loop join适用于小规模数据集，hash join适合大规模的数据集。数据库在执行查询之前会首先估计不同查询方式的性能差别，然后择优查询。</p><hr><p>数据库目前已经发展成了非常复杂的系统，目前许多国内厂商也在开发类似于postgresql的开源数据库，但是距离psql还是有很大的距离。</p>
