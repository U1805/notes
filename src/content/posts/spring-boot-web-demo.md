---
title: SpringBootWeb 搭建
published: 2024-02-17 18:46:18
draft: false
tags: [SpringBoot, SpringBootWeb, Java, Demo]
category: Backend
---

## 项目创建

IDE 为 IDEA 2022

Spring Initializr -> Type: `Maven`  
Dev: `Lombok`  
Web: `Spring Web`  
SQL: `MyBatis Framework` `MySQL Driver`

添加 MyBatis 插件：File -> Settings -> Plugins -> MyBatisX

## 项目结构

Controller - Service - Mapper(DAO) 三层结构

```
com.example
├ controller
| └ DemoController.java
├ mapper
| └ DemoMapper.java // interface
├ pojp // 实体类
| ├ Demo.java
| └ Result.java
├ service
| ├ impl
| | └ DemoServiceImpl.java
| └ DemoService.java // interface
└ TestApplication
```

在 resource 里的 `application.properties` 添加配置

```yaml
# 数据库相关
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/tlias
spring.datasource.username=root
spring.datasource.password=1234

# 配置mybatis的日志, 指定输出到控制台
mybatis.configuration.log-impl=org.apache.ibatis.logging.stdout.StdOutImpl
# 开启mybatis的驼峰命名自动映射开关 
mybatis.configuration.map-underscore-to-camel-case=true
```

## 代码示例

采用 [Restful](https://www.ruanyifeng.com/blog/2018/10/restful-api-best-practices.html) 风格，实现接口 `GET: localhost:8080/demo` 返回所有数据

Restful 风格简单来说就是：  
- GET: 查询请求
- POST: 添加请求
- PUT: 修改请求
- DELETE: 删除请求

### 实体类

响应结果格式统一如下：  
```java
public class Result {
	private Integer code; // 响应码
    private String msg; // 响应信息
  	private Object data; // 响应数据
  	public static Result success() { // 成功响应
      	return new Result(1, "success", null);
    }
    public static Result success(Object data) { // 成功响应
      	return new Result(1, "success", data);
    }
  	public static Result error(String msg) { // 失败响应
      	return new Result(0, msg, null);
    }
}
```

实体类 Demo.java
```java
@Data // 补全setter和getter
@NoArgsConstructor // 补全无参构造
@AllArgsConstructor // 补全全参构造
public class Demo {
    private LocalDateTime updateTime; // 驼峰命名，和数据表字段对应
  	private Integer aaa;
}
```

### Controller

Controller 负责接口形式

#### 通用模板

```java
/**
 * @Slf4j 等价于 
 * private static Logger log;
 * log = LoggerFactory.getLogger(DeptController.class);
 * 
 * @GetMapping 等价于
 * RequestMapping + method.GET
 */
@Slf4j
@RestController
public class DemoController {
    @Autowired
    private DemoService demoService;
  
    @GetMapping("/demo") 
    public Result list(){
        log.info("查询全部数据");
        List<Demo> demoList = demoService.list();
        return Result.success(demoList);
    }
}
```

#### 请求参数

如果接口有参数，在函数参数处声明，以常见的 GET 和 POST 请求为例：

GET 请求：
```java
@GetMapping("/getId/{id}")
public Result aaa(@PathVariable("id") Integer id){...}
// 多个参数：/getId/{id}/{name}
// usage: /getId/123

@GetMapping("/getId")
public Result bbb(@RequestParam("id") Integer id){...}
// usage: /getId?id=123

```

POST请求：
```java
public User { 
    Integer id;
}
// 在实体类里定义 User
// Post 在 RequestBody 使用 json 传值

@PostMapping("/getId")
public Result ccc(@RequestBody User user){...}
// usage: {"id": 123}

@PostMapping("/getId")
public Result ddd(@RequestBody Map userMap){...}
// usage: {"id": 123}
```

POST 上传文件

```java
@ResponseBody
@PostMapping("upload")
public Result eee(@RequestParam("file") MultipartFile file){
    file.getOriginalFilename()
    file.getContentType()
    file.getSize()
}
// usage: RequestBody 使用 form-data 传 file 类型数据
```


### Service 

Service 负责 sql 查询后的数据处理

#### 通用模板

```java
public Interface DemoService{
    public List<Demo> list();
}

@Service
public class DemoServiceImpl implements DemoService {
    @Autowired
    private DemoMapper demoMapper;

    @Override
    public List<Demo> list() {
        return demoMapper.list();
    }
}
```

因为 Service 是处理中间逻辑的，所以我觉得这是最需要灵活处理的部分，不像 Controller 和 Mapper 拿模板套一下就没了。
不过也不需要很复杂的逻辑，当作普通的 Java 写就可以了

### Mapper

Mapper 层即 DAO 层，负责底层 sql 查询实现

#### 通用模板

```java
@Mapper
public interface DemoMapper {

    @Select("select * from dept") // 用Mybatis注解实现查询
    List<Demo> list();
}
```

### 动态 SQL —— Mybatis 基础

动态 SQL 语句最好使用 Mybatis 实现：

[MyBatis中文说明](https://mybatis.net.cn/getting-started.html)

检查 Mybatis 依赖   
```xml
<dependency>
  <groupId>org.mybatis</groupId>
  <artifactId>mybatis</artifactId>
  <version>x.x.x</version>
</dependency>
```

在 resource 中建立与 java 中 `DemoMapper.java` 相同的路径，像这样：

- `java/cn/edu/aaa/mapper/DemoMapper.java`
- `resource/cn/edu/aaa/mapper/DemoMapper.xml`

java 中 的注解 `@Select("select * from demo")` 不需要写了，SQL 的编写移动 xml 中

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="cn.edu.aaa.mapper.DemoMapper">
    <select id="list" resultType="cn.edu.aaa.pojo.Demp">
        select * from demo
    </select>
</mapper>
```

#### if

使用动态 SQL 最常见情景是根据条件包含 where 子句的一部分。比如：

```xml
<select id="findActiveBlogLike"
     resultType="Blog">
  SELECT * FROM BLOG WHERE state = ‘ACTIVE’
  <if test="title != null">
    AND title like #{title}
  </if>
  <if test="author != null and author.name != null">
    AND author_name like #{author.name}
  </if>
</select>
```

#### choose、when、otherwise

有时候，我们不想使用所有的条件，而只是想从多个条件中选择一个使用。针对这种情况，MyBatis 提供了 choose 元素，它有点像 Java 中的 switch 语句。

还是上面的例子，但是策略变为：传入了 “title” 就按 “title” 查找，传入了 “author” 就按 “author” 查找的情形。若两者都没有传入，就返回标记为 featured 的 BLOG（这可能是管理员认为，与其返回大量的无意义随机 Blog，还不如返回一些由管理员挑选的 Blog）。

```xml
<select id="findActiveBlogLike"
     resultType="Blog">
  SELECT * FROM BLOG WHERE state = ‘ACTIVE’
  <choose>
    <when test="title != null">
      AND title like #{title}
    </when>
    <when test="author != null and author.name != null">
      AND author_name like #{author.name}
    </when>
    <otherwise>
      AND featured = 1
    </otherwise>
  </choose>
</select>
```

#### foreach

动态 SQL 的另一个常见使用场景是对集合进行遍历（尤其是在构建 IN 条件语句的时候）。比如：

```xml
<select id="selectPostIn" resultType="domain.blog.Post">
  SELECT *
  FROM POST P
  WHERE ID in
  <foreach item="item" index="index" collection="list"
      open="(" separator="," close=")">
        #{item}
  </foreach>
</select>
```