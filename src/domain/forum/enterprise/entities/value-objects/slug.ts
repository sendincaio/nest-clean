export class Slug {
    public value: string

    private constructor(value: string) {
        this.value = value
    }

    static create(slug: string) {
        return new Slug(slug)
    }

    static createSlug(text: string) {
        const slugText = text
            .normalize('NFKD')
            .toLowerCase()
            .trim()
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')

        return new Slug(slugText)
    }
}
