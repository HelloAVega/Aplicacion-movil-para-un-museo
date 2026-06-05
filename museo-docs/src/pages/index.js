import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/intro">
            Ver documentación
          </Link>
          <Link
            className={clsx('button button--outline button--secondary button--lg', styles.secondButton)}
            to="/guias/instalacion">
            Instalar la app
          </Link>
          <a
            className="button button--play button--lg"
            href="https://museo.aprojects.dev"
            target="_blank"
            rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M8 5v14l11-7z"/></svg>
            Probar app
          </a>
          <a
            className="button button--github button--lg"
            href="https://github.com/HelloAVega/Aplicacion-movil-para-un-museo"
            target="_blank"
            rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 0c-6.626 0-12 5.371-12 12 0 5.302 3.438 9.8 8.205 11.385.599.111.82-.254.82-.567 0-.285-.01-1.022-.015-2.003-3.338.716-4.033-1.609-4.033-1.609-.546-1.385-1.335-1.754-1.335-1.754-1.087-.743.108-.729.108-.729 1.205.108 1.834 1.789 1.834 1.789 1.07 1.789 2.807 1.259 3.495.926.108-.775.414-1.259.751-1.549-2.651-.298-5.466-1.298-5.466-5.935 0-1.27.452-2.286 1.183-3.02-.118-.298-.502-1.438.116-3.02 0 0 .969-.302 3.17 1.225a11 11 0 012.885-.387c.97.004 1.945.128 2.885.387 2.203-1.528 3.168-1.225 3.168-1.225.62 1.581.239 2.72.117 3.02.737.735 1.185 1.75.118 3.02 0 4.645-2.813 5.637-5.485 5.926.425.356.815 1.088.815 2.184 0 .918-.315 1.775-.815 2.184 0 .315.21.68.825.567C20.568 21.8 24 17.302 24 12c0-6.629-5.371-12-12-12z"/></svg>
            Repositorio
          </a>
          <Link
            className="button button--azure button--lg"
            to="/guias/azure">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2L1 7v10l11 5 11-5V7L12 2zm0 2.2L21 8v8L12 19.8 3 16V8l9-2.8zM12 7l-8 3.5v2L12 15l8-4.5v-2L12 7z"/></svg>
            Despliegue Azure
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
      description="Documentación del Museo Interactivo — galería digital para estudiantes y visitantes del MAMB.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
