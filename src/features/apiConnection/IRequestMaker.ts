import { AnimalKind } from '../animalKind/animaKindSlice';
import { User } from '../auth/userSlice';
import { Color } from '../colors/colorSlice';
import { SpecificAnimalKind } from '../specificAnimalKind/specificAnimalKindSlice';
import { Animal } from '../animal/animalSlice';

// TODO: maybe handle errors from server? (so returns will look something like "Promise<string | ErrorType>")
// It could also throw some error
// up to discussion
//
// Interface handling connection between backend and frontend.
// All requests should be routed through this, so we can simply exchange this object in factory
// when the actual backend comes.
interface IRequestMaker {
    getToken: (username: string, password: string) => Promise<string | null>;
    getUser: (token: string) => Promise<User | null>;
    getColors: (token: string) => Promise<Color[] | null>;
    getAnimalKinds: (token: string) => Promise<AnimalKind[] | null>;
    getSpecificAnimalKinds: (
        token: string
    ) => Promise<SpecificAnimalKind[] | null>;
    getCharacters: (token: string) => Promise<Character[] | null>;
    getNextAnimalForTinderLikeChoose: (token: string) => Promise<Animal | null>;
}

export type { IRequestMaker };
