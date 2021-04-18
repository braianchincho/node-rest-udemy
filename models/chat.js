class Message {
    constructor(uid, name, message) {
        this.uid = uid;
        this.name = name;
        this.message = message;
    }
}

class Chat {
    constructor() {
        this.messages = [];
        // id -> {String} value -> User
        this.users = new Map();
    }

    get usersArray() {
        return Array.from(this.users.values());
    }

    lastMessages(n = 10) {
        return this.messages.slice(0, n);
    }

    sendMessage(id, user, message) {
       this.messages.unshift(new Message(id, user, message));
    }

    connectUser(user) {
        this.users.set(user.id, user);
    }

    disconnectUser(user) {
        this.users.delete(user.id);
    }
}

module.exports = Chat;
