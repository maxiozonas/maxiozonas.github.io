import SplitText from './reactbits/SplitText';
const entrance = { opacity: 0, y: 24, filter: 'blur(10px)' };
const rest = { opacity: 1, y: 0, filter: 'blur(0px)' };
export default function HeroTitle() {
  return <h1 id="hero-title" className="hero-title font-bold tracking-tighter">
    <span className="sr-only">Máximo Ozonas</span>
    <span aria-hidden="true" className="hero-name-lines"><SplitText text="Máximo" tag="span" className="hero-line" textAlign="left" splitType="chars" delay={35} from={entrance} to={rest} rootMargin="0px" duration={.85}/><SplitText text="Ozonas." tag="span" className="hero-line hero-surname" textAlign="left" splitType="chars" delay={45} from={entrance} to={rest} rootMargin="0px" duration={1}/></span>
  </h1>;
}
