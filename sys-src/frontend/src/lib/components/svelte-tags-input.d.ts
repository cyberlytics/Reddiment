
declare module 'svelte-tags-input' {
    import {SvelteComponentTyped} from 'svelte';

    export interface TagsProps {
        addKeys?: integer[]
        removeKeys?: integer[]
        allowPase?: boolean
        allowDrop?: boolean
        splitWith?: string
        maxTags?: integer
        onlyUnique?: boolean
        placeholder?: string
        autoComplete?: string[]
        autoCompleteKey?: string
        autoCompleteFilter?: boolean
        onlyAutocomplete?: boolean
        name?: string
        id?: string
        allowBlur?: boolean
        disable?: boolean
        minChars?: integer
        labelText?: string
        labelShow?: boolean
    }
    
    export declare class Tags extends SvelteComponentTyped<TagsProps, {tags: CustomEvent }> {}
}

    //https://github.com/agustinl/svelte-tags-input