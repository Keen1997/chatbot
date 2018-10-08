(function(){

    // Initialize Firebase
    const config = {
      apiKey: "AIzaSyBpvSVoaitmp5_j_a7FiM7HvZR3WBo0ZPQ",
      authDomain: "new-tu-open-house.firebaseapp.com",
      databaseURL: "https://new-tu-open-house.firebaseio.com",
      projectId: "new-tu-open-house",
      storageBucket: "new-tu-open-house.appspot.com",
      messagingSenderId: "928873448229"
    };
    firebase.initializeApp(config)

    // Get elements
    const preObject = document.getElementById('object')

    // Create references
    const dbRefObject = firebase.database().ref().child('chats')

    // Create now time to filter the chat in order get data after present
    let now = Date.now();

    // Sync object changes
    dbRefObject.on('value', snap => {
        // Filter the data for get data after present
        let oldData = snap.val()
        let newData = {}
        let imgData = {}

        // Filter the data for get only image
        Object.keys(oldData).forEach(function(key){
            Object.keys(oldData[key]).forEach(function(subKey){
                let typeOfChat = oldData[key][subKey].type;
                if(typeOfChat == 'image'){
                    imgData[key] = oldData[key][subKey]
                }
            })
        })

        // Filter the data for get only after present time
        Object.keys(imgData).forEach(function(key){
            let tempTime = imgData[key].timestamp
            if(tempTime>now){
                newData[key] = imgData[key].url;
            }
        })

        preObject.innerHTML = "";

        // Show image and uid
        Object.keys(newData).forEach(function(key){
          // let span = document.createElement("span")
          // span.innerHTML = key+ ': <br>'
          let imgElement = document.createElement("img")
          imgElement.src = newData[key]
          imgElement.setAttribute('style', 'height:250px;');
          let radioBtn = document.createElement("input")
          radioBtn.setAttribute('type', 'radio');
          radioBtn.setAttribute('name', 'uid');
          radioBtn.setAttribute('value', key);
          radioBtn.setAttribute('style', 'transform: scale(2); margin-left:20px;');
          let br = document.createElement("br")
          preObject.append(imgElement)
          preObject.append(radioBtn)
          preObject.append(br)
          preObject.append(br)
          preObject.append(br)
          preObject.append(br)
        })

        // preObject.innerText = JSON.stringify(newData,null,3)
    })

}())

// Send uid function to chatbot display
function sendUid() {
  let uid = document.querySelector('input[name="uid"]:checked').value;
  if (uid==''){
    alert('Please select your uid')
  } else {
    alert(uid)
    const dbRefObject = firebase.database().ref().child('selectImg').set({
      uid: uid
    })
  }

}
