const Messages = {
    INIT_GAME: {
        type: "init_game",
        payload: {
            player1: null,
            player2: null,
        },
    },
    MOVE: {
        type: "move",
        payload: {
            player: null,
            move: null,
        },
    },
    GAME_OVER: {
        type: "game_over",
        payload: {
            winner: null
        }
    }
};

export default Messages;