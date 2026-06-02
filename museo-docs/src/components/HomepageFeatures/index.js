import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    emoji: '📸',
    title: 'Subida de Obras',
    description: 'Los usuarios capturan o cargan imágenes directamente desde su cámara o galería. Cada obra incluye nombre, descripción y autor, que se persiste en SQLite.',
  },
  {
    emoji: '🖼️',
    title: 'Galería Interactiva',
    description: 'Vista dividida entre "mis imágenes" e "imágenes de otros usuarios", con visor ampliado, corazones persistentes y diseño mobile-first.',
  },
  {
    emoji: '🤖',
    title: 'Modelo de Pose con IA',
    description: 'Integra un modelo Teachable Machine entrenado para detectar tres posturas corporales: De pie, Sentado y Acostado, usando TensorFlow.js en el navegador.',
  },
  {
    emoji: '🗄️',
    title: 'Persistencia con SQLite',
    description: 'Todas las obras, usuarios y corazones se guardan en una base de datos SQLite. Los datos sobreviven reinicios del contenedor gracias a volúmenes Docker.',
  },
  {
    emoji: '🐳',
    title: 'Despliegue con Docker',
    description: 'La app se despliega con un único comando. El Dockerfile y docker-compose están listos para producción local y para Azure Container Apps.',
  },
  {
    emoji: '🌙',
    title: 'Modo Claro y Oscuro',
    description: 'La interfaz soporta tema claro y oscuro togglable, con CSS variables coherentes en toda la app. La preferencia se mantiene entre sesiones.',
  },
];

function Feature({ emoji, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.featureCard}>
        <div className={styles.featureEmoji}>{emoji}</div>
        <div className={styles.featureBody}>
          <Heading as="h3">{title}</Heading>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>¿Qué incluye el proyecto?</h2>
          <p className={styles.sectionSubtitle}>Una aplicación completa de galería digital con backend, base de datos e inteligencia artificial.</p>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
