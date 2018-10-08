(function () {
    // Initialize Firebase
    const config = {
        apiKey: "AIzaSyBpvSVoaitmp5_j_a7FiM7HvZR3WBo0ZPQ",
        authDomain: "new-tu-open-house.firebaseapp.com",
        databaseURL: "https://new-tu-open-house.firebaseio.com",
        projectId: "new-tu-open-house",
        storageBucket: "new-tu-open-house.appspot.com",
        messagingSenderId: "928873448229",
    }
    firebase.initializeApp(config)
    // Get uid and show the chat
    getRealTimeUid()

}())

let momentShow

// Receive uid from image processing team
function getRealTimeUid(){
  const dbRefObject = firebase.database().ref().child('selectImg')
  // Sync object changes
  dbRefObject.on('value', snap => {
      let data = snap.val()
      clearTimeout(momentShow)
      momentShow = setTimeout(chat(data.uid),1)
  })
}

// Get realtime data from firebase and filter
function chat(uid){

    // const preObject = document.getElementById('object')

    // Create references
    const dbRefObject = firebase.database().ref().child('chats').child(uid)

    // Sync object changes
    dbRefObject.on('value', snap => {
        let data = snap.val()
        // preObject.innerHTML = JSON.stringify(data,null,3)

        let chatMessage = filterChat(data)[0]
        let chatTime = filterChat(data)[1]

        // Show the Chatbox
        showChatBox(chatMessage,chatTime)

        // preObject.innerHTML = JSON.stringify(filterChat(data)[2],null,3)

        // Set always to the bottom of page
        window.scrollTo(0,document.body.scrollHeight)
    })

}

// Create timestamp when open this page
let DateTimeNow = Date.now()

function filterChat(data){

    // Create container to contain data after filter
    let newData = {}

    // Filter the data for get data after present
    Object.keys(data).forEach(function (key) {
        let tempTime = data[key].timestamp

        if (tempTime > DateTimeNow) {
            newData[key] = data[key]

            // Filter the bad word

        }
    })

    // Filter to only message and time & format the time
    let chatMessage = []
    let chatTime = []
    Object.keys(newData).forEach(function(key){
        chatMessage = []
        chatTime = []
        chatMessage.push(newData[key].message)
        chatTime.push(timeConverter(newData[key].timestamp))
    })

    // Return the outcome
    return [chatMessage,chatTime,newData]
}

let index = 0

// Show the Chatbox function
function showChatBox(chatMessage,chatTime){

    chatMessage.forEach(function(element,i){
        if(index%2==0){
            createUserChatBox(chatMessage[i],chatTime[i])
            index++;
        } else {
            createBotChatBox(chatMessage[i],chatTime[i])
            index++;
        }
    })
}

// Create time format from timestamp
function timeConverter(timestamp) {
    let min = ''
    if(new Date(timestamp).getMinutes()<10){
        min = String("0"+new Date(timestamp).getMinutes())
    } else {
        min = String(new Date(timestamp).getMinutes())
    }
    let timeFormat = new Date(timestamp).getHours()+":"+min
    return timeFormat;
}

// Create chat box element of user
function createUserChatBox(message,time){

    // Create chatbox element to contain message and time
    let chatBox = document.createElement('div')
    chatBox.setAttribute('style','clear:right;')

    // Create message box element
    let messageBox = document.createElement('div')
    messageBox.className = 'userMessageBox'
    messageBox.innerHTML = message

    // Create time box element
    let timeBox = document.createElement('div')
    timeBox.className = 'timeBox'
    timeBox.style.marginLeft = '20px'
    timeBox.innerHTML = time

    // Append to chatBox and append chatBox to body
    chatBox.appendChild(messageBox)
    chatBox.appendChild(timeBox)
    document.getElementsByTagName('body')[0].appendChild(chatBox)
}

// Create chat box element of bot
function createBotChatBox(message,time){

    // Create chatbox element to contain message and time
    let chatBox = document.createElement('div')
    chatBox.setAttribute('style','float:right')

    // Create message box element
    let messageBox = document.createElement('div')
    messageBox.className = 'botMessageBox'
    messageBox.innerHTML = message

    // Create time box element
    let timeBox = document.createElement('div')
    timeBox.className = 'timeBox'
    timeBox.style.marginRight = '20px'
    timeBox.innerHTML = time

    // Append to chatBox and append chatBox to body
    chatBox.appendChild(timeBox)
    chatBox.appendChild(messageBox)
    document.getElementsByTagName('body')[0].appendChild(chatBox)
}
