import { ServicePage, serviceMetadata } from '../../components/services/ServicePage';

export const metadata = serviceMetadata('audit');

export default function Page() {
  return <ServicePage slug="audit" />;
}
