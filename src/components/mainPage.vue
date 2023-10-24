<template>
<div class="menu">
    <a>Home</a>
    <a>Community</a>
    <a @click="changeLoginPage">LogOut</a>                                                                                                                                                                                                                                                                                                                                                                                                                                  
  </div>
<div>
  <h4>Lol Duo Matching System</h4>
  <p>This service provide some convenience UX for enjoying duo rank</p>
  <p>Summoner Name : {{ this.userInfo[0].summoner_Name }} </p>
  <p>Summoner Tier : <br>
  {{ this.userInfo[1].tier }}
 <br>{{ this.userInfo[1].rank }} </p>

 <p>matchingTier : {{ this.userInfo[1].matchingTier }}</p>

  <button @click="matchingStart" v-if="matchingStatus == false">매칭 시작 </button>
  <button @click="matchingEnd" v-if="matchingStatus == true">매칭 종료 </button>
  {{ this.userInfo }}
  
</div>
</template>

<script>
import axios from 'axios';

export default {
name: 'App',
data(){ // 변수는 이 곳에 만든다고 생각하면 됩니다.
  return {
    menus : ['Home', 'MatchingStart', 'LogOut'],
    matched : 0, 
    loginModalState : false,
    id : "",
    pw : "",
    userNum: "",
    matchingStatus : false,
    matchingComple : false,
    a : setInterval(this.getUsers, 1000),
    summonerList: "",
  }
},
props: ["userInfo", "matchedUsersList"],

methods : {
    changeLoginPage(){
        this.$emit("logoutEvent");
    },
    changeChatPage(){
        this.$emit("chatEvent", this.userInfo);
    },
    sendUsersList(){
      this.$emit("userList", this.summonerList);
    },
    matchingEnd(){
        axios.get('http://localhost:8001/api/match-off', {
            params: {
                userNum : this.userInfo[0].u_Num
            }
        }).then(
            this.matchingStatus = false
        )
    },
    async getUsers() {
      if(this.matchingStatus == true){
        if(this.matchingComple == false){
          axios.get('http://localhost:8001/api/call-matching', {
          }).then((result)=>{
            console.log(result);
            var userList = result.data.userList;
            var userNames = result.data.userNameList;
            this.summonerList = userNames;
            for(var i=0; i<userList.length; i++){
              var userNum = this.userInfo[0].u_Num
              if(userList[i].user1 == userNum || userList[i].user2 == userNum){
                this.changeChatPage();
                this.sendUsersList();
                sessionStorage.setItem('mn', userList[i].m_num);
                this.matchingComple = true;
              }
            }
          })
        }else {
          console.log(sessionStorage.getItem('mn'));
          axios.post('http://localhost:8001/api/match-complete', null, {params: {
            matchingNumber : sessionStorage.getItem('mn'),
          }})
          .then((result)=>{
            console.log('stop', result)
            clearInterval(this.a);
          });
        }
      }
    },

    // 매칭 시작, 매칭된 상대가 있으면 DB에서 값 가져옴
    matchingStart(){
        axios.get('http://localhost:8001/api/match-on', {
        params: {
          userNum : this.userInfo[0].u_Num,
          matchTier : this.userInfo[1].matchingTier
        }
      }).then((result)=>{
        this.summonserList = result.data;

        if(this.matchingStatus == false){
          this.matchingStatus = true;
          this.matchingComple = false;
        }else {
          this.matchingStatus = false;
        }

      })
      .catch(()=>{
        console.log("실패");
      })
    },

    // 연결 끊기면 매칭 out 
    unLoadEvent(){
      this.matchingEnd();   
    },
},

mounted(){
  this.a;
  window.addEventListener('beforeunload', this.unLoadEvent);
  
},

beforeUnmount() {
    window.removeEventListener('beforeunload', this.unLoadEvent);
},

components: {

}
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
