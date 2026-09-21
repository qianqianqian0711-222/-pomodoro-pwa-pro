# 番茄专注 Pro — Magic8 Android APK 项目

这是当前 Magic8 V6 网页版的 Android WebView 封装项目。

## 在 Android Studio 生成 APK
1. 用 Android Studio 打开本目录。
2. 等待 Gradle 同步。
3. Build → Build Bundle(s) / APK(s) → Build APK(s)。
4. APK 输出：app/build/outputs/apk/debug/app-debug.apk

目标：Android 6.0+，竖屏，targetSdk 35。针对荣耀 Magic8 的 100dvh / safe-area 手机布局已保留。

注意：当前环境没有 Android SDK/Gradle，因此这里不能可靠地伪造一个可安装 APK。该目录是可直接导入 Android Studio 的完整工程。
