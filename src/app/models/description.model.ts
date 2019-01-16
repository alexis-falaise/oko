import { Id } from '@models/id.model';

export class Description {
    occupation: string;
    interests: Array<string>;
    about: string;
    originCountry: string;
    visitedCountries: Array<string>;
    livedCountries: Array<string>;
    id: Id;

    constructor(description: Partial<Description>) {
        Object.assign(this, description);
    }
}
