import { Type } from "@angular/core";

export interface IExample {
    id: string;
    title: string;
    description?: string;
    component: Type<unknown>;
}