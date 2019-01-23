export class Description {
    occupation: string;
    interests: Array<string>;
    about: string;
    originCountry: string;
    visitedCountries: Array<string>;
    livedCountries: Array<string>;
    id?: number;

    constructor(description: Partial<Description>) {
        Object.assign(this, description);
    }
}
