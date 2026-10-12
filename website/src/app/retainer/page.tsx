import { ServicePage, serviceMetadata } from '../../components/services/ServicePage';

export const metadata = serviceMetadata('retainer');

export default function Page() {
  return <ServicePage slug="retainer" />;
}
