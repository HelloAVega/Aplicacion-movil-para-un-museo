import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroTag}>Universidad Simón Bolívar · Ingeniería de Sistemas &amp; IA</div>
        <Heading as="h1" className="hero__title">
          Museo Interactivo
        </Heading>
        <p className="hero__subtitle">
          Galería digital donde estudiantes y visitantes suben sus obras, las comparten y exploran el arte del Caribe colombiano.
        </p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/docs/intro">
            📖 Ver Documentación
          </Link>
          <Link className="button button--secondary button--lg" href="https://museo.aprojects.dev" target="_blank">
            🎨 Abrir la App →
          </Link>
        </div>
        <div className={styles.techStack}>
          {['Node.js', 'Express', 'SQLite3', 'Docker', 'TensorFlow.js', 'Teachable Machine'].map(t => (
            <span key={t} className={styles.techBadge}>{t}</span>
          ))}
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Inicio"
      description="Documentación del Museo Interactivo — aplicación web para galerías digitales escolares">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
