import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Animal {
    id: number;
    name: string;
    characters: number[];
    colors: number[];
    specific_animal_kind: number;
}
