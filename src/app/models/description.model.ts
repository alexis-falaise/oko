export class Description {
    occupation: string;
    interests: Array<string>;
    about: string;
    originCountry: string;
    visitedCountries: Array<string>;
    livedCountries: Array<string>;
    id?: string;

    constructor(description: Partial<Description> = {}) {
        this.occupation = null;
        this.about = null;
        this.originCountry = null;
        Object.assign(this, description);
    }
}
