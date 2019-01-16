import { Id } from '@models/id.model';
import { Post } from '@models/post/post.model';
import { Item } from '@models/item.model';
import { MeetingPoint } from '@models/meeting-point.model';

export class Request extends Post {
    items: Array<Item>;
    meetingPoing: MeetingPoint;
    airportPickup: boolean;
    cabinOnly: boolean;
    urgent: boolean;
    id: Id;

    constructor(request: Partial<Request> = {}) {
        super(request);
        Object.assign(this, request);

        this.cabinOnly = this.isCabinOnly();
    }

    isCabinOnly(): boolean {
        let fitsCabin = true;
        this.items.forEach(item => {
            if (!item.cabinOnly) {
                fitsCabin = false;
            }
        });
        return fitsCabin;
    }
}
