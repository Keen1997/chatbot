(function(){

    // Initialize Firebase
    const config = {
        apiKey: "AIzaSyAd9cZR8gT4oKo4yRVSNdck1xHYVwk4Qsc",
        authDomain: "tu-open-house.firebaseapp.com",
        databaseURL: "https://tu-open-house.firebaseio.com",
        projectId: "tu-open-house",
        storageBucket: "tu-open-house.appspot.com",
        messagingSenderId: "1077997533032",
    };
    firebase.initializeApp(config);

    // Get elements
    const preObject = document.getElementById('object');

    // Create references
    const dbRefObject = firebase.database().ref().child('chats');

    // Create now time to filter the chat in order get data after present
    let now = Date.now();

    // Sync object changes
    dbRefObject.on('value', snap => {
        // Filter the data for get data after present
        let oldData = snap.val();
        let newData = {};
        let imgData = {};

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
                newData[key] = imgData[key];
            } 
        })
        
        // Show data after filter
        preObject.innerText = JSON.stringify(newData,null,3)
    });
    
}());