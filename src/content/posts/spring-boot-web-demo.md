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
| └ DeptController.class
├ mapper
| └ DeptMapper.class
├ pojp // 实体类
| ├ Dept.class
| └ Result.class
├ service
| ├ impl
| | └ DeptServiceImpl.class
| └ DeptService.class
└ TestApplication
```

`application.properties` 添加配置

```yaml
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/tlias
spring.datasource.username=root
spring.datasource.password=1234

#配置mybatis的日志, 指定输出到控制台
mybatis.configuration.log-impl=org.apache.ibatis.logging.stdout.StdOutImpl
#开启mybatis的驼峰命名自动映射开关 
mybatis.configuration.map-underscore-to-camel-case=true
```

## 代码示例

采用 [Restful](https://www.ruanyifeng.com/blog/2018/10/restful-api-best-practices.html) 风格，实现接口 `GET: localhost:8080/depts` 返回所有数据

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

实体类
```java
@Data // 补全setter和getter
@NoArgsConstructor // 补全无参构造
@AllArgsConstructor // 补全全参构造
public class Emp {
    private LocalDateTime updateTime; // 驼峰命名，和数据表字段对应
  	...
}
```

### Controller

Controller 负责接口形式

```java
@Slf4j // 等价于 private static Logger log = LoggerFactory.getLogger(DeptController.class);
@RestController
public class DeptController {
    @Autowired
    private DeptService deptService;
  
    @GetMapping("/depts") // RequestMapping + method.GET
    public Result list(){
        log.info("查询全部数据");
        List<Dept> deptList = deptService.list();
        return Result.success(deptList);
    }
}
```

### Service 

Service 负责 sql 查询后的数据处理

```java
public Interface DeptService{
    public List<Dept> list();
}

@Service
public class DeptServiceImpl implements DeptService {
    @Autowired
    private DeptMapper deptMapper;

    @Override
    public List<Dept> list() {
        return deptMapper.list();
    }
}
```

### Mapper

Mapper 层即 DAO 层，负责底层 sql 查询实现

```java
@Mapper
public interface DeptMapper {

    @Select("select * from dept") // 用Mybatis注解实现查询
    List<Dept> list();

}
```