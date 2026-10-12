import { ServicePage, serviceMetadata } from '../../components/services/ServicePage';

export const metadata = serviceMetadata('build');

export default function Page() {
  return <ServicePage slug="build" />;
}
