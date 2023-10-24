<template>
<div id="container" class="container">
		<input type="hidden" id="sessionId" value="">
		<input type="hidden" id="roomNumber" value="${roomNumber}">
		<input type="hidden" id="userName">
        <div id="chatBoxTop">
            <!--상대방 이름 값-->
            <div class="othersName">
                
                <p class="other-user" @click='viewInfo'> {{otherName}} </p>
            </div>
            
        </div>
        <div id="chatBox" class="chatting">
            <div id="invisibleBox"></div>
		</div>

        <div id="msg-secter">
            <div class="left-add-view">
                <button>+</button>
            </div>
            <div class="middle-box btn-box">
                <input id="chatting" @keypress.enter="send" v-model="message">                
            </div>
            <div class="btn-box">
                <button @click="send" class="btn-send">
                    <img src="../assets/direction.png" width="20" height="20"/>
                </button>
            </div>
        </div>

        
	</div>

</template>


<script>
export default {
    name: 'App',
    data(){ 
    return {
        userName: "",
        message: "",
        recvList: [],
        ws : "",
        mNum : 0,
        otherName : "",
    }
    },
    props: ["userInfo", "matchedUsersList"],
    created(){
        this.wsOpen();
    },
    mounted(){
    window.addEventListener('beforeunload', this.unLoadEvent);
    },

    beforeUnmount() {
    window.removeEventListener('beforeunload', this.unLoadEvent);
    },

    methods : {
        wsOpen(){
            this.mNum = sessionStorage.getItem('mn');
            this.ws = new WebSocket("ws://localhost:8001/chatting/"+this.mNum);
            this.wsEvt();
            // 상단 상대방 이름 표기       
            for(var i=0; i<this.matchedUsersList.length; i++){
                if(this.userInfo[0].summoner_Name != this.matchedUsersList[i]){
                    this.otherName = this.matchedUsersList[i];
                }
            }
        },
        wsEvt() {
            this.ws.onopen = function(data){
                console.log(data);
            }

            this.ws.onmessage = function(data){
                // 메시지를 받으면 동작
                var msg = data.data;
                var sid = sessionStorage.getItem('id');
                var chatBox = document.getElementById("invisibleBox");
                if(msg != null && msg.trim() != ''){
                    var d = JSON.parse(msg);
                    if(d.type == "getId"){
                        var si = d.sessionId != null ? d.sessionId : "";
                        if(si !=''){
                            sid = si;
                        }
                    }else if(d.type == "message"){
                        console.log('세션아이디: ',d.sessionId);
                        if(d.sessionId == sid){
                            chatBox.innerHTML += "<div class='meBox'><p class='me'>  " + d.msg + "</p></div>";
                        }else{
                            chatBox.innerHTML += "<div class='otherBox'><div class='other-name'>"+ this.otherName + "</div><p class='others'>" + d.msg + "</p></div>";
                        }
                    }else{
                        console.warn("unknown type");
                    }
                }
            }
        },
        send(){
            if(this.message == null || this.message == ``){
                alert(`메시지를 입력해주세요`);
                return;
            }
            
            var option = {
                type: "message",
                roomNumber: sessionStorage.getItem('mn'),
                sessionId: sessionStorage.getItem('id'),
                userName: this.otherName,
                msg: this.message,
            }

            this.ws.send(JSON.stringify(option));
            document.getElementById("chatting").value = "";
            this.message = "";
        },

        viewInfo(){
            console.log('상대방의 이름이 눌림');
        }
        
        

    },

    components: {

    }
}
</script>


<style>
html, body{
    width:100%; min-height: 100vh;
}
.container{
    width: 100%;
    height: 100vh;
    margin: 0 auto;
}
.container h1{
    text-align: left;
    padding: 5px 5px 5px 15px;
    color: #FFBB00;
    border-left: 3px solid #FFBB00;
    margin-bottom: 20px;
}
.btn-box{
    display: flex;
    align-items: center;
}
#chatBoxTop{
    width:100%; height:9vh; position:absolute; background: rgba(236, 177, 48, 0.8); z-index: 0; line-height: 5vh;
}

.othersName{
    display:block;
    width:50%;
    white-space: nowrap;
    margin :0 auto;
}

.othersName p {
    font-weight: bold;
}


#invisibleBox{
    width:96%;
    margin:0 auto;
}
.chatting{
    background-color: #fdeccd;
    width: 100vw;
    height: 91vh;
    margin: 0 auto;
    overflow: scroll;
}
.chatting .me{
    color: black;
    float:right;
    text-align: left;
    width:max-content;
    max-width: 100%;
    height: auto;
    background: rgb(174, 216, 255);
    padding:7px;
    border-radius: 10px;
    word-break: break-all;
}
.chatting .others{
    color: black;
    text-align: left;
    width:max-content;
    max-width: 100%;
    height: auto;
    background: rgb(174, 216, 255);
    padding:7px;
    border-radius: 10px;
    word-break: break-all;
}
#chatting{
    width: 100%;
    height: 25px;
    padding:5px;
    border:none;
    border-radius: 8px;
    box-shadow: none;
}

#msg-secter{
    width:100%;
    height: 9vh;
    display: flex;
    justify-content: space-between;
    background-color: rgba(236, 177, 48);
    margin : 0 auto;
    
}


.left-add-view{
    width: 10%;
    height: 100%;
    background-color: rgba(236, 177, 48);
}

.left-add-view button{
    position: relative;
    top:25%;
}

.middle-box{
    width: 80%;
    height:100%;
}

#chatting{
    width:100%;
    background: white;
    padding:6px;
}

.btn-send{
    padding:8px;
    margin-top : 5px;
    margin-bottom : 5px;
    border:none;
    border-radius: 15px;
    background: #fff6de;
}

.meBox{
    width:60%;
    height:auto;
    float:right;
    margin-bottom: -19px;
}

.meBox:first-child{
    margin-top:9vh;
}

.otherBox{
    width:60%;
    height:auto;
    float:left;
    text-align: left;
}

.otherBox:first-child{
    margin-top:9vh;
}

.other-name {
    margin-bottom:-15px;
}

</style>