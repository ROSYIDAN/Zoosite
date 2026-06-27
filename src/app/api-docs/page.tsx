import { getApiDocs } from '@/lib/swagger';
import ReactSwaggerWrapper from './ReactSwaggerWrapper';

export const metadata = {
  title: 'API Documentation - ZooSite',
};

export default async function IndexPage() {
  const spec = await getApiDocs();
  return (
    <section className="container bg-white pb-10 pt-10 px-8 mx-auto mt-10 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4 text-center">ZooSite OpenAPI Visualizer</h1>
      <ReactSwaggerWrapper spec={spec} />
    </section>
  );
}
