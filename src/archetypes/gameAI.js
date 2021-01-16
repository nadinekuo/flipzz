const Game = require("./gameHandler");
const GameHandler = require("./gameHandler");
const { log, warn } = new (require("./logger"))({ prefix: "[AIGame]", color: "\x1b[32m" });

function GameAI() { 

    // Prototype design pattern allows inheritance between GameHandler and GameAI!
        // gameHandler methods are re-used, but modified.

    GameHandler.call(this, true)

    //server adds itself as 2nd player
    this.addPlayer = (connection) => {
        log(`Starting in singleplayer mode with ${connection.id}`);
        GameHandler.prototype.addPlayer.call(this, { id: GameAI.aID });
        GameHandler.prototype.addPlayer.call(this, connection);
        this.player = { id: connection.id };
        this.ai = +(this.light.id === GameAI.aID);
        if (this.turn === this.ai) this.act();
        return true;
    };

// calls act 
    this.handle = (/** @type {number} */ id, data) => {
        if (id !== this.player.id) return;
        if (this.turn !== +!this.ai) return;

        const result = GameHandler.prototype.handle.call(this, id, data);
        return result ? (this.act(), true) : false;
    };

    // only sends ws message to player if it's the player
    this._send = (/** @type {number} */ clr, payload) => {
        if ([this.dark, this.light][clr]?.id === GameAI.aID) return;
        if (clr === 2) { if (this.player) clr = +!this.ai; else return; }
        GameHandler.prototype._send.call(this, clr, payload); 
    };

    // places a bot after a valid move of the player
    this.act = async () => {
        if (this.status !== 1) return;
        setTimeout(() => {
            const possibilities = this.board.canPlace(this.ai);
            const pos = possibilities[Math.floor(Math.random() * possibilities.length)];        // pick a random position
            GameHandler.prototype.handle.call(this, GameAI.aID, { position: pos.id });
        }, ((Math.random() * 1.5) + .5)*1000);
    };
};

GameAI.aID = 2557;


module.exports = GameAI;