# babel-plugin-taro-page-hoc

用于编译时给 Taro 页面包裹自定义高阶组件，实现页面渲染前置逻辑添加

例如登录等异步操作，解决入口组件（app.tsx）不能阻止子元素渲染（this.props.children）问题

```ts
// 例如页面 HomePage
import Taro from '@tarojs/taro';

const HomePage: Taro.FC<HomePageProps> = () => {
  return <div></div>;
};

export default HomePage;

// 应用插件配置
// ["babel-plugin-taro-page-hoc", { "hocSource": "src/hoc" }]
// 输出

⬇️     ⬇️     ⬇️
import __hoc__ from 'src/hoc';
export default __hoc__(HomePage);
```

## 安装

```sh
yarn add -D babel-plugin-taro-page-hoc
```

## 使用

.babelrc

```json
{
  "plugins": [
    [
      "babel-plugin-taro-page-hoc",
      {
        "hocSource": "./src/hoc", // hoc 导入源，必填，为空时不执行转换
        "hocName": "__hoc__" // 自定义 hoc 函数名，默认 __hoc__
      }
    ]
  ]
}
```

## 部分页面排除转换

默认转换所有页面，如果部分页面不需要添加 hoc，可以通过在导出组件上添加注释 `@nohoc`

```ts
// @nohoc
export default HomePage;
```
