import { User } from '@models/user.model';
import { Message } from '@models/messenger/message.model';
import { Proposal } from '@models/post/proposal.model';
import { Moment } from 'moment';

export class Thread {
    /** Front-end properties */
    author: User;
    contact: User;
    lastMessage: Message;
    /** Common properties */
    users?: Array<User>;
    messages?: Array<Message>;
    proposals?: Array<Proposal>;
    creationDate: Moment;
    id?: string;
    _id?: string;
    constructor(thread: Partial<Thread>, user?: User) {
        Object.assign(this, thread);
        if (thread._id) {
            this.id = thread._id;
        }
        if (thread.users) {
            this.users = thread.users.map(threadUser => new User(threadUser));
        }
        if (user && this.users && this.users.length === 2) {
            this.author = new User(user);
            this.contact = this.users.find(contact => contact.id !== user.id);
        }
        if (thread.messages && thread.messages.length) {
            this.messages = thread.messages.map(message => new Message(message, user));
            this.lastMessage = this.messages[thread.messages.length - 1];
        }
    }

    pushMessage(message: Message) {
        this.messages.push(message);
        this.lastMessage = message;
    }


}
