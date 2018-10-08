# feewee/http

`feewee-erp-frame` 基于`axios`在公共层使用拦截器提供的 `http` lib，其提供了 `request` 层的错误拦截，`status`状态码异常，业务返回码异常的通用，支持`开发者`自定义往下传递。[参见1](https://github.com/axios/axios/blob/master/lib/defaults.js#L78),[参见2](https://github.com/axios/axios/blob/master/lib/core/settle.js)。

1. 用独立的拦截器拦截`Http status code error`，使用 `antd -> notification` 通知，存在下列几种常见的状态码异常处理：
  + `401` -> `response.data.status === 40101` -> `response.data.message` 未登录
  + `403` -> `response.data.status === 40103` -> `response.data.message` 无权限
  + `...others` -> `return response.data`
2. 用独立的拦截器拦截`Server response code error`,使用 `antd -> message` 通知，或通过自定义配置`{ handleError: true }`往下传递到业务方手动处理。
  + `if (!success) { return config.handleError ? Promise.reject(error) : message.error(response.data.result) }`


## ConfigOptions
```TypeScript
interface ConfigOptions {
  readonly url: string,
  readonly data?: FormData | URLSearchParams | Object | Array | String | Stream | JSON | Blob | ArrayBuffer | File,
  config?: AxiosConfig
}

interface AxiosConfig {
  // new features
  debug?: boolean, // ** 打印请求和错误 step by step。 **
  handleError?: boolean, // ** http 将 failed 后的 错误对象和整体数据 控制权交由业务自身 **
  allData?: boolean, // ** 获取server code，http 将 success 后的 数据整体 控制权交由业务自身 **
  external?: boolean, // ** 外部请求，不遵循前后端约定的情况，直接返回 `response.body` 并交由业务自身处理 **
  prefix?: string,
  // other original AxiosConfig options
}
```


## Usage

### GET

[Source Code](https://github.com/axios/axios/blob/master/lib/core/Axios.js#L65)

```TypeScript
import Http from 'feewee/http'

Http.get(API: string, [, { params: any } ?: AxiosConfig ])

//or

Http({
  method: 'get',
  url: '/admin',
  data: params,
}: ConfigOptions);

```


### POST

[Source Code](https://github.com/axios/axios/blob/master/lib/core/Axios.js#L75)

#### Content-Type: application/x-www-form-urlencoded;charset=utf-8

Server 以 `req.form[field]` 格式取值，其数据格式为 `x-www-form-urlencoded` 的时候，[参见](https://github.com/axios/axios/blob/master/lib/defaults.js#L46) 发送时候调用：

```TypeScript
import Http from 'feewee/http'

// 1
Http.postForm(API_PATH: string, [, data?: any [, config?: AxiosConfig ]);

// 2
Http.post('/admin' [, new URLSearchParams(data) [, config]);

// 3
Http({
  method: 'post',
  url: '/admin',
  data: new URLSearchParams(data), // ERP理论上不存在`URLSearchParams`兼容问题
  config?: AxiosConfig
}: ConfigOptions);

```

#### Content-Type: application/json;charset=utf-8

Server 以 `req.body[field]` 格式取值，其数据格式为 `json` 的时候，[参见](https://github.com/axios/axios/blob/master/lib/defaults.js#L50) 发送时候调用：

```TypeScript
import Http from 'feewee/http'

// 1
Http.postJSON(API_PATH: string, [, data?: any [, config?: AxiosConfig ]);

// 2
Http.post('/admin' [, data [, config]);

// 3
Http({
  method: 'post',
  url: string,
  data: object,
  config?: AxiosConfig
}: ConfigOptions);
```
