import { User } from '@models/user.model';
import { Message } from '@models/messenger/message.model';
import { Deal } from '@models/messenger/deal.model';

export class Thread {
    users?: [User];
    messages?: [Message];
    deals?: [Deal];
    id?: string;
    _id?: string;
    constructor(thread: Partial<Thread>) {
        Object.assign(this, thread);
        if (thread._id) {
            this.id = thread._id;
        }
    }
}
