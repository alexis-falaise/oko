import { Post } from '@models/post/post.model';
import { Item } from '@models/item.model';
import { MeetingPoint } from '@models/meeting-point.model';
import { Location } from '@models/location.model';

export class Request extends Post {
    items: Array<Item>;
    location: Location;
    meetingPoint?: MeetingPoint;
    airportPickup?: boolean;
    cabinOnly?: boolean;
    urgent?: boolean;

    constructor(request: Partial<Request> = {}) {
        super(request);
        Object.assign(this, request);
        if (request.items) {
            this.items = request.items.map(item => new Item(item));
        }
        if (request.meetingPoint) {
            this.meetingPoint = new MeetingPoint(request.meetingPoint);
        }
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
