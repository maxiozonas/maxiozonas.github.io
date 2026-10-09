import SplitText from './reactbits/SplitText';
const entrance = { opacity: 0, y: 100, rotationX: -35 };
const rest = { opacity: 1, y: 0, rotationX: 0 };
export default function HeroTitle({ locale }: { locale: 'es' | 'en' }) {
  return <h1 id="hero-title" className="hero-title mx-auto max-w-6xl font-bold tracking-tighter">
    <span className="sr-only">{locale === 'es' ? 'Software con intención.' : 'Software with intention.'}</span>
    <span aria-hidden="true">
    <SplitText text={locale === 'es' ? 'Software con' : 'Software with'} tag="span" className="hero-line" splitType="words" delay={90} from={entrance} to={rest} rootMargin="0px" duration={1.1} />
    <SplitText text={locale === 'es' ? 'intención.' : 'intention.'} tag="span" className="hero-line text-brand" splitType="chars" delay={35} from={entrance} to={rest} rootMargin="0px" duration={1.3} />
    </span>
  </h1>;
}
