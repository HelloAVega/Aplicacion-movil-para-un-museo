import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Galería interactiva',
    image: require('@site/static/img/galeria.png').default,
    description: (
      <>
        Los estudiantes suben sus obras, exploran la galería del museo y
        pueden dar corazones a las piezas de otros visitantes.
      </>
    ),
  },
  {
    title: 'API REST documentada',
    image: require('@site/static/img/Node.js_logo.png').default,
    description: (
      <>
        Backend en Node.js + Express con SQLite. Consulta la referencia
        completa de endpoints para usuarios, imágenes y corazones.
      </>
    ),
  },
  {
    title: 'Listo para desplegar',
    image: require('@site/static/img/Docker_logo.png').default,
    description: (
      <>
        Incluye Docker Compose y guías para Azure. Despliega la aplicación
        con persistencia de datos en pocos pasos.
      </>
    ),
  },
];

function Feature({image, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.imageContainer}>
        <img
          src={image}
          className={styles.featureImage}
          alt={title}
        />
      </div>

      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
