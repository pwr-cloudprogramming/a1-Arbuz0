const url = `${window.location.protocol}//${window.location.hostname}:8080`;

let stompClient;
let gameId;
let playerType;

function connectToSocket(gameId) {
    console.log("connecting to the game");
    const idToken = localStorage.getItem('idToken');
    const socket = new SockJS(`${url}/gameplay`);
    stompClient = Stomp.over(socket);
    stompClient.connect({Authorization: `Bearer ${idToken}`}, function (frame) {
        console.log("connected to the frame: " + frame);
        stompClient.subscribe("/topic/game-progress/" + gameId, function (response) {
            let data = JSON.parse(response.body);
            console.log(data);
            displayResponse(data);
        });
    }, function (error) {
        console.log('STOMP error: ' + error);
    });
}

function create_game() {
    let login = document.getElementById("login").value;
    if (login == null || login === '') {
        alert("Please enter login");
    } else {
        const idToken = localStorage.getItem('idToken');
        $.ajax({
            url: url + "/game/start",
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + idToken // Add Bearer prefix
            },
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                "login": login
            }),
            success: function (data) {
                gameId = data.gameId;
                playerType = 'X';
                reset();
                connectToSocket(gameId);
                alert("You created a game. Game id is: " + data.gameId);
                gameOn = true;
            },
            error: function (error) {
                console.log(error);
            }
        });
    }
}

function connectToRandom() {
    let login = document.getElementById("login").value;
    if (login == null || login === '') {
        alert("Please enter login");
    } else {
        const idToken = localStorage.getItem('idToken');
        $.ajax({
            url: url + "/game/connect/random",
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + idToken // Add Bearer prefix
            },
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                "login": login
            }),
            success: function (data) {
                gameId = data.gameId;
                playerType = 'O';
                reset();
                connectToSocket(gameId);
                alert("Congrats you're playing with: " + data.player1.login);
            },
            error: function (error) {
                console.log(error);
            }
        });
    }
}

function connectToSpecificGame() {
    let login = document.getElementById("login").value;
    if (login == null || login === '') {
        alert("Please enter login");
    } else {
        let gameId = document.getElementById("game_id").value;
        if (gameId == null || gameId === '') {
            alert("Please enter game id");
        } else {
            const idToken = localStorage.getItem('idToken');
            $.ajax({
                url: url + "/game/connect",
                type: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + idToken // Add Bearer prefix
                },
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({
                    "player": {
                        "login": login
                    },
                    "gameId": gameId
                }),
                success: function (data) {
                    gameId = data.gameId;
                    playerType = 'O';
                    reset();
                    connectToSocket(gameId);
                    alert("Congrats you're playing with: " + data.player1.login);
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
    }
}
