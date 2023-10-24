import { createWebHistory, createRouter } from "vue-router";
import loginPage from "@/components/loginPage"
import mainPage from "@/components/mainPage"
// import chatPage from "@/components/chattView"

const router = createRouter({
    history : createWebHistory(),
    routes : [
        { path : "/", name: "loginPage", component: loginPage},
        { path : "/main", name : "mainPage", component: mainPage},
        // { path : "/chat", name : "chatPage", component: chatPage},
    ]
});

export default router;