import SplitText from './reactbits/SplitText';
const entrance = { opacity: 0, y: 28 };
const rest = { opacity: 1, y: 0 };
export default function HeroTitle() {
  return <h1 id="hero-title" className="hero-title font-bold tracking-tighter">
    <span className="sr-only">Máximo Ozonas</span>
    <span aria-hidden="true"><SplitText text="Máximo Ozonas." tag="span" className="hero-line" textAlign="left" splitType="words" delay={110} from={entrance} to={rest} rootMargin="0px" duration={.9}/></span>
  </h1>;
}
