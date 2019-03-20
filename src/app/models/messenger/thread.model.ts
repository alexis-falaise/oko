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
        if (user && thread.users && thread.users.length === 2) {
            this.author = user;
            this.contact = thread.users.find(contact => contact.id !== user.id);
        }
        if (thread.messages && thread.messages.length) {
            this.lastMessage = thread.messages[thread.messages.length - 1];
        }
    }


}
