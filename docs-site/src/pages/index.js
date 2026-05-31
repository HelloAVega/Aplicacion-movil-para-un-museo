import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const quickLinks = [
  {
    title: 'Puesta en marcha',
    description: 'Requisitos e instalación para comenzar rápido.',
    to: '/docs/getting-started/requirements',
  },
  {
    title: 'Guía de usuario',
    description: 'Registro, subida de obras y navegación en la galería.',
    to: '/docs/user-guide/overview',
  },
  {
    title: 'Guía técnica',
    description: 'Estructura del proyecto, arquitectura y estilos.',
    to: '/docs/dev-guide/architecture',
  },
  {
    title: 'API REST',
    description: 'Endpoints disponibles y payloads principales.',
    to: '/docs/api/endpoints',
  },
  {
    title: 'Despliegue',
    description: 'Docker, hosting y publicación de la documentación.',
    to: '/docs/deployment/hosting',
  },
  {
    title: 'Troubleshooting',
    description: 'Soluciones rápidas a problemas comunes.',
    to: '/docs/troubleshooting',
  },
];

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className={clsx('container', styles.heroContent)}>
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.heroButtons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Empezar
          </Link>
          <Link className="button button--outline button--lg" to="/docs/api/endpoints">
            Ver API
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Guía completa de instalación, uso, arquitectura y despliegue.">
      <HomepageHeader />
      <main>
        <section className={styles.quickLinks}>
          <div className="container">
            <Heading as="h2" className={styles.sectionTitle}>
              Accesos rápidos
            </Heading>
            <div className={styles.cardGrid}>
              {quickLinks.map(link => (
                <Link key={link.title} to={link.to} className={clsx('card', styles.card)}>
                  <div className="card__body">
                    <Heading as="h3" className={styles.cardTitle}>
                      {link.title}
                    </Heading>
                    <p className={styles.cardDescription}>{link.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
