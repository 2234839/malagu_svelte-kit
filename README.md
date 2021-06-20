# malagu 与 svelte-kit 结合

[体验地址](http://malagusveltekit.shenzilong.cn)

## 原理

1. 在 <./svelte-kit/svelte.config.js> 中添加 adapter 将代码和资源 copy 到 <./malagu/.malagu/frontend>
2. 在 <./malagu/src/middleware.ts> 中 require 第一步生成的在服务端运行的 js (因为这个原因 <./svelte-kit> 中所有在实际运行时 import 的 npm 包也需要在 <./malagu> 中安装一份)
    1. <./malagu/src/middleware.ts> 会将所有过来的请求先交 svelte-kit 若 其返回 404 则再交给 malagu 处理

