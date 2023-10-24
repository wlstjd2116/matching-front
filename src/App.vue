<template>
  <div v-if="pageState == 'loginPage'">
    <loginPage @childEvent="changeMainPage"/>
  </div>
  <div v-if="pageState == 'mainPage'">
    <mainPage @logoutEvent="chagneLoginPage" @chatEvent="changeChatPage" @userList="sendUserList" v-bind:userInfo="userInfo"/>
  </div>
  <div v-if="pageState == 'chatPage'">
    <chattView @chatEvent="changeChatPage" @userList="sendUserList" v-bind:userInfo="userInfo" v-bind:matchedUsersList="matchedUsersList"/>
  </div>
</template>

<script>
//import axios from 'axios';
import loginPage from './components/loginPage.vue';
import mainPage from './components/mainPage.vue';
import chattView from './components/chattView.vue';

export default {
  name: 'App',
  data(){ // 변수는 이 곳에 만든다고 생각하면 됩니다.
    return {
      menus : ['Home', 'MatchingStart', 'About'],
      matched : 0, 
      loginModalState : false,
      id : "",
      pw : "",
      pageState: "loginPage",
      userInfo : "",
      roomNumber : 0,
      matchedUsersList : "",
    }
  },

  methods : {
    changeMainPage(data){
      this.pageState = "mainPage";
      this.userInfo = data;
    },
    chagneLoginPage(){
      this.pageState = "loginPage";
    },
    changeChatPage(data){
      this.pageState = "chatPage"; 
      this.roomNumber += 1;
      this.userList = data;
    },

    sendUserList(data){
      console.log('sendUserList : ', data);
      this.matchedUsersList = data;
    },
  },

  components: { loginPage, mainPage, chattView}
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.menu{
  background-color: darkslateblue;
  padding: 15px;
  border-radius: 5px;
}

.menu a{
  color : white;
  padding : 10px;
}

body{
  margin: 0;
}
div{
  box-sizing: border-box;
}
.black-bg{
  width: 100%; height: 100%; background: rgba(0,0,0,0.5); position: fixed; padding: 20px;
}
.white-bg{
  width:100%; background: white; border-radius: 8px; padding: 20px;
}
</style>
