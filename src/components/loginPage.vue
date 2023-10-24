<template>

<!-- 로그인 실패 모달창 -->
    <div class="black-bg" v-if="failLoginState == true">
      <div style="backgroun:white"> 로그인 실패 </div>
      <button @click="close">닫기</button>
    </div>

<!-- 로그인 실패 모달창 닫기 -->
    <div id = "login-bg">
      <!-- 기본 창 -->
     <!-- <div style="width:100%; height:1px; margin-bottom : 200px"></div> -->
      <div class="login-box">
        <h1>Login</h1>
          <div class="input-box">
            <input type="text" v-model="id" placeholder="ID" @keypress.enter="login"> <br>
            <input type="password" v-model="pw" placeholder="PW" @keydown.enter="login"> <br>
          </div>
            <button @click="login" class="btn-login">로그인</button>
      </div>
    </div>
</template>


<script>
import axios from 'axios';


export default {
  name: 'App',
  data(){ // 변수는 이 곳에 만든다고 생각하면 됩니다.
    return {
      failLoginState : false,
      id : "",
      pw : "",
      loginData: [
         
      ],
      summonerName: "",
      isLogin: false,
    }
  },

  methods : {
    close(){
      this.failLoginState = false;

    },

    changeMainPage(){
      this.$emit("childEvent", this.loginData);
    },

    login(e){
      e.preventDefault(); 
      if(this.isLogin == false){
        axios.get('http://localhost:8001/api/login', {
          params: {
            id: this.id,
            pw: this.pw,
          },
        }).then( result => {
          const logedSummonerName = result.data.summoner_Name;
          var data = result.data;
          // 로그인 실패 조건
          if(logedSummonerName == null){
              this.failLoginState = true;
              this.isLogin = false;
          }else{
              this.failLoginState = false;
              this.summonerName = logedSummonerName;
              this.loginData.push(data);
              this.getUserTier();
              console.log(result.data);
              sessionStorage.setItem("id",result.data.id);
              sessionStorage.setItem("summonerName: ", );
          }
        }).catch(()=>{
          console.log('실패')
          this.isLogin = false;
        })
      }
      this.isLogin = true;
    },
    getUserTier(){
      axios.get('http://localhost:8001/api/user-tier', {
        params: {
          summonerName : this.summonerName,
        }
      }).then (result =>{
        this.summonerTier = result.data.tier;
        this.loginData.push(result.data);
        this.changeMainPage();
      }).catch(()=>{
        console.log("실패");
      })
    }
  },

  components: {

  }
}
</script>


<style>
body, html{
margin: 0;
width:100%;
height:100%;
}

.btn-login{
  background-color: #ffd599;
  width:88%;
  padding : 5px;
  border-radius: 5px;
  margin:0 auto;
}

.btn-login:hover{
  background-color: #FF5500;
}

#login-bg {         
  background: #FFA500;
  color: white;
  width:100%;
  height : 100vh;
}

.login-box{
  width: 80%;
  height:350px;
  margin :0 auto;
  background: rgba(0,0,0,0.8);
  padding-top: 50px;
  border-radius: 10px;
  display: inline-block;
  position: relative;
  top:25%;

}


div{
  box-sizing: border-box;
}

.black-bg {
  background: rgba(0,0,0,0.5);
  width: 100%;
  height:100%;
}

.input-box{
  width: 100%;
  height: 87px;
}

.input-box input{
  border-radius: 5px;
  padding :10px;
  width : 80%;
}
</style>
