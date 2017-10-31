# 前言

node.js的DEMO

# 技术栈
node.js、express、jade



进入文件夹
cd node-demo

安装依赖
npm install
```

开启本地服务器
node app dev       // DEV 环境
node app qa        // QA 环境
node app prod      // PROD 环境

node app dev fw    // 使用zaia.fengwo.com相关
node app dev ys    // 使用m.youshu.cc相关

//supervisor -i public,logs,node_modules,views/jade npm run --debug app     // DEV环境
//检查debug node-inspector &  访问：显示url

访问 http://localhost:3000
```
