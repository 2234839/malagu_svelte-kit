# malagu 与 svelte-kit 结合

[体验地址](http://malagusveltekit.shenzilong.cn)

使用 malagu 适配云平台来运行 svelteKit 的 ssr 示例项目 https://github.com/2234839/malagu_svelte-kit

## 启动

使用 npm 或 yarn 应该也可以正常启动

```bash
cd ./svelte-kit
pnpm i
pnpm run build

cd ../malagu/
pnpm i
pnpm run start

```

## 原理

1. 在 <./svelte-kit/svelte.config.js> 中添加 adapter 将代码和资源 copy 到 <./malagu/.malagu/frontend>
2. 在 <./malagu/src/middleware.ts> 中 require 第一步生成的在服务端运行的 js (因为这个原因 <./svelte-kit> 中所有在实际运行时 import 的 npm 包也需要在 <./malagu> 中安装一份)
    1. <./malagu/src/middleware.ts> 会将所有过来的请求先交给  svelte-kit 若其返回 404 则再交给 malagu 处理

