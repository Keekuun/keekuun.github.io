<script setup>
import {onMounted } from "vue";

onMounted(async () => {
    if (import.meta.env.SSR) return;

    const { loadOml2d } = await import('oh-my-live2d');
    if (typeof window === 'undefined') return;
    const oml2d = loadOml2d({
        models: [
            {
                name: "HK416", //紫色cos
                path: "https://model.hacxy.cn/HK416-1-normal/model.json",
                position: [0, 60],
                scale: 0.06,
                stageStyle: {
                    height: 340,
                },
                clothesIndex: 0,
            },
            {
                name: "black-cat", //黑猫
                path: "https://model.hacxy.cn/cat-black/model.json",
                scale: 0.15,
                position: [0, 20],
                stageStyle: {
                    height: 350,
                },
                clothesIndex: 1,
            },
            {
                name: "shizuku-pajama", //桌前吃饭
                path: "https://model.hacxy.cn/shizuku_pajama/index.json",
                scale: 0.2,
                volume: 0,
                position: [40, 10],
                stageStyle: {
                    height: 350,
                    width: 330,
                },
            },
            {
                name: "HK416-1-destroy",
                path: "https://raw.githubusercontent.com/iCharlesZ/vscode-live2d-models/master/model-library/girls-frontline/HK416-1/destroy/model.json",
                scale: 0.09,
                volume: 0,
                position: [20, -40],
                stageStyle: {
                    height: 350,
                    width: 330,
                },
            },
            {
                name: "shizuku",
                path: "https://model.hacxy.cn/shizuku/shizuku.model.json",
                scale: 0.2,
                volume: 0,
                position: [70, 70],
                stageStyle: {
                    height: 370,
                    width: 400,
                },
            },
            {
                name: "senko",
                path: "https://model.hacxy.cn/Senko_Normals/senko.model3.json",
                position: [-10, 20],
            },
            {
                name: "pio", //
                path: "https://model.hacxy.cn/Pio/model.json",
                scale: 0.4,
                position: [0, 50],
                stageStyle: {
                    height: 300,
                },
                index: 10,
            },
            {
                name: "iCharlesZ",//白猫
                path: "https://raw.githubusercontent.com/iCharlesZ/vscode-live2d-models/master/model-library/tororo/tororo.model.json",
                scale: 0.15,
                position: [0, 20],
                stageStyle: {
                    height: 350,
                },
                index: 10,
            },
        ],
        dockedPosition: "left", // 停靠位置，left/right/
        initialStatus: "active", // 用于控制组件在浏览器中以当前地址首次访问时的初始状态是否处于睡眠状态或活动状态,
        primaryColor: "#ffbfbc", // 主色调
        sayHello: true, // 是否在初始化阶段打印项目信息
        transitionTime: 5000, // 组件入场和离开的过渡动画时长,单位 ms
        disable: false, // 是否禁用状态条, 为true时将不会创建状态条,默认值: false
        mobileDisplay: false, // 是否在移动设备上显示
        itemStyle: {
            //配置菜单每个子项按钮的样式
            fontSize: "14px", //菜单图标大小
            color: "#5da8ff", //菜单小图标颜色
            // background: "rgba(255, 255, 255, 0.9)", //菜单背景颜色
            transition: "all 0.3s ease", // 过渡动画
            borderRadius: "50%", //菜单背景圆角
            padding: "5px", //菜单背景内边距
            margin: "10px", //菜单背景外边距
            boxShadow: "0 0 10px #646cff", //菜单背景阴影
            border: "1px solid #5da8ff", //菜单背景边框
        },
        menus: {
            items: [
                {
                    id: "Rest",
                    icon: "icon-rest",
                    title: "休息",
                    onClick: (oml2d) => {
                        oml2d.stageSlideOut(); // 滑出舞台
                    }
                },
                {
                    id: 'SwitchModelClothes',
                    icon: 'icon-skin',
                    title: '切换服装',
                    onClick: (oml2d) => {
                        oml2d.loadRandomModel(); // 随机加载模型
                    }
                },
                {
                    id: 'SwitchModel',
                    icon: 'icon-switch',
                    title: '切换模型',
                    onClick: (oml2d) => {
                        oml2d.loadRandomModel(); // 随机加载模型

                    }
                },
                // {
                //     id: 'About',
                //     icon: 'icon-about',
                //     title: '关于',
                //     onClick: () => {
                //         window.open("https://github.com");
                //     }
                // },
                // {
                //     id: "gitee",
                //     icon: "icon-gitee",
                //     title: "gitee",
                //     onClick: () => {
                //         window.open("https://gitee.com");
                //     }
                // },
                {
                    id: "toggleDock",
                    icon: "icon-github",
                    title: "切换停靠",
                    onClick: (oml2d) => {
                        console.log(oml2d);
                        console.log(oml2d.options.dockedPosition);
                    }
                },
            ]
        },

        tips: {
            // 复制网站文字内容时的提示
            copyTips: {
                message: ["复制成功！记得标明出处哦~"], // 提示框内容
                duration: 3000, //提示框持续时间, 单位 ms
                priority: 10, //优先级，值越大，优先级越高
            },
            // 闲置状态下的提示
            idleTips: {
                duration: 5000, //提示框持续时间, 单位 ms
                interval: 10000, //闲置状态循环播放消息的间隔时间, 单位 ms
                message: [
                    "你好呀，我是看板娘~",
                    "欢迎来到我的小世界~",
                    "快来和我一起探索吧~",
                ], // 提示框内容
                priority: 10, //优先级，值越大，优先级越高
                wordTheDay: (wordTheDayData) => {
                    // return wordTheDayData.hitokoto;  // 一言文本
                    return `${wordTheDayData.hitokoto}${wordTheDayData.from}`; // 一言+作者来源
                },
            },
            messageLine: 2, // 提示消息最大显示行数
            // 模型入场后的欢迎提示
            welcomeTips: {
                // 进入网站时的欢迎提示
                duration: 6000,
                priority: 10,
                message: {
                    daybreak: "早上好！一日之计在于晨，美好的一天就要开始了。",
                    morning: "上午好！工作顺利嘛，不要久坐，多起来走动走动哦！",
                    noon: "中午了，工作了一个上午，现在是午餐时间！",
                    afternoon: "午后很容易犯困呢，来杯咖啡吧~",
                    dusk: "傍晚了！工作一天幸苦啦~",
                    night: "晚上好，今天过得怎么样呢？",
                    lateNight: "已经这么晚了呀，早点休息吧，晚安~",
                    weeHours: "这么晚还不睡吗？当心熬夜秃头哦！",
                },
            },
        },

        statusBar: {
            disable: false, // 禁用状态栏
            errorColor: "#ff0000", // 加载状态下的颜色
            loadFailMessage: "模型加载失败", // 加载失败的提示
            loadSuccessMessage: "模型加载成功", // 加载成功的提示
            loadingIcon: "icon-loading", // 加载中的图标
            loadingMessage: "模型加载中", // 加载中的提示
        }, // 模型加载失败后的提示
    });

    // 监听模型加载完成事件
    oml2d.onLoad((status) => {
        switch (status) {
            case 'success':
                console.log('加载成功');
                return;
            case 'fail':
                console.log('加载失败');
                return;
            case 'loading':
                console.log('正在加载中');
                return;
        }
    });

    // 舞台完全滑入事件
    oml2d.onStageSlideIn(() => {
        console.log('模型进入舞台')
        // oml2d.clearTips(); // 清除所有提示消息

        // oml2d.hideModelHitAreaFrames(); // 隐藏显示模型的可点击区域

        // oml2d.loadModelByIndex(0); // 加载模型索引为 0 的模型

        // oml2d.loadModelByName('HK416', 0);// 加载HK416模型和模型衣服索引为 0 的服装

        // oml2d.loadNextModelClothes(); // 加载下一个模型服装

        // oml2d.loadRandomModel(); // 随机加载模型

        // oml2d.reloadModel(); // 重载模型

        // oml2d.setModelAnchor({ x: 0, y: 0 }); // 设置模型锚点

        // oml2d.setModelPosition(0, 60); // 设置模型位置

        // oml2d.setModelRotation(0-360); // 设置模型旋转

        // oml2d.setModelScale(0.06); // 设置模型缩放

        // oml2d.setStageStyle({ width: 340, height: 340, })// 设置舞台大小

        oml2d.setStatusBarClickEvent(() => {  // 绑定状态条点击事件
            oml2d.statusBarPopup('(ฅ´ω`ฅ) 摸摸头', 3000, oml2d.options.primaryColor);
            oml2d.stageSlideIn() //舞台滑入
        });

        oml2d.setStatusBarHoverEvent({
            onIn: () => {
                oml2d.statusBarPopup('发现隐藏彩蛋', 10000, oml2d.options.primaryColor);
            },
            onOut: () => {
                oml2d.statusBarPopup('要常来看我哦', 10000, oml2d.options.primaryColor);
            },
        });

        oml2d.showModelHitAreaFrames(); // 显示显示模型的可点击区域

        // oml2d.stageSlideIn(); // 舞台滑入，不受关闭影响

        // oml2d.stageSlideOut(); // 舞台滑出

        // oml2d.statusBarClearEvents(); // 清除状态条所有已绑定事件

        // 三选一：statusBarOpen和statusBarPopup和statusBarClose，三个方法不能同时使用
        // oml2d.statusBarClose('关闭条状态', 3000, 'pink'); // 关闭条状态

        // oml2d.statusBarOpen('你干嘛', 'pink'); //弹出状态条并保持打开状态

        oml2d.statusBarPopup('人心中的成见是一座大山', oml2d.options.primaryColor); // 使用配置的主色调

        oml2d.stopTipsIdle(); //停止空闲消息播放器

        oml2d.tipsMessage(
            `欢迎访问Jeek's Blog  当前版本:${oml2d.version}`, 5000, 10
        );
    })

    // 舞台完全滑出事件
    oml2d.onStageSlideOut(() => {
        console.log('模型离开舞台')
        oml2d.startTipsIdle(); // 恢复空闲消息播放器
    })


})
</script>

<script>
export default { name: 'oh-my-live2d' }
</script>

<template>
    <div class="oh-my-live2d"></div>
</template>

<style lang="scss" scoped></style>
