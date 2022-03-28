import { DjangoRequestMaker } from './DjangoRequestMaker';
import { IRequestMaker } from './IRequestMaker';

type RequestMakerFactory = () => IRequestMaker;

// !!! this is main point of this folder
// when we will get the real backend, we will simply make another requestMaker
// and change this method only
// so it is not as painful
const getRequestMaker: RequestMakerFactory = () => DjangoRequestMaker;

export { getRequestMaker };
